import React, { ChangeEvent, useState } from "react";
import useWebSocket, { ReadyState }  from "react-use-websocket";
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"

interface Props{
	roomName:string,
	leaveRoom():void,
}

const ChessRoom = ({roomName, leaveRoom}:Props) => {
	
	const [message, setMessage] = useState<string>("");
	const [lastMessage, setLastMessage] = useState<string>("");
	const [game, setGame] = useState<Chess>(new Chess());
	const [turn, setTurn] = useState<boolean>(false);
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

	 

	const onDrop = (sourceSquare:string, targetSquare: string) => {
		
		const gameCopy = new Chess();
		gameCopy.loadPgn(game.pgn());
		const move = gameCopy.move({
			from: sourceSquare,
			to: targetSquare,
			promotion: "q"
		});
		setGame(gameCopy);
		console.log(move === null);
		if (move === null) return false;
		
		return true;
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
			{ turn ? (
				<p>It is your turn</p>
			) : (
				<p>Opponent's turn</p>
			)}

			<Chessboard position={game.fen()} onPieceDrop={onDrop} />
			<button onClick={() => {leaveRoom();}}>Leave</button>

		</div>
	);
}

export default ChessRoom;


