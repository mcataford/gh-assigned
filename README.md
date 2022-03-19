# gh-assigned

`gh-assigned` is a `gh` CLI extension that makes checking up on assigned issues without leaving the terminal easier.

## Installation

`gh extension install mcataford/gh-assigned` will install the extension.

Once installed, simply `gh assigned` to view your assigned issues!

*Note*: the extension requires `zsh`.

## Usage

From the help menu (available under `gh assigned`):
```
    gh assigned - a quick utility to keep up with review requests.

    USAGE:

    gh assigned ls
        Lists all review requests and assigned issues for the current user across all repositories.
    gh assigned open <repository> <issue_number>
        Opens the given issue from the chosen repository in the browser.
```
