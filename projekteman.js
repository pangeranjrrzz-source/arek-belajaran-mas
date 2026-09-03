/* ============================================================
  STUDYKIT — script.js
  Semua logika interaktif untuk landing page + 3 tools
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initAnimasiMasuk();
  initEfekMiring();
  initNoteClick();
  initPasswordChecker();
  initKuis();
  initJadwal();
});

/* ============================================================
  1. ANIMASI MASUK — note muncul satu-satu saat halaman dibuka
   ============================================================ */
function initAnimasiMasuk() {
  const notes = document.querySelectorAll(".note");
  if (notes.length === 0) return;

  notes.forEach((note, index) => {
    note.style.opacity = "0";
    note.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    setTimeout(() => {
      note.style.opacity = "1";
    }, 150 * index);
  });
}

/* ============================================================
  2. EFEK MIRING — note ikut miring sesuai posisi mouse
   ============================================================ */
function initEfekMiring() {
  const notes = document.querySelectorAll(".note");
  notes.forEach((note) => {
    note.addEventListener("mousemove", (e) => {
      const rect = note.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const miring = (x / rect.width) * 6;
      note.style.transform = `translateY(-6px) rotate(${miring}deg)`;
    });
    note.addEventListener("mouseleave", () => {
      note.style.transform = "";
    });
  });
}

/* ============================================================
  3. KLIK NOTE — cegah klik ke href placeholder ("#...")
   ============================================================ */
function initNoteClick() {
  const notes = document.querySelectorAll(".note");
  notes.forEach((note) => {
    note.addEventListener("click", (e) => {
      const href = note.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const nama = note.querySelector("h3").textContent;
        alert(
          `"${nama}" belum terhubung.\nGanti href di index.html ke path file tool aslinya.`,
        );
      }
    });
  });
}

/* ============================================================
  4. TOOL 1 — PASSWORD CHECKER & GENERATOR
  Butuh elemen di halaman: #passwordInput, #btnCek, #hasilCek,
  #progressFill, #levelText, #saranList, #panjangSlider,
  #panjangValue, #pakaiAngka, #pakaiSimbol, #btnGenerate,
  #hasilGenerate, #passwordOutput, #btnCopy
   ============================================================ */
function cekKekuatanPassword(password) {
  let skor = 0;
  let saran = [];

  if (password.length >= 8) skor++;
  else saran.push("Gunakan minimal 8 karakter");

  if (/[A-Z]/.test(password)) skor++;
  else saran.push("Tambahkan huruf besar (A-Z)");

  if (/[a-z]/.test(password)) skor++;
  else saran.push("Tambahkan huruf kecil (a-z)");

  if (/[0-9]/.test(password)) skor++;
  else saran.push("Tambahkan angka (0-9)");

  if (/[^A-Za-z0-9]/.test(password)) skor++;
  else saran.push("Tambahkan simbol (!@#$%^&*)");

  let level, warna;
  if (skor <= 2) {
    level = "Lemah";
    warna = "#f047ed";
  } else if (skor <= 4) {
    level = "Sedang";
    warna = "#f349f6";
  } else {
    level = "Kuat";
    warna = "#8722c5";
  }

  return { skor, level, warna, saran };
}

function generatePassword(panjang, pakaiAngka, pakaiSimbol) {
  const hurufKecil = "abcdefghijklmnopqrstuvwxyz";
  const hurufBesar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const angka = "0123456789";
  const simbol = "!@#$%^&*()_+-=[]{}";

  let kumpulan = hurufKecil + hurufBesar;
  if (pakaiAngka) kumpulan += angka;
  if (pakaiSimbol) kumpulan += simbol;

  let hasil = "";
  for (let i = 0; i < panjang; i++) {
    hasil += kumpulan[Math.floor(Math.random() * kumpulan.length)];
  }
  return hasil;
}

function initPasswordChecker() {
  const passwordInput = document.getElementById("passwordInput");
  const btnCek = document.getElementById("btnCek");
  if (!btnCek) return; // bukan halaman password checker, lewati

  const hasilCek = document.getElementById("hasilCek");
  const progressFill = document.getElementById("progressFill");
  const levelText = document.getElementById("levelText");
  const saranList = document.getElementById("saranList");

  btnCek.addEventListener("click", () => {
    const password = passwordInput.value;
    if (password === "") {
      alert("Masukkan password dulu!");
      return;
    }

    const hasil = cekKekuatanPassword(password);
    hasilCek.classList.remove("hidden");

    const persen = (hasil.skor / 5) * 100;
    progressFill.style.width = persen + "%";
    progressFill.style.background = hasil.warna;
    levelText.textContent = `Kekuatan: ${hasil.level}`;
    levelText.style.color = hasil.warna;

    saranList.innerHTML = "";
    if (hasil.saran.length === 0) {
      saranList.innerHTML = "<li>Password kamu sudah kuat! 👍</li>";
    } else {
      hasil.saran.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        saranList.appendChild(li);
      });
    }
  });

  const panjangSlider = document.getElementById("panjangSlider");
  const panjangValue = document.getElementById("panjangValue");
  const pakaiAngka = document.getElementById("pakaiAngka");
  const pakaiSimbol = document.getElementById("pakaiSimbol");
  const btnGenerate = document.getElementById("btnGenerate");
  const hasilGenerate = document.getElementById("hasilGenerate");
  const passwordOutput = document.getElementById("passwordOutput");
  const btnCopy = document.getElementById("btnCopy");

  panjangSlider.addEventListener("input", () => {
    panjangValue.textContent = panjangSlider.value;
  });

  btnGenerate.addEventListener("click", () => {
    const panjang = parseInt(panjangSlider.value);
    passwordOutput.value = generatePassword(
      panjang,
      pakaiAngka.checked,
      pakaiSimbol.checked,
    );
    hasilGenerate.classList.remove("hidden");
  });

  btnCopy.addEventListener("click", () => {
    passwordOutput.select();
    navigator.clipboard.writeText(passwordOutput.value);
    btnCopy.textContent = "✓ Disalin!";
    setTimeout(() => {
      btnCopy.textContent = "📋 Copy";
    }, 1500);
  });
}

/* ============================================================
  5. TOOL 2 — KUIS INTERAKTIF
  Butuh elemen di halaman: #soalTeks, #pilihanList,
  #halamanKuis, #halamanHasil, #skorAkhir
  Data soal di SOAL_KUIS di bawah — nanti diganti data dari Flask
   ============================================================ */
const SOAL_KUIS = [
  {
    pertanyaan: "HTML digunakan untuk apa?",
    pilihan: [
      "Mengatur logika program",
      "Membuat struktur halaman web",
      "Menyimpan data ke database",
    ],
    jawabanBenar: 1,
  },
  {
    pertanyaan: "Apa fungsi CSS?",
    pilihan: ["Struktur halaman", "Mengatur tampilan/gaya", "Mengelola server"],
    jawabanBenar: 1,
  },
  {
    pertanyaan: "Bahasa apa yang dipakai untuk logika backend di projek ini?",
    pilihan: ["Python", "CSS", "HTML"],
    jawabanBenar: 0,
  },
];

let kuisState = { soalKe: 0, jawabanUser: [], skor: 0 };

function initKuis() {
  const soalTeks = document.getElementById("soalTeks");
  if (!soalTeks) return; // bukan halaman kuis, lewati

  const pilihanList = document.getElementById("pilihanList");
  const halamanKuis = document.getElementById("halamanKuis");
  const halamanHasil = document.getElementById("halamanHasil");
  const skorAkhir = document.getElementById("skorAkhir");

  tampilkanSoal();

  function tampilkanSoal() {
    const soal = SOAL_KUIS[kuisState.soalKe];
    soalTeks.textContent = soal.pertanyaan;
    pilihanList.innerHTML = "";

    soal.pilihan.forEach((teks, index) => {
      const btn = document.createElement("button");
      btn.textContent = teks;
      btn.className = "pilihan-btn";
      btn.addEventListener("click", () => pilihJawaban(index));
      pilihanList.appendChild(btn);
    });
  }

  function pilihJawaban(index) {
    kuisState.jawabanUser.push(index);
    if (index === SOAL_KUIS[kuisState.soalKe].jawabanBenar) kuisState.skor++;

    kuisState.soalKe++;
    if (kuisState.soalKe < SOAL_KUIS.length) tampilkanSoal();
    else tampilkanHasil();
  }

  function tampilkanHasil() {
    halamanKuis.classList.add("hidden");
    halamanHasil.classList.remove("hidden");
    skorAkhir.textContent = `Skor kamu: ${kuisState.skor} / ${SOAL_KUIS.length}`;

    // Nanti diganti: kirim skor ke backend Flask
    // fetch("/api/skor", { method: "POST", body: JSON.stringify({ skor: kuisState.skor }) })
  }
}

/* ============================================================
  6. TOOL 3 — GENERATOR JADWAL PELAJARAN
  Butuh elemen di halaman: #formMapel, #inputNamaMapel,
  checkbox name="hari", #listMapel, #btnGenerateJadwal, #tabelJadwal
   ============================================================ */
const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
const JAM = ["07:00", "08:00", "09:00", "10:00", "11:00"];

let daftarMapel = [];

function tambahMapel(nama, hari) {
  daftarMapel.push({ nama, hari });
}

function buatJadwal(mapelList) {
  const jadwal = {};
  HARI.forEach((h) => {
    jadwal[h] = {};
  });

  mapelList.forEach((mapel) => {
    for (const hari of mapel.hari) {
      for (const jam of JAM) {
        if (!jadwal[hari][jam]) {
          jadwal[hari][jam] = mapel.nama;
          return; // lanjut ke mapel berikutnya
        }
      }
    }
  });

  return jadwal;
}

function initJadwal() {
  const formMapel = document.getElementById("formMapel");
  if (!formMapel) return; // bukan halaman jadwal, lewati

  const inputNama = document.getElementById("inputNamaMapel");
  const listMapel = document.getElementById("listMapel");
  const btnGenerate = document.getElementById("btnGenerateJadwal");
  const tabelJadwal = document.getElementById("tabelJadwal");

  formMapel.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = inputNama.value.trim();
    if (!nama) return;

    const hariTerpilih = Array.from(
      document.querySelectorAll('input[name="hari"]:checked'),
    ).map((cb) => cb.value);

    tambahMapel(nama, hariTerpilih);

    const li = document.createElement("li");
    li.textContent = `${nama} — ${hariTerpilih.join(", ")}`;
    listMapel.appendChild(li);

    inputNama.value = "";
  });

  btnGenerate.addEventListener("click", () => {
    const jadwal = buatJadwal(daftarMapel);
    renderTabelJadwal(jadwal);
  });

  function renderTabelJadwal(jadwal) {
    let html = "<tr><th>Jam</th>";
    HARI.forEach((h) => {
      html += `<th>${h}</th>`;
    });
    html += "</tr>";

    JAM.forEach((jam) => {
      html += `<tr><td>${jam}</td>`;
      HARI.forEach((hari) => {
        html += `<td>${jadwal[hari][jam] || "-"}</td>`;
      });
      html += "</tr>";
    });

    tabelJadwal.innerHTML = html;
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
});

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.querySelectorAll(".note").forEach((note) => {
  note.addEventListener("click", (e) => {
    e.preventDefault(); // biar animasi sempat kelihatan dulu
    note.classList.add("pressed");

    setTimeout(() => {
      window.location.href = note.getAttribute("href"); // baru pindah halaman
    }, 200);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".reveal-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.2, // muncul setelah 20% elemen terlihat
    }
  );

  sections.forEach((section) => observer.observe(section));
});
