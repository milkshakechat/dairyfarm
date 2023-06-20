// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/template-script.ts

import { initFirebase } from "@/services/firebase";
import { sayHello } from "@/utils/utils";

const run = async () => {
  // await initFirebase();
  console.log(sayHello());
};
run();
