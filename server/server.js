const child_process = require('child_process');
const express = require('express')
const app = express()
const port = 4000




app.get('/', (req, res) => {
  //res.send(HTMLpage());
  HTMLpage(res);
});

app.get('/rns', (req, res) => {
  //res.send(HTMLpage());
  HTMLpage(res);
});

// post for ajax fetch
app.post('/rns', (req, res) => {
  //res.send(HTMLpage());
  HTML__page(res,"rns");
});
app.post('/357', (req, res) => {
  //res.send("<h3>357</h3>");
  HTML__page(res,"357");
  
});

let dzienTygodnia=()=> {
    let weekdays = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    let dw = (new Date()).getDay();
    return weekdays[dw];
}



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});



let inlieScript=`
<script>

let getPOST=(u)=>{
	let postOption = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({"token":1})
	}
	fetch(u,postOption)
	.then(r => {return r.text()})
	.then(t => {
		console.log(t);
		document.getElementById("info").innerHTML = t;
		//document.getElementById("container").innerHTML = (new Date()).toLocaleString();
		//document.getElementById("debug").innerHTML = u.toUpperCase();
	})
	.catch(e => {console.log(e)})
}
document.addEventListener("DOMContentLoaded",function(){
	getPOST("rns");
});
</script>
`;


// html for ajax fetch
let HTML__page=(res,url)=>{
	child_process.exec('node '+url+'.js', (error, stdout, stderr) => {
		console.log(`${stderr}`);
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


/////////////////////////////////////////////////////////////////////////////////

// html for first start page
let HTMLpage=(res)=>{
	//EXECUTE yourExternalJsFile.js
	child_process.exec('node rns.js', (error, stdout, stderr) => {
		console.log(`${stderr}`);
		let czas = (new Date()).toLocaleString()+" "+dzienTygodnia();
		//let dzien = (new Date()).toISOString().slice(0, 10);
let HTML = `
<!doctype html>
<html lang="pl">
<meta charset="utf-8">
<title>Nowy Świat</title>
<meta http-equiv="refresh" content="900"> 
<style>
body {font:normal 15pt Verdana;}
button {font-size:15pt;}
a {text-decoration:none; color:#222;}
.active {font-weight:bold; color:navy;}
</style>
${inlieScript}
<head>
</head>
<body>
<div class="container">
<div class="buttons">
<button onClick='getPOST("rns");'>getRNS</button>
<button onClick='getPOST("357");'>get357</button>
</div>
<div id="info"></div>
<div id="time"></div>
<div id="container"></div>
<div id="debug"></div>
</div>
</body>
</html>
`;
		res.send(HTML);
		if (error !== null) {
			console.log(`exec error: ${error}`);
		}
	});
	//return `<h1>aaa</h1>`;

}
