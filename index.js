const express = require("express");
const app = express();

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const PORT = process.env.PORT || 3030;

const targetURL = "https://newsweb.oslobors.no/";

async function scrapeAndReturn() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(targetURL);
  await page.waitForSelector("table");

  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);

  const elem = $("tbody").children('tr').first();

  const event = {};

  event.time = $(elem).find(".kzwcbj").text();
  event.utst_id = $(elem).find(".hlFPFz").text();
  event.title = $(elem).find(".jzDNAp span span:first").text();
  event.vedlegg = $(elem).find(".edoIV").text();
  event.kategori = $(elem).find(".ePJIxm span span:first").text();
  event.url = `${targetURL}${$(elem).find(".gguAuF").attr('href')}`;  

  return event;
}

app.get("/", (req, res) => {
  return res.send("Up and running! :)");
});

app.get("/scrape", async (req, res) => {

  try {
    const data = await scrapeAndReturn();
    res.send(data);
  } catch (error) {
    res.status(500).send("Klarte ikke å scrape!")
  }
});

app.listen(PORT, async () => {
  console.log(`Hello from PORT: ${PORT}`);
});
