import { useState } from 'react';
import RaycastDemo from "./Components/Basic/RaycastDemo";
import Arena from "./Components/Character/Arena";

const options = {
  ARENA: '1',
  BASIC: '2'
}

function App() {
  const [selectedValue, setSelectedValue] = useState(options.ARENA);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <div className="main-switcher">
        <label>
          <input
            type="radio"
            value={options.ARENA}
            name="mainSwitcher"
            checked={selectedValue === options.ARENA}
            onChange={handleChange}
          />
          Arena
        </label>
        <label>
          <input
            type="radio"
            value={options.BASIC}
            name="mainSwitcher"
            checked={selectedValue === options.BASIC}
            onChange={handleChange}
          />
          Basic Demo
        </label>  
      </div>
      {
        selectedValue === options.ARENA ? 
          <Arena /> :
          <RaycastDemo/>
      }
    </>
  )
}

export default App;
