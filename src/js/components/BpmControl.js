import { useState, useEffect } from 'react';

const BpmControl = ({ bpm, onChange, disabled }) => {
  const [inputValue, setInputValue] = useState(bpm);

  useEffect(() => {
    setInputValue(bpm);
  }, [bpm]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    const newBpm = parseInt(value, 10);
    if (!isNaN(newBpm) && newBpm >= 10 && newBpm <= 300) {
      onChange(newBpm);
    }
  };

  const handleBlur = () => {
    let validBpm = parseInt(inputValue, 10);
    if (isNaN(validBpm)) validBpm = 120;
    if (validBpm < 10) validBpm = 10;
    if (validBpm > 300) validBpm = 300;
    
    setInputValue(validBpm);
    onChange(validBpm);
  };

  const incrementBpm = () => {
    const newBpm = Math.min(240, bpm + 1);
    setInputValue(newBpm);
    onChange(newBpm);
  };

  const decrementBpm = () => {
    const newBpm = Math.max(40, bpm - 1);
    setInputValue(newBpm);
    onChange(newBpm);
  };

  return (
    <div className="bpm-control">
      <label htmlFor="bpm-input">BPM</label>
      <input
        id="bpm-input"
        type="number"
        min="40"
        max="240"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        step="1"
      />
      <div className="bpm-buttons">
        <button 
          onClick={incrementBpm}
          disabled={disabled || bpm >= 240}
          className="bpm-btn"
        >▲</button>
        <button 
          onClick={decrementBpm}
          disabled={disabled || bpm <= 40}
          className="bpm-btn"
        >▼</button>
      </div>
    </div>
  );
};

export default BpmControl;