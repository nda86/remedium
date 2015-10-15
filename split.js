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

// console.log(source_dir);
// console.log(success_dir);
// console.log(tmp_dir);
// console.log(timer);

function Code(){}

var arrCode = [];


function spliting (fileName) {
	fs.renameSync(source_dir + fileName, tmp_dir + fileName);
}


function do_export_pdf (fileName) {
	// пермещаем pdf в tmp папку для обработки
	// переводим pdf в txt
	extract(tmp_dir + fileName, function(err, pages){
		if (err) {
			return console.log(err);
		}
		// переводим объект с текстом в простой string
		pages = pages.toString();

		// регулярка для поиска номера анализа, используеся для имени файла
		var re = /Заявка: (БрРМ\/.*\/\d*)/ig;

		// регулярка для поиска имени
		var re_name = /Пациент:\s*(.*)/i;

			var name = '';
		// содаём имя для pdf
			// код(номер) анализа
			var number = result[1].replace(/\//g,"_");

			// флаг повторного кода
			var flagCodeRepeat = false;
			for (var i=0; i<arrCode.length; i++){
				var obj = arrCode[i];
				if (obj[number] == null){
					continue;
				}else{
					obj[number]++;
					number = number + "_" + obj[number];
					flagCodeRepeat = true;
				}
			}
			if (!flagCodeRepeat){
				var newCode = new Code;
				newCode[number] = 1;
				arrCode.push(newCode);
			}


			// фио пациента
			var fio = re_name.exec(pages);
			if (fio !== null){
				name = number + " - " + fio[1];
			}else{
				name = number;
			}

			fs.copySync(tmp_dir + fileName, success_dir + name + ".pdf");
			// вырезаем страничку с анализом
			// сохраняем анализ с новым именем
			// pdf.pdfStream().pipe(fs.createWriteStream(success_dir + name + ".pdf"))
	});
};




function parse(){
	glob(source_dir + "*.pdf", function(err, files){
		for (var file in files){
			var fileName = path.basename(files[file]);
			do_export_pdf(fileName);
		};
	});
};

// setInterval(parse, timer);

var fileName = __dirname + "/test/1.js";
var pdf = spindrift(fileName).page(1);
console.log(pdf.toString());