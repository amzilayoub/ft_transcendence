import React from "react";

import { RxCross2 } from "react-icons/rx";
const ChatBox = () => {
  return (
    <section className="relative flex flex-col h-full  bg-white border border-gray-200 max-h-[440px] rounded-t-xl w-[340px]">
      <div className="flex justify-between p-3 border-b-2 border-gray-200 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute bottom-0 right-0 text-green-500">
              <svg width="16" height="16">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <img
              src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
              alt=""
              className="w-10 h-10 rounded-full sm:w-16 sm:h-16"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center mt-1 text-2xl">
              <span className="mr-3 text-gray-700">Anderson Vanhron</span>
            </div>
          </div>
        </div>
        <span className="absolute p-1 text-gray-400 duration-300 rounded-full cursor-pointer hover:text-slate-600 top-1 right-1 hover:bg-gray-200">
          <RxCross2 className="w-5 h-5" />
        </span>
      </div>

      <ul
        id="messages"
        className="scrolling-touch scrollbar-thumb scrollbar-thumb-rounded scrollbar-track scrollbar-w-2 flex flex-col h-full p-3 space-y-4 overflow-y-scroll mb-14"
      >
        <li className="chat-message">
          <div className="flex items-end">
            <div className="flex flex-col items-start order-2 max-w-xs mx-2 space-y-2 text-xs">
              <div>
                <span className="inline-block px-4 py-2 text-gray-600 bg-gray-300 rounded-lg rounded-bl-none">
                  Can be verified on any platform using docker
                </span>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
              alt="My profile"
              className="order-1 w-6 h-6 rounded-full"
            />
          </div>
        </li>
        <li className="chat-message">
          <div className="flex items-end justify-end">
            <div className="flex flex-col items-end order-1 max-w-xs mx-2 space-y-2 text-xs">
              <div>
                <span className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg rounded-br-none ">
                  Your error message says permission denied, npm global installs
                  must be given root privileges.
                </span>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
              alt="My profile"
              className="order-2 w-6 h-6 rounded-full"
            />
          </div>
        </li>
        <li className="chat-message">
          <div className="flex items-end">
            <div className="flex flex-col items-start order-2 max-w-xs mx-2 space-y-2 text-xs">
              <div>
                <span className="inline-block px-4 py-2 text-gray-600 bg-gray-300 rounded-lg">
                  Command was run with root privileges. I'm sure about that.
                </span>
              </div>
              <div>
                <span className="inline-block px-4 py-2 text-gray-600 bg-gray-300 rounded-lg">
                  I've update the description so it's more obviously now
                </span>
              </div>
              <div>
                <span className="inline-block px-4 py-2 text-gray-600 bg-gray-300 rounded-lg">
                  FYI https://askubuntu.com/a/700266/510172
                </span>
              </div>
              <div>
                <span className="inline-block px-4 py-2 text-gray-600 bg-gray-300 rounded-lg rounded-bl-none">
                  Check the line above (it ends with a # so, I'm running it as
                  root )<pre># npm install -g @vue/devtools</pre>
                </span>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
              alt="My profile"
              className="order-1 w-6 h-6 rounded-full"
            />
          </div>
        </li>
        <li className="chat-message">
          <div className="flex items-end justify-end">
            <div className="flex flex-col items-end order-1 max-w-xs mx-2 space-y-2 text-xs">
              <div>
                <span className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg rounded-br-none ">
                  Any updates on this issue? I'm getting the same error when
                  trying to install devtools. Thanks
                </span>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
              alt="My profile"
              className="order-2 w-6 h-6 rounded-full"
            />
          </div>
        </li>
      </ul>
      {/* inputa */}
      <div className="absolute bottom-0 w-full h-16 pt-4 mb-2 border-gray-200 sm:mb-0">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Write your message!"
            className="w-full py-3 pl-3 text-gray-600 bg-gray-200 rounded-md placeholder:text-gray-600 focus:outline-none focus:placeholder:text-gray-400"
          />
          <div className="absolute inset-y-0 right-0 items-center hidden sm:flex">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-3 text-white transition duration-500 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-6 h-6 ml-2 rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
`}</style>
    </section>
  );
};

export default ChatBox;
