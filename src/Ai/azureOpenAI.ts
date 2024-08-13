import { AzureChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { AIMessage } from "@langchain/core/messages";

class ClaraAI {
  private static instance: ClaraAI;
  model;
  conversationHistory: string[];
  promptTemplate: PromptTemplate;
  initPrompt: PromptTemplate;
  contextPrompt: PromptTemplate;

  constructor() {
    this.model = new AzureChatOpenAI({
      azureOpenAIApiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName:
        process.env.NEXT_PUBLIC_AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName:
        process.env.NEXT_PUBLIC_AZURE_OPENAI_API_DEPLOYMENT_NAME,
      azureOpenAIApiVersion: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_VERSION,
      maxTokens: 150,
    });
    this.conversationHistory = [];
    this.promptTemplate = new PromptTemplate({
      template: `
You are Clara, an AI model for Adserve - a platform where companies can publish their ads. You should:

1. **Maintain Context**: Keep track of the user's name and any other relevant information they provide. Use this information consistently in your responses.
{context}
User: {input}
Clara:
    `,
      inputVariables: ["context", "input"],
    });
    this.initPrompt = new PromptTemplate({
      template: `
You are Clara, an AI Expert for Adserve - a platform where companies can publish their ads.

**Introduction**: 
Introduce yourself as Clara and provide a brief description of the Adserve platform.

**Page Summary**: 
Summarize the content of the current page based on the following HTML:

{pageContent}

Don't forget to include the following points in your response:
1. Dont tell user that this is a Html page
2. Dont use words like "seems like" or "looks like" in your response, be assertive.
3. Start the summary like "This page helps you to...".
4. Dont giveout details about the page, just provide how is this usefull from the headings in 2 to 3 lines.
Clara:
      `,
      inputVariables: ["pageContent"],
    });
    this.contextPrompt = new PromptTemplate({
      template: `
You are Clara, an AI model for Adserve - a platform where companies can publish their ads.

**Field Context**: 
Provide detailed information and examples based on the context of the input field.

{fieldContext}

Clara:
      `,
      inputVariables: ["fieldContext"],
    });
  }

  static getInstance(): ClaraAI {
    if (!ClaraAI.instance) {
      ClaraAI.instance = new ClaraAI();
    }
    return ClaraAI.instance;
  }

  async invoke(input: string) {
    const fullContext =
      this.conversationHistory.join("\n") + `\nUser: ${input}\nClara:`;
    const prompt = await this.promptTemplate.format({
      context: fullContext,
      input,
    });
    const response = await this.model.invoke(prompt);
    const responseContent = this.getMessageContent(response);
    this.conversationHistory.push(`User: ${input}`);
    this.conversationHistory.push(`Clara: ${responseContent}`);
    return responseContent;
  }

  private getMessageContent(message: any): string {
    if (typeof message === "string") {
      return message;
    } else if (typeof message.content === "string") {
      return message.content;
    } else if (message.text) {
      return message.text;
    } else {
      console.error("Unknown message type:", message);
      return JSON.stringify(message);
    }
  }

  async startConversation(pageContent: string) {
    const chain = this.initPrompt.pipe(this.model);
    const response = await chain.invoke({ pageContent });
    const responseContent = this.getMessageContent(response);
    return responseContent;
  }

  async provideFieldDetails(fieldContext: string) {
    console.log("fieldContext", fieldContext);
    const chain = this.contextPrompt.pipe(this.model);
    const response = await chain.invoke({ fieldContext });
    this.conversationHistory.push(`Clara: ${response}`);
    console.log("response", response);
    return response;
  }

  getConversationHistory() {
    return this.conversationHistory;
  }
}

export default ClaraAI;
