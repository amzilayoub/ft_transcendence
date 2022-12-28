import { useRouter } from "next/router";
import React from "react";

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
    else
      {
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
      <div className={`w-full flex flex-col justify-around`}>
        <p className="text-white text-xl p-2 rounded-lg text-right bg-[#36404A] w-fit">
          {msg}
        </p>
        <p className="text-xs text-white text-right">{timestamp}</p>
      </div>
    );
  };
  const friendMessage = (msg: string, timestamp: string) => {
    return (
      <div className={`w-full flex flex-col justify-around`}>
        <p className="text-white text-xl p-2 rounded-lg text-left bg-[#7269EF] w-fit">
          {msg}
        </p>
        <p className=" text-xs text-white">{timestamp}</p>
      </div>
    );
  };
  return (
    <div className="w-full h-[100vh] bg-[#262E35] ">
      <h1 className="text-white text-3xl w-full text-center bg-slate-500 h-[3vh] flex flex-col justify-center items-center">
        {id}
      </h1>
      <div className="w-full h-[97vh] flex flex-col justify-between">
        <div className="">
          {chatData.map((message) => (
            <div
              key={message.id}
              className={`w-full flex flex-col  ${
                message.sender === "me"
                  ? "justify-end items-end"
                  : "justify-start items-start"
              }`}
            >
              <div className="flex flex-col justify-center items-center">
                {message.sender === "me"
                  ? myMessage(message.message, message.time)
                  : friendMessage(message.message, message.time)}
              </div>
            </div>
          ))}
        </div>
        <form
          action=""
          className="w-full p-2 flex justify-around text-[#A6B0CF]"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="type your message"
            className="w-4/5 h-10 rounded-lg bg-[#36404A]"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg w-1/6 bg-[#7269EF] hover:bg-[#6159CB] h-10 transition duration-300 text-slate-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Convo;
