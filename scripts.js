require("./renderer.js");
const fs = require('fs');
const QRCode = require('qrcode');

$(document).ready(function() {
    if (fs.existsSync('savedData.json')) {
        fs.readFile('savedData.json', (err, rawData) => {
            if (err) throw err;
            let data = JSON.parse(rawData);
            $.each(data, function(key, value){
                console.log(key + '\t' + value);
                $('#' + key).val(value);
            });
        });
    }
});

function makeJSON() {
    //Before you read this next bit of code and decide you hate me forever, see if you could do it better yourself. If you can, make a PR. - @amrelk
    let matchForm = $('#matchForm')[0];
    let matchData = {};
    for (let i = 0; i < matchForm.length; i++){
        console.log(matchForm[i].id + '\t:\t' + matchForm[i].value);
        matchData[matchForm[i].id] = matchForm[i].value;
    }
    return matchData
}

function compressJSON(uncompressed, standard) {
    let compressed = {};
    if (fs.existsSync(standard + ".json")) {
        let rawStandard = fs.readFileSync(standard + ".json");
        compressed['standard'] = standard;
        compressed['version'] = JSON.parse(rawStandard).version;
        compressed['data'] = [];
        standard = JSON.parse(rawStandard).standard;
        $.each(standard, function(key, value) {
            if (uncompressed.hasOwnProperty(key)) {
                switch (value) {
                    case "text":
                        compressed.data.push(uncompressed[key]);
                        break;
                    case "num/count":
                        if (!isNaN(uncompressed[key])) {
                            compressed.data.push(+uncompressed[key]);
                        } else {
                            compressed.data.push(uncompressed[key].length)
                        }
                }
            }
        });
        return compressed;
    } else {
        compressed['standard'] = "Uncompressed";
        compressed['version'] = "0"
        compressed['data'] = uncompressed;
        return compressed;
    }
}

function saveJSON() {
    fs.writeFile('savedData.json', JSON.stringify(makeJSON(), null, 2), (err) => {if (err) throw err;});
}

function makeQR() {
    QRCode.toCanvas($('#qrCanvas')[0], JSON.stringify(compressJSON(makeJSON(), 'matchData2018')));
}