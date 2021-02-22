const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
//console.log("a=============================================================");

var promiseRNS = new Promise((resolve, reject) => {
  	//fs.readFile('ramowka.html', function(err, data){
	//const $ = cheerio.load(data);
	got('https://nowyswiat.online/ramowka/').then(async response => {
		const $ = cheerio.load(response.body);
		let arrRADIO = [];		
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
		resolve(arrRADIO)
	});
})

promiseRNS.then((value) => {
  console.log(JSON.stringify(value));
});