// structures.ts

export class Tick {
  constructor(public value: number) {}
}

export class NoteEvent {
  constructor(
    public pitch: string | undefined,
    public duration: number,
    public velocity: number,
    public isRest: boolean
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