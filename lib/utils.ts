import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class BaseClient {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  _log(message: string) {
    console.log(`[${this.name}]: ${message}`);
  }

  protected _throw(error: any) {
    throw new Error(`[${this.name}]: ${error}`);
  }
}

export class Timer {
  private _start: number;

  constructor() {
    this._start = Date.now();
  }

  get elapsed() {
    return Date.now() - this._start;
  }

  get elapsedSeconds() {
    return this.elapsed / 1000;
  }

  printElapsed() {
    console.log(`Elapsed: ${this.elapsed}ms`);
  }

  printElapsedSeconds() {
    console.log(`Elapsed: ${this.elapsedSeconds}s`);
  }

  reset() {
    this._start = Date.now();
  }
}
