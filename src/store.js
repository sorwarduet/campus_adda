import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";
import activeSlice from "./reducers/activeSlice.js";

export default configureStore({
  reducer: {
    userInfo: userSlice,
    activeFriend:activeSlice
  },
});
