import React, { ChangeEvent, useCallback, useState } from "react";
import useWebSocket, { ReadyState }  from "react-use-websocket";

interface Props{
	roomName:string,
	leaveRoom():void,
}

const ChessRoom = ({roomName, leaveRoom}:Props) => {
	
	const [message, setMessage] = useState<string>("");
	const [lastMessage, setLastMessage] = useState<string>("");
	const {sendJsonMessage, readyState} = useWebSocket('ws://'
		+ window.location.host
		+ '/ws/chat/'
		+ roomName 
		+ '/', {
			onOpen: () => { 
				console.log("Connected");
			},
			onClose: () => { 
				console.log("Disconnected");
			},
			onMessage: (e) => {
				const data = JSON.parse(e.data);
				console.log(data.message);
				setLastMessage(data.message);
			}
	});

	const handleSendMessage = () => {
		sendJsonMessage({"message": message});
		setMessage("");
	}

	const changeMessage = (event:ChangeEvent<HTMLInputElement>):void => {
		setMessage(event.target.value);
		console.log(message);
	}

	const connectionStatus = {
		[ReadyState.CONNECTING]: "Connecting",
		[ReadyState.OPEN]: "Open",
		[ReadyState.CLOSING]: "Closing",
		[ReadyState.CLOSED]: "Closed",
		[ReadyState.UNINSTANTIATED]: "Uninstantiated",
		}[readyState];


	return (
		<div className="room">
			<h1>{roomName}</h1>
			<p>Connection status = {connectionStatus} </p>
			<input type="text" name="chatMessage" value={message} onChange={changeMessage} />
			<p>Last message: {lastMessage}</p>
			<button onClick={handleSendMessage}>Send message</button>	
			<button onClick={() => {leaveRoom();}}>Leave</button>

		</div>
	);
}

export default ChessRoom;


