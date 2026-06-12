import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Toolbar from '../../components/Toolbar/Toolbar'

describe('Toolbar组件测试', () => {
  const defaultProps = {
    onHint: vi.fn(),
    onUndo: vi.fn(),
    onReset: vi.fn(),
    onCheck: vi.fn(),
    onPause: vi.fn(),
    isPaused: false,
    canUndo: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该渲染所有工具按钮', () => {
    render(<Toolbar {...defaultProps} />)
    expect(screen.getByTestId('hint-btn')).toBeInTheDocument()
    expect(screen.getByTestId('undo-btn')).toBeInTheDocument()
    expect(screen.getByTestId('reset-btn')).toBeInTheDocument()
    expect(screen.getByTestId('check-btn')).toBeInTheDocument()
    expect(screen.getByTestId('pause-btn')).toBeInTheDocument()
  })

  it('点击提示按钮应该调用onHint', () => {
    render(<Toolbar {...defaultProps} />)
    fireEvent.click(screen.getByTestId('hint-btn'))
    expect(defaultProps.onHint).toHaveBeenCalled()
  })

  it('点击撤销按钮应该调用onUndo', () => {
    render(<Toolbar {...defaultProps} />)
    fireEvent.click(screen.getByTestId('undo-btn'))
    expect(defaultProps.onUndo).toHaveBeenCalled()
  })

  it('canUndo为false时撤销按钮应该禁用', () => {
    render(<Toolbar {...defaultProps} canUndo={false} />)
    expect(screen.getByTestId('undo-btn')).toBeDisabled()
  })

  it('canUndo为true时撤销按钮应该启用', () => {
    render(<Toolbar {...defaultProps} canUndo={true} />)
    expect(screen.getByTestId('undo-btn')).toBeEnabled()
  })

  it('点击重置按钮应该调用onReset', () => {
    render(<Toolbar {...defaultProps} />)
    fireEvent.click(screen.getByTestId('reset-btn'))
    expect(defaultProps.onReset).toHaveBeenCalled()
  })

  it('点击检查按钮应该调用onCheck', () => {
    render(<Toolbar {...defaultProps} />)
    fireEvent.click(screen.getByTestId('check-btn'))
    expect(defaultProps.onCheck).toHaveBeenCalled()
  })

  it('点击暂停按钮应该调用onPause', () => {
    render(<Toolbar {...defaultProps} />)
    fireEvent.click(screen.getByTestId('pause-btn'))
    expect(defaultProps.onPause).toHaveBeenCalled()
  })

  it('暂停状态应该显示继续按钮', () => {
    render(<Toolbar {...defaultProps} isPaused={true} />)
    const pauseBtn = screen.getByTestId('pause-btn')
    expect(pauseBtn).toHaveClass('resumed')
  })

  it('非暂停状态应该显示暂停按钮', () => {
    render(<Toolbar {...defaultProps} isPaused={false} />)
    const pauseBtn = screen.getByTestId('pause-btn')
    expect(pauseBtn).not.toHaveClass('resumed')
  })
})
