$(() => {
    const STIKERS_URL = 'https://643684438205915d34f5a44a.mockapi.io/goods/';

    const DELETE_BUTTON_CLASS = 'stickers__close';
    const INPUT_STIKERS_CLASS = 'stickers__text';

    const stickersTemplate = $('#stickersTemplate').html();
    const $stickersBlock = $('.stickers__block');
    const $addButton = $('.add_btn');

    let stickersList = [];

    $addButton.on('click', addStickers);
    $stickersBlock.on('click','.' + DELETE_BUTTON_CLASS, onCloseBtnClick);
    $stickersBlock.on('focusout','.' + INPUT_STIKERS_CLASS, saveNewStikersText);

    init();

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

    function addStickers() {
        const stickers = {
            description: '',
        };

        fetch(STIKERS_URL, {
            method: 'POST',
            body: JSON.stringify(stickers),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((stickers) => {
            insertStickers(stickers);
        });
    }

    function onCloseBtnClick(e) {
        deleteStickers(e.target.parentElement.dataset.id);
        $(this).parent().slideUp(3000);
    }

    function saveNewStikersText(e) {
        const $element = $(e.target);

        updateStickers($element.parent().data('id'), $element.val());
    }

    function updateStickers(id, changes) {
        const stickers = stickersList.find((el) => el.id == id);

        let newNote = { ...stickers, description: changes };

        fetch(STIKERS_URL + id, {
            method: 'PUT',
            body: JSON.stringify(newNote),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    function deleteStickers(id) {
        let $el = stickersList.find((el) => el.id === id);
        stickersList = stickersList.filter((el) => el.id != id);

        fetch(STIKERS_URL + id, {
            method: 'DELETE',
        }).then(() => { 
            renderList();
        });
    }
    
    function insertStickers(stickers) {
        $stickersBlock.append(generateStickersHtml(stickers));
    }

    function renderList() {
        $stickersBlock.html(stickersList.map(generateStickersHtml).join('\n'));
    }

    function generateStickersHtml(stickers) {
        return stickersTemplate.replace('{{id}}', stickers.id)
                                .replace('{{description}}', stickers.description);
    }
});