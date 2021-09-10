import React from 'react';
import './CompleteWindow.css';

interface CompleteWindowProps {
  level: number;
  lastLevel: boolean;
  time: number;
}

class CompleteWindow extends React.Component<CompleteWindowProps> {
  render() {
    const button = this.props.lastLevel ? null : <button>Next level</button>
    return (
      <div id="window-container">
        <div className="window">
          <h1>Well done</h1>
          <h2>Time: {this.props.time}s</h2>
          <h2>Level: {this.props.level}</h2>
          {button}
        </div>
      </div>
    )
  }
}
export default CompleteWindow;
