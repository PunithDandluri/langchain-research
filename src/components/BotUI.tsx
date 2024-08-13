"use client";

import ClaraAI from "../Ai/azureOpenAI";
import React, { useState, useRef, useEffect } from "react";

const BotUI = (props: { message: string[] }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const claraAI = ClaraAI.getInstance(); // Use Singleton instance
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMessages([...props.message]);
  }, [props.message]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const pageContent = document.body.innerHTML.toString();
    const setInitialMessages = async () => {
      setIsTyping(true);
      try {
        const response = await claraAI.startConversation(pageContent);
        setMessages((prevMessages) => [...prevMessages, `Clara: ${response}`]);
      } catch (e) {
        console.error(e);
        setMessages((prevMessages) => [
          ...prevMessages,
          `Clara: Sorry, I am unable to process your request at the moment. Please try again later.`,
        ]);
      } finally {
        setIsTyping(false);
      }
    };
    setInitialMessages();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsTyping(true);
    setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);

    try {
      const response = await claraAI.invoke(input);
      setMessages((prevMessages) => [...prevMessages, `Clara: ${response}`]);
    } catch (e) {
      console.error(e);
      setMessages((prevMessages) => [
        ...prevMessages,
        `Clara: Sorry, I am unable to process your request at the moment. Please try again later.`,
      ]);
    } finally {
      setIsTyping(false);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 bg-white shadow-lg w-1/3">
      <div className="h-64 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg}
          </div>
        ))}
        <div ref={endOfMessagesRef} />
        {isTyping && (
          <div className="w-full flex gap-5 items-center">
            <div>Clara: </div>
            <div className="typing-loader">
              <div className="typing-loader-dot"></div>
              <div className="typing-loader-dot"></div>
              <div className="typing-loader-dot"></div>
            </div>
          </div>
        )}
      </div>
      <form className="flex space-x-2" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          className="border p-2 w-full"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default BotUI;
