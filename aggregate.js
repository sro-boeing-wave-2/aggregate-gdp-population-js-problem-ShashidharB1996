/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */

const fs = require('fs');

const aggregate = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  const dataRowSplit = data.split('\n');

  const mapAllCC = new Map();
  const cc = fs.readFileSync('./data/cc-mapping.txt', 'utf8');
  const ccRow = cc.split('\n');
  for (let i = 1; i < ccRow.length; i += 1) {
    const ccIndi = ccRow[i].split(',');
    mapAllCC.set(ccIndi[0], ccIndi[1]);
  }

  const mapcpop = new Map();
  const mapcgdp = new Map();
  const mapCouCon = new Map();
  for (let i = 1; i < dataRowSplit.length - 2; i += 1) {
    const dataIndi = dataRowSplit[i].split(',');
    mapcpop.set(dataIndi[0].slice(1, -1), dataIndi[4].slice(1, -1));
    mapcgdp.set(dataIndi[0].slice(1, -1), dataIndi[7].slice(1, -1));
    mapCouCon.set(dataIndi[0].slice(1, -1), mapAllCC.get(dataIndi[0].slice(1, -1)));
  }

  const mapContpop = new Map();
  const mapContgdp = new Map();

  mapCouCon.forEach((continent, popVal) => {
    if (mapContpop.has(continent)) {
      mapContpop.set(continent, parseFloat(mapContpop.get(continent))
        + parseFloat(mapcpop.get(popVal)));
    } else {
      mapContpop.set(continent, parseFloat(mapcpop.get(popVal)));
    }
  });
  mapCouCon.forEach((continent, gdpVal) => {
    if (mapContgdp.has(continent)) {
      mapContgdp.set(continent, parseFloat(mapContgdp.get(continent))
        + parseFloat(mapcgdp.get(gdpVal)));
    } else {
      mapContgdp.set(continent, parseFloat(mapcgdp.get(gdpVal)));
    }
  });

  const output = {};

  const out = './output/output.json';

  mapContgdp.forEach((val, continent) => {
    output[continent] = {
      GDP_2012: val,
      POPULATION_2012: mapContpop.get(continent),
    };
  });

  fs.writeFileSync(out, JSON.stringify(output));
};

module.exports = aggregate;
