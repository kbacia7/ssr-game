import { PathData } from "../utils/PathData"

export class LinesCalculator {
    /**
     * Sprawdza czy odcinki AB, CD na Siebie nachodzą
     * Nie jest to moja funkcja, przepisałem jej implementację z Pythona na TS
     *
     * @param p0: Punkt A (x, y)
     * @param p1: Punkt B (x, y)
     * @param p2: Punkt C (x, y)
     * @param p3: Punkt D (x, y)
     *
     * @returns Punkt kolizji odcinków lub false
     */
    findIntersection(p0: number[], p1: number[], p2: number[], p3: number[]) {
        const s10x = p1[0] - p0[0]
        const s10y = p1[1] - p0[1]
        const s32x = p3[0] - p2[0]
        const s32y = p3[1] - p2[1]

        const denom = s10x * s32y - s32x * s10y
        if (denom === 0) {
          return false // collinear
        }

        const denomIsPositive = denom > 0
        const s02x = p0[0] - p2[0]
        const s02y = p0[1] - p2[1]
        const sNumer = s10x * s02y - s10y * s02x
        if ((sNumer < 0) === denomIsPositive) {
          return false
        }
        const tNumer = s32x * s02y - s32y * s02x

        if ((tNumer < 0) === denomIsPositive) {
          return false
        }

        if (((sNumer > denom) === denomIsPositive) || ((tNumer > denom) === denomIsPositive)) {
          return false
        }
        const t = tNumer / denom
        const intersectionPoint = [p0[0] + (t * s10x), p0[1] + (t * s10y)]
        return intersectionPoint
      }

    /**
     * Sprawdza wśród wszystkich odcinków czy występuje kolizja
     * @param pathes: Tablica wszystkich odcinków
     *
     * @returns Pierwszy punkt kolizji odcinków lub false
     */
    checkIntersect(pathes: PathData[]) {
        let i = 0
        let j = 0
        for (const pathData of pathes) {
          const Ax = pathData[0]
          const Ay = pathData[1]
          const Bx = pathData[2]
          const By = pathData[3]
          j = 0
          for (const pathDataB of pathes) {
            if (i !== j && pathData[4] !== pathDataB[4] &&
              pathData[5] !== pathDataB[5] &&
              pathData[4] !== pathDataB[5] &&
              pathData[5] !== pathDataB[4]) {
              const Cx = pathDataB[0]
              const Cy = pathDataB[1]
              const Dx = pathDataB[2]
              const Dy = pathDataB[3]

              const intersect = this.findIntersection(
                [Ax, Ay], [Bx, By], [Cx, Cy], [Dx, Dy]
              )
              if (intersect !== false) {
                return intersect
              }
            }
            j++
          }
          i++
        }
        return false
      }
}