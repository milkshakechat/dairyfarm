// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/i18-assist/i18n-sandbox.ts

import { initFirebase } from "@/services/firebase";
import { translate, translatePage } from "@/services/i18-assist";
import translationConfig from "./phrases";

const run = async () => {
  console.log(`Running script i18n-sandbox...`);
  await initFirebase();

  await translatePage(translationConfig);
  // await translate({
  //   lang: "zh",
  //   text: "hello",
  // });
};
run();
