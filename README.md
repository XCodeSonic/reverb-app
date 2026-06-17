After Clone:
composer install
cp .env.example .env
php artisan key:generate
php artisan reverb:install
npm install
npm run dev

To Run:
php artisan serve
php artisan reverb:start --debug
npm run dev
