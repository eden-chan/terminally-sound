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

  static jazzSwing(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.66, volume: 0.8 },
      { duration: 0.34, volume: 0.6 },
      { duration: 0.66, volume: 0.7 },
      { duration: 0.34, volume: 0.5 }
    ], 2);
  }

  static bossaNova(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.5, volume: 0.8 },
      { duration: 0.5, volume: 0.6 },
      { duration: 0.5, volume: 0.7 },
      { duration: 0.5, volume: 0.6 }
    ], 2);
  }

  static samba(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.25, volume: 0.8 },
      { duration: 0.25, volume: 0.6 },
      { duration: 0.25, volume: 0.7 },
      { duration: 0.25, volume: 0.6 },
      { duration: 0.5, volume: 0.75 },
      { duration: 0.5, volume: 0.65 }
    ], 2);
  }

  static fiveEight(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.75, volume: 0.8 },
      { duration: 0.75, volume: 0.7 },
      { duration: 0.5, volume: 0.75 }
    ], 2);
  }

  static sevenEight(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.75, volume: 0.8 },
      { duration: 0.75, volume: 0.7 },
      { duration: 0.75, volume: 0.75 },
      { duration: 0.5, volume: 0.7 }
    ], 2.75);
  }

  static shuffle(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.66, volume: 0.8 },
      { duration: 0.34, volume: 0.6 },
      { duration: 0.66, volume: 0.75 },
      { duration: 0.34, volume: 0.65 }
    ], 2);
  }

  static rumba(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.75, volume: 0.8 },
      { duration: 0.5, volume: 0.7 },
      { duration: 0.75, volume: 0.75 }
    ], 2);
  }

  static tango(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.5, volume: 0.8 },
      { duration: 0.25, volume: 0.7 },
      { duration: 0.25, volume: 0.6 },
      { duration: 0.5, volume: 0.75 },
      { duration: 0.5, volume: 0.7 }
    ], 2);
  }

  static funk(): RhythmPattern {
    return new RhythmPattern([
      { duration: 0.25, volume: 0.8 },
      { duration: 0.25, volume: 0.6 },
      { duration: 0.25, volume: 0.7 },
      { duration: 0.25, volume: 0.65 },
      { duration: 0.5, volume: 0.75 },
      { duration: 0.5, volume: 0.7 }
    ], 2);
  }
}