abstract class FileExplorer {
  constructor(public name: string) {
    if (!name) throw "invalid name";
    this.name = name;
  }

  abstract search(key: string, result: string[]): void;
}

class SFile extends FileExplorer {
  _date: Date;
  constructor(name: string, public date = new Date()) {
    super(name);
    this._date = date;
  }

  search(key: string, result: string[]) {
    this.name.includes(key) && result.push(this as any);
  }
}

class SFolder extends FileExplorer {
  children: Array<SFile | SFolder>;
  _date: Date;
  constructor(name: string, date = new Date()) {
    super(name);
    this.children = [];
    this._date = date;
  }

  add(fs: SFolder | SFile) {
    this.children.push(fs);
  }

  search(key: string, result: []) {
    this.children.forEach((item) => {
      item.search(key, result);
    });
  }
}

const someSFolder = new SFolder("folder1");
const someFile1 = new SFile("file1");
const someFile2 = new SFile("file2");
someSFolder.add(someFile1);
someSFolder.add(someFile2);
const someSFolderSub = new SFolder("folder1-1");
someSFolder.add(someSFolderSub);
const someSFolderSubSub = new SFolder("folder1-1-1");
someSFolderSub.add(someSFolderSubSub);
const someFile3 = new SFile("file1-1");
someSFolderSubSub.add(someFile3);

const result: any = [];
someSFolderSubSub.search("fil", result);

console.log(result);

export {};
