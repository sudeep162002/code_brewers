import "../StyleSheets/MultiPlayerHeader.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useSocketHook, { socket } from "../customHooks/useSetupHook.js";

import useSocketroom from "../customHooks/useSocketroom.js";

const CreateRoomContainer = (props) => {
  const navigate = useNavigate();
  const setRoomParams = () => {
    useSocketroom.createRoom(socket.id + "room");
    navigate(`fast_fingers/${socket.id + "room"}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(socket?.id + "room")
      .then(() => {
        alert("text copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying text to clipboard:", error);
      });
  };

  return (
    <div className="create-room-bg-container" onClick={(e) => props.onclick(e)}>
      <div className="create-rooom-component">
        <div className="link-container-outer-div">
          {socket.id ? (
            <p
              className="link-container"
              style={{ cursor: socket.id ? "pointer" : "wait" }}
            >
              {socket.id + "room"}
            </p>
          ) : (
            <p
              className="link-container"
              style={{ cursor: socket.id ? "pointer" : "wait" }}
            >
              Server Loading....
            </p>
          )}
        </div>

        <button
          onClick={() => setRoomParams()}
          disabled={!socket.id}
          style={{ cursor: socket.id ? "pointer" : "not-allowed" }}
        >
          Create Room
        </button>

        <button
          onClick={() => copyToClipboard()}
          style={{ cursor: socket.id ? "pointer" : "not-allowed" }}
          disabled={!socket.id}
        >
          {" "}
          Copy Link
        </button>
      </div>
    </div>
  );
};

const JoinRoomContainer = (props) => {
  const navigate = useNavigate();
  const [joiningLink, setJoiningLink] = useState("");
  return (
    <div className="create-room-bg-container" onClick={(e) => props.onclick(e)}>
      <div className="create-rooom-component">
        <input
          placeholder="enter joining link here"
          onChange={(e) => {
            setJoiningLink(e.target.value);
          }}
          value={joiningLink}
        />
        <button
          disabled={!joiningLink}
          style={{ cursor: joiningLink ? "pointer" : "not-allowed" }}
          onClick={() => {
            if (joiningLink) {
              useSocketroom.createRoom(joiningLink);
              navigate(`/fast_fingers/${joiningLink}`);
            }
          }}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

const MultiPlayerHeader = () => {
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);
  const [socketId] = useSocketHook();
  console.log("Accessing state socket", socketId);

  return (
    <>
      {createRoom && (
        <CreateRoomContainer
          onclick={(e) => e.currentTarget == e.target && setCreateRoom(false)}
          socketId={socketId}
        />
      )}
      {joinRoom && (
        <JoinRoomContainer
          onclick={(e) => e.currentTarget == e.target && setJoinRoom(false)}
        />
      )}
      <div className="create-room-outer-container">
        <div className="create-room-main-container">
          <div className="room-optin-container">
            <div
              className="create-room-container" 
              onClick={() => setCreateRoom(!createRoom)}
            >
              Create
            </div>
            <div
              className="join-room-container"
              onClick={() => setJoinRoom(true)}
            >
              Join
            </div>
          </div>
          <div className="room-optin-container" >
            <div
              className="create-room-container"
              onClick={() => setCreateRoom(!createRoom)}
            >
              Play solo
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiPlayerHeader;
