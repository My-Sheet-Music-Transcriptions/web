# motion-dev: Motion's official skill, vendored

- **Source:** the `content/skills/motion/` folder of the npm package
  [`motion-ai`](https://www.npmjs.com/package/motion-ai) 14.1.0, published on 2026-08-26 from
  [motiondivision/ai-kit](https://github.com/motiondivision/ai-kit).
- **Author:** Matt Perry ([motion.dev](https://motion.dev)).
- **Licence:** MIT, as declared in the package's `package.json`. Neither the package nor the repository ships a
  licence file.

## Changes from the original

The guides are copied unchanged. Only `SKILL.md` was edited:

- **Folder and `name`:** renamed from `motion` to `motion-dev`. This repository's `motion` skill holds its own
  conventions and keeps that name.
- **Description:** made a single line, as `tests/unit/skills.test.ts` reads frontmatter one line at a time. It
  now also says what this repository lacks and that `motion` comes first.
- **Note:** added a note above the original body.

## What was left out

- **The installer (`npx motion-ai`):** not run.
- **Motion's two hosted MCP servers:** `https://mcp.motion.dev` (free docs search and CSS easing generation) and
  `https://mcp.motion.dev/plus` (Motion+: example source, MotionScore audits, the transition editor). Without
  them, the skill falls back to `best-practices/`.
- **The `motion-reviewer` agent:** it grades with a method served only by the Motion+ server.
- **The Cursor rule (`rules/motion.mdc`).**

To use the free docs search, a person adds the MCP server to their own Claude Code
(`claude mcp add --transport http motion https://mcp.motion.dev`). It is not configured in the repository.

## Updating

```sh
npm pack motion-ai@<version>   # in an empty scratch folder
tar -xzf motion-ai-<version>.tgz
# replace the guides here with package/content/skills/motion/*, then redo the SKILL.md edits above
```

Then read the diff, update the version in this file and in the `SKILL.md` note, and check that the `motion`
skill still agrees with it.
