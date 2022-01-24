import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export const test = (): string => {
  return 'test';
};

// 1. Ftist Step obtain all the internal domains.
const getInternalDomains = async (url: string) => {
  const response = await fetch(url);
  //1. First step get all the HTML.
  const html = await response.text();
  const $ = cheerio.load(html);
  //2. Seconth step get all the links.
  const links = $('a')
    .map((i, tag) => {
      const link = tag.attribs.href;
      if (link.indexOf(url) !== -1) {
        return link;
      }
    })
    .get();
  console.log('links>>>', links);

  return links;
};

export const crawl = async (url: string) => {
  getInternalDomains(url);
};
