import type { HandlerEvent } from "@netlify/functions";

import { createHmac } from "crypto";

export function slackApi(
  endpoint: SlackApiEndpoint,
  body: SlackApiRequestBody
) {
  return fetch(`https://slack.com/api/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

export function verifySlackRequest(request: HandlerEvent) {
  const secret = process.env.SLACK_SIGNING_SECRET!;
  const signature = request.headers["x-slack-signature"];
  const timestmap = Number(request.headers["x-slack-request-timestamp"]);
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestmap) > 300) {
    return false;
  }

  const hash = createHmac("sha256", secret)
    .update(`v0:${timestmap}:${request.body}`)
    .digest("hex");

  return `v0=${hash}` === signature;
}

export const blocks = {
  section: ({ text }: SectionBlockArgs): SlackBlockSection => {
    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text,
      },
    };
  },
  input: ({
    id,
    label,
    placeholder,
    initial_value = "",
    hint = "",
  }: InputBlockArgs): SlackBlockInput => {
    return {
      block_id: `${id}_block`,
      type: "input",
      label: {
        type: "plain_text",
        text: label,
      },
      element: {
        action_id: id,
        type: "plain_text_input",
        placeholder: {
          type: "plain_text",
          text: placeholder,
        },
        initial_value,
      },
      hint: {
        type: "plain_text",
        text: hint,
      },
    };
  },
  select: ({
    id,
    label,
    placeholder,
    options,
  }: SelectBlockArgs): SlackBlockInput => {
    return {
      block_id: `${id}_block`,
      type: "input",
      label: {
        type: "plain_text",
        text: label,
      },
      element: {
        action_id: id,
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: placeholder,
          emoji: true,
        },
        options: options.map(({ label, value }) => {
          return {
            text: {
              type: "plain_text",
              text: label,
              emoji: true,
            },
            value,
          };
        }),
      },
    };
  },
};
