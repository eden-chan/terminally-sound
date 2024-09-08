#!/usr/bin/env bun
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

enum ScaleType {
  Major = 'major',
  NaturalMinor = 'natural_minor',
  HarmonicMinor = 'harmonic_minor',
  MelodicMinor = 'melodic_minor',
  Dorian = 'dorian',
  Phrygian = 'phrygian',
  Lydian = 'lydian',
  Mixolydian = 'mixolydian',
  Locrian = 'locrian',
  WholeTone = 'whole_tone',
  Diminished = 'diminished',
  Chromatic = 'chromatic',
  PentatonicMajor = 'pentatonic_major',
  PentatonicMinor = 'pentatonic_minor',
  Blues = 'blues'
}

enum Direction {
  Ascending = 'ascending',
  Descending = 'descending'
}

class MusicalStaff {
  private static readonly NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  private static readonly SCALE_INTERVALS: { [key in ScaleType]: number[] } = {
    [ScaleType.Major]: [2, 2, 1, 2, 2, 2, 1],
    [ScaleType.NaturalMinor]: [2, 1, 2, 2, 1, 2, 2],
    [ScaleType.HarmonicMinor]: [2, 1, 2, 2, 1, 3, 1],
    [ScaleType.MelodicMinor]: [2, 1, 2, 2, 2, 2, 1],
    [ScaleType.Dorian]: [2, 1, 2, 2, 2, 1, 2],
    [ScaleType.Phrygian]: [1, 2, 2, 2, 1, 2, 2],
    [ScaleType.Lydian]: [2, 2, 2, 1, 2, 2, 1],
    [ScaleType.Mixolydian]: [2, 2, 1, 2, 2, 1, 2],
    [ScaleType.Locrian]: [1, 2, 2, 1, 2, 2, 2],
    [ScaleType.WholeTone]: [2, 2, 2, 2, 2, 2],
    [ScaleType.Diminished]: [2, 1, 2, 1, 2, 1, 2, 1],
    [ScaleType.Chromatic]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [ScaleType.PentatonicMajor]: [2, 2, 3, 2, 3],
    [ScaleType.PentatonicMinor]: [3, 2, 2, 3, 2],
    [ScaleType.Blues]: [3, 2, 1, 1, 3, 2]
  };

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
    const scaleIntervals = MusicalStaff.SCALE_INTERVALS[scaleType];
    
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
 private async playFrequencies(frequencies: number[], duration = 0.5): Promise<void> {
    const fadeDuration = 0.05; // 50 milliseconds fade-out
    const totalDuration = duration + fadeDuration;
    const command = `ffplay -f lavfi -i "sine=frequency=${frequencies.join('+')}:duration=${totalDuration},afade=t=out:st=${duration}:d=${fadeDuration}" -autoexit -nodisp -loglevel quiet`;
    try {
      await execAsync(command);
    } catch (error) {
      console.error(`Error playing frequencies ${frequencies.join(', ')}:`, error);
    }
  }

  async playNote(noteSymbol: string, duration = 0.5): Promise<void> {
    const frequency = MusicalStaff.noteToFrequency(noteSymbol);
    await this.playFrequencies([frequency], duration);
  }

  async playSequence(sequence: string[], durations?: number[]): Promise<void> {
    for (let i = 0; i < sequence.length; i++) {
      const note = sequence[i];
      const duration = durations && durations[i] !== undefined ? durations[i] : 0.5;
      await this.playNote(note, duration);
    }
  }

  getScale(startNote: string, scaleType: ScaleType = ScaleType.Major, direction: Direction = Direction.Ascending): string[] {
    return MusicalStaff.generateScale(startNote, scaleType, direction);
  }
}

const keyboard = new Keyboard();


// Function to play and log a scale
async function playAndLogScale(startNote: string, scaleType: ScaleType, direction: Direction) {
  console.log(`Playing ${scaleType} scale starting from ${startNote} ${direction}...`);
  const scale = keyboard.getScale(startNote, scaleType, direction);
  console.log(`Notes: ${scale.join(', ')}`);
  await keyboard.playSequence(scale);
}

// Play various scales
const scaleTypes = Object.values(ScaleType);
const startNotes = ['C4', 'G4', 'F#4', 'Bb4'];

// blues major minor
for (const startNote of startNotes) {
  for (const scaleType of [ScaleType.Blues, ScaleType.PentatonicMajor, ScaleType.PentatonicMinor]) {
    await playAndLogScale(startNote, scaleType as ScaleType, Direction.Ascending);
    await playAndLogScale(startNote, scaleType as ScaleType, Direction.Descending);
  }
}

export { Keyboard, MusicalStaff, ScaleType, Direction };