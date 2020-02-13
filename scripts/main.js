window.main = (function () {
    'use strict';

    const continueButton = document.getElementById('continue-button');
    const unloadButton = document.getElementById('unload-button');
    const editButton = document.getElementById('edit-button');
    const addButton = document.getElementById('add-button');
    const deleteButton = document.getElementById('delete-button');
    const changeRowButton = document.getElementById('change-row-button');
    const inputLabel = document.getElementById('input-area-label');
    const inputArea = document.getElementById('input-area');
    const radioCSV = document.getElementById('radio-csv');

    const modalTitle = document.getElementById('modal-title');
    const modalCloseButton = document.getElementById('modal-close-button');

    let choseRowBlock = document.getElementById('chose-row');
    let choseKeyBlock = document.getElementById('chose-key');
    let typeNewValueBlock = document.getElementById('type-new-value');
    let newValueField = document.getElementById('new-value-field');
    let submitNewValueButton = document.getElementById('submit-new-value');


    let newRowNumber;
    let objectNumber;
    let keyName;
    let temporaryArray;
    let dataIncorrect;
    let table;
    let stringData;
    let tableData = [];
    let stringDataCSV;

    function showEditButtons() {
        unloadButton.classList.remove('hidden');
        editButton.classList.remove('hidden');
        addButton.classList.remove('hidden');
        deleteButton.classList.remove('hidden');
        changeRowButton.classList.remove('hidden');
    }

    function initTable() {
        if (!radioCSV.checked) {
            inputLabel.innerText = '*Input data is incorrect. Please make sure that JSON written according to the example';
            stringData = inputArea.value;
            let stringIsValid = stringData.match(/^\[\{.+:".+"\}\]$/ig) ? true : false;
            if (!stringIsValid) {
                inputLabel.classList.remove('hidden');
            } else {
                showEditButtons();
                inputLabel.classList.add('hidden');
                tableData = window.parsing.parseJSON(stringData);
                inputArea.value = '';
                if (table !== undefined) {
                    window.drawTable.removeTable();
                    window.drawTable.createTable(tableData);
                } else {
                    window.drawTable.createTable(tableData);
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
                inputLabel.classList.add('hidden');
                tableData = window.parsing.convertCSV(stringDataCSV);
                inputArea.value = '';
                if (table !== undefined) {
                    window.drawTable.removeTable();
                    window.drawTable.createTable(tableData);
                } else {
                    window.drawTable.createTable(tableData);
                }
            }
        }
    }

    function editTable() {
        modalTitle.innerText = `Choose the row that you want to edit`;
        window.modal.showModal();
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
                            window.modal.closeModal();
                            window.drawTable.removeTable();
                            window.drawTable.createTable(tableData);
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
            newObject[key] === null || newObject[key] === '' ? dataIncorrect = true : dataIncorrect = false
        }
        if (!dataIncorrect) {
            tableData.push(newObject);
            window.drawTable.removeTable();
            window.drawTable.createTable(tableData);
        } else {
            alert('Введенные данные не соовтествуют шаблону. Попробуйте ещё раз')
        }
    }

    function invertRows() {
        modalTitle.innerText = 'Choose first inverting row';
        window.modal.showModal();
        choseRowBlock.classList.remove('hidden');
        for (let i = 0; i < tableData.length; i++) {
            let rowNumButton = document.createElement('button');
            rowNumButton.classList.add('btn', 'btn-secondary', 'small-button');
            rowNumButton.onclick = function () {
                let rowNumber = i;
                temporaryArray = tableData[i];
                window.modal.clearBlock(choseRowBlock);
                modalTitle.innerText = 'Choose second inverting row';
                for (let j = 0; j < tableData.length; j++) {
                    if (j !== rowNumber) {
                        let secondRowNumButton = document.createElement('button');
                        secondRowNumButton.classList.add('btn', 'btn-secondary', 'small-button');
                        secondRowNumButton.innerText = j;
                        secondRowNumButton.onclick = function () {
                            newRowNumber = j;
                            tableData[i] = tableData[newRowNumber];
                            tableData[newRowNumber] = temporaryArray;
                            window.modal.closeModal();
                            window.drawTable.removeTable();
                            window.drawTable.createTable(tableData);
                        };
                        choseRowBlock.append(secondRowNumButton);
                    }
                }
            };
            choseRowBlock.append(rowNumButton);
            rowNumButton.innerText = `${i}`;
        }
    }

    function deleteRow() {
        modalTitle.innerText = 'Chose row number that you want to delete';
        window.modal.showModal();
        for (let i = 0; i < tableData.length; i++) {
            let rowNumButton = document.createElement('button');
            let rowToDelete;
            rowNumButton.classList.add('btn', 'btn-secondary', 'small-button');
            rowNumButton.innerText = i;
            rowNumButton.onclick = function () {
                rowToDelete = i;
                tableData.splice(rowToDelete, 1);
                window.modal.closeModal();
                window.drawTable.removeTable();
                window.drawTable.createTable(tableData)
            };
            choseRowBlock.append(rowNumButton);
        }
    }

    function unloadResult() {
        if (!radioCSV.checked) {
            inputArea.value = window.parsing.reverseConvertJSON(tableData);
        } else {
            inputArea.value = window.parsing.reverseConvertCSV(tableData);
        }
    }

    continueButton.onclick = initTable;
    editButton.onclick = editTable;
    deleteButton.onclick = deleteRow;
    addButton.onclick = addNewRow;
    changeRowButton.onclick = invertRows;
    unloadButton.onclick = unloadResult;
    modalCloseButton.onclick = window.modal.closeModal;
}());