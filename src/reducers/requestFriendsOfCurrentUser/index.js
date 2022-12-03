import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const requestFriendsOfUserReducer = createSlice({
  name: "current-user",
  initialState,
  reducers: {
    SET_REQUEST_FRIENDS_OF_USER: (state, action) => action.payload,
    UPDATE_REQUEST_FRIEND_USER: (state, action) => {
      let newRequestsFriends = state.filter(
        (request) => request._id !== action.payload
      );
      return newRequestsFriends;
    },
    ADD_REQUEST_FRIEND_USER: (state, action) => [...state, action.payload],
    DEFAULT_REQUEST_FRIENDS_OF_USER: () => initialState,
  },
});

export const {
  SET_REQUEST_FRIENDS_OF_USER,
  UPDATE_REQUEST_FRIEND_USER,
  ADD_REQUEST_FRIEND_USER,
  DEFAULT_REQUEST_FRIENDS_OF_USER,
} = requestFriendsOfUserReducer.actions;
export default requestFriendsOfUserReducer.reducer;
