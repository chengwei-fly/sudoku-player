/**
 * 数独生成器测试
 */
import { describe, it, expect } from 'vitest';
import { SudokuGenerator } from './sudokuGenerator';

describe('SudokuGenerator', () => {
  const generator = new SudokuGenerator();

  describe('generate 4x4', () => {
    it('应生成有效的4宫格数独', () => {
      const puzzle = generator.generate(4, 4);
      
      // 4宫格应该是4x4的网格
      expect(puzzle).toHaveLength(16);
      
      // 验证数字在有效范围内
      puzzle.forEach(num => {
        if (num !== 0) {
          expect(num).toBeGreaterThanOrEqual(1);
          expect(num).toBeLessThanOrEqual(4);
        }
      });
    });

    it('应生成具有唯一解的4宫格', () => {
      const puzzle = generator.generate(4, 4);
      const solutions = generator.solve(puzzle, 4);
      expect(solutions.length).toBe(1);
    });

    it('应正确填充空格', () => {
      const puzzle = generator.generate(4);
      const filledCount = puzzle.filter(n => n !== 0).length;
      // 4宫格16个格子，使用默认挖空数量，填充数应在合理范围内
      expect(filledCount).toBeGreaterThanOrEqual(6);
      expect(filledCount).toBeLessThanOrEqual(12);
    });
  });

  describe('generate 6x6', () => {
    it('应生成有效的6宫格数独', () => {
      const puzzle = generator.generate(6, 6);
      
      expect(puzzle).toHaveLength(36);
      
      puzzle.forEach(num => {
        if (num !== 0) {
          expect(num).toBeGreaterThanOrEqual(1);
          expect(num).toBeLessThanOrEqual(6);
        }
      });
    });

    it('应生成具有唯一解的6宫格', () => {
      const puzzle = generator.generate(6, 6);
      const solutions = generator.solve(puzzle, 6);
      expect(solutions.length).toBe(1);
    });
  });

  describe('generate 9x9', () => {
    it('应生成有效的9宫格数独', () => {
      const puzzle = generator.generate(9, 9);
      
      expect(puzzle).toHaveLength(81);
      
      puzzle.forEach(num => {
        if (num !== 0) {
          expect(num).toBeGreaterThanOrEqual(1);
          expect(num).toBeLessThanOrEqual(9);
        }
      });
    });

    it('应生成具有唯一解的9宫格', () => {
      const puzzle = generator.generate(9, 9);
      const solutions = generator.solve(puzzle, 9);
      expect(solutions.length).toBe(1);
    });

    it('应在100ms内生成', () => {
      const start = performance.now();
      generator.generate(9, 9);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe('generateFull', () => {
    it('应生成完整的4宫格解答', () => {
      const solution = generator.generateFull(4);
      
      expect(solution).toHaveLength(16);
      solution.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(4);
      });
    });

    it('应生成完整的9宫格解答', () => {
      const solution = generator.generateFull(9);
      
      expect(solution).toHaveLength(81);
      solution.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(9);
      });
    });

    it('生成的完整解答应有效', () => {
      const solution = generator.generateFull(9);
      expect(generator.isValid(solution, 9)).toBe(true);
    });
  });
});
