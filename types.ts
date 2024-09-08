export enum ScaleType {
  Major = 'major',
  NaturalMinor = 'natural_minor',
  HarmonicMinor = 'harmonic_minor',
  MelodicMinor = 'melodic_minor',
  Dorian = 'dorian',
  Phrygian = 'phrygian',
  Lydian = 'lydian',
  Mixolydian = 'mixolydian',
  Locrian = 'locrian',
  WholeTone = 'whole_tone',
  Diminished = 'diminished',
  Chromatic = 'chromatic',
  PentatonicMajor = 'pentatonic_major',
  PentatonicMinor = 'pentatonic_minor',
  Blues = 'blues'
}

export enum Direction {
  Ascending = 'ascending',
  Descending = 'descending'
}

export interface Note {
  pitch: string;
  duration: number;
  volume: number;
  octive?: number;
}

export type Chord = Note[];

export enum ChordType {
  Major = 'major',
  Minor = 'minor',
  Diminished = 'diminished',
  Augmented = 'augmented',
  MajorSeventh = 'major7',
  MinorSeventh = 'minor7',
  DominantSeventh = 'dominant7',
}
