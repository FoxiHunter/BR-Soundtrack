document.addEventListener('DOMContentLoaded', () => {
  const songs = [
    { title: 'Song 1', file: '../uploads/Akon.mp3' },
    { title: 'Song 2', file: '../uploads/ASCEND.mp3' },
    { title: 'Song 3', file: '../uploads/Automotivo.mp3' },
    { title: 'Song 4', file: '../uploads/DJ_ANXVAR.mp3' },
    { title: 'Song 5', file: '../uploads/DJ_BRYAN.mp3' },
    { title: 'Song 6', file: '../uploads/Miksy.mp3' },
    { title: 'Song 7', file: '../uploads/MXCCREE.mp3' },
    { title: 'Song 8', file: '../uploads/NewJeans.mp3' },
    { title: 'Song 9', file: '../uploads/ZALOR TREVA.mp3' },
    { title: 'Song 10', file: '../uploads/ZALOR hammali.mp3' },
    { title: 'Song 11', file: '../uploads/ZALOR Nomi.mp3' },
    { title: 'Song 12', file: '../uploads/ZALOR Vermillion.mp3' },
  ];

  const playlistFrame = document.getElementById('playlist-frame');
  let currentAudio = null; // Текущий аудиофайл
  let isAudioPlaying = false;  // Статус воспроизведения

  // Получаем единственный визуализатор
  const visualizerWrapper = document.getElementById('visualizer-wrapper');
  const canvas = document.getElementById('visualizer');
  const ctx = canvas.getContext('2d');
  let audioContext;
  let analyser;
  let dataArray;

  // Создание фрейма для песни
  function createSongFrame(song, index) {
    const songFrame = document.createElement('div');
    songFrame.classList.add('song');

    const audio = document.createElement('audio');
    audio.src = song.file;
    audio.controls = true;
    audio.classList.add('audio-element');
    audio.dataset.index = index;

    const title = document.createElement('p');
    title.classList.add('song-title');
    title.textContent = song.title;

    // Обработчик на воспроизведение / паузу
    audio.addEventListener('play', () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();  // Останавливаем текущую песню
        currentAudio.currentTime = 0; // Сбрасываем позицию
      }

      currentAudio = audio;
      isAudioPlaying = true;

      // Инициализация контекста аудио для визуализатора
      initAudioContext(audio);
      visualizerWrapper.classList.remove('hidden');
    });

    audio.addEventListener('pause', () => {
      if (audio.currentTime === 0) {
        currentAudio = null;
        isAudioPlaying = false;

        // Скрываем визуализатор
        visualizerWrapper.classList.add('hidden');
      }
    });

    // Обработчик на завершение песни
    audio.addEventListener('ended', () => {
      playNextSong();
      visualizerWrapper.classList.add('hidden'); // Скрываем визуализатор, когда песня заканчивается
    });

    songFrame.appendChild(audio);
    songFrame.appendChild(title);

    return songFrame;
  }

  songs.forEach((song, index) => {
    const songFrame = createSongFrame(song, index);
    playlistFrame.appendChild(songFrame);
  });

  // Функция для воспроизведения следующей песни
  function playNextSong() {
    const nextSongIndex = (currentAudio.dataset.index + 1) % songs.length;
    const nextAudio = playlistFrame.children[nextSongIndex].querySelector('audio');
    nextAudio.play();
  }

  // Инициализация аудио контекста для визуализатора
  function initAudioContext(audio) {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    // Создаем новый источник для текущего аудио
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Запуск визуализатора
    drawVisualizer();
  }

  // Отрисовка визуализатора
  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / (dataArray.length * 2);
    const centerX = canvas.width / 2;
    let barHeight;
    let xLeft = centerX;
    let xRight = centerX;

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = dataArray[i] / 2;
      const r = 1000;
      const g = 0 + barHeight;
      const b = 1000;

ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      ctx.fillRect(xLeft, canvas.height - barHeight, barWidth - 2, barHeight);
      ctx.fillRect(xRight, canvas.height - barHeight, barWidth - 2, barHeight);

      xLeft -= barWidth;
      xRight += barWidth;
    }
  }

  // Активация контекста по клику (для Chrome/Firefox)
  document.body.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  });
});
