import { ChatGroq } from "@langchain/groq";

console.log("llm.js initialized with ChatGroq ONLY");

export const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.3,
});
