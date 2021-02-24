const {HTML__page,HTML__page_YRNO} = require('./my_modules/HTMLout') 
const express = require('express')
//const child_process = require('child_process');
const app = express()
const port = 5000

app.use(express.static('public'))

/*app.get('/', (req, res) => {
  res.send('Hello World!')
})*/

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})




