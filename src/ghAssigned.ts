import getReviewRequests from './core/getReviewRequests'
import createPrompt from './core/createPrompt'

export default async function ghAssigned() {
    process.stdout.write('Loading!')
    const requestsByRepo = await getReviewRequests()
    createPrompt({ items: requestsByRepo })
}
