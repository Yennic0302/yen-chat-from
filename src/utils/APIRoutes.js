export const host = "http://localhost:5000";

export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/set-avatar`;

export const searchUserRoute = `${host}/api/search/get-users`;

export const requestFriendRoute = `${host}/api/friends/send-friend-request`;
export const getRequestFriendRoute = `${host}/api/friends/get-friend-request`;
export const acceptFriendRoute = `${host}/api/friends/accept-friend`;
export const declineFriendRoute = `${host}/api/friends/decline-friend`;
export const getFriendRoute = `${host}/api/friends/get-friends`;

export const getAllMessageRoute = `${host}/api/messages/get-all-messages`;
export const sendMessageRoute = `${host}/api/messages/add-messages`;

export const getChats = `${host}/api/chat/get-chats`;
export const createChat = `${host}/api/chat/create-chat`;
export const updateChat = `${host}/api/chat/update-chat`;
export const readChat = `${host}/api/chat/read-chat`;
