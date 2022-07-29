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


function splitString(string) {
    let stringArray = string.split(" ");
    let newArray = [];
    let tempString = "";
    for (let i = 0; i < stringArray.length; i++) {
        if (tempString.length + stringArray[i].length + 1 > 30) {
            newArray.push(tempString);
            tempString = "";
        }
        tempString += stringArray[i] + " ";
    }
    newArray.push(tempString);
    return newArray;

}



    async function buildImage() {
        let fetchedData = await getQuote();
        let todaysQuote = fetchedData[0];
        todaysQuote = await splitString(todaysQuote);
        let todaysAuthor = fetchedData[1];
        todaysAuthor = "- " + todaysAuthor;

        console.log(todaysQuote + todaysAuthor);
            
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
                image.print(font, w/2 - textWidth/2, h/5 - textHeight/2 + i*textHeight, todaysQuote[i]);
            }
                image.print(font, w/2 - textWidth2/2, textHeight2/2 + h/2 + 500,
                {   
                text: todaysAuthor,
                }, textWidth2, textHeight2)
              .write('todaysPost.jpg'); // save
          }); 
        });
      }


      buildImage()