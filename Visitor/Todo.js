"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var sel = function (v, el) {
    if (el === void 0) { el = document; }
    return el.querySelector(v);
};
var el = function (tag) {
    var attr = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        attr[_i - 1] = arguments[_i];
    }
    var el = typeof tag === "string" ? document.createElement(tag) : tag;
    if (!!el) {
        for (var i = 0; i < attr.length;) {
            var k = attr[i++], v = attr[i++];
            if (typeof el[k] === "function")
                el[k].apply(el, (Array.isArray(v) ? v : [v]));
            else if (k[0] === "@")
                el.style[k.substr(1)] = v;
            else
                el[k] = v;
        }
        return el;
    }
    return el;
};
var d64 = function (v) {
    return decodeURIComponent(atob(v)
        .split("")
        .map(function (c) { return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2); })
        .join(""));
};
var snack = function (v) {
    var elem = sel("#snack");
    if (!!elem) {
        elem.innerHTML = v;
        setTimeout(function () { return (elem.innerHTML = ""); }, 3500);
    }
    else {
        throw "Invalid Selector";
    }
};
var Task = /** @class */ (function () {
    function Task(_title, _date) {
        if (_date === void 0) { _date = new Date(); }
        this._title = _title;
        this._date = _date;
        this.item = this;
        this._list = [];
    }
    Task.title = function (a, b) {
        return a._title > b._title;
    };
    Object.defineProperty(Task.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: false,
        configurable: true
    });
    Task.prototype.add = function (task) {
        if (task instanceof Task)
            this._list.push(task);
        else
            throw "Invalid";
    };
    Task.prototype.remove = function (task) {
        var list = this._list;
        if (list.includes(task))
            list.splice(list.indexOf(task), 1);
    };
    Task.prototype.getResult = function (sort, stateGroup) {
        if (stateGroup === void 0) { stateGroup = true; }
        var list = this._list;
        return {
            item: this,
            children: !stateGroup
                ? __spreadArrays(list).sort(sort)
                : __spreadArrays(list.filter(function (v) { return !v.isComplete(); }).sort(sort), list.filter(function (v) { return v.isComplete(); }).sort(sort)),
        };
    };
    return Task;
}());
var TaskItem = /** @class */ (function (_super) {
    __extends(TaskItem, _super);
    function TaskItem(title, date) {
        var _this = _super.call(this, title, date) || this;
        _this._isComplete = false;
        return _this;
    }
    TaskItem.prototype.isComplete = function () {
        return this._isComplete;
    };
    TaskItem.prototype.toggle = function () {
        return (this._isComplete = !this._isComplete);
    };
    return TaskItem;
}(Task));
var TaskList = /** @class */ (function (_super) {
    __extends(TaskList, _super);
    function TaskList(title, date) {
        return _super.call(this, title, date) || this;
    }
    TaskList.prototype.isComplete = function () { };
    return TaskList;
}(Task));
var Renderer = /** @class */ (function () {
    function Renderer(_list, _visitor) {
        this._list = _list;
        this._visitor = Object.assign(_visitor, { renderer: this });
        this._sort = "title";
        console.log(this);
    }
    Renderer.prototype.add = function (parent, title, date) {
        parent.add(new TaskItem(title, date));
        this.render();
    };
    Renderer.prototype.remove = function (parent, task) {
        parent.remove(task);
        this.render();
    };
    Renderer.prototype.toggle = function (task) {
        task.toggle();
    };
    Renderer.prototype.render = function () {
        console.log(this._visitor);
        this._visitor.reset();
        this._visitor.operation(Task[this._sort], true, this._list);
    };
    return Renderer;
}());
var Visitor = /** @class */ (function () {
    function Visitor() {
    }
    Object.defineProperty(Visitor.prototype, "renderer", {
        set: function (v) {
            this._renderer = v;
        },
        enumerable: false,
        configurable: true
    });
    Visitor.prototype.operation = function (sort, stateGroup, task) {
        var _this = this;
        this._start(sort, stateGroup, task);
        task
            .getResult(sort, stateGroup)
            .children.forEach(function (_a) {
            var item = _a.item;
            return _this.operation(sort, stateGroup, item);
        });
        this._end();
    };
    return Visitor;
}());
var DomVisitor = /** @class */ (function (_super) {
    __extends(DomVisitor, _super);
    function DomVisitor(_parent) {
        var _this = _super.call(this) || this;
        _this._parent = _parent;
        return _this;
    }
    DomVisitor.prototype.reset = function () {
        var $sel = sel(this._parent);
        if (!!$sel)
            this._current = el($sel, "innerHTML", "");
    };
    DomVisitor.prototype._start = function (sort, stateGroup, task) {
        var _this = this;
        var _a;
        switch (true) {
            case task instanceof TaskItem:
                this._item(task);
                break;
            case task instanceof TaskList:
                this._list(task);
                break;
        }
        this._current = (_a = this._current) === null || _a === void 0 ? void 0 : _a.appendChild(el("section", "@marginLeft", "15px", "appendChild", el("input", "type", "text"), "appendChild", el("button", "innerHTML", "addTask", "addEventListener", [
            "click",
            function (e) {
                return !!_this._renderer
                    ? _this._renderer.add(task, e.target.previousSibling.value)
                    : null;
            },
        ])));
    };
    DomVisitor.prototype._end = function () {
        var _a;
        this._current = (_a = this._current) === null || _a === void 0 ? void 0 : _a.parentNode;
    };
    DomVisitor.prototype._list = function (task) {
        var _a;
        (_a = this._current) === null || _a === void 0 ? void 0 : _a.appendChild(el("h2", "innerHTML", task.title));
    };
    DomVisitor.prototype._item = function (task) {
        var _this = this;
        [
            el("h3", "innerHTML", task.title, "@textDecoration", task.isComplete() ? "line-through" : "none"),
            el("time", "innerHTML", task.date, "datetime", task.date),
            el("button", "innerHTML", task.isComplete() ? "progress" : "complete", "addEventListener", [
                "click",
                function (_) { var _a; return (_a = _this._renderer) === null || _a === void 0 ? void 0 : _a.toggle(task); },
            ]),
            el("button", "innerHTML", "remove", "addEventListener", [
                "click",
                function (e) {
                    var _a;
                    return (_a = _this._renderer) === null || _a === void 0 ? void 0 : _a.remove(e.target.parentNode.parentNode.querySelector("h3").textContent, task);
                },
            ]),
        ].forEach(function (v) { var _a; return (_a = _this._current) === null || _a === void 0 ? void 0 : _a.appendChild(v); });
    };
    return DomVisitor;
}(Visitor));
var list1 = new TaskList("s75");
var item1 = new TaskItem("3강 교안 작성");
list1.add(item1);
var sub1 = new TaskItem("코드정리");
item1.add(sub1);
var subsub1 = new TaskItem("subsub1");
sub1.add(subsub1);
// debugger;
var todo = new Renderer(list1, new DomVisitor("#todo"));
todo.render();
