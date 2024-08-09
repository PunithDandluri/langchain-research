"use client";
import ClaraAI from "../Ai/azureOpenAI";
import React, { useState, useRef, useEffect } from "react";

const BotUI = (props: { message: string[] }) => {
  const [messages, setMessages] = useState<string[]>([...props.message]);
  const [input, setInput] = useState<string>("");

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const claraAI = new ClaraAI();

  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    setIsTyping(true);
    setMessages([...props.message]);
    setIsTyping(false);
  }, [props.message]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const pageContent = document.body.innerHTML.toString();
    const setInitialMessages = async () => {
      try {
        const response = await claraAI.startConversation(pageContent);
        setMessages([`Clara: ${response.content}`]);
      } catch (e) {
        console.log(e);
        setMessages([
          `Clara: Sorry, I am unable to process your request at the moment. Please try again later.`,
        ]);
      }
    };
    setInitialMessages();
  }, []);
  const handleSend = async () => {
    setIsTyping(true);
    try {
      const response = await claraAI.invoke(input);
      console.log(response);
      setIsTyping(false);
      setMessages([...messages, `You: ${input}`, `Clara: ${response.content}`]);
      setInput("");
    } catch (e) {
      console.log(e);
      setIsTyping(false);
      setMessages([
        ...messages,
        `You: ${input}`,
        `Clara: Sorry, I am unable to process your request at the moment. Please try again later.`,
      ]);
      setInput("");
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
