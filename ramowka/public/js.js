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