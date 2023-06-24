// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/private-bucket-view-test.ts

import { initFirebase } from "@/services/firebase";
import {
  generateSignedUrlForStorageItem,
  initStorageBucket_GCP,
} from "@/services/private-bucket";
import { sayHello } from "@/utils/utils";
import config from "@/config.env";

const run = async () => {
  console.log(`Running script private-bucket-view-test...`);
  await initFirebase();
  await initStorageBucket_GCP();
  await generateSignedUrlForStorageItem({
    bucketName: config.BUCKETS.UserStories.name,
    filename: "folder/file.mp4",
  });
};
run();
