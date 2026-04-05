import express from 'express';
import ejs from 'ejs';
import multer from 'multer';
import XLSX from 'xlsx';
import path from 'path';
//import fs from 'fs';
import { parsXlsx } from './parser.js';

const app = express();
const PORT = 5050;

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Статические файлы
app.use(express.static('public'));

// Конфигурация Multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Главная страница с формой загрузки
app.get('/', (req, res) => {
  res.render('index');
});

// Обработка загрузки и обработки файла
app.post('/upload', upload.single('excelFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Файл не был загружен.');
  }

  const jsFileName = parsXlsx(req.file.path)



  res.render('download', { fileName: jsFileName });

  //console.log(result)

  // Использование
  //const questions = parseQuestionsFromExcel('uploads/your-file.xlsx');
  console.log("success");

  // try {
  //   // Чтение загруженного файла
  //   //const workbook = XLSX.readFile(req.file.path);
  //   //const sheetName = workbook.SheetNames[0];
  //   //const worksheet = workbook.Sheets[sheetName];

  //   const result = parsXlsx(req.file.path)

  //   //console.log(workbook)
  //   //console.log(sheetName)
  //   console.log(result)


  //   // Пример обработки: добавляем новый столбец с удвоенными значениями первого столбца
  //   //const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //   // if (jsonData.length > 0) {
  //   //   jsonData[0].push('Обработанные данные'); // Заголовок нового столбца

  //   //   for (let i = 1; i < jsonData.length; i++) {
  //   //     const value = jsonData[i][0];
  //   //     jsonData[i].push(value ? value * 2 : '');
  //   //   }
  //   // }

  //   // Создание новой книги с обработанными данными
  //   // const newWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
  //   // const newWorkbook = XLSX.utils.book_new();
  //   // XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Обработанные данные');

  //   // Сохранение обработанного файла
  //   // const processedFileName = `processed_${req.file.filename}.xlsx`;
  //   // const processedFilePath = path.join(process.cwd(), 'processed', processedFileName);
  //   // XLSX.writeFile(newWorkbook, processedFilePath);

  //  // res.render('download', { fileName: processedFileName });

  // } catch (error) {

  //   console.error('Ошибка обработки файла:', error);
  //   res.status(500).send('Ошибка при обработке файла.');

  // } finally {
  //     // Удаление исходного файла после обработки
  //   fs.unlink(req.file.path, (err) => {
  //     if (err) console.error('Не удалось удалить временный файл:', err);
  //   });
  // }
});

// Скачивание обработанного файла
app.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(process.cwd(), 'processed', fileName);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Ошибка скачивания файла:', err);
      res.status(404).send('Файл не найден.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
