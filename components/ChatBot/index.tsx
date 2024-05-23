'use client';
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { ChatBotProps } from "./type";
import styles from "./index.module.css";

const ChatBotClient: React.FC<ChatBotProps> = (props) => {
  const { initialMessages } = props;

  const [prompt, setPrompt] = useState<string>("");
  const [messageQueue, setMessageQueue] = useState<
    { type: string; text: string }[]
  >(initialMessages ?? []);
  const [isSending, setIsSending] = useState<boolean>(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (prompt.trim() === "" || isSending) return;

    setIsSending(true);
    const newMessage = { type: "user", text: prompt };
    setMessageQueue([...messageQueue, newMessage, { type: "bot", text: "loading..." }]);
    setPrompt("");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt, messageQueue: [...messageQueue, newMessage] }),
      });

      const data = await res.json();
      const responseMessage = {
        type: 'bot',
        text: data.message,
      };

      setMessageQueue((prevQueue) => {
        const newQueue = [...prevQueue];
        newQueue[newQueue.length - 1] = responseMessage;
        return newQueue;
      });
    } catch (error) {
      setMessageQueue((prevQueue) => {
        const newQueue = [...prevQueue];
        newQueue[newQueue.length - 1] = { type: 'bot', text: 'Error occurred. Please try again.' };
        return newQueue;
      });
    }

    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSending) {
      handleSend();
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the message list when a new message is added
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messageQueue]);

  return (
    <div className={styles["page-container"]}>
      {messageQueue.length === 0 && (
        <div className={styles["message-title"]}>春座 AI</div>
      )}
      {messageQueue.length > 0 && (
        <div className={styles["message-list"]} ref={messageListRef}>
          <div className={styles["message-wrapper"]}>
            {messageQueue.map((message, index) => (
              <div
                key={index}
                className={classNames(styles.message, styles[message.type])}
              >
                {message.text}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles["input-container"]}>
        <input
          className={styles["prompt-input"]}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className={classNames(styles["prompt-button"], {
            [styles["button-disabled"]]: isSending,
          })}
          onClick={handleSend}
          disabled={isSending}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default ChatBotClient;