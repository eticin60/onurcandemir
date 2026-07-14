// ==========================================================================
// SEVGİLİ CHAT - UYGULAMA MANTIĞI (APPLICATION LOGIC)
// ==========================================================================

// Global Değişkenler ve Ayarlar
const BUCKET_ID = 'loveChatOnurEmine007';
const API_BASE = `https://kvdb.io/${BUCKET_ID}`;
const SECRET_KEY = 'emine-onur-love-forever'; // Şifreleme Anahtarı

let currentUser = null; // 'Onur' veya 'Emine'
let partnerUser = null;  // Karşı taraf
let localMessages = [];
let pollingInterval = null;
let typingTimeout = null;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let recordStartTime = null;
let recordTimerInterval = null;

// Sayfa yüklendiğinde uçuşan kalpleri başlat
document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();
  setupPasscode();
  setupChatInput();
  setupModals();
});

// ==========================================================================
// ŞİFRE & HESAP YÖNETİMİ (LOGIN / PASSCODE)
// ==========================================================================

const passcodes = {
  'onur': 'Onur',
  'emine': 'Emine'
};

function setupPasscode() {
  const passcodeInput = document.getElementById('passcode-input');
  const btnSubmit = document.getElementById('btn-login-submit');
  const errorMsg = document.getElementById('error-message');

  // Sayfa açıldığında odağı şifre alanına ver (mobil klavye için tetikleyici)
  setTimeout(() => {
    passcodeInput.focus();
  }, 300);

  const verifyPasscode = () => {
    const enteredCode = passcodeInput.value.trim().toLowerCase();
    const user = passcodes[enteredCode];
    
    if (user) {
      // Başarılı giriş
      currentUser = user;
      partnerUser = user === 'Onur' ? 'Emine' : 'Onur';
      
      // Giriş animasyonu
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4a85', '#9d4edd', '#ffb3c6']
      });

      // Klavyeyi kapat
      passcodeInput.blur();

      setTimeout(() => {
        loginToChat();
      }, 600);
    } else {
      // Hatalı şifre
      errorMsg.textContent = "Hatalı Şifre! 😢";
      errorMsg.classList.add('visible');
      passcodeInput.value = '';
      
      // Hata sesi veya titreşim simülasyonu
      if (navigator.vibrate) navigator.vibrate(200);

      setTimeout(() => {
        errorMsg.classList.remove('visible');
      }, 3000);
    }
  };

  // Her tuş basımında şifreyi otomatik kontrol et (Onur 4 haneli, Emine 5 haneli)
  passcodeInput.addEventListener('input', () => {
    const val = passcodeInput.value.trim().toLowerCase();
    if (passcodes[val]) {
      verifyPasscode();
    }
  });

  // Enter tuşuna basıldığında kontrol et
  passcodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      verifyPasscode();
    }
  });

  // Butona tıklandığında kontrol et
  btnSubmit.addEventListener('click', verifyPasscode);
}

let lastNotificationTime = Date.now();

function loginToChat() {
  document.getElementById('login-page').classList.remove('active');
  document.getElementById('chat-page').classList.add('active');
  
  // Arayüz isimlerini güncelle
  document.getElementById('partner-name').textContent = partnerUser;
  document.getElementById('partner-avatar').textContent = partnerUser[0];

  // Bildirim İznini İste
  requestNotificationPermission();
  lastNotificationTime = Date.now();

  // Mesajları çekmeye başla
  pollMessages();
  pollingInterval = setInterval(() => {
    pollMessages();
    checkPartnerTyping();
    updatePartnerOnlineStatus();
  }, 2000);
}

// ==========================================================================
// ARKA PLAN ANİMASYON KALPLERİ
// ==========================================================================

function initFloatingHearts() {
  const bg = document.getElementById('heart-bg');
  const heartIcons = ['fa-heart', 'fa-heart-pulse', 'fa-heart-circle-bolt'];
  
  setInterval(() => {
    const heart = document.createElement('i');
    const randomIcon = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.className = `fa-solid ${randomIcon} floating-heart`;
    
    // Rastgele boyut ve konum
    const size = Math.random() * 20 + 10; // 10px - 30px
    const left = Math.random() * 100; // 0% - 100%
    const duration = Math.random() * 5 + 5; // 5s - 10s
    
    heart.style.fontSize = `${size}px`;
    heart.style.left = `${left}%`;
    heart.style.animationDuration = `${duration}s`;
    
    bg.appendChild(heart);
    
    // Animasyon bitince kaldır
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }, 800);
}

// ==========================================================================
// KRİPTOGRAFİ (AES ŞİFRELEME)
// ==========================================================================

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

function decrypt(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Şifre çözme hatası:", e);
    return "[Şifreli Mesaj]";
  }
}

// ==========================================================================
// VERİ ERİŞİMİ & EŞİTLEME (REST POLLER)
// ==========================================================================

// Bildirim sistemi yardımcı fonksiyonları
function requestNotificationPermission() {
  if ("Notification" in window) {
    if (Notification.permission === "default") {
      Notification.permission = "default";
      Notification.requestPermission();
    }
  }
}

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.error("Bildirim sesi çalınamadı:", e);
  }
}

function triggerNewMessageNotification(msg) {
  // Sesi çal (her koşulda)
  playNotificationSound();

  // Tarayıcı arka plandaysa veya sekme aktif değilse sistem bildirimi gönder
  if (document.hidden && "Notification" in window && Notification.permission === "granted") {
    let bodyText = "Yeni bir mesaj gönderdi.";
    if (msg.type === 'text') {
      bodyText = msg.text;
    } else if (msg.type === 'image') {
      bodyText = "📷 Bir fotoğraf gönderdi.";
    } else if (msg.type === 'voice') {
      bodyText = "🎤 Bir ses kaydı gönderdi.";
    } else if (msg.type === 'proposal') {
      bodyText = "📅 Yeni bir buluşma teklifi oluşturdu!";
    }

    const notificationTitle = `${partnerUser}'den Yeni Mesaj! 💬`;
    const notification = new Notification(notificationTitle, {
      body: bodyText,
      icon: 'onurcandemir.png' // Sitenin logosu
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

function triggerProposalAcceptedCelebration(msg) {
  // Ekranda konfeti patlat
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.5 },
    colors: ['#ff4a85', '#e0a96d', '#2ec4b6']
  });

  // Kalp atışı / onay sesi çal
  playHeartbeatSound();

  // Tarayıcı arka plandaysa sistem bildirimi gönder
  if (document.hidden && "Notification" in window && Notification.permission === "granted") {
    const notification = new Notification(`Buluşma Onaylandı! 🥂`, {
      body: `${partnerUser} buluşma teklifini kabul etti!`,
      icon: 'onurcandemir.png'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

async function pollMessages() {
  try {
    const response = await fetch(`${API_BASE}/messages`);
    if (response.status === 404) return;
    
    const cipherText = await response.text();
    if (!cipherText) return;
    
    const plainText = decrypt(cipherText);
    const messages = JSON.parse(plainText);
    
    if (JSON.stringify(messages) !== JSON.stringify(localMessages)) {
      // 1. Yeni gelen mesajları filtrele (Son bildirim zamanından sonra ve partner tarafından gönderilenler)
      const newPartnerMsgs = messages.filter(m => m.timestamp > lastNotificationTime && m.sender === partnerUser);
      
      if (newPartnerMsgs.length > 0) {
        const latestMsg = newPartnerMsgs[newPartnerMsgs.length - 1];
        triggerNewMessageNotification(latestMsg);
        lastNotificationTime = latestMsg.timestamp;
      }

      // 2. Partnerin bizim gönderdiğimiz bir buluşma teklifini kabul edip etmediğini kontrol et
      messages.forEach(msg => {
        if (msg.type === 'proposal' && msg.proposal.status === 'accepted') {
          const localMsg = localMessages.find(m => m.id === msg.id);
          // Eğer yerelde bu teklif 'pending' (beklemede) durumundaysa, partner yeni onayladı demektir!
          if (localMsg && localMsg.proposal && localMsg.proposal.status === 'pending') {
            triggerProposalAcceptedCelebration(msg);
          }
        }
      });
      
      localMessages = messages;
      renderMessages();
    }
  } catch (e) {
    console.error("Mesajlar çekilemedi:", e);
  }
}

async function saveMessages(messages) {
  try {
    const cipherText = encrypt(JSON.stringify(messages));
    await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      body: cipherText
    });
  } catch (e) {
    console.error("Mesajlar kaydedilemedi:", e);
  }
}

async function sendChatMessage(type, textContent = "", mediaId = "", proposalData = null) {
  const newMsg = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    sender: currentUser,
    timestamp: Date.now(),
    type: type, // 'text' | 'image' | 'voice' | 'proposal'
    text: textContent,
    mediaId: mediaId,
    proposal: proposalData
  };

  localMessages.push(newMsg);
  renderMessages();
  await saveMessages(localMessages);
}

// Medya Yükleme (Fotoğraf & Ses Kaydı)
async function uploadMedia(base64Data) {
  const mediaId = 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const cipherMedia = encrypt(base64Data);
  
  await fetch(`${API_BASE}/${mediaId}`, {
    method: 'POST',
    body: cipherMedia
  });
  
  return mediaId;
}

// Medya Çekme (Lazy Load)
async function fetchMedia(mediaId) {
  try {
    const response = await fetch(`${API_BASE}/${mediaId}`);
    if (!response.ok) return null;
    const cipherText = await response.text();
    return decrypt(cipherText);
  } catch (e) {
    console.error("Medya indirilemedi:", e);
    return null;
  }
}

// ==========================================================================
// CHAT ARAYÜZÜ OLUŞTURMA & YAZMA (RENDERING)
// ==========================================================================

const mediaCache = {}; // Tekrar indirmemek için önbellek

function renderMessages() {
  const container = document.getElementById('messages-container');
  
  // Mevcut mesaj ID'lerini takip etmek için bir liste oluştur
  const renderedIds = Array.from(container.querySelectorAll('.msg-wrapper')).map(el => el.id);
  const newMessages = localMessages.filter(msg => !renderedIds.includes(msg.id));
  
  // Eğer hiç mesaj yoksa veya tamamen sıfırlandıysa temizle ve yeniden çiz
  if (localMessages.length === 0 || renderedIds.length > localMessages.length) {
    container.innerHTML = `
      <div class="chat-start-notice">
        <i class="fa-solid fa-sparkles"></i>
        <p>Sohbete hoş geldiniz! ❤️ Mesajlarınız uçtan uca şifrelidir.</p>
      </div>
    `;
    localMessages.forEach(msg => appendMessageDOM(msg, container));
  } else {
    // Sadece yeni gelen mesajları ekle (Performans için)
    newMessages.forEach(msg => appendMessageDOM(msg, container));
  }
  
  // Eğer tekliflerin durumu değiştiyse, tüm mesajları tekrar çiz
  const proposalStateChanged = localMessages.some(msg => {
    if (msg.type === 'proposal') {
      const domCard = document.getElementById(msg.id);
      if (domCard) {
        const isDomAccepted = domCard.querySelector('.prop-card-accepted') !== null;
        const isMsgAccepted = msg.proposal.status === 'accepted';
        return isDomAccepted !== isMsgAccepted;
      }
    }
    return false;
  });

  if (proposalStateChanged) {
    container.innerHTML = `
      <div class="chat-start-notice">
        <i class="fa-solid fa-sparkles"></i>
        <p>Sohbete hoş geldiniz! ❤️ Mesajlarınız uçtan uca şifrelidir.</p>
      </div>
    `;
    localMessages.forEach(msg => appendMessageDOM(msg, container));
  }

  scrollToBottom();
}

function appendMessageDOM(msg, container) {
  const isMe = msg.sender === currentUser;
  
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ${isMe ? 'me' : 'other'}`;
  wrapper.id = msg.id;

  const timeString = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (msg.type === 'proposal') {
    // Buluşma Teklifi Kartı
    wrapper.classList.remove('me', 'other');
    wrapper.className = 'msg-proposal-wrapper';
    wrapper.innerHTML = createProposalCardHTML(msg, isMe);
    
    // Kaçan buton ve kabul butonları için event listener ekle
    setTimeout(() => setupProposalCardEvents(msg), 50);
  } else {
    // Normal Mesaj Baloncuğu
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    if (msg.type === 'text') {
      bubble.textContent = msg.text;
    } else if (msg.type === 'image') {
      // Yükleniyor iskeleti
      bubble.innerHTML = `<div class="image-loader"><i class="fa-solid fa-spinner fa-spin"></i> Fotoğraf Yükleniyor...</div>`;
      
      // Lazy load görsel
      loadMediaMessage(msg.mediaId, (base64) => {
        bubble.innerHTML = `<img class="msg-image" src="${base64}" alt="Fotoğraf">`;
        bubble.querySelector('.msg-image').addEventListener('click', () => openLightbox(base64));
        scrollToBottom();
      });
    } else if (msg.type === 'voice') {
      // Yükleniyor iskeleti
      bubble.innerHTML = `<div class="audio-loader"><i class="fa-solid fa-spinner fa-spin"></i> Ses Yükleniyor...</div>`;
      
      // Lazy load ses
      loadMediaMessage(msg.mediaId, (base64) => {
        bubble.innerHTML = createAudioPlayerHTML(base64);
        setupAudioPlayerEvents(bubble);
        scrollToBottom();
      });
    }

    const info = document.createElement('div');
    info.className = 'msg-info';
    
    // Onurcan için silme/düzenleme kontrolleri
    let actionsHTML = '';
    if (currentUser === 'Onur') {
      const editIcon = (msg.type === 'text') ? `<span class="msg-action edit" onclick="editMessage('${msg.id}')" title="Mesajı Düzenle"><i class="fa-solid fa-pen"></i> Düzenle</span>` : '';
      const deleteIcon = `<span class="msg-action delete" onclick="deleteMessage('${msg.id}')" title="Mesajı Sil"><i class="fa-solid fa-trash"></i> Sil</span>`;
      actionsHTML = `<div class="msg-actions">${editIcon}${deleteIcon}</div>`;
    }
    
    info.innerHTML = `<span>${timeString}</span>${actionsHTML}`;

    wrapper.appendChild(bubble);
    wrapper.appendChild(info);
  }

  container.appendChild(wrapper);
}

function loadMediaMessage(mediaId, callback) {
  if (mediaCache[mediaId]) {
    callback(mediaCache[mediaId]);
    return;
  }
  
  fetchMedia(mediaId).then(base64 => {
    if (base64) {
      mediaCache[mediaId] = base64;
      callback(base64);
    }
  });
}

function scrollToBottom() {
  const container = document.getElementById('messages-container');
  container.scrollTop = container.scrollHeight;
}

// ==========================================================================
// BULUŞMA KARTI HTML & ETKİLEŞİM (DODGING BUTTON)
// ==========================================================================

function createProposalCardHTML(msg, isMe) {
  const p = msg.proposal;
  const isAccepted = p.status === 'accepted';
  const timeString = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const concepts = {
    dinner:      { emoji: '🍕', text: 'Baş başa bir Akşam Yemeği' },
    coffee:      { emoji: '☕', text: 'Sıcak bir Kahve Buluşması' },
    movie:       { emoji: '🍿', text: 'Romantik Sinema Keyfi' },
    picnic:      { emoji: '🧺', text: 'Doğa ile baş başa Piknik' },
    stars:       { emoji: '✨', text: 'Yıldız İzleme Gecesi' },
    fingirdeme:  { emoji: '🤭', text: 'Fingirdeme Vakti' },
    fanfinfon:   { emoji: '😈', text: 'FanFinFon' }
  };

  const concept = concepts[p.concept] || { emoji: '💖', text: 'Sürpriz Buluşma' };

  let actionButtonsHTML = '';
  if (isAccepted) {
    actionButtonsHTML = `
      <div class="prop-card-accepted">
        <i class="fa-solid fa-champagne-glasses"></i> Teklif Kabul Edildi! 💖
      </div>
    `;
  } else if (isMe) {
    actionButtonsHTML = `
      <div class="prop-card-accepted" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: var(--text-secondary);">
        <i class="fa-solid fa-hourglass-half"></i> Cevap bekleniyor...
      </div>
    `;
  } else {
    actionButtonsHTML = `
      <div class="prop-card-actions">
        <button class="prop-btn accept-yes" data-action="accept-yes">Evet 💖</button>
        <button class="prop-btn accept-absolutely" data-action="accept-abs">Kesinlikle Evet! 💕</button>
        <button class="prop-btn reject-no" data-action="reject">Hayır 😢</button>
      </div>
    `;
  }

  // Tarih biçimlendirme (GG.AA.YYYY)
  const formattedDate = p.date.split('-').reverse().join('.');

  return `
    <div class="proposal-card">
      <div class="prop-card-header">
        <span class="prop-card-title">Buluşma Daveti</span>
        <span class="prop-card-concept" title="${concept.text}">${concept.emoji}</span>
      </div>
      <div class="prop-card-details">
        <div class="prop-detail-item">
          <i class="fa-solid fa-star"></i>
          <span>Konsept: <strong>${concept.text}</strong></span>
        </div>
        <div class="prop-detail-item">
          <i class="fa-solid fa-calendar-days"></i>
          <span>Tarih: <strong>${formattedDate}</strong></span>
        </div>
        <div class="prop-detail-item">
          <i class="fa-solid fa-clock"></i>
          <span>Saat: <strong>${p.time}</strong></span>
        </div>
        <div class="prop-detail-item">
          <i class="fa-solid fa-location-dot"></i>
          <span>Mekan: <strong>${p.location}</strong></span>
        </div>
        ${p.note ? `<div class="prop-card-note">${p.note}</div>` : ''}
      </div>
      ${actionButtonsHTML}
      <div class="msg-info" style="justify-content: space-between; margin-top: 5px;">
        ${currentUser === 'Onur' ? `<span class="msg-action delete" onclick="deleteMessage('${msg.id}')" style="cursor: pointer; color: #ff3366;"><i class="fa-solid fa-trash"></i> Talebi Sil</span>` : '<span></span>'}
        <span>${msg.sender} tarafından gönderildi • ${timeString}</span>
      </div>
    </div>
  `;
}

function setupProposalCardEvents(msg) {
  const card = document.getElementById(msg.id);
  if (!card) return;

  const btnYes = card.querySelector('[data-action="accept-yes"]');
  const btnAbs = card.querySelector('[data-action="accept-abs"]');
  const btnNo = card.querySelector('[data-action="reject"]');

  const acceptProposal = async () => {
    // Teklifi kabul et
    msg.proposal.status = 'accepted';
    
    // Ekranda konfeti patlat
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#ff4a85', '#e0a96d', '#2ec4b6']
    });

    // Ses efekti
    playHeartbeatSound();

    // Veritabanını güncelle
    await saveMessages(localMessages);
    renderMessages();
    updateDiary();
  };

  if (btnYes) btnYes.addEventListener('click', acceptProposal);
  if (btnAbs) btnAbs.addEventListener('click', acceptProposal);

  if (btnNo) {
    const dodge = (e) => {
      e.preventDefault();
      
      const cardRect = card.getBoundingClientRect();
      const btnWidth = btnNo.offsetWidth;
      const btnHeight = btnNo.offsetHeight;
      
      // Kart sınırları içinde rastgele bir pozisyona taşıyalım
      // Buton absolute olacağı için kartın sol-üst köşesini referans alacak
      const minX = 10;
      const minY = 50;
      const maxX = cardRect.width - btnWidth - 10;
      const maxY = cardRect.height - btnHeight - 20;

      const randomX = Math.random() * (maxX - minX) + minX;
      const randomY = Math.random() * (maxY - minY) + minY;

      btnNo.style.position = 'absolute';
      btnNo.style.left = `${randomX}px`;
      btnNo.style.top = `${randomY}px`;
      btnNo.style.zIndex = '999';
    };

    // Mobilde dokunulduğunda, masaüstünde mouse yaklaştığında kaçsın
    btnNo.addEventListener('mouseover', dodge);
    btnNo.addEventListener('touchstart', dodge);
    btnNo.addEventListener('click', (e) => {
      // Bir şekilde tıklanırsa bile yine de kaçsın, işlem yapmasın
      e.preventDefault();
      dodge(e);
    });
  }
}

// ==========================================================================
// SES OYNATICI (AUDIO PLAYER CONTROLS)
// ==========================================================================

function createAudioPlayerHTML(base64Audio) {
  return `
    <div class="audio-player">
      <button class="audio-play-btn"><i class="fa-solid fa-play"></i></button>
      <div class="audio-waveform-bars">
        <span class="wave-bar"></span>
        <span class="wave-bar"></span>
        <span class="wave-bar"></span>
        <span class="wave-bar"></span>
        <span class="wave-bar"></span>
        <span class="wave-bar"></span>
      </div>
      <span class="audio-time">Ses</span>
    </div>
  `;
}

function setupAudioPlayerEvents(bubble) {
  const player = bubble.querySelector('.audio-player');
  const playBtn = player.querySelector('.audio-play-btn');
  const playIcon = playBtn.querySelector('i');
  const timeText = player.querySelector('.audio-time');
  
  // Lazy-loaded audio element
  const audioLoader = bubble.closest('.msg-wrapper').id;
  const messageData = localMessages.find(m => m.id === audioLoader);
  
  if (!messageData) return;
  
  let audio = null;

  const initAudio = () => {
    if (audio) return;
    const base64 = mediaCache[messageData.mediaId];
    audio = new Audio(base64);
    
    audio.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      timeText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });

    audio.addEventListener('timeupdate', () => {
      const currentMin = Math.floor(audio.currentTime / 60);
      const currentSec = Math.floor(audio.currentTime % 60);
      timeText.textContent = `${currentMin}:${currentSec.toString().padStart(2, '0')}`;
    });

    audio.addEventListener('ended', () => {
      playIcon.className = 'fa-solid fa-play';
      player.classList.remove('playing');
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      timeText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });
  };

  playBtn.addEventListener('click', () => {
    initAudio();
    // Diğer çalan sesleri durdur
    document.querySelectorAll('audio').forEach(el => {
      if (el !== audio) {
        el.pause();
        el.currentTime = 0;
      }
    });
    document.querySelectorAll('.audio-player').forEach(el => {
      if (el !== player) {
        el.classList.remove('playing');
        const playBtnI = el.querySelector('.audio-play-btn i');
        if (playBtnI) playBtnI.className = 'fa-solid fa-play';
      }
    });

    if (audio.paused) {
      audio.play();
      playIcon.className = 'fa-solid fa-pause';
      player.classList.add('playing');
    } else {
      audio.pause();
      playIcon.className = 'fa-solid fa-play';
      player.classList.remove('playing');
    }
  });
}

// ==========================================================================
// SES KAYDEDİCİ (MEDIA RECORDER API)
// ==========================================================================

const recordBtn = document.getElementById('btn-record');
const recordOverlay = document.getElementById('record-overlay');
const recordingTimer = document.getElementById('recording-timer');

// Ses kaydını hem basılı tutma hem de mobil dokunma ile yönetmek için
let recordTimer = null;

function setupAudioRecorder() {
  const startRecording = async (e) => {
    e.preventDefault();
    if (isRecording) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });
      
      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Blob'u Base64'e dönüştür
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          
          // Yükle ve mesajı gönder
          const mediaId = await uploadMedia(base64Audio);
          await sendChatMessage('voice', '', mediaId);
        };
        
        // Mikrofon kullanımını kapat
        stream.getTracks().forEach(track => track.stop());
      });

      mediaRecorder.start();
      isRecording = true;
      recordBtn.classList.add('recording');
      recordOverlay.classList.add('active');
      
      recordStartTime = Date.now();
      updateRecordTimer();
      recordTimerInterval = setInterval(updateRecordTimer, 1000);
      
    } catch (err) {
      console.error("Mikrofon izni alınamadı:", err);
      alert("Ses kaydı yapabilmek için mikrofon izni vermelisiniz!");
    }
  };

  const stopRecording = (e) => {
    e.preventDefault();
    if (!isRecording) return;
    
    mediaRecorder.stop();
    isRecording = false;
    recordBtn.classList.remove('recording');
    recordOverlay.classList.remove('active');
    clearInterval(recordTimerInterval);
  };

  // Masaüstü mousedown/mouseup
  recordBtn.addEventListener('mousedown', startRecording);
  recordBtn.addEventListener('mouseup', stopRecording);
  recordBtn.addEventListener('mouseleave', stopRecording);

  // Mobil touchstart/touchend
  recordBtn.addEventListener('touchstart', startRecording);
  recordBtn.addEventListener('touchend', stopRecording);
  recordBtn.addEventListener('touchcancel', stopRecording);
}

function updateRecordTimer() {
  const elapsed = Date.now() - recordStartTime;
  const seconds = Math.floor((elapsed / 1000) % 60);
  const minutes = Math.floor((elapsed / 60000) % 60);
  recordingTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

setupAudioRecorder();

// ==========================================================================
// FOTOĞRAF GÖNDERME & CANVAS SIKIŞTIRMA (IMAGE COMPRESSOR)
// ==========================================================================

const photoBtn = document.getElementById('btn-photo');
const photoInput = document.getElementById('photo-input');

photoBtn.addEventListener('click', () => photoInput.click());

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    
    img.onload = async () => {
      // Görsel boyutlandırma ve sıkıştırma (Canvas)
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      const max_size = 600; // Maksimum genişlik veya yükseklik
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // JPEG formatında 0.6 kalitesiyle sıkıştır (Base64)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
      
      // Medyayı şifreli olarak yükle ve mesajı gönder
      const mediaId = await uploadMedia(compressedBase64);
      await sendChatMessage('image', '', mediaId);
      
      // Inputu sıfırla
      photoInput.value = '';
    };
  };
});

// Görsel Önizleme Lightbox
function openLightbox(base64) {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  lightboxImg.src = base64;
  lightbox.style.display = 'block';
}

document.getElementById('close-lightbox').addEventListener('click', () => {
  document.getElementById('image-lightbox').style.display = 'none';
});

document.getElementById('image-lightbox').addEventListener('click', (e) => {
  if (e.target !== document.getElementById('lightbox-img')) {
    document.getElementById('image-lightbox').style.display = 'none';
  }
});

// ==========================================================================
// CHAT METİN GİRİŞİ & YAZIYOR... (INPUT & TYPING SENSORS)
// ==========================================================================

const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('btn-send');

function setupChatInput() {
  // Gönder butonu görünürlüğü
  messageInput.addEventListener('input', () => {
    // Textarea yüksekliğini içeriğe göre ayarla
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight) + 'px';

    if (messageInput.value.trim().length > 0) {
      sendBtn.style.display = 'flex';
      recordBtn.style.display = 'none';
    } else {
      sendBtn.style.display = 'none';
      recordBtn.style.display = 'flex';
      messageInput.style.height = 'auto';
    }

    // Yazıyor... tetiklemesi
    triggerTypingStatus();
  });

  // Metin mesajı gönderme
  const sendText = async () => {
    const text = messageInput.value.trim();
    if (text.length === 0) return;
    
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.style.display = 'none';
    recordBtn.style.display = 'flex';
    
    // Yazmayı durdur
    clearTimeout(typingTimeout);
    setTypingStatus(false);

    await sendChatMessage('text', text);
  };

  sendBtn.addEventListener('click', sendText);
  
  // Enter tuşuyla gönderim (Mobil cihazlarda normal yeni satır olması için Shift+Enter kontrolü yapılabilir)
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  });
}

// Yazıyor durumu API senkronizasyonu
async function setTypingStatus(isTyping) {
  if (!currentUser) return;
  try {
    await fetch(`${API_BASE}/typing_${currentUser}`, {
      method: 'POST',
      body: isTyping ? '1' : '0'
    });
  } catch (e) {
    console.error("Yazıyor bilgisi güncellenemedi:", e);
  }
}

function triggerTypingStatus() {
  setTypingStatus(true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    setTypingStatus(false);
  }, 3000);
}

// Karşı tarafın yazıp yazmadığını kontrol et
async function checkPartnerTyping() {
  if (!partnerUser) return;
  try {
    const response = await fetch(`${API_BASE}/typing_${partnerUser}`);
    if (response.status === 404) return;
    const text = await response.text();
    
    const indicator = document.getElementById('typing-indicator');
    if (text === '1') {
      indicator.style.display = 'flex';
    } else {
      indicator.style.display = 'none';
    }
  } catch (e) {
    console.error("Karşı taraf yazma bilgisi alınamadı:", e);
  }
}

// Çevrimiçi Durumunu Güncelle (Son görülmeyi KVDB'ye kaydeder)
async function updatePartnerOnlineStatus() {
  if (!currentUser) return;
  try {
    // Kendi çevrimiçi zamanını güncelle (sadece sekme aktifken)
    if (!document.hidden) {
      await fetch(`${API_BASE}/online_${currentUser}`, {
        method: 'POST',
        body: Date.now().toString()
      });
    }

    // Partnerin çevrimiçi zamanını al
    const res = await fetch(`${API_BASE}/online_${partnerUser}`);
    const statusTextEl = document.querySelector('.status-text');
    const pulseDot   = document.querySelector('.pulse-dot');
    if (!statusTextEl || !pulseDot) return;

    if (res.status === 404) {
      statusTextEl.textContent = 'Henüz giriş yapmadı';
      pulseDot.style.backgroundColor = '#a0a0a0';
      pulseDot.style.boxShadow = 'none';
      return;
    }

    const partnerLastOnline = parseInt(await res.text());
    const diffMs = Date.now() - partnerLastOnline;

    // 12 saniyeden önce → çevrimiçi
    if (diffMs < 12000) {
      statusTextEl.textContent = 'Çevrimiçi';
      pulseDot.style.backgroundColor = '#2ec4b6';
      pulseDot.style.boxShadow = '0 0 8px #2ec4b6';
    } else {
      // Son görülme zamanı formatla
      const lastDate = new Date(partnerLastOnline);
      const now = new Date();
      let lastSeenText;

      if (now.toDateString() === lastDate.toDateString()) {
        // Bugün — sadece saat
        lastSeenText = 'Son görülme: ' + lastDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      } else {
        // Başka gün — tarih + saat
        lastSeenText = 'Son görülme: ' + lastDate.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
          + ' ' + lastDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      }

      statusTextEl.textContent = lastSeenText;
      pulseDot.style.backgroundColor = '#a0a0a0';
      pulseDot.style.boxShadow = 'none';
    }
  } catch (e) {
    console.error("Çevrimiçi durum hatası:", e);
  }
}

// Sekme yeniden aktif olduğunda anında ping at
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && currentUser) {
    updatePartnerOnlineStatus();
  }
});

// ==========================================================================
// MODALLAR - BULUŞMA TALEP ETME & GÜNLÜK (MODALS ENGINE)
// ==========================================================================

function setupModals() {
  const proposalModal = document.getElementById('proposal-modal');
  const diaryModal = document.getElementById('diary-modal');
  
  // Modalları Aç
  document.getElementById('btn-proposal').addEventListener('click', () => {
    // Bugünün tarihini varsayılan yap
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('prop-date').value = today;
    document.getElementById('prop-time').value = '19:30';
    proposalModal.classList.add('active');
  });

  document.getElementById('btn-diary').addEventListener('click', () => {
    updateDiary();
    diaryModal.classList.add('active');
  });

  // Modalları Kapat
  document.getElementById('close-proposal').addEventListener('click', () => proposalModal.classList.remove('active'));
  document.getElementById('close-diary').addEventListener('click', () => diaryModal.classList.remove('active'));

  // Konsept Seçimi Radyo Buton Değişimi
  const options = document.querySelectorAll('.concept-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      opt.querySelector('input').checked = true;
    });
  });

  // Buluşma Teklifi Form Gönderimi
  document.getElementById('proposal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const concept = document.querySelector('input[name="concept"]:checked').value;
    const date = document.getElementById('prop-date').value;
    const time = document.getElementById('prop-time').value;
    const location = document.getElementById('prop-location').value;
    const note = document.getElementById('prop-note').value.trim();

    const proposalData = {
      concept,
      date,
      time,
      location,
      note,
      status: 'pending'
    };

    proposalModal.classList.remove('active');
    document.getElementById('proposal-form').reset();
    
    // Varsayılan değerleri tekrar ata
    document.querySelectorAll('.concept-option').forEach(o => o.classList.remove('active'));
    document.querySelectorAll('.concept-option')[0].classList.add('active');
    document.querySelectorAll('.concept-option')[0].querySelector('input').checked = true;

    // Teklifi gönder
    await sendChatMessage('proposal', '', '', proposalData);
  });

  // Çıkış Yap Butonu
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm("Çıkış yapmak istiyor musunuz?")) {
      clearInterval(pollingInterval);
      setTypingStatus(false);
      
      currentUser = null;
      partnerUser = null;
      localMessages = [];
      
      document.getElementById('chat-page').classList.remove('active');
      document.getElementById('login-page').classList.add('active');
      
      // Şifre alanını temizle
      document.getElementById('passcode-input').value = '';
    }
  });
}

function updateDiary() {
  const timeline = document.getElementById('diary-timeline');
  const statsPlanned = document.getElementById('stats-planned');
  
  // Sadece kabul edilen buluşmaları al
  const acceptedProposals = localMessages
    .filter(m => m.type === 'proposal' && m.proposal.status === 'accepted')
    .sort((a, b) => {
      // Tarih ve saate göre sırala (Yakın tarihten uzak tarihe veya tersi)
      const dateA = new Date(`${a.proposal.date}T${a.proposal.time}`);
      const dateB = new Date(`${b.proposal.date}T${b.proposal.time}`);
      return dateB - dateA;
    });

  statsPlanned.textContent = acceptedProposals.length;

  if (acceptedProposals.length === 0) {
    timeline.innerHTML = '<div class="empty-timeline">Henüz onaylanmış bir buluşmamız yok. İlk adımı sen at! 💕</div>';
    return;
  }

  const concepts = {
    dinner: { emoji: '🍕', text: 'Yemek' },
    coffee:     { emoji: '☕',  text: 'Kahve' },
    movie:      { emoji: '🍿', text: 'Sinema' },
    picnic:     { emoji: '🧺', text: 'Piknik' },
    stars:      { emoji: '✨', text: 'Yıldızlar' },
    fingirdeme: { emoji: '🤭', text: 'Fingirdeme Vakti' },
    fanfinfon:  { emoji: '😈', text: 'FanFinFon' }
  };

  timeline.innerHTML = acceptedProposals.map(msg => {
    const p = msg.proposal;
    const concept = concepts[p.concept] || { emoji: '💖', text: 'Buluşma' };
    const dateFormatted = p.date.split('-').reverse().join('.');
    
    return `
      <div class="timeline-item">
        <div class="timeline-concept-icon">${concept.emoji}</div>
        <div class="timeline-details">
          <div class="timeline-title">${concept.text}</div>
          <div class="timeline-meta">
            <i class="fa-solid fa-calendar-day"></i> ${dateFormatted} • <i class="fa-solid fa-clock"></i> ${p.time}
          </div>
          <div class="timeline-meta">
            <i class="fa-solid fa-location-dot"></i> Mekan: <strong>${p.location}</strong>
          </div>
          ${p.note ? `<div class="timeline-note">"${p.note}"</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// SES EFEKTLERİ & EXTRA UTILS
// ==========================================================================

// Romantik kalp atışı ses efekti simülasyonu (Web Audio API)
function playHeartbeatSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playBeat = (time, pitch) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, time);
      osc.frequency.exponentialRampToValueAtTime(10, time + 0.15);
      
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(time);
      osc.stop(time + 0.15);
    };

    const now = audioCtx.currentTime;
    // Çift kalp atışı sesi
    playBeat(now, 100);
    playBeat(now + 0.15, 95);
  } catch (e) {
    console.error("Ses çalınamadı:", e);
  }
}

// Onur için Silme ve Düzenleme Yetki Fonksiyonları (Global nesneye bağlama)
window.deleteMessage = async function(msgId) {
  if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
  
  const msgIndex = localMessages.findIndex(m => m.id === msgId);
  if (msgIndex === -1) return;
  
  const msg = localMessages[msgIndex];
  
  // Medya dosyası ise temizlemeyi dene
  if (msg.mediaId) {
    try {
      fetch(`${API_BASE}/${msg.mediaId}`, { method: 'DELETE' });
    } catch(e) {
      console.error("Medya silme hatası:", e);
    }
  }
  
  localMessages.splice(msgIndex, 1);
  renderMessages();
  await saveMessages(localMessages);
};

window.editMessage = async function(msgId) {
  const msg = localMessages.find(m => m.id === msgId);
  if (!msg || msg.type !== 'text') return;
  
  const newText = prompt("Mesajı düzenleyin:", msg.text);
  if (newText === null) return;
  
  const trimmed = newText.trim();
  if (trimmed.length === 0) return;
  
  msg.text = trimmed;
  renderMessages();
  await saveMessages(localMessages);
};
