"use client";
"use client";
import ClaraAI from "../Ai/azureOpenAI";
import React, { useState, useRef, useEffect } from "react";

const BotUI = (props: { message: string[]; claraAI: ClaraAI }) => {
  const [messages, setMessages] = useState<string[]>([...props.message]);
  const [input, setInput] = useState<string>("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const claraAI = props.claraAI;
  const [isTyping, setIsTyping] = useState(false);

  // Handle new props.message updates
  useEffect(() => {
    if (props.message.length > 0) {
      setMessages((prevMessages) => [...prevMessages, ...props.message]);
    }
  }, [props.message]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start conversation only once
  

  const handleSend = async () => {
    setIsTyping(true);
    try {
      const response = await claraAI.retrievalQA(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        `You: ${input}`,
        `Clara: ${response?.response || response?.content}`,
      ]);
      setInput("");
      setIsTyping(false);
    } catch (e) {
      console.log(e);
      setMessages((prevMessages) => [
        ...prevMessages,
        `You: ${input}`,
        `Clara: Sorry, I am unable to process your request at the moment. Please try again later.`,
      ]);
      setInput("");
      setIsTyping(false);
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
      <form
        className="flex space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          className="border p-2 w-full"
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white p-2 mt-2">Send</button>
      </form>
    </div>
  );
};

export default BotUI;
