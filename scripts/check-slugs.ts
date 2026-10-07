import { checkSlugs } from './lib/content-fs'

const problems = checkSlugs()
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log('slugs ok')
