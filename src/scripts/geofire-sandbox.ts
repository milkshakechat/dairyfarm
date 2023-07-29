// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/geofire-sandbox.ts

import { initFirebase } from "@/services/firebase";
import { testGeoFirestore } from "@/services/geolocation";

const run = async () => {
  console.log(`Running script geofire-sandbox...`);
  await initFirebase();
  await testGeoFirestore();
};
run();
