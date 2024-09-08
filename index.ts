#!/usr/bin/env bun
import { Keyboard } from './keyboard';
import { ScaleType, Direction } from './types';

const keyboard = new Keyboard();

async function playAndLogScale(startNote: string, scaleType: ScaleType, direction: Direction) {
  console.log(`Playing ${scaleType} scale starting from ${startNote} ${direction}...`);
  const scale = keyboard.getScale(startNote, scaleType, direction);
  console.log(`Notes: ${scale.join(', ')}`);
  await keyboard.playSequence(scale);
}

async function main() {
  const startNotes = ['C4', 'G4', 'F#4', 'Bb4'];
  const scaleTypes = [ScaleType.Blues, ScaleType.PentatonicMajor, ScaleType.PentatonicMinor];

  for (const startNote of startNotes) {
    for (const scaleType of scaleTypes) {
      await playAndLogScale(startNote, scaleType, Direction.Ascending);
      await playAndLogScale(startNote, scaleType, Direction.Descending);
    }
  }
}

main().catch(console.error);