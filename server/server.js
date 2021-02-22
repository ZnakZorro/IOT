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
  HTML__page(res);
});
app.post('/357', (req, res) => {
  res.send("<h3>357</h3>");
  
});





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
		document.getElementById("time").innerHTML = (new Date()).toLocaleString();
		document.getElementById("title").innerHTML = u.toUpperCase();
	})
	.catch(e => {console.log(e)})
}

</script>
`;


// html for ajax fetch
let HTML__page=(res)=>{
	child_process.exec('node rns.js', (error, stdout, stderr) => {
		console.log(`${stderr}`);
		let czas = (new Date()).toLocaleString();
		let dzien = (new Date()).toISOString().slice(0, 10);
		let HTML = "<div id='info'>";
		HTML += "<ol>";
		let obj = JSON.parse(stdout);
		obj.forEach((o)=>{
			HTML += `<li>${o.godz} :: <a href="${o.link}" target="_blank">${o.text}</a> </li>`;
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
		let czas = (new Date()).toLocaleString();
		let dzien = (new Date()).toISOString().slice(0, 10);
let HTML = `
<!doctype html>
<html lang="pl">
<meta charset="utf-8">
<title>Nowy Świat</title>
<meta http-equiv="refresh" content="900"> 
<style>
body {font:15pt normal Verdana;}
button {font-size:15pt;}
</style>
${inlieScript}
<head>
</head>
<body>
<button onClick='getPOST("rns");'>getRNS</button>
<button onClick='getPOST("357");'>get357</button>
<h4 id="time">${czas}</h4>
<h4 id="title">Radio Nowy Świat</h4>
`;
		HTML += "<div id='info'>";
		HTML += "<ol>";
		let obj = JSON.parse(stdout);
		obj.forEach((o)=>{
			HTML += `<li>${o.godz} :: <a href="${o.link}" target="_blank">${o.text}</a> </li>`;
		});
		HTML += "</ol>";
		HTML += "</div>";
HTML += `
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
