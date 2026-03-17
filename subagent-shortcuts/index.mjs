import path from "node:path";
import {
  access,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { pathToFileURL } from "node:url";

const MAIN_AGENT_ID = "main";
const FILM_PIPELINE_SKILL_PATH =
  "/home/node/.openclaw/workspace/skills/film-pipeline";
const FILM_PIPELINE_WORK_DIR = "/home/node/.openclaw/workspace/work";
const FILM_PIPELINE_ROOT_DIR = path.join(FILM_PIPELINE_WORK_DIR, "film");
const FILM_PIPELINE_INDEX_PATH = path.join(
  FILM_PIPELINE_ROOT_DIR,
  "_index.md",
);
const FILM_PROGRESS_FILE = "_progress.json";
const FILM_PROJECT_SUMMARY_FILE = "00_project_summary.md";
const MIN_MEANINGFUL_FILM_LINES = 4;
const MIN_MEANINGFUL_FILM_CHARS = 120;
const FILM_PROGRESS_STEPS = [
  {
    id: "step-1",
    label: "Step 1 - Directing Brief",
    fileName: "01_step1_directing_brief.md",
    runningPercent: 10,
    completedPercent: 20,
  },
  {
    id: "step-2",
    label: "Step 2 - Storyboard",
    fileName: "02_step2_storyboard.md",
    runningPercent: 30,
    completedPercent: 40,
  },
  {
    id: "step-3",
    label: "Step 3 - Prompt Package",
    fileName: "03_step3_prompt_package.md",
    aliases: ["03_step3_motion_design_package.md"],
    runningPercent: 50,
    completedPercent: 60,
  },
  {
    id: "step-4",
    label: "Step 4 - Execution Plan",
    fileName: "04_step4_execution_plan.md",
    runningPercent: 70,
    completedPercent: 80,
  },
  {
    id: "step-5",
    label: "Step 5 - Generation Prompts",
    fileName: "05_step5_generation_prompts.md",
    runningPercent: 90,
    completedPercent: 100,
  },
];
const FILM_TOTAL_FILES = FILM_PROGRESS_STEPS.length + 1;

async function loadInternalModule() {
  const dir = "/app/dist/plugin-sdk";
  const entry = (await readdir(dir)).find((name) =>
    /^thread-bindings-.*\.js$/i.test(name),
  );
  if (!entry) {
    throw new Error("Cannot locate thread-bindings runtime bundle.");
  }
  return import(pathToFileURL(path.join(dir, entry)).href);
}

const internalPromise = loadInternalModule();

function resolveInternalExport(internal, functionName) {
  const match = Object.values(internal).find(
    (value) => typeof value === "function" && value.name === functionName,
  );
  if (!match) {
    throw new Error(`Missing internal export: ${functionName}`);
  }
  return match;
}

function normalizeTelegramChatId(raw) {
  if (typeof raw !== "string") {
    return "";
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("telegram:")) {
    return trimmed.slice("telegram:".length).trim();
  }
  return trimmed;
}

function resolveRequesterSessionKey(ctx, resolveAgentRoute) {
  if (ctx.channel === "telegram") {
    const chatId = normalizeTelegramChatId(ctx.to || ctx.from || "");
    if (chatId) {
      const isGroup = chatId.startsWith("-");
      const threadId =
        typeof ctx.messageThreadId === "number" ? ctx.messageThreadId : undefined;
      const peerId = isGroup
        ? threadId != null
          ? `${chatId}:topic:${threadId}`
          : chatId
        : (ctx.senderId || "").trim() || chatId;
      const route = resolveAgentRoute({
        cfg: ctx.config,
        channel: "telegram",
        accountId: ctx.accountId || undefined,
        peer: {
          kind: isGroup ? "group" : "direct",
          id: peerId,
        },
      });
      if (route?.sessionKey) {
        return route.sessionKey;
      }
    }
  }
  return `agent:${MAIN_AGENT_ID}:main`;
}

async function dispatchToMainSubagent({
  api,
  requesterSessionKey,
  message,
  idempotencyKey,
}) {
  await api.runtime.subagent.run({
    sessionKey: requesterSessionKey,
    message,
    deliver: false,
    idempotencyKey,
  });
}

function normalizeFilmTask(task) {
  return task
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" | ");
}

function todayStamp() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";
  return `${year}${month}${day}`;
}

function cleanProjectSegment(value) {
  return value
    .normalize("NFKC")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "")
    .slice(0, 48);
}

function toAsciiProjectSegment(value) {
  return cleanProjectSegment(value)
    .replace(/[^A-Za-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "")
    .slice(0, 32);
}

function extractLabeledValue(task, labels) {
  const lines = task.split(/\r?\n/);
  for (const line of lines) {
    for (const label of labels) {
      const match = line.match(
        new RegExp(`^\\s*${label}\\s*[:\\uFF1A]\\s*(.+)$`, "i"),
      );
      if (match) {
        return match[1].trim();
      }
    }
  }
  return "";
}

function extractExplicitProjectName(task) {
  return extractLabeledValue(task, [
    "\u9879\u76ee",
    "\u9879\u76ee\u540d",
    "project",
    "project name",
  ]);
}

function normalizeStepId(rawValue) {
  if (typeof rawValue !== "string") {
    return "";
  }
  const trimmed = rawValue.trim().toLowerCase();
  const match = trimmed.match(/step[-\s]?([1-5])/i);
  if (match?.[1]) {
    return `step-${match[1]}`;
  }
  const numberMatch = trimmed.match(/\b([1-5])\b/);
  if (numberMatch?.[1]) {
    return `step-${numberMatch[1]}`;
  }
  return "";
}

function nextStepId(stepId) {
  const order = FILM_PROGRESS_STEPS.map((step) => step.id);
  const currentIndex = order.indexOf(stepId);
  if (currentIndex === -1 || currentIndex >= order.length - 1) {
    return "";
  }
  return order[currentIndex + 1];
}

function extractRequestedMode(task) {
  const labeled = extractLabeledValue(task, ["mode", "\u6a21\u5f0f"]);
  const normalized = labeled.trim().toLowerCase();
  if (["run_all", "rerun_from", "rerun_only"].includes(normalized)) {
    return normalized;
  }
  return "";
}

function extractRequestedStep(task) {
  const labeledCandidates = [
    extractLabeledValue(task, ["step", "\u6b65\u9aa4"]),
    extractLabeledValue(task, ["rerun_from", "from_step"]),
  ].filter(Boolean);
  for (const candidate of labeledCandidates) {
    const normalized = normalizeStepId(candidate);
    if (normalized) {
      return normalized;
    }
  }

  const patterns = [
    /(?:from|resume from|rerun from)\s*(step[-\s]?[1-5])/i,
    /(?:\u4ece)\s*(step[-\s]?[1-5]|[1-5])\s*(?:\u5f00\u59cb|\u7ee7\u7eed|\u91cd\u8dd1)?/i,
    /(?:\u624b\u52a8\u4fee\u6539\u4e86|\u4fee\u6539\u4e86|\u624b\u6539\u4e86|edited)\s*(step[-\s]?[1-5]|[1-5])/i,
    /(?:\u53ea\u91cd\u8dd1|\u53ea\u8dd1|rerun only)\s*(step[-\s]?[1-5]|[1-5])/i,
  ];
  for (const pattern of patterns) {
    const match = task.match(pattern);
    if (match?.[1]) {
      const normalized = normalizeStepId(match[1]);
      if (normalized) {
        return normalized;
      }
    }
  }

  return "";
}

function inferRequestedPipelineControl(task) {
  const explicitMode = extractRequestedMode(task);
  const explicitStep = extractRequestedStep(task);
  const manualEditMatch = task.match(
    /(?:\u624b\u52a8\u4fee\u6539\u4e86|\u4fee\u6539\u4e86|\u624b\u6539\u4e86|edited)\s*(step[-\s]?[1-5]|[1-5])/i,
  );

  if (explicitMode) {
    return {
      mode: explicitMode,
      step: explicitStep || "",
    };
  }

  if (manualEditMatch?.[1]) {
    const editedStep = normalizeStepId(manualEditMatch[1]);
    const downstreamStep = nextStepId(editedStep);
    if (downstreamStep) {
      return {
        mode: "rerun_from",
        step: downstreamStep,
      };
    }
    return null;
  }

  if (/(?:\u53ea\u91cd\u8dd1|\u53ea\u8dd1|rerun only)/i.test(task) && explicitStep) {
    return {
      mode: "rerun_only",
      step: explicitStep,
    };
  }

  if (
    /(?:\u7ee7\u7eed|\u4ece\s*step|resume|rerun from)/i.test(
      task,
    ) &&
    explicitStep
  ) {
    return {
      mode: "rerun_from",
      step: explicitStep,
    };
  }

  return null;
}

function trimProjectSuffix(value) {
  return value
    .replace(
      /\s+(?:\u4ece\s*step[-\s]?\d.*|\u7ee7\u7eed.*|\u53ea\u91cd\u8dd1.*|\u53ea\u8dd1.*|rerun.*|resume.*)$/i,
      "",
    )
    .trim();
}

function findExistingProjectMatch(projects, rawValue) {
  const trimmed = trimProjectSuffix(rawValue);
  const cleaned = cleanProjectSegment(trimmed);
  const candidates = [rawValue.trim(), trimmed, cleaned].filter(Boolean);

  for (const candidate of candidates) {
    const exact = projects.find(
      (project) =>
        project.name === candidate ||
        candidate.startsWith(`${project.name} `) ||
        candidate.startsWith(`${project.name}-`) ||
        candidate.startsWith(`${project.name}|`),
    );
    if (exact) {
      return exact;
    }
  }

  return null;
}

function inferProjectName(task) {
  const explicit = extractExplicitProjectName(task);
  if (explicit) {
    return explicit;
  }

  const theme = extractLabeledValue(task, ["\u4e3b\u9898", "theme"]);
  const platform = extractLabeledValue(task, ["\u5e73\u53f0", "platform"]);
  if (theme && platform) {
    return `${theme}-${platform}`;
  }
  if (theme) {
    return theme;
  }

  const firstLine = task
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
  return firstLine || "film-project";
}

function buildProjectFolderName(task) {
  const inferredName = inferProjectName(task);
  const cleaned = toAsciiProjectSegment(inferredName);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date())
    .replace(":", "");
  return `${todayStamp()}_${cleaned || `film-project-${timePart}`}`;
}

function taskRequestsContinuation(task) {
  return new RegExp(
    [
      "\\u7ee7\\u7eed",
      "\\u7eed\\u8dd1",
      "\\u91cd\\u8dd1",
      "\\u4ece\\s*step",
      "rerun",
      "resume",
      "\\u53ea\\u91cd\\u8dd1",
      "\\u53ea\\u8dd1",
      "\\u4fee\\u6539\\u4e86",
      "\\u624b\\u6539",
      "\\u7ee7\\u7eed\\u5904\\u7406",
    ].join("|"),
    "i",
  ).test(task);
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function listFilmProjects() {
  await mkdir(FILM_PIPELINE_ROOT_DIR, { recursive: true });
  const entries = await readdir(FILM_PIPELINE_ROOT_DIR, { withFileTypes: true });
  const projects = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const fullPath = path.join(FILM_PIPELINE_ROOT_DIR, entry.name);
    const entryStat = await stat(fullPath);
    projects.push({
      name: entry.name,
      fullPath,
      mtimeMs: entryStat.mtimeMs,
    });
  }
  projects.sort((left, right) => right.mtimeMs - left.mtimeMs);
  return projects;
}

function stepFileCandidates(step) {
  return [step.fileName, ...(step.aliases || [])];
}

function normalizeFilmArtifactText(raw) {
  if (typeof raw !== "string") {
    return "";
  }
  return raw.replace(/^\uFEFF/, "").trim();
}

function looksLikeHeadingOnlyPlaceholder(lines) {
  return lines.length === 1 && /^#{1,6}\s+\S/.test(lines[0]);
}

function isMeaningfulFilmArtifact(raw, canonicalFileName) {
  const text = normalizeFilmArtifactText(raw);
  if (!text) {
    return false;
  }

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (looksLikeHeadingOnlyPlaceholder(lines)) {
    return false;
  }

  if (lines.length >= MIN_MEANINGFUL_FILM_LINES) {
    return true;
  }

  if (text.length >= MIN_MEANINGFUL_FILM_CHARS && lines.length >= 2) {
    return true;
  }

  if (canonicalFileName === FILM_PROJECT_SUMMARY_FILE) {
    return (
      /#\s*Project Summary/i.test(text) ||
      /^Project:\s+/m.test(text) ||
      /^##\s+/m.test(text)
    );
  }

  return (
    /^Project:\s+/m.test(text) ||
    /^Step:\s+/m.test(text) ||
    /^##\s+/m.test(text)
  );
}

async function resolveMeaningfulFilmArtifact(projectDir, canonicalFileName, candidates) {
  for (const candidate of candidates) {
    const candidatePath = path.join(projectDir, candidate);
    if (!(await pathExists(candidatePath))) {
      continue;
    }

    const content = await readTextIfExists(candidatePath);
    if (!isMeaningfulFilmArtifact(content, canonicalFileName)) {
      continue;
    }

    return {
      canonicalFileName,
      actualFileName: candidate,
      mtimeMs: (await stat(candidatePath)).mtimeMs,
    };
  }

  return null;
}

async function resolveFilmArtifacts(projectDir) {
  const summary = await resolveMeaningfulFilmArtifact(projectDir, FILM_PROJECT_SUMMARY_FILE, [
    FILM_PROJECT_SUMMARY_FILE,
  ]);

  const steps = [];
  for (const step of FILM_PROGRESS_STEPS) {
    const matched = await resolveMeaningfulFilmArtifact(
      projectDir,
      step.fileName,
      stepFileCandidates(step),
    );
    steps.push({
      ...step,
      present: Boolean(matched),
      actualFileName: matched?.actualFileName || "",
      mtimeMs: matched?.mtimeMs || 0,
    });
  }

  return { summary, steps };
}

function existingCanonicalFilesFromArtifacts(artifacts) {
  const existing = [];
  if (artifacts.summary) {
    existing.push(FILM_PROJECT_SUMMARY_FILE);
  }
  for (const step of artifacts.steps) {
    if (step.present) {
      existing.push(step.fileName);
    }
  }
  return existing;
}

function inferResumeStepFromArtifacts(stepArtifacts) {
  for (const step of stepArtifacts) {
    if (!step.present) {
      return step.id;
    }
  }

  const latestStep = stepArtifacts.reduce((currentLatest, step) => {
    if (!currentLatest || step.mtimeMs > currentLatest.mtimeMs) {
      return step;
    }
    return currentLatest;
  }, null);

  if (!latestStep) {
    return null;
  }

  return nextStepId(latestStep.id) || null;
}

async function detectStepState(projectDir) {
  const artifacts = await resolveFilmArtifacts(projectDir);
  const existing = existingCanonicalFilesFromArtifacts(artifacts);
  const completedStepCount = artifacts.steps.filter((step) => step.present).length;

  if (completedStepCount === 0) {
    return { existing, status: "new", resumeStep: null, artifacts };
  }

  const resumeStep = inferResumeStepFromArtifacts(artifacts.steps);
  if (!resumeStep) {
    return { existing, status: "completed", resumeStep: null, artifacts };
  }

  return {
    existing,
    status: `waiting-${resumeStep}`,
    resumeStep,
    artifacts,
  };
}

function buildFilmProgressPath(projectDir) {
  return path.join(projectDir, FILM_PROGRESS_FILE);
}

async function readJsonIfExists(targetPath) {
  try {
    const raw = await readFile(targetPath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "ENOENT") {
        return null;
      }
    }
    return null;
  }
}

async function writeFilmProgress(projectDir, payload) {
  const outputPath = buildFilmProgressPath(projectDir);
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function readTextIfExists(targetPath) {
  try {
    return await readFile(targetPath, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "ENOENT") {
        return "";
      }
    }
    throw error;
  }
}

async function detectWorkingTitle(projectDir) {
  const summary = await readTextIfExists(
    path.join(projectDir, FILM_PROJECT_SUMMARY_FILE),
  );
  const step1 = await readTextIfExists(
    path.join(projectDir, "01_step1_directing_brief.md"),
  );
  const patterns = [
    /\*\*Working Title:\*\*\s*(.+)$/m,
    /- \*\*Working Title\*\*:\s*(.+)$/m,
  ];

  for (const source of [summary, step1]) {
    for (const pattern of patterns) {
      const match = source.match(pattern);
      if (match?.[1]) {
        return match[1].trim();
      }
    }
  }

  return "";
}

async function detectFilmMetadata(projectDir) {
  const summary = await readTextIfExists(
    path.join(projectDir, FILM_PROJECT_SUMMARY_FILE),
  );
  const step1 = await readTextIfExists(
    path.join(projectDir, "01_step1_directing_brief.md"),
  );
  const sources = [summary, step1];
  const definitions = [
    {
      key: "videoType",
      patterns: [
        /\*\*Video Type:\*\*\s*(.+)$/m,
        /- \*\*Video Type\*\*:\s*(.+)$/m,
      ],
    },
    {
      key: "duration",
      patterns: [
        /\*\*Duration:\*\*\s*(.+)$/m,
        /\*\*Target Duration:\*\*\s*(.+)$/m,
        /- \*\*Duration\*\*:\s*(.+)$/m,
        /- \*\*Target Duration\*\*:\s*(.+)$/m,
      ],
    },
    {
      key: "nextAction",
      patterns: [
        /## Next Recommended Action\s+([\s\S]*?)(?:\n## |\n---|$)/m,
        /\*\*Next recommended action:\*\*\s*(.+)$/m,
        /Next recommended action:\s*(.+)$/m,
      ],
    },
  ];

  const metadata = {
    videoType: "",
    duration: "",
    nextAction: "",
  };

  for (const source of sources) {
    for (const definition of definitions) {
      if (metadata[definition.key]) {
        continue;
      }
      for (const pattern of definition.patterns) {
        const match = source.match(pattern);
        if (match?.[1]) {
          metadata[definition.key] = match[1].trim().replace(/\s+/g, " ");
          break;
        }
      }
    }
  }

  return metadata;
}

function formatShanghaiTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function statusLabelForStepState(state) {
  if (state === "completed") {
    return "已完成";
  }
  if (state === "in_progress") {
    return "进行中";
  }
  return "待开始";
}

function localizeFilmStatus(status) {
  switch (status) {
    case "completed":
      return "已完成";
    case "running":
      return "进行中";
    case "submitted":
      return "已提交";
    case "paused":
      return "等待中";
    case "new":
      return "未开始";
    default:
      return status;
  }
}

function localizeCurrentLabel(currentStepId, currentLabel, status) {
  if (status === "completed") {
    return "已全部完成";
  }
  if (status === "submitted") {
    return "已提交，等待开始";
  }
  const labelMap = {
    "step-1": "Step 1 导演简报",
    "step-2": "Step 2 分镜脚本",
    "step-3": "Step 3 Prompt 包",
    "step-4": "Step 4 执行计划",
    "step-5": "Step 5 直出 Prompt",
  };
  if (currentStepId && labelMap[currentStepId]) {
    return labelMap[currentStepId];
  }
  if (currentLabel === "Waiting for next step") {
    return "等待下一步";
  }
  if (currentLabel === "Queued") {
    return "排队中";
  }
  return currentLabel;
}

function localizeStepDisplay(step) {
  const labelMap = {
    "step-1": "Step 1 导演简报",
    "step-2": "Step 2 分镜脚本",
    "step-3": "Step 3 Prompt 包",
    "step-4": "Step 4 执行计划",
    "step-5": "Step 5 直出 Prompt",
  };
  return labelMap[step.id] || step.label;
}

function renderFilmProgressBar(percent, width = 10) {
  const safePercent = Math.max(0, Math.min(100, percent));
  const filled = Math.round((safePercent / 100) * width);
  return `[${"#".repeat(filled)}${"-".repeat(width - filled)}]`;
}

function summarizeStepStatuses(stepArtifacts, resumeStep) {
  const resumeIndex = FILM_PROGRESS_STEPS.findIndex((step) => step.id === resumeStep);

  return stepArtifacts.map((step, index) => {
    if (resumeIndex !== -1) {
      if (index < resumeIndex) {
        return { ...step, state: "completed" };
      }
      if (index === resumeIndex) {
        return { ...step, state: "in_progress" };
      }
      return { ...step, state: "pending" };
    }

    if (step.present) {
      return { ...step, state: "completed" };
    }
    const completedCount = stepArtifacts.filter((item) => item.present).length;
    if (index === completedCount) {
      return { ...step, state: "in_progress" };
    }
    return { ...step, state: "pending" };
  });
}

async function resolveFilmStatusProject(rawValue) {
  const projects = await listFilmProjects();
  if (projects.length === 0) {
    return null;
  }

  const trimmed = (rawValue || "").trim();
  if (!trimmed) {
    return projects[0];
  }

  if (/^(latest|current)$/i.test(trimmed)) {
    return projects[0];
  }

  return findExistingProjectMatch(projects, trimmed);
}

async function initializeFilmProgress(project, resumeStep, task) {
  const currentStep = resumeStep || "step-1";
  const stepMeta =
    FILM_PROGRESS_STEPS.find((step) => step.id === currentStep) ||
    FILM_PROGRESS_STEPS[0];
  const progress = {
    projectName: project.projectName,
    workingTitle: inferProjectName(task),
    status: "submitted",
    currentStep: stepMeta.id,
    currentLabel: stepMeta.label,
    percent: resumeStep ? stepMeta.runningPercent : 5,
    resumeStep: resumeStep || null,
    requestedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUserTask: normalizeFilmTask(task),
  };
  await writeFilmProgress(project.projectDir, progress);
}

async function collectFilmProgress(project) {
  const projectDir = project.projectDir || project.fullPath;
  const projectName = project.projectName || project.name;
  const [detectedState, projectStat, savedProgress, metadata] = await Promise.all([
    detectStepState(projectDir),
    stat(projectDir),
    readJsonIfExists(buildFilmProgressPath(projectDir)),
    detectFilmMetadata(projectDir),
  ]);
  const { existing, status, resumeStep, artifacts } = detectedState;
  const steps = summarizeStepStatuses(artifacts.steps, resumeStep);
  const completedCount = steps.filter((step) => step.state === "completed").length;
  const currentStep = steps.find((step) => step.state === "in_progress") || null;
  const workingTitle =
    (await detectWorkingTitle(projectDir)) ||
    savedProgress?.workingTitle ||
    projectName;

  let percent = 0;
  let displayStatus = status;
  let currentLabel = "Queued";

  if (status === "completed") {
    percent = 100;
    displayStatus = "completed";
    currentLabel = "Complete";
  } else if (currentStep) {
    percent =
      completedCount === 0 && savedProgress?.status === "submitted"
        ? 5
        : currentStep.runningPercent;
    displayStatus =
      completedCount === 0 && savedProgress?.status === "submitted"
        ? "submitted"
        : "running";
    currentLabel = currentStep.label;
  } else if (completedCount > 0) {
    percent =
      FILM_PROGRESS_STEPS[completedCount - 1]?.completedPercent ??
      savedProgress?.percent ??
      0;
    displayStatus = "paused";
    currentLabel = "Waiting for next step";
  } else {
    percent = savedProgress?.percent ?? 0;
    displayStatus = savedProgress?.status ?? "new";
  }

  const stepsWithTimes = await Promise.all(
    steps.map(async (step) => {
      if (step.state !== "completed") {
        return {
          ...step,
          completedAt: "",
          statusLabel: statusLabelForStepState(step.state),
        };
      }
      return {
        ...step,
        completedAt: formatShanghaiTime(step.mtimeMs),
        statusLabel: statusLabelForStepState(step.state),
      };
    }),
  );

  const nextAction =
    status === "completed"
      ? "可直接拿 Step 5 prompt 去生图，或继续做内容复核。"
      : currentStep
        ? `继续从 ${currentStep.label} 往下刷新后续文件。`
        : metadata.nextAction || currentLabel;

  const snapshot = {
    projectName,
    workingTitle,
    status: displayStatus,
    percent,
    currentStep: currentStep?.id || null,
    currentLabel,
    filesPresent: existing,
    fileCount: existing.length,
    videoType: metadata.videoType || "",
    duration: metadata.duration || "",
    nextAction,
    steps: stepsWithTimes.map(
      ({ id, label, state, fileName, completedAt, statusLabel }) => ({
        id,
        label,
        state,
        fileName,
        completedAt,
        statusLabel,
      }),
    ),
    updatedAt: new Date(projectStat.mtimeMs).toISOString(),
    requestedAt: savedProgress?.requestedAt || null,
    lastUserTask: savedProgress?.lastUserTask || null,
  };

  await writeFilmProgress(projectDir, {
    ...(savedProgress || {}),
    ...snapshot,
    updatedAt: new Date().toISOString(),
  });

  return snapshot;
}

function buildFilmStatusReply(progress, projectDir) {
  const stepLines = progress.steps.map((step) => {
    const label = localizeStepDisplay(step);
    const time = step.completedAt || "--:--";
    return `${label.padEnd(16)} | ${step.statusLabel.padEnd(6)} | ${time}`;
  });
  const lines = [
    `项目：${progress.projectName}`,
    `标题：${progress.workingTitle}`,
    `进度：${renderFilmProgressBar(progress.percent)} ${progress.percent}%`,
    `状态：${localizeFilmStatus(progress.status)}`,
    `当前：${localizeCurrentLabel(progress.currentStep, progress.currentLabel, progress.status)}`,
    `类型：${progress.videoType || "未知"}`,
    `时长：${progress.duration || "未知"}`,
    "",
    "```text",
    "步骤               | 状态   | 完成时间",
    "-------------------|--------|--------",
    ...stepLines,
    "```",
    "",
    `文件：${progress.fileCount}/${FILM_TOTAL_FILES}`,
    `路径：work/film/${path.basename(projectDir)}`,
    `下一步：${progress.nextAction}`,
  ];

  return lines.join("\n");
}

async function handleFilmStatusCommand(rawArgs) {
  const project = await resolveFilmStatusProject((rawArgs || "").trim());
  if (!project) {
    return {
      text: "No film projects found yet. Run /film first.",
    };
  }

  const progress = await collectFilmProgress({
    projectName: project.name,
    projectDir: project.fullPath,
  });

  return {
    text: buildFilmStatusReply(progress, project.fullPath),
  };
}

async function resolveProjectDirectory(task) {
  const projects = await listFilmProjects();
  const explicitProject = extractExplicitProjectName(task);

  if (explicitProject) {
    const trimmedExplicit = trimProjectSuffix(explicitProject);
    const cleanedExplicit = cleanProjectSegment(trimmedExplicit);
    const exactMatch = findExistingProjectMatch(projects, explicitProject);
    if (exactMatch) {
      return {
        projectName: exactMatch.name,
        projectDir: exactMatch.fullPath,
        created: false,
        inferred: false,
      };
    }

    const prefixedName =
      trimmedExplicit === cleanedExplicit &&
      /^\d{8}_/.test(trimmedExplicit)
        ? trimmedExplicit
        : `${todayStamp()}_${cleanedExplicit || "film-project"}`;
    const projectDir = path.join(FILM_PIPELINE_ROOT_DIR, prefixedName);
    await mkdir(projectDir, { recursive: true });
    return {
      projectName: prefixedName,
      projectDir,
      created: true,
      inferred: false,
    };
  }

  if (taskRequestsContinuation(task) && projects.length > 0) {
    const latestProject = projects[0];
    return {
      projectName: latestProject.name,
      projectDir: latestProject.fullPath,
      created: false,
      inferred: true,
    };
  }

  const projectName = buildProjectFolderName(task);
  const projectDir = path.join(FILM_PIPELINE_ROOT_DIR, projectName);
  await mkdir(projectDir, { recursive: true });
  return {
    projectName,
    projectDir,
    created: true,
    inferred: false,
  };
}

async function refreshFilmIndex() {
  const projects = await listFilmProjects();
  const lines = [
    "# Film Projects",
    "",
    `Updated: ${new Date().toISOString()}`,
    "",
  ];

  if (projects.length === 0) {
    lines.push("No film projects yet.");
  } else {
    lines.push("| Project | Status | Files | Last Updated |");
    lines.push("| --- | --- | --- | --- |");

    for (const project of projects) {
      const { existing, status } = await detectStepState(project.fullPath);
      const updated = new Date(project.mtimeMs)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ");
      lines.push(
        `| ${project.name} | ${status} | ${existing.length}/${FILM_TOTAL_FILES} | ${updated} |`,
      );
    }
  }

  lines.push("");
  await writeFile(FILM_PIPELINE_INDEX_PATH, `${lines.join("\n")}\n`, "utf8");
}

function buildFilmPipelineTask(task, projectDir, projectName) {
  const normalizedTask = normalizeFilmTask(task);
  return [
    `Use $film-pipeline at ${FILM_PIPELINE_SKILL_PATH} to handle this filmmaking request.`,
    `Project folder: ${projectDir}. Project id: ${projectName}.`,
    `Follow the checkpointed workflow, preserve manual edits if they exist, and write or update the standard project files in ${projectDir}.`,
    "Do not create placeholder markdown files or heading-only shells. A step file counts only when it contains the real deliverable content for that step.",
    `Refresh the film project index at ${FILM_PIPELINE_INDEX_PATH} if project status changes.`,
    `User request: ${normalizedTask}`,
  ].join(" ");
}

async function buildFilmPipelineDispatch(task) {
  const project = await resolveProjectDirectory(task);
  const detectedState = await detectStepState(project.projectDir);
  const requestedControl = inferRequestedPipelineControl(task);
  let resumeStep = detectedState.resumeStep;
  let requestedMode = "";

  if (requestedControl?.mode === "rerun_from" && requestedControl.step) {
    requestedMode = "rerun_from";
    resumeStep = requestedControl.step;
  } else if (requestedControl?.mode === "rerun_only" && requestedControl.step) {
    requestedMode = "rerun_only";
    resumeStep = requestedControl.step;
  } else if (requestedControl?.mode === "run_all") {
    requestedMode = "run_all";
    resumeStep = null;
  }

  await refreshFilmIndex();
  await initializeFilmProgress(project, resumeStep, task);

  if (!resumeStep) {
    return {
      dispatch: buildFilmPipelineTask(task, project.projectDir, project.projectName),
      project,
      resumeStep: null,
      mode: requestedMode || "run_all",
    };
  }

  const normalizedTask = normalizeFilmTask(task);
  const dispatchLines = [
    `Use $film-pipeline at ${FILM_PIPELINE_SKILL_PATH} to handle this filmmaking request.`,
    `Project folder: ${project.projectDir}. Project id: ${project.projectName}.`,
  ];

  if (requestedMode === "rerun_only") {
    dispatchLines.push(
      `Run in rerun_only mode for ${resumeStep}. Treat the current project files as source of truth and refresh only that deliverable unless the user explicitly asks to continue further.`,
    );
  } else {
    dispatchLines.push(
      `A partial run or manual change already exists in ${project.projectDir}. Resume with rerun_from ${resumeStep} unless the user explicitly asked to restart from scratch.`,
    );
  }

  dispatchLines.push(
    "Preserve existing step files as the current source of truth unless the requested resume point requires regeneration.",
    "If you find heading-only or near-empty step files, treat them as missing checkpoints and overwrite them with the full deliverable.",
    `Refresh the film project index at ${FILM_PIPELINE_INDEX_PATH} if project status changes.`,
    `User request: ${normalizedTask}`,
  );

  return {
    dispatch: dispatchLines.join(" "),
    project,
    resumeStep,
    mode: requestedMode || "rerun_from",
  };
}

function buildFilmReply(project, resumeStep, mode) {
  const relativeProjectDir = `work/film/${project.projectName}`;
  if (mode === "rerun_only" && resumeStep) {
    return `Submitted to film-pipeline. Project folder: ${relativeProjectDir}. Refreshing only ${resumeStep}. Check progress with /filmstatus ${project.projectName}.`;
  }
  if (resumeStep) {
    return `Submitted to film-pipeline. Project folder: ${relativeProjectDir}. Resume point: ${resumeStep}. Check progress with /filmstatus ${project.projectName}.`;
  }
  if (project.created) {
    return `Submitted to film-pipeline. New project folder: ${relativeProjectDir}. Check progress with /filmstatus ${project.projectName}.`;
  }
  if (project.inferred) {
    return `Submitted to film-pipeline. Reusing latest project folder: ${relativeProjectDir}. Check progress with /filmstatus ${project.projectName}.`;
  }
  return `Submitted to film-pipeline. Project folder: ${relativeProjectDir}. Check progress with /filmstatus ${project.projectName}.`;
}

export default function register(api) {
  api.registerCommand({
    name: "deep",
    description: "Send a complex task to the main subagent.",
    acceptsArgs: true,
    requireAuth: true,
    handler: async (ctx) => {
      try {
        const internal = await internalPromise;
        const resolveAgentRoute = resolveInternalExport(
          internal,
          "resolveAgentRoute",
        );
        const task = (ctx.args || "").trim();
        if (!task) {
          return {
            text: "Usage: /deep <task>",
          };
        }

        const requesterSessionKey = resolveRequesterSessionKey(ctx, resolveAgentRoute);
        await dispatchToMainSubagent({
          api,
          requesterSessionKey,
          message: `/subagents spawn ${MAIN_AGENT_ID} ${task}`,
          idempotencyKey: `deep-${Date.now()}`,
        });

        return {
          text: "Submitted to the main subagent. Results will return to this chat.",
        };
      } catch (error) {
        const detail =
          error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        return {
          text: `/deep failed: ${detail}`,
        };
      }
    },
  });

  api.registerCommand({
    name: "film",
    description: "Run the film pipeline with per-project folders.",
    acceptsArgs: true,
    requireAuth: true,
    handler: async (ctx) => {
      try {
        const internal = await internalPromise;
        const resolveAgentRoute = resolveInternalExport(
          internal,
          "resolveAgentRoute",
        );
        const task = (ctx.args || "").trim();
        if (!task) {
          return {
            text: "Usage: /film <brief> or /film 项目: <project-folder> <request>",
          };
        }
        if (/^-(?:status|progress)\b/i.test(task)) {
          const statusArgs = task.replace(/^-(?:status|progress)\b\s*/i, "");
          return handleFilmStatusCommand(statusArgs);
        }
        if (/^(?:status|progress)\b/i.test(task)) {
          const statusArgs = task.replace(/^(?:status|progress)\b\s*/i, "");
          return handleFilmStatusCommand(statusArgs);
        }

        const requesterSessionKey = resolveRequesterSessionKey(ctx, resolveAgentRoute);
        const { dispatch, project, resumeStep, mode } = await buildFilmPipelineDispatch(
          task,
        );
        await dispatchToMainSubagent({
          api,
          requesterSessionKey,
          message: `/subagents spawn ${MAIN_AGENT_ID} ${dispatch}`,
          idempotencyKey: `film-${Date.now()}`,
        });

        return {
          text: buildFilmReply(project, resumeStep, mode),
        };
      } catch (error) {
        const detail =
          error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        return {
          text: `/film failed: ${detail}`,
        };
      }
    },
  });

  api.registerCommand({
    name: "film-status",
    description: "Show progress for the latest film project or a named project.",
    acceptsArgs: true,
    requireAuth: true,
    handler: async (ctx) => {
      try {
        return handleFilmStatusCommand(ctx.args || "");
      } catch (error) {
        const detail =
          error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        return {
          text: `/film-status failed: ${detail}`,
        };
      }
    },
  });

  api.registerCommand({
    name: "filmstatus",
    description: "Show film progress without relying on hyphenated command parsing.",
    acceptsArgs: true,
    requireAuth: true,
    handler: async (ctx) => {
      try {
        return handleFilmStatusCommand(ctx.args || "");
      } catch (error) {
        const detail =
          error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        return {
          text: `/filmstatus failed: ${detail}`,
        };
      }
    },
  });
}
