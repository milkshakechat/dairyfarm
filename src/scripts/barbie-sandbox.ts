// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/barbie-sandbox.ts

import { SeedStory, SeedUser, seedLore, seedUniverse } from "@/services/barbie";
import { initFirebase } from "@/services/firebase";
import { placeholderImageThumbnail } from "@milkshakechat/helpers";

const seedUsers: SeedUser[] = [
  {
    displayName: "John Doe",
    username: "johndoe3",
    genesisID: "genesis-000001",
    avatar: placeholderImageThumbnail,
  },
];
const seedStories: SeedStory[] = [];

const run = async () => {
  console.log(`Running script Barbie World...`);
  await initFirebase();
  // await seedUniverse(seedUsers);
  await seedLore(seedStories);
};
run();
