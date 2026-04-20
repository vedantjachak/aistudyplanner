const MOCK_BANKS = {
  Mathematics: [
    {
      question: "What is the determinant of a 2×2 identity matrix?",
      options: ["0", "1", "2", "−1"],
      correctIndex: 1
    },
    {
      question: "Which operation is the inverse of integration?",
      options: [
        "Addition",
        "Differentiation",
        "Multiplication",
        "Exponentiation"
      ],
      correctIndex: 1
    },
    {
      question: "What is the sum of angles in a triangle?",
      options: ["90°", "180°", "270°", "360°"],
      correctIndex: 1
    }
  ],
  Physics: [
    {
      question: "What is Newton's 2nd law?",
      options: ["F = ma", "E = mc²", "v = d/t", "p = mv"],
      correctIndex: 0
    },
    {
      question: "What unit measures electrical resistance?",
      options: ["Ampere", "Volt", "Ohm", "Watt"],
      correctIndex: 2
    },
    {
      question: "What type of wave is light?",
      options: ["Mechanical", "Longitudinal", "Electromagnetic", "Sound"],
      correctIndex: 2
    }
  ],
  Chemistry: [
    {
      question: "What is the atomic number of Carbon?",
      options: ["6", "12", "14", "8"],
      correctIndex: 0
    },
    {
      question: "What type of bond involves electron sharing?",
      options: ["Ionic", "Metallic", "Covalent", "Hydrogen"],
      correctIndex: 2
    },
    {
      question: "What is the pH of a neutral solution at 25°C?",
      options: ["0", "7", "14", "1"],
      correctIndex: 1
    }
  ],
  "Computer Science": [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      correctIndex: 2
    },
    {
      question: "Which data structure uses LIFO order?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correctIndex: 1
    },
    {
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Core Processing Unit",
        "Central Power Unit",
        "Computer Processing Utility"
      ],
      correctIndex: 0
    }
  ]
};
function generateMockQuiz(task) {
  const fallback = [
    {
      question: `What is the main topic covered in "${task.title}"?`,
      options: [
        "Core concepts",
        "Historical context",
        "Practical applications",
        "Theoretical framework"
      ],
      correctIndex: 0
    },
    {
      question: "How long did you plan to study this topic?",
      options: [
        "30 minutes",
        "45 minutes",
        `${task.estimatedMinutes} minutes`,
        "2 hours"
      ],
      correctIndex: 2
    },
    {
      question: "What strategy helps retention after a study session?",
      options: [
        "Sleep immediately",
        "Active recall",
        "Re-read notes once",
        "Skip review"
      ],
      correctIndex: 1
    }
  ];
  const pool = MOCK_BANKS[task.subject] ?? fallback;
  const questions = pool.map((q, i) => ({ id: `q-${i}`, ...q }));
  return {
    id: crypto.randomUUID(),
    taskId: task.id,
    taskTitle: task.title,
    subject: task.subject,
    questions,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function generateQuizWithOllama(task) {
  const modelName = "llama2";
  const apiUrl = "http://localhost:11434/api/generate";
  const prompt = `You are an expert tutor in ${task.subject}.
Create a 3-question multiple choice quiz to test someone who just studied: "${task.title}".
Return the response strictly as a JSON object matching this schema:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": number (from 0 to 3)
    }
  ]
}
Do not return any other text or explanation, only the JSON block.`;
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false,
        format: "json"
        // Note: Some Ollama models restrict format: "json" strictly. If it fails, we fall back to mock.
      })
    });
    if (!res.ok) {
      throw new Error(`Ollama API Error: ${res.statusText}`);
    }
    const data = await res.json();
    let jsonContent = data.response.trim();
    if (jsonContent.startsWith("```json")) {
      jsonContent = jsonContent.substring(7);
    }
    if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.substring(3);
    }
    if (jsonContent.endsWith("```")) {
      jsonContent = jsonContent.substring(0, jsonContent.length - 3);
    }
    const parsed = JSON.parse(jsonContent);
    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("Invalid response format from Ollama.");
    }
    return {
      id: crypto.randomUUID(),
      taskId: task.id,
      taskTitle: task.title,
      subject: task.subject,
      questions: parsed.questions.map((q, i) => ({
        id: `q-${i}`,
        question: q.question,
        options: q.options || [],
        correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0
      })),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error("Failed to generate quiz with Ollama, falling back to mock:", error);
    return generateMockQuiz(task);
  }
}
async function generatePlannerWithOllama(subjects) {
  const modelName = "llama2";
  const apiUrl = "http://localhost:11434/api/generate";
  const prompt = `You are an academic advisor. Create a balanced weekly study timetable for a student studying these subjects: ${subjects.join(", ")}.
Return the response strictly as a JSON object matching this schema:
{
  "planner": [
    {
      "day": "Monday",
      "time": "09:00 - 10:30",
      "subject": "string",
      "activity": "string"
    }
  ]
}
Include entries for Monday through Sunday. Provide 3-4 study blocks per day.
Do not return any other text or explanation, only the JSON block.`;
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false,
        format: "json"
      })
    });
    if (!res.ok) {
      throw new Error(`Ollama API Error: ${res.statusText}`);
    }
    const data = await res.json();
    let jsonContent = data.response.trim();
    if (jsonContent.startsWith("```json")) jsonContent = jsonContent.substring(7);
    if (jsonContent.startsWith("```")) jsonContent = jsonContent.substring(3);
    if (jsonContent.endsWith("```")) jsonContent = jsonContent.substring(0, jsonContent.length - 3);
    const parsed = JSON.parse(jsonContent);
    if (!parsed || !Array.isArray(parsed.planner)) {
      throw new Error("Invalid response format from Ollama.");
    }
    return parsed.planner;
  } catch (error) {
    console.error("Failed to generate planner with Ollama, falling back to mock:", error);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const mockEntries = [];
    days.forEach((day) => {
      subjects.forEach((sub, i) => {
        if (i < 3) {
          mockEntries.push({
            day,
            time: `${9 + i * 2}:00 - ${11 + i * 2}:00`,
            subject: sub,
            activity: `Study session for ${sub}`
          });
        }
      });
    });
    return mockEntries;
  }
}
export {
  generatePlannerWithOllama as a,
  generateQuizWithOllama as g
};
