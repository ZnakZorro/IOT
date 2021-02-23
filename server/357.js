const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
//console.log("a=============================================================");

var promiseRNS = new Promise((resolve, reject) => {
  	fs.readFile('ramowka-357.html', function(err, data){
	const $ = cheerio.load(data);
		//got('https://radio357.pl/ramowka').then(async response => {
		//const $ = cheerio.load(response.body);
		let arrRADIO = [];
		let teraz = $("div.schedule-day--today div.schedule-item");
			//console.log(teraz);
			teraz.each(async(i, l) => {
				//console.log(i,"......................................................");
				let linia = $(l);
				//console.log((linia));
				//for (let i=0; i<7; i++) console.log("=",i,linia[0].children[4].children[i].children[0]);
				//console.log(JSON.stringify(linia[0].children[4].children[0],null,"\t"));
				//console.log(linia[0].children[2].children[0].data);


				let autor = linia[0].children[4].children[2].children[0].data;
				let text  = linia[0].children[4].children[0].children[0].data;
				let godz  = linia[0].children[2].children[0].data;
				let obj = {};
					obj.text = text+", "+autor;
					obj.godz = godz;
					obj.link = "#";
				arrRADIO.push(obj);
			})
				/*
				let teraz = $("div.proradio-activeschedule h3.proradio-post__title");//<div class="proradio-row proradio-activeschedule">		
				teraz.each(async(i, l) => {
					//console.log(i,"......................................................");
					let linia = $(l);
					let link  = (linia[0].children[0].attribs.href);//.attribs.href);
					let godz  = (i,linia[0].next.next.children[0].data.trim());
					let tekst = (i,linia[0].children[0].children[0].data);
					let obj = {};
						obj.text = tekst;
						obj.godz = godz;
						obj.link = link;
					arrRADIO.push(obj);
				})
				*/
		resolve(arrRADIO)
	});
})

promiseRNS.then((value) => {
  console.log(JSON.stringify(value));
});