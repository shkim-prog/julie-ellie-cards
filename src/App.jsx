import { useState, useEffect, useCallback } from 'react';
import { Trophy, RotateCcw, Sparkles, Users, Play, Crown, RefreshCw } from 'lucide-react';

const ALPHABET = [
  { letter: 'A', word: 'Apple', emoji: '🍎' },
  { letter: 'B', word: 'Bear', emoji: '🐻' },
  { letter: 'C', word: 'Cat', emoji: '🐱' },
  { letter: 'D', word: 'Dog', emoji: '🐶' },
  { letter: 'E', word: 'Elephant', emoji: '🐘' },
  { letter: 'F', word: 'Fish', emoji: '🐟' },
  { letter: 'G', word: 'Grapes', emoji: '🍇' },
  { letter: 'H', word: 'House', emoji: '🏠' },
  { letter: 'I', word: 'Ice cream', emoji: '🍦' },
  { letter: 'J', word: 'Juice', emoji: '🧃' },
  { letter: 'K', word: 'Kite', emoji: '🪁' },
  { letter: 'L', word: 'Lion', emoji: '🦁' },
  { letter: 'M', word: 'Moon', emoji: '🌙' },
  { letter: 'N', word: 'Nest', emoji: '🪺' },
  { letter: 'O', word: 'Orange', emoji: '🍊' },
  { letter: 'P', word: 'Penguin', emoji: '🐧' },
  { letter: 'Q', word: 'Queen', emoji: '👑' },
  { letter: 'R', word: 'Rabbit', emoji: '🐰' },
  { letter: 'S', word: 'Sun', emoji: '☀️' },
  { letter: 'T', word: 'Tree', emoji: '🌳' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️' },
  { letter: 'V', word: 'Violin', emoji: '🎻' },
  { letter: 'W', word: 'Whale', emoji: '🐳' },
  { letter: 'X', word: 'Xylophone', emoji: '🎼' },
  { letter: 'Y', word: 'Yarn', emoji: '🧶' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓' },
];

const THEMES = [
  { label: '빨강', bg: 'bg-rose-500', text: 'text-rose-600', ring: 'ring-rose-400', soft: 'bg-rose-50', border: 'border-rose-400', grad: 'from-rose-400 to-pink-500' },
  { label: '파랑', bg: 'bg-sky-500', text: 'text-sky-600', ring: 'ring-sky-400', soft: 'bg-sky-50', border: 'border-sky-400', grad: 'from-sky-400 to-blue-500' },
  { label: '초록', bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-400', soft: 'bg-emerald-50', border: 'border-emerald-400', grad: 'from-emerald-400 to-green-500' },
  { label: '노랑', bg: 'bg-amber-500', text: 'text-amber-700', ring: 'ring-amber-400', soft: 'bg-amber-50', border: 'border-amber-400', grad: 'from-amber-400 to-yellow-500' },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildDeck = () => {
  const deck = [];
  ALPHABET.forEach((it) => {
    deck.push({ id: `${it.letter}-1`, ...it });
    deck.push({ id: `${it.letter}-2`, ...it });
  });
  return shuffle(deck);
};

const CardBack = () => (
  <div className="w-full h-full rounded-2xl overflow-hidden">
    <img src="/card-back.png" alt="줄리엘리" className="w-full h-full object-cover" draggable={false} />
  </div>
);

function CardFace({ card, isMatched, theme }) {
  return (
    <div translate="no" className={`w-full h-full rounded-2xl bg-white flex flex-col items-center justify-center border-3 p-1 gap-0.5 ${
      isMatched ? (theme?.border || 'border-gray-300') : 'border-purple-200'
    } ${isMatched ? (theme?.soft || 'bg-gray-50') : 'bg-gradient-to-b from-white to-purple-50'} shadow notranslate`}>
      <div className="text-2xl sm:text-3xl md:text-4xl leading-none drop-shadow-sm">{card.emoji}</div>
      <div className="text-lg sm:text-xl md:text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent leading-none">{card.letter}</div>
      <div className="text-[8px] sm:text-[10px] md:text-xs font-bold text-gray-500 leading-none">{card.word}</div>
    </div>
  );
}

function Card({ card, isFlipped, isMatched, isDisabled, onClick, lastMatchedTheme }) {
  const showFront = isFlipped || isMatched;
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        perspective: '1000px',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
      className={`relative aspect-[3/4] w-full focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-2xl transition-all duration-300 select-none ${
        isMatched ? 'opacity-60' : (isDisabled ? '' : 'hover:scale-105 active:scale-95 cursor-pointer')
      }`}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transform: showFront ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="absolute inset-0 rounded-lg shadow-md overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <CardBack />
        </div>
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <CardFace card={card} isMatched={isMatched} theme={lastMatchedTheme} />
        </div>
      </div>
    </button>
  );
}

function SetupScreen({ onStart }) {
  const [num, setNum] = useState(2);
  const [names, setNames] = useState(['', '', '', '']);

  const updateName = (i, v) => {
    const arr = [...names];
    arr[i] = v;
    setNames(arr);
  };

  const handleStart = () => {
    const finalNames = Array.from({ length: num }, (_, i) => names[i].trim() || `플레이어 ${i + 1}`);
    onStart(num, finalNames);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl mb-3">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            줄리엘리 카드
          </h1>
          <p className="text-gray-600 mt-2 text-sm">알파벳 짝 맞추기 · 26쌍 (52장)</p>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            플레이어 수
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setNum(n)}
                className={`py-3 rounded-xl font-bold transition-all ${
                  num === n
                    ? `bg-gradient-to-br ${THEMES[n - 1].grad} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {n}명
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            플레이어 이름 <span className="text-gray-400 text-xs font-normal">(선택)</span>
          </label>
          {Array.from({ length: num }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-9 rounded-full bg-gradient-to-b ${THEMES[i].grad} flex-shrink-0`} />
              <input
                type="text"
                placeholder={`플레이어 ${i + 1}`}
                value={names[i]}
                onChange={e => updateName(i, e.target.value)}
                maxLength={12}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none text-sm"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          게임 시작
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          새로고침하면 카드가 다시 섞입니다 🔀
        </p>
      </div>
    </div>
  );
}

function GameOver({ scores, names, onRestart, onNewGame }) {
  const maxScore = Math.max(...scores);
  const winners = scores.map((s, i) => ({ s, i })).filter(x => x.s === maxScore);
  const sorted = [...scores.map((s, i) => ({ score: s, idx: i, name: names[i] }))].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl mb-3 animate-bounce">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">게임 종료!</h1>
          {winners.length === 1 ? (
            <p className="text-lg text-gray-600 mt-2">
              <Crown className="inline w-5 h-5 text-yellow-500 mr-1" />
              <span className={`font-bold ${THEMES[winners[0].i].text}`}>{names[winners[0].i]}</span> 우승!
            </p>
          ) : (
            <p className="text-lg text-gray-600 mt-2">공동 우승! 🎉</p>
          )}
        </div>

        <div className="space-y-2 mb-6">
          {sorted.map((p, rank) => (
            <div
              key={p.idx}
              className={`flex items-center justify-between p-3 rounded-xl ${
                p.score === maxScore ? `bg-gradient-to-r ${THEMES[p.idx].grad} text-white` : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  p.score === maxScore ? 'bg-white/30' : 'bg-gray-200 text-gray-600'
                }`}>
                  {rank + 1}
                </div>
                <span className={`font-semibold ${p.score === maxScore ? 'text-white' : THEMES[p.idx].text}`}>
                  {p.name}
                </span>
              </div>
              <div className={`font-bold text-lg ${p.score === maxScore ? 'text-white' : 'text-gray-700'}`}>
                {p.score}쌍
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRestart}
            className="py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            한 번 더
          </button>
          <button
            onClick={onNewGame}
            className="py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            새 게임
          </button>
        </div>
      </div>
    </div>
  );
}

function GameScreen({ numPlayers, names, onGameOver, onNewGame }) {
  const PREVIEW_SECONDS = 7;
  const [cards, setCards] = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState({}); // { id: theme_idx }
  const [scores, setScores] = useState(Array(numPlayers).fill(0));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'match' | 'nomatch' | null
  const [lastMatchTheme, setLastMatchTheme] = useState(null);
  const [previewLeft, setPreviewLeft] = useState(PREVIEW_SECONDS);
  const [cols, setCols] = useState(13);

  // iPad 4:3 optimized grid — 52 cards, landscape: 13×4, portrait: 8×7
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const portrait = h > w;
      if (w < 480) setCols(6);
      else if (w < 800) setCols(portrait ? 7 : 9);
      else setCols(portrait ? 8 : 13);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  const isPreview = previewLeft > 0;
  const totalPairs = ALPHABET.length;
  const matchedCount = Object.keys(matched).length / 2;

  // Preview countdown
  useEffect(() => {
    if (previewLeft > 0) {
      const t = setTimeout(() => setPreviewLeft(s => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [previewLeft]);

  // Game over check
  useEffect(() => {
    if (matchedCount === totalPairs && matchedCount > 0) {
      const t = setTimeout(() => onGameOver(scores), 1200);
      return () => clearTimeout(t);
    }
  }, [matchedCount, totalPairs, scores, onGameOver]);

  const handleCardClick = useCallback((cardId) => {
    if (isPreview) return;
    if (busy) return;
    if (matched[cardId] !== undefined) return;
    if (flipped.includes(cardId)) return;
    if (flipped.length >= 2) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setBusy(true);
      const [id1, id2] = newFlipped;
      const c1 = cards.find(c => c.id === id1);
      const c2 = cards.find(c => c.id === id2);

      if (c1.letter === c2.letter) {
        // Match
        setTimeout(() => {
          setMatched(prev => ({ ...prev, [id1]: currentPlayer, [id2]: currentPlayer }));
          setScores(prev => {
            const next = [...prev];
            next[currentPlayer] += 1;
            return next;
          });
          setLastMatchTheme(THEMES[currentPlayer]);
          setFlipped([]);
          setFeedback('match');
          setBusy(false);
          setTimeout(() => setFeedback(null), 900);
        }, 700);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          setFeedback('nomatch');
          setTimeout(() => {
            setCurrentPlayer(prev => (prev + 1) % numPlayers);
            setBusy(false);
            setFeedback(null);
          }, 600);
        }, 1300);
      }
    }
  }, [isPreview, busy, matched, flipped, cards, currentPlayer, numPlayers]);

  const reshuffleAll = () => {
    if (window.confirm('카드를 다시 섞고 게임을 처음부터 시작할까요?')) {
      setCards(buildDeck());
      setFlipped([]);
      setMatched({});
      setScores(Array(numPlayers).fill(0));
      setCurrentPlayer(0);
      setBusy(false);
      setFeedback(null);
      setLastMatchTheme(null);
    }
  };

  const theme = THEMES[currentPlayer];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme.soft}`}>
      <div className="max-w-screen-2xl mx-auto px-2 pt-1 pb-2 sm:px-3 sm:pt-2 sm:pb-3">
        {/* Header — compact */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${theme.grad} shadow`}>
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              줄리엘리 카드
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="text-xs text-gray-600 font-medium">
              {matchedCount}/{totalPairs}
            </div>
            <button
              onClick={reshuffleAll}
              className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
              title="카드 다시 섞기"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <button
              onClick={onNewGame}
              className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700 px-2"
            >
              종료
            </button>
          </div>
        </div>

        {/* Players bar — compact */}
        <div className={`grid gap-1.5 mb-1.5 sm:mb-2`} style={{ gridTemplateColumns: `repeat(${numPlayers}, minmax(0, 1fr))` }}>
          {Array.from({ length: numPlayers }).map((_, i) => {
            const t = THEMES[i];
            const isMe = i === currentPlayer;
            return (
              <div
                key={i}
                className={`relative rounded-lg p-1.5 sm:p-2 transition-all duration-300 ${
                  isMe
                    ? `bg-gradient-to-br ${t.grad} text-white shadow-lg ring-2 ${t.ring} ring-opacity-50`
                    : 'bg-white text-gray-700 shadow'
                }`}
              >
                {isMe && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow whitespace-nowrap">
                    🎯 내 차례
                  </div>
                )}
                <div className="flex items-center justify-between gap-1">
                  <div className="font-bold text-[10px] sm:text-xs truncate">{names[i]}</div>
                  <div className={`text-sm sm:text-base font-black ${isMe ? 'text-white' : t.text}`}>
                    {scores[i]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status banner — fixed height so layout never shifts */}
        <div className="h-6 sm:h-7 mb-1 flex items-center justify-center">
          {isPreview ? (
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-4 py-0.5 flex items-center gap-2 shadow-lg animate-pulse">
              <span className="text-xs sm:text-sm font-bold">카드를 외우세요!</span>
              <span className="text-base sm:text-lg font-black tabular-nums">{previewLeft}</span>
            </div>
          ) : feedback === 'match' ? (
            <div className={`px-4 py-0.5 rounded-full bg-gradient-to-r ${theme.grad} text-white font-bold text-xs sm:text-sm shadow animate-pulse`}>
              🎉 짝! 한 번 더!
            </div>
          ) : feedback === 'nomatch' ? (
            <div className="px-4 py-0.5 rounded-full bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm shadow">
              💨 다음 차례...
            </div>
          ) : null}
        </div>

        {/* Cards grid */}
        <div
          className="grid gap-1 sm:gap-1.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {cards.map(card => (
            <Card
              key={card.id}
              card={card}
              isFlipped={isPreview || flipped.includes(card.id)}
              isMatched={matched[card.id] !== undefined}
              isDisabled={isPreview || busy || flipped.includes(card.id) || matched[card.id] !== undefined}
              onClick={() => handleCardClick(card.id)}
              lastMatchedTheme={matched[card.id] !== undefined ? THEMES[matched[card.id]] : null}
            />
          ))}
        </div>

        <div className="text-center text-[9px] sm:text-[10px] text-gray-400 mt-1">
          짝 맞추면 <span className="font-bold">한 번 더</span> · 틀리면 <span className="font-bold">다음 사람</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState('setup'); // setup | playing | gameover
  const [numPlayers, setNumPlayers] = useState(2);
  const [names, setNames] = useState(['플레이어 1', '플레이어 2']);
  const [finalScores, setFinalScores] = useState([]);
  const [gameKey, setGameKey] = useState(0); // re-mount GameScreen on restart

  const handleStart = (n, ns) => {
    setNumPlayers(n);
    setNames(ns);
    setGameKey(k => k + 1);
    setPhase('playing');
  };

  const handleGameOver = (scores) => {
    setFinalScores(scores);
    setPhase('gameover');
  };

  const handleRestart = () => {
    setGameKey(k => k + 1);
    setPhase('playing');
  };

  const handleNewGame = () => {
    setPhase('setup');
  };

  if (phase === 'setup') return <SetupScreen onStart={handleStart} />;
  if (phase === 'gameover') return (
    <GameOver
      scores={finalScores}
      names={names}
      onRestart={handleRestart}
      onNewGame={handleNewGame}
    />
  );
  return (
    <GameScreen
      key={gameKey}
      numPlayers={numPlayers}
      names={names}
      onGameOver={handleGameOver}
      onNewGame={handleNewGame}
    />
  );
}
