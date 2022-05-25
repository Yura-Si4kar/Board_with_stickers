const STIKERS_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/stickers/';
const DELETE_BTN_CLASS = 'stickers__close';
const INPUT_STIKERS = 'stickers_input';

const stickersTemplate = document.querySelector('.stickers_template').innerHTML;
const stickersBlock = document.querySelector('.stickers__block');
const addButton = document.querySelector('.add_btn');
const textArea = document.querySelector('.stickers__text');

addButton.addEventListener('click', addNewStiker);
document.addEventListener('focusout', saveNewStikerText);
stickersBlock.addEventListener('click', onClickAction);

let stickersList = {};

init();

function init() {
    fetchList();
}

function fetchList() {
        fetch(STIKERS_URL)
        .then((res) => res.json())
        .then((data) => {
            stickersList = data;
            renderList();        
    })
}

function addNewStiker(sticker) {
   fetch(STIKERS_URL, {
        method: 'POST',
        body: JSON.stringify(sticker),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((data) => {
        fetchList();
    });
}

function saveNewStikerText(e, sticker) {
    id = getStickerId(e.target);

        fetch(STIKERS_URL + id, {
        method: 'PUT',
        body: JSON.stringify(sticker),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((data) => {
        fetchList();
        e.preventDefault();
    });
}

function getStickerId(el) {
  return el.closest('.' + INPUT_STIKERS).dataset.id;
}

function generateStickersHTML(sticker) {
    return stickersTemplate.replace('{{id}}', sticker.id)
                            .replace('{{description}}', sticker.description);
}

function renderList() {
    stickersBlock.innerHTML = stickersList.map(generateStickersHTML).join('\n');
}

function onClickAction(e) {
  id = getStickerId(e.target);
  
  if(e.target.classList.contains(DELETE_BTN_CLASS)) {
        fetch(STIKERS_URL + id, {
            method: 'DELETE',
        }).then((data) => {
            fetchList();
        });
  }
}