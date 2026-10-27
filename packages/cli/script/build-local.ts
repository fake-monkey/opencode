import { $ } from "bun"

// Local-only build: compile the CLI for the current platform without downloading every
// platform's native package or rebuilding the web UI. The version comes from this package
// so `opencode --version` identifies this checkout.
// Keep release behavior: dev/local channels enable experimental runtime defaults.
const pkg = await Bun.file(new URL("../package.json", import.meta.url)).json()

await $`bun run script/build.ts --single --skip-install --skip-web-ui`.env({
  ...process.env,
  OPENCODE_CHANNEL: "latest",
  OPENCODE_VERSION: pkg.version,
})
