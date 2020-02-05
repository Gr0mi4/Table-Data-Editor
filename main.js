const continueButton = document.getElementById('continue-button');
const unloadButton = document.getElementById('unload-button');
const editButton = document.getElementById('edit-button');
const addButton = document.getElementById('add-button');
const deleteButton = document.getElementById('delete-button');
const inputArea = document.getElementById('input-area');
const inputLabel = document.getElementById('input-area-label');
const main = document.getElementById('main');
const editModal = document.getElementById('modalEdit');
const deleteModal = document.getElementById('modalDelete');

let data;
let string;
let table;
let rowNumberHeaderCreated;
let rowNumber = 0;
let objectNumber;
let keyName;

let choseRow = document.getElementById('chose-row');
let choseDeletedRow = document.getElementById('chose-deleted-row');
let choseKey = document.getElementById('chose-key');
let typeNewValue = document.getElementById('type-new-value');
let newValueField = document.getElementById('new-value-field');
let submitNewValue = document.getElementById('submit-new-value');

continueButton.onclick = function () {
    unloadButton.classList.remove('hidden');
    editButton.classList.remove('hidden');
    addButton.classList.remove('hidden');
    deleteButton.classList.remove('hidden');

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



function editTable() {
    editModal.classList.add('showModal');
    for (let i = 0; i < data.length; i++) {
        let rowNumButton = document.createElement('button');
        rowNumButton.classList.add('btn', 'btn-secondary', 'small-button');
        rowNumButton.onclick = function() {
            objectNumber = i;
            choseRow.classList.add('hidden');
            choseKey.classList.remove('hidden');
            for (let key in data[objectNumber]) {
                let keyNameButton = document.createElement('button');
                keyNameButton.classList.add('btn', 'btn-secondary');
                keyNameButton.onclick = function () {
                    keyName = `${key}`;
                    choseKey.classList.add('hidden');
                    typeNewValue.classList.remove('hidden');
                    newValueField.placeholder = data[objectNumber][keyName];
                    submitNewValue.onclick = function () {
                        data[objectNumber][keyName] = newValueField.value;
                        newValueField.value = '';
                        editModal.classList.remove('showModal');
                        typeNewValue.classList.add('hidden');
                        choseKey.classList.add('hidden');
                        while (choseKey.firstChild) {choseKey.removeChild(choseKey.firstChild)}
                        choseRow.classList.remove('hidden');
                        while (choseRow.firstChild) {choseRow.removeChild(choseRow.firstChild)}
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

editButton.onclick = editTable;
deleteButton.onclick = deleteRow;
addButton.onclick = addNewRow;
unloadButton.onclick = function () {
    string = JSON.stringify(data);
    let newStr = string.replace(/{\"/gm, "{");
    let newStr2 = newStr.replace(/\":/gm, ":");
    let newStr3 = newStr2.replace(/,\"/gm, ",");
    inputArea.value = newStr3;
};

function addNewRow() {
    let newObject = {}
    for (let key in data[0]) {
        newObject[key] = data[key]
    }
    for (let key in newObject) {
        newObject[key] = prompt('Please enter value of the ' + `${key}`);
    }
    data.push(newObject);
    removeTable();
    createTable();
}

function deleteRow() {
    deleteModal.classList.add('showModal');
    console.log('нажатие есть');
    for (let i = 0; i < data.length; i++) {
        let rowNumButton = document.createElement('button');
        let rowToDelete;
        rowNumButton.classList.add('btn', 'btn-secondary', 'small-button');
        rowNumButton.innerText = i;
        rowNumButton.onclick = function () {
            rowToDelete = i;
            data.splice(rowToDelete,1);
            deleteModal.classList.remove('showModal');
            while (choseDeletedRow.firstChild) {choseDeletedRow.removeChild(choseDeletedRow.firstChild)}
            removeTable();
            createTable()
        };
        choseDeletedRow.append(rowNumButton);
    }
}



