#!/usr/bin/env bun

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class Keyboard {
  private notes: { [key: string]: number };

  constructor() {
    this.notes = this.generateNotes();
  }

  private generateNotes(): { [key: string]: number } {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const notes: { [key: string]: number } = {};
    for (let octave = 0; octave <= 8; octave++) {
      for (let i = 0; i < noteNames.length; i++) {
        if (octave === 0 && i < 9) continue; // Start from A0
        if (octave === 8 && i > 0) break; // End at C8
        const noteName = `${noteNames[i]}${octave}`;
        const frequency = 440 * Math.pow(2, (octave - 4 + (i - 9) / 12));
        notes[noteName] = Math.round(frequency);
      }
    }
    return notes;
  }

  async playNote(noteName: string, duration = 0.7): Promise<void> {
    const frequency = this.notes[noteName];
    if (!frequency) {
      console.error(`Invalid note: ${noteName}`);
      return;
    }
    const command = `ffplay -f lavfi -i "sine=frequency=${frequency}:duration=${duration}" -autoexit -nodisp -loglevel quiet`;
    await execAsync(command);
  }

  async playSequence(sequence: string[], duration = 0.7): Promise<void> {
    for (const note of sequence) {
      await this.playNote(note, duration);
    }
  }

  getAvailableNotes(): string[] {
    return Object.keys(this.notes);
  }
}

// Example usage
const keyboard = new Keyboard();
console.log("Welcome to the Bun Musical Keyboard!");
console.log("Available notes:", keyboard.getAvailableNotes().join(', '));
console.log("Example usage:");
console.log("await keyboard.playNote('A4');");
console.log("await keyboard.playSequence(['C4', 'E4', 'G4', 'C5']);");

keyboard.playSequence(['C4', 'E4', 'G4', 'C5']);

// Export the Keyboard class
export { Keyboard };
