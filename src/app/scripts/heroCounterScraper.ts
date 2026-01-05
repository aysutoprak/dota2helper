import axios from "axios";
import { load } from "cheerio";
import fs from "fs/promises";
import path from "path";
import { HEROES } from "../lib/hero_list";

async function scrapeHero(hero: { slug: string; wikiName: string }) {
 const url = `https://dota2.fandom.com/wiki/${hero.wikiName.replace(" ", "_")}/Counters`;

  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "DotaCounterBot/1.0"
    }
  });

  const $ = load(html);
type CounterItem = {
  item: string;
  reason: string | null;
};

const items: CounterItem[] = [];


  const itemsHeader = $("span#Items").first().closest("h3");

const itemsList = itemsHeader.next("ul");

itemsList.find("li").each((_, li) => {
  const $li = $(li);

  // Item name
  const anchor = $li.find("a[title]").first();
  const itemName = anchor.attr("title")?.trim();

  if (!itemName) return;

  // Reason = text nodes inside li (excluding child elements)
  const reason = $li
    .contents()
    .filter((_, node) => node.type === "text")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  items.push({
    item: itemName,
    reason: reason || null
  });
});

  const output = {
    hero: hero.slug,
    source: "dota2.fandom.com",
    updatedAt: new Date().toISOString(),
    counterItems: Array.from(items)
  };

  const filePath = path.join(
    process.cwd(),
    "data",
    "hero-counters",
    `${hero.slug}.json`
  );

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`Saved counters for ${hero.slug}`);
}

async function run() {
  for (const hero of HEROES) {
    await scrapeHero(hero);
  }
}

run().catch(console.error);
