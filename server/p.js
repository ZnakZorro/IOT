const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
console.log("a=============================================================");

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


//
var promiseR357 = new Promise((resolve, reject) => {
  	//fs.readFile('ramowka.html', function(err, data){
	//const $ = cheerio.load(data);
	got('https://radio357.pl/ramowka').then(async response => {
		const $ = cheerio.load(response.body);
		let arrRADIO = [];
		//div.schedule-item__name
		//div.schedule-item__author
		//let teraz = $("div.schedule-day.schedule-day--today div.schedule-day__items");	
		let teraz = $("div.schedule-day--today div.schedule-item");	
		//let teraz = $("div.schedule-day__items");
		console.log(teraz,teraz.length);
		teraz.each(async(i, l) => {
			console.log(i,"......................................................");
			let linia = $(l);
			console.log((linia));
			//console.log(JSON.stringify(linia));
			
			/*let link  = (linia[0].children[0].attribs.href);//.attribs.href);
			let godz  = (i,linia[0].next.next.children[0].data.trim());
			let tekst = (i,linia[0].children[0].children[0].data);
			let obj = {};
				obj.text = tekst;
				obj.godz = godz;
				obj.link = link;
			arrRADIO.push(obj);*/
		})
		resolve(arrRADIO)
	});
})

promiseRNS.then((value) => {
  console.log(value);
});
/*
promiseR357.then((value) => {
  console.log(value);
});
*/
/*
Promise.all([promiseRNS,promiseR357]).then((values) => {
  console.log([...values[0],...values[1]]);
});
*/
