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
    { title: 'Song 10', file: '../uploads/hammali.mp3' },
    { title: 'Song 11', file: '../uploads/Nomi.mp3' },
    { title: 'Song 12', file: '../uploads/Vermillion.mp3' },
  ];

  const playlistFrame = document.getElementById('playlist-frame');
  let currentAudio = null;
  let lastPlayedIndex = -1;

  // Визуализатор
  const visualizerWrapper = document.getElementById('visualizer-wrapper');
  const canvas = document.getElementById('visualizer');
  const ctx = canvas.getContext('2d');
  let audioContext, analyser, dataArray;

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

    audio.addEventListener('play', () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio = audio;
      initAudioContext(audio);
      visualizerWrapper.classList.remove('hidden');
    });

    audio.addEventListener('pause', () => {
      if (audio.currentTime === 0) {
        currentAudio = null;
        visualizerWrapper.classList.add('hidden');
      }
    });

    audio.addEventListener('ended', () => {
      playNextSong();
      visualizerWrapper.classList.add('hidden');
    });

    songFrame.appendChild(audio);
    songFrame.appendChild(title);
    return songFrame;
  }

  songs.forEach((song, index) => {
    const songFrame = createSongFrame(song, index);
    playlistFrame.appendChild(songFrame);
  });

  function getRandomSongIndex() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === lastPlayedIndex);
    lastPlayedIndex = randomIndex;
    return randomIndex;
  }

  function playNextSong() {
    const nextSongIndex = getRandomSongIndex();
    const nextAudio = playlistFrame.children[nextSongIndex].querySelector('audio');
    nextAudio.play();
  }

  function initAudioContext(audio) {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    drawVisualizer();
  }

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
      const r = 255;
      const g = barHeight;
      const b = 255;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      ctx.fillRect(xLeft, canvas.height - barHeight, barWidth - 2, barHeight);
      ctx.fillRect(xRight, canvas.height - barHeight, barWidth - 2, barHeight);

      xLeft -= barWidth;
      xRight += barWidth;
    }
  }

document.body.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  });
});
