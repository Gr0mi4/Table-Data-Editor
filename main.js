const downloadButton = document.getElementById('download-button');
const uploadButton = document.getElementById('upload-button');
const editButton = document.getElementById('edit-button');
const addButton = document.getElementById('add-button');
const inputArea = document.getElementById('input-area');
const inputLabel = document.getElementById('input-area-label');
const main = document.getElementById('main');
const editModal = document.getElementById('modalEdit');

let data;
let string;
let table;
let rowNumberHeaderCreated;
let rowNumber = 0;
let objectNumber;
let keyName;

downloadButton.onclick = function () {
    string = inputArea.value;
    let stringIsValid = string.match(/^\[\{.+:".+"\}\]$/ig)? true : false;
    if (!stringIsValid) {
        inputLabel.classList.remove('hidden');
    } else if (table !== undefined) {
        removeTable();
        inputLabel.classList.add('hidden');
        let newStr = string.replace(/{\b/gm, "{\"");
        let newStr2 = newStr.replace(/\b:/gm, "\":");
        let newStr3 = newStr2.replace(/,\b/gm, ",\"");
        data = JSON.parse(newStr3);
        inputArea.value = '';
        createTable();
    } else {
        inputLabel.classList.add('hidden');
        let newStr = string.replace(/{\b/gm, "{\"");
        let newStr2 = newStr.replace(/\b:/gm, "\":");
        let newStr3 = newStr2.replace(/,\b/gm, ",\"");
        data = JSON.parse(newStr3);
        inputArea.value = '';
        createTable();
    }
};

function createTable() {
    table = document.createElement('table');
    main.append(table);
    table.classList.add('table');

    for (let i = 0; i <= data.length; i++) {
        //Вывод заголовков

        for (let key in data[i]) {
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
        for (let key in data[i]) {
            let dataSell = document.createElement('td');
            dataSell.classList.add('data-sell');
            dataSell.innerText = data[i][key];
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

uploadButton.onclick = function () {
    string = JSON.stringify(data);
    let newStr = string.replace(/{\"/gm, "{");
    let newStr2 = newStr.replace(/\":/gm, ":");
    let newStr3 = newStr2.replace(/,\"/gm, ",");
    inputArea.value = newStr3;
};

function edit() {
    editModal.classList.add('showModal');
    let choseRow = document.getElementById('chose-row');
    let choseKey = document.getElementById('chose-key');
    let typeNewValue = document.getElementById('type-new-value');
    let newValueField = document.getElementById('new-value-field');
    let submitNewValue = document.getElementById('submit-new-value');
    for (let i = 0; i < data.length; i++) {
        let rowNumButton = document.createElement('button');
        rowNumButton.classList.add('btn');
        rowNumButton.classList.add('btn-secondary');
        rowNumButton.classList.add('small-button');
        rowNumButton.onclick = function() {
            objectNumber = i;
            choseRow.classList.add('hidden');
            choseKey.classList.remove('hidden');
            for (let key in data[objectNumber]) {
                let keyNameButton = document.createElement('button');
                console.log(key);
                keyNameButton.classList.add('btn');
                keyNameButton.classList.add('btn-secondary');
                keyNameButton.classList.add('button');
                keyNameButton.onclick = function () {
                    keyName = `${key}`;
                    choseKey.classList.add('hidden');
                    typeNewValue.classList.remove('hidden');
                    submitNewValue.onclick = function () {
                        data[objectNumber][keyName] = newValueField.value;
                        editModal.classList.remove('showModal');
                        removeTable();
                        createTable();
                    };

                };
                keyNameButton.innerText = key;
                choseKey.append(keyNameButton);
            }
        };
        choseRow.append(rowNumButton);
        rowNumButton.innerText = `${i}`;
    }
}

editButton.onclick = edit;/*function () {
    let objectNumber = prompt('Please enter row number to edit', '0');
    let propertyName = prompt('Please enter name of the property you want edit', `${data[0]}`);

    data[objectNumber][propertyName] = prompt('Please enter new value of chosen property');
    table.remove();
    createTable();

};*/

addButton.onclick = function () {
    let addAnotherOne;
    let newObject = {};

    function addNewData() {
        let newObjectKey = prompt('Please enter new key');
        newObject[newObjectKey] = prompt('Please enter value of the key');
        addAnotherOne = confirm('Хотите добавить ещё одно значение?');
    }
    addNewData();
    if (addAnotherOne) {
        addNewData()
    }
    if (newObject !== {}) {
        data.push(newObject)
    }
    table.remove();
    createTable();
};
