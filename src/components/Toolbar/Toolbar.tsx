import React from 'react'
import './Toolbar.css'

interface ToolbarProps {
  onHint: () => void
  onUndo: () => void
  onReset: () => void
  onCheck: () => void
  onPause: () => void
  isPaused: boolean
  canUndo: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({
  onHint,
  onUndo,
  onReset,
  onCheck,
  onPause,
  isPaused,
  canUndo,
}) => {
  return (
    <div className="toolbar" role="toolbar" aria-label="游戏工具栏">
      <button
        className="toolbar-btn hint-btn"
        onClick={onHint}
        aria-label="获取提示"
        data-testid="hint-btn"
      >
        <span className="btn-icon">💡</span>
        <span className="btn-label">提示</span>
      </button>

      <button
        className="toolbar-btn undo-btn"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="撤销"
        data-testid="undo-btn"
      >
        <span className="btn-icon">↩️</span>
        <span className="btn-label">撤销</span>
      </button>

      <button
        className="toolbar-btn reset-btn"
        onClick={onReset}
        aria-label="重置"
        data-testid="reset-btn"
      >
        <span className="btn-icon">🔄</span>
        <span className="btn-label">重置</span>
      </button>

      <button
        className="toolbar-btn check-btn"
        onClick={onCheck}
        aria-label="检查"
        data-testid="check-btn"
      >
        <span className="btn-icon">✓</span>
        <span className="btn-label">检查</span>
      </button>

      <button
        className={`toolbar-btn pause-btn ${isPaused ? 'resumed' : ''}`}
        onClick={onPause}
        aria-label={isPaused ? '继续' : '暂停'}
        data-testid="pause-btn"
      >
        <span className="btn-icon">{isPaused ? '▶' : '⏸'}</span>
        <span className="btn-label">{isPaused ? '继续' : '暂停'}</span>
      </button>
    </div>
  )
}

export default Toolbar
