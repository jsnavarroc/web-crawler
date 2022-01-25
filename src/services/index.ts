import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export const test = (): string => {
  return 'test';
};

// 1.1. Check if is subdomain
const checkIsSubdomain = ({ url, mainURL }) => {
  if (url.indexOf(mainURL) !== -1) {
    return true;
  }
  return false;
};

//1.2. Check if url allready analised
const checkAllready = ({ url, linksReady }) => {
  const urlReady = linksReady.filter((readyURL) => readyURL === url);
  if (urlReady.length > 0) {
    return true;
  } else {
    return false;
  }
};

// 1. First Step obtain all subDomains.
const getPageDomains = async ({ url, mainURL, linksReady }) => {
  //1.1. Check if is subdomain
  const isSubdomain = checkIsSubdomain({ url, mainURL });
  //1.2. Check if url allready analised
  const checkReady = checkAllready({ url, linksReady });
  if (!isSubdomain || checkReady) {
    return null;
  }
  linksReady.push(url);
  const response = await fetch(url);
  //1.3. Thirth step get all the HTML.
  const html = await response.text();
  const $ = cheerio.load(html);
  //1.4. Fouth step get all the links.
  const links = $('a')
    .map((i, tag) => {
      return tag.attribs.href;
    })
    .get();

  for (let i = 0; i < links.length; i++) {
    await getPageDomains({ url: links[i], mainURL, linksReady });
  }

  return linksReady;
};

export const crawl = async (url: string) => {
  // const crawler: Array;
  const linksReady = [];
  const mainURL = url;
  const subDomains = await getPageDomains({ url, mainURL, linksReady });
  console.log('subDomains>>>', subDomains);

  // const subDomains = getSubdomains(links, url);
};
