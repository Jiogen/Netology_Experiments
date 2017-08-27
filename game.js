'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(element) {
    return new Vector(element.x + this.x, element.y + element.y);
  }
  times(multiplier){
    return new Vector(multiplier * this.x, multiplier * this.y);
  }
}