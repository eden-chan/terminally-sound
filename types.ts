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
  note: string;
  octave: number;
}