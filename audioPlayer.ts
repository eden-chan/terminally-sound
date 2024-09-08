// audioPlayer.ts
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export class AudioPlayer {
  static async playFrequencies(frequencies: number[], duration: number, velocity: number): Promise<void> {
    const fadeDuration = 0.05;
    const totalDuration = duration + fadeDuration;
    const volumeDb = Math.log10(velocity) * 20; // Convert linear velocity to decibels
    const command = `ffplay -f lavfi -i "sine=frequency=${frequencies.join('+')}:duration=${totalDuration},afade=t=out:st=${duration}:d=${fadeDuration},volume=${volumeDb}dB" -autoexit -nodisp -loglevel quiet`;
    try {
      await execAsync(command);
    } catch (error) {
      console.error(`Error playing frequencies ${frequencies.join(', ')}:`, error);
    }
  }
}