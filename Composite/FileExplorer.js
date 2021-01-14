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
Object.defineProperty(exports, "__esModule", { value: true });
var FileExplorer = /** @class */ (function () {
    function FileExplorer(name) {
        this.name = name;
        if (!name)
            throw "invalid name";
        this.name = name;
    }
    return FileExplorer;
}());
var SFile = /** @class */ (function (_super) {
    __extends(SFile, _super);
    function SFile(name, date) {
        if (date === void 0) { date = new Date(); }
        var _this = _super.call(this, name) || this;
        _this.date = date;
        _this._date = date;
        return _this;
    }
    SFile.prototype.search = function (key, result) {
        this.name.includes(key) && result.push(this);
    };
    return SFile;
}(FileExplorer));
var SFolder = /** @class */ (function (_super) {
    __extends(SFolder, _super);
    function SFolder(name, date) {
        if (date === void 0) { date = new Date(); }
        var _this = _super.call(this, name) || this;
        _this.children = [];
        _this._date = date;
        return _this;
    }
    SFolder.prototype.add = function (fs) {
        this.children.push(fs);
    };
    SFolder.prototype.search = function (key, result) {
        this.children.forEach(function (item) {
            item.search(key, result);
        });
    };
    return SFolder;
}(FileExplorer));
var someSFolder = new SFolder("folder1");
var someFile1 = new SFile("file1");
var someFile2 = new SFile("file2");
someSFolder.add(someFile1);
someSFolder.add(someFile2);
var someSFolderSub = new SFolder("folder1-1");
someSFolder.add(someSFolderSub);
var someSFolderSubSub = new SFolder("folder1-1-1");
someSFolderSub.add(someSFolderSubSub);
var someFile3 = new SFile("file1-1");
someSFolderSubSub.add(someFile3);
var result = [];
someSFolderSubSub.search("fil", result);
console.log(result);
