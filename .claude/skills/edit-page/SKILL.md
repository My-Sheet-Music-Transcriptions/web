---
name: edit-page
description: Change something on an existing page of the website — a sentence, a picture, a price, a section, the order of sections. Name the page by its title or address and say what changes; the rest stays as it is. Shows the change in a preview before it is built or published. Also for "cambiar", "modificar", "editar la página", "canviar", "modificar la pàgina".
argument-hint: "<page title or URL> [what changes]"
disable-model-invocation: true
---

Invoke the `page` skill with the Skill tool (`page`) and run it in mode **edit**.

Request as typed: $ARGUMENTS

- Find the page in `src/content` (title, slug or URL; `pnpm page:status` and `src/content/paths.generated.json`
  help). A page that only exists on the live WordPress site is a port: switch to mode **new**.
- Generate the mockup from the real page first (`pnpm ds:mockup <slug>`, see the skill's `reference/edit.md`);
  never rewrite the page from memory.
- Change only what was asked; everything else stays byte for byte.
