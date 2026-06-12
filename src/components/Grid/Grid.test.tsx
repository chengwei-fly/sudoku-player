import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Grid from '../../components/Grid/Grid'

describe('Grid组件测试', () => {
  const mockBoard4x4: (number | null)[][] = [
    [1, null, null, 4],
    [null, 2, 3, null],
    [null, 3, 2, null],
    [4, null, null, 1],
  ]

  const mockBoard9x9: (number | null)[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null))

  const mockFixedCells = new Set(['0-0', '0-3', '3-0', '3-3'])

  const defaultProps = {
    gridSize: 4 as const,
    board: mockBoard4x4,
    fixedCells: mockFixedCells,
    selectedCell: null,
    errorCells: new Set<string>(),
    onCellClick: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染4宫格', () => {
    render(<Grid {...defaultProps} gridSize={4} />)
    const cells = screen.getAllByRole('gridcell')
    expect(cells).toHaveLength(16)
  })

  it('应该正确渲染9宫格', () => {
    render(<Grid {...defaultProps} gridSize={9} board={mockBoard9x9} fixedCells={new Set()} />)
    const cells = screen.getAllByRole('gridcell')
    expect(cells).toHaveLength(81)
  })

  it('应该正确渲染6宫格', () => {
    const board6x6: (number | null)[][] = Array(6)
      .fill(null)
      .map(() => Array(6).fill(null))
    render(<Grid {...defaultProps} gridSize={6} board={board6x6} fixedCells={new Set()} />)
    const cells = screen.getAllByRole('gridcell')
    expect(cells).toHaveLength(36)
  })

  it('点击单元格应该调用onCellClick', () => {
    render(<Grid {...defaultProps} />)
    const cell = screen.getByTestId('cell-0-1')
    fireEvent.click(cell)
    expect(defaultProps.onCellClick).toHaveBeenCalledWith(0, 1)
  })

  it('选中单元格应该有selected类', () => {
    render(<Grid {...defaultProps} selectedCell={{ row: 0, col: 1 }} />)
    const cell = screen.getByTestId('cell-0-1')
    expect(cell).toHaveClass('selected')
  })

  it('固定单元格应该有fixed类', () => {
    render(<Grid {...defaultProps} />)
    const cell = screen.getByTestId('cell-0-0')
    expect(cell).toHaveClass('fixed')
  })

  it('用户输入单元格应该有user-input类', () => {
    render(<Grid {...defaultProps} />)
    const cell = screen.getByTestId('cell-0-1')
    expect(cell).toHaveClass('user-input')
  })

  it('错误单元格应该有error类', () => {
    const errorCells = new Set(['0-1'])
    render(<Grid {...defaultProps} errorCells={errorCells} />)
    const cell = screen.getByTestId('cell-0-1')
    expect(cell).toHaveClass('error')
  })

  it('4宫格的2x2分界线处应该有box-right和box-bottom类', () => {
    render(<Grid {...defaultProps} gridSize={4} />)
    const cell = screen.getByTestId('cell-1-1')
    expect(cell).toHaveClass('box-right')
    expect(cell).toHaveClass('box-bottom')
  })

  it('9宫格的3x3分界线处应该有box-right和box-bottom类', () => {
    const board9 = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
    render(<Grid {...defaultProps} gridSize={9} board={board9} fixedCells={new Set()} />)
    const cell = screen.getByTestId('cell-2-2')
    expect(cell).toHaveClass('box-right')
    expect(cell).toHaveClass('box-bottom')
  })
})
