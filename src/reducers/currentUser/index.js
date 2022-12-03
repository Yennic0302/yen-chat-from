import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const currentUserReducer = createSlice({
  name: "current-user",
  initialState,
  reducers: {
    SET_CURRENT_USER: (state, action) => action.payload,
    DEFAULT_CURRENT_USER: () => initialState,
  },
});

export const { SET_CURRENT_USER, DEFAULT_CURRENT_USER } =
  currentUserReducer.actions;
export default currentUserReducer.reducer;
