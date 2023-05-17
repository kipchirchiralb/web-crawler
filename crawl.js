const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentUrl, pages) {
  const baseURLObject = new URL(baseURL);
  const currentURLObject = new URL(currentUrl);

  if (baseURLObject.hostname !== currentURLObject.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentUrl);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }
  pages[normalizedCurrentURL] = 1;

  console.log(`acively crawling ${currentUrl}`);

  try {
    const resp = await fetch(currentUrl);
    if (resp.status > 399) {
      console.log(
        "Error in fetch with status code " +
          resp.status +
          " on page " +
          currentUrl
      );
      return pages;
    }
    const isContentTypeHTML = resp.headers
      .get("content-type")
      .includes("text/html");
    if (!isContentTypeHTML) {
      console.log("not html response on page " + currentUrl);
      return pages;
    }
    const htmlBody = await resp.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }

    // 4:45:12
  } catch (error) {
    console.log("Error in fetch page: " + currentUrl + " Error " + error);
  }
  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];

  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    // console.log(linkElement.href);
    if (linkElement.href.slice(0, 1) === "/") {
      // relative1
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log("error with relative one url " + error.message);
      }
    } else if (linkElement.href.slice(0, 2) === "./") {
      // relative two
      try {
        const urlObj = new URL(linkElement.href.replace(".", baseURL));
        urls.push(urlObj.href);
      } catch (error) {
        console.log("error with relative two url " + error.message);
      }
    } else {
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (error) {
        console.log("error with all urls " + error.message);
      }
    }
  }
  return urls;
}

function normalizeURL(urlstring) {
  const urlObj = new URL(urlstring);
  // console.log(urlObj);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

// normalizeURL("https://blog.boot.dev/path");

module.exports = { normalizeURL, getURLsFromHTML, crawlPage };
