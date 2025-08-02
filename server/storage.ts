import { type StoryChapter, type InsertStoryChapter } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createChapter(chapter: InsertStoryChapter): Promise<StoryChapter>;
  getAllChapters(): Promise<StoryChapter[]>;
  getChapterById(id: string): Promise<StoryChapter | undefined>;
  deleteAllChapters(): Promise<void>;
}

export class MemStorage implements IStorage {
  private chapters: Map<string, StoryChapter>;

  constructor() {
    this.chapters = new Map();
  }

  async createChapter(insertChapter: InsertStoryChapter): Promise<StoryChapter> {
    const id = randomUUID();
    const chapter: StoryChapter = {
      id,
      userId: insertChapter.userId || null,
      imageUrl: insertChapter.imageUrl,
      narrative: insertChapter.narrative,
      connections: insertChapter.connections || [],
      tags: insertChapter.tags || [],
      chapterNumber: insertChapter.chapterNumber,
      createdAt: new Date()
    };
    this.chapters.set(id, chapter);
    return chapter;
  }

  async getAllChapters(): Promise<StoryChapter[]> {
    return Array.from(this.chapters.values()).sort((a, b) => a.chapterNumber - b.chapterNumber);
  }

  async getChapterById(id: string): Promise<StoryChapter | undefined> {
    return this.chapters.get(id);
  }

  async deleteAllChapters(): Promise<void> {
    this.chapters.clear();
  }
}

export const storage = new MemStorage();
