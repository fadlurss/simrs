# simrs

SIM RS Menggunakan Node js

Yang belum :

SELESAI

1. ketika menambahkan penerimaan barang > total barang jika lebih dari total masuk, maka pas klik button tidak bisa disimpan, di stokopname
2. penjumlahan subtotal di modul pendaftaran
3. Validasi front end Menu pendaftaran
4. No rawat gabungan dari tanggal dan no registrasi, buat dulu form input datenow tapi di hidden, kemudian buat inputan gabungan dari tanggal dan noregis

<select name="hubungan_penanggung_jawab" class="form-control" id="">
                                <option value="" disabled>
                                    Pilihan sebelumnya :
                                    <%= data_pendaftaran.hubungan_penanggung_jawab %>
                                </option>
                                <option value="orang_tua">Orang tua</option>
                                <option value="saudara">Saudara</option>
                                <option value="teman">Teman</option>
                            </select>

cara export from mlab to json :

1.  cd /usr/local/mongodb di terminal
2.  cd bin
3.  contoh mau export collection users, maka mongoexport -h ds213896.mlab.com:13896 -d simrs -c NAMATABELNYA -u fadlurss -p Xtcbandung97 -o NAMAEXPORTNYA.json

git pull
