import { MusicalStaff } from './musicalStaff';
import { Direction, ScaleType } from './types';
import { AudioPlayer } from './audioPlayer';

class Keyboard {
  async playNote(noteSymbol: string, duration = 0.5): Promise<void> {
    const frequency = MusicalStaff.noteToFrequency(noteSymbol);
    await AudioPlayer.playFrequencies([frequency], duration);
  }
  async playSequence(sequence: string[], durations?: number[]): Promise<void> {
    for (let i = 0; i < sequence.length; i++) {
      const note = sequence[i];
      const duration = durations && durations[i] !== undefined ? durations[i] : 0.5;
      await this.playNote(note, duration);
    }
  }
  getScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): string[] {
    return MusicalStaff.generateScale(startNote, scaleType, direction);
  }
}

export { Keyboard, MusicalStaff, ScaleType, Direction };