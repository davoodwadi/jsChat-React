import React from "react";
import { useState, useRef, useEffect } from "react";
import AuthenticationBox from "./Authentication";

// const [globalId, setGlobalId] = useState(1);

function getDummyBotResponse({ chain }) {
  const charSet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789        ";

  const length = 3; // adjust the length as needed
  const randomText = Array.from({ length }, () =>
    charSet.charAt(Math.floor(Math.random() * charSet.length)),
  ).join("");
  // console.log("chain inner", chain);
  return (
    `${chain[chain.length - 1].content} ${chain[chain.length - 1].key}` +
    randomText
  );
}

function simulateStreamingResponse({ chain }) {
  // console.log(chain);
  const charSet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789        ";

  return new Response(
    new ReadableStream({
      start(controller) {
        // Simulate data intervals
        const interval = setInterval(() => {
          // const data = `Data: ${Math.random()}\n`;
          const length = 5; // adjust the length as needed
          const data = Array.from({ length }, () =>
            charSet.charAt(Math.floor(Math.random() * charSet.length)),
          ).join("");
          controller.enqueue(data); // Send data to the stream

          // Stop after some data
          if (Math.random() > 0.95) {
            clearInterval(interval);
            controller.close(); // Close the stream
          }
        }, 100); // Emit data every 100ms
      },
    }),
  );
}

// Consuming the simulated streaming response
async function* consumeStream({ chain }) {
  const response = simulateStreamingResponse({ chain });
  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;
    // console.log("Received value:", value);
    yield value;
    // console.log(`Received: ${new TextDecoder().decode(value)}`);
  }
  console.log("Stream ended.");
}

function UserMessage(props) {
  return (
    <div
      contentEditable="true"
      suppressContentEditableWarning
      data-placeholder="New message"
      className="min-w-fit flex-1 bg-blue-400 p-1" //border-2 border-blue-500
      onKeyDown={props.handleEnter}
      id={props.id}
      ref={props.refElementUser}
    >
      {props.children}
    </div>
  );
}

function BotMessage(props) {
  console.log("botMessage rendering");

  return (
    <div
      contentEditable="true"
      suppressContentEditableWarning
      className="min-w-fit flex-1 bg-yellow-400 p-1" //border-yellow-500
      id={props.id}
      ref={props.refElementBot}
    >
      {props.children}
    </div>
  );
}

function Branch(props) {
  //   console.log("branch props.messages", props.messages);

  return (
    <div
      id={"branch" + props.id}
      className="flex-1 p-1" //border-2 border-red-300
    >
      {props.children}
    </div>
  );
}

function BranchContainer(props) {
  return (
    <div
      id={"branch-container" + props.id}
      className="flex flex-row flex-nowrap justify-between overflow-scroll" //border-4 border-green-300
    >
      {props.children}
    </div>
  );
}

function TestContainer(props) {
  const [userMessages, setUserMessages] = useState(() => [
    { key: [1], content: "", role: "user" },
  ]);
  const [botMessages, setBotMessages] = useState(() => []);
  const idInUserMessages = (id) =>
    userMessages.filter((m) => JSON.stringify(m.key) === id).length > 0; // bool; if id is in userMessages
  const idInBotMessages = (id) =>
    botMessages.filter((m) => JSON.stringify(m.key) === id).length > 0; // // bool; if id is in botMessages
  const getBotMessageForKey = (key) =>
    botMessages.filter((m) => JSON.stringify(m.key) === JSON.stringify(key))[0]; // returns BotMessage for a given key
  async function handleEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();

      let chain;
      const array = JSON.parse(event.target.id);
      // check if event.target.id in userMessages
      console.log("exists", idInUserMessages(event.target.id));
      if (idInBotMessages(event.target.id)) {
        // old user
        //
        console.log("old message");

        // find the latest branch on the same key length
        const sameParents = userMessages.filter(
          (m) =>
            (m.key.length === array.length) &
            (JSON.stringify(m.key.slice(0, -1)) ===
              JSON.stringify(array.slice(0, -1))),
        );
        const maxSameBranch = Math.max(
          ...sameParents.map((m) => m.key[m.key.length - 1]),
        );
        // console.log("maxSameBranch", maxSameBranch);
        // console.log(array.slice(0, -1));
        array[array.length - 1] = maxSameBranch + 1;

        const newArray = array.slice();
        newArray.push(1);

        setUserMessages((m) => {
          return [
            ...m,
            {
              key: array,
              content: `${event.target.textContent} ${array}`,
              // content: ``,
              role: "user",
            },
          ];
        });
        // get chain
        chain = getChain({ event: event });
        chain.push({
          key: array,
          content: event.target.textContent,
        });
        // console.log("chain", chain);
        //
        // const botResponse = getDummyBotResponse({ chain });
        const streamIterator = consumeStream({ chain: chain });
        let counter = 0;
        let chunks = "";
        for await (const chunk of streamIterator) {
          // console.log("chunk", chunk);
          chunks += chunk;
          const newBotEntry = { key: array, content: chunks, role: "bot" };
          if (counter === 0) {
            // first chunk
            setBotMessages((v) => [...v, newBotEntry]);
          } else {
            setBotMessages((v) =>
              v.map((m) =>
                JSON.stringify(m.key) === JSON.stringify(array)
                  ? newBotEntry
                  : m,
              ),
            );
          }

          counter += 1;
        }
        // set new userMessage
        setUserMessages((v) => [
          ...v,
          {
            key: newArray,
            // content: `New ${newArray}`,
            content: ``,
            role: "user",
          },
        ]);
      } else {
        // new user
        //
        console.log("new message");

        const newArray = array.slice();
        newArray.push(1);
        const newUserEntry = {
          key: newArray,
          // content: `New ${newArray}`,
          content: ``,
          role: "user",
        };
        // get chain
        chain = getChain({ event: event });
        chain.push({
          key: array,
          content: event.target.textContent,
        });
        //

        setUserMessages((v) => {
          // update the current user field
          // find the id and update the old userMessage
          const userMessagesCopy = [...v];
          const messageToUpdate = userMessagesCopy.find(
            (msg) => JSON.stringify(msg.key) === JSON.stringify(array),
          );
          messageToUpdate.content = event.target.textContent;
          return userMessagesCopy;
        });
        const streamIterator = consumeStream({ chain: chain });
        let counter = 0;
        let chunks = "";
        for await (const chunk of streamIterator) {
          chunks += chunk;
          const newBotEntry = { key: array, content: chunks, role: "bot" };
          if (counter === 0) {
            // first chunk
            setBotMessages((v) => [...v, newBotEntry]);
          } else {
            setBotMessages((v) =>
              v.map((m) =>
                JSON.stringify(m.key) === JSON.stringify(array)
                  ? newBotEntry
                  : m,
              ),
            );
          }

          counter += 1;
        }

        setUserMessages((v) => {
          // new userMessage
          const newUserMessages = [...v, newUserEntry];
          return newUserMessages;
        });
      }
    }
  }
  function getChain({ event }) {
    const array = JSON.parse(event.target.id);
    const chain = [];
    for (let i = 1; i < array.length; i++) {
      // console.log("i", i);
      const parentKey = array.slice(0, i);
      const parentUser = userMessages.filter(
        (m) => JSON.stringify(m.key) === JSON.stringify(parentKey),
      )[0];
      const parentBot = botMessages.filter(
        (m) => JSON.stringify(m.key) === JSON.stringify(parentKey),
      )[0];
      chain.push({ key: parentKey, content: parentUser.content });
      chain.push({ key: parentKey, content: parentBot.content });
    }
    return chain;
  }

  function RecursiveBranch(props) {
    useEffect(() => {
      if (
        props.refElementUser.current &&
        props.refElementUser.current.textContent === ""
      ) {
        console.log(
          "props.refElementUser.current?.focus();",
          props.refElementUser.current,
          props.refElementBot.current,
        );
        props.refElementUser.current?.focus();
        if (props.refElementBot.current) {
          props.refElementBot.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      }
    }, []);
    // tempMessages should be messages whose length is props.parentKey.length+1
    // and .slice(0,-1) JSON.stringify is equal to parent
    let tempUserMessages;
    if (props.parentKey) {
      // console.log("props.parentKey", props.parentKey.length);
      tempUserMessages = userMessages.filter(
        (m) =>
          (m.key.length - 1 === props.parentKey.length) &
          (JSON.stringify(m.key.slice(0, -1)) ===
            JSON.stringify(props.parentKey)),
      );
    } else {
      tempUserMessages = userMessages.filter((m) => m.key.length === 1);
    }

    return (
      tempUserMessages[0] && (
        <BranchContainer id={props.level} key={props.level}>
          {tempUserMessages.map((tm, i) => {
            return (
              <Branch id={props.level} key={`${props.level} ${i}`}>
                <UserMessage
                  id={JSON.stringify(tm.key)}
                  key={JSON.stringify(tm.key)}
                  handleEnter={handleEnter}
                  refElementUser={props.refElementUser}
                >
                  {tm.content}
                </UserMessage>
                {getBotMessageForKey(tm.key) && ( // tempBotMessages[i]
                  <BotMessage
                    id={JSON.stringify(tm.key)}
                    key={"b" + JSON.stringify(tm.key)}
                    refElementBot={props.refElementBot}
                  >
                    {getBotMessageForKey(tm.key).content}
                  </BotMessage>
                )}

                <RecursiveBranch
                  parentKey={tm.key}
                  parent={tm.key[props.level]}
                  level={props.level + 1}
                  refElementUser={props.refElementUser}
                  refElementBot={props.refElementBot}
                />
              </Branch>
            );
          })}
        </BranchContainer>
      )
    );
  }
  return (
    <div id="chat-container" className="mx-2 my-2">
      <RecursiveBranch
        level={0}
        refElementUser={props.refElementUser}
        refElementBot={props.refElementBot}
      />
    </div>
  );
}
function sortByBranch(messages) {
  // sort by each branch and subbranch
  return messages.sort((a, b) => {
    // Convert strings to arrays
    const arrA = a.key;
    const arrB = b.key;

    // Compare arrays
    for (let i = 0; i < Math.min(arrA.length, arrB.length); i++) {
      if (arrA[i] !== arrB[i]) {
        return arrA[i] - arrB[i]; // Numeric comparison
      }
    }
    return arrA.length - arrB.length; // If they are equal so far, sort by length
  });
}
function maxIgnoringUndefined(arr) {
  // Filter out undefined values from the array
  const filteredArray = arr.filter((value) => value !== undefined);
  // Use Math.max to find the maximum value in the filtered array
  return Math.max(...filteredArray);
}
export default function App() {
  const refUser = useRef(null);
  const refBot = useRef(null);

  return (
    <>
      <AuthenticationBox />
      {/* <RecursiveParent /> */}
      <TestContainer refElementUser={refUser} refElementBot={refBot} />
      <button
        onClick={(e) => {
          console.log("ref click", refBot.current);
          refBot.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }}
      >
        focus
      </button>
      {/* <Messages /> */}
    </>
  );
}

function Messages() {
  const [messageId, setMessageId] = useState(() => 1);
  const [branchMessages, setBranchMessages] = useState(() => {
    // console.log("useState", props.globalId);
    return [
      <UserMessage
        id={messageId}
        key={messageId}
        onEnterPress={onEnterPress}
      />,
    ];
  });
  function onEnterPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      setMessageId((previousMessageId) => {
        const newMessageId = previousMessageId + 1;
        setBranchMessages((v) => {
          return [
            ...v,
            <UserMessage
              id={newMessageId}
              key={newMessageId}
              onEnterPress={onEnterPress}
            />,
          ];
        });
        return newMessageId;
      });
    }
  }
  //   console.log(branchMessages);
  //   console.log("messageLength", branchMessages.length);
  const containers = [];
  for (const message of branchMessages) {
    console.log("message.key", message.key);
    containers.push(
      <BranchContainer>
        <Branch>{message}</Branch>
      </BranchContainer>,
    );
  }
  // recursive insertion of elements of container

  return (
    <div
      id="messages"
      className="mt-4 flex flex-col items-center overflow-scroll border-4 border-blue-300"
    >
      {/* {branchMessages} */}
      {containers}
    </div>
  );
}

function RecursiveParent() {
  //   const [messages, setMessages] = useState(() => {
  //     return [<UserMessage id={"u1"} key={"u1"} onEnterPress={onEnterPress} />];
  //   });
  const [textContents, setTextContents] = useState(() => [
    { role: "user", content: "" },
  ]);
  const [messageId, setMessageId] = useState(() => 1);
  //   console.log("messages", messages);
  //   console.log(
  //     messages[0],
  //     messages[0].key,
  //     messages[0].props.id,
  //     messages[0].props.id === messages[0].key,
  //   );
  function enterPressFunc(event) {
    if (event.key === "Enter") {
      console.log("enter pressed", messageId);
      event.preventDefault();
      console.log("event.target", event.target.id);
      const botContent = event.target.textContent + " " + getDummyBotResponse();
      setTextContents((t) => [
        ...t.slice(0, -1),
        { role: "user", content: event.target.textContent },
        { role: "bot", content: botContent },
        { role: "user", content: "" },
      ]);

      setMessageId((previousMessageId) => {
        const newMessageId = previousMessageId + 1;
        return newMessageId;
      });
    }
  }
  function Recursive({ i }) {
    console.log("textContents.length", textContents.length);
    console.log("textContents", textContents);
    if (i < textContents.length) {
      const message = textContents[i];
      if (message.role === "user") {
        return (
          <BranchContainer>
            <Branch>
              <UserMessage id={i} key={i} enterPressFunc={enterPressFunc}>
                {message.content}
              </UserMessage>
              <Recursive i={i + 1} />
            </Branch>
          </BranchContainer>
        );
      } else {
        return (
          <>
            <BotMessage id={i} key={i}>
              {message.content}
            </BotMessage>
            <Recursive i={i + 1} />
          </>
        );
      }
    }
  }
  return <Recursive i={0} />;
}

const initialUserMessages = [
  { key: [1], content: "text 1", role: "user" },
  { key: [2], content: "text 2", role: "user" },
  { key: [3], content: "text 3", role: "user" },
  { key: [1, 1], content: "text 1,1", role: "user" },
  { key: [1, 2], content: "text 1,2", role: "user" },
  { key: [1, 2, 1], content: "text 1,2,1", role: "user" },
  { key: [1, 2, 2], content: "text 1,2,2", role: "user" },
  { key: [1, 2, 3], content: "text 1,2,3", role: "user" },
  { key: [1, 2, 3, 1], content: "text 1,2,3,1", role: "user" },
  { key: [2, 1], content: "text 2,1", role: "user" },
  { key: [2, 2], content: "text 2,2", role: "user" },
];
const initialBotMessages = [
  { key: [1], content: "bot text 1", role: "bot" },
  { key: [2], content: "bot text 2", role: "bot" },
  { key: [3], content: "bot text 3", role: "bot" },
  { key: [1, 1], content: "bot text 1,1", role: "bot" },
  { key: [1, 2], content: "bot text 1,2", role: "bot" },
  { key: [1, 2, 1], content: "bot text 1,2,1", role: "bot" },
  { key: [1, 2, 2], content: "bot text 1,2,2", role: "bot" },
  { key: [1, 2, 3], content: "bot text 1,2,3", role: "bot" },
  { key: [1, 2, 3, 1], content: "bot text 1,2,3,1", role: "bot" },
  { key: [2, 1], content: "bot text 2,1", role: "bot" },
];
