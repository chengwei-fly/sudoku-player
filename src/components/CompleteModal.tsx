import { timer } from '../utils/timer';

interface Props {
  time: number;
  accuracy: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

function CompleteModal({ time, accuracy, onRestart, onBackToMenu }: Props) {
  return (
    <div className="complete-modal">
      <div className="modal-content">
        <h2>🎉 恭喜通关！</h2>
        <div className="stats">
          <div className="stat-item">
            <span>用时</span>
            <span>{timer.formatTime(time)}</span>
          </div>
          <div className="stat-item">
            <span>正确率</span>
            <span>{accuracy}%</span>
          </div>
        </div>
        <div className="buttons">
          <button className="btn btn-primary" onClick={onRestart}>
            重新开始
          </button>
          <button className="btn btn-secondary" onClick={onBackToMenu}>
            返回菜单
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompleteModal;
