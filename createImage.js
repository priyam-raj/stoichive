import fetch from "node-fetch";
import Jimp from "jimp";


  // Set 3 second delay (For compressions and resizes.)
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  

async function getQuote() {
  console.log('Fetching a quote..');
    let todaysData = await fetch("https://stoicquotesapi.com/v1/api/quotes/random")
      .then((res) => res.json())
      .then((json) => {
        return json;
      });

      let todaysQuote = todaysData.body;
      let todaysAuthor = todaysData.author;
      return [todaysQuote, todaysAuthor];

    }


async function splitString(string) {
  console.log('Checking if the quote has more than 30 characters..');
    let stringArray = string.split(" ");
    let newArray = [];
    let tempString = "";
    for (let i = 0; i < stringArray.length; i++) {
        if (tempString.length + stringArray[i].length + 1 > 30) {
          console.log('\nWell it does..\n');
            newArray.push(tempString);
            tempString = "";
        }
        tempString += stringArray[i] + " ";
    }
    newArray.push(tempString);
    return newArray;
}



    async function buildImage() {
      console.log('Now constructing image..');
        let fetchedData = await getQuote();
        let todaysQuote = fetchedData[0];
        let rawQuote = fetchedData[0];
        todaysQuote = await splitString(todaysQuote);
        let todaysAuthor = fetchedData[1];
        todaysAuthor = "- " + todaysAuthor;
            
        const font = `assets/philosopher.fnt`;

        Jimp.read('assets/postBackground.jpg', (err, image) => {
          if (err) throw err;
          Jimp.loadFont(`assets/philosopher.fnt`, (err, font) => {
            var w = image.bitmap.width;
            var h = image.bitmap.height;
            var textWidth2 = Jimp.measureText(font, todaysAuthor);
            var textHeight2 = Jimp.measureTextHeight(font, todaysAuthor);   
                    
            for (let i = 0; i < todaysQuote.length; i++) {
              var textHeight = Jimp.measureTextHeight(font, todaysQuote[i]);
              var textWidth = Jimp.measureText(font, todaysQuote[i]);
                image.print(font, w/2 - textWidth/2, h/6 + 100 - textHeight/2 + i*textHeight, todaysQuote[i]);
            }
                image.print(font, w/2 - textWidth2/2, textHeight2/2 + h/2 + 500,
                {   
                text: todaysAuthor,
                }, textWidth2, textHeight2)
              .write('todaysPost.jpg'); // save
              console.log(`An image quote has been constructed!`);
          }); 
        });

        await timeout(1000);

        return [rawQuote, todaysAuthor];

      }


export { buildImage, getQuote };