import React from 'react'
import { GridSize } from '../../types'
import './NumberPad.css'

interface NumberPadProps {
  gridSize: GridSize
  selectedNumber: number | null
  onNumberClick: (num: number) => void
  onEraseClick?: () => void
  disabled?: boolean
}

const NumberPad: React.FC<NumberPadProps> = ({
  gridSize,
  selectedNumber,
  onNumberClick,
  onEraseClick,
  disabled = false,
}) => {
  const numbers = Array.from({ length: gridSize }, (_, i) => i + 1)

  return (
    <div className="number-pad" role="group" aria-label="数字键盘">
      <div className="number-pad-buttons">
        {numbers.map((num) => (
          <button
            key={num}
            className={`number-btn ${selectedNumber === num ? 'selected' : ''}`}
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            aria-label={`数字${num}`}
            data-testid={`number-btn-${num}`}
          >
            {num}
          </button>
        ))}
        {gridSize === 9 && onEraseClick && (
          <button
            className="number-btn erase-btn"
            onClick={onEraseClick}
            disabled={disabled}
            aria-label="擦除"
            data-testid="erase-btn"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default NumberPad
