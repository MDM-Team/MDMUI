define(function (require, exports, module) {
    require('ui/basic');

    ;(function ($) {
        var _tipsTpl = '<div class="tmb-poptips tmb-poptips-<%=type%>">' +
            '<div class="tmb-poptips-cnt">' +
            '<i></i><%=content%>' +
            '</div>' +
            '</div>';

        var defaults = {
            content: '',
            stayTime: 1000,
            type: 'info',
            callback: function () {}
        }
        var Tips = function (el, option, isFromTpl) {
            var self = this;
            this.element = $(el);
            this._isFromTpl = isFromTpl;
            this.elementHeight = $(el).height();

            this.option = $.extend(defaults, option);
            $(el).css({
                "-webkit-transform": "translateY(-" + this.elementHeight + "px)"
            });
            setTimeout(function () {
                $(el).css({
                    "-webkit-transition": "all .5s"
                });
                self.show();
            }, 20);

        }
        Tips.prototype = {
            show: function () {
                var self = this;
                // self.option.callback("show");
                self.element.trigger($.Event("tips:show"));
                this.element.css({
                    "-webkit-transform": "translateY(0px)"
                });
                if (self.option.stayTime > 0) {
                    setTimeout(function () {
                        self.hide();
                    }, self.option.stayTime)
                }
            },
            hide: function () {
                var self = this;
                self.element.trigger($.Event("tips:hide"));
                this.element.css({
                    "-webkit-transform": "translateY(-" + this.elementHeight + "px)"
                });
                setTimeout(function () {
                    self._isFromTpl && self.element.remove();
                }, 500);
            }
        }

        function Plugin(option) {
            return $.adaptObject(this, defaults, option, _tipsTpl, Tips, "tips");
        }

        $.fn.tips = $.tips = Plugin;
    })(window.Zepto);
});