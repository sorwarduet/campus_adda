import {createSlice} from "@reduxjs/toolkit";

export const activeSlice = createSlice({
    name: "active",
    initialState: {
        activeStatus: localStorage.getItem("activeFriend")
            ? JSON.parse(localStorage.getItem("activeFriend"))
            : null,
    },
    reducers: {
        activeInfo: (state, action) => {
            state.activeStatus = action.payload;
        },
    },
});

export const { activeInfo } = activeSlice.actions;
export default activeSlice.reducer;