import "../StyleSheets/PlayersInfoContainer.css";

import React, { useEffect, useState } from "react";
import {
  addPlayers,
  setAssignedProfile,
} from "../redux/app/fetures/playersSlice";
import { assignProfile, getMyProfile } from "../utils/multiplayerFunctions";
import { useDispatch, useSelector } from "react-redux";

import Performance from "../Assets/performance.svg";
import { Profile } from "../Assets";
import { socket } from "../customHooks/useSetupHook";
import { useParams } from "react-router-dom";
import useSocketroom from "../customHooks/useSocketroom";

// import Profile from "../Assets/Profile.jpg";

// import Profile from "../Assets/images/Vector (1).svg";

const PlayersInfoContainer = () => {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  // const [assignProfile, setAssignedProfile] = useState({});
  const assignProfile = useSelector(
    (state) => state.rootReducer.playersInfo.assignProfile
  );
  const [start, setStart] = useState(false);
  const playerResult = useSelector(
    (state) => state.rootReducer.playersInfo.scoreRecord
  );
  let count = 0;
  const dispatch = useDispatch();
  socket.on("room_members", (data) => {
    setPlayers(data.members);
    dispatch(addPlayers({ players: data?.members }));
    dispatch(setAssignedProfile({ data: data.assignedProfiles }));
    // const object = assignProfile(profileArray, players);
  });

  function convertToSocketId(str) {
    const result = str.replace(new RegExp("room", "g"), ""); // remove all occurrences of the target string
    return result;
  }
  const startGame = (roomId) => {
    useSocketroom.startGame(roomId);
  };
  socket.on("start", (status) => {
    switch (status.start) {
      case true:
        setStart(true);
        setTimeout(() => {
          setStart(false);
        }, 3000);
        break;
    }
  });

  return (
    <>
      {start && (
        <div className="start-countdown">
          <p className="count">starting...</p>
        </div>
      )}
      <div className="players-stat-container">
        {players.map((elm) => (
          <div
            className={
              elm == socket.id ? "user-container-active" : "user-container"
            }
          >
            <div className="player-stat-card">
              <div className="player-profile-conatainer">
                {/* {console.log(getMyProfile(assignProfile, elm))} */}
                <img src={getMyProfile(assignProfile, elm)} alt="" />
              </div>
              <div className="player-stat-wpm-conatainer">
                <img src={Performance} alt="" />
                <p>
                  {playerResult[elm] ? playerResult[elm] : 0} <span>wpm</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 
        <div className="players-profile-base-container">
          {convertToSocketId(id) == socket.id && (
            <button onClick={() => startGame(id)} id="start-button">
              Start
            </button>
          )}
          {players.map(() => (
            <div className="players-profile-card">
              <p className="inner-profile-container"></p>
            </div>
          ))}
        </div> */}
    </>
  );
};

export default PlayersInfoContainer;
