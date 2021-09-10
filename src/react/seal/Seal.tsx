import React from 'react';
import seal from './seal.png';
import  './Seal.css';
import SealProps from './SealProps';

class Seal extends React.Component<SealProps> {
    render() {
      const positionCss = {
        top: this.props.y,
        left: this.props.x,
      }
      return <img draggable="true" id={(this.props.id || 0).toString()} className="seal" style={positionCss} src={seal} />
    }
}
export default Seal;
