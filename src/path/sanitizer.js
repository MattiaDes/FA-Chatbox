var sanitizer = {};
(function($) {
function trimAttributes(node) {
    $.each(node.attributes, function() {
        var attrName = this.name;
        var attrValue = this.value;

        if (attrName.indexOf('on') === 0 || attrValue.indexOf('javascript:') === 0) {
            $(node).removeAttr(attrName);
        }
    });
}
function sanitize(html) {
    var output = $($.parseHTML('<div>' + html + '</div>', null, false));
    output.find('*').each(function() {
        trimAttributes(this);
    });
    return output.html();
}
sanitizer.sanitize = sanitize;
})(jQuery);
