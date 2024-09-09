import { MusicalElement } from './musicalElements';

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
      console.log(`Transposing ${this.pitch} by ${semitones} semitones`);
    }
  }
}