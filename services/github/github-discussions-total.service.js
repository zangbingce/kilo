import gql from 'graphql-tag'
import Joi from 'joi'
import { pathParams } from '../index.js'
import { nonNegativeInteger } from '../validators.js'
import { GithubAuthV4Service } from './github-auth-service.js'
import { transformErrors } from './github-helpers.js'

const schema = Joi.object({
  data: Joi.object({
    repository: Joi.object({
      discussions: Joi.object({
        totalCount: nonNegativeInteger,
      }).required(),
    }).required(),
  }).required(),
}).required()

export default class GithubTotalDiscussions extends GithubAuthV4Service {
  static category = 'other'
  static route = {
    base: 'github/discussions',
    pattern: ':user/:repo',
  }

  static openApi = {
    '/github/discussions/{user}/{repo}': {
      get: {
        summary: 'GitHub Discussions',
        parameters: pathParams(
          {
            name: 'user',
            example: 'vercel',
          },
          {
            name: 'repo',
            example: 'next.js',
          },
        ),
      },
    },
  }

  static defaultBadgeData = { label: 'discussions', color: 'blue' }

  static render({ discussions }) {
    return { message: discussions }
  }

  async fetch({ user, repo }) {
    return this._requestGraphql({
      query: gql`
        query ($user: String!, $repo: String!) {
          repository(name: $repo, owner: $user) {
            discussions {
              totalCount
            }
          }
        }
      `,
      variables: { user, repo },
      schema,
      options: { headers: { 'GraphQL-Features': 'discussions_api' } },
      transformErrors,
    })
  }

  async handle({ user, repo }) {
    const json = await this.fetch({ user, repo })
    const {
      data: {
        repository: {
          discussions: { totalCount },
        },
      },
    } = json
    return this.constructor.render({ discussions: `${totalCount} total` })
  }
}
