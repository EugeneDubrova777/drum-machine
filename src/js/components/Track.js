import { memo } from 'react';
import Step from './Step';

const Track = memo(({ 
  track, 
  steps, 
  isPlaying, 
  currentStep, 
  trackIndex, 
  onToggleStep,
  disabled,
  isSoundLoaded 
}) => {
  return (
    <div className="track" style={{ borderLeftColor: track.color }}>
      <div className="track-header">
        <div className="track-info">
          <span className="track-name">{track.name}</span>
        </div>
      </div>
      
      <div className="steps-container">
        {steps.map((isActive, stepIndex) => (
          <Step
            key={stepIndex}
            isActive={isActive}
            isPlaying={isPlaying}
            isCurrentStep={stepIndex === currentStep}
            onClick={() => {
              if (!disabled && isSoundLoaded) {
                onToggleStep(trackIndex, stepIndex);
              }
            }}
            disabled={disabled || !isSoundLoaded}
          />
        ))}
      </div>
    </div>
  );
});

export default Track;