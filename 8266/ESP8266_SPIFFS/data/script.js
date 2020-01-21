"use strict";
const $=e=>document.getElementById(e);
const $$=e=>document.querySelector(e);
const $$$=e=>document.querySelectorAll(e);
let url ="/";


//---dom ready--------------------------------
document.addEventListener("DOMContentLoaded",function(){
    console.log("ESP ready");
	let host = location.host;
	if (!host || isNaN(host.split('.')[0])) url = "http://82.145.73.189/";
	console.log(url)
})
//---DOM READY----------------------------------

function ajax(ten,param){
	//ten=ten||$("btn-16-state");
	if(ten) console.log(ten.className)
	$("btn-16-0").className="";
	$("btn-16-1").className="";
	
	fetch(url+param)
	.then(resp => {return resp.json()})
	.then(obj => {
		if (obj) {
			console.log(obj);
			$("state").textContent=obj.state;
			if(ten) ten.className = "state"+obj.state;
			$("img").className = "state"+obj.state;
		}
		else console.log("no obj")
	})
	.catch(err => {console.log(err);});
}
function slider(ten){
	$("span1").textContent=ten.value;
	ajax(null,"pin?id=2&state="+(ten.value>0?1:0));
}