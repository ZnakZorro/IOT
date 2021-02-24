const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
//console.log("a=============================================================");

let poprawCzas=(godz)=>{
	let arr = godz.split(":");
	arr[0] = (parseInt(arr[0]) + 1) % 24;
	godz = arr.join(":");
	return godz;
}

let getTime=(godz)=>{
	let arr = godz.split(":");
	return arr[0];	
}

let promiseRNS = new Promise((resolve, reject) => {
				//fs.readFile('ramowka-357.html', function(err, data){
				//const $ = cheerio.load(data);
		got('https://radio357.pl/ramowka').then(async response => {
		const $ = cheerio.load(response.body);
		let godzina  = parseInt((new Date()).getHours());
		let jestKlasa = false;
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


				let godz  = linia[0].children[2].children[0].data;
				let autor = linia[0].children[4].children[2].children[0].data;
				let text  = linia[0].children[4].children[0].children[0].data;
				godz = poprawCzas(godz);
				let klasa = "";
				let from  = getTime(godz);
				if (!jestKlasa && parseInt(from)>=godzina-1) {klasa = "active"; jestKlasa=true;}

				let obj = {};
					obj.text = text+", <small><i>"+autor+"</i></small>";//"; "+godzina;//+"; "+from+"; "+(parseInt(from)>=godzina-1);
					obj.godz = godz;
					obj.link = "https://radio357.pl/ramowka";
					obj.class = klasa;
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
  console.log(JSON.stringify(value,null,"\t"));
});