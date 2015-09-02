(function ($) {


    function mycropint(srcelement) {
        var srctargetele = srcelement;

        this.mydefault = {
            srctarget: srctargetele,
            width: 500,
            height: 375,
            bgColor: '#000',
            overlayColor: '#000',
            selector: {
                x: 0,
                y: 0,
                w: 229,
                h: 100,
                aspectRatio: false,
                centered: false,
                borderColor: 'yellow',
                borderColorHover: 'red',
                bgInfoLayer: '#FFF',
                infoFontSize: 10,
                infoFontColor: 'blue',
                showPositionsOnDrag: true,
                showDimetionsOnDrag: true,
                maxHeight: null,
                maxWidth: null,
                startWithOverlay: false,
                hideOverlayOnDragAndResize: true,
                onSelectorDrag: null,
                onSelectorDragStop: null,
                onSelectorResize: null,
                onSelectorResizeStop: null,
                selectsrc:null
            },
            image: {
                source: '',
                rotation: 0,
                width: 0,
                height: 0,
                minZoom: 10,
                maxZoom: 150,
                startZoom: 0,
                x: 0,
                y: 0,
                useStartZoomAsMinZoom: false,
                snapToContainer: false,
                onZoom: null,
                onRotate: null,
                onImageDrag: null
            },
            enableRotation: true,
            enableZoom: true,
            zoomSteps: 1,
            rotationSteps: 5,
            expose: {
                slidersOrientation: 'vertical',
                zoomElement: '',
                rotationElement: '',
                elementMovement: '',
                movementSteps: 5
            }
        };


    }

    $.fn.mycrop = function (option) {


        if (option) {

            $.extend(option, {srctarget: this});
        }

        // var $this = this;


        var data = this.data("mycrop")
        if (!data) {
            this.data("mycrop", (data = new mycropint(this)))
        }
        data.setdefault(option);

        data.attachPlugin();

    }
    $.extend(mycropint.prototype, {
        attachPlugin: function () {

             this.mydefault.srctarget.css({
                 'width': this.mydefault.width,
                 'height': this.mydefault.height,
                 'background-color': this.mydefault.bgColor,
                 'overflow': 'hidden',
                 'position': 'relative',
                 'border': '2px solid #333'
             });
            $container = $("<div />").attr("id", "k").css({
                'width':this.mydefault.width,
                'height':this.mydefault.height,
                'position': 'absolute'
            });
            var image = document.createElement("img");
            $(image).attr('src', this.mydefault.image.source);
            $(image).css({
                'position': 'absolute',
                'left': this.mydefault.image.x,
                'top': this.mydefault.image.y,
                'width': this.mydefault.width,
                'height': this.mydefault.height
            });
            $container.append($(image))

            this.mydefault.srctarget.append($container);

            this.createSelector();
        },
        createSelector : function(){
            if (this.mydefault.selector.centered) {
                this.mydefault.selector.y = (this.mydefault.height / 2)
                - (this.mydefault.selector.h / 2);
                this.mydefault.selector.x = (this.mydefault.width / 2)
                - (this.mydefault.selector.w / 2);
            }

            $selector = document.createElement("div")
            this.mydefault.selector.selectsrc= $($selector);
             $($selector).attr('id', this.mydefault.srctarget.id + '_selector')
                .css(
                {
                    'width':this.mydefault.selector.w,
                    'height': this.mydefault.selector.h,
                    'top': this.mydefault.selector.y
                    + 'px',
                    'left': this.mydefault.selector.x
                    + 'px',
                    'border': '1px dashed '
                    +this.mydefault.selector.borderColor,
                    'position': 'absolute',
                    'cursor': 'move'
                })
                .mouseover(
                function () {
                    $(this)
                        .css(
                        {
                            'border': '1px dashed '
                            + this.mydefault.selector.borderColorHover
                        })
                })
                .mouseout(
                function () {
                    $(this)
                        .css(
                        {
                            'border': '1px dashed '
                            + this.mydefault.selector.borderColor
                        })
                });
            // Add draggable to the selector
            $($selector)
                .draggable({
                    containment: 'parent',
                    iframeFix: true,
                    refreshPositions: true,
                    drag: function (event, ui) {
                        // Update position of the overlay
                    /*    this.mydefault.selector.x = ui.position.left;
                        this.mydefault.selector.y = ui.position.top;
                      //  makeOverlayPositions(ui);
                        this.mydefault.selector.selectsrc .css(
                            {
                                'width':this.mydefault.selector.w,
                                'height': this.mydefault.selector.h,
                                'top': this.mydefault.selector.y
                                + 'px',
                                'left': this.mydefault.selector.x
                                + 'px',
                                'border': '1px dashed '
                                +this.mydefault.selector.borderColor,
                                'position': 'absolute',
                                'cursor': 'move'
                            })*/

                    },
                    stop: function (event, ui) {
                        // hide overlay

                           // hideOverlay();

                    }
                });
            $($selector)
                .resizable({
                    aspectRatio: this.mydefault.selector.aspectRatio,
                    maxHeight: this.mydefault.selector.maxHeight,
                    maxWidth: this.mydefault.selector.maxWidth,
                    minHeight: this.mydefault.selector.h,
                    minWidth:this.mydefault.selector.w,
                    containment: 'parent',
                    resize: function (event, ui) {
                        // update ovelay position
                        this.mydefault.selector.w = $selector
                            .width();
                        this.mydefault.selector.h = $selector
                            .height();
                      //  makeOverlayPositions(ui);


                    },
                    stop: function (event, ui) {
                    }
                });
            this.mydefault.srctarget.append($selector);

        },
        setdefault: function (opt) {

            $.extend(true, this.mydefault, opt);
            // alert(this.default.srctarget.length);
        }
    });
    $.fn.mycrop.constructor = mycropint;

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
