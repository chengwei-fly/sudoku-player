/**
 * 数独求解器测试
 */
import { describe, it, expect } from 'vitest';
import { SudokuSolver } from './sudokuSolver';

describe('SudokuSolver', () => {
  const solver = new SudokuSolver();

  describe('solve 4x4', () => {
    it('应正确求解4宫格', () => {
      // 4x4示例：行优先排列
      const puzzle = [
        1, 0, 0, 4,
        3, 0, 0, 2,
        2, 0, 0, 3,
        4, 0, 0, 1
      ];
      
      const solutions = solver.solve(puzzle, 4);
      expect(solutions.length).toBe(1);
      
      // 验证解答有效
      expect(solver.isValid(solutions[0], 4)).toBe(true);
    });

    it('应检测无解情况', () => {
      const puzzle = [
        1, 1, 0, 0,  // 第一行有重复的1
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
      ];
      
      const solutions = solver.solve(puzzle, 4);
      expect(solutions.length).toBe(0);
    });
  });

  describe('solve 9x9', () => {
    it('应正确求解标准9宫格', () => {
      // 已知有唯一解的9宫格
      const puzzle = [
        5, 3, 0, 0, 7, 0, 0, 0, 0,
        6, 0, 0, 1, 9, 5, 0, 0, 0,
        0, 9, 8, 0, 0, 0, 0, 6, 0,
        8, 0, 0, 0, 6, 0, 0, 0, 3,
        4, 0, 0, 8, 0, 3, 0, 0, 1,
        7, 0, 0, 0, 2, 0, 0, 0, 6,
        0, 6, 0, 0, 0, 0, 2, 8, 0,
        0, 0, 0, 4, 1, 9, 0, 0, 5,
        0, 0, 0, 0, 8, 0, 0, 7, 9
      ];
      
      const solutions = solver.solve(puzzle, 9);
      expect(solutions.length).toBe(1);
      expect(solver.isValid(solutions[0], 9)).toBe(true);
    });

    it('应检测无解的9宫格', () => {
      const puzzle = [
        1, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0
      ];
      
      const solutions = solver.solve(puzzle, 9);
      expect(solutions.length).toBe(0);
    });

    it('应求解有多个解的数独并返回第一个', () => {
      const puzzle = [
        1, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0
      ];
      
      const solutions = solver.solve(puzzle, 9);
      expect(solutions.length).toBeGreaterThan(0);
      expect(solver.isValid(solutions[0], 9)).toBe(true);
    });

    it('应在50ms内求解', () => {
      const puzzle = [
        5, 3, 0, 0, 7, 0, 0, 0, 0,
        6, 0, 0, 1, 9, 5, 0, 0, 0,
        0, 9, 8, 0, 0, 0, 0, 6, 0,
        8, 0, 0, 0, 6, 0, 0, 0, 3,
        4, 0, 0, 8, 0, 3, 0, 0, 1,
        7, 0, 0, 0, 2, 0, 0, 0, 6,
        0, 6, 0, 0, 0, 0, 2, 8, 0,
        0, 0, 0, 4, 1, 9, 0, 0, 5,
        0, 0, 0, 0, 8, 0, 0, 7, 9
      ];
      
      const start = performance.now();
      solver.solve(puzzle, 9);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });
  });

  describe('isValid', () => {
    it('应验证有效的4宫格', () => {
      const solution = [
        1, 2, 3, 4,
        3, 4, 1, 2,
        2, 1, 4, 3,
        4, 3, 2, 1
      ];
      expect(solver.isValid(solution, 4)).toBe(true);
    });

    it('应拒绝无效的4宫格', () => {
      const invalid = [
        1, 1, 3, 4,
        3, 4, 1, 2,
        2, 1, 4, 3,
        4, 3, 2, 1
      ];
      expect(solver.isValid(invalid, 4)).toBe(false);
    });

    it('应验证有效的9宫格', () => {
      const solution = [
        5, 3, 4, 6, 7, 8, 9, 1, 2,
        6, 7, 2, 1, 9, 5, 3, 4, 8,
        1, 9, 8, 3, 4, 2, 5, 6, 7,
        8, 5, 9, 7, 6, 1, 4, 2, 3,
        4, 2, 6, 8, 5, 3, 7, 9, 1,
        7, 1, 3, 9, 2, 4, 8, 5, 6,
        9, 6, 1, 5, 3, 7, 2, 8, 4,
        2, 8, 7, 4, 1, 9, 6, 3, 5,
        3, 4, 5, 2, 8, 6, 1, 7, 9
      ];
      expect(solver.isValid(solution, 9)).toBe(true);
    });

    it('应拒绝无效的9宫格', () => {
      const invalid = [
        5, 3, 4, 6, 7, 8, 9, 1, 2,
        6, 7, 2, 1, 9, 5, 3, 4, 8,
        1, 9, 8, 3, 4, 2, 5, 6, 7,
        8, 5, 9, 7, 6, 1, 4, 2, 3,
        4, 2, 6, 8, 5, 3, 7, 9, 1,
        7, 1, 3, 9, 2, 4, 8, 5, 6,
        9, 6, 1, 5, 3, 7, 2, 8, 4,
        2, 8, 7, 4, 1, 9, 6, 3, 5,
        3, 3, 5, 2, 8, 6, 1, 7, 9  // 第9行有重复的3
      ];
      expect(solver.isValid(invalid, 9)).toBe(false);
    });
  });

  describe('countSolutions', () => {
    it('应正确计数4宫格解的数量', () => {
      const puzzle = [
        1, 0, 0, 4,
        3, 0, 0, 2,
        2, 0, 0, 3,
        4, 0, 0, 1
      ];
      
      expect(solver.countSolutions(puzzle, 4)).toBe(1);
    });

    it('应正确计数9宫格解的数量', () => {
      const puzzle = [
        5, 3, 0, 0, 7, 0, 0, 0, 0,
        6, 0, 0, 1, 9, 5, 0, 0, 0,
        0, 9, 8, 0, 0, 0, 0, 6, 0,
        8, 0, 0, 0, 6, 0, 0, 0, 3,
        4, 0, 0, 8, 0, 3, 0, 0, 1,
        7, 0, 0, 0, 2, 0, 0, 0, 6,
        0, 6, 0, 0, 0, 0, 2, 8, 0,
        0, 0, 0, 4, 1, 9, 0, 0, 5,
        0, 0, 0, 0, 8, 0, 0, 7, 9
      ];
      
      expect(solver.countSolutions(puzzle, 9)).toBe(1);
    });
  });
});
