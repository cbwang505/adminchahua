(function ($) {



    function mylenint() {
        this.default={
            srctarget:  null,
            desttarget:null
        };
    }

    $.fn.mylen = function (option) {


        if (option) {

           $.extend( option,{srctarget:this});
        }

        var $this = this;

        $this.a = "abc";
        var data = this.data("mylen")
        if (!data) {
            this.data("mylen", (data = new mylenint(this)))
        }
        data.setdft(option);
        data["checklen"].call(data);
    }
    $.extend(mylenint.prototype, {
        checklen: function () {
            if($(this.default.desttarget))
            {

                var tha=this.default.desttarget;
              //  alert(this.default.srctarget.toString());
                this.InitLimit($(this.default.srctarget),255,true,$.proxy( function(e){
                   // alert($(this.default.desttarget).selector);
                    $(this.default.desttarget).text("还能输入" + e + "个字");
                },this));
            }
        },
        InitLimit:  function (txt, limit, isbyte, cb) {
        txt.keyup(function () {
            var str = txt.val();
            var charLen;
            var byteLen = 0;
            if (isbyte) {//原文博客：blog.csdn.net/bluceyoung
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) > 255) {
                        byteLen += 1;
                    } else {
                        byteLen++;
                    }
                }
                charLen = Math.floor((limit - byteLen));
            } else {
                byteLen = str.length;
                charLen = limit - byteLen;
            }
            cb(charLen);
        });
    },
        setdft:function(opt)
        {

            $.extend(true,this.default,opt);
           // alert(this.default.srctarget.length);
        }
    });
    $.fn.mylen.constructor = mylenint;

   function abcd()
   {

      this.a="abcde";
   }
})(jQuery)
/**
 * Created by wangcb on 2015/3/4.
 */
