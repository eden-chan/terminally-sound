import { Measure } from './measure';
import { ChordProgression } from './chordProgression';
import { NoteEvent } from './noteEvent';
import { Tempo } from './tempo';

export type PhraseElement = Measure | ChordProgression | NoteEvent[];

export class Phrase {
  private elements: PhraseElement[];
  private tempo: Tempo | null = null;

  constructor(elements: PhraseElement[] = []) {
    this.elements = elements;
  }

  addElement(element: PhraseElement): void {
    this.elements.push(element);
  }

  addMeasure(measure: Measure): void {
    this.addElement(measure);
  }

  addChordProgression(chordProgression: ChordProgression): void {
    this.addElement(chordProgression);
  }

  addMelody(melody: NoteEvent[]): void {
    this.addElement(melody);
  }

  setTempo(tempo: Tempo): void {
    this.tempo = tempo;
  }

  getTempo(): Tempo | null {
    return this.tempo;
  }

  getDuration(): number {
    return this.elements.reduce((total, element) => {
      if (element instanceof Measure) {
        return total + element.getDuration();
      } else if (element instanceof ChordProgression) {
        return total + element.getDuration();
      } else if (Array.isArray(element)) { // NoteEvent[]
        return total + element.reduce((sum, note) => sum + note.duration, 0);
      }
      return total;
    }, 0);
  }

  getElements(): PhraseElement[] {
    return this.elements;
  }

  getAllNotes(): NoteEvent[] {
    let allNotes: NoteEvent[] = [];
    for (const element of this.elements) {
      if (element instanceof Measure) {
        allNotes = allNotes.concat(element.events);
      } else if (element instanceof ChordProgression) {
        allNotes = allNotes.concat(element.getAllNotes());
      } else if (Array.isArray(element)) { // NoteEvent[]
        allNotes = allNotes.concat(element);
      }
    }
    return allNotes;
  }

  transpose(semitones: number): void {
    this.elements.forEach(element => {
      if (element instanceof Measure || element instanceof ChordProgression) {
        element.transpose(semitones);
      } else if (Array.isArray(element)) { // NoteEvent[]
        element.forEach(note => note.transpose(semitones));
      }
    });
  }
}