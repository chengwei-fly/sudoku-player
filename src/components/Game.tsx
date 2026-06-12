import { GameState, CellData } from '../utils/sudoku';
import { timer } from '../utils/timer';
import { audio } from '../utils/audio';

interface Props {
  gameState: GameState;
  time: number;
  isPaused: boolean;
  onCellSelect: (row: number, col: number) => void;
  onNumberInput: (num: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onHint: () => void;
  onReset: () => void;
  onTogglePause: () => void;
  onToggleBgm: () => void;
  onToggleNote: (num: number) => void;
  onBackToMenu: () => void;
}

function Game({
  gameState,
  isPaused,
  onCellSelect,
  onNumberInput,
  onClear,
  onUndo,
  onHint,
  onReset,
  onTogglePause,
  onToggleBgm,
  onToggleNote,
  onBackToMenu,
}: Props) {
  const { board, selectedCell, mistakes, hintsUsed } = gameState;

  const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col].value : 0;

  const getCellClass = (cell: CellData, row: number, col: number): string => {
    const classes = ['cell'];

    if (cell.isFixed) classes.push('fixed');
    if (cell.isError) classes.push('error');
    if (cell.isHint) classes.push('hint');

    if (selectedCell) {
      if (row === selectedCell.row && col === selectedCell.col) {
        classes.push('selected');
      } else if (cell.value === selectedValue && selectedValue !== 0) {
        classes.push('same-number');
      } else if (
        row === selectedCell.row ||
        col === selectedCell.col ||
        (Math.floor(row / 3) === Math.floor(selectedCell.row / 3) &&
          Math.floor(col / 3) === Math.floor(selectedCell.col / 3))
      ) {
        classes.push('highlight');
      }
    }

    return classes.join(' ');
  };

  const renderCell = (cell: CellData, row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;

    return (
      <div
        key={`${row}-${col}`}
        className={getCellClass(cell, row, col)}
        onClick={() => onCellSelect(row, col)}
      >
        {cell.value !== 0 ? (
          cell.value
        ) : (
          <div className="notes">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span
                key={n}
                className={cell.notes.includes(n) ? 'note active' : 'note'}
              >
                {cell.notes.includes(n) ? n : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="game">
      <div className="settings-bar">
        <button
          className={`icon-btn ${isPaused ? '' : 'active'}`}
          onClick={onTogglePause}
          title={isPaused ? '继续' : '暂停'}
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>
        <button
          className={`icon-btn ${audio.isBgmMutedState() ? 'muted' : ''}`}
          onClick={onToggleBgm}
          title={audio.isBgmMutedState() ? '开启音乐' : '关闭音乐'}
        >
          {audio.isBgmMutedState() ? '🔇' : '🔊'}
        </button>
        <button className="icon-btn" onClick={onBackToMenu} title="返回菜单">
          🏠
        </button>
      </div>

      <div className="controls">
        <button className="control-btn" onClick={onUndo}>
          撤销
        </button>
        <button className="control-btn" onClick={onClear}>
          清除
        </button>
        <button className="control-btn" onClick={onHint}>
          提示
        </button>
        <button className="control-btn" onClick={onReset}>
          重置
        </button>
      </div>

      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
        )}
      </div>

      <div className="controls">
        <span style={{ fontSize: '14px', color: '#666' }}>
          错误: {mistakes} | 提示: {hintsUsed}
        </span>
      </div>

      <div className="numpad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className="num-btn"
            onClick={() => onNumberInput(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="controls" style={{ marginTop: '15px' }}>
        <button
          className="control-btn"
          onClick={() => {
            for (let i = 1; i <= 9; i++) onToggleNote(i);
          }}
        >
          笔记模式
        </button>
      </div>
    </div>
  );
}

export default Game;
