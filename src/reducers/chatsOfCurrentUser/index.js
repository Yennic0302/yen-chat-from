import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const chatsOfUserReducer = createSlice({
  name: "current-user",
  initialState,
  reducers: {
    SET_CHATS_OF_USER: (state, action) => action.payload,
    ADD_CHAT_USER: (state, action) => [...state, action.payload],
    ADD_CHAT_USER_RECEIVED: (state, action) => [...state, action.payload],
    UPDATE_CHAT_SEND_MESSAGE: (state, action) => {
      const chatUpdate = state.find(
        (chat) => chat.userId == action.payload.userId
      );
      const filterChats = state.filter(
        (chat) => chat.userId !== action.payload.userId
      );
      filterChats.unshift({
        ...chatUpdate,
        lastMessage: action.payload.lastMessage,
      });
      return filterChats;
    },
    UPDATE_CHAT_RECEIVED_MESSAGE: (state, action) => {
      const chatUpdate = state.find(
        (chat) => chat.userId === action.payload.chatFromUser
      );

      const filterChats = state.filter(
        (chat) => chat.userId !== action.payload.chatFromUser
      );

      filterChats.unshift({
        ...chatUpdate,
        lastMessage: action.payload.lastMessage,
        view: false,
        messagesPending: chatUpdate.messagesPending + 1,
      });

      return filterChats;
    },

    READ_CHAT: (state, action) => {
      const chatUpdate = state.find(
        (chat) => chat.userId === action.payload.userId
      );

      const filterChats = state.filter(
        (chat) => chat.userId !== action.payload.userId
      );

      filterChats.unshift({
        ...chatUpdate,
        view: true,
        messagesPending: 0,
      });

      return filterChats;
    },
    DEFAULT_CHATS_OF_USER: () => initialState,
  },
});

export const {
  SET_CHATS_OF_USER,
  ADD_CHAT_USER,
  ADD_CHAT_USER_RECEIVED,
  DEFAULT_CHATS_OF_USER,
  UPDATE_CHAT_RECEIVED_MESSAGE,
  UPDATE_CHAT_SEND_MESSAGE,
  READ_CHAT,
} = chatsOfUserReducer.actions;
export default chatsOfUserReducer.reducer;
