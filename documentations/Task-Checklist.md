**TASK CHECKLIST**
**Discord-Like Web Application — Project-Based Learning**
*Fase 10 (Terakhir) — Dokumen tunggal fase ini*
# Pendahuluan
Dokumen ini adalah level rincian paling granular dari seluruh rangkaian dokumentasi proyek, mengikuti struktur Epic → Feature → Task → Subtask → Checklist. Epic mengikuti 7 rilis pada Development Roadmap (Fase 8); Feature mengikuti 19 sprint pada Sprint Breakdown (Fase 9); setiap Task dilengkapi Deskripsi, Acceptance Criteria, Dependency, Priority, Estimasi Kesulitan, Estimasi Waktu, dan Definition of Done, diikuti Subtask dan Checklist Verifikasi yang dapat langsung dicentang selama implementasi.
Total 26 Task tercakup pada dokumen ini, mencakup seluruh fitur inti hingga fitur lanjutan yang telah disepakati sepanjang Fase 0-9, termasuk keputusan terbaru: dukungan poll multiple-choice (T16.1) dan operasi bulk dengan permission check per-item (T18.1).

# EPIC 1 — Foundation (v0.1)
## Feature S1 — Setup Infrastruktur & Repo Skeleton
**T1.1 — Inisialisasi Monorepo & Docker Compose**
| **Deskripsi** | **Membuat struktur folder Modular Monolith dan konfigurasi docker-compose untuk PostgreSQL, Redis, dan service aplikasi dasar.** |
| --- | --- |
| **Acceptance Criteria** | **1. docker-compose up menjalankan PostgreSQL & Redis tanpa error.  2. Struktur folder modules/, shared/, config/ sudah sesuai Architecture Document.** |
| **Dependency** | **Tidak ada (task pertama proyek).** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Easy** |
| **Estimasi Waktu** | **6 jam** |
| **Definition of Done** | **Environment lokal dapat dijalankan siapapun dengan satu perintah (docker-compose up).** |
**Subtask:**
- [x] Inisialisasi repo & konfigurasi TypeScript.
- [x] Tulis docker-compose.yml (postgres, redis).
- [x] Buat struktur folder sesuai Architecture Document.
- [x] Setup Prisma init & koneksi ke database.
**Checklist Verifikasi:**
- [x] docker-compose up berhasil tanpa error
- [x] Prisma berhasil connect ke database
- [x] Struktur folder sesuai Architecture Document

**T1.2 — Setup Traefik, Linting, dan CI**
| **Deskripsi** | **Konfigurasi Traefik sebagai reverse proxy dasar, tooling Biome/Husky/Commitlint, dan pipeline GitHub Actions.** |
| --- | --- |
| **Acceptance Criteria** | **1. Traefik meneruskan request ke service aplikasi placeholder.  2. Commit yang tidak sesuai conventional commit ditolak Husky/Commitlint.  3. Pipeline CI berjalan otomatis saat push & PR.** |
| **Dependency** | **T1.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **8 jam** |
| **Definition of Done** | **Kontribusi kode baru otomatis tervalidasi format & lint sebelum masuk ke branch utama.** |
**Subtask:**
- [x] Tulis konfigurasi Traefik (label docker-compose).
- [x] Install & konfigurasi Biome.
- [x] Install Husky + Commitlint dengan aturan conventional commit.
- [x] Tulis workflow GitHub Actions (lint + build).
**Checklist Verifikasi:**
- [x] Traefik routing berhasil diuji manual
- [x] Commit tidak valid ditolak otomatis
- [x] CI pipeline hijau pada PR pertama

## Feature S2 — Authentication & Authorization Foundation
**T2.1 — Implementasi Register & Login**
| **Deskripsi** | **Endpoint registrasi dan login sesuai SRS-AUTH-01/02, termasuk hashing password dan penerbitan token.** |
| --- | --- |
| **Acceptance Criteria** | **1. POST /auth/register menyimpan user baru dengan password ter-hash argon2id.  2. POST /auth/login mengembalikan access & refresh token untuk kredensial valid.  3. Kredensial salah mengembalikan error generik.** |
| **Dependency** | **T1.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **10 jam** |
| **Definition of Done** | **Pengguna baru dapat register, login, dan menerima token valid untuk endpoint terproteksi.** |
**Subtask:**
- [x] Buat Prisma schema users & sessions.
- [x] Implementasi service register (validasi Zod, hashing password).
- [x] Implementasi service login (verifikasi & penerbitan JWT + refresh token).
- [ ] Tulis unit test dasar service auth.
**Checklist Verifikasi:**
- [x] Register & login berhasil diuji via Postman
- [x] Password tidak pernah tersimpan sebagai plaintext
- [x] Access token kedaluwarsa sesuai konfigurasi (15 menit)

**T2.2 — Session & Device Management**
| **Deskripsi** | **Endpoint untuk melihat dan mencabut sesi aktif sesuai Security Design.** |
| --- | --- |
| **Acceptance Criteria** | **1. GET /auth/sessions menampilkan seluruh sesi aktif milik user.  2. DELETE /auth/sessions/{sessionId} mencabut sesi tertentu (set revoked_at).** |
| **Dependency** | **T2.1** |
| **Priority** | **Should** |
| **Estimasi Kesulitan** | **Easy** |
| **Estimasi Waktu** | **5 jam** |
| **Definition of Done** | **Pengguna dapat mengelola perangkat/sesi aktif miliknya secara mandiri.** |
**Subtask:**
- [x] Implementasi endpoint list session.
- [x] Implementasi endpoint revoke session.
- [x] Tambahkan middleware pengecekan revoked_at pada validasi token.
**Checklist Verifikasi:**
- [x] Sesi yang di-revoke tidak dapat lagi digunakan
- [x] Device info & IP tercatat saat login

# EPIC 2 — Workspace & Permission (v0.2)
## Feature S3 — Server & Membership
**T3.1 — CRUD Server & Membership**
| **Deskripsi** | **Membuat, membaca, mengubah, menghapus server; join/leave server; pembuatan role default @everyone otomatis.** |
| --- | --- |
| **Acceptance Criteria** | **1. Pembuatan server otomatis menjadikan pembuat sebagai Owner.  2. Endpoint join/leave berfungsi & menegakkan UNIQUE(server_id, user_id).  3. Server hanya dapat dihapus oleh Owner.** |
| **Dependency** | **T2.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **10 jam** |
| **Definition of Done** | **Server dapat dibuat, di-join, dan dikelola dasarnya sesuai SRS-WS-01.** |
**Subtask:**
- [x] Prisma schema servers & server_members.
- [x] Endpoint CRUD server.
- [x] Endpoint join/leave server.
- [x] Logic pembuatan role default @everyone & assignment Owner.
**Checklist Verifikasi:**
- [x] Server baru otomatis punya role @everyone
- [x] Join/leave server tervalidasi & tidak duplikat
- [x] Hanya Owner yang dapat menghapus server

## Feature S4 — Category/Channel & Role/Permission
**T4.1 — CRUD Category & Channel**
| **Deskripsi** | **Membuat/mengubah/menghapus category dan channel (text/voice/video/forum/announcement) beserta pengurutan posisinya.** |
| --- | --- |
| **Acceptance Criteria** | **1. Channel dapat dibuat dengan/atau tanpa category.  2. Perubahan posisi/urutan tersimpan & tersinkron ke seluruh client (broadcast dasar).** |
| **Dependency** | **T3.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **8 jam** |
| **Definition of Done** | **Struktur Server → Category → Channel berfungsi sesuai SRS-WS-02.** |
**Subtask:**
- [x] Prisma schema categories & channels.
- [x] Endpoint CRUD category & channel.
- [x] Logic reordering posisi (position field).
**Checklist Verifikasi:**
- [x] Channel tampil terkelompok sesuai category
- [x] Reordering tidak menimbulkan konflik posisi duplikat

**T4.2 — Role & Permission Engine**
| **Deskripsi** | **Membangun engine evaluasi permission berbasis bitmask, termasuk role kustom dan channel permission override.** |
| --- | --- |
| **Acceptance Criteria** | **1. Role baru tidak dapat diberi permission melebihi permission aktor pembuat (SRS-PERM-01).  2. Channel override (allow/deny) dievaluasi dengan benar terhadap role dasar.** |
| **Dependency** | **T4.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Hard** |
| **Estimasi Waktu** | **12 jam** |
| **Definition of Done** | **Sistem permission granular berfungsi dan aman dari privilege escalation dasar.** |
**Subtask:**
- [x] Prisma schema roles, server_member_roles, channel_permission_overrides.
- [x] Middleware evaluasi permission bitmask + override.
- [x] Endpoint create/update role & assignment ke member.
- [x] Endpoint set channel permission override.
**Checklist Verifikasi:**
- [x] Percobaan privilege escalation ditolak (diuji manual)
- [x] Override channel mengalahkan permission role dasar sesuai aturan allow/deny
- [x] Middleware permission dipakai konsisten di seluruh endpoint terkait

# EPIC 3 — Realtime Messaging Core (v0.3)
## Feature S5 — WebSocket Foundation
**T5.1 — WebSocket Gateway & Connection Registry**
| **Deskripsi** | **Membangun server WebSocket (native ws, ADR-002), autentikasi koneksi, dan connection registry per channel.** |
| --- | --- |
| **Acceptance Criteria** | **1. Koneksi WebSocket wajib menyertakan access token valid saat handshake.  2. Connection registry dapat memetakan channel_id ke daftar socket aktif.** |
| **Dependency** | **T2.1, T4.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Hard** |
| **Estimasi Waktu** | **10 jam** |
| **Definition of Done** | **Klien dapat terhubung WebSocket dan menerima event dummy end-to-end.** |
**Subtask:**
- [x] Setup ws server terpisah dari REST API listener.
- [x] Implementasi autentikasi handshake via token.
- [x] Implementasi connection registry (Map channel_id -> Set socket).
- [x] Implementasi subscribe/unsubscribe channel.
**Checklist Verifikasi:**
- [x] Koneksi tanpa token valid ditolak
- [x] Klien dapat subscribe & unsubscribe channel dengan benar

## Feature S6 — Core Messaging CRUD + Broadcast
**T6.1 — Message CRUD & Realtime Broadcast**
| **Deskripsi** | **Endpoint kirim/edit/hapus (soft delete) pesan, dengan broadcast realtime dan parsing reply/mention.** |
| --- | --- |
| **Acceptance Criteria** | **1. Pesan baru langsung diterima seluruh client channel dalam <150ms (target SRS).  2. Edit/hapus hanya oleh pengirim asli atau pemegang MANAGE_MESSAGES.  3. Mention memicu event terpisah untuk Notification Module (S9).** |
| **Dependency** | **T5.1, T4.2** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Hard** |
| **Estimasi Waktu** | **14 jam** |
| **Definition of Done** | **Messaging inti berfungsi end-to-end sesuai SRS-MSG-01.** |
**Subtask:**
- [x] Prisma schema messages.
- [x] Endpoint POST/PATCH/DELETE message dengan permission check.
- [x] Broadcast event message.created/updated/deleted via WebSocket.
- [x] Parsing reply_to_id & mention dari konten pesan.
**Checklist Verifikasi:**
- [x] Kirim/edit/hapus pesan realtime teruji end-to-end
- [x] Soft delete tidak menghapus data secara fisik dari database
- [x] Permission check menolak aktor tanpa SEND_MESSAGES

## Feature S7 — Reactions/Pin + Redis Pub/Sub Scaling
**T7.1 — Reactions & Pin**
| **Deskripsi** | **Endpoint tambah/hapus reaksi emoji dan sematkan (pin) pesan.** |
| --- | --- |
| **Acceptance Criteria** | **1. Satu user tidak dapat memberi emoji sama dua kali pada pesan yang sama.  2. Pin hanya oleh pemegang MANAGE_MESSAGES.** |
| **Dependency** | **T6.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Easy** |
| **Estimasi Waktu** | **6 jam** |
| **Definition of Done** | **Reaksi & pin berfungsi sesuai FR-MSG-04/06.** |
**Subtask:**
- [x] Prisma schema reactions.
- [x] Endpoint add/remove reaction.
- [x] Endpoint pin/unpin message.
**Checklist Verifikasi:**
- [x] Reaksi duplikat ditolak (UNIQUE constraint)
- [x] Pin/unpin tersinkron realtime ke seluruh client

**T7.2 — Redis Pub/Sub Cross-Instance Broadcast**
| **Deskripsi** | **Implementasi koordinasi broadcast WebSocket lintas instance aplikasi melalui Redis Pub/Sub, sesuai ADR-002.** |
| --- | --- |
| **Acceptance Criteria** | **1. Pesan yang dikirim melalui instance A diterima client yang terhubung ke instance B.  2. Tidak ada duplikasi event yang diterima client akibat multi-instance.** |
| **Dependency** | **T6.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Hard** |
| **Estimasi Waktu** | **10 jam** |
| **Definition of Done** | **Strategi scaling WebSocket lintas instance (Architecture Document Bagian 6) terbukti bekerja.** |
**Subtask:**
- [x] Implementasi publish event ke Redis channel saat broadcast lokal.
- [x] Implementasi subscriber di setiap instance untuk relay ke connection registry lokal.
- [x] Uji dengan menjalankan 2 replika aplikasi via docker-compose scale.
**Checklist Verifikasi:**
- [x] Broadcast lintas instance terverifikasi dengan 2 replika
- [x] Tidak ada event yang diterima ganda oleh client yang sama

## Feature S8 — Presence & Typing/Read Receipt
**T8.1 — Presence State & Broadcast**
| **Deskripsi** | **Melacak dan menyiarkan status presence (online/offline/idle/DND/invisible) melalui Redis + Pub/Sub.** |
| --- | --- |
| **Acceptance Criteria** | **1. Status invisible tetap tercatat sebagai status asli secara internal namun disiarkan sebagai offline.  2. Disconnect WebSocket memicu status offline setelah grace period.** |
| **Dependency** | **T7.2** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **8 jam** |
| **Definition of Done** | **Presence berfungsi end-to-end sesuai FR-PRES-01.** |
**Subtask:**
- [x] Simpan state presence di Redis per user_id.
- [x] Broadcast event presence.updated via Pub/Sub.
- [x] Implementasi grace period sebelum status offline pada disconnect.
**Checklist Verifikasi:**
- [x] Presence tersinkron realtime lintas instance
- [x] Status invisible bekerja sesuai spesifikasi SRS-PRES-01

**T8.2 — Typing Indicator & Read Receipt**
| **Deskripsi** | **Event typing indicator (dengan debounce) dan tracking read receipt per channel.** |
| --- | --- |
| **Acceptance Criteria** | **1. Typing indicator tidak mengedip berlebihan saat banyak pengguna mengetik bersamaan.  2. Read receipt tercatat per user per channel.** |
| **Dependency** | **T8.1** |
| **Priority** | **Should** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **6 jam** |
| **Definition of Done** | **Typing indicator & read receipt berfungsi sesuai FR-PRES-02/03.** |
**Subtask:**
- [x] Implementasi event typing dengan debounce di sisi server.
- [x] Implementasi tracking & endpoint read receipt.
**Checklist Verifikasi:**
- [x] Typing indicator hilang otomatis setelah beberapa detik tanpa aktivitas
- [x] Read receipt terupdate saat channel dibuka

# EPIC 4 — Engagement Features (v0.4)
## Feature S9 — Notification System
**T9.1 — Realtime & Email Notification**
| **Deskripsi** | **Notifikasi realtime untuk mention/reply dan notifikasi email asinkron via BullMQ untuk pengguna offline.** |
| --- | --- |
| **Acceptance Criteria** | **1. Pengguna online menerima notifikasi via WebSocket secara instan.  2. Pengguna offline menerima email dalam rentang waktu wajar melalui job queue.  3. Job gagal di-retry dengan exponential backoff.** |
| **Dependency** | **T8.1, T6.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **10 jam** |
| **Definition of Done** | **Notification Flow berfungsi end-to-end sesuai SRS-NOTIF-01.** |
**Subtask:**
- [x] Prisma schema notifications.
- [x] Trigger notifikasi pada event mention/reply.
- [x] Setup BullMQ worker & job pengiriman email.
- [x] Integrasi provider SMTP/API & konfigurasi retry/backoff.
**Checklist Verifikasi:**
- [x] Notifikasi realtime diterima instan saat online
- [x] Email terkirim & job gagal masuk retry/dead-letter sesuai desain

## Feature S10 — Upload & Media
**T10.1 — Direct Upload Flow ke Cloudinary**
| **Deskripsi** | **Alur signed URL upload langsung ke Cloudinary tanpa membebani server aplikasi, hingga 1GB per file.** |
| --- | --- |
| **Acceptance Criteria** | **1. File melebihi 1GB atau tipe tidak didukung ditolak sebelum signed URL diterbitkan.  2. Metadata file tersimpan setelah konfirmasi upload sukses.** |
| **Dependency** | **T6.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **10 jam** |
| **Definition of Done** | **Upload file end-to-end berfungsi sesuai SRS-UP-01.** |
**Subtask:**
- [x] Prisma schema message_attachments.
- [x] Endpoint permintaan signed URL (validasi tipe & ukuran).
- [x] Endpoint konfirmasi upload & simpan metadata.
- [x] Konfigurasi thumbnail otomatis di Cloudinary.
**Checklist Verifikasi:**
- [x] Upload file besar (mendekati 1GB) berhasil diuji
- [x] File tipe/ukuran tidak valid ditolak sebelum upload dimulai

## Feature S11 — Search
**T11.1 — Full Text Search Implementation**
| **Deskripsi** | **Implementasi pencarian lintas entitas menggunakan PostgreSQL tsvector, trigger, dan index GIN.** |
| --- | --- |
| **Acceptance Criteria** | **1. Pencarian hanya menampilkan entitas yang aktor memiliki akses baca.  2. Query di bawah panjang minimum ditolak dengan validasi.** |
| **Dependency** | **T6.1, T4.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **9 jam** |
| **Definition of Done** | **Pencarian lintas entitas berfungsi sesuai FR-SRC-01.** |
**Subtask:**
- [x] Migration tsvector + trigger + index GIN pada messages/servers/channels.
- [x] Endpoint GET /search dengan filter tipe entitas.
- [x] Implementasi API pagination dan sorting untuk hasil pencarian.
**Checklist Verifikasi:**
- [x] Hasil pencarian terfilter sesuai akses aktor
- [x] Waktu respons pencarian sesuai target SRS (p95 < 500ms)

# EPIC 5 — Voice & Video (v0.5)
## Feature S12 — LiveKit Server Setup & Token Issuance
**T12.1 — Integrasi LiveKit (Server-Side)**
| **Deskripsi** | **Menjalankan LiveKit self-hosted pada docker-compose dan menerbitkan access token dari Server SDK.** |
| --- | --- |
| **Acceptance Criteria** | **1. Endpoint POST /channels/{id}/voice/token menerbitkan token valid untuk aktor dengan permission CONNECT.  2. Aktor tanpa permission CONNECT ditolak dengan 403.** |
| **Dependency** | **T4.2** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Hard** |
| **Estimasi Waktu** | **10 jam** |
| **Definition of Done** | **Server dapat menerbitkan token LiveKit yang valid sesuai SRS-VV-01.** |
**Subtask:**
- [x] Tambahkan service LiveKit ke docker-compose.
- [x] Integrasi LiveKit Server SDK untuk membuat room & token.
- [x] Endpoint penerbitan token dengan permission check.
**Checklist Verifikasi:**
- [x] Token yang diterbitkan berhasil diverifikasi LiveKit
- [x] Permission CONNECT ditegakkan sebelum token diterbitkan

## Feature S13 — Voice Channel Webhook & State
**T13.1 — Integrasi LiveKit Webhook & Room Management**
| **Deskripsi** | **Menerima event webhook dari LiveKit untuk sinkronisasi state partisipan di backend.** |
| --- | --- |
| **Acceptance Criteria** | **1. Webhook dari LiveKit tervalidasi signature-nya.  2. Status "sedang di voice" (participant-joined/left) tersinkron dengan Presence Module.** |
| **Dependency** | **T12.1, T8.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **10 jam** |
| **Definition of Done** | **Voice channel berfungsi end-to-end sesuai FR-VV-01.** |
**Subtask:**
- [x] Implementasi endpoint webhook LiveKit.
- [x] Verifikasi signature webhook LiveKit.
- [x] Update state Presence berdasarkan event participant-joined/left.
**Checklist Verifikasi:**
- [x] Webhook LiveKit terverifikasi aman
- [x] State voice terupdate realtime saat webhook diterima

## Feature S14 — Room Moderation & Cleanup
**T14.1 — Voice/Video Room Moderation API**
| **Deskripsi** | **Endpoint untuk moderasi room (mute/kick participant) via Server SDK dan room cleanup.** |
| --- | --- |
| **Acceptance Criteria** | **1. Moderator dapat me-mute/kick peserta dari room via API.  2. Room yang sudah kosong dibersihkan dari state backend secara berkala atau event.** |
| **Dependency** | **T13.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **8 jam** |
| **Definition of Done** | **Video channel berfungsi end-to-end sesuai FR-VV-02.** |
**Subtask:**
- [x] Endpoint POST /channels/{id}/voice/kick dengan permission check.
- [x] Endpoint POST /channels/{id}/voice/mute dengan permission check.
- [x] Logic room cleanup saat event room-empty diterima.
**Checklist Verifikasi:**
- [x] Moderator berhasil kick participant via API
- [x] State room bersih saat seluruh peserta keluar

# EPIC 6 — Advanced Messaging & Security (v0.6)
## Feature S15 — Forum & Announcement + Thread Lanjutan
**T15.1 — Forum/Announcement Channel Rules & Thread Panel**
| **Deskripsi** | **Aturan akses khusus per tipe channel dan API khusus untuk penanganan thread.** |
| --- | --- |
| **Acceptance Criteria** | **1. Channel Announcement hanya dapat ditulis oleh role yang diizinkan.  2. Thread dibuka sebagai panel terpisah tanpa mengganti Message List utama.** |
| **Dependency** | **T6.1, T4.2** |
| **Priority** | **Should** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **9 jam** |
| **Definition of Done** | **Forum, Announcement, dan Thread berfungsi sesuai FR-WS-03 & FR-MSG-02.** |
**Subtask:**
- [x] Implementasi aturan permission khusus tipe channel forum/announcement.
- [x] Implementasi logic thread_root_id pada Messaging Module.
- [x] Implementasi struktur hirarki dan pagination untuk pesan di dalam thread.
**Checklist Verifikasi:**
- [x] Percobaan menulis di Announcement tanpa izin ditolak
- [x] Pagination cursor/offset berfungsi khusus untuk parent-child thread

## Feature S16 — Poll, Forward, Embed
**T16.1 — Poll (Single & Multiple Choice)**
| **Deskripsi** | **Implementasi polling pada pesan dengan dukungan single dan multiple choice sesuai keputusan Database Design/API Specification.** |
| --- | --- |
| **Acceptance Criteria** | **1. Parameter allowMultipleChoice menentukan apakah user dapat memilih lebih dari satu opsi.  2. Vote pada opsi yang sama tidak dapat diulang oleh user yang sama kecuali mode multiple-choice.** |
| **Dependency** | **T6.1** |
| **Priority** | **Could** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **9 jam** |
| **Definition of Done** | **Poll berfungsi sesuai FR-MSG-07 dengan dukungan multiple-choice.** |
**Subtask:**
- [x] Update schema polls/poll_options/poll_votes untuk mendukung allowMultipleChoice.
- [x] Endpoint create poll & submit vote.
- [x] Optimasi query untuk rekapitulasi hasil polling secara realtime.
**Checklist Verifikasi:**
- [x] Single-choice poll menolak vote kedua pada opsi berbeda
- [x] Multiple-choice poll mengizinkan lebih dari satu opsi per user

**T16.2 — Forward & Embed**
| **Deskripsi** | **Meneruskan pesan ke channel lain dengan validasi izin ganda, dan menampilkan preview metadata link.** |
| --- | --- |
| **Acceptance Criteria** | **1. Forward memvalidasi akses baca channel asal DAN akses tulis channel tujuan.  2. Embed hanya menampilkan metadata (judul/deskripsi/gambar), bukan iframe eksternal.** |
| **Dependency** | **T15.1** |
| **Priority** | **Could** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **8 jam** |
| **Definition of Done** | **Forward & Embed berfungsi sesuai FR-MSG-05/08.** |
**Subtask:**
- [x] Endpoint forward dengan validasi otorisasi ganda.
- [x] Fetch & sanitasi metadata link untuk embed.
- [x] Implementasi caching (Redis/memory) untuk metadata link (embed preview).
**Checklist Verifikasi:**
- [x] Forward ke channel tanpa izin tulis ditolak
- [x] Embed tidak me-render iframe/skrip dari domain eksternal

## Feature S17 — Security Hardening Penuh
**T17.1 — Rate Limiter & Audit Log Middleware**
| **Deskripsi** | **Middleware rate limiter (sliding window Redis) per kategori endpoint dan middleware audit log untuk aksi sensitif.** |
| --- | --- |
| **Acceptance Criteria** | **1. Endpoint melebihi ambang batas mengembalikan 429 RATE_LIMITED.  2. Aksi sensitif (role, moderasi, admin) tercatat di audit_logs sesuai Security Design.** |
| **Dependency** | **T4.2** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Hard** |
| **Estimasi Waktu** | **10 jam** |
| **Definition of Done** | **Rate limiter & audit log aktif sesuai Security Design Bagian 3-4.** |
**Subtask:**
- [ ] Implementasi middleware rate limiter per kategori endpoint.
- [ ] Implementasi middleware audit log generik untuk aksi sensitif.
- [ ] Uji ambang batas untuk kategori login, kirim pesan, dan endpoint umum.
**Checklist Verifikasi:**
- [ ] Rate limit login/kirim pesan sesuai ambang Security Design
- [ ] Aksi sensitif tercatat lengkap di audit_logs

**T17.2 — CSP/CSRF & Anti-Spam**
| **Deskripsi** | **Konfigurasi header CSP/CSRF/security headers dan heuristik anti-spam (duplikat, mass-mention, link mencurigakan).** |
| --- | --- |
| **Acceptance Criteria** | **1. Header CSP diterapkan sesuai direktif Security Design.  2. Pesan duplikat berulang oleh user sama terdeteksi & di-throttle.** |
| **Dependency** | **T17.1** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **8 jam** |
| **Definition of Done** | **Seluruh kontrol pada Security Design (Fase 6) aktif dan teruji.** |
**Subtask:**
- [x] Konfigurasi header CSP/CSRF/security headers pada middleware.
- [ ] Implementasi deteksi duplikat pesan.
- [ ] Implementasi deteksi mass-mention & link mencurigakan.
**Checklist Verifikasi:**
- [x] Header keamanan terverifikasi via response inspector
- [ ] Pesan duplikat/mass-mention di-throttle sesuai desain

# EPIC 7 — Admin & Launch Polish (v0.7)
## Feature S18 — Admin Panel
**T18.1 — Admin User Management, Audit Log Viewer & Bulk Operation**
| **Deskripsi** | **Endpoint manajemen user platform, API audit log dengan filter, serta operasi bulk dengan permission check per-item.** |
| --- | --- |
| **Acceptance Criteria** | **1. Suspend user memaksa logout seluruh sesi aktif user tersebut.  2. Operasi bulk (delete/kick) tetap menjalankan permission check untuk setiap item, bukan hanya di awal permintaan.** |
| **Dependency** | **T17.1, T4.2** |
| **Priority** | **Must** |
| **Estimasi Kesulitan** | **Hard** |
| **Estimasi Waktu** | **12 jam** |
| **Definition of Done** | **Admin Panel berfungsi penuh sesuai FR-ADM-01/02.** |
**Subtask:**
- [ ] Endpoint list/suspend user platform.
- [ ] Endpoint GET /admin/audit-logs dengan dukungan query parameter filter (aktor, aksi, waktu, dll).
- [ ] Endpoint bulk delete message & bulk kick member dengan permission check per-item.
**Checklist Verifikasi:**
- [ ] Suspend user mencabut seluruh sesi aktifnya
- [ ] Bulk operation menolak item yang di luar izin aktor, bukan seluruh request

## Feature S19 — API Docs, Testing & Scalability Validation
**T19.1 — API Documentation & Health Check**
| **Deskripsi** | **Konfigurasi Swagger/OpenAPI untuk dokumentasi interaktif dan endpoint /health untuk monitoring.** |
| --- | --- |
| **Acceptance Criteria** | **1. Dokumentasi Swagger UI dapat diakses.  2. Endpoint /health merespons 200 OK dengan status koneksi DB dan Redis.** |
| **Dependency** | **Seluruh fitur inti (T1-T18)** |
| **Priority** | **Should** |
| **Estimasi Kesulitan** | **Easy** |
| **Estimasi Waktu** | **6 jam** |
| **Definition of Done** | **API terdokumentasi interaktif dan termonitor status layanannya.** |
**Subtask:**
- [x] Integrasi library Swagger/OpenAPI (mis. swagger-ui-express/NestJS Swagger).
- [x] Tulis spesifikasi OpenAPI untuk endpoint kunci.
- [x] Implementasi endpoint /health (cek DB & Redis connection).
**Checklist Verifikasi:**
- [x] Swagger UI tampil tanpa error saat diakses
- [x] Endpoint /health menampilkan HTTP 200 OK beserta metrik status

**T19.2 — Load Testing & Dokumen Evaluasi Scalability**
| **Deskripsi** | **Pengujian beban (load test) pada API kritis (k6/Artillery) dan penyusunan dokumen evaluasi strategi scaling.** |
| --- | --- |
| **Acceptance Criteria** | **1. Hasil load testing (throughput, latency) terdokumentasi.  2. Dokumen evaluasi scaling merujuk hasil test dan strategi pada Architecture Document.** |
| **Dependency** | **T19.1** |
| **Priority** | **Should** |
| **Estimasi Kesulitan** | **Medium** |
| **Estimasi Waktu** | **8 jam** |
| **Definition of Done** | **Laporan load test & evaluasi scalability terdokumentasi, menandai selesainya seluruh sprint backend.** |
**Subtask:**
- [ ] Buat script load test (k6/Artillery) untuk flow auth & kirim pesan.
- [ ] Eksekusi load test dan catat metrik performa.
- [ ] Tulis dokumen evaluasi scalability berdasarkan data empiris.
**Checklist Verifikasi:**
- [ ] Script load test tereksekusi sukses
- [ ] Laporan performa & evaluasi scalability selesai disusun

# Keputusan yang Telah Diambil
Struktur Epic (7) → Feature (19) → Task (26) → Subtask → Checklist ditetapkan sebagai level rincian final proyek, konsisten 1:1 dengan Development Roadmap dan Sprint Breakdown.
Setiap Task mencantumkan estimasi waktu dalam jam (bukan hari) agar selaras dengan asumsi kapasitas part-time 10-12 jam/minggu pada Development Roadmap.
Task keamanan (T17.1-T17.2) dan Admin (T18.1) secara eksplisit menegakkan permission check per-item untuk operasi bulk, konsisten dengan keputusan Security Design & API Specification.
Poll (T16.1) dirancang mendukung allowMultipleChoice sejak Task pertamanya, konsisten dengan keputusan Database Design & API Specification.
# Keputusan yang Masih Perlu Dikonfirmasi
Apakah estimasi jam per Task (total ± 216 jam di luar buffer) perlu direvisi ulang setelah beberapa Task pertama (T1.1-T2.2) selesai, sebagai kalibrasi awal implementasi nyata.
Apakah Task T7.2 (Redis Pub/Sub cross-instance) memerlukan subtask tambahan untuk automated test dasar, mengingat risikonya yang telah dicatat berulang sejak ADR-002.
# Risiko Desain
T4.2 (Role & Permission Engine) dan T17.1-T17.2 (Security Hardening) memiliki Estimasi Kesulitan "Hard" dan berpotensi meluber dari alokasi sprint 2 minggu bila edge case otorisasi lebih kompleks dari perkiraan.
Beberapa Task memiliki Dependency ganda (mis. T9.1 bergantung pada T8.1 dan T6.1) — keterlambatan pada satu dependency berisiko menunda beberapa Task sekaligus di sprint berikutnya.
# Technical Debt yang Sengaja Diterima
Checklist Verifikasi pada dokumen ini berbasis pengujian manual, bukan automated test — konsisten dengan keputusan Development Roadmap dan Sprint Breakdown bahwa automated E2E test belum menjadi bagian Definition of Done proyek ini.
Task T19.1 sekarang secara spesifik mencakup implementasi dokumentasi API interaktif (Swagger/OpenAPI) menggantikan prioritas PWA sebelumnya untuk fokus di Backend.
# Pertanyaan untuk Stakeholder
Apakah seluruh 26 Task pada Task Checklist ini sudah dianggap lengkap sebagai acuan implementasi, mengingat ini adalah dokumen terakhir dari 11 dokumen (Fase 0-10) yang direncanakan sejak Vision Document?
