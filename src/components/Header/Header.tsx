import React from 'react'
import { Difficulty, GridSize } from '../../types'
import './Header.css'

interface HeaderProps {
  gridSize: GridSize
  difficulty: Difficulty
  timer: number
  filledCount: number
  totalEmpty: number
}

const difficultyText: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}

const difficultyLabel: Record<Difficulty, string> = {
  easy: '⭐',
  medium: '⭐⭐',
  hard: '⭐⭐⭐',
}

const Header: React.FC<HeaderProps> = ({
  gridSize,
  difficulty,
  timer,
  filledCount,
  totalEmpty,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = totalEmpty > 0 ? Math.round((filledCount / totalEmpty) * 100) : 0

  return (
    <header className="header" role="banner">
      <div className="header-info">
        <div className="info-item grid-size" data-testid="grid-size">
          <span className="info-icon">🎯</span>
          <span className="info-value">{gridSize}宫格</span>
        </div>

        <div className="info-item difficulty" data-testid="difficulty">
          <span className="info-icon">{difficultyLabel[difficulty]}</span>
          <span className="info-value">{difficultyText[difficulty]}</span>
        </div>
      </div>

      <div className="header-timer" data-testid="timer">
        <span className="timer-icon">⏱️</span>
        <span className="timer-value">{formatTime(timer)}</span>
      </div>

      <div className="header-progress" data-testid="progress">
        <div className="progress-info">
          <span className="progress-text">
            已填: {filledCount}/{totalEmpty}
          </span>
          <span className="progress-percent">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </header>
  )
}

export default Header
