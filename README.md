# Laravel Reverb App

A real-time Laravel 12 + React application powered by Laravel Reverb (WebSockets).

## Tech Stack

- **Laravel 12**
- **React** (via Inertia.js)
- **Vite**
- **Laravel Reverb** (WebSocket server)
- **SQLite**

## Installation

Clone the repository and run the following commands:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan reverb:install
npm install
```

## Running the App

You need **3 terminals** running simultaneously:

```bash
# Terminal 1 — Laravel
php artisan serve

# Terminal 2 — Reverb WebSocket server
php artisan reverb:start --debug

# Terminal 3 — Vite
npm run dev
```

Then open your browser and go to **http://localhost:8000**

## Notes

- `--debug` flag on Reverb prints every WebSocket connection and message in the console — useful during development.
- Reverb runs on port **8080** by default.
- In production, Reverb should be managed by **Supervisor** instead of running manually.
