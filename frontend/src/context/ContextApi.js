import React from "react";


const context = React.createContext({pageType:null, changePageType:(pageType)=>{}, newMessage:null, sendNewMessage:(Message)=>{}});

export default context;