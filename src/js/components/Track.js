import React from 'react';
import Step from './Step';

export default function Track({
  track,
  steps,
  isPlaying,
  currentStep,
  trackIndex,
  onToggleStep,
  onTestSound,
  disabled,
  isSoundLoaded,
}) {
  return (
    <div className="track" style={{ borderLeftColor: track.color }}>
      <div className="track-header">
        <div className="track-info">
          <span className="track-name">{track.name}</span>
          {!isSoundLoaded && !disabled && <span className="track-status loading">⏳</span>}
          {isSoundLoaded && <span className="track-status loaded">✅</span>}
        </div>
        <button
          className="test-sound-btn"
          onClick={onTestSound}
          disabled={disabled || !isSoundLoaded}
          title={isSoundLoaded ? 'Sound Test' : 'No Sounds!!'}
        >
          🔊
        </button>
      </div>

      <div className="steps-container">
        {steps.map((isActive, stepIndex) => (
          <Step>
            key={stepIndex}
            isActive={isActive}
            isPlaying={isPlaying}
            isCurrentStep={stepIndex === currentStep}
            onClick={() => !disabled && isSoundLoaded && onToggleStep(trackIndex, stepIndex)}
            disabled={disabled || !isSoundLoaded}
          </Step>
        ))}
      </div>
    </div>
  );
}
