import { toast } from "react-toastify";

export const showToast = (msg, type) => {
  const props = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  switch (type) {
    case "success":
      toast.success(msg, props);
      break;
    case "warn":
      toast.warn(msg.props);
      break;
    case "error":
      toast.error(msg, props);
      break;
    default:
      toast(msg, props);
      break;
  }
};

const getChatGPTPrompt = (messages) =>
  `Could you please provide two suggestions on how to respond to this message? I would appreciate if the suggestions are between 5 and 6 words, concise and thoughtful. The message is ${messages[0].text}`;

export const getChatGPTResponsePayload = (messages) => {
  return {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: getChatGPTPrompt(messages),
      },
    ],
    temperature: 0.7,
  };
};

export const removeDigits = (string) => {
  return string.replace(/[0-9.]/g, "");
};

export const removeQuotes = (string) => {
  return string.replace(/"/g, "");
};

export const getMessagesWithoutDigitsAndQuotes = (messages) => {
  const result = [];

  for (const message of messages) {
    const messageWithoutDigits = removeDigits(message);
    const messageWithoutQuotes = removeQuotes(messageWithoutDigits);

    result.push(messageWithoutQuotes);
  }

  return result;
};
