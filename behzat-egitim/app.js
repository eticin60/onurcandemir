/**
 * ==========================================================================
 * BEHZAT ÇOCUK AKADEMİ — FULL APPLICATION ENGINE v2.0
 * Özellikler: Dark Mode, Ders Programı Robotu, LGS Hesaplayıcı,
 *             Testimonial Slider, CSV Export/Import, Çoklu Kullanıcı Portalleri
 * ==========================================================================
 */

// ============================================================
// 1. VERİ TANIMLARI (Seed Data)
// ============================================================
const SEED_RECORDS = [
  { id:"rec_01", parentName:"Ahmet Yıldırım", studentName:"Mert Yıldırım", parentContact:"0542 345 67 89", studentGrade:"8", date:"2026-07-10 14:32", status:"Kayıt Yapıldı" },
  { id:"rec_02", parentName:"Zeynep Karaca",  studentName:"Elif Karaca",    parentContact:"0533 987 65 43", studentGrade:"5", date:"2026-07-11 11:05", status:"Arandı" },
  { id:"rec_03", parentName:"Mustafa Demir",  studentName:"Kerem Demir",    parentContact:"0505 123 45 67", studentGrade:"4", date:"2026-07-12 09:15", status:"Bekliyor" },
  { id:"rec_04", parentName:"Hatice Koç",     studentName:"Ali Koç",        parentContact:"0544 555 44 33", studentGrade:"7", date:"2026-07-12 17:40", status:"Bekliyor" }
];

const SEED_LOGS = [
  { time:"2026-07-10 14:32", type:"system", msg:"Sistem başlatıldı. Veritabanı hazır." },
  { time:"2026-07-10 14:33", type:"email",  msg:"demirkirancaner355@gmail.com — Mert Yıldırım ön kayıt bildirimi gönderildi." },
  { time:"2026-07-10 14:33", type:"sms",    msg:"05441705295 — 'Yeni kayıt talebi alındı.' SMS iletildi." }
];

// Sitenin düzenlenebilir içeriği (CMS verisi)
const SEED_SITE_CONTENT = {
  heroTitle: "Geleceğin Başarı Hikayeleri Burada Başlıyor!",
  heroSubtitle: "Behzat Çocuk Akademi, 3. sınıftan 8. sınıfa kadar olan öğrencilerimize özel hazırlanmış interaktif ders çalışma sistemleri, özel mentorluk ve Tokat'ın en seçkin öğretmen kadrosuyla yanınızda.",
  aboutTitle: "Behzat Çocuk Akademi Hakkında",
  aboutText: "Tarihi şanlı, doğası yeşil Tokat'ımızın her bir köşesinden gelen öğrencilerimize en iyi eğitim imkanlarını sunarak, şehrimizin LGS ve okul başarı sıralamalarını zirveye taşımaktan gurur duyuyoruz. Behzat Çocuk Akademi, sadece bir kurs merkezi değil, sıcak bir aile yuvasıdır.",
  contactPhone: "0544 170 52 95",
  contactEmail: "info@behzatcocukakademi.com",
  contactAddress: "Behzat Bulvarı, Merkez / Tokat",
  announcements: [
    { id:"ann_01", title:"2026-2027 Kayıtları Başladı!", text:"Yeni eğitim dönemine ait ön kayıtlarımız açılmıştır. Erken kayıt indirimi için hemen başvurun.", date:"2026-07-10", target:"all" },
    { id:"ann_02", title:"8. Sınıf LGS Kamp Programı", text:"Temmuz boyunca yoğun LGS hazırlık kampımız devam etmektedir. Velilerimiz öğrenci gelişim raporlarını panellerinden takip edebilirler.", date:"2026-07-12", target:"veli" },
    { id:"ann_03", title:"Bu Hafta Matematik Denemesi Var", text:"Cumartesi 10:00'da tüm 7. ve 8. sınıf öğrencilerimiz için matematik denemesi yapılacaktır. Hazırlıklı gelin!", date:"2026-07-12", target:"ogrenci" }
  ],
  courses: {
    "3-4": { title: "3. ve 4. Sınıflar", desc: "Okuma, anlama, temel matematik becerileri ve eğlenceli bilim aktiviteleriyle dersi sevdiren özel eğitim modeli." },
    "5-6": { title: "5. ve 6. Sınıflar", desc: "Ortaokul müfredatına yumuşak geçiş, temel fen bilimleri, yeni nesil soru kalıplarıyla tanışma ve problem çözme odaklı eğitim." },
    "7-8": { title: "7. ve 8. Sınıflar", desc: "LGS (Lise Geçiş Sistemi) hazırlığında Tokat'ın en iyi derecelerini çıkaran, yoğunlaştırılmış kamp programı ve mentörlük." }
  },
  teachers: [
    { name: "Caner Demirkıran", subject: "Matematik Zümre Başkanı", bio: "LGS yeni nesil mantık muhakeme soru çözümlerinde 12 yıllık Tokat dereceleri tecrübesi." },
    { name: "Elif Yılmaz", subject: "Fen Bilimleri Öğretmeni", bio: "Fen deneyleri ve yeni nesil LGS fen soruları hazırlayıcısı, deney kulübü lideri." },
    { name: "Ahmet Korkmaz", subject: "Sözel Mantık & Türkçe", bio: "Hızlı okuma uzmanı, sözel mantık ve LGS Türkçe dil bilgisi uzmanı." }
  ],
  testimonials: [
    { author: "Mehmet A. (Veli)", loc: "Tokat Merkez", quote: "Oğlum 8. sınıfta LGS hazırlık için Caner Hoca'nın ekibiyle çalıştı. Sıfırdan aldığı matematik netlerini Tokat Fen Lisesi'ni kazanacak seviyeye çıkardılar. Takip ve rehberlik muhteşem!" },
    { author: "Selin K. (Veli)", loc: "Karşıyaka / Tokat", quote: "Kızım 5. sınıfta ders çalışma alışkanlığı kazanamamıştı. Behzat Akademi'deki haftalık kişiye özel ders çalışma programı robotu ve ödev etüt saatleri sayesinde okulu çok sevmeye başladı." }
  ]
};

const SEED_STUDENTS_DB = [
  { username:"mert.yildirim", password:"mert123", name:"Mert Yıldırım", grade:"8", parentUsername:"ahmet.yildirim", exams:[{name:"Mat Denemesi 1",score:72},{name:"Türkçe Denemesi 1",score:85},{name:"Fen Denemesi 1",score:78}] },
  { username:"elif.karaca",   password:"elif123",  name:"Elif Karaca",   grade:"5", parentUsername:"zeynep.karaca",  exams:[{name:"Mat Denemesi 1",score:90},{name:"Türkçe Denemesi 1",score:88}] }
];

const SEED_PARENTS_DB = [
  { username:"ahmet.yildirim", password:"veli123", name:"Ahmet Yıldırım", children:["mert.yildirim"] },
  { username:"zeynep.karaca",  password:"veli123", name:"Zeynep Karaca",  children:["elif.karaca"]   }
];

const COURSE_DETAILS = {
  "detail-3-4": { title:"3. ve 4. Sınıf Program Detayları", schedule:"Hafta sonu Cumartesi ve Pazar günleri, günde 3'er saat (Toplam 6 saat). Eğlenceli akıl oyunları saatleri dahildir.", goals:"Temel matematik işlem hızı, hızlı okuma ve anlama, İngilizce kelime oyunları ve fen laboratuvarı aktiviteleri.", teachers:"İlkokul uzmanı sınıf öğretmenleri (Maksimum 8 öğrenci) ve rehberlik danışmanı." },
  "detail-5-6": { title:"5. ve 6. Sınıf Program Detayları", schedule:"Hafta sonu 4 ders saati + hafta içi Salı-Perşembe 2'şer saat etüt (Toplam 8 saat).", goals:"Ortaokula uyum, paragraf analiz becerileri, temel geometri ve problem çözme. Yazılı öncesi özel hazırlık etütleri.", teachers:"Branş öğretmenleri (Matematik, Türkçe, Fen) ve öğrenci çalışma koçu ile haftalık ödev takibi." },
  "detail-7-8": { title:"7. ve 8. Sınıf LGS Kamp Detayları", schedule:"Haftalık 12 ders saati. Cumartesi-Pazar konu anlatımı, Pazartesi-Çarşamba-Cuma soru çözüm ofisleri.", goals:"Tam LGS hazırlık müfredatı. Yeni nesil sayısal/sözel mantık muhakeme soruları. Türkiye Geneli Kurumsal Deneme Sınavları.", teachers:"LGS tecrübeli uzman zümre kadrosu, mentör öğretmen ataması ve haftalık deneme analiz karnesi." }
};

const GALLERY_PHOTOS = [
  { id:1, title:"LGS Hazırlık Etüdü",       category:"siniflar",  desc:"Sessiz etüt salonumuzda soru çözüyoruz.",   color:"#4f46e5", icon:"fa-book-reader" },
  { id:2, title:"Tokat Tarih Gezisi",        category:"aktivite",  desc:"Tarihi Tokat Saat Kulesi ziyaretimiz.",      color:"#0f766e", icon:"fa-monument" },
  { id:3, title:"Akıl Oyunları Turnuvası",   category:"aktivite",  desc:"Zeka oyunları saatimizden eğlenceli anlar.", color:"#f59e0b", icon:"fa-puzzle-piece" },
  { id:4, title:"Deneme Sınavı Birincileri", category:"basari",    desc:"Tokat geneli denemede derece yapanlar.",     color:"#10b981", icon:"fa-medal" },
  { id:5, title:"Fen Bilimleri Deneyi",      category:"siniflar",  desc:"Laboratuvarımızda elementleri keşfediyoruz.",color:"#8b5cf6", icon:"fa-flask" },
  { id:6, title:"Yıl Sonu Mezuniyet",        category:"basari",    desc:"Derece ile yerleşen mezun öğrencilerimiz.", color:"#ec4899", icon:"fa-graduation-cap" }
];

const TOKAT_SCHOOLS = [
  { name:"Tokat Fen Lisesi",                threshold:482, id:"school-fen" },
  { name:"Tokat İhya Balak Fen Lisesi",     threshold:468, id:"school-ihya" },
  { name:"Tokat Gazi Anadolu Lisesi",       threshold:450, id:"school-gazi" },
  { name:"Tokat Anadolu Lisesi",            threshold:420, id:"school-anadolu" },
  { name:"Tokat Şehit Sinan Anlar Lisesi",  threshold:390, id:"school-sinan" }
];

const WEEKLY_PLANS = {
  "3-4": {
    balanced: [
      { day:"Pazartesi",  slot1:{label:"Matematik", cls:"math",icon:"fa-calculator"}, slot2:{label:"Türkçe Okuma",cls:"verbal",icon:"fa-book-open"},   read:"Hikaye Kitabı" },
      { day:"Salı",       slot1:{label:"İngilizce", cls:"english",icon:"fa-language"},slot2:{label:"Genel Tekrar",cls:"rest",icon:"fa-rotate-left"},    read:"Günlük Kelimeler" },
      { day:"Çarşamba",   slot1:{label:"Matematik", cls:"math",icon:"fa-calculator"}, slot2:{label:"Resim & Drama",cls:"rest",icon:"fa-palette"},       read:"Dinleme Alıştırması" },
      { day:"Perşembe",   slot1:{label:"Fen Keşfi", cls:"science",icon:"fa-flask"},   slot2:{label:"Türkçe Okuma",cls:"verbal",icon:"fa-book-open"},    read:"Hikaye Kitabı" },
      { day:"Cuma",       slot1:{label:"İngilizce", cls:"english",icon:"fa-language"},slot2:{label:"Matematik",  cls:"math",icon:"fa-calculator"},      read:"Haftalık Tekrar" },
      { day:"Cumartesi",  slot1:{label:"Karma Sorular",cls:"math",icon:"fa-star"},    slot2:{label:"Serbest Zaman",cls:"rest",icon:"fa-gamepad"},       read:"Sevdiğin Kitap" },
      { day:"Pazar",      slot1:{label:"Dinlenme",  cls:"rest",icon:"fa-couch"},      slot2:{label:"Kısa Tekrar",cls:"verbal",icon:"fa-brain"},          read:"Yok (Dinlen!)" }
    ]
  },
  "5-6": {
    balanced: [
      { day:"Pazartesi",  slot1:{label:"Matematik",   cls:"math",icon:"fa-calculator"},   slot2:{label:"Türkçe Paragraf",cls:"verbal",icon:"fa-paragraph"},  read:"Paragraf Analizi" },
      { day:"Salı",       slot1:{label:"Fen Bilimleri",cls:"science",icon:"fa-flask"},    slot2:{label:"Matematik",      cls:"math",icon:"fa-calculator"},    read:"Formüller Tekrarı" },
      { day:"Çarşamba",   slot1:{label:"Türkçe",      cls:"verbal",icon:"fa-book-open"},  slot2:{label:"İngilizce",      cls:"english",icon:"fa-language"},   read:"İngilizce Hikaye" },
      { day:"Perşembe",   slot1:{label:"Fen Bilimleri",cls:"science",icon:"fa-flask"},    slot2:{label:"Sosyal Bilgiler",cls:"history",icon:"fa-landmark"},   read:"Sosyal Tekrar" },
      { day:"Cuma",       slot1:{label:"Matematik",   cls:"math",icon:"fa-calculator"},   slot2:{label:"Türkçe",         cls:"verbal",icon:"fa-book-open"},   read:"Haftalık Özet" },
      { day:"Cumartesi",  slot1:{label:"Karma Deneme",cls:"math",icon:"fa-star"},          slot2:{label:"Yanlış Analizi", cls:"rest",icon:"fa-magnifying-glass"},read:"Çözüm Kılavuzu" },
      { day:"Pazar",      slot1:{label:"Dinlenme",    cls:"rest",icon:"fa-couch"},          slot2:{label:"Kısa Hafıza Kartı",cls:"verbal",icon:"fa-brain"},    read:"Yok (Dinlen!)" }
    ],
    math: [
      { day:"Pazartesi",  slot1:{label:"Matematik",   cls:"math",icon:"fa-calculator"},   slot2:{label:"Matematik",      cls:"math",icon:"fa-calculator"},    read:"Matematik Konu Özeti" },
      { day:"Salı",       slot1:{label:"Geometri",    cls:"math",icon:"fa-shapes"},        slot2:{label:"Fen Bilimleri",  cls:"science",icon:"fa-flask"},      read:"Formüller Tekrarı" },
      { day:"Çarşamba",   slot1:{label:"Matematik",   cls:"math",icon:"fa-calculator"},   slot2:{label:"Türkçe",         cls:"verbal",icon:"fa-book-open"},   read:"Paragraf Alıştırması" },
      { day:"Perşembe",   slot1:{label:"Geometri",    cls:"math",icon:"fa-shapes"},        slot2:{label:"Matematik",      cls:"math",icon:"fa-calculator"},    read:"Matematik Tekrar" },
      { day:"Cuma",       slot1:{label:"Karma Mat.",  cls:"math",icon:"fa-star"},           slot2:{label:"Fen",            cls:"science",icon:"fa-flask"},      read:"Haftalık Mat. Özet" },
      { day:"Cumartesi",  slot1:{label:"Mat. Deneme", cls:"math",icon:"fa-star"},           slot2:{label:"Yanlış Analizi", cls:"rest",icon:"fa-magnifying-glass"},read:"Yanlış Sorular" },
      { day:"Pazar",      slot1:{label:"Dinlenme",    cls:"rest",icon:"fa-couch"},          slot2:{label:"Kısa Tekrar",    cls:"math",icon:"fa-brain"},         read:"Yok (Dinlen!)" }
    ]
  },
  "7-8": {
    balanced: [
      { day:"Pazartesi",  slot1:{label:"Matematik LGS",    cls:"math",icon:"fa-calculator"},  slot2:{label:"Türkçe LGS",    cls:"verbal",icon:"fa-paragraph"},   read:"LGS Paragraf Analizi" },
      { day:"Salı",       slot1:{label:"Fen Bilimleri",    cls:"science",icon:"fa-flask"},    slot2:{label:"İnkılap Tarihi",cls:"history",icon:"fa-landmark"},   read:"İnkılap Konu Özeti" },
      { day:"Çarşamba",   slot1:{label:"Matematik LGS",    cls:"math",icon:"fa-calculator"},  slot2:{label:"İngilizce LGS", cls:"english",icon:"fa-language"},   read:"İngilizce Gramer" },
      { day:"Perşembe",   slot1:{label:"Fen Bilimleri",    cls:"science",icon:"fa-flask"},    slot2:{label:"Din Kültürü",   cls:"history",icon:"fa-star-and-crescent"}, read:"Konu Tarama" },
      { day:"Cuma",       slot1:{label:"Türkçe LGS",       cls:"verbal",icon:"fa-book-open"}, slot2:{label:"Matematik LGS", cls:"math",icon:"fa-calculator"},    read:"Haftalık Zayıf Konu" },
      { day:"Cumartesi",  slot1:{label:"LGS Deneme Sınavı",cls:"math",icon:"fa-star"},        slot2:{label:"Deneme Analizi", cls:"rest",icon:"fa-magnifying-glass"},read:"Yanlış Soru Çözümü" },
      { day:"Pazar",      slot1:{label:"Dinlenme",         cls:"rest",icon:"fa-couch"},        slot2:{label:"Haftalık Tekrar",cls:"verbal",icon:"fa-brain"},       read:"Yok (Dinlen!)" }
    ],
    math: [
      { day:"Pazartesi",  slot1:{label:"Matematik LGS",    cls:"math",icon:"fa-calculator"},  slot2:{label:"Geometri LGS",  cls:"math",icon:"fa-shapes"},         read:"Matematik Konu Özeti" },
      { day:"Salı",       slot1:{label:"Matematik LGS",    cls:"math",icon:"fa-calculator"},  slot2:{label:"Fen Bilimleri", cls:"science",icon:"fa-flask"},        read:"Fen Formülleri" },
      { day:"Çarşamba",   slot1:{label:"Geometri LGS",     cls:"math",icon:"fa-shapes"},      slot2:{label:"Türkçe LGS",    cls:"verbal",icon:"fa-paragraph"},     read:"Paragraf Alıştırması" },
      { day:"Perşembe",   slot1:{label:"Matematik LGS",    cls:"math",icon:"fa-calculator"},  slot2:{label:"Fen Bilimleri", cls:"science",icon:"fa-flask"},        read:"Matematik Tekrar" },
      { day:"Cuma",       slot1:{label:"Karma Mat LGS",    cls:"math",icon:"fa-star"},         slot2:{label:"İnkılap",       cls:"history",icon:"fa-landmark"},     read:"Haftalık Mat. Özeti" },
      { day:"Cumartesi",  slot1:{label:"Mat. LGS Denemesi",cls:"math",icon:"fa-star"},         slot2:{label:"Yanlış Analizi",cls:"rest",icon:"fa-magnifying-glass"}, read:"Yanlış Sorular" },
      { day:"Pazar",      slot1:{label:"Dinlenme",         cls:"rest",icon:"fa-couch"},         slot2:{label:"Kısa Mat. Tekrar",cls:"math",icon:"fa-brain"},         read:"Yok (Dinlen!)" }
    ],
    "lgs-camp": [
      { day:"Pazartesi",  slot1:{label:"Mat. Kamp",cls:"math",icon:"fa-calculator"},  slot2:{label:"Fen Kamp",    cls:"science",icon:"fa-flask"},        read:"LGS Konu Özeti" },
      { day:"Salı",       slot1:{label:"Türkçe Kamp",cls:"verbal",icon:"fa-paragraph"},slot2:{label:"İnkılap Kamp",cls:"history",icon:"fa-landmark"},   read:"İnkılap Özet" },
      { day:"Çarşamba",   slot1:{label:"Mat. Kamp",cls:"math",icon:"fa-calculator"},  slot2:{label:"İngilizce Kamp",cls:"english",icon:"fa-language"},  read:"İngilizce Paragraf" },
      { day:"Perşembe",   slot1:{label:"Fen Kamp",cls:"science",icon:"fa-flask"},     slot2:{label:"Din Kültürü", cls:"history",icon:"fa-star-and-crescent"}, read:"Konu Tarama" },
      { day:"Cuma",       slot1:{label:"Türkçe Kamp",cls:"verbal",icon:"fa-book-open"},slot2:{label:"Mat. Kamp",  cls:"math",icon:"fa-calculator"},      read:"Haftalık Zayıf Konu" },
      { day:"Cumartesi",  slot1:{label:"TAM LGS Denemesi",cls:"math",icon:"fa-star"}, slot2:{label:"Tam Analiz", cls:"rest",icon:"fa-magnifying-glass"}, read:"Tüm Yanlışlar" },
      { day:"Pazar",      slot1:{label:"TAM LGS Denemesi",cls:"math",icon:"fa-star"}, slot2:{label:"Yanlış Konu",cls:"rest",icon:"fa-magnifying-glass"}, read:"Pekiştirme Soru" }
    ]
  }
};

// ============================================================
// 2. ANA UYGULAMA SINIFI
// ============================================================
class BehzatApp {
  constructor() {
    this.records     = this.load("behzat_records",      SEED_RECORDS);
    this.logs        = this.load("behzat_logs",         SEED_LOGS);
    this.siteContent = { ...SEED_SITE_CONTENT, ...this.load("behzat_site_content", SEED_SITE_CONTENT) };
    this.studentsDB  = this.load("behzat_students_db",  SEED_STUDENTS_DB);
    this.parentsDB   = this.load("behzat_parents_db",   SEED_PARENTS_DB);

    this.currentUser  = null;
    this.currentRole  = null;     // "admin" | "ogrenci" | "veli"
    this.slideIndex   = 0;
    this.slideTimer   = null;
    this.isDark       = localStorage.getItem("behzat_theme") === "dark";

    this.applyTheme();
    this.bindDOM();
    this.bindEvents();
    this.applySiteContent();
    this.renderGallery("all");
    this.startSlider();
    this.calcLGS();         // ilk yüklemede varsayılan değerlerle hesapla
    this.generatePlan();    // ilk yüklemede program oluştur
  }

  // ---------- Veri yardımcıları ----------
  load(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) || def; }
    catch { return def; }
  }
  save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  now() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }

  // ---------- Tema ----------
  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.isDark ? "dark" : "light");
    const icon = document.querySelector("#btn-theme-toggle i");
    if (icon) icon.className = this.isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem("behzat_theme", this.isDark ? "dark" : "light");
    this.applyTheme();
  }

  // ---------- DOM bağlama ----------
  bindDOM() {
    this.$toast         = document.getElementById("toast-container");
    this.$header        = document.querySelector(".main-header");
    this.$navMenu       = document.getElementById("visitor-nav");
    this.$navLinks      = document.querySelectorAll(".nav-link");
    this.$mobileToggle  = document.querySelector(".mobile-nav-toggle");
    this.$navLogo       = document.getElementById("nav-logo");
    this.$btnAdminView  = document.getElementById("btn-admin-view");
    this.$btnVisitor    = document.getElementById("btn-visitor-view");

    // Views
    this.$visitorView   = document.getElementById("visitor-view");
    this.$adminLogin    = document.getElementById("admin-login-view");
    this.$adminDash     = document.getElementById("admin-dashboard-view");

    // Forms
    this.$regForm       = document.getElementById("student-registration-form");
    this.$adminForm     = document.getElementById("admin-login-form");

    // Admin
    this.$regBody       = document.getElementById("admin-registrations-body");
    this.$gradeFilter   = document.getElementById("admin-grade-filter");
    this.$logsBox       = document.getElementById("admin-simulation-logs");
    this.$noRecords     = document.getElementById("no-records-message");

    // Modals
    this.$courseModal   = document.getElementById("course-details-modal");
    this.$editModal     = document.getElementById("edit-registration-modal");
    this.$addModal      = document.getElementById("add-record-modal");
    this.$lightbox      = document.getElementById("lightbox-modal");
    this.$cmsModal      = document.getElementById("cms-modal");
    this.$announceModal = document.getElementById("announce-modal");
    this.$portalModal   = document.getElementById("portal-modal");
  }

  // ---------- Olaylar ----------
  bindEvents() {
    // Tema toggle
    document.getElementById("btn-theme-toggle").addEventListener("click", () => this.toggleTheme());

    // Scroll header
    window.addEventListener("scroll", () => {
      this.$header.classList.toggle("scrolled", window.scrollY > 50);
    });

    // Mobile nav — CSS override sorununu önlemek için direkt style kullan
    this.$mobileToggle?.addEventListener("click", () => {
      const isOpen = this.$navMenu.style.display === "block";
      if (isOpen) {
        this.$navMenu.style.display = "none";
        this.$navMenu.classList.remove("mobile-open");
        this.$mobileToggle.classList.remove("open");
        document.body.classList.remove("mobile-nav-active");
      } else {
        this.$navMenu.style.display = "block";
        this.$navMenu.classList.add("mobile-open");
        this.$mobileToggle.classList.add("open");
        document.body.classList.add("mobile-nav-active");
      }
    });

    // Nav links smooth scroll — menüyü kapat
    this.$navLinks.forEach(l => l.addEventListener("click", e => {
      e.preventDefault();
      const hash = l.getAttribute("href");
      this.$navMenu.style.display = "none";
      this.$navMenu.classList.remove("mobile-open");
      this.$mobileToggle?.classList.remove("open");
      document.body.classList.remove("mobile-nav-active");
      this.scrollTo(hash);
      this.$navLinks.forEach(x => x.classList.remove("active"));
      l.classList.add("active");
    }));

    this.$navLogo?.addEventListener("click", e => { e.preventDefault(); this.scrollTo("#home"); });

    // View switches
    this.$btnAdminView?.addEventListener("click", () => this.showAdminLogin());
    this.$btnVisitor?.addEventListener("click",   () => this.showVisitor());

    // Kullanıcı portali butonu
    const portalBtn = document.getElementById("btn-user-portal");
    portalBtn?.addEventListener("click", () => this.openPortalModal());

    // Telefon maskeleme
    ["parentContact","add-parentContact","edit-parentContact"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", e => this.formatPhone(e.target));
    });

    // Kayıt formu
    this.$regForm?.addEventListener("submit", e => this.submitRegistration(e));

    // Admin giriş formu
    this.$adminForm?.addEventListener("submit", e => this.adminLogin(e));

    // Şifre göster/gizle
    document.getElementById("toggle-password-visibility")?.addEventListener("click", () => {
      const inp = document.getElementById("adminPassword");
      const ico = document.querySelector("#toggle-password-visibility i");
      if (!inp) return;
      inp.type = inp.type === "password" ? "text" : "password";
      ico.className = inp.type === "password" ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
    });

    // Admin çıkış
    document.getElementById("btn-admin-logout")?.addEventListener("click", () => this.adminLogout());

    // Admin filtre
    this.$gradeFilter?.addEventListener("change", () => this.renderTable());

    // Admin manuel ekle
    document.getElementById("btn-add-manual-record")?.addEventListener("click", () => {
      this.$addModal?.classList.add("active");
    });

    // CSV Export
    document.getElementById("btn-export-csv")?.addEventListener("click", () => this.exportCSV());

    // JSON Import
    document.getElementById("btn-import-json-trigger")?.addEventListener("click", () => {
      document.getElementById("admin-import-file")?.click();
    });
    document.getElementById("admin-import-file")?.addEventListener("change", e => this.importJSON(e));

    // Excel Import
    document.getElementById("btn-import-excel-trigger")?.addEventListener("click", () => {
      document.getElementById("admin-import-excel-file")?.click();
    });
    document.getElementById("admin-import-excel-file")?.addEventListener("change", e => this.importExcel(e));

    // Modal kapat butonları
    const closePairs = [
      ["btn-close-course-modal", "course-details-modal"],
      ["btn-close-edit-modal",   "edit-registration-modal"],
      ["btn-cancel-edit",        "edit-registration-modal"],
      ["btn-close-add-modal",    "add-record-modal"],
      ["btn-cancel-add",         "add-record-modal"],
      ["btn-close-lightbox",     "lightbox-modal"],
      ["btn-close-cms-modal",    "cms-modal"],
      ["btn-close-announce-modal","announce-modal"],
      ["btn-close-portal-modal", "portal-modal"]
    ];
    closePairs.forEach(([btnId, modalId]) => {
      document.getElementById(btnId)?.addEventListener("click", () => {
        document.getElementById(modalId)?.classList.remove("active");
      });
    });

    // Modal dışına tıklama
    document.querySelectorAll(".modal-overlay").forEach(m => {
      m.addEventListener("click", e => { if (e.target === m) m.classList.remove("active"); });
    });

    // Ders programı butonu
    document.getElementById("btn-modal-register-redirect")?.addEventListener("click", () => {
      this.$courseModal?.classList.remove("active");
      this.scrollTo("#register");
    });

    // Kurs detay butonları
    document.querySelectorAll(".btn-course-details").forEach(btn => {
      btn.addEventListener("click", () => {
        const key   = btn.getAttribute("data-target");
        const grade = btn.closest(".course-card")?.getAttribute("data-grade");
        this.showCourseModal(key, grade);
      });
    });

    // Galeri filtresi
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.renderGallery(btn.getAttribute("data-filter"));
      });
    });

    // Ders Programı oluştur
    document.getElementById("btn-generate-plan")?.addEventListener("click", () => this.generatePlan());
    document.getElementById("btn-print-plan")?.addEventListener("click", () => window.print());

    // LGS hesapla
    document.getElementById("btn-calculate-lgs")?.addEventListener("click", () => this.calcLGS());

    // Slider butonları
    document.getElementById("btn-prev-slide")?.addEventListener("click", () => this.slide(-1));
    document.getElementById("btn-next-slide")?.addEventListener("click", () => this.slide(1));

    // Manuel ekleme formu
    document.getElementById("add-record-form")?.addEventListener("submit", e => this.addRecord(e));

    // Düzenleme formu
    document.getElementById("edit-registration-form")?.addEventListener("submit", e => this.saveEdit(e));

    // CMS formu
    document.getElementById("cms-site-form")?.addEventListener("submit", e => this.saveCMS(e));

    // Duyuru formu
    document.getElementById("announce-form")?.addEventListener("submit", e => this.saveAnnouncement(e));

    // Portal giriş formu
    document.getElementById("portal-login-form")?.addEventListener("submit", e => this.portalLogin(e));

    // Portal çıkış
    document.getElementById("btn-portal-logout")?.addEventListener("click", () => this.portalLogout());

    // CMS Site İçeriği butonu
    document.getElementById("btn-cms-site")?.addEventListener("click", () => this.openCMSModal());

    // CMS Duyurular butonu
    document.getElementById("btn-cms-announce")?.addEventListener("click", () => this.openAnnounceModal());

    // Scroll to Top
    const stt = document.getElementById("scroll-to-top");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        stt?.classList.add("show");
      } else {
        stt?.classList.remove("show");
      }
    });
    stt?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------- Smooth Scroll ----------
  scrollTo(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }

  // ---------- Site içeriğini uygula ----------
  applySiteContent() {
    const c = this.siteContent;
    // Hero
    const ht = document.getElementById("dynamic-hero-title");
    const hs = document.getElementById("dynamic-hero-subtitle");
    if (ht) ht.textContent = c.heroTitle;
    if (hs) hs.textContent = c.heroSubtitle;
    // About
    const at = document.getElementById("dynamic-about-title");
    const ax = document.getElementById("dynamic-about-text");
    if (at) at.textContent = c.aboutTitle;
    if (ax) ax.textContent = c.aboutText;
    // Contact
    const cp = document.querySelectorAll(".dynamic-phone");
    const ce = document.querySelectorAll(".dynamic-email");
    const ca = document.querySelectorAll(".dynamic-address");
    const cwa = document.querySelectorAll(".dynamic-wa-link");
    const cleanPhone = c.contactPhone.replace(/\s/g,"");
    const cleanPhoneNoZero = cleanPhone.startsWith("0") ? cleanPhone.substring(1) : cleanPhone;
    
    cp.forEach(el => { 
      if (el.tagName === "A") el.href = "tel:" + cleanPhone;
      el.textContent = c.contactPhone; 
    });
    cwa.forEach(el => {
      el.href = `https://wa.me/90${cleanPhoneNoZero}?text=${encodeURIComponent("Merhaba Behzat Çocuk Akademi, bilgi almak istiyorum.")}`;
      if (!el.classList.contains("text-whatsapp")) {
        el.textContent = c.contactPhone;
      }
    });
    ce.forEach(el => {
      if (el.tagName === "A") el.href = "mailto:" + c.contactEmail;
      el.textContent = c.contactEmail;
    });
    ca.forEach(el => el.textContent = c.contactAddress);

    // Courses
    if (c.courses) {
      Object.keys(c.courses).forEach(grade => {
        const titleEl = document.getElementById(`course-title-${grade}`);
        const descEl = document.getElementById(`course-desc-${grade}`);
        if (titleEl) titleEl.textContent = c.courses[grade].title;
        if (descEl) descEl.textContent = c.courses[grade].desc;
      });
    }

    // Teachers
    if (c.teachers && c.teachers.length >= 3) {
      for (let i = 0; i < 3; i++) {
        const nameEl = document.getElementById(`teacher-name-${i+1}`);
        const subEl = document.getElementById(`teacher-sub-${i+1}`);
        const bioEl = document.getElementById(`teacher-bio-${i+1}`);
        if (nameEl) nameEl.textContent = c.teachers[i].name;
        if (subEl) subEl.textContent = c.teachers[i].subject;
        if (bioEl) bioEl.textContent = c.teachers[i].bio;
      }
    }

    // Testimonials
    if (c.testimonials && c.testimonials.length >= 2) {
      for (let i = 0; i < 2; i++) {
        const quoteEl = document.getElementById(`testi-quote-${i+1}`);
        const authorEl = document.getElementById(`testi-author-${i+1}`);
        const locEl = document.getElementById(`testi-loc-${i+1}`);
        if (quoteEl) quoteEl.textContent = c.testimonials[i].quote;
        if (authorEl) authorEl.textContent = c.testimonials[i].author;
        if (locEl) locEl.textContent = c.testimonials[i].loc;
      }
    }
  }

  // ---------- View yönetimi ----------
  showAdminLogin() {
    this.$visitorView?.classList.remove("active");
    this.$adminLogin?.classList.add("active");
    this.$adminDash?.classList.remove("active");
    this.$btnAdminView?.classList.add("hidden");
    this.$btnVisitor?.classList.remove("hidden");
    window.scrollTo({ top:0, behavior:"smooth" });
  }

  showVisitor() {
    this.$visitorView?.classList.add("active");
    this.$adminLogin?.classList.remove("active");
    this.$adminDash?.classList.remove("active");
    this.$btnAdminView?.classList.remove("hidden");
    this.$btnVisitor?.classList.add("hidden");
    this.currentUser = null;
    this.currentRole = null;
    window.scrollTo({ top:0, behavior:"smooth" });
  }

  // ---------- Admin Giriş / Çıkış ----------
  adminLogin(e) {
    e.preventDefault();
    const u = document.getElementById("adminUsername")?.value;
    const p = document.getElementById("adminPassword")?.value;
    if (u === "admin" && p === "behzat123") {
      this.currentUser = "admin";
      this.currentRole = "admin";
      this.$adminLogin?.classList.remove("active");
      this.$adminDash?.classList.add("active");
      this.renderTable();
      this.renderLogs();
      this.updateStats();
      this.renderAnnounceList();
      this.$adminForm?.reset();
      this.toast("Giriş Başarılı", "Yönetici paneline hoş geldiniz!", "success");
    } else {
      this.toast("Hata", "Kullanıcı adı veya şifre yanlış.", "error");
    }
  }

  adminLogout() {
    this.currentUser = null;
    this.currentRole = null;
    this.toast("Çıkış Yapıldı", "Yönetici oturumu sonlandırıldı.", "info");
    this.showVisitor();
  }

  // ---------- Kullanıcı Portali (Öğrenci / Veli) ----------
  openPortalModal() {
    const modal = document.getElementById("portal-modal");
    if (!modal) return;
    // Eğer giriş yapılmışsa direkt portal'ı göster
    if (this.currentRole === "ogrenci" || this.currentRole === "veli") {
      this.renderPortalDashboard();
    } else {
      document.getElementById("portal-login-section")?.classList.remove("hidden");
      document.getElementById("portal-dashboard-section")?.classList.add("hidden");
      document.getElementById("portal-login-form")?.reset();
    }
    modal.classList.add("active");
  }

  portalLogin(e) {
    e.preventDefault();
    const role = document.querySelector("input[name='portal-role']:checked")?.value;
    const user = document.getElementById("portal-username")?.value?.trim();
    const pass = document.getElementById("portal-password")?.value;

    if (role === "ogrenci") {
      const found = this.studentsDB.find(s => s.username === user && s.password === pass);
      if (found) {
        this.currentUser = found;
        this.currentRole = "ogrenci";
        this.renderPortalDashboard();
        this.toast("Hoş geldiniz!", `Merhaba ${found.name}`, "success");
      } else {
        this.toast("Hata", "Öğrenci kullanıcı adı veya şifre hatalı.", "error");
      }
    } else {
      const found = this.parentsDB.find(p => p.username === user && p.password === pass);
      if (found) {
        this.currentUser = found;
        this.currentRole = "veli";
        this.renderPortalDashboard();
        this.toast("Hoş geldiniz!", `Merhaba ${found.name}`, "success");
      } else {
        this.toast("Hata", "Veli kullanıcı adı veya şifre hatalı.", "error");
      }
    }
  }

  portalLogout() {
    this.currentUser = null;
    this.currentRole = null;
    document.getElementById("portal-login-section")?.classList.remove("hidden");
    document.getElementById("portal-dashboard-section")?.classList.add("hidden");
    this.toast("Çıkış", "Portal oturumunuz sonlandırıldı.", "info");
  }

  renderPortalDashboard() {
    document.getElementById("portal-login-section")?.classList.add("hidden");
    const dash = document.getElementById("portal-dashboard-section");
    if (!dash) return;
    dash.classList.remove("hidden");

    const user = this.currentUser;
    const role = this.currentRole;
    const content = this.siteContent;

    // Duyurular
    const announcements = content.announcements.filter(a => a.target === "all" || a.target === role);
    const annHTML = announcements.length
      ? announcements.map(a => `
          <div class="portal-announce-item">
            <div class="pa-header">
              <h5>${a.title}</h5>
              <span class="portal-date">${a.date}</span>
            </div>
            <p>${a.text}</p>
          </div>`).join("")
      : `<p style="color:var(--text-muted); font-style:italic;">Henüz duyuru yok.</p>`;

    let roleHTML = "";

    if (role === "ogrenci") {
      const examRows = user.exams.map(ex => `
        <tr>
          <td>${ex.name}</td>
          <td>
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <div style="flex:1;height:8px;background:var(--border-color);border-radius:50px;overflow:hidden;">
                <div style="width:${ex.score}%;height:100%;background:linear-gradient(90deg,var(--accent),var(--primary));border-radius:50px;"></div>
              </div>
              <strong style="color:var(--primary);font-family:'Outfit',sans-serif;">${ex.score}</strong>
            </div>
          </td>
        </tr>`).join("");

      roleHTML = `
        <div class="portal-section">
          <h4><i class="fa-solid fa-chart-line"></i> Deneme Sınavı Sonuçlarım</h4>
          <table class="data-table">
            <thead><tr><th>Sınav Adı</th><th>Puan</th></tr></thead>
            <tbody>${examRows}</tbody>
          </table>
        </div>
        <div class="portal-section">
          <h4><i class="fa-solid fa-circle-info"></i> Öğrenci Bilgilerim</h4>
          <p><strong>Ad Soyad:</strong> ${user.name}</p>
          <p><strong>Sınıf:</strong> ${user.grade}. Sınıf</p>
        </div>`;
    }

    if (role === "veli") {
      const childrenInfo = user.children.map(cId => {
        const child = this.studentsDB.find(s => s.username === cId);
        if (!child) return "";
        const exams = child.exams.map(ex => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border-color);">
            <span style="font-size:0.9rem;">${ex.name}</span>
            <span style="font-weight:700;color:var(--primary);font-family:'Outfit';">${ex.score}</span>
          </div>`).join("");
        return `
          <div class="portal-child-card">
            <div class="portal-child-header">
              <i class="fa-solid fa-user-graduate"></i>
              <div>
                <h5>${child.name}</h5>
                <span>${child.grade}. Sınıf</span>
              </div>
              <a href="https://wa.me/905441705295?text=Merhaba%2C%20${encodeURIComponent(child.name)}%20adl%C4%B1%20%C3%B6%C4%9Frencimle%20ilgili%20bilgi%20almak%20istiyorum." target="_blank" class="btn btn-light btn-sm"><i class="fa-brands fa-whatsapp"></i> Öğretmenle İletişim</a>
            </div>
            <div style="margin-top:1rem;">
              <h6 style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;">SINAV SONUÇLARI</h6>
              ${exams || "<em style='color:var(--text-muted);font-size:0.85rem;'>Henüz sonuç girilmemiş.</em>"}
            </div>
          </div>`;
      }).join("");

      roleHTML = `
        <div class="portal-section">
          <h4><i class="fa-solid fa-children"></i> Çocuğumun Gelişim Takibi</h4>
          ${childrenInfo || "<p>Bağlı öğrenci bulunamadı.</p>"}
        </div>`;
    }

    dash.innerHTML = `
      <div class="portal-header-bar">
        <div>
          <h3><i class="fa-solid fa-${role === "ogrenci" ? "user-graduate" : "user-tie"}"></i> ${user.name}</h3>
          <span class="badge badge-accent">${role === "ogrenci" ? "Öğrenci Portalı" : "Veli Portalı"}</span>
        </div>
        <button id="btn-portal-logout" class="btn btn-danger btn-sm"><i class="fa-solid fa-right-from-bracket"></i> Çıkış</button>
      </div>

      <div class="portal-announce-box">
        <h4><i class="fa-solid fa-bullhorn"></i> Duyurular</h4>
        ${annHTML}
      </div>

      ${roleHTML}
    `;

    // Çıkış butonunu yeniden bağla (dinamik render ediliyor)
    document.getElementById("btn-portal-logout")?.addEventListener("click", () => this.portalLogout());
  }

  // ---------- CMS: Site İçeriği Düzenleme ----------
  openCMSModal() {
    const modal = document.getElementById("cms-modal");
    if (!modal) return;
    const c = this.siteContent;
    document.getElementById("cms-hero-title")     && (document.getElementById("cms-hero-title").value     = c.heroTitle);
    document.getElementById("cms-hero-subtitle")  && (document.getElementById("cms-hero-subtitle").value  = c.heroSubtitle);
    document.getElementById("cms-about-title")    && (document.getElementById("cms-about-title").value    = c.aboutTitle);
    document.getElementById("cms-about-text")     && (document.getElementById("cms-about-text").value     = c.aboutText);
    document.getElementById("cms-phone")          && (document.getElementById("cms-phone").value          = c.contactPhone);
    document.getElementById("cms-email")          && (document.getElementById("cms-email").value          = c.contactEmail);
    document.getElementById("cms-address")        && (document.getElementById("cms-address").value        = c.contactAddress);

    // Populate Courses
    if (c.courses) {
      document.getElementById("cms-course-title-34") && (document.getElementById("cms-course-title-34").value = c.courses["3-4"].title);
      document.getElementById("cms-course-desc-34")  && (document.getElementById("cms-course-desc-34").value  = c.courses["3-4"].desc);
      document.getElementById("cms-course-title-56") && (document.getElementById("cms-course-title-56").value = c.courses["5-6"].title);
      document.getElementById("cms-course-desc-56")  && (document.getElementById("cms-course-desc-56").value  = c.courses["5-6"].desc);
      document.getElementById("cms-course-title-78") && (document.getElementById("cms-course-title-78").value = c.courses["7-8"].title);
      document.getElementById("cms-course-desc-78")  && (document.getElementById("cms-course-desc-78").value  = c.courses["7-8"].desc);
    }

    // Populate Teachers
    if (c.teachers && c.teachers.length >= 3) {
      for (let i = 0; i < 3; i++) {
        document.getElementById(`cms-teacher-name-${i+1}`) && (document.getElementById(`cms-teacher-name-${i+1}`).value = c.teachers[i].name);
        document.getElementById(`cms-teacher-sub-${i+1}`)  && (document.getElementById(`cms-teacher-sub-${i+1}`).value  = c.teachers[i].subject);
        document.getElementById(`cms-teacher-bio-${i+1}`)  && (document.getElementById(`cms-teacher-bio-${i+1}`).value  = c.teachers[i].bio);
      }
    }

    // Populate Testimonials
    if (c.testimonials && c.testimonials.length >= 2) {
      for (let i = 0; i < 2; i++) {
        document.getElementById(`cms-testi-author-${i+1}`) && (document.getElementById(`cms-testi-author-${i+1}`).value = c.testimonials[i].author);
        document.getElementById(`cms-testi-loc-${i+1}`)    && (document.getElementById(`cms-testi-loc-${i+1}`).value    = c.testimonials[i].loc);
        document.getElementById(`cms-testi-quote-${i+1}`)  && (document.getElementById(`cms-testi-quote-${i+1}`).value  = c.testimonials[i].quote);
      }
    }

    modal.classList.add("active");
  }

  saveCMS(e) {
    e.preventDefault();
    this.siteContent.heroTitle      = document.getElementById("cms-hero-title")?.value    || this.siteContent.heroTitle;
    this.siteContent.heroSubtitle   = document.getElementById("cms-hero-subtitle")?.value || this.siteContent.heroSubtitle;
    this.siteContent.aboutTitle     = document.getElementById("cms-about-title")?.value   || this.siteContent.aboutTitle;
    this.siteContent.aboutText      = document.getElementById("cms-about-text")?.value    || this.siteContent.aboutText;
    this.siteContent.contactPhone   = document.getElementById("cms-phone")?.value         || this.siteContent.contactPhone;
    this.siteContent.contactEmail   = document.getElementById("cms-email")?.value         || this.siteContent.contactEmail;
    this.siteContent.contactAddress = document.getElementById("cms-address")?.value       || this.siteContent.contactAddress;

    // Save Courses
    if (!this.siteContent.courses) this.siteContent.courses = {};
    this.siteContent.courses["3-4"] = {
      title: document.getElementById("cms-course-title-34")?.value || "3. ve 4. Sınıflar",
      desc: document.getElementById("cms-course-desc-34")?.value || ""
    };
    this.siteContent.courses["5-6"] = {
      title: document.getElementById("cms-course-title-56")?.value || "5. ve 6. Sınıflar",
      desc: document.getElementById("cms-course-desc-56")?.value || ""
    };
    this.siteContent.courses["7-8"] = {
      title: document.getElementById("cms-course-title-78")?.value || "7. ve 8. Sınıflar",
      desc: document.getElementById("cms-course-desc-78")?.value || ""
    };

    // Save Teachers
    if (!this.siteContent.teachers) this.siteContent.teachers = [];
    for (let i = 0; i < 3; i++) {
      this.siteContent.teachers[i] = {
        name: document.getElementById(`cms-teacher-name-${i+1}`)?.value || "",
        subject: document.getElementById(`cms-teacher-sub-${i+1}`)?.value || "",
        bio: document.getElementById(`cms-teacher-bio-${i+1}`)?.value || ""
      };
    }

    // Save Testimonials
    if (!this.siteContent.testimonials) this.siteContent.testimonials = [];
    for (let i = 0; i < 2; i++) {
      this.siteContent.testimonials[i] = {
        author: document.getElementById(`cms-testi-author-${i+1}`)?.value || "",
        loc: document.getElementById(`cms-testi-loc-${i+1}`)?.value || "",
        quote: document.getElementById(`cms-testi-quote-${i+1}`)?.value || ""
      };
    }

    this.save("behzat_site_content", this.siteContent);
    this.applySiteContent();
    document.getElementById("cms-modal")?.classList.remove("active");
    this.toast("İçerik Güncellendi", "Site içeriği başarıyla değiştirildi ve kaydedildi.", "success");
    this.addLog({ time:this.now(), type:"system", msg:`Site içeriği yönetici tarafından güncellendi.` });
    this.renderLogs();
  }

  // ---------- CMS: Duyuru Yönetimi ----------
  openAnnounceModal() {
    const modal = document.getElementById("announce-modal");
    if (!modal) return;
    this.renderAnnounceList();
    document.getElementById("announce-form")?.reset();
    modal.classList.add("active");
  }

  renderAnnounceList() {
    const list = document.getElementById("announce-list");
    if (!list) return;
    const anns = this.siteContent.announcements;
    if (!anns.length) { list.innerHTML = `<p style="color:var(--text-muted);font-style:italic;">Henüz duyuru yok.</p>`; return; }
    list.innerHTML = anns.map(a => `
      <div class="announce-item">
        <div class="announce-item-header">
          <div>
            <strong>${a.title}</strong>
            <span class="badge badge-accent" style="font-size:0.65rem;margin-left:0.5rem;">${a.target === "all" ? "Herkes" : a.target === "veli" ? "Veliler" : "Öğrenciler"}</span>
          </div>
          <button class="btn-icon btn-delete" onclick="window.behzatApp.deleteAnnouncement('${a.id}')" title="Sil"><i class="fa-solid fa-trash"></i></button>
        </div>
        <p>${a.text}</p>
        <small style="color:var(--text-muted);">${a.date}</small>
      </div>`).join("");
  }

  saveAnnouncement(e) {
    e.preventDefault();
    const title  = document.getElementById("ann-title")?.value;
    const text   = document.getElementById("ann-text")?.value;
    const target = document.getElementById("ann-target")?.value;
    if (!title || !text) return;
    const newAnn = { id:"ann_" + Date.now(), title, text, target, date:this.now().split(" ")[0] };
    this.siteContent.announcements.unshift(newAnn);
    this.save("behzat_site_content", this.siteContent);
    this.renderAnnounceList();
    document.getElementById("announce-form")?.reset();
    this.toast("Duyuru Eklendi", `'${title}' başlıklı duyuru yayınlandı.`, "success");
  }

  deleteAnnouncement(id) {
    this.siteContent.announcements = this.siteContent.announcements.filter(a => a.id !== id);
    this.save("behzat_site_content", this.siteContent);
    this.renderAnnounceList();
    this.toast("Duyuru Silindi", "Duyuru kaldırıldı.", "info");
  }

  // ---------- Öğrenci Kayıt Formu ----------
  submitRegistration(e) {
    e.preventDefault();
    const pName    = document.getElementById("parentName")?.value;
    const sName    = document.getElementById("studentName")?.value;
    const pContact = document.getElementById("parentContact")?.value;
    const grade    = document.getElementById("studentGrade")?.value;

    if (!this.validateReg(pName, sName, pContact, grade)) return;

    const rec = { id:"rec_"+Date.now(), parentName:pName.trim(), studentName:sName.trim(), parentContact:pContact, studentGrade:grade, date:this.now(), status:"Bekliyor" };
    this.records.unshift(rec);
    this.save("behzat_records", this.records);

    const t = this.now();
    this.addLog({ time:t, type:"email", msg:`demirkirancaner355@gmail.com — ${rec.studentName} ön kayıt bildirimi iletildi.` });
    this.addLog({ time:t, type:"sms",   msg:`05441705295 — '${rec.studentName} için ön kayıt alındı.' SMS gönderildi.` });

    this.toast("Kayıt Alındı!", "Ön başvurunuz başarıyla kaydedildi.", "success");
    setTimeout(() => this.toast("E-posta Gönderildi", "demirkirancaner355@gmail.com adresine bildirim iletildi.", "info"), 1200);
    setTimeout(() => this.toast("SMS Gönderildi", "05441705295 numarasına SMS iletildi.", "info"), 2200);

    const waText = `Merhaba Behzat Çocuk Akademi, ${rec.studentName} isimli ${rec.studentGrade}. sınıf öğrencisi için ön kayıt yaptırdım. Bilgi alabilir miyim? (Veli: ${rec.parentName})`;
    setTimeout(() => window.open(`https://wa.me/905441705295?text=${encodeURIComponent(waText)}`, "_blank"), 3000);
    this.$regForm?.reset();
  }

  validateReg(pName, sName, pContact, grade) {
    document.querySelectorAll(".form-error").forEach(el => el.textContent = "");
    let ok = true;
    if (!pName || pName.trim().length < 3) { document.getElementById("parentName-error").textContent = "En az 3 karakter giriniz."; ok = false; }
    if (!sName || sName.trim().length < 3) { document.getElementById("studentName-error").textContent = "En az 3 karakter giriniz."; ok = false; }
    if (!pContact || pContact.replace(/\D/g,"").length !== 11) { document.getElementById("parentContact-error").textContent = "Geçerli bir telefon giriniz (11 hane)."; ok = false; }
    if (!grade) { document.getElementById("studentGrade-error").textContent = "Lütfen sınıf seçiniz."; ok = false; }
    if (!ok) this.toast("Eksik Bilgi", "Lütfen formdaki hataları giderin.", "error");
    return ok;
  }

  formatPhone(inp) {
    let v = inp.value.replace(/\D/g,"");
    if (v && v[0] !== "0") v = "0" + v;
    let f = v.substring(0,4);
    if (v.length > 4)  f += " " + v.substring(4,7);
    if (v.length > 7)  f += " " + v.substring(7,9);
    if (v.length > 9)  f += " " + v.substring(9,11);
    inp.value = f;
  }

  // ---------- Kurs Detay Modal ----------
  showCourseModal(key, grade) {
    const d = COURSE_DETAILS[key];
    if (!d) return;
    const banner = document.getElementById("course-modal-banner");
    banner.className = "modal-header-banner";
    if (grade === "3-4") banner.classList.add("banner-3-4");
    if (grade === "5-6") banner.classList.add("banner-5-6");
    if (grade === "7-8") banner.classList.add("banner-7-8");
    document.getElementById("course-modal-title").textContent   = d.title;
    document.getElementById("course-modal-schedule").textContent = d.schedule;
    document.getElementById("course-modal-goals").textContent    = d.goals;
    document.getElementById("course-modal-teachers").textContent = d.teachers;
    this.$courseModal?.classList.add("active");
  }

  // ---------- Galeri ----------
  renderGallery(cat) {
    const grid = document.getElementById("gallery-grid-container");
    if (!grid) return;
    grid.innerHTML = "";
    const list = cat === "all" ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter(p => p.category === cat);
    list.forEach(photo => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `
        <div class="gallery-fallback-card">
          <i class="fa-solid ${photo.icon}" style="color:${photo.color};"></i>
          <h4>${photo.title}</h4>
          <p class="section-tag font-alt" style="font-size:0.7rem;color:${photo.color};margin-top:0.5rem;">${photo.category.toUpperCase()}</p>
        </div>
        <div class="gallery-overlay">
          <span>${photo.category}</span>
          <h4>${photo.title}</h4>
          <p style="color:#cbd5e1;font-size:0.8rem;">${photo.desc}</p>
        </div>`;
      item.addEventListener("click", () => this.openLightbox(photo));
      grid.appendChild(item);
    });
  }

  openLightbox(photo) {
    const img   = document.getElementById("lightbox-img");
    const wrap  = this.$lightbox?.querySelector(".lightbox-img-wrapper");
    if (!wrap) return;
    if (img) img.style.display = "none";
    wrap.querySelector(".lightbox-themed-panel")?.remove();
    const panel = document.createElement("div");
    panel.className = "lightbox-themed-panel";
    panel.style.cssText = "padding:5rem 2rem;text-align:center;background:linear-gradient(135deg,#1e1b4b,#0f172a);color:#fff;display:flex;flex-direction:column;align-items:center;gap:1.5rem;min-height:320px;width:100%;border-radius:8px;";
    panel.innerHTML = `<i class="fa-solid ${photo.icon}" style="font-size:5rem;color:var(--accent);"></i><h2 style="color:#fff;font-family:'Outfit';">${photo.title}</h2><p style="color:#94a3b8;max-width:400px;">${photo.desc}</p><span class="badge badge-accent">Tokat Behzat Akademi</span>`;
    wrap.appendChild(panel);
    document.getElementById("lightbox-caption").textContent = `${photo.title} — ${photo.desc}`;
    this.$lightbox?.classList.add("active");
  }

  // ---------- Ders Programı ----------
  generatePlan() {
    const grade = document.getElementById("planner-grade")?.value  || "7-8";
    const focus = document.getElementById("planner-focus")?.value  || "balanced";
    const body  = document.getElementById("planner-result-body");
    if (!body) return;

    const data = (WEEKLY_PLANS[grade] || {})[focus] || WEEKLY_PLANS[grade]?.balanced || [];

    const focusLabels = { balanced:"Dengeli Çalışma", math:"Matematik Ağırlıklı", "lgs-camp":"Yoğun LGS Kampı" };
    document.getElementById("planner-output-title").textContent    = `${grade}. Sınıf — ${focusLabels[focus] || ""}`;
    document.getElementById("planner-output-subtitle").textContent = `Seçiminize göre hazırlanan haftalık ders takip çizelgesi.`;

    body.innerHTML = data.map(row => `
      <tr>
        <td><span class="planner-day-label"><i class="fa-regular fa-calendar-days"></i> ${row.day}</span></td>
        <td><span class="planner-slot-pill ${row.slot1.cls}"><i class="fa-solid ${row.slot1.icon}"></i> ${row.slot1.label}</span></td>
        <td><span class="planner-slot-pill ${row.slot2.cls}"><i class="fa-solid ${row.slot2.icon}"></i> ${row.slot2.label}</span></td>
        <td><span style="font-size:0.85rem;color:var(--text-muted);"><i class="fa-solid fa-book"></i> ${row.read}</span></td>
      </tr>`).join("");
  }

  // ---------- LGS Puan Hesaplama ----------
  calcLGS() {
    const get = id => parseFloat(document.getElementById(id)?.value) || 0;
    const netTr     = get("net-turkce");
    const netMat    = get("net-mat");
    const netFen    = get("net-fen");
    const netInkilap= get("net-inkilap");
    const netDin    = get("net-din");
    const netIng    = get("net-ing");

    // Ağırlıklı net hesaplama (LGS 2024 sistem formülü yaklaşımı)
    const weightedNet = (netTr * 4) + (netMat * 4) + (netFen * 4) + (netInkilap * 2) + (netDin * 2) + (netIng * 2);
    const totalNet    = netTr + netMat + netFen + netInkilap + netDin + netIng;

    // Puan tahmini: Ortalama formül yaklaşımı
    const baseScore  = 200;
    const score      = Math.min(500, Math.max(100, Math.round((baseScore + (weightedNet / 20) * 7.5) * 100) / 100));
    const percentile = Math.max(0.1, (100 - (score - 100) / 4)).toFixed(1);

    // Ekrana yaz
    const scoreEl = document.getElementById("calc-score-display");
    const netEl   = document.getElementById("calc-net-display");
    const pctEl   = document.getElementById("calc-percentile-display");
    if (scoreEl) scoreEl.textContent = score.toFixed(3);
    if (netEl)   netEl.textContent   = totalNet.toFixed(1);
    if (pctEl)   pctEl.textContent   = percentile;

    // Okulları güncelle
    this.updateSchoolTargets(score);
  }

  updateSchoolTargets(score) {
    const container = document.querySelector(".targets-list-box");
    if (!container) return;

    // Önce mevcut school item'larını temizle (başlık hariç)
    const heading = container.querySelector("h4");
    container.innerHTML = "";
    if (heading) container.appendChild(heading);

    TOKAT_SCHOOLS.forEach(school => {
      const pct  = Math.min(100, Math.round((score / school.threshold) * 100));
      const pass = score >= school.threshold;
      const near = !pass && pct >= 90;

      let statusClass, statusIcon, statusLabel;
      if (pass) { statusClass = "unlock success"; statusIcon = "fa-check-double"; statusLabel = school.threshold + " Puan"; }
      else if (near) { statusClass = "unlock"; statusIcon = "fa-lock-open"; statusLabel = school.threshold + " Puan"; }
      else { statusClass = "lock"; statusIcon = "fa-lock"; statusLabel = school.threshold + " Puan"; }

      let msg;
      if (pass)    msg = `<span class="target-msg text-success">Puanın bu lise için yeterli! Tebrikler.</span>`;
      else if (near) msg = `<span class="target-msg">Çok yakınsın! Biraz daha çalışırsan kesin kazanabilirsin.</span>`;
      else msg = `<span class="target-msg">Hedefe ulaşmak için ${school.threshold - Math.round(score)} puan daha gerekiyor.</span>`;

      const fillClass = pass ? "bg-success" : "";
      const div = document.createElement("div");
      div.className = "target-school-item";
      div.innerHTML = `
        <div class="school-header">
          <h5>${school.name}</h5>
          <span class="status-indicator ${statusClass}"><i class="fa-solid ${statusIcon}"></i> ${statusLabel}</span>
        </div>
        <div class="progress-bar-wrap"><div class="progress-fill ${fillClass}" style="width:${pct}%"></div></div>
        ${msg}`;
      container.appendChild(div);
    });
  }

  // ---------- Testimonial Slider ----------
  startSlider() {
    this.slideTimer = setInterval(() => this.slide(1), 6000);
  }

  slide(dir) {
    const cards = document.querySelectorAll(".testimonial-card.slide");
    if (!cards.length) return;
    clearInterval(this.slideTimer);
    cards[this.slideIndex]?.classList.remove("active");
    this.slideIndex = (this.slideIndex + dir + cards.length) % cards.length;
    cards[this.slideIndex]?.classList.add("active");
    this.slideTimer = setInterval(() => this.slide(1), 6000);
  }

  // ---------- Admin: Tablo, Log, Stats ----------
  renderTable() {
    if (!this.$regBody) return;
    this.$regBody.innerHTML = "";
    const filter = this.$gradeFilter?.value || "all";
    const list   = filter === "all" ? this.records : this.records.filter(r => r.studentGrade === filter);

    const table = document.getElementById("admin-registrations-table");
    if (!list.length) {
      this.$noRecords?.classList.remove("hidden");
      table && (table.style.display = "none");
      return;
    }
    this.$noRecords?.classList.add("hidden");
    table && (table.style.display = "table");

    list.forEach(r => {
      const sc = { "Bekliyor":"bekliyor", "Arandı":"arandi", "Kayıt Yapıldı":"kayit-yapildi", "İptal Edildi":"iptal" }[r.status] || "bekliyor";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="td-student-name">${r.studentName}</td>
        <td>${r.parentName}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px;white-space:nowrap;">
            <a href="tel:${r.parentContact.replace(/\s/g,"")}" class="contact-link" style="white-space:nowrap;"><i class="fa-solid fa-phone"></i> ${r.parentContact}</a>
            <a href="https://wa.me/90${r.parentContact.replace(/\D/g,"")}" target="_blank" class="contact-link" style="color:#25d366;font-size:1.15rem;display:inline-flex;align-items:center;" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
          </div>
        </td>
        <td><span class="badge badge-accent">${r.studentGrade}. Sınıf</span></td>
        <td class="td-date">${r.date}</td>
        <td><span class="status-badge ${sc}">${r.status}</span></td>
        <td class="text-right">
          <div class="action-btns-wrap">
            <button class="btn-icon btn-edit-record" data-id="${r.id}" title="Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn-icon btn-delete btn-delete-record" data-id="${r.id}" title="Sil"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>`;
      tr.querySelector(".btn-edit-record").addEventListener("click",   () => this.openEditModal(r.id));
      tr.querySelector(".btn-delete-record").addEventListener("click", () => this.deleteRecord(r.id));
      this.$regBody.appendChild(tr);
    });
  }

  renderLogs() {
    if (!this.$logsBox) return;
    this.$logsBox.innerHTML = "";
    this.logs.forEach(l => {
      const icons = { email:"fa-envelope", sms:"fa-mobile-screen-button", system:"fa-cogs" };
      const div = document.createElement("div");
      div.className = "log-item";
      div.innerHTML = `<span class="log-time">[${l.time.slice(11,16)}]</span><span class="log-type ${l.type}"><i class="fa-solid ${icons[l.type]||"fa-cogs"}"></i> ${l.type.toUpperCase()}</span><span class="log-body">${l.msg}</span>`;
      this.$logsBox.appendChild(div);
    });
  }

  updateStats() {
    const total   = this.records.length;
    const pending = this.records.filter(r => r.status === "Bekliyor").length;
    const approved= this.records.filter(r => r.status === "Kayıt Yapıldı").length;
    const alerts  = this.logs.filter(l => l.type === "email" || l.type === "sms").length;
    document.getElementById("stat-total-registrations").textContent = total;
    document.getElementById("stat-pending-calls").textContent       = pending;
    document.getElementById("stat-approved-records").textContent    = approved;
    document.getElementById("stat-total-alerts").textContent        = alerts;
    this.updateDonut();
  }

  updateDonut() {
    const c34 = this.records.filter(r => r.studentGrade==="3"||r.studentGrade==="4").length;
    const c56 = this.records.filter(r => r.studentGrade==="5"||r.studentGrade==="6").length;
    const c78 = this.records.filter(r => r.studentGrade==="7"||r.studentGrade==="8").length;
    const tot = this.records.length;
    document.getElementById("donut-total-label").textContent = tot;
    document.getElementById("legend-count-34").textContent   = c34;
    document.getElementById("legend-count-56").textContent   = c56;
    document.getElementById("legend-count-78").textContent   = c78;
    const circ = 2 * Math.PI * 40;
    const set = (id, pct, offset) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute("stroke-dasharray", `${pct*circ} ${circ}`);
      el.setAttribute("stroke-dashoffset", -offset);
    };
    if (!tot) { ["donut-segment-34","donut-segment-56","donut-segment-78"].forEach(id => { const el=document.getElementById(id); el&&el.setAttribute("stroke-dasharray",`0 ${circ}`); }); return; }
    const p34=c34/tot, p56=c56/tot;
    set("donut-segment-34", p34, 0);
    set("donut-segment-56", p56, p34*circ);
    set("donut-segment-78", c78/tot, (p34+p56)*circ);
  }

  addLog(entry) { this.logs.unshift(entry); this.save("behzat_logs", this.logs); }

  // ---------- CRUD ----------
  openEditModal(id) {
    const r = this.records.find(x => x.id === id);
    if (!r) return;
    document.getElementById("edit-record-id").value    = r.id;
    document.getElementById("edit-parentName").value   = r.parentName;
    document.getElementById("edit-studentName").value  = r.studentName;
    document.getElementById("edit-parentContact").value= r.parentContact;
    document.getElementById("edit-studentGrade").value = r.studentGrade;
    document.getElementById("edit-status").value       = r.status;
    this.$editModal?.classList.add("active");
  }

  saveEdit(e) {
    e.preventDefault();
    const id  = document.getElementById("edit-record-id").value;
    const idx = this.records.findIndex(r => r.id === id);
    if (idx === -1) return;
    const old = { ...this.records[idx] };
    this.records[idx] = {
      ...this.records[idx],
      parentName:    document.getElementById("edit-parentName").value.trim(),
      studentName:   document.getElementById("edit-studentName").value.trim(),
      parentContact: document.getElementById("edit-parentContact").value,
      studentGrade:  document.getElementById("edit-studentGrade").value,
      status:        document.getElementById("edit-status").value
    };
    this.save("behzat_records", this.records);
    this.addLog({ time:this.now(), type:"system", msg:`Kayıt güncellendi: ${this.records[idx].studentName}${old.status!==this.records[idx].status ? ` | Durum: ${old.status} → ${this.records[idx].status}` : ""}` });
    this.$editModal?.classList.remove("active");
    this.renderTable(); this.renderLogs(); this.updateStats();
    this.toast("Güncellendi", "Kayıt başarıyla düzenlendi.", "success");
  }

  addRecord(e) {
    e.preventDefault();
    const rec = {
      id:            "rec_" + Date.now(),
      parentName:    document.getElementById("add-parentName").value.trim(),
      studentName:   document.getElementById("add-studentName").value.trim(),
      parentContact: document.getElementById("add-parentContact").value,
      studentGrade:  document.getElementById("add-studentGrade").value,
      date:          this.now(),
      status:        document.getElementById("add-status").value
    };
    this.records.unshift(rec);
    this.save("behzat_records", this.records);
    this.addLog({ time:this.now(), type:"system", msg:`Manuel kayıt eklendi: ${rec.studentName}` });
    this.addLog({ time:this.now(), type:"email",  msg:`demirkirancaner355@gmail.com — Manuel kayıt bildirimi: ${rec.studentName}` });
    this.$addModal?.classList.remove("active");
    document.getElementById("add-record-form")?.reset();
    this.renderTable(); this.renderLogs(); this.updateStats();
    this.toast("Kayıt Eklendi", "Manuel kayıt başarıyla oluşturuldu.", "success");
  }

  deleteRecord(id) {
    if (!confirm("Bu kaydı silmek istediğinizden emin misiniz?")) return;
    const r = this.records.find(x => x.id === id);
    this.records = this.records.filter(x => x.id !== id);
    this.save("behzat_records", this.records);
    this.addLog({ time:this.now(), type:"system", msg:`Kayıt silindi: ${r?.studentName || id}` });
    this.renderTable(); this.renderLogs(); this.updateStats();
    this.toast("Silindi", "Kayıt veritabanından kaldırıldı.", "info");
  }

  // ---------- Export / Import ----------
  exportCSV() {
    const header = ["Öğrenci Adı Soyadı", "Veli Adı Soyadı", "Veli Telefon Numarası", "Sınıfı", "Kayıt Başvuru Tarihi", "Kayıt Durumu"];
    const rows   = this.records.map(r => [
      r.studentName,
      r.parentName,
      r.parentContact,
      r.studentGrade + ". Sınıf",
      r.date,
      r.status
    ].map(v => `"${v.replace(/"/g, '""')}"`).join(";"));
    const csv    = "\uFEFF" + [header.join(";"), ...rows].join("\n");
    const blob   = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a");
    a.href = url; a.download = `behzat_akademi_kayitlar_${this.now().replace(/[: ]/g,"_")}.csv`;
    a.click(); URL.revokeObjectURL(url);
    this.toast("Excel/CSV İndirildi", `${this.records.length} kayıt Excel uyumlu olarak aktarıldı.`, "success");
  }

  importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error("Geçersiz format");
        this.records = data;
        this.save("behzat_records", this.records);
        this.renderTable(); this.updateStats();
        this.addLog({ time:this.now(), type:"system", msg:`JSON dosyasından ${data.length} kayıt içe aktarıldı.` });
        this.renderLogs();
        this.toast("İçe Aktarıldı", `${data.length} kayıt başarıyla yüklendi.`, "success");
      } catch {
        this.toast("Hata", "Geçersiz JSON dosyası. Lütfen doğru formatta yükleyin.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  importExcel(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = new Uint8Array(ev.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonRows.length < 2) {
          this.toast("Hata", "Excel dosyası boş veya başlık satırı eksik.", "error");
          return;
        }

        const headers = jsonRows[0].map(h => String(h || "").trim().toLowerCase());
        
        const studentNameIdx = headers.findIndex(h => h.includes("öğrenci") || h.includes("ogrenci"));
        const parentNameIdx = headers.findIndex(h => h.includes("veli adı") || h.includes("veli adi") || h.includes("veli"));
        const parentContactIdx = headers.findIndex(h => h.includes("telefon") || h.includes("iletisim") || h.includes("iletişim") || h.includes("contact"));
        const studentGradeIdx = headers.findIndex(h => h.includes("sınıf") || h.includes("sinif") || h.includes("grade"));
        const dateIdx = headers.findIndex(h => h.includes("tarih") || h.includes("date"));
        const statusIdx = headers.findIndex(h => h.includes("durum") || h.includes("status"));

        if (studentNameIdx === -1 || parentContactIdx === -1) {
          this.toast("Hata", "Excel sütunları eşleşmedi. En az 'Öğrenci Adı' ve 'Telefon' sütunları olmalı.", "error");
          return;
        }

        let newRecordsCount = 0;
        const newRecords = [];

        for (let i = 1; i < jsonRows.length; i++) {
          const row = jsonRows[i];
          if (!row || row.length === 0 || !row[studentNameIdx]) continue;

          const studentName = String(row[studentNameIdx] || "").trim();
          const parentName = parentNameIdx !== -1 ? String(row[parentNameIdx] || "").trim() : "Bilinmiyor";
          const parentContactRaw = parentContactIdx !== -1 ? String(row[parentContactIdx] || "").trim() : "";
          
          let parentContact = parentContactRaw;
          let digits = parentContactRaw.replace(/\D/g, "");
          if (digits.length === 10) digits = "0" + digits;
          if (digits.length === 11 && digits.startsWith("0")) {
            parentContact = `${digits.substring(0,4)} ${digits.substring(4,7)} ${digits.substring(7,9)} ${digits.substring(9,11)}`;
          }

          let studentGrade = studentGradeIdx !== -1 ? String(row[studentGradeIdx] || "").replace(/\D/g, "") : "8";
          if (!["3","4","5","6","7","8"].includes(studentGrade)) {
            studentGrade = "8";
          }

          const date = dateIdx !== -1 && row[dateIdx] ? String(row[dateIdx]).trim() : this.now();
          const status = statusIdx !== -1 && row[statusIdx] ? String(row[statusIdx]).trim() : "Bekliyor";

          const isDuplicate = this.records.some(r => 
            r.studentName.toLowerCase() === studentName.toLowerCase() &&
            r.parentContact.replace(/\D/g, "") === parentContact.replace(/\D/g, "")
          );

          if (!isDuplicate) {
            newRecords.push({
              id: "rec_" + Date.now() + "_" + i,
              parentName,
              studentName,
              parentContact,
              studentGrade,
              date,
              status
            });
            newRecordsCount++;
          }
        }

        if (newRecordsCount > 0) {
          this.records = [...newRecords, ...this.records];
          this.save("behzat_records", this.records);
          this.renderTable();
          this.updateStats();
          this.addLog({ time:this.now(), type:"system", msg:`Excel dosyasından ${newRecordsCount} yeni kayıt eklendi.` });
          this.renderLogs();
          this.toast("Başarılı", `${newRecordsCount} yeni kayıt sisteme eklendi (Mevcutlar korundu).`, "success");
        } else {
          this.toast("Bilgi", "Yüklenecek yeni kayıt bulunamadı (Tüm kayıtlar zaten mevcut).", "info");
        }

      } catch (err) {
        console.error(err);
        this.toast("Hata", "Excel okunurken bir hata oluştu.", "error");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }

  // ---------- Toast Bildirimi ----------
  toast(title, msg, type = "success") {
    const icons = { success:"fa-circle-check", error:"fa-circle-exclamation", info:"fa-circle-info" };
    const el    = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `
      <div class="toast-icon"><i class="fa-solid ${icons[type]||"fa-circle-check"}"></i></div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${msg}</div>
      </div>
      <button class="toast-close">&times;</button>`;
    el.querySelector(".toast-close").addEventListener("click", () => {
      el.classList.add("removing");
      setTimeout(() => el.remove(), 400);
    });
    this.$toast?.appendChild(el);
    setTimeout(() => { if (el.parentNode) { el.classList.add("removing"); setTimeout(() => el.remove(), 400); } }, 5500);
  }
}

// ============================================================
// 3. BAŞLAT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  window.behzatApp = new BehzatApp();
});
