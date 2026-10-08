---
name: site-help
description: Explains, in plain words and in the reader's language (English, Spanish or Catalan), how to ask for changes to the website and what happens next — the commands, the preview, the test address, going live, design mode — for content managers and writers. Use for "how does this work?", "what can I ask you?", "¿cómo funciona?", "ajuda", "com funciona?".
---

Answer in the language the person wrote in. The guide is `docs/content-managers.md` (English),
`docs/content-managers.es.md` (Spanish) and `docs/content-managers.ca.md` (Catalan): read the matching one
(English for any other language, then answer in theirs) and summarise it in under 200 words, then offer the
link to the guide (as a path in the repository) and the list of commands with one line each:

| Command | What it does |
| --- | --- |
| `/new-page` | a new page, or a page brought over from the live site |
| `/edit-page` | a change to an existing page |
| `/translate` | the same page in another language |
| `/design` | work on the look on a design canvas, compare options |
| `/publish` | put an approved preview live |
| `/status` | where every page is right now |
| `/site-help` | this explanation |

Plain words only: no blocks, code, branches, PRs or scripts. If they then ask for something about a page,
hand over to the `page` skill.
