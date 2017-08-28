'use strict';

// Function for check types of arguments in some functions...
function checkType(element, checkedType) {
  if (!(element instanceof checkedType)) {
    throw new Error(`Переданный объект [${element}] не тип ${checkedType.name}`);
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
  consturctor(location = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0) {
    this.pos = checkType(location, Vector);
    this.size = checkType(size, Vector);
    this.speed = checkType(speed, Vector);
  } 
}