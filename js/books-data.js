const BooksData = [
  {
    id: "book1",
    title: "Kunci-Kunci Bengkel",
    color: "#8b5cf6",
    coverImage: "assets/book1_wrenches.png",
    description: "Kuasai fungsi kunci pas, kunci ring, kunci soket, kunci L, hingga kunci momen presisi.",
    pages: [
      {
        title: "Kunci Pas & Kunci Ring",
        image: "assets/book1_wrenches.png",
        content: `<strong>Kunci Pas (Open-End Wrench):</strong> Rahangnya terbuka di kedua ujung membentuk sudut 15 derajat. Digunakan untuk melonggarkan baut/mur pada area sempit yang tidak memiliki akses dari atas kepala baut.<br><br><strong>Kunci Ring (Box-End Wrench):</strong> Memiliki ujung tertutup melingkar dengan profil segi-12 (12-point). Kunci ini mencengkeram semua sudut mur secara merata sehingga sangat aman digunakan untuk beban torsi besar tanpa merusak kepala baut.`
      },
      {
        title: "Kunci Soket & Gagang Ratchet",
        image: "assets/book1_wrenches.png",
        content: `<strong>Kunci Soket (Socket Wrench):</strong> Berbentuk silinder yang mencengkeram seluruh sisi luar kepala baut/mur secara penuh. Sangat efektif untuk menjangkau baut di posisi mendalam.<br><br><strong>Gagang Ratchet (Ratchet Handle):</strong> Alat bantu pemutar kunci sok yang memiliki roda gigi searah. Mekanik dapat memutar gagang maju-mundur tanpa harus melepas kunci dari kepala baut berulang kali, mempercepat proses perakitan.`
      },
      {
        title: "Kunci Momen & Kunci L",
        image: "assets/book1_wrenches.png",
        content: `<strong>Kunci Momen (Torque Wrench):</strong> Digunakan pada tahap akhir pengencangan mur/baut penting (seperti baut kepala silinder atau baut roda). Kunci ini mengukur kekuatan torsi secara presisi agar sesuai dengan standar spesifikasi pabrikan otomotif.<br><br><strong>Kunci L (Hexagonal Wrench):</strong> Berbentuk silinder segi-enam yang dibengkokkan membentuk huruf 'L'. Berfungsi untuk melepas baut yang memiliki lubang heksagonal di dalam kepalanya.`
      }
    ],
    quiz: {
      question: "Manakah jenis kunci yang khusus digunakan untuk mengencangkan baut kepala silinder dengan nilai kekuatan torsi tertentu?",
      options: [
        "Kunci Pas",
        "Kunci Ring",
        "Kunci Momen",
        "Kunci L"
      ],
      answerIndex: 2
    }
  },
  {
    id: "book2",
    title: "Obeng, Tang & Palu",
    color: "#0d9488",
    coverImage: "assets/book2_handtools.png",
    description: "Pelajari fungsi obeng biasa/ketok, berbagai jenis tang jepit/potong, dan penggunaan palu.",
    pages: [
      {
        title: "Obeng Biasa & Obeng Ketok",
        image: "assets/book2_handtools.png",
        content: `<strong>Obeng (Screwdriver):</strong> Digunakan untuk mengencangkan atau mengendurkan sekrup berkepala Plus (+) atau Minus (-).<br><br><strong>Obeng Ketok (Impact Driver):</strong> Obeng khusus berbadan logam tebal. Ketika bagian belakangnya dipukul dengan palu, mekanisme internalnya mengubah gaya vertikal tersebut menjadi putaran sentakan melingkar yang sangat kuat. Berguna untuk membuka sekrup karatan yang membeku.`
      },
      {
        title: "Jenis-Jenis Tang Bengkel",
        image: "assets/book2_handtools.png",
        content: `<strong>Tang Kombinasi (Combination Pliers):</strong> Memiliki rahang bergerigi untuk menjepit benda kerja dan bagian tengah tajam untuk memotong kawat/kabel.<br><br><strong>Tang Lancip (Long Nose Pliers):</strong> Rahangnya memanjang ke depan untuk menjepit komponen kecil atau kabel di sudut sempit.<br><br><strong>Tang Potong (Diagonal Pliers):</strong> Didesain khusus hanya untuk memotong kawat tembaga, kabel listrik, atau pin logam.`
      },
      {
        title: "Palu Logam & Palu Lunak",
        image: "assets/book2_handtools.png",
        content: `<strong>Palu Konde (Ball Peen Hammer):</strong> Memiliki ujung rata untuk memukul paku/chisel dan ujung bulat untuk membentuk logam atau paku keling.<br><br><strong>Palu Lunak (Plastik, Karet, Tembaga):</strong> Digunakan untuk memukul komponen mesin (seperti cover blok mesin atau poros) tanpa merusak, melecetkan, atau mendeformasi permukaan logam halus benda tersebut.`
      }
    ],
    quiz: {
      question: "Alat pemutar sekrup manakah yang berputar kencang secara mekanis saat ujung gagang logamnya diketok dengan palu?",
      options: [
        "Obeng Plus (+)",
        "Obeng Minus (-)",
        "Obeng Ketok (Impact)",
        "Tang Kombinasi"
      ],
      answerIndex: 2
    }
  },
  {
    id: "book3",
    title: "Special Service Tools (SST)",
    color: "#f97316",
    coverImage: "assets/book3_sst.png",
    description: "Mengenal alat penekan ring piston, tracker magnet, pelepas katup, dan treker bearing.",
    pages: [
      {
        title: "Piston Ring Compressor & Expander",
        image: "assets/book3_sst.png",
        content: `<strong>Piston Ring Compressor:</strong> Sabuk baja melingkar yang dapat dikencangkan untuk menekan ring piston agar rapat masuk ke dalam silinder saat perakitan mesin.<br><br><strong>Piston Ring Expander:</strong> Tang khusus berkepala tumpul yang digunakan untuk melebarkan dan memasang/melepas ring piston pada alur piston tanpa risiko patah.`
      },
      {
        title: "Valve Spring Compressor & Filter Wrench",
        image: "assets/book3_sst.png",
        content: `<strong>Valve Spring Compressor:</strong> Digunakan untuk menekan pegas katup (valve spring) pada kepala silinder. Menekan pegas memudahkan pengelepas atau pemasangan kuku pengunci katup (*cotter pin*).<br><br><strong>Kunci Filter Oli (Oil Filter Wrench):</strong> Rantai atau sabuk penjepit khusus yang digunakan untuk membuka rumah filter oli pelumas.`
      },
      {
        title: "Treker Bearing & Clutch Aligner",
        image: "assets/book3_sst.png",
        content: `<strong>Treker Bearing (Bearing Puller):</strong> Kaki penarik logam bercakar tiga yang digunakan untuk mencabut bearing atau roda gigi dari porosnya secara lurus agar tidak merusak ulir poros.<br><br><strong>Clutch Aligning Tool:</strong> Poros pemandu plastik/logam untuk memposisikan kampas kopling (*clutch disc*) tepat di tengah sebelum cover kopling dikencangkan.`
      }
    ],
    quiz: {
      question: "Apakah nama SST yang digunakan untuk menekan pegas katup di kepala silinder saat hendak memasang atau melepas kuku pengunci katup?",
      options: [
        "Piston Ring Compressor",
        "Valve Spring Compressor",
        "Bearing Puller Tracker",
        "Clutch Aligning Tool"
      ],
      answerIndex: 1
    }
  },
  {
    id: "book4",
    title: "Keselamatan & Perawatan",
    color: "#ea580c",
    coverImage: "assets/book4_safety.png",
    description: "Terapkan K3, pelajari penggunaan APD bengkel, pemeliharaan alat, dan budaya 5S/5R.",
    pages: [
      {
        title: "Alat Pelindung Diri (APD)",
        image: "assets/book4_safety.png",
        content: `<strong>Baju Praktek (Wearpack):</strong> Melindungi tubuh mekanik dari goresan, oli panas, dan percikan api.<br><br><strong>Sepatu Safety (Safety Shoes):</strong> Memiliki ujung pelindung baja (steel toe) untuk menahan benturan benda berat yang terjatuh.<br><br><strong>Kacamata K3 & Sarung Tangan:</strong> Melindungi mata dari debu logam/cairan kimia, dan sarung tangan melindungi telapak dari luka sayatan.`
      },
      {
        title: "Pemeliharaan & Kebersihan Alat",
        image: "assets/book4_safety.png",
        content: `<strong>SOP Pembersihan Alat:</strong> Setiap selesai praktikum, alat wajib dilap bersih menggunakan majun (kain lap) dari sisa oli, gemuk, atau kotoran.<br><br><strong>Penyimpanan:</strong> Kembalikan alat ke papan bay-tooling sesuai dengan siluet bayangannya atau tata di dalam laci toolbox sesuai klasifikasi ukuran agar tidak berkarat, rusak, atau hilang.`
      },
      {
        title: "Budaya Kerja Industri 5S/5R",
        image: "assets/book4_safety.png",
        content: `<strong>Seiri (Ringkas):</strong> Memisahkan barang berguna dan tidak berguna, lalu membuang yang tidak perlu.<br><br><strong>Seiton (Rapi):</strong> Menata peralatan kerja pada tempatnya agar mudah dicari saat dibutuhkan.<br><br><strong>Seiso (Resik):</strong> Membersihkan stasiun kerja dari debu, ceceran oli, dan sampah.<br><br><strong>Seiketsu (Rawat) & Shitsuke (Rajin):</strong> Memelihara standar kebersihan secara konsisten dan membiasakan disiplin kerja.`
      }
    ],
    quiz: {
      question: "Aspek budaya industri 5S/5R yang melatih disiplin diri dan pembiasaan merapikan alat kembali ke tempat semula setelah selesai digunakan adalah...",
      options: [
        "Seiri (Ringkas)",
        "Seiton (Rapi)",
        "Seiketsu (Rawat)",
        "Shitsuke (Rajin)"
      ],
      answerIndex: 3
    }
  }
];
