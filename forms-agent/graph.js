import { StateGraph } from "@langchain/langgraph";
import { z } from "zod";  // Import Zod for schema validation
import { llm } from "./llm.js";
import { addDefaultQuestions } from "./agents/defaultQuestions.js";
import { generateQuestions } from "./agents/generateQuestions.js";
import { validateQuestions } from "./agents/validateQuestions.js";
import { mergeQuestions } from "./agents/mergeQuestions.js";

// Define a Zod schema for the state input
const stateSchema = z.object({
  topic: z.string(),
  questions: z.array(z.object({
    type: z.string(),
    title: z.string(),
    choices: z.optional(z.array(z.string())),
  })),
  aiQuestions: z.array(z.object({
    type: z.string(),
    title: z.string(),
    choices: z.optional(z.array(z.string())),
  })),
});

// Create the initial state and validate it using the Zod schema
const initialState = stateSchema.parse({
  topic: "",
  questions: [],
  aiQuestions: [],
});

// Create the StateGraph using the Zod schema as the graph definition
// and provide the validated initial state via options.
const graph = new StateGraph(stateSchema, {
  callbacks: [],  // Use your callbacks here if needed
  initialState,
});

graph.addNode("defaults", addDefaultQuestions);
graph.addNode("generate", generateQuestions);
graph.addNode("validate", validateQuestions);
graph.addNode("merge", mergeQuestions);

graph.setEntryPoint("defaults");
graph.addEdge("defaults", "generate");
graph.addEdge("generate", "validate");
graph.addEdge("validate", "merge");

export const app = graph.compile();
