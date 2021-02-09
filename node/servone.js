//#!/usr/local/bin/node
"use strict";
let debug = true;
const path = require('path');
const express  = require("C:/nodejs/node_modules/express");
//const express  = require("/usr/local/lib/node_modules/express");
//let execSync = require("child_process").execSync;
const fs       = require("fs");
const DS="/";
const port = 5500;
const startPage = "/public/";
const { networkInterfaces } = require('os')

let myIP  = "127.0.0.1";

const getLocalExternalIP = () => [].concat(...Object.values(networkInterfaces()))
  .filter(details => details.family === 'IPv4' && !details.internal)
  .pop().address;
  
myIP = getLocalExternalIP()
const ip = Object.values(networkInterfaces()).flat().find(i => i.family == 'IPv4' && !i.internal).address;
console.log("ip=",ip);

let args = process.argv.slice(2);
//console.log("process.argv",process.argv.length,process.argv);
if (process.argv.length>2){
	if(args[2]==="-q") debug=false;
}

Buffer.prototype.pars = function() {return this.toString().trim();};

//console.log(path.join(__dirname, 'public/music/'));
	
let app = express();
let server  = require("http").createServer(app);

//app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/"));


let getDir=()=>{
		let pathh = process.cwd();
		console.log("pathh=",pathh);
		let files = [];
		let getFiles = function(pathh, files){
			fs.readdirSync(pathh).forEach(function(file){
				let subpath = pathh + '/' + file;
				if(fs.lstatSync(subpath).isDirectory()){
					getFiles(subpath, files);
				} else {
					let ext = path.extname(file);
					//console.log(ext)
					if (ext===".mp3" || ext===".aac") {
						let stats = fs.statSync(subpath)
						let fileSize = Math.round(stats.size/(1024*1024));
						console.log(fileSize,subpath)
						files.push(subpath+";"+fileSize);
						//files.push(pathh + '/' + file);
					}
				}
			});     
		}		
		//let mediaDir = './public';
		let mediaDir = '.';
		getFiles(mediaDir, files);		
		files = files.map((f)=>{return f.replace("./","")});
		//console.log(files);
		return files;
}



app.get("/dir", function(req, res){
	console.log("get=/dir");
	let dirObj = getDir();
	res.send((dirObj));
});





//qqqqq
app.get("/copy/*", function(req, res){
	let nameIN=req.params[0];
	let ext = path.extname(nameIN);
	let nameOUT = "00"+ext;
	console.log(nameIN);
		fs.copyFile(nameIN, nameOUT, (err) => { 
		  if (err) { 
			console.log("Error Found:", err); 
			res.send({"error":err});
		  } 
		  else { 
			//fs.close();		  
			console.log("\nFile Contents of copied_file:"); 
			console.log(nameIN);
			console.log(nameOUT);
			setTimeout(function(){console.log("send");res.send({"file":nameOUT});},800)
		  } 
		}); 
	
});


app.get("/", function(req, res){
	console.log("get=/");
	sendIndex(res);
});


/*
app.get("/*", function(req, res){
	console.log("get=/*");
	res.send(null);
});
*/

server.listen(port,()=>{console.log("IP="+myIP+":5500\n\n");});


let sendIndex=(res)=>{
let html = `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="3600">
<title>Media servo</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#db5945"> 	

<link rel="shortcut icon" type="image/png" size="512x512" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAABWVBMVEUAAAA6Oj48PD86Oj47Oz87Oj47Oj47Oj46OT09PT0AAAA6Oj47Oj07Oj06Oj47OT47Oj07Oj47Oj07Oj47Oj07Oj47Oj47Oj46OT45OT06OT00NDQ5OT49PUI7Ozs6OT49PD06Oj07O0M8Oz07Oj45OTw6OT07Oj47Oj49Nz89PT06OT09PT06Oj48OT46Oj46Oj4+Pj47Oz0/Pz86Ojo7Oj7Z3OE8dLo7SFs8ZJk8PEDIy887WH4/PkK4u788bq07VHdnZ2tfXmM7S2OWmJ07YI9WVlpRUVVNTFDQ09i8v8S0trqnqa6Rkpc8YpVra3DO0NU8c7mio6g8a6efoKU8aKKam6A7Zpw7UW87Tmo7RFM7P0rU19s8crU7XYo7W4VJSUzMztOtr7M7QU87PUSMjpKHiI18fYF1dnpwcHVkZGhaWl47cLKCgoc7SV07RlfEx8uvsLY8R1r2ZaeHAAAANXRSTlMA8mruqPv26/4UAuHc0ILGsnrmzG7Yv5+YUS0EZh4I+VxKJZVzYdTCq0Q+jQ7juKOKRjcoGnW+4vAAAAkxSURBVHja7MGBAAAAAICg/akXqQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYPburSeNIIzD+LAcK7KV2npC8EA9UbXVZoIaEkmItySGGASjXuilsUm//0VXjanZbKxT1Nmd9/l9hf+zL3cMAAAAAACA8zbnZr0f0xMfV7fyxUn/g4LzanNLnn8/eTqX1SHbJOCg2s+leX8mmLwYmjxCrqGQfLXlnbvJ11aL+WByIwUKSKTK8saKP7O+VrqbvKBHkONXIBkq1Y2Vcn19Kpg8ldWvaFshnirVxsPk4/nUgn4zhU2FmBirNhbL9czD5AX9TnwF28b8fFbbMqlg2XdtU1HBqkpa26VgVU6bIQC3jGtDBOCUhrYtq2BRWtuWVrBIW0cANu1q6wjAJl9bRwA2ZbR1BGCAAEAASFQA12fD28Fpu3XR7fcOuzqMAIwkIoCDYPLO4+Tnzaf2dRgBGIlpAMHke/eTH/VPQpM3CSDWMiNPvh9Mftx8igASxCCAs+HvzqDduoyanACSKvPs5Fd/J78JTU4AbogMIJi8e9ILT04ALooKYK/5iACcRwDCEYBwBCAcAQhHAMIRgHAEIBwBCEcAwhGAcAQgHAEIRwDCEYBwBCAcAQhHAMIRgHAEINz7BXB+eNI96hBAzLxpAMc3vX73otUedH5dXet7BBAzrx7A8WGvf3TZOh3cDs8O9BMEEEsjBBC67pft085e6EMngNiLDGCU604AyRIZgOl1J4DkejaAh+u+//x1J4BEiwpgaHTdCSDR+I8g4QhAuBgEsKXwYi4GUFJ4MRcD4NEoAy4GwMuRBhwMYErh5dwLgKdjjbgXwJKCAdcCyO4omHAsgDXuv211bUchly7Vmd++sn43hWwqPz65Pe3Pb1THFOLB029rIfXpy8eJmfLiLp97LBkEYHDdi6WpzLfPs3M1hZjzXum657juyeRx3WXz/uu6f+W6u+LfAXDdneZx3WWLCiClIAYBCEcAwhGAcAQgHAEIRwDCEYBwBCAcAQhHAMIRgHAEIBwBCEcAwhGAcAQgHAEIRwDCEYBwBCAcAQhHAMIRgHAEIBwBCEcAwhGAcAQgHAEIRwDCEYBwBCAcAQhHAH/Yu7feJIIwjONTkEPBqhVoLa3VHqz1kGiiz1xAlqSEcDaQhvSKi9Kk2kOa6Pe/0ds6s7TL7pKZnef3FfgH2HffnXUcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA3AcA0ie/dSXjVKlmEvnipXSxpPyNwbgjOrBUTqP/+XTR6+qDCDpVtdLWfjLrj1bZQCJtX34NI8HFdd3GUAS7T3P4HHypS0GkDQ7OQSRKxcYQHIUDtMIamW9wAASIrWCRWTLDCAJqk+xqGKVAdhu9xhhvPjMAKy2l0U42S0GYK/CJsI7LjAAS70uIgov9xmAlbYyiEZmkwFYqIzoMAD7fMU9DMAxT3AfA3CL8vkzAKeo3/8MwCVlKBiAQ7bwMK89umtNhheDi+GkdTdqewwgMb5nMF/t5nIwlfdNB5c3NQaQBIUi5mq2ZlJv3GoyAPttYp5RQ87Tv2YAltvDHCd9+ZD+iAHYbDcLX+en8jGGXQZgr2P4uurJx+ldMQBbfYMf70w+3sRjAHaqwEe3IYPodxmAjXbgo1OXwdTbDMA+hRXo3c5kUOMmA7BOGXq3PRnctMkAbJOGVmcmFzFuMwC7vINWty4XU+8yAKu8hI7XkIvqewzAIh+gdSYXN2EAFnkPnSsZxi8GYI3tDDTOxzKMXpcB2KIMnVMZzpAB2KICjRsZ1ogB2OEzdBoyrD4DsMMhNE5keNcMwArPoTGQ4fUZgBWyULVlFJoMwAL70Pgho9BiABb4BFWtLqMw9hiA+dagasponDAA8+Wg+imjcckAzJeB6o+MxoABGG8VqtpURmPqMQDTvYWqI6PSgSoryCCv/MaAsU0C3ggyyAuofsmoXEOVEWSQ99oxUFTuGIDp1rS7YFH5CVVekEGeandBonLJAEz3EqqhjMoPaAgySA6qCxmVFgMwXbzfABP+BJgu3v8Ap5wDmC7eq4AJVDlBBol3DtCCqiTIIPFOAu+g2hBkkINY7wWMoPoiyCDx3g1sQ5USZBDtPkAvzn2AfUEmycQ4CRpwDmS+Ze8EpgUZpbTkreAjQUb5Gt9zAbMaVAeCjPJ6yU8GVQWZZSW+ZwO5EmqD2J4ObkBjTZBhYjsfYASNZ4IMs9wTQlYFmWaZZwQVBRknBZ1JLKeErQsyTmF55wRmtgWZZwM61zKMK+g8F2Sgj9BqycWdQWtPkIkiPy284QFcB7THW2id/474fQE7gsyUW/CNUXqzDgDeCbZJCnrtsQyudwvwGtAyab8C6jKo2S30sgVBpnoHH93fMph6Bz7KgsxVgY/zgQyi0cU/nAL/Ze9eWpsKogAA32pelaSJ0dpIqn2Q4KMWLfZsIhRSxCI0KFl0XbpoUVf+/42LgotCbpomi8zN9/2GYTiPmXOSsx+TDL7Okv/f5n9egqSnFBP9+rmA7eGtjKXWrcREl/frDI0vY6LK64zl9i5y/D6Z3v8fRo6XGcuuE3mG+cHgyY/4z4fARNUj17fRl0mp3+hP5DpUAkjB+k7kG5xeX32/+//v7/XpIPKVX2WkYC+mG5wNb0YX4/Or8/HF6GZ4NohbAoAi2I55KAGmbyMW7yAjHVuxaG8zUrLoE1DKSMuG+3/FbYv/VtzeTixGWf6XpuN6LMKh+k+yOrWY20f134QdVWI+Fdd/2rqlWsyhpf+fvM+b8VB1778Kob8WD7FmGmxRPHlejVk97gn+imS3HbNo9zMK5v2LctxPuXmUUUDdR5sxVa3eM/+juD70mnkRYaX51Pyvwtv/9KxajrvK1caBHQCrY32303rTqLer7Xqj2drqH2cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwrz04IAEAAAAQ9P91OwIVAAAAAAAAAAAAAAAAAAAAAAAYCpVTKK9lKYZFAAAAAElFTkSuQmCC" />

<style>
	body,button {font:normal 11pt verdana}
	h4 {margin-bottom:0}
	button {margin:0.25em;padding:0.25em;}
	button span {color:blue;}
	.btn {background:#888; color:#fff;}
	div {margin-top:1em;}
	div#info{font-size:0.9em; padding:0.5em; border:1px solid silver;line-break:anywhere; min-height:6em;}
	div#klaw * {display:inline;}
</style>
<script>
const $=e=>document.querySelector(e);
const $$=e=>document.querySelectorAll(e);
let localhost = location.href;
console.log(localhost);

let radioURL=null;

const getPlayList=()=>{
	fetch("/dir")
	.then(r => {return r.json()})
	.then(o => {
		let html = "";
		let katalog="";
		let lastkat="";
		o.forEach((mm)=>{
			let arrm = mm.split(";");
			let m  = arrm[0];
			let si = arrm[1];
			katalog = m.split("/")[0];
			//console.log(m);
			let n = m.split("/").pop();
			//n=n.replace("_"," ");
			//n=n.replace(/_|\.mp3|\.aac$/g," ")
			if (katalog!=lastkat) html += '<h4>'+katalog+'</h4>';
			html += '<button data-media="'+m+'" onclick="graj(this)"><span>['+si+'MB] </span>'+n+'</button>';
			lastkat = katalog;
		})
		document.getElementById("music").innerHTML = html;
	})
	.catch(e => {console.log(e)});
}

document.addEventListener("DOMContentLoaded",function(){
	//document.getElementById("info").textContent = "info";

	if (localStorage.getItem("___radioURL")) radioURL = localStorage.getItem("___radioURL");
	setURL(radioURL);
	console.log(radioURL);
	getPlayList();
	setInterval(info,15000);
});

const setURL=(url)=>{
	if (url) $("#radiourl").value = url;
	radioURL = $("#radiourl").value;
	localStorage.setItem("___radioURL",radioURL);
	console.log(radioURL);
	info();
}

const opisz=(o)=>{
	setTimeout(info,1000);
	setTimeout(info,5000);
}
const opisanie=(o)=>{
	//console.log(o);
	$("#info").innerHTML ="";
	let arr = o.split("!");
	
	let opis = ""
	opis += "Vol="+arr[0]+"; ";
	opis += "Sta="+arr[1]+"; ";
	opis += "WiFi="+arr[2]+"; ";
	opis += "Free="+arr[7]+"; ";
	opis += "<br>@"+arr[3]+" ";
	if (arr[8]) opis += "<br>#"+arr[8]+","+arr[9];
	$("#info").innerHTML += opis;
	$("#info").innerHTML += "<br />"+ (new Date()).toLocaleString();
	$("#info").innerHTML += '<hr />';
	//arr.forEach((l,i)=>{$("#info").innerHTML += i+". "+l+"; ";})
}

const info=()=>{
	fetch(radioURL+"radio?n=0")
	.then(r => {return r.text()})
	.then(o => {
		//opisanie(o);
	}).catch(e => {console.log(e)})
}

const graj=(ten)=>{
	let muza =  ten.dataset.media;
	$("#info").innerHTML = '<b>'+muza+'</b>';
	//muza = encodeURIComponent(muza);
	console.log(muza);
		
		console.log("fetch/copy/"+muza);
		fetch("/copy/"+encodeURIComponent(muza))
		.then(r => {return r.json()})
		.then(o => {
			if (o.file){
				console.log("227---------file=",o.file);
					fetch(radioURL+"radio?u="+localhost+o.file)
					.then(r => {return r.text()})
					.then(o => {opisz(o);})
					.catch(e => {console.log(e)})
			} else {
				console.log("copy=",o);
			}
		})
		.catch(e => {console.log(e)});
}

const skok=(ten)=>{
	console.log(ten.value)
	fetch(radioURL+"radio?z="+ten.value)
	.then(r => {return r.text()})
	.then(o => {opisz(o);})
	.catch(e => {console.log(e)})	
}
</script>
</head>
<body>

<div class="col">
<div class="info">
Radio URL: <input id="radiourl" value="http://192.168.31.141/">
<button class="btn btn-sm btn-secundary" onclick="setURL()">setURL</button>
<button class="btn btn-sm btn-secundary" onclick="setURL(&quot;http://192.168.31.141/&quot;)">192.168.31.141</button>
<button class="btn btn-sm btn-secundary" onclick="setURL(&quot;http://192.168.31.241/&quot;)">192.168.31.241</button>
</div>

	<div id="klaw">
		<button onclick='info()' >info()</button>
		<h3>2Media servo</h3>
		<button onclick='getPlayList()'>dir()</button>
	</div>
	<div id="music"></div>
	<div id="info"></div>

<hr />
<input type="range" id="range" value="0" onChange="skok(this)" style="width:100%"/>

</div>
</body>
</html>

`;
	res.send(html);
}
