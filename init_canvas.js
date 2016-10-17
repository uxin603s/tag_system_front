function init_canvas(w,h){
	var c=document.createElement('canvas')
	c.width=Math.ceil(w);
	c.height=Math.ceil(h);
	return c.getContext("2d");
}