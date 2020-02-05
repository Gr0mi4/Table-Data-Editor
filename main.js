(function () {
    'use strict';
    const continueButton = document.getElementById('continue-button');
    const unloadButton = document.getElementById('unload-button');
    const editButton = document.getElementById('edit-button');
    const addButton = document.getElementById('add-button');
    const deleteButton = document.getElementById('delete-button');
    const changeRowButton = document.getElementById('change-row-button');
    const inputArea = document.getElementById('input-area');
    const inputLabel = document.getElementById('input-area-label');
    const main = document.getElementById('main');
    const modalWindow = document.getElementById('modal-window');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalTitle = document.getElementById('modal-title');
    const radioCSV = document.getElementById('radio-csv');

    let tableData = [];
    let stringData;
    let table;
    let rowNumberHeaderCreated;
    let rowNumber = 0;
    let newRowNumber;
    let objectNumber;
    let keyName;
    let temporaryArray;
    let dataIncorrect;
    let stringDataCSV;
    let convertedStringCSV = '';

    let choseRowBlock = document.getElementById('chose-row');
    let choseKeyBlock = document.getElementById('chose-key');
    let typeNewValueBlock = document.getElementById('type-new-value');
    let newValueField = document.getElementById('new-value-field');
    let submitNewValueButton = document.getElementById('submit-new-value');

    continueButton.onclick = function () {
        function showEditButtons() {
            unloadButton.classList.remove('hidden');
            editButton.classList.remove('hidden');
            addButton.classList.remove('hidden');
            deleteButton.classList.remove('hidden');
            changeRowButton.classList.remove('hidden');
        }

        if (!radioCSV.checked) {
            inputLabel.innerText = '*Input data is incorrect. Please make sure that JSON written according to the example';
            stringData = inputArea.value;
            let stringIsValid = stringData.match(/^\[\{.+:".+"\}\]$/ig) ? true : false;
            if (!stringIsValid) {
                inputLabel.classList.remove('hidden');
            } else {
                showEditButtons();
                inputLabel.classList.add('hidden');
                parseJSON();
                inputArea.value = '';
                if (table !== undefined) {
                    removeTable();
                    createTable();
                } else {
                    createTable()
                }
            }
        } else {
            inputLabel.innerText = '*Input data is incorrect. Please make sure that CSV written according to the example';
            stringDataCSV = inputArea.value;
            let stringIsValid = stringDataCSV.match(/(^.+,.*$\s)+/m) ? true : false;
            if (!stringIsValid) {
                inputLabel.classList.remove('hidden');
            } else {
                showEditButtons();
                tableData = [];
                inputLabel.classList.add('hidden');
                convertCSV(stringDataCSV);
                inputArea.value = '';
                if (table !== undefined) {
                    removeTable();
                    createTable();
                } else {
                    createTable();
                }
            }
        }
    };

    function parseJSON() {
        let newStr = stringData.replace(/{\b/gm, "{\"");
        let newStr2 = newStr.replace(/\b:/gm, "\":");
        let newStr3 = newStr2.replace(/,\b/gm, ",\"");
        tableData = JSON.parse(newStr3);
        return tableData
    }

    function convertCSV(stringDataCSV) {
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

    function reverseConvertSCV() {
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

    function createTable() {
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

    function editTable() {
        modalTitle.innerText = `Choose the row that you want to edit`;
        showModal();
        for (let i = 0; i < tableData.length; i++) {
            let rowNumButton = document.createElement('button');
            rowNumButton.classList.add('btn', 'btn-secondary', 'small-button');
            rowNumButton.onclick = function () {
                objectNumber = i;
                choseRowBlock.classList.add('hidden');
                choseKeyBlock.classList.remove('hidden');
                for (let key in tableData[objectNumber]) {
                    modalTitle.innerText = 'Chose the key you want to edit';
                    let keyNameButton = document.createElement('button');
                    keyNameButton.classList.add('btn', 'btn-secondary', 'small-button');
                    keyNameButton.onclick = function () {
                        modalTitle.innerText = 'Chose new value of chosen key';
                        keyName = `${key}`;
                        choseKeyBlock.classList.add('hidden');
                        typeNewValueBlock.classList.remove('hidden');
                        newValueField.placeholder = tableData[objectNumber][keyName];
                        submitNewValueButton.onclick = function () {
                            tableData[objectNumber][keyName] = newValueField.value;
                            newValueField.value = '';
                            closeModal();
                            removeTable();
                            createTable();
                        };
                    };
                    keyNameButton.innerText = key;
                    choseKeyBlock.append(keyNameButton);
                }
            };
            choseRowBlock.append(rowNumButton);
            rowNumButton.innerText = `${i}`;
        }
    }

    function addNewRow() {
        let newObject = {};
        for (let key in tableData[0]) {
            newObject[key] = tableData[key]
        }
        for (let key in newObject) {
            newObject[key] = prompt('Please enter value of the ' + `${key}`);
            newObject[key] === null ? dataIncorrect = true : dataIncorrect = false;
        }
        if (!dataIncorrect) {
            tableData.push(newObject);
            removeTable();
            createTable();
        } else {
            alert('Введенные данные не соовтествуют шаблону. Попробуйте ещё раз')
        }
    }
    function changeRowNumber() {
        modalTitle.innerText = 'Choose row number that you want to change';
        showModal();
        choseRowBlock.classList.remove('hidden');
        for (let i = 0; i < tableData.length; i++) {
            let rowNumButton = document.createElement('button');
            rowNumButton.classList.add('btn', 'btn-secondary', 'small-button');
            rowNumButton.onclick = function () {
                rowNumber = i;
                temporaryArray = tableData[i];
                choseRowBlock.classList.add('hidden');
                typeNewValueBlock.classList.remove('hidden');
                newValueField.placeholder = rowNumber;
                submitNewValueButton.onclick = function () {
                    newRowNumber = +newValueField.value;
                    tableData[i] = tableData[newRowNumber];
                    tableData[newRowNumber] = temporaryArray;
                    closeModal();
                    removeTable();
                    createTable();
                };
            };
            choseRowBlock.append(rowNumButton);
            rowNumButton.innerText = `${i}`;
        }
    }

    function deleteRow() {
        modalTitle.innerText = 'Chose row number that you want to delete';
        showModal();
        for (let i = 0; i < tableData.length; i++) {
            let rowNumButton = document.createElement('button');
            let rowToDelete;
            rowNumButton.classList.add('btn', 'btn-secondary', 'small-button');
            rowNumButton.innerText = i;
            rowNumButton.onclick = function () {
                rowToDelete = i;
                tableData.splice(rowToDelete, 1);
                closeModal();
                removeTable();
                createTable()
            };
            choseRowBlock.append(rowNumButton);
        }
    }

    function showModal() {
        modalWindow.classList.add('showModal');
        modalOverlay.classList.remove('hidden');
    }

    function closeModal() {
        modalWindow.classList.remove('showModal');
        while (choseKeyBlock.firstChild) {
            choseKeyBlock.removeChild(choseKeyBlock.firstChild)
        }
        choseRowBlock.classList.remove('hidden');
        while (choseRowBlock.firstChild) {
            choseRowBlock.removeChild(choseRowBlock.firstChild)
        }
        choseKeyBlock.classList.add('hidden');
        typeNewValueBlock.classList.add('hidden');
        newValueField.innerText = '';
        modalOverlay.classList.add('hidden');
    }

    editButton.onclick = editTable;
    deleteButton.onclick = deleteRow;
    addButton.onclick = addNewRow;
    modalCloseButton.onclick = closeModal;
    changeRowButton.onclick = changeRowNumber;
    unloadButton.onclick = function () {
        if (!radioCSV.checked) {
            stringData = JSON.stringify(tableData);
            let newStr = stringData.replace(/{\"/gm, "{");
            let newStr2 = newStr.replace(/\":/gm, ":");
            let newStr3 = newStr2.replace(/,\"/gm, ",");
            inputArea.value = newStr3;
        } else {
            reverseConvertSCV();
            inputArea.value = convertedStringCSV;
            convertedStringCSV = '';
        }
    };
}());