import admin from "firebase-admin";
import { accessLocalGCPKeyFile, getFirebaseConfig } from "@/utils/secrets";

export let app: admin.app.App;
export let firestore: admin.firestore.Firestore;
export let storage: admin.storage.Storage;
export let auth: admin.auth.Auth;
export let messaging: admin.messaging.Messaging;
export const initFirebase = async () => {
  console.log(`Init Firebase...`);
  const firebaseConfig = await getFirebaseConfig();

  // load firebase app credentials using secretmanager
  // https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
  // app = admin.initializeApp(firebaseConfig);

  const credentials = await accessLocalGCPKeyFile();
  const credential = admin.credential.cert(credentials as admin.ServiceAccount);
  app = admin.initializeApp({ ...firebaseConfig, credential });

  firestore = admin.firestore(app);
  firestore.settings({ ignoreUndefinedProperties: true });
  storage = admin.storage(app);
  auth = admin.auth(app);
  console.log(`Firebase initialized...`);
  messaging = admin.messaging(app);
};
