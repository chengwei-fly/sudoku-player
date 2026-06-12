import { useState, useEffect, useCallback } from 'react';
import { timer } from './utils/timer';
import { audio } from './utils/audio';
import { sudokuGame, Difficulty, GameState } from './utils/sudoku';
import DifficultyModal from './components/DifficultyModal';
import CompleteModal from './components/CompleteModal';
import Game from './components/Game';

type Screen = 'menu' | 'game';

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [time, setTime] = useState(0);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    timer.start(
      (seconds) => setTime(seconds),
      (finalTime) => {
        if (sudokuGame.isComplete()) {
          setShowComplete(true);
        }
      }
    );

    return () => {
      timer.stop();
    };
  }, []);

  useEffect(() => {
    if (screen === 'game') {
      audio.playBGM();
    } else {
      audio.stopBGM();
    }
  }, [screen]);

  const handleStartGame = useCallback((difficulty: Difficulty) => {
    sudokuGame.startNewGame(difficulty);
    setGameState(sudokuGame.getState());
    timer.reset();
    timer.start(
      (seconds) => setTime(seconds),
      () => {}
    );
    setShowDifficulty(false);
    setScreen('game');
    setShowComplete(false);
    setIsPaused(false);
  }, []);

  const handleBackToMenu = useCallback(() => {
    timer.stop();
    setScreen('menu');
    setShowComplete(false);
    setGameState(null);
  }, []);

  const handleRestart = useCallback(() => {
    if (gameState) {
      sudokuGame.startNewGame(gameState.difficulty);
      setGameState(sudokuGame.getState());
      timer.reset();
      timer.start(
        (seconds) => setTime(seconds),
        () => {}
      );
      setShowComplete(false);
      setIsPaused(false);
    }
  }, [gameState]);

  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      timer.resume();
      audio.resumeBGM();
    } else {
      timer.pause();
      audio.pauseBGM();
    }
    setIsPaused(!isPaused);
  }, [isPaused]);

  const handleToggleBgm = useCallback(() => {
    audio.toggleBgm();
    setGameState({ ...sudokuGame.getState() });
  }, []);

  const handleCellSelect = useCallback((row: number, col: number) => {
    sudokuGame.selectCell(row, col);
    setGameState({ ...sudokuGame.getState() });
    audio.playSound('select');
  }, []);

  const handleNumberInput = useCallback((num: number) => {
    const result = sudokuGame.inputNumber(num);
    setGameState({ ...sudokuGame.getState() });

    if (result.success) {
      if (result.isError) {
        audio.playSound('error');
      } else {
        audio.playSound('input');
      }

      if (sudokuGame.isComplete()) {
        timer.stop();
        audio.playSound('success');
        audio.stopBGM();
        setShowComplete(true);
      }
    }
  }, []);

  const handleClear = useCallback(() => {
    sudokuGame.clearCell();
    setGameState({ ...sudokuGame.getState() });
  }, []);

  const handleUndo = useCallback(() => {
    sudokuGame.undo();
    setGameState({ ...sudokuGame.getState() });
  }, []);

  const handleHint = useCallback(() => {
    sudokuGame.hint();
    setGameState({ ...sudokuGame.getState() });
    audio.playSound('input');
  }, []);

  const handleReset = useCallback(() => {
    sudokuGame.reset();
    setGameState({ ...sudokuGame.getState() });
    timer.reset();
    timer.start(
      (seconds) => setTime(seconds),
      () => {}
    );
    setIsPaused(false);
  }, []);

  const handleToggleNote = useCallback((num: number) => {
    sudokuGame.toggleNote(num);
    setGameState({ ...sudokuGame.getState() });
  }, []);

  if (screen === 'menu') {
    return (
      <div className="app">
        <div className="header">
          <h1>数独玩家</h1>
        </div>
        <div className="menu">
          <h2>欢迎来到数独世界</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowDifficulty(true)}
          >
            开始游戏
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => audio.toggleBgm()}
          >
            {audio.isBgmMutedState() ? '开启音乐' : '关闭音乐'}
          </button>
        </div>

        {showDifficulty && (
          <DifficultyModal
            onSelect={handleStartGame}
            onClose={() => setShowDifficulty(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>数独玩家</h1>
        <div className="timer">
          {isPaused ? '|| ' : ''}{timer.formatTime(time)}
        </div>
      </div>

      <Game
        gameState={gameState!}
        time={time}
        isPaused={isPaused}
        onCellSelect={handleCellSelect}
        onNumberInput={handleNumberInput}
        onClear={handleClear}
        onUndo={handleUndo}
        onHint={handleHint}
        onReset={handleReset}
        onTogglePause={handleTogglePause}
        onToggleBgm={handleToggleBgm}
        onToggleNote={handleToggleNote}
        onBackToMenu={handleBackToMenu}
      />

      {showComplete && gameState && (
        <CompleteModal
          time={time}
          accuracy={sudokuGame.getAccuracy()}
          onRestart={handleRestart}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;
