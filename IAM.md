# IAM Users

## Google Cloud
- 🎖 `dairyfarm-sockets-server` for backend server deployed on Google Cloud Run
- 🎖 `firebase-admin-sdk` default service account for Firebase Admin SDK
- 🎖 `compute` default service account for Google Compute Cloud

## Secret Manager
Secrets are saved to either google cloud secret manager or AWS secret manager. However, to access it we must first use the service account `dairyfarm-sockets-server` to access the cloud secret manager.

Locally we hash the service account `dairyfarm-sockets-server` key as json into `.env` file as `GCP_KEYFILE_BASE64`.

```js
const GCP_service_account_key = {
  "type": "service_account",
  "project_id": "superlore-demo",
  "private_key_id": "______",
  "private_key": "-----BEGIN PRIVATE KEY-----_______\n-----END PRIVATE KEY-----\n",
  "client_email": "_____@superlore-demo.iam.gserviceaccount.com",
  "client_id": "_______",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/_______%40superlore-demo.iam.gserviceaccount.com"
}
const AWS_service_account_key = {
  accessKey: "______",
  secretKey: "_________"
}
const base64EncodedKey_GCP = btoa(JSON.stringify(GCP_service_account_key))
const base64EncodedKey_AWS = btoa(JSON.stringify(AWS_service_account_key))
```

Now save `base64EncodedKey` into your `.ENV` file like so:

```.env
GCP_KEYFILE_BASE64=eyJ0eXBlIjoi....291bnQuY29tIn0=
AWS_KEYFILE_BASE64=ayJ0eXBlIjoi....291bnQuY29tIn0=
```

Then `secrets.ts:accessSecretVersionGCP` will be able to read from the secret manager. Those secrets are listed here:

- ㊙️ `firebase-init` is the firebase init json used for Firebase Admin SDK. Make sure you upload a json file.
- 