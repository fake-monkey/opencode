import { $ } from "bun"
import { cp } from "node:fs/promises"
import path from "node:path"
import pkg from "../package.json"

const dir = path.resolve(import.meta.dirname, "..")
await $`bun run build:local`.cwd(dir)

const platform = process.platform === "win32" ? "windows" : process.platform
const binary = process.platform === "win32" ? "opencode.exe" : "opencode"
const staging = path.join(dir, "dist", "local")

// Install a packed snapshot so rebuilding dist never changes the installed executable.
await cp(path.join(dir, "dist", `cli-${platform}-${process.arch}`, "bin"), path.join(staging, "bin"), {
  recursive: true,
})
await Bun.write(
  path.join(staging, "package.json"),
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      license: pkg.license,
      bin: { opencode: `./bin/${binary}`, opencode2: `./bin/${binary}` },
      files: ["bin"],
      os: [process.platform],
      cpu: [process.arch],
    },
    null,
    2,
  ),
)
await $`npm pack --silent --pack-destination ${staging}`.cwd(staging)
await $`npm install --global ${path.join(staging, `opencode-cli-${pkg.version}.tgz`)} ${process.argv.slice(2)}`.cwd(dir)
