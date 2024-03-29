import {
  BucketDef,
  SecretConfig,
  StripePriceID,
  StripeProductID,
  UserID,
  WalletAliasID,
  WishID,
} from "@milkshakechat/helpers";

const devConfig: ConfigEnv = {
  GCLOUD: {
    projectId: "milkshake-dev-faf77",
  },
  BUCKETS: {
    UserStories: {
      name: "user-stories-social",
      location: "asia-northeast1",
    },
  },
  SECRETS: {
    FIREBASE_CONFIG: {
      secretId: "firebase-init",
      versionId: "latest",
    },
    SENDBIRD_API: {
      secretId: "sendbird-api",
      versionId: "latest",
    },
    FCM_SERVER_KEY: {
      secretId: "fcm-server-key",
      versionId: "latest",
    },
    STRIPE_SERVER_KEY: {
      secretId: "stripe-private-key",
      versionId: "latest",
    },
    XCLOUD_WALLET: {
      secretId: "xcloud-wallet-gateway-gcp-to-aws",
      versionId: "latest",
    },
    RAPID_API: {
      secretId: "rapid-api-key",
      versionId: "latest",
    },
    GEO_PLACES: {
      secretId: "geoplaces-map-api",
      versionId: "latest",
    },
    GOOGLE_TRANSLATE: {
      secretId: "google-translate-api",
      versionId: "latest",
    },
    EXCHANGE_RATE: {
      secretId: "exchange-rate-api",
      versionId: "latest",
    },
  },
  SENDBIRD: {
    SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
    API_URL: "https://api-D24F8D62-B601-4978-8DFB-F17DB6CD741F.sendbird.com",
    WEBHOOK_URL: "https://sendbirdpushnotifications-hcdyzvq35a-uc.a.run.app/",
  },
  FIREBASE: {
    apiKey: "AIzaSyAqVL1P4PsE40Bd-Mu8CnqwczpC-hSTaz0",
    authDomain: "milkshake-dev-faf77.firebaseapp.com",
    projectId: "milkshake-dev-faf77",
    storageBucket: "milkshake-dev-faf77.appspot.com",
    messagingSenderId: "642004369083",
    appId: "1:642004369083:web:74b7c685be091ce6b4f39e",
    measurementId: "G-N0YXCSQJ89",
  },
  GRAPHQL: {
    CORS_ORIGINS: "*",
  },
  STRIPE: {
    merchantOnboardingSuccessUrl:
      "https://milkshake-dev-faf77.web.app/app/profile/settings/merchant/banking-registration-init",
    merchantOnboardingFailureUrl:
      "https://milkshake-dev-faf77.web.app/app/profile/settings/merchant/banking-registration-refresh",
    webhookEndpoint: "https://onpurchaseintentsuccess-hcdyzvq35a-uc.a.run.app/",
  },
  LEDGER: {
    region: "ap-northeast-1",
    name: "inapp-wallet-dev",
    tables: {
      WALLET: "wallets",
      TRANSACTION: "transactions",
    },
    globalCookieStore: {
      userID: "global-cookie-store-owner" as UserID,
      walletAliasID:
        "milkshake-v0.1_global-cookie-store-wallet" as WalletAliasID,
      topUpWalletProductID: "prod_OK0vYwKnYTh69b" as StripeProductID,
      topUpWalletPriceID: "price_1NXMu7BbKljWimkIaY3ZWJMk" as StripePriceID,
      topUpWalletWishID: "TOP_UP_WALLET_WISH_ID" as WishID,
    },
    premiumChatStore: {
      userID: "premium-chat-store-owner" as UserID,
      walletAliasID:
        "milkshake-v0.1_premium-chat-store-wallet" as WalletAliasID,
      premiumChatWishID: "PREMIUM_CHAT_WISH_ID" as WishID,
    },
    recallGracePeriodDays: 90,
  },
  WALLET_GATEWAY: {
    postTransaction: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/transaction",
    },
    permaTransfer: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/permatransfer",
    },
    recallTransaction: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/transaction/recall",
    },
    cashoutTransaction: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/transaction/cashout",
    },
    getWallet: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/wallet",
    },
    createWallet: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/wallet",
    },
  },
};
const stagingConfig: ConfigEnv = {
  GCLOUD: {
    projectId: "milkshake-dev-faf77",
  },
  BUCKETS: {
    UserStories: {
      name: "user-stories-social",
      location: "asia-northeast1",
    },
  },
  SECRETS: {
    FIREBASE_CONFIG: {
      secretId: "firebase-init",
      versionId: "latest",
    },
    SENDBIRD_API: {
      secretId: "sendbird-api",
      versionId: "latest",
    },
    FCM_SERVER_KEY: {
      secretId: "fcm-server-key",
      versionId: "latest",
    },
    STRIPE_SERVER_KEY: {
      secretId: "stripe-private-key",
      versionId: "latest",
    },
    XCLOUD_WALLET: {
      secretId: "xcloud-wallet-gateway-gcp-to-aws",
      versionId: "latest",
    },
    RAPID_API: {
      secretId: "rapid-api-key",
      versionId: "latest",
    },
    GEO_PLACES: {
      secretId: "geoplaces-map-api",
      versionId: "latest",
    },
    GOOGLE_TRANSLATE: {
      secretId: "google-translate-api",
      versionId: "latest",
    },
    EXCHANGE_RATE: {
      secretId: "exchange-rate-api",
      versionId: "latest",
    },
  },
  SENDBIRD: {
    SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
    API_URL: "https://api-D24F8D62-B601-4978-8DFB-F17DB6CD741F.sendbird.com",
    WEBHOOK_URL: "https://sendbirdpushnotifications-hcdyzvq35a-uc.a.run.app/",
  },
  FIREBASE: {
    apiKey: "AIzaSyAqVL1P4PsE40Bd-Mu8CnqwczpC-hSTaz0",
    authDomain: "milkshake-dev-faf77.firebaseapp.com",
    projectId: "milkshake-dev-faf77",
    storageBucket: "milkshake-dev-faf77.appspot.com",
    messagingSenderId: "642004369083",
    appId: "1:642004369083:web:74b7c685be091ce6b4f39e",
    measurementId: "G-N0YXCSQJ89",
  },
  GRAPHQL: {
    CORS_ORIGINS: [
      "https://milkshake-dev-faf77.firebaseapp.com/",
      "https://milkshake-dev-faf77.web.app/",
    ],
  },
  STRIPE: {
    merchantOnboardingSuccessUrl:
      "https://milkshake-dev-faf77.web.app/app/profile/settings/merchant/banking-registration-init",
    merchantOnboardingFailureUrl:
      "https://milkshake-dev-faf77.web.app/app/profile/settings/merchant/banking-registration-refresh",
    webhookEndpoint: "/",
  },
  LEDGER: {
    region: "ap-northeast-1",
    name: "inapp-wallet-staging",
    tables: {
      WALLET: "wallets",
      TRANSACTION: "transactions",
    },

    globalCookieStore: {
      userID: "global-cookie-store-owner" as UserID,
      walletAliasID:
        "milkshake-v0.1_global-cookie-store-wallet" as WalletAliasID,
      topUpWalletProductID: "prod_OK0vYwKnYTh69b" as StripeProductID,
      topUpWalletPriceID: "price_1NXMu7BbKljWimkIaY3ZWJMk" as StripePriceID,
      topUpWalletWishID: "TOP_UP_WALLET_WISH_ID" as WishID,
    },
    premiumChatStore: {
      userID: "premium-chat-store-owner" as UserID,
      walletAliasID:
        "milkshake-v0.1_premium-chat-store-wallet" as WalletAliasID,
      premiumChatWishID: "PREMIUM_CHAT_WISH_ID" as WishID,
    },
    recallGracePeriodDays: 90,
  },
  WALLET_GATEWAY: {
    postTransaction: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/transaction",
    },
    permaTransfer: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/permatransfer",
    },
    recallTransaction: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/transaction/recall",
    },
    cashoutTransaction: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/transaction/cashout",
    },
    getWallet: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/wallet",
    },
    createWallet: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/wallet",
    },
  },
};

const prodConfig: ConfigEnv = {
  GCLOUD: {
    projectId: "milkshake-club",
  },
  BUCKETS: {
    UserStories: {
      name: "user-stories-social-prod",
      location: "us-multi-region",
    },
  },
  SECRETS: {
    FIREBASE_CONFIG: {
      secretId: "firebase-init",
      versionId: "latest",
    },
    SENDBIRD_API: {
      secretId: "sendbird-api",
      versionId: "latest",
    },
    FCM_SERVER_KEY: {
      secretId: "fcm-server-key",
      versionId: "latest",
    },
    STRIPE_SERVER_KEY: {
      secretId: "stripe-private-key",
      versionId: "latest",
    },
    XCLOUD_WALLET: {
      secretId: "xcloud-wallet-gateway-gcp-to-aws",
      versionId: "latest",
    },
    RAPID_API: {
      secretId: "rapid-api-key",
      versionId: "latest",
    },
    GEO_PLACES: {
      secretId: "geoplaces-map-api",
      versionId: "latest",
    },
    GOOGLE_TRANSLATE: {
      secretId: "google-translate-api",
      versionId: "latest",
    },
    EXCHANGE_RATE: {
      secretId: "exchange-rate-api",
      versionId: "latest",
    },
  },
  SENDBIRD: {
    SENDBIRD_APP_ID: "AE88AAA6-1206-4FEF-B384-052B14A3C6B6",
    API_URL: "https://api-AE88AAA6-1206-4FEF-B384-052B14A3C6B6.sendbird.com",
    WEBHOOK_URL: "https://sendbirdpushnotifications-qagjtluvcq-uc.a.run.app/",
  },
  FIREBASE: {
    apiKey: "AIzaSyDDl7fwpaw2jq0e4P9HXLVRBiHgPUlvNX4",
    authDomain: "milkshake-club.firebaseapp.com",
    projectId: "milkshake-club",
    storageBucket: "milkshake-club.appspot.com",
    messagingSenderId: "373735760752",
    appId: "1:373735760752:web:692571f8870097b27625b5",
    measurementId: "G-Z8YF9KBJ8F",
  },
  GRAPHQL: {
    CORS_ORIGINS: ["https://milkshake.club", "https://milkshake-club.web.app"],
  },
  STRIPE: {
    merchantOnboardingSuccessUrl:
      "https://milkshake.club/app/profile/settings/merchant/banking-registration-init",
    merchantOnboardingFailureUrl:
      "https://milkshake.club/app/profile/settings/merchant/banking-registration-refresh",
    webhookEndpoint: "https://onpurchaseintentsuccess-qagjtluvcq-uc.a.run.app/",
  },
  LEDGER: {
    region: "us-east-2",
    name: "inapp-wallet-prod",
    tables: {
      WALLET: "wallets",
      TRANSACTION: "transactions",
    },
    globalCookieStore: {
      userID: "global-cookie-store-owner" as UserID,
      walletAliasID:
        "milkshake-v1.0_global-cookie-store-wallet" as WalletAliasID,
      topUpWalletProductID: "prod_ONQtZxQzixZ4vc" as StripeProductID,
      topUpWalletPriceID: "price_1Nag1iBbKljWimkIvHrgLtB4" as StripePriceID,
      topUpWalletWishID: "TOP_UP_WALLET_WISH_ID" as WishID,
    },
    premiumChatStore: {
      userID: "premium-chat-store-owner" as UserID,
      walletAliasID:
        "milkshake-v1.0_premium-chat-store-wallet" as WalletAliasID,
      premiumChatWishID: "PREMIUM_CHAT_WISH_ID" as WishID,
    },
    recallGracePeriodDays: 90,
  },
  WALLET_GATEWAY: {
    postTransaction: {
      url: "https://5chl6vcl2c.execute-api.us-east-2.amazonaws.com/Production/transaction",
    },
    permaTransfer: {
      url: "https://5chl6vcl2c.execute-api.us-east-2.amazonaws.com/Production/permatransfer",
    },
    recallTransaction: {
      url: "https://5chl6vcl2c.execute-api.us-east-2.amazonaws.com/Production/transaction/recall",
    },
    cashoutTransaction: {
      url: "https://5chl6vcl2c.execute-api.us-east-2.amazonaws.com/Production/transaction/cashout",
    },
    getWallet: {
      url: "https://5chl6vcl2c.execute-api.us-east-2.amazonaws.com/Production/wallet",
    },
    createWallet: {
      url: "https://5chl6vcl2c.execute-api.us-east-2.amazonaws.com/Production/wallet",
    },
  },
};

interface ConfigEnv {
  GCLOUD: {
    projectId: string;
  };
  BUCKETS: {
    UserStories: BucketDef;
  };
  SECRETS: {
    FIREBASE_CONFIG: SecretConfig;
    SENDBIRD_API: SecretConfig;
    FCM_SERVER_KEY: SecretConfig;
    STRIPE_SERVER_KEY: SecretConfig;
    XCLOUD_WALLET: SecretConfig;
    RAPID_API: SecretConfig;
    GEO_PLACES: SecretConfig;
    GOOGLE_TRANSLATE: SecretConfig;
    EXCHANGE_RATE: SecretConfig;
  };
  SENDBIRD: {
    SENDBIRD_APP_ID: string;
    API_URL: string;
    WEBHOOK_URL: string;
  };
  FIREBASE: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  GRAPHQL: {
    CORS_ORIGINS: string | string[];
  };
  STRIPE: {
    merchantOnboardingSuccessUrl: string;
    merchantOnboardingFailureUrl: string;
    webhookEndpoint: string;
  };
  LEDGER: {
    region: string;
    name: string;
    tables: {
      [key in QuantumLedgerTables]: QuantumLedgerTable;
    };
    globalCookieStore: {
      userID: UserID;
      walletAliasID: WalletAliasID;
      topUpWalletProductID: StripeProductID;
      topUpWalletPriceID: StripePriceID;
      topUpWalletWishID: WishID;
    };
    premiumChatStore: {
      userID: UserID;
      walletAliasID: WalletAliasID;
      premiumChatWishID: WishID;
    };
    recallGracePeriodDays: number;
  };
  WALLET_GATEWAY: {
    postTransaction: {
      url: string;
    };
    permaTransfer: {
      url: string;
    };
    recallTransaction: {
      url: string;
    };
    cashoutTransaction: {
      url: string;
    };
    getWallet: {
      url: string;
    };
    createWallet: {
      url: string;
    };
  };
}

export enum QuantumLedgerTables {
  WALLET = "WALLET",
  TRANSACTION = "TRANSACTION",
}
export type QuantumLedgerTable = string;

export default (() => {
  // console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === "production") {
    return prodConfig;
  } else if (process.env.NODE_ENV === "staging") {
    return stagingConfig;
  } else if (process.env.NODE_ENV === "development") {
    return devConfig;
  }
  return prodConfig;
})();
