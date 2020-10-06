const express=require('express');
const path=require('path');
const port =process.env.PORT||8080;
const app=express()

const htmlfile=path.join(__dirname,'./dist')
app.use(express.static(htmlfile))
app.get('*',(req,res)=>{
	res.sendFile(path.resolve(__dirname,'dist/index.html'))
});
app.listen(port);
console.log('service started');