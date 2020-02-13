window.drawTable = (function () {
    const main = document.getElementById('main');

    let table;
    let rowNumberHeaderCreated;
    let rowNumber = 0;

    function createTable(tableData) {
        table = document.createElement('table');
        main.append(table);
        table.classList.add('table');
        for (let i = 0; i <= tableData.length; i++) {
            for (let key in tableData[i]) {
                if (i === 0) {
                    if (!rowNumberHeaderCreated) {
                        let rowNumberHeader = document.createElement('th');
                        table.append(rowNumberHeader);
                        rowNumberHeader.innerText = 'Row №';
                        rowNumberHeaderCreated = true;
                    }
                    let header = document.createElement('th');
                    header.classList.add('table-header');
                    header.innerText = key;
                    table.append(header);
                }
            }
            let tableRow = document.createElement('tr');
            tableRow.innerText = rowNumber;
            rowNumber++;
            for (let key in tableData[i]) {
                let dataSell = document.createElement('td');
                dataSell.classList.add('data-sell');
                dataSell.innerText = tableData[i][key];
                table.append(tableRow);
                tableRow.append(dataSell);
            }
        }
        main.append(table);
    }

    function removeTable() {
        table.remove();
        rowNumberHeaderCreated = false;
        rowNumber = 0;
    }

    return {
        createTable,
        removeTable
    }
}());