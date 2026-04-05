import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Эмуляция __dirname для ES Modules
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);

// Создание папок, если их нет
const uploads = path.join(__dirname, 'uploads');
const processed = path.join(__dirname, 'processed');

if (!fs.existsSync(uploads)) {
  fs.mkdirSync(uploads, { recursive: true });
}
if (!fs.existsSync(processed)) {
  fs.mkdirSync(processed, { recursive: true });
}


export function parsXlsx(filePath){


    try {
    
    

        // Чтение файла
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Преобразование в массив массивов (строк)
        const rows = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: ''
        });

   

        const questionsData = [];

        rows.forEach((row, rowIndex) => {
        // Пропускаем пустые строки
        if (row.every(cell => !cell.toString().trim())) {
            return;
        }

        // Берём первую ячейку как вопрос
        const question = row[0]?.toString().trim() || '';

        // Следующие четыре ячейки — ответы (если есть)
        const answers = [];
        for (let i = 1; i <= 4; i++) {
            const answer = row[i]?.toString().trim();
            if (answer) {
                answers.push(answer);
            }
        }

        questionsData.push({
            question: question,
            answers: answers,
            rowNumber: rowIndex + 1 // Номер строки для отладки
            });
        });



        // Сохранение в .js файл
        const jsContent = `// Вопросы и ответы из Excel-файла\nconst questions = ${JSON.stringify(questionsData, null, 2)};\nmodule.exports = questions;\n`;

        const jsFileName = `questions_${Date.now()}.js`;
        const jsFilePath = path.join(processed, jsFileName);

        fs.writeFileSync(jsFilePath, jsContent, 'utf-8');


        return jsFileName; 




    } catch (error) {

        console.error('Ошибка обработки файла:', error);
    // res.status(500).send('Ошибка при обработке файла.');

    } finally {
        // Удаление исходного файла после обработки
        fs.unlink(filePath, (err) => {
        if (err) console.error('Не удалось удалить временный файл:', err);
        });
    }


   
}