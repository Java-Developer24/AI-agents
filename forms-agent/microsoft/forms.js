import axios from "axios";
import { getToken } from "./auth.js";

// LangSmith tracing is now automatically handled when the environment variables are set
// No need to import or instantiate LangSmithTracer

export async function createFormQuestion(question) {
  try {
    // No need to manually track the start and end, LangSmith will handle it
    const token = await getToken();
    await axios.post(
      `https://graph.microsoft.com/v1.0/forms/${process.env.FORM_ID}/questions`,
      question,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Automatically traced, no need for tracer.onEnd
  } catch (e) {
    // If an error occurs, LangSmith will automatically capture it via environment variables
    throw e;
  }
}
