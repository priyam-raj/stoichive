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


async function splitString(string) {
    let stringArray = [];
    let stringLength = string.length;
    let stringArrayLength = Math.ceil(stringLength/25);
    for (let i = 0; i < stringArrayLength; i++) {
        let stringSubstring = string.substring(i*25, (i+1)*25);
        stringArray.push(stringSubstring);
    }
    console.log(stringArray);
    return stringArray;
}



    async function buildImage() {
        let fetchedData = await getQuote();
        let todaysQuote = fetchedData[0];
        todaysQuote = await splitString(todaysQuote);
        console.log(todaysQuote);
        
        let todaysAuthor = fetchedData[1];
        todaysAuthor = "- " + todaysAuthor;

        console.log(todaysQuote + todaysAuthor);
      
        let font = await Jimp.loadFont(`assets/philosopher.fnt`);
      
      
        Jimp.read('assets/postBackground.jpg', (err, image) => {
          if (err) throw err;
          Jimp.loadFont(`assets/philosopher.fnt`, (err, font) => {
            var w = image.bitmap.width;
            var h = image.bitmap.height;
            var textWidth = Jimp.measureText(font, todaysQuote);
            var textHeight = Jimp.measureTextHeight(font, todaysQuote);
            var textWidth2 = Jimp.measureText(font, todaysAuthor);
            var textHeight2 = Jimp.measureTextHeight(font, todaysAuthor);
            image

              .print(font, w/2 - textWidth/2, h/2 - textHeight/2 - 50,
                {   
                text: todaysQuote,
                }, textWidth, textHeight)
                .print(font, w/2 - textWidth2/2, textHeight2/2 + h/2 + 500,


                {   
                text: todaysAuthor,
                }, textWidth2, textHeight2)
              .write('todaysPost.jpg'); // save
          }); 
        });
      }


      buildImage()