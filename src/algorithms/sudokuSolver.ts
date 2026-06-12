/**
 * 数独求解器
 * 使用回溯法求解数独
 */
export class SudokuSolver {
  /**
   * 求解数独
   * @param puzzle 数独题目（0表示空格）
   * @param size 数独大小（4、6、9）
   * @param maxSolutions 最大解数量（默认1）
   * @returns 所有解的数组
   */
  solve(puzzle: number[], size: number, maxSolutions: number = 1): number[][] {
    const solutions: number[][] = [];
    const gridSize = size * size;
    
    // 复制题目
    const grid = [...puzzle];
    
    // 获取空白位置的候选数
    const candidates = this.getCandidates(grid, size);
    
    this.solveRecursive(grid, size, 0, candidates, solutions, maxSolutions);
    
    return solutions;
  }
  
  /**
   * 计算解的数量
   */
  countSolutions(puzzle: number[], size: number, maxCount: number = 2): number {
    const solutions = this.solve(puzzle, size, maxCount);
    return solutions.length;
  }
  
  /**
   * 验证数独是否有效
   */
  isValid(puzzle: number[], size: number): boolean {
    const gridSize = size * size;
    
    // 检查长度
    if (puzzle.length !== gridSize) {
      return false;
    }
    
    // 检查每个数字是否在有效范围内
    for (const num of puzzle) {
      if (num !== 0 && (num < 1 || num > size)) {
        return false;
      }
    }
    
    // 检查行
    for (let row = 0; row < size; row++) {
      const seen = new Set<number>();
      for (let col = 0; col < size; col++) {
        const num = puzzle[row * size + col];
        if (num !== 0) {
          if (seen.has(num)) {
            return false;
          }
          seen.add(num);
        }
      }
    }
    
    // 检查列
    for (let col = 0; col < size; col++) {
      const seen = new Set<number>();
      for (let row = 0; row < size; row++) {
        const num = puzzle[row * size + col];
        if (num !== 0) {
          if (seen.has(num)) {
            return false;
          }
          seen.add(num);
        }
      }
    }
    
    // 检查宫格
    const boxSize = this.getBoxSize(size);
    for (let boxRow = 0; boxRow < size; boxRow += boxSize) {
      for (let boxCol = 0; boxCol < size; boxCol += boxSize) {
        const seen = new Set<number>();
        for (let i = 0; i < boxSize; i++) {
          for (let j = 0; j < boxSize; j++) {
            const row = boxRow + i;
            const col = boxCol + j;
            const num = puzzle[row * size + col];
            if (num !== 0) {
              if (seen.has(num)) {
                return false;
              }
              seen.add(num);
            }
          }
        }
      }
    }
    
    return true;
  }
  
  /**
   * 递归求解
   */
  private solveRecursive(
    grid: number[],
    size: number,
    index: number,
    candidates: Map<number, number[]>,
    solutions: number[][],
    maxSolutions: number
  ): boolean {
    // 找到所有解就停止
    if (solutions.length >= maxSolutions) {
      return true;
    }
    
    // 找到空格
    let pos = -1;
    for (let i = index; i < grid.length; i++) {
      if (grid[i] === 0) {
        pos = i;
        break;
      }
    }
    
    // 没有空格了，找到一个解
    if (pos === -1) {
      solutions.push([...grid]);
      return solutions.length < maxSolutions;
    }
    
    // 获取候选数
    const cands = candidates.get(pos) || this.getCandidatesForCell(grid, size, pos);
    
    for (const num of cands) {
      grid[pos] = num;
      
      // 更新候选数
      const newCandidates = new Map(candidates);
      this.updateCandidates(newCandidates, grid, size, pos, num);
      
      // 继续求解
      if (this.solveRecursive(grid, size, pos + 1, newCandidates, solutions, maxSolutions)) {
        // 继续找更多解
      }
      
      grid[pos] = 0;
    }
    
    return solutions.length < maxSolutions;
  }
  
  /**
   * 获取某个格子的候选数
   */
  private getCandidatesForCell(grid: number[], size: number, pos: number): number[] {
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
    
    return candidates;
  }
  
  /**
   * 获取所有格子的候选数
   */
  private getCandidates(grid: number[], size: number): Map<number, number[]> {
    const candidates = new Map<number, number[]>();
    
    for (let pos = 0; pos < grid.length; pos++) {
      if (grid[pos] === 0) {
        candidates.set(pos, this.getCandidatesForCell(grid, size, pos));
      }
    }
    
    return candidates;
  }
  
  /**
   * 更新候选数
   */
  private updateCandidates(
    candidates: Map<number, number[]>,
    grid: number[],
    size: number,
    pos: number,
    num: number
  ): void {
    const row = Math.floor(pos / size);
    const col = pos % size;
    
    // 清除同行同列同宫格的其他空格候选数
    const boxSize = this.getBoxSize(size);
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;
    
    for (let i = 0; i < size; i++) {
      // 同行
      const rowPos = row * size + i;
      if (grid[rowPos] === 0 && candidates.has(rowPos)) {
        const cands = candidates.get(rowPos)!;
        const filtered = cands.filter(c => c !== num);
        if (filtered.length === 0) {
          candidates.delete(rowPos);
        } else {
          candidates.set(rowPos, filtered);
        }
      }
      
      // 同列
      const colPos = i * size + col;
      if (grid[colPos] === 0 && candidates.has(colPos)) {
        const cands = candidates.get(colPos)!;
        const filtered = cands.filter(c => c !== num);
        if (filtered.length === 0) {
          candidates.delete(colPos);
        } else {
          candidates.set(colPos, filtered);
        }
      }
    }
    
    // 同宫格
    for (let i = 0; i < boxSize; i++) {
      for (let j = 0; j < boxSize; j++) {
        const boxPos = (boxRow + i) * size + (boxCol + j);
        if (grid[boxPos] === 0 && candidates.has(boxPos)) {
          const cands = candidates.get(boxPos)!;
          const filtered = cands.filter(c => c !== num);
          if (filtered.length === 0) {
            candidates.delete(boxPos);
          } else {
            candidates.set(boxPos, filtered);
          }
        }
      }
    }
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
