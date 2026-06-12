import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NumberPad from '../../components/NumberPad/NumberPad'

describe('NumberPad组件测试', () => {
  const defaultProps = {
    gridSize: 9 as const,
    selectedNumber: null as number | null,
    onNumberClick: vi.fn(),
    onEraseClick: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('9宫格应该渲染1-9数字按钮', () => {
    render(<NumberPad {...defaultProps} gridSize={9} />)
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByTestId(`number-btn-${i}`)).toBeInTheDocument()
    }
  })

  it('4宫格应该渲染1-4数字按钮', () => {
    render(<NumberPad {...defaultProps} gridSize={4} />)
    for (let i = 1; i <= 4; i++) {
      expect(screen.getByTestId(`number-btn-${i}`)).toBeInTheDocument()
    }
    expect(screen.queryByTestId('number-btn-5')).not.toBeInTheDocument()
  })

  it('6宫格应该渲染1-6数字按钮', () => {
    render(<NumberPad {...defaultProps} gridSize={6} />)
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`number-btn-${i}`)).toBeInTheDocument()
    }
    expect(screen.queryByTestId('number-btn-7')).not.toBeInTheDocument()
  })

  it('9宫格应该显示擦除按钮', () => {
    render(<NumberPad {...defaultProps} gridSize={9} />)
    expect(screen.getByTestId('erase-btn')).toBeInTheDocument()
  })

  it('4宫格和6宫格不应该显示擦除按钮', () => {
    const { rerender } = render(<NumberPad {...defaultProps} gridSize={4} />)
    expect(screen.queryByTestId('erase-btn')).not.toBeInTheDocument()

    rerender(<NumberPad {...defaultProps} gridSize={6} />)
    expect(screen.queryByTestId('erase-btn')).not.toBeInTheDocument()
  })

  it('点击数字按钮应该调用onNumberClick', () => {
    render(<NumberPad {...defaultProps} gridSize={9} />)
    fireEvent.click(screen.getByTestId('number-btn-5'))
    expect(defaultProps.onNumberClick).toHaveBeenCalledWith(5)
  })

  it('点击擦除按钮应该调用onEraseClick', () => {
    render(<NumberPad {...defaultProps} gridSize={9} />)
    fireEvent.click(screen.getByTestId('erase-btn'))
    expect(defaultProps.onEraseClick).toHaveBeenCalled()
  })

  it('选中数字应该有selected类', () => {
    render(<NumberPad {...defaultProps} selectedNumber={5} gridSize={9} />)
    const btn = screen.getByTestId('number-btn-5')
    expect(btn).toHaveClass('selected')
  })

  it('禁用状态下按钮应该禁用', () => {
    render(<NumberPad {...defaultProps} disabled={true} gridSize={9} />)
    const btns = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => screen.getByTestId(`number-btn-${i}`))
    btns.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })
})
