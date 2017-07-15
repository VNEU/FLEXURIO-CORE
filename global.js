/**
 * Created by Jayuda on 7/15/17.
 */


flxgroup = (function() {
    var has = function(obj, target) {
        return _.any(obj, function(value) {
            return _.isEqual(value, target);
        });
    };

    var keys = function(data, names) {
        return _.reduce(data, function(memo, item) {
            var key = _.pick(item, names);
            if (!has(memo, key)) {
                memo.push(key);
            }
            return memo;
        }, []);
    };

    var group = function(data, names, skolom) {
        var stems = keys(data, names);
        return _.map(stems, function(stem) {
            return {
                kolom:skolom,
                key: stem,
                vals:_.map(_.where(data, stem), function(item) {
                    return _.omit(item, names);
                })
            };
        });
    };

    group.register = function(name, converter) {
        return group[name] = function(data, names, skolom) {
            return _.map(group(data, names, skolom), converter);
        };
    };

    return group;
}());

flxgroup.register("sum", function(item) {
    return _.extend({}, item.key, {SUM: _.reduce(item.vals, function(memo, node) {
        return memo + Number(node[""+item.kolom+""]);
    }, 0)});
});

flxgroup.register("count", function(item) {
    return _.extend({}, item.key, {COUNT: _.reduce(item.vals, function(memo, node) {
        return memo + 1;
    }, 0)});
});

flxgroup.register("avg", function(item) {
    console.log(item.vals.length);
    return _.extend(
        {}, item.key, {AVG: _.reduce(item.vals, function(memo, node) {
            return memo + Number(node[""+item.kolom+""]);
        }, 0) / item.vals.length}
    );
});

flxgroup.register("max", function(item) {
    return _.extend({}, item.key, {MAX: _.reduce(item.vals, function(memo, node) {
        return Math.max(memo, Number(node[""+item.kolom+""]));
    }, Number.NEGATIVE_INFINITY)});
});

flxgroup.register("min", function(item) {
    return _.extend({}, item.key, {MIN: _.reduce(item.vals, function(memo, node) {
        return Math.min(memo, Number(node[""+item.kolom+""]));
    }, Number.NEGATIVE_INFINITY)});
});







adaDATA = function(obj) {

    try {
        // null and undefined are "empty"
        if (obj == null) return false;
        if (obj == undefined) return false;
        if (obj == "") return false;

        // untuk boolean
        if (obj == true) return true;
        if (obj == false) return false;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return true;
        if (obj.length === 0)  return false;

        if (typeof obj == "number" && obj != 0) return true;

        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== "object") return false;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        for (let key in obj) {
            if (hasOwnProperty.call(obj, key)) return true;
        }
        return false;
    } catch(err) {
        return false;
    }
};



dateAdd = function (date, sDatePart, jumlahAdd) {
    var dateNew = new Date();
    if (sDatePart == "minutes") {
        var menitBaru = date.getMinutes() + jumlahAdd;
        dateNew = date.setMinutes(menitBaru);
    }

    if (sDatePart == "hours") {
        var menitBaru = date.getHours() + jumlahAdd;
        dateNew = date.setHours(menitBaru);
    }
    if (sDatePart == "days") {
        var hariBaru = date.getDate() + jumlahAdd;
        dateNew = date.setDate(hariBaru);
    }
    if (sDatePart == "months") {
        var bulanBaru = date.getMonth() + jumlahAdd;
        dateNew = date.setMonth(bulanBaru);
    }
    if (sDatePart == "years") {
        var tahunBaru = date.getFullYear() + jumlahAdd;
        dateNew = date.setFullYear(tahunBaru);
    }

    return new Date(dateNew);
};



ArrayRemove = function (oArray,sPropertyElement,value)
{
    return oArray.filter(function (val) {
        return val[sPropertyElement] !== value;
    });

};


random = function () {
    return Math.floor((Math.random() * 100) + 1);
};

isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

