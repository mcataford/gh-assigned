import getReviewRequests from './core/getReviewRequests'
import createPrompt from './core/createPrompt'

function getQueryFilter(queryType: string) {
    if (queryType === 'issues') return 'assignee'
    else if (queryType === 'review-requests') return 'review-requested'
}

export default async function ghAssigned({
    cli,
}: {
    cli: { queryType: string }
}) {
    process.stdout.write('Loading!')
    const requestsByRepo = await getReviewRequests({
        queryFilter: getQueryFilter(cli.queryType),
    })
    createPrompt({ items: requestsByRepo })
}
