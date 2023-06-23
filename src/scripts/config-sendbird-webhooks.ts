// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/config-sendbird-webhooks.ts

import { initFirebase } from "@/services/firebase";
import { configureSendBirdWebhooks } from "@/services/sendbird";

const run = async () => {
  console.log(`run --> config-sendbird-webhooks.ts`);
  await initFirebase();
  await configureSendBirdWebhooks();
};
run();
