
import React, { useState, createContext, useContext } from "react";

const getUserData = () =>{
  
  var data : ContextProps =  {
    username: "mbifenzi",
    firstName: "mohamed",
    lastName: "bifenzi",
    email: "mbifenzi@1337.student.ma",
    avatar: "",
    friends: [],
    rooms: [],
    id: 1,
  }
  // axios.get("http://localhost:3000/api/user").then((res) => {
     // data = res.data;
  // }).catch((err) => {
    // o the error
    return data
  }

    

interface ContextProps {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  friends: string[];
  avatar: string;
  rooms: string[];
  id: number;
}
 
export const Context = createContext(getUserData());

// export const userContext = () => useContext(Context);

export const ContextProvider = ({children}: {children:React.ReactNode}) => {
  
  const userContext = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    friends: [""],
    avatar: "",
    rooms: [""],
    id: 1,
  }
  
  return (
    <Context.Provider
      value={userContext}
      >
    </Context.Provider>
  );
};