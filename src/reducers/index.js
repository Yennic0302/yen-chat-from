import { combineReducers } from "redux";
import currentUser from "./currentUser";
import currentChat from "./currentChat";
import requestFriendsOfCurrentUser from "./requestFriendsOfCurrentUser";
import friendsOfCurrentUser from "./friendsOfCurrentUser";
import chatsOfCurrentUser from "./chatsOfCurrentUser";

const reducer = combineReducers({
  currentUser,
  currentChat,
  requestFriendsOfCurrentUser,
  friendsOfCurrentUser,
  chatsOfCurrentUser,
});

export default reducer;
