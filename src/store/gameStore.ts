// 数独游戏状态管理 - Zustand + localStorage持久化
import { create } from 'zustand'

export type GridSize = 4 | 6 | 9
export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameMode = 'number' | 'symbol'

export interface GameAction {
  type: 'input' | 'erase' | 'undo'
  row: number
  col: number
  previousValue: number
  newValue: number
  timestamp: number
}

export interface GameState {
  // 当前游戏
  currentPuzzle: number[][]
  currentSolution: number[][]
  userInputs: number[][]
  selectedCell: { row: number; col: number } | null

  // 游戏设置
  gridSize: GridSize
  difficulty: Difficulty
  gameMode: GameMode

  // 游戏状态
  isCompleted: boolean
  isPaused: boolean
  elapsedTime: number

  // 操作历史
  history: GameAction[]

  // 最佳记录
  bestRecords: Record<GridSize, Record<Difficulty, number>>

  // 方法
  selectCell: (row: number, col: number) => void
  inputNumber: (num: number) => void
  eraseNumber: () => void
  undo: () => void
  reset: () => void
  checkSolution: () => boolean
  getHint: () => { row: number; col: number; num: number } | null
  newGame: (gridSize: GridSize, difficulty: Difficulty) => void
  pauseGame: () => void
  resumeGame: () => void
  setGameMode: (mode: GameMode) => void
  clearHistory: () => void
}

// localStorage keys
const STORAGE_KEYS = {
  GAME_STATE: 'sudoku_game_state',
  BEST_RECORDS: 'sudoku_best_records',
  USER_SETTINGS: 'sudoku_user_settings',
} as const

// 创建空网格
function createEmptyGrid(size: number): number[][] {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(0))
}

// 复制网格
function copyGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row])
}

// 根据尺寸获取宫格大小
function getBoxDimensions(size: number): { rows: number; cols: number } {
  if (size === 4) return { rows: 2, cols: 2 }
  if (size === 6) return { rows: 2, cols: 3 }
  if (size === 9) return { rows: 3, cols: 3 }
  return { rows: 3, cols: 3 }
}

// 检查网格是否有效（用于生成数独）
function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  const size = grid.length

  // 检查行
  for (let c = 0; c < size; c++) {
    if (grid[row][c] === num) return false
  }

  // 检查列
  for (let r = 0; r < size; r++) {
    if (grid[r][col] === num) return false
  }

  // 检查宫格
  const { rows: boxRows, cols: boxCols } = getBoxDimensions(size)
  const boxRowStart = Math.floor(row / boxRows) * boxRows
  const boxColStart = Math.floor(col / boxCols) * boxCols

  for (let r = boxRowStart; r < boxRowStart + boxRows; r++) {
    for (let c = boxColStart; c < boxColStart + boxCols; c++) {
      if (grid[r][c] === num) return false
    }
  }

  return true
}

// 生成完整的数独解
function generateSolution(size: number): number[][] {
  const grid = createEmptyGrid(size)
  const nums = Array.from({ length: size }, (_, i) => i + 1)

  function shuffle<T>(arr: T[]): T[] {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  // 迭代求解，避免大数据量时栈溢出
  function solve(grid: number[][], row: number, col: number): boolean {
    const size = grid.length
    if (row === size) return true
    const nextRow = col === size - 1 ? row + 1 : row
    const nextCol = (col + 1) % size

    const numbers = shuffle(nums)
    for (const num of numbers) {
      if (isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num
        if (solve(grid, nextRow, nextCol)) return true
        grid[row][col] = 0
      }
    }
    return false
  }

  solve(grid, 0, 0)
  return grid
}

// 根据难度生成题目（挖空）
function generatePuzzle(
  solution: number[][],
  gridSize: GridSize,
  difficulty: Difficulty
): number[][] {
  const puzzle = copyGrid(solution)
  // 边长直接就是 gridSize（4/6/9），总格子数为 gridSize²
  const totalCells = gridSize * gridSize

  // 根据难度确定挖空数量
  const cellsToRemove: Record<Difficulty, number> = {
    easy: Math.max(1, Math.floor(totalCells * 0.35)),
    medium: Math.max(1, Math.floor(totalCells * 0.5)),
    hard: Math.max(1, Math.floor(totalCells * 0.65)),
  }

  const removeCount = Math.min(cellsToRemove[difficulty], totalCells - gridSize)

  // 生成需要移除的位置
  const positions: { row: number; col: number }[] = []
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      positions.push({ row: r, col: c })
    }
  }

  // 随机打乱位置
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
  }

  // 移除数字（保证至少保留 gridSize 个格子）
  let removed = 0
  for (const pos of positions) {
    if (removed >= removeCount) break
    if (!puzzle[pos.row] || puzzle[pos.row][pos.col] === undefined) continue
    puzzle[pos.row][pos.col] = 0
    removed++
  }

  return puzzle
}

// 从localStorage加载数据
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

// 保存数据到localStorage
function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 存储失败，忽略
  }
}

// 初始状态
const initialState = {
  currentPuzzle: createEmptyGrid(4),
  currentSolution: createEmptyGrid(4),
  userInputs: createEmptyGrid(4),
  selectedCell: null as { row: number; col: number } | null,
  gridSize: 4 as GridSize,
  difficulty: 'medium' as Difficulty,
  gameMode: 'number' as GameMode,
  isCompleted: false,
  isPaused: false,
  elapsedTime: 0,
  history: [] as GameAction[],
  bestRecords: {
    4: { easy: 0, medium: 0, hard: 0 },
    6: { easy: 0, medium: 0, hard: 0 },
    9: { easy: 0, medium: 0, hard: 0 },
  },
}

export const useGameStore = create<GameState>((set, get) => {
  // 从localStorage恢复状态（带数据完整性校验）
  const savedState = loadFromStorage<Partial<GameState>>(
    STORAGE_KEYS.GAME_STATE,
    {}
  )
  const savedBestRecords = loadFromStorage(
    STORAGE_KEYS.BEST_RECORDS,
    initialState.bestRecords
  )
  const savedSettings = loadFromStorage<
    { gridSize: GridSize; difficulty: Difficulty; gameMode: GameMode }
  >(STORAGE_KEYS.USER_SETTINGS, {
    gridSize: initialState.gridSize,
    difficulty: initialState.difficulty,
    gameMode: initialState.gameMode,
  })

  // 校验保存的 gridSize 和 currentPuzzle 维度是否一致
  // 防止旧版本脏数据导致渲染失败
  let validSavedState: Partial<GameState> = {}
  if (savedState.gridSize && savedState.currentPuzzle) {
    const sz = savedState.gridSize
    const cp = savedState.currentPuzzle
    if (
      Array.isArray(cp) &&
      cp.length === sz &&
      cp.every((row) => Array.isArray(row) && row.length === sz)
    ) {
      validSavedState = savedState
    }
  }

  return {
    ...initialState,
    ...validSavedState,
    bestRecords: savedBestRecords,
    gridSize: savedSettings.gridSize,
    difficulty: savedSettings.difficulty,
    gameMode: savedSettings.gameMode,

    selectCell: (row: number, col: number) => {
      const { gridSize } = get()
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        set({ selectedCell: { row, col } })
      }
    },

    inputNumber: (num: number) => {
      const { selectedCell, currentPuzzle, userInputs, history, gridSize } =
        get()
      if (!selectedCell) return

      const { row, col } = selectedCell
      // 不能修改题目给出的数字
      if (currentPuzzle[row][col] !== 0) return

      // 验证数字范围
      if (num < 0 || num > gridSize) return

      const previousValue = userInputs[row][col]
      if (previousValue === num) return

      const newUserInputs = copyGrid(userInputs)
      newUserInputs[row][col] = num

      const action: GameAction = {
        type: 'input',
        row,
        col,
        previousValue,
        newValue: num,
        timestamp: Date.now(),
      }

      set({
        userInputs: newUserInputs,
        history: [...history, action],
      })
    },

    eraseNumber: () => {
      const { selectedCell, currentPuzzle, userInputs, history } = get()
      if (!selectedCell) return

      const { row, col } = selectedCell
      // 不能修改题目给出的数字
      if (currentPuzzle[row][col] !== 0) return

      const previousValue = userInputs[row][col]
      if (previousValue === 0) return

      const newUserInputs = copyGrid(userInputs)
      newUserInputs[row][col] = 0

      const action: GameAction = {
        type: 'erase',
        row,
        col,
        previousValue,
        newValue: 0,
        timestamp: Date.now(),
      }

      set({
        userInputs: newUserInputs,
        history: [...history, action],
      })
    },

    undo: () => {
      const { history, userInputs, currentPuzzle } = get()
      if (history.length === 0) return

      const lastAction = history[history.length - 1]
      const newHistory = history.slice(0, -1)

      // 如果撤销的是题目位置的修改，不允许
      if (currentPuzzle[lastAction.row][lastAction.col] !== 0) return

      const newUserInputs = copyGrid(userInputs)
      newUserInputs[lastAction.row][lastAction.col] = lastAction.previousValue

      set({
        userInputs: newUserInputs,
        history: newHistory,
      })
    },

    reset: () => {
      const { gridSize, currentPuzzle, currentSolution, difficulty, gameMode } = get()
      set({
        userInputs: createEmptyGrid(gridSize),
        history: [],
        isCompleted: false,
        isPaused: false,
        elapsedTime: 0,
        selectedCell: null,
      })
      // 同步保存到localStorage
      saveToStorage(STORAGE_KEYS.GAME_STATE, {
        currentPuzzle,
        currentSolution,
        userInputs: createEmptyGrid(gridSize),
        gridSize,
        difficulty,
        gameMode,
        isCompleted: false,
        isPaused: false,
        elapsedTime: 0,
        history: [],
      })
    },

    checkSolution: () => {
      const {
        currentPuzzle,
        currentSolution,
        userInputs,
        gridSize,
        elapsedTime,
        bestRecords,
        difficulty,
      } = get()

      // 合并题目和用户输入
      const completeGrid = copyGrid(currentPuzzle)
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (completeGrid[r][c] === 0) {
            completeGrid[r][c] = userInputs[r][c]
          }
        }
      }

      // 检查是否与解一致
      let isCorrect = true
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (completeGrid[r][c] !== currentSolution[r][c]) {
            isCorrect = false
            break
          }
        }
        if (!isCorrect) break
      }

      if (isCorrect) {
        // 更新最佳记录
        const newBestRecords: typeof bestRecords = JSON.parse(
          JSON.stringify(bestRecords)
        )
        if (
          elapsedTime > 0 &&
          (newBestRecords[gridSize][difficulty] === 0 ||
            elapsedTime < newBestRecords[gridSize][difficulty])
        ) {
          newBestRecords[gridSize][difficulty] = elapsedTime
          saveToStorage(STORAGE_KEYS.BEST_RECORDS, newBestRecords)
        }

        set({
          isCompleted: true,
          isPaused: true,
          bestRecords: newBestRecords,
        })
      }

      return isCorrect
    },

    getHint: () => {
      const { currentPuzzle, currentSolution, userInputs, gridSize } = get()

      // 找出空的且用户没填的位置
      const emptyCells: { row: number; col: number }[] = []
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (currentPuzzle[r][c] === 0 && userInputs[r][c] === 0) {
            emptyCells.push({ row: r, col: c })
          }
        }
      }

      if (emptyCells.length === 0) return null

      // 随机选择一个空格
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)]

      return {
        row: randomCell.row,
        col: randomCell.col,
        num: currentSolution[randomCell.row][randomCell.col],
      }
    },

    newGame: (gridSize: GridSize, difficulty: Difficulty) => {
      const solution = generateSolution(gridSize)
      const puzzle = generatePuzzle(solution, gridSize, difficulty)

      set({
        currentPuzzle: puzzle,
        currentSolution: solution,
        userInputs: createEmptyGrid(gridSize),
        gridSize,
        difficulty,
        selectedCell: null,
        isCompleted: false,
        isPaused: false,
        elapsedTime: 0,
        history: [],
      })

      // 保存完整游戏状态到localStorage
      saveToStorage(STORAGE_KEYS.GAME_STATE, {
        currentPuzzle: puzzle,
        currentSolution: solution,
        userInputs: createEmptyGrid(gridSize),
        gridSize,
        difficulty,
        gameMode: get().gameMode,
        isCompleted: false,
        isPaused: false,
        elapsedTime: 0,
        history: [],
      })

      // 保存设置
      saveToStorage(STORAGE_KEYS.USER_SETTINGS, {
        gridSize,
        difficulty,
        gameMode: get().gameMode,
      })
    },

    pauseGame: () => {
      set({ isPaused: true })
    },

    resumeGame: () => {
      set({ isPaused: false })
    },

    setGameMode: (mode: GameMode) => {
      set({ gameMode: mode })
      saveToStorage(STORAGE_KEYS.USER_SETTINGS, {
        gridSize: get().gridSize,
        difficulty: get().difficulty,
        gameMode: mode,
      })
    },

    clearHistory: () => {
      set({ history: [] })
    },
  }
})

// 导出辅助函数供测试使用
export { createEmptyGrid, copyGrid, generateSolution, generatePuzzle, isValidPlacement }
