'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(element) {
    // Do not forget to finish that! (need check)
    return new Vector(element.x + this.x, element.y + element.y);
  }
  times(multiplier){
    return new Vector(multiplier * this.x, multiplier * this.y);
  }
}

class Actor {
  consturctor(location = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0) {
    //Do not forget finish that (need check type of argument...Maybe new function ?)
    
  } 
}