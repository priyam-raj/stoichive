import fetch from "node-fetch";
import Jimp from "jimp";


async function getQuote() {
    let todaysData = await fetch("https://stoicquotesapi.com/v1/api/quotes/random")
      .then((res) => res.json())
      .then((json) => {
        return json;
      });

      let todaysQuote = todaysData.body;
      let todaysAuthor = todaysData.author;
      return [todaysQuote, todaysAuthor];

    }


    getQuote()
