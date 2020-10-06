export default class Likes{
	constructor(){
		this.likes=[];
	}

addLike(id,title,author,img){
	const like={id,title,author,img};
	this.likes.push(like);
	//persist the data in the local storage
	this.persistData();

	return like;
};
deleteLikes(id){
	const index=this.likes.findIndex(el=>el.id===id);
		this.likes.splice(index,1);

		//persist the data in the local storage
			this.persistData();

}
	isliked(id){
		return this.likes.findIndex(el=>el.id===id)!==-1

	}
getnolikes(){
	return this.likes.length;
}
persistData(){
	localStorage.setItem('likes',JSON.stringify(this.likes));
}
readStorage(){
	const storage=JSON.parse(localStorage.getItem('likes'));
	//restoring likes from the loacalStorage
	if(storage) this.likes=storage;
}

}

