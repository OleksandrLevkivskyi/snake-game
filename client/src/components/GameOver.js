
import '../App.css';
import { useInput } from '../hooks/useInput';
import { createUser} from '../servises/userAPI';

const GameOver = ({points, startGame, setState}) => {
    const name = useInput("", {
        isEmpty: true,
    });
      
    
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        let data = await createUser(name.value, points);
        name.handleClear()
        setState(true)
        setTimeout(startGame, 500)        
    }
    catch (e) {
        alert(e.response.data.message)
    }
};

return (
    
    <form className="game-over" onSubmit={handleSubmit}>
        <h4>Game Over</h4>
        <p>Your score: {points}</p>
        {name.isDirty && name.isEmpty && (
            <div style={{ color: "red" }}>This field is required</div>
        )}
        <input
            onChange={(e) => name.onChange(e)}
            onBlur={(e) => name.onBlur(e)}
            value={name.value}
            name="name"
            type="text"
            placeholder="Enter your name..."
        />
        <button
            disabled={!name.inputValid}
            type="submit"
            className="start save" 
        >
            Save
        </button>
    </form>    
  );
  
}

export default GameOver;