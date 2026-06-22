const http = require('http');

// Храним количество запросов с каждого IP
const requestsCount = {};
const LIMIT = 10; // Максимум 10 запросов в секунду
const INTERVAL = 1000; // 1 секунда

// Очищаем счетчики каждую секунду
setInterval(() => {
    for (let ip in requestsCount) {
        requestsCount[ip] = 0;
    }
}, INTERVAL);

const server = http.createServer((req, res) => {
    const ip = req.socket.remoteAddress;

    // Проверяем, не превысил ли лимит
    if (requestsCount[ip] >= LIMIT) {
        res.writeHead(429, { 'Content-Type': 'text/plain' });
        res.end('⛔ Слишком много запросов! Подожди секунду.');
        return;
    }

    // Увеличиваем счетчик
    requestsCount[ip] = (requestsCount[ip] || 0) + 1;

    // Имитация работы
    for (let i = 0; i < 1000000; i++) {
        Math.sqrt(i);
    }

    res.writeHead(200);
    res.end('✅ Запрос принят!');
});

server.listen(3000, () => {
    console.log('🛡️ Защищенный сервер запущен на http://localhost:3000');
});