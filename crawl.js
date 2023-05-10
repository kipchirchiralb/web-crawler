const { JSDOM } = require("jsdom");

async function crawlPage(currentUrl) {
  try {
    const resp = await fetch(currentUrl);
    if (resp.status > 399) {
      console.log(
        "Error in fetch with status code " +
          resp.status +
          " on page " +
          currentUrl
      );
      return;
    }
    const isContentTypeHTML = resp.headers
      .get("content-type")
      .includes("text/html");
    if (!isContentTypeHTML) {
      console.log("not html response on page " + currentUrl);
      return;
    }
    const html = await resp.text();

    console.log(getURLsFromHTML(html));
  } catch (error) {
    console.log("Error in fetch page: " + currentUrl + " Error " + error);
  }
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
