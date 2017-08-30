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
    this.defaultPosition = new Vector(location.x, location.y);
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
        
        const posY = Math.floor(location.y),
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
      const deleteIndex = this.actors.indexOf(deleteActor);

      if(deleteIndex != -1) {
        this.actors.splice(deleteIndex, 1);
      }
    }
    noMoreActors(type) {
      let find = 0;

      if (!this.actors) {return true;}
        this.actors.forEach(function(element) {
      
      if (element.type === type) {find++}
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
}

class LevelParser  {
  constructor (data) {
    this.data = data;
  }

  actorFromSymbol(symbol) {
    if (!symbol) {
      return undefined;
    } else {
      for (let key in this.data) {
        if (key == symbol) {return this.data[key]}
      }
    }
  }

  obstacleFromSymbol(symbol) {
    if (!symbol) {return undefined;}
    if (symbol === 'x') {return 'wall'}
    if (symbol === '!') {return 'lava'}

    else {return undefined;}
  }
  createGrid(plan) {
    const resultArray = [];

    if (plan.length !== 0) {
      plan.map(function(line, y) {
        resultArray.push([]);
        for (let element of line) {
          if (element === 'x') {
            resultArray[y].push('wall');
          } else if (element === '!') {
            resultArray[y].push('lava');
          } else {
            resultArray[y].push(undefined);
          }
        }
      });
    }
    return resultArray;
  }
  createActors(plan) {
    const data = this.data;
    const resultArray = [];

    if (plan.length === 0) {
    } else {
      plan.forEach(function(item, i) {
        for (let q = 0; q < item.length; q++) {
          for (let key in data) {
            if (item[q] === key) {
              if (typeof data[key] === 'function') {
                let newActor = new data[item[q]](new Vector(q,i));
                if (newActor instanceof Actor) {
                  resultArray.push(newActor);
                }
              }
            }
          }
        }
      });
    }
    return resultArray;
  }
  parse(plan) {
    let level = new Level(plan, this.createActors(plan));
    level.grid = this.createGrid(level.grid);

    return level;
  }
}

class Fireball extends Actor {
  constructor(location, speed = new Vector(0, 0)) {
    super(location);
    this.speed = speed;
  }
  get type() {return 'fireball'}
  getNextPosition(time) {
    const supObj = {};

    if (this.speed.x === 0 && this.speed.y === 0) {return this.pos;}

    if (time) {
      supObj.x = this.pos.x + (this.speed.x * time);
      supObj.y = this.pos.y + (this.speed.y * time);

      return new Vector(supObj.x, supObj.y);
    } else {
      supObj.x = this.pos.x + this.speed.x;
      supObj.y = this.pos.y + this.speed.y;

      return new Vector(supObj.x, supObj.y);
    }
  }
  handleObstacle() {
    this.speed.x *= -1;
    this.speed.y *= -1;
  }
  act(time, level) {
    const newPosition = this.getNextPosition(time);

    if (level.obstacleAt(new Vector(newPosition.x, newPosition.y), this.size)) {
      this.handleObstacle();
    } else {
      this.pos.x = newPosition.x;
      this.pos.y = newPosition.y;
    }
  }
}

class HorizontalFireball extends Fireball {
  constructor(pos) {
    super(pos);

    this.size = new Vector(1,1);
    this.speed = new Vector(2, 0);
  }
}

class VerticalFireball extends Fireball {
  constructor(pos) {
    super(pos);

    this.size = new Vector(1,1);
    this.speed = new Vector(0, 2);
  }
}

class FireRain extends Fireball {
  constructor(pos) {
    super(pos);

    this.size = new Vector(1,1);
    this.speed = new Vector(0, 3);
  }
  handleObstacle() {
    this.pos.x = this.defaultPosition.x;
    this.pos.y = this.defaultPosition.y;
  }
}

class Coin extends Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    super(pos, size, speed);

    this.size = new Vector(0.6, 0.6);
    this.pos = this.pos.plus(new Vector(0.2, 0.1));
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * (2 * Math.PI);
    this.mainPosition = new Vector(this.pos.x, this.pos.y);
  }

  get type() {return 'coin'}

  updateSpring(time) {
    if(time) {
      this.spring += this.springSpeed * time;
    } else {
      this.spring += this.springSpeed;
    }
  }
  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }
  getNextPosition(time = 1) {
    this.updateSpring(time);
    return this.mainPosition.plus(this.getSpringVector());
  }
  act(time) {
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor {
  constructor(pos = new Vector(0, 0)) {
    super(pos);
    this.pos = this.pos.plus(new Vector(0, -0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector(0,0);
  }
  get type() {return 'player'}
}

const schemas = [
  [
    '   xxx   ',
    '   I v   ',
    'C       C',
    'x       x',
    '    P    ',
    '    x    ',
    '  x   x  ',
    'C       C',
    'x!xxxx!xx'
  ],
   [
    '         ',
    ' C       ',
    'xxxxxxxx ',
    '         ',
    '-       C',
    'xxxx x xx',
    '        I',
    'P        ',
    'x!xxxx!xx'
  ]
];
const actorDict = {
  'P': Player,
  'v': FireRain,
  '-': HorizontalFireball,
  'I': VerticalFireball,
  'C': Coin
}

const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => alert('Congratulations you won!'));