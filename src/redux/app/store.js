import { combineReducers, configureStore } from "@reduxjs/toolkit";

import playersSlice from "./fetures/playersSlice";

const rootReducer = combineReducers({
  playersInfo: playersSlice,
});

export default configureStore({
  reducer: {
    rootReducer: rootReducer,
  },
});
