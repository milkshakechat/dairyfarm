import {
  BucketDef,
  SecretConfig,
  UserID,
  WalletAliasID,
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
      userID: "store-owner" as UserID,
      walletAliasID: "milkshake-v0.1_store-wallet" as WalletAliasID,
    },
    recallGracePeriodDays: 90,
  },
  WALLET_GATEWAY: {
    postTransaction: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/transaction",
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
    webhookEndpoint: "https://onpurchaseintentsuccess-hcdyzvq35a-uc.a.run.app/",
  },
  LEDGER: {
    region: "ap-northeast-1",
    name: "inapp-wallet-staging",
    tables: {
      WALLET: "wallets",
      TRANSACTION: "transactions",
    },

    globalCookieStore: {
      userID: "store-owner" as UserID,
      walletAliasID: "milkshake-v0.1_store-wallet" as WalletAliasID,
    },
    recallGracePeriodDays: 90,
  },
  WALLET_GATEWAY: {
    postTransaction: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/transaction",
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
  },
};

const prodConfig: ConfigEnv = {
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
    CORS_ORIGINS: ["https://milkshake.chat"],
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
    name: "inapp-wallet-prod",
    tables: {
      WALLET: "wallets",
      TRANSACTION: "transactions",
    },
    globalCookieStore: {
      userID: "store-owner" as UserID,
      walletAliasID: "milkshake-v0.1_store-wallet" as WalletAliasID,
    },
    recallGracePeriodDays: 90,
  },
  WALLET_GATEWAY: {
    postTransaction: {
      url: "https://ukywzxz9dc.execute-api.ap-northeast-1.amazonaws.com/Staging/transaction",
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
    };
    recallGracePeriodDays: number;
  };
  WALLET_GATEWAY: {
    postTransaction: {
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
    // @ts-ignore
  } else if (process.env.NODE_ENV === "staging") {
    return stagingConfig;
  }
  return devConfig;
})();
