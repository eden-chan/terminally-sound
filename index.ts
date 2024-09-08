// index.ts

import { Keyboard } from './keyboard';
import { ScaleType, Direction, ChordType } from './types';
import { Score, Phrase, Measure, NoteEvent, TimeSignature, Tempo, ChordProgression, ChordPlayStyle, RhythmPattern } from './structures';

const keyboard = new Keyboard();

async function createAndPlayScalePhrase(startNote: string, scaleType: ScaleType, direction: Direction, rhythm?: number[], dynamics?: number[]): Promise<Phrase> {
  console.log(`${scaleType} scale starting from ${startNote} ${direction}...`);
  const scale = keyboard.getScale(startNote, scaleType, direction);
  console.log(`Notes: ${scale.map(note => note.pitch).join(', ')}`);

  const noteEvents = scale.map((note, index) => {
    const duration = rhythm ? rhythm[index % rhythm.length] : 0.5;
    const volume = dynamics ? dynamics[index % dynamics.length] : 0.8;
    return new NoteEvent(note.pitch, duration * 1000, volume, false);
  });

  const measure = new Measure(new TimeSignature(4, 4), noteEvents);
  const phrase = new Phrase([measure]);

  await keyboard.playPhrase(phrase);
  return phrase;
}

async function createAndPlayChordPhrase(rootNote: string, chordType: ChordType, duration: number, volume: number): Promise<Phrase> {
  console.log(`${chordType} chord starting from ${rootNote}...`);
  const chord = keyboard.getChord(rootNote, chordType);
  console.log(`Notes: ${chord.map(note => note.pitch).join(', ')}`);

  const noteEvents = chord.map(note => new NoteEvent(note.pitch, duration * 1000, volume, false));
  const measure = new Measure(new TimeSignature(4, 4), noteEvents);
  const phrase = new Phrase([measure]);

  await keyboard.playPhrase(phrase);
  return phrase;
}

async function test_scales(): Promise<Phrase[]> {
  const startNotes = ['C4', 'G4', 'F#4', 'Bb4'];
  const scaleTypes = [ScaleType.Blues, ScaleType.PentatonicMajor, ScaleType.PentatonicMinor];
  
  const swingRhythm = [0.3, 0.2, 0.3, 0.2];
  const crescendo = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  const phrases: Phrase[] = [];

  for (const startNote of startNotes) {
    for (const scaleType of scaleTypes) {
      phrases.push(await createAndPlayScalePhrase(startNote, scaleType, Direction.Ascending, swingRhythm, crescendo));
      phrases.push(await createAndPlayScalePhrase(startNote, scaleType, Direction.Descending));
    }
  }

  return phrases;
}

async function test_chords(): Promise<Phrase[]> {
  const chordProgression: [string, ChordType, number, number][] = [
    ['C4', ChordType.Major, 1, 0.8],
    ['F4', ChordType.Major, 1, 0.7],
    ['G4', ChordType.DominantSeventh, 1, 0.9],
    ['C4', ChordType.Major, 2, 0.8],
  ];

  const phrases: Phrase[] = [];

  for (const [rootNote, chordType, duration, volume] of chordProgression) {
    phrases.push(await createAndPlayChordPhrase(rootNote, chordType, duration, volume));
  }

  return phrases;
}

async function test_chord_progression(): Promise<void> {
  const progression = ChordProgression.fromRomanNumerals(
    'C',
    ['I', 'IV', 'V', 'I'],
    ChordPlayStyle.Arpeggio,
    RhythmPattern.fourFourCommon()
  );

  // Customize the progression
  progression.chords[0].baseVolume = 0.9; // Make the first chord slightly louder
  progression.chords[2].duration = 2; // Make the third chord twice as long

  console.log("Playing chord progression:");
  await keyboard.playChordProgression(progression);
}

async function main() {
    
    //   const scalesPhrases = await test_scales();
    const chordProgressionPhrases = await test_chord_progression();
    const tempo = new Tempo(120); // 120 BPM
    const timeSignature = new TimeSignature(4, 4);
const chordsPhrases = await test_chords();
  const score = new Score(
    "Scales and Chords Practice",
    "AI Composer",
    tempo,
    timeSignature,
    [...chordsPhrases]
  );

  console.log("\nPlaying entire score:");
  await keyboard.playScore(score);
}

main().catch(console.error);