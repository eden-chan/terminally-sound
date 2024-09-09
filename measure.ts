import { MusicalElement } from './musicalElements';
import { NoteEvent } from './noteEvent';
import { TimeSignature } from './timeSignature';

export class Measure extends MusicalElement {
  constructor(public timeSignature: TimeSignature, public events: NoteEvent[]) {
    super();
  }

  addEvent(event: NoteEvent): void {
    this.events.push(event);
  }

  getDuration(): number {
    return this.events.reduce((total, event) => total + event.getDuration(), 0);
  }

  transpose(semitones: number): void {
    this.events.forEach(event => event.transpose(semitones));
  }
}