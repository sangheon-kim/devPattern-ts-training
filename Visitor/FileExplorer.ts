const sel = (v: string, el = document): HTMLElement | null => el.querySelector(v);
const el = (tag: string | HTMLElement, ...attr: Array<any>): HTMLElement => {
  const el: any = typeof tag === "string" ? document.createElement(tag) : tag;

  if (!!el) {
    for (let i = 0; i < attr.length; ) {
      const k = attr[i++],
        v = attr[i++];

      if (typeof el[k] === "function") el[k](...(attr as any)(Array.isArray(v) ? v : [v]));
      else if (k[0] === "@") el.style[k.substr(1)] = v;
      else el[k] = v;
    }
    return el;
  }

  return el;
};

abstract class FileExplorer {
  constructor(protected _name: string, protected _date: Date = new Date()) {}

  get name() {
    return this._name;
  }

  get date() {
    return this._date;
  }

  abstract search(key: string, result: string[]): void;

  abstract rename(name: string): void;
}

class SFolder extends FileExplorer {
  children: Array<SFile | SFolder>;
  _isFolding: boolean;
  constructor(protected _name: string, _date?: Date) {
    super(_name, _date);
    this.children = [];
    this._isFolding = false;
  }

  foldingToggle() {
    this._isFolding = !this._isFolding;
  }

  sort() {
    this.children.sort((a: SFile | SFolder, b: SFolder | SFile) => {
      if (a["name"] > b["name"]) {
        return -1;
      } else if (a["name"] < b["name"]) {
        return 1;
      } else return 0;
    });
  }

  add(fs: SFolder | SFile) {
    this.children.push(fs);

    this.sort();
  }

  rename(name: string) {
    this._name = name;
    this.sort();
  }

  search(key: string, result: []) {
    this.children.forEach((item) => {
      item.search(key, result);
    });
  }
}

class SFile extends FileExplorer {
  isOpen: boolean;
  constructor(protected _name: string, _date?: Date) {
    super(_name, _date);
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  search(key: string, result: string[]) {
    this._name.includes(key) && result.push(this as any);
  }

  rename(name: string) {
    this._name = name;
  }
}

class Renderer {
  private _visitor: { [key: string]: any };

  constructor(_list: Array<SFolder | SFile>, _visitor: Visitor) {
    this._visitor = Object.assign(_visitor, { renderer: this });
  }
}

class Visitor {}

const rootFolder = new SFolder("root");

const folder1 = new SFolder("folder1");
const folder2 = new SFolder("folder2");
rootFolder.add(folder1);
rootFolder.add(folder2);
const subFolder1 = new SFolder("folder3");

const file1 = new SFile("aaa");
const file2 = new SFile("file2");
const file3 = new SFile("file3");

folder1.add(file2);
folder1.add(subFolder1);
folder1.add(file1);
subFolder1.add(file1);
file2.open();
folder2.add(file3);

folder1.rename("zhangeFolder1");

console.log(rootFolder);
