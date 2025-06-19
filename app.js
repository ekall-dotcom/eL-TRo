// BAGIAN 1: FUNGSI UNTUK MENU MOBILE
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
if (menu) {
  menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
  });
}

// BAGIAN 2: FITUR SLIDER PRODUK & RATING (untuk produk.html)
document.addEventListener('DOMContentLoaded', () => {
    const cyclerImage = document.getElementById('cycler-image');
    if (!cyclerImage) return; 

    const featuredProducts = [
        { image: 'produk unggulan/arduino.png', caption: 'Arduino Uno R3', rating: 4.7 },
        { image: 'produk unggulan/raspberrypi.png', caption: 'Raspberry Pi 4', rating: 4.5 },
        { image: 'produk unggulan/esp 32.png', caption: 'ESP32 Development Board', rating: 4.5 },
        { image: 'produk unggulan/kabel.png', caption: 'Berbagai Kabel Jumper', rating: 4.8 },
        { image: 'produk unggulan/breadboard.png', caption: 'Breadboard', rating: 4.7 },
        { image: 'produk unggulan/LED.png', caption: 'Berbagai LED', rating: 4.9 },
        { image: 'produk unggulan/ultrasonik.png', caption: 'Sensor Ultrasonik HC-SR04', rating: 4.7 },
        { image: 'produk unggulan/lcd i2c.png', caption: 'Module LCD I2C', rating: 4.6 },
        { image: 'produk unggulan/servo.png', caption: 'Servo Motor SG90', rating: 4.8 },
        { image: 'produk unggulan/relay.png', caption: 'Relay Module', rating: 4.6 },
        { image: 'produk unggulan/dht11.png', caption: 'Sensor Suhu DHT-11', rating: 4.7 }
    ];

    const cyclerCaption = document.getElementById('cycler-caption');
    const prevButton = document.querySelector('.cycler-btn--prev');
    const nextButton = document.querySelector('.cycler-btn--next');
    let currentIndex = 0;

    function showProduct(index) {
        cyclerImage.src = featuredProducts[index].image;
        cyclerCaption.textContent = featuredProducts[index].caption;

        // Render bintang rating
        const rating = featuredProducts[index].rating;
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1;
        let starsHtml = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHtml += '<span class="star full">&#9733;</span>'; // full star
            } else if (i === fullStars + 1 && halfStar > 0) {
                starsHtml += `<span class="star half"><span style="width:${halfStar*100}%">&#9733;</span><span class="star-empty">&#9733;</span></span>`;
            } else {
                starsHtml += '<span class="star empty">&#9733;</span>'; // empty star
            }
        }

        document.getElementById('cycler-rating').innerHTML =
            `<span class="stars">${starsHtml}</span> <span class="rating-number">${rating}/5</span>`;
    }

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % featuredProducts.length;
            showProduct(currentIndex);
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + featuredProducts.length) % featuredProducts.length;
            showProduct(currentIndex);
        });
    }

    showProduct(0);
});

// BAGIAN 3: FUNGSI UNTUK FITUR DI HALAMAN LAYANAN
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan skrip hanya jika kita berada di halaman layanan
    if (document.querySelector('.layanan-container')) {
        TabManager.init();
        ResistorDecoder.init();
        OhmCalculator.init();
        KalkulatorBiaya.init();
        DiagramWiring.init();
        GeneratorProyek.init();
    }
});

const TabManager = {
    init() {
        this.tabs = document.querySelectorAll('.tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
    },
    switchTab(tabName) {
        this.tabContents.forEach(c => c.classList.toggle('active', c.id === `${tabName}-tab`));
        this.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    }
};

const OhmCalculator = {
    init() {
        ['ohm-v', 'ohm-i', 'ohm-r'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', this.calculate);
        });
    },
    calculate() {
        const v = parseFloat(document.getElementById('ohm-v').value);
        const i = parseFloat(document.getElementById('ohm-i').value);
        const r = parseFloat(document.getElementById('ohm-r').value);
        const resultDiv = document.getElementById('ohm-result');
        let resultText = 'Masukkan dua nilai yang valid.';
        if (!isNaN(v) && !isNaN(i) && isNaN(r)) resultText = `Hambatan (R) = <strong>${(v / i).toFixed(2)} Ω</strong>`;
        else if (!isNaN(v) && !isNaN(r) && isNaN(i)) resultText = `Arus (I) = <strong>${(v / r).toFixed(2)} A</strong>`;
        else if (!isNaN(i) && !isNaN(r) && isNaN(v)) resultText = `Tegangan (V) = <strong>${(i * r).toFixed(2)} V</strong>`;
        resultDiv.innerHTML = resultText;
    }
};

const KalkulatorBiaya = {
    items: [],
    init() {
        document.getElementById('layanan-select')?.addEventListener('change', this.toggleAlatRental);
        document.getElementById('tambah-layanan-btn')?.addEventListener('click', () => this.tambah());
        document.getElementById('layanan-select').addEventListener('change', function() {
            document.getElementById('troubleshooting-group').style.display = 'none';
            document.getElementById('seminar-group').style.display = 'none';
            document.getElementById('workshop-group').style.display = 'none';
            document.getElementById('alat-group').style.display = 'none';

            if (this.value === 'troubleshooting') {
                document.getElementById('troubleshooting-group').style.display = 'block';
            } else if (this.value === 'seminar') {
                document.getElementById('seminar-group').style.display = 'block';
            } else if (this.value === 'workshop') {
                document.getElementById('workshop-group').style.display = 'block';
            } else if (this.value === 'rental') {
                document.getElementById('alat-group').style.display = 'block';
            }
        });
    },
    toggleAlatRental() {
        document.getElementById('alat-group').style.display = document.getElementById('layanan-select').value === 'rental' ? 'block' : 'none';
    },
    tambah() {
        const layananSelect = document.getElementById('layanan-select');
        const alatSelect = document.getElementById('alat-select');
        const seminarSelect = document.getElementById('seminar-select');
        const workshopSelect = document.getElementById('workshop-select');
        const troubleshootingSelect = document.getElementById('troubleshooting-select');
        const qty = parseInt(document.getElementById('qty').value) || 1;
        let nama = '', harga = 0;

        // Tentukan sumber nama & harga sesuai jenis layanan
        if (layananSelect.value === 'rental') {
            const selected = alatSelect.options[alatSelect.selectedIndex];
            nama = selected.text;
            harga = parseInt(selected.value);
        } else if (layananSelect.value === 'seminar') {
            const selected = seminarSelect.options[seminarSelect.selectedIndex];
            nama = selected.text;
            harga = parseInt(selected.value);
        } else if (layananSelect.value === 'workshop') {
            const selected = workshopSelect.options[workshopSelect.selectedIndex];
            nama = selected.text;
            harga = parseInt(selected.value);
        } else if (layananSelect.value === 'troubleshooting') {
            const selected = troubleshootingSelect.options[troubleshootingSelect.selectedIndex];
            nama = selected.text;
            harga = parseInt(selected.value);
        } else if (layananSelect.value && !isNaN(parseInt(layananSelect.value))) {
            // Untuk layanan dengan value angka langsung
            const selected = layananSelect.options[layananSelect.selectedIndex];
            nama = selected.text;
            harga = parseInt(selected.value);
        } else {
            alert('Silakan pilih layanan atau alat yang valid!');
            return;
        }

        if (isNaN(harga) || !nama) {
            alert('Data tidak valid. Silakan pilih layanan/alat dengan benar.');
            return;
        }

        // Cek apakah item sudah ada
        const existing = this.items.find(item => item.name === nama && item.price === harga);
        if (existing) {
            existing.quantity += qty;
        } else {
            this.items.push({ name: nama, price: harga, quantity: qty });
        }
        this.updateList();
    },
    hapus(index) {
        this.items.splice(index, 1);
        this.updateList();
    },
    tambahQty(index) {
        this.items[index].quantity += 1;
        this.updateList();
    },
    kurang(index) {
        if (this.items[index].quantity > 1) {
            this.items[index].quantity -= 1;
        } else {
            this.items.splice(index, 1);
        }
        this.updateList();
    },
    updateList() {
        const listEl = document.getElementById('biaya-list');
        const totalEl = document.getElementById('biaya-total');
        listEl.innerHTML = '';
        let total = 0;
        if (this.items.length === 0) {
            listEl.innerHTML = '<li class="empty">Belum ada layanan yang ditambahkan.</li>';
        } else {
            this.items.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                listEl.innerHTML += `
    <li>
      <div>
        <span>${item.name}</span>
        <div style="margin-top:8px; display:flex; align-items:center; justify-content:center;">
            <button class="qty-btn minus" onclick="KalkulatorBiaya.kurang(${index})">-</button>
            <span class="qty-val">x${item.quantity}</span>
            <button class="qty-btn plus" onclick="KalkulatorBiaya.tambahQty(${index})">+</button>
            <button class="qty-btn hapus-btn" onclick="KalkulatorBiaya.hapus(${index})" title="Hapus item">hapus</button>
        </div>
      </div>
      <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
    </li>`;
            });
        }
        // Tampilkan total di kanan bawah list
        totalEl.style.textAlign = 'right';
        totalEl.style.fontWeight = 'bold';
        totalEl.style.fontSize = '1.1rem';
        totalEl.innerHTML = `<span class="total-label">Total :</span><span class="total-value">Rp ${total.toLocaleString('id-ID')}</span>`;
    }
};

const DiagramWiring = {
    init() {
        document.getElementById('generate-wiring-btn')?.addEventListener('click', this.generate);
    },
    generate() {
        const selection = document.getElementById('wiring-select').value;
        const output = document.getElementById('wiring-output');
        let diagram = '';
        switch (selection) {
            case 'led': diagram = `  +5V (Arduino) ---[ Resistor 220Ω ]---+---|>|--- GND\n                                         (LED)`; break;
            case 'motor': diagram = `  +9V Baterai --- ( + Motor DC - ) ---o o--- GND\n                                       (Switch)`; break;
            case 'sensor': diagram = `  Arduino 5V  --- VCC\n  Arduino GND --- GND\n  Arduino D9  --- Trig\n  Arduino D10 --- Echo\n                 (HC-SR04)`; break;
            // Tambahkan di bawah ini:
            case 'relay':
                diagram = `  Arduino D7 --- IN (Relay)\n  Arduino 5V --- VCC (Relay)\n  Arduino GND --- GND (Relay)\n  NO/NC/COM --- Beban AC/DC`;
                break;
            case 'servo':
                diagram = `  Arduino D9 --- Sinyal (Servo)\n  Arduino 5V --- VCC (Servo)\n  Arduino GND --- GND (Servo)`;
                break;
            case 'lcd':
                diagram = `  Arduino SDA --- SDA (LCD I2C)\n  Arduino SCL --- SCL (LCD I2C)\n  Arduino 5V --- VCC (LCD I2C)\n  Arduino GND --- GND (LCD I2C)`;
                break;
            case 'dht':
                diagram = `  Arduino D2 --- Data (DHT11)\n  Arduino 5V --- VCC (DHT11)\n  Arduino GND --- GND (DHT11)`;
                break;
            case 'buzzer':
                diagram = `  Arduino D8 --- (+) Buzzer\n  Arduino GND --- (-) Buzzer`;
                break;
            case 'potensiometer':
                diagram = `  Potensiometer Kaki 1 --- 5V\n  Potensiometer Kaki 2 --- A0 (Arduino)\n  Potensiometer Kaki 3 --- GND`;
                break;
            case 'ultrasonic':
                diagram = `  ESP32 5V --- VCC (HC-SR04)\n  ESP32 GND --- GND (HC-SR04)\n  ESP32 D12 --- Trig\n  ESP32 D14 --- Echo`;
                break;
        }
        output.textContent = diagram;
    }
};

const ResistorDecoder = {
    colorMap: {
        black:  { v: 0, m: 1, t: 20, tcr: 250, desc: "Hitam" },
        brown:  { v: 1, m: 10, t: 1, tcr: 100, desc: "Coklat" },
        red:    { v: 2, m: 100, t: 2, tcr: 50, desc: "Merah" },
        orange: { v: 3, m: 1e3, t: null, tcr: 15, desc: "Orange" },
        yellow: { v: 4, m: 1e4, t: null, tcr: 25, desc: "Kuning" },
        green:  { v: 5, m: 1e5, t: 0.5, tcr: 20, desc: "Hijau" },
        blue:   { v: 6, m: 1e6, t: 0.25, tcr: 10, desc: "Biru" },
        violet: { v: 7, m: 1e7, t: 0.1, tcr: 5, desc: "Ungu" },
        gray:   { v: 8, m: 1e8, t: 0.05, tcr: 1, desc: "Abu-abu" },
        white:  { v: 9, m: 1e9, t: null, tcr: null, desc: "Putih" },
        gold:   { v: null, m: 0.1, t: 5, tcr: null, desc: "Emas" },
        silver: { v: null, m: 0.01, t: 10, tcr: null, desc: "Silver" },
    },
    bandCount: 4, selectedColors: [],
    init() {
        document.querySelectorAll('input[name="band-type"]').forEach(r => r.addEventListener('change', e => { this.bandCount = parseInt(e.target.value); this.render(); }));
        this.render();
    },
    render() {
        const bandDefaults = { 3: ['red', 'orange', 'brown'], 4: ['brown', 'black', 'red', 'gold'], 5: ['brown', 'black', 'black', 'red', 'brown'], 6: ['brown', 'black', 'black', 'red', 'brown', 'brown'] };
        // Perbaikan: hanya set default jika jumlah pita berubah atau belum ada selectedColors
        if (!this.selectedColors || this.selectedColors.length !== this.bandCount) {
            this.selectedColors = bandDefaults[this.bandCount].slice();
        }
        const visualBody = document.getElementById('resistor-body-visual');
        const selectorsContainer = document.getElementById('resistor-color-selectors');
        visualBody.innerHTML = ''; selectorsContainer.innerHTML = '';
        for (let i = 0; i < this.bandCount; i++) {
            visualBody.innerHTML += `<div class="resistor-band" id="visual-band-${i}"></div>`;
            let selectorHTML = `<div><h4>Pita ${i + 1}</h4><div class="color-code-grid">`;
            this.getValidColorsForBand(i + 1).forEach(color => {
                selectorHTML += `<div class="color-option" style="background:${color};" data-band="${i}" data-color="${color}" data-tooltip="${this.colorMap[color].desc}"></div>`;
            });
            selectorHTML += `</div></div>`; selectorsContainer.innerHTML += selectorHTML;
        }
        selectorsContainer.querySelectorAll('.color-option').forEach(o => o.addEventListener('click', e => this.selectColor(parseInt(e.target.dataset.band), e.target.dataset.color)));
        this.updateUI();
    },
    getValidColorsForBand(bandNum) {
        const d = Object.keys(this.colorMap).filter(c => this.colorMap[c].v != null);
        const m = Object.keys(this.colorMap).filter(c => this.colorMap[c].m != null);
        const t = Object.keys(this.colorMap).filter(c => this.colorMap[c].t != null);
        const tcr = Object.keys(this.colorMap).filter(c => this.colorMap[c].tcr != null);
        if (this.bandCount === 3) return bandNum < 3 ? d : m;
        if (this.bandCount === 4) return bandNum < 3 ? d : bandNum === 3 ? m : t;
        if (this.bandCount === 5) return bandNum < 4 ? d : bandNum === 4 ? m : t;
        if (this.bandCount === 6) return bandNum < 4 ? d : bandNum === 4 ? m : bandNum === 5 ? t : tcr;
        return [];
    },
    selectColor(i, c) { this.selectedColors[i] = c; this.updateUI(); },
    updateUI() {
        this.selectedColors.forEach((c, i) => { document.getElementById(`visual-band-${i}`).style.background = c; document.querySelectorAll(`[data-band='${i}']`).forEach(o => o.classList.toggle('selected', o.dataset.color === c)); });
        this.calculateResistance();
    },
    calculateResistance() {
        let valStr = "", mult, tol, tcr;
        try {
            if (this.bandCount === 3) { valStr = `${this.colorMap[this.selectedColors[0]].v}${this.colorMap[this.selectedColors[1]].v}`; mult = this.colorMap[this.selectedColors[2]].m; tol=20; }
            else if (this.bandCount === 4) { valStr = `${this.colorMap[this.selectedColors[0]].v}${this.colorMap[this.selectedColors[1]].v}`; mult = this.colorMap[this.selectedColors[2]].m; tol = this.colorMap[this.selectedColors[3]].t; }
            else { valStr = `${this.colorMap[this.selectedColors[0]].v}${this.colorMap[this.selectedColors[1]].v}${this.colorMap[this.selectedColors[2]].v}`; mult = this.colorMap[this.selectedColors[3]].m; tol = this.colorMap[this.selectedColors[4]].t; if (this.bandCount === 6) tcr = this.colorMap[this.selectedColors[5]].tcr; }
            const resistance = parseInt(valStr) * mult;
            let resultText = `Nilai: <strong>${Utils.formatValue(resistance, 'Ω')}</strong> | Toleransi: <strong>±${tol}%</strong>`;
            if (tcr) resultText += ` | TCR: <strong>${tcr} ppm/K</strong>`;
            document.getElementById('resistor-result').innerHTML = resultText;
        } catch (e) { document.getElementById('resistor-result').innerHTML = 'Kombinasi warna tidak valid.'; }
    }
};

const GeneratorProyek = {
    projects: [
        { title: "Sistem Alarm Laser Sederhana", desc: "Alarm berbunyi ketika sinar laser terhalang.", materials: ["Arduino", "Sensor LDR", "Laser Diode", "Buzzer"] },
        { title: "Lampu Tidur Otomatis", desc: "Lampu menyala otomatis saat ruangan gelap.", materials: ["Arduino", "Sensor LDR", "LED", "Transistor"] },
        { title: "Pengukur Jarak Parkir", desc: "Buzzer berbunyi semakin cepat saat objek mendekat.", materials: ["Arduino", "Sensor Ultrasonik HC-SR04", "Buzzer"] },
        { title: "Sistem Monitoring Suhu & Kelembaban", desc: "Pantau suhu dan kelembaban ruangan secara real-time.", materials: ["Arduino", "DHT11/DHT22", "LCD 16x2", "Resistor"] },
        { title: "Kunci Pintu Digital dengan Keypad", desc: "Buka pintu hanya dengan kode rahasia.", materials: ["Arduino", "Keypad 4x4", "Servo", "Buzzer"] },
        { title: "Penyiram Tanaman Otomatis", desc: "Tanaman disiram otomatis saat tanah kering.", materials: ["Arduino", "Sensor Kelembaban Tanah", "Relay", "Pompa Air"] },
        { title: "Jam Digital dengan RTC", desc: "Jam digital dengan pengingat alarm.", materials: ["Arduino", "RTC DS3231", "Buzzer", "LCD 16x2"] },
        { title: "Pengontrol Lampu via Bluetooth", desc: "Nyalakan/matikan lampu dari HP.", materials: ["Arduino", "Bluetooth HC-05", "Relay", "Lampu"] },
        { title: "Sistem Parkir Otomatis", desc: "Gerbang parkir terbuka otomatis jika ada mobil.", materials: ["Arduino", "Sensor Ultrasonik", "Servo"] },
        { title: "Detektor Gas LPG", desc: "Alarm berbunyi jika terdeteksi kebocoran gas.", materials: ["Arduino", "Sensor Gas MQ-2", "Buzzer", "LED"] },
        { title: "Sistem Absensi RFID", desc: "Absensi otomatis menggunakan kartu RFID.", materials: ["Arduino", "RFID RC522", "Buzzer", "LCD"] },
        { title: "Penghitung Orang Masuk-Keluar", desc: "Hitung jumlah orang di ruangan secara otomatis.", materials: ["Arduino", "IR Sensor", "LCD"] },
        { title: "Sistem Monitoring Tegangan Baterai", desc: "Pantau tegangan baterai secara digital.", materials: ["Arduino", "Voltage Sensor", "LCD"] },
        { title: "Robot Line Follower Sederhana", desc: "Robot mengikuti garis hitam di lantai.", materials: ["Arduino", "Sensor IR", "Motor DC", "Chassis Robot"] },
        { title: "Sistem Monitoring Air Aquarium", desc: "Pantau suhu dan level air aquarium.", materials: ["Arduino", "Sensor Suhu", "Sensor Level Air", "LCD"] },
        { title: "Sistem Pendeteksi Hujan Otomatis", desc: "Jendela otomatis menutup saat hujan.", materials: ["Arduino", "Sensor Hujan", "Servo"] },
        { title: "Smart Home dengan ESP32 dan Blynk", desc: "Kontrol rumah dari mana saja via aplikasi.", materials: ["ESP32", "Relay", "Blynk App"] },
        { title: "Sistem Monitoring Energi Listrik", desc: "Pantau konsumsi listrik rumah.", materials: ["Arduino", "Current Sensor", "LCD"] },
        { title: "Sistem Pendeteksi Api", desc: "Alarm berbunyi jika ada api.", materials: ["Arduino", "Flame Sensor", "Buzzer"] },
        { title: "Pengunci Helm Otomatis", desc: "Helm terkunci otomatis saat motor dimatikan.", materials: ["Arduino", "Relay", "Solenoid", "Sensor Getar"] }
    ],
    favorites: [],
    init() {
        document.getElementById('generate-project-btn')?.addEventListener('click', () => this.generate());
        this.favorites = JSON.parse(localStorage.getItem('el-tro-fav-projects')) || [];
        this.renderFavorites();
    },
    generate() {
        const project = this.projects[Math.floor(Math.random() * this.projects.length)];
        document.getElementById('project-idea').innerHTML = `
            <div class="project-card"><h4>${project.title}</h4><p>${project.desc}</p>
            <p><strong>Bahan:</strong> ${project.materials.join(', ')}</p>
            <button class="calc-button btn-save">Simpan ke Favorit</button></div>`;
        document.querySelector('#project-idea .btn-save').addEventListener('click', () => this.save(project));
    },
    save(project) {
        if (project && !this.favorites.some(p => p.title === project.title)) {
            this.favorites.push(project);
            localStorage.setItem('el-tro-fav-projects', JSON.stringify(this.favorites));
            this.renderFavorites();
        }
    },
    remove(title) {
        this.favorites = this.favorites.filter(p => p.title !== title);
        localStorage.setItem('el-tro-fav-projects', JSON.stringify(this.favorites));
        this.renderFavorites();
    },
    renderFavorites() {
        const container = document.getElementById('favorite-projects');
        container.innerHTML = '';
        if (this.favorites.length === 0) {
            container.innerHTML = '<p class="empty">Belum ada proyek favorit.</p>'; return;
        }
        this.favorites.forEach(p => {
            const card = document.createElement('div');
            card.className = 'favorite-card';
            card.innerHTML = `<div><h4>${p.title}</h4><p>${p.desc}</p></div><button class="btn-remove"><i class="fas fa-trash"></i></button>`;
            card.querySelector('.btn-remove').addEventListener('click', () => this.remove(p.title));
            container.appendChild(card);
        });
    }
};

const Utils = {
    formatValue(val, satuan = '') {
        if (isNaN(val)) return '-';
        if (val >= 1e6) return (val / 1e6).toFixed(2) + ' M' + satuan;
        if (val >= 1e3) return (val / 1e3).toFixed(2) + ' k' + satuan;
        if (val < 1 && val >= 1e-3) return (val * 1e3).toFixed(2) + ' m' + satuan;
        return val.toLocaleString('id-ID') + ' ' + satuan;
    }
};
