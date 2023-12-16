import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    users: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  },
  reducers: {
    userInfo: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { userInfo } = userSlice.actions;
export default userSlice.reducer;
