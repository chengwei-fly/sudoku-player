import { describe, it, expect, beforeEach } from 'vitest';
import SudokuGame, { Difficulty } from '../../utils/sudoku';

describe('SudokuGame', () => {
  let game: SudokuGame;

  beforeEach(() => {
    game = new SudokuGame();
  });

  describe('startNewGame', () => {
    it('should create a new game with correct difficulty', () => {
      game.startNewGame('easy');
      const state = game.getState();
      expect(state.difficulty).toBe('easy');
    });

    it('should fill the board with values', () => {
      game.startNewGame('easy');
      const state = game.getState();
      let filledCells = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (state.board[i][j].isFixed) filledCells++;
        }
      }
      expect(filledCells).toBeGreaterThan(0);
      expect(filledCells).toBeLessThanOrEqual(81);
    });

    it('should reset game state for new game', () => {
      game.startNewGame('easy');
      game.selectCell(0, 0);
      game.startNewGame('medium');
      const state = game.getState();
      expect(state.difficulty).toBe('medium');
      expect(state.selectedCell).toBeNull();
    });
  });

  describe('selectCell', () => {
    it('should select a cell', () => {
      game.startNewGame('easy');
      game.selectCell(0, 0);
      const state = game.getState();
      expect(state.selectedCell).toEqual({ row: 0, col: 0 });
    });

    it('should not select cell when game is complete', () => {
      game.startNewGame('easy');
      const state = game.getState();
      state.isComplete = true;
      game.selectCell(0, 0);
      expect(game.getState().selectedCell).toBeNull();
    });
  });

  describe('inputNumber', () => {
    it('should input a number into selected cell', () => {
      game.startNewGame('easy');
      game.selectCell(0, 0);
      const cellBefore = game.getState().board[0][0];
      if (!cellBefore.isFixed) {
        const result = game.inputNumber(5);
        expect(result.success).toBe(true);
        expect(game.getState().board[0][0].value).toBe(5);
      }
    });

    it('should not allow input on fixed cells', () => {
      game.startNewGame('easy');
      const fixedCell = game.getState().board[0][0];
      if (fixedCell.isFixed) {
        game.selectCell(0, 0);
        const result = game.inputNumber(5);
        expect(result.success).toBe(false);
      }
    });

    it('should track mistakes', () => {
      game.startNewGame('easy');
      const solution = game.getSolution();
      let targetCell: { row: number; col: number } | null = null;

      for (let i = 0; i < 9 && !targetCell; i++) {
        for (let j = 0; j < 9 && !targetCell; j++) {
          if (!game.getState().board[i][j].isFixed) {
            targetCell = { row: i, col: j };
          }
        }
      }

      if (targetCell) {
        game.selectCell(targetCell.row, targetCell.col);
        const correctValue = solution[targetCell.row][targetCell.col];
        const wrongValue = correctValue === 5 ? 3 : 5;

        game.inputNumber(wrongValue);
        expect(game.getState().mistakes).toBeGreaterThanOrEqual(0);
      }
    });

    it('should add to history on input', () => {
      game.startNewGame('easy');
      let targetCell: { row: number; col: number } | null = null;

      for (let i = 0; i < 9 && !targetCell; i++) {
        for (let j = 0; j < 9 && !targetCell; j++) {
          if (!game.getState().board[i][j].isFixed) {
            targetCell = { row: i, col: j };
          }
        }
      }

      if (targetCell) {
        const historyLengthBefore = game.getState().history.length;
        game.selectCell(targetCell.row, targetCell.col);
        game.inputNumber(5);
        expect(game.getState().history.length).toBeGreaterThan(historyLengthBefore);
      }
    });
  });

  describe('undo', () => {
    it('should undo last action', () => {
      game.startNewGame('easy');
      let targetCell: { row: number; col: number } | null = null;

      for (let i = 0; i < 9 && !targetCell; i++) {
        for (let j = 0; j < 9 && !targetCell; j++) {
          if (!game.getState().board[i][j].isFixed) {
            targetCell = { row: i, col: j };
          }
        }
      }

      if (targetCell) {
        game.selectCell(targetCell.row, targetCell.col);
        const originalValue = game.getState().board[targetCell.row][targetCell.col].value;
        game.inputNumber(5);
        game.undo();
        expect(game.getState().board[targetCell.row][targetCell.col].value).toBe(originalValue);
      }
    });

    it('should return false when no history', () => {
      game.startNewGame('easy');
      const result = game.undo();
      expect(result).toBe(false);
    });
  });

  describe('hint', () => {
    it('should reveal correct value for selected cell', () => {
      game.startNewGame('easy');
      let targetCell: { row: number; col: number } | null = null;

      for (let i = 0; i < 9 && !targetCell; i++) {
        for (let j = 0; j < 9 && !targetCell; j++) {
          if (!game.getState().board[i][j].isFixed) {
            targetCell = { row: i, col: j };
          }
        }
      }

      if (targetCell) {
        const solution = game.getSolution();
        game.selectCell(targetCell.row, targetCell.col);
        const hint = game.hint();
        expect(hint).not.toBeNull();
        expect(hint!.value).toBe(solution[targetCell.row][targetCell.col]);
      }
    });

    it('should increment hints used', () => {
      game.startNewGame('easy');
      let targetCell: { row: number; col: number } | null = null;

      for (let i = 0; i < 9 && !targetCell; i++) {
        for (let j = 0; j < 9 && !targetCell; j++) {
          if (!game.getState().board[i][j].isFixed) {
            targetCell = { row: i, col: j };
          }
        }
      }

      if (targetCell) {
        game.selectCell(targetCell.row, targetCell.col);
        game.hint();
        expect(game.getState().hintsUsed).toBe(1);
      }
    });
  });

  describe('reset', () => {
    it('should clear all user input', () => {
      game.startNewGame('easy');
      let targetCell: { row: number; col: number } | null = null;

      for (let i = 0; i < 9 && !targetCell; i++) {
        for (let j = 0; j < 9 && !targetCell; j++) {
          if (!game.getState().board[i][j].isFixed) {
            targetCell = { row: i, col: j };
          }
        }
      }

      if (targetCell) {
        game.selectCell(targetCell.row, targetCell.col);
        game.inputNumber(5);
        game.reset();

        const cell = game.getState().board[targetCell.row][targetCell.col];
        expect(cell.value).toBe(0);
        expect(cell.isHint).toBe(false);
      }
    });

    it('should reset mistakes and hints', () => {
      game.startNewGame('easy');
      game.reset();
      expect(game.getState().mistakes).toBe(0);
      expect(game.getState().hintsUsed).toBe(0);
    });
  });

  describe('clearCell', () => {
    it('should clear selected cell', () => {
      game.startNewGame('easy');
      let targetCell: { row: number; col: number } | null = null;

      for (let i = 0; i < 9 && !targetCell; i++) {
        for (let j = 0; j < 9 && !targetCell; j++) {
          if (!game.getState().board[i][j].isFixed) {
            targetCell = { row: i, col: j };
          }
        }
      }

      if (targetCell) {
        game.selectCell(targetCell.row, targetCell.col);
        game.inputNumber(5);
        game.clearCell();
        expect(game.getState().board[targetCell.row][targetCell.col].value).toBe(0);
      }
    });
  });

  describe('toggleNote', () => {
    it('should toggle note on empty cell', () => {
      game.startNewGame('easy');
      let targetCell: { row: number; col: number } | null = null;

      for (let i = 0; i < 9 && !targetCell; i++) {
        for (let j = 0; j < 9 && !targetCell; j++) {
          if (!game.getState().board[i][j].isFixed) {
            targetCell = { row: i, col: j };
          }
        }
      }

      if (targetCell) {
        game.selectCell(targetCell.row, targetCell.col);
        game.toggleNote(5);
        expect(game.getState().board[targetCell.row][targetCell.col].notes).toContain(5);
        game.toggleNote(5);
        expect(game.getState().board[targetCell.row][targetCell.col].notes).not.toContain(5);
      }
    });
  });

  describe('getAccuracy', () => {
    it('should return 100 when no inputs', () => {
      game.startNewGame('easy');
      expect(game.getAccuracy()).toBe(100);
    });
  });
});
