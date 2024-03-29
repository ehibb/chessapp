import React, { ChangeEvent, useEffect, useState } from "react";
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
	const [gameStart, setGameStart] = useState<boolean>(false);
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [overMessage, setOverMessage] = useState<string>("");

	const room_slug = roomName.replaceAll(' ', '-');
	const {sendJsonMessage, readyState} = useWebSocket('ws://'
		+ window.location.host
		+ '/ws/chess/'
		+ room_slug 
		+ '/', {
			onOpen: () => { 
				console.log("Connected");
				axios({
					method: "GET",
					url: "rooms/" + room_slug,
					}).then((response) => {
						const data = response.data;
						setTurn((data.connected_users % 2) !== 0)
					})
			},
			onClose: () => { 
				console.log("Disconnected");
			},
			onMessage: (e) => {
				const data = JSON.parse(e.data);
				if (data.type === "chat_message"){
					setLastMessage(data.message);
				} else if (data.type == "chess_move"){
					if (!turn){
						makeChessMove({from: data.from, to: data.to, promotion: data.promotion});
						setTurn(true);
					} else {
						setTurn(false);
					}
				} else if (data.type == "game_start"){
					setGameStart(true);
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
	useEffect(() => {
		if(game.isGameOver()) handleGameEnd();
	}, [game])
	const handleGameEnd = () => {
		setGameOver(true);
		if (game.isCheckmate()) setOverMessage(`${game.turn() === 'w' ? 'Black': 'White'} wins by checkmate.`);
		if (game.isDraw()) setOverMessage('Draw');
	}

	const makeChessMove = (currentMove:{from:string, to:string, promotion:string}) => {
		const gameCopy = new Chess();
		gameCopy.loadPgn(game.pgn());
		const move = gameCopy.move(currentMove);
		setGame(gameCopy);

		return move;
	}

	const onDrop = (sourceSquare:string, targetSquare: string) => {
		if (!turn || !gameStart) return false;
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

			{ !gameStart &&
				<p> Game has not started </p>
			}

			{ (gameStart && !gameOver) &&
				<>
				{ turn
					? <p>It is your turn</p>
					: <p>Opponent's turn</p>
				}
				</>
			}

			{ gameOver &&
				<p> {overMessage} </p>
			}

			<Chessboard position={game.fen()} onPieceDrop={onDrop} />
			<button onClick={() => {leaveRoom();}}>Leave</button>

		</div>
	);
}

export default ChessRoom;


