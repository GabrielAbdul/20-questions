"use client";

import { useEffect, useState } from "react";
import tmi from "tmi.js";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [latestMessage, setLatestMessage] = useState<string>(
    "Type !g with a question in Twitch Chat!"
  );
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [recordedAnswers, setRecordedAnswers] = useState<string[]>([]);
  const [messageTimeout, setMessageTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isListening, setIsListening] = useState<boolean>(true);
  const [randomAnswer, setRandomAnswer] = useState<string | null>(null);
  const [activeRandomAnswer, setActiveRandomAnswer] = useState<string | null>(
    null
  );
  const [realAnswer, setRealAnswer] = useState<string>("");
  const [displayAnswer, setDisplayAnswer] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    const client = new tmi.Client({
      channels: ["cp9neji"],
    });

    client.connect();

    client.on("message", (channel, tags, message, self) => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        `${tags["display-name"]}: ${message}`,
      ]);

      if (messageTimeout) {
        clearTimeout(messageTimeout);
      }

      if (message.startsWith("!g")) {
        setLatestMessage(`${tags["display-name"]}: ${message}`);
      }
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setMessageTimeout(
        setTimeout(() => {
          setLatestMessage("Type !g with a question in Twitch Chat!");
        }, 5000)
      );

      if (isListening && message.startsWith("!a")) {
        setRecordedAnswers((prevAnswers) => [
          ...prevAnswers,
          `${tags["display-name"]}: ${message}`,
        ]);
      }
    });

    return () => {
      client.disconnect();
      if (messageTimeout) {
        clearTimeout(messageTimeout);
      }
    };
  }, [messageTimeout, isListening]);

  const handleAnswer = (isYes: boolean) => {
    const color = isYes ? "text-white bg-green-950" : "text-white bg-red-950";
    setPreviousQuestions((prevQuestions) => [
      ...prevQuestions,
      `<p class="${color}">${latestMessage}</p> <hr />`,
    ]);
  };

  // const handleRandomAnswer = () {
  //   setPreviousQuestions((prevQuestions) => [
  //     ...prevQuestions,
  //     `<p class="text-white bg-blue-950">${latestMessage}</p> <hr />`,
  //   ]);
  //   setLatestMessage("Is it Green?");
  //   setRecordedAnswers([]);
  // }

  const handleUndo = () => {
    setLatestMessage("Is it Green?");
  };

  const handleNewGame = () => {
    const inputElement = document.getElementById("realAnswer");
    const buttonElement = document.getElementById("inputButton");

    setPreviousQuestions([]);
    setLatestMessage("Type !g with a question in Twitch Chat!");
    setRandomAnswer(null);
    setActiveRandomAnswer(null);
    setCurrentQuestion(0);
    setIsListening(false);
    setChatMessages([]);

    inputElement?.classList.remove("hidden");
    buttonElement?.classList.remove("hidden");
  };

  const handleRandomAnswer = () => {
    if (recordedAnswers.length > 0) {
      const randomIndex = Math.floor(Math.random() * recordedAnswers.length);
      setRandomAnswer(recordedAnswers[randomIndex]);
      setActiveRandomAnswer(recordedAnswers[randomIndex]);
    }
  };

  const handleRandomAnswerModal = (isYes: boolean) => {
    const color = isYes ? "text-white bg-green-950" : "text-white bg-red-950";
    setPreviousQuestions((prevQuestions) => [
      ...prevQuestions,
      `<p class="${color}">${activeRandomAnswer}</p> <hr />`,
    ]);
  };

  const recordAnswers = () => {
    setIsListening(true);
  };

  const setRealAnswerWrapper = () => {
    const inputElement = document.getElementById("realAnswer");
    const buttonElement = document.getElementById("inputButton");
    const inputValue = (inputElement as HTMLInputElement).value;

    setRealAnswer(inputValue);

    inputElement?.classList.add("hidden");
    buttonElement?.classList.add("hidden");
  };

  const isCP9Neji = user?.username === "cp9neji";
  console.log(user?.username);

  return (
    <>
      <div className="relative z-20 mt-20 mb-2">
        <a
          href="#"
          className={`inline-flex col-span-1 justify-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
            !isCP9Neji && "cursor-not-allowed opacity-50"
          }`}
          onClick={isCP9Neji ? handleNewGame : undefined}
        >
          New Game
        </a>
      </div>
      <div className="relative z-20 grid grid-flow-col grid-cols-12 ">
        <div className="col-start-1 relative w-[25vw] h-[50vh] p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="min-h-full grid grid-flow-row auto-rows-auto align-middle">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Previous Questions
            </h5>
            <div
              className="mb-3 font-normal text-gray-700 dark:text-white max-h-min rounded-md"
              dangerouslySetInnerHTML={{ __html: previousQuestions.join("") }}
            />
          </div>
        </div>
        <div className="col-start-5 w-[25vw] h-[50vh] p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="min-h-full grid grid-flow-row auto-rows-auto align-middle">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
              Question #{currentQuestion}
            </h5>
            <p className="mb-3 text-3xl font-normal text-white bg-gray-700 max-h-min rounded-md">
              {latestMessage}
            </p>
            <div className="buttons grid grid-flow-col auto-cols-auto content-end ">
              <a
                href="#"
                className={`max-h-10 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                  !isCP9Neji && "cursor-not-allowed opacity-50"
                }`}
                onClick={isCP9Neji ? () => handleAnswer(true) : undefined}
              >
                Yes
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48 37.683 48 25 C 48 20.44 46.660281 16.189328 44.363281 12.611328 L 42.994141 14.228516 C 44.889141 17.382516 46 21.06 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579 4 25 C 4 13.421 13.421 4 25 4 C 30.443 4 35.393906 6.0997656 39.128906 9.5097656 L 40.4375 7.9648438 C 36.3525 4.2598437 30.935 2 25 2 z M 43.236328 7.7539062 L 23.914062 30.554688 L 15.78125 22.96875 L 14.417969 24.431641 L 24.083984 33.447266 L 44.763672 9.046875 L 43.236328 7.7539062 z"
                  ></path>
                </svg>
              </a>
              <a
                href="#"
                className={`max-h-10 col-span-1 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                  !isCP9Neji && "cursor-not-allowed opacity-50"
                }`}
                onClick={isCP9Neji ? () => handleAnswer(false) : undefined}
              >
                No
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                  style={{ fill: "#FA5252" }}
                >
                  <path d="M25,2C12.319,2,2,12.319,2,25s10.319,23,23,23s23-10.319,23-23S37.681,2,25,2z M33.71,32.29c0.39,0.39,0.39,1.03,0,1.42	C33.51,33.9,33.26,34,33,34s-0.51-0.1-0.71-0.29L25,26.42l-7.29,7.29C17.51,33.9,17.26,34,17,34s-0.51-0.1-0.71-0.29	c-0.39-0.39-0.39-1.03,0-1.42L23.58,25l-7.29-7.29c-0.39-0.39-0.39-1.03,0-1.42c0.39-0.39,1.03-0.39,1.42,0L25,23.58l7.29-7.29	c0.39-0.39,1.03-0.39,1.42,0c0.39,0.39,0.39,1.03,0,1.42L26.42,25L33.71,32.29z"></path>
                </svg>
              </a>
              <a
                href="#"
                className={`max-h-10 justify-center col-span-1 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                  !isCP9Neji && "cursor-not-allowed opacity-50"
                }`}
                onClick={isCP9Neji ? handleUndo : undefined}
              >
                Undo Question
              </a>
            </div>
          </div>
        </div>
      </div>
      {isCP9Neji && (
        <div className="buttons relative z-20 flex space-x-4 mt-4">
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={recordAnswers}
          >
            Record Answers
          </button>
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={() => setIsListening(false)}
          >
            Stop Listening
          </button>
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-yellow-700 rounded-lg hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
            onClick={handleRandomAnswer}
          >
            Random Answer
          </button>
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setDisplayAnswer(true)}
          >
            Display Answer
          </button>
        </div>
      )}
      {isCP9Neji && (
        <div className="relative z-20 mt-4">
          <input
            type="text"
            id="realAnswer"
            className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the real answer"
          />
          <button
            id="inputButton"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
              setRealAnswerWrapper();
            }}
          >
            Input
          </button>
        </div>
      )}
      {randomAnswer && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="dark:bg-gray-800 dark:border-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Random Answer</h2>
            <p className="mb-4">{activeRandomAnswer}</p>
            <div className="flex space-x-4">
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={() => {
                  handleRandomAnswerModal(true);
                  setRandomAnswer(null);
                }}
              >
                Yes
              </button>
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={() => {
                  handleRandomAnswerModal(false);
                  setRandomAnswer(null);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {displayAnswer && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className=" dark:bg-gray-700 dark:border-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Real Answer</h2>
            <p className="mb-4">{realAnswer}</p>
            <button
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => setDisplayAnswer(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
