import {element} from './base';


export const getInput =()=>element.searchInput.value;

export const clearInput =()=>{
	element.searchInput.value='';
	};
export const highlightSelected=id=>{
	const resultArr=Array.from(document.querySelectorAll('.results__link'));
	resultArr.forEach(el=> {
		el.classList.remove('results__link--active')
		// statements
	});
	document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active')
}
export const clearResult =()=>{
	element.searchresultlist.innerHTML='';
	element.searchrespages.innerHTML='';
};
/*
// 'Pasta with tomato and spinach'
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
*/

export const limitRecipeTitle =(title,limit=17)=>{
	const newTitle=[];
	if(title.length>limit){
		title.split(' ').reduce((acc,cur)=>{
			if(acc+cur.length<=limit){
				newTitle.push(cur);
			}
			return acc+cur.length
		},0);
		return `${newTitle.join(' ')} ...`;
	}
	return title;


}


const renderrecipe=recipe=>{
	const markup=`
				<li>
                    <a class="results__link " href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>

	`;
	element.searchresultlist.insertAdjacentHTML('beforeend', markup);
};

const createButton=(page,type)=>`

			 <button class="btn-inline results__btn--${type}" data-goto=${type== 'prev' ?page-1:page+1}>
			 		<span>Page ${type== 'prev' ?page-1:page+1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev'?'left':'right'}"></use>
                    </svg>
                    
                </button>

     		

`;
	

const renderButton=(page,numresults,resperpage)=>{
	const pages=Math.ceil(numresults/resperpage);
	let button;
	if (page==1 && pages>1){
		//only buttons to next page
		button=createButton(page,'next')

	}else if (page<pages){
		//both buttons
		button=`
			${button=createButton(page,'next')}
			${button=createButton(page,'prev')}


		`;

	}else if (page==pages && pages>1){
		//only buttons to go to prev page
		button=createButton(page,'prev')

	}
	element.searchrespages.insertAdjacentHTML('afterbegin',button);


}
export const renderResults=(recipes,page=1,resperpage=10)=>{
	//render result of current page
	const start=(page-1)*resperpage;
	const end=page*resperpage;
	recipes.slice(start,end).forEach(renderrecipe);
	//render pagination button
	renderButton(page,recipes.length,resperpage)
};