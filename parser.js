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
		// console.dir(pages.length);
		for (var i=0; i<pages.length; i++){
			var page = pages[i];


			var res_zav, res_isp, res_name;
			var re_zav = /Заявка: (.*\/.*\/(\d*))/i;
			var re_name = /Пациент:\s*(.*)/i;
			var re_isp = /\s*(Исполнитель)\s*/i;

			if ((res_zav = re_zav.exec(page)) !== null){
				var code = res_zav[1].replace(/\//g,"_");
				var code_number = res_zav[2];

			}
			if ((res_name = re_name.exec(page)) !== null){
				var name = res_name[1];
			}
			if ((res_isp = re_isp.exec(page)) !== null){
				var isp = res_isp[1];
			}

			// console.log('----------' + (i+1) + '---------------');
			// console.log(code);
			// console.log(name);
			// console.log(isp);
			// console.log('\n');
			console.log(code_number);

			
		}
		// переводим объект с текстом в простой string
		// pages = pages.toString();
		// инит счётчика страниц
		// var count = 0;
		// // регулярка для поиска номера анализа, используеся для имени файла

		// var result = re.exec(pages);

		// // console.log(result[1]);


		// var result2 = re_name.exec(pages);

		// // console.log(result2[1]);


		// // var isp = re_isp.test(pages);
		// // console.log(isp);
		// var i = 0;
		// // while ((res = re_isp.exec(pages)) !== null){
		// // 	i++;
		// // 	console.log(res[0]);
		// // }
	});
};

var file = __dirname + "/test/two.pdf";
do_export_pdf(file);

// var i = 0;
// while(i<pages.length){
// 	var page = pages[i];
	
// }

