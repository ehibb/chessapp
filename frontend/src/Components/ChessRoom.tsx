import React, { ChangeEvent, useState } from "react";
import useWebSocket, { ReadyState }  from "react-use-websocket";
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import axios from "axios";

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
		+ '/ws/chess/'
		+ roomName.replace(' ', '-') 
		+ '/', {
			onOpen: () => { 
				console.log("Connected");
			},
			onClose: () => { 
				console.log("Disconnected");
			},
			onMessage: (e) => {
				const data = JSON.parse(e.data);
				console.log(data)	
				if (data.type === "chat_message"){
					console.log(data.message);
					setLastMessage(data.message);
				} else if (data.type == "chess_move"){
					if (!turn){
						makeChessMove({from: data.from, to: data.to, promotion: data.promotion});
						setTurn(true);
					} else {
						setTurn(false);
					}
				}
			}
	});

	const connectionStatus = {
		[ReadyState.CONNECTING]: "Connecting",
		[ReadyState.OPEN]: "Open",
		[ReadyState.CLOSING]: "Closing",
		[ReadyState.CLOSED]: "Closed",
		[ReadyState.UNINSTANTIATED]: "Uninstantiated",
		}[readyState];

	const handleSendMessage = () => {
		sendJsonMessage({"type":"chat_message", "message": message});
		setMessage("");
	}

	const changeMessage = (event:ChangeEvent<HTMLInputElement>):void => {
		setMessage(event.target.value);
		console.log(message);
	}

	const sendChessMove = (currentMove:{from:string, to:string, promotion:string}) => {
		sendJsonMessage({"type": "chess_move", "move": currentMove});	
	}

	const makeChessMove = (currentMove:{from:string, to:string, promotion:string}) => {
		const gameCopy = new Chess();
		gameCopy.loadPgn(game.pgn());
		const move = gameCopy.move(currentMove);
		setGame(gameCopy);
		return move;
	}

	const onDrop = (sourceSquare:string, targetSquare: string) => {
		if (!turn) return false;
		const moveToMake = {from: sourceSquare, to: targetSquare, promotion: "q"};
		const move = makeChessMove(moveToMake);
		if (move === null) return false;
		sendChessMove(moveToMake);
		return true;
	}



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


