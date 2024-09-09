// keyboard.ts

import { MusicalStaff } from './musicalStaff';
import { Direction, ScaleType, ChordType, Chord, Note } from './types';
import { AudioPlayer } from './audioPlayer';
import { Measure, Phrase, Score, NoteEvent, ChordProgression, ChordPlayStyle } from './structures';

export class Keyboard {
  async playNoteEvent(noteEvent: NoteEvent): Promise<void> {
    if (!noteEvent.isRest && noteEvent.pitch) {
      const frequency = MusicalStaff.noteToFrequency(noteEvent.pitch);
      console.log(`${noteEvent.pitch}: ${frequency}Hz`);
      await AudioPlayer.playFrequencies([frequency], noteEvent.duration / 1000, noteEvent.volume);
    } else {
      // For rests, we just wait for the duration
      await new Promise(resolve => setTimeout(resolve, noteEvent.duration));
    }
  }

  async playChord(chord: Chord): Promise<void> {
    console.group('Chord');
    await Promise.all(chord.map(note => {
      console.log(`${note.pitch}, Duration: ${note.duration}, Volume: ${note.volume}`);
      return this.playNoteEvent(new NoteEvent(note.pitch, note.duration, note.volume, false));
    }));
    console.groupEnd();
  }

  async playMeasure(measure: Measure): Promise<void> {
    console.group('Measure');
    for (const noteEvent of measure.events) {
      await this.playNoteEvent(noteEvent);
    }
    console.groupEnd();
  }

  async playPhrase(phrase: Phrase): Promise<void> {
    console.group('Playing Phrase');
    for (const element of phrase.getElements()) {
      if (element instanceof Measure) {
        await this.playMeasure(element);
      } else if (element instanceof ChordProgression) {
        await this.playChordProgression(element);
      }
    }
    console.groupEnd();
  }

  async playScore(score: Score): Promise<void> {
    console.group('Playing Score');
    console.log(`${score.title} by ${score.composer}`);
    console.log(`Tempo: ${score.tempo.bpm} BPM, Time Signature: ${score.timeSignature.toString()}`);
    
    for (const phrase of score.phrases) {
      await this.playPhrase(phrase);
    }
    console.groupEnd();
  }

  async playChordProgression(progression: ChordProgression): Promise<void> {
    for (const chordInfo of progression.chords) {
      const chord = this.getChord(chordInfo.root, chordInfo.type);
      const chordDuration = chordInfo.duration * 1000; // convert to milliseconds
      
      switch (progression.playStyle) {
        case ChordPlayStyle.Solid:
          await this.playChord(chord.map(note => ({
            ...note,
            duration: chordDuration,
            volume: chordInfo.baseVolume * progression.rhythmPattern.pattern[0].volume
          })));
          break;
        case ChordPlayStyle.Broken:
          for (let i = 0; i < chord.length; i++) {
            const patternIndex = i % progression.rhythmPattern.pattern.length;
            await this.playNoteEvent(new NoteEvent(
              chord[i].pitch,
              (chordDuration / chord.length) * progression.rhythmPattern.pattern[patternIndex].duration,
              chordInfo.baseVolume * progression.rhythmPattern.pattern[patternIndex].volume,
              false
            ));
          }
          break;
        case ChordPlayStyle.Rag:
          const bassNote = {
            ...chord[0],
            duration: chordDuration / 2,
            volume: chordInfo.baseVolume * progression.rhythmPattern.pattern[0].volume,
            isRest:false
          };
          await this.playNoteEvent(new NoteEvent(
            bassNote.pitch,
            bassNote.duration,
            bassNote.volume,
            false
          ));
          await this.playChord(chord.slice(1).map(note => ({
            ...note,
            duration: chordDuration / 2,
            volume: chordInfo.baseVolume * progression.rhythmPattern.pattern[1].volume,
            isRest:false
          })));
          break;
        case ChordPlayStyle.Arpeggio:
          for (let i = 0; i < progression.rhythmPattern.pattern.length; i++) {
            const noteIndex = i % chord.length;
            const patternNote = progression.rhythmPattern.pattern[i];
            const noteDuration = patternNote.duration * (chordDuration / progression.rhythmPattern.totalDuration);
            await this.playNoteEvent(new NoteEvent(
              chord[noteIndex].pitch,
              noteDuration,
              chordInfo.baseVolume * patternNote.volume,
              false
            ));
          }
          break;
      }
    }
  }

  getScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): Note[] {
    return MusicalStaff.generateScale(startNote, scaleType, direction);
  }

  getChord(rootNote: string, chordType: ChordType): Chord {
    return MusicalStaff.generateChord(rootNote, chordType);
  }

  createMeasureFromNotes(notes: Note[], timeSignature: { numerator: number, denominator: number }): Measure {
    const events = notes.map(note => new NoteEvent(note.pitch, note.duration * 1000, note.volume, false));
    return new Measure({ numerator: timeSignature.numerator, denominator: timeSignature.denominator }, events);
  }

  createPhraseFromMeasures(measures: Measure[]): Phrase {
    return new Phrase(measures);
  }
}