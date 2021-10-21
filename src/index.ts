import ghAssigned from './ghAssigned'
import type { CliArgs } from './types'

function parseCli(): CliArgs {
    const cliArgs = process.argv.slice(2)

    const queryType = cliArgs.length > 0 ? cliArgs[0] : 'issues'

    if (!['issues', 'review-requests'].includes(queryType))
        throw new Error(
            'Invalid item type. Must be one of issues, review-requests',
        )

    return { queryType: queryType as 'issues' | 'review-requests' }
}

ghAssigned({ cli: parseCli() }).catch((e) => {
    console.error(e)
})
