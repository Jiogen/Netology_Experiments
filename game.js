'use strict';

// Function for check types of arguments in some functions...
function checkType(element, checkedType) {
  if (!(element instanceof checkedType)) {
    throw new Error(`Переданный объект [${element}] не тип [${checkedType.name}]`);
} else {
  return element;
  }
}

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(element) {
    checkType(element, Vector);
    return new Vector(element.x + this.x, element.y + this.y);
  }
  times(multiplier){
    return new Vector(multiplier * this.x, multiplier * this.y);
  }
}

class Actor {
  constructor(location = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    this.pos = checkType(location, Vector);
    this.size = checkType(size, Vector);
    this.speed = checkType(speed, Vector);
  } 
  get left() {return this.pos.x}
  get right() {return this.pos.x + this.size.x}
  get top() {return this.pos.y}
  get bottom() {return this.pos.y + this.size.y}
  get type() {return 'actor'}

  act() {}

  isIntersect(obj) {

    if (this == obj) {return false;}

    if ((obj.size.x < 0 && obj.size.y < 0) ||
          (( this.bottom <= obj.top ) ||
            ( this.top >= obj.bottom) ||
            ( this.left >= obj.right) ||
            ( this.right <= obj.left))) {
              return false;
            } else if ((( this.bottom >= obj.bottom) ||
                        ( this.top <= obj.top ) ||
                        ( this.right >= obj.right) ||
                        ( this.left <= obj.left))) {
              return true;
            }
  }
}

class Level {
  constructor(grid, actorsArray) {
    let height = 0, width = 0, player = '';

      if (grid instanceof Array) {
      height = grid.length;
      grid.forEach(function(element) {
        !element ? width = 0 : element instanceof Array ? width = element.length > width ? element.length : width : width = element.length;
        });
      }
      if (actorsArray instanceof Array) {
        player = actorsArray.find(function(element) {
          if(element.type === 'player') { 
            return element}
          });
        }

        this.grid = grid;
        this.actors = actorsArray;
        this.player = player;
        this.height = height;
        this.width = width;
        this.status = null;
        this.finishDelay = 1;

      }

      isFinished() {
        if (this.finishDelay < 0 && this.status !== null) {return true}
        if (this.finishDelay > 0 && this.status !== null) {return false}
        return false;
      }

      actorAt(obj) {
        checkType(obj, Actor);
        if (this.actors) {
          return this.actors.find(function(item) {
            return item.isIntersect(obj) ? obj : '';
          });
          this.actors.find(item => item.isIntersect(obj));
        }
        if (this.height === 0 && this.width === 0) {
          return undefined;
        }
        if (this.actors.length === 1) {
          return undefined;
        }
        if (obj.pos.y > this.height && obj.pos.x > this.width) {
          return undefined;
        }
      }
}
