import { createGroq } from "@ai-sdk/groq";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";

import { delay } from "@/lib/delay";
import { getWeather } from "@/lib/weather";

export const maxDuration = 30;

const LLAMA_MODEL = "llama-3.3-70b-versatile";
const DEEPSEEK_MODEL = "deepseek-r1-distill-llama-70b";

const groq = createGroq({
  fetch: async (url, options) => {
    if (options?.body) {
      const body = JSON.parse(options.body as string);
      if (body?.model === DEEPSEEK_MODEL) {
        body.reasoning_format = "parsed";
        options.body = JSON.stringify(body);
      }
    }

    return fetch(url, options);
  },
});

export async function POST(req: Request) {
  const { messages, model = LLAMA_MODEL } = await req.json();

  console.log(messages);

  const result = streamText({
    model: groq(model),
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...convertToCoreMessages(messages),
    ],
    maxSteps: 3,
    tools: {
      weather: tool({
        description:
          "Hãy thử lấy thông tin thời tiết cho địa điểm nơi bạn ở và làm việc",
        parameters: z.object({
          location: z
            .string()
            .describe("Địa điểm bạn muốn xem thông tin thời tiết"),
        }),
        execute: async ({ location }) => {
          return await getWeather(location);
        },
      }),
      delay: tool({
        description: "Pauses the chatbot for a given duration",
        parameters: z.object({
          duration: z
            .number()
            .positive()
            .describe("The duration to pause in seconds"),
        }),
        execute: async ({ duration }) => {
          return await delay(duration);
        },
      }),
    },
  });

  // console.log(result);

  // console.log(
  //   result.toDataStreamResponse({
  //     sendUsage: true,
  //   })
  // );

  return result.toDataStreamResponse({
    // sendReasoning: true,
    sendUsage: true,
  });
}

const SYSTEM_PROMPT = `You are a helpful AI assistant demonstrating the shadcn-chatbot-kit component library. You aim to be helpful and knowledgeable while showing off the UI capabilities of the chat interface.`;
