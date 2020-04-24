import { List } from './list'
import { hexToRgbA, getUniqueColorKey } from './utils'
export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  draw (ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(this.x + 0.5, this.y + 0.5, 2, 0, 360)
    ctx.stroke()
    ctx.closePath()
  }
}

export class PenShape {
  colorKey: string;
  lineColor: string;
  lineWidth: number;
  points: List<Point>;
  rgb: [number, number, number];
  constructor(colorKey: string) {
    this.rgb = hexToRgbA(colorKey)
    this.colorKey = colorKey
    this.lineColor = colorKey
    this.lineWidth = 1
    this.points = new List<Point>()
  }
  copy (colorKey: string) {
    const copyed = new PenShape(colorKey)
    copyed.points.addList(this.points)
    return copyed
  }
  draw (ctx: CanvasRenderingContext2D, isHintDraw: boolean, closePath: boolean) {
    const len = this.points.length()
    if (len >= 2) {
      ctx.fillStyle = 'green';
      if (isHintDraw) {
        // ctx.strokeStyle = this.colorKey;
        ctx.strokeStyle = '#f5222d'
      } else {
        ctx.strokeStyle = '#1890ff';
      }
      ctx.lineWidth = this.lineWidth;
      ctx.beginPath()
      for (let i = 0; i < len-1; i++) {
        ctx.moveTo(this.points.get(i).x + 0.5, this.points.get(i).y + 0.5)
        ctx.lineTo(this.points.get(i + 1).x  + 0.5, this.points.get(i + 1).y  + 0.5)
      }
      if (closePath) {
        ctx.moveTo(this.points.get(len - 1).x + 0.5, this.points.get(len -1).y + 0.5)
        ctx.lineTo(this.points.get(0).x  + 0.5, this.points.get(0).y  + 0.5)
      }
      ctx.stroke()
      if (isHintDraw) {
        this.points.foreach((index, point) => {
          point.draw(ctx)
        })
      }
    }
  }
}

export class PenLine {
  colorKey: string;
  lineColor: string;
  lineWidth: number;
  points: List<Point>;
  constructor(colorKey: string) {
    this.colorKey = colorKey
    this.lineColor = 'rgba(0, 0, 0, 1)'
    this.lineWidth = 1
    this.points = new List<Point>()
  }
  draw(ctx: CanvasRenderingContext2D, eraserRadius: number, isDrawHit: boolean) {
    var count = this.points.length();
    var p: Point = this.points.get(0);
    if (isDrawHit) {
      ctx.strokeStyle = this.colorKey;
    }
    else {
      ctx.strokeStyle = this.lineColor;
    }
    ctx.lineCap = "round";
    ctx.lineJoin = 'round';//转折的时候不出现尖角
    if (ctx.canvas.id == "hitCanvas")
      ctx.lineWidth = this.lineWidth + eraserRadius;//扩大hit上线条的范围，橡皮半径
    else
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    if (count >= 2) {
      ctx.moveTo(p.x, p.y);
      for (var i = 1; i < count - 2; i++) {
        // p = this.points.get(i);
        // ctx.lineTo(p.x, p.y);
        if (this.points.get(i).x == this.points.get(i + 1).x && this.points.get(i).y == this.points.get(i + 1).y)
          continue;
        var c = (this.points.get(i).x + this.points.get(i + 1).x) / 2;
        var d = (this.points.get(i).y + this.points.get(i + 1).y) / 2;
        ctx.quadraticCurveTo(this.points.get(i).x, this.points.get(i).y, c, d); //二次贝塞曲线函数   
      }
      // For the last 2 points
      if (count >= 3) {
        ctx.quadraticCurveTo(
          this.points.get(i).x,
          this.points.get(i).y,
          this.points.get(i + 1).x,
          this.points.get(i + 1).y
        );
      } else if (count >= 2) {
        ctx.lineTo(this.points.get(1).x, this.points.get(1).y);
      }
      ctx.stroke();
    } else {
      if (isDrawHit) {
        ctx.fillStyle = this.colorKey;
      }
      else {
        ctx.fillStyle = this.lineColor;
      }
      if (ctx.canvas.id == "hitCanvas")
        var radius = this.lineWidth + eraserRadius;//扩大hit上线条的范围，橡皮半径
      else
        var radius = this.lineWidth;
      ctx.arc(this.points.get(0).x, this.points.get(0).y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

class HashValue<T>{
  key: string;
  value: T;
  index: number;
}

export class HashTable<T> {
  private items: { [key: string]: HashValue<T> };
  private itemList: Array<T>;
  constructor() {
    this.items = {};
    this.itemList = [];
  }

  set(key: string, value: T): void {
    var vl = new HashValue<T>();
    vl.key = key;
    vl.value = value;
    var index = this.itemList.length;
    if (this.has(key)) {
      index = this.items[key].index;
    }
    vl.index = index;
    this.itemList[index] = value;
    this.items[key] = vl;
  }

  del(key: string): void {
    if (this.has(key)) {
      var index = this.items[key].index;
      if (index > -1) {
        this.itemList.splice(index, 1);
      }
      delete this.items[key];
      this.resetIndex();
    }
  }

  resetIndex(): void {

    this.foreach((k, v: T) => {
      var index = this.itemList.indexOf(v);
      this.items[k].index = index;
    });
  }

  has(key: string): boolean {
    return key in this.items;
  }

  get(key: string): T {
    if (this.has(key)) {
      return this.items[key].value;
    }
    return null;
  }

  count(): number {
    return this.itemList.length;
  }

  all(): Array<T> {
    return this.itemList;
  }

  first() {
    return this.itemList[0];
  }

  last() {
    return this.itemList[this.itemList.length - 1];
  }

  getByIndex(index: number): T {
    return this.itemList[index];
  }

  //遍历 扩展
  foreach(callback: (key: string, value: T) => void) {
    for (var key in this.items) {
      callback(key, this.items[key].value);
    }
  }

  //获取index
  indexOf(key) {
    if (this.has(key)) {
      return this.items[key].index;
    }
  }

  //插入
  insertAt(index: number, value: T, key: string) {
    this.itemList.splice(index, 0, value);
    var hashV = new HashValue<T>();
    hashV.index = index;
    hashV.key = key;
    hashV.value = value;
    this.items[key] = hashV;
    this.resetIndex();
  }

  sort(callback: Function) {
    this.itemList.sort((a: T, b: T) => {
      return callback(a, b);
    });
  }
}