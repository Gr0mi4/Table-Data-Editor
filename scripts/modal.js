window.modal = (function() {
    const modalWindow = document.getElementById('modal-window');
    const modalOverlay = document.getElementById('modal-overlay');

    let choseRowBlock = document.getElementById('chose-row');
    let choseKeyBlock = document.getElementById('chose-key');
    let typeNewValueBlock = document.getElementById('type-new-value');
    let newValueField = document.getElementById('new-value-field');

    function showModal() {
        modalWindow.classList.add('showModal');
        modalOverlay.classList.remove('hidden');
    }

    function closeModal() {
        modalWindow.classList.remove('showModal');
        clearBlock(choseKeyBlock);
        choseRowBlock.classList.remove('hidden');
        clearBlock(choseRowBlock);
        choseKeyBlock.classList.add('hidden');
        typeNewValueBlock.classList.add('hidden');
        newValueField.innerText = '';
        modalOverlay.classList.add('hidden');
    }

    function clearBlock(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    return {
        showModal,
        closeModal,
        clearBlock
    }
}());