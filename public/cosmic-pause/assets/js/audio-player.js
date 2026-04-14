(() => {
  const STORAGE_KEYS = {
    enabled: 'spacemung.audio.enabled',
    lastTrack: 'spacemung.audio.lastTrack',
    collapsed: 'spacemung.audio.collapsed',
  };

  const DEFAULT_OPTIONS = {
    manifestUrl: 'assets/audio/playlist.json',
    volume: 0.42,
  };

  function getTrackLabel(track) {
    if (!track) return '';
    if (track.title && track.title.trim()) {
      return track.title.trim();
    }

    const source = track.src || '';
    const filename = source.split('/').pop() || source;
    return filename.replace(/\.[^/.]+$/, '');
  }

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

  function setCollapsed(collapsed) {
    localStorage.setItem(STORAGE_KEYS.collapsed, collapsed ? '1' : '0');
  }

  function isCollapsed() {
    return localStorage.getItem(STORAGE_KEYS.collapsed) === '1';
  }

  function createAudioPanel(audio) {
    const style = document.createElement('style');
    style.textContent = `
      #spacemung-audio-panel {
        position: fixed;
        right: 16px;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 204px;
        max-width: min(320px, calc(100vw - 32px));
        padding: 10px 12px;
        border-radius: 18px;
        background: rgba(5, 10, 18, 0.72);
        color: #eef4ff;
        backdrop-filter: blur(12px);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
        transition: width 0.18s ease, padding 0.18s ease, opacity 0.18s ease;
      }
      #spacemung-audio-panel[data-state="off"] {
        opacity: 0.72;
      }
      #spacemung-audio-panel.is-collapsed {
        min-width: 0;
        width: 54px;
        max-width: 54px;
        padding: 6px;
        gap: 0;
        border-radius: 999px;
      }
      #spacemung-audio-toggle {
        width: 42px;
        height: 42px;
        flex-shrink: 0;
        border: none;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        color: #eef4ff;
        font: 700 18px/1 Arial, sans-serif;
        cursor: pointer;
      }
      #spacemung-audio-visual {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
      }
      #spacemung-audio-meta {
        min-width: 0;
        flex: 1;
        display: grid;
        gap: 2px;
        user-select: none;
        justify-items: start;
        text-align: left;
      }
      #spacemung-audio-panel.is-collapsed #spacemung-audio-meta {
        display: none;
      }
      #spacemung-audio-bars {
        display: inline-flex;
        align-items: end;
        gap: 3px;
        height: 14px;
      }
      #spacemung-audio-bars span {
        display: block;
        width: 3px;
        height: 4px;
        border-radius: 999px;
        background: #8dc8ff;
        opacity: 0.28;
        transform-origin: bottom center;
      }
      #spacemung-audio-panel[data-state="on"] #spacemung-audio-bars span {
        opacity: 0.95;
        animation: spacemung-audio-wave 1s ease-in-out infinite;
      }
      #spacemung-audio-panel[data-state="on"] #spacemung-audio-bars span:nth-child(2) {
        animation-delay: 0.15s;
      }
      #spacemung-audio-panel[data-state="on"] #spacemung-audio-bars span:nth-child(3) {
        animation-delay: 0.3s;
      }
      #spacemung-audio-panel[data-state="on"] #spacemung-audio-bars span:nth-child(4) {
        animation-delay: 0.45s;
      }
      #spacemung-audio-panel[data-state="on"] #spacemung-audio-bars span:nth-child(5) {
        animation-delay: 0.6s;
      }
      #spacemung-audio-track {
        overflow: hidden;
        color: #ffffff;
        font: 700 13px/1.3 Arial, sans-serif;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
      }
      #spacemung-audio-toast {
        position: fixed;
        right: 18px;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 88px);
        z-index: 1001;
        max-width: min(260px, calc(100vw - 36px));
        padding: 10px 12px;
        border-radius: 14px;
        background: rgba(5, 10, 18, 0.9);
        color: #eef4ff;
        font: 12px/1.45 Arial, sans-serif;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
        opacity: 0;
        transform: translateY(8px);
        pointer-events: none;
        transition: opacity 0.18s ease, transform 0.18s ease;
      }
      #spacemung-audio-toast.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
      #spacemung-audio-toast::after {
        content: "";
        position: absolute;
        right: 26px;
        bottom: -8px;
        width: 14px;
        height: 14px;
        background: rgba(5, 10, 18, 0.9);
        transform: rotate(45deg);
        border-radius: 2px;
      }
      @keyframes spacemung-audio-wave {
        0%, 100% { transform: scaleY(0.4); }
        50% { transform: scaleY(1); }
      }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('aside');
    panel.id = 'spacemung-audio-panel';
    panel.innerHTML = `
      <button type="button" id="spacemung-audio-toggle" aria-label="Toggle background music">♪</button>
      <div id="spacemung-audio-visual">
        <span id="spacemung-audio-bars"><span></span><span></span><span></span><span></span><span></span></span>
      </div>
      <div id="spacemung-audio-meta">
        <div id="spacemung-audio-track">No Track</div>
      </div>
    `;

    const toast = document.createElement('div');
    toast.id = 'spacemung-audio-toast';
    toast.textContent = '음악이 필요하면 아래 플레이 버튼을 눌러 주세요.';

    const button = panel.querySelector('#spacemung-audio-toggle');
    const trackLabel = panel.querySelector('#spacemung-audio-track');
    let toastTimer = null;
    let hasShownWaitingToast = false;

    function showToast() {
      clearTimeout(toastTimer);
      toast.classList.add('is-visible');
      toastTimer = window.setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 2200);
    }

    function hideToast() {
      clearTimeout(toastTimer);
      toast.classList.remove('is-visible');
    }

    function syncCollapsed() {
      panel.classList.toggle('is-collapsed', isCollapsed());
    }

    const sync = (state = 'on', track = null) => {
      panel.dataset.state = state;
      button.textContent = audio.paused ? '♫' : '♪';

      if (state === 'waiting') {
        if (!hasShownWaitingToast) {
          showToast();
          hasShownWaitingToast = true;
        }
      } else {
        hideToast();
      }

      if (track) {
        trackLabel.textContent = getTrackLabel(track);
      } else if (!trackLabel.textContent.trim()) {
        trackLabel.textContent = 'No Track';
      }
    };

    syncCollapsed();
    sync(audio.paused ? 'off' : 'on');

    button.addEventListener('click', async (event) => {
      event.stopPropagation();

      if (isCollapsed()) {
        setCollapsed(false);
        syncCollapsed();
        return;
      }

      if (audio.paused) {
        setEnabled(true);
        try {
          await audio.play();
          sync('on', audio._track || null);
        } catch (error) {
          sync('waiting', audio._track || null);
        }
      } else {
        audio.pause();
        setEnabled(false);
        sync('off', audio._track || null);
      }
    });

    panel.addEventListener('click', (event) => {
      if (event.target === button) {
        return;
      }
      setCollapsed(!isCollapsed());
      syncCollapsed();
    });

    document.body.appendChild(panel);
    document.body.appendChild(toast);
    return { panel, sync };
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
    audio.autoplay = true;
    audio.preload = 'auto';
    audio.playsInline = true;
    audio.volume = settings.volume;
    audio.loop = false;

    const { sync } = createAudioPanel(audio);

    const playTrack = async (track) => {
      if (!track) return;
      audio._track = track;
      audio.src = track.src;
      audio.load();
      audio.dataset.title = track.title || '';
      localStorage.setItem(STORAGE_KEYS.lastTrack, track.src);
      if (!isEnabled()) {
        sync('off', track);
        return;
      }

      try {
        await audio.play();
        sync('on', track);
      } catch (error) {
        sync('waiting', track);
      }
    };

    const queueRandomTrack = async () => {
      await playTrack(pickRandomTrack(playlist));
    };

    audio.addEventListener('ended', () => {
      queueRandomTrack();
    });

    const retryAutoplay = async () => {
      if (!isEnabled() || !audio.src || !audio.paused) {
        return;
      }

      try {
        await audio.play();
        sync('on', audio._track || null);
      } catch (error) {
        sync('waiting', audio._track || null);
      }
    };

    const unlockAudio = async () => {
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      if (!audio.src) {
        await queueRandomTrack();
        return;
      }

      if (isEnabled() && audio.paused) {
        await retryAutoplay();
      }
    };

    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('pageshow', retryAutoplay);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        retryAutoplay();
      }
    });

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
