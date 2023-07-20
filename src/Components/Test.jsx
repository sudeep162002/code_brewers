import "../StyleSheets/Test.css";

import { WordList, planeWordList } from "../WordList/planewordlist";
import {
  addResult,
  setRank,
  setStart,
  setStop,
} from "../redux/app/fetures/playersSlice";
import react, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PlayersInfoContainer from "./PlayersInfoContainer";
import Refresh from "../Assets/refresh.png";
import ScoreBoard from "./ScoreBoard";
import { TestConsole } from "../utils/multiplayerFunctions";
import { socket } from "../customHooks/useSetupHook.js";
import { useParams } from "react-router-dom";


const Test = () => {
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currWordStatus, setCurrWordStatus] = useState(false);
  const [wordListArray, setWordListArray] = useState(planeWordList.split(" "));
  const [timeElapsed, setTimElapsed] = useState(0);
  const [isBlock, setIsBlock] = useState(false);
  const intervalRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  // resulting states
  const [correctWords, setCorrectWords] = useState(0);
  const [inCorrectWords, setIncorrectWords] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  // new logic
  const [wordnew, setWordnew] = useState(() => {
    const wordArray = [];
    WordList.map((value, idx) => {
      const initialState = {};
      initialState["word"] = value;
      initialState["backspace"] = 0;
      initialState["typed"] = "";
      initialState["keyStrokes"] = 0;
      wordArray.push(initialState);
    });
    return wordArray;
  });

  const { id } = useParams();
  const players = useSelector((state) => state.rootReducer.playersInfo.players);
  const startbutton = useSelector(
    (state) => state.rootReducer.playersInfo.isStart
  );
  const showScoreBoard = useSelector(
    (state) => state.rootReducer.playersInfo.showScoreBoard
  );

  function convertToSocketId(str) {
    const result = str.replace(new RegExp("room", "g"), ""); // remove all occurrences of the target string
    return result;
  }
  //start time on start button event
  socket.on("startTime", () => {
    dispatch(setStart({ start: true }));
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
      }, 1000);
      try{
        inputRef.current.focus();
      }catch (error) {
        // Handle the error gracefully without showing it on the screen (optional)
        console.error("An error occurred:", error);
      }
      
    }
  });
  socket.on("restart_game", () => {
    stopTimer();
    setRefresh(true);
    stopRefresh();
    setWpm(0);
    setAccuracy(0);
    setCorrectWords(0);
    setIncorrectWords(0);
    setWordnew(() => {
      const wordArray = [];
      WordList.map((value, idx) => {
        const initialState = {};
        initialState["word"] = value;
        initialState["backspace"] = 0;
        initialState["typed"] = "";
        initialState["keyStrokes"] = 0;
        wordArray.push(initialState);
      });
      return wordArray;
    });
    setIsBlock(false);
    setCurrWordIndex(0);
    setCurrWordStatus(false);
  });
  // ==================

  function startTimer(event) {
    const isOwner = convertToSocketId(id) == socket.id;
    const isStart = players.length == 1 || startbutton;
    if (isStart || (isOwner && isStart)) {
      event?.preventDefault();
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTimElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
        }, 1000);
      }
    }
  }

  function stopTimer() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTimElapsed(0);
    dispatch(setStop());
  }

  const [wordListStat, setWordListStat] = useState(() => {
    const initialWordListStat = {};
    wordListArray.forEach((value, idx) => {
      initialWordListStat[idx] = { test: false };
    });
    return initialWordListStat;
  });

  const handleUpdate = (word) => {
    // Update the "test" property of the object for the specified word to true
    setWordListStat((prevWordListStat) => ({
      ...prevWordListStat,
      [word]: {
        ...prevWordListStat[word],
        test: true,
      },
    }));

    // Update the "color" property of the object for the specified word to "blue"
    setWordListStat((prevWordListStat) => ({
      ...prevWordListStat,
      [word]: {
        ...prevWordListStat[word],
        color: "#D34E4E",
      },
    }));
  };

  function stopRefresh() {
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  }
  //

  function startRefresh() {
    const isOwner = convertToSocketId(id) == socket.id;
    if (isOwner) {
      if (timeElapsed == 0 || players.length == 1) {
        socket.emit("onData", id);
      }
    }
  }

  const handleUpdateNew = (value) => {
    setWordnew((wordsNew) => {
      let words = wordsNew;
      words[currWordIndex] = { ...words[currWordIndex], typed: value };
      return words;
    });
  };

  const handleBackspace = (value) => {
    setWordnew((wordsNew) => {
      let words = wordsNew;
      words[currWordIndex] = {
        ...words[currWordIndex],
        backspace: words[currWordIndex].backspace + 1,
      };
      return words;
    });
  };

  const handleKeyStrokes = () => {
    setWordnew((wordsNew) => {
      let words = wordsNew;
      words[currWordIndex] = {
        ...words[currWordIndex],
        keyStrokes: words[currWordIndex].keyStrokes + 1,
      };
      return words;
    });
  };

  const handleCorrectWord = (word) => {
    setWordListStat((prevWordListStat) => ({
      ...prevWordListStat,
      [word]: {
        ...prevWordListStat[word],
        color: "green",
      },
    }));
  };

  const inputRef = useRef(null);

  const handlekeyUp = (event) => {
    if (event.key == " ") {
      handleUpdateNew(event.target.value);
      setCurrWordStatus(false);
      event.target.value = "";
      setCurrWordIndex(currWordIndex + 1);
      event.preventDefault();
    }
    if (event.key === "Backspace") {
      handleBackspace();
    }
    if (event.key !== "Backspace" && event.key !== " ") {
      handleKeyStrokes();
    }
  };

  function getAccuracy() {
    let correctWords = wordnew.filter((elm, idx) => elm.word == elm.typed);
    let wrongWords = wordnew.filter(
      (elm, idx) => elm.word !== elm.typed && elm.typed
    );

    let backSpacesum = correctWords.reduce((acc, elm, idx) => {
      return acc + elm.backspace;
    }, 0);
    backSpacesum += wrongWords.reduce((acc, elm, idx) => {
      return acc + elm.backspace + elm.keyStrokes;
    }, 0);
    let keyStrokeCount = correctWords.reduce((acc, elm, idx) => {
      return acc + elm.keyStrokes;
    }, 0);

    const accuracy = Math.max(
      (keyStrokeCount / (keyStrokeCount + backSpacesum)) * 100,
      0
    );
    return {
      accuracy: accuracy,
      correctWords: correctWords.length,
      wrong: wrongWords.length,
    };
  }

  function getWPM() {
    let count = wordnew.filter((elm, idx) => elm.word == elm.typed).length;
    console.log("count", count);
    console.log("timeElapsed", timeElapsed);
    const wpm = (count / (timeElapsed || 1)) * 60;
    return Math.ceil(wpm);
  }
  function setResultStates(accuracy, correctWords, incorrectWords, fwpm) {
    setAccuracy(accuracy);
    setCorrectWords(correctWords);
    setIncorrectWords(incorrectWords);
    setWpm(fwpm);
  }

  socket.on("onRoomResult", (data) => {
    console.log("room result", data);
    dispatch(setRank({ roomObj: data }));
  });

  useEffect(() => {
    if (timeElapsed == 60) {
      const { accuracy, correctWords, wrong } = getAccuracy();
      setResultStates(accuracy, correctWords, wrong, wpm);
      stopTimer();
      setIsBlock(true);
      socket.emit("resultPop", {
        id: socket.id,
        accuracy: Math.ceil(accuracy),
        wpm: wpm,
        roomId: id,
      });
    }
    if (timeElapsed < 60 && timeElapsed !== 0) {
      setWpm(getWPM());
      sendRoomResult(socket.id);
    }
    socket.emit("scoreboardService", {
      id: socket.id,
      accuracy: Math.ceil(accuracy),
      wpm: wpm,
      roomId: id,
    });
  }, [timeElapsed]);

  useEffect(() => {
    try{
      inputRef.current.focus();
    }catch (error) {
      // Handle the error gracefully without showing it on the screen (optional)
      console.error("An error occurred:", error);
    }
  }, []);

  const sendRoomResult = (socketId) => {
    const data = {};
    const result = {};
    result["player"] = socketId;
    result["playerResult"] = wpm;
    data["room"] = id;
    data["playerData"] = result;
    socket.emit("roomResult", data);
  };

  const handleConrrection = (e) => {
    let currWord = e.target.value;
    let currIndex = currWord.length;
    // getWPM();
    // sendRoomResult(socket.id);
    if (wordnew[currWordIndex].word?.slice(0, currIndex) !== currWord) {
      setCurrWordStatus(true);
    } else {
      setCurrWordStatus(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startEvent = () => {
    socket.emit("startgame", id);
    try{
      inputRef.current.focus();
    }catch (error) {
      // Handle the error gracefully without showing it on the screen (optional)
      console.error("An error occurred:", error);
    }
  };

  // result
  socket.on("showResult", (data) => {
    // AddplayerResult(data);
    const { playerData } = data;
    dispatch(
      addResult({
        player: playerData?.player,
        playerResult: playerData?.playerResult,
      })
    );
  });

  return (
    <>
      {showScoreBoard && <ScoreBoard />}
      <div className="home-Page-content">
        <div className="typing-test-container">
          <div className="typing-word-display-container">
            {wordnew.map((elm, idx) => (
              <p
                key={idx}
                style={{
                  color:
                    currWordStatus && idx == currWordIndex
                      ? "red"
                      : wordListStat[idx].color,
                }}
                className={`default ${elm.typed == elm.word && "green"} ${
                  elm.typed !== elm.word && !!elm.typed && "red"
                } ${currWordIndex == idx && currWordStatus && "red-cur"}`}
              >
                {elm.word}
              </p>
            ))}
          </div>
          <div className="typing-pallete-container">
            <div className="typing-input-container flex-center">
              <input
                ref={inputRef}
                type="text"
                defaultValue=""
                onChange={handleConrrection}
                onKeyDown={handlekeyUp}
                onInput={startTimer}
                disabled={isBlock}
              />
            </div>
            <div className="wpm-result-container flex-center">{wpm} wpm</div>
            <div className="typing-test-timer-container flex-center">
              {formatTime(timeElapsed)}
            </div>
            <div
              className="typing-test-reset-btn flex-center"
              style={{ cursor: "pointer" }}
              onClick={() => startRefresh()}
            >
              <img src={Refresh} alt="refrsh" id={refresh ? `rotate` : ``} />
            </div>
            {convertToSocketId(id) == socket.id && (
              <div
                className="wpm-result-container"
                onClick={() => {
                  startEvent();
                  startTimer();
                }}
              >
                <p
                  id="gredient-color"
                  className="wpm-result-container flex-center"
                  style={{ cursor: "pointer" }}
                >
                  start
                </p>
              </div>
            )}
          </div>
          {/* for singal player css */}
          {/* typing-test-result-container-singal-player */}
          <div className="typing-test-result-container">
            <div className="typing-test-inner-left-container">
              <PlayersInfoContainer />
            </div>
            <dis className="typing-test-result-content">
              <div className="final-wpm-result">
                {wpm}
                <span>wpm</span>
              </div>
              <p id="result-alter-color">
                Accuracy <span>{Math.ceil(accuracy)}%</span>
              </p>
              <p>
                Correct Characters <span class="green"> {correctWords}</span>{" "}
              </p>
              <p id="result-alter-color">
                Incorrect Characters <span class="red">{inCorrectWords}</span>
              </p>
              <p>
                Time <span> 0.60</span>{" "}
              </p>
            </dis>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
