import { colorScale } from '../color-formatters.js'
import { InvalidResponse, pathParams } from '../index.js'
import { LiberapayBase } from './liberapay-base.js'

export default class LiberapayGoal extends LiberapayBase {
  static route = this.buildRoute('goal')

  static openApi = {
    '/liberapay/goal/{entity}': {
      get: {
        summary: 'Liberapay goal progress',
        parameters: pathParams({
          name: 'entity',
          example: 'Changaco',
        }),
      },
    },
  }

  static render({ percentAchieved }) {
    return {
      label: 'goal progress',
      message: `${percentAchieved}%`,
      color: colorScale([0, 10, 100])(percentAchieved),
    }
  }

  transform({ goal, receiving }) {
    if (!goal) {
      throw new InvalidResponse({ prettyMessage: 'no public goals' })
    }

    if (!receiving) {
      return { percentAchieved: 0 }
    }

    const percentAchieved = Math.round((receiving.amount / goal.amount) * 100)

    return { percentAchieved }
  }

  async handle({ entity }) {
    const { goal, receiving } = await this.fetch({ entity })
    const { percentAchieved } = this.transform({ goal, receiving })
    return this.constructor.render({ percentAchieved })
  }
}
