import { execSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")

// Try npx vitest directly since pnpm may not be on PATH
const cmd = "npx --yes vitest run --reporter=verbose"

try {
  const output = execSync(cmd, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  })
  console.log(output)
} catch (err) {
  console.log(err.stdout ?? "")
  console.error(err.stderr ?? "")
  process.exit(1)
}
