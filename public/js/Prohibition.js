// Получаем кнопку и body
const toggleButton = document.getElementById("toggleButton");
const body = document.body;

// Флаг для отслеживания состояния неприкосновенности
let isProtected = false;
let lastClickTime = 0; // Время последнего клика

// Функция для включения и выключения режима неприкосновенности
toggleButton.addEventListener("click", function() {
  const currentTime = new Date().getTime();
  
  // Проверяем, было ли время между кликами меньше 500ms (для мобильных)
  if (currentTime - lastClickTime < 500) {
    // Если двойной клик, то отключаем защиту
    isProtected = false;
    body.classList.remove("blocked");
    toggleButton.textContent = "🔒";
  } else {
    // Если обычный клик, то включаем защиту
    isProtected = true;
    body.classList.add("blocked");
    toggleButton.textContent = "🚫"; // Меняем эмодзи на символ запрета
  }

  lastClickTime = currentTime; // Сохраняем время последнего клика
});