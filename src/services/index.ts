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

// 1. Ftist Step obtain all domains.
const getPageDomains = async ({ url, mainURL, linksReady }) => {
  //1.1. Check if is subdomain
  const isSubdomain = checkIsSubdomain({ url, mainURL });
  //1.2. Check if url allready analised
  const checkReady = checkAllready({ url, linksReady });
  if (!isSubdomain || checkReady) {
    return null;
  }
  console.log('>>>>', { url, mainURL, isSubdomain, checkReady, linksReady });
  linksReady.push(url);

  const response = await fetch(url);
  //1.2. First step get all the HTML.
  const html = await response.text();
  const $ = cheerio.load(html);
  //1.3. Seconth step get all the links.
  const links = $('a')
    .map((i, tag) => {
      return tag.attribs.href;
    })
    .get();

  links.forEach((subUrl) => {
    getPageDomains({ url: subUrl, mainURL, linksReady });
  });

  return links;
};

export const crawl = async (url: string) => {
  // const crawler: Array;
  const linksReady = [];
  const mainURL = url;
  const links = getPageDomains({ url, mainURL, linksReady });

  // const subDomains = getSubdomains(links, url);
};
