ExpView = {
    render: function (obj, target) {
        var html = ExpView._outHtml([], obj, null, null);
        target.html(html.join(''));
    },

    setError: function (elem) {
        elem.addClass('exp-empty');
    },

    delError: function (elem) {
        elem.removeClass('exp-empty');
    },

    _outLink: function (out, item, next, parent) {
        if (parent) {
            if (next) {
                out.push('<div class="exp-link exp-link-', item.type || 'row', '-', next.type || 'row', '">', parent.type, '</div>');
            } else {
                if (parent.type != 'not') {
                    out.push('<div class="exp-link exp-link-end">', parent.type, '</div>');
                }
            }
        }
    },

    _outHtml: function (out, item, next, parent) {
        if (!item) {
            out.push('<div class="exp-create-btn">Create</div>');
        } else if (item.type) {
            out.push(
                '<div class="exp-set exp-set-', item.type, '" exp:id="', item.id, '">',
                '<div class="exp-set-label">', item.type, '</div>'
            );

            for (var i = 0; i < item.list.length; i++) {
                ExpView._outHtml(out, item.list[i], i < item.list.length - 1 ? item.list[i + 1] : null, item);
            }

            out.push('<div class="exp-del-btn"></div>');

            ExpView._outLink(out, item, next, parent);
            ExpView._outPopup(out);

            out.push('</div>');
        } else {
            ExpView._outRow(out, item, next, parent);
        }
        return out;
    },

    _outPopup: function (out) {
        out.push(
            '<div class="exp-more">',
            '<div class="exp-popup">',
            '<div class="exp-wrap exp-wrap-and">and</div>',
            '<div class="exp-wrap exp-wrap-or">or</div>',
            '<div class="exp-wrap exp-wrap-not">not</div>',
            '</div>',
            '</div>'
        );
    },

    _outRow: function (out, item, next, parent) {
        out.push(
            '<div class="exp-row" exp:id="', item.id, '">',
            '<input class="exp-field', item.field ? '' : ' exp-empty', '"',
            ' placeholder="Field" type="text" value="', item.field, '">',
            '<input class="exp-check', item.check ? '' : ' exp-empty', '"',
            ' placeholder="Operator" type="text" list="exp-checks" value="', item.check, '">',
            '<input class="exp-value"',
            '  placeholder="Value" value="', item.value, '">',
            '<div class="exp-del-btn"></div>'
        );

        ExpView._outPopup(out);
        ExpView._outLink(out, item, next, parent);

        out.push('</div>');

        return out;
    }
};