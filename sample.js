import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import path from 'path';
import fs from 'fs'

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-nano";

export async function main() {
  const imagePath = path.join(process.cwd(), 'contoso_layout_sketch.jpg');
  console.log(imagePath)
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64')

  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a senior frontend developer." },
        {
          role: "user", content: [
            {
              type: "text",
              text: "write HTML and CSS code for a simple webpage based on the following sketch:",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              },
					}
				]
},      ],
      temperature: 1.0,
      top_p: 1.0,
      model: model
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});


