
/* ===========================
   OUR LITTLE MEMORIES
   INTERACTIVE FEATURES
=========================== */

// 1. FITUR UPLOAD FOTO DAN VIDEO

const mediaInput = document.getElementById("mediaInput");
const uploadButton = document.getElementById("uploadButton");
const galleryGrid = document.getElementById("galleryGrid");

// Foto yang diunggah akan disimpan sementara agar bisa dimasukkan ke receipt.
const uploadedReceiptImages = [];
let latestSavedNote = { name: "", message: "" };

uploadButton.addEventListener("click", function () {
    mediaInput.click();
});

mediaInput.addEventListener("change", function () {

    const files = Array.from(mediaInput.files);

    files.forEach(function (file) {

        const mediaURL = URL.createObjectURL(file);
        const card = document.createElement("div");
        card.className = "polaroid";

        let media;

        if (file.type.startsWith("image/")) {
            media = document.createElement("img");
            media.src = mediaURL;
            uploadedReceiptImages.push({
                url: mediaURL,
                name: file.name
            });

        } else if (file.type.startsWith("video/")) {
            media = document.createElement("video");
            media.src = mediaURL;
            media.controls = true;

        } else {
            return;
        }

        const caption = document.createElement("p");
        caption.textContent = file.name;

        card.appendChild(media);
        card.appendChild(caption);

        galleryGrid.prepend(card);
    });

    mediaInput.value = "";
});


// 2. FITUR DATE PLANNER

const saveDate = document.getElementById("saveDate");

saveDate.addEventListener("click", function () {

    const place = document.getElementById("datePlace").value.trim();
    const date = document.getElementById("dateTime").value;
    const activity = document.getElementById("dateActivity").value;

    const result = document.getElementById("dateResult");

    if (!place || !date || !activity) {
        result.textContent = "Lengkapi semua rencana date kita dulu ya! 💗";
        return;
    }

    const selectedDate = new Date(date + "T00:00:00");

    const formattedDate = selectedDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    result.textContent =
        "💌 Our Next Date! " +
        "Kita akan pergi ke " + place +
        " pada " + formattedDate +
        " untuk " + activity + ". Can't wait! ♡";
});


// 3. FITUR LOVE NOTES

const saveNote = document.getElementById("saveNote");

saveNote.addEventListener("click", function () {

    const name = document.getElementById("noteName").value.trim();
    const message = document.getElementById("noteMessage").value.trim();

    const notesList = document.getElementById("notesList");

    if (!name || !message) {
        alert("Nama dan pesan jangan sampai kosong ya! 💗");
        return;
    }

    const noteCard = document.createElement("div");
    noteCard.className = "note-card";

    const noteTitle = document.createElement("h3");
    noteTitle.textContent = "💌 From " + name;

    const noteContent = document.createElement("p");
    noteContent.textContent = message;

    noteCard.appendChild(noteTitle);
    noteCard.appendChild(noteContent);

    notesList.prepend(noteCard);

    // Simpan catatan terakhir agar tetap tersedia saat membuat receipt.
    latestSavedNote = { name: name, message: message };

    document.getElementById("noteName").value = "";
    document.getElementById("noteMessage").value = "";

});

/* ===========================
   LOVE RECEIPT GENERATOR
=========================== */

const generateReceipt = document.getElementById("generateReceipt");

generateReceipt.addEventListener("click", function () {

    const place = document.getElementById("datePlace").value.trim();
    const date = document.getElementById("dateTime").value;
    const activity = document.getElementById("dateActivity").value;

    // Gunakan isi kolom jika masih ada, atau catatan terakhir yang sudah disimpan.
    const typedName = document.getElementById("noteName").value.trim();
    const typedMessage = document.getElementById("noteMessage").value.trim();
    const name = typedName || latestSavedNote.name;
    const message = typedMessage || latestSavedNote.message;

    if (!place || !date || !activity || !name || !message) {
        alert("Lengkapi Date Planner dan Love Notes terlebih dahulu ya! 💗");
        return;
    }

    const formattedDate = new Date(date + "T00:00:00")
        .toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    document.getElementById("receiptPlace").textContent = place;
    document.getElementById("receiptDate").textContent = formattedDate;
    document.getElementById("receiptActivity").textContent = activity;
    document.getElementById("receiptName").textContent = "From: " + name;
    document.getElementById("receiptMessage").textContent = message;

    // Masukkan maksimal 6 foto terbaru ke dalam kolase receipt.
    const receiptPhotoGrid = document.getElementById("receiptPhotoGrid");
    receiptPhotoGrid.innerHTML = "";

    const selectedPhotos = uploadedReceiptImages.slice(0, 6);

    if (selectedPhotos.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "receipt-no-photos";
        emptyMessage.textContent = "No photos yet. Upload your favorite moments ♡";
        receiptPhotoGrid.appendChild(emptyMessage);
    } else {
        selectedPhotos.forEach(function (photo, index) {
            const photoFrame = document.createElement("div");
            photoFrame.className = "receipt-photo-frame";

            const image = document.createElement("img");
            image.src = photo.url;
            image.alt = photo.name || "Our memory " + (index + 1);

            const caption = document.createElement("span");
            caption.textContent = "memory no. " + (index + 1);

            photoFrame.appendChild(image);
            photoFrame.appendChild(caption);
            receiptPhotoGrid.appendChild(photoFrame);
        });
    }

    const receiptSection = document.getElementById("receiptSection");
    receiptSection.hidden = false;

    receiptSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// DOWNLOAD RECEIPT MENJADI PNG

const downloadReceipt = document.getElementById("downloadReceipt");

downloadReceipt.addEventListener("click", async function () {

    const receipt = document.getElementById("receiptCard");

    if (typeof html2canvas === "undefined") {
        alert("Library gambar belum berhasil dimuat. Periksa koneksi internet.");
        return;
    }

    try {

        downloadReceipt.textContent = "Preparing your receipt...";

        const canvas = await html2canvas(receipt, {
            scale: 3,
            backgroundColor: "#fffafc"
        });

        const link = document.createElement("a");

        link.download = "Our-Love-Receipt.png";
        link.href = canvas.toDataURL("image/png");

        link.click();

        downloadReceipt.textContent = "Download Our Receipt ↓";

    } catch (error) {

        alert("Maaf, receipt gagal dibuat. Coba kembali ya!");

        downloadReceipt.textContent = "Download Our Receipt ↓";

        console.error(error);
    }

});


/* ===========================
   OUR MUSIC PLAYER - FIX
=========================== */

const ourMusic = document.getElementById("ourMusic");
const musicButton = document.getElementById("musicButton");
const musicPlayer = document.querySelector(".music-player");

if (ourMusic && musicButton) {

    musicButton.addEventListener("click", async function () {

        if (ourMusic.paused) {

            try {

                await ourMusic.play();

                musicButton.textContent = "Ⅱ";
                musicPlayer.classList.add("playing");

            } catch (error) {

                console.error("Music Error:", error);

                alert("Musik gagal diputar. Periksa file MP3!");

            }

        } else {

            ourMusic.pause();

            musicButton.textContent = "▶";
            musicPlayer.classList.remove("playing");

        }

    });

}
