const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const legacyClientDir = path.join(rootDir, "generated", "prisma");

if (fs.existsSync(legacyClientDir)) {
  try {
    fs.rmSync(legacyClientDir, { recursive: true, force: true });
    console.log("Removed legacy generated/prisma folder.");
  } catch (error) {
    console.error("Could not remove generated/prisma.");
    console.error("Stop the dev server first (Ctrl+C in the terminal running npm run dev), then retry:");
    console.error("  npm run prisma:generate:safe");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

try {
  execSync("npx prisma generate", { stdio: "inherit", cwd: rootDir });
} catch {
  console.error("\nPrisma generate failed.");
  console.error("1. Stop npm run dev (Ctrl+C)");
  console.error("2. Retry: npm run prisma:generate:safe");
  process.exit(1);
}
