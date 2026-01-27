// One Euro Filter for smooth head tracking
// Based on the paper: "1€ Filter: A Simple Speed-based Low-pass Filter for Noisy Input in Interactive Systems"

export class OneEuroFilter {
  private minCutoff: number;
  private beta: number;
  private dCutoff: number;
  private xPrev: number | null = null;
  private dxPrev: number = 0;
  private tPrev: number | null = null;

  constructor(minCutoff: number = 1.0, beta: number = 0.007, dCutoff: number = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
  }

  private smoothingFactor(te: number, cutoff: number): number {
    const r = 2 * Math.PI * cutoff * te;
    return r / (r + 1);
  }

  private exponentialSmoothing(a: number, x: number, xPrev: number): number {
    return a * x + (1 - a) * xPrev;
  }

  filter(x: number, timestamp?: number): number {
    const t = timestamp ?? performance.now() / 1000;

    if (this.xPrev === null || this.tPrev === null) {
      this.xPrev = x;
      this.tPrev = t;
      return x;
    }

    const te = t - this.tPrev;
    if (te <= 0) return this.xPrev;

    // Estimate velocity
    const dx = (x - this.xPrev) / te;
    const adx = this.smoothingFactor(te, this.dCutoff);
    const dxHat = this.exponentialSmoothing(adx, dx, this.dxPrev);

    // Compute cutoff
    const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);

    // Filter position
    const ax = this.smoothingFactor(te, cutoff);
    const xHat = this.exponentialSmoothing(ax, x, this.xPrev);

    // Store for next iteration
    this.xPrev = xHat;
    this.dxPrev = dxHat;
    this.tPrev = t;

    return xHat;
  }

  reset(): void {
    this.xPrev = null;
    this.dxPrev = 0;
    this.tPrev = null;
  }
}

export class OneEuroFilter2D {
  private filterX: OneEuroFilter;
  private filterY: OneEuroFilter;

  constructor(minCutoff: number = 1.0, beta: number = 0.007, dCutoff: number = 1.0) {
    this.filterX = new OneEuroFilter(minCutoff, beta, dCutoff);
    this.filterY = new OneEuroFilter(minCutoff, beta, dCutoff);
  }

  filter(x: number, y: number, timestamp?: number): { x: number; y: number } {
    return {
      x: this.filterX.filter(x, timestamp),
      y: this.filterY.filter(y, timestamp),
    };
  }

  reset(): void {
    this.filterX.reset();
    this.filterY.reset();
  }
}
