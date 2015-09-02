(function ($) {

    var mypoolinst;

    function mypoolint(srcelement) {
        var srctargetele = $(srcelement);

        this.mydefault = {
            blocksOptions: {

                offsetX: 5,
                offsetY: 5,
                blockElement: 'div'
            },
            numOfCol: 5,
            srctarget: srctargetele,
            blockarr: [],
            cellstore: [],
            colwidth: null,
            scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
            loadfin:false
        };


    }

    $.fn.mypool = function (option) {


        if (option) {

            $.extend(option, {srctarget: this});
        }
        var container = $(this);
        option.colwidth = container.width() / option.numOfCol;
        // var $this = this;


        var data = this.data("mypool")
        if (!data) {
            this.data("mypool", (mypoolinst = new mypoolint(this)))
        }
        mypoolinst.setdefault(option);

        mypoolinst.attachPlugin();
        window.onscroll = function () {
            // 为提高性能，滚动前后距离大于100像素再处理
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (Math.abs(scrollTop - mypoolinst.mydefault.scrollTop) > 100) {
                mypoolinst.mydefault.scrollTop = scrollTop;
                mypoolinst.appendDetect();
            }else
            {
                 if(reachBottom())
                 {
                     mypoolinst.mydefault.scrollTop = scrollTop;
                     mypoolinst.appendDetect();

                 }
            }

        };

        $(window).resize(function() {
            //  var winWidth = $(window).width();

          mypoolinst.winresize();
        });
        function reachBottom() {
            var scrollTop = 0;
            var clientHeight = 0;
            var scrollHeight = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight: document.documentElement.clientHeight;
            } else {
                clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight: document.documentElement.clientHeight;
            }
            scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            if (scrollTop + clientHeight == scrollHeight) {
                return true;
            } else {
                return false;
            }
        }
    }
    $.extend(mypoolint.prototype, {
        attachPlugin: function () {
            this.mydefault.blockarr.splice(0, this.mydefault.blockarr.length);
            this.createEmptyBlockarr();
            if(mypoolinst.mydefault.cellstore.length==0) {
                this.mydefault.srctarget.children("div").each(function (e) {


                    mypoolinst.mydefault.cellstore.push(this.outerHTML);
                });


            };
            this.mydefault.srctarget.children("div").each(function (e) {


                mypoolinst.setPosition.apply(mypoolinst, $(this));
            });

            var heightarr = this.getHeightArr(0, mypoolinst.mydefault.blockarr.length);
            this.mydefault.srctarget.height(heightarr[1] + mypoolinst.mydefault.blocksOptions.offsetY);
            return this;
        },

        winresize:function()
        {
            var winWidth =   document.body.clientWidth
            var conWidth;
            var col;
            if(winWidth < 660) {
                conWidth = 440;
                col = 2
            } else if(winWidth < 880) {
                conWidth = 660;
                col = 3
            } else if(winWidth < 1100) {
                conWidth = 880;
                col = 4;
            } else {
                conWidth = 1100;
                col = 5;
            }
              this.mydefault.numOfCol=col;


                $('#container').width(conWidth);


            this.attachPlugin();
            return this;
        },
        appendDetect: function () {


            var eleColumn = this.getHeightArr(0, this.mydefault.blockarr.length);

            if (eleColumn) {
                if (eleColumn[1] < this.mydefault.scrollTop + (window.innerHeight || document.documentElement.clientHeight)) {

                    for (var i = 0; i < this.mydefault.numOfCol; i++) {
                        this.appendcell();
                    }
                }
            }


            return this;
        },
        appendcell: function () {
            var celllen = mypoolinst.mydefault.cellstore.length;

            var radm = Math.random();

            var rdm = parseInt(radm * celllen + 1)

            var appendele = document.createElement("div");
            $(appendele).addClass("newelement");
            $(appendele).html(this.mydefault.cellstore[rdm])

            this.mydefault.srctarget.append($(appendele));

            $(appendele).each(function () {
                mypoolinst.setPosition.apply(mypoolinst, $(this));
            });
        },
        createEmptyBlockarr: function () {
            //empty blockarr

            for (var i = 0; i < this.mydefault.numOfCol; i++) {
                this.blockarrPush('empty-' + i, i, 0, 1, -this.mydefault.blocksOptions.offsetY);
            }
        },
        blockarrPush: function (id, x, y, width, height) {
            //define block object based on block width
            for (var i = 0; i < width; i++) {
                var block = new Object();
                block.x = x + i;
                block.size = width;
                block.endY = y + height + this.mydefault.blocksOptions.offsetY * 2;

                this.mydefault.blockarr.push(block);
            }
        },
        blockarrRemove: function (x, num) {
            for (var i = 0; i < num; i++) {
                //remove block beside
                var index = this.getBlockIndex(x + i, 'x');
                this.mydefault.blockarr.splice(index, 1);
            }
        },
        getBlockIndex: function (value, type) {

            for (var i = 0; i < this.mydefault.blockarr.length; i++) {
                var obj = this.mydefault.blockarr[i];
                if (type == "x" && obj.x == value) {
                    return i;
                } else if (type == "endY" && obj.endY == value) {
                    return i;
                }
            }
        },
        getHeightArr: function (x, size) {
            var temparr = [];
            for (var i = 0; i < size; i++) {
                temparr.push(this.mydefault.blockarr[this.getBlockIndex(x + i, 'x')].endY);
            }
            var min = Math.min.apply(Math, temparr);
            var max = Math.max.apply(Math, temparr);

            return [min, max, temparr.indexOf(min)];
        },
        getBlockPostion: function (size) {

            //if block width is not default 1
            //extra algorithm check
            if (size > 1) {
                //prevent extra loop
                var arrlimit = this.mydefault.blockarr.length - size;
                //define temp variable
                var defined = false;
                var tempHeight, tempIndex;

                for (var i = 0; i < this.mydefault.blockarr.length; i++) {
                    var obj = this.mydefault.blockarr[i];
                    var x = obj.x;

                    //check for block within range only
                    if (x >= 0 && x <= arrlimit) {
                        var heightarr = this.getHeightArr(x, size);

                        //get shortest group blocks
                        if (!defined) {
                            defined = true;
                            tempHeight = heightarr;
                            tempIndex = x;
                        } else {
                            if (heightarr[1] < tempHeight[1]) {
                                tempHeight = heightarr;
                                tempIndex = x;
                            }
                        }
                    }
                }
                return [tempIndex, tempHeight[1]];
            } else { //simple check for block with width 1
                tempHeight = this.getHeightArr(0, this.mydefault.blockarr.length);
                return [tempHeight[2], tempHeight[0]];
            }
        },
        setPosition: function (obj) {
            //check block size

            //define block data
            var pos = this.getBlockPostion(1);
            var blockWidth = this.mydefault.colwidth - ($(obj).outerWidth() - $(obj).width());
            //  var blockWidth = this.mydefault.colwidth;
            //update style first before get object height
            $(obj).css({
                'width': blockWidth - this.mydefault.blocksOptions.offsetX * 2,
                'left': pos[0] * this.mydefault.colwidth,
                'top': pos[1],
                'position': 'absolute'
            });
            //  alert(1);
            var blockHeight = $(obj).outerHeight();

            //modify blockarr for new block
            this.blockarrRemove(pos[0], 1);
            this.blockarrPush($(obj).attr('id'), pos[0], pos[1], 1, blockHeight);
        },


        setdefault: function (opt) {

            $.extend(true, this.mydefault, opt);

            // alert(this.default.srctarget.length);
        }
    });

    $.fn.mypool.constructor = mypoolint;

})(jQuery)
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
