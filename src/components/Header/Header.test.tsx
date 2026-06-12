import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../../components/Header/Header'

describe('Header组件测试', () => {
  const defaultProps = {
    gridSize: 9 as const,
    difficulty: 'easy' as const,
    timer: 125,
    filledCount: 30,
    totalEmpty: 51,
  }

  it('应该正确显示宫格大小', () => {
    render(<Header {...defaultProps} gridSize={4} />)
    expect(screen.getByTestId('grid-size')).toHaveTextContent('4宫格')
  })

  it('应该正确显示简单难度', () => {
    render(<Header {...defaultProps} difficulty="easy" />)
    expect(screen.getByTestId('difficulty')).toHaveTextContent('简单')
  })

  it('应该正确显示中等难度', () => {
    render(<Header {...defaultProps} difficulty="medium" />)
    expect(screen.getByTestId('difficulty')).toHaveTextContent('中等')
  })

  it('应该正确显示困难难度', () => {
    render(<Header {...defaultProps} difficulty="hard" />)
    expect(screen.getByTestId('difficulty')).toHaveTextContent('困难')
  })

  it('应该正确格式化时间显示', () => {
    render(<Header {...defaultProps} timer={125} />)
    expect(screen.getByTestId('timer')).toHaveTextContent('02:05')
  })

  it('时间应该显示00:00格式', () => {
    render(<Header {...defaultProps} timer={0} />)
    expect(screen.getByTestId('timer')).toHaveTextContent('00:00')
  })

  it('时间应该显示59:59格式', () => {
    render(<Header {...defaultProps} timer={3599} />)
    expect(screen.getByTestId('timer')).toHaveTextContent('59:59')
  })

  it('应该正确显示进度文本', () => {
    render(<Header {...defaultProps} filledCount={30} totalEmpty={50} />)
    expect(screen.getByTestId('progress')).toHaveTextContent('已填: 30/50')
  })

  it('应该正确计算进度百分比', () => {
    render(<Header {...defaultProps} filledCount={25} totalEmpty={50} />)
    expect(screen.getByTestId('progress')).toHaveTextContent('50%')
  })

  it('进度条宽度应该与进度匹配', () => {
    render(<Header {...defaultProps} filledCount={30} totalEmpty={100} />)
    const progressFill = document.querySelector('.progress-fill') as HTMLElement
    expect(progressFill.style.width).toBe('30%')
  })
})
