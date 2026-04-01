---
name: commit
description: Stage and commit all current changes with a descriptive commit message derived from the diff
---

Commit all modified files in the working directory with a meaningful commit message.

Steps:

1. Run `git status` to see modified, staged, and **untracked** files.
   - If there are untracked files, list them explicitly to the user and ask whether any should be included before proceeding. Do not silently skip them.
   - If there is nothing to commit, say so and stop.

2. Run `git diff` (both staged and unstaged) to understand what changed.

3. Run `git log --oneline -5` to read the five most recent commit messages and match the established style and tone of this repo.

4. Analyse the diff to determine the nature of the changes:
   - What feature, fix, or improvement was made?
   - Which files were affected and why?
   - Is this a new feature, a bug fix, a correction, a refactor, or a polish/UX change?

5. Write a commit message following these rules:
   - **Title line:** imperative tense, max 72 characters, no full stop. Lead with the *what and why*, not just the file names. Match the style and tone of the existing commits observed in step 3. Examples:
     - `Add sourdough starter support to leavener toggle`
     - `Fix flour formula — remove starter from dough weight denominator`
     - `Clamp fermentation inputs to min/max on blur`
   - **Body (optional):** if the change is non-trivial, add a short bullet list below the title (blank line separator) summarising the key points. Keep each bullet to one line.
   - End the message with a blank line then: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

6. Stage all modified tracked files. If untracked files were confirmed for inclusion in step 1, stage those too.

7. Commit using the message composed in step 5. Pass the message via heredoc to avoid shell escaping issues.

8. Run `git status` after committing to confirm the working tree is clean.

9. If the changes include a new feature, a bug fix, or any meaningful product change, remind the user to run `/update-design-doc` to keep the design document in sync.

Do not push. Do not amend existing commits.
