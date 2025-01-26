// Получаем body для применения блокировки
const body = document.body;

// Флаг для отслеживания состояния неприкосновенности
let isProtected = false;
let lastTap = 0; // Время последнего клика

// Функция для включения и выключения режима неприкосновенности
document.body.addEventListener("touchend", function(event) {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;

  // Если два клика меньше чем за 500ms (для мобильных)
  if (tapLength < 500 && tapLength > 0) {
    // Переключаем состояние защиты
    isProtected = !isProtected;
    
    // Добавляем или удаляем класс блокировки
    if (isProtected) {
      body.classList.add("blocked");
    } else {
      body.classList.remove("blocked");
    }
  }
  
  lastTap = currentTime; // Обновляем время последнего клика
});
