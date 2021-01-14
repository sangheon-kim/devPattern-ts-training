abstract class Task {
  private _list: Array<any>;
  static byTitle(a, b) {
    return a.sortTitle(b);
  }

  static byDate(a, b) {
    return a.sortTitle(b);
  }

  constructor(protected title) {
    this.title = title;
    this._list = [];
  }

  add(task: Task) {
    this._list.push(task);
  }

  remove(task: Task) {
    const list = this._list;
    if (list.includes(task)) list.splice(list.indexOf(task), 1);
  }

  getResult(sort: (a, b) => number, stateGroup: boolean) {
    const list = this._list;
    return {
      item: this._getResult(),
      children: !stateGroup
        ? [...list].sort(sort)
        : [
            ...list.filter((v) => !v.isComplete()).sort(sort),
            ...list.filter((v) => v.isComplete()).sort(sort),
          ],
    };
  }

  abstract _getResult();

  abstract isComplete();

  abstract _sortTitle();

  abstract sortDate();
}

class TaskItem extends Task {
  constructor(title, date = new Date()) {
    super(title);
    this._date = date;
    this._isComplete = false;
  }

  _getResult(sort: (a, b) => number, stateGroup: boolean) {
    return this;
  }
}

export {};
