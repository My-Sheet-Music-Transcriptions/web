---
name: design
description: Work on the look of a page on a design canvas instead of a plain preview — explore a layout, compare two or three options side by side, move things around, retype hand-drawn sections — before anything is built. For a whole new page or one section of an existing page. Also for "diseño", "disseny", "maqueta", "mockup", "quiero ver opciones", "vull veure opcions".
argument-hint: "<page or idea> [number of options]"
disable-model-invocation: true
---

Invoke the `page` skill with the Skill tool (`page`) and run it in mode **design**.

Request as typed: $ARGUMENTS

- The preview surface is the Design canvas (the skill's `reference/design-mode.md`): one desktop and one phone
  artboard per option, the real blocks rendered live, a sticky with the sections.
- An existing page starts from `pnpm ds:mockup <slug>` (`reference/edit.md`); a new one from the usual
  mockup recipe (`reference/preview.md`). Options are extra `sections.<variant>.html` files.
- When they are done or have chosen, pull the canvas back into the mockup and continue to the publish
  question as usual. Never publish unasked.
