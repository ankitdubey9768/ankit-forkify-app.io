export const element={
	searchForm:document.querySelector('.search'),
	searchInput:document.querySelector('.search__field'),
	searchres:document.querySelector('.results'),
	searchresultlist:document.querySelector('.results__list'),
	searchrespages:document.querySelector('.results__pages'),
	recipe:document.querySelector('.recipe'),
	shopping:document.querySelector('.shopping__list'),
	Likesmenu:document.querySelector('.likes__field'),
	likesList:document.querySelector('.likes__list')
}
export const elementStrings ={
	loader:'loader'
}
export const renderLoader = parent =>{
	const loader =`
		<div class="${elementStrings.loader}">
		<svg>
			<use href="img/icons.svg#icon-cw"></use>
		</svg>
		`;
		//parent.insertAdjacentHTML('afterend',loader) it is what I found interesting.
		  parent.insertAdjacentHTML('afterbegin',loader);
}
export const clearLoader=()=>{
	const loader=document.querySelector(`.${elementStrings.loader}`);
	if(loader){
		loader.parentElement.removeChild(loader);
	}
}