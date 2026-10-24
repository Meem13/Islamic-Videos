import React from 'react';
import {Composition} from 'remotion';
import {Story, FPS, SECONDS} from './Story';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Story"
      component={Story}
      durationInFrames={Math.round(SECONDS * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
