// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/config-sendbird-webhooks.ts
// NODE_ENV=production npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/config-sendbird-webhooks.ts

import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

import { initFirebase } from "@/services/firebase";
import { configureSendBirdWebhooks } from "@/services/sendbird";
import config from "@/config.env";

const run = async () => {
  console.log(`run --> config-sendbird-webhooks.ts`);
  console.log(`process.env.NODE_ENV)`, process.env.NODE_ENV);
  console.log(
    `process.env.GOOGLE_CLOUD_PROJECT)`,
    process.env.GOOGLE_CLOUD_PROJECT
  );
  // console.log("config.SENDBIRD.WEBHOOK_URL", config.SENDBIRD.WEBHOOK_URL);
  await initFirebase();
  await configureSendBirdWebhooks();
};
run();
