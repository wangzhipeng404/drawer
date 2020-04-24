
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
  'use strict';

  var List = /** @class */ (function () {
      function List() {
          this.items = new Array();
      }
      List.prototype.checkIndex = function (index) {
          return !(index < 0 || isNaN(index) || index >= this.items.length);
      };
      List.prototype.length = function () {
          return this.items.length;
      };
      List.prototype.add = function (value) {
          this.items.push(value);
      };
      List.prototype.addList = function (valueList) {
          for (var i = 0; i < valueList.length(); i++) {
              var value = valueList.get(i);
              this.items.push(value);
          }
      };
      List.prototype.pop = function () {
          return this.items.pop();
      };
      List.prototype.shift = function () {
          this.items.shift();
      };
      List.prototype.remove = function (index) {
          if (this.checkIndex(index)) {
              this.items.splice(index, 1);
          }
      };
      /**
       * 從指定索引處開始刪除指定個數的元素
       * @param from
       * @param count
       */
      List.prototype.removeMany = function (from, count) {
          if (this.checkIndex(from)) {
              this.items.splice(from, count);
          }
      };
      List.prototype.clear = function () {
          this.items = [];
      };
      List.prototype.contains = function (value) {
          for (var i in this.items) {
              return value == this.items[i];
          }
          return false;
      };
      List.prototype.indexOf = function (value) {
          return this.items.indexOf(value);
      };
      List.prototype.insert = function (index, value) {
          //this.checkIndex(index) && this.items.splice(index , 0, value);
          this.items.splice(index, 0, value);
      };
      List.prototype.get = function (index) {
          return this.items[index];
      };
      List.prototype.set = function (index, value) {
          this.items[index] = value;
      };
      List.prototype.all = function () {
          return this.items;
      };
      List.prototype.foreach = function (callback) {
          var len = this.items.length;
          for (var i = 0; i < len; i++) {
              if (callback(i, this.items[i]) === false)
                  break;
          }
      };
      List.prototype.reverseForeach = function (callback) {
          var len = this.items.length;
          for (var i = len - 1; i >= 0; i--) {
              if (callback(i, this.items[i]) === false)
                  break;
          }
      };
      List.prototype.sort = function (callback) {
          this.items.sort(function (a, b) { return callback(a, b); });
      };
      return List;
  }());

  function getRandomColor() {
      var randColor = (Math.random() * 0xFFFFFF << 0).toString(16);
      while (randColor.length < 6) {
          randColor = "0" + randColor;
      }
      return randColor;
  }
  function getUniqueColorKey(elements) {
      var key = '';
      while (true) {
          key = getRandomColor();
          if (key && !(elements.has(key))) {
              break;
          }
      }
      return "#" + key;
  }
  function hexToRgbA(hex) {
      var c;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
          c = hex.substring(1).split('');
          if (c.length == 3) {
              c = [c.x, c.x, c.y, c.y, c[2], c[2]];
          }
          c = '0x' + c.join('');
          return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
      }
      throw new Error('Bad Hex');
  }
  function isInPolygon(checkPoint, polygonPoints) {
      var counter = 0;
      var i;
      var xinters;
      var p1, p2;
      var pointCount = polygonPoints.length();
      p1 = polygonPoints.get(0);
      for (i = 1; i <= pointCount; i++) {
          p2 = polygonPoints.get(i % pointCount);
          if (checkPoint.x > Math.min(p1.x, p2.x) &&
              checkPoint.x <= Math.max(p1.x, p2.x)) {
              if (checkPoint.y <= Math.max(p1.y, p2.y)) {
                  if (p1.x != p2.x) {
                      xinters =
                          (checkPoint.x - p1.x) *
                              (p2.y - p1.y) /
                              (p2.x - p1.x) +
                              p1.y;
                      if (p1.y == p2.y || checkPoint.y <= xinters) {
                          counter++;
                      }
                  }
              }
          }
          p1 = p2;
      }
      if (counter % 2 == 0) {
          return false;
      }
      else {
          return true;
      }
  }

  var Point = /** @class */ (function () {
      function Point(x, y) {
          this.x = x;
          this.y = y;
      }
      Point.prototype.draw = function (ctx) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(this.x + 0.5, this.y + 0.5, 2, 0, 360);
          ctx.stroke();
          ctx.closePath();
      };
      return Point;
  }());
  var PenShape = /** @class */ (function () {
      function PenShape(colorKey) {
          this.rgb = hexToRgbA(colorKey);
          this.colorKey = colorKey;
          this.lineColor = colorKey;
          this.lineWidth = 1;
          this.points = new List();
      }
      PenShape.prototype.copy = function (colorKey) {
          var copyed = new PenShape(colorKey);
          copyed.points.addList(this.points);
          return copyed;
      };
      PenShape.prototype.draw = function (ctx, isHintDraw, closePath) {
          var len = this.points.length();
          if (len >= 2) {
              ctx.fillStyle = 'green';
              if (isHintDraw) {
                  // ctx.strokeStyle = this.colorKey;
                  ctx.strokeStyle = '#f5222d';
              }
              else {
                  ctx.strokeStyle = '#1890ff';
              }
              ctx.lineWidth = this.lineWidth;
              ctx.beginPath();
              for (var i = 0; i < len - 1; i++) {
                  ctx.moveTo(this.points.get(i).x + 0.5, this.points.get(i).y + 0.5);
                  ctx.lineTo(this.points.get(i + 1).x + 0.5, this.points.get(i + 1).y + 0.5);
              }
              if (closePath) {
                  ctx.moveTo(this.points.get(len - 1).x + 0.5, this.points.get(len - 1).y + 0.5);
                  ctx.lineTo(this.points.get(0).x + 0.5, this.points.get(0).y + 0.5);
              }
              ctx.stroke();
              if (isHintDraw) {
                  this.points.foreach(function (index, point) {
                      point.draw(ctx);
                  });
              }
          }
      };
      return PenShape;
  }());
  var HashValue = /** @class */ (function () {
      function HashValue() {
      }
      return HashValue;
  }());
  var HashTable = /** @class */ (function () {
      function HashTable() {
          this.items = {};
          this.itemList = [];
      }
      HashTable.prototype.set = function (key, value) {
          var vl = new HashValue();
          vl.key = key;
          vl.value = value;
          var index = this.itemList.length;
          if (this.has(key)) {
              index = this.items[key].index;
          }
          vl.index = index;
          this.itemList[index] = value;
          this.items[key] = vl;
      };
      HashTable.prototype.del = function (key) {
          if (this.has(key)) {
              var index = this.items[key].index;
              if (index > -1) {
                  this.itemList.splice(index, 1);
              }
              delete this.items[key];
              this.resetIndex();
          }
      };
      HashTable.prototype.resetIndex = function () {
          var _this = this;
          this.foreach(function (k, v) {
              var index = _this.itemList.indexOf(v);
              _this.items[k].index = index;
          });
      };
      HashTable.prototype.has = function (key) {
          return key in this.items;
      };
      HashTable.prototype.get = function (key) {
          if (this.has(key)) {
              return this.items[key].value;
          }
          return null;
      };
      HashTable.prototype.count = function () {
          return this.itemList.length;
      };
      HashTable.prototype.all = function () {
          return this.itemList;
      };
      HashTable.prototype.first = function () {
          return this.itemList[0];
      };
      HashTable.prototype.last = function () {
          return this.itemList[this.itemList.length - 1];
      };
      HashTable.prototype.getByIndex = function (index) {
          return this.itemList[index];
      };
      //遍历 扩展
      HashTable.prototype.foreach = function (callback) {
          for (var key in this.items) {
              callback(key, this.items[key].value);
          }
      };
      //获取index
      HashTable.prototype.indexOf = function (key) {
          if (this.has(key)) {
              return this.items[key].index;
          }
      };
      //插入
      HashTable.prototype.insertAt = function (index, value, key) {
          this.itemList.splice(index, 0, value);
          var hashV = new HashValue();
          hashV.index = index;
          hashV.key = key;
          hashV.value = value;
          this.items[key] = hashV;
          this.resetIndex();
      };
      HashTable.prototype.sort = function (callback) {
          this.itemList.sort(function (a, b) {
              return callback(a, b);
          });
      };
      return HashTable;
  }());

  var $select = document.getElementById('select');
  var $copy = document.getElementById('copy');
  var $drawRect = document.getElementById('draw-rect');
  var $drawShape = document.getElementById('draw-shape');
  var $eraser = document.getElementById('eraser');
  var $undo = document.getElementById('undo');
  var $del = document.getElementById('delte-btn');
  var $cleanup = document.getElementById('cleanup');
  var $connfirmBtn = document.getElementById('confirm-btn');
  var $cancelBtn = document.getElementById('cancel-btn');
  var hintCanvas = document.getElementById('hint-canvas');
  var mainCanvas = document.getElementById('main-canvas');
  var mainContext = mainCanvas.getContext('2d');
  var context = hintCanvas.getContext('2d');
  var hashTable = new HashTable();
  var currentPenline = null;
  var copyPenLine = null;
  var editMode = 'draw';
  var drawMode = 'rect';
  var shapeState = 'disable';
  function removeBtnActive() {
      var els = document.getElementsByClassName('btn-active');
      for (var i = 0; i < els.length; i++) {
          els[i].classList.remove('btn-active');
      }
  }
  $select.addEventListener('click', function (e) {
      e.preventDefault();
      editMode = 'select';
      removeBtnActive();
      $select.classList.add('btn-active');
  });
  $copy.addEventListener('click', function (e) {
      e.preventDefault();
      editMode = 'copy';
      removeBtnActive();
      $copy.classList.add('btn-active');
  });
  $drawRect.addEventListener('click', function (e) {
      e.preventDefault();
      editMode = 'draw';
      drawMode = 'rect';
      shapeState = 'enable';
      removeBtnActive();
      $drawRect.classList.add('btn-active');
  });
  $drawShape.addEventListener('click', function (e) {
      e.preventDefault();
      editMode = 'draw';
      drawMode = 'shape';
      shapeState = 'enable';
      removeBtnActive();
      $drawShape.classList.add('btn-active');
  });
  /* $eraser.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('eraser')
    editMode = 'eraser'
  })
   */
  $cleanup.addEventListener('click', function (e) {
      e.preventDefault();
      hashTable = new HashTable();
      mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      removeBtnActive();
      $drawRect.classList.add('btn-active');
  });
  $undo.addEventListener('click', function (e) {
      e.preventDefault();
      var last = hashTable.last();
      if (last) {
          hashTable.del(last.colorKey);
          mainDraw();
      }
      removeBtnActive();
      $drawRect.classList.add('btn-active');
  });
  $del.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentPenline) {
          hashTable.del(currentPenline.colorKey);
          currentPenline = null;
          hintClear();
          mainDraw();
          editMode = 'draw';
      }
  });
  $connfirmBtn.addEventListener('click', function (e) {
      if (editMode === 'edit') {
          hashTable.set(currentPenline.colorKey, currentPenline);
          currentPenline = null;
          hintClear();
          mainDraw();
          editMode = 'draw';
      }
      removeBtnActive();
      $drawRect.classList.add('btn-active');
  });
  $cancelBtn.addEventListener('click', function (e) {
      if (editMode === 'edit') {
          if (copyPenLine) {
              var restShape = new PenShape(currentPenline.colorKey);
              restShape.points.addList(copyPenLine.points);
              hashTable.set(currentPenline.colorKey, restShape);
              copyPenLine = null;
          }
          currentPenline = null;
          hintClear();
          mainDraw();
          editMode = 'draw';
      }
      removeBtnActive();
      $drawRect.classList.add('btn-active');
  });
  var _a = hintCanvas.getBoundingClientRect(), rectWidth = _a.width, rectHeight = _a.height, rectLeft = _a.left, reactTop = _a.top;
  var canvasWidth = hintCanvas.width, canvasHeight = hintCanvas.height;
  var scaleX = (canvasWidth / rectWidth);
  var scaleY = (canvasHeight / rectHeight);
  var offsetLeft = rectLeft;
  var offsetTop = reactTop;
  function hintClear() {
      context.clearRect(0, 0, hintCanvas.width, hintCanvas.height);
  }
  function hintDraw() {
      hintClear();
      currentPenline.draw(context, true, editMode !== 'draw' || drawMode === 'rect');
  }
  function mainDraw() {
      mainContext.clearRect(0, 0, mainContext.canvas.width, mainContext.canvas.height); // 清除画布内容
      hashTable.foreach(function (key, val) {
          if (!currentPenline || key !== currentPenline.colorKey) {
              val.draw(mainContext, false, true);
          }
      });
  }
  var keepPoint;
  var keepPointIndex;
  hintCanvas.addEventListener('mousedown', function (e) {
      e.preventDefault();
      var point = new Point(Math.floor((e.pageX - offsetLeft) * scaleX), Math.floor((e.pageY - offsetTop) * scaleY));
      if (editMode === 'edit') {
          currentPenline.points.foreach(function (index, p) {
              if (Math.abs(p.x - point.x) < 3 && Math.abs(p.y - point.y) < 3) {
                  keepPointIndex = index;
              }
          });
      }
      if (editMode === 'draw') {
          if (!currentPenline) {
              var colorKey = getUniqueColorKey(hashTable);
              currentPenline = new PenShape(colorKey);
          }
          if (drawMode === 'shape') {
              var len = currentPenline.points.length();
              if (len === 0) {
                  currentPenline.points.add(point);
              }
              else {
                  var p0 = currentPenline.points.get(0);
                  if (Math.abs(p0.x - point.x) < 3 && Math.abs(p0.y - point.y) < 3) {
                      currentPenline.points.remove(len - 1);
                      shapeState = 'disable';
                      editMode = 'edit';
                      removeBtnActive();
                  }
              }
              if (shapeState === 'enable') {
                  currentPenline.points.add(point);
              }
          }
          if (drawMode === 'rect') {
              currentPenline.points.add(point);
              currentPenline.points.add(point);
              currentPenline.points.add(point);
              currentPenline.points.add(point);
          }
      }
      if (editMode === 'select' || editMode === 'copy') {
          hashTable.foreach(function (key) {
              if (isInPolygon(point, hashTable.get(key).points)) {
                  currentPenline = hashTable.get(key);
              }
          });
          if (currentPenline) {
              copyPenLine = currentPenline.copy(getUniqueColorKey(hashTable));
              if (editMode === 'copy') {
                  currentPenline = copyPenLine;
                  copyPenLine = null;
              }
              keepPoint = point;
              mainDraw();
          }
      }
      if (currentPenline) {
          hintDraw();
      }
  });
  var onMouseMoveHandler = function (e) {
      e.preventDefault();
      if (currentPenline) {
          var x_1 = Math.floor((e.pageX - offsetLeft) * scaleX);
          var y_1 = Math.floor((e.pageY - offsetTop) * scaleY);
          if (editMode === 'draw') {
              if (drawMode === 'rect') {
                  var point0 = currentPenline.points.get(0);
                  var point1 = new Point(point0.x, y_1);
                  var point2 = new Point(x_1, y_1);
                  var point3 = new Point(x_1, point0.y);
                  currentPenline.points.set(1, point1);
                  currentPenline.points.set(2, point2);
                  currentPenline.points.set(3, point3);
              }
              if (drawMode === 'shape' && shapeState === 'enable') {
                  currentPenline.points.set(currentPenline.points.length() - 1, new Point(x_1, y_1));
              }
              hintDraw();
          }
          if (editMode === 'select' || editMode === 'copy') {
              currentPenline.points.foreach(function (index, point) {
                  currentPenline.points.set(index, new Point(point.x - (keepPoint.x - x_1), point.y - (keepPoint.y - y_1)));
              });
              keepPoint = new Point(x_1, y_1);
              hintDraw();
          }
          if (editMode === 'edit') {
              if (keepPointIndex !== null) {
                  currentPenline.points.set(keepPointIndex, new Point(x_1, y_1));
                  hintDraw();
              }
          }
      }
  };
  hintCanvas.addEventListener('mousemove', onMouseMoveHandler);
  hintCanvas.addEventListener('mouseup', function (e) {
      e.preventDefault();
      if (keepPointIndex !== null) {
          keepPointIndex = null;
      }
      if (drawMode !== 'shape' || editMode === 'select' || editMode === 'copy') {
          editMode = 'edit';
          removeBtnActive();
      }
  });
  hintCanvas.addEventListener('mouseleava', function (e) {
  });

}());
//# sourceMappingURL=bundle.iife.js.map
