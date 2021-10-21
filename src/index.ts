import util from 'util'
import { exec as execOriginal } from 'child_process'

import { graphql as octokitGraphql } from '@octokit/graphql'

import type {
    AssignedIssue,
    AssignedIssueByRepoMap,
    AssignedIssueNode,
} from './types'
import createPrompt from './cli'

const exec = util.promisify(execOriginal)
async function getClient(): Promise<any> {
    const { stderr } = await exec('gh auth status -t')
    const tokenMatch = stderr.match(/Token: (?<token>[a-zA-Z0-9_]+)/)
    const token = tokenMatch?.groups?.token

    if (!token) {
        // Oops.
        console.error()
    }

    return octokitGraphql.defaults({
        headers: { authorization: `token ${token}` },
    })
}

async function getReviewRequests(): Promise<AssignedIssueByRepoMap> {
    const client = await getClient()

    const result = await client(`{
     search(query: "is:open is:pr assignee:@me", type: ISSUE, first: 100) {
        edges {
          node {
            ... on PullRequest {
              number
              title
              author {
                login
              }
              publishedAt
              reviewDecision
              updatedAt
              createdAt
              url
              repository {
                  name
              }
            }
          }
        }
      }
    }`)

    const reviewRequests = result.search.edges

    const requestsByRepo: AssignedIssueByRepoMap = new Map()

    function flattenAssignedIssueNode(
        assignedNode: AssignedIssueNode,
    ): AssignedIssue {
        const {
            number,
            title,
            publishedAt,
            reviewDecision,
            updatedAt,
            createdAt,
            url,
            repository,
            author,
        } = assignedNode

        return {
            number,
            title,
            publishedAt: new Date(publishedAt),
            reviewDecision,
            updatedAt: new Date(updatedAt),
            createdAt: new Date(createdAt),
            url,
            repository: repository.name,
            author: author.login,
        }
    }

    for (const { node } of reviewRequests) {
        const normalizedNode = flattenAssignedIssueNode(node)

        if (requestsByRepo.has(normalizedNode.repository))
            requestsByRepo.get(normalizedNode.repository)?.push(normalizedNode)
        else requestsByRepo.set(normalizedNode.repository, [normalizedNode])
    }

    return requestsByRepo
}

async function doTheThing() {
    process.stdout.write('Loading!')
    const requestsByRepo = await getReviewRequests()
    createPrompt({ items: requestsByRepo })
}

doTheThing()
