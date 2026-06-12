import { describe, it, expect } from 'vitest'
import {
  generatePuzzle,
  generateSolution,
  solveSudoku,
  validateSudoku,
  checkCompletion,
  getHintCount,
  getBoxSize,
  GridSize,
} from '../src/utils/sudoku'

describe('数独工具函数', () => {
  describe('generateSolution', () => {
    it('应该生成4宫格完整解决方案', () => {
      const solution = generateSolution(4)
      expect(solution).toHaveLength(4)
      expect(solution.every(row => row.length === 4)).toBe(true)
      expect(validateSudoku(solution, 4)).toBe(true)
    })

    it('应该生成6宫格完整解决方案', () => {
      const solution = generateSolution(6)
      expect(solution).toHaveLength(6)
      expect(solution.every(row => row.length === 6)).toBe(true)
      expect(validateSudoku(solution, 6)).toBe(true)
    })

    it('应该生成9宫格完整解决方案', () => {
      const solution = generateSolution(9)
      expect(solution).toHaveLength(9)
      expect(solution.every(row => row.length === 9)).toBe(true)
      expect(validateSudoku(solution, 9)).toBe(true)
    })
  })

  describe('generatePuzzle', () => {
    it('应该生成4宫格题目 (入门难度)', () => {
      const { puzzle, solution } = generatePuzzle(4, 'beginner')
      expect(puzzle).toHaveLength(4)
      expect(solution).toHaveLength(4)

      // 计算提示数量
      const hintCount = puzzle.flat().filter(cell => cell !== null).length
      expect(hintCount).toBeGreaterThanOrEqual(8)
      expect(hintCount).toBeLessThanOrEqual(10)
    })

    it('应该生成6宫格题目 (简单难度)', () => {
      const { puzzle, solution } = generatePuzzle(6, 'easy')
      expect(puzzle).toHaveLength(6)
      expect(solution).toHaveLength(6)

      const hintCount = puzzle.flat().filter(cell => cell !== null).length
      expect(hintCount).toBeGreaterThanOrEqual(12)
      expect(hintCount).toBeLessThanOrEqual(15)
    })

    it('应该生成6宫格题目 (中等难度)', () => {
      const { puzzle, solution } = generatePuzzle(6, 'medium')
      expect(puzzle).toHaveLength(6)

      const hintCount = puzzle.flat().filter(cell => cell !== null).length
      expect(hintCount).toBeGreaterThanOrEqual(8)
      expect(hintCount).toBeLessThanOrEqual(12)
    })

    it('应该生成9宫格题目 (简单难度)', () => {
      const { puzzle, solution } = generatePuzzle(9, 'easy')
      expect(puzzle).toHaveLength(9)

      const hintCount = puzzle.flat().filter(cell => cell !== null).length
      expect(hintCount).toBeGreaterThanOrEqual(35)
      expect(hintCount).toBeLessThanOrEqual(40)
    })

    it('应该生成9宫格题目 (中等难度)', () => {
      const { puzzle, solution } = generatePuzzle(9, 'medium')
      expect(puzzle).toHaveLength(9)

      const hintCount = puzzle.flat().filter(cell => cell !== null).length
      expect(hintCount).toBeGreaterThanOrEqual(30)
      expect(hintCount).toBeLessThanOrEqual(35)
    })

    it('应该生成9宫格题目 (困难难度)', () => {
      const { puzzle, solution } = generatePuzzle(9, 'hard')
      expect(puzzle).toHaveLength(9)

      const hintCount = puzzle.flat().filter(cell => cell !== null).length
      expect(hintCount).toBeGreaterThanOrEqual(25)
      expect(hintCount).toBeLessThanOrEqual(30)
    })
  })

  describe('validateSudoku', () => {
    it('应该验证正确的4宫格解', () => {
      const solution = generateSolution(4)
      expect(validateSudoku(solution, 4)).toBe(true)
    })

    it('应该验证正确的6宫格解', () => {
      const solution = generateSolution(6)
      expect(validateSudoku(solution, 6)).toBe(true)
    })

    it('应该验证正确的9宫格解', () => {
      const solution = generateSolution(9)
      expect(validateSudoku(solution, 9)).toBe(true)
    })

    it('应该拒绝无效的数独', () => {
      const invalidBoard: (number | null)[][] = [
        [1, 1, 0, 0],
        [3, 4, 1, 2],
        [2, 3, 4, 1],
        [4, 2, 3, 4],
      ]
      expect(validateSudoku(invalidBoard, 4)).toBe(false)
    })
  })

  describe('checkCompletion', () => {
    it('应该正确判断完成状态', () => {
      const { puzzle, solution } = generatePuzzle(4, 'beginner')
      expect(checkCompletion(puzzle, solution, 4)).toBe(false)

      // 使用solution检查是否完成
      expect(checkCompletion(solution, solution, 4)).toBe(true)
    })
  })

  describe('getHintCount', () => {
    it('应该返回正确的提示数量', () => {
      expect(getHintCount(4, 'beginner')).toBe(9)
      expect(getHintCount(6, 'easy')).toBe(15)
      expect(getHintCount(6, 'medium')).toBe(12)
      expect(getHintCount(9, 'easy')).toBe(38)
      expect(getHintCount(9, 'medium')).toBe(32)
      expect(getHintCount(9, 'hard')).toBe(27)
    })
  })

  describe('getBoxSize', () => {
    it('应该返回正确的宫格尺寸', () => {
      expect(getBoxSize(4)).toEqual({ rows: 2, cols: 2 })
      expect(getBoxSize(6)).toEqual({ rows: 2, cols: 3 })
      expect(getBoxSize(9)).toEqual({ rows: 3, cols: 3 })
    })
  })
})

describe('solveSudoku', () => {
  it('应该解出一个完整的数独', () => {
    const board: (number | null)[][] = [
      [1, 2, 3, 4],
      [3, 4, null, null],
      [2, null, 4, null],
      [null, null, null, null],
    ]
    const result = solveSudoku(board)
    expect(result).toBe(true)
  })
})
