function init_canvas(w,h){
	var c=document.createElement('canvas')
	c.width=w;
	c.height=h;
	return c.getContext("2d");
}