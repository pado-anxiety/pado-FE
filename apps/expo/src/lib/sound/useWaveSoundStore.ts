import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import { create } from 'zustand';

interface WaveState {
  player: AudioPlayer | null;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

const waveSource = require('../../../assets/audio/ocean.mp3');

let singletonPlayer: AudioPlayer | null = null;

function getPlayer(): AudioPlayer {
  if (!singletonPlayer) {
    singletonPlayer = createAudioPlayer(waveSource);
    singletonPlayer.loop = true;
  }
  return singletonPlayer;
}

export const useWaveSoundStore = create<WaveState>((set) => ({
  player: null,
  isPlaying: false,

  play: () => {
    const player = getPlayer();
    player.play();
    set({ player, isPlaying: true });
  },

  pause: () => {
    const player = getPlayer();
    player.pause();
    set({ isPlaying: false });
  },

  toggle: () => {
    const player = getPlayer();
    if (player.playing) {
      player.pause();
      set({ isPlaying: false });
    } else {
      player.play();
      set({ player, isPlaying: true });
    }
  },
}));
