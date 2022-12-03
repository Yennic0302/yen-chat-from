import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const currentChatReducer = createSlice({
  name: "current-chat",
  initialState,
  reducers: {
    SET_CURRENT_CHAT: (state, action) => action.payload,
    DEFAULT_CURRENT_CHAT: (state, action) => initialState,
  },
});

export const { SET_CURRENT_CHAT, DEFAULT_CURRENT_CHAT } =
  currentChatReducer.actions;
export default currentChatReducer.reducer;
