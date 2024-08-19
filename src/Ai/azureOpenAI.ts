import { AzureChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { EntityMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { AzureOpenAIEmbeddings } from "@langchain/openai";

class ClaraAI {
  private static instance: ClaraAI;
  model;
  conversationHistory: EntityMemory;
  conversationChain: ConversationChain;
  adServeUser: object;
  embeddings: AzureOpenAIEmbeddings;
  dbName: string = "your_database_name";
  collectionName: string = "your_collection_name";
  constructor() {
    this.model = new AzureChatOpenAI({
      azureOpenAIApiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName:
        process.env.NEXT_PUBLIC_AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName:
        process.env.NEXT_PUBLIC_AZURE_OPENAI_API_DEPLOYMENT_NAME,
      azureOpenAIApiVersion: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_VERSION,
    });
    this.adServeUser = {};

    this.conversationHistory = new EntityMemory({
      llm: this.model,
      aiPrefix: "Clara",
      chatHistoryKey: "history",
      entitiesKey: "entities",
      returnMessages: true,
    });
    this.conversationChain = new ConversationChain({
      llm: this.model,
      prompt: this.getDefaultPrompt(),
      memory: this.conversationHistory,
    });
    this.embeddings = new AzureOpenAIEmbeddings({
      azureOpenAIApiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName:
        process.env.NEXT_PUBLIC_AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName:
        process.env.NEXT_PUBLIC_AZURE_OPENAI_API_DEPLOYMENT_NAME,
      azureOpenAIApiVersion: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_VERSION,
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ClaraAI();
    }
    return this.instance;
  }

  getDefaultPrompt() {
    return new PromptTemplate({
      template: `
     You are Clara, an AI assistant for Adserve - a platform where companies can publish their ads. You should:
      1. **Maintain Context**: Keep track of the user's name and any other relevant information they provide. Use this information consistently in your responses.
      2. Focus primarily on AdServe and digital advertising, but respond politely to basic user queries.
      3. Assist with form filling, context understanding, and provide examples related to the platform.
      4. When discussing trends, preface with "Based on simulated current advertising trends..."
      5. For unrelated topics, acknowledge briefly and redirect the conversation back to AdServe.
      6. Encourage users to verify critical information from official AdServe sources.
      7. Personalize responses based on user context when available.
      8. Adapt assistance level based on user familiarity with the platform.
      9. Offer user-specific recommendations based on their history and preferences.
      10. Respect user privacy and avoid mentioning sensitive information unless explicitly brought up by the user.

      Current conversation:
      {history}
      Last line:
      Human: {input}
      You:
      `,
      inputVariables: ["history", "input"],
    });
  }

  getGreetingPrompt() {
    return ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(`
User Details:
{input}
If the user details are not available, ask the user to login again.
if the user details are available, greet the user and ask how you can help based on the all the details of user.
        `),
    ]);
  }

  getInitPrompt() {
    return ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate(`
        You are Clara, an AI Expert for Adserve - a platform where companies can publish their ads.
1. Introduce yourself as Clara and provide a brief description of the Adserve platform.
2. Summarize the content of the current page based on the following HTML:
{pageContent}
Don't forget to include the following points in your response:
1. Start the summary with "This page helps you to...".
2. Don't mention this is an HTML page or use phrases like "seems like".
3. Personalize the response using the user context if available.

        `),
    ]);
  }
  getDocumentBasedRAGQAPrompt() {
    return ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate(`
        You are Clara, an AI Expert for Adserve - a platform where companies can publish their ads.
        1. Provide an answer to the user's question based on the following context:
        {question}
        2. Include the following points in your response:
         - Provide a concise and accurate answer.
         - If the answer is not available, acknowledge that and suggest a related topic.
         - Personalize the response using the user context if available.
         - Encourage the user to explore more on the Adserve platform.
         - Check in the chat history for any relevant information.
  `),
    ]);
  }
  getFieldContextPrompt() {
    return ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate(`
        You are Clara, an AI Expert for Adserve - a platform where companies can publish their ads.
        1. Provide the field details based on the following context:
              
        {fieldContext}
      
        2. Include the following points in your response:
         - Dont tell the user about code or technical details.
         - Describe the field purpose and provide examples.
         - if user details are available, personalize the response using the user context.
  `),
    ]);
  }

  async login(adservUser: object) {
    this.adServeUser = adservUser;
    this.conversationChain.prompt = this.getGreetingPrompt();
    try {
      const response = await this.conversationChain.invoke({
        input: JSON.stringify(adservUser),
      });
      console.log("Login response:", response);
      console.log(
        "Memory state after login:",
        this.conversationHistory.chatHistory
      );
      return response;
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  async invoke(input: string) {
    this.conversationChain.prompt = this.getDefaultPrompt();
    try {
      const response = await this.conversationChain.invoke({ input });
      // const response = await this.retrievalQA(input);
      console.log("Invoke response:", response);
      console.log(
        "Memory state after invoke:",
        this.conversationHistory.chatHistory
      );
      return response;
    } catch (error) {
      console.error("Invoke error:", error);
    }
  }

  async startConversation(pageContent: string) {
    this.conversationChain.prompt = this.getInitPrompt();
    if (this.adServeUser) {
      pageContent += `\nUser: ${JSON.stringify(this.adServeUser)}`;
    }
    try {
      const response = await this.conversationChain.invoke({ pageContent });
      console.log("Start conversation response:", response);
      console.log(
        "Memory state after startConversation:",
        this.conversationHistory
      );
      return response;
    } catch (error) {
      console.error("Start conversation error:", error);
    }
  }

  async provideFieldDetails(fieldContext: string) {
    this.conversationChain.prompt = this.getFieldContextPrompt();
    try {
      const response = await this.conversationChain.invoke({ fieldContext });
      console.log("Field details response:", response);
      console.log(
        "Memory state after provideFieldDetails:",
        this.conversationHistory
      );
      return response;
    } catch (error) {
      console.error("Field details error:", error);
    }
  }

  // Call API route for RetrievalQA
  async retrievalQA(question: string) {
    const contextData = await fetch(
      "http://localhost:3000/api/retrieveDocuments",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question }),
        redirect: "follow",
      }
    );
    console.log("Context data:", contextData);
    const jsonData = await contextData.json();
    const humanAbleAnswer = await this.generateAnswer(
      question,
      JSON.stringify(jsonData)
    );
    return humanAbleAnswer;
  }

  async generateAnswer(question: string, documentsContent: string) {
    try {
      //log document content
      console.log("Document content:", documentsContent);
      this.conversationChain.prompt = this.getDocumentBasedRAGQAPrompt();
      this.conversationHistory.saveContext(
        {
          human:
            "This is the document content for my next question: " +
            documentsContent,
        },
        {
          clara: "okay, now ask me question based on it",
        }
      );
      console.log(this.conversationHistory.chatHistory);
      const response = await this.conversationChain.invoke({
        question,
      });
      console.log("Generate answer response:", response);
      return response;
    } catch (error) {
      console.error("Generate answer error:", error);
      return;
    }
  }
}

export default ClaraAI;
