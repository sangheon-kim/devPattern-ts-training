const sel = (v: string, el = document): HTMLElement | null => el.querySelector(v);
const el = (tag: string | HTMLElement, ...attr: Array<any>): HTMLElement => {
  const el: any = typeof tag === "string" ? document.createElement(tag) : tag;

  if (!!el) {
    for (let i = 0; i < attr.length; ) {
      const k = attr[i++],
        v = attr[i++];

      if (typeof el[k] === "function") el[k](...(Array.isArray(v) ? v : [v]));
      else if (k[0] === "@") el.style[k.substr(1)] = v;
      else el[k] = v;
    }
    return el;
  }

  return el;
};

const d64 = (v: string) =>
  decodeURIComponent(
    atob(v)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

const snack = (v: string) => {
  const elem: HTMLElement | null = sel("#snack");
  if (!!elem) {
    elem.innerHTML = v;
    setTimeout(() => (elem.innerHTML = ""), 3500);
  } else {
    throw "Invalid Selector";
  }
};

abstract class Task {
  protected _list: [] | Array<Task>;
  item: Task = this;
  static title(a: Task, b: Task) {
    return a._title > b._title;
  }

  constructor(private _title: string, private _date: Date = new Date()) {
    this._list = [];
  }

  get title() {
    return this._title;
  }

  get date() {
    return this._date;
  }

  add(task: Task) {
    if (task instanceof Task) this._list.push(task as never);
    else throw "Invalid";
  }

  remove(task: never) {
    const list = this._list;
    if (list.includes(task)) list.splice(list.indexOf(task), 1);
  }

  getResult(
    sort: (a: Task, b: Task) => number,
    stateGroup: boolean = true
  ): { item: Task; children: Array<Task> } {
    const list = this._list;
    return {
      item: this,
      children: !stateGroup
        ? [...list].sort(sort)
        : [
            ...list.filter((v: Task) => !v.isComplete()).sort(sort),
            ...list.filter((v: Task) => v.isComplete()).sort(sort),
          ],
    };
  }

  // abstract search(date: Date): TaskItem | void;
  abstract isComplete(): boolean | void;
}

class TaskItem extends Task {
  private _isComplete: boolean;
  constructor(title: string, date?: Date) {
    super(title, date);
    this._isComplete = false;
  }

  isComplete() {
    return this._isComplete;
  }

  toggle() {
    return (this._isComplete = !this._isComplete);
  }
}

class TaskList extends Task {
  constructor(title: string, date?: Date) {
    super(title, date);
  }

  isComplete() {}

  // search(date: Date) {
  //   this._list.forEach((item) => item.search(date));
  // }
}

class Renderer {
  private _visitor: { [key: string]: any };
  private _sort: "title" | "date";
  constructor(private _list: Array<Task> | [], _visitor: Visitor) {
    this._visitor = Object.assign(_visitor, { renderer: this });
    this._sort = "title";
    console.log(this);
  }

  add(parent: TaskItem, title: string, date?: Date) {
    parent.add(new TaskItem(title, date));
    this.render();
  }

  remove(parent: Task, task: Task) {
    parent.remove(task as never);
    this.render();
  }

  toggle(task: TaskItem) {
    task.toggle();
  }

  render() {
    console.log(this._visitor);

    this._visitor.reset();
    this._visitor.operation((Task as any)[this._sort], true, this._list);
  }
}

abstract class Visitor {
  protected _renderer: Renderer | undefined;
  set renderer(v: Renderer) {
    this._renderer = v;
  }

  operation(sort: (a: Task, b: Task) => number, stateGroup: boolean, task: Task) {
    this._start(sort, stateGroup, task);
    task
      .getResult(sort, stateGroup)
      .children.forEach(({ item }) => this.operation(sort, stateGroup, item));
    this._end();
  }

  abstract reset(): void;

  protected abstract _start(
    sort: (a: Task, b: Task) => number,
    stateGroup: boolean,
    task: Task
  ): void;

  protected abstract _end(): void;
}

class DomVisitor extends Visitor {
  _current: HTMLElement | undefined;
  constructor(public _parent: string) {
    super();
  }

  reset() {
    const $sel = sel(this._parent);
    if (!!$sel) this._current = el($sel, "innerHTML", "");
  }

  protected _start(sort: (a: Task, b: Task) => number, stateGroup: boolean, task: Task) {
    switch (true) {
      case task instanceof TaskItem:
        this._item(task);
        break;
      case task instanceof TaskList:
        this._list(task);
        break;
    }
    this._current = this._current?.appendChild(
      el(
        "section",
        "@marginLeft",
        "15px",
        "appendChild",
        el("input", "type", "text"),
        "appendChild",
        el("button", "innerHTML", "addTask", "addEventListener", [
          "click",
          (e: any) =>
            !!this._renderer
              ? this._renderer.add(task as TaskItem, e.target.previousSibling.value)
              : null,
        ])
      )
    );
  }

  protected _end() {
    this._current = this._current?.parentNode as HTMLElement;
  }

  private _list(task: Task) {
    this._current?.appendChild(el("h2", "innerHTML", task.title));
  }

  private _item(task: Task) {
    [
      el(
        "h3",
        "innerHTML",
        task.title,
        "@textDecoration",
        task.isComplete() ? "line-through" : "none"
      ),
      el("time", "innerHTML", task.date, "datetime", task.date),
      el("button", "innerHTML", task.isComplete() ? "progress" : "complete", "addEventListener", [
        "click",
        (_) => this._renderer?.toggle(task as never),
      ]),
      el("button", "innerHTML", "remove", "addEventListener", [
        "click",
        (e) => {
          return this._renderer?.remove(
            e.target.parentNode.parentNode.querySelector("h3").textContent,
            task
          );
        },

        // (e) => console.log(),
      ]),
    ].forEach((v) => this._current?.appendChild(v));
  }
}

const list1: any = new TaskList("s75");
const item1 = new TaskItem("3강 교안 작성");
list1.add(item1);
const sub1 = new TaskItem("코드정리");
item1.add(sub1);
const subsub1 = new TaskItem("subsub1");
sub1.add(subsub1);
// debugger;
const todo = new Renderer(list1, new DomVisitor("#todo"));
todo.render();

export {};
