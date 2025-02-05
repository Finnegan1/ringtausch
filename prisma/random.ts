/**
 * Pseudo-random number generator ( linear congruential generator, see
 * https://en.wikipedia.org/wiki/Linear_congruential_generator ),
 * with a period of 2^31 - 1 and an increment of 0.
 * Use instead of Math.random() to ensure that the same seed
 * always generates the same sequence of random numbers.
 * Feel free to use this code in any way you like ;-)
 */
export default class Random {
  private seed: number;
  private readonly a = 16807;
  private readonly m = 2147483647;

  /**
   * Constructor for the Random class.
   * Every instance will generate the same sequence of random numbers
   * given the same seed.
   * @param seed The seed for the random number generator.
   */
  constructor(seed: number = 1) {
    this.seed = seed > 0 ? seed % this.m : 1;
  }

  /**
   * Genrate a random number between 0 and 1.
   */
  public random(): number {
    this.seed = (this.seed * this.a) % this.m;
    return (this.seed - 1) / (this.m - 1);
  }

  /**
   * Generate a random number in the given range
   * including the min and max values.
   */
  public randIntBetween(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1) + min);
  }

  /**
   * Generate a random choice from the given array.
   */
  public randomChoice<T>(choices: T[]): T {
    return choices[this.randIntBetween(0, choices.length - 1)];
  }
}
