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
                el[k].apply(el, attr(Array.isArray(v) ? v : [v]));
            else if (k[0] === "@")
                el.style[k.substr(1)] = v;
            else
                el[k] = v;
        }
        return el;
    }
    return el;
};
var FileExplorer = /** @class */ (function () {
    function FileExplorer(_name, _date) {
        if (_date === void 0) { _date = new Date(); }
        this._name = _name;
        this._date = _date;
    }
    Object.defineProperty(FileExplorer.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileExplorer.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: false,
        configurable: true
    });
    return FileExplorer;
}());
var SFolder = /** @class */ (function (_super) {
    __extends(SFolder, _super);
    function SFolder(_name, _date) {
        var _this = _super.call(this, _name, _date) || this;
        _this._name = _name;
        _this.children = [];
        _this._isFolding = false;
        return _this;
    }
    SFolder.prototype.foldingToggle = function () {
        this._isFolding = !this._isFolding;
    };
    SFolder.prototype.sort = function () {
        this.children.sort(function (a, b) {
            if (a["name"] > b["name"]) {
                return -1;
            }
            else if (a["name"] < b["name"]) {
                return 1;
            }
            else
                return 0;
        });
    };
    SFolder.prototype.add = function (fs) {
        this.children.push(fs);
        this.sort();
    };
    SFolder.prototype.rename = function (name) {
        this._name = name;
        this.sort();
    };
    SFolder.prototype.search = function (key, result) {
        this.children.forEach(function (item) {
            item.search(key, result);
        });
    };
    return SFolder;
}(FileExplorer));
var SFile = /** @class */ (function (_super) {
    __extends(SFile, _super);
    function SFile(_name, _date) {
        var _this = _super.call(this, _name, _date) || this;
        _this._name = _name;
        _this.isOpen = false;
        return _this;
    }
    SFile.prototype.open = function () {
        this.isOpen = true;
    };
    SFile.prototype.close = function () {
        this.isOpen = false;
    };
    SFile.prototype.search = function (key, result) {
        this._name.includes(key) && result.push(this);
    };
    SFile.prototype.rename = function (name) {
        this._name = name;
    };
    return SFile;
}(FileExplorer));
var Renderer = /** @class */ (function () {
    function Renderer(_list, _visitor) {
        this._visitor = Object.assign(_visitor, { renderer: this });
    }
    return Renderer;
}());
var Visitor = /** @class */ (function () {
    function Visitor() {
    }
    return Visitor;
}());
var rootFolder = new SFolder("root");
var folder1 = new SFolder("folder1");
var folder2 = new SFolder("folder2");
rootFolder.add(folder1);
rootFolder.add(folder2);
var subFolder1 = new SFolder("folder3");
var file1 = new SFile("aaa");
var file2 = new SFile("file2");
var file3 = new SFile("file3");
folder1.add(file2);
folder1.add(subFolder1);
folder1.add(file1);
subFolder1.add(file1);
file2.open();
folder2.add(file3);
folder1.rename("zhangeFolder1");
console.log(rootFolder);
