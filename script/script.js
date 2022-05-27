const STIKERS_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/stickers/';
const DELETE_BTN_CLASS = 'stickers__close';
const INPUT_STIKERS = 'stickers_input';

const stickersTemplate = document.querySelector('.stickers_template').innerHTML;
const stickersBlock = document.querySelector('.stickers__block');
const addButton = document.querySelector('.add_btn');
const textArea = document.querySelector('.stickers__text');

addButton.addEventListener('click', addNewStiker);
document.addEventListener('focusout', saveNewStikersText);
stickersBlock.addEventListener('click', onClickAction);

let stickersList = [];

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

function addNewStiker(stickers) {
   fetch(STIKERS_URL, {
        method: 'POST',
        body: JSON.stringify(stickers),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((data) => {
        fetchList();
    });
}

function saveNewStikersText(e) {
    id = getStickerId(e.target);

        fetch(STIKERS_URL + id, {
        method: 'PUT',
        body: JSON.stringify(setStickersText()),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((data) => {
        fetchList();
    });
}

function setStickersText() {

}

function getStickerId(el) {
  return el.closest('.' + INPUT_STIKERS).dataset.id;
}

function generateStickersHTML(stickers) {
    return stickersTemplate.replace('{{id}}', stickers.id)
                            .replace('{{description}}', stickers.description);
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