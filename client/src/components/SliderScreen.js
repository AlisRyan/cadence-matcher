import React, { useState } from 'react';

const SliderScreen = ({ handleSliderSubmit }) => {
  const [danceability, setDanceability] = useState(5);
  const [tempo, setTempo] = useState(5);
  const [energy, setEnergy] = useState(5);

  const handleSubmit = () => {
    // You can implement your logic here to do something with the slider values (danceability, tempo, energy).
    // For now, we'll just call the handleSliderSubmit function with the slider values.
    handleSliderSubmit({ danceability, tempo, energy });
  };

  return (
    <div>
      <h1>Set Your Preferences</h1>
      <div className="slider-container">
        <div className="slider-item">
          <label>Danceability:</label>
          <input
            type="range"
            min={0}
            max={10}
            value={danceability}
            onChange={(e) => setDanceability(Number(e.target.value))}
          />
          <span>{danceability}</span>
        </div>
        <div className="slider-item">
          <label>Tempo:</label>
          <input
            type="range"
            min={0}
            max={10}
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
          />
          <span>{tempo}</span>
        </div>
        <div className="slider-item">
          <label>Energy:</label>
          <input
            type="range"
            min={0}
            max={10}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
          />
          <span>{energy}</span>
        </div>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SliderScreen;
