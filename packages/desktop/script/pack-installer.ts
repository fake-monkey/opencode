import { $ } from "bun"
import path from "node:path"
import pkg from "../package.json"

if (process.platform !== "win32") throw new Error("NSIS packaging requires Windows")
if (process.env.OPENCODE_CHANNEL !== "latest" && process.env.OPENCODE_CHANNEL !== "prod")
  throw new Error("Set OPENCODE_CHANNEL=latest before building and packing the production app")

const dir = path.resolve(import.meta.dirname, "..")
const app = path.resolve(dir, "../../dist/desktop/app")
if (!(await Bun.file(path.join(app, "OpenCode.exe")).exists()))
  throw new Error("Pack the production desktop app first with bun run pack")

await $`bun run script/pack.ts`.cwd(dir).env({
  ...process.env,
  OPENCODE_DESKTOP_APP: app,
  OPENCODE_VERSION: pkg.version,
})
console.log(`Installer output: ${path.resolve(dir, "../../dist/desktop")}`)
