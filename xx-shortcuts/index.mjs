import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const XX_SCRIPT = "/home/node/.openclaw/workspace/xx.sh";
const DEFAULT_TIMEOUT_MS = 240000;

function normalizeOutput(stdout, stderr) {
  const text = [stdout || "", stderr || ""]
    .filter(Boolean)
    .join("\n")
    .trim();
  return text || "XX 已执行，但没有返回可显示内容。";
}

export default function register(api) {
  api.registerCommand({
    name: "xx",
    description: "强制通过 A2A 把任务转给 PC 端的 XX 执行。",
    acceptsArgs: true,
    requireAuth: true,
    handler: async (ctx) => {
      const task = (ctx.args || "").trim();
      if (!task) {
        return { text: "用法：/xx 你的任务" };
      }

      try {
        const { stdout, stderr } = await execFileAsync(XX_SCRIPT, [task], {
          timeout: DEFAULT_TIMEOUT_MS,
          maxBuffer: 1024 * 1024,
          env: {
            ...process.env,
            NO_COLOR: "1",
          },
        });
        return { text: normalizeOutput(stdout, stderr) };
      } catch (error) {
        const stdout = typeof error?.stdout === "string" ? error.stdout : "";
        const stderr = typeof error?.stderr === "string" ? error.stderr : "";
        const detail = normalizeOutput(stdout, stderr);
        return {
          text: `XX 执行失败：${detail}`,
        };
      }
    },
  });
}
