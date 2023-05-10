const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

//URL constructor knows urls are case insensitive
test("normalizeURL capitals", () => {
  const input = "https://BLOG.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});
//URL constructor strips http
test("normalizeURL strip http", () => {
  const input = "http://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML abslute urls", () => {
  const inputHTMLBody = `
    <html>
    <body>
      <a href="https://blog.boot.dev/">Boot Dev Blog</a>
    </body>
    </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative urls", () => {
  const inputHTMLBody = `
    <html>
    <body>
      <a href="/path/to/file">Boot Dev Blog</a>
    </body>
    </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/to/file"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML multiple urls", () => {
  const inputHTMLBody = `
    <html>
    <body>
    <a href="/path1">Boot Dev Blog</a>
    <a href="https://blog.boot.dev/path2">Boot Dev Blog</a>
    <a href="./path3">Boot Dev Blog</a>
    </body>
    </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://blog.boot.dev/path1",
    "https://blog.boot.dev/path2",
    "https://blog.boot.dev/path3",
  ];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML invalid urls", () => {
  const inputHTMLBody = `
    <html>
    <body>
      <a href="path/to/file">Boot Dev Blog</a>
    </body>
    </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
