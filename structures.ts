// structures.ts

import { MusicalStaff } from './musicalStaff';
import { ChordType, Direction, ScaleType } from './types';

// Base class for musical elements
abstract class MusicalElement {
  abstract getDuration(): number;
  abstract transpose(semitones: number): void;
}
export class Tick {
  constructor(public value: number) {}
}

export class NoteEvent extends MusicalElement {
  constructor(
    public pitch: string | undefined,
    public duration: number,
    public volume: number,
    public isRest: boolean = false
  ) {
    super();
  }

  static createRest(duration: number): NoteEvent {
    return new NoteEvent(undefined, duration, 0, true);
  }

  getDuration(): number {
    return this.duration;
  }

  transpose(semitones: number): void {
    if (this.pitch) {
      // Implement pitch transposition logic here
      // This is a placeholder and needs to be implemented
      console.log(`Transposing ${this.pitch} by ${semitones} semitones`);
    }
  }
}


export class TimeSignature {
  constructor(public numerator: number, public denominator: number) {}

  toString(): string {
    return `${this.numerator}/${this.denominator}`;
  }
}

export class Measure extends MusicalElement {
  constructor(public timeSignature: TimeSignature, public events: NoteEvent[]) {
    super();
  }

  addEvent(event: NoteEvent): void {
    this.events.push(event);
  }

  getDuration(): number {
    return this.events.reduce((total, event) => total + event.getDuration(), 0);
  }

  transpose(semitones: number): void {
    this.events.forEach(event => event.transpose(semitones));
  }
}


export type PhraseElement = Measure | ChordProgression | NoteEvent[];

export class Phrase {
  private elements: PhraseElement[];
  private tempo: Tempo | null = null;

  constructor(elements: PhraseElement[] = []) {
    this.elements = elements;
  }

  addElement(element: PhraseElement): void {
    this.elements.push(element);
  }

  addMeasure(measure: Measure): void {
    this.addElement(measure);
  }

  addChordProgression(chordProgression: ChordProgression): void {
    this.addElement(chordProgression);
  }

  addMelody(melody: NoteEvent[]): void {
    this.addElement(melody);
  }

  setTempo(tempo: Tempo): void {
    this.tempo = tempo;
  }

  getTempo(): Tempo | null {
    return this.tempo;
  }

  getDuration(): number {
    return this.elements.reduce((total, element) => {
      if (element instanceof Measure) {
        return total + element.getDuration();
      } else if (element instanceof ChordProgression) {
        return total + element.getTotalDuration();
      } else if (Array.isArray(element)) { // NoteEvent[]
        return total + element.reduce((sum, note) => sum + note.duration, 0);
      }
      return total;
    }, 0);
  }

  getElements(): PhraseElement[] {
    return this.elements;
  }

  // Helper method to get all notes in the phrase, including those from chords
  getAllNotes(): NoteEvent[] {
    let allNotes: NoteEvent[] = [];
    for (const element of this.elements) {
      if (element instanceof Measure) {
        allNotes = allNotes.concat(element.events);
      } else if (element instanceof ChordProgression) {
        allNotes = allNotes.concat(element.getAllNotes());
      } else if (Array.isArray(element)) { // NoteEvent[]
        allNotes = allNotes.concat(element);
      }
    }
    return allNotes;
  }

  // Method to transpose the entire phrase
  transpose(semitones: number): void {
  
  }
}
export class Tempo {
  constructor(public bpm: number) {}

  static fromBPM(bpm: number): Tempo {
    return new Tempo(bpm);
  }
}

export class Score extends MusicalElement {
  constructor(
    public title: string,
    public composer: string,
    public tempo: Tempo,
    public timeSignature: TimeSignature,
    public phrases: Phrase[]
  ) {
    super();
  }

  addPhrase(phrase: Phrase): void {
    this.phrases.push(phrase);
  }

  getDuration(): number {
    return this.phrases.reduce((total, phrase) => total + phrase.getDuration(), 0);
  }

  transpose(semitones: number): void {
    this.phrases.forEach(phrase => phrase.transpose(semitones));
  }
}



export enum ChordPlayStyle {
  Solid,
  Broken,
  Rag,
  Arpeggio
}

export class RhythmPattern {
  constructor(public pattern: { duration: number; volume: number }[], public totalDuration: number) {}

  static fourFourCommon(): RhythmPattern {
    return new RhythmPattern([
      { duration: 1, volume: 0.8 },
      { duration: 1, volume: 0.7 },
      { duration: 1, volume: 0.75 },
      { duration: 1, volume: 0.7 }
    ], 4);
  }

  static waltz(): RhythmPattern {
    return new RhythmPattern([
      { duration: 1, volume: 0.8 },
      { duration: 0.5, volume: 0.6 },
      { duration: 0.5, volume: 0.6 }
    ], 2);
  }

  static ragtime(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.5, volume: 0.8 },
      { duration: 0.25, volume: 0.6 },
      { duration: 0.25, volume: 0.7 },
      { duration: 0.5, volume: 0.75 },
      { duration: 0.5, volume: 0.7 }
    ], 2);
  }
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
    // Implementation to convert roman numerals to actual chords
    const chordMap: { [key: string]: ChordType } = {
      'I': ChordType.Major,
      'II': ChordType.Minor,
      'III': ChordType.Minor,
      'IV': ChordType.Major,
      'V': ChordType.Major,
      'VI': ChordType.Minor,
      'VII': ChordType.Diminished,
      'i': ChordType.Minor,
      'ii': ChordType.Minor,
      'iii': ChordType.Minor,
      'iv': ChordType.Minor,
      'v': ChordType.Minor,
      'vi': ChordType.Minor,
      'vii': ChordType.Diminished,
      'I7': ChordType.MajorSeventh,
      'II7': ChordType.MinorSeventh,
      'III7': ChordType.MinorSeventh,
      'IV7': ChordType.MajorSeventh,
      'V7': ChordType.DominantSeventh,
      'VI7': ChordType.MinorSeventh,
      'VII7': ChordType.MinorSeventh,
      'i7': ChordType.MinorSeventh,
      'ii7': ChordType.MinorSeventh,
      'iii7': ChordType.MinorSeventh,
      'iv7': ChordType.MinorSeventh,
      'v7': ChordType.MinorSeventh,
      'vi7': ChordType.MinorSeventh,
      'vii7': ChordType.MinorSeventh,
    };

    const keyNote = key.charAt(0).toUpperCase() + key.slice(1);
    const scale = MusicalStaff.generateScale(keyNote + '4', ScaleType.Major, Direction.Ascending);

    const chords = numerals.map((numeral, index) => {
      const root = scale[romanToNumber(numeral) - 1].pitch;
      return {
        root,
        type: chordMap[numeral] || ChordType.Major,
        duration: 1, // default duration
        baseVolume: 0.8 // default volume
      };
    });

    return new ChordProgression(chords, playStyle, rhythmPattern);
  }

    getTotalDuration(): number {
    return this.chords.reduce((total, chord) => total + chord.duration, 0) * 1000; // Convert to milliseconds
  }

  getDuration(): number {
    return this.chords.reduce((total, chord) => total + chord.duration, 0) * 1000; // Convert to milliseconds
  }

  transpose(semitones: number): void {
    // Implement chord transposition logic here
    // This is a placeholder and needs to be implemented
    console.log(`Transposing chord progression by ${semitones} semitones`);
  }

  getAllNotes(): NoteEvent[] {
    // Implement logic to return all notes in the chord progression
    // This is a placeholder and needs to be implemented
    return [];
  }
}

function romanToNumber(roman: string): number {
  const romanValues: { [key: string]: number } = { I: 1, IV: 4, V: 5, vi: 6 };
  return romanValues[roman] || 1;
}
