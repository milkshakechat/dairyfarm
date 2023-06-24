import config from "@/config.env";
import { v1 } from "@google-cloud/video-transcoder";
const { TranscoderServiceClient } = v1;

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = config.GCLOUD.projectId;
const location = "us-east1";
const preset = "preset/web-hd";

// instantiate client
const client = new TranscoderServiceClient();

// list video transcoder jobs
export const listVideoTranscoderJobs = async () => {
  const [jobs] = await client.listJobs({
    parent: client.locationPath(projectId, location),
  });
  console.info("jobs:");
  console.log(jobs);
  for (const job of jobs) {
    console.info(job);
  }
};

// create video transcoder job
export type GoogleCloudBucketObjectURI = string;
export const createJobFromPreset = async ({
  inputUri,
  outputUri,
}: {
  inputUri: GoogleCloudBucketObjectURI;
  outputUri: GoogleCloudBucketObjectURI;
}) => {
  // inputUri = 'gs://my-bucket/my-video-file';
  // outputUri = 'gs://my-bucket/my-output-folder/';

  // Construct request
  const request = {
    parent: client.locationPath(projectId, location),
    job: {
      inputUri: inputUri,
      outputUri: outputUri,
      templateId: preset,
    },
  };

  // Run request
  const [response] = await client.createJob(request);
  console.log(`Job: ${response.name}`);
  const jobId = response.name?.split("/").pop();
  console.log(`Job ID: ${jobId}`);

  return jobId;
};

// get job status
export const getJobStatus = async (jobId: string) => {
  // Construct request
  const request = {
    name: client.jobPath(projectId, location, jobId),
  };
  const [response] = await client.getJob(request);
  console.log(`Job state: ${response.state}`);
};

// delete job
export async function deleteJob(jobId: string) {
  // Construct request
  const request = {
    name: client.jobPath(projectId, location, jobId),
  };
  await client.deleteJob(request);
  console.log("Deleted job");
}

/**
 * const input = "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/users%2FbpSkq4bQFuWYoj7xtGD8pr5gUdD3%2Fstory%2Fvideo%2F258f75b5-9bb0-431e-9da8-b40df2c418b8.mp4?alt=media&token=2dce18f4-aaff-4891-8569-f23b837370c1";
 *
 * console.log(translate3(input));
 * should return:
 * "https://storage.googleapis.com/user-stories-social/users/bpSkq4bQFuWYoj7xtGD8pr5gUdD3/story/video/258f75b5-9bb0-431e-9da8-b40df2c418b8/video-streaming/manifest.m3u8"
 */
export const predictVideoTranscodedManifestRoute = (url: string) => {
  // Extract the path from the URL
  let path = new URL(url).pathname;

  // URL decode the path
  let decodedPath = decodeURIComponent(path);

  // Find the position of "/users" in the path
  let usersPos = decodedPath.indexOf("/users");

  // Extract the relevant part of the path
  let relevantPath = decodedPath.slice(usersPos);

  // Remove the .mp4 from the relevant path and add the video streaming path
  let newPath = relevantPath.replace(".mp4", "");

  // Predict the new manifest URL
  let manifestUrl = `https://storage.googleapis.com/${config.BUCKETS.UserStories.name}${newPath}/video-streaming/manifest.m3u8`;

  return manifestUrl;
};
