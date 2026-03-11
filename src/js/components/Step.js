import { memo } from 'react';

const Step = memo(({ isActive, isPlaying, isCurrentStep, onClick, disabled }) => {

  const stepClass = `step ${isActive ? 'active' : ''} ${
    isPlaying && isCurrentStep ? 'playing' : ''
  } ${disabled ? 'disabled' : ''}`.trim();

  return (
    <div 
      className={stepClass}
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Step ${isActive ? 'active' : 'inactive'}`}
      aria-disabled={disabled}
    />
  );
});

export default Step;