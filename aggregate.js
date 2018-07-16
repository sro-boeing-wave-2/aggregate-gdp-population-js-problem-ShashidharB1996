/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const aggregate = filePath => new Promise((resolveag, rejectag) => {
  const countryContinentArray = file => new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, items) => {
      if (err) {
        reject(err);
      } else {
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
  });
  const CCGdpPop = filePath2 => new Promise((resolve1, reject1) => {
    fs.readFile(filePath2, 'utf8', (err, contents) => {
      if (err) {
        reject1(err);
      } else {
        const countrypopMap = new Map();
        const countrygdpMap = new Map();
        let maps = [];
        const rowSplit = contents.split('\n');
        let indiSplit;
        for (let i = 1; i < rowSplit.length - 1; i += 1) {
          indiSplit = rowSplit[i].split(',');
          if (indiSplit[0].slice(1, -1) !== 'European Union') {
            countrypopMap.set(indiSplit[0].slice(1, -1), indiSplit[4].slice(1, -1));
            countrygdpMap.set(indiSplit[0].slice(1, -1), indiSplit[7].slice(1, -1));
          }
        }
        maps = [countrypopMap, countrygdpMap];
        resolve1(maps);
      }
    });
  });
  Promise.all([countryContinentArray('./data/cc-mapping.txt'), CCGdpPop(filePath)]).then((reqdata) => {
    const continentgdpMap = new Map();
    const continentpopMap = new Map();
    reqdata[1][0].forEach((popVal, country) => {
      if (continentpopMap.has(reqdata[0].get(country))) {
        continentpopMap.set(reqdata[0].get(country),
          parseFloat(continentpopMap.get(reqdata[0].get(country))) + parseFloat(popVal));
      } else {
        continentpopMap.set(reqdata[0].get(country), parseFloat(popVal));
      }
    });

    reqdata[1][1].forEach((gdpVal, country) => {
      if (continentgdpMap.has(reqdata[0].get(country))) {
        continentgdpMap.set(reqdata[0].get(country),
          parseFloat(continentgdpMap.get(reqdata[0].get(country))) + parseFloat(gdpVal));
      } else {
        continentgdpMap.set(reqdata[0].get(country), parseFloat(gdpVal));
      }
    });
    const outputObject = {};
    continentgdpMap.forEach((gdpVal, continent) => {
      outputObject[continent] = {
        GDP_2012: gdpVal,
        POPULATION_2012: continentpopMap.get(continent),
      };
    });
    const outputpath = './output/output.json';
    fs.writeFile(outputpath, JSON.stringify(outputObject), (err) => {
      if (err) rejectag(err);
      else resolveag();
    });
  });
});

module.exports = aggregate;
