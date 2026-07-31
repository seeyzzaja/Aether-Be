**SPRINT BREAKDOWN**
**Discord-Like Web Application — Project-Based Learning**
*Fase 9 — Dokumen tunggal fase ini*
# 1. Pendahuluan
Dokumen ini memecah 7 rilis pada Development Roadmap (Fase 8) menjadi 19 sprint berdurasi 2 minggu, sebagai unit perencanaan kerja mingguan yang konkret. Setiap sprint memiliki Sprint Goal tunggal yang jelas, kumpulan backlog item tingkat tinggi, dan satu deliverable utama yang dapat diverifikasi. Rincian task/subtask/checklist per backlog item dibahas pada Task Checklist (Fase 10).
Total 19 sprint × 2 minggu = 38 minggu, sedikit lebih panjang dari estimasi 36 minggu pada Development Roadmap karena pembulatan ke kelipatan 2 minggu per rilis — selisih ini sekaligus berfungsi sebagai bagian dari buffer 15% yang telah disepakati.

# 2. v0.1 — Foundation (Sprint 1-2)
| **Sprint** | **Sprint Goal** | **Key Backlog Items** | **Deliverable** |
| --- | --- | --- | --- |
| **S1** | **Setup infrastruktur & repo skeleton** | **Init monorepo modular; docker-compose (PostgreSQL, Redis); konfigurasi Traefik dasar; setup Biome, Husky, Commitlint; pipeline GitHub Actions (lint+build).** | **docker-compose up berjalan; CI lint+build hijau.** |
| **S2** | **Authentication & Authorization foundation** | **Prisma schema users & sessions; endpoint register/login; access token JWT + refresh token; endpoint list/revoke session; Zod validation schema.** | **Alur auth end-to-end teruji manual (Postman/Insomnia).** |
# 3. v0.2 — Workspace & Permission (Sprint 3-4)
| **Sprint** | **Sprint Goal** | **Key Backlog Items** | **Deliverable** |
| --- | --- | --- | --- |
| **S3** | **Server & membership** | **Prisma schema servers & server_members; CRUD server; join/leave server; pembuatan role default @everyone otomatis saat server dibuat.** | **Server CRUD + membership berfungsi.** |
| **S4** | **Category/Channel & Role/Permission** | **Schema categories, channels, roles, server_member_roles; CRUD category/channel; middleware evaluasi permission bitmask; channel_permission_overrides.** | **Struktur workspace lengkap; permission check aktif pada endpoint channel.** |
# 4. v0.3 — Realtime Messaging Core (Sprint 5-8)
| **Sprint** | **Sprint Goal** | **Key Backlog Items** | **Deliverable** |
| --- | --- | --- | --- |
| **S5** | **WebSocket foundation** | **WebSocket gateway & connection registry; message envelope/event schema; subscribe/unsubscribe per channel.** | **Klien dapat connect & menerima event dummy end-to-end.** |
| **S6** | **Core messaging CRUD + broadcast** | **Schema messages; endpoint kirim/edit/hapus (soft delete); broadcast event via WebSocket; parsing reply & mention.** | **Kirim/edit/hapus pesan realtime end-to-end.** |
| **S7** | **Reactions/Pin + Redis Pub/Sub scaling** | **Schema & endpoint reactions; endpoint pin; implementasi Redis Pub/Sub lintas instance; uji manual dengan 2 replika aplikasi.** | **Reaksi & pin berfungsi; broadcast lintas instance terverifikasi.** |
| **S8** | **Presence & typing/read receipt** | **State presence di Redis; event typing indicator; tracking read receipt; status online/offline/idle/DND/invisible.** | **Presence & typing indicator berfungsi realtime.** |
# 5. v0.4 — Engagement Features (Sprint 9-11)
| **Sprint** | **Sprint Goal** | **Key Backlog Items** | **Deliverable** |
| --- | --- | --- | --- |
| **S9** | **Notification system** | **Schema notifications; event notifikasi realtime; setup BullMQ worker; job email + integrasi SMTP/API.** | **Notifikasi realtime & email terkirim sesuai status online/offline penerima.** |
| **S10** | **Upload & media** | **Schema message_attachments; endpoint signed URL Cloudinary; endpoint confirm upload; thumbnail preview di frontend.** | **Upload file hingga 1GB berfungsi end-to-end via direct upload.** |
| **S11** | **Search** | **Migration tsvector + trigger + GIN index; endpoint search multi-entity; komponen search overlay frontend.** | **Pencarian lintas entitas (user/server/channel/message/file) berfungsi.** |
# 6. v0.5 — Voice & Video (Sprint 12-14)
| **Sprint** | **Sprint Goal** | **Key Backlog Items** | **Deliverable** |
| --- | --- | --- | --- |
| **S12** | **LiveKit server setup & token issuance** | **Service LiveKit self-hosted pada docker-compose; integrasi Server SDK untuk create room/token; endpoint POST /channels/{id}/voice/token.** | **Token LiveKit berhasil diterbitkan & diverifikasi valid.** |
| **S13** | **Voice channel client integration** | **Integrasi LiveKit Client SDK (React) di frontend; join/leave/mute/unmute; sinkronisasi status "sedang di voice" dengan Presence.** | **Voice channel berfungsi end-to-end.** |
| **S14** | **Video channel & polish** | **Kontrol kamera on/off; UI grid peserta dengan voice activity indicator; leave call; penanganan error koneksi LiveKit gagal.** | **Video channel berfungsi end-to-end.** |
# 7. v0.6 — Advanced Messaging & Security (Sprint 15-17)
| **Sprint** | **Sprint Goal** | **Key Backlog Items** | **Deliverable** |
| --- | --- | --- | --- |
| **S15** | **Forum & Announcement + Thread lanjutan** | **Aturan akses khusus tipe channel forum/announcement; logic thread_root_id; komponen thread panel frontend.** | **Forum, Announcement, dan Thread berfungsi.** |
| **S16** | **Poll (single & multiple choice), Forward, Embed** | **Schema polls/poll_options/poll_votes mendukung allowMultipleChoice; endpoint forward dengan validasi izin ganda; fetch metadata embed link.** | **Poll (single & multiple choice), Forward, dan Embed berfungsi.** |
| **S17** | **Security hardening penuh** | **Middleware rate limiter per kategori endpoint; middleware audit log; header CSP/CSRF/security headers; heuristik anti-spam.** | **Seluruh kontrol pada Security Design (Fase 6) aktif dan diuji.** |
# 8. v0.7 — Admin & Launch Polish (Sprint 18-19)
| **Sprint** | **Sprint Goal** | **Key Backlog Items** | **Deliverable** |
| --- | --- | --- | --- |
| **S18** | **Admin Panel** | **Endpoint & UI daftar/suspend user; UI audit log viewer dengan filter; endpoint bulk delete/kick dengan permission check per-item.** | **Admin Panel berfungsi penuh, termasuk operasi bulk.** |
| **S19** | **PWA, responsive & scalability validation** | **manifest.json & service worker; polish breakpoint responsif; penyusunan dokumen evaluasi teoritis strategi scaling.** | **Aplikasi installable sebagai PWA, responsif penuh, dokumen evaluasi scaling selesai.** |

# 9. Definition of Done (Level Sprint)
Seluruh backlog item pada Sprint Goal terkait selesai dan lolos pengujian manual sesuai Exit Criteria rilis induknya (Development Roadmap Bagian 4).
Kode telah melalui code review mandiri (checklist self-review, mengingat proyek solo) dan lolos pipeline CI (lint + build).
Perubahan skema database (jika ada) telah dijalankan melalui Prisma Migrate dan didokumentasikan singkat pada changelog sprint.
Tidak ada regresi pada fitur sprint-sprint sebelumnya yang terdeteksi melalui pengujian manual singkat (smoke test).

# Keputusan yang Telah Diambil
Sprint berdurasi tetap 2 minggu untuk seluruh 19 sprint, dengan pembulatan durasi rilis ke kelipatan 2 minggu terdekat.
Setiap sprint memiliki tepat satu Sprint Goal utama untuk menjaga fokus, meski dapat memiliki beberapa backlog item pendukung.
Dukungan poll multiple-choice dijadwalkan pada S16 bersama Forward dan Embed, sesuai keputusan Development Roadmap.
Endpoint bulk operation (bulk delete/kick) dijadwalkan pada S18 bersama Admin Panel, dengan permission check per-item ditegakkan sejak awal implementasi.
# Keputusan yang Masih Perlu Dikonfirmasi
Apakah S7 (Redis Pub/Sub scaling) memerlukan sprint terpisah tambahan bila pengujian 2 replika aplikasi menemukan bug distributed-system yang signifikan (sejalan dengan risiko yang telah dicatat sejak ADR-002).
Apakah smoke test manual pada Definition of Done sprint sudah cukup, atau perlu mulai menyusun automated test dasar lebih awal dari yang direncanakan (saat ini automated E2E test belum menjadi bagian Definition of Done manapun).
# Risiko Desain
S12-S14 (Voice & Video) tetap menjadi rangkaian sprint dengan risiko molor tertinggi, konsisten dengan status kompleksitas XL pada Learning Roadmap dan Development Roadmap.
Backlog item pada S17 (Security Hardening) cukup padat untuk satu sprint 2 minggu; berisiko perlu meluber ke sprint tambahan bila implementasi anti-spam heuristik lebih kompleks dari perkiraan.
# Technical Debt yang Sengaja Diterima
Automated test (unit/integration/E2E) belum masuk sebagai bagian eksplisit dari backlog sprint manapun; pengujian mengandalkan verifikasi manual sepanjang 19 sprint ini, konsisten dengan keputusan Development Roadmap.
Dokumentasi teknis per sprint (changelog, update README) diasumsikan berjalan ringan/paralel tanpa alokasi backlog item eksplisit.
# Pertanyaan untuk Stakeholder Sebelum Melanjutkan ke Fase Berikutnya
Apakah pembagian 19 sprint dan Sprint Goal masing-masing sudah cukup rinci sebagai dasar untuk menyusun Task Checklist (Fase 10) hingga level task/subtask/checklist?
