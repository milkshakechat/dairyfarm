import config from "@/config.env";
import { getSendbirdSecret } from "@/utils/secrets";
import { UserID, placeholderImageThumbnail } from "@milkshakechat/helpers";
import axios from "axios";

class SendBirdService {
  private static secretKey: string;

  private constructor() {
    // Constructor should be empty for singleton classes
  }

  // const secret = await SendBirdService.getSendbirdSecret();
  public static async getSendbirdSecret() {
    if (!this.secretKey) {
      const secretKey = await getSendbirdSecret();
      this.secretKey = secretKey;
      return secretKey;
    }
    return this.secretKey;
  }
}

export default SendBirdService;

export const listSendbirdUsers = async () => {
  console.log(`listSendbirdUsers`);
  const secretKey = await SendBirdService.getSendbirdSecret();

  try {
    const response = await axios.get(`${config.SENDBIRD.API_URL}/v3/users`, {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": secretKey,
      },
    });
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
};

export const createSendbirdUser = async ({ userID }: { userID: UserID }) => {
  console.log(`createSendbirdUser`);
  const secretKey = await SendBirdService.getSendbirdSecret();

  try {
    const response = await axios.post(
      `${config.SENDBIRD.API_URL}/v3/users`,
      {
        user_id: userID,
        nickname: "Monsier User",
        profile_url: placeholderImageThumbnail,
        issue_access_token: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": secretKey,
        },
      }
    );
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
};

interface SendbirdSessionTokenResponse {
  token: string;
  expires_at: number;
}
export const issueSessonToken = async ({ userID }: { userID: UserID }) => {
  console.log(`issueSessonToken`);
  const secretKey = await SendBirdService.getSendbirdSecret();
  try {
    const response = await axios.post<SendbirdSessionTokenResponse>(
      `${config.SENDBIRD.API_URL}/v3/users/${userID}/token`,
      {
        user_id: userID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": secretKey,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

interface CreateGroupChatProps {
  participants: UserID[];
  isEphemeral?: boolean;
}
export const createGroupChannel = async ({
  participants,
  isEphemeral = false,
}: CreateGroupChatProps) => {
  console.log(`createGroupChannel`);
  const secretKey = await SendBirdService.getSendbirdSecret();
  try {
    const response = await axios.post(
      `${config.SENDBIRD.API_URL}/v3/group_channels`,
      {
        user_ids: participants,
        is_distinct: true,
        is_public: false,
        is_ephemeral: isEphemeral,
        invitation_status: participants.reduce<Record<UserID, string>>(
          (acc, curr) => {
            return {
              ...acc,
              [curr]: "joined",
            };
          },
          {}
        ),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": secretKey,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

// interface CreateGroupChannelInviteProps {
//   userID: UserID;
//   channelUrl: string;
// }
// export const acceptGroupChannelInvite = async ({
//   userID,
//   channelUrl,
// }: CreateGroupChannelInviteProps) => {
//   console.log(`acceptGroupChannelInvite`);
//   const secretKey = await SendBirdService.getSendbirdSecret();
//   try {
//     const response = await axios.post(
//       `${config.SENDBIRD.API_URL}/v3/group_channels/${channelUrl}/accept`,
//       {
//         user_id: userID,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Api-Token": secretKey,
//         },
//       }
//     );
//     console.log(response.data);
//     return response.data;
//   } catch (e) {
//     console.log(e);
//   }
// };
