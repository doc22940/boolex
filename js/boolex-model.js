function BoolexModel(strExpr) {
    this.update(strExpr);
}

BoolexModel.prototype.update = function (strExpr) {
    console.log('fromString');
    var index = 1;

    var braceend = function (str, pos) {
        var count = null;
        for (var i = pos; i < str.length; i++) {
            if (str[i] == '(') {
                count++;
            } else if (str[i] == ')') {
                count--;
            }
            if (count === 0) {
                return i;
            }
        }
        return false;
    };

    var recurs = function (str, parent) {
        if (!str) {
            return null;
        }

        var brace1 = str.indexOf('(');

        if (brace1 < 0) {
            console.error('brace1');
            return false;
        }

        var type = str.substring(0, brace1);

        var item = {id: index++, parent: parent};

        if (type == 'and' || type == 'or' || type == 'not') {
            item.type = type;
            item.list = [];

            var xA = brace1 + 1, xZ;

            for (var i = 0; i < 100; i++) {
                xZ = braceend(str, xA);
                if (xZ) {
                    item.list.push(recurs(str.substring(xA, xZ + 1), item));
                    xA = xZ + 2;
                    if (xA > str.length - 2) {
                        break;
                    }
                } else {
                    console.error('too many');
                    return false;
                }
            }
        } else {
            var comma = str.indexOf(',');
            var brace2 = str.indexOf(')');

            if (!(brace1 < comma < brace2)) {
                console.error('c(k,v)', '(,)');
                return false;
            }

            item.check = type;
            item.field = str.substring(brace1 + 1, comma);
            item.value = str.substring(comma + 1, brace2);
        }
        return item;
    };

    this.obj = recurs(strExpr);
    this.index = index;
};

BoolexModel.prototype.toString = function () {
    console.log('toString');
    if (!this.obj) {
        return '';
    }
    var out = [];

    var recurs = function (item) {
        if (item.type) {
            out.push(item.type, '(');

            for (var i = 0; i < item.list.length; i++) {
                recurs(item.list[i]);
                if (i < item.list.length - 1) {
                    out.push(',');
                }
            }
            out.push(')');
        } else {
            out.push(item.check, '(', item.field, ',', item.value, ')');
        }
    };

    recurs(this.obj);

    return out.join('');
};

BoolexModel.prototype.find = function (id) {
    console.log('find', id);

    var recurs = function (item) {
        console.log(item);

        for (var i = 0; i < item.list.length; i++) {
            if (item.list[i].id == id) {
                return item.list[i];
            } else if (item.list[i].list) {
                var res = recurs(item.list[i]);
                if (res) {
                    return res;
                }
            }
        }
        return null;
    };

    if (this.obj.id == id) {
        return this.obj;
    } else {
        return recurs(this.obj);
    }
};

BoolexModel.prototype.changeField = function (id, field) {
    var item = this.find(id);
    field = field.replace(/\(|\)|,/g, '');
    item.field = field;
    return field;
};

BoolexModel.prototype.changeCheck = function (id, check) {
    var item = this.find(id);
    check = check.replace(/\(|\)|,/g, '');
    item.check = check;
    return check;
};

BoolexModel.prototype.changeValue = function (id, value) {
    var item = this.find(id);
    item.value = value;
    value = value.replace(/\(|\)|,/g, '');
    return value;
};

BoolexModel.prototype.wrap = function (id, andornot) {
    console.log('wrap', id, andornot);
    var item = this.find(id);
    var parent = item.parent;

    var wrapped = {id: this.index++, type: andornot, list: [item]};
    item.parent = wrapped;

    if (andornot == 'and' || andornot == 'or') {
        var created = {id: this.index++};
        created.parent = wrapped;
        wrapped.list.push(created);
    }

    if (parent) {
        var index = parent.list.indexOf(item);
        wrapped.parent = parent;
        parent.list[index] = wrapped;
    } else {
        this.obj = wrapped;
    }
};

BoolexModel.prototype.create = function (id) {
    console.log('create', id);
    if (id) {
        var item = this.find(id);
        if (item.list) {
            item.list.push({id: this.index++, parent: item});
        }
    } else {
        this.obj = {id: this.index++};
    }
};

BoolexModel.prototype.remove = function (id) {
    console.log('remove', id);

    var item = this.find(id);

    var parent = item.parent;

    while (parent && parent.list.length == 1) {
        item = parent;
        parent = parent.parent;
    }

    if (parent) {
        var index = parent.list.indexOf(item);
        parent.list.splice(index, 1);
    } else {
        this.obj = null;
    }
};
