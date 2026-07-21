# Gym Billing

Aplikasi Laravel + Inertia + React untuk mengelola member, paket membership, dan invoice.

## Cara Menjalankan

1. Install dependency PHP dan JavaScript:
   ```bash
   composer install
   npm install
   ```

2. Siapkan environment:
   ```bash
   copy .env.example .env
   php artisan key:generate
   ```

3. Jalankan migrasi database:
   ```bash
   php artisan migrate
   ```

4. Jalankan project dalam mode development:
   ```bash
   composer run dev
   ```

   Perintah ini akan menjalankan Laravel server, queue listener, dan Vite sekaligus.

## Perintah Tambahan

- Build production: `npm run build`
- Jalankan test: `php artisan test`
