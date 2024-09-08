// keyboard.ts

import { MusicalStaff } from './musicalStaff';
import { Direction, ScaleType, ChordType, Chord, Note } from './types';
import { AudioPlayer } from './audioPlayer';
import { Measure, Phrase, Score, NoteEvent } from './structures';

export class Keyboard {
  async playNoteEvent(noteEvent: NoteEvent): Promise<void> {
    if (!noteEvent.isRest && noteEvent.pitch) {
      const frequency = MusicalStaff.noteToFrequency(noteEvent.pitch);
      await AudioPlayer.playFrequencies([frequency], noteEvent.duration / 1000, noteEvent.velocity);
    } else {
      // For rests, we just wait for the duration
      await new Promise(resolve => setTimeout(resolve, noteEvent.duration));
    }
  }

  async playChord(chord: Chord): Promise<void> {
    const frequencies = chord.map(note => MusicalStaff.noteToFrequency(note.pitch));
    await AudioPlayer.playFrequencies(frequencies, chord[0].duration / 1000, chord[0].velocity);
  }

  async playMeasure(measure: Measure): Promise<void> {
    for (const noteEvent of measure.events) {
      await this.playNoteEvent(noteEvent);
    }
  }

  async playPhrase(phrase: Phrase): Promise<void> {
    for (const measure of phrase.measures) {
      await this.playMeasure(measure);
    }
  }

  async playScore(score: Score): Promise<void> {
    console.log(`Playing: ${score.title} by ${score.composer}`);
    console.log(`Tempo: ${score.tempo.bpm} BPM, Time Signature: ${score.timeSignature.toString()}`);
    
    for (const phrase of score.phrases) {
      await this.playPhrase(phrase);
    }
  }

  getScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): Note[] {
    return MusicalStaff.generateScale(startNote, scaleType, direction);
  }

  getChord(rootNote: string, chordType: ChordType): Chord {
    return MusicalStaff.generateChord(rootNote, chordType);
  }

  createMeasureFromNotes(notes: Note[], timeSignature: { numerator: number, denominator: number }): Measure {
    const events = notes.map(note => new NoteEvent(note.pitch, note.duration * 1000, note.velocity, false));
    return new Measure({ numerator: timeSignature.numerator, denominator: timeSignature.denominator }, events);
  }

  createPhraseFromMeasures(measures: Measure[]): Phrase {
    return new Phrase(measures);
  }
}