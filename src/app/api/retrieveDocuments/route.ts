import { Collection, MongoClient, Document } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { kMaxLength } from "buffer";

const mongoUri = process.env.NEXT_PUBLIC_MONGODB_URI || "";
const dbName = "your_database_name";
const collectionName = "your_collection_name";

async function implLogic(question: string) {
  try {
    console.log("Retrieve documents question:", question);
    const embeddings = new AzureOpenAIEmbeddings({
      azureOpenAIApiKey: process.env.NEXT_PUBLIC_AZURE_EMBEDDING_API_KEY,
      azureOpenAIApiInstanceName:
        process.env.NEXT_PUBLIC_AZURE_EMBEDDING_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName:
        process.env.NEXT_PUBLIC_AZURE_EMBEDDING_API_DEPLOYMENT_NAME,
      azureOpenAIApiVersion:
        process.env.NEXT_PUBLIC_AZURE_EMBEDDING_API_VERSION,
    });
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection: collection,
      indexName: "langchain-research",
    });
    const result = await vectorStore.similaritySearch(question, 5);
    console.log("Retrieve documents result:", result);
    return result;
  } catch (error) {
    console.error("Retrieve documents error:", error);
    return [];
  }
}
export async function updateEmbeddings() {
  const mongoUri = process.env.NEXT_PUBLIC_MONGODB_URI || "";
  const dbName = "your_database_name";
  const collectionName = "your_collection_name";
  const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIApiKey: process.env.NEXT_PUBLIC_AZURE_EMBEDDING_API_KEY,
    azureOpenAIApiInstanceName:
      process.env.NEXT_PUBLIC_AZURE_EMBEDDING_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName:
      process.env.NEXT_PUBLIC_AZURE_EMBEDDING_API_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.NEXT_PUBLIC_AZURE_EMBEDDING_API_VERSION,
  });
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const docume = await collection.find({}).toArray();
  for (const doc of docume) {
    const text = `Campaign ID: ${doc.Campaign_ID}, Target Audience: ${doc.Target_Audience}, Campaign Goal: ${doc.Campaign_Goal}, Duration: ${doc.Duration}, Channel Used: ${doc.Channel_Used}, Conversion Rate: ${doc.Conversion_Rate}, Acquisition Cost: ${doc.Acquisition_Cost}, ROI: ${doc.ROI}, Location: ${doc.Location}, Language: ${doc.Language}, Clicks: ${doc.Clicks}, Impressions: ${doc.Impressions}, Engagement Score: ${doc.Engagement_Score}, Customer Segment: ${doc.Customer_Segment}, Date: ${doc.Date}, Company: ${doc.Company}`;
    const embedding = await embeddings.embedQuery(text);

    // Store embedding in MongoDB
    await collection.updateOne(
      { _id: doc._id },
      { $set: { embedding: embedding } }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question: string = body?.question || "";
    const res = await implLogic(question);
    console.log("api response:", res);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Retrieve documents error:", error);
    return NextResponse.error();
  }
}
export async function GET(req: NextRequest) {
  try {
    updateEmbeddings();
    return NextResponse.json("Embeddings updated");
  } catch (error) {
    console.error("Retrieve documents error:", error);
    return NextResponse.error();
  }
}
