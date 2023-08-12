import type { Handler } from "@netlify/functions";

import { parse } from "querystring";
import { blocks, modal, slackApi, verifySlackRequest } from "./utils/slack";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
  switch (payload.command) {
    case "/beatbuddy":
      const res = await slackApi(
        "views.open",
        modal({
          id: "beatbuddy-modal",
          title: "Start sharing!",
          trigger_id: payload.trigger_id,
          blocks: [
            blocks.section({
              text: "Welcome to BeatBuddy!\n\nGet ready to groove with your favorite tunes. Share the music that gets you in the zone and lets your creativity flow. Whether it's your all-time favorite song or the artist that brings out your musical spirit, let's create some awesome rhythms together!",
            }),
            blocks.input({
              id: "song-input",
              label:
                "Deposite your favorite song and artist you like to jam to here.",
              placeholder: "Example: Essence - Wizkid ft. Tems",
              initial_value: payload.text ?? "",
              hint: "Provide the name of the song you like to jam to!",
            }),
            blocks.select({
              id: "song-genre",
              label: "Select the song's genre",
              placeholder: "Choose a genre",
              options: [
                { label: "Pop", value: "pop" },
                { label: "Hip-Hop", value: "hip-hop" },
                { label: "R&B", value: "r&b" },
                { label: "Latin", value: "latin" },
                { label: "Rock", value: "rock" },
                { label: "Electronic", value: "electronic" },
                { label: "Country", value: "country" },
                { label: "Jazz", value: "jazz" },
                { label: "Blues", value: "blues" },
                { label: "Reggae", value: "reggae" },
                { label: "Funk", value: "funk" },
                { label: "Classical", value: "classical" },
                { label: "Indie", value: "indie" },
                { label: "Metal", value: "metal" },
                { label: "Alternative", value: "alternative" },
                { label: "Dance", value: "dance" },
              ],
            }),
          ],
        })
      );

      if (!res.ok) {
        console.log(res);
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
  const valid = verifySlackRequest(event);
  if (!valid) {
    console.error("Invalid request");

    return {
      statusCode: 400,
      body: "Invalid request",
    };
  }

  const body = parse(event.body ?? "") as SlackPayload;
  if (body.command) {
    return handleSlashCommand(body as SlackSlashCommandPayload);
  }

  return {
    statusCode: 200,
    body: "Request successfully processed.",
  };
};
