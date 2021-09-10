import React from 'react';
import SealProps from '../seal/SealProps';
import Seal from '../seal/Seal';
import bg from './background.png';
import  './GameMap.css';
import { PathData } from '../../utils/PathData';
import { Settings } from '../../utils/Settings';

export type GameMapLoadFunction = (lines: PathData[]) => void
interface GameMapProps  {
  width: number;
  height: number;
  level: number;
  seals: SealProps[];
  onLoad: GameMapLoadFunction; // [x1 y1 x2 y2, from-seal, to-seal]
}

class GameMap extends React.Component<GameMapProps> {
    private _sealsList: JSX.Element[] = []
    private _svgLinesList: JSX.Element[] = []
    private _sizeCssDict: React.CSSProperties = {}

    constructor(props: GameMapProps) {
      super(props)

      const pathes: PathData[] = []
      this._sizeCssDict = {
        width: this.props.width,
        height: this.props.height,
      }

      this.props.seals.forEach((sealProp: SealProps, index: number) => {
        this._sealsList.push(
          <Seal key={index} id={index} x={sealProp.x} y={sealProp.y} connectedTo={sealProp.connectedTo}/>
        )
        if (sealProp.connectedTo) {
          for (const connectedSeal of sealProp.connectedTo) {
            if (typeof connectedSeal === "number") {
              continue
            }
            const x1 = sealProp.x + Settings.SEAL_WIDTH / 2
            const y1 = sealProp.y + Settings.SEAL_HEIGHT / 2
            const x2 = connectedSeal.x + Settings.SEAL_WIDTH / 2
            const y2 = connectedSeal.y + Settings.SEAL_HEIGHT / 2
            const lineId = `${sealProp.id}-${connectedSeal.id}`
            this._svgLinesList.push(
              <line id={lineId} key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black"/>
            )
            pathes.push([x1, y1, x2, y2, sealProp.id || 0, connectedSeal.id || 0])
          }
        }
      })

      this.props.onLoad(pathes)
    }

    render() {
      const svgViewBox = `0 0 ${this.props.width} ${this.props.height}`
      return <div id="map-container">
        <h1 id="level-info">Level: {this.props.level}</h1>
        <svg viewBox={svgViewBox} xmlns="http://www.w3.org/2000/svg" style={this._sizeCssDict}>
          {this._svgLinesList}
          <circle id="error-marker" cx="-100" cy="-100" r="13" fill="#FF0000"/>
        </svg>
        <img src={bg} className="map-background" style={this._sizeCssDict}/>
        {this._sealsList}
      </div>
    }
}
export default GameMap;
