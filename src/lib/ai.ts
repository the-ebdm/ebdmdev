import postgres from "postgres";

export interface Query {
  inputs: string;
}

const queryConnection = postgres(process.env.DATABASE_URL!);

export async function query(data: Query) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/Phind/Phind-CodeLlama-34B-v2",
    {
      headers: { Authorization: "Bearer " + process.env.HUGGINGFACE_TOKEN },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}