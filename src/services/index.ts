import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

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
    await getPageDomains({
      url: links[i],
      mainURL,
      linksReady,
    });
  }

  return linksReady;
};

// 2.1. obtain texts titles scraping
const getTexts = (element) => {
  const extractTextOne = element.split('">');
  const extractTextTwo = extractTextOne[extractTextOne.length - 1].split('<');
  return extractTextTwo[0];
};

// 2. Secont Step obtain all the information per subdomain. implement scraping
const getInfoSubdomains = async ({ allSubdomains }) => {

  const response = allSubdomains.map(async (url) => {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const links = $('a')
      .map((i, tag) => {
        return tag.attribs.href;
      })
      .get();
    const subdomains = links.filter((x, i) => links.indexOf(x) === i);

    const imagesLink = $('img')
      .map((i, tag) => {
        return tag.attribs.src;
      })
      .get();
    const images = imagesLink.filter((x, i) => imagesLink.indexOf(x) === i);
    let titles = [];
    try {
      titles = $('h1, h2, h3, h4, h5, h6')
        .map((_, element) => {
          const text = getTexts($(element).html());
          return {
            type: element.name,
            text,
          };
        })
        .get();
    } catch (e) {
      console.log(e);
    }

    return {
      [`${url}`]: {
        total_subdomains: links.length,
        subdomains,
        total_images: imagesLink.length,
        images,
        total_titles: titles.length,
        titles,
      },
    };
  });

  return Promise.all(response);
};

export const crawler = async (url: string) => {
  const linksReady = [];
  const mainURL = url;
  // 1. stept one
  const allSubdomains = await getPageDomains({
    url,
    mainURL,
    linksReady,
  });
  const infoSubdomains = await getInfoSubdomains({ allSubdomains });

  return infoSubdomains;
};
