var config = require('./config.js');

var path = require('path');
var extract = require('pdf-text-extract');
var fs = require('fs-extra');

// плагин для сплита pdf
// var spindrift = require('spindrift');

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

function do_export_pdf (file) {
	//переводим pdf в txt
	extract(file, function(err, pages){
		if (err) {
			return console.log(err);
		}
		// переводим объект с текстом в простой string
		pages = pages.toString();
		// инит счётчика страниц
		var count = 0;
		// регулярка для поиска номера анализа, используеся для имени файла
		var re = /Заявка: (.*\/.*\/\d*)/ig;

		var result = re.exec(pages);

		console.log(result[1]);

		var re_name = /Пациент:\s*(.*)/ig;

		var result2 = re_name.exec(pages);

		console.log(result2[1]);

		var re_isp = /\s*Исполнитель\s*/i;

		var isp = re_isp.test(pages);
		console.log(isp);
		// while ((result = re.exec(pages)) !== null){
		// 	count++;
		// 	// содаём имя для pdf
		// 	var name = result[1].replace(/\//g,"_");
		// 	// вырезаем страничку с анализом
		// 	var pdf = spindrift(tmp_dir + fileName).page(count);
		// 	// сохраняем анализ с новым именем
		// 	pdf.pdfStream().pipe(fs.createWriteStream(success_dir + name + ".pdf"))
		// }
	});
};

var file = __dirname + "/test/1.pdf";
do_export_pdf(file);


