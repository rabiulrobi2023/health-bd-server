import OpenAI from "openai";
import { envVariable } from "../../config/envConfig";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: envVariable.OPEN_ROUTER_API_KEY,
});
