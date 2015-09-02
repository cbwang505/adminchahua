(function ($) {


    function myselectinit(srcelement) {
        var srctargetele = $(srcelement);

        this.mydefault = {


            srcTarget: srctargetele,
            header: true,
            height: 175,
            minWidth: 225,
            classes: '',
            checkAllText: '全选',
            checkAllIDClass: "mycka",
            uncheckAllText: '全不选',
            uncheckAllIDClass: "myckna",
            noneSelectedText: '==请选择==',
            selectedText: '# 项已选择',
            selectedList: 0,
            show: null,
            hide: null,
            autoOpen: false,
            multiple: true,
            position: {},
            appendTo: "body",
            button: null,
            buttonlabel: null,
            isOpen: true,
            changeSelectText: true,
            onChangeValueFunction: null,
            onChangeTextFunction:null

        }

        return this;

    }

    $.fn.myselect = function (option) {

        if (typeof(option) == "string") {
            var myselectinst = this.data("myselect");

            if (myselectinst) {
                if ($.isFunction(myselectinst[option])) {
                    return myselectinst[option].apply(myselectinst, Array.prototype.slice.call(arguments, 1));
                }

            }
        }
        else {

            // var $this = this;


            var data = this.data("myselect");
            if (!data) {
                this.data("myselect", new myselectinit(this));
            }
            this.data("myselect").setdefault(option);

            this.data("myselect").attachPlugin();


            return this;
        }

    };
    $.extend(myselectinit.prototype, {
        attachPlugin: function () {

            this.startCreatElement();
            this.removeSrcElement();
            this.initPostion();
        },
        startCreatElement: function () {
            var buttonEle = (this.mydefault.button = $('<button type="button"  style="width:227px;color: #eb8f00;font-weight: bold;border:1px solid #fbd850;background-color: #FFFFFF;height: 27px;text-align: center;font-size: 1.1em"></button>'))
            buttonEle.insertAfter(this.mydefault.srcTarget);

            var buttonlabel = (this.mydefault.buttonlabel = $('<span />'))
                .html(this.mydefault.noneSelectedText)
                .appendTo(buttonEle);
            var menu = (this.mydefault.mymenu = $(' <div style="padding: 3px;border: 1px solid #dddddd;background-color: #eeeeee;width:219px;"></div>'))

                .appendTo($(this.mydefault.appendTo));
            var headerLinkContainer = (this.mydefault.headerLinkContainer = $(' <ul style="position: relative;width:217px;color: #2779aa;font-weight: bold;border: 1px solid #e78f08;background-color:#f6a828;height: 21px;text-align: center;font-size: 1.1em;list-style: none;padding: 0px;margin:0px"> <li style="float: left;font-size: 11px;color: white;position: absolute;top: 4px;width: 50px;left: 28px;"> <lable style=""> <a href="#"  class="' + this.mydefault.checkAllIDClass + '"  style="color: white;font-size: 12px;text-decoration: none">' + this.mydefault.checkAllText + '</a> </lable> </li> <li style="float: left;font-size: 11px;padding-left: 8px;color:white;position: absolute;top: 4px;width: 100px ;left: 80px;"> <lable style="">  <a href="#"  class="' + this.mydefault.uncheckAllIDClass + '"  style="color: white;font-size: 12px;text-decoration: none">' + this.mydefault.uncheckAllText + '</a> </li> </ul>'))
                .appendTo(menu);
            var checkboxContainer = (this.mydefault.checkboxContainer = $('  <ul  style="height: 175px;overflow-y: auto;position:relative;margin: 0px;padding: 0px;list-style:none;" class="ui-multiselect-checkboxes ui-widget">'))
                .appendTo(menu);
            this.dorefresh();
            this.doSetButtonWidth();


            this.bindHeaderCheck();

            this.bingContentCheck();
            setTimeout($.proxy(function () {

                this.updateSelectState();
            }, this), 10)

        },
        removeSrcElement: function () {

            this.mydefault.srcTarget.remove();
        },
        dorefresh: function () {


            var el = this.mydefault.srcTarget;
            var that = this;
            el.find('option').each(function (i) {
                var myid = "option" + i;
                var mytitle = $(this).text();
                var myvalue = $(this).val();

                var checkboxli = $(' <li class=" "><label for="ui-multiselect-sela-option-3" title="" class="ui-corner-all"><input id="' + myid + '" name="multiselect_sela" type="checkbox" value="' + myvalue + '" title=""><span>' + mytitle + '</span></label></li>')
                    .hover(function () {

                        $(this).addClass("ui-state-hover");
                    }, function () {


                        $(this).removeClass("ui-state-hover");
                    })

                that.mydefault.checkboxContainer.append(checkboxli);
            });


        },
        updateSelectState: function () {
            var allCheckElements = this.mydefault.checkboxContainer.find('input[type="checkbox"]');
            var allCheckedElements = this.mydefault.checkboxContainer.find('input[type="checkbox"]').filter(":checked");
            var allCheckedElementsTexts=allCheckedElements.siblings('span');
            var allLen = allCheckElements.length;
            var checkedLen = allCheckedElements.length;
            var checkedValues = $.map(allCheckedElements, function (n) {

                return $(n).val();
            })

            var checkedTexts= $.map(allCheckedElementsTexts, function (n) {

                return $(n).text();
            })
            if (this.mydefault.changeSelectText) {

                if (checkedLen > 0) {
                    var tempValue = this.mydefault.selectedText.replace("#", checkedLen);
                    this.mydefault.buttonlabel.html(tempValue);
                } else {

                    this.mydefault.buttonlabel.html(this.mydefault.noneSelectedText);
                }
            }

            if ($.isFunction(this.mydefault.onChangeValueFunction)) {
                this.mydefault.onChangeValueFunction(checkedValues);
            }
           if($.isFunction(this.mydefault.onChangeTextFunction))
           {

               this.mydefault.onChangeTextFunction(checkedTexts);
           }
        }
        ,
        bindHeaderCheck: function () {

            var that = this;
            this.mydefault.button.bind("click", $.proxy(function () {
                this.toggleOpenClose();
            }, this));
            this.mydefault.headerLinkContainer.delegate("a." + this.mydefault.checkAllIDClass, "click", function (e) {
                e.preventDefault();
                that.mydefault.mymenu.find('input[type="checkbox"]').each(function () {

                    $(this).attr("checked", "checked");
                });
                setTimeout($.proxy(function () {

                    this.updateSelectState();
                }, that), 10)
            });
            this.mydefault.headerLinkContainer.delegate("a." + this.mydefault.uncheckAllIDClass, "click", function (e) {
                that.mydefault.mymenu.find('input[type="checkbox"]').each(function () {

                    $(this).attr("checked", false);
                });
                setTimeout($.proxy(function () {

                    this.updateSelectState();
                }, that), 10)
            });
            this.mydefault.headerLinkContainer.find("a." + this.mydefault.checkAllIDClass).hover(function (e) {
                $(this).css({"text-decoration": "underline"});

            }, function (q) {

                $(this).css({"text-decoration": "none"});
            });
            this.mydefault.headerLinkContainer.find("a." + this.mydefault.uncheckAllIDClass).hover(function (e) {
                $(this).css({"text-decoration": "underline"});

            }, function (q) {

                $(this).css({"text-decoration": "none"});
            });


        }
        ,

        bingContentCheck: function () {

            var that = this;
            this.mydefault.checkboxContainer.delegate("li", "click", function () {

                $(this).find('input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        $(this).removeAttr("checked");
                    } else {

                        $(this).attr("checked", true);
                    }
                });

                setTimeout($.proxy(function () {

                    this.updateSelectState();
                }, that), 10)
            });
            this.mydefault.checkboxContainer.find('input[type="checkbox"]').change(function () {

                if ($(this).is(":checked")) {
                    $(this).removeAttr("checked");
                } else {

                    $(this).attr("checked", true);
                }
                setTimeout($.proxy(function () {

                    this.updateSelectState();
                }, that), 10)

            });
        }
        ,
        doSetButtonWidth: function () {
            var mywd = $(this.mydefault.button).outerWidth();
            $(this.mydefault.mymenu).outerWidth(mywd);
        }
        ,
        toggleOpenClose: function () {
            if (this.mydefault.isOpen) {

                this.mydefault.mymenu.hide();

                this.mydefault.isOpen = false;
            } else {

                this.mydefault.mymenu.show();
                this.mydefault.isOpen = true;
            }


        }
        ,

        initPostion: function () {

            var pos = this.mydefault.button.offset();

            this.mydefault.mymenu.css({
                top: pos.top + this.mydefault.button.outerHeight(),
                left: pos.left,
                position: "absolute"
            });

        }
        ,
        setdefault: function (opt) {

            $.extend(true, this.mydefault, opt);

            // alert(this.default.srctarget.length);
        }
    })
    ;

    $.fn.myselect.constructor = myselectinit;

})
(jQuery);