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

function do_export_pdf (fileName) {
	// пермещаем pdf в tmp папку для обработки
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
		var re = /Заявка: (БрРМ\/.*\/\d*)/ig;

		while ((result = re.exec(pages)) !== null){
			count++;
			// содаём имя для pdf
			var name = result[1].replace(/\//g,"_");
			// вырезаем страничку с анализом
			var pdf = spindrift(tmp_dir + fileName).page(count);
			// сохраняем анализ с новым именем
			pdf.pdfStream().pipe(fs.createWriteStream(success_dir + name + ".pdf"))
		}
		console.log('nop');
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

setInterval(parse, timer);