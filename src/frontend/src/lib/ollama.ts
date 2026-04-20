import type { PlannerEntry, Quiz, Task } from "../types";

// ─── Timeout Helper ────────────────────────────────────────────────────────
const OLLAMA_TIMEOUT_MS = 8000; // 8 seconds max wait

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Ollama timeout")), ms),
    ),
  ]);
}

// ─── Mock Banks ────────────────────────────────────────────────────────────
const MOCK_BANKS: Record<
  string,
  Array<{ question: string; options: string[]; correctIndex: number }>
> = {
  Mathematics: [
    {
      question: "What is the determinant of a 2×2 identity matrix?",
      options: ["0", "1", "2", "−1"],
      correctIndex: 1,
    },
    {
      question: "Which operation is the inverse of integration?",
      options: ["Addition", "Differentiation", "Multiplication", "Exponentiation"],
      correctIndex: 1,
    },
    {
      question: "What is the sum of angles in a triangle?",
      options: ["90°", "180°", "270°", "360°"],
      correctIndex: 1,
    },
  ],
  Physics: [
    {
      question: "What is Newton's 2nd law?",
      options: ["F = ma", "E = mc²", "v = d/t", "p = mv"],
      correctIndex: 0,
    },
    {
      question: "What unit measures electrical resistance?",
      options: ["Ampere", "Volt", "Ohm", "Watt"],
      correctIndex: 2,
    },
    {
      question: "What type of wave is light?",
      options: ["Mechanical", "Longitudinal", "Electromagnetic", "Sound"],
      correctIndex: 2,
    },
  ],
  Chemistry: [
    {
      question: "What is the atomic number of Carbon?",
      options: ["6", "12", "14", "8"],
      correctIndex: 0,
    },
    {
      question: "What type of bond involves electron sharing?",
      options: ["Ionic", "Metallic", "Covalent", "Hydrogen"],
      correctIndex: 2,
    },
    {
      question: "What is the pH of a neutral solution at 25°C?",
      options: ["0", "7", "14", "1"],
      correctIndex: 1,
    },
  ],
  "Computer Science": [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      correctIndex: 2,
    },
    {
      question: "Which data structure uses LIFO order?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correctIndex: 1,
    },
    {
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Core Processing Unit",
        "Central Power Unit",
        "Computer Processing Utility",
      ],
      correctIndex: 0,
    },
  ],
  Literature: [
    {
      question: "Which literary device involves giving human traits to non-human things?",
      options: ["Simile", "Metaphor", "Personification", "Alliteration"],
      correctIndex: 2,
    },
    {
      question: "What is the term for the resolution of a story?",
      options: ["Climax", "Denouement", "Exposition", "Rising Action"],
      correctIndex: 1,
    },
    {
      question: "Which figure of speech is 'as brave as a lion'?",
      options: ["Metaphor", "Simile", "Hyperbole", "Irony"],
      correctIndex: 1,
    },
  ],
};

// ─── Smart Mock Planner Generator ─────────────────────────────────────────
const TIME_SLOTS = [
  "08:00 - 09:30",
  "10:00 - 11:30",
  "13:00 - 14:30",
  "15:00 - 16:30",
  "19:00 - 20:30",
];

const ACTIVITIES: Record<string, string[]> = {
  default: [
    "Review core concepts and key definitions",
    "Practice problems and exercises",
    "Read and annotate study material",
    "Summarize and create mind maps",
    "Solve past exam questions",
  ],
  "Computer Science": [
    "Code practice and algorithm problems",
    "Review data structures concepts",
    "Work on programming assignments",
    "Debug and analyze sample code",
    "Study system design principles",
  ],
  Mathematics: [
    "Solve problem sets and proofs",
    "Review formulae and theorems",
    "Practice past exam questions",
    "Work through textbook exercises",
    "Review error patterns from quizzes",
  ],
};

function generateMockPlanner(subjects: string[]): PlannerEntry[] {
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const entries: PlannerEntry[] = [];
  const totalSubjects = subjects.length;
  if (totalSubjects === 0) return entries;

  let subjectCursor = 0;
  DAYS.forEach((day, dayIdx) => {
    const isWeekend = dayIdx >= 5;
    const slotsCount = isWeekend ? 2 : 3;
    for (let i = 0; i < slotsCount; i++) {
      const subject = subjects[subjectCursor % totalSubjects];
      const activityPool = ACTIVITIES[subject] ?? ACTIVITIES.default;
      const activity = activityPool[(dayIdx + i) % activityPool.length];
      entries.push({
        day,
        time: TIME_SLOTS[i % TIME_SLOTS.length],
        subject,
        activity,
      });
      subjectCursor++;
    }
  });
  return entries;
}

// ─── Mock Quiz Generator ───────────────────────────────────────────────────
function generateMockQuiz(task: Task): Quiz {
  const fallback = [
    {
      question: `What is the main topic covered in "${task.title}"?`,
      options: [
        "Core concepts",
        "Historical context",
        "Practical applications",
        "Theoretical framework",
      ],
      correctIndex: 0,
    },
    {
      question: "How long did you plan to study this topic?",
      options: [
        "30 minutes",
        "45 minutes",
        `${task.estimatedMinutes} minutes`,
        "2 hours",
      ],
      correctIndex: 2,
    },
    {
      question: "What strategy helps retention after a study session?",
      options: [
        "Sleep immediately",
        "Active recall",
        "Re-read notes once",
        "Skip review",
      ],
      correctIndex: 1,
    },
  ];

  const pool = MOCK_BANKS[task.subject] ?? fallback;
  const questions = pool.map((q, i) => ({ id: `q-${i}`, ...q }));

  return {
    id: crypto.randomUUID(),
    taskId: task.id,
    taskTitle: task.title,
    subject: task.subject,
    questions,
    createdAt: new Date().toISOString(),
  };
}

// ─── Quiz: Instant-first, AI-upgrade ──────────────────────────────────────
/**
 * Returns a quiz instantly from the mock bank.
 * Simultaneously fires an Ollama request in background with a timeout.
 * If Ollama responds in time and is valid, calls `onAiQuiz` with the upgraded quiz.
 */
export function generateQuizInstant(
  task: Task,
  onAiQuiz?: (quiz: Quiz) => void,
): Quiz {
  const instant = generateMockQuiz(task);

  // Fire Ollama in background (no await here) – upgrade if it replies fast enough
  if (onAiQuiz) {
    withTimeout(fetchOllamaQuiz(task), OLLAMA_TIMEOUT_MS)
      .then(onAiQuiz)
      .catch(() => { /* silent fail – user already has the mock quiz */ });
  }

  return instant;
}

async function fetchOllamaQuiz(task: Task): Promise<Quiz> {
  const apiUrl = "http://localhost:11434/api/generate";
  const prompt = `You are an expert tutor in ${task.subject}.
Create a 3-question multiple choice quiz to test someone who just studied: "${task.title}".
Return ONLY a valid JSON object like this:
{"questions":[{"question":"...","options":["A","B","C","D"],"correctIndex":0}]}`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama2", prompt, stream: false, format: "json" }),
  });

  if (!res.ok) throw new Error(`Ollama ${res.status}`);
  const data = await res.json();
  let raw = (data.response ?? "").trim();
  // Robust JSON extraction: Find the first { and last }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in response");
  const cleanJson = raw.substring(start, end + 1);

  const parsed = JSON.parse(cleanJson);
  if (!Array.isArray(parsed?.questions) || parsed.questions.length === 0)
    throw new Error("bad format");

  return {
    id: crypto.randomUUID(),
    taskId: task.id,
    taskTitle: task.title,
    subject: task.subject,
    questions: parsed.questions.map(
      (q: { question: string; options: string[]; correctIndex: number }, i: number) => ({
        id: `q-${i}`,
        question: q.question,
        options: q.options ?? [],
        correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
      }),
    ),
    createdAt: new Date().toISOString(),
  };
}

// ─── Planner: Instant-first, AI-upgrade ───────────────────────────────────
/**
 * Returns a planner instantly from the mock template.
 * Simultaneously fires an Ollama request with a timeout.
 * If Ollama responds in time and is valid, calls `onAiPlanner` with upgraded entries.
 */
export function generatePlannerInstant(
  subjects: string[],
  onAiPlanner?: (entries: PlannerEntry[]) => void,
): PlannerEntry[] {
  const instant = generateMockPlanner(subjects);

  if (onAiPlanner) {
    withTimeout(fetchOllamaPlanner(subjects), OLLAMA_TIMEOUT_MS)
      .then(onAiPlanner)
      .catch(() => { /* silent fail – user already has the mock planner */ });
  }

  return instant;
}

async function fetchOllamaPlanner(subjects: string[]): Promise<PlannerEntry[]> {
  const apiUrl = "http://localhost:11434/api/generate";
  const prompt = `You are an academic advisor. Create a balanced weekly study timetable for: ${subjects.join(", ")}.
Return ONLY valid JSON like this:
{"planner":[{"day":"Monday","time":"09:00 - 10:30","subject":"...","activity":"..."}]}
Include Monday-Sunday, 3-4 sessions per day.`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama2", prompt, stream: false, format: "json" }),
  });

  if (!res.ok) throw new Error(`Ollama ${res.status}`);
  const data = await res.json();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in response");
  const cleanJson = raw.substring(start, end + 1);

  const parsed = JSON.parse(cleanJson);
  if (!Array.isArray(parsed?.planner)) throw new Error("bad format");
  return parsed.planner;
}

// ─── Direct Ollama Callers (Removed legacy mock fallbacks) ────────────────
export async function generateQuizWithOllama(task: Task): Promise<Quiz> {
  return fetchOllamaQuiz(task);
}

export async function generatePlannerWithOllama(subjects: string[]): Promise<PlannerEntry[]> {
  return fetchOllamaPlanner(subjects);
}

/**
 * Streams a quiz from Ollama, token by token.
 * - Calls `onProgress(accumulated)` after every chunk so the UI can render live.
 * - Resolves to a Quiz when the stream completes (or falls back to mock on error/timeout).
 */
export async function streamQuizFromOllama(
  task: Task,
  onProgress: (partial: string) => void,
  signal?: AbortSignal,
): Promise<Quiz> {
  const apiUrl = "http://localhost:11434/api/generate";
  
    const prompt = `Create a 3-question multiple choice quiz about "${task.title}" in ${task.subject}.
Return ONLY JSON with exactly 4 options per question.

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": number
    }
  ]
}`;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama2",
        prompt,
        stream: true,
        format: "json",
      }),
      signal,
    });

    if (!res.ok || !res.body) throw new Error(`Ollama ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value, { stream: true }).split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line) as { response?: string; done?: boolean };
          if (parsed.response) {
            accumulated += parsed.response;
            onProgress(accumulated);
          }
          if (parsed.done) break;
        } catch {
          // partial line
        }
      }
    }

    // Robust JSON extraction
    const start = accumulated.indexOf("{");
    const end = accumulated.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON found in response");
    const cleanJson = accumulated.substring(start, end + 1);

    const parsed = JSON.parse(cleanJson);
    if (!Array.isArray(parsed?.questions) || parsed.questions.length === 0)
      throw new Error("bad format");

    return {
      id: crypto.randomUUID(),
      taskId: task.id,
      taskTitle: task.title,
      subject: task.subject,
      questions: parsed.questions.map(
        (q: { question: string; options: string[]; correctIndex: number }, i: number) => {
          // Strict enforcement of 4 options
          const options = Array.isArray(q.options) && q.options.length === 4 
            ? q.options 
            : ["Option A", "Option B", "Option C", "Option D"];
            
          return {
            id: `q-${i}`,
            question: q.question || "Unknown Question?",
            options,
            correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
          };
        },
      ),
      createdAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    console.warn("Ollama stream failed, using mock:", err);
    return generateMockQuiz(task);
  }
}

