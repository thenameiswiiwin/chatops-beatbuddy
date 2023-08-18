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
              id: "song",
              label:
                "Deposite your favorite song and artist you like to jam to here.",
              placeholder: "Example: Essence - Wizkid ft. Tems",
              initial_value: payload.text ?? "",
              hint: "Provide the name of the song you like to jam to!",
            }),
            blocks.select({
              id: "song_genre",
              label: "Select the song's genre",
              placeholder: "Choose a genre",
              options: [
                { label: "Pop", value: "Pop" },
                { label: "Hip-Hop", value: "Hip-Hop" },
                { label: "R&B", value: "R&B" },
                { label: "Latin", value: "Latin" },
                { label: "Rock", value: "Rock" },
                { label: "Electronic", value: "Electronic" },
                { label: "Country", value: "Country" },
                { label: "Jazz", value: "Jazz" },
                { label: "Blues", value: "Blues" },
                { label: "Reggae", value: "Reggae" },
                { label: "Funk", value: "Funk" },
                { label: "Classical", value: "Classical" },
                { label: "Indie", value: "Indie" },
                { label: "Metal", value: "Metal" },
                { label: "Alternative", value: "Alternative" },
                { label: "Dance", value: "Dance" },
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

async function handleInteractivity(payload: SlackModalPayload) {
  const callback_id = payload.callback_id ?? payload.view.callback_id;

  switch (callback_id) {
    case "beatbuddy-modal":
      const data = payload.view.state.values;
      const fields = {
        songInput: data.song_block.song.value,
        songGenre: data.song_genre_block.song_genre.selected_option.value,
        submitter: payload.user.name,
      };

      await slackApi("chat.postMessage", {
        channel: "C05M7L3TAFM",
        text: `Hey y'all! :eyes: <@${payload.user.id}> just has submitted a new song:\n\n*${fields.songInput}*\n\nwith a genre of\n\n*${fields.songGenre}*\n\n...Enjoy and discuss.`,
      });

      break;

    default:
      console.log(`Callback ID ${callback_id} not supported`);
      return {
        statusCode: 400,
        body: `Callback ID ${callback_id} not supported`,
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

  if (body.payload) {
    const payload = JSON.parse(body.payload);
    return handleInteractivity(payload);
  }

  return {
    statusCode: 200,
    body: "Request successfully processed.",
  };
};
