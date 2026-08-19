// Kirim form kontak ke Web3Forms (https://web3forms.com)
// Setelah daftar di web3forms.com, ganti value input "access_key" di contact.html
// dengan Access Key asli kamu. Setelah itu form ini otomatis aktif.

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusBox = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');
  const originalBtnHTML = submitBtn.innerHTML;

  function getLang() { return localStorage.getItem('site-lang') || 'id'; }
  function t(key, fallback) {
    const lang = getLang();
    const common = (window.I18N_COMMON && window.I18N_COMMON[lang]) || {};
    const page = (window.I18N_PAGE && window.I18N_PAGE[lang]) || {};
    if (page[key] !== undefined) return page[key];
    if (common[key] !== undefined) return common[key];
    return fallback;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const accessKey = form.querySelector('input[name="access_key"]').value;
    if (!accessKey) {
      showStatus(t('form.notActive', 'Form belum aktif — Access Key Web3Forms belum dipasang.'), 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + t('form.sending', 'Mengirim...');
    showStatus('', '');

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showStatus(t('form.success', 'Pesan berhasil terkirim! Terima kasih, saya akan segera menghubungi Anda kembali.'), 'success');
          form.reset();
        } else {
          showStatus(t('form.errorPrefix', 'Gagal mengirim pesan: ') + (data.message || t('form.errorGeneric', 'Terjadi kesalahan. Coba lagi.')), 'error');
        }
      })
      .catch(() => {
        showStatus(t('form.errorNetwork', 'Gagal mengirim pesan. Periksa koneksi internet Anda dan coba lagi.'), 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      });
  });

  function showStatus(message, type) {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = 'form-status' + (type ? ' ' + type : '');
  }
});
