(() => {
  const STORAGE_KEYS = {
    enabled: 'spacemung.audio.enabled',
    lastTrack: 'spacemung.audio.lastTrack',
  };

  const DEFAULT_OPTIONS = {
    manifestUrl: 'assets/audio/playlist.json',
    volume: 0.42,
  };

  function normalizeTrack(track) {
    if (!track) return null;
    if (typeof track === 'string') {
      return { src: track };
    }
    if (typeof track.src === 'string') {
      return {
        src: track.src,
        title: typeof track.title === 'string' ? track.title : '',
      };
    }
    return null;
  }

  async function loadPlaylist(manifestUrl) {
    const response = await fetch(manifestUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load playlist: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Playlist manifest must be an array.');
    }

    return data
      .map(normalizeTrack)
      .filter(Boolean)
      .filter((track) => typeof track.src === 'string' && track.src.length > 0);
  }

  function pickRandomTrack(playlist) {
    if (!playlist.length) return null;
    if (playlist.length === 1) return playlist[0];

    const lastTrack = localStorage.getItem(STORAGE_KEYS.lastTrack);
    const candidates = playlist.filter((track) => track.src !== lastTrack);
    const source = candidates.length ? candidates : playlist;
    return source[Math.floor(Math.random() * source.length)];
  }

  function setEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.enabled, enabled ? '1' : '0');
  }

  function isEnabled() {
    return localStorage.getItem(STORAGE_KEYS.enabled) !== '0';
  }

  function createToggleButton(audio) {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'spacemung-audio-toggle';
    button.setAttribute('aria-label', 'Toggle background music');
    button.textContent = '♪';

    const style = document.createElement('style');
    style.textContent = `
      #spacemung-audio-toggle {
        position: fixed;
        right: 16px;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
        z-index: 1000;
        width: 46px;
        height: 46px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 999px;
        background: rgba(5, 10, 18, 0.72);
        color: #eef4ff;
        font: 700 18px/1 Arial, sans-serif;
        cursor: pointer;
        backdrop-filter: blur(12px);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
      }
      #spacemung-audio-toggle[data-state="off"] {
        opacity: 0.58;
      }
      #spacemung-audio-toggle[data-state="waiting"]::after {
        content: "tap";
        position: absolute;
        left: 50%;
        top: -28px;
        transform: translateX(-50%);
        padding: 4px 7px;
        border-radius: 999px;
        background: rgba(5, 10, 18, 0.86);
        color: #dce8ff;
        font: 600 10px/1 Arial, sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
    `;
    document.head.appendChild(style);

    const sync = (state = 'on') => {
      button.dataset.state = state;
      button.textContent = audio.paused ? '♫' : '♪';
    };

    sync(audio.paused ? 'off' : 'on');

    button.addEventListener('click', async () => {
      if (audio.paused) {
        setEnabled(true);
        try {
          await audio.play();
          sync('on');
        } catch (error) {
          sync('waiting');
        }
      } else {
        audio.pause();
        setEnabled(false);
        sync('off');
      }
    });

    document.body.appendChild(button);
    return { button, sync };
  }

  async function initPageAudio(options = {}) {
    const settings = { ...DEFAULT_OPTIONS, ...options };

    let playlist = [];
    try {
      playlist = await loadPlaylist(settings.manifestUrl);
    } catch (error) {
      console.warn('[SpaceMungAudio]', error);
      return;
    }

    if (!playlist.length) {
      return;
    }

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = settings.volume;
    audio.loop = false;

    const { sync } = createToggleButton(audio);

    const playTrack = async (track) => {
      if (!track) return;
      audio.src = track.src;
      audio.dataset.title = track.title || '';
      localStorage.setItem(STORAGE_KEYS.lastTrack, track.src);
      if (!isEnabled()) {
        sync('off');
        return;
      }

      try {
        await audio.play();
        sync('on');
      } catch (error) {
        sync('waiting');
      }
    };

    const queueRandomTrack = async () => {
      await playTrack(pickRandomTrack(playlist));
    };

    audio.addEventListener('ended', () => {
      queueRandomTrack();
    });

    const unlockAudio = async () => {
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      if (!audio.src) {
        await queueRandomTrack();
        return;
      }

      if (isEnabled() && audio.paused) {
        try {
          await audio.play();
          sync('on');
        } catch (error) {
          sync('waiting');
        }
      }
    };

    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });

    await queueRandomTrack();

    window.addEventListener('beforeunload', () => {
      audio.pause();
      audio.src = '';
    });
  }

  window.SpaceMungAudio = {
    initPageAudio,
  };
})();
