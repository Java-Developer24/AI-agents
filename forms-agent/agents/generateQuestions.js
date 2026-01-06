import { llm } from "../llm.js";

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

function extractPossibleJsonArray(objOrText) {
  // If we already have an array, return it
  if (Array.isArray(objOrText)) return objOrText;

  // If it's an object, try common fields that might contain text or outputs
  if (typeof objOrText === "object" && objOrText !== null) {
    // Common shapes: { outputs: [...] }, { text: '...' }, { choices: [...] }
    if (Array.isArray(objOrText.outputs) && objOrText.outputs.length) {
      // Try to gather textual parts and parse
      const joined = objOrText.outputs
        .map((o) => (o?.content?.[0]?.text ?? o?.text ?? JSON.stringify(o)))
        .join("\n");
      const maybe = tryParseJson(joined);
      if (Array.isArray(maybe)) return maybe;
    }
    if (typeof objOrText.text === "string") {
      const maybe = tryParseJson(objOrText.text);
      if (Array.isArray(maybe)) return maybe;
    }
    if (Array.isArray(objOrText.choices)) return objOrText.choices;
  }

  // If it's a string, try direct parse or extract a JSON array substring
  if (typeof objOrText === "string") {
    const direct = tryParseJson(objOrText);
    if (Array.isArray(direct)) return direct;

    // Try to find a JSON array inside the string
    const match = objOrText.match(/(\[\s*\{[\s\S]*\}\s*\])/m);
    if (match) {
      const inner = tryParseJson(match[1]);
      if (Array.isArray(inner)) return inner;
    }
  }

  return null;
}

export async function generateQuestions(state) {
  const prompt = `Generate exactly 5 questions for the topic:\n${state.topic}\n\nRules:\n- Mix text and multiple choice\n- Output JSON only\n- No explanations\n\nFormat:\n[\n  { "type": "text", "title": "Question" },\n  { "type": "choice", "title": "Question", "choices": ["A","B","C","D"] }\n]\n`;

  const response = await llm.invoke(prompt);

  // Normalize the response to an array of questions, handling several shapes
  let parsed = null;
  if (response == null) {
    throw new Error("No response from LLM");
  }

  // response.content may already be a parsed object in some LLM wrappers
  const raw = response.content ?? response;

  // Try common paths
  parsed = extractPossibleJsonArray(raw);
  if (!parsed) parsed = extractPossibleJsonArray(typeof raw === 'string' ? tryParseJson(raw) : raw);

  if (!parsed) {
    // Last resort: try to parse as string
    const asString = typeof raw === 'string' ? raw : JSON.stringify(raw);
    parsed = extractPossibleJsonArray(asString);
  }

  if (!parsed) {
    console.error('generateQuestions: unable to parse LLM response', response);
    throw new Error('Unable to parse LLM response as a JSON array of questions');
  }

  // Ensure exactly 5 questions: trim or pad (if needed) to satisfy validation
  const trimmed = Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  state.aiQuestions = trimmed;
  return state;
}
