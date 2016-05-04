function getid(id){

    return document.getElementById(id);
}

var availWidths=window.document.body.offsetWidth;
var lis=getid("slider_touch").getElementsByTagName("li");
var spans=getid("focus").getElementsByTagName("span");
var legnth=lis.length;
getid("textshow").innerHTML=1+"/"+legnth;
for(i=0;i<legnth;i++){
    lis[i].style.width=availWidths+"px";
}
spans[0].className="active";
$(".slider_touch").css({"width":availWidths*legnth});


var touchers = {
    //判断设备是否支持touch事件
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    newslider:document.getElementById('newslider'),
    events:{
        off:true,
        index:0,     //显示元素的索引
        newslider:this.newslider,     //this为slider对象
        slider_touch:document.getElementById("slider_touch"),
        handleEvent:function(event){
            var self = this;     //this指events对象
            if(event.type == 'touchstart'){
                self.start(event);
            }else if(event.type == 'touchmove'){
                self.move(event);
            }else if(event.type == 'touchend'){
                self.end(event);
            }
        },
        start:function(event){
            var touch = event.targetTouches[0];
            startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};

            this.newslider.addEventListener('touchmove',this,false);
            this.newslider.addEventListener('touchend',this,false);
            this.off=false;
        },
        move:function(event){
            var touch = event.targetTouches[0];
            endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
            event.preventDefault();
            slider_touch.style.webkitTransition="all 0s";

            var speed=-availWidths*this.index+endPos.x;

            slider_touch.style.webkitTransform="translateX("+speed+"px)";

        },
        end:function(event){

            slider_touch.style.webkitTransition="all 0.5s";
            if(endPos.x<-availWidths/4){

                if(this.index != legnth-1){
                    this.index ++;
                }
            }else if(endPos.x>=availWidths/4){

                if(this.index !=0){
                    this.index --;
                }

            }

            for(i=0;i<spans.length;i++){

                spans[i].className="";
            }
            spans[this.index].className="active";
            slider_touch.style.webkitTransform="translateX("+-availWidths*this.index+"px)";
            this.newslider.removeEventListener('touchmove',this,false);
            this.newslider.removeEventListener('touchend',this,false);
            getid("textshow").innerHTML=this.index+1+"/"+legnth;
            var that=this;
            setTimeout(function () {
                that.off=true;

            },4000)

        },
        setinner:function (){

            if(this.off){
                this.index ++;
                if(this.index>=legnth){

                    this.index =0;
                }
                for(i=0;i<spans.length;i++){

                    spans[i].className="";
                }
                spans[this.index].className="active";


                slider_touch.style.webkitTransition="all 0.5s";
                slider_touch.style.webkitTransform="translateX("+-availWidths*this.index+"px)";
                getid("textshow").innerHTML=this.index+1+"/"+legnth;
                }

           }
    },

    init:function(){

        var self = this;     //this指slider对象
        if(!!self.touch) self.newslider.addEventListener('touchstart',self.events,false);
    }

};
var fef =setInterval(function (){
    touchers.events.setinner();
},5000)
touchers.init();