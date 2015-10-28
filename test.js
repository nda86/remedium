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
		var count = 0;

		if (err) {
			return console.log(err);
		}

		var i = 0;
		while(i<pages.length){
			var cnt = 1;
			var page = pages[i];

			var name = false;
			var res_zav, res_isp, res_name, full_name;
			var re_zav = /Заявка: (.*\/.*\/(\d*))/i;
			var re_name = /Пациент:\s*(.*)/i;
			var re_isp = /\s*(Исполнитель)\s*/i;

			if ((res_zav = re_zav.exec(page)) !== null){
				var code = res_zav[1].replace(/\//g,"_");
				var code_number = res_zav[2];
			}
			if ((res_name = re_name.exec(page)) !== null){
				name = res_name[1];
				console.log(name);
			}
			if ((res_isp = re_isp.exec(page)) !== null){
				var isp = res_isp[1];
			}


			// флаг повторного
			var flagCodeRepeat = false;
			// пробегаем массив кодов анализов
			for (var y=0; y<arrCode.length; y++){
				//  берём объект код анализа
				var obj = arrCode[y];
				// если у него нет свойства с номером кода, то его нет вообще, тогда продолжаем
				if (obj[code_number] == null){
					continue;
				}else{
					// если объект с таким кодом уже есть, то увеличиваем счётчик повтора кода
					obj[code_number]++;
					// пишем это значение в переменную для имени файла
					cnt = obj[code_number];
					// сигнал о том что этот код уже есть в массиве
					flagCodeRepeat = true;
				}
			}
			// если кода нет в массиве то
			if (!flagCodeRepeat){
				// создаём объект кода
				var newCode = new Code;
				// и ставим ему в качестве счётчика повтора 1
				newCode[code_number] = 1;
				// и кидаем его в массив
				arrCode.push(newCode);
			}

			full_name = name + ";" + code + ";" + cnt;
			// console.log('cnt: ' + cnt);

			if((isp !== undefined) && (name !== undefined)){
				count++;
				var pdf = spindrift(tmp_dir + fileName).page(count);
				pdf.pdfStream().pipe(fs.createWriteStream(success_dir + full_name + ".pdf"));
				i++;
			}else if (name === false){
				i++;
				console.log("опана");
			}else{
				count++;
				var pdf = spindrift(tmp_dir + fileName).pages(count,count+1);
				pdf.pdfStream().pipe(fs.createWriteStream(success_dir + full_name + ".pdf1"));
				i++;
			}
		};

	});
		arrCode = [];
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