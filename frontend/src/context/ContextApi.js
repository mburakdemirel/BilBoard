import React from "react";


const context = React.createContext({isImageViewerOpen:null, changeIsImageViewerOpen:(isImageViewerOpen)=>{}, newMessage:null, sendNewMessage:(Message)=>{}});

export default context;