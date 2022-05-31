const STIKERS_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/stickers/';

const DELETE_BUTTON_CLASS = 'stickers__close';
const INPUT_STIKERS_CLASS = 'stickers__text';

const stickersTemplate = document.getElementById('stickersTemplate').innerHTML;
const stickersBlock = document.querySelector('.stickers__block');
const addButton = document.querySelector('.add_btn');

let stickersList = [];

addButton.addEventListener('click', addStickers);
stickersBlock.addEventListener('click', onCloseBtnClick);
stickersBlock.addEventListener('focusout', saveNewStikersText);

init();

function onCloseBtnClick(e) {
    if (e.target.classList.contains(DELETE_BUTTON_CLASS)) {
        deleteStickers(e.target.parentElement.dataset.noteIndex);
    }
}

function saveNewStikersText(e) {
    const element = e.target;

    if (e.target.classList.contains(INPUT_STIKERS_CLASS)){
        updateStickers(
            element.parentElement.dataset.noteIndex,
            element.name,
            element.value,
        );
    }
}

function init() {
    getData();
}

function getData() {
    fetch(STIKERS_URL)
    .then((res) => res.json())
    .then((data) => {
        stickersList = data;
        renderList(stickersList);        
    })
}

function setData(data) {
    return (stickersList = data);
}

function addStickers() {
    const stickers = {
        description: '',
    };

    fetch(STIKERS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stickers),
    })
        .then((res) => res.json())
        .then((stickers) => {
            stickersList.push(stickers);
            insertStickers(stickers);
        });
}

function getStickersElement(id) {
    return stickersBlock.querySelector(`[data-note-index="${id}"]`);
}

function updateStickers(id, name, value) {
    const stickers = stickersList.find((el) => el.id == id);

    stickers[name] = value;

    fetch(STIKERS_URL + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stickers),
    });
}

function deleteStickers(id) {
    stickersList = stickersList.filter((el) => el.id != id);

    deleteStickersEl(id);

    fetch(STIKERS_URL + id, {
        method: 'DELETE',
    });
}

function deleteStickersEl(id) {
    const element = getStickersElement(id);

    element && element.remove();
}

function insertStickers(stickers) {
    stickersBlock.insertAdjacentHTML('beforeEnd', generateStickersHtml(stickers));
}

function renderList() {
    stickersBlock.innerHTML = stickersList.map(generateStickersHtml).join('\n');
}

function generateStickersHtml(stickers) {
    return stickersTemplate.replace('{{id}}', stickers.id)
                            .replace('{{description}}', stickers.description);
}