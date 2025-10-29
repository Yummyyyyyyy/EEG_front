import React from 'react';

const ChannelSelector = ({ channels, selectedChannel, onChannelChange }) => {
  return (
    <div className="selector-container">
      <label className="selector-label">Select Channel:</label>
      <div className="channel-grid">
        {channels.map(channel => (
          <button
            key={channel.id}
            className={`channel-button ${selectedChannel === channel.id ? 'active' : ''}`}
            onClick={() => onChannelChange(channel.id)}
          >
            {channel.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelSelector;
