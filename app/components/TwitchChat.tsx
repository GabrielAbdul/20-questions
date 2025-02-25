"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "tmi.js";

interface Props {
  channel: string;
}

const TwitchChat: React.FC<Props> = ({ channel }) => {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      channels: [channel],
    });

    client.connect();

    client.on("message", (channel, userstate, message, self) => {
      setChatMessages((prevMessages) => {
        const newMessages = [...prevMessages, `${userstate["display-name"]}: ${message}`];
        if (newMessages.length > 15) {
          newMessages.shift();
        }
        return newMessages;
      });
    });

    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [channel]);
  if (!channel) {return;}

  return (
    <div className="max-h-full">
      {chatMessages.map((msg, index) => (
        <p key={index} className="text-gray-700 dark:text-gray-400">
          {msg}
        </p>
      ))}
    </div>
  );
};

export default TwitchChat;