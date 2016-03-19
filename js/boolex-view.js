function BoolexView($targetElement) {

    function outPopup(out) {
        out.push(
            '<div class="boolex-more"><i class="fa fa-toggle-left"></i> ',
            '<div class="boolex-popup">',
            '<div class="boolex-wrap boolex-wrap-and">and</div>',
            '<div class="boolex-wrap boolex-wrap-or">or</div>',
            '<div class="boolex-wrap boolex-wrap-not">not</div>',
            '</div>',
            '</div>'
        );
    }

    function outConnection(out, item, next, parent) {
        if (parent) {
            if (next) {
                var linkType = 'boolex-link-' + (item.type || 'row') + '-' + (next.type || 'row');
                out.push('<div class="boolex-link ' + linkType + '">' + parent.type + '</div>');
            } else {
                if (parent.type != 'not') {
                    out.push('<div class="boolex-link boolex-link-end"><i class="fa fa-plus"></i></div>');
                }
            }
        }
    }

    function outHtml(out, item, next, parent) {
        if (item) {
            if (item.type) {
                outSet(out, item, next, parent);
            } else {
                outRow(out, item, next, parent);
            }
        } else {
            out.push('<button class="boolex-create-btn">Create expression</button>');
        }
        return out;
    }

    function outSet(out, item, next, parent) {
        out.push(
            '<div class="boolex-set boolex-set-' + item.type + '" boolex-id="' + item.id + '">',
            '<div class="boolex-set-label">' + item.type + '</div>'
        );

        for (var i = 0; i < item.list.length; i++) {
            outHtml(out, item.list[i], i < item.list.length - 1 ? item.list[i + 1] : null, item);
        }

        out.push('<div class="boolex-del-btn"><i class="fa fa-remove"></i></div>');

        outConnection(out, item, next, parent);
        outPopup(out);
        out.push('</div>');
    }

    function outRow(out, item, next, parent) {
        out.push(
            '<div class="boolex-row" boolex-id="', item.id, '">',
            '<input class="boolex-field', item.field ? '' : ' boolex-empty', '"',
            ' placeholder="Field" type="text" value="', item.field, '">',
            '<input class="boolex-check', item.check ? '' : ' boolex-empty', '"',
            ' placeholder="Operator" type="text" list="boolex-checks" value="', item.check, '">',
            '<input class="boolex-value"',
            '  placeholder="Value" value="', item.value, '">',
            '<div class="boolex-del-btn"><i class="fa fa-remove"></i> </div>'
        );

        outPopup(out);
        outConnection(out, item, next, parent);
        out.push('</div>');
        return out;
    }


    this.render = function (obj) {
        var html = outHtml([], obj, null, null);
        $targetElement.html(html.join(''));
    };

    this.setError = function (elem) {
        elem.addClass('boolex-empty');
    };

    this.delError = function (elem) {
        elem.removeClass('boolex-empty');
    };
}
