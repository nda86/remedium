var config = require('./config.js');

var path = require('path');
var extract = require('pdf-text-extract');
var fs = require('fs-extra');

var glob = require('glob');

// var filePath =  path.join(__dirname, 'test/1.pdf');



var source_dir = config.source_dir;
var success_dir = config.success_dir;
var tmp_dir = config.tmp_dir;
var timer = config.timer;

function do_export_pdf (fileName) {

//переводим pdf в txt
fs.renameSync(source_dir + fileName, tmp_dir + fileName);
	extract(tmp_dir + fileName, function(err, pages){
		if (err) {
			return console.log(err);
		}
		//переводим объект с текстом в простой string
		pages = pages.toString();
		// регулярка для поиска номера анализа, используеся для имени файла
		var re = /\nЗаявка: (БрРМ\/.*\/\d*)/i;
		// находим номер анализа
		var result = re.exec(pages);
		// меняем в номере анализа / на _
		var name = result[1].replace(/\//g,"_");
		// создаём новый файл со спец именем
		fs.copySync(tmp_dir + fileName, success_dir + name + '.pdf');
	});

}


function parse(){
	glob(source_dir + "*.pdf", function(err, files){
		for (var file in files){
			// console.log(file);
			var fileName = path.basename(files[file]);
			do_export_pdf(fileName);
		};
	});
};

setInterval(parse, timer);

