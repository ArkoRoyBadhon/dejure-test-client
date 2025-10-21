import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: true,
  token: null,
};
const learnerSlice = createSlice({
  name: "learner",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isLoading = false;
      state.token = null;
    },

    setToken(state, action) {
      state.token = action.payload;
    },
    setState(state, action) {
      return action.payload;
    },
  },
});

export const { setUser, logout, setToken, setState } = learnerSlice.actions;
export default learnerSlice.reducer;
