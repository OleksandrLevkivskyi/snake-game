import { useEffect, useState } from "react";
import '../App.css';
import { fetchUsers } from "../servises/userAPI";

const RecordHolders = ({state}) => {
  const [users, setUsers] = useState()

  useEffect(() => {
    fetchUsers().then(data => setUsers(data))
  }, [state])
  
  const usersList = users?.map(({name, points, id}) => (
    <li className="record-box" key={id}><b>{name}:</b> {points}</li>
  ))
  
  return (
    <div className="record">
      <h1>Record holders:</h1>
      <ul style={{padding: 0}}>
        {usersList?.sort(function(a, b) {
          return Number.parseInt(b.props.children[2]) - Number.parseInt(a.props.children[2]);
        })}
      </ul>
        
    </div>
  );
  
}

export default RecordHolders;