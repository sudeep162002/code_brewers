import React from "react";
import { socket } from "./useSetupHook";

const useSocketroom = {
    createRoom: (room) => {
        socket.emit("create", room);
    },
    sendKeyDown: (data, room) => {
        socket.emit("keydown", { data: data, room: room });
    },
    getActiveMembers: (room) => {
        socket.emit("activeRoom", room);
    },
    startGame: (room) => {
        socket.emit("StartGame", room);
    },
};

export default useSocketroom;
