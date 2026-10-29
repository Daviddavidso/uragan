/* ═══════════════════════════════════════════════════════════════════════
   ВИТРИНА «URAGAN FINANCE» — первый экран, подбор и каталог.

   Каталог объявлен глобальными const в data.js (или data.php на хостинге
   с PHP). const мимо window не переприсвоить, поэтому работаем с копиями:
   на адресе index.html?draft=1 вместо боевого файла подставляется черновик
   из панели управления.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var site   = typeof SITE       !== 'undefined' ? SITE       : {};
  var cats   = typeof CATEGORIES !== 'undefined' ? CATEGORIES : [];
  var offers = typeof OFFERS     !== 'undefined' ? OFFERS     : [];

  if (/[?&]draft/.test(location.search)) {
    try {
      var draftFile = localStorage.getItem('uragan_admin_draft:file');
      if (draftFile) {
        var d = new Function(draftFile + '\n;return { SITE: SITE, CATEGORIES: CATEGORIES, OFFERS: OFFERS };')();
        site = d.SITE || site; cats = d.CATEGORIES || cats; offers = d.OFFERS || offers;
      }
    } catch (e) { /* битый черновик — показываем боевой каталог */ }
  }

  var live = offers.filter(function (o) { return !o.hidden; });

  /* ── мелкие помощники ─────────────────────────────────────────────── */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Последнее число строки: «до 100 000 ₽» → 100000, «7–30 дней» → 30.
     Пробелы бывают неразрывными и тонкими — выкидываем все сразу. */
  function lastNumber(text) {
    var m = String(text == null ? '' : text)
      .replace(/[\s   ]/g, '')
      .match(/\d+/g);
    return m ? parseInt(m[m.length - 1], 10) : 0;
  }

  function initials(name) {
    return String(name || '?').trim().split(/[\s,-]+/).slice(0, 2)
      .map(function (w) { return w.charAt(0); }).join('').toUpperCase();
  }

  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  function offersWord(n) { return plural(n, 'предложение', 'предложения', 'предложений'); }
  function daysWord(n)   { return plural(n, 'день', 'дня', 'дней'); }

  /* Тонкий пробел между разрядами: «100 000». Для скринридера то же число
     печатается без разделителей — «100000 рублей» он читает верно, а
     «100 000» иногда разбирает как «сто» и «ноль-ноль-ноль». */
  function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── разбор каталога ──────────────────────────────────────────────── */

  var items = live.map(function (o, i) {
    return {
      i: i,
      cat: o.cat,
      partner: o.partner || '',
      tag: o.tag || '',
      logo: o.logo || '',
      tone: o.tone || {},
      sum: o.sum || '',
      rate: o.rate || '',
      term: o.term || '',
      age: o.age || '',
      note: o.note || '',
      badges: (o.badges || []).filter(Boolean),
      url: o.url || '',
      sumMax: lastNumber(o.sum),
      termMax: lastNumber(o.term),
      zero: /(^|[^\d,.])0[\s ]*%/.test(String(o.rate || '')) ||
            (o.badges || []).some(function (b) { return /0\s*%/.test(b); })
    };
  });

  var ctaByCat = {};
  cats.forEach(function (c) { ctaByCat[c.id] = c.cta || 'Получить деньги'; });

  /* ── тексты сайта из панели ───────────────────────────────────────── */

  var brand = String(site.brand || '').trim();
  if (brand) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-brand]'), function (n) {
      n.textContent = brand;
    });
    /* Знак в шапке и подвале: «Uragan Finance» → URAGAN.FINANCE, точка
       зелёная. Точка — украшение, вслух ссылка читается по aria-label. */
    Array.prototype.forEach.call(document.querySelectorAll('[data-brand-mark]'), function (n) {
      var parts = brand.split(/\s+/);
      n.innerHTML = parts.length > 1
        ? esc(parts[0]) + '<span class="brand__dot" aria-hidden="true">.</span>' + esc(parts.slice(1).join(' '))
        : esc(brand);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-brand-initial]'), function (n) {
      n.textContent = brand.charAt(0).toUpperCase();
    });
    document.title = brand + ' — займы онлайн: ' + items.length + ' ' +
      plural(items.length, 'МФО', 'МФО', 'МФО') + ' в одном месте';
    Array.prototype.forEach.call(document.querySelectorAll('a.brand'), function (a) {
      a.setAttribute('aria-label', brand + ' — на главную');
    });
  }
  /* Число в начале строки над заголовком сайт ставит сам — по карточкам,
     которые реально видны: скрыли карточку в панели — число уменьшилось. */
  var tagline = document.querySelector('[data-tagline]');
  if (tagline && site.tagline) {
    tagline.textContent = String(site.tagline).replace(/^\s*\d+/, String(items.length));
  }
  var leadEl = document.querySelector('[data-lead]');
  if (leadEl && site.lead) leadEl.textContent = site.lead;
  Array.prototype.forEach.call(document.querySelectorAll('[data-updated]'), function (n) {
    if (site.updated) n.textContent = site.updated;
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-total]'), function (n) {
    n.textContent = String(items.length);
  });

  /* ── лента логотипов ──────────────────────────────────────────────── */

  var ribbon = document.getElementById('ribbon');
  var track  = document.getElementById('ribbon-track');
  if (track) {
    var seen = {}, row = '';
    items.forEach(function (o) {
      if (!o.logo || seen[o.logo]) return;
      seen[o.logo] = true;
      /* alt пустой намеренно: вся лента скрыта от скринридера, а те же
         компании перечислены карточками каталога. */
      row += '<li class="ribbon__item"><img src="' + esc(o.logo) + '" alt="" loading="lazy" decoding="async"></li>';
    });
    if (row) {
      track.innerHTML = row;
      var clone = track.cloneNode(true);
      clone.removeAttribute('id');
      track.parentNode.appendChild(clone);
    } else if (ribbon) {
      ribbon.hidden = true;
    }
  }

  var pauseBtn = document.getElementById('ribbon-pause');
  if (pauseBtn && ribbon) {
    /* Одна надпись — одно состояние: aria-pressed тут не ставим, иначе
       скринридер прочитает «Остановить движение, нажата» и перевернёт смысл. */
    pauseBtn.addEventListener('click', function () {
      var paused = ribbon.getAttribute('data-paused') === 'true';
      ribbon.setAttribute('data-paused', paused ? 'false' : 'true');
      pauseBtn.textContent = paused ? 'Остановить движение ленты' : 'Возобновить движение ленты';
    });
    if (reduced) {
      ribbon.setAttribute('data-paused', 'true');
      pauseBtn.textContent = 'Возобновить движение ленты';
    }
  }

  /* ── наклон карт за мышью ─────────────────────────────────────────── */

  /* Только мышь и только без «меньше движения»: движение запускает сам
     человек, само по себе ничего не качается. Не больше 8°. Кадры — через
     rAF с запасным таймером: в скрытой вкладке rAF не приходит. */
  var deck = document.getElementById('deck');
  var fineMq = window.matchMedia && window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (deck && fineMq) {
    var cardsEls = deck.querySelectorAll('.cc');
    var px = 0, py = 0, queued = false;
    var paint = function () {
      queued = false;
      Array.prototype.forEach.call(cardsEls, function (c) {
        c.style.setProperty('--ry', (px * 8).toFixed(2) + 'deg');
        c.style.setProperty('--rx', (-py * 6).toFixed(2) + 'deg');
      });
    };
    var onMove = function (e) {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      if (queued) return;
      queued = true;
      var done = false;
      var once = function () { if (!done) { done = true; paint(); } };
      requestAnimationFrame(once);
      setTimeout(once, 50);
    };
    var sync = function () {
      if (fineMq.matches) window.addEventListener('pointermove', onMove, { passive: true });
      else {
        window.removeEventListener('pointermove', onMove);
        px = 0; py = 0; paint();
      }
    };
    sync();
    if (fineMq.addEventListener) fineMq.addEventListener('change', sync);
  }

  /* ── топ первого экрана ───────────────────────────────────────────── */

  var spot = document.getElementById('spot-list');
  if (spot) {
    /* Три разных повода, а не три строки с одинаковой суммой: так сразу
       видно, чем каталог вообще отличается внутри. */
    function best(list, cmp) { return list.slice().sort(cmp)[0]; }
    var picks = [], used = {};
    [
      ['Максимальная сумма', function (a, b) { return b.sumMax - a.sumMax; }, null,
        function (o) { return [o.sum, o.term]; }],
      ['Самый долгий срок',  function (a, b) { return b.termMax - a.termMax; }, null,
        function (o) { return [o.term, o.sum]; }],
      ['Без процентов',      function (a, b) { return b.sumMax - a.sumMax; },
        function (o) { return o.zero; }, function (o) { return ['0%', o.sum]; }]
    ].forEach(function (rule) {
      var pool = items.filter(function (o) {
        return !used[o.i] && o.url && (!rule[2] || rule[2](o));
      });
      var pick = best(pool, rule[1]);
      if (!pick) return;
      used[pick.i] = true;
      var v = rule[3](pick);
      picks.push({ label: rule[0], o: pick, value: v[0], sub: v[1] });
    });

    spot.innerHTML = picks.map(function (p) {
      var o = p.o;
      var pic = o.logo
        ? '<span class="spot__logo"><img src="' + esc(o.logo) + '" alt="" decoding="async"></span>'
        : '<span class="spot__logo spot__logo--text" style="background:' + esc(o.tone.bg || '#14532D') +
          ';color:' + esc(o.tone.ink || '#fff') + '">' + esc(initials(o.partner)) + '</span>';
      return '<li><span class="spot__row">' + pic +
        '<span class="spot__cell"><span class="spot__name">' + esc(o.partner) + '</span>' +
        '<span class="spot__term">' + esc(p.label) + '</span></span>' +
        '<span class="spot__cell spot__right"><span class="spot__sum">' + esc(p.value) + '</span>' +
        '<span class="spot__term">' + esc(p.sub) + '</span></span></span></li>';
    }).join('');
  }

  /* ── карточка ─────────────────────────────────────────────────────── */

  function cardHTML(o) {
    var cta = ctaByCat[o.cat] || 'Получить деньги';

    var logo = o.logo
      ? '<span class="card__logo"><img src="' + esc(o.logo) + '" alt="" width="40" height="40" loading="lazy" decoding="async"></span>'
      : '<span class="card__logo card__logo--text" style="background:' + esc(o.tone.bg || '#14532D') +
        ';color:' + esc(o.tone.ink || '#FFFFFF') + '">' + esc(initials(o.partner)) + '</span>';

    var badges = o.badges.map(function (b) {
      return '<li class="chip' + (/0\s*%/.test(b) ? ' chip--zero' : '') + '">' + esc(b) + '</li>';
    }).join('');

    /* Видимая надпись на всех кнопках одна и та же, поэтому к ней дописано
       скрытое продолжение с названием компании: иначе в списке ссылок
       скринридера получилось бы два десятка одинаковых строк. Видимый текст
       стоит в начале имени дословно — голосовое управление его находит. */
    var go = o.url
      ? '<p class="card__go"><a class="btn btn--accent" href="' + esc(o.url) + '" target="_blank" ' +
        'rel="noopener noreferrer sponsored nofollow">' + esc(cta) +
        '<span class="vh"> в МФО «' + esc(o.partner) + '», откроется в новой вкладке</span>' +
        '<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-ext"/></svg></a></p>'
      /* Без ссылки кнопки нет вовсе: нажимать нечего, значит и фокусировать
         нечего. Недоступность передана словом, а не серым цветом. */
      : '<p class="card__soon"><span class="card__badge">Скоро</span>' +
        'Оформление через витрину появится в ближайшее время.</p>';

    return '' +
      '<li><article class="card' + (o.url ? '' : ' card--soon') + '" aria-labelledby="o' + o.i + '-name">' +
        '<div class="card__head">' + logo +
          '<span class="card__name">' +
            '<h3 class="card__partner" id="o' + o.i + '-name">' + esc(o.partner) + '</h3>' +
            (o.tag ? '<span class="card__tag">' + esc(o.tag) + '</span>' : '') +
          '</span>' +
        '</div>' +
        '<dl class="card__specs">' +
          '<div class="spec spec--lead"><dt>Сумма</dt><dd>' + esc(o.sum) + '</dd></div>' +
          '<div class="spec"><dt>Ставка</dt><dd>' + esc(o.rate) + '</dd></div>' +
          '<div class="spec"><dt>Срок</dt><dd>' + esc(o.term) + '</dd></div>' +
          (o.age ? '<div class="spec"><dt>Возраст</dt><dd>' + esc(o.age) + '</dd></div>' : '') +
        '</dl>' +
        (badges ? '<ul class="card__chips" role="list">' + badges + '</ul>' : '') +
        (o.note ? '<p class="card__note">' + esc(o.note) + '</p>' : '') +
        go +
      '</article></li>';
  }

  /* ── состояние фильтров ───────────────────────────────────────────── */

  var listBox   = document.getElementById('cards');
  var countBox  = document.getElementById('catalog-count');
  var emptyBox  = document.getElementById('catalog-empty');
  var sumInput  = document.getElementById('f-sum');
  var termInput = document.getElementById('f-term');
  var sumNum    = document.getElementById('f-sum-num');
  var termNum   = document.getElementById('f-term-num');
  var sortSel   = document.getElementById('f-sort');
  var pickCount = document.getElementById('pick-count');
  var pickBtn   = document.getElementById('pick-go');
  var pickWord  = document.querySelector('[data-pick-n]');
  var pickLogos = document.getElementById('pick-logos');
  var chipsBox  = document.getElementById('f-chips');

  if (!listBox) return;

  /* По умолчанию — порядок карточек из панели: клиент сам решает, кто выше. */
  var state = { sum: 0, term: 0, badges: [], sort: 'order' };

  function matches(o) {
    if (state.sum && o.sumMax < state.sum) return false;
    if (state.term && o.termMax < state.term) return false;
    for (var i = 0; i < state.badges.length; i++) {
      var want = state.badges[i];
      if (o.badges.indexOf(want) === -1) return false;
    }
    return true;
  }

  /* Карточки без ссылки — всегда в конце: оформить там пока нечего. */
  function linkedFirst(a, b) { return (b.url ? 1 : 0) - (a.url ? 1 : 0); }

  function sorted(list) {
    var l = list.slice();
    if (state.sort === 'order') l.sort(function (a, b) { return linkedFirst(a, b) || a.i - b.i; });
    if (state.sort === 'sum')  l.sort(function (a, b) { return linkedFirst(a, b) || b.sumMax - a.sumMax || a.partner.localeCompare(b.partner, 'ru'); });
    if (state.sort === 'term') l.sort(function (a, b) { return linkedFirst(a, b) || b.termMax - a.termMax || a.partner.localeCompare(b.partner, 'ru'); });
    if (state.sort === 'zero') l.sort(function (a, b) { return linkedFirst(a, b) || (b.zero ? 1 : 0) - (a.zero ? 1 : 0) || b.sumMax - a.sumMax; });
    if (state.sort === 'name') l.sort(function (a, b) { return linkedFirst(a, b) || a.partner.localeCompare(b.partner, 'ru'); });
    return l;
  }

  /* Число на экране меняется сразу, а вслух объявляется с задержкой:
     ползунок шлёт событие на каждый шаг, и без паузы скринридер читал бы
     каждое промежуточное значение. */
  var sayTimer = 0;
  function announce(n) {
    if (!countBox) return;
    clearTimeout(sayTimer);
    sayTimer = setTimeout(function () {
      countBox.textContent = n + ' ' + offersWord(n) +
        (n === items.length ? '' : ' из ' + items.length);
    }, 450);
  }

  function render() {
    var list = sorted(items.filter(matches));

    /* Фокус мог стоять на кнопке внутри карточки, которую сейчас снесёт
       перерисовка. Запоминаем, куда его потом вернуть. */
    var act = document.activeElement;
    var inList = act && listBox.contains(act);

    listBox.innerHTML = list.map(cardHTML).join('');
    if (emptyBox) emptyBox.hidden = list.length > 0;

    if (inList && !document.contains(act)) {
      var first = listBox.querySelector('a.btn');
      (first || document.getElementById('catalog')).focus({ preventScroll: true });
    }

    if (pickCount) pickCount.textContent = list.length;
    if (pickLogos) {
      /* Пять первых подходящих компаний со ссылкой — картинки, без текста
         для скринридера: число и сам список рядом. */
      var withLink = list.filter(function (o) { return o.url && o.logo; }).slice(0, 5);
      pickLogos.innerHTML = withLink.map(function (o) {
        return '<li><img src="' + esc(o.logo) + '" alt="" width="40" height="40" decoding="async"></li>';
      }).join('');
      var rest = list.length - withLink.length;
      if (rest > 0 && withLink.length) pickLogos.insertAdjacentHTML('beforeend', '<li class="picker__more">+' + rest + '</li>');
    }
    if (pickWord) pickWord.textContent = list.length + ' ' + offersWord(list.length);
    announce(list.length);

    if (!reduced) {
      /* Лёгкий каскад появления. Класс ставит скрипт, а не таблица стилей:
         если бы стартовая прозрачность жила в CSS, при сбое скрипта список
         остался бы невидимым навсегда. */
      Array.prototype.forEach.call(listBox.children, function (li, n) {
        li.style.animationDelay = Math.min(n, 12) * 26 + 'ms';
        li.classList.add('card--in');
      });
    }
  }

  /* ── ползунки и парные числовые поля ──────────────────────────────── */

  function clamp(v, input) {
    var min = parseInt(input.min, 10), max = parseInt(input.max, 10);
    return Math.min(max, Math.max(min, v));
  }

  /* Заполненная часть дорожки — от края до бегунка. */
  function fill(input) {
    var min = parseFloat(input.min), max = parseFloat(input.max), v = parseFloat(input.value);
    input.style.setProperty('--p', ((v - min) / (max - min) * 100).toFixed(2) + '%');
  }

  function syncSum(fromField) {
    state.sum = parseInt(sumInput.value, 10) || 0;
    fill(sumInput);
    /* Для голоса — голые цифры: «15 000» с пробелом читается как «15» и
       «ноль-ноль-ноль», а видимая надпись остаётся с разделителем. */
    sumInput.setAttribute('aria-valuetext', state.sum + ' рублей');
    if (sumNum && !fromField) sumNum.value = money(state.sum);
    render();
  }

  function syncTerm(fromField) {
    state.term = parseInt(termInput.value, 10) || 0;
    fill(termInput);
    termInput.setAttribute('aria-valuetext', state.term + ' ' + daysWord(state.term));
    if (termNum && !fromField) termNum.value = String(state.term);
    render();
  }

  if (sumInput) sumInput.addEventListener('input', function () { syncSum(false); });
  if (termInput) termInput.addEventListener('input', function () { syncTerm(false); });

  /* Поле принимает «50000», «50 000» и «50 000 ₽» — всё, что человек
     реально печатает. Округляем к шагу ползунка, чтобы они не разъезжались. */
  function fieldToRange(field, input, sync) {
    if (!field || !input) return;
    field.addEventListener('input', function () {
      var digits = field.value.replace(/[^\d]/g, '');
      if (!digits) return;
      var step = parseInt(input.step, 10) || 1;
      var v = clamp(Math.round(parseInt(digits, 10) / step) * step, input);
      input.value = String(v);
      sync(true);
    });
    field.addEventListener('blur', function () {
      var v = parseInt(input.value, 10);
      field.value = input === sumInput ? money(v) : String(v);
    });
  }
  fieldToRange(sumNum, sumInput, syncSum);
  fieldToRange(termNum, termInput, syncTerm);

  /* Enter в числовом поле не должен перезагружать страницу. */
  var pickerForm = document.getElementById('picker');
  if (pickerForm) pickerForm.addEventListener('submit', function (e) { e.preventDefault(); });

  /* ── фильтры-чекбоксы из плашек каталога ──────────────────────────── */

  if (chipsBox) {
    var counts = {};
    items.forEach(function (o) {
      o.badges.forEach(function (b) { counts[b] = (counts[b] || 0) + 1; });
    });
    var top = Object.keys(counts)
      .sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b, 'ru'); })
      .slice(0, 6);

    /* Состояние держит сам браузер: перерисовки чипов нет, значит нечему
       разъехаться с разметкой. */
    chipsBox.insertAdjacentHTML('beforeend', top.map(function (b, n) {
      var id = 'f-chip-' + n;
      return '<span class="chipbox">' +
        '<input class="chipbox__input" type="checkbox" id="' + id + '" value="' + esc(b) + '">' +
        '<label class="chipbox__label" for="' + id + '">' + esc(b) +
        '<span class="chipbox__n">' + counts[b] + '</span>' +
        '<span class="vh"> ' + offersWord(counts[b]) + '</span></label></span>';
    }).join(''));

    chipsBox.addEventListener('change', function (e) {
      var box = e.target.closest('.chipbox__input');
      if (!box) return;
      if (box.checked) state.badges.push(box.value);
      else state.badges = state.badges.filter(function (b) { return b !== box.value; });
      render();
    });
  }

  if (sortSel) {
    sortSel.addEventListener('change', function () {
      state.sort = sortSel.value;
      render();
    });
  }

  function resetAll() {
    state.badges = [];
    state.sort = 'order';
    if (sortSel) sortSel.value = 'order';
    Array.prototype.forEach.call(document.querySelectorAll('.chipbox__input:checked'), function (b) {
      b.checked = false;
    });
    if (sumInput) { sumInput.value = sumInput.min; syncSum(false); }
    if (termInput) { termInput.value = termInput.min; syncTerm(false); }
    render();
  }

  Array.prototype.forEach.call(document.querySelectorAll('#f-reset, [data-reset]'), function (b) {
    b.addEventListener('click', resetAll);
  });

  /* ── кнопка подбора: уводит к каталогу вместе с фокусом ───────────── */

  if (pickBtn) {
    pickBtn.addEventListener('click', function () {
      var target = document.getElementById('catalog');
      if (!target) return;
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    });
  }

  /* Любая ссылка-якорь переносит фокус, а не только прокручивает экран:
     иначе следующий Tab возвращал бы человека в шапку. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var t = document.getElementById(id);
    if (!t) return;
    requestAnimationFrame(function () { t.focus({ preventScroll: true }); });
  });

  /* ── счётчики на полосе статистики ────────────────────────────────── */

  function countUp(node) {
    var to = parseInt(String(node.getAttribute('data-count')).replace(/\D/g, ''), 10);
    if (!to || reduced) { node.textContent = money(to || 0); return; }
    /* Считаем по таймеру, а не через requestAnimationFrame: во встроенных
       превью вкладка считается скрытой, и кадры туда не приходят вовсе. */
    var step = 0, total = 24;
    var t = setInterval(function () {
      step++;
      var v = Math.round(to * (1 - Math.pow(1 - step / total, 3)));
      node.textContent = money(v);
      if (step >= total) { node.textContent = money(to); clearInterval(t); }
    }, 26);
  }

  var stats = document.querySelectorAll('[data-count]');
  if (stats.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          countUp(en.target);
          io.unobserve(en.target);
        });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(stats, function (n) { io.observe(n); });
    } else {
      Array.prototype.forEach.call(stats, countUp);
    }
  }

  /* ── вопросы и ответы ─────────────────────────────────────────────── */

  Array.prototype.forEach.call(document.querySelectorAll('.faq__q'), function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      var body = document.getElementById(btn.getAttribute('aria-controls'));
      if (body) body.hidden = open;
    });
  });

  /* ── старт ────────────────────────────────────────────────────────── */

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (sumInput) syncSum(false);
  if (termInput) syncTerm(false);
  render();
  /* Первое число — это состояние страницы, а не новость: пишем его сразу,
     без отложенного объявления. */
  if (countBox) {
    clearTimeout(sayTimer);
    var shown = listBox.children.length;
    countBox.textContent = shown + ' ' + offersWord(shown) +
      (shown === items.length ? '' : ' из ' + items.length);
  }
})();
