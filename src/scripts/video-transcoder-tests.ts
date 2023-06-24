// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/video-transcoder-tests.ts

import { initFirebase } from "@/services/firebase";
import {
  createJobFromPreset,
  getJobStatus,
  listVideoTranscoderJobs,
} from "@/services/video-transcoder";

const run = async () => {
  console.log(`Running script listVideoTranscoderJobs...`);
  await initFirebase();
  // await listVideoTranscoderJobs();
  // await createJobFromPreset({
  //   inputUri: "gs://user-stories-social/ChromeCast.mp4",
  //   outputUri: "gs://user-stories-social/resized-media/",
  // });
  await getJobStatus("82609878-a85b-4a0c-a330-1174e4a40a83");
  // await getJobStatus(
  //   "projects/642004369083/locations/us-east1/jobs/d050974c-7f73-4393-ba3f-bba432854be0"
  // );
};
run();
