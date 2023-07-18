import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { GoogleAuth } from "google-auth-library";
import config from "@/config.env";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

async function accessSecretVersionGCP({
  projectId,
  secretId,
  versionId,
}: {
  projectId: string;
  secretId: string;
  versionId: string;
}): Promise<string> {
  // path to repo working directory
  const base64KeyFile = Buffer.from(
    process.env.GCP_KEYFILE_BASE64 || "",
    "base64"
  ).toString("utf-8");
  const credentials = JSON.parse(base64KeyFile);
  // Create a GoogleAuth instance with the credentials
  const auth = new GoogleAuth({
    credentials,
  });
  const client = new SecretManagerServiceClient({
    // Option 1: path to service account keyfile
    // keyFilename: pathToKeyFile,
    // Option 2: stringified service account as .ENV variable
    auth,
  });
  const name = `projects/${projectId}/secrets/${secretId}/versions/${versionId}`;

  const [response] = await client.accessSecretVersion({ name });

  const secretValue = response.payload?.data?.toString();
  if (!secretValue) {
    throw Error("No secret value found");
  }
  return secretValue;
}

export const accessLocalGCPKeyFile = async () => {
  // path to repo working directory
  const base64KeyFile = Buffer.from(
    process.env.GCP_KEYFILE_BASE64 || "",
    "base64"
  ).toString("utf-8");
  const credentials = JSON.parse(base64KeyFile);
  return credentials;
};

export const accessLocalAWSKeyFile = async () => {
  // path to repo working directory
  const base64KeyFile = Buffer.from(
    process.env.AWS_KEYFILE_BASE64 || "",
    "base64"
  ).toString("utf-8");
  const credentials = JSON.parse(base64KeyFile);
  return credentials as { accessKey: string; secretKey: string };
};

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}
export const getFirebaseConfig = async () => {
  const firebaseConfig = await accessSecretVersionGCP({
    projectId: config.GCLOUD.projectId,
    secretId: config.SECRETS.FIREBASE_CONFIG.secretId,
    versionId: config.SECRETS.FIREBASE_CONFIG.versionId,
  });
  // return firebaseConfig as unknown as FirebaseConfig;
  return JSON.parse(firebaseConfig) as FirebaseConfig;
};

export const getSendbirdSecret = async () => {
  const sendbirdSecret = await accessSecretVersionGCP({
    projectId: config.GCLOUD.projectId,
    secretId: config.SECRETS.SENDBIRD_API.secretId,
    versionId: config.SECRETS.SENDBIRD_API.versionId,
  });
  return sendbirdSecret;
};

export const getFCMServerKey = async () => {
  const fcmServerKey = await accessSecretVersionGCP({
    projectId: config.GCLOUD.projectId,
    secretId: config.SECRETS.FCM_SERVER_KEY.secretId,
    versionId: config.SECRETS.FCM_SERVER_KEY.versionId,
  });
  return fcmServerKey;
};

export const getStripeSecret = async () => {
  const stripeSecret = await accessSecretVersionGCP({
    projectId: config.GCLOUD.projectId,
    secretId: config.SECRETS.STRIPE_SERVER_KEY.secretId,
    versionId: config.SECRETS.STRIPE_SERVER_KEY.versionId,
  });
  return stripeSecret;
};

// used for cross-cloud api communication
export const generate256BitKey = async () => {
  let key = crypto.randomBytes(32).toString("base64");
  console.log(`key === ${key}`);
  return key;
};

export const getXCloudAWSSecret = async () => {
  const xcloudSecret = await accessSecretVersionGCP({
    projectId: config.GCLOUD.projectId,
    secretId: config.SECRETS.XCLOUD_WALLET.secretId,
    versionId: config.SECRETS.XCLOUD_WALLET.versionId,
  });
  return xcloudSecret;
};
