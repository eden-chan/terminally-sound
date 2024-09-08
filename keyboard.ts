#!/usr/bin/env bun
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

enum ScaleType {
  Major = 'major',
  Minor = 'minor'
}

enum Direction {
  Ascending = 'ascending',
  Descending = 'descending'
}

class MusicalStaff {
  private static readonly NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  static parseNote(noteSymbol: string): { note: string; octave: number } {
    const match = noteSymbol.match(/^([A-G]#?)(-?\d+)$/);
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

static generateScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): string[] {
    const { note, octave } = MusicalStaff.parseNote(startNote);
    const startIndex = MusicalStaff.NOTES.indexOf(note);
    const scaleIntervals = scaleType === ScaleType.Major ? [2, 2, 1, 2, 2, 2, 1] : [2, 1, 2, 2, 1, 2, 2];
    
    if (direction === Direction.Ascending) {
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
    } else {
      // Generate ascending scale first
      const ascendingScale = this.generateScale(startNote, scaleType, Direction.Ascending);
      
      // Reverse the ascending scale and remove the first and last notes to avoid duplication
      const descendingScale = ascendingScale.slice(0, -1).reverse();
      
      // Ensure the scale doesn't go below C0
      return descendingScale.filter(note => {
        const { octave } = MusicalStaff.parseNote(note);
        return octave >= 0;
      });
    }
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

  getScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): string[] {
    return MusicalStaff.generateScale(startNote, scaleType, direction);
  }
}

// Example usage
const keyboard = new Keyboard();

// Play C major and C minor scales, ascending and descending
console.log("Playing C major ascending scale...");
await keyboard.playSequence(keyboard.getScale('C4', ScaleType.Major, Direction.Ascending));
console.log("Playing C major descending scale...");
await keyboard.playSequence(keyboard.getScale('C4', ScaleType.Major, Direction.Descending));
console.log("Playing C minor ascending scale...");
await keyboard.playSequence(keyboard.getScale('C4', ScaleType.Minor, Direction.Ascending));
console.log("Playing C minor descending scale...");
await keyboard.playSequence(keyboard.getScale('C4', ScaleType.Minor, Direction.Descending));

export { Keyboard, MusicalStaff, ScaleType, Direction };