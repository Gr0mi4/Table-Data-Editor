window.parsing = (function() {

    function parseJSON(string) {
        let newStr = string.replace(/{\b/gm, "{\"");
        let newStr2 = newStr.replace(/\b:/gm, "\":");
        let newStr3 = newStr2.replace(/,\b/gm, ",\"");
        let tableData = JSON.parse(newStr3);
        return tableData
    }

    function convertCSV(stringDataCSV) {
        let tableData = [];
        let headArr = stringDataCSV.match(/^.+\b/m)[0].split(',');
        let arr = stringDataCSV.match(/^.+\b/gm);
        for (let j = 1; j < arr.length; j++) {
            let object = {};
            let i = 0;
            let resArr = arr[j].split(',');
            headArr.forEach(function (item) {
                object[item] = resArr[i];
                i++
            });

            tableData.push(object);
        }
        return tableData;
    }

    function reverseConvertJSON(tableData) {
        let stringData = JSON.stringify(tableData);
        let newStr = stringData.replace(/{\"/gm, "{");
        let newStr2 = newStr.replace(/\":/gm, ":");
        let newStr3 = newStr2.replace(/,\"/gm, ",");
        return newStr3
    }

    function reverseConvertCSV(tableData) {
        let convertedStringCSV = '';
        for (let key in tableData[0]) {
            convertedStringCSV += key + ',';
        }
        convertedStringCSV += '\n';
        for (let i = 0; i <= tableData.length; i++) {
            for (let key in tableData[i]) {
                convertedStringCSV += tableData[i][key] + ',';
            }
            convertedStringCSV += '\n';
        }
        return convertedStringCSV
    }


    return {
        parseJSON,
        reverseConvertJSON,
        convertCSV,
        reverseConvertCSV
    }
}());