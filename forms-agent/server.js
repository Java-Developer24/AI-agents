import express from "express";
import { app as graphApp } from "./graph.js";
import { createFormQuestion } from "./microsoft/forms.js";

const server = express();
server.use(express.json());

// Serve the simple chat frontend
server.use(express.static("public"));

// Chat endpoint: sends the user's message as a `topic` to the graph
server.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Missing message" });

    const result = await graphApp.invoke({ topic: message });

    // Create Microsoft Form questions for each generated question (same as /generate)
    if (result?.questions && Array.isArray(result.questions)) {
      for (const q of result.questions) {
        try {
          await createFormQuestion(q);
        } catch (e) {
          console.error('createFormQuestion failed for question', q, e);
        }
      }
    }

    // Return generated questions (or the whole result)
    res.json({ success: true, result });
  } catch (err) {
    console.error("/chat error", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// Health check
server.get('/ping', (req, res) => res.json({ ok: true }));

server.post("/generate", async (req, res) => {
  const { topic } = req.body;

  const result = await graphApp.invoke({ topic });

  for (const q of result.questions) {
    await createFormQuestion(q);
  }

  res.json({ success: true, totalQuestions: result.questions.length });
});

server.listen(3000, () =>
  console.log("Forms Agent running on port 3000")
);
