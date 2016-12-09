function promiseRecursive(gen,result){
	var next=gen.next(result);
	if(next.done) return next.value;
	return next.value
	.then(function(result){
		return promiseRecursive(gen,result);
	});
}