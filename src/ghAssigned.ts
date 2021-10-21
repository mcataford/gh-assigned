import getReviewRequests from './core/getReviewRequests'
import createPrompt from './core/createPrompt'
import type { QueryType } from './types'

function getQueryFilter(queryType: QueryType) {
    if (queryType === 'issues') return 'assignee'
    else if (queryType === 'review-requests') return 'review-requested'

    throw new Error('Invalid query filter')
}

export default async function ghAssigned({
    cli,
}: {
    cli: { queryType: QueryType }
}) {
    process.stdout.write('Loading!')
    const requestsByRepo = await getReviewRequests(
        getQueryFilter(cli.queryType),
    )
    createPrompt({ items: requestsByRepo })
}
