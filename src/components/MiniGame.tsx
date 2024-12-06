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

  const [gameStarted, setGameStarted] = useState(false);

  const notesRef = useRef<Note[]>([
    {time: 600, x: 400, y: 300, radius: 50, state: 'pending'},
    {time: 1100, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 1300, x: 600, y: 400, radius: 60, state: 'pending'},
    {time: 1800, x: 200, y: 200, radius: 40, state: 'pending'},

    {time: 2500, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 3000, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 3200, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 3700, x: 200, y: 200, radius: 40, state: 'pending'},

    {time: 4400, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 4900, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 5100, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 5600, x: 200, y: 200, radius: 40, state: 'pending'},

    {time: 6300, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 6530, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 6760, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 6990, x: 400, y: 300, radius: 50, state: 'pending'},
    {time: 7450, x: 200, y: 200, radius: 40, state: 'pending'},
    {time: 7670, x: 200, y: 200, radius: 40, state: 'pending'}
  ]);

  const scoreRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const mousePosRef = useRef({x: 0, y: 0});

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mousePosRef.current.x = e.clientX - rect.left;
    mousePosRef.current.y = e.clientY - rect.top;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const startGame = useCallback(() => {
    if (gameStarted) return;
    setGameStarted(true);
    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(err => {
        console.error("Impossible de lancer la musique : ", err);
      });
    }
    startTimeRef.current = performance.now();
    requestAnimationFrame(gameLoop);
  }, [gameStarted]);

  const gameLoop = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elapsed = now - (startTimeRef.current ?? 0);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const notes = notesRef.current;
    for (let note of notes) {
      if (note.state === 'pending') {
        if (elapsed >= note.time) {
          let noteElapsed = elapsed - note.time;
          const growTime = 500;
          let innerRadius = (note.radius * (noteElapsed / growTime));
          if (innerRadius > note.radius) innerRadius = note.radius;

          // Cercle principal
          ctx.strokeStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(note.x, note.y, note.radius, 0, 2*Math.PI);
          ctx.stroke();

          // Cercle interne
          ctx.strokeStyle = '#0F0';
          ctx.beginPath();
          ctx.arc(note.x, note.y, innerRadius, 0, 2*Math.PI);
          ctx.stroke();

          // Timing idéal
          let idealTime = note.time + growTime;
          let timeDiff = Math.abs(elapsed - idealTime);

          if (timeDiff < 50) {
            let dx = mousePosRef.current.x - note.x;
            let dy = mousePosRef.current.y - note.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist <= note.radius) {
              // Score selon la précision
              if (timeDiff < 10) {
                scoreRef.current += 100;
                if (perfectSoundRef.current) {
                  perfectSoundRef.current.currentTime = 0;
                  perfectSoundRef.current.play();
                }
              } else {
                scoreRef.current += 50;
                if (greatSoundRef.current) {
                  greatSoundRef.current.currentTime = 0;
                  greatSoundRef.current.play();
                }
              }
              note.state = 'done';
            }
          } else if (noteElapsed > growTime + 100) {
            // Raté
            if (missSoundRef.current) {
              missSoundRef.current.currentTime = 0;
              missSoundRef.current.play();
            }
            note.state = 'done';
          }
        }
      }
    }

    ctx.fillStyle = '#FFF';
    ctx.font = '20px sans-serif';
    ctx.fillText("Score: " + scoreRef.current, 10, 30);

    if (notes.every(n => n.state === 'done')) {
      ctx.fillText("Partie terminée !", 10, 60);
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
      return;
    }

    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    // Nettoyage en cas de démontage du composant
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-black h-full w-full">
      {!gameStarted && (
        <button
          onClick={startGame}
          id="startButton"
          className="m-5 p-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
        >
          Play
        </button>
      )}
      <canvas
        ref={canvasRef}
          id="gameCanvas"
        width={800}
        height={600}
        style={{ background: '#000', display: 'block', margin: '0 auto' }}
      ></canvas>

      <audio ref={bgMusicRef} src="/sounds/captchaMusic.mp3" preload="auto"></audio>
      <audio ref={perfectSoundRef} src="/sounds/hitnormal.wav" preload="auto"></audio>
      <audio ref={greatSoundRef} src="/sounds/hitnormal.wav" preload="auto"></audio>
      <audio ref={missSoundRef} src="/sounds/combobreak.wav" preload="auto"></audio>
    </div>
  );
};
