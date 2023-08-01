// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/i18-assist/i18n-sandbox-2.ts

import { initFirebase } from "@/services/firebase";
import {
  TranslatePageProps,
  autoGenIDsPlaceholderPrint,
  generatePlaceholderPrintVariables,
  translate,
  translatePage,
} from "@/services/i18-assist";
import translationConfig1 from "./phrases/phrases.ProfilePage";
import translationConfig2 from "./phrases/phrases.PurchaseHistory";
import translationConfig3 from "./phrases/phrases.PurchasePage";
import translationConfig4 from "./phrases/phrases.QuickChat";
import translationConfig5 from "./phrases/phrases.RecallTransaction";
import translationConfig6 from "./phrases/phrases.AboutSection";
import translationConfig7 from "./phrases/phrases.AppLayout";
import translationConfig8 from "./phrases/phrases.ChatsList";
import translationConfig9 from "./phrases/phrases.ConfirmPurchase";
import translationConfig10 from "./phrases/phrases.NewWishPage";
import translationConfig11 from "./phrases/phrases.NotificationsPage";
import translationConfig12 from "./phrases/phrases.OfflineBanner";
import translationConfig13 from "./phrases/phrases.ReturnTransaction";
import translationConfig14 from "./phrases/phrases.SubscribePremium";
import translationConfig15 from "./phrases/phrases.TimelineGallery";
import translationConfig16 from "./phrases/phrases.TinderPage";
import translationConfig17 from "./phrases/phrases.TopUpWallet";
import translationConfig18 from "./phrases/phrases.TransactionHistory";
import translationConfig19 from "./phrases/phrases.UploadStory";
import translationConfig20 from "./phrases/phrases.UserFriendPage";
import translationConfig21 from "./phrases/phrases.UserPublicPage";
import translationConfig22 from "./phrases/phrases.WalletPage";
import translationConfig23 from "./phrases/phrases.WatchStoryPage";
import translationConfig24 from "./phrases/phrases.WishlistGallery";
import translationConfig25 from "./phrases/phrases.WishPage";
import translationConfig26 from "./phrases/phrases.WalletPanel";
import translationConfig27 from "./empty-phrases/phrases.LoginPage";
import translationConfig28 from "./empty-phrases/phrases.OnboardingPage";
import { changeFxBase, getFxRates } from "@/services/fx";
import { CurrencyEnum } from "@milkshakechat/helpers";

const run = async () => {
  console.log(`Running script i18n-sandbox...`);
  await initFirebase();
  // const targets: TranslatePageProps[] = [
  //   // translationConfig1,
  //   // translationConfig2,
  //   // translationConfig3,
  //   // translationConfig4,
  //   // translationConfig5,
  //   // translationConfig6,
  //   // translationConfig7,
  //   // translationConfig8,
  //   // translationConfig9,
  //   // translationConfig10,
  //   // translationConfig11,
  //   // translationConfig12,
  //   // translationConfig13,
  //   // translationConfig14,
  //   // translationConfig15,
  //   // translationConfig16,
  //   // translationConfig17,
  //   // translationConfig18,
  //   // translationConfig19,
  //   // translationConfig20,
  //   // translationConfig21,
  //   // translationConfig22,
  //   // translationConfig23,
  //   // translationConfig24,
  //   // translationConfig25,
  //   // translationConfig26,
  //   // translationConfig27,
  //   // translationConfig28,
  // ];
  // async function runSequentially() {
  //   for (let i = 0; i < targets.length; i++) {
  //     const translationConfig = targets[i];
  //     await generatePlaceholderPrintVariables(translationConfig);
  //   }
  // }
  // await runSequentially();
  // await translate({
  //   lang: "zh",
  //   text: "hello",
  // });
  // await autoGenIDsPlaceholderPrint(translationConfig27);
  // await autoGenIDsPlaceholderPrint(translationConfig28);
  // await generatePlaceholderPrintVariables(translationConfig26);
  // await changeFxBase({
  //   base: CurrencyEnum.USD,
  // });
  const fx = await getFxRates({
    from: CurrencyEnum.USD,
    to: CurrencyEnum.VND,
  });
  console.log(fx);
};
run();
