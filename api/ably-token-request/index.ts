import { Context, HttpRequest } from "@azure/functions";
import * as Ably from "ably/promises";
import * as dotenv from "dotenv";

dotenv.config();

export default async function (context: Context, req: HttpRequest): Promise<void> {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'tamagotrain2' });

  context.res = {
    headers: { "content-type": "application/json" },
    body: JSON.stringify(tokenRequestData)
  };
}
