import { Generator, getConfig } from '@tanstack/router-generator'

/** Writes src/routeTree.gen.ts without starting Vite (used before `tsc` in CI). */
const root = process.cwd()
const config = getConfig(
  { routesDirectory: 'src/routes', generatedRouteTree: 'src/routeTree.gen.ts', target: 'react' },
  root,
)
await new Generator({ config, root }).run()
console.log('routeTree.gen.ts written')
