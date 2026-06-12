export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CellData {
  value: number;
  isFixed: boolean;
  isError: boolean;
  isHint: boolean;
  notes: number[];
}

export interface GameState {
  board: CellData[][];
  selectedCell: { row: number; col: number } | null;
  difficulty: Difficulty;
  mistakes: number;
  hintsUsed: number;
  isComplete: boolean;
  history: { row: number; col: number; value: number; prevValue: number }[];
}

const DIFFICULTY_EMPTY_COUNT: Record<Difficulty, number> = {
  easy: 35,
  medium: 45,
  hard: 55,
};

function createEmptyBoard(): CellData[][] {
  const board: CellData[][] = [];
  for (let i = 0; i < 9; i++) {
    board[i] = [];
    for (let j = 0; j < 9; j++) {
      board[i][j] = {
        value: 0,
        isFixed: false,
        isError: false,
        isHint: false,
        notes: [],
      };
    }
  }
  return board;
}

function isValidPlacement(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = nums.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nums[i], nums[j]] = [nums[j], nums[i]];
        }

        for (const num of nums) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board: number[][], limit: number = 2): number {
  let count = 0;

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) {
                if (count >= limit) {
                  board[row][col] = 0;
                  return true;
                }
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count < limit;
  }

  solve();
  return count;
}

function generateSudoku(difficulty: Difficulty): { puzzle: number[][]; solution: number[][] } {
  const solution: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  solveSudoku(solution);

  const puzzle: number[][] = solution.map(row => [...row]);
  const emptyCount = DIFFICULTY_EMPTY_COUNT[difficulty];
  const positions: { row: number; col: number }[] = [];

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push({ row: i, col: j });
    }
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let removed = 0;
  for (const pos of positions) {
    if (removed >= emptyCount) break;

    const temp = puzzle[pos.row][pos.col];
    puzzle[pos.row][pos.col] = 0;

    const testBoard = puzzle.map(row => [...row]);
    if (countSolutions(testBoard, 2) !== 1) {
      puzzle[pos.row][pos.col] = temp;
    } else {
      removed++;
    }
  }

  return { puzzle, solution };
}

function boardToCellData(puzzle: number[][]): CellData[][] {
  const board: CellData[][] = createEmptyBoard();
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      board[i][j] = {
        value: puzzle[i][j],
        isFixed: puzzle[i][j] !== 0,
        isError: false,
        isHint: false,
        notes: [],
      };
    }
  }
  return board;
}

export class SudokuGame {
  private state: GameState;
  private solution: number[][];

  constructor() {
    this.state = {
      board: createEmptyBoard(),
      selectedCell: null,
      difficulty: 'easy',
      mistakes: 0,
      hintsUsed: 0,
      isComplete: false,
      history: [],
    };
    this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
  }

  startNewGame(difficulty: Difficulty): void {
    const { puzzle, solution } = generateSudoku(difficulty);
    this.solution = solution;
    this.state = {
      board: boardToCellData(puzzle),
      selectedCell: null,
      difficulty,
      mistakes: 0,
      hintsUsed: 0,
      isComplete: false,
      history: [],
    };
  }

  selectCell(row: number, col: number): void {
    if (this.state.isComplete) return;
    this.state.selectedCell = { row, col };
  }

  inputNumber(num: number): { success: boolean; isError: boolean } {
    if (!this.state.selectedCell || this.state.isComplete) {
      return { success: false, isError: false };
    }

    const { row, col } = this.state.selectedCell;
    const cell = this.state.board[row][col];

    if (cell.isFixed) {
      return { success: false, isError: false };
    }

    const prevValue = cell.value;
    this.state.history.push({ row, col, value: num, prevValue });

    cell.value = num;
    cell.notes = [];

    const isError = !this.checkCell(row, col);
    cell.isError = isError;
    if (isError) {
      this.state.mistakes++;
    }

    this.checkCompletion();

    return { success: true, isError };
  }

  clearCell(): void {
    if (!this.state.selectedCell || this.state.isComplete) return;

    const { row, col } = this.state.selectedCell;
    const cell = this.state.board[row][col];

    if (cell.isFixed) return;

    if (cell.value !== 0 || cell.notes.length > 0) {
      this.state.history.push({ row, col, value: 0, prevValue: cell.value });
    }

    cell.value = 0;
    cell.notes = [];
    cell.isError = false;
  }

  toggleNote(num: number): void {
    if (!this.state.selectedCell || this.state.isComplete) return;

    const { row, col } = this.state.selectedCell;
    const cell = this.state.board[row][col];

    if (cell.isFixed || cell.value !== 0) return;

    const index = cell.notes.indexOf(num);
    if (index === -1) {
      cell.notes.push(num);
      cell.notes.sort((a, b) => a - b);
    } else {
      cell.notes.splice(index, 1);
    }
  }

  undo(): boolean {
    if (this.state.history.length === 0 || this.state.isComplete) return false;

    const lastAction = this.state.history.pop()!;
    const cell = this.state.board[lastAction.row][lastAction.col];

    cell.value = lastAction.prevValue;
    cell.isError = false;

    if (lastAction.prevValue !== 0) {
      cell.isError = !this.checkCell(lastAction.row, lastAction.col);
    } else {
      cell.notes = [];
    }

    return true;
  }

  hint(): { row: number; col: number; value: number } | null {
    if (!this.state.selectedCell || this.state.isComplete) return null;

    const { row, col } = this.state.selectedCell;
    const cell = this.state.board[row][col];

    if (cell.isFixed) return null;

    const correctValue = this.solution[row][col];
    cell.value = correctValue;
    cell.isFixed = true;
    cell.isError = false;
    cell.isHint = true;
    this.state.hintsUsed++;

    this.checkCompletion();

    return { row, col, value: correctValue };
  }

  reset(): void {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!this.state.board[i][j].isFixed) {
          this.state.board[i][j] = {
            value: 0,
            isFixed: false,
            isError: false,
            isHint: false,
            notes: [],
          };
        }
      }
    }
    this.state.history = [];
    this.state.mistakes = 0;
    this.state.hintsUsed = 0;
    this.state.isComplete = false;
  }

  private checkCell(row: number, col: number): boolean {
    const value = this.state.board[row][col].value;
    if (value === 0) return true;

    const testBoard = this.state.board.map(r => r.map(c => c.value));
    testBoard[row][col] = 0;

    return isValidPlacement(testBoard, row, col, value);
  }

  private checkCompletion(): void {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.state.board[i][j].value === 0) return;
        if (this.state.board[i][j].isError) return;
      }
    }

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.state.board[i][j].value !== this.solution[i][j]) return;
      }
    }

    this.state.isComplete = true;
  }

  getState(): GameState {
    return this.state;
  }

  getSolution(): number[][] {
    return this.solution;
  }

  isComplete(): boolean {
    return this.state.isComplete;
  }

  getAccuracy(): number {
    let totalInputs = this.state.history.length;
    let correctInputs = 0;

    for (const action of this.state.history) {
      if (action.value === this.solution[action.row][action.col]) {
        correctInputs++;
      }
    }

    if (totalInputs === 0) return 100;
    return Math.round((correctInputs / totalInputs) * 100);
  }
}

export const sudokuGame = new SudokuGame();
export default SudokuGame;
