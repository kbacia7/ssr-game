export interface ClientUpdateResponse {
    x: number,
    y: number,
    linesPointX: number,
    linesPointY: number,
    intersect: boolean | number[],
    completeWindow: string | null
}