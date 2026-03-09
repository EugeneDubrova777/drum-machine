import React from 'react';

export default function Step({ isActive, isPlaying, isCurrentStep, onClick, disabled }) {
  const stepClasses = [
    'step',
    isActive ? 'active' : '',
    isPlaying && isCurrentStep ? 'playing' : '',
    disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      className={stepClasses}
      onClick={disabled ? undefined : onClick}
      role="button" tabIndex={disabled ? -1 : 0}
      onKeyPress={(e) => !disabled && e.key === 'Enter' && onClick()}
      aria-label={`Step ${isActive ? 'active' : 'inactive'}`}
      aria-disabled={disabled}
    </div>
  );
}
