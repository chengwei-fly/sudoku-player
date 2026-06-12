import React, { useCallback } from 'react'
import { GridSize } from '../../types'
import './Grid.css'

interface GridProps {
  gridSize: GridSize
  board: (number | null)[][]
  fixedCells: Set<string>
  selectedCell: { row: number; col: number } | null
  errorCells: Set<string>
  onCellClick: (row: number, col: number) => void
}

const Grid: React.FC<GridProps> = ({
  gridSize,
  board,
  fixedCells,
  selectedCell,
  errorCells,
  onCellClick,
}) => {
  const getBoxSize = useCallback((size: GridSize): number => {
    return size === 4 ? 2 : size === 6 ? 3 : 3
  }, [])

  const isBoxBoundary = useCallback(
    (row: number, col: number): { isRightBoundary: boolean; isBottomBoundary: boolean } => {
      const boxSize = getBoxSize(gridSize)
      return {
        isRightBoundary: (col + 1) % boxSize === 0 && col !== gridSize - 1,
        isBottomBoundary: (row + 1) % boxSize === 0 && row !== gridSize - 1,
      }
    },
    [gridSize, getBoxSize]
  )

  const isSelected = useCallback(
    (row: number, col: number): boolean => {
      return selectedCell?.row === row && selectedCell?.col === col
    },
    [selectedCell]
  )

  const isFixed = useCallback(
    (row: number, col: number): boolean => {
      return fixedCells.has(`${row}-${col}`)
    },
    [fixedCells]
  )

  const hasError = useCallback(
    (row: number, col: number): boolean => {
      return errorCells.has(`${row}-${col}`)
    },
    [errorCells]
  )

  const renderCells = () => {
    const cells: React.ReactNode[] = []

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const { isRightBoundary, isBottomBoundary } = isBoxBoundary(row, col)
        const value = board[row][col]
        const cellClasses = [
          'grid-cell',
          isFixed(row, col) ? 'fixed' : 'user-input',
          isSelected(row, col) ? 'selected' : '',
          hasError(row, col) ? 'error' : '',
          isRightBoundary ? 'box-right' : '',
          isBottomBoundary ? 'box-bottom' : '',
        ]
          .filter(Boolean)
          .join(' ')

        cells.push(
          <div
            key={`${row}-${col}`}
            className={cellClasses}
            onClick={() => onCellClick(row, col)}
            data-testid={`cell-${row}-${col}`}
            role="gridcell"
            aria-selected={isSelected(row, col)}
          >
            <span className="cell-value">{value || ''}</span>
          </div>
        )
      }
    }

    return cells
  }

  return (
    <div
      className={`grid grid-${gridSize}`}
      role="grid"
      aria-label={`${gridSize}宫格数独棋盘`}
    >
      <div
        className="grid-inner"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {renderCells()}
      </div>
    </div>
  )
}

export default Grid
