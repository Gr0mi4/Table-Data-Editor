let convertCSV = function(stringDataCSV) {
    let dataCSV = [];
    let headArr = stringDataCSV.match(/^.+\b/m)[0].split(',');
    let arr = stringDataCSV.match(/^.+\b/gm);
    for (let j = 1; j< arr.length; j++) {
        let object = {};
        let i = 0;
        let resArr = arr[j].split(',');
        headArr.forEach(function (item) {
            object[item] = resArr[i];
            i++
        });
        dataCSV.push(object);
    }
    let tableData = dataCSV;
    return tableData

};