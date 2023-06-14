import admin from "firebase-admin";
import { getFirebaseConfig } from "@/utils/secrets";

export let app: admin.app.App;
export let firestore: admin.firestore.Firestore;
export let storage: admin.storage.Storage;
export let auth: admin.auth.Auth;

export const initFirebase = async () => {
  const firebaseConfig = await getFirebaseConfig();
  // load firebase app credentials using secretmanager
  // https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
  app = admin.initializeApp(firebaseConfig);
  firestore = admin.firestore(app);
  firestore.settings({ ignoreUndefinedProperties: true });
  storage = admin.storage(app);
  auth = admin.auth(app);
};
