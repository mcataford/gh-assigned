export interface AssignedIssueNode {
    number: number
    title: string
    author: {
        login: string
    }
    publishedAt: string
    reviewDecision: string
    updatedAt: string
    createdAt: string
    url: string
    repository: {
        name: string
    }
}

export interface AssignedIssue {
    number: number
    title: string
    author: string
    publishedAt: Date
    updatedAt: Date
    createdAt: Date
    reviewDecision: string
    repository: string
    url: string
}
export interface State {
    selected: number
    lookup: Map<number, AssignedIssue>
    visible: number[]
    query: string
}

export interface CliArgs {
    queryType: 'issues' | 'review-requests'
}

export type AssignedIssueByRepoMap = Map<string, Array<AssignedIssue>>
