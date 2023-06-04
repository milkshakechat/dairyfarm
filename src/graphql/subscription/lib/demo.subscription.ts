import { sleep } from "@/utils/utils";

export const demoSubscription = {
  subscribe: async function* () {
    for (const msg of ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"]) {
      await sleep(2000);
      yield { message: msg };
    }
  },
  resolve: (payload: any) => {
    // Perform any additional logic you want on the payload here
    return payload;
  },
};
