import fs from 'fs'
import path from 'path'
import SealProps from '../react/seal/SealProps';

export class GameMapFileLoader {
    /**
     * Wczytuje ułożenie i połaczenie (poziom) z pliku JSON
     * @param level: Numer poziomu
     *
     * @returns Tablicę z ułożeniem i połączeniem fok
     */
    load(level: number): SealProps[] {
        const levelFile = path.resolve(__dirname, 'public', 'maps', `${level}.json`)
        let data: string = ""
        try {
            data = fs.readFileSync(levelFile, 'utf8')
        } catch (err) {
            return []
        }

        const seals: SealProps[] = JSON.parse(data)
        seals.forEach((seal, index) => {
            seal.id = index
            if (seal.connectedTo) {
                const connectedSeals: SealProps[] = []
                seal.connectedTo.forEach((connectedSealIndex: number | SealProps) => {
                    if (typeof connectedSealIndex === "number") {
                        connectedSeals.push(seals[connectedSealIndex])
                    }
                })
                seal.connectedTo = connectedSeals
            }
        })
        return seals
    }

    /**
     * Sprawdza czy dany poziom istnieje
     * @param level: Numer poziomu
     *
     * @returns true jeśli istnieje, bądź false
     */
    isLevelExists(level: number): boolean{
        const levelFile = path.resolve(__dirname, 'public', 'maps', `${level}.json`)
        return fs.existsSync(levelFile)
     }
}