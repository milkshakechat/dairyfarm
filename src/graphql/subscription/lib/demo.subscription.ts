import { sleep } from "@/utils/utils";

export const demoSubscription = {
  subscribe: async function* () {
    console.log("Hit the demo subscription resolver");
    for (const msg of ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"]) {
      console.log(`About to send "${msg}" after 2 seconds`);
      await sleep(2000);
      yield { message: msg };
    }
  },
  resolve: (payload: any) => {
    // Perform any additional logic you want on the payload here
    // console.log("got payload", payload);
    return payload;
  },
};
