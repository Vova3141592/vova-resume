// Добавили всем элементам класс "Прелоад", который в CSS для них выключает всякие transition (анимации), чтобы сайт спокойно мог загрузиться и не флексить.
$('*').addClass("preload")

// Функция для перемещения переключателя темы
function moveThemeSwitch() {
    const themeSwitch = $('.theme-switch');
    const nav = $('.nav');
    const about = $('.about');

    if (window.matchMedia('(max-width: 810px)').matches) {
        if (!$.contains(nav[0], themeSwitch[0])) {
            themeSwitch.prependTo(nav);
        }
    } else {
        if (!$.contains(about[0], themeSwitch[0])) {
            themeSwitch.appendTo(about);
        }
    }
}

// Вызываем функцию один раз после загрузки страницы
moveThemeSwitch();

// Добавляем обработчик события на изменение размера экрана
window.matchMedia('(max-width: 810px)').addEventListener('change', moveThemeSwitch);

// Добавили переменную "checkbox". Она будет двигать наш чекбокс в зависимости от того, какая тема включена.
let checkbox = document.querySelector("input[name=theme-switch]");
// Проверяем, есть ли в локальном хранилище "тёмная тема". Если есть, ставим её, переключаем чекбокс на тёмную.
if (localStorage.getItem("data-theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    checkbox.checked = true;
} else {

    // Если тёмной темы нет, проверяем, есть ли светлая. Если есть, ставим её, переключаем чекбокс на светлую.
    if (localStorage.getItem("data-theme") === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        checkbox.checked = false;
    } else {

        // Если ни тёмной, ни светлой темы в хранилище не нашлось, смотрим системные настройки (цвет приложений по умолчанию в Windows). Если в них есть предпочтение тёмной темы, ставим её, переключаем чекбокс на тёмную.
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.setAttribute("data-theme", "dark");
            checkbox.checked = true;
        } else {
            // Если в системных настройках тоже ничего нет, ставим белую тему, перемещаем чекбокс в светлый режим. Это будет тема по умолчанию.
            document.documentElement.setAttribute("data-theme", "light");
            checkbox.checked = false;
        }
    }
}

// Меняем тему, когда тыкаем на чекбокс
checkbox.addEventListener("change", (cb) => {
    document.documentElement.setAttribute(
        "data-theme",
        cb.target.checked ? "dark" : "light"
    );
    localStorage.setItem(
        "data-theme",
        cb.target.checked ? "dark" : "light"
    );
});

// Когда всё загрузилось, удаляем у всех элементов класс "preload", чтобы transition (анимации) снова работали
$(document).ready(function () {
    $("*").removeClass("preload");
});

// Для подсветки таблицы

$("tr").hover(function () {
    const $row = $(this);
    const rowIndex = $row.index();
    const $table = $row.closest('table');
    const $cells = $row.children('td[rowspan]');

    let startRow = rowIndex;
    let endRow = rowIndex;

    // Если у текущей строки есть объединенные ячейки
    if ($cells.length) {
        $cells.each(function () {
            const rowspan = parseInt($(this).attr('rowspan'), 10);
            endRow = Math.max(endRow, rowIndex + rowspan - 1);
        });
    } else {
        // Если у строки нет объединенных ячеек, проверяем предыдущие строки
        $row.prevAll().each(function () {
            const prevRow = $(this);
            const prevRowIndex = prevRow.index();
            prevRow.children('td[rowspan]').each(function () {
                const rowspan = parseInt($(this).attr('rowspan'), 10);
                if (prevRowIndex + rowspan > rowIndex) {
                    startRow = Math.min(startRow, prevRowIndex);
                }
            });
        });
    }

    // Подсвечиваем строки от startRow до endRow
    for (let i = startRow; i <= endRow; i++) {
        $table.find('tr').eq(i).addClass("highlight");
    }
}, function () {
    const $row = $(this);
    const rowIndex = $row.index();
    const $table = $row.closest('table');
    const $cells = $row.children('td[rowspan]');

    let startRow = rowIndex;
    let endRow = rowIndex;

    // Убираем подсветку аналогично
    if ($cells.length) {
        $cells.each(function () {
            const rowspan = parseInt($(this).attr('rowspan'), 10);
            endRow = Math.max(endRow, rowIndex + rowspan - 1);
        });
    } else {
        $row.prevAll().each(function () {
            const prevRow = $(this);
            const prevRowIndex = prevRow.index();
            prevRow.children('td[rowspan]').each(function () {
                const rowspan = parseInt($(this).attr('rowspan'), 10);
                if (prevRowIndex + rowspan > rowIndex) {
                    startRow = Math.min(startRow, prevRowIndex);
                }
            });
        });
    }

    for (let i = startRow; i <= endRow; i++) {
        $table.find('tr').eq(i).removeClass("highlight");
    }
});

// Кнопка для промотки наверх

$(function () {

    $('.up').click(function () {

        $('html, body').animate({ scrollTop: 0 }, 400);
        return false;
    });
});

// Курсор

const cursor = document.querySelector('.cursor');

const updateCursorPosition = (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
}

window.addEventListener('mousemove', updateCursorPosition);

// Курсор при наведении на кликабельные элементы

const clickable = document.querySelectorAll('.button, img.clickable, a svg, .link, .slider, .sun, .moon');
const cursorPath = document.querySelector('div.cursor svg g path');

clickable.forEach((clickableElement) => {

    clickableElement.addEventListener('mouseover', () => {
        cursorPath.style.cssText = 'fill: var(--accent-color-hover);'
    });

    clickableElement.addEventListener("mouseleave", () => {
        cursorPath.style.cssText = 'fill: var(--cursor-fill-color);'
    });

})

// Курсор при наведении на приближаемые элементы

const zoomed = document.querySelectorAll('.zoomed');
const cursorSVG = document.querySelector('div.cursor svg.cursor');
const zoomSVG = document.querySelector('div.cursor svg.zoom');

zoomed.forEach((zoomedElement) => {

    zoomedElement.addEventListener('mouseover', () => {
        cursorSVG.style.cssText = 'opacity: 0;'
        zoomSVG.style.cssText = 'opacity: 1;'
    });

    zoomedElement.addEventListener("mouseleave", () => {
        cursorSVG.style.cssText = 'opacity: 1;'
        zoomSVG.style.cssText = 'opacity: 0;'
    });

})

// Курсор при наведении на текст

// Функция для оборачивания содержимого в span
function wrapTextWithSpan() {
    const tagsToWrap = ['p', 'th', 'td', 'h1', 'h2', 'h3', 'h4'];

    tagsToWrap.forEach(tag => {
        const elements = document.querySelectorAll(tag);

        elements.forEach(el => {
            // Начинаем процесс оборачивания, если элемент не является потомком ссылки
            if (!isInsideLink(el)) {
                wrapTextNodes(el);
            }
        });
    });

    function wrapTextNodes(node) {
        node.childNodes.forEach(child => {
            // Если это текстовый узел и не пустой, оборачиваем его в span с классом "text-node"
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                const span = document.createElement('span');
                span.textContent = child.textContent;
                span.classList.add('text-node'); // Добавляем класс "text-node"
                child.replaceWith(span);
            }
        });
    }

    function isInsideLink(node) {
        // Проверяем, является ли элемент потомком ссылки <a>
        let parent = node.parentElement;
        while (parent) {
            if (parent.tagName.toLowerCase() === 'a') {
                return true;
            }
            parent = parent.parentElement;
        }
        return false;
    }
}

// Вызываем функцию
wrapTextWithSpan();

// Скрываем нестандартный курсор при наведении на текст
const textNode = document.querySelectorAll('span.text-node');

textNode.forEach((textElement) => {

    textElement.addEventListener('mouseover', () => {
        cursor.style.display = `none`;
    });

    textElement.addEventListener("mouseleave", () => {
        cursor.style.display = `block`;
    });

})