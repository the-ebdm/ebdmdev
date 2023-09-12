// A basic JSON file cache
import { BunFile } from "bun";
import { mkdir } from "node:fs/promises";

export class Cache {
  private key: string;
  public filePath: string;
  private file: BunFile;

  constructor(key: string) {
    this.key = key;
    this.filePath = process.env.PWD + '/.cache/' + this.key + '.json';
    console.log(this.filePath)
    this.file = Bun.file(this.filePath)
  }

  private async ensureParentDirectoryExists(): Promise<void> {
    const parentDirectory = this.filePath.split('/').slice(0, -1).join('/');
    await mkdir(parentDirectory, { recursive: true });
  }

  public async get(): Promise<any> {
    try {
      return await this.file.json();
    } catch (error) {
      return undefined;
    }
  }

  public async set(value: any): Promise<void> {
    await this.ensureParentDirectoryExists();
    await Bun.write(this.filePath, JSON.stringify(value));
  }
}