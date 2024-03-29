import { TimestampFirestore } from "@milkshakechat/helpers";
import config from "@/config.env";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getTokenFromBearer(authBearStrig?: string) {
  // authBearStrig = "Bearer <token>"
  if (authBearStrig) {
    return authBearStrig.split(" ")[1];
  }
  return null;
}

export function sayHello() {
  return "Hello";
}
