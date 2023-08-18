import { type Handler, schedule } from "@netlify/functions";
import { getNewItems } from "./utils/notion";
import { blocks, slackApi } from "./utils/slack";

const postNewNotionItemsToSlack: Handler = async () => {
  const items = await getNewItems();

  await slackApi("chat.postMessage", {
    channel: process.env.CHANNEL_ID,
    blocks: [
      blocks.section({
        text: [
          "Hey y'all! :eyes: a new song has been submitted:",
          "",
          ...items.map(
            (item) => `- ${item.song} (song genre: ${item.songGenre})`
          ),
          "",
          `See all songs here: <https://notion.so/${process.env.NOTION_DATABASE_ID}|in Notion>`,
        ].join("\n"),
      }),
    ],
  });

  return {
    statusCode: 200,
  };
};

export const handler = schedule("0 9 * * 1", postNewNotionItemsToSlack);
