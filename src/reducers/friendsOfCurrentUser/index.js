import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const friendsOfUserReducer = createSlice({
  name: "current-user",
  initialState,
  reducers: {
    SET_FRIENDS_OF_USER: (state, action) => action.payload,
    ADD_FRIEND_USER: (state, action) => [...state, action.payload],
    DEFAULT_FRIENDS_OF_USER: () => initialState,
  },
});

export const { SET_FRIENDS_OF_USER, ADD_FRIEND_USER, DEFAULT_FRIENDS_OF_USER } =
  friendsOfUserReducer.actions;
export default friendsOfUserReducer.reducer;
