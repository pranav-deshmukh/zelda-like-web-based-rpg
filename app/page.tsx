"use client"

import { useEffect, useRef } from "react";
import { SCENE_KEYS } from '@/components/scenes/scene-keys';

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game:Phaser.Game

    const loadPhaser = async () => {
      const Phaser = (await import("phaser")).default;
      const { PreloadScene } = await import('@/components/scenes/preload-scene');
      const { GameScene } = await import('@/components/scenes/game-scene');

      if (!canvasRef.current) return;

      const gameConfig = {
        type: Phaser.WEBGL,
        pixelArt: true,
        roundPixels: true,
        scale: {
          parent: 'game-container',
          width: 256,
          height: 224,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        },
        backgroundColor: '#000000',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: false,
          },
        },
      };

      game = new Phaser.Game(gameConfig);
      game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
      game.scene.add(SCENE_KEYS.GAME_SCENE, GameScene);
      game.scene.start(SCENE_KEYS.PRELOAD_SCENE);
    };

    loadPhaser();

    return () => {
      if (game) game.destroy(true);
    };
  }, []);

  return (
    <div id="game-container" ref={canvasRef} style={{ width: '100%', height: '100%' }} />
  );
}
