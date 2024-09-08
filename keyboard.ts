// keyboard.ts
import { MusicalStaff } from './musicalStaff';
import { Direction, ScaleType, Note } from './types';
import { AudioPlayer } from './audioPlayer';

export class Keyboard {
  async playNote(note: Note): Promise<void> {
    const frequency = MusicalStaff.noteToFrequency(note.pitch);
    await AudioPlayer.playFrequencies([frequency], note.duration, note.velocity);
  }

  async playSequence(sequence: Note[]): Promise<void> {
    for (const note of sequence) {
      await this.playNote(note);
    }
  }

  getScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): Note[] {
    return MusicalStaff.generateScale(startNote, scaleType, direction);
  }
}