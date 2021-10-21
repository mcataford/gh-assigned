import readline from 'readline'

import chalk from 'chalk'
import open from 'open'

import type { AssignedIssue, AssignedIssueByRepoMap, State } from './types'

function render(
    lineInterface: any,
    items: AssignedIssueByRepoMap,
    state: State,
): void {
    const lines: string[] = []

    for (const [repo, requests] of items.entries()) {
        lines.push(`📦 ${chalk.bold(repo)}`)

        for (const issue of requests) {
            const prefix = state.selected === issue.number ? '>' : ' '
            lines.push(
                `${prefix} #${issue.number} ${issue.title} (${issue.author})`,
            )
        }
    }

    if (!lineInterface.closed) {
        lineInterface.setPrompt('> ')
        const cursorPosition = lineInterface.getCursorPos()
        readline.moveCursor(
            lineInterface.output,
            -cursorPosition.cols,
            -cursorPosition.rows,
        )
        readline.clearScreenDown(lineInterface.output)
        lineInterface.prompt(true)
        lineInterface.output.write(`\n${lines.join('\n')}`)
        readline.moveCursor(
            lineInterface.output,
            -lines[lines.length - 1].length,
            -lines.length,
        )
        readline.moveCursor(
            lineInterface.output,
            cursorPosition.cols,
            cursorPosition.rows,
        )
    }
}

export default async function createPrompt({
    items,
}: {
    items: any
}): Promise<string> {
    const lineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
    })

    const lookup = new Map<number, AssignedIssue>()
    let defaultSelection = 0

    for (const [_, issues] of items.entries()) {
        for (const issue of issues) {
            if (!defaultSelection) defaultSelection = issue.number

            lookup.set(issue.number, issue)
        }
    }

    const state: State = {
        selected: defaultSelection,
        lookup: lookup,
        visible: [...lookup.keys()],
        query: ''
    }

    render(lineInterface, items, state)

    return new Promise((resolve) => {
        const done = (finalValue: string) => {
            lineInterface.close()
            resolve(finalValue)
        }

        process.stdin.on('keypress', async (input: any, event: any) => {
            const cursorPosition = lineInterface.getCursorPos()
            const currentSelection = state.lookup.get(state.selected)
            
            if (event.name === 'return' && currentSelection) {
                if (state.query === 'exit')
                    process.exit(0)
                await open(currentSelection.url)
            } else if (event.name === 'down') {
                state.selected =
                    state.visible[
                        (state.visible.indexOf(state.selected) + 1) %
                            state.visible.length
                    ]
            } else if (event.name === 'up') {
                state.selected =
                    state.visible[
                        (state.visible.indexOf(state.selected) - 1) %
                            state.visible.length
                    ]
            } else if (event.name.match(/^\w$/)) {
                state.query += event.name
            } else if (event.name === 'backspace') {
                state.query = state.query.substring(0, Math.max(state.query.length - 1, 0))
            }

            readline.moveCursor(
                process.stdout,
                cursorPosition.cols,
                cursorPosition.rows,
            )

            render(lineInterface, items, state)
        })
    })
}
