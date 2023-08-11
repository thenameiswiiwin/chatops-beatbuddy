type SlackApiEndpoint = "chat.postMessage" | "views.open";

type SlackApiRequestBody = {};

type SlackSlashCommandPayload = {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  api_app_id: string;
  is_enterprise_install: boolean;
  response_url: string;
  trigger_id: string;
  payload: never;
};

type SlackInteractivityPayload = {
  payload: string;
  command: never;
};

type SlackPayload = SlackSlashCommandPayload | SlackInteractivityPayload;

type SectionBlockArgs = {
  text: string;
};

type BlockArgs = {
  id: string;
  label: string;
  placeholder: string;
};

type InputBlockArgs = {
  initial_value?: string;
  hint?: string;
} & BlockArgs;

type SelectBlockArgs = {
  options: {
    label: string;
    value: string;
  }[];
} & BlockArgs;

type SlackBlockSection = {
  type: "section";
  text: {
    type: "plain_text" | "mrkdwn";
    text: string;
    verbatim?: boolean;
  };
};

type SlackBlockInput = {
  type: "input";
  block_id: string;
  label: {
    type: "plain_text";
    text: string;
    emoji?: boolean;
  };
  hint?: {
    type: "plain_text";
    text: string;
    emoji?: boolean;
  };
  optional?: boolean;
  dispatch_action?: boolean;
  element: {
    type: string;
    action_id: string;
    placeholder?: {
      type: string;
      text: string;
      emoji?: boolean;
    };
    options?: {
      text: {
        type: "plain_text";
        text: string;
        emoji?: boolean;
      };
      value: string;
    }[];
    initial_value?: string;
    dispatch_action_config?: {
      trigger_actions_on: string[];
    };
  };
};

type SlackBlock = SlackBlockSection | SlackBlockInput;
