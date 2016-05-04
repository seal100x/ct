    var validTime=0;

    function getId(id){return document.getElementById(id);}

    function checkParams(node){

        var inputs=node.getElementsByTagName("input");

        for(i=0;i<inputs.length;i++){

            if(inputs[i].attributes["pattern"] != null && inputs[i].dataset.off !="false") {

                var pattern=eval('/' +inputs[i].attributes["pattern"].value+'/');

                if(!pattern.test(inputs[i].value) || !inputs[i].value && inputs[i].dataset.off !="false"){

                    showMsg(inputs[i].title);
                    return false;
                }

            }

            //验证密码
            if(inputs[i].attributes["data-pattern"] !=null && inputs[i].dataset.off !="false"){

                var pattern=eval('/' +inputs[i].attributes["data-pattern"].value+'/');

                if(pattern.test(inputs[i].value) ){

                    showMsg(inputs[i].title);
                    return false;
                }
            }

        }

    }

    function sendcode(node){
                  
         var cap = checkCaptcha();
         if(cap == true) {
        	 sendSms(node);
        	 return true;
         } else {
        	 return false;
         }
         
    }
    
    function checkCaptcha () {
    	var captcha_key = $("input[name='captcha_key']").val();
        var captcha_code = $("input[name='captcha_code']").val();
        if(captcha_code == '') {
       	 showMsg("请输入图形验证码");
            return false;
        }
        
        var bol = false;
        $.ajax({
	       	 type:'post',
	       	 url:'/ajax/checkcaptcha.html',
	       	 dataType:'json',
	       	 data:{captcha_key:captcha_key, captcha_code:captcha_code},
	       	 async:false,
	       	 success:function(data) {
	       		 if(data.status == 1) {   //图形验证码正确                 
	                 bol = true;   
	           	 } else {
	           		 showMsg("图形验证码错误");
	           	 }
	       	 }
        });
        return bol;
    }
    
    function sendSms(node) {

        if(checkCaptcha () !=true){

            return;
        }

    	if(validTime > 0) {
            showMsg("验证码已经发送，还有" + validTime + "秒可以再次发送");
            return false;
        }
    	/**
         * 发送短信
         */
    	var tel = $("input[name='mobile']").val();
        var sms_type = $("input[name='sms_type']").val();
        $.ajax({
        	type:'get', 
            url:API_URL + "/main/sendsms?type="+sms_type+"&phone=" + tel,
            dataType:'jsonp',  
            jsonp:'jsoncallback',  
            success:function(data) {  
	           	 if(data.status == 1) {
	           		 validTime=60;
		             if(node != '') {
		            	 var t = setInterval(function (){countTime(node)},1000);
		             }
                     showMsg(data.msg);
	           	 } else {
	           		 showMsg(data.msg);
	           	 }
            }
            
        });
    }

    function countTime(id) {

        if(validTime <= 0) {

            id.innerHTML=("获取验证码");
            clearInterval(t);
            return;

        }
        else {

            validTime--;
            id.innerHTML=(validTime + "秒");
        }
    }

    function showMsg(msg){

    	var show_msgs=document.body;

        var id=document.createElement("div");
            id.className="show_msg";
            id.innerHTML="<div class='re_suss'><span>"+msg+"</span></div>";
            show_msgs.appendChild(id);

            var show_Number=document.getElementsByClassName("show_msg");

            if(show_Number.length>1){

                show_msgs.removeChild(show_Number[0]);

            }

    }
    
    function addCart(pd_id) {
    	var type = $("input[name='delivery_type']:checked").val();
    	if(type != 1 && type != 2) {
    		showMsg("请选择海外直邮或者保税港出货");
    		return false;
    	}
    	$.post("/ajax/addcart", {pd_id:pd_id, deliver_type:type}, function(data) {
    		showMsg(data.msg);
    	}, 'json');
    }
    
    function buy(pd_id) {
    	var type = $("input[name='delivery_type']:checked").val();
    	if(type != 1 && type != 2) {
    		showMsg("请选择海外直邮或者保税港出货");
    		return false;
    	}
    	$.post("/ajax/addcart", {pd_id:pd_id, deliver_type:type}, function(data) {
    		if(data.status == 1) {
    			location.href="/user/cart";
    		} else {
    			showMsg(data.msg);
    		}
    	}, 'json');
    }

    //异步加载
    function showmore(options, htmltext) {
        var scrollHeight = document.body.scrollHeight;
        var availHeight = window.screen.availHeight;
        var scrollTops = document.documentElement.scrollTop || document.body.scrollTop;

        if (scrollTops + availHeight >= scrollHeight-150 && !$(options.obj).data('isloading')) {
            $(".loading").show(500);
            $(options.obj).data('isloading', true);

            var page = $(options.obj).data('page') || 1;
            var params = $.extend(options.param, {page: ++page});
            $.post(options.url, params, function (data) {
                $(options.obj).data('page', page);

                var more = htmltext(data);

                if (more) {
                    $(".loading").hide(2000);
                    $(options.obj).data('isloading', false);
                } else {
                    $(".loading").html("已加载完");
                }
            }, 'json');
        }
    }


    //查看全部功能
    function showalltr(){

        var trs=getid("tablejion").getElementsByTagName("tr");

        if(trs.length>=4){
            for(i=0;i<trs.length;i++){
                if(i<4){
                    trs[i].style.display="inline-table";
                    trs[i].style.width="100%";
                }else{
                    trs[i].style.display="none";
                }
            }
        }else{
            getid("showalljion").style.display="none";
        }

        getid("showalljion").onclick=function (){
            for(i=0;i<trs.length;i++){
                trs[i].style.display="inline-table";
                trs[i].style.width="100%";
                getid("showalljion").style.display="none";
            }
        }
    }