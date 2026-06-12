import React from 'react'
import { useGameStore } from '../../store/gameStore'
import { getBoxSize } from '../../utils/sudoku'

interface GameBoardProps {
  size: number
}

export const GameBoard: React.FC<GameBoardProps> = ({ size }) => {
  const { board, selectedCell, selectCell, errorCells, solution } = useGameStore()
  const boxSize = getBoxSize(size as 4 | 6 | 9)

  const isFixed = (row: number, col: number) => {
    return solution[row][col] !== null && board[row][col] === solution[row][col]
  }

  const isSelected = (row: number, col: number) => {
    return selectedCell?.row === row && selectedCell?.col === col
  }

  const isError = (row: number, col: number) => {
    return errorCells.has(`${row}-${col}`)
  }

  const getBorderClass = (row: number, col: number) => {
    const classes: string[] = ['border-cell']

    // 右边框 - 2宫格、3宫格边界需要加粗
    if ((col + 1) % boxSize.cols === 0 && col < size - 1) {
      classes.push('border-right-thick')
    }
    // 下边框
    if ((row + 1) % boxSize.rows === 0 && row < size - 1) {
      classes.push('border-bottom-thick')
    }

    return classes.join(' ')
  }

  return (
    <div className="game-board" data-size={size}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`${getBorderClass(rowIndex, colIndex)} ${isSelected(rowIndex, colIndex) ? 'selected' : ''} ${isError(rowIndex, colIndex) ? 'error' : ''} ${isFixed(rowIndex, colIndex) ? 'fixed' : ''}`}
            onClick={() => selectCell(rowIndex, colIndex)}
          >
            {cell !== null ? cell : ''}
          </div>
        ))
      )}
    </div>
  )
}
