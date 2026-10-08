---
name: translate
description: Translate an existing page of the website into another of the site's languages (English, Spanish, Catalan, French, German, Japanese). Shows the translated page in a preview; explains what the other-language site can show today. Also for "traducir", "traduir", "versión en español", "versió en català".
argument-hint: "<page title or URL> <language>"
disable-model-invocation: true
---

Invoke the `page` skill with the Skill tool (`page`) and run it in mode **translate**.

Request as typed: $ARGUMENTS

- Follow the skill's `reference/translate.md`, and tell the person up front what the target language's site
  can show today (the page itself translated; menu and footer still English until that language is
  scaffolded) before building anything.
- Ask for the target language if it is missing; the source is the page named (English unless they say so).
