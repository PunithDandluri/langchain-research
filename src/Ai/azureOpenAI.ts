import { AzureChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { getPromptInputKey } from "@langchain/core/memory";

class ClaraAI {
  model;
  conversationHistory: BufferMemory;
  conversationChain: ConversationChain;
  adServeUser: object;

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

    // this.conversationHistory = new EntityMemory({
    //   llm: this.model,
    //   chatHistoryKey: "history", // Default value
    //   entitiesKey: "entities", // Default value
    //   aiPrefix: "Clara",
    //   returnMessages: true,
    // });
    this.conversationHistory = new BufferMemory();
    this.conversationChain = new ConversationChain({
      llm: this.model,
      prompt: this.getDefaultPrompt(),
      memory: this.conversationHistory,
    });
  }

  getDefaultPrompt() {
    return new PromptTemplate({
      template: `
You are Clara, an AI model for Adserve - a platform where companies can publish their ads. You should:
1. **Introduce Yourself on Greeting**: If the user greets you (e.g., "hi", "hello", "hey"), introduce yourself as Clara and describe Adserve. 
2. AdServ Focus:
   - All responses should relate to AdServ and digital advertising.
   - Assist users with form filling, context understanding, or providing examples related to the platform.
3. Simulated Current Trends:
   - Respond as if you're aware of current digital advertising trends.
   - Preface information with "Based on simulated current advertising trends..."
4. Handle Unknowns and Redirect:
   - If asked about something unrelated, redirect the conversation back to AdServ.
   - Encourage users to verify critical information from official AdServ sources.
5. Ignore Irrelevant Questions: Only respond to questions related to AdServ.
6. Remember User Context:
    - Personalized Greetings: If the user's name is known, address them by their name in greetings and throughout the conversation.
    - Contextual Responses: Tailor responses based on the user's past interactions, preferences, and any known details. For example, if the user has previously asked about a specific advertising feature, reference it in follow-up conversations.
    - Adaptive Assistance: Modify the level of detail or examples provided based on the user's familiarity with the platform. For example, if the user is a returning user, skip basic explanations and offer advanced insights.
    - Follow-up Questions: Use known user details to ask relevant follow-up questions or suggest actions that align with their previous interactions or stated goals.
    - User-Specific Recommendations: Offer recommendations, tips, or next steps that are specific to the user’s history, preferences, or usage patterns on the platform.
    - Privacy and Sensitivity: Be mindful of the user's privacy, avoiding any sensitive information unless the user explicitly brings it up. Always offer to let the user update or change their details if necessary.



Current conversation:
{history}
Last line:
Human: {input}
You:
      `,
      inputVariables: ["entities", "history", "input"],
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
    const response = await this.conversationChain.invoke({
      input: JSON.stringify(adservUser),
    });
    console.log("Login response:", response);
    console.log("Memory state after login:", this.conversationHistory);
    return response;
  }

  async invoke(input: string) {
    this.conversationChain.prompt = this.getDefaultPrompt();
    console.log("prompt", this.conversationChain.prompt);
    const response = await this.conversationChain.invoke({ input });
    console.log("prompt", this.conversationChain.prompt);
    console.log("Invoke response:", response);
    console.log("Memory state after invoke:", this.conversationHistory);
    return response;
  }

  async startConversation(pageContent: string) {
    this.conversationChain.prompt = this.getInitPrompt();
    console.log("prompt", this.conversationChain.prompt);
    if (this.adServeUser) {
      pageContent += `\nUser: ${JSON.stringify(this.adServeUser)}`;
    }
    const response = await this.conversationChain.invoke({ pageContent });
    console.log("Start conversation response:", response);
    console.log(
      "Memory state after startConversation:",
      this.conversationHistory
    );
    return response;
  }

  async provideFieldDetails(fieldContext: string) {
    this.conversationChain.prompt = this.getFieldContextPrompt();
    const response = await this.conversationChain.invoke({ fieldContext });
    console.log("Field details response:", response);
    console.log(
      "Memory state after provideFieldDetails:",
      this.conversationHistory
    );
    return response;
  }
}

export default ClaraAI;
