import { createSlice } from "@reduxjs/toolkit";

const playersSlice = createSlice({
  name: "playersSlice",
  initialState: {
    players: [],
    isStart: false,
    scoreRecord: {},
    showScoreBoard: false,
    scoreRank: [],
    assignProfile: {},
  },

  reducers: {
    addPlayers: (state, { payload }) => {
      state.players = payload.players;
    },
    setStart: (state) => {
      state.isStart = true;
    },
    setStop: (state) => {
      state.isStart = false;
    },
    addResult: (state, { payload }) => {
      state.scoreRecord[payload.player] = payload.playerResult;
    },
    clearResult: (state) => {
      state.scoreRecord = {};
    },
    setRank: (state, { payload }) => {
      console.log("payload", payload);
      const roomObj = payload.roomObj;
      const objArray = [];
      for (const val in roomObj) {
        objArray.push(roomObj[val]);
      }
      const rankArray = objArray.sort((a, b) => b?.wpm - a?.wpm);
      state.scoreRank = rankArray;
      state.showScoreBoard = true;
    },
    setShowBoard: (state) => {
      state.showScoreBoard = false;
    },
    setAssignedProfile: (state, { payload }) => {
      state.assignProfile = payload.data;
    },
  },
});

export default playersSlice.reducer;

export const {
  setRank,
  addPlayers,
  setStart,
  addResult,
  clearResult,
  setStop,
  setShowBoard,
  setAssignedProfile,
} = playersSlice.actions;
