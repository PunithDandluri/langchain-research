"use client";
import AdForm from "@/components/AdForm";
import BotUI from "@/components/BotUI";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ClaraAI from "@/Ai/azureOpenAI";

const adserveUser = {
  userDetails: {
    userId: "user123",
    firstName: "Punith",
    lastName: "Jain",
    email: "rahul.jain@zomato.com",
    contactNumber: "+91 9876543210",
    role: "Marketing Manager",
    accountCreated: "2023-01-15",
  },
  companyDetails: {
    companyId: "zomato001",
    companyName: "Zomato",
    industry: "Food & Beverage",
    website: "https://www.zomato.com",
    headquarters: {
      address: "Ground Floor, B Wing, DLF Corporate Park",
      city: "Gurugram",
      state: "Haryana",
      country: "India",
      postalCode: "122002",
    },
    contactEmail: "contact@zomato.com",
    contactNumber: "+91 124 418 0600",
  },
  adPreferences: {
    targetAudience: "Urban millennials interested in food and dining",
    preferredPlatforms: ["Social Media", "Search Engines", "Mobile Apps"],
    adBudget: {
      currency: "INR",
      amount: 1000000,
      duration: "Monthly",
    },
    objectives: ["Brand Awareness", "Lead Generation", "Customer Retention"],
    pastCampaigns: [
      {
        campaignId: "camp001",
        name: "Zomato Gold",
        startDate: "2024-05-01",
        endDate: "2024-05-31",
        budget: 500000,
        platforms: ["Instagram", "Google"],
        performanceMetrics: {
          impressions: 5000000,
          clicks: 150000,
          conversions: 5000,
          costPerClick: 3.33,
        },
      },
      {
        campaignId: "camp002",
        name: "Dining Out Campaign",
        startDate: "2024-06-01",
        endDate: "2024-06-30",
        budget: 750000,
        platforms: ["Facebook", "Google"],
        performanceMetrics: {
          impressions: 7500000,
          clicks: 225000,
          conversions: 7500,
          costPerClick: 3.33,
        },
      },
    ],
  },
};

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLogged, setIsLogged] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const claraAI = new ClaraAI();
  // useEffect(() => {
  //   const startInitialConversation = async () => {
  //     try {
  //       const response = await claraAI.invoke("start");
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         `Clara: ${response?.response}`,
  //       ]);
  //     } catch (e) {
  //       console.log(e);
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         `Clara: Sorry, I am unable to process your request at the moment. Please try again later.`,
  //       ]);
  //     }
  //   };
  //   startInitialConversation();
  // }, []);
  const handleLogin = async () => {
    setLoading(true);
    setIsTyping(true);
    try {
      const response = await claraAI.login(adserveUser);
      setMessages([...messages, `Clara: ${response?.response}`]);
      setIsLogged(true);
    } catch (error) {
      console.error("Error logging in:", error);
      setMessages([
        ...messages,
        `Clara: Sorry, I am unable to process your request at the moment. Please try again later.`,
      ]);
    }
    setLoading(false);
    setIsTyping(false);
  };
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
      setMessages([...messages, `Clara: ${response?.response}`]);
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
        <div
          id="Login Button"
          className="flex justify-center items-center gap-2">
          <button
            className="bg-blue-500 text-white p-2 mt-2"
            onClick={handleLogin}>
            {loading ? "Loading..." : isLogged ? "Logout" : "Login"}
          </button>
        </div>
        <AdForm setMessage={setMessages} handleFocus={handleFocus} />
        <BotUI message={messages} claraAI={claraAI} />
      </div>
    </main>
  );
}
