
// ===== Galerie / Modal =====
(function () {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const modal = document.getElementById('gModal');
  if (!items.length || !modal) return;

  const mImg   = document.getElementById('mImg');

  function loadImage(src){ return new Promise((res,rej)=>{const i=new Image(); i.onload=()=>res(src); i.onerror=rej; i.src=src}); }
  function dataFor(el){
    const thumb = el.querySelector('img');
    const src   = (el.dataset.img || '').trim() || thumb.getAttribute('src');
    return {
      src,
      fallback: thumb.getAttribute('src'),
      title: el.querySelector('figcaption')?.textContent || el.dataset.title || '',
      desc : el.dataset.desc || ''
    };
  }
  async function open(el){
    const d = dataFor(el);
    try { mImg.src = await loadImage(d.src); } catch { mImg.src = d.fallback; }
    mImg.alt = d.title;
    mImg.classList.remove('spin-in'); void mImg.offsetWidth; mImg.classList.add('spin-in');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function close(){ modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; setTimeout(()=>{mImg.src=''},150); }
  items.forEach(el => el.addEventListener('click', ()=> open(el)));
  modal.addEventListener('click',(e)=>{ if(e.target.hasAttribute('data-close')) close(); });
  document.addEventListener('keydown',(e)=>{ if(!modal.classList.contains('is-open')) return; if(e.key==='Escape') close(); });
})();

// ===== Smooth-Scroll für Anker auf derselben Seite =====
(function(){
  const samePage = location.pathname.endsWith('index.html') || location.pathname.endsWith('/') || !location.pathname.includes('.');
  document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id = a.getAttribute('href').split('#')[1]; if(!id) return;
      if(samePage){ const t=document.getElementById(id); if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); history.replaceState(null,'','#'+id); } }
    });
  });
})();

// ===== Overlay-Menü (Index) =====
(function(){
  const btn = document.getElementById('navToggle');
  const closeBtn = document.getElementById('navClose');
  const menu = document.getElementById('overlayMenu');
  if(!btn || !menu) return;
  const open = ()=>{ menu.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; };
  const close= ()=>{ menu.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
  btn.addEventListener('click',open); closeBtn?.addEventListener('click',close);
  menu.addEventListener('click',e=>{ if(e.target.tagName==='A') close(); });
})();

// ===== Jahr im Footer =====
(function(){ const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear(); })();

// ===== I18N (Deutsch / Arabisch) =====
(function(){
  // • Keys werden über data-i18n gesetzt (innerHTML erlaubt <br>)
  // • Für Attribute (z.B. alt) → data-i18n-alt="key"
  const dict = {
    de:{
      // NAV / Buttons / Überschriften
      nav_home:"Home", nav_menu:"Menü", nav_services:"Services", nav_contact:"Kontakt & Öffnungszeiten",
      hero_title:"Willkommen<br>beim Al-Shami<br>Imbiss", hero_cta:"Menü",
      about_title:"Das beste Essen in Wien,<br>in Worten und Taten.",
      about_text:"Im Al-Shami, im 16. Bezirk in Wien, bieten wir syrische Aromen im Herzen Österreichs. Unsere Mission: authentische Kocherfahrung mit der Vielfalt der syrischen Küche – von köstlichem Shawarma über Falafel bis hin zu cremigem Hummus.",
      about_cta:"Galerie ansehen",
      gallery_title:"Galerie",
      services_title_box:"Services",
      srv1_title:"Syrisches Shawarma von echter Authentizität: Ein einzigartiger Genuss.",
      srv1_text:"Genießen Sie das köstlichste Shawarma in Wien, zubereitet mit authentischem syrischen Geschmack und hochwertigen Zutaten. Ob Stammgast oder zum ersten Mal: Al-Shami garantiert ein einzigartiges kulinarisches Erlebnis.",
      srv2_title:"Authentizität und Wirtschaftlichkeit: Das Versprechen von Al-Shami.",
      srv2_text:"Großartiges Essen soll zugänglich sein: faire Preise ohne Qualitätsverlust. Mit frischen, halal zertifizierten Zutaten bieten wir Geschmack, der überzeugt – bei gleichbleibend hoher Zufriedenheit.",
      srv3_title:"Vegetarische Optionen: Erfüllung für neuen Geschmack.",
      srv3_text:"In einem Restaurant gibt es ein Zuhause, in dem sich das Restaurant befindet, sodass es reichlich zu essen gibt. Es besteht kein Bedarf, mehr zu essen, daher ist die vegetarische Option zu groß, aber es ist zu heiß zum Essen, ohne essen zu müssen, ohne einen besseren Ort zum Essen zu haben.",
      btn_location:"Standort",
      contact_title:"Kontakt & Öffnungszeiten", contact_h_contact:"Kontakt", contact_h_hours:"Öffnungszeiten", contact_hint:"Feiertage können abweichen.",
      // Galerie – Items
      g1_title:"Knusprige Falafel mit Hummus", g1_desc:"Hausgemachte Falafel aus Kichererbsen, serviert mit cremigem Hummus, Petersilie und eingelegtem Gemüse.",
      g2_title:"Cremiger Hummus mit Olivenöl", g2_desc:"Traditioneller Hummus aus Kichererbsen, Tahini, Knoblauch und Zitronensaft – verfeinert mit Olivenöl.",
      g3_title:"Tabbouleh-Salat",             g3_desc:"Frischer Petersiliensalat mit Bulgur, Tomaten, Minze und Zitrone – leicht und aromatisch.",
      g4_title:"Mutabbal mit Auberginen",    g4_desc:"Cremiger Auberginen-Dip mit Tahini, Knoblauch, Joghurt und Granatapfelkernen.",
      g5_title:"Schawarma Teller",
      g6_title:"Kibbeh",
      g7_title:"Kichererbsen",
      g8_title:"Schawarma",
      // Menüseite – Titel
      menu_page_title:"Menü", sec_shawarma:"Shawarma", sec_veg:"Vegetarisch", sec_legumes:"Hülsenfrüchte", sec_sides:"Beilagen",
      // Menü – Produkte (Titel + Notizen/Zutaten)
      p_shaw_sand_t:"Schawarma Huhn Sandwich",
      p_shaw_sand_n:"Hähnchen oder Rind, Fladenbrot, saure Gurke, Gewürze.",
      p_shaw_teller_t:"Schawarma Teller mit Pommes",
      p_shaw_teller_n:"Hähnchen oder Rind, Fladenbrot, saure Gurke, Gewürze + Pommes.",
      p_falafel_sand_t:"Falafel Sandwich",
      p_falafel_sand_n:"Kichererbsen, Zwiebel, Knoblauch, Petersilie, Koriander (optional), Kreuzkümmel, Salz, Pfeffer, Öl zum Frittieren.",
      p_falafel_teller_t:"Falafel Teller",
      p_falafel_teller_n:"Falafel mit Beilagen.",
      p_pom_aub_t:"Pommes & gebratene Auberginen",
      p_pom_aub_n:"Knusprige Pommes mit gebratenen Auberginen, serviert mit Dip nach Wahl (Ketchup, Mayo oder Knoblauchsoße).",
      p_pommes_t:"Pommes-Teller",
      p_pommes_n:"Frisch frittierte Pommes, goldgelb und knusprig, serviert mit Dip nach Wahl.",
      p_chick_yog_t:"Kichererbsen mit Joghurt",
      p_chick_yog_n:"Knoblauch, Zitronensaft, Olivenöl, Salz, Tomaten, Petersilie, Joghurt, Tahini.",
      p_chick_oil_t:"Kichererbsen mit Öl",
      p_chick_oil_n:"Knoblauch, Zitronensaft, Olivenöl, Salz, Tomaten, Petersilie.",
      p_fattah_yog_t:"Joghurt Fattah",
      p_fattah_yog_n:"Fladenbrot, Joghurt, Kichererbsen, Butter, Knoblauch, Gewürze.",
      p_fattah_oil_t:"Olivenöl Fattah",
      p_fattah_oil_n:"Brot, Kichererbsen, Olivenöl, Knoblauch, Kreuzkümmel.",
      p_tabbouleh_t:"Tabbouleh", p_tabbouleh_n:"Bulgur, Petersilie, Tomaten, Minze, Zitronensaft, Olivenöl, Salz.",
      p_mutabbal_t:"Mutabbal mit Auberginen", p_mutabbal_n:"Aubergine, Tahini, Knoblauch, Zitronensaft, Olivenöl, Salz.",
      p_kibbeh_t:"Kibbeh 4 Stück", p_kibbeh_n:"Bulgur, Fleisch, Zwiebel, Pinienkerne, Gewürze.",
      p_hummus_t:"Hummus", p_hummus_n:"Kichererbsen, Tahini, Zitronensaft, Salz.",
      p_Saubohnen_t:"Saubohnen", p_Saubohnen_n:"Saubohnen, Olivenöl, Knoblauch"
    },
    ar:{
      nav_home:"الرئيسية", nav_menu:"القائمة", nav_services:"الخدمات", nav_contact:"الاتصال وساعات العمل",
      hero_title:"مرحبًا بكم<br>في مطعم الشامي<br>للمأكولات", hero_cta:"القائمة",
      about_title:"أفضل اكل في فيينا،<br>قولًا وفعلاً.",
      about_text:"في مطعم الشامي، في الحي السادس عشر بفيينا، نقدم نكهات سورية أصيلة. مهمتنا: تجربة طهي حقيقية تجمع تنوّع المطبخ السوري – من الشاورما اللذيذة إلى الفلافل والحمص الكريمي.",
      about_cta:"عرض المعرض",
      gallery_title:"المعرض",
      services_title_box:"الخدمات",
      srv1_title:"شاورما سورية أصيلة: متعة لا تُنسى.",
      srv1_text:"استمتعوا بألذ شاورما في فيينا، مُحضّرة بنكهات سورية أصيلة ومكونات عالية الجودة. سواء كنتم زبائن دائمين أو تجربوننا لأول مرة – نضمن لكم تجربة طعام فريدة.",
      srv2_title:"الأصالة والسعر المناسب: وعد الشامي.",
      srv2_text:"نؤمن أن الطعام الرائع يجب أن يكون متاحًا للجميع بأسعار عادلة ومن دون المساس بالجودة، مع مكونات طازجة وحلال.",
      srv3_title:"خيارات نباتية: تُرضي الأذواق الجديدة.",
      srv3_text:"لكل مطعم موقعه الخاص، لذا ستجد وفرة من الطعام. لا داعي لتناول المزيد، لذا فإن الخيار النباتي مُفرط، ولكنه حار جدًا لتناول الطعام دون الحاجة لتناول الطعام، ودون وجود مكان أفضل لتناول الطعام.",
      btn_location:"الموقع",
      contact_title:"الاتصال وساعات العمل", contact_h_contact:"الاتصال", contact_h_hours:"ساعات العمل", contact_hint:"قد تختلف المواعيد في العطل الرسمية.",
      // Galerie – Items
      g1_title:"فلافل مقرمشة مع حمص", g1_desc:"فلافل منزلية من الحمص تُقدّم مع حمص كريمي وبقدونس ومخللات.",
      g2_title:"حمص كريمي بزيت الزيتون", g2_desc:"حمص تقليدي من الحمص والطحينة والثوم وعصير الليمون مع زيت الزيتون.",
      g3_title:"سلطة تبولة",           g3_desc:"سلطة بقدونس طازجة مع برغل وطماطم ونعناع وعصير ليمون.",
      g4_title:"متبل باذنجان",        g4_desc:"مقبل باذنجان كريمي مع طحينة وثوم وزبادي وحبوب رمان.",
      g5_title:"شاورما طبق",
      g6_title:"كبة",
      g7_title:"حمص",
      g8_title:"شوارما",
      // Menüseite – Titel
      menu_page_title:"القائمة", sec_shawarma:"شاورما", sec_veg:"نباتي", sec_legumes:"البقوليات", sec_sides:"المقبلات",
      // Produkte
      p_shaw_sand_t:"سندويتش شاورما دجاج", p_shaw_sand_n:"دجاج أو لحم، خبز عربي، مخلل خيار، بهارات.",
      p_shaw_teller_t:"طبق شاورما مع بطاطا", p_shaw_teller_n:"دجاج أو لحم، خبز عربي، مخلل خيار، بهارات + بطاطا.",
      p_falafel_sand_t:"سندويتش فلافل", p_falafel_sand_n:"حمص، بصل، ثوم، بقدونس، كزبرة (اختياري)، كمون، ملح، فلفل، زيت للقلي.",
      p_falafel_teller_t:"طبق فلافل", p_falafel_teller_n:"فلافل مع مقبلات.",
      p_pom_aub_t:"بطاطا مقلية مع باذنجان", p_pom_aub_n:"بطاطا مقرمشة مع باذنجان مقلي وتغميسة حسب الاختيار (كاتشب، مايونيز أو ثومية).",
      p_pommes_t:"طبق بطاطا مقلية", p_pommes_n:"بطاطا مقلية ذهبية ومقرمشة مع صوص حسب الاختيار.",
      p_chick_yog_t:"حمص باللبن", p_chick_yog_n:"ثوم، عصير ليمون، زيت زيتون، ملح، طماطم، بقدونس، لبن، طحينة.",
      p_chick_oil_t:"حمص بزيت الزيتون", p_chick_oil_n:"ثوم، عصير ليمون، زيت زيتون، ملح، طماطم، بقدونس.",
      p_fattah_yog_t:"فتة بالسمن", p_fattah_yog_n:"خبز عربي، لبن، حمص، زبدة، ثوم، بهارات.",
      p_fattah_oil_t:"فتّة بزيت الزيتون", p_fattah_oil_n:"خبز، حمص، زيت زيتون، ثوم، كمون.",
      p_tabbouleh_t:"تبولة", p_tabbouleh_n:"برغل، بقدونس، طماطم، نعناع، عصير ليمون، زيت زيتون.",
      p_mutabbal_t:"متبل باذنجان", p_mutabbal_n:"باذنجان، طحينة، ثوم، عصير ليمون، زيت زيتون، ملح.",
      p_kibbeh_t:" اربعة قطع كبة", p_kibbeh_n:"برغل، لحم، بصل، صنوبر، بهارات.",
      p_hummus_t:"حمص", p_hummus_n:"حمص، طحينة، عصير ليمون، ملح.",
      p_Saubohnen_t:"فول", p_Saubohnen_n:"فول، زيت زيتون، ثوم"
    }
  };

  function setDirFont(lang){
  document.documentElement.lang = (lang==='ar'?'ar':'de');
  // document.documentElement.dir  = (lang==='ar'?'rtl':'ltr');
  document.querySelectorAll('.nav, .nav--overlay').forEach(el=> el.setAttribute('dir','ltr'));
  document.querySelectorAll('.price').forEach(el=> el.setAttribute('dir','ltr')); // Preise immer LTR
  }

  function applyText(el, key){
    const val = dict[current][key];
    if(!val) return;
    el.innerHTML = val;
    // evtl. verknüpfte Attribute setzen
    const altKey = el.dataset.i18nAlt;
    if (altKey && dict[current][altKey]) el.setAttribute('alt', dict[current][altKey]);
  }

  function applyLang(lang){
    current = (lang==='ar') ? 'ar' : 'de';
    setDirFont(current);
    document.querySelectorAll('[data-i18n]').forEach(el=> applyText(el, el.dataset.i18n));
    localStorage.setItem('lang', current);
    document.querySelectorAll('.lang-switch [data-setlang]').forEach(b=> b.classList.toggle('is-active', b.dataset.setlang===current));
  }

  let current = localStorage.getItem('lang') || 'de';
  applyLang(current);

  document.addEventListener('click', (e)=>{
    const b = e.target.closest('[data-setlang]');
    if(!b) return;
    applyLang(b.dataset.setlang);
  });
})();


/* ========== Menü-Karten Hover-Tilt (nur Desktop/Pointer) ========== */
(function () {
  const cards = Array.from(document.querySelectorAll('.product-card'));
  if (!cards.length) return;

  // Skip, wenn reduzierte Bewegung gewünscht oder kein "fine pointer"
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer:fine)').matches;
  if (reduceMotion || !hasFinePointer) return;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  cards.forEach(card => {
    const media = card.querySelector('.product-media');
    if (!media) return;

    let raf = null;

    function onMove(e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;   // 0..1
      const y = (e.clientY - r.top)  / r.height;  // 0..1

      // Winkel & Tiefe berechnen
      const rotY = clamp((x - 0.5) * 10, -10, 10);   // -10° .. 10°
      const rotX = clamp((0.5 - y) * 10, -10, 10);
      const z    = 14;                               // leichte Tiefe

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        media.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${z}px)`;
        card.classList.add('is-tilting');
      });
    }

    function onLeave() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        media.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.classList.remove('is-tilting');
      });
    }

    card.addEventListener('mouseenter', onMove);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    // Tastatur-Access: bei Fokus leicht anheben
    card.addEventListener('focusin', () => {
      media.style.transform = 'translateZ(10px)';
      card.classList.add('is-tilting');
    });
    card.addEventListener('focusout', () => {
      media.style.transform = 'translateZ(0)';
      card.classList.remove('is-tilting');
    });
  });
})();

/* ========= Hover-Tilt (nur Desktop/Pointer) ========= */
(function(){
  const reduceMotion   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer:fine)').matches;
  if (reduceMotion || !hasFinePointer) return;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  function addTilt(containerSelector, mediaSelector){
    const cards = Array.from(document.querySelectorAll(containerSelector));
    cards.forEach(card=>{
      const media = card.querySelector(mediaSelector);
      if(!media) return;

      let raf = null;

      function onMove(e){
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left)/r.width;   // 0..1
        const y = (e.clientY - r.top) /r.height;  // 0..1
        const rotY = clamp((x - .5)*10, -10, 10);
        const rotX = clamp((.5 - y)*10, -10, 10);
        const z    = 14;

        if(raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(()=>{
          media.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${z}px)`;
          card.classList.add('is-tilting');
        });
      }
      function onLeave(){
        if(raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(()=>{
          media.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
          card.classList.remove('is-tilting');
        });
      }

      card.addEventListener('mouseenter', onMove);
      card.addEventListener('mousemove',  onMove);
      card.addEventListener('mouseleave', onLeave);

      // Tastatur-Zugänglichkeit
      card.addEventListener('focusin',  ()=>{ media.style.transform='translateZ(10px)'; card.classList.add('is-tilting'); });
      card.addEventListener('focusout', ()=>{ media.style.transform='translateZ(0)';    card.classList.remove('is-tilting'); });
    });
  }

  // Auf Services anwenden:
  addTilt('.service-card', '.service-media');
  // Auf Video-Items anwenden (gleicher Hover-Tilt Effekt)
  addTilt('.video-item', '.vi-thumb');
})();


/* ===== Video strip: horizontal scroll + modal play ===== */
(function(){
  const track = document.querySelector('.video-strip__track');
  if(!track) return;

  const leftBtn = document.querySelector('.vs-btn--left');
  const rightBtn = document.querySelector('.vs-btn--right');
  const items = Array.from(track.querySelectorAll('.video-item'));

  // Scroll by one item width
  function scroll(dir=1){
    const w = items[0]?.getBoundingClientRect().width || 300;
    track.scrollBy({left: dir * (w + 16), behavior: 'smooth'});
  }
  leftBtn?.addEventListener('click', ()=> scroll(-1));
  rightBtn?.addEventListener('click', ()=> scroll(1));

  // Hover preview: play muted preview on hover
  items.forEach(item=>{
    const vid = item.querySelector('video');
    if(!vid) return;
    item.addEventListener('mouseenter', ()=>{ vid.currentTime = 0; vid.muted = true; vid.play().catch(()=>{}); });
    item.addEventListener('mouseleave', ()=>{ vid.pause(); vid.currentTime = 0; });
  });

  // Video modal
  const vModal = document.createElement('div');
  vModal.className = 'video-modal';
  vModal.innerHTML = `
    <div class="video-modal__overlay" data-close></div>
    <div class="video-modal__dialog" role="dialog" aria-modal="true">
      <div class="video-modal__hint">Klicke außerhalb oder drücke Esc zum Schließen</div>
      <video controls playsinline></video>
    </div>
  `;
  document.body.appendChild(vModal);

  const vDialog = vModal.querySelector('video');

  function openVideo(src){
    vDialog.src = src; vDialog.currentTime = 0; vDialog.play().catch(()=>{});
    vModal.classList.add('is-open'); document.body.style.overflow='hidden';
  }
  function closeVideo(){ vDialog.pause(); vDialog.src=''; vModal.classList.remove('is-open'); document.body.style.overflow=''; }

  // Close when clicking elements marked with data-close (overlay or close button)
  vModal.addEventListener('click', (e)=>{ if(e.target.closest('[data-close]')) closeVideo(); });
  // overlay and Escape still close the modal (no explicit X button shown)
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && vModal.classList.contains('is-open')) closeVideo(); });

  items.forEach(item=> item.addEventListener('click', ()=>{ const src=item.dataset.src || item.querySelector('video')?.getAttribute('src'); if(src) openVideo(src); }));

})();


document.addEventListener("DOMContentLoaded", () => {
  // Liste aller veganen Gerichte
  const veganItems = [
    "Falafel Teller",
    "Falafel Sandwich",
    "Hummus",
    "Mutabbal",
    "Tabbouleh",
    "Pommes & gebratene Auberginen",
    "Pommes-Teller",
    "Kichererbsen mit Joghurt",
    "Kichererbsen mit Öl",
    "Joghurt Fattah",
    "Olivenöl Fattah",
    "Saubohnen",
  ];

  // alle Produkt-Titel durchgehen
  const titles = document.querySelectorAll(".product-title");

  titles.forEach(title => {
    const text = title.textContent.trim();

    // prüfen ob dieser Titel in der Liste steht
    if (veganItems.some(item => text.includes(item))) {
      // nur hinzufügen wenn noch nicht vorhanden
      if (!title.querySelector(".vegan-icon")) {
        const icon = document.createElement("img");
        icon.src = "veggan.jpg";   // dein Bild (achte auf richtigen Pfad!)
        icon.alt = "Vegan";
        icon.classList.add("vegan-icon");
        title.appendChild(icon);
      }
    }
  });

  // Für die Galerie
  galleryImages.forEach(img => {
    const altText = img.alt.trim();
    if (veganItems.some(item => altText.includes(item))) {
      if (!img.parentElement.querySelector(".vegan-icon")) {
        const icon = document.createElement("img");
        icon.src = "veggan.jpg";
        icon.alt = "Vegan";
        icon.classList.add("vegan-icon");
        img.parentElement.appendChild(icon);
      }
    }
  });

});


