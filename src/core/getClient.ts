import util from 'util'
import { exec as execOriginal } from 'child_process'

import { graphql as octokitGraphql } from '@octokit/graphql'

const exec = util.promisify(execOriginal)

export default async function getClient(): Promise<any> {
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
