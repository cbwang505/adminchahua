/**
 * Created by wangcb on 2015/4/27.
 */
/**
 * Created by wangcb on 2015/4/2.
 */
(function ($) {

    var myframetabinst;

    function myframetabinit(srcelement) {
        var srctargetele = $(srcelement);

        this.mydefault = {


            tabID: "Tabs",
            frameID: "Frames",
            activeClass: "selected",
            lockClass: "locked",
            leftID: "Left",
            rightID: "Right",
            resetID: "Reset",
            closeID: "Close",
            tabs: srctargetele,
            frames: $("#myframecontainer"),
            autoresize: true,
            defaultliwidth: 135,
            prewidth: null,
            maxli: null
        };


        return this;

    }

    $.fn.myframetab = function (option) {

        if (typeof(option) != "undefined") {
            if (myframetabinst[option]) {
                return myframetabinst[option].apply(myframetabinst, Array.prototype.slice.call(arguments, 1));
            }
        }
        else {
            if (option) {

                $.extend(option, {srctarget: this});
            }

            // var $this = this;


            var data = this.data("myframetab");
            if (!data) {
                this.data("myframetab", (myframetabinst = new myframetabinit(this)))
            }
            myframetabinst.setdefault(option);

            myframetabinst.attachPlugin();


            return this;
        }

    };
    $.extend(myframetabinit.prototype, {
        attachPlugin: function () {

            var _this = this;
            $("#" + this.mydefault.leftID).click(function () {
                _this.move({action: 'left'});
            });
            $("#" + this.mydefault.rightID).click(function () {
                _this.move({action: 'right'});
            });
            $("#" + this.mydefault.resetID).click(function () {
                _this.move({action: 'reset'});
            });
            $("#" + this.mydefault.closeID).click(function () {
                _this.closeAll();
            });
            this.getcurrentmaxlicount();
            return this;

        },
        getcurrentmaxlicount: function () {

            var alltabswidth = $(".maxWidth").width();
            var addcount = Math.round((alltabswidth - this.mydefault.prewidth) / this.mydefault.defaultliwidth);
            this.mydefault.maxli = Math.round(alltabswidth / this.mydefault.defaultliwidth);


            this.mydefault.prewidth = alltabswidth;
        },

        add: function (option) {


            if (this.isExist(option.id)) {
                this.liclick("tab" + option.id);
                return false;
            }
            this.addTab(option);
            this.addFrame(option);
        },
        isExist: function (id) {
            return $("#tab" + id).length > 0;
        },

        addTab: function (option) {
            var _this = this;
            var tabid = "tab" + option.id;
            var urlimg = option.urlimg;
            var active = this.mydefault.activeClass;
            var title = option.title ? option.title : "";
            var name = this.getCutName(option.name);
            var args = {id: tabid, name: name, active: active, title: title};
            var html = this.getTabHtml(args);
            var element = $(html);

            $("span.text > span", element).css(
                {
                    "background": "url('" + urlimg + "') no-repeat",
                    "padding-left": "20px",
                    "background-position-y": "-2px"
                }
            );

            $(element).unbind("click").bind("click", function () {


                _this.liclick(tabid);

            });


            element.find("span").unbind("click").bind("click", function () {
                _this.liclose($(this).parent().attr("id"));
                return false;
            });

            if ($("#" + tabid).length == 0) {
                if(this.mydefault.autoresize) {

                    var lilenghcount = 0;
                    this.mydefault.tabs.find("li:visible").each(function () {
                        lilenghcount += $(this)[0].offsetWidth;
                    })

                    if(lilenghcount> document.body.clientWidth-50)
                    {

                        alert("已超过最大标签页限制,请先关闭部分标签页再添加标签页");
                    }
                    else
                    {
                        element.appendTo(this.mydefault.tabs);
                        _this.liclick(tabid);

                    }
                }else {
                    element.appendTo(this.mydefault.tabs);
                    _this.liclick(tabid);
                }
            } else {

                _this.liclick(tabid);
            }
        },
        pinactiveli: function () {

            this.click(this.mydefault.tabs.find("." + this.mydefault.activeClass).attr("id"));
        },
        getTabHtml: function (o) {

            var li = "<li id='" + o.id + "'> <a href=\"#\" class='" + o.active + "title='" + o.title + "'>" + o.name + "</a><span></span>";
            li += "</li> \n";
            return li;
        },
        liclose: function (id) {
            var activeClass = this.mydefault.activeClass;
            var tab = $("#" + id);

            var isActive = tab.children("a").hasClass(activeClass);

            var frame = $("#" + this.getFrameID(id.toString().substring(3)));

            if (isActive) {
                if (tab.next().is("li")) {
                    this.liclick(tab.next().attr("id"));
                } else if (tab.prev().is("li")) {
                    this.liclick(tab.prev().attr("id"));
                }
            }
            tab.remove();// ɾ��Tab
            frame.remove();// ɾ��IFrame
        }
        ,
        getFrameID: function (id) {
            return "Frame" + id;
        },
        getCutName: function (name) {
            var text = String(name);
            if (text.length > 6) {
                return text.substring(0, 6) + "...";
            }
            return text;
        }
        ,
        liclick: function (id) {
            this.mydefault.tabs.find("li>a").removeClass(this.mydefault.activeClass);
            $("#" + id).children("a").addClass(this.mydefault.activeClass);

            if ($("#" + id).is(":hidden")) {


                $("#" + id).show();

                $("#" + id).prevAll().hide();
                $("#" + id).nextAll().show();
            }


                 if (this.mydefault.tabs.find("li:visible").index($("#" + id)) > this.mydefault.maxli) {
                     //  this.hidepreli(id);

                 }


            this.loadFrame(id.toString().substring(3));
        }
        ,
        hidepreli: function (id) {
            if (this.mydefault.tabs.find("li:visible").length > this.mydefault.maxli) {
                var nowstart = this.mydefault.tabs.find("li:visible").index($("#" + id)) + 1 - this.mydefault.maxli;
                // this.mydefault.tabs.find("li:visible").eq(nowstart).hide();
                this.mydefault.tabs.find("li:visible:lt(" + nowstart + ")").hide();
            }
        },
        loadFrame: function (id) {
            var id = this.getFrameID(id);
            this.mydefault.frames.find("iframe").hide();
            $("#" + id).show();
        },
        addFrame: function (option) {
            var url = option.url;
            var id = this.getFrameID(option.id);
            var frame = option.frame || {};
            var style = frame.style || "width:100%;height:100%";
            var name = frame.name || id;
            var frame = "<iframe id='" + id + "' name='" + name + "' frameborder='0' style='" + style + "' src='" + url + "'></iframe>";
            $(frame).appendTo(this.mydefault.frames);
            this.loadFrame(option.id);
        }
        ,

        closeAll: function () {
            var _this = this;

            this.mydefault.tabs.find("li").each(function () {
                $(this).remove();
                var id = _this.getFrameID(this.id);
                $("#" + id).remove();
            });
            /*  var activeClass = this.mydefault.activeClass;

             if( this.tabs.find("." + activeClass).size() == 0 ){
             this.tabs.find("li:last").click();
             }*/
        },
        move: function (option) {

            if (option.action == "left") {
                this.mydefault.tabs.find("li:hidden:last").show();
            } else if (option.action == "right") {
                if (this.mydefault.tabs.find("li:visible").length > 1) {
                    this.mydefault.tabs.find("li:visible:first").hide();
                }
            } else if (option.action == "reset") {
                this.mydefault.tabs.find("li").show();
            }
        },

        setdefault: function (opt) {

            $.extend(true, this.mydefault, opt);

            // alert(this.default.srctarget.length);
        }
    })
    ;

    $.fn.myframetab.constructor = myframetabinit;

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
