import type {
    AssignedIssue,
    AssignedIssueByRepoMap,
    AssignedIssueNode,
} from '../types'

import getClient from './getClient'

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

export default async function getReviewRequests(
    queryFilter: string,
): Promise<AssignedIssueByRepoMap> {
    const client = await getClient()

    const result = await client(`{
     search(query: "is:open is:pr ${queryFilter}:@me", type: ISSUE, first: 100) {
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

    for (const { node } of reviewRequests) {
        const normalizedNode = flattenAssignedIssueNode(node)

        if (requestsByRepo.has(normalizedNode.repository))
            requestsByRepo.get(normalizedNode.repository)?.push(normalizedNode)
        else requestsByRepo.set(normalizedNode.repository, [normalizedNode])
    }

    return requestsByRepo
}
