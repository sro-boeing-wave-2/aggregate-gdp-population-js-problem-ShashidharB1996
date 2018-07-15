/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const aggregate = (filePath) => {
  const countryContinentMap = file => new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, items) => {
      if (err) reject(err);
      else {
        const splitRow = items.split('\n');
        let splitIndi;
        const AllCCMap = new Map();
        for (let i = 0; i < splitRow.length - 1; i += 1) {
          splitIndi = splitRow[i].split(',');
          AllCCMap.set(splitIndi[0], splitIndi[1]);
        }
        resolve(AllCCMap);
      }
    });

    countryContinentMap('./cc-mapping.txt').then((AllCCMap) => {
      const CCGdpPop = () => new Promise((resolve1, reject1) => {
        fs.readFile(filePath, 'utf8', (err, contents) => {
          if (err) reject1(err);
          else {
            const CCpopgdpArray = [];
            const rowSplit = contents.split('\n');
            let indiSplit;
            for (let i = 1; i < rowSplit.length - 1; i += 1) {
              indiSplit = rowSplit[i].split(',');
              if (indiSplit[0].slice(1, -1) !== 'European Union') {
                CCpopgdpArray[i] = [AllCCMap.get(indiSplit[0].slice(1, -1)),
                  indiSplit[0].slice(1, -1), indiSplit[4].slice(1, -1), indiSplit[7].slice(1, -1)];
              }
            }
            resolve1(CCpopgdpArray);
          }
        });
      });
      CCGdpPop().then((CCpopgdpArray) => {
        const continentgdpMap = new Map();
        const continentpopMap = new Map();
        CCpopgdpArray.forEach((arrayElement) => {
          if (continentpopMap.has(arrayElement[0])) {
            continentpopMap.set(arrayElement[0],
              parseFloat(continentpopMap.get(arrayElement[0])) + parseFloat(arrayElement[2]));
          } else {
            continentpopMap.set(arrayElement[0], parseFloat(arrayElement[2]));
          }

          if (continentgdpMap.has(arrayElement[0])) {
            continentgdpMap.set(arrayElement[0],
              parseFloat(continentgdpMap.get(arrayElement[0])) + parseFloat(arrayElement[3]));
          } else {
            continentgdpMap.set(arrayElement[0], parseFloat(arrayElement[3]));
          }
        });
        const outputObject = {};
        continentgdpMap.forEach((arrayElement, key) => {
          outputObject[key] = {
            GDP_2012: arrayElement,
            POPULATION_2012: continentpopMap.get(key),
          };
        });
        const writingAsyncly = () => new Promise((resolve2, reject2) => {
          const outputpath = './output/output.json';
          fs.writeFile(outputpath, JSON.stringify(outputObject, 2, 2), (err) => {
            if (err) reject2(err);
            else resolve2();
          });
        });
        writingAsyncly();
      });
    });
  });
};

module.exports = aggregate;
