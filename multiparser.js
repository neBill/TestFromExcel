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


// async function getUniqueValuesFromColumn10WithPM(filePath) {
//   try {
//     // Читаем Excel‑файл
//     const workbook = XLSX.readFile(filePath);
    
//     // Берём первый лист (можно заменить на имя нужного листа)
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
//     // Преобразуем лист в массив строк (каждая строка — массив ячеек)
//     const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     const uniqueValues = new Set();

   

//     // Перебираем строки
//     for (const row of data) {

       
//         // Проверяем конкретную ячейку в строке (указанный столбец)
//         const cellValue = row[1]; // значение в проверяемой ячейке

//         // Условие: ячейка существует, не пустая и содержит «ПМ»
//         if (
//             cellValue != null &&
//             typeof cellValue === 'string' &&
//             cellValue === 'ПМ'
//         ) {
//             // Берём значение из 10‑го столбца (индекс 9)
//             const valueFromColumn10 = row[10]; // 10-й столбец → индекс 9
            

//             // Добавляем в Set, если значение есть и не пустое
//             if (valueFromColumn10 != null && valueFromColumn10 !== '') {
//                 uniqueValues.add(valueFromColumn10);
//             }
//         }

      

//     }



//     const newSet = Array.from(uniqueValues);

//     uniqueValues.clear()

//     for (const row of data) {

       
//         // Проверяем конкретную ячейку в строке (указанный столбец)
//         const cellValue = row[10]; // значение в проверяемой ячейке

//         // Условие: ячейка существует, не пустая и содержит «ПМ»
//         if (
//             cellValue != null &&
//             typeof cellValue === 'string' &&
//             cellValue === newSet[0]
//         ) {
//             // Берём значение из 10‑го столбца (индекс 9)
//             const valueFromColumn10 = row[3]; // 10-й столбец → индекс 9

//             // Добавляем в Set, если значение есть и не пустое
//             if (valueFromColumn10 != null && valueFromColumn10 !== '') {
//                 uniqueValues.add(valueFromColumn10);
//             }
//         }

      

//     }




//     // Конвертируем Set в массив
//     return Array.from( data + "  --  " + uniqueValues);


//     } catch (error) {
//         console.error('Ошибка при обработке Excel‑файла:', error);
//         throw error;
//     }
// }

// Использование
// export function parsXlsxMax(filePath){
//     getUniqueValuesFromColumn10WithPM(filePath)
//     .then(result => {
//         console.log('Уникальные значения из 10‑го столбца (строки с «ПМ»):');
//         // console.log(result);

//         console.log(result);
//     })
//     .catch(error => {
//         console.error('Произошла ошибка:', error);
//     });
// }


// export function parsXlsxMax (filePath) {

//   // Использование: ищем «ПМ» в столбце 2 (индекс 1), берём значения из столбца 10
//   // getUniqueValuesFromColumn10WithPMInCell(filePath, 1)
//   // .then(result => {
//   //   //console.log('Уникальные значения из 10‑го столбца (строки, где в столбце 2 есть «ПМ»):');
//   //   console.log(result);
//  return getUniqueValuesFromColumn10WithPMInCell(filePath, 1)

//   // })
//   // .catch(error => {
//   //   console.error('Произошла ошибка:', error);
//   // });

// }

export function getDataFromExcel(filePath) {
 // async function getUniqueValuesFromColumn10WithPMInCell(filePath, cellColumnIndex) {

  let result = [];
  const objectsContainer = {};  

  try {
    // Читаем Excel‑файл
    const workbook = XLSX.readFile(filePath);    
    // Берём первый лист (можно заменить на имя нужного листа)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];    
    // Преобразуем лист в массив строк (каждая строка — массив ячеек)
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    //const dat = getQ(data, cellColumnIndex )
    //const uniqueValues = new Set(); 
   

    for (let i = 1; i <= data.length; i++) {

      let row = data[i];

      if(row === undefined) continue;     

      // Проверяем, что в 1‑м столбце содержится «ПМ»
      if (row[1] && row[1].toString() === "ПМ") {
        // Получаем значение из 3‑го столбца 
        let question = row[3] ? row[3].toString() : "";      


        const questionsData = [];
        let answers = [];

        for (let i = 5; i <= 8; i++) {
          const answer = row[i]?.toString().trim();

          if (answer) {
            let id = i - 5;
            let success = id === 0 ? true : false; 
            let item = {id: id, success : success, text : answer}
            answers.push(item);
          }
        }

        questionsData.push(     
        {  
          question: question,
          answers: answers,
        
        });
       

        // Получаем имя массива — значение из 10‑го столбца 
        let arrayName = row[10] ? row[10].toString() : "undefined";

       

        //const propName = 'username';
          // const user = {


          // };

          // user[arrayName] = {
          //       //  testTitle : arrayName,
          //       //  testBody : questionsData
          // }

          // let obj = {

          //   [arrayName]: arrayName

          // };

                    // Создаём контейнер
          //const objectsContainer = {};

        if (!objectsContainer[arrayName]) {

          objectsContainer[arrayName] = [];
        }

        objectsContainer[arrayName].push(questionsData);

          // Добавляем объект с именем из переменной
          //objectsContainer[arrayName] = arrayName;

          //console.log(objectsContainer);
          // { user123: { name: 'Анна', age: 25 } }

         // console.log(objectsContainer.user123); // { name: 'Анна', age: 25 }


          // const obj = {

          //   [keyName]: value,
          //   staticProp: 'I am static'

          // };


          
        //Если массива с таким именем ещё нет, создаём его
        // if (!result.hasOwnProperty(arrayName)) {
        //   result[arrayName] = [];
        // }
        // // Добавляем значение из столбца 3 в соответствующий массив
        // result[arrayName].push(answers);


          

         //   test.push(objectsContainer) 

        // console.log(test.length)

        // console.log(row)

          // [arrayName] {
          //     testTitle : arrayName,
          //     testBody : questionsData
          // }
      }
    
      
  }
   

    //return objectsContainer



    
    // Сохранение в .js файл
    const jsContent = `const test = ${JSON.stringify(objectsContainer, null, 2)}`;

    const jsFileName = 'fulltest.js';
    const jsFilePath = path.join(processed, jsFileName);

    fs.writeFileSync(jsFilePath, jsContent, 'utf-8');

    return jsFileName; 

  } catch (error) {

      console.error('Ошибка обработки файла:', error);        

  } finally {
      // Удаление исходного файла после обработки
      fs.unlink(filePath, (err) => {
          if (err) console.error('Не удалось удалить временный файл:', err);
      });
  }



}
      
    
  
///////////////////////////////////////////////////////////////////
   

      // for (const row of data) {
      //   // Проверяем конкретную ячейку в строке (указанный столбец)
      //   const cellValue = row[10]; // значение в проверяемой ячейке

      //   uniqueValues.add(cellValue);

      //   // Условие: ячейка существует, не пустая и содержит «ПМ»
      //   if (
      //     cellValue != null &&
      //     typeof cellValue === 'string' &&
      //     cellValue === dd[5]
      //   ) {
      //     // Берём значение из 10‑го столбца (индекс 9)
      //     const valueFromColumn10 = row[3]; // 10-й столбец → индекс 9

      //     // Добавляем в Set, если значение есть и не пустое
      //     if (valueFromColumn10 != null && valueFromColumn10 !== '') {
      //       uniqueValues.add(valueFromColumn10);
      //     }
      //   }
      // }




        // const uniqueValues = new Set();
        // // Перебираем строки
        // for (const row of data) {
        //   // Проверяем конкретную ячейку в строке (указанный столбец)
        //   const cellValue = row[cellColumnIndex]; // значение в проверяемой ячейке

        //   // Условие: ячейка существует, не пустая и содержит «ПМ»
        //   if (
        //     cellValue != null &&
        //     typeof cellValue === 'string' &&
        //     cellValue === 'ПМ'
        //   ) {
        //     // Берём значение из 10‑го столбца (индекс 9)
        //     const valueFromColumn10 = row[10]; // 10-й столбец → индекс 9

        //     // Добавляем в Set, если значение есть и не пустое
        //     if (valueFromColumn10 != null && valueFromColumn10 !== '') {
        //       uniqueValues.add(valueFromColumn10);
        //     }
        //   }
        // }


        // const pm = Array.from(uniqueValues);
        //const pm = Array.from(dat);

        //return pm[9]
        // return test

      // Конвертируем Set в массив
      //return Array.from(uniqueValues);


  // } catch (error) {
  //   console.error('Ошибка при обработке Excel‑файла:', error);
  //   throw error;
  // }
//}


// function getQ(data, cellColumnIndex ){

//   const uniqueValues = new Set();
//     // Перебираем строки
//     for (const row of data) {
//       // Проверяем конкретную ячейку в строке (указанный столбец)
//       const cellValue = row[cellColumnIndex]; // значение в проверяемой ячейке

//       // Условие: ячейка существует, не пустая и содержит «ПМ»
//       if (
//         cellValue != null &&
//         typeof cellValue === 'string' &&
//         cellValue === 'ПМ'
//       ) {
//         // Берём значение из 10‑го столбца (индекс 9)
//         const valueFromColumn10 = row[10]; // 10-й столбец → индекс 9

//         // Добавляем в Set, если значение есть и не пустое
//         if (valueFromColumn10 != null && valueFromColumn10 !== '') {
//           uniqueValues.add(valueFromColumn10);
//         }
//       }
//     }

//     return uniqueValues

// }

// // Использование: ищем «ПМ» в столбце 2 (индекс 1), берём значения из столбца 10
// getUniqueValuesFromColumn10WithPMInCell(filePath, 1)
//   .then(result => {
//     console.log('Уникальные значения из 10‑го столбца (строки, где в столбце 2 есть «ПМ»):');
//     console.log(result[5]);
//   })
//   .catch(error => {
//     console.error('Произошла ошибка:', error);
//   });

