// script.js — Gmail integration + auto color change
(function () {
  const colors = [
    '#ff073a', '#1e90ff', '#32cd32', '#800080',
    '#ffd700', '#ff8c00', '#00ced1', '#ff1493',
    '#adff2f', '#00ffff', '#ff4500', '#9370db'
  ];
  let colorIndex = 0;

  // prompt messages
  const promptMessages = {
    '1': 'I believe my account was banned by mistake. Please review and restore access to my account.',
    '2': 'My account was mistakenly banned. I did not violate any policies. Kindly unblock my account after review.',
    '3': 'I promise to comply with WhatsApp policies and request a review for unbanning my account.',
    '4': 'Please perform an account review; I believe the ban was incorrect and request reinstatement.',
    '5': 'I believe this ban resulted from a misunderstanding of terms. Kindly review and unban my account.',
    '6': 'This is a final appeal request for account reinstatement. Please review and consider unbanning.'
  };

  const SUPPORT_EMAIL = 'android@support.whatsapp.com';

  // apply initial color
  document.addEventListener('DOMContentLoaded', () => {
    applyColor(colors[colorIndex]);

    // auto-change color every 4 seconds
    setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      applyColor(colors[colorIndex]);
    }, 4000);

    const sendBtn = document.getElementById('sendBtn');

    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        const phoneInput = document.getElementById('phone');
        const phone = (phoneInput.value || '').trim();
        if (!phone) {
          flash(sendBtn, 'ENTER PHONE NUMBER');
          return;
        }

        const banRadio = document.querySelector('input[name="ban"]:checked');
        const banType = banRadio ? banRadio.value : 'normal';
        const banLabel = banType === 'permanent' ? 'Permanent Ban' : 'Normal Ban';

        const promptSelect = document.getElementById('prompt');
        const promptValue = promptSelect ? promptSelect.value : '1';
        const promptText = promptMessages[promptValue] || promptMessages['1'];

        const subject = `Appeal: Request to unban WhatsApp account — ${phone}`;
        const bodyLines = [
          "Hello WhatsApp Support,",
          "",
          "I am requesting a review of my banned account and kindly ask for reinstatement.",
          "",
          `Phone: ${phone}`,
          `Ban Type: ${banLabel}`,
          "",
          `Appeal Message: ${promptText}`,
          "",
          "I confirm I will comply with WhatsApp policies and provide any further information if needed.",
          "",
          "Regards,",
          "Adeel Abbasi"
        ];
        const body = bodyLines.join('\n');

        flash(sendBtn, 'OPENING GMAIL...');

        const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1'
          + '&to=' + encodeURIComponent(SUPPORT_EMAIL)
          + '&su=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);

        const opened = window.open(gmailUrl, '_blank');
        if (!opened) {
          const mailto = `mailto:${encodeURIComponent(SUPPORT_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.location.href = mailto;
        }
      });
    }
  });

  // function to apply color theme
  function applyColor(color) {
    document.body.style.backgroundColor = color;
    const sendBtn = document.getElementById('sendBtn');
    const visit = document.getElementById('visitCurrent');
    const banner = document.getElementById('banner');

    if (sendBtn) {
      sendBtn.style.boxShadow = `0 6px 30px ${hexToRgba(color, 0.18)}`;
      sendBtn.style.borderColor = `rgba(255,255,255,0.06)`;
    }
    if (visit) {
      visit.style.borderColor = hexToRgba(color, 0.35);
      visit.style.boxShadow = `0 8px 30px ${hexToRgba(color, 0.12)}`;
      visit.style.background = 'rgba(255,255,255,0.035)';
    }
    if (banner) {
      banner.style.boxShadow = 'inset 0 -40px 120px rgba(0,0,0,0.25)';
    }
  }

  // helper: hex to rgba
  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(h => h+h).join('');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // flash temporary text
  function flash(el, text) {
    const prev = el.textContent;
    el.textContent = text;
    el.style.opacity = 0.95;
    setTimeout(() => {
      el.textContent = prev;
      el.style.opacity = 1;
    }, 1600);
  }
})();
