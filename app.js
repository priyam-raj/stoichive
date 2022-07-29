import express from "express";
import { CronJob } from "cron";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import { IgApiClient } from "instagram-private-api";
import { promisify } from "util";
import { buildImage } from "./createImage.js";
import { readFile } from "fs";

const app = express();
const readFileAsync = promisify(readFile);
dotenv.config();

app.use(express.static("public"));
app.listen(process.env.PORT || 3000, function () {
  });

  app.get("/", function (request, response) {
    response.send('stoichive is currently up and running <br><br> - Instagram @stoichive<br> - Twitter @stoichive (soon)');
  });
  

async function tweetNow() {
  // Twitter client
  const client = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
  });

  const stoichive = client.readWrite;

  let caption = await buildImage();
  caption = `"${caption[0]}"\n${caption[1]}`;

  const tweet = async () => {
    try {
      const mediaId = await client.v1.uploadMedia(`todaysPost.jpg`);
      await timenitedaily.v2.tweet(caption, {
        media: { media_ids: [mediaId] },
      });
      console.log("And now just tweeted.");
    } catch (e) {
      console.log(e);
    }
  };
  tweet();
}

async function instagramPost() {
  try {
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
    console.log("And now posted to Instagram.");
  } catch (error) {
    console.log(error);
  }
}

// Run every day at 7:30 PM IST UTC
let dailyPost = new CronJob(
  "0 */4 * * *",
  async function () {
    console.log("Auto post begins");
    await instagramPost();
  },
  true
);


// Test post once on startup.
await instagramPost();

dailyPost.start();