import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// async function getUniqueValuesFromExcel(filePath, columnIndex) {
//   try {
//     // Читаем файл
//     const workbook = XLSX.readFile(filePath);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     // Извлекаем и фильтруем значения
//     const columnValues = data
//       .map(row => row[columnIndex])
//       .filter(value => value != null && value !== '');

//     // Получаем уникальные значения
//     const uniqueValues = [...new Set(columnValues)];

//     return uniqueValues;
//   } catch (error) {
//     console.error('Ошибка при чтении файла:', error);
//     throw error;
//   }
// }


// export function parsXlsxMax(filePath){
// // Использование
// getUniqueValuesFromExcel(filePath, 1)
//   .then(unique => console.log('Уникальные значения:', unique))
//   .catch(err => console.error(err));
// }


async function getUniqueValuesFromColumn10WithPM(filePath) {
  try {
    // Читаем Excel‑файл
    const workbook = XLSX.readFile(filePath);
    
    // Берём первый лист (можно заменить на имя нужного листа)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Преобразуем лист в массив строк (каждая строка — массив ячеек)
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const uniqueValues = new Set();

    // Перебираем строки
    for (const row of data) {
      // Проверяем, есть ли в строке значение «ПМ» (в любой ячейке)
      const hasPM = row.some(cell =>
        cell != null &&
        typeof cell === 'string' &&
        cell === 'ПМ'
      );

      if (hasPM) {
        // Берём значение из 10‑го столбца (индекс 9)
        const value = row[10]; // 10-й столбец → индекс 9

        // Добавляем в Set, если значение есть и не пустое
        if (value != null && value !== '') {
          uniqueValues.add(value);
        }
      }
    }

    // Конвертируем Set в массив
    return Array.from(uniqueValues);
  } catch (error) {
    console.error('Ошибка при обработке Excel‑файла:', error);
    throw error;
  }
}

// Использование
export function parsXlsxMax(filePath){
    getUniqueValuesFromColumn10WithPM(filePath)
    .then(result => {
        console.log('Уникальные значения из 10‑го столбца (строки с «ПМ»):');
        console.log(result);
    })
    .catch(error => {
        console.error('Произошла ошибка:', error);
    });
}
