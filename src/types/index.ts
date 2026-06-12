export type GridSize = 4 | 6 | 9

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface CellData {
  value: number | null
  isFixed: boolean
  isError: boolean
  isSelected: boolean
  row: number
  col: number
}

export interface GameState {
  gridSize: GridSize
  difficulty: Difficulty
  board: (number | null)[][]
  solution: (number | null)[][]
  selectedCell: { row: number; col: number } | null
  timer: number
  isPaused: boolean
  filledCount: number
  totalEmpty: number
}
