import { QLDBClient } from "@aws-sdk/client-qldb";
import { accessLocalAWSKeyFile } from "@/utils/secrets";
import config from "@/config.env";

export let Ledger_AWS: QLDBClient;
export const initQuantumLedger_AWS = async () => {
  console.log(
    `Init AWS Quantum Ledger database in region="${config.LEDGER.region}"`
  );
  const credentials = await accessLocalAWSKeyFile();
  // Create a QLDB client
  Ledger_AWS = new QLDBClient({
    region: config.LEDGER.region,
    credentials: credentials,
  });
  console.log(`AWS QLDB client created`);
  return Ledger_AWS;
};
