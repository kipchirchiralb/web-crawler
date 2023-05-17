const puppeteer = require("puppeteer");

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Navigate to Jumia.co.ke
  await page.goto("https://www.jumia.co.ke/", { waitUntil: "networkidle2" });

  // Type "laptops" in the search input field and submit the form
  await page.type('input[name="q"]', "laptops");
  await page.click('button[class="btn _prim _md -mls -fsh0"]');

  // Wait for the search results to load
  //   console.log(await page.content());
  //   await page.waitForSelector(".row._no-g._4cl-3cm-shs");

  // Extract the product names and prices
  //   const products = await page.$$eval(".row._no-g._4cl-3cm-shs", (elements) =>
  //     elements.map((el) => ({
  //       name: el.querySelector(".name").textContent.trim(),
  //       price: el.querySelector(".prc").textContent.trim(),
  //     }))
  //   );
  //   // Print the product names and prices
  //   products.forEach((product) => {
  //     console.log(`Name: ${product.name}`);
  //     console.log(`Price: ${product.price}`);
  //     console.log("------------------------");
  //   });

  // Extract the attribute value
  const productDetails = await page.$$eval(
    "[data-oprc][data-name]",
    (elements) => {
      return {
        name: elements.map((el) => el.getAttribute("data-name")),
        price: elements.map((el) => el.getAttribute("data-oprc")),
      };
    }
  );

  // Print the attribute values
  console.log(productDetails);
  //   productDetailes.forEach((value) => {
  //     console.log(value);
  //   });

  // Close the browser
  await browser.close();
})();
