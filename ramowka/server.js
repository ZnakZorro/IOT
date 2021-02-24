const child_process = require('child_process');
const express = require('express');
//const express  = require("/usr/local/lib/node_modules/express");
const app = express()
const port = 4000




app.get('/', (req, res) => {
  HTMLpage(res);
});

app.get('/rns', (req, res) => {
  HTMLpage(res);
});

// post for ajax fetch
app.post('/rns', (req, res) => {
  HTML__page(res,"rns");
});
app.post('/357', (req, res) => {
  HTML__page(res,"357");
});

app.post('/yrno', (req, res) => {
  HTML__page_YRNO(res,"yrno");
  
});



let dzienTygodnia=()=> {
    let weekdays = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    let dw = (new Date()).getDay();
    return weekdays[dw];
}



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});




// html for ajax fetch
let HTML__page=(res,url)=>{
	child_process.exec('node micro/'+url+'.js', (error, stdout, stderr) => {
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


let HTML__page_YRNO=(res,url)=>{
	child_process.exec('node micro/'+url+'.js', (error, stdout, stderr) => {
		console.log(`${stderr}`);
		res.send(stdout);
		if (error !== null) {
			console.log(`exec error: ${error}`);
		}
	});
}




/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

let inlieScript=`
<script>

let getPOST=(u,id)=>{
	let postOption = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({"token":1})
	}
	fetch(u,postOption)
	.then(r => {return r.text()})
	.then(t => {
		console.log(t);
		document.getElementById(id).innerHTML = t;
		//document.getElementById("container").innerHTML = (new Date()).toLocaleString();
		//document.getElementById("debug").innerHTML = u.toUpperCase();
	})
	.catch(e => {console.log(e)})
}



document.addEventListener("DOMContentLoaded",function(){
	getPOST("rns","info1");
	getPOST("357","info2");
	getPOST("yrno","container");
});
</script>
`;


// html for first start page
let HTMLpage=(res)=>{
let HTML = `
<!doctype html>
<html lang="pl">
<meta charset="utf-8">
<title>Nowy Świat</title>
<link rel="shortcut icon" href="data:image/vnd.microsoft.icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAABAAAAEAEAAAEAAAEAABAAAQAAEAAAAQABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABERABEQAREQAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAAAEAABAAAQAAEAAAEAAAEAEAAAAQAAABD//wAAfv0AAL77AADe9wAA7u8AAP//AAD//wAA/v8AAAxhAAD+/wAA//8AAP//AADu7wAA3vcAAL77AAB+/QAA" />
<meta name="mobile-web-app-capable" content="yes"> 
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#369">
<meta http-equiv="refresh" content="1800"> 
<style>
body {font:normal 14pt Verdana; margin:0;padding:1% 0.5%;}
button {font-size:14pt;}
p,ul,ol {margin:0.25em 0;}
a {text-decoration:none; color:#222;}
.active {font-weight:bold; color:navy;}
div{}
div.container {margin:0;}
div.container div {margin:0;}
svg {display:none;}
.row {
	margin:0.5%;
	padding:0.5em;
}
.col {
    width: 46%;
    border: 1px solid silver;
    display: inline-block;
    vertical-align: top;
}
@media (max-width: 892px) {.col {display:block; width: 94%;margin:1% 0;}}
</style>
${inlieScript}
<head>
</head>
<body>
<div class="container">
<div class="buttons row">
<button onClick='getPOST("rns","info1");'>getRNS</button>
<button onClick='getPOST("357","info2");'>get357</button>
<button onClick='getPOST("yrno","container");'>yrnoDąbie</button>
</div>
<div class="row" id="container"></div>
<div class="row col" id="info1"></div>
<div class="row col" id="info2"></div>
<div id="time"></div>

<div id="debug"></div>
</div>
</body>
</html>
`;
res.send(HTML);
}
