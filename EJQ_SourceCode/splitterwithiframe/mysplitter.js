(function ($) {


    function mysplitterint(srcelement) {
        var splittersrc = $(srcelement).css({position: "relative"});
        var panes = $(">*", splittersrc[0]).css({
            position: "absolute", 			// positioned inside splitter container
            "z-index": "1",					// splitbar is positioned above
            "-moz-outline-style": "none"	// don't show dotted outline
        });
        this.mydefault = $.extend({}, {
            leftwidth: null,
            borderwith: 0,
            A: $(panes[0]),
            B: $(panes[1]),
            splitter: splittersrc,
            bar: null,
            mask: null,
            fullHeight:false
        });


    }

    $.fn.mysplitter = function (option) {


        if (option) {

            $.extend(option, {srctarget: this});
        }

        var $this = this;


        var data = this.data("mysplitter")
        if (!data) {
            this.data("mysplitter", (data = new mysplitterint(this)))
        }
        data.setdefault(option);

        data.attachPlugin();

    }
    $.extend(mysplitterint.prototype, {
        attachPlugin: function () {

            var focuser = $('<a href="javascript:void(0)"></a>')
                .attr("title", "vsplitbar")


            var barsrc = $('<div></div>')
                .insertAfter(this.mydefault.A).css("z-index", "1000").append(focuser)
                .attr({"class": "vsplitbar", unselectable: "on"})
                .css({
                    position: "absolute", "user-select": "none", "-webkit-user-select": "none",
                    "-khtml-user-select": "none", "-moz-user-select": "none", "cursor": "col-resize"
                }).bind("mousedown", $.proxy(this.startSplitMouse, this));
            this.mydefault.bar = barsrc;
            var mask;
            mask = $('<div></div>').insertAfter(document.body).css({

                position: 'absolute',
                left: '0px',
                top: '0px',
                zIndex: 900,
                width: '100%',
                height: '100%',
                display:'none',
               backgroundColor: 'transparent',
                "-webkit-user-select": "none",
                "-khtml-user-select": "none", "-moz-user-select": "none",unselectable: "on",
                    opacity:'0.0'
            }).bind("selectstart",function(e){
                e.preventDefault();



            });

            this.mydefault.mask = mask;

            if (this.mydefault.leftwidth) {
                var initPos = this.mydefault.leftwidth;
            } else {
                var initPos = Math.round((this.mydefault.splitter[0]["offsetWidth"] - this.mydefault.bar[0]["offsetWidth"]) / 2);
            }//  alert(initPos);

            this.mydefault.A._pane = "Left";
            this.mydefault.B._pane = "Right";
            // alert(this.mydefault.A[0].outerHTML);
            function dimSum(jq, dims) {
                // Opera returns -1 for missing min/max width, turn into 0
                var sum = 0;
                for (var i = 1; i < arguments.length; i++) {
                    sum += Math.max(parseInt(jq.css(arguments[i])) || 0, 0);

                }
                return sum;
            }

            var borderwd =this.mydefault.borderwith;
            $.each([this.mydefault.A, this.mydefault.B], function () {

                this._min = dimSum(this, "min-width");
                this._max = dimSum(this, "min-width") || 9999;
                this.css({

                    "-webkit-user-select": "none",
                    "-khtml-user-select": "none", "-moz-user-select": "none"
                })
                // this._init =   parseInt($.curCSS(this[0],"width"))
                //  alert(this);
            });
            if (this.mydefault.splitter) {

                this.mydefault.splitter.bind("resize", $.proxy(function (e, size) {
                    // Custom events bubble in jQuery 1.3; don't get into a Yo Dawg


                    if (e.target != this.mydefault.splitter[0]) {
                        return
                    }
                    ;
                    // alert(size);
                    // Determine new width/height of splitter container
                    this.mydefault.splitter.ofHeight = this.mydefault.splitter[0]["offsetHeight"] - borderwd;
                    this.mydefault.splitter.ofWidth = this.mydefault.splitter[0]["offsetWidth"] - borderwd;
                    // Bail if splitter isn't visible or content isn't there yet
                    //  if (splitter.ofHeight <= 0 || splitter.ofWidth <= 0) return;
                    // Re-divvy the adjustable dimension; maintain size of the preferred pane
                    this.resplit(size);
                }, this)).trigger("resize", initPos);
            }
            if(this.mydefault.fullHeight)
            {
                this.mydefault.splitter.height($().clientHeight);


            }
        },
        startSplitMouse: function (evt) {


            this.mydefault.bar.addClass('active');
            this.mydefault.A._posSplit = this.mydefault.A[0]["offsetWidth"] - evt["pageX"];
            //    $(document)
           this.mydefault.mask.css({display:'block'})
           // $(document)
           this.mydefault.mask.bind("mousemove", $.proxy(this.doSplitMouse, this))
            $(document).bind("mouseup", $.proxy(this.endSplitMouse, this));
        },
        doSplitMouse: function (evt) {
            var newPos = this.mydefault.A._posSplit + evt["pageX"];

            $.proxy(this.resplit(newPos), this);
            ;
        },

        endSplitMouse: function (evt) {
            this.mydefault.bar.removeClass('active');
            var newPos = this.mydefault.A._posSplit + evt["pageX"];

         this.mydefault.mask.css({display:'none'})

          //  $(document)
            this.mydefault.mask.unbind("mousemove", $.proxy(this.doSplitMouse, this))
            $(document).unbind("mouseup", $.proxy(this.endSplitMouse, this));
        },
        resplit: function (newPos) {

            this.mydefault.bar.ofWidth = this.mydefault.bar[0].offsetWidth;		// bar size may change during dock
            this.mydefault.bar.css("left", newPos).css("height", this.mydefault.splitter.ofHeight);
            this.mydefault.A.css("left", 0).css("width", newPos).css("height", this.mydefault.splitter.ofHeight);
            this.mydefault.B.css("left", newPos + this.mydefault.bar.ofWidth)
                .css("width", this.mydefault.splitter.ofWidth - this.mydefault.bar.ofWidth - newPos).css("height", this.mydefault.splitter.ofHeight);

        },

        setdefault: function (opt) {

            $.extend(true, this.mydefault, opt);
            // alert(this.mydefault.srctarget.length);
        }
    });
    $.fn.mysplitter.constructor = mysplitterint;

})(jQuery)
/**
 * Created by wangcb on 2015/3/4.
 */
/**
 * Created by wangcb on 2015/3/5.
 */
