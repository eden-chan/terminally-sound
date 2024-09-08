import { ScaleType, Direction, Note } from './types';
import { SCALE_INTERVALS } from './scales';

export class MusicalStaff {
  private static readonly NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  static parseNote(noteSymbol: string): Note {
    const match = noteSymbol.match(/^([A-G]#?)(-?\d+)$/);
    if (!match) throw new Error(`Invalid note symbol: ${noteSymbol}`);
    const [, note, octaveStr] = match;
    return { note, octave: parseInt(octaveStr) };
  }

  static noteToFrequency(noteSymbol: string): number {
    const { note, octave } = MusicalStaff.parseNote(noteSymbol);
    const baseFrequency = 440; // A4
    const noteIndex = MusicalStaff.NOTES.indexOf(note);
    const a4Index = MusicalStaff.NOTES.indexOf('A');
    const octaveDiff = octave - 4;
    const semitones = noteIndex - a4Index + octaveDiff * 12;
    return baseFrequency * Math.pow(2, semitones / 12);
  }

  static generateScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): string[] {
    const { note, octave } = MusicalStaff.parseNote(startNote);
    const startIndex = MusicalStaff.NOTES.indexOf(note);
    const scaleIntervals = SCALE_INTERVALS[scaleType];
    
    if (direction === Direction.Ascending) {
      return scaleIntervals.reduce((scale, interval) => {
        const prevNote = scale[scale.length - 1];
        const { note: prevNoteName, octave: prevOctave } = MusicalStaff.parseNote(prevNote);
        const prevIndex = MusicalStaff.NOTES.indexOf(prevNoteName);
        const newIndex = (prevIndex + interval) % 12;
        const newOctave = prevOctave + (prevIndex + interval >= 12 ? 1 : 0);
        const newNote = `${MusicalStaff.NOTES[newIndex]}${newOctave}`;
        scale.push(newNote);
        return scale;
      }, [startNote]);
    } else {
      const ascendingScale = this.generateScale(startNote, scaleType, Direction.Ascending);
      const descendingScale = ascendingScale.slice(0, -1).reverse();
      return descendingScale.filter(note => {
        const { octave } = MusicalStaff.parseNote(note);
        return octave >= 0;
      });
    }
  }
}