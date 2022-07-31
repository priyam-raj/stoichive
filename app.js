import express from "express";
import { CronJob } from "cron";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import { IgApiClient } from "instagram-private-api";
import { promisify } from "util";
import { buildImage, getQuote } from "./createImage.js";
import { readFile } from "fs";

const app = express();
const readFileAsync = promisify(readFile);
dotenv.config();

  app.use(express.static("public"));
  app.listen(process.env.PORT || 3000, function () {
  });

  app.get("/", function (request, response) {
    response.send('stoichive is currently up and running <br><br> - Instagram @stoichive<br> - Twitter @stoichive');
  });

  // Set 3 second delay (For compressions and resizes.)
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

  

async function tweetNow() {

  console.log("Tweeting begins..");

  let caption = await buildImage();
  caption = `"${caption[0]}"\n${caption[1]}`; 
  
  await timeout(3000);


    const client = new TwitterApi({
      appKey: process.env.CONSUMER_KEY,
      appSecret: process.env.CONSUMER_SECRET,
      accessToken: process.env.ACCESS_TOKEN,
      accessSecret: process.env.ACCESS_TOKEN_SECRET,
    });
  
  const stoichive = client.readWrite;


  const imagePath = `todaysPost.jpg`

  const tweet = async () => {
    try { 
      const mediaId = await client.v1.uploadMedia(imagePath);
      await stoichive.v2.tweet(caption, {
        media: { media_ids: [mediaId] },
      });
      console.log("Tweeted to Twitter!");
    } catch (e) {
      console.log(e);
    }
  };
  tweet();
}

async function instagramPost() {
  try {
    console.log("Posting to Instagram begins..");
    // Instagram client
    const { username, password } = process.env;
    const ig = new IgApiClient();
    let caption = await buildImage();
    caption = `"${caption[0]}"\n${caption[1]}\n\n#stoic #stoicism #philosophy #stoicphilosophy #marcusaurelius #wisdom #dailystoic #seneca #stoicmindset #stoicquotes #epictetus #philosopher #philosophyquotes #mindset #motivation #quotes #stoics #psychology #socrates #stoiclife #selfimprovement #meditation #carljung #masculinity #lawsofpower #quoteoftheday #life #jordanpeterson #discipline #nietzsche`;
    ig.state.generateDevice(username);
    const user = await ig.account.login(username, password);
    const path = `todaysPost.jpg`;
    const published = await ig.publish.photo({
      file: await readFileAsync(path),
      caption: caption,
    });
    console.log("Posted to Instagram!");
  } catch (error) {
    console.log(error);
  }
}

// Run on ever 4-hour duration
let dailyPost = new CronJob(
  "00 00 */4 * * *",
  function () {
    console.log("Auto post to Instagram begins..");
    tweetNow();
  },
  true
);


// Run on ever 4-hour and 5-minutes duration
let dailyTweet = new CronJob(
  "00 05 */4 * * *",
  function () {
    console.log("Auto Tweet begins..");
    tweetNow();
  },
  true
);


dailyTweet.start();
dailyPost.start();
