const devConfig: ConfigEnv = {
  GCLOUD: {
    projectId: "milkshake-dev-faf77",
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
  },
  SENDBIRD: {
    SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
    API_URL: "https://api-D24F8D62-B601-4978-8DFB-F17DB6CD741F.sendbird.com",
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
};
const stagingConfig: ConfigEnv = {
  GCLOUD: {
    projectId: "milkshake-dev-faf77",
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
  },
  SENDBIRD: {
    SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
    API_URL: "https://api-D24F8D62-B601-4978-8DFB-F17DB6CD741F.sendbird.com",
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
};
const prodConfig: ConfigEnv = {
  GCLOUD: {
    projectId: "milkshake-dev-faf77",
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
  },
  SENDBIRD: {
    SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
    API_URL: "https://api-D24F8D62-B601-4978-8DFB-F17DB6CD741F.sendbird.com",
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
};

interface SecretConfig {
  secretId: string;
  versionId: string;
}
interface ConfigEnv {
  GCLOUD: {
    projectId: string;
  };
  SECRETS: {
    FIREBASE_CONFIG: SecretConfig;
    SENDBIRD_API: SecretConfig;
  };
  SENDBIRD: {
    SENDBIRD_APP_ID: string;
    API_URL: string;
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
}

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
