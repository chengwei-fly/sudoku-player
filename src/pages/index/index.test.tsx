import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Index } from './index'

describe('主菜单页面', () => {
  it('应该渲染主菜单页面', () => {
    render(<Index />)
    
    expect(screen.getByText('数独玩家')).toBeInTheDocument()
    expect(screen.getByText('选择你的游戏模式开始挑战吧！')).toBeInTheDocument()
  })

  it('应该显示四个游戏模式卡片', () => {
    render(<Index />)
    
    const modeCards = screen.getAllByRole('button')
    expect(modeCards).toHaveLength(4)
  })

  it('应该显示所有游戏模式信息', () => {
    render(<Index />)
    
    expect(screen.getByText('4宫格')).toBeInTheDocument()
    expect(screen.getByText('6宫格')).toBeInTheDocument()
    expect(screen.getByText('9宫格')).toBeInTheDocument()
    expect(screen.getByText('特色图形')).toBeInTheDocument()
    
    expect(screen.getByText('入门模式 · 2×2宫格')).toBeInTheDocument()
    expect(screen.getByText('2×3宫格 · 适合初学者')).toBeInTheDocument()
    expect(screen.getByText('标准数独 · 3×3宫格')).toBeInTheDocument()
    expect(screen.getByText('水果/动物模式 · 趣味挑战')).toBeInTheDocument()
  })

  it('应该正确处理4宫格模式选择', () => {
    render(<Index />)
    
    const fourGridButton = screen.getByText('4宫格')
    fireEvent.click(fourGridButton)
    
    expect(screen.getByText('← 返回主页')).toBeInTheDocument()
  })

  it('应该正确处理6宫格模式选择', () => {
    render(<Index />)
    
    const sixGridButton = screen.getByText('6宫格')
    fireEvent.click(sixGridButton)
    
    expect(screen.getByText('← 返回主页')).toBeInTheDocument()
  })

  it('应该正确处理9宫格模式选择', () => {
    render(<Index />)
    
    const nineGridButton = screen.getByText('9宫格')
    fireEvent.click(nineGridButton)
    
    expect(screen.getByText('← 返回主页')).toBeInTheDocument()
  })

  it('应该正确处理特色图形模式选择', () => {
    render(<Index />)
    
    const symbolButton = screen.getByText('特色图形')
    fireEvent.click(symbolButton)
    
    expect(screen.getByText('← 返回主页')).toBeInTheDocument()
  })

  it('应该从游戏页面返回主页', () => {
    render(<Index />)
    
    const nineGridButton = screen.getByText('9宫格')
    fireEvent.click(nineGridButton)
    
    expect(screen.getByText('← 返回主页')).toBeInTheDocument()
    
    const backButton = screen.getByText('← 返回主页')
    fireEvent.click(backButton)
    
    expect(screen.getByText('数独玩家')).toBeInTheDocument()
    expect(screen.getByText('选择你的游戏模式开始挑战吧！')).toBeInTheDocument()
  })

  it('应该显示难度标签', () => {
    render(<Index />)
    
    const easyBadges = screen.getAllByText('简单')
    expect(easyBadges.length).toBe(4)
    
    const mediumBadges = screen.getAllByText('中等')
    expect(mediumBadges.length).toBe(3)
    
    const hardBadge = screen.getByText('困难')
    expect(hardBadge).toBeInTheDocument()
  })
})