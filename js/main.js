/* =========================================================
   أمانك — Safe Guard | ملف التفاعلات
   البحث والفلترة + التنبيهات + الكاميرا + قسم الفيديو
   ========================================================= */

// ---------- إعدادات عامة ----------
// ⚠️ لتغيير رابط فيديو الشرح: عدّل الرابط هنا ثم أعد توليد الباركود (انظر README)
var AMANAK_VIDEO_URL = 'https://www.youtube.com/watch?v=aXV-nXBh8f8';

document.addEventListener('DOMContentLoaded', function () {
  // ---------- ظهور تدريجي للعناصر ----------
  document.querySelectorAll('[data-animate]').forEach(function (el, i) {
    el.classList.add('fade-up');
    el.style.animationDelay = (i * 0.06) + 's';
  });

  initAppFilters();
  initChildMonitor();
  initCamera();
  initVideoSection();
  initGallery();
});

/* =========================================================
   صفحة التطبيقات: البحث + الفلترة
   ========================================================= */
function initAppFilters() {
  var searchInput = document.getElementById('appSearch');
  if (!searchInput) return;

  var filterButtons = document.querySelectorAll('.filter-btn');
  var safeSection = document.getElementById('safeSection');
  var dangerSection = document.getElementById('dangerSection');
  var safeCount = document.getElementById('safeCount');
  var dangerCount = document.getElementById('dangerCount');
  var currentFilter = 'all';

  function applyFilters() {
    var query = searchInput.value.trim().toLowerCase();
    var safeVisible = 0;
    var dangerVisible = 0;

    document.querySelectorAll('.app-card[data-app]').forEach(function (card) {
      var name = card.getAttribute('data-app') || '';
      var type = card.getAttribute('data-type');
      var matchesQuery = name.indexOf(query) !== -1;
      var matchesFilter = (currentFilter === 'all') || (currentFilter === type);
      var show = matchesQuery && matchesFilter;
      card.style.display = show ? '' : 'none';
      if (show) {
        if (type === 'safe') safeVisible++; else dangerVisible++;
      }
    });

    if (safeSection) safeSection.style.display = safeVisible ? '' : 'none';
    if (dangerSection) dangerSection.style.display = dangerVisible ? '' : 'none';
    if (safeCount) safeCount.textContent = safeVisible;
    if (dangerCount) dangerCount.textContent = dangerVisible;
  }

  searchInput.addEventListener('input', applyFilters);

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });
}

/* =========================================================
   صفحة حماية طفلك: التبويبات + ربط الجهاز + التنبيهات
   ========================================================= */
function initChildMonitor() {
  // تبويبات جوال الوالد / جوال الطفل
  var tabBtns = document.querySelectorAll('.tab-btn');
  var linkInfo = document.getElementById('linkInfo');
  var phoneInput = document.getElementById('phoneInput');
  var linkBtn = document.getElementById('linkBtn');
  var linkStatus = document.getElementById('linkStatus');

  if (tabBtns.length && linkInfo) {
    var messages = {
      parent: '📱 أدخل رقم جوالك لربطه بجوال طفلك وتصلك التنبيهات فوراً.',
      child: '📱 أدخل رقم جوال طفلك ليتم ربطه بجهازك وابدأ المراقبة.'
    };
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        linkInfo.textContent = messages[btn.getAttribute('data-tab')] || messages.parent;
      });
    });
  }

  // تفعيل زر الربط عند إدخال رقم صالح
  if (phoneInput && linkBtn) {
    phoneInput.addEventListener('input', function () {
      var valid = /^05\d{8}$/.test(phoneInput.value.trim());
      linkBtn.disabled = !valid;
    });
    linkBtn.addEventListener('click', function () {
      if (linkStatus) {
        linkStatus.textContent = '✓ تم ربط الجهاز بنجاح — المراقبة نشطة الآن';
        linkStatus.style.color = '#059669';
        linkStatus.style.display = 'block';
      }
      linkBtn.textContent = 'مرتبط ✓';
      linkBtn.disabled = true;
      phoneInput.disabled = true;
    });
  }

  // إيقاف/تشغيل المراقبة
  var stopBtn = document.getElementById('stopMonitorBtn');
  var statusText = document.getElementById('monitorStatusText');
  var pulseDot = document.getElementById('pulseDot');
  if (stopBtn && statusText) {
    var monitoring = true;
    stopBtn.addEventListener('click', function () {
      monitoring = !monitoring;
      statusText.textContent = monitoring ? 'المراقبة نشطة' : 'المراقبة متوقفة';
      if (pulseDot) {
        pulseDot.style.background = monitoring ? 'var(--emerald)' : 'var(--orange)';
        pulseDot.style.animation = monitoring ? '' : 'none';
      }
      stopBtn.querySelector('span').textContent = monitoring ? 'إيقاف' : 'تشغيل';
      statusText.style.color = monitoring ? '#059669' : '#EA580C';
    });
  }

  // قوائم التنبيهات
  var activeList = document.getElementById('activeAlerts');
  var prevList = document.getElementById('previousAlerts');
  var activeCount = document.getElementById('activeAlertsCount');
  var resolvedStat = document.getElementById('resolvedStat');
  var addAlertBtn = document.getElementById('addAlertBtn');

  // أزرار "تم الحل"
  document.querySelectorAll('.btn-resolve').forEach(function (btn) {
    btn.addEventListener('click', function () {
      resolveAlert(btn.closest('.alert-card'));
    });
  });

  function updateCounts() {
    if (!activeList || !prevList) return;
    var active = activeList.querySelectorAll('.alert-card:not(.resolved)').length;
    var resolved = prevList.querySelectorAll('.alert-card').length;
    if (activeCount) activeCount.textContent = active;
    if (resolvedStat) resolvedStat.textContent = resolved;
  }

  function resolveAlert(card) {
    if (!card || card.classList.contains('resolved')) return;
    card.classList.add('resolved');
    // إزالة زر الحل
    var btn = card.querySelector('.btn-resolve');
    if (btn) btn.remove();
    // إضافة شارة "تم الحل"
    var nameRow = card.querySelector('.alert-name-row');
    if (nameRow && !nameRow.querySelector('.badge.emerald')) {
      var b = document.createElement('span');
      b.className = 'badge emerald';
      b.textContent = 'تم الحل';
      nameRow.appendChild(b);
    }
    // نقل إلى القائمة السابقة
    if (prevList && activeList && activeList.contains(card)) {
      prevList.insertBefore(card, prevList.firstChild);
    }
    updateCounts();
  }

  // زر إضافة تنبيه تجريبي
  if (addAlertBtn && activeList) {
    var demoAlerts = [
      { name: 'أحمد', level: 'عالي', levelClass: 'red', icon: 'warning', text: 'تم رصد محاولة تواصل مع شخص غريب' },
      { name: 'سارة', level: 'متوسط', levelClass: 'orange', icon: 'clock', text: 'تم تجاوز وقت الاستخدام المسموح' },
      { name: 'دلال', level: 'منخفض', levelClass: 'emerald', icon: 'download', text: 'تم تحميل تطبيق جديد على الجهاز' }
    ];
    var demoIndex = 0;

    addAlertBtn.addEventListener('click', function () {
      var demo = demoAlerts[demoIndex % demoAlerts.length];
      demoIndex++;

      var icons = {
        warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
        clock: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        download: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>'
      };
      var iconClasses = { warning: 'red', clock: 'orange', download: 'blue' };

      var now = new Date();
      var timeStr = now.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' }) + '، ' +
        now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

      var card = document.createElement('div');
      card.className = 'alert-card';
      card.setAttribute('data-animate', '');
      card.innerHTML =
        '<div class="alert-inner">' +
        '  <div class="alert-icon ' + iconClasses[demo.icon] + '">' + icons[demo.icon] + '</div>' +
        '  <div class="alert-body">' +
        '    <div class="alert-name-row">' +
        '      <span class="alert-name">' + demo.name + '</span>' +
        '      <span class="badge ' + demo.levelClass + '">' + demo.level + '</span>' +
        '    </div>' +
        '    <p class="alert-desc">' + demo.text + '</p>' +
        '    <div class="alert-footer">' +
        '      <span class="alert-time">' + timeStr + '</span>' +
        '      <button class="btn-resolve">' +
        '        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>' +
        '        تم الحل' +
        '      </button>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      card.classList.add('fade-up');
      activeList.insertBefore(card, activeList.firstChild);
      card.querySelector('.btn-resolve').addEventListener('click', function () {
        resolveAlert(card);
      });
      updateCounts();
    });
  }
}

/* =========================================================
   صفحة الكاميرا: تشغيل/إيقاف + المايك + الصوت
   ========================================================= */
function initCamera() {
  var cameraView = document.getElementById('cameraView');
  var camBtn = document.getElementById('cameraBtn');
  var micBtn = document.getElementById('micBtn');
  var volBtn = document.getElementById('volBtn');
  var camLabel = document.getElementById('camLabel');
  var liveTime = document.getElementById('liveTime');
  var timerInterval = null;
  var seconds = 0;

  if (!cameraView || !camBtn) return;

  function updateTimer() {
    seconds++;
    var m = String(Math.floor(seconds / 60)).padStart(2, '0');
    var s = String(seconds % 60).padStart(2, '0');
    if (liveTime) liveTime.textContent = '● ' + m + ':' + s;
  }

  camBtn.addEventListener('click', function () {
    var isLive = cameraView.classList.toggle('live');
    camBtn.classList.toggle('active', isLive);
    if (camLabel) camLabel.textContent = isLive ? 'إيقاف' : 'تشغيل';

    if (isLive) {
      seconds = 0;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer();
      // تفعيل أزرار المايك والصوت
      if (micBtn) { micBtn.classList.remove('sec'); micBtn.classList.add('enabled'); micBtn.disabled = false; }
      if (volBtn) { volBtn.classList.remove('sec'); volBtn.classList.add('enabled'); volBtn.disabled = false; }
    } else {
      if (timerInterval) clearInterval(timerInterval);
      // إعادة الأزرار للحالة المعطلة
      if (micBtn) { micBtn.classList.add('sec'); micBtn.classList.remove('enabled', 'on'); micBtn.disabled = true; }
      if (volBtn) { volBtn.classList.add('sec'); volBtn.classList.remove('enabled', 'on'); volBtn.disabled = true; }
    }
  });

  if (micBtn) {
    micBtn.addEventListener('click', function () {
      if (micBtn.disabled) return;
      micBtn.classList.toggle('on');
    });
  }
  if (volBtn) {
    volBtn.addEventListener('click', function () {
      if (volBtn.disabled) return;
      volBtn.classList.toggle('on');
    });
  }
}

/* =========================================================
   قسم الفيديو: مشغل حقيقي بصوت عربي + خيارات
   ========================================================= */

// نص التعليق الصوتي مع توقيتاته (يُحدَّث تلقائياً من ملف الترجمة عند إعادة التوليد)
var AMANAK_SUBS = [
  { start: 0.75, end: 8.43, text: "أهلاً وسهلاً بكم في أمانك، رفيقكم الأمين لحماية أطفالكم في العالم الرقمي." },
  { start: 8.48, end: 19.42, text: "يقدم لكم أمانك دليلاً متكاملاً للتطبيقات الآمنة والخطرة، مع تقييم واضح لكل تطبيق حسب الفئة العمرية المناسبة." },
  { start: 19.47, end: 28.92, text: "راقبوا نشاط أجهزة أطفالكم لحظة بلحظة، واحصلوا على تنبيهات فورية عند رصد أي نشاط مقلق." },
  { start: 28.97, end: 38.38, text: "ومن خلال كاميرا المراقبة، شاهدوا منزلكم من أي مكان في العالم، وتحدثوا مع أطفالكم وجهاً لوجه." },
  { start: 38.43, end: 48.46, text: "الخصوصية أولاً: جميع بياناتكم مشفرة بالكامل من الطرف إلى الطرف، ولا يطلع عليها أحد سواكم." },
  { start: 48.51, end: 58.08, text: "ابدأوا رحلتكم في ثلاث خطوات فقط: اربطوا الأجهزة، اضبطوا الإعدادات، وراقبوا بكل راحة بال." },
  { start: 58.13, end: 67.40, text: "أمانك، لأن أمان أطفالنا أمانة. حمّلوا التطبيق الآن، وابدأوا رحلة الحماية اليوم." },
];

function initVideoSection() {
  var video = document.getElementById('amanakVideo');
  if (!video) return;

  var source = document.getElementById('videoSource');
  var bigPlay = document.getElementById('bigPlayBtn');
  var subsBox = document.getElementById('playerSubs');
  var subsToggle = document.getElementById('subsToggle');
  var loopToggle = document.getElementById('loopToggle');
  var downloadBtn = document.getElementById('downloadBtn');
  var durBadge = document.getElementById('videoDurationBadge');
  var subsOn = false;
  var currentQuality = '1080p';

  var SRC = {
    '1080p': 'media/amanak-intro-1080p.mp4',
    '720p': 'media/amanak-intro-720p.mp4'
  };

  // زر التشغيل الكبير
  if (bigPlay) {
    bigPlay.addEventListener('click', function () { video.play(); });
  }
  video.addEventListener('play', function () {
    if (bigPlay) bigPlay.classList.add('hidden');
  });
  video.addEventListener('pause', function () {
    if (bigPlay) bigPlay.classList.remove('hidden');
  });
  // عند انتهاء الفيديو: أعد زر التشغيل (إن لم يكن التكرار مفعلاً)
  video.addEventListener('ended', function () {
    if (bigPlay && !video.loop) bigPlay.classList.remove('hidden');
  });

  // مدة الفيديو في الشارة
  video.addEventListener('loadedmetadata', function () {
    if (!durBadge) return;
    var m = Math.floor(video.duration / 60);
    var s = Math.round(video.duration % 60);
    if (s === 60) { m++; s = 0; }
    durBadge.textContent = '\u200F' + m + ':' + (s < 10 ? '0' : '') + s + ' دقيقة';
  });

  // تبديل الجودة مع حفظ الموضع
  var qualityBtns = document.querySelectorAll('#qualityBtns button');
  qualityBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var q = btn.getAttribute('data-quality');
      if (q === currentQuality) return;
      currentQuality = q;
      qualityBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var t = video.currentTime;
      var wasPlaying = !video.paused && !video.ended;
      source.setAttribute('src', SRC[q]);
      video.load();
      video.addEventListener('loadedmetadata', function once() {
        video.removeEventListener('loadedmetadata', once);
        video.currentTime = t;
        if (wasPlaying) video.play();
      });
      if (downloadBtn) downloadBtn.setAttribute('href', SRC[q]);
    });
  });

  // سرعة التشغيل
  var speedBtns = document.querySelectorAll('#speedBtns button');
  speedBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      speedBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      video.playbackRate = parseFloat(btn.getAttribute('data-speed'));
    });
  });

  // الترجمة النصية (مخصصة — تعمل حتى من file://)
  if (subsToggle && subsBox) {
    subsToggle.addEventListener('click', function () {
      subsOn = !subsOn;
      subsToggle.setAttribute('aria-pressed', String(subsOn));
      subsToggle.classList.toggle('active', subsOn);
      subsToggle.textContent = subsOn ? 'إخفاء النص' : 'إظهار النص';
      if (!subsOn) subsBox.hidden = true;
      else updateSubs();
    });
  }
  function updateSubs() {
    if (!subsBox || !subsOn) return;
    var t = video.currentTime;
    var line = null;
    for (var i = 0; i < AMANAK_SUBS.length; i++) {
      if (t >= AMANAK_SUBS[i].start && t <= AMANAK_SUBS[i].end) {
        line = AMANAK_SUBS[i].text;
        break;
      }
    }
    if (line) {
      subsBox.hidden = false;
      subsBox.innerHTML = '<span></span>';
      subsBox.firstChild.textContent = line;
    } else {
      subsBox.hidden = true;
    }
  }
  video.addEventListener('timeupdate', updateSubs);

  // تكرار التشغيل
  if (loopToggle) {
    loopToggle.addEventListener('click', function () {
      video.loop = !video.loop;
      loopToggle.setAttribute('aria-pressed', String(video.loop));
      loopToggle.classList.toggle('active', video.loop);
    });
  }
}

/* =========================================================
   معرض الصور + العارض المكبر
   ========================================================= */
function initGallery() {
  var grid = document.getElementById('galleryGrid');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  // بناء عارض مكبر ديناميكياً
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML =
    '<button class="lightbox-close" aria-label="إغلاق">' +
    '  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
    '</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="السابق">' +
    '  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>' +
    '</button>' +
    '<img class="lightbox-img" alt="">' +
    '<button class="lightbox-nav lightbox-next" aria-label="التالي">' +
    '  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>' +
    '</button>' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(lb);

  var lbImg = lb.querySelector('.lightbox-img');
  var lbCaption = lb.querySelector('.lightbox-caption');
  var current = 0;

  function capOf(item) {
    var c = item.querySelector('figcaption');
    return c ? c.textContent : '';
  }
  function srcOf(item) {
    var img = item.querySelector('img');
    return img ? img.getAttribute('src') : '';
  }
  function show(i) {
    current = (i + items.length) % items.length;
    lbImg.setAttribute('src', srcOf(items[current]));
    lbImg.setAttribute('alt', capOf(items[current]));
    lbCaption.textContent = capOf(items[current]);
  }
  function open(i) {
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
  });
  lb.querySelector('.lightbox-close').addEventListener('click', close);
  lb.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
  lb.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current + 1);   // التالي في RTL
    else if (e.key === 'ArrowRight') show(current - 1);  // السابق في RTL
  });
}
