var exp = function (elemId, expStr, changedCallback) {

    var exp1 = new ExpModel(expStr);
    console.log(exp1);
    var container = $(elemId);

    ExpView.render(exp1.obj, container);

    var create = function (event) {
        var elem = $(event.target).parent();
        exp1.create();
        ExpView.render(exp1.obj, container);
        changedCallback(exp1.toString());
    };

    var append = function (event) {
        var elem = $(event.target).parent().parent();
        exp1.create(elem.attr('exp:id'));
        ExpView.render(exp1.obj, container);
        changedCallback(exp1.toString());
    };

    var remove = function (event) {
        var elem = $(event.target).parent();
        var expid = elem.attr('exp:id');
        exp1.remove(expid);

        ExpView.render(exp1.obj, container);
        changedCallback(exp1.toString());
    };


    var wrap = function (event) {
        var elem = $(event.target).parents('.exp-row, .exp-set').first();
        var expid = elem.attr('exp:id');
        exp1.wrap(expid, event.data);

        ExpView.render(exp1.obj, container);
        changedCallback(exp1.toString());
    };

    var change = function (event) {
        var elem = $(event.target);
        var expid = elem.parent().attr('exp:id');
        var val = elem.val();

        if (elem.hasClass('exp-value')) {
            elem.val(exp1.changeValue(expid, val));
        } else if (elem.hasClass('exp-check')) {
            elem.val(exp1.changeCheck(expid, val));
        } else if (elem.hasClass('exp-field')) {
            elem.val(exp1.changeField(expid, val));
        }
        console.log(elem.val());
        if (elem.val()) {
            ExpView.delError(elem);
        } else {
            ExpView.setError(elem);
        }
        changedCallback(exp1.toString());
    };

    container.on('change', '.exp-field, .exp-check, .exp-value', change);

    container
        .on('click', '.exp-create-btn', create)
        .on('click', '.exp-wrap-and', 'and', wrap)
        .on('click', '.exp-wrap-or', 'or', wrap)
        .on('click', '.exp-wrap-not', 'not', wrap)
        .on('click', '.exp-set>.exp-link-end', append)
        .on('click', '.exp-row>.exp-link-end', append)
        .on('click', '.exp-set>.exp-del-btn', remove)
        .on('click', '.exp-row>.exp-del-btn', remove);

    return {
        update: function (strExpr) {
            exp1.update(strExpr);
            ExpView.render(exp1.obj, container);
        }
    }
};
