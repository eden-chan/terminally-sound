// musicalStaff.ts
import { ScaleType, Direction, Note } from './types';

export class MusicalStaff {
  private static readonly NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  private static readonly SCALE_INTERVALS: { [key in ScaleType]: number[] } = {
    [ScaleType.Major]: [2, 2, 1, 2, 2, 2, 1],
    [ScaleType.NaturalMinor]: [2, 1, 2, 2, 1, 2, 2],
    [ScaleType.HarmonicMinor]: [2, 1, 2, 2, 1, 3, 1],
    [ScaleType.MelodicMinor]: [2, 1, 2, 2, 2, 2, 1],
    [ScaleType.Dorian]: [2, 1, 2, 2, 2, 1, 2],
    [ScaleType.Phrygian]: [1, 2, 2, 2, 1, 2, 2],
    [ScaleType.Lydian]: [2, 2, 2, 1, 2, 2, 1],
    [ScaleType.Mixolydian]: [2, 2, 1, 2, 2, 1, 2],
    [ScaleType.Locrian]: [1, 2, 2, 1, 2, 2, 2],
    [ScaleType.WholeTone]: [2, 2, 2, 2, 2, 2],
    [ScaleType.Diminished]: [2, 1, 2, 1, 2, 1, 2, 1],
    [ScaleType.Chromatic]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [ScaleType.PentatonicMajor]: [2, 2, 3, 2, 3],
    [ScaleType.PentatonicMinor]: [3, 2, 2, 3, 2],
    [ScaleType.Blues]: [3, 2, 1, 1, 3, 2]
  };

  static parseNote(noteSymbol: string): { note: string; octave: number } {
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

  static generateScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): Note[] {
    const { note, octave } = MusicalStaff.parseNote(startNote);
    const startIndex = MusicalStaff.NOTES.indexOf(note);
    const scaleIntervals = MusicalStaff.SCALE_INTERVALS[scaleType];
    
    if (direction === Direction.Ascending) {
      return scaleIntervals.reduce((scale, interval) => {
        const prevNote = scale[scale.length - 1];
        const { note: prevNoteName, octave: prevOctave } = MusicalStaff.parseNote(prevNote.pitch);
        const prevIndex = MusicalStaff.NOTES.indexOf(prevNoteName);
        const newIndex = (prevIndex + interval) % 12;
        const newOctave = prevOctave + (prevIndex + interval >= 12 ? 1 : 0);
        const newPitch = `${MusicalStaff.NOTES[newIndex]}${newOctave}`;
        scale.push({ pitch: newPitch, duration: 0.5, velocity: 0.8 });
        return scale;
      }, [{ pitch: startNote, duration: 0.5, velocity: 0.8 }]);
    } else {
      // Generate ascending scale first
      const ascendingScale = this.generateScale(startNote, scaleType, Direction.Ascending);
      
      // Reverse the ascending scale and remove the last note to avoid duplication
      const descendingScale = ascendingScale.slice(0, -1).reverse();
      
      // Ensure the scale doesn't go below C0
      return descendingScale.filter(note => {
        const { octave } = MusicalStaff.parseNote(note.pitch);
        return octave >= 0;
      });
    }
  }
}