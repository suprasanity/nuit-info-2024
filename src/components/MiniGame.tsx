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

  const initialNotes: Note[] = [
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
  ];

  const notesRef = useRef<Note[]>(initialNotes);
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
        console.error("Unable to start music: ", err);
      });
    }
    startTimeRef.current = performance.now();
    requestAnimationFrame(gameLoop);
  }, [gameStarted]);

  // Helper functions:

  const drawNote = (ctx: CanvasRenderingContext2D, note: Note, innerRadius: number) => {
    // Outer circle
    ctx.strokeStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(note.x, note.y, note.radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Inner circle
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
    const growTime = 500;
    const noteElapsed = elapsed - note.time;
    if (noteElapsed < 0) return; // Not time to show note yet

    const idealTime = note.time + growTime;
    const timeDiff = Math.abs(elapsed - idealTime);

    // If it's well past the ideal time, it's a miss
    if (noteElapsed > growTime + 100) {
      note.state = 'done';
      markMiss();
      return;
    }

    // If we are in the hitting window
    if (checkHit(note, timeDiff)) {
      awardScore(timeDiff);
      note.state = 'done';
    }
  };

  const renderNotes = (ctx: CanvasRenderingContext2D, elapsed: number) => {
    const growTime = 500;
    for (let note of notesRef.current) {
      if (note.state !== 'pending') continue;

      const noteElapsed = elapsed - note.time;
      if (noteElapsed < 0) continue; // Not visible yet

      const innerRadius = calculateInnerRadius(note.radius, noteElapsed, growTime);
      drawNote(ctx, note, innerRadius);
      updateNoteState(note, elapsed);
    }
  };

  const allNotesDone = () => notesRef.current.every(n => n.state === 'done');

  const endGame = (ctx: CanvasRenderingContext2D) => {
    ctx.fillText("Partie terminée !", 10, 60);
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
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

      <audio ref={bgMusicRef} src="/sounds/captchaMusic.mp3" preload="auto" controls>
        <track kind="captions" src="/captions_en.vtt" srclang="en" label="English" default />
        Your browser does not support the audio element.
      </audio>

      <audio ref={perfectSoundRef} src="/sounds/hitnormal.wav" preload="auto" controls>
        <track kind="captions" src="/captions_en.vtt" srclang="en" label="English" default />
        Your browser does not support the audio element.
      </audio>

      <audio ref={greatSoundRef} src="/sounds/hitnormal.wav" preload="auto" controls>
        <track kind="captions" src="/captions_en.vtt" srclang="en" label="English" default />
        Your browser does not support the audio element.
      </audio>

      <audio ref={missSoundRef} src="/sounds/combobreak.wav" preload="auto" controls>
        <track kind="captions" src="/captions_en.vtt" srclang="en" label="English" default />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
