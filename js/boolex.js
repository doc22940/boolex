var boolex = function (elemId, expStr, changedCallback) {

    var exp1 = new BoolexModel(expStr);
    console.log(exp1);
    var container = $(elemId);
    var view = new BoolexView(container);

    view.render(exp1.obj, container);

    var create = function () {
        var elem = $(this).parent();
        exp1.create();
        view.render(exp1.obj, container);
        changedCallback(exp1.toString());
    };

    var append = function () {
        var elem = $(this).parent().parent();

        exp1.create(elem.attr('boolex-id'));
        view.render(exp1.obj, container);
        changedCallback(exp1.toString());
    };

    var remove = function () {
        var elem = $(this).parent();
        var expid = elem.attr('boolex-id');
        exp1.remove(expid);

        view.render(exp1.obj, container);
        changedCallback(exp1.toString());
    };


    var wrap = function (event) {
        var elem = $(event.target).parents('.boolex-row, .boolex-set').first();
        var expid = elem.attr('boolex-id');
        exp1.wrap(expid, event.data);

        view.render(exp1.obj, container);
        changedCallback(exp1.toString());
    };

    var change = function (event) {
        var elem = $(event.target);
        var expid = elem.parent().attr('boolex-id');
        var val = elem.val();

        if (elem.hasClass('boolex-value')) {
            elem.val(exp1.changeValue(expid, val));
        } else if (elem.hasClass('boolex-check')) {
            elem.val(exp1.changeCheck(expid, val));
        } else if (elem.hasClass('boolex-field')) {
            elem.val(exp1.changeField(expid, val));
        }
        console.log(elem.val());
        if (elem.val()) {
            view.delError(elem);
        } else {
            view.setError(elem);
        }
        changedCallback(exp1.toString());
    };

    container.on('change', '.boolex-field, .boolex-check, .boolex-value', change);

    container
        .on('click', '.boolex-create-btn', create)
        .on('click', '.boolex-wrap-and', 'and', wrap)
        .on('click', '.boolex-wrap-or', 'or', wrap)
        .on('click', '.boolex-wrap-not', 'not', wrap)
        .on('click', '.boolex-set>.boolex-link-end', append)
        .on('click', '.boolex-row>.boolex-link-end', append)
        .on('click', '.boolex-set>.boolex-del-btn', remove)
        .on('click', '.boolex-row>.boolex-del-btn', remove);

    return {
        update: function (strExpr) {
            exp1.update(strExpr);
            view.render(exp1.obj, container);
        }
    }
};
