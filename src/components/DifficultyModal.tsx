import { Difficulty } from '../utils/sudoku';

interface Props {
  onSelect: (difficulty: Difficulty) => void;
  onClose: () => void;
}

const difficulties: { level: Difficulty; name: string; emptyCount: number; description: string }[] = [
  { level: 'easy', name: '简单', emptyCount: 35, description: '适合初学者' },
  { level: 'medium', name: '中等', emptyCount: 45, description: '需要一定技巧' },
  { level: 'hard', name: '困难', emptyCount: 55, description: '挑战极限' },
];

function DifficultyModal({ onSelect, onClose }: Props) {
  return (
    <div className="difficulty-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>选择难度</h2>
        {difficulties.map((diff) => (
          <button
            key={diff.level}
            className="difficulty-option"
            onClick={() => onSelect(diff.level)}
          >
            <div>{diff.name}</div>
            <div className="preview">
              预计空格数: {diff.emptyCount} | {diff.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DifficultyModal;
