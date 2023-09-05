import { db } from '../index';
import { links } from '../db/schema';
import { eq } from 'drizzle-orm';

type LinkData = typeof links.$inferInsert;

export class Link {
  id?: number;
  url: string;
  title?: string;
  notionId?: string;
  description?: string;
  image?: string;

  constructor(url: string) {
    this.url = url;
  }

  async fetchInfo() {
    console.log(`Fetching info for ${this.url}`)
    const res = await fetch(`http://api.linkpreview.net/?key=${process.env.LINKPREVIEW_TOKEN}&q=${this.url}`);
    const data = await res.json();
    this.title = data.title;
    this.description = data.description;
    this.image = data.image;
  }

  async check() {
    const link = (await db.select().from(links).where(eq(links.url, this.url)).execute())[0];
    if (link) {
      this.id = link.id;
      this.title = link.title;
      this.description = link.description || '';
      this.image = link.image || '';
      this.notionId = link.notionId || undefined;
      return true;
    }
    return false;
  }

  async save() {
    const linkData: LinkData = {
      title: this.title || '',
      url: this.url,
      description: this.description || '',
      image: this.image || '',
      notionId: this.notionId || undefined
    };

    await db.insert(links)
      .values(linkData)
      .onConflictDoUpdate({
        target: links.url,
        set: linkData,
      })
      .execute();
  }
}