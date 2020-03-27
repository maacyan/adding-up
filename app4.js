'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const r1 = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDateMap = new Map();

r1.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDateMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDateMap.set(prefecture, value);
    }
});

r1.on('close', () => {
    for (let [key, value] of prefectureDateMap) {
        value.change = value.popu15 / value.popu10;
    }

    const rankingArray = Array.from(prefectureDateMap).sort((pair1, pair2) => {
        if (pair2[1].change > pair1[1].change) return -1;
        if (pair2[1].change < pair1[1].change) return 1;
        return 0;
    });

    const rankingStrings=rankingArray.map(([key,value],i) => {
        return `${i+1}位: ${key} : ${value.popu10} => ${value.popu15} 変化率: ${value.change}`

    });
    console.log(rankingStrings);
});