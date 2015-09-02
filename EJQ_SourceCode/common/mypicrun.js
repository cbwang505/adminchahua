/**
 * Created by wangcb on 2015/4/2.
 */
(function ($) {

    var mypicruninst;

    function mypicrunint(srcelement) {
        var srctargetele = $(srcelement);

        this.mydefault = {


            srctarget: srctargetele,
            sd: $(".slides", srctargetele),
            newSlides: $('.slides > li', srctargetele),
            slider: $('.slides > li', srctargetele),
            directionNav: {
                lft: null,
                rht: null

            },
            currentSlide: 0

        };


    }

    $.fn.mypicrun = function (option) {


        if (option) {

            $.extend(option, {srctarget: this});
        }

        // var $this = this;


        var data = this.data("mypicrun");
        if (!data) {
            this.data("mypicrun", (mypicruninst = new mypicrunint(this)))
        }
        mypicruninst.setdefault(option);

        mypicruninst.attachPlugin();


    };
    $.extend(mypicrunint.prototype, {
        attachPlugin: function () {
            this.mydefault.srctarget.css({"overflow": "hidden"});
            this.mydefault.sd.width((this.mydefault.slider.length) * 100 + "%").css({float:"left",padding:"0"});
            setTimeout($.proxy(function () {
                this.mydefault.newSlides.width(this.mydefault.srctarget.width()).css({
                    "float": "left",
                    "display": "block"
                });
            }, this), 100);

            var directionNavScaffold = $('<ul class="flex-direction-nav"><li><a class="prev" href="#">pre</a></li><li><a class="next" href="#">next </a></li></ul>');
            this.mydefault.srctarget.append(directionNavScaffold);

            directionNavScaffold.css({

                margin: "0", padding: "0", "list-style": "none"
            });
            $("li>a", directionNavScaffold).css({
                width: "52px",
                height: "52px",
                margin: "-13px 0 0",
                display: "block;",
                background: " url(theme/bg_direction_nav.png) no-repeat 0 0",
                position: "absolute",
                top: "40%",
                cursor: "pointer",
                "text-indent": "-9999px"
            });
            $("li>a.next", directionNavScaffold).css({
                "background-position": "-52px 0"  ,"right": "-21px"
            });
            $("li>a.prev", directionNavScaffold).css({
                left: "-20px"
            });
            this.mydefault.directionNav = $('.flex-direction-nav li a', this.mydefault.srctarget);
    this.mydefault.directionNav.lft = $('.flex-direction-nav li .prev', this.mydefault.srctarget);
    this.mydefault.directionNav.rht = $('.flex-direction-nav li .next', this.mydefault.srctarget);
    this.mydefault.directionNav.lft.bind("click", function (event) {
        event.preventDefault();

        var target = mypicruninst.getTarget('prev');
        mypicruninst.setPosition(target);
    });
    this.mydefault.directionNav.rht.bind("click", function (event) {
        event.preventDefault();
        var target = mypicruninst.getTarget('next');
        mypicruninst.setPosition(target);

    });
    return this;
},

    getTarget
:
function (dir) {
    if (dir == "next") {
        return (this.mydefault.currentSlide == this.mydefault.slider.length - 1) ? 0 : this.mydefault.currentSlide + 1;
    } else {
        return (this.mydefault.currentSlide == 0) ? this.mydefault.slider.length - 1 : this.mydefault.currentSlide - 1;
    }
    return this;
}
,

setPosition: function (target) {
    var dimension = this.mydefault.slider.filter(':first').width();
    var slideString;
    if (this.mydefault.currentSlide == 0 && target == this.mydefault.slider.length - 1) {
        slideString = (-1 * (this.mydefault.slider.length - 1 )) * dimension + "px";
    } else if (this.mydefault.currentSlide == this.mydefault.slider.length - 1 && target == 0) {
        slideString = "0px";

    } else {
        slideString = (-1 * (target)) * dimension + "px";
    }
    this.mydefault.sd.css({"marginLeft": slideString});
    this.mydefault.currentSlide = target;
}
,


setdefault: function (opt) {

    $.extend(true, this.mydefault, opt);

    // alert(this.default.srctarget.length);
}
})
;

$.fn.mypicrun.constructor = mypicrunint;

})
(jQuery);
/**
 * Created by wangcb on 2015/3/4.
 */
/**
 * Created by wangcb on 2015/3/5.
 */
/**
 * Created by wangcb on 2015/3/28.
 */
/**
 * Created by wangcb on 2015/3/30.
 */
