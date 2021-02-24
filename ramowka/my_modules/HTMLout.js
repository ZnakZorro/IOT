const child_process = require('child_process');

let dzienTygodnia=()=> {
    let weekdays = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    let dw = (new Date()).getDay();
    return weekdays[dw];
}


let HTML__page=(res,url)=>{
	child_process.exec('node micro/'+url+'.js', (error, stdout, stderr) => {
		//console.log(`${stderr}`);
		let czas = (new Date()).toLocaleString()+" "+dzienTygodnia();
		let HTML = "<div id='info'>";
		HTML += "<p><b>"+url.toUpperCase()+" :: "+czas+"</b></p>";
		HTML += "<ol>";
		let obj = JSON.parse(stdout);
		obj.forEach((o)=>{
			HTML += `<li class="${o.class}">${o.godz} :: <a href="${o.link}" target="_blank">${o.text}</a> </li>`;
		});
		HTML += "</ol>";
		HTML += "</div>";
		res.send(HTML);
		if (error !== null) {
			console.log(`exec error: ${error}`);
		}
	});
}




let HTML__page_YRNO=(res,url)=>{
	child_process.exec('node micro/'+url+'.js', (error, stdout, stderr) => {
		//console.log(`${stderr}`);
		res.send(stdout);
		if (error !== null) {
			console.log(`exec error: ${error}`);
		}
	});
}


module.exports = {HTML__page,HTML__page_YRNO};
