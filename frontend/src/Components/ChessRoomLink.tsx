import React from 'react';
import { IRoom } from '../Interfaces';

interface Props{
	room:IRoom;
	handleJoin(roomToJoin:string):void;
}

const ChessRoomLink = ({room, handleJoin}:Props) => {
	return (
		<div className='link'>
			<h1> {room.name} </h1>
			<button onClick={() => {handleJoin(room.name);}}>Join</button>
		</div>
	);
}

export default ChessRoomLink;
