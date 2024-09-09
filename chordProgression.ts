import { MusicalElement } from './musicalElements';
import { ChordType } from './types';
import { RhythmPattern } from './rhythmPattern';
import { MusicalStaff } from './musicalStaff';
import { ScaleType, Direction } from './types';
import { NoteEvent } from './noteEvent';

export enum ChordPlayStyle {
  Solid,
  Broken,
  Rag,
  Arpeggio
}

export class ChordProgression extends MusicalElement {
  constructor(
    public chords: { root: string; type: ChordType; duration: number; baseVolume: number }[],
    public playStyle: ChordPlayStyle,
    public rhythmPattern: RhythmPattern
  ) {
    super();
  }

  static fromRomanNumerals(key: string, numerals: string[], playStyle: ChordPlayStyle, rhythmPattern: RhythmPattern): ChordProgression {
    const chordMap: { [key: string]: ChordType } = {
      // Major chords
      'I': ChordType.Major,
      'IV': ChordType.Major,
      'V': ChordType.Major,
      // Minor chords
      'ii': ChordType.Minor,
      'iii': ChordType.Minor,
      'vi': ChordType.Minor,
      // Diminished chord
      'vii°': ChordType.Diminished,
      // Seventh chords
      'I7': ChordType.MajorSeventh,
      'ii7': ChordType.MinorSeventh,
      'iii7': ChordType.MinorSeventh,
      'IV7': ChordType.MajorSeventh,
      'V7': ChordType.DominantSeventh,
      'vi7': ChordType.MinorSeventh,
      'vii7': ChordType.HalfDiminishedSeventh,
      // Ninth chords
      'I9': ChordType.MajorNinth,
      'ii9': ChordType.MinorNinth,
      'V9': ChordType.DominantNinth,
      // Sixth chords
      'I6': ChordType.Sixth,
      'vi6': ChordType.MinorSixth,
      // Augmented chords
      'I+': ChordType.Augmented,
      'V+': ChordType.AugmentedSeventh,
      // Diminished seventh
      'vii°7': ChordType.DiminishedSeventh,
      // Eleventh and Thirteenth
      'I11': ChordType.Eleventh,
      'V11': ChordType.Eleventh,
      'I13': ChordType.Thirteenth,
      'V13': ChordType.Thirteenth,
    };

    // Add lowercase versions for minor key progressions
    Object.entries(chordMap).forEach(([roman, chordType]) => {
      chordMap[roman.toLowerCase()] = chordType;
    });

    const keyNote = key.charAt(0).toUpperCase() + key.slice(1);
    const scale = MusicalStaff.generateScale(keyNote + '4', ScaleType.Major, Direction.Ascending);

    const chords = numerals.map((numeral) => {
      const rootDegree = romanToNumber(numeral);
      const root = scale[(rootDegree - 1) % 7].pitch;
      return {
        root,
        type: chordMap[numeral] || ChordType.Major, // Default to Major if not found
        duration: 1, // default duration
        baseVolume: 0.8 // default volume
      };
    });

    return new ChordProgression(chords, playStyle, rhythmPattern);
  }

  getDuration(): number {
    return this.chords.reduce((total, chord) => total + chord.duration, 0);
  }

  transpose(semitones: number): void {
    this.chords.forEach(chord => {
      // Implement chord transposition logic here
      console.log(`Transposing chord ${chord.root} by ${semitones} semitones`);
    });
  }

  getAllNotes(): NoteEvent[] {
    // Implement logic to return all notes in the chord progression
    // This is a placeholder and needs to be implemented
    return [];
  }
}

// Helper function to convert roman numeral to number
function romanToNumber(roman: string): number {
  const romanNumerals: { [key: string]: number } = {
    'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6, 'vii': 7,
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7
  };
  // Remove any non-roman numeral characters (like '7', '°', '+') to get the base degree
  const baseDegree = roman.replace(/[^ivxIVX]/g, '');
  return romanNumerals[baseDegree] || 1; // Default to 1 if not found
}