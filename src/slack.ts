import type { Handler } from "@netlify/functions";

import { parse } from "querystring";
import { slackApi } from "./utils/slack";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
  switch (payload.command) {
    case "/beatbuddy":
      const response = await slackApi("chat.postMessage", {
        channel: payload.channel_id,
        text: "Things are happening!",
      });

      if (!response.ok) {
        console.log(response);
      }

      break;

    default:
      return {
        statusCode: 200,
        body: `Command ${payload.command} not supported`,
      };
  }

  return {
    statusCode: 200,
    body: "",
  };
}

export const handler: Handler = async (event) => {
  const body = parse(event.body ?? "") as SlackPayload;
  if (body.command) {
    return handleSlashCommand(body as SlackSlashCommandPayload);
  }

  return {
    statusCode: 200,
    body: "Hello World",
  };
};
