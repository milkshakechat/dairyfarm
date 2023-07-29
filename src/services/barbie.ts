import {
  FirestoreCollection,
  MirrorPublicUser_Firestore,
  MockUserGenesisID,
  MockUser_Firestore,
  Story_Firestore,
  UserID,
  User_Firestore,
  Username,
  WishID,
  checkIfUsernameIsAllowed,
  genderEnum,
  getCompressedAvatarUrl,
  placeholderImageThumbnail,
  privacyModeEnum,
} from "@milkshakechat/helpers";
import { promisify } from "util";
import { UserRecord, getAuth } from "firebase-admin/auth";
import { v4 as uuidv4 } from "uuid";
import {
  createFirestoreDoc,
  getFirestoreDoc,
  listFirestoreDocs,
  updateFirestoreDoc,
} from "./firestore";
import { sleep } from "@/utils/utils";
import { checkIfUsernameAvailable } from "@/utils/username";
import { CreateStoryFirestoreArgs, createStoryFirestore } from "./story";
import { StoryAttachmentType } from "@/graphql/types/resolvers-types";
import axios from "axios";
import fs from "fs";
import path from "path";
import * as admin from "firebase-admin";
import config from "@/config.env";
import { getRapidAPISecret } from "@/utils/secrets";

export const DEFAULT_SANDBOX_FOLDER_PATH = "./src/scripts/barbiebox";

export const seedUniverse = async ({
  usernames,
  gender,
  interestedIn,
  saveLocal = false,
}: {
  usernames: Username[];
  gender: genderEnum;
  interestedIn: genderEnum[];
  saveLocal?: boolean;
}) => {
  const runTitle = `seed_users_run_${Date.now()}`;
  console.log(`
  
    ============ Creating a Barbie World ============
    
    Population: ${usernames.length} people
    Start Time: ${new Date().toISOString()}
  
    `);

  const seedUsers = await bulkDownloadInstagramUsers({
    usernames,
    gender,
    interestedIn,
    saveLocal,
  });
  const seeds = await seedPopulation(seedUsers, saveLocal);

  const filePath = path.join(
    __dirname,
    `../scripts/barbiebox/seeds/${runTitle}.ts`
  );
  if (saveLocal) {
    const fileContent = `
    export const seeds = ${JSON.stringify(seeds, null, 2)};
  `;
    fs.writeFileSync(filePath, fileContent, "utf8");
  }

  console.log(`


  Timestamp: ${new Date().toISOString()}
  
  ============ Finished Seeding Universe ============
  `);
};

export interface SeedUser {
  displayName: string;
  username: string;
  genesisID: string;
  avatar: string;
  biography: string;
  gender: genderEnum | string;
  interestedIn: genderEnum[] | string[];
}

export const seedPopulation = async (
  seedUsers: SeedUser[],
  saveLocal?: boolean
) => {
  const users: UserRecord[] = [];
  const results: { user: User_Firestore; stories: Story_Firestore[] }[] = [];
  async function runSequentially() {
    for (let i = 0; i < seedUsers.length; i++) {
      const user = seedUsers[i];
      console.log(`user#${user.genesisID}`);
      const isAvail = await checkIfUsernameAvailable(user.username);
      const isAllowed = checkIfUsernameIsAllowed(user.username);
      if (!isAvail) {
        console.log(`
        
      --------
      Skipping user ${i + 1} of ${seedUsers.length}
      Username ${user.username} is not available
        
        `);
        continue;
      }
      if (!isAllowed) {
        console.log(`
        
      --------
      Skipping user ${i + 1} of ${seedUsers.length}
      Username ${user.username} is not allowed
        
        `);
        continue;
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
      users.push(res);
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
          username: user.username as Username,
          password,
          genesisID,
          lastKnownToken: customAccessToken,
        },
        collection: FirestoreCollection.MOCK_USERS,
      });
      const avatar = await cloudCloneRemoteMedia_UserAvatar({
        mediaUrl: user.avatar,
        userID: res.uid as UserID,
      });
      await sleep(10000);
      let canProceed = false;
      while (!canProceed) {
        try {
          await getFirestoreDoc<UserID, User_Firestore>({
            id: res.uid as UserID,
            collection: FirestoreCollection.USERS,
          });
          canProceed = true;
        } catch (e) {
          await sleep(5000);
        }
      }
      const _user = await updateFirestoreDoc<UserID, User_Firestore>({
        id: res.uid as UserID,
        payload: {
          isMockUser: true,
          username: user.username as Username,
          displayName: user.displayName,
          avatar,
          bio: user.biography,
          gender: user.gender as genderEnum,
          interestedIn: user.interestedIn as genderEnum[],
          privacyMode: privacyModeEnum.public,
        },
        collection: FirestoreCollection.USERS,
      });
      await updateFirestoreDoc<UserID, MirrorPublicUser_Firestore>({
        id: res.uid as UserID,
        payload: {
          username: user.username as Username,
          avatar,
        },
        collection: FirestoreCollection.MIRROR_USER,
      });
      const seedStories = await bulkDownloadInstagramStories({
        username: user.username as Username,
        saveLocal,
      });
      const _lore = await seedLore(seedStories, res.uid as UserID);
      results.push({
        user: _user,
        stories: _lore,
      });
    }
  }
  await runSequentially();

  return results;
};

export const fixMockUsers = async (usernames: Username[], payload: any) => {
  async function runSequentially() {
    for (let i = 0; i < usernames.length; i++) {
      const users = await listFirestoreDocs<User_Firestore>({
        where: {
          field: "username",
          operator: "==",
          value: usernames[i],
        },
        collection: FirestoreCollection.USERS,
      });
      if (users[0]) {
        console.log(`Updating ${users[0].username}...`);
        await updateFirestoreDoc<UserID, User_Firestore>({
          id: users[0].id,
          payload,
          collection: FirestoreCollection.USERS,
        });
      }
    }
  }
  await runSequentially();
};

export interface SeedStory {
  url: string;
  mediaType: StoryAttachmentType;
  username: Username;
  caption: string;
  createdAt: number;
}

export const seedLore = async (seedStories: SeedStory[], userID: UserID) => {
  console.log(`
  
  ============ Seeding Universe Lore ============

  Lore: ${seedStories.length} stories
  Timestamp: ${new Date().toISOString()}

`);

  const uploadedStories: Story_Firestore[] = [];
  async function runSequentially() {
    for (let i = 0; i < seedStories.length; i++) {
      const story = seedStories[i];
      const params = await cloudCloneRemoteMedia_UserPost({
        mediaUrl: story.url,
        userID,
        mediaType: story.mediaType,
      });
      const payload: CreateStoryFirestoreArgs = {
        mediaUrl: params.url,
        mediaType: params.type,
        userID,
        caption: story.caption || "",
        assetID: params.assetID,
        linkedWishID: undefined,
        allowSwipe: true,
        overrideDate: new Date(story.createdAt),
      };
      const res = await createStoryFirestore(payload);
      uploadedStories.push(res);
    }
  }
  await runSequentially();

  console.log(`


  --- Finished Seeding Lore
  `);
  return uploadedStories;
};

export const bulkDownloadInstagramUsers = async ({
  usernames,
  gender,
  interestedIn,
  saveLocal = false,
}: {
  usernames: Username[];
  gender: genderEnum;
  interestedIn: genderEnum[];
  saveLocal?: boolean;
}) => {
  const runTitle = `download_ig_users_run_${Date.now()}`;
  console.log(`Bulk downloading IG users... run# ${runTitle}`);
  const token = await getRapidAPISecret();

  const fullProfiles: any[] = [];
  async function runSequentially() {
    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];
      console.log(`${username}...`);
      const options = {
        method: "GET",
        url: "https://instagram-scraper-2022.p.rapidapi.com/ig/info_username/",
        params: { user: username },
        headers: {
          "X-RapidAPI-Key": token,
          "X-RapidAPI-Host": "instagram-scraper-2022.p.rapidapi.com",
        },
      };
      try {
        const response = await axios.request(options);
        // console.log(response.data);
        fullProfiles.push(response.data);
      } catch (error) {
        console.error(error);
      }
      await sleep(2000);
    }
  }
  await runSequentially();
  const filePath = path.join(
    __dirname,
    `../scripts/barbiebox/users/${runTitle}.ts`
  );

  const profiles: Record<MockUserGenesisID, SeedUser> = fullProfiles
    .map((p) => {
      return {
        displayName: p.user.full_name,
        username: p.user.username,
        genesisID: `genesis-seed-user-${Date.now()}`,
        avatar: p.user.profile_pic_url,
        biography: p.user.biography,
        gender,
        interestedIn,
      };
    })
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr.username]: curr,
      };
    }, {});

  if (saveLocal) {
    const fileContent = `
    export const seeds = ${JSON.stringify(profiles, null, 2)};
    export const originals = ${JSON.stringify(fullProfiles, null, 2)};
  `;
    fs.writeFileSync(filePath, fileContent, "utf8");
  }
  return Object.values(profiles);
};

export const bulkDownloadInstagramStories = async ({
  username,
  apiKey,
  saveLocal = false,
}: {
  username: Username;
  apiKey?: string;
  saveLocal?: boolean;
}): Promise<SeedStory[]> => {
  const token = apiKey ? apiKey : await getRapidAPISecret();
  const options = {
    method: "GET",
    url: "https://instagram-scraper-2022.p.rapidapi.com/ig/posts_username/",
    params: {
      user: username,
    },
    headers: {
      "X-RapidAPI-Key": token,
      "X-RapidAPI-Host": "instagram-scraper-2022.p.rapidapi.com",
    },
  };
  try {
    const response = await axios.request(options);
    // console.log(response.data);
    const seedStories: SeedStory[] =
      response.data.data.user.edge_owner_to_timeline_media.edges
        .map((edge: any) => {
          const { node } = edge;
          return {
            url: node.display_url,
            mediaType: node.is_video
              ? StoryAttachmentType.Video
              : StoryAttachmentType.Image,
            username,
            caption:
              node.edge_media_to_caption.edges.reduce(
                (acc: string, curr: any) => {
                  return `${acc}${curr.node.text} `;
                },
                ""
              ) || "",
            createdAt: node.taken_at_timestamp * 1000,
          };
        })
        .filter((s: any) => s.mediaType === StoryAttachmentType.Image);
    if (saveLocal) {
      const filePath = path.join(
        __dirname,
        `../scripts/barbiebox/posts/posts_${username}_${Date.now()}.ts`
      );
      const fileContent = `
        export const seeds = ${JSON.stringify(seedStories, null, 2)};
        export const originals = ${JSON.stringify(response.data, null, 2)};
      `;
      fs.writeFileSync(filePath, fileContent, "utf8");
    }
    return seedStories;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const cloudCloneRemoteMedia_UserAvatar = async ({
  mediaUrl,
  userID,
}: {
  mediaUrl: string;
  userID: UserID;
}) => {
  const { filePath, assetID, fileExtension } = await downloadFileLocal(
    mediaUrl
  );

  const uploadedFileUrl = uploadLocalFileToBucket(
    filePath,
    `users/${userID}/avatars/${assetID}.${fileExtension}`
  );

  deleteFileLocal(filePath);
  const compressedUrl = getCompressedAvatarUrl({
    userID,
    assetID,
    bucketName: config.FIREBASE.storageBucket,
  });

  return compressedUrl;
};

export const cloudCloneRemoteMedia_UserPost = async ({
  mediaUrl,
  userID,
  mediaType,
}: {
  mediaUrl: string;
  userID: UserID;
  mediaType: StoryAttachmentType;
}) => {
  const { filePath, assetID, fileExtension } = await downloadFileLocal(
    mediaUrl,
    true
  );

  const fileName = `${assetID}.${fileExtension}`;

  const uploadedFileUrl = await uploadLocalFileToBucket(
    filePath,
    `users/${userID}/story/${mediaType}/${assetID}/${fileName}`
  );

  deleteFileLocal(filePath);
  const parseInfo = {
    type: mediaType,
    url: uploadedFileUrl,
    assetID,
  };

  return parseInfo;
};

export const testDownloadRemoteMedia = async () => {
  const userID = "0xyHh1513edCEHz2VT29r7ZeWnz1" as UserID;
  const mediaUrl =
    "https://instagram.frix9-1.fna.fbcdn.net/v/t51.2885-19/314081186_1811675859169267_848484281343758056_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.frix9-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=koiAQR2KXJgAX-Xclku&edm=AEF8tYYBAAAA&ccb=7-5&oh=00_AfBgsfWfOGpSLWbFtik_6vAPigaGTof4jnrs1GMQTGopUg&oe=64C83AFB&_nc_sid=1e20d2";
  const { filePath, assetID, fileExtension } = await downloadFileLocal(
    mediaUrl
  );

  const uploadedFileUrl = uploadLocalFileToBucket(
    filePath,
    `users/${userID}/avatars/${assetID}.${fileExtension}`
  );

  deleteFileLocal(filePath);
  const resized = getCompressedAvatarUrl({
    userID,
    assetID,
    bucketName: config.FIREBASE.storageBucket,
  });

  return {
    uploadedFileUrl,
    assetID,
    userID,
    resized,
  };
};
export const downloadFileLocal = async (url: string, forceJpeg?: boolean) => {
  const folderPath = path.join(__dirname, "../scripts/barbiebox/media");
  const _fileExtension = path.extname(new URL(url).pathname).replace(".", "");
  const fileExtension = forceJpeg
    ? "jpeg"
    : _fileExtension === "jpg"
    ? "jpeg"
    : _fileExtension;
  const filename = uuidv4();
  const filePath = path.resolve(folderPath, `${filename}.${fileExtension}`);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise<{
    filePath: string;
    assetID: string;
    fileExtension: string;
  }>((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on("finish", () =>
      resolve({ filePath, assetID: filename, fileExtension })
    );
    writer.on("error", reject);
  });
};

export const deleteFileLocal = (filePath: string) => {
  fs.unlinkSync(filePath);

  return;
};

export const uploadLocalFileToBucket = async (
  localFilePath: string,
  storagePath: string
): Promise<string> => {
  const bucket = admin.storage().bucket();

  const fileName = path.basename(localFilePath);

  const fileExtension = path.extname(localFilePath).replace(".", "");

  // Check if the file exists
  if (!fs.existsSync(localFilePath)) {
    throw new Error("File does not exist.");
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(storagePath);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: `image/${fileExtension}`,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      console.log("Upload failed", err);
      reject(err);
    });

    blobStream.on("finish", async () => {
      // The file upload is complete.
      await blob.makePublic(); // make the file public
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(blob.name)}?alt=media`;

      resolve(publicUrl);
    });

    blobStream.end(fs.readFileSync(localFilePath));
  });
};

export const getRandomDateInRecentPast = () => {
  const now = new Date();
  const random = Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7 * 52);
  const past = new Date(now.getTime() - random);
  return past;
};
