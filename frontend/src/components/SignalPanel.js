import React from 'react';
import styles from './SignalPanel.module.css';

const AVAILABLE_SIGNALS = [
  { id: 'movingAverage', label: 'Moving Averages' },
  { id: 'rsi', label: 'RSI Indicator' },
  { id: 'bollingerBands', label: 'Bollinger Bands' },
];

const SignalPanel = ({ signals, onSignalChange, disabled }) => {
  const handleSignalToggle = (signalId) => {
    onSignalChange({
      ...signals,
      [signalId]: !signals[signalId]
    });
  };

  return (
    <div className={styles.signalsSection}>
      <h3>Trading Signals</h3>
      <div className={styles.signalsContainer}>
        {AVAILABLE_SIGNALS.map(({ id, label }) => (
          <label key={id} className={styles.checkboxLabel}>
            <input 
              type="checkbox"
              className={styles.checkbox}
              checked={signals[id]} 
              onChange={() => handleSignalToggle(id)}
              disabled={disabled}
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SignalPanel;