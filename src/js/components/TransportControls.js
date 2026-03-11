const TransportControls = ({ 
  isPlaying, 
  isLoading, 
  hasError, 
  hasSounds,
  onPlay, 
  onStop, 
  onClear 
}) => {
  return (
    <div className="transport-controls">
      <button 
        onClick={onPlay} 
        disabled={isPlaying || isLoading || hasError || !hasSounds}
        className="play-btn"
      >
        ▶ PLAY
      </button>
      <button 
        onClick={onStop}
        disabled={!isPlaying}
        className="stop-btn"
      >
        ⬛ STOP
      </button>
      <button 
        onClick={onClear}
        disabled={isLoading}
        className="clear-btn"
      >
        🗑 CLEAR ALL
      </button>
    </div>
  );
};

export default TransportControls;