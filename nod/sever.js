const http = require('http');

let requestCount = 0; 
let totalRequests = 0; 


setInterval(() => {
    if (requestCount === 0) return; 

    totalRequests += requestCount;
    const time = new Date().toLocaleTimeString();
    
    let visualStatus = '';

    
    if (requestCount <= 50) {
        visualStatus = `🟢 [СЛАБАЯ]   Запросов: ${requestCount}/сек. `;
    } else if (requestCount > 50 && requestCount <= 500) {
        visualStatus = `🟡 [УМЕРЕННАЯ] Запросов: ${requestCount}/сек. `;
    } else {
        
        visualStatus = `🔴 [🚨 КРИТИЧЕСКАЯ АТАКА 🚨] Запросов: ${requestCount}/сек. `;
    }

    
    console.log(`[${time}] ${visualStatus} | Всего принято: ${totalRequests}`);
    
    requestCount = 0; 
}, 1000);
// создание сервера. если сервер уже есть удалите этот код с этого момента  
const server = http.createServer((req, res) => {
    requestCount++; 

  
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
});
// до этого


// server.timeout = 2000; // уберите два слеша вначале если хотите включить ожидание при 2000+ запросов в секунду

//если порт уже есть так же можете удалить
server.listen(3000, () => {
    console.log(' Сервер открыт http://localhost:3000');
    console.log('Запускай свой скрипт атаки в другом окне терминала');
});
