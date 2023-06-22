import config from "@/config.env";
import { getSendbirdSecret } from "@/utils/secrets";
import {
  SendBirdChannelURL,
  UserID,
  User_Firestore,
  placeholderImageThumbnail,
} from "@milkshakechat/helpers";
import axios from "axios";
import { isLaterThanNow_FirestoreTimestamp } from "./firestore";

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

export const createSendbirdUser = async ({
  userID,
  displayName,
  profileUrl,
}: {
  userID: UserID;
  displayName: string;
  profileUrl?: string;
}) => {
  console.log(`--- createSendbirdUser`);
  const secretKey = await SendBirdService.getSendbirdSecret();
  const data = {
    user_id: userID,
    nickname: displayName,
    profile_url: profileUrl || placeholderImageThumbnail,
    issue_access_token: true,
  };
  try {
    const response = await axios.post<PartialSendbirdUser>(
      `${config.SENDBIRD.API_URL}/v3/users`,
      data,
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
    console.log(`---- >>>>`);
    throw Error("Could not create Sendbird user.");
  }
};

export interface PartialSendbirdUser {
  user_id: string;
  nickname: string;
  profile_url: string;
  require_auth_for_profile_image: boolean;
  metadata: any;
  access_token: string;
  created_at: number;
  phone_number: string;
  is_online: boolean;
  last_seen_at: number;
  is_active: boolean;
  has_ever_logged_in: boolean;
  locale: string;
  unread_channel_count: number;
  unread_message_count: number;
}
export const getSendbirdUser = async ({ userID }: { userID: UserID }) => {
  console.log(`getSendbirdUser....`);
  const secretKey = await SendBirdService.getSendbirdSecret();
  try {
    const response = await axios.get<PartialSendbirdUser>(
      `${config.SENDBIRD.API_URL}/v3/users/${userID}?include_unread_count=true`,
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": secretKey,
        },
      }
    );
    console.log(response.data);
    console.log(`--------- getSendbirdUser ----------`);
    return response.data;
  } catch (e) {
    console.log((e as any).response);
    throw Error("Could not get Sendbird user.");
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

export interface PartialSendbirdChannel {
  name: string;
  channel_url: string;
  cover_url: string;
  custom_type: string;
  unread_message_count: number;
  data: any;
  is_distinct: boolean;
  is_public: boolean;
  is_super: boolean;
  is_ephemeral: boolean;
  is_access_code_required: boolean;
  member_count: number;
  joined_member_count: number;
  unread_mention_count: number;
  created_by: {
    user_id: string;
    nickname: string;
    profile_url: string;
    require_auth_for_profile_image: boolean;
  };
  members: {
    user_id: string;
    nickname: string;
    profile_url: string;
    is_active: boolean;
    is_online: boolean;
    last_seen_at: number;
    state: string;
  }[];
  last_message: any;
  message_survival_seconds: number;
  max_length_message: number;
  created_at: number;
  freeze: boolean;
}
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
    const response = await axios.post<PartialSendbirdChannel>(
      `${config.SENDBIRD.API_URL}/v3/group_channels`,
      {
        user_ids: participants,
        is_distinct: true,
        is_public: false,
        is_ephemeral: false,
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

export const inviteToGroupChannelWithAutoAccept = async ({
  channelUrl,
  userIDs,
}: {
  channelUrl: SendBirdChannelURL;
  userIDs: UserID[];
}) => {
  const secretKey = await SendBirdService.getSendbirdSecret();
  try {
    const response = await axios.post<PartialSendbirdChannel>(
      `${config.SENDBIRD.API_URL}/v3/group_channels/${channelUrl}/invite`,
      {
        user_ids: userIDs,
        is_distinct: true,
        is_public: false,
        is_ephemeral: true,
        invitation_status: userIDs.reduce<Record<UserID, string>>(
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
    throw Error(`Could not invite to group channel`);
  }
};

export const checkIfUserHasPaidChatPrivileges = (user: User_Firestore) => {
  if (
    user.isPaidChat &&
    user.isPaidChatUntil &&
    isLaterThanNow_FirestoreTimestamp(user.isPaidChatUntil)
  ) {
    return true;
  }
  return false;
};

export const deleteSendbirdUser = async ({ userID }: { userID: UserID }) => {
  console.log(`deleteSendbirdUser`);
  const secretKey = await SendBirdService.getSendbirdSecret();
  try {
    const response = await axios.delete<PartialSendbirdChannel>(
      `${config.SENDBIRD.API_URL}/v3/users/${userID}`,
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
