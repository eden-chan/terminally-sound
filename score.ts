import { MusicalElement } from './musicalElements';
import { Tempo } from './tempo';
import { TimeSignature } from './timeSignature';
import { Phrase } from './phrase';

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