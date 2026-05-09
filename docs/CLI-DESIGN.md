# `ventix` CLI — Design Specification

> Phase 0 Epic-6 deliverable. Per ADR-0009: oclif 4, TypeScript, single-binary distribution. Lives in `tools/ventix-cli`.

## One-Sentence Mission

**Plugin authors interact with VENTIX through one command.** Everything they need — scaffolding, dev loop, validation, build, sign, publish — is reachable from `ventix <verb>`.

## Command Surface (Phase 0 — green commands implemented in Sprint 3)

| Command | Phase | Purpose |
|---|---|---|
| 🟢 `ventix create plugin --id <id>` | P0 | Scaffold a new plugin from template |
| 🟢 `ventix dev` | P0 | Build + serve the plugin against the local shell |
| 🟢 `ventix validate` | P0 | Validate `ventix.plugin.json` against RFC-0001 schema |
| 🟢 `ventix build` | P0 | Production MF bundle + manifest emission |
| 🟢 `ventix doctor` | P0 | Environment + version checks |
| 🟡 `ventix sign --key <cosign>` | P2 | Sign the bundle with cosign |
| 🟡 `ventix publish --registry <url>` | P2 | Upload to marketplace |
| 🟡 `ventix tenant create/list/migrate` | P1 | Tenant management against backend |
| 🟡 `ventix events tail --topic <t>` | P1 | Debug the event bus |
| 🟡 `ventix migrate` | P1 | Apply codemods on SDK major bumps |

## Phase 0 Command Specifications

### `ventix create plugin`

```
USAGE
  $ ventix create plugin --id <reverse-dns> [--name <display>] [--vendor <name>] [--license <spdx>]

ARGS
  --id        Required. Reverse-DNS plugin ID (e.g. com.acme.crm-plus).
              Validated against /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/
  --name      Display name. Defaults to last segment of --id, title-cased.
  --vendor    Vendor name. Defaults to git user.name.
  --license   SPDX identifier. Default: MIT.

EFFECTS
  Creates libs/plugins/<short-name>/ following the init-ventix skill rules.
  Validates the generated manifest against RFC-0001.
  Updates root tsconfig.base.json paths if needed.
  Prints next-step commands.

EXIT CODES
  0  success
  2  validation failed (invalid id, manifest schema mismatch)
  3  collision (plugin already exists)
```

### `ventix dev`

```
USAGE
  $ ventix dev [--plugin <id>] [--shell-port 4200] [--host-port 4300]

BEHAVIOR
  1. If --plugin omitted, auto-detects from cwd's ventix.plugin.json.
  2. Starts the static plugin host on --host-port.
  3. Builds the plugin in watch mode; outputs to plugin-host directory.
  4. Writes the dev registry entry (apps/shell/public/registry.json).
  5. Tails build output; rebuilds on file change.
  6. The shell auto-detects new manifests and activates the plugin
     (no shell restart — ADR-0002, ADR-0008).

ASSUMPTIONS
  Shell is running separately via `nx serve shell` or `pnpm dev`.
  Phase 0: HMR for plugin code is best-effort. Sprint 3 stretch goal.
```

### `ventix validate`

```
USAGE
  $ ventix validate [path]

BEHAVIOR
  Default path: ./ventix.plugin.json
  Loads the file, parses against RFC-0001 Zod schema.
  Prints structured errors with line/column when possible.
  Cross-checks: manifest.id, manifest.version match definePlugin() in source.

EXIT CODES
  0  manifest valid
  2  schema violations
  3  cross-check failed (manifest/source mismatch)
```

### `ventix build`

```
USAGE
  $ ventix build [--plugin <id>] [--out <dir>]

BEHAVIOR
  Production Module Federation build:
    - emits remoteEntry.js to <out>/<plugin-id>/
    - emits ventix.plugin.json next to it
    - computes SRI hash, writes into manifest.frontend.integrity
    - validates final manifest against RFC-0001
    - enforces SDK_VERSION compatibility

EXIT CODES
  0  success
  2  build failure
  3  manifest invalid post-build
  4  SDK version mismatch with engine.ventix
```

### `ventix doctor`

```
USAGE
  $ ventix doctor

CHECKS
  ✓ Node ≥ 22
  ✓ pnpm ≥ 9
  ✓ Workspace root has package.json with VENTIX markers
  ✓ @ventix/plugin-api version satisfies engine.ventix in nearby manifests
  ✓ Nx tags graph has no scope:plugin → scope:kernel violations
  ✓ All ventix.plugin.json files validate against RFC-0001

OUTPUT
  Color-coded checklist. Non-zero exit if any check fails.
```

## Project Layout (`tools/ventix-cli/`)

```
tools/ventix-cli/
├── src/
│   ├── index.ts                  # oclif root
│   ├── commands/
│   │   ├── create/plugin.ts
│   │   ├── dev.ts
│   │   ├── validate.ts
│   │   ├── build.ts
│   │   └── doctor.ts
│   ├── lib/
│   │   ├── manifest.ts           # wraps @ventix/plugin-api/manifest validators
│   │   ├── nx-generator.ts       # invokes Nx generators under the hood
│   │   ├── plugin-host.ts        # static file server for `ventix dev`
│   │   └── version-check.ts
│   └── templates/
│       └── plugin/               # files copied by `create plugin`
├── package.json                  # oclif config; bin: { ventix: "./bin/run" }
├── bin/run                       # oclif entry script
└── tsconfig.json
```

## Constraints

1. **CLI consumes only public APIs.** Manifest schema from `@ventix/plugin-api/manifest`. No private kernel modules. (ADR-0009.)
2. **Templates live next to the CLI**, not duplicated across docs. The init-ventix skill and the CLI share the same template set.
3. **All commands are non-interactive by default** — flags drive behavior, suitable for CI. Interactive prompts are opt-in via `--interactive`.
4. **Exit codes are stable contract.** Changing them is a breaking change.
5. **No telemetry without explicit opt-in.** Phase 1+ if added at all.

## Distribution

- Phase 0: workspace-internal via `pnpm exec ventix ...` or `nx run ventix-cli:exec`.
- Phase 1: published to npm as `@ventix/cli`; installed globally `pnpm add -g @ventix/cli`.
- Phase 2: single-binary builds (`pkg`) for macOS / Linux / Windows in releases.

## Future Commands (sketched, not committed)

- `ventix marketplace search <query>`
- `ventix install <plugin-id>` (from marketplace into a tenant)
- `ventix migrate manifest --from 1 --to 2`
- `ventix codemod <name>`
- `ventix scaffold widget|tool|setting --plugin <id>`

These are RFC-bearing additions, not Phase 0.
