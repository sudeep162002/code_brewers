import "../StyleSheets/scoreboard.css";

import { addPlayers, setShowBoard } from "../redux/app/fetures/playersSlice";
import { useDispatch, useSelector } from "react-redux";

import { getMyProfile } from "../utils/multiplayerFunctions";
import { socket } from "../customHooks/useSetupHook";

export default function ScoreBoard() {
  const dispatch = useDispatch();
  const rankResult = useSelector(
    (state) => state.rootReducer.playersInfo.scoreRank
  );
  const assignProfile = useSelector(
    (state) => state.rootReducer.playersInfo.assignProfile
  );

  return (
    <div
      className="scoreboard-backgroud-div"
      onClick={(e) => {
        if ((e.currentTarget = e.target)) {
          dispatch(setShowBoard());
        }
      }}
    >
      {rankResult[0].id == socket.id && (
        <div className="scoreboard-container position-absolute">YOU WON !</div>
      )}
      <div className="scoreboard-container">
        {rankResult.map((elm, idx) => (
          <div className="runners-div">
            <div className="runner-info-div">
              <span id={`${idx + 1 == 1 && "winner-green"}}`}>{idx + 1}</span>
              <div className="scoreboard-profile-div">
                <img src={getMyProfile(assignProfile, elm.id)} />
              </div>
              <span
                className={`${socket.id == elm.id && "user"}`}
                id={`${idx + 1 == 1 && "winner"}`}
              >
                {elm?.id}
              </span>
              <span
                className={`${socket.id == elm.id && "user"}`}
                id={`${idx + 1 == 1 && "winner"}`}
              >
                Accuracy {elm?.accuracy ? elm?.accuracy + "%" : ""}
              </span>
            </div>
            <div
              className="runner-result-div"
              id={`${idx + 1 == 1 && "winner-green"}`}
            >
              {elm.wpm} wpm
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
