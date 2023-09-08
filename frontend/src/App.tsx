import { ChangeEvent, FC, useState, useEffect } from 'react'; 
import axios from "axios"
import Header from "./Components/Header";
import ChessRoomLink from "./Components/ChessRoomLink";
import ChessRoom from "./Components/ChessRoom";
import { IRoom } from './Interfaces';

const App:FC = () => {

  const [room, setRoom] = useState<string>("");
  const [roomToJoin, setRoomToJoin] = useState<string>("")
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [inRoom, setInRoom] = useState<boolean>(false);
  
  useEffect(() => { getRooms() }, [])
  
  const handleJoin = (roomToJoin:string) => {
    setRoomToJoin(roomToJoin);
    setInRoom(true);
  }

  const leaveRoom = () => {
    setInRoom(false);
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
      {!inRoom ? (
        <div className='chessRooms'>
          {rooms.map((room:IRoom, key:number) => {
            return <ChessRoomLink key={key} room={room} handleJoin={handleJoin} />
          })}
        </div>
      ) : (
        <ChessRoom roomName={roomToJoin} leaveRoom={leaveRoom}/>
      )}

    </div>
  );
}


export default App;
