# gh-assigned

`gh-assigned` is a `gh` CLI extension that makes checking up on assigned issues without leaving the terminal easier.

## Deprecation

This project is now deprecated and, for all intents and purposes, abandoned. The initial intent behind fiddling with this
was to find a way to manage reviews without needing to exit the terminal, something that
[gh-dash](https://github.com/dlvhdr/gh-dash) does very well. As such, I recommend that folks just use/contribute to `gh-dash`.

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
