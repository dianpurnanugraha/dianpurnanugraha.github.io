// Kirim form kontak ke Web3Forms (https://web3forms.com)
// Setelah daftar di web3forms.com, ganti value input "access_key" di contact.html
// dengan Access Key asli kamu. Setelah itu form ini otomatis aktif.

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusBox = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');
  const originalBtnHTML = submitBtn.innerHTML;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const accessKey = form.querySelector('input[name="access_key"]').value;
    if (!accessKey || accessKey === 'GANTI_DENGAN_ACCESS_KEY_WEB3FORMS') {
      showStatus('Form belum aktif — Access Key Web3Forms belum dipasang.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
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
          showStatus('Pesan berhasil terkirim! Terima kasih, saya akan segera menghubungi Anda kembali.', 'success');
          form.reset();
        } else {
          showStatus('Gagal mengirim pesan: ' + (data.message || 'Terjadi kesalahan. Coba lagi.'), 'error');
        }
      })
      .catch(() => {
        showStatus('Gagal mengirim pesan. Periksa koneksi internet Anda dan coba lagi.', 'error');
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
