import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
// @ts-ignore
import {makeEngine} from './engine.js';

export const FPS = 30;
// Length of the video in seconds (the audio file length). Change this for a longer video.
export const SECONDS = 8;

export const Story: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<any>(null);
  const [mark, setMark] = useState<HTMLImageElement | null>(null);
  const [handle] = useState(() => delayRender('loading fonts and logo'));
  const [started, setStarted] = useState(false);

  // Load fonts and the logo once.
  React.useEffect(() => {
    (async () => {
      const fonts: [string, string][] = [
        ['LoraB', 'Lora-Bold.ttf'],
        ['LoraR', 'Lora-Regular.ttf'],
      ];
      for (const [name, file] of fonts) {
        const f = new FontFace(name, `url(${staticFile(file)})`);
        await f.load();
        (document as any).fonts.add(f);
      }
      const img = new Image();
      img.src = staticFile('mark.png');
      await img.decode();
      setMark(img);
    })();
  }, []);

  // Draw the frame for the current time.
  useLayoutEffect(() => {
    if (!mark || !canvasRef.current) return;
    const g = canvasRef.current.getContext('2d');
    if (!g) return;
    if (!engineRef.current) {
      engineRef.current = makeEngine(g, mark, {}, SECONDS);
    }
    engineRef.current(frame / fps);
    if (!started) {
      setStarted(true);
      continueRender(handle);
    }
  }, [frame, fps, mark, started, handle]);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <canvas ref={canvasRef} width={1920} height={1080} style={{width: 1920, height: 1080}} />
      <Audio src={staticFile('audio.mp3')} />
    </AbsoluteFill>
  );
};
