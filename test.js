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

function Code(){};

var arrCode = [];


function splitting (fileName) {
	// перемещаем pdf в tmp папку для обработки
	fs.renameSync(source_dir + fileName, tmp_dir + fileName);
}

function do_export_pdf (fileName) {


	// переводим pdf в txt
	extract(tmp_dir + fileName, function(err, page){
		if (err) {return console.log(err);}

		// переводим объект с текстом в простой string
		page = page.toString();
		parsing(page, function(z,f,p){

			
		})
		







			var name = '';
		// содаём имя для pdf
			// код(номер) анализа
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


			if (fio !== null){
				name = fio[1] + ";" + code + ";" + cnt;
			}else{
				name = number;
			}

			fs.copySync(tmp_dir + fileName, success_dir + name + ".pdf");
			// вырезаем страничку с анализом
			// var pdf = spindrift(tmp_dir + fileName).page(count);
			// сохраняем анализ с новым именем
			// pdf.pdfStream().pipe(fs.createWriteStream(success_dir + name + ".pdf"))
		}
		// console.log('nop');
		console.log(flagCodeRepeat);

		for (var i=0; i<arrCode.length; i++){
			for (var car in arrCode[i]){
				console.log(car + " : " + arrCode[i][car]);
			}
		}
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



function parsing (page, cb) {

	// регулярка для поиска кода заявки
	var re_zajavka = /Заявка:\s*(.*\/.*\/\d*)/i;
	// регулярка для поиска имени
	var re_fio = /Пациент:\s*(.*)/i;
	// регулярка для поиска номера пробы
	var re_proba = /№ пробы:\s*(\d*)/i;

	// поиск заявки
	var zajavka = re_zajavka.exec(page);
	zajavka = zajavka[1].replace(/\//g,"_");

	// фио пациента
	var fio = re_fio.exec(page);
	fio = fio[1];

	// номер пробы
	var proba = re_proba.exec(page);
	proba = proba[1];

	cb(z,f,p);
}

setInterval(parse, timer);