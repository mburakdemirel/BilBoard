import React, { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ReconnectingWebSocket from 'reconnecting-websocket';
import axios from "axios";

function Chat() {

    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);



    useEffect(() => {
        // Get the username from local storage or prompt the user to enter it
        const storedUsername = localStorage.getItem("username");
        console.log(storedUsername);
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            const input = prompt("Enter your username:");
            if (input) {
                setUsername(input);
                localStorage.setItem("username", input);
            }
        }

        // Connect to the WebSocket server with the username as a query parameter
        //const newSocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/26/");
        const newSocket = new ReconnectingWebSocket("ws://127.0.0.1:8000/ws/chat/26/");

        newSocket.onopen = function (e) {
            console.log("WebSocket is connected");
            newSocket.send(JSON.stringify({command: 'load_messages', chat_id: 26 }));
        }

        newSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log(data);
            // Handle the data received from the server here
        };

        newSocket.onerror = function(event) {
            console.error("WebSocket error observed:", event);
        };
        setSocket(newSocket);




        // Clean up the WebSocket connection when the component unmounts
        return () => {
            newSocket.close();
        };
    }, [username]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, data]);
            };
        }
    }, [socket]);

    const handleSubmit = (event) => {
        event.preventDefault();
    };


    return (
        <div className="chat-container">
            <div className="chat-header">Chat</div>
            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <div className="message-username">{message.username}:</div>
                        <div className="message-content">{message.message}</div>
                        <div className="message-timestamp">{message.timestamp}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
export default Chat;