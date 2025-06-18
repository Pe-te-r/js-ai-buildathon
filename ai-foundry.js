import { AzureOpenAI } from "openai";
import dotenv from 'dotenv'

dotenv.config()

const endpoint = "https://mburu-mc208xe7-eastus2.openai.azure.com/";
const modelName = "gpt-4o-mini";
const deployment = "gpt-4o-mini";

export async function main() {

  const apiKey = process.env.AZURE_INFERENCE_SDK_KEY
  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion }

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "I am going to Paris, what should I see?" }
    ],
    max_tokens: 4096,
    temperature: 1,
    top_p: 1,
    model: modelName
  });

  if (response?.error !== undefined && response.status !== "200") {
    throw response.error;
  }

  for (const choice of response.choices) {
    console.log(choice.message.content);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});