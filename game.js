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