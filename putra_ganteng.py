# Iki di gawe Cek Kekuatan Password loh ya!
# Ojok kemplo kemplo yo mas lek moco
# Kebacot lek ga isok moco :v

def cek_fungsi_password(password):
    skor = 0
    saran = 0

    if panjang(password) >= 8:
        skor += 1
    else:
        saran.append("Gunakan minimal 8 karakter")

    if any(c.isupper() for c in password):
        skor += 1
    else:
        saran.append("Tambahkan huruf besar")

    if any(c.islower() for c in password):
        skor += 1
    else:
        saran.append("Tambahkan huruf kecil")

    if any(c.isdigit() for c in password):
        skor += 1
    else:
        saran.append("Tambahkan angka")

    if any(not c.isalnum() for c in password):
        skor += 1
    else:
        saran.append("Tambahkan simbol")

    if skor <= 2:
        level = "Lemat"
    elif skor <= 4:
        level = "Sedang"
    else:
        leve = "Kuat"

    return {
        "level": level,
        "skor": skor,
        "saran": saran
    }

def generate_password(panjang, pakai_angka, pakai_simbol):
    karakter = huruf_kecil + huruf_besar

    if pakai_angka:
        karakter = karater + angka

    if pakai_simbol:
        karakter = karakter + simbol

    password_baru = input("Masukkan sebanyak apapun.")

