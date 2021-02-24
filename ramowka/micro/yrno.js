const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
//console.log("a=============================================================");
/*
{
  symbol: { sunup: false, n: 1, clouds: 0, precip: 0, var: 'Sun' },
  symbolCode: {
    next1Hour: 'clearsky_day',
    next6Hours: 'fair_day',
    next12Hours: 'clearsky_day'
  },
  precipitation: { min: 0, max: 0, value: 0, pop: 0, probability: 0 },
  temperature: { value: 10.4 },
  wind: { direction: 228, gust: 8, speed: 5 },
  feelsLike: {},
  pressure: { value: 1031 },
  uvIndex: { value: 0.9 },
  cloudCover: { value: 27, high: 27, middle: 0, low: 0, fog: 0 },
  humidity: { value: 79.2 },
  dewPoint: { value: 7 },
  start: '2021-02-24T10:00:00+01:00',
  end: '2021-02-24T11:00:00+01:00'
}

*/
let promiseYRNO = new Promise((resolve, reject) => {
	got('https://www.yr.no/api/v0/locations/2-3083828/forecast').then(async response => {
		let obj = JSON.parse(response.body);
		let teraz0 = obj.shortIntervals[0]
		let teraz1 = obj.shortIntervals[1]
		//console.log(teraz0);
		//console.log(teraz1);
		let ret = "<div>";
		let windAngle = ((teraz0.wind.direction +180)%360);
ret += `
<p>${(new Date(teraz0.start)).toLocaleString('pl-PL')} &Colon; ${teraz0.symbol.var}  &Colon; ${teraz0.symbolCode.next1Hour} &Colon; ${teraz0.symbolCode.next6Hours}</p>
<p>T:<b>${teraz0.temperature.value}&deg;C</b>, F:${teraz0.feelsLike.value || teraz0.temperature.value}&deg;C, dP:${teraz0.dewPoint.value}&deg;C</p>
<p>R:<b>${teraz0.precipitation.value}&sim;${teraz0.precipitation.max}mm</b>, W:${teraz0.wind.speed}&sim;${teraz0.wind.gust}m/s, <span style="position:absolute; transform: rotate(${windAngle}deg);">&uarr;</span> <span style="position:absolute; transform: rotate(${teraz0.wind.direction}deg);">&darr;</span></p>
<p>P:${teraz0.pressure.value}hPa, H:${teraz0.humidity.value}%  , UV:${teraz0.uvIndex.value}%  </p>
`
		ret += "</div>";
		resolve(ret);
	});
})


let promiseYRNO___ = new Promise((resolve, reject) => {
	//yrno forecast Dąbie json
	//https://www.yr.no/api/v0/locations/2-3083828/forecast
	//https://www.yr.no/api/v0/locations/2-3083828/forecast/currenthour
  	//fs.readFile('ramowka.html', function(err, data){
	//const $ = cheerio.load(data);
	got('https://www.yr.no/api/v0/locations/2-3083828/forecast/currenthour').then(async response => {
		let obj = JSON.parse(response.body);
		//console.log(obj);
		let ret = "<div>";
		//console.log((new Date(obj.created)).toLocaleString('pl-PL'));
		//console.log("created:",       obj.created);
  		//console.log("symbolCode:",    obj.symbolCode.next1Hour);
		//console.log("temperature:",   obj.temperature.value,obj.temperature.feelsLike);
		//console.log("wind:",          obj.wind.direction,obj.wind.gust,obj.wind.speed);
		//console.log("precipitation:", obj.precipitation.min,obj.precipitation.max,obj.precipitation.value,obj.precipitation.pop,obj.precipitation.probability);
ret += `
<p>${(new Date(obj.created)).toLocaleString('pl-PL')} ${obj.symbolCode.next1Hour}</p>
<p>Temp: <b>${obj.temperature.value}&deg;C</b> Feels:${obj.temperature.feelsLike}&deg;C</p>
<p>Rain: <b>${obj.precipitation.value} mm</b></p>
<p>Wind: ${obj.wind.speed}/${obj.wind.gust} m/s</p>
`;
		ret += "</div>";
		resolve(ret);
	});
})


/*
let promiseYRNO = new Promise((resolve, reject) => {
	//yrno forecast Dąbie json
	//https://www.yr.no/api/v0/locations/2-3083828/forecast
	//https://www.yr.no/api/v0/locations/2-3083828/forecast/currenthour
  	//fs.readFile('ramowka.html', function(err, data){
	//const $ = cheerio.load(data);
	got('https://www.yr.no/en/forecast/daily-table/2-3083828/Poland/West%20Pomerania/Szczecin/Szczecin%20D%C4%85bie').then(async response => {
		const $ = cheerio.load(response.body);
		let godzina  = parseInt((new Date()).getHours());
		let arrRADIO = [];		
		let teraz    = $("div.now-hero__slide-container");
		//console.log(teraz);
		//console.log(teraz.html());

		resolve(teraz.html())
	});
})
*/


promiseYRNO.then((value) => {
	console.log(value);
	//console.log(JSON.stringify(value,null,"\t"));
});