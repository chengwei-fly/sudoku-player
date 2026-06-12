import React from 'react'
import { Game4x4 } from '../game-4x4'
import { Game6x6 } from '../game-6x6'
import { Game9x9 } from '../game-9x9'
import { GameSymbol } from '../game-symbol'
import './index.css'

type Page = 'home' | '4x4' | '6x6' | '9x9' | 'symbol'

interface GameMode {
  id: Page
  icon: string
  title: string
  description: string
  difficulties: { label: string; class: string }[]
}

const gameModes: GameMode[] = [
  {
    id: '4x4',
    icon: '4',
    title: '4宫格',
    description: '入门模式 · 2×2宫格',
    difficulties: [{ label: '简单', class: 'difficulty-easy' }],
  },
  {
    id: '6x6',
    icon: '6',
    title: '6宫格',
    description: '2×3宫格 · 适合初学者',
    difficulties: [
      { label: '简单', class: 'difficulty-easy' },
      { label: '中等', class: 'difficulty-medium' },
    ],
  },
  {
    id: '9x9',
    icon: '9',
    title: '9宫格',
    description: '标准数独 · 3×3宫格',
    difficulties: [
      { label: '简单', class: 'difficulty-easy' },
      { label: '中等', class: 'difficulty-medium' },
      { label: '困难', class: 'difficulty-hard' },
    ],
  },
  {
    id: 'symbol',
    icon: '✿',
    title: '特色图形',
    description: '水果/动物模式 · 趣味挑战',
    difficulties: [
      { label: '简单', class: 'difficulty-easy' },
      { label: '中等', class: 'difficulty-medium' },
    ],
  },
]

export const Index: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<Page>('home')

  const navigateTo = (page: Page) => {
    setCurrentPage(page)
  }

  if (currentPage !== 'home') {
    const BackButton = () => (
      <button className="back-button" onClick={() => navigateTo('home')}>
        ← 返回主页
      </button>
    )

    switch (currentPage) {
      case '4x4':
        return (
          <div className="page-container">
            <BackButton />
            <Game4x4 />
          </div>
        )
      case '6x6':
        return (
          <div className="page-container">
            <BackButton />
            <Game6x6 />
          </div>
        )
      case '9x9':
        return (
          <div className="page-container">
            <BackButton />
            <Game9x9 />
          </div>
        )
      case 'symbol':
        return (
          <div className="page-container">
            <BackButton />
            <GameSymbol />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">🎮 数独玩家</h1>
        <p className="home-subtitle">选择你的游戏模式开始挑战吧！</p>
      </header>

      <div className="mode-grid">
        {gameModes.map((mode) => (
          <div
            key={mode.id}
            className="mode-card"
            onClick={() => navigateTo(mode.id)}
          >
            <div className="mode-icon-wrapper">
              <span className={`mode-icon${mode.id === 'symbol' ? ' symbol' : ''}`}>
                {mode.icon}
              </span>
            </div>
            <h3 className="mode-title">{mode.title}</h3>
            <p className="mode-desc">{mode.description}</p>
            <div className="mode-difficulty">
              {mode.difficulties.map((diff, index) => (
                <span
                  key={index}
                  className={`difficulty-badge ${diff.class}`}
                >
                  {diff.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}