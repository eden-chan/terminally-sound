export abstract class MusicalElement {
  abstract getDuration(): number;
  abstract transpose(semitones: number): void;
}

export class Tick {
  constructor(public value: number) {}
}