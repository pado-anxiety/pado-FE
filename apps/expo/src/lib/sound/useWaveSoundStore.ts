import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import { create } from 'zustand';

interface WaveState {
  player: AudioPlayer;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

const waveSource = require('../../../assets/audio/ocean.mp3');
const singletonPlayer = createAudioPlayer(waveSource);

singletonPlayer.loop = true;

export const useWaveSoundStore = create<WaveState>((set) => ({
  player: singletonPlayer,
  isPlaying: false,

  play: () => {
    singletonPlayer.play();
    set({ isPlaying: true });
  },

  pause: () => {
    singletonPlayer.pause();
    set({ isPlaying: false });
  },

  toggle: () => {
    if (singletonPlayer.playing) {
      singletonPlayer.pause();
      set({ isPlaying: false });
    } else {
      singletonPlayer.play();
      set({ isPlaying: true });
    }
  },
}));
