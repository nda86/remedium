var config = require('./config.js');

var path = require('path');
var extract = require('pdf-text-extract');
var fs = require('fs-extra');

// плагин для сплита pdf
var spindrift = require('spindrift');

// для поиска файлов по расширению
var glob = require('glob');

var source_dir = config.source_dir;
var success_dir = config.success_dir;
var tmp_dir = config.tmp_dir;
var timer = config.timer;

function Code(){};

var arrCode = [];

function do_export_pdf (fileName) {
	// перемещаем pdf в tmp папку для обработки
	fs.renameSync(source_dir + fileName, tmp_dir + fileName);
	//переводим pdf в txt
	extract(tmp_dir + fileName, function(err, pages){
		if (err) {
			return console.log(err);
		}
		// переводим объект с текстом в простой string
		pages = pages.toString();
		// инит счётчика страниц
		var count = 0;
		// регулярка для поиска номера анализа, используеся для имени файла
		var re = /Заявка:\s*(.*\/.*\/\d*)/ig;

		// регулярка для поиска имени
		var re_name = /Пациент:\s*(.*)/i;


		while ((result = re.exec(pages)) !== null){
			count++;

			var name = '';
		// содаём имя для pdf
			// код(номер) анализа
			var code = result[1].replace(/\//g,"_");
			//  количественный номер анализа
			var cnt = 1;

			// флаг повторного кода
			var flagCodeRepeat = false;
			for (var i=0; i<arrCode.length; i++){
				var obj = arrCode[i];
				if (obj[code] == null){
					continue;
				}else{
					obj[code]++;
					cnt = obj[code];
					flagCodeRepeat = true;
				}
			}
			if (!flagCodeRepeat){
				var newCode = new Code;
				newCode[code] = 1;
				arrCode.push(newCode);
			}


			// фио пациента
			var fio = re_name.exec(pages);
			if (fio !== null){
				name = fio[1] + ";" + code + ";" + cnt;
			}else{
				name = code + ";" + cnt;
			}

			// вырезаем страничку с анализом
			var pdf = spindrift(tmp_dir + fileName).page(count);
			// сохраняем анализ с новым именем
			pdf.pdfStream().pipe(fs.createWriteStream(success_dir + name + ".pdf"));
		};
		//  обнуляем массив заявок(кодов)
		arrCode = [];
	});
};


// функция парсинга директории
function parse(){
	glob(source_dir + "*.pdf", function(err, files){
		for (var file in files){
			var fileName = path.basename(files[file]);
			do_export_pdf(fileName);
		};
	});
};

setInterval(parse, timer);