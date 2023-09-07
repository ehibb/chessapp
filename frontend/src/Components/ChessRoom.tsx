import React from 'react';
import { IRoom } from '../Interfaces';

interface Props{
	room:IRoom;
	handleJoin(roomToJoin:string):void;
}

const ChessRooms = ({room, handleJoin}:Props) => {
	return (
		<div className='room'>
			<h1> {room.name} </h1>
			<button onClick={() => {handleJoin(room.slug);}}>Join</button>
		</div>
	);
}

export default ChessRooms;
