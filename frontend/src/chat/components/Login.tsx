import React, { useContext } from "react";
import { Context } from "../context";

const Login = () => {
  const user = useContext(Context);
  // console.log(user.username)
;  return (
    <div className="w-screen h-screen bg-[#303841] flex justify-center items-center">
      <form className="w-2/5 h-1/4 bg-slate-600 flex flex-col justify-around items-center rounded-3xl"
        >
        <div>
          {user.avatar}
          <h1 className="text-4xl text-white text-center">Welcome to T-Ponx</h1>
        </div>
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full h-full bg-slate-600 text-white rounded-3xl"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Password"
            className="w-full h-full bg-slate-600 text-white rounded-3xl"
          />
        </div>
        <button className="">
          login with zabzoubi
        </button>
      </form>
    </div>
  );
};

export default Login;
