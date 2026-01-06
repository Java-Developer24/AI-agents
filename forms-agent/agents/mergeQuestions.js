export function mergeQuestions(state) {
  state.questions.push(...state.aiQuestions);
  return state;
}
