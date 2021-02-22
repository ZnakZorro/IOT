const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
console.log("a=============================================================");

//const vgmUrl= 'https://www.vgmusic.com/music/console/nintendo/nes';
const vgmUrl= 'https://nowyswiat.online/ramowka/';

//proradio-col proradio-col__post proradio-s12 proradio-m6 proradio-l4
//proradio-row proradio-activeschedule

let getRNSramowka=async()=>{
	let arrRNS = [];
	got(vgmUrl).then(async response => {
		const $ = cheerio.load(response.body);
		/*
		// dla wszystkich
		let h3= $("h3.proradio-post__title a");
		h3.each((i, l) => {
			//console.log(l.attribs.href);
			//console.log(l.children[0].data);
		});
		*/


		// aktywny dzien
		let teraz = $("div.proradio-activeschedule h3.proradio-post__title");//<div class="proradio-row proradio-activeschedule">	
		//console.log("teraz length=",teraz.length);
		//console.log(teraz[0]);
		
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
			arrRNS.push(obj);
			//console.log(godz,tekst,"\t\t",link);
		});
		return arrRNS;
	}).then(out => {
	  	console.log(77,"=",out.length);
		return out;
	}).catch(err => {
	  	//console.log(err);
	});
	
}

/*
Promise.all([getRNSramowka]).then((values) => {
  console.log(111,values);
});
*/


let rns = getRNSramowka().then(async(rr) => {
	console.log(18,rr);
	return rr;
}).then(async(ss) => {
	console.log(88,ss);
});
/*
console.log(9,rns);

rns.then((n) => {
		console.log(55,n);
		return n;
}).then((nn) => {
		console.log(555,nn);
		return nn;
});*/
/*
https://www.twilio.com/blog/web-scraping-and-parsing-html-with-node-js-and-cheerio
*/