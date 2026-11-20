#!/usr/bin/env bun
/**
 * Publishes every public workspace package whose current version is not on npm yet.
 * - rewrites `workspace:*` ranges to exact sibling versions, then restores package.json
 * - `npm publish --provenance --access public` (provenance only in CI)
 *
 * Usage: bun scripts/publish.ts [--dry-run] [--tag next]
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

interface Pkg {
  name: string
  version: string
  private?: boolean
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const tagIndex = args.indexOf('--tag')
const explicitTag = tagIndex >= 0 ? args[tagIndex + 1] : undefined

const root = join(import.meta.dirname, '..', 'packages')
const dirs = readdirSync(root)
  .map((d) => join(root, d))
  .filter((d) => existsSync(join(d, 'package.json')))
const pkgs = dirs.map((dir) => ({
  dir,
  raw: readFileSync(join(dir, 'package.json'), 'utf8'),
  json: JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as Pkg,
}))
const versions = new Map(pkgs.map((p) => [p.json.name, p.json.version]))

function isPublished(name: string, version: string): boolean {
  try {
    execFileSync('npm', ['view', `${name}@${version}`, 'version'], { stdio: 'pipe', shell: true })
    return true
  } catch {
    return false
  }
}

function resolveWorkspaceRanges(deps?: Record<string, string>) {
  if (!deps) return
  for (const [dep, range] of Object.entries(deps)) {
    if (!range.startsWith('workspace:')) continue
    const v = versions.get(dep)
    if (!v) throw new Error(`Unknown workspace dependency ${dep}`)
    const spec = range.slice('workspace:'.length)
    deps[dep] = spec === '*' ? v : spec === '^' || spec === '~' ? `${spec}${v}` : spec
  }
}

let failures = 0
for (const { dir, raw, json } of pkgs) {
  if (json.private) continue
  const id = `${json.name}@${json.version}`
  if (isPublished(json.name, json.version)) {
    console.log(`skip  ${id} (already on npm)`)
    continue
  }
  if (!existsSync(join(dir, 'dist'))) {
    console.error(`error ${id}: dist/ missing — run \`bun run build\` first`)
    failures++
    continue
  }
  const tag = explicitTag ?? (json.version.includes('-') ? 'next' : 'latest')
  resolveWorkspaceRanges(json.dependencies)
  resolveWorkspaceRanges(json.peerDependencies)
  writeFileSync(join(dir, 'package.json'), `${JSON.stringify(json, null, 2)}\n`)
  try {
    const npmArgs = ['publish', '--access', 'public', '--tag', tag]
    if (process.env.CI) npmArgs.push('--provenance')
    if (dryRun) npmArgs.push('--dry-run')
    console.log(`${dryRun ? 'dry   ' : 'pub   '}${id} [${tag}]`)
    execFileSync('npm', npmArgs, { cwd: dir, stdio: 'inherit', shell: true })
  } catch {
    failures++
  } finally {
    writeFileSync(join(dir, 'package.json'), raw)
  }
}

process.exit(failures ? 1 : 0)
