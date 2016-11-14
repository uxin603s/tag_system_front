master
```
var pack={
  source:iframe.contentWindow,
  connect:'tagSystem',
}
postMessageHelper.master(pack,function(res){})
```
------------------------
slave
```
postMessageHelper.slave('tagSystem',value)
```
