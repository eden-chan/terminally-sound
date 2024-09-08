// structures.ts

import { MusicalStaff } from './musicalStaff';
import { ChordType, Direction, ScaleType } from './types';

export class Tick {
  constructor(public value: number) {}
}

export class NoteEvent {
  constructor(
    public pitch: string | undefined,
    public duration: number,
    public volume: number,
    public isRest: boolean = false
  ) {}

  static createRest(duration: number): NoteEvent {
    return new NoteEvent(undefined, duration, 0, true);
  }
}

export class TimeSignature {
  constructor(public numerator: number, public denominator: number) {}

  toString(): string {
    return `${this.numerator}/${this.denominator}`;
  }
}

export class Measure {
  constructor(public timeSignature: TimeSignature, public events: NoteEvent[]) {}

  addEvent(event: NoteEvent): void {
    this.events.push(event);
  }

  getDuration(): number {
    return this.events.reduce((total, event) => total + event.duration, 0);
  }
}

export class Phrase {
  constructor(public measures: Measure[]) {}

  addMeasure(measure: Measure): void {
    this.measures.push(measure);
  }

  getDuration(): number {
    return this.measures.reduce((total, measure) => total + measure.getDuration(), 0);
  }
}

export class Tempo {
  constructor(public bpm: number) {}

  static fromBPM(bpm: number): Tempo {
    return new Tempo(bpm);
  }
}

export class Score {
  constructor(
    public title: string,
    public composer: string,
    public tempo: Tempo,
    public timeSignature: TimeSignature,
    public phrases: Phrase[]
  ) {}

  addPhrase(phrase: Phrase): void {
    this.phrases.push(phrase);
  }

  getDuration(): number {
    return this.phrases.reduce((total, phrase) => total + phrase.getDuration(), 0);
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
export class ChordProgression {
  constructor(
    public chords: { root: string; type: ChordType; duration: number; baseVolume: number }[],
    public playStyle: ChordPlayStyle,
    public rhythmPattern: RhythmPattern
  ) {}

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
}

function romanToNumber(roman: string): number {
  const romanValues: { [key: string]: number } = { I: 1, IV: 4, V: 5, vi: 6 };
  return romanValues[roman] || 1;
}
