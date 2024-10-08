import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

//this route will allow us to conduct scraping easily and faster in the server side of things
// this approach also helps avoid CORS errors especially when trying to access external urls for scraping
// with the help of GPT-4, I was added error handling so that we can better handle errors from scraping and thus update the frontend accordingly. 

export async function POST(req) {
  try {
    const { url } = await req.json(); // Parse the JSON request body
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the website content
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML into cheerio
    const $ = cheerio.load(html);

    // Remove script and style tags
    $("script, style").remove();

    // Extract the text content and remove extra whitespace
    const rawText = $("body").text().replace(/\s+/g, " ").trim();

    // Return the scraped content
    return NextResponse.json({ content: rawText }, { status: 200 });
  } catch (error) {
    console.error("Error scraping website:", error.message);
    return NextResponse.json(
      { error: "Failed to scrape the website" },
      { status: 500 }
    );
  }
}
