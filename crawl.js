function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  return urls;
}

function normalizeURL(urlstring) {
  const urlObj = new URL(urlstring);
  console.log(urlObj);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

// normalizeURL("https://blog.boot.dev/path");

module.exports = { normalizeURL, getURLsFromHTML };
