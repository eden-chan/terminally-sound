export class Tempo {
  constructor(public bpm: number) {}

  static fromBPM(bpm: number): Tempo {
    return new Tempo(bpm);
  }
}