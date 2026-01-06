export function validateQuestions(state) {
  if (!Array.isArray(state.aiQuestions) || state.aiQuestions.length !== 5) {
    throw new Error("AI must generate exactly 5 questions");
  }
  return state;
}
