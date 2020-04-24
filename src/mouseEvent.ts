const impressEvent = {
  on (el: HTMLElement, eventType: string, callback: (e: MouseEvent) => void) {
    el.addEventListener(eventType, callback)
  }
}

export class MouseEventInfo {
  el: HTMLElement;
  onmouseDown: Function;
  ondragMove: Function;
  ondragUp: Function;
  onmouseMove: Function;
  onmouseUp: Function;
  mouseWheel: Function;
  onContextMenu: Function;
  constructor(
    ele: HTMLElement, 
    mouseDown: Function, 
    dragMove: Function, 
    dragUp: Function, 
    mouseMove: Function, 
    mouseUp: Function, 
    mouseWheel: Function, 
    contexMenu: Function,
  ) {
      this.el = ele;
      this.onmouseDown = mouseDown || null;
      this.ondragMove = dragMove || null;
      this.ondragUp = dragUp || null;
      this.onmouseMove = mouseMove || null;
      this.onmouseUp = mouseUp || null;
      this.mouseWheel = mouseWheel || null
      this.onContextMenu = contexMenu;
  }
}

export class MouseEventClass {
  x: number;
  y: number;
  down: boolean;
  dragging: boolean;
  scroll: boolean;
  lastX: number;
  lastY: number;
  startX: number;
  startY: number;
  moveCount: number;
  eventInfo: MouseEventInfo;
  constructor(eInfo: MouseEventInfo) {
      this.moveCount = 0;
      this.x = 0;
      this.y = 0;
      this.lastX = 0;
      this.lastY = 0;
      this.startX = 0;
      this.startY = 0;
      this.down = false;
      this.eventInfo = eInfo;
      this.dragging = false;
      this.scroll = false;

      var on = impressEvent.on;
      var self = this;
      if (this.eventInfo.el) {
          on(this.eventInfo.el, "mousedown", function (e) {
              if (e.button == 1 || e.button == 2) {
                  e.preventDefault();
                  return false;
              }
              self.mousedownHandler(e);
          });
          (this.eventInfo.ondragMove || this.eventInfo.onmouseMove) && on(this.eventInfo.el, "mousemove", function (e) {
              if (e.button == 1 || e.button == 2) {
                  e.preventDefault();
                  return false;
              }
              self.mousemoveHandler(e);
          });
          (this.eventInfo.ondragUp || this.eventInfo.onmouseUp) && on(this.eventInfo.el, "mouseup", function (e) {
              if (e.button == 1 || e.button == 2) {
                  e.preventDefault();
                  return false;
              }
              self.mouseupHandler(e);
          });
          this.eventInfo.mouseWheel && on(this.eventInfo.el, "mousewheel", function (e) {
              if (e.button == 1 || e.button == 2) {
                  e.preventDefault();
                  return false;
              }
              self.mouseWheelHandler(e);
          });
          this.eventInfo.onContextMenu && on(this.eventInfo.el, "contextmenu", function (e) {
              if (e.button == 1) {
                  e.preventDefault();
                  return false;
              }
              e.preventDefault();
              self.contextMenuHandler(e);
          })
      };
  }

  mousedownHandler = function (evt: MouseEvent) {
      const {
        left: leftWidth,
        top: topHeight,
      } = this.eventInfo.getBoundingClientRect()
      this.moveCount = 1;
      this.down = true;
      this.startX = evt.pageX;
      this.startY = evt.pageY;
      this.dragging = false;
      this.eventInfo.el && this.eventInfo.onmouseDown && (this.eventInfo.onmouseDown({
          evt: evt,
          target: this.eventInfo.el,
          mouseX: this.startX - leftWidth,
          mouseY: this.startY - topHeight,
          buttonCode: evt.button
      }));
      this.lastX = evt.pageX;
      this.lastY = evt.pageY;
  };
  mousemoveHandler = function (evt: MouseEvent) {
    const {
      left: leftWidth,
      top: topHeight,
    } = this.eventInfo.getBoundingClientRect()
      this.moveCount++;
      this.x = evt.pageX;
      this.y = evt.pageY;
      if (this.down && (this.x - this.startX != 0 || this.y - this.startY != 0)) {
          this.dragging = true;
      }
      if (this.dragging) {
          this.eventInfo.ondragMove && this.eventInfo.ondragMove({
              evt: evt,
              isFirstMove: this.moveCount == 1 ? true : false,
              mouseX: this.x - leftWidth,
              mouseY: this.y - topHeight,
              downX: this.startX - leftWidth,
              downY: this.startY - topHeight,
              lastX: this.lastX - leftWidth,
              lastY: this.lastY - topHeight,
              noRoteDiffX: this.x - this.lastX,
              noRoteDiffY: this.y - this.lastY,
              totalX: this.x - this.startX,
              totalY: this.y - this.startY
          })
      } else {
          this.eventInfo.onmouseMove && this.eventInfo.onmouseMove({
              evt: evt,
              mouseX: this.x - leftWidth,
              mouseY: this.y - topHeight,
              downX: this.startX - leftWidth,
              downY: this.startY - topHeight,
              lastX: this.lastX - leftWidth,
              lastY: this.lastY - topHeight,
              noRoteDiffX: this.x - this.lastX,
              noRoteDiffY: this.y - this.lastY,
              totalX: this.x - this.startX,
              totalY: this.y - this.startY
          })
      }
      this.lastX = evt.pageX;
      this.lastY = evt.pageY;
  }

  mouseupHandler = (evt: MouseEvent) => {
    this.down = false
  }

  mouseWheelHandler = (evt: MouseEvent) => {
    
  }

  contextMenuHandler = (evt: MouseEvent) => {
    
  }
}