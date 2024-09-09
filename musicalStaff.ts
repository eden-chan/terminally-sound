// musicalStaff.ts
import { ScaleType, Direction, Note, ChordType, Chord } from './types';

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
        scale.push({ pitch: newPitch, duration: 0.5, volume: 0.8 });
        return scale;
      }, [{ pitch: startNote, duration: 0.5, volume: 0.8 }]);
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
static generateChord(rootNote: string, chordType: ChordType): Chord {
  const { note, octave } = MusicalStaff.parseNote(rootNote);
  const rootIndex = MusicalStaff.NOTES.indexOf(note);
  let intervals: number[];

  switch (chordType) {
    case ChordType.Major:
      intervals = [0, 4, 7];
      break;
    case ChordType.Minor:
      intervals = [0, 3, 7];
      break;
    case ChordType.Diminished:
      intervals = [0, 3, 6];
      break;
    case ChordType.Augmented:
      intervals = [0, 4, 8];
      break;
    case ChordType.MajorSeventh:
      intervals = [0, 4, 7, 11];
      break;
    case ChordType.MinorSeventh:
      intervals = [0, 3, 7, 10];
      break;
    case ChordType.DominantSeventh:
      intervals = [0, 4, 7, 10];
      break;
    case ChordType.Ninth:
      intervals = [0, 4, 7, 10, 14];
      break;
    case ChordType.MajorNinth:
      intervals = [0, 4, 7, 11, 14];
      break;
    case ChordType.MinorNinth:
      intervals = [0, 3, 7, 10, 14];
      break;
    case ChordType.DominantNinth:
      intervals = [0, 4, 7, 10, 14];
      break;
    case ChordType.Sixth:
      intervals = [0, 4, 7, 9];
      break;
    case ChordType.MinorSixth:
      intervals = [0, 3, 7, 9];
      break;
    case ChordType.DiminishedSeventh:
      intervals = [0, 3, 6, 9];
      break;
    case ChordType.HalfDiminishedSeventh:
      intervals = [0, 3, 6, 10];
      break;
    case ChordType.AugmentedSeventh:
      intervals = [0, 4, 8, 10];
      break;
    case ChordType.Eleventh:
      intervals = [0, 4, 7, 10, 14, 17];
      break;
    case ChordType.Thirteenth:
      intervals = [0, 4, 7, 10, 14, 17, 21];
      break;
    default:
      throw new Error(`Unsupported chord type: ${chordType}`);
  }

  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    const noteOctave = octave + Math.floor((rootIndex + interval) / 12);
    return {
      pitch: `${MusicalStaff.NOTES[noteIndex]}${noteOctave}`,
      duration: 0.5,  // Default duration
      volume: 0.8     // Default volume
    };
  });
  }
}