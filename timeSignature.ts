export class TimeSignature {
  constructor(public numerator: number, public denominator: number) {}

  toString(): string {
    return `${this.numerator}/${this.denominator}`;
  }
}