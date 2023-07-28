import {
  FirestoreCollection,
  MockUserGenesisID,
  MockUser_Firestore,
  Story_Firestore,
  UserID,
  User_Firestore,
  Username,
  WishID,
  checkIfUsernameIsAllowed,
  placeholderImageThumbnail,
} from "@milkshakechat/helpers";
import { getAuth } from "firebase-admin/auth";
import { v4 as uuidv4 } from "uuid";
import { createFirestoreDoc, updateFirestoreDoc } from "./firestore";
import { sleep } from "@/utils/utils";
import { checkIfUsernameAvailable } from "@/utils/username";
import { CreateStoryFirestoreArgs, createStoryFirestore } from "./story";
import { StoryAttachmentType } from "@/graphql/types/resolvers-types";

export interface SeedUser {
  displayName: string;
  username: string;
  genesisID: string;
  avatar: string;
}

export const seedUniverse = async (seedUsers: SeedUser[]) => {
  console.log(`
  
  ============ Creating a Barbie World ============
  
  Population: ${seedUsers.length} people
  Timestamp: ${new Date().toISOString()}

  `);

  const users = [];
  async function runSequentially() {
    for (let i = 0; i < seedUsers.length; i++) {
      const user = seedUsers[i];
      const isAvail = await checkIfUsernameAvailable(user.username);
      const isAllowed = checkIfUsernameIsAllowed(user.username);
      if (!isAvail) {
        console.log(`
        
      --------
      Skipping user ${i + 1} of ${seedUsers.length}
      Username ${user.username} is not available
        
        `);
        return;
      }
      if (!isAllowed) {
        console.log(`
        
      --------
      Skipping user ${i + 1} of ${seedUsers.length}
      Username ${user.username} is not allowed
        
        `);
        return;
      }
      console.log(`
      --------
      Creating user ${i + 1} of ${seedUsers.length}
      Username: ${user.username}
      `);
      const unix = Date.now();
      const email = `milkshake.assist+${unix}@gmail.com`;
      const password = uuidv4();
      const genesisID = user.genesisID as MockUserGenesisID;
      const res = await getAuth().createUser({
        email,
        emailVerified: true,
        password,
        displayName: user.displayName,
        photoURL: user.avatar,
        disabled: false,
      });
      console.log(`
      Name: ${user.displayName}
      Email: ${email}
      UserID: ${res.uid}
      GenesisID: ${genesisID}

      `);
      const customAccessToken = await getAuth().createCustomToken(res.uid);
      await createFirestoreDoc<UserID, MockUser_Firestore>({
        id: res.uid as UserID,
        data: {
          id: res.uid as UserID,
          email,
          password,
          genesisID,
          lastKnownToken: customAccessToken,
        },
        collection: FirestoreCollection.MOCK_USERS,
      });
      await sleep(10000);
      await updateFirestoreDoc<UserID, User_Firestore>({
        id: res.uid as UserID,
        payload: {
          isMockUser: true,
          username: user.username as Username,
          displayName: user.displayName,
          avatar: user.avatar,
        },
        collection: FirestoreCollection.USERS,
      });
      users.push(res);
    }
  }
  await runSequentially();

  console.log(`


  Timestamp: ${new Date().toISOString()}
  
  ============ Finished Seeding Universe ============
  `);
  return;
};

export interface SeedStory {
  mediaUrl?: string;
  mediaType?: StoryAttachmentType;
  userID: UserID;
  caption?: string;
  assetID?: string;
  linkedWishID?: WishID;
  allowSwipe?: boolean;
}

export const seedLore = async (seedStories: SeedStory[]) => {
  console.log(`
  
  ============ Seeding Universe Lore ============

  Lore: ${seedStories.length} stories
  Timestamp: ${new Date().toISOString()}

`);

  const uploadedStores: Story_Firestore[] = [];
  async function runSequentially() {
    for (let i = 0; i < seedStories.length; i++) {
      const story = seedStories[i];
      const res = await createStoryFirestore(story);
      uploadedStores.push(res);
    }
  }
  await runSequentially();

  console.log(`


  Timestamp: ${new Date().toISOString()}
  
  ============ Finished Seeding Lore ============
  `);
  return;
};
