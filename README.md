# simrs

SIM RS Menggunakan Node js

GMAILPW=your password in terminal node app.js

Yang belum :

1. Buat histori daftar antrian pasien di profil pasien.

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

REVISI

1. Perbaikan UI cek diagnosa tampilannya seperti slide PPT, ada ya/tidak

SARAN

1. Misalkan kalo user daftar antrian secara online, terus datang untuk konfirmasi kemudian resepsionis mengecek pendaftarannya, maka resepsionis perlu memberikan kartu kecil berupa nomor antrian untuk diberikan kepada pasien.
2. Saat proses upload ke server, kalau verifikasi email via smptp tidak jalan, maka yang perlu dilakukan adalah mengetik GMAILPW di terminal web server nya, atau mengetik nama variabel ENV di terminal servernya


<a class="dropdown-toggle" data-toggle="dropdown" href="#">
                        Pasien masuk <span class="badge"><%= x %></span></i>
                        <ul class="dropdown-menu">
                            <% dadabaru.forEach(function(notification){ 
                                if(notification == undefined){
                                   return;
                                }
                            %>
                            <li><a
                                    href="/notifikasi/<%= notification._id %>"><%= notification.id_pasien.nama_pasien %></a>
                            </li>
                            <% }); %>
                        </ul>
                    </a>