import axios from 'axios';

export default class Recipe{
	constructor(id){
		this.id=id;
	}
	async getRecipe(){
		try {
			const res=await	axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title=res.data.recipe.title;
			this.auther=res.data.recipe.publisher;
			this.img=res.data.recipe.image_url;
			this.url=res.data.recipe.source_url;
			this.ingredients =res.data.recipe.ingredients;
			// console.log(res);
		}
		catch(error){
			alert(error);
		}
	}
	calculatetime(){
		const numIng=this.ingredients.length;
		const periods= Math.ceil(numIng/3);
		this.time=periods*15;
	}
	calcservings(){
		this.servings=4;
	}

	parseIngredients(){
		const unitLong = ['tablespoons','tablespoon','ounce','ounces','teaspoon','teaspoons','cups','pounds']
		const unitShort=['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
		const units=[...unitShort,'kg','g']
		const newIngredients=this.ingredients.map(el =>{
			//uniform the units
			let ingredient = el.toLowerCase();
			unitLong.forEach((unit, i)=> {
					// statements
					ingredient=ingredient.replace(unit,unitShort[i]);
			});
			//remove paranthesis
			ingredient=ingredient.replace(/\([^\)\(]*\)/, "");

			//parse ingridients into count,unit and ingredient
			const arrIng= ingredient.split(' ');
			const unitIndex = arrIng.findIndex(el2=>units.includes(el2));
			let objIng;
			if(unitIndex>-1){
				//there is a unit
				const arrCount=arrIng.slice(0,unitIndex);
				let count;
				if(arrCount.length === 1){
					count=eval(arrIng[0].replace('-','+'));
				}
				else{
					count=eval(arrIng.slice(0,unitIndex).join('+'));
				}
				objIng ={
					count,
					unit:arrIng[unitIndex],
					ingredient:arrIng.slice(unitIndex+1).join(' ')
				};

			}else if(parseInt(arrIng[0],10)){
				//there is no unit ,but there is a no in the first place
				objIng={
					count:parseInt(arrIng[0],10),
					unit:'',
					ingredient:arrIng.slice(1).join('')
				}

			}
			else if(unitIndex==-1){
				//there is a unit and no number in the first position
				objIng={
					count:1,
					unit:'',
					ingredient:ingredient
				}
			}
			return objIng;
		});
		this.ingredients = newIngredients;
	}
	updateServings(type){
	//servings
	const newServings=type==='dec'?this.servings-1:this.servings+1;
	//ingredients
	this.ingredients.forEach(ing=> {
		ing.count*=(newServings/this.servings) 
		// statements
	});
	this.servings=newServings;
}
}




