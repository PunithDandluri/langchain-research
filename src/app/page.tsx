"use client";
import AdForm from "@/components/AdForm";
import BotUI from "@/components/BotUI";
import Image from "next/image";
import React, { useState } from "react";
import ClaraAI from "@/Ai/azureOpenAI";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const claraAI = new ClaraAI();
  const handleFocus = async (
    e: React.FocusEvent<
      | HTMLInputElement
      | HTMLFormElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => {
    const field = e.target;
    const fieldContext = `Field Label: ${
      field.getAttribute("aria-label") || field.getAttribute("placeholder")
    }\nField Type: ${
      field.type
    }\nPurpose: Describe what this field is for and examples.\n Field Value: ${
      field.value
    }\nField Name: ${field.name}\nFieldCode: ${field.innerHTML.toString()}`;

    try {
      const response = await claraAI.provideFieldDetails(fieldContext);
      setMessages([...messages, `Clara: ${response.content}`]);
    } catch (error) {
      console.error("Error fetching field details:", error);
      setMessages([
        ...messages,
        `Clara: Sorry, I am unable to process your request at the moment. Please try again later.`,
      ]);
    }
  };
  return (
    <main className="h-full w-full flex justify-center items-center gap-10">
      <div>
        <AdForm setMessage={setMessages} handleFocus={handleFocus} />
        <BotUI message={messages} />
      </div>
    </main>
  );
}
