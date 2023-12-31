import { pathParams } from '../index.js'
import { BaseVaadinDirectoryService } from './vaadin-directory-base.js'

export default class VaadinDirectoryStatus extends BaseVaadinDirectoryService {
  static category = 'other'

  static route = {
    base: 'vaadin-directory/status',
    pattern: ':packageName',
  }

  static openApi = {
    '/vaadin-directory/status/{packageName}': {
      get: {
        summary: 'Vaadin Directory Status',
        parameters: pathParams({
          name: 'packageName',
          example: 'vaadinvaadin-grid',
        }),
      },
    },
  }

  static defaultBadgeData = {
    label: 'vaadin directory',
  }

  static render({ status }) {
    if (status.toLowerCase() === 'published') {
      return { message: 'published', color: '#00b4f0' }
    }
    return { message: 'unpublished' }
  }

  async handle({ packageName }) {
    const { status } = await this.fetch({ packageName })
    return this.constructor.render({ status })
  }
}
