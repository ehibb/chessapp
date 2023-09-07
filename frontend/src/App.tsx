import { ChangeEvent, FC, useState, useEffect } from 'react';
import axios from "axios"
import Header from "./Components/Header";
import ChessRoom from "./Components/ChessRoom";
import { IRoom } from './Interfaces';

const App:FC = () => {

  const [room, setRoom] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  
  useEffect(() => { getRooms() }, [])

  const handleJoin = (roomToJoin:string) => {

    const webSocket = new WebSocket(
      'ws://'
      + window.location.host
      + '/ws/chat/'
      + roomToJoin 
      + '/'
    );
  }

  const handleChange = (event:ChangeEvent<HTMLInputElement>):void => {
    setRoom(event.target.value);
  };

  const getRooms = () => {
    axios({
      method: "GET",
      url:"rooms/",
      }).then((response) => {
        const data = response.data
        setRooms(data)
      }).catch((error) => {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      })
  }
  
  const createRoom = () => {
    axios({
      method: "POST",
      url: "rooms/",
      data:{
        name: room,
      }
    }).then(() => {
      getRooms()
    })
    setRoom(""); 
  };

  return (
    <div className='App'>
      
      <Header />
      <div className='createRoom'>
        <h1> Create room </h1>
        <input type="text" name='roomName' value={room} onChange={handleChange} />
        <button onClick={createRoom}>Create room</button>
      </div>
      <div className='chessRooms'>
        {rooms.map((room:IRoom, key:number) => {
          return <ChessRoom key={key} room={room} handleJoin={handleJoin} />
        })}
      </div>

    </div>
  );
}


export default App;
