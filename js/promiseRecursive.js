function promiseRecursive(gen,result){
	var next=gen.next(result);
	if(next.done) return;
	return next.value
	.then(function(result){
		return promiseRecursive(gen,result);
	});
	// .catch(function(message){
		// console.log(message);
	// })
}