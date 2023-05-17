const { sortPages } = require("./report.js");
const { test, expect } = require("@jest/globals");

test("sortPages 2 pages", () => {
  const input = { "https://wagslane.dev": 3, "https://wagslane.dev/path": 1 };
  const actual = sortPages(input);
  const expected = [
    ["https://wagslane.dev", 3],
    ["https://wagslane.dev/path", 1],
  ];
  expect(actual).toEqual(expected);
});

test("sortPages 5 pages", () => {
  const input = {
    "https://wagslane.dev": 3,
    "https://wagslane.dev/path2": 2,
    "https://wagslane.dev/path4": 4,
    "https://wagslane.dev/path14": 14,
    "https://wagslane.dev/path8": 8,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://wagslane.dev/path14", 14],
    ["https://wagslane.dev/path8", 8],
    ["https://wagslane.dev/path4", 4],
    ["https://wagslane.dev", 3],
    ["https://wagslane.dev/path2", 2],
  ];
  expect(actual).toEqual(expected);
});
