import { UserID } from "@milkshakechat/helpers";
import {
  PushNotificationShape,
  sendPushNotificationToUserDevices,
} from "@/services/push";

interface SendNotificationToUserProps {
  recipientUserID: UserID;
  shouldPush: boolean;
  notification: PushNotificationShape;
}
export const sendNotificationToUser = async ({
  recipientUserID,
  shouldPush,
  notification,
}: SendNotificationToUserProps) => {
  if (shouldPush) {
    await sendPushNotificationToUserDevices({
      userID: recipientUserID,
      notification,
    });
  }
};
