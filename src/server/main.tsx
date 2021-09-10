import express from "express"

// tslint:disable-next-line:no-submodule-imports
import ReactDOMServer from "react-dom/server"
import path from 'path'
import fs from 'fs'
import GameMap, { GameMapLoadFunction } from "../react/gamemap/GameMap"
import { GameMapFileLoader } from "./MapLoader"
import CompleteWindow from "../react/completewindow/CompleteWindow"
import { PathData } from "../utils/PathData"
import { Settings } from "../utils/Settings"
import { LinesCalculator } from "./LinesCalculator"
import { ClientUpdateResponse } from "./ClientUpdateResponse"
import { ClientUpdateRequest } from "./ClientUpdateRequest"

const app = express()
const port = Settings.EXPRESS_PORT

const jsonParser = express.json()
const mapLoader: GameMapFileLoader = new GameMapFileLoader()
const linesCalculator: LinesCalculator = new LinesCalculator()

let currentLevel = 1
let loadLevelTimestamp = 0
let pathesOnMap: PathData[] = []

/**
 * Zwraca wyrenderowany HTML wybranego poziomu
 *
 * @param level: Numer poziomu
 *
 * @returns HTML poziomu
 */
function renderLevelHtml(level: number) {
  const f: GameMapLoadFunction = (pathes) => {
    pathesOnMap = pathes
  }
  loadLevelTimestamp = new Date().valueOf()
  const seals = mapLoader.load(level)
  const gameMapEl = <GameMap onLoad={f} width={Settings.SCREEN_WIDTH} height={Settings.SCREEN_HEIGHT} seals={seals} level={level}/>
  const gameMapHtml = ReactDOMServer.renderToString(gameMapEl)
  return gameMapHtml
}

/**
 * POST Request wywoływany przy przesuwaniu foki, sprawdza czy gracz ukończył poziom, zwraca inforamcje o kolizacjach linii
 */
app.post('/update-seal', jsonParser, (req, res) => {
  if (loadLevelTimestamp <= 0) {
    return res.send(null)
  }
  const request: ClientUpdateRequest = req.body
  const pathesFromThisSeal = pathesOnMap.filter(p => p[4] === request.id)
  const pathesToThisSeal = pathesOnMap.filter(p => p[5] === request.id)
  pathesFromThisSeal.map((p) => {
    p[0] = request.x
    p[1] = request.y
  })
  pathesToThisSeal.map((p) => {
    p[2] = request.x
    p[3] = request.y
  })
  const intersect = linesCalculator.checkIntersect(pathesOnMap)
  let completeWindow = null
  if (intersect === false) {
    const playerTime = (new Date().valueOf() - loadLevelTimestamp) / 1000
    loadLevelTimestamp = 0
    completeWindow = ReactDOMServer.renderToString(<CompleteWindow
      time={playerTime}
      level={currentLevel}
      lastLevel={!mapLoader.isLevelExists(currentLevel + 1)}/>
    )
    currentLevel++
  }

  const response: ClientUpdateResponse = {
    x: request.x - Settings.SEAL_WIDTH / 2,
    y: request.y - Settings.SEAL_HEIGHT / 2,
    linesPointX: request.x,
    linesPointY: request.y,
    intersect,
    completeWindow
  }

  return res.send(response)
})

/**
 * GET Request zwracający wybrany poziom
 */
app.get('/load-level', (req, res) => {
  return res.send(renderLevelHtml(currentLevel))
})

app.get('/', (req, res) => {
  currentLevel = 1
  const level = renderLevelHtml(1)
  const indexFile = path.resolve(__dirname, 'index.html')
  fs.readFile(indexFile, 'utf8', (err, data) => {
    return res.send(
      data.replace(`<div id="root"></div>`, `<div id="root">${level}</div>`)
    )
  })
})

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Listening at http://localhost:${port}`)
})

