import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Note {
  time: number;
  x: number;
  y: number;
  radius: number;
  state: 'pending' | 'done';
}

export const MiniGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const perfectSoundRef = useRef<HTMLAudioElement | null>(null);
  const greatSoundRef = useRef<HTMLAudioElement | null>(null);
  const missSoundRef = useRef<HTMLAudioElement | null>(null);
  const noteImageRef = useRef<HTMLImageElement | null>(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameWon, setGameWon] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null); // null => pas de countdown en cours

  useEffect(() => {
    const img = new Image();
    img.src = '/trash.png';
    img.onload = () => {
      noteImageRef.current = img;
    };
  }, []);

  const initialNotes: Note[] = [
    { time: 300,  x: 400, y: 300, radius: 50, state: 'pending' },
    { time: 700,  x: 600, y: 300, radius: 50, state: 'pending' },
    { time: 900,  x: 200, y: 300, radius: 50, state: 'pending' },
    { time: 1400, x: 400, y: 300, radius: 50, state: 'pending' },

    { time: 2100, x: 400, y: 300, radius: 50, state: 'pending' },
    { time: 2600, x: 400, y: 400, radius: 50, state: 'pending' },
    { time: 2800, x: 400, y: 200, radius: 50, state: 'pending' },
    { time: 3300, x: 400, y: 300, radius: 50, state: 'pending' },

    { time: 4000, x: 700, y: 300, radius: 50, state: 'pending' },
    { time: 4400, x: 650, y: 350, radius: 50, state: 'pending' },
    { time: 4600, x: 400, y: 400, radius: 50, state: 'pending' },
    { time: 5100, x: 150, y: 350, radius: 50, state: 'pending' },

    { time: 5800, x: 300, y: 100, radius: 50, state: 'pending' },
    { time: 6030, x: 320, y: 200, radius: 50, state: 'pending' },
    { time: 6260, x: 340, y: 100, radius: 50, state: 'pending' },
    { time: 6500, x: 360, y: 200, radius: 50, state: 'pending' },
    { time: 6900, x: 400, y: 100, radius: 50, state: 'pending' },
    { time: 7100, x: 400, y: 100, radius: 50, state: 'pending' }
  ];

  const notesRef = useRef<Note[]>([...initialNotes]);
  const scoreRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const mousePosRef = useRef({x: 0, y: 0});

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const internalWidth = canvas.width;
    const internalHeight = canvas.height;

    const displayWidth = rect.width;
    const displayHeight = rect.height;

    const scaleX = internalWidth / displayWidth;
    const scaleY = internalHeight / displayHeight;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    mousePosRef.current.x = x;
    mousePosRef.current.y = y;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousemove', handleMouseMove);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // Effet pour gérer le compte à rebours
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Quand le compte à rebours atteint 0, on démarre le jeu
      startRealGame();
      setCountdown(null); // On remet à null pour indiquer que le compte à rebours est fini
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [countdown]);

  const resetGame = useCallback(() => {
    notesRef.current = initialNotes.map(note => ({...note, state: 'pending'}));
    scoreRef.current = 0;
    setGameEnded(false);
    setGameWon(null);
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  }, [initialNotes]);

  // Fonction qui démarre réellement le jeu, après le countdown
  const startRealGame = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(err => {
        console.error("Unable to start music: ", err);
      });
    }
    startTimeRef.current = performance.now();
    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, []);

  // Fonction appelée quand on clique sur Play / Replay
  // Au lieu de démarrer la musique directement, on lance un compte à rebours.
  const startGameWithCountdown = useCallback(() => {
    setCountdown(3); // 3 secondes de compte à rebours
  }, []);

  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  const drawNote = (ctx: CanvasRenderingContext2D, note: Note, innerRadius: number) => {
    const img = noteImageRef.current;
    if (!img) return;

    const diameter = note.radius * 2;
    ctx.drawImage(img, note.x - note.radius, note.y - note.radius, diameter, diameter);

    ctx.strokeStyle = '#0F0';
    ctx.beginPath();
    ctx.arc(note.x, note.y, innerRadius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const playSound = (soundRef: React.RefObject<HTMLAudioElement>) => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(err => console.error("Sound error:", err));
    }
  };

  const calculateInnerRadius = (radius: number, noteElapsed: number, growTime: number) => {
    const calcRadius = radius * (noteElapsed / growTime);
    return calcRadius > radius ? radius : calcRadius;
  };

  const checkHit = (note: Note, timeDiff: number) => {
    const dx = mousePosRef.current.x - note.x;
    const dy = mousePosRef.current.y - note.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= note.radius && timeDiff < 50;
  };

  const awardScore = (timeDiff: number) => {
    if (timeDiff < 10) {
      scoreRef.current += 100;
      playSound(perfectSoundRef);
    } else {
      scoreRef.current += 50;
      playSound(greatSoundRef);
    }
  };

  const markMiss = () => {
    playSound(missSoundRef);
  };

  const updateNoteState = (note: Note, elapsed: number) => {
    const growTime = 700;
    const noteElapsed = elapsed - note.time;
    if (noteElapsed < 0) return;

    const idealTime = note.time + growTime;
    const timeDiff = Math.abs(elapsed - idealTime);

    if (noteElapsed > growTime + 100) {
      note.state = 'done';
      markMiss();
      return;
    }

    if (checkHit(note, timeDiff)) {
      awardScore(timeDiff);
      note.state = 'done';
    }
  };

  const renderNotes = (ctx: CanvasRenderingContext2D, elapsed: number) => {
    const growTime = 700;
    for (let note of notesRef.current) {
      if (note.state !== 'pending') continue;

      const noteElapsed = elapsed - note.time;
      if (noteElapsed < 0) continue;

      const innerRadius = calculateInnerRadius(note.radius, noteElapsed, growTime);
      drawNote(ctx, note, innerRadius);
      updateNoteState(note, elapsed);
    }
  };

  const allNotesDone = () => notesRef.current.every(n => n.state === 'done');

  const endGame = (ctx: CanvasRenderingContext2D) => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
    setGameEnded(true);
    const finalScore = scoreRef.current;
    if (finalScore >= 500) {
      setGameWon(true);
    } else {
      setGameWon(false);
    }
  };

  const gameLoop = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startTime = startTimeRef.current;
    if (startTime == null) return;

    const elapsed = now - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderNotes(ctx, elapsed);

    ctx.fillStyle = '#FFF';
    ctx.font = '20px sans-serif';
    ctx.fillText("Score: " + scoreRef.current, 10, 30);

    if (allNotesDone()) {
      endGame(ctx);
      return;
    }

    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const handlePlayClick = () => {
    if (!gameStarted) {
      setGameStarted(true);
      startGameWithCountdown();
    } else {
      resetGame();
      startGameWithCountdown();
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="relative bg-gray-900 text-white rounded shadow-lg p-4 w-full max-w-2xl mx-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-white hover:text-red-500 font-bold"
            >
              X
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Instructions du jeu</h2>
              <p>Déplacez votre souris sur l'image quand le cercle d'approche est à son maximum.</p>
              <p>Un compte à rebours démarrera avant le début du jeu, pour synchroniser la musique avec les cercles.</p>
            </div>

            <div className="mb-4 flex justify-center">
              {!gameStarted && (
                <button
                  onClick={handlePlayClick}
                  id="startButton"
                  className="m-5 p-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                >
                  Play
                </button>
              )}

              {gameStarted && (
                <button
                  onClick={handlePlayClick}
                  className="m-5 p-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                >
                  Replay
                </button>
              )}
            </div>

            <div className="flex flex-col items-center justify-center bg-black">
              <div className="relative w-full max-w-full flex justify-center overflow-hidden" style={{height: '600px'}}>
                <canvas
                  ref={canvasRef}
                  id="gameCanvas"
                  width={800}
                  height={600}
                  className="w-full max-w-full h-auto"
                  style={{
                    backgroundImage: 'url("/background.jpeg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></canvas>

                {countdown !== null && countdown > 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h2 className="text-6xl font-bold">{countdown}</h2>
                  </div>
                )}

                {gameEnded && (
                  <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white px-4">
                    {gameWon ? (
                      <div className="text-center">
                        <h2 className="text-4xl font-bold mb-4">Victoire !</h2>
                        <p className="mb-4">Bravo, vous avez obtenu un score de {scoreRef.current} !</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h2 className="text-4xl font-bold mb-4">Défaite</h2>
                        <p className="mb-4">Votre score est de {scoreRef.current}, réessayez !</p>
                      </div>
                    )}
                    <button
                      onClick={handlePlayClick}
                      className="mt-5 p-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                    >
                      Rejouer
                    </button>
                  </div>
                )}
              </div>
            </div>

            <audio ref={bgMusicRef} className="hidden" src="/sounds/captchaMusic.mp3" preload="auto" controls>
              <track kind="captions" src="/captions_en.vtt" srcLang="en" label="English" default />
              Your browser does not support the audio element.
            </audio>

            <audio ref={perfectSoundRef} className="hidden" src="/sounds/hitnormal.wav" preload="auto" controls>
              <track kind="captions" src="/captions_en.vtt" srcLang="en" label="English" default />
              Your browser does not support the audio element.
            </audio>

            <audio ref={greatSoundRef} className="hidden" src="/sounds/hitnormal.wav" preload="auto" controls>
              <track kind="captions" src="/captions_en.vtt" srcLang="en" label="English" default />
              Your browser does not support the audio element.
            </audio>

            <audio ref={missSoundRef} className="hidden" src="/sounds/combobreak.wav" preload="auto" controls>
              <track kind="captions" src="/captions_en.vtt" srcLang="en" label="English" default />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}
    </>
  );
};
