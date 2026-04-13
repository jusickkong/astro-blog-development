(() => {
  const STORAGE_KEYS = {
    language: 'spacemung.language',
  };

  const LANGUAGE_OPTIONS = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' },
    { code: 'zh-CN', label: '简体中文' },
    { code: 'es', label: 'Español' },
  ];

  const messages = {
    ko: {
      'settings.heading': '언어',      
      'home.title': '우주 멍때리기',
      'home.subtitle': '생각 없이, 그냥 바라보기',
      'home.lead': '휴대폰으로 열고, 더 크게 보고 싶으면 TV나 모니터로 캐스팅해서 멍 때리기.',
      'home.cast.title': '큰 화면 추천',
      'home.cast.desc': '모바일에서도 볼 수 있지만, TV나 모니터에 띄우면 훨씬 편하게 오래 바라볼 수 있어요.',
      'home.moon.title': '달 멍',
      'home.moon.desc': '아무도 없는 달에서 혼자',
      'home.mercury.title': '수성 멍',
      'home.mercury.desc': '태양 가까이에서 조용히 타는 바위 행성',
      'home.earth.title': '지구 멍',
      'home.earth.desc': '푸른 대기와 밤빛이 천천히 지나가는 장면',
      'home.sun.title': '태양 멍',
      'home.sun.desc': '타오르는데 왜 이렇게 고요하지',
      'home.mars.title': '화성 멍',
      'home.mars.desc': '아무것도 없어서 오히려 좋아',
      'home.system.title': '태양계 멍',
      'home.system.desc': '다들 각자의 궤도로 열심히',
      'home.warp.title': '별 쏟아지기',
      'home.warp.desc': '워프 드라이브 켰을 때 그 느낌',
      'home.space.title': '우주 멍',
      'home.space.desc': '저 별은 이미 없어졌을지도',
      'home.milkyway.title': '은하수 멍',
      'home.milkyway.desc': '별빛이 강처럼 번지는 깊은 밤하늘',
      'home.saturn.title': '토성 멍',
      'home.saturn.desc': '고리와 함께 천천히 떠 있는 행성',
      'home.jupiter.title': '목성 멍',
      'home.jupiter.desc': '가로 밴드가 조용히 흐르는 거대 기체 행성',
      'home.venus.title': '금성 멍',
      'home.venus.desc': '두꺼운 대기 속에 밀폐된 주황빛 행성',
      'pages.moon.title': '선명한 달',
      'pages.moon.loading': '달 로딩 중...',
      'pages.moon.error': '로딩 실패... 인터넷 확인 후 새로고침',
      'pages.mercury.title': '수성',
      'pages.mercury.loading': '수성 텍스처 로딩 중...',
      'pages.mercury.info': '수성 · 태양 가까이에서 조용히 타는 바위 행성',
      'pages.mercury.error': '수성 텍스처를 불러오지 못했습니다. 파일 경로를 확인해 주세요.',
      'pages.earth.title': '지구',
      'pages.earth.info': '지구 · 푸른 대기와 밤빛이 천천히 지나가는 장면',
      'pages.sun.title': '고해상도 태양',
      'pages.sun.loading': '태양 8K 텍스처 로딩 중... (15초 정도 걸릴 수 있어요)',
      'pages.sun.error': '로딩 실패... 새로고침 후 다시 시도해 주세요',
      'pages.mars.title': '화성',
      'pages.mars.loading': '화성 로딩 중...',
      'pages.venus.title': '금성',
      'pages.venus.info': '금성 · 드래그로 회전, 휠로 확대',
      'pages.jupiter.title': '목성',
      'pages.jupiter.info': '목성',
      'pages.saturn.title': '토성',
      'pages.saturn.info': '토성',
      'pages.space.title': '우주 멍',
      'pages.milkyway.title': '은하수 멍',
      'pages.milkyway.info': '은하수 · 별빛이 강처럼 번지는 깊은 밤하늘',
      'pages.warp.title': '별 쏟아지기',
      'pages.system.title': '태양계 시뮬레이션',
      'pages.system.info': '태양계 시뮬레이션<br>마우스 드래그: 회전 • 휠: 줌',
      'pages.system.slower': '느리게',
      'pages.system.faster': '빠르게',
      'planets.mercury': '수성',
      'planets.venus': '금성',
      'planets.earth': '지구',
      'planets.mars': '화성',
      'planets.jupiter': '목성',
      'planets.saturn': '토성',
      'units.earthYearSeconds': '1 지구년 = {value}초',
      'units.earthYearMinutes': '1 지구년 = {value}분',
      'units.earthYearHours': '1 지구년 = {value}시간',
    },
    en: {
      'settings.heading': 'Language',      
      'home.title': 'Cosmic Pause',
      'home.subtitle': 'Switch off and just drift',
      'home.lead': 'Open it on your phone, then cast it to a TV or monitor when you want a larger, calmer view.',
      'home.cast.title': 'Best On A Bigger Screen',
      'home.cast.desc': 'It works on mobile, but it feels better when you leave it on a TV or monitor.',
      'home.moon.title': 'Moon Drift',
      'home.moon.desc': 'Alone on the quiet moon',
      'home.mercury.title': 'Mercury Drift',
      'home.mercury.desc': 'A quiet rock world close to the sun',
      'home.earth.title': 'Earth Drift',
      'home.earth.desc': 'Blue airglow and night lights rolling by',
      'home.sun.title': 'Sun Drift',
      'home.sun.desc': 'Burning bright, somehow still calm',
      'home.mars.title': 'Mars Drift',
      'home.mars.desc': 'Nothing there, and that helps',
      'home.system.title': 'Solar System Drift',
      'home.system.desc': 'Everyone moving on their own orbit',
      'home.warp.title': 'Star Warp',
      'home.warp.desc': 'That moment when warp drive kicks in',
      'home.space.title': 'Deep Space',
      'home.space.desc': 'That star may already be gone',
      'home.milkyway.title': 'Milky Way Drift',
      'home.milkyway.desc': 'A deep night sky where starlight spills like a river',
      'home.saturn.title': 'Saturn Drift',
      'home.saturn.desc': 'A ringed planet floating in slow motion',
      'home.jupiter.title': 'Jupiter Drift',
      'home.jupiter.desc': 'A giant world with slow moving bands',
      'home.venus.title': 'Venus Drift',
      'home.venus.desc': 'A sealed orange world under thick clouds',
      'pages.moon.title': 'Moon',
      'pages.moon.loading': 'Loading the moon...',
      'pages.moon.error': 'Loading failed. Check your internet and refresh.',
      'pages.mercury.title': 'Mercury',
      'pages.mercury.loading': 'Loading Mercury texture...',
      'pages.mercury.info': 'Mercury · A quiet rock world close to the sun',
      'pages.mercury.error': 'Could not load the Mercury texture. Check the file path.',
      'pages.earth.title': 'Earth',
      'pages.earth.info': 'Earth · Blue atmosphere and night lights drifting by',
      'pages.sun.title': 'Sun',
      'pages.sun.loading': 'Loading 8K sun texture... (this can take about 15 seconds)',
      'pages.sun.error': 'Loading failed. Refresh and try again.',
      'pages.mars.title': 'Mars',
      'pages.mars.loading': 'Loading Mars...',
      'pages.venus.title': 'Venus',
      'pages.venus.info': 'Venus · drag to rotate, wheel to zoom',
      'pages.jupiter.title': 'Jupiter',
      'pages.jupiter.info': 'Jupiter',
      'pages.saturn.title': 'Saturn',
      'pages.saturn.info': 'Saturn',
      'pages.space.title': 'Deep Space',
      'pages.milkyway.title': 'Milky Way',
      'pages.milkyway.info': 'Milky Way · A deep night sky where starlight spills like a river',
      'pages.warp.title': 'Star Warp',
      'pages.system.title': 'Solar System Simulation',
      'pages.system.info': 'Solar System Simulation<br>Drag to orbit • Wheel to zoom',
      'pages.system.slower': 'Slower',
      'pages.system.faster': 'Faster',
      'planets.mercury': 'Mercury',
      'planets.venus': 'Venus',
      'planets.earth': 'Earth',
      'planets.mars': 'Mars',
      'planets.jupiter': 'Jupiter',
      'planets.saturn': 'Saturn',
      'units.earthYearSeconds': '1 Earth year = {value} sec',
      'units.earthYearMinutes': '1 Earth year = {value} min',
      'units.earthYearHours': '1 Earth year = {value} hr',
    },
    fr: {
      'settings.heading': 'Langue',
      'home.title': 'Pause Cosmique',
      'home.subtitle': 'Ne pense a rien, regarde simplement',
      'home.lead': 'Ouvre-le sur ton telephone, puis diffuse-le sur une TV ou un moniteur quand tu veux une vue plus grande et plus calme.',
      'home.cast.title': 'Mieux Sur Grand Ecran',
      'home.cast.desc': 'Ca fonctionne sur mobile, mais l experience est meilleure sur une TV ou un moniteur.',
      'home.moon.title': 'Pause Lune',
      'home.moon.desc': 'Seul sur une lune silencieuse',
      'home.mercury.title': 'Pause Mercure',
      'home.mercury.desc': 'Un monde rocheux calme tout pres du soleil',
      'home.earth.title': 'Pause Terre',
      'home.earth.desc': 'Lueur bleue et villes de nuit qui glissent lentement',
      'home.sun.title': 'Pause Soleil',
      'home.sun.desc': 'Ca brule, mais tout reste calme',
      'home.mars.title': 'Pause Mars',
      'home.mars.desc': 'Il n y a rien, et c est justement bien',
      'home.system.title': 'Pause Systeme Solaire',
      'home.system.desc': 'Chacun avance sur sa propre orbite',
      'home.warp.title': 'Pluie d Etoiles',
      'home.warp.desc': 'Comme au moment ou le moteur warp s enclenche',
      'home.space.title': 'Pause Espace',
      'home.space.desc': 'Cette etoile n existe peut-etre deja plus',
      'home.milkyway.title': 'Pause Voie Lactee',
      'home.milkyway.desc': 'Un ciel profond ou la lumiere des etoiles coule comme une riviere',
      'home.saturn.title': 'Pause Saturne',
      'home.saturn.desc': 'Une planete annelee qui flotte lentement',
      'home.jupiter.title': 'Pause Jupiter',
      'home.jupiter.desc': 'Une geante gazeuse aux bandes tranquilles',
      'home.venus.title': 'Pause Venus',
      'home.venus.desc': 'Une planete orange enfermee sous une atmosphere dense',
      'pages.moon.title': 'Lune',
      'pages.moon.loading': 'Chargement de la lune...',
      'pages.moon.error': 'Echec du chargement. Verifie ta connexion puis recharge.',
      'pages.mercury.title': 'Mercure',
      'pages.mercury.loading': 'Chargement de la texture de Mercure...',
      'pages.mercury.info': 'Mercure · Un monde rocheux calme tout pres du soleil',
      'pages.mercury.error': 'Impossible de charger la texture de Mercure. Verifie le chemin du fichier.',
      'pages.earth.title': 'Terre',
      'pages.earth.info': 'Terre · Une lueur bleue et des villes nocturnes qui glissent lentement',
      'pages.sun.title': 'Soleil',
      'pages.sun.loading': 'Chargement de la texture solaire 8K... (cela peut prendre environ 15 secondes)',
      'pages.sun.error': 'Echec du chargement. Recharge puis reessaie.',
      'pages.mars.title': 'Mars',
      'pages.mars.loading': 'Chargement de Mars...',
      'pages.venus.title': 'Venus',
      'pages.venus.info': 'Venus · fais glisser pour tourner, utilise la molette pour zoomer',
      'pages.jupiter.title': 'Jupiter',
      'pages.jupiter.info': 'Jupiter',
      'pages.saturn.title': 'Saturne',
      'pages.saturn.info': 'Saturne',
      'pages.space.title': 'Espace Profond',
      'pages.milkyway.title': 'Voie Lactee',
      'pages.milkyway.info': 'Voie Lactee · Un ciel profond ou la lumiere des etoiles coule comme une riviere',
      'pages.warp.title': 'Pluie d Etoiles',
      'pages.system.title': 'Simulation du Systeme Solaire',
      'pages.system.info': 'Simulation du Systeme Solaire<br>Glisser pour orbiter • Roulette pour zoomer',
      'pages.system.slower': 'Plus lent',
      'pages.system.faster': 'Plus rapide',
      'planets.mercury': 'Mercure',
      'planets.venus': 'Venus',
      'planets.earth': 'Terre',
      'planets.mars': 'Mars',
      'planets.jupiter': 'Jupiter',
      'planets.saturn': 'Saturne',
      'units.earthYearSeconds': '1 annee terrestre = {value} s',
      'units.earthYearMinutes': '1 annee terrestre = {value} min',
      'units.earthYearHours': '1 annee terrestre = {value} h',
    },
    de: {
      'settings.heading': 'Sprache',
      'home.title': 'Kosmische Pause',
      'home.subtitle': 'Einfach abschalten und nur schauen',
      'home.lead': 'Offne es auf deinem Handy und ubertrage es auf einen Fernseher oder Monitor, wenn du eine grossere und ruhigere Ansicht willst.',
      'home.cast.title': 'Besser Auf Grossem Bildschirm',
      'home.cast.desc': 'Es funktioniert mobil, wirkt aber auf einem Fernseher oder Monitor deutlich besser.',
      'home.moon.title': 'Mond Pause',
      'home.moon.desc': 'Allein auf einem stillen Mond',
      'home.mercury.title': 'Merkur Pause',
      'home.mercury.desc': 'Eine ruhige Felswelt nahe an der Sonne',
      'home.earth.title': 'Erde Pause',
      'home.earth.desc': 'Blauer Luftschein und Nachtlichter ziehen langsam vorbei',
      'home.sun.title': 'Sonnen Pause',
      'home.sun.desc': 'Es brennt und bleibt trotzdem ruhig',
      'home.mars.title': 'Mars Pause',
      'home.mars.desc': 'Da ist nichts, und genau das ist gut',
      'home.system.title': 'Sonnensystem Pause',
      'home.system.desc': 'Alle bewegen sich auf ihrer eigenen Bahn',
      'home.warp.title': 'Sternenflug',
      'home.warp.desc': 'Wie in dem Moment, wenn der Warp Antrieb startet',
      'home.space.title': 'Weltraum Pause',
      'home.space.desc': 'Dieser Stern existiert vielleicht schon nicht mehr',
      'home.milkyway.title': 'Milchstrasse Pause',
      'home.milkyway.desc': 'Ein tiefer Nachthimmel, in dem Sternenlicht wie ein Fluss fliesst',
      'home.saturn.title': 'Saturn Pause',
      'home.saturn.desc': 'Ein Ringplanet, der langsam im Raum schwebt',
      'home.jupiter.title': 'Jupiter Pause',
      'home.jupiter.desc': 'Ein riesiger Gasplanet mit ruhigen Banden',
      'home.venus.title': 'Venus Pause',
      'home.venus.desc': 'Ein orangefarbener Planet unter dichter Atmosphare',
      'pages.moon.title': 'Mond',
      'pages.moon.loading': 'Mond wird geladen...',
      'pages.moon.error': 'Laden fehlgeschlagen. Prufe deine Verbindung und lade neu.',
      'pages.mercury.title': 'Merkur',
      'pages.mercury.loading': 'Merkur Textur wird geladen...',
      'pages.mercury.info': 'Merkur · Eine ruhige Felswelt nahe an der Sonne',
      'pages.mercury.error': 'Die Merkur Textur konnte nicht geladen werden. Prufe den Dateipfad.',
      'pages.earth.title': 'Erde',
      'pages.earth.info': 'Erde · Blauer Atmospharenschein und Nachtlichter ziehen langsam vorbei',
      'pages.sun.title': 'Sonne',
      'pages.sun.loading': '8K Sonnen Textur wird geladen... (das kann etwa 15 Sekunden dauern)',
      'pages.sun.error': 'Laden fehlgeschlagen. Bitte neu laden und erneut versuchen.',
      'pages.mars.title': 'Mars',
      'pages.mars.loading': 'Mars wird geladen...',
      'pages.venus.title': 'Venus',
      'pages.venus.info': 'Venus · ziehen zum Drehen, Mausrad zum Zoomen',
      'pages.jupiter.title': 'Jupiter',
      'pages.jupiter.info': 'Jupiter',
      'pages.saturn.title': 'Saturn',
      'pages.saturn.info': 'Saturn',
      'pages.space.title': 'Tiefer Weltraum',
      'pages.milkyway.title': 'Milchstrasse',
      'pages.milkyway.info': 'Milchstrasse · Ein tiefer Nachthimmel, in dem Sternenlicht wie ein Fluss fliesst',
      'pages.warp.title': 'Sternenflug',
      'pages.system.title': 'Sonnensystem Simulation',
      'pages.system.info': 'Sonnensystem Simulation<br>Ziehen zum Orbit • Mausrad zum Zoomen',
      'pages.system.slower': 'Langsamer',
      'pages.system.faster': 'Schneller',
      'planets.mercury': 'Merkur',
      'planets.venus': 'Venus',
      'planets.earth': 'Erde',
      'planets.mars': 'Mars',
      'planets.jupiter': 'Jupiter',
      'planets.saturn': 'Saturn',
      'units.earthYearSeconds': '1 Erdjahr = {value} s',
      'units.earthYearMinutes': '1 Erdjahr = {value} min',
      'units.earthYearHours': '1 Erdjahr = {value} h',
    },
    ja: {
      'settings.heading': '言語',
      'home.title': 'スペースぼーっと',
      'home.subtitle': '何も考えず、ただ眺める',
      'home.lead': 'スマホで開いて、もっと大きく見たいときはテレビやモニターにキャストしてぼーっと眺める。',
      'home.cast.title': '大きな画面向け',
      'home.cast.desc': 'スマホでも使えますが、テレビやモニターに映すともっと心地よく見られます。',
      'home.moon.title': '月ぼーっと',
      'home.moon.desc': '誰もいない月でひとり',
      'home.mercury.title': '水星ぼーっと',
      'home.mercury.desc': '太陽の近くで静かに焼ける岩の惑星',
      'home.earth.title': '地球ぼーっと',
      'home.earth.desc': '青い大気と夜の光がゆっくり流れていく',
      'home.sun.title': '太陽ぼーっと',
      'home.sun.desc': '燃えているのに静か',
      'home.mars.title': '火星',
      'home.mars.desc': '何もないからこそいい',
      'home.system.title': '太陽系ぼーっと',
      'home.system.desc': 'みんな自分の軌道を進む',
      'home.warp.title': '星のワープ',
      'home.warp.desc': 'ワープドライブが入った瞬間みたい',
      'home.space.title': '宇宙ぼーっと',
      'home.space.desc': 'あの星はもう消えているかも',
      'home.milkyway.title': '天の川ぼーっと',
      'home.milkyway.desc': '星の光が川のように流れる深い夜空',
      'home.saturn.title': '土星ぼーっと',
      'home.saturn.desc': '環とともに静かに漂う惑星',
      'home.jupiter.title': '木星ぼーっと',
      'home.jupiter.desc': '縞がゆっくり流れる巨大ガス惑星',
      'home.venus.title': '金星ぼーっと',
      'home.venus.desc': '厚い大気に包まれた橙色の惑星',
      'pages.moon.title': '月',
      'pages.moon.loading': '月を読み込み中...',
      'pages.moon.error': '読み込みに失敗しました。接続を確認して再読み込みしてください。',
      'pages.mercury.title': '水星',
      'pages.mercury.loading': '水星テクスチャを読み込み中...',
      'pages.mercury.info': '水星・太陽の近くで静かに焼ける岩の惑星',
      'pages.mercury.error': '水星テクスチャを読み込めませんでした。ファイルパスを確認してください。',
      'pages.earth.title': '地球',
      'pages.earth.info': '地球・青い大気と夜の光がゆっくり流れていく',
      'pages.sun.title': '太陽',
      'pages.sun.loading': '8K太陽テクスチャを読み込み中...（15秒ほどかかることがあります）',
      'pages.sun.error': '読み込みに失敗しました。再読み込みしてください。',
      'pages.mars.title': '火星',
      'pages.mars.loading': '火星を読み込み中...',
      'pages.venus.title': '金星',
      'pages.venus.info': '金星・ドラッグで回転、ホイールで拡大',
      'pages.jupiter.title': '木星',
      'pages.jupiter.info': '木星',
      'pages.saturn.title': '土星',
      'pages.saturn.info': '土星',
      'pages.space.title': '宇宙',
      'pages.milkyway.title': '天の川',
      'pages.milkyway.info': '天の川・星の光が川のように流れる深い夜空',
      'pages.warp.title': 'スターワープ',
      'pages.system.title': '太陽系シミュレーション',
      'pages.system.info': '太陽系シミュレーション<br>ドラッグで回転・ホイールでズーム',
      'pages.system.slower': '遅く',
      'pages.system.faster': '速く',
      'planets.mercury': '水星',
      'planets.venus': '金星',
      'planets.earth': '地球',
      'planets.mars': '火星',
      'planets.jupiter': '木星',
      'planets.saturn': '土星',
      'units.earthYearSeconds': '地球1年 = {value}秒',
      'units.earthYearMinutes': '地球1年 = {value}分',
      'units.earthYearHours': '地球1年 = {value}時間',
    },
    'zh-CN': {
      'settings.heading': '语言',      
      'home.title': '太空发呆',
      'home.subtitle': '什么都不想，只是看着',
      'home.lead': '先在手机上打开，想看得更舒服时再投到电视或显示器上发呆。',
      'home.cast.title': '更适合大屏',
      'home.cast.desc': '手机上也能用，但投到电视或显示器上会更舒服。',
      'home.moon.title': '月球发呆',
      'home.moon.desc': '独自待在寂静的月球上',
      'home.mercury.title': '水星发呆',
      'home.mercury.desc': '靠近太阳、安静燃烧的岩石行星',
      'home.earth.title': '地球发呆',
      'home.earth.desc': '蓝色大气和夜晚灯光缓缓掠过',
      'home.sun.title': '太阳发呆',
      'home.sun.desc': '明明在燃烧，却很安静',
      'home.mars.title': '火星发呆',
      'home.mars.desc': '什么都没有，反而更好',
      'home.system.title': '太阳系发呆',
      'home.system.desc': '大家都沿着自己的轨道前进',
      'home.warp.title': '星际跃迁',
      'home.warp.desc': '像是开启曲速引擎的那一刻',
      'home.space.title': '深空发呆',
      'home.space.desc': '那颗星也许已经消失了',
      'home.milkyway.title': '银河发呆',
      'home.milkyway.desc': '星光像河流一样铺开的深夜天空',
      'home.saturn.title': '土星发呆',
      'home.saturn.desc': '带着光环缓慢漂浮的行星',
      'home.jupiter.title': '木星发呆',
      'home.jupiter.desc': '条带缓缓流动的巨型气态行星',
      'home.venus.title': '金星发呆',
      'home.venus.desc': '厚重大气包裹下的橙色行星',
      'pages.moon.title': '月球',
      'pages.moon.loading': '正在加载月球...',
      'pages.moon.error': '加载失败。请检查网络后刷新。',
      'pages.mercury.title': '水星',
      'pages.mercury.loading': '正在加载水星纹理...',
      'pages.mercury.info': '水星 · 靠近太阳、安静燃烧的岩石行星',
      'pages.mercury.error': '无法加载水星纹理。请检查文件路径。',
      'pages.earth.title': '地球',
      'pages.earth.info': '地球 · 蓝色大气和夜晚灯光缓缓掠过',
      'pages.sun.title': '太阳',
      'pages.sun.loading': '正在加载 8K 太阳纹理...（可能需要约15秒）',
      'pages.sun.error': '加载失败。请刷新后重试。',
      'pages.mars.title': '火星',
      'pages.mars.loading': '正在加载火星...',
      'pages.venus.title': '金星',
      'pages.venus.info': '金星 · 拖动旋转，滚轮缩放',
      'pages.jupiter.title': '木星',
      'pages.jupiter.info': '木星',
      'pages.saturn.title': '土星',
      'pages.saturn.info': '土星',
      'pages.space.title': '深空',
      'pages.milkyway.title': '银河',
      'pages.milkyway.info': '银河 · 星光像河流一样铺开的深夜天空',
      'pages.warp.title': '星际跃迁',
      'pages.system.title': '太阳系模拟',
      'pages.system.info': '太阳系模拟<br>拖动旋转 · 滚轮缩放',
      'pages.system.slower': '更慢',
      'pages.system.faster': '更快',
      'planets.mercury': '水星',
      'planets.venus': '金星',
      'planets.earth': '地球',
      'planets.mars': '火星',
      'planets.jupiter': '木星',
      'planets.saturn': '土星',
      'units.earthYearSeconds': '1 地球年 = {value} 秒',
      'units.earthYearMinutes': '1 地球年 = {value} 分',
      'units.earthYearHours': '1 地球年 = {value} 小时',
    },
    es: {
      'settings.heading': 'Idioma',      
      'home.title': 'Pausa Cósmica',
      'home.subtitle': 'Sin pensar, solo mirar',
      'home.lead': 'Ábrelo en tu móvil y, si quieres una vista más amplia y tranquila, envíalo a una TV o monitor.',
      'home.cast.title': 'Mejor En Pantalla Grande',
      'home.cast.desc': 'Se puede usar en el teléfono, pero se disfruta más cuando lo dejas en una TV o monitor.',
      'home.moon.title': 'Luna',
      'home.moon.desc': 'A solas en una luna silenciosa',
      'home.mercury.title': 'Mercurio',
      'home.mercury.desc': 'Un mundo rocoso y silencioso cerca del sol',
      'home.earth.title': 'Tierra',
      'home.earth.desc': 'Brillo azul y luces nocturnas pasando despacio',
      'home.sun.title': 'Sol',
      'home.sun.desc': 'Arde y aun así se siente en calma',
      'home.mars.title': 'Marte',
      'home.mars.desc': 'No hay nada, y eso ayuda',
      'home.system.title': 'Sistema Solar',
      'home.system.desc': 'Cada uno sigue su propia órbita',
      'home.warp.title': 'Salto estelar',
      'home.warp.desc': 'Como encender el motor warp',
      'home.space.title': 'Espacio profundo',
      'home.space.desc': 'Esa estrella quizá ya no existe',
      'home.milkyway.title': 'Via Lactea',
      'home.milkyway.desc': 'Un cielo nocturno profundo donde la luz de las estrellas corre como un rio',
      'home.saturn.title': 'Saturno',
      'home.saturn.desc': 'Un planeta anillado flotando despacio',
      'home.jupiter.title': 'Júpiter',
      'home.jupiter.desc': 'Un gigante gaseoso con bandas serenas',
      'home.venus.title': 'Venus',
      'home.venus.desc': 'Un planeta naranja bajo una atmósfera densa',
      'pages.moon.title': 'Luna',
      'pages.moon.loading': 'Cargando la luna...',
      'pages.moon.error': 'La carga falló. Revisa tu conexión y recarga.',
      'pages.mercury.title': 'Mercurio',
      'pages.mercury.loading': 'Cargando la textura de Mercurio...',
      'pages.mercury.info': 'Mercurio · Un mundo rocoso y silencioso cerca del sol',
      'pages.mercury.error': 'No se pudo cargar la textura de Mercurio. Revisa la ruta del archivo.',
      'pages.earth.title': 'Tierra',
      'pages.earth.info': 'Tierra · Brillo azul y luces nocturnas pasando despacio',
      'pages.sun.title': 'Sol',
      'pages.sun.loading': 'Cargando textura solar 8K... (puede tardar unos 15 segundos)',
      'pages.sun.error': 'La carga falló. Recarga e inténtalo de nuevo.',
      'pages.mars.title': 'Marte',
      'pages.mars.loading': 'Cargando Marte...',
      'pages.venus.title': 'Venus',
      'pages.venus.info': 'Venus · arrastra para girar, rueda para ampliar',
      'pages.jupiter.title': 'Júpiter',
      'pages.jupiter.info': 'Júpiter',
      'pages.saturn.title': 'Saturno',
      'pages.saturn.info': 'Saturno',
      'pages.space.title': 'Espacio profundo',
      'pages.milkyway.title': 'Via Lactea',
      'pages.milkyway.info': 'Via Lactea · Un cielo nocturno profundo donde la luz de las estrellas corre como un rio',
      'pages.warp.title': 'Salto estelar',
      'pages.system.title': 'Simulación del Sistema Solar',
      'pages.system.info': 'Simulación del Sistema Solar<br>Arrastra para orbitar • Rueda para zoom',
      'pages.system.slower': 'Más lento',
      'pages.system.faster': 'Más rápido',
      'planets.mercury': 'Mercurio',
      'planets.venus': 'Venus',
      'planets.earth': 'Tierra',
      'planets.mars': 'Marte',
      'planets.jupiter': 'Júpiter',
      'planets.saturn': 'Saturno',
      'units.earthYearSeconds': '1 año terrestre = {value} s',
      'units.earthYearMinutes': '1 año terrestre = {value} min',
      'units.earthYearHours': '1 año terrestre = {value} h',
    },
  };

  function detectLanguage() {
    const raw = (navigator.language || 'en').toLowerCase();
    if (raw.startsWith('ko')) return 'ko';
    if (raw.startsWith('fr')) return 'fr';
    if (raw.startsWith('de')) return 'de';
    if (raw.startsWith('ja')) return 'ja';
    if (raw.startsWith('zh')) return 'zh-CN';
    if (raw.startsWith('es')) return 'es';
    return 'en';
  }

  function getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.language) || detectLanguage();
  }

  function resolveLanguage(languageCode) {
    if (messages[languageCode]) {
      return languageCode;
    }

    return detectLanguage();
  }

  function interpolate(template, vars = {}) {
    return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
  }

  function t(key, vars = {}) {
    const lang = resolveLanguage(getLanguage());
    const dict = messages[lang] || messages.en;
    const fallback = messages.en[key] || key;
    return interpolate(dict[key] || fallback, vars);
  }

  function setLanguage(languageCode) {
    localStorage.setItem(STORAGE_KEYS.language, languageCode);
    applyLocale();
  }

  function applyLocale(root = document) {
    const lang = resolveLanguage(getLanguage());
    document.documentElement.lang = lang;

    root.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      element.innerHTML = t(key);
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.setAttribute('placeholder', t(key));
    });

    const titleKey = document.body?.dataset?.titleKey;
    if (titleKey) {
      document.title = t(titleKey);
    }

    window.dispatchEvent(new CustomEvent('spacemung:localechange', {
      detail: {
        language: lang,
      },
    }));
  }

  function installSettingsPanel() {
    if (document.getElementById('spacemung-locale-panel')) {
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
      #spacemung-locale-panel {
        position: fixed;
        top: 14px;
        right: 14px;
        z-index: 1000;
        width: min(248px, calc(100vw - 28px));
        padding: 12px;
        border-radius: 18px;
        background: rgba(5, 10, 18, 0.9);
        border: 1px solid rgba(140, 175, 255, 0.16);
        backdrop-filter: blur(14px);
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.38);
        color: #eaf2ff;
        font-family: Arial, sans-serif;
      }
      #spacemung-locale-panel h2 {
        margin: 0 0 12px;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #b9ceff;
      }
      #spacemung-locale-panel label {
        display: block;
        margin: 10px 0 6px;
        font-size: 12px;
        color: #d6e3ff;
      }
      #spacemung-locale-panel select {
        width: 100%;
        min-height: 44px;
        padding: 11px 40px 11px 12px;
        border-radius: 12px;
        border: 1px solid rgba(140, 175, 255, 0.2);
        background-color: rgba(255, 255, 255, 0.08);
        color: #f6f9ff;
        font-size: 14px;
        line-height: 1.4;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image:
          linear-gradient(45deg, transparent 50%, #cddcff 50%),
          linear-gradient(135deg, #cddcff 50%, transparent 50%);
        background-position:
          calc(100% - 18px) calc(50% - 3px),
          calc(100% - 12px) calc(50% - 3px);
        background-size: 6px 6px, 6px 6px;
        background-repeat: no-repeat;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }
      #spacemung-locale-panel select:focus {
        outline: none;
        border-color: rgba(140, 175, 255, 0.45);
        box-shadow: 0 0 0 3px rgba(73, 120, 220, 0.18);
      }
      #spacemung-locale-panel select option {
        background: #0d1423;
        color: #eef4ff;
      }
      @media (max-width: 640px) {
        #spacemung-locale-panel {
          top: calc(env(safe-area-inset-top, 0px) + 10px);
          right: 12px;
          left: auto;
          bottom: auto;
          width: min(220px, calc(100vw - 24px));
        }
      }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('aside');
    panel.id = 'spacemung-locale-panel';
    panel.innerHTML = `
      <h2 data-i18n="settings.heading"></h2>
      <select id="spacemung-language"></select>
    `;

    document.body.appendChild(panel);

    const languageSelect = panel.querySelector('#spacemung-language');

    LANGUAGE_OPTIONS.forEach((option) => {
      const el = document.createElement('option');
      el.value = option.code;
      el.textContent = option.label;
      languageSelect.appendChild(el);
    });

    languageSelect.addEventListener('change', (event) => {
      setLanguage(event.target.value);
    });

    function syncControls() {
      languageSelect.value = getLanguage();
    }

    window.addEventListener('spacemung:localechange', syncControls);
    syncControls();
  }

  window.SpaceMungI18n = {
    applyLocale,
    detectLanguage,
    getLanguage,
    installSettingsPanel,
    resolveLanguage,
    setLanguage,
    t,
  };
})();
