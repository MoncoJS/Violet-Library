# Publishing

Releases are automated with [Changesets](https://github.com/changesets/changesets) and GitHub Actions. All public packages are **fixed** (released with the same version).

## Day to day

1. Make a change on a branch.
2. Run `bun changeset`, pick the bump (patch/minor/major) and write a user-facing summary. Commit the generated `.changeset/*.md`.
3. Open a PR — `ci.yml` runs lint, typecheck, tests (with coverage), library build and Storybook build.

## Release

On every push to `main`, `release.yml` runs `changesets/action`:

- **Pending changesets** → it opens/updates a **“Version Packages”** PR (`bun run version-packages`: bumps versions, writes CHANGELOGs, refreshes the lockfile).
- **Merging that PR** → the next run executes `bun run release`:
  1. `turbo build` for every package.
  2. `scripts/publish.ts`, for each public package whose version isn't on the registry yet:
     - rewrites `workspace:*` ranges to the exact sibling versions,
     - `npm publish --provenance --access public` (signed provenance via GitHub OIDC),
     - restores `package.json`.
  3. `changeset tag` creates git tags; the action pushes them and creates GitHub Releases.

## Setup (once)

- Create an npm **automation** token with publish rights to the `@violet-ui` scope and `violet-ui`; save as repo secret `NPM_TOKEN`.
- Repository → Settings → Actions → _Allow GitHub Actions to create and approve pull requests_.

## Pre-releases

```sh
bun changeset pre enter next   # versions become x.y.z-next.N, published under the `next` dist-tag
bun changeset pre exit
```

## Manual / emergency publish

```sh
bun install --frozen-lockfile
NPM_TOKEN=… bun run release        # skips versions already on the registry
```

Use `bun scripts/publish.ts --dry-run` to see what would be published.
