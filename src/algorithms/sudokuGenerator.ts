/**
 * 数独生成器
 * 使用舞蹈链(Dancing Links)算法生成数独
 */
import { SudokuSolver } from './sudokuSolver';

export class SudokuGenerator {
  private solver: SudokuSolver;
  
  constructor() {
    this.solver = new SudokuSolver();
  }
  
  /**
   * 生成数独题目
   * @param size 数独大小（4、6、9）
   * @param holes 挖空数量
   * @returns 数独题目（0表示空格）
   */
  generate(size: number, holes?: number): number[] {
    // 生成完整的解答
    const solution = this.generateFull(size);
    
    // 计算挖空数量
    const gridSize = size * size;
    const actualHoles = holes ?? this.calculateDefaultHoles(size, gridSize);
    
    // 挖空
    const puzzle = this.createPuzzle(solution, size, actualHoles);
    
    return puzzle;
  }
  
  /**
   * 生成完整的数独解答
   */
  generateFull(size: number): number[] {
    const gridSize = size * size;
    const grid = new Array(gridSize).fill(0);
    
    this.fillGrid(grid, size);
    
    return grid;
  }
  
  /**
   * 求解数独（复用solver）
   */
  solve(puzzle: number[], size: number, maxSolutions: number = 1): number[][] {
    return this.solver.solve(puzzle, size, maxSolutions);
  }
  
  /**
   * 验证数独是否有效
   */
  isValid(puzzle: number[], size: number): boolean {
    return this.solver.isValid(puzzle, size);
  }
  
  /**
   * 填充网格（使用回溯法 + 舞蹈链优化）
   */
  private fillGrid(grid: number[], size: number): boolean {
    const emptyPos = grid.indexOf(0);
    
    if (emptyPos === -1) {
      return true; // 填充完成
    }
    
    const candidates = this.getShuffledCandidates(grid, size, emptyPos);
    
    for (const num of candidates) {
      grid[emptyPos] = num;
      
      if (this.fillGrid(grid, size)) {
        return true;
      }
      
      grid[emptyPos] = 0;
    }
    
    return false;
  }
  
  /**
   * 获取某个位置的候选数（已洗牌）
   */
  private getShuffledCandidates(grid: number[], size: number, pos: number): number[] {
    const row = Math.floor(pos / size);
    const col = pos % size;
    const boxSize = this.getBoxSize(size);
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;
    
    const used = new Set<number>();
    
    // 检查行
    for (let c = 0; c < size; c++) {
      const num = grid[row * size + c];
      if (num !== 0) used.add(num);
    }
    
    // 检查列
    for (let r = 0; r < size; r++) {
      const num = grid[r * size + col];
      if (num !== 0) used.add(num);
    }
    
    // 检查宫格
    for (let i = 0; i < boxSize; i++) {
      for (let j = 0; j < boxSize; j++) {
        const num = grid[(boxRow + i) * size + (boxCol + j)];
        if (num !== 0) used.add(num);
      }
    }
    
    const candidates: number[] = [];
    for (let n = 1; n <= size; n++) {
      if (!used.has(n)) {
        candidates.push(n);
      }
    }
    
    // 洗牌以获得随机性
    this.shuffle(candidates);
    
    return candidates;
  }
  
  /**
   * Fisher-Yates 洗牌算法
   */
  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  /**
   * 计算默认挖空数量
   */
  private calculateDefaultHoles(size: number, gridSize: number): number {
    // 根据数独大小计算合适的挖空数量
    // 4宫格: 4-6个空格
    // 6宫格: 20-25个空格
    // 9宫格: 30-45个空格
    if (size === 4) {
      return Math.floor(gridSize * 0.4); // 约40%空格
    } else if (size === 6) {
      return Math.floor(gridSize * 0.55); // 约55%空格
    } else {
      return Math.floor(gridSize * 0.5); // 约50%空格
    }
  }
  
  /**
   * 创建题目（挖空）
   */
  private createPuzzle(solution: number[], size: number, holes: number): number[] {
    const gridSize = size * size;
    const puzzle = [...solution];
    
    // 创建位置数组
    const positions: number[] = [];
    for (let i = 0; i < gridSize; i++) {
      positions.push(i);
    }
    
    // 洗牌位置
    this.shuffle(positions);
    
    let removed = 0;
    
    for (const pos of positions) {
      if (removed >= holes) break;
      
      const backup = puzzle[pos];
      puzzle[pos] = 0;
      
      // 检查是否仍有唯一解
      const solutions = this.solver.solve(puzzle, size, 2);
      
      if (solutions.length !== 1) {
        // 恢复
        puzzle[pos] = backup;
      } else {
        removed++;
      }
    }
    
    return puzzle;
  }
  
  /**
   * 获取宫格大小
   */
  private getBoxSize(size: number): number {
    if (size === 4) return 2;
    if (size === 6) return 2;
    if (size === 9) return 3;
    return Math.sqrt(size) as number;
  }
}
