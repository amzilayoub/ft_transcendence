import React from "react";

import { useRouter } from "next/router";

const Convo = () => {
  const coversation = [
    {
      id: 1,
      sender: "me",
      message: "hello me",
      time: "12:00",
    },
    {
      id: 2,
      sender: "friend",
      message: "hello him",
      time: "12:00",
    },
  ];
  const router = useRouter();
  const { id } = router.query;
  const time = "12:00";
  const [chatData, setChatData] = React.useState(coversation);
  const [message, setMessage] = React.useState("");

  const [messageInput, setMessageInput] = React.useState("");
  const [chatId, setChatId] = React.useState(id);
  const [chatName, setChatName] = React.useState("");
  const [chatAvatar, setChatAvatar] = React.useState("");
  const [chatLastMessage, setChatLastMessage] = React.useState("");
  const [chatLastMessageTime, setChatLastMessageTime] = React.useState("");
  const [chatUnreadMessages, setChatUnreadMessages] = React.useState(0);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessage = {
      id: chatData.length + 1,
      sender: "me",
      message: messageInput,
      time: "12:00",
    };

    if (messageInput === "") return;
    else {
      setChatData([...chatData, newMessage]);
      setMessageInput("");
    }
  };

  React.useEffect(() => {
    //fetch chat data using that id
    // store chat data in state
    // render chat data
  }, [id]);
  const myMessage = (msg: string, timestamp: string) => {
    return (
      <div className={`flex w-full flex-col justify-around`}>
        <p className="w-fit rounded-lg bg-[#36404A] p-2 text-right text-xl text-white">
          {msg}
        </p>
        <p className="text-right text-xs text-white">{timestamp}</p>
      </div>
    );
  };
  const friendMessage = (msg: string, timestamp: string) => {
    return (
      <div className={`flex w-full flex-col justify-around`}>
        <p className="w-fit rounded-lg bg-[#7269EF] p-2 text-left text-xl text-white">
          {msg}
        </p>
        <p className=" text-xs text-white">{timestamp}</p>
      </div>
    );
  };
  return (
    <div className="h-[100vh] w-full bg-[#262E35] ">
      <h1 className="flex h-[3vh] w-full flex-col items-center justify-center bg-slate-500 text-center text-3xl text-white">
        {id}
      </h1>
      <div className="flex h-[97vh] w-full flex-col justify-between">
        <div className="">
          {chatData.map((message) => (
            <div
              key={message.id}
              className={`flex w-full flex-col  ${
                message.sender === "me"
                  ? "items-end justify-end"
                  : "items-start justify-start"
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                {message.sender === "me"
                  ? myMessage(message.message, message.time)
                  : friendMessage(message.message, message.time)}
              </div>
            </div>
          ))}
        </div>
        <form
          action=""
          className="flex w-full justify-around p-2 text-[#A6B0CF]"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="type your message"
            className="h-10 w-4/5 rounded-lg bg-[#36404A]"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            type="submit"
            className="h-10 w-1/6 rounded-lg bg-[#7269EF] text-slate-200 transition duration-300 hover:bg-[#6159CB]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Convo;
