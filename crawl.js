const { JSDOM } = require("jsdom");
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
      } catch (err) {
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

module.exports = { normalizeURL, getURLsFromHTML };
