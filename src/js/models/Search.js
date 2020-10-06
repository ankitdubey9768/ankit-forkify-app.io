
import axios from 'axios'
export default class Search{

	constructor(querry){
		this.querry=querry;
	}


	async getresult(){
	try{
	const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.querry}`);
	this.result=res.data.recipes
	//console.log(this.result);
	}
	catch(error){
	alert(error);
		}
	}
}