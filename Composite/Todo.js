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
var Task = /** @class */ (function () {
    function Task(title) {
        this.title = title;
        this.title = title;
        this._list = [];
    }
    Task.byTitle = function (a, b) {
        return a.sortTitle(b);
    };
    Task.byDate = function (a, b) {
        return a.sortTitle(b);
    };
    Task.prototype.add = function (task) {
        this._list.push(task);
    };
    Task.prototype.remove = function (task) {
        var list = this._list;
        if (list.includes(task))
            list.splice(list.indexOf(task), 1);
    };
    Task.prototype.getResult = function (sort, stateGroup) {
        var list = this._list;
        return {
            item: this._getResult(),
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
        if (date === void 0) { date = new Date(); }
        var _this = _super.call(this, title) || this;
        _this._date = date;
        _this._isComplete = false;
        return _this;
    }
    TaskItem.prototype._getResult = function (sort, stateGroup) {
        return this;
    };
    return TaskItem;
}(Task));
