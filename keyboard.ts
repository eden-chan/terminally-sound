// keyboard.ts
import { MusicalStaff } from './musicalStaff';
import { Direction, ScaleType, Note, Chord, ChordType } from './types';
import { AudioPlayer } from './audioPlayer';

export class Keyboard {
  async playNote(note: Note): Promise<void> {
    const frequency = MusicalStaff.noteToFrequency(note.pitch);
    await AudioPlayer.playFrequencies([frequency], note.duration, note.velocity);
  }

  async playChord(chord: Chord): Promise<void> {
    await Promise.all(chord.map(note => this.playNote(note)));
  }

  async playSequence(sequence: (Note | Chord)[]): Promise<void> {
    for (const item of sequence) {
      if (Array.isArray(item)) {
        await this.playChord(item);
      } else {
        await this.playNote(item);
      }
    }
  }

  getScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): Note[] {
    return MusicalStaff.generateScale(startNote, scaleType, direction);
  }

  getChord(rootNote: string, chordType: ChordType): Chord {
    return MusicalStaff.generateChord(rootNote, chordType);
  }
}