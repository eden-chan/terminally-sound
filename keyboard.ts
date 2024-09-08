#!/usr/bin/env bun

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class MusicalStaff {
  private static readonly NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  static parseNote(noteSymbol: string): { note: string; octave: number } {
    const match = noteSymbol.match(/^([A-G]#?)(\d+)$/);
    if (!match) throw new Error(`Invalid note symbol: ${noteSymbol}`);
    const [, note, octaveStr] = match;
    return { note, octave: parseInt(octaveStr) };
  }

  static noteToFrequency(noteSymbol: string): number {
    const { note, octave } = MusicalStaff.parseNote(noteSymbol);
    const baseFrequency = 440; // A4
    const noteIndex = MusicalStaff.NOTES.indexOf(note);
    const a4Index = MusicalStaff.NOTES.indexOf('A');
    const octaveDiff = octave - 4;
    const semitones = noteIndex - a4Index + octaveDiff * 12;
    return baseFrequency * Math.pow(2, semitones / 12);
  }

  static generateScale(startNote: string, scaleType: 'major' | 'minor' = 'major'): string[] {
    const { note, octave } = MusicalStaff.parseNote(startNote);
    const startIndex = MusicalStaff.NOTES.indexOf(note);
    const scaleIntervals = scaleType === 'major' ? [2, 2, 1, 2, 2, 2, 1] : [2, 1, 2, 2, 1, 2, 2];
    
    return scaleIntervals.reduce((scale, interval) => {
      const prevNote = scale[scale.length - 1];
      const { note: prevNoteName, octave: prevOctave } = MusicalStaff.parseNote(prevNote);
      const prevIndex = MusicalStaff.NOTES.indexOf(prevNoteName);
      const newIndex = (prevIndex + interval) % 12;
      const newOctave = prevOctave + (prevIndex + interval >= 12 ? 1 : 0);
      const newNote = `${MusicalStaff.NOTES[newIndex]}${newOctave}`;
      scale.push(newNote);
      return scale;
    }, [startNote]);
  }

  static getChordNotes(rootNote: string, chordType: string): string[] {
    const { note: rootNoteName, octave } = MusicalStaff.parseNote(rootNote);
    const rootIndex = MusicalStaff.NOTES.indexOf(rootNoteName);
    
    const chordIntervals: { [key: string]: number[] } = {
      'major': [0, 4, 7],
      'minor': [0, 3, 7],
      'diminished': [0, 3, 6],
      'augmented': [0, 4, 8],
      'sus2': [0, 2, 7],
      'sus4': [0, 5, 7],
      '7': [0, 4, 7, 10],
      'maj7': [0, 4, 7, 11],
      'm7': [0, 3, 7, 10],
      'dim7': [0, 3, 6, 9],
    };

    if (!(chordType in chordIntervals)) {
      throw new Error(`Unsupported chord type: ${chordType}`);
    }

    return chordIntervals[chordType].map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      const noteOctave = octave + Math.floor((rootIndex + interval) / 12);
      return `${MusicalStaff.NOTES[noteIndex]}${noteOctave}`;
    });
  }
}

class Keyboard {
  private async playFrequencies(frequencies: number[], duration = 0.7): Promise<void> {
    const command = `ffplay -f lavfi -i "sine=frequency=${frequencies.join('+')}:duration=${duration}" -autoexit -nodisp -loglevel quiet`;
    try {
      await execAsync(command);
    } catch (error) {
      console.error(`Error playing frequencies ${frequencies.join(', ')}:`, error);
    }
  }

  async playNote(noteSymbol: string, duration = 0.7): Promise<void> {
    const frequency = MusicalStaff.noteToFrequency(noteSymbol);
    await this.playFrequencies([frequency], duration);
  }

  async playSequence(sequence: string[], durations?: number[]): Promise<void> {
    for (let i = 0; i < sequence.length; i++) {
      const note = sequence[i];
      const duration = durations && durations[i] !== undefined ? durations[i] : 0.7;
      await this.playNote(note, duration);
    }
  }

  async playChord(rootNote: string, chordType: string, duration = 0.7): Promise<void> {
    const chordNotes = MusicalStaff.getChordNotes(rootNote, chordType);
    const frequencies = chordNotes.map(MusicalStaff.noteToFrequency);
    await this.playFrequencies(frequencies, duration);
  }

  getScale(startNote: string, scaleType: 'major' | 'minor' = 'major'): string[] {
    return MusicalStaff.generateScale(startNote, scaleType);
  }
}

// Example usage
const keyboard = new Keyboard();

console.log("Welcome to the Improved Bun Musical Keyboard!");
console.log("Example usage:");
console.log("await keyboard.playNote('A4');");
console.log("await keyboard.playSequence(['C4', 'E4', 'G4', 'C5']);");
console.log("await keyboard.playChord('C4', 'major');");
console.log("const cMajorScale = keyboard.getScale('C4', 'major');");

// Play a C major scale
console.log("Playing C major scale...");
await keyboard.playSequence(keyboard.getScale('C4', 'major'));

// Play a simple chord progression
console.log("Playing a I-V-vi-IV chord progression in C major...");
await keyboard.playChord('C4', 'major');
await keyboard.playChord('G4', 'major');
await keyboard.playChord('A4', 'minor');
await keyboard.playChord('F4', 'major');

// Play some extended chords
console.log("Playing some extended chords...");
await keyboard.playChord('D4', '7');
await keyboard.playChord('E4', 'maj7');
await keyboard.playChord('F4', 'm7');
await keyboard.playChord('G4', 'sus4');

// Export the Keyboard and MusicalStaff classes
export { Keyboard, MusicalStaff };