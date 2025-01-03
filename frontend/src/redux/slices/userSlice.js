import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isloading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SiginStart: (state) => {
      state.isloading = true;
    },
    SigninSuccess: (state, action) => {
      state.isloading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    SigninFailure: (state, action) => {
      state.isloading = false;
      state.error = action.payload;
    },
    UpdateuserStart: (state) => {
      state.error = null;
    },
    UpdateuserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    UpdateuserFailure: (state, action) => {
      state.error = action.payload;
    },
    DeleteLogoutUserSuccess: (state, action) => {
      state.currentUser = null;
      state.error = null;
    },
    DeleteLogoutUserFailure: (state, action) => {
      state.error = action.payload;
    },
    //Add Logout Actions
    logoutUser: (state) => {
      state.currentUser = null; // Clears the current user
      state.isloading = false; // Ensures loading state is false
      state.error = null; // Clears any existing errors
    },
  },
});

export const {
  SiginStart,
  SigninSuccess,
  SigninFailure,
  UpdateuserStart,
  UpdateuserSuccess,
  UpdateuserFailure,
  DeleteLogoutUserSuccess,
  DeleteLogoutUserFailure,
  logoutUser,
} = userSlice.actions;

export const selectUser = (state) => state.user.currentUser;

export default userSlice.reducer;
