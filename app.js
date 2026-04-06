import express from 'express';
import ejs from 'ejs';
import multer from 'multer';
//import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { parsXlsx } from './parser.js';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5050;

// Эмуляция __dirname для ES Modules
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);

// Создание папок, если их нет
const uploads = path.join(__dirname, 'uploads');
const processed = path.join(__dirname, 'processed');

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
    return res.status(400).send('Файл не был загружен.');  }

  const jsFileName = parsXlsx(req.file.path)

  res.render('download', { fileName: jsFileName });

  console.log("success");

  
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

app.get('/files', async (req, res) => {
  try {
    // Проверяем существование папки
    if (!fs.existsSync(processed)) {
      fs.mkdirSync(processed, { recursive: true });
      return res.render('files', { files: [], error: 'Папка processed создана, файлов пока нет.' });
    }

    // Читаем содержимое папки (асинхронно)
    const files = await fs.promises.readdir(processed);


    // Фильтруем только файлы (исключаем подпапки)
    const fileStats = await Promise.all(
      files.map(async (fileName) => {
        const filePath = path.join(processed, fileName);
        const stats = await fs.promises.stat(filePath);
        return {
          name: fileName,
          isFile: stats.isFile(),
          size: stats.size,
          modified: stats.mtime
        };
      })
    );

    const onlyFiles = fileStats.filter(item => item.isFile);

    res.render('files', {
      files: onlyFiles,
      error: null
    });
  } catch (error) {
    console.error('Ошибка чтения папки processed:', error);
    res.render('files', {
      files: [],
      error: 'Ошибка при чтении папки с файлами.'
    });
  }
});


app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
