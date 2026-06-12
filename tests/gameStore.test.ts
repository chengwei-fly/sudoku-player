import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  useGameStore,
  createEmptyGrid,
  copyGrid,
  generateSolution,
  generatePuzzle,
  isValidPlacement,
  GridSize,
  Difficulty,
} from '../src/store/gameStore'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
})

describe('数独工具函数', () => {
  describe('createEmptyGrid', () => {
    it('应该创建正确大小的空网格', () => {
      expect(createEmptyGrid(4)).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])
      expect(createEmptyGrid(9)).toHaveLength(9)
      expect(createEmptyGrid(9)[0]).toHaveLength(9)
    })

    it('创建的网格应该全是0', () => {
      const grid = createEmptyGrid(9)
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          expect(grid[r][c]).toBe(0)
        }
      }
    })
  })

  describe('copyGrid', () => {
    it('应该正确复制网格', () => {
      const original = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]
      const copied = copyGrid(original)

      expect(copied).toEqual(original)
      expect(copied).not.toBe(original)
      expect(original[0]).not.toBe(copied[0])
    })

    it('修改副本不应该影响原网格', () => {
      const original = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]
      const copied = copyGrid(original)
      copied[0][0] = 0

      expect(original[0][0]).toBe(1)
    })
  })

  describe('isValidPlacement', () => {
    it('空网格中任何位置都有效', () => {
      const grid = createEmptyGrid(9)
      expect(isValidPlacement(grid, 0, 0, 5)).toBe(true)
    })

    it('应该检测行冲突', () => {
      const grid = createEmptyGrid(9)
      grid[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      expect(isValidPlacement(grid, 0, 0, 1)).toBe(false)
      expect(isValidPlacement(grid, 0, 0, 5)).toBe(false)
    })

    it('应该检测列冲突', () => {
      const grid = createEmptyGrid(9)
      grid[0][0] = 5
      expect(isValidPlacement(grid, 1, 0, 5)).toBe(false)
      expect(isValidPlacement(grid, 1, 0, 3)).toBe(true)
    })

    it('应该检测宫格冲突', () => {
      const grid = createEmptyGrid(9)
      grid[0][0] = 1
      grid[0][1] = 2
      grid[1][0] = 3
      grid[1][1] = 4
      // 3x3宫格内不能有重复
      expect(isValidPlacement(grid, 0, 2, 1)).toBe(false)
      expect(isValidPlacement(grid, 2, 0, 1)).toBe(false)
      expect(isValidPlacement(grid, 2, 2, 1)).toBe(true)
    })
  })

  describe('generateSolution', () => {
    it('应该生成有效的9x9数独解', () => {
      const solution = generateSolution(9)

      expect(solution).toHaveLength(9)
      expect(solution[0]).toHaveLength(9)

      // 检查每行
      for (let r = 0; r < 9; r++) {
        const row = solution[r]
        const set = new Set(row)
        expect(set.size).toBe(9)
        expect(set.has(0)).toBe(false)
      }

      // 检查每列
      for (let c = 0; c < 9; c++) {
        const col: number[] = []
        for (let r = 0; r < 9; r++) {
          col.push(solution[r][c])
        }
        const set = new Set(col)
        expect(set.size).toBe(9)
      }
    })

    it('应该生成有效的4x4数独解', () => {
      const solution = generateSolution(4)

      expect(solution).toHaveLength(4)
      expect(solution[0]).toHaveLength(4)

      for (let r = 0; r < 4; r++) {
        const set = new Set(solution[r])
        expect(set.size).toBe(4)
      }
    })

    it('应该生成有效的6x6数独解', () => {
      const solution = generateSolution(6)

      expect(solution).toHaveLength(6)
      expect(solution[0]).toHaveLength(6)

      for (let r = 0; r < 6; r++) {
        const set = new Set(solution[r])
        expect(set.size).toBe(6)
      }
    })
  })

  describe('generatePuzzle', () => {
    it('应该从解生成题目', () => {
      const solution = generateSolution(9)
      const puzzle = generatePuzzle(solution, 9, 'medium')

      expect(puzzle).toHaveLength(9)
      expect(puzzle[0]).toHaveLength(9)

      // 验证题目和解在非0位置一致
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (puzzle[r][c] !== 0) {
            expect(puzzle[r][c]).toBe(solution[r][c])
          }
        }
      }
    })

    it('不同难度应该挖不同数量的空', () => {
      const solution = generateSolution(9)

      const easyPuzzle = generatePuzzle(solution, 9, 'easy')
      const mediumPuzzle = generatePuzzle(solution, 9, 'medium')
      const hardPuzzle = generatePuzzle(solution, 9, 'hard')

      const easyZeros = easyPuzzle.flat().filter((n) => n === 0).length
      const mediumZeros = mediumPuzzle.flat().filter((n) => n === 0).length
      const hardZeros = hardPuzzle.flat().filter((n) => n === 0).length

      // easy 35%, medium 50%, hard 65%
      expect(easyZeros).toBe(Math.floor(81 * 0.35))
      expect(mediumZeros).toBe(Math.floor(81 * 0.5))
      expect(hardZeros).toBe(Math.floor(81 * 0.65))
    })
  })
})

describe('GameStore 状态管理', () => {
  beforeEach(() => {
    // 重置store到初始状态
    useGameStore.setState({
      currentPuzzle: createEmptyGrid(9),
      currentSolution: createEmptyGrid(9),
      userInputs: createEmptyGrid(9),
      selectedCell: null,
      gridSize: 9,
      difficulty: 'medium',
      gameMode: 'number',
      isCompleted: false,
      isPaused: false,
      elapsedTime: 0,
      history: [],
      bestRecords: {
        4: { easy: 0, medium: 0, hard: 0 },
        6: { easy: 0, medium: 0, hard: 0 },
        9: { easy: 0, medium: 0, hard: 0 },
      },
    })
    localStorageMock.clear()
  })

  describe('初始状态', () => {
    it('应该有正确的初始值', () => {
      const state = useGameStore.getState()

      expect(state.gridSize).toBe(9)
      expect(state.difficulty).toBe('medium')
      expect(state.gameMode).toBe('number')
      expect(state.isCompleted).toBe(false)
      expect(state.isPaused).toBe(false)
      expect(state.elapsedTime).toBe(0)
      expect(state.selectedCell).toBeNull()
      expect(state.history).toEqual([])
    })

    it('currentPuzzle应该是9x9的空网格', () => {
      const { currentPuzzle } = useGameStore.getState()
      expect(currentPuzzle).toHaveLength(9)
      expect(currentPuzzle[0]).toHaveLength(9)
      expect(currentPuzzle.flat().every((n) => n === 0)).toBe(true)
    })

    it('bestRecords应该有正确的结构', () => {
      const { bestRecords } = useGameStore.getState()

      for (const size of [4, 6, 9] as GridSize[]) {
        expect(bestRecords[size]).toBeDefined()
        expect(bestRecords[size].easy).toBe(0)
        expect(bestRecords[size].medium).toBe(0)
        expect(bestRecords[size].hard).toBe(0)
      }
    })
  })

  describe('selectCell', () => {
    it('应该能够选择格子', () => {
      useGameStore.getState().selectCell(4, 4)

      const { selectedCell } = useGameStore.getState()
      expect(selectedCell).toEqual({ row: 4, col: 4 })
    })

    it('不应该选择超出范围的格子', () => {
      useGameStore.getState().selectCell(0, 0)
      expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 0 })

      useGameStore.getState().selectCell(10, 10)
      expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 0 })

      useGameStore.getState().selectCell(-1, 0)
      expect(useGameStore.getState().selectedCell).toEqual({ row: 0, col: 0 })
    })

    it('4x4网格应该正确限制范围', () => {
      useGameStore.setState({ gridSize: 4 })

      useGameStore.getState().selectCell(3, 3)
      expect(useGameStore.getState().selectedCell).toEqual({ row: 3, col: 3 })

      useGameStore.getState().selectCell(4, 4)
      expect(useGameStore.getState().selectedCell).toEqual({ row: 3, col: 3 })
    })
  })

  describe('inputNumber', () => {
    beforeEach(() => {
      // 设置一个有空白格的测试题目
      const testPuzzle = createEmptyGrid(9)
      testPuzzle[0][0] = 5 // 固定数字
      useGameStore.setState({
        currentPuzzle: testPuzzle,
        userInputs: createEmptyGrid(9),
      })
      useGameStore.getState().selectCell(1, 1)
    })

    it('应该能够输入数字', () => {
      useGameStore.getState().inputNumber(7)

      const { userInputs, history } = useGameStore.getState()
      expect(userInputs[1][1]).toBe(7)
      expect(history).toHaveLength(1)
      expect(history[0]).toMatchObject({
        type: 'input',
        row: 1,
        col: 1,
        previousValue: 0,
        newValue: 7,
      })
    })

    it('不应该修改题目给出的数字', () => {
      useGameStore.getState().selectCell(0, 0)
      useGameStore.getState().inputNumber(9)

      const { currentPuzzle } = useGameStore.getState()
      expect(currentPuzzle[0][0]).toBe(5) // 题目数字不变
    })

    it('不应该输入超出范围数字', () => {
      useGameStore.getState().inputNumber(10)
      expect(useGameStore.getState().userInputs[1][1]).toBe(0)

      useGameStore.getState().inputNumber(-1)
      expect(useGameStore.getState().userInputs[1][1]).toBe(0)
    })

    it('不应该在未选择格子时输入', () => {
      useGameStore.setState({ selectedCell: null })
      useGameStore.getState().inputNumber(5)

      const { userInputs } = useGameStore.getState()
      expect(userInputs.flat().every((n) => n === 0)).toBe(true)
    })

    it('输入相同数字不应该添加历史', () => {
      useGameStore.getState().inputNumber(7)
      const historyLength = useGameStore.getState().history.length

      useGameStore.getState().inputNumber(7)
      expect(useGameStore.getState().history.length).toBe(historyLength)
    })
  })

  describe('eraseNumber', () => {
    beforeEach(() => {
      const testPuzzle = createEmptyGrid(9)
      testPuzzle[0][0] = 5
      useGameStore.setState({
        currentPuzzle: testPuzzle,
        userInputs: createEmptyGrid(9),
      })
      useGameStore.getState().selectCell(1, 1)
      useGameStore.getState().inputNumber(7)
    })

    it('应该能够擦除数字', () => {
      useGameStore.getState().eraseNumber()

      const { userInputs, history } = useGameStore.getState()
      expect(userInputs[1][1]).toBe(0)
      expect(history).toHaveLength(2)
      expect(history[1]).toMatchObject({
        type: 'erase',
        row: 1,
        col: 1,
        previousValue: 7,
        newValue: 0,
      })
    })

    it('不应该擦除题目数字', () => {
      useGameStore.getState().selectCell(0, 0)
      useGameStore.getState().eraseNumber()

      const { currentPuzzle } = useGameStore.getState()
      expect(currentPuzzle[0][0]).toBe(5)
    })

    it('擦除空白不应该添加历史', () => {
      useGameStore.getState().selectCell(2, 2)
      const historyLength = useGameStore.getState().history.length

      useGameStore.getState().eraseNumber()
      expect(useGameStore.getState().history.length).toBe(historyLength)
    })
  })

  describe('undo', () => {
    beforeEach(() => {
      const testPuzzle = createEmptyGrid(9)
      testPuzzle[0][0] = 5
      useGameStore.setState({
        currentPuzzle: testPuzzle,
        userInputs: createEmptyGrid(9),
      })
      useGameStore.getState().selectCell(1, 1)
    })

    it('应该能够撤销操作', () => {
      useGameStore.getState().inputNumber(7)
      expect(useGameStore.getState().userInputs[1][1]).toBe(7)

      useGameStore.getState().undo()
      expect(useGameStore.getState().userInputs[1][1]).toBe(0)
    })

    it('应该能够撤销多次', () => {
      useGameStore.getState().inputNumber(7)
      useGameStore.getState().inputNumber(8)
      useGameStore.getState().undo()
      useGameStore.getState().undo()

      expect(useGameStore.getState().userInputs[1][1]).toBe(0)
    })

    it('历史为空时不应该崩溃', () => {
      expect(() => useGameStore.getState().undo()).not.toThrow()
    })

    it('撤销应该恢复正确的历史状态', () => {
      useGameStore.getState().inputNumber(5)
      useGameStore.getState().inputNumber(6)
      useGameStore.getState().inputNumber(7)
      expect(useGameStore.getState().history).toHaveLength(3)

      useGameStore.getState().undo()
      expect(useGameStore.getState().userInputs[1][1]).toBe(6)

      useGameStore.getState().undo()
      expect(useGameStore.getState().userInputs[1][1]).toBe(5)
    })
  })

  describe('reset', () => {
    beforeEach(() => {
      const testPuzzle = createEmptyGrid(9)
      testPuzzle[0][0] = 5
      useGameStore.setState({
        currentPuzzle: testPuzzle,
        userInputs: createEmptyGrid(9),
      })
      useGameStore.getState().selectCell(1, 1)
      useGameStore.getState().inputNumber(7)
      useGameStore.getState().inputNumber(8)
    })

    it('应该重置用户输入', () => {
      useGameStore.getState().reset()

      const { userInputs } = useGameStore.getState()
      expect(userInputs.flat().every((n) => n === 0)).toBe(true)
    })

    it('应该清空历史', () => {
      useGameStore.getState().reset()
      expect(useGameStore.getState().history).toHaveLength(0)
    })

    it('应该重置游戏状态', () => {
      useGameStore.getState().reset()

      const { isCompleted, isPaused, elapsedTime, selectedCell } =
        useGameStore.getState()
      expect(isCompleted).toBe(false)
      expect(isPaused).toBe(false)
      expect(elapsedTime).toBe(0)
      expect(selectedCell).toBeNull()
    })

    it('不应该重置题目', () => {
      useGameStore.getState().reset()

      const { currentPuzzle } = useGameStore.getState()
      expect(currentPuzzle[0][0]).toBe(5)
    })
  })

  describe('newGame', () => {
    it('应该生成新的数独题目', () => {
      useGameStore.getState().newGame(9, 'medium')

      const { currentPuzzle, currentSolution, gridSize, difficulty } =
        useGameStore.getState()

      expect(gridSize).toBe(9)
      expect(difficulty).toBe('medium')
      expect(currentPuzzle).toHaveLength(9)
      expect(currentSolution).toHaveLength(9)

      // 验证题目有正确数量的空格
      const zeros = currentPuzzle.flat().filter((n) => n === 0).length
      expect(zeros).toBe(Math.floor(81 * 0.5))
    })

    it('应该支持不同网格大小', () => {
      useGameStore.getState().newGame(4, 'easy')

      const { currentPuzzle, gridSize } = useGameStore.getState()
      expect(gridSize).toBe(4)
      expect(currentPuzzle).toHaveLength(4)
      expect(currentPuzzle[0]).toHaveLength(4)
    })

    it('应该重置游戏状态', () => {
      useGameStore.setState({ isCompleted: true, elapsedTime: 100 })
      useGameStore.getState().newGame(9, 'medium')

      const { isCompleted, elapsedTime, selectedCell, history } =
        useGameStore.getState()
      expect(isCompleted).toBe(false)
      expect(elapsedTime).toBe(0)
      expect(selectedCell).toBeNull()
      expect(history).toHaveLength(0)
    })

    it('生成的解应该是有效的', () => {
      useGameStore.getState().newGame(9, 'hard')

      const { currentSolution } = useGameStore.getState()

      // 检查行
      for (let r = 0; r < 9; r++) {
        const set = new Set(currentSolution[r])
        expect(set.size).toBe(9)
      }

      // 检查列
      for (let c = 0; c < 9; c++) {
        const col: number[] = []
        for (let r = 0; r < 9; r++) {
          col.push(currentSolution[r][c])
        }
        const set = new Set(col)
        expect(set.size).toBe(9)
      }
    })
  })

  describe('checkSolution', () => {
    beforeEach(() => {
      const solution = generateSolution(9)
      const puzzle = generatePuzzle(solution, 9, 'medium')
      useGameStore.setState({
        currentPuzzle: puzzle,
        currentSolution: solution,
        userInputs: createEmptyGrid(9),
        elapsedTime: 60,
      })
    })

    it('未完成时应该返回false', () => {
      const result = useGameStore.getState().checkSolution()
      expect(result).toBe(false)
      expect(useGameStore.getState().isCompleted).toBe(false)
    })

    it('错误解应该返回false', () => {
      // 故意填入错误数字
      useGameStore.getState().selectCell(0, 0)
      // 如果puzzle[0][0]是0，则填入错误数字
      if (useGameStore.getState().currentPuzzle[0][0] === 0) {
        useGameStore.getState().inputNumber(999) // 无效值不会被接受
      }

      const result = useGameStore.getState().checkSolution()
      expect(result).toBe(false)
    })

    it('正确解应该返回true并标记完成', () => {
      // 复制解到userInputs
      const { currentSolution, currentPuzzle } = useGameStore.getState()
      const userInputs = createEmptyGrid(9)

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (currentPuzzle[r][c] === 0) {
            userInputs[r][c] = currentSolution[r][c]
          }
        }
      }

      useGameStore.setState({ userInputs })

      const result = useGameStore.getState().checkSolution()
      expect(result).toBe(true)
      expect(useGameStore.getState().isCompleted).toBe(true)
      expect(useGameStore.getState().isPaused).toBe(true)
    })
  })

  describe('getHint', () => {
    beforeEach(() => {
      const solution = generateSolution(9)
      const puzzle = generatePuzzle(solution, 9, 'medium')
      useGameStore.setState({
        currentPuzzle: puzzle,
        currentSolution: solution,
        userInputs: createEmptyGrid(9),
      })
    })

    it('应该返回空单元格的提示', () => {
      const hint = useGameStore.getState().getHint()

      expect(hint).not.toBeNull()
      expect(hint).toHaveProperty('row')
      expect(hint).toHaveProperty('col')
      expect(hint).toHaveProperty('num')

      const { row, col, num } = hint!
      expect(num).toBe(useGameStore.getState().currentSolution[row][col])
    })

    it('全部填满时应该返回null', () => {
      const { currentPuzzle, currentSolution } = useGameStore.getState()
      useGameStore.setState({ userInputs: copyGrid(currentPuzzle) })

      // 填满所有空格
      const userInputs = copyGrid(currentPuzzle)
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (userInputs[r][c] === 0) {
            userInputs[r][c] = currentSolution[r][c]
          }
        }
      }
      useGameStore.setState({ userInputs })

      const hint = useGameStore.getState().getHint()
      expect(hint).toBeNull()
    })
  })

  describe('pauseGame / resumeGame', () => {
    it('应该能够暂停游戏', () => {
      useGameStore.getState().pauseGame()
      expect(useGameStore.getState().isPaused).toBe(true)
    })

    it('应该能够恢复游戏', () => {
      useGameStore.getState().pauseGame()
      useGameStore.getState().resumeGame()
      expect(useGameStore.getState().isPaused).toBe(false)
    })
  })

  describe('setGameMode', () => {
    it('应该能够设置游戏模式', () => {
      useGameStore.getState().setGameMode('symbol')
      expect(useGameStore.getState().gameMode).toBe('symbol')
    })

    it('应该能够切换回数字模式', () => {
      useGameStore.getState().setGameMode('symbol')
      useGameStore.getState().setGameMode('number')
      expect(useGameStore.getState().gameMode).toBe('number')
    })
  })

  describe('clearHistory', () => {
    it('应该能够清空历史', () => {
      const testPuzzle = createEmptyGrid(9)
      useGameStore.setState({ currentPuzzle: testPuzzle })
      useGameStore.getState().selectCell(0, 0)
      useGameStore.getState().inputNumber(5)
      useGameStore.getState().inputNumber(6)

      expect(useGameStore.getState().history).toHaveLength(2)

      useGameStore.getState().clearHistory()
      expect(useGameStore.getState().history).toHaveLength(0)
    })
  })

  describe('localStorage 持久化', () => {
    it('newGame应该保存设置到localStorage', () => {
      useGameStore.getState().newGame(4, 'hard')

      expect(localStorageMock.setItem).toHaveBeenCalled()
      const call = (localStorageMock.setItem as any).mock.calls.find(
        (c: any[]) => c[0] === 'sudoku_user_settings'
      )
      expect(call).toBeDefined()
      expect(JSON.parse(call[1])).toMatchObject({
        gridSize: 4,
        difficulty: 'hard',
      })
    })

    it('setGameMode应该保存设置到localStorage', () => {
      useGameStore.getState().setGameMode('symbol')

      const call = (localStorageMock.setItem as any).mock.calls.find(
        (c: any[]) => c[0] === 'sudoku_user_settings'
      )
      expect(call).toBeDefined()
      expect(JSON.parse(call[1]).gameMode).toBe('symbol')
    })

    it('checkSolution正确时应该保存最佳记录', () => {
      const solution = generateSolution(9)
      const puzzle = generatePuzzle(solution, 9, 'medium')
      useGameStore.setState({
        currentPuzzle: puzzle,
        currentSolution: solution,
        userInputs: createEmptyGrid(9),
        elapsedTime: 60,
      })

      // 填入正确答案
      const userInputs = createEmptyGrid(9)
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (puzzle[r][c] === 0) {
            userInputs[r][c] = solution[r][c]
          }
        }
      }
      useGameStore.setState({ userInputs })

      useGameStore.getState().checkSolution()

      const call = (localStorageMock.setItem as any).mock.calls.find(
        (c: any[]) => c[0] === 'sudoku_best_records'
      )
      expect(call).toBeDefined()
    })
  })
})
