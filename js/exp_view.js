function BoolexView($targetElement) {

    function _outLink(out, item, next, parent) {
        if (parent) {
            if (next) {
                out.push('<div class="boolex-link boolex-link-', item.type || 'row', '-', next.type || 'row', '">', parent.type, '</div>');
            } else {
                if (parent.type != 'not') {
                    //out.push('<div class="boolex-link boolex-link-end">', parent.type, '</div>');
                    out.push('<div class="boolex-link boolex-link-end"><i class="fa fa-plus"></i> </div>');
                }
            }
        }
    }

    function _outHtml(out, item, next, parent) {
        if (!item) {
            out.push('<div class="boolex-create-btn">Create</div>');
        } else if (item.type) {
            out.push(
                '<div class="boolex-set boolex-set-', item.type, '" exp:id="', item.id, '">',
                '<div class="boolex-set-label">', item.type, '</div>'
            );

            for (var i = 0; i < item.list.length; i++) {
                _outHtml(out, item.list[i], i < item.list.length - 1 ? item.list[i + 1] : null, item);
            }

            out.push('<div class="boolex-del-btn"><i class="fa fa-remove"></i></div>');

            _outLink(out, item, next, parent);
            _outPopup(out);

            out.push('</div>');
        } else {
            _outRow(out, item, next, parent);
        }
        return out;
    }


    function _outPopup(out) {
        out.push(
            '<div class="boolex-more"><i class="fa fa-play-circle-o"></i> ',
            '<div class="boolex-popup">',
            '<div class="boolex-wrap boolex-wrap-and">and</div>',
            '<div class="boolex-wrap boolex-wrap-or">or</div>',
            '<div class="boolex-wrap boolex-wrap-not">not</div>',
            '</div>',
            '</div>'
        );
    }

    function _outRow(out, item, next, parent) {
        out.push(
            '<div class="boolex-row" exp:id="', item.id, '">',
            '<input class="boolex-field', item.field ? '' : ' boolex-empty', '"',
            ' placeholder="Field" type="text" value="', item.field, '">',
            '<input class="boolex-check', item.check ? '' : ' boolex-empty', '"',
            ' placeholder="Operator" type="text" list="boolex-checks" value="', item.check, '">',
            '<input class="boolex-value"',
            '  placeholder="Value" value="', item.value, '">',
            '<div class="boolex-del-btn"><i class="fa fa-remove"></i> </div>'
        );

        _outPopup(out);
        _outLink(out, item, next, parent);

        out.push('</div>');

        return out;
    }


    this.render = function (obj) {
        var html = _outHtml([], obj, null, null);
        $targetElement.html(html.join(''));
    };

    this.setError = function (elem) {
        elem.addClass('boolex-empty');
    };

    this.delError = function (elem) {
        elem.removeClass('boolex-empty');
    };

}
