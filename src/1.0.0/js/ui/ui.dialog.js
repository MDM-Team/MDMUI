define(function (require, exports, module) {
    require('ui/basic');;
    (function ($) {
       
        var _dialogTpl = '<div class="tmb-dialog">' +
            '<div class="tmb-dialog-cnt">' +
            '<div class="tmb-dialog-bd">' +
            '<div>' +
            '<h4><%=title%></h4>' +
            '<div><%=content%></div></div>' +
            '</div>' +
            '<div class="tmb-dialog-ft tmb-btn-group">' +
            '<% for (var i = 0; i < button.length; i++) { %>' +
            '<% if (i == select) { %>' +
            '<button type="button" data-role="button"  class="select" id="dialogButton<%=i%>"><%=button[i]%></button>' +
            '<% } else { %>' +
            '<button type="button" data-role="button" id="dialogButton<%=i%>"><%=button[i]%></div>' +
            '<% } %>' +
            '<% } %>' +
            '</div>' +
            '</div>' +
            '</div>';
       
        var defaults = {
            title: '',
            content: '',
            button: ['确认'],
            select: 0,
            allowScroll: false,
            callback: function () {}
        }
        var Dialog = function (el, option, isFromTpl) {
            this.option = $.extend(defaults, option);
            this.element = $(el);
            this._isFromTpl = isFromTpl;
            this.button = $(el).find('[data-role="button"]');
            this._bindEvent();
            this.toggle();
        }
        Dialog.prototype = {
            _bindEvent: function () {
                var self = this;
                self.button.on("tap", function () {
                    var index = $(self.button).index($(this));
                    // self.option.callback("button",index);
                    var e = $.Event("dialog:action");
                    e.index = index;
                    self.element.trigger(e);
                    self.hide.apply(self);
                });
            },
            toggle: function () {
                if (this.element.hasClass("show")) {
                    this.hide();
                } else {
                    this.show();
                }
            },
            show: function () {
                var self = this;
                // self.option.callback("show");
                self.element.trigger($.Event("dialog:show"));
                self.element.addClass("show");
                this.option.allowScroll && self.element.on("touchmove", _stopScroll);

            },
            hide: function () {
                var self = this;
                // self.option.callback("hide");
                self.element.trigger($.Event("dialog:hide"));
                self.element.off("touchmove", _stopScroll);
                self.element.removeClass("show");

                self._isFromTpl && self.element.remove();
            }
        }
    
        function _stopScroll() {
            return false;
        }

        function Plugin(option) {

            return $.adaptObject(this, defaults, option, _dialogTpl, Dialog, "dialog");
        }
        $.fn.dialog = $.dialog = Plugin;
    })(window.Zepto);
});