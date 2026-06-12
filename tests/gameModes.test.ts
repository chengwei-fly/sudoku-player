import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../src/store/gameStore'

describe('游戏模式切换', () => {
  beforeEach(() => {
    // 重置store状态
    const store = useGameStore.getState()
    store.initGame(9, 'easy')
  })

  it('应该正确初始化4宫格模式', () => {
    const store = useGameStore.getState()
    store.initGame(4, 'beginner')

    expect(store.gridSize).toBe(4)
    expect(store.difficulty).toBe('beginner')
    expect(store.board).toHaveLength(4)
    expect(store.solution).toHaveLength(4)
  })

  it('应该正确初始化6宫格模式', () => {
    const store = useGameStore.getState()
    store.initGame(6, 'easy')

    expect(store.gridSize).toBe(6)
    expect(store.difficulty).toBe('easy')
    expect(store.board).toHaveLength(6)
    expect(store.solution).toHaveLength(6)
  })

  it('应该正确初始化9宫格模式', () => {
    const store = useGameStore.getState()
    store.initGame(9, 'medium')

    expect(store.gridSize).toBe(9)
    expect(store.difficulty).toBe('medium')
    expect(store.board).toHaveLength(9)
    expect(store.solution).toHaveLength(9)
  })

  it('应该正确初始化特色图形模式', () => {
    const store = useGameStore.getState()
    const symbols = ['🍎', '🍊', '🍋', '🍇']
    store.initGame(4, 'beginner', symbols)

    expect(store.gridSize).toBe(4)
    expect(store.symbolMode).toBe(true)
    expect(store.symbols).toEqual(symbols)
  })

  it('应该正确切换难度', () => {
    const store = useGameStore.getState()
    store.initGame(9, 'easy')
    expect(store.difficulty).toBe('easy')

    store.initGame(9, 'hard')
    expect(store.difficulty).toBe('hard')
  })

  it('应该正确重置游戏', () => {
    const store = useGameStore.getState()
    store.initGame(4, 'beginner')

    // 选择一个单元格并填入
    store.selectCell(0, 0)
    store.fillCell(1)

    // 重置
    store.resetGame()

    // 验证状态已重置
    expect(store.selectedCell).toBeNull()
    expect(store.isCompleted).toBe(false)
    expect(store.errorCells.size).toBe(0)
  })

  it('应该正确切换暂停状态', () => {
    const store = useGameStore.getState()
    store.initGame(4, 'beginner')

    expect(store.isPaused).toBe(false)
    store.togglePause()
    expect(store.isPaused).toBe(true)
    store.togglePause()
    expect(store.isPaused).toBe(false)
  })
})

describe('游戏操作', () => {
  beforeEach(() => {
    const store = useGameStore.getState()
    store.initGame(4, 'beginner')
  })

  it('应该正确选择单元格', () => {
    const store = useGameStore.getState()
    store.selectCell(1, 2)

    expect(store.selectedCell).toEqual({ row: 1, col: 2 })
  })

  it('应该正确填入数字', () => {
    const store = useGameStore.getState()

    // 找到一个空单元格
    let emptyCell = null
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (store.board[r][c] === null) {
          emptyCell = { row: r, col: c }
          break
        }
      }
      if (emptyCell) break
    }

    expect(emptyCell).not.toBeNull()
    if (emptyCell) {
      store.selectCell(emptyCell.row, emptyCell.col)
      store.fillCell(1)

      // 检查是否填入 (不关心对错，只关心操作成功)
      expect(store.board[emptyCell.row][emptyCell.col]).toBe(1)
    }
  })

  it('不应该修改固定单元格', () => {
    const store = useGameStore.getState()

    // 找到一个有数字的单元格
    let fixedCell = null
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (store.board[r][c] !== null) {
          fixedCell = { row: r, col: c }
          break
        }
      }
      if (fixedCell) break
    }

    expect(fixedCell).not.toBeNull()
    if (fixedCell) {
      const originalValue = store.board[fixedCell.row][fixedCell.col]
      store.selectCell(fixedCell.row, fixedCell.col)
      store.fillCell(99) // 尝试填入一个不同的值

      // 固定单元格的值不应该改变
      expect(store.board[fixedCell.row][fixedCell.col]).toBe(originalValue)
    }
  })
})
