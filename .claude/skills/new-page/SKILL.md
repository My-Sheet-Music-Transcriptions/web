---
name: new-page
description: Start a new page for the website (a landing page, a service page, an information page) or bring a page over from the live site. Plain words are enough — "a page about choir arrangements for the Spanish site" — in any language. Shows a preview you can comment on before anything is built or published. Also for "nueva página", "pàgina nova", "crear una página", "portar la página X".
argument-hint: "[page name or live-site URL] [language]"
disable-model-invocation: true
---

Invoke the `page` skill with the Skill tool (`page`) and run it in mode **new**.

Request as typed: $ARGUMENTS

- A live-site URL in the request means: bring that page over with its copy and pictures (the skill's
  `reference/wordpress.md`), keeping its address.
- No language named: ask which site, with the English site as the recommended default.
- Nothing else named: go straight to Phase 1's questions (which page, what for, what goes on it).
