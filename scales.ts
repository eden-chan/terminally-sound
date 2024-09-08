import { ScaleType } from './types';

export const SCALE_INTERVALS: { [key in ScaleType]: number[] } = {
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