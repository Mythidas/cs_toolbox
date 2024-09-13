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

  protected _throw(error: any) {
    throw new Error(`[${this.name}]: ${error}`);
  }

  protected _log(message: string) {
    console.log(`[${this.name}]: ${message}`);
  }
}
