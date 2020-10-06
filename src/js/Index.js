import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Like';
import * as searchview from './View/searchView';
import * as recipeView from './View/recipeView';
import * as listView from './View/ListView';
import * as LikesView from './view/LikesView';
import {element,renderLoader,clearLoader,searchrespages,clearRecipe} from './View/base';

/* *global state variable
  *- search object
  *-current recipe object
  *-shoping list object
  *-liked recipe
*/

const state={};
// window.state=state;

/*
 /-- search controller
*/
const controlsearch=async ()=>{
	//get query from the view
	// const query ='pizza';
	const query =searchview.getInput();//todo
	if (query){
		//2) new search object and add to the state
		state.search= new Search(query);


		//3)prepare UI fot the result
		try{
		searchview.clearInput();
		searchview.clearResult();
		renderLoader(element.searchres)


		//4)search for result 
		await state.search.getresult();
		clearLoader();

		//5)render the result on the UI

		searchview.renderResults(state.search.result);
	}
	catch(error){
		alert(`something went wrong`);
	}
	}

}

element.searchForm.addEventListener('submit', e=>{

	e.preventDefault();
	controlsearch();
	//testing
// window.addEventListener('load', e=>{

// 	e.preventDefault();
// 	controlsearch();


});
// const search = new Search ('pizza');
// console.log(search)
// search.getresult();
element.searchrespages.addEventListener('click',e=>{
	const btn=e.target.closest('.btn-inline');
	// console.log(btn);
	if(btn){
		const gotopage=parseInt(btn.dataset.goto,10);
		searchview.clearResult();
		searchview.renderResults(state.search.result,gotopage)
		console.log(gotopage);
	}
})



/*
 /-- Recipe controller
*/
// const r=new Recipe(35626);
// r.getRecipe();
// console.log(r);
const controlRecipe=async ()=>{
	const id=window.location.hash.replace('#','');
	console.log(id);
	if(id){
		//prepate UI for changes
		recipeView.clearRecipe();
		renderLoader(element.recipe);


		//highlight selected search Item
		if (state.search) searchview.highlightSelected(id);



		//Create new recipe object
		state.recipe=new Recipe(id);

		try{

		//get Recipe data and parse the ingridients

		await state.recipe.getRecipe();
		state.recipe.parseIngredients();


		//calculate servings  and time 
		state.recipe.calculatetime();
		state.recipe.calcservings();

		//render the Recipe
		clearLoader();
		recipeView.renderRecipe(state.recipe,state.likes.isliked(id));

		                                         // console.log(state.recipe);
	}
	catch(error){
		alert(error);
	}
	}

}
/*
   --Listcontrol
*/
const controlList=()=>{
	//create a new list if there is not yet
	if(!state.list)state.list=new List();
	//add each ingredient to the list and UI
	state.recipe.ingredients.forEach(el=> {
		const item=state.list.addItem(el.count,el.unit,el.ingredient);
		listView.renderItem(item);
		// statements
	});
}
//handle delete and update list item events
element.shopping.addEventListener('click',e=>{
	// const id = e.target.closest('.shopping__item').dataset.itemid;

	 const id=e.target.closest('.shopping__item').dataset.itemid;
	//handle the delete btn
	if(e.target.matches('.shopping__delete, .shopping__delete *')){
		//delete from state
		state.list.deleteItem(id);
		//delete from UI
		listView.deleteItem(id);

		//handle the count update
	}
	  else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
	// else if(e.target.matches('.shopping__count-value')){
	// 	const val=parseFloat(e.target.value, 10);
	// 	state.list.updateCount(id,val);
	// }
});


/*
 /-- like controller
*/	
//testing
 // state.likes=new Likes();
 // LikesView.toggleLikemenu(state.likes.getnolikes())

const controlLike=()=>{
	if(!state.likes) state.likes=new Likes();
	const currentID=state.recipe.id;
	if(!state.likes.isliked(currentID)){
		//add like to the state
		const newLike=state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img);


		//toggle the like button
		LikesView.toggleLikeBtn(true);


		//add like to the UI list
		LikesView.renderLike(newLike);
		// console.log(state.likes);


		//user has liked current recipe 
	}else{
			//remove like to the state
			state.likes.deleteLikes(currentID)


		//toggle the like button
		LikesView.toggleLikeBtn(false);


		//remove like from the UI list
		LikesView.deleteLiked(currentID);
			// console.log(state.likes);


	}
	LikesView.toggleLikemenu(state.likes.getnolikes())
}


//Restore liked recipies on the page reload
window.addEventListener('load',()=>{
	state.likes=new Likes();
	//restore likes
	state.likes.readStorage();
	//toggle like button
 LikesView.toggleLikemenu(state.likes.getnolikes());
 //render the existing likes
 state.likes.likes.forEach(like=> LikesView.renderLike(like));



});
// window.addEventListener('hashchange',controlRecipe);
// window.addEventlistener('load',controlRecipe);
['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));
element.recipe.addEventListener('click', e=>{
	if (e.target.matches('.btn-decrease, .btn-decrease *')){
		//decrease button is clicked
		if(state.recipe.servings>1){
		state.recipe.updateServings('dec');
		recipeView.updateServingIngredients(state.recipe);
	}
	}// * it denotes any child element of 
	else if (e.target.matches('.btn-increase, .btn-increase *')){
		//increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingIngredients(state.recipe);
	}
	else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
		//add ingredient to the shopping List
		controlList();
	}else if(e.target.matches('.recipe__love, .recipe__love *')){
		//like controller
		controlLike();
	}
	// console.log(state.recipe);
});

// window.l=new List();