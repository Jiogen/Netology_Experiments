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
      obstacleAt(location, size) {

        if (location.y + size.y > this.height) {return 'lava'}
        if (location.x + size.x > this.width) {return 'wall'}
        if (location.x < 0 || location.y < 0) {return 'wall'}
        
        let posY = Math.floor(location.y),
        posySizey = (location.y + size.y),
        posX = Math.floor(location.x),
        posxSizex = (location.x + size.x);

      for(let y = posY; y <= posySizey; y++) {
      for(let x = posX; x <= posxSizex; x++) {

        if(x + 1 == posxSizex && this.grid[y][x + 1] == 'lava') {
          return this.grid[y][x + 1];
        }
        if (y < posySizey && x < posxSizex && this.grid[y][x] !== undefined) {
          return this.grid[y][x];
        }
      }
    }
  }
    removeActor(deleteActor) {
      let deleteIndex = this.actors.indexOf(deleteActor);

      if(deleteIndex != -1) {
        this.actors.splice(deleteIndex, 1);
      }
    }
    noMoreActors(type) {
      let find = 0;

      if (!this.actors) {return true;}
        this.actors.forEach(function(element) {
      
      if (element.type == type) {find++};
    });

    if (find > 0) {return false;}
    return true;
  }
    playerTouched(type) {
      if (type === 'coin') {this.removeActor(arguments[1])}
      if (type === 'lava' || type === 'fireball') {return this.status = 'lost'};

      let coinCount = this.actors.reduce(function(count, element) {
        return element.type ==='coin' ? count += 1 : count;
    }, 0);
      if (coinCount === 0 && this.status != 'lost') {
        return this.status = 'won'}
  }
}//LEVEL
