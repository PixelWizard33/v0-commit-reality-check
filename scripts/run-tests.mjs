import { execSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")

try {
  const output = execSync("pnpm vitest run --reporter=verbose", {
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
