// Добавили всем элементам класс "Прелоад", который в CSS для них выключает всякие transition (анимации), чтобы сайт спокойно мог загрузиться и не флексить.
$('*').addClass("preload")

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
$(document).ready(function() {
  $("*").removeClass("preload");
});

$("tr").hover(function(){
  const $row = $(this);
  const rowIndex = $row.index();
  const $table = $row.closest('table');
  const $cells = $row.children('td[rowspan]');

  let startRow = rowIndex;
  let endRow = rowIndex;

  // Если у текущей строки есть объединенные ячейки
  if ($cells.length) {
      $cells.each(function(){
          const rowspan = parseInt($(this).attr('rowspan'), 10);
          endRow = Math.max(endRow, rowIndex + rowspan - 1);
      });
  } else {
      // Если у строки нет объединенных ячеек, проверяем предыдущие строки
      $row.prevAll().each(function(){
          const prevRow = $(this);
          const prevRowIndex = prevRow.index();
          prevRow.children('td[rowspan]').each(function(){
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
}, function(){
  const $row = $(this);
  const rowIndex = $row.index();
  const $table = $row.closest('table');
  const $cells = $row.children('td[rowspan]');

  let startRow = rowIndex;
  let endRow = rowIndex;

  // Убираем подсветку аналогично
  if ($cells.length) {
      $cells.each(function(){
          const rowspan = parseInt($(this).attr('rowspan'), 10);
          endRow = Math.max(endRow, rowIndex + rowspan - 1);
      });
  } else {
      $row.prevAll().each(function(){
          const prevRow = $(this);
          const prevRowIndex = prevRow.index();
          prevRow.children('td[rowspan]').each(function(){
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