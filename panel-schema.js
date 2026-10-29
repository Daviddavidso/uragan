/* ==========================================================================
   СХЕМА ПРОЕКТА «URAGAN FINANCE» ДЛЯ ЯДРА ПАНЕЛИ (panel-core.js).

   Ядро одинаковое во всех витринах и про формат data.js ничего не знает.
   Здесь сказано только: какие у карточки поля и как разложить общий вид
   обратно в файл, который читает сайт: SITE / CATEGORIES / OFFERS.

   Порядок полей карточки = порядок полей в форме панели.
   ========================================================================== */

window.ADMIN = {
  brand: 'Uragan Finance',
  dataFile: 'data.js',
  draftKey: 'uragan_admin_draft',
  preview: 'index.html?draft=1',

  /* Ссылки партнёрок приходят без erid — маркировку печатаем только если
     она реально есть в ссылке, выдумывать её нельзя. */
  requireErid: false,

  /* Карточку без ссылки сайт показывает с надписью «Скоро» и без кнопки —
     панель отмечает такие карточки в списке. */
  flagNoUrl: true,

  /* Блок «Логотип»: либо готовый файл, либо цветная плашка с инициалами.
     Цвет плашки сайт при необходимости затемняет сам, так что испортить
     контраст через панель невозможно. */
  logo: true,

  /* Карточка на сайте тёмная — от неё ядро считает контраст плашки. */
  surface: '#111A2B',
  defaultTone: { bg: '#14532D', ink: '#FFFFFF' },

  /* Готовые логотипы из img/logos. Своя картинка грузится кнопкой
     «Выбрать файл…» в карточке. */
  presets: [
    { label: 'МФО и займы', items: [
      { name: 'А Деньги', value: 'img/logos/adengi.png' },
      { name: 'Быстроденьги', value: 'img/logos/bistrodengi.png' },
      { name: 'Деньги на дом', value: 'img/logos/denginadom.png' },
      { name: 'Деньги сразу', value: 'img/logos/dengisrazu.png' },
      { name: 'До зарплаты', value: 'img/logos/dozarplati.png' },
      { name: 'Доброзайм', value: 'img/logos/dobrozaim.png' },
      { name: 'Займер', value: 'img/logos/zaymer.png' },
      { name: 'Займиго', value: 'img/logos/zaymigo.png' },
      { name: 'ЛайкЗайм', value: 'img/logos/likezaim.png' },
      { name: 'Лайм-Займ', value: 'img/logos/limezaim.png' },
      { name: 'МигКредит', value: 'img/logos/migcredit.png' },
      { name: 'Надо денег', value: 'img/logos/nadodeneg.svg' },
      { name: 'Простой вопрос', value: 'img/logos/prostoyvopros.png' },
      { name: 'Свои люди', value: 'img/logos/svoiludi.png' },
      { name: 'СМС Финанс', value: 'img/logos/smsfinance.png' },
      { name: 'Срочно деньги', value: 'img/logos/srochnodengi.png' },
      { name: 'Бустра', value: 'img/logos/boostra.jpg' },
      { name: 'Турбозайм', value: 'img/logos/turbozaim.png' },
      { name: 'Умные наличные', value: 'img/logos/smartcash.svg' },
      { name: 'Центрофинанс', value: 'img/logos/centrofinans.png' },
      { name: 'BelkaCredit', value: 'img/logos/belkacredit.png' },
      { name: 'Credit7', value: 'img/logos/credit7.png' },
      { name: 'JoyMoney', value: 'img/logos/joymoney.png' },
      { name: 'Max.Credit', value: 'img/logos/maxcredit.png' },
      { name: 'MoneyMan', value: 'img/logos/moneyman.png' },
      { name: 'OneClickMoney', value: 'img/logos/oneclickmoney.png' },
      { name: 'Platiza', value: 'img/logos/platiza.png' },
      { name: 'Rocketman', value: 'img/logos/rocketman.png' },
      { name: 'Webbankir', value: 'img/logos/webbankir.png' }
    ] }
  ],

  /* Только то, что сайт действительно показывает. */
  site: [
    { key: 'brand',   label: 'Название сайта', required: true,
      hint: 'Стоит в шапке, в подвале и в заголовке вкладки браузера.' },
    { key: 'tagline', label: 'Строка над заголовком',
      hint: 'Мелкая строка с точкой на первом экране: «29 микрофинансовых компаний в одном месте». Число в начале сайт подставляет сам — по числу карточек на сайте.' },
    { key: 'lead',    label: 'Абзац под заголовком', type: 'textarea',
      hint: 'Два-три предложения о том, что человек получит на сайте.' },
    { key: 'updated', label: 'Дата обновления условий',
      hint: 'Печатается в подвале: «Условия проверены 28.10.2026».' }
  ],

  groups: [
    { key: 'title', label: 'Название раздела', required: true, hint: 'Видно на кнопке-фильтре над каталогом.' },
    { key: 'cta',   label: 'Надпись на кнопках', required: true,
      hint: 'Одна на все карточки раздела: «Получить деньги», «Оформить карту».' }
  ],

  card: [
    { key: 'partner', label: 'Компания', required: true,
      hint: 'Крупная надпись рядом с логотипом: «Займер», «MoneyMan».' },
    { key: 'tag',     label: 'Тип продукта',
      hint: 'Мелкая подпись под названием: «микрозайм», «дебетовая карта».' },
    { key: 'sum',     label: 'Сумма', required: true,
      hint: 'Крупная строка на карточке. Сайт берёт из неё последнее число для ползунка «Сумма»: «до 100 000 ₽» → 100 000.' },
    { key: 'rate',    label: 'Ставка', required: true,
      hint: 'Например «0% первый займ» или «до 0,8% в день». Если тут есть «0%», карточка попадает в фильтр «Первый займ 0%».' },
    { key: 'term',    label: 'Срок', required: true,
      hint: 'Например «7–30 дней». Последнее число — максимум для ползунка «Срок».' },
    { key: 'age',     label: 'Возраст', hint: 'Например «от 18 лет».' },
    { key: 'note',    label: 'Описание', type: 'textarea',
      hint: 'Одно-два предложения о компании. Видно под условиями.' },
    { key: 'badges',  label: 'Плашки', type: 'lines',
      hint: 'По одной в строке: «Первый займ 0%», «Круглосуточно». Ими же работают кнопки-фильтры над каталогом.' },
    { key: 'url',     label: 'Партнёрская ссылка', type: 'url',
      hint: 'Вставьте ссылку из партнёрки целиком, вместе с метками и erid. Пока пусто — на карточке вместо кнопки стоит надпись «Скоро», а в списке панели — пометка.' }
  ],

  /* ---------------------------------------------- чтение --------------- */

  load: function () {
    var groups = CATEGORIES.map(function (c) {
      return { key: c.id, title: c.label, cta: c.cta };
    });

    var seen = {};
    var cards = OFFERS.map(function (o, i) {
      /* Устойчивый ключ: в файле его нет, а ядру он нужен, чтобы не путать
         карточки при перестановке. Считаем от названия компании. */
      var base = String(o.partner || '').toLowerCase()
        .replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40) || ('c' + i);
      var uid = base, n = 2;
      while (seen[uid]) uid = base + '-' + (n++);
      seen[uid] = true;

      return {
        uid: uid,
        group: o.cat,
        hidden: !!o.hidden,
        partner: o.partner || '',
        tag: o.tag || '',
        sum: o.sum || '',
        rate: o.rate || '',
        term: o.term || '',
        age: o.age || '',
        note: o.note || '',
        badges: (o.badges || []).slice(),
        url: o.url || '',
        logo: o.logo || '',
        /* Цвета плашки читаем всегда: даже у карточки с логотипом они
           переживают круговорот, иначе следующее сохранение затрёт выбор. */
        tone: { bg: (o.tone && o.tone.bg) || '#14532D', ink: (o.tone && o.tone.ink) || '#FFFFFF' }
      };
    });

    return {
      SITE: JSON.parse(JSON.stringify(SITE)),
      GROUPS: groups,
      CARDS: cards
    };
  },

  /* ---------------------------------------------- сборка файла --------- */

  build: function (m) {
    function js(v) { return JSON.stringify(v, null, 2); }
    function t(v) { return String(v == null ? '' : v).trim(); }

    var categories = m.GROUPS.map(function (g) {
      return { id: g.key, label: t(g.title), cta: t(g.cta) || 'Получить деньги' };
    });

    var offers = m.CARDS.map(function (c) {
      var o = {
        cat: c.group,
        partner: t(c.partner),
        tag: t(c.tag),
        logo: t(c.logo),
        tone: { bg: t(c.tone && c.tone.bg) || '#14532D', ink: t(c.tone && c.tone.ink) || '#FFFFFF' },
        sum: t(c.sum),
        rate: t(c.rate),
        term: t(c.term),
        age: t(c.age),
        note: t(c.note),
        badges: (c.badges || []).map(t).filter(Boolean),
        url: t(c.url)
      };
      if (c.hidden) o.hidden = true;
      return o;
    });

    return [
      '/* ═════════════════════════════════════════════════════════════════════════',
      '   КАТАЛОГ «URAGAN FINANCE» — единственный файл с предложениями.',
      '   Собран панелью ' + new Date().toLocaleString('ru-RU') + '.',
      '',
      '   Правится через panel.html. Руками тоже можно, но при следующем',
      '   сохранении из панели правки будут перезаписаны.',
      '',
      '   url    — партнёрская ссылка. Пусто — вместо кнопки надпись «Скоро».',
      '   sum    — сумма; последнее число в строке работает ползунком «Сумма».',
      '   term   — срок; последнее число — максимум дней.',
      '   badges — плашки на карточке, они же кнопки-фильтры над каталогом.',
      '',
      '   ВАЖНО ПРО ЦИФРЫ: суммы, ставки и сроки ставьте только те, что',
      '   подтверждены вашей партнёркой. Цифра «на глаз» — недостоверная',
      '   реклама: партнёрка может снять оффер, а ФАС — оштрафовать.',
      '   ═════════════════════════════════════════════════════════════════════════ */',
      '',
      'const SITE = ' + js(m.SITE) + ';',
      '',
      '/* cta — надпись на кнопке карточек этого раздела. */',
      'const CATEGORIES = ' + js(categories) + ';',
      '',
      'const OFFERS = ' + js(offers) + ';',
      ''
    ].join('\n');
  }
};
