document.addEventListener("DOMContentLoaded", () => {
  const modeButton = document.querySelector(".mode-toggle");
  const body = document.body;
  const form = document.getElementById("codeForm");
  const codeInput = document.getElementById("codeInput");

  // Переключение темы
  modeButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    modeButton.textContent = body.classList.contains("dark-mode") ? "🌞" : "🌙";
  });

  // Обработка кода при отправке формы
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const code = codeInput.value.trim(); // Получаем значение из поля ввода
    const validCodes = {
      "9fZ!2qLp@7vXr4mBzT1#d5Dq6sJ8yU": "public/playlists/playlist1.html",
    };

    if (validCodes[code]) {
      window.location.href = validCodes[code]; // Перенаправляем на нужный файл
    } else {
      alert("Invalid code! Please try again.");
    }
  });
});
