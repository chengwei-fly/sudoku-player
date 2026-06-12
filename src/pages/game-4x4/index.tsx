import React, { useEffect, useState, useCallback } from 'react'
import { useGameStore } from '../../store/gameStore'

export const Game4x4: React.FC = () => {
  const { 
    currentPuzzle, 
    currentSolution, 
    userInputs, 
    newGame, 
    selectCell, 
    inputNumber, 
    eraseNumber, 
    undo, 
    getHint,
    checkSolution,
    reset,
    isCompleted,
    elapsedTime,
    selectedCell
  } = useGameStore()

  const [time, setTime] = useState(0)
  const [showHint, setShowHint] = useState<{row: number, col: number} | null>(null)

  useEffect(() => {
    newGame(4, 'easy')
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isCompleted) {
        setTime(prev => prev + 1)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [isCompleted])

  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => setShowHint(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [showHint])

  const gridSize = 4

  const getBoard = (): (number | null)[][] => {
    const board: (number | null)[][] = []
    for (let r = 0; r < gridSize; r++) {
      board[r] = []
      for (let c = 0; c < gridSize; c++) {
        const puzzleVal = currentPuzzle?.[r]?.[c]
        const inputVal = userInputs?.[r]?.[c]
        board[r][c] = puzzleVal !== undefined && puzzleVal !== 0
          ? puzzleVal
          : (inputVal !== undefined && inputVal !== 0 ? inputVal : null)
      }
    }
    return board
  }

  const board = getBoard()

  const isFixed = (row: number, col: number) => {
    return currentPuzzle[row]?.[col] !== 0
  }

  const isSelectedCell = (row: number, col: number) => {
    return selectedCell?.row === row && selectedCell?.col === col
  }

  const isHintCell = (row: number, col: number) => {
    return showHint?.row === row && showHint?.col === col
  }

  const hasConflict = (row: number, col: number): boolean => {
    const value = board[row]?.[col]
    if (value === null || value === undefined) return false

    // 检查行
    for (let c = 0; c < gridSize; c++) {
      if (c !== col && board[row][c] === value) return true
    }

    // 检查列
    for (let r = 0; r < gridSize; r++) {
      if (r !== row && board[r][col] === value) return true
    }

    // 检查宫格 (2x2)
    const boxSize = 2
    const boxRowStart = Math.floor(row / boxSize) * boxSize
    const boxColStart = Math.floor(col / boxSize) * boxSize

    for (let r = boxRowStart; r < boxRowStart + boxSize; r++) {
      for (let c = boxColStart; c < boxColStart + boxSize; c++) {
        if (r !== row && c !== col && board[r][c] === value) return true
      }
    }

    return false
  }

  const getCellClass = (row: number, col: number) => {
    const classes: string[] = ['cell']
    if (isFixed(row, col)) classes.push('fixed')
    if (isSelectedCell(row, col)) classes.push('selected')
    if (isHintCell(row, col)) classes.push('hint')
    if (hasConflict(row, col)) classes.push('error')
    return classes.join(' ')
  }

  const handleCellClick = (row: number, col: number) => {
    selectCell(row, col)
  }

  const handleNumberClick = (num: number) => {
    inputNumber(num)
    setShowHint(null)
  }

  const handleClear = () => {
    eraseNumber()
  }

  const handleUndo = () => {
    undo()
  }

  const handleHint = () => {
    const hint = getHint()
    if (hint) {
      setShowHint({ row: hint.row, col: hint.col })
      selectCell(hint.row, hint.col)
    }
  }

  const handleCheck = () => {
    checkSolution()
  }

  const handleReset = () => {
    reset()
    setTime(0)
    setShowHint(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const filledCount = board.flat().filter(cell => cell !== null).length
  const totalCells = gridSize * gridSize

  // 数据未就绪时显示加载状态
  if (!currentPuzzle || currentPuzzle.length !== gridSize) {
    return (
      <div className="game-container">
        <div className="game-header">
          <h1 className="game-title">🎮 4宫格数独</h1>
        </div>
        <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
          正在加载题目…
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">🎮 4宫格数独</h1>
        <div className="game-info">
          <div className="timer">⏱️ {formatTime(time)}</div>
          <div className="progress">进度: {filledCount}/{totalCells}</div>
        </div>
      </div>

      <div className="board-wrapper">
        <div className={`board board-${gridSize}`}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== null ? cell : ''}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="numpad">
        {[1, 2, 3, 4].map(num => (
          <button key={num} className="num-btn" onClick={() => handleNumberClick(num)}>
            {num}
          </button>
        ))}
        <button className="num-btn clear-btn" onClick={handleClear}>
          ✕
        </button>
      </div>

      <div className="toolbar">
        <button className="tool-btn hint-btn" onClick={handleHint} title="提示">
          💡
        </button>
        <button className="tool-btn undo-btn" onClick={handleUndo} title="撤销">
          ↩️
        </button>
        <button className="tool-btn check-btn" onClick={handleCheck} title="检查">
          ✅
        </button>
        <button className="tool-btn reset-btn" onClick={handleReset} title="重置">
          🔄
        </button>
      </div>

      {isCompleted && (
        <div className="completion-popup">
          <div className="completion-content">
            <div className="completion-emoji">🎉</div>
            <h2>恭喜通关！</h2>
            <p>用时: {formatTime(time)}</p>
            <button className="action-btn" onClick={handleReset}>
              再玩一次
            </button>
          </div>
        </div>
      )}

      <style>{`
        .game-container {
          min-height: 100vh;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .game-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .game-title {
          font-size: 2.5rem;
          color: #ff6b6b;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .game-info {
          display: flex;
          gap: 20px;
          justify-content: center;
          font-size: 1.1rem;
          color: #666;
        }

        .timer, .progress {
          background: rgba(255,255,255,0.8);
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .board-wrapper {
          background: white;
          padding: 15px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          margin-bottom: 25px;
        }

        .board {
          display: grid;
          gap: 2px;
          background: #ff6b6b;
          padding: 3px;
          border-radius: 12px;
        }

        .board-4 {
          grid-template-columns: repeat(4, 75px);
          grid-template-rows: repeat(4, 75px);
        }

        .cell {
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          font-size: 2.5rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 8px;
          color: #2d5a7b;
        }

        .cell:hover {
          background: #ffeaa7;
          transform: scale(1.02);
        }

        .cell.fixed {
          background: #ffeaa7;
          color: #e17055;
        }

        .cell.selected {
          background: #74b9ff;
          color: white;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
        }

        .cell.hint {
          background: #55efc4;
          color: white;
          animation: pulse 0.5s ease infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .cell.error {
          background: #ff7675;
          color: white;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .board-4 .cell:nth-child(2n):not(:nth-child(4n)) {
          border-right: 3px solid #ff6b6b;
        }

        .board-4 .cell:nth-child(n+5):nth-child(-n+8) {
          border-bottom: 3px solid #ff6b6b;
        }

        .numpad {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .num-btn {
          width: 60px;
          height: 60px;
          font-size: 1.8rem;
          font-weight: bold;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          background: linear-gradient(135deg, #ffffff 0%, #f1f1f1 100%);
          color: #2d5a7b;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }

        .num-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
          color: white;
        }

        .num-btn:active {
          transform: translateY(-1px);
        }

        .clear-btn {
          background: linear-gradient(135deg, #ff7675 0%, #fd79a8 100%);
          color: white;
        }

        .clear-btn:hover {
          background: linear-gradient(135deg, #ff6b6b 0%, #e84393 100%);
        }

        .toolbar {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .tool-btn {
          width: 55px;
          height: 55px;
          font-size: 1.5rem;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .tool-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .hint-btn {
          background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
        }

        .undo-btn {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        }

        .check-btn {
          background: linear-gradient(135deg, #55efc4 0%, #00b894 100%);
        }

        .reset-btn {
          background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
        }

        .action-btn {
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: bold;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(0,184,148,0.4);
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,184,148,0.5);
        }

        .completion-popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .completion-content {
          background: white;
          padding: 40px;
          border-radius: 30px;
          text-align: center;
          animation: bounceIn 0.5s ease;
          max-width: 80%;
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }

        .completion-emoji {
          font-size: 5rem;
          margin-bottom: 15px;
        }

        .completion-content h2 {
          font-size: 2rem;
          color: #00b894;
          margin-bottom: 10px;
        }

        .completion-content p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 20px;
        }

        @media (max-width: 480px) {
          .board-4 {
            grid-template-columns: repeat(4, 60px);
            grid-template-rows: repeat(4, 60px);
          }

          .cell {
            font-size: 2rem;
          }

          .num-btn {
            width: 50px;
            height: 50px;
            font-size: 1.4rem;
          }

          .tool-btn {
            width: 45px;
            height: 45px;
            font-size: 1.2rem;
          }

          .game-title {
            font-size: 1.8rem;
          }

          .game-info {
            font-size: 0.9rem;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  )
}