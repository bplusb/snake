var map = {
  snake: [[0,0],[0,1]],
  dirSet: [[0,1],[-1,0],[0,-1],[1,0]],
  food: null,
  dirNow: 0,
  width: 10,
  height: 15,
  pix: 40,
  start: false,
  canvas: null,
  context: null,
  times: 400,
  nogo: false,
  count: 0,
  add: function(a, b) {
    return [a[0]+b[0], a[1]+b[1]];
  },
  isEqual: function(a, b) {
    return a[0]==b[0]&&a[1]==b[1];
  },
  isValid: function(a) {
    return a[0]>=0&&a[1]>=0&&a[0]<map.width&&a[1]<map.height;
  },
  turn: function (d) {
    if (!map.start) {
      return;
    }
    if (map.nogo) {
      return;
    }
    if (d == map.dirNow) {
      setTimeout(map.forward, map.times);
      map.count ++;
    }
    else if (d != (map.dirNow + 2)%map.dirSet.length) {
      map.dirNow = d;
      map.nogo = true;
    }
  },
  generateFood: function () {
    var snake = map.snake;
    var width = map.width, height = map.height;
    var remain = width * height - snake.length;
    if (remain == 0) {
      map.start = false;
      return;
    }
    var tmp = Array(width);
    for (var i = 0; i < width; i++) {
      tmp[i] = Array(height);
    }
    for (k in snake) {
      tmp[snake[k][0]][snake[k][1]] = true;
    }
    var r = parseInt(Math.random()*remain);
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        if (!tmp[[i,j]]) {
          if (r==0) {
            map.food=[i,j];
            map.paintNode(map.food, 'red');
            return;
          }
          r --;
        }
      }
    }
  },
  forward: function () {
    map.count --;
    if (!map.start) {
      return;
    }
    var snake = map.snake;
    var newNode = map.add(snake[snake.length-1],map.dirSet[map.dirNow]);
    var oldNode = snake.shift();
    map.paintNode(oldNode, 'white');

    if (map.isValid(newNode) && snake.filter(function(tmp){return map.isEqual(tmp,newNode)}).length==0) {
      map.paintNode(newNode, 'green');
      snake.push(newNode);
      if (map.isEqual(newNode, map.food)) {
        map.paintNode(oldNode, 'green');
        snake.unshift(oldNode);

        map.generateFood();
      }
    }
    else {
      console.log(newNode[0], newNode[1]);
      map.start = false;
    }
    map.nogo = false;
    if (map.count == 0) {
      setTimeout(map.forward, map.times);
      map.count ++;
    }
  },
  paintFrame: function () {
    map.canvas = document.getElementById("canvas");
    map.context = map.canvas.getContext("2d");
    var canvas = map.canvas, context = map.context;
    var pix = map.pix, height = map.height, width = map.width;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, pix*height);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.moveTo(pix*width, 0);
    context.lineTo(pix*width, pix*height);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(pix*width, 0);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.moveTo(0, pix*height);
    context.lineTo(pix*width, pix*height);
    context.closePath();
    context.stroke();

    window.addEventListener('keydown', function(e) {
      var keyID = e.keyCode ? e.keyCode :e.which;
      if(keyID === 38 || keyID === 87)  { // up arrow and W
        map.turn(2)
      }
      if(keyID === 39 || keyID === 68)  { // right arrow and D
        map.turn(3);
      }
      if(keyID === 40 || keyID === 83)  { // down arrow and S
        map.turn(0);
      }
      if(keyID === 37 || keyID === 65)  { // left arrow and A
        map.turn(1);
      }
      if(keyID === 80)  {
        map.init();
      }
    }, true);
  },
  eraseAll: function() {
    var width = map.width, height = map.height, pix = map.pix;
    map.context.fillStyle="white";
    map.context.fillRect(2, 2, width*pix-4, height*pix-4);
  },
  paintNode: function (a, color) {
    var width = map.width, height = map.height, pix = map.pix;
    map.context.fillStyle=color;
    map.context.fillRect(a[0]*pix+2, a[1]*pix+2, pix-4, pix-4);
  },
  init: function () {
    map.start=false;
    map.snake=[[0,0],[0,1]];
    map.dirNow=0;
    map.eraseAll();
    for (o in map.snake) {
      map.paintNode(map.snake[o], 'green');
    }
    map.nogo = false;
    map.generateFood();

    if (map.count == 0) {
      setTimeout(map.forward, map.times);
      map.count ++;
    }
    map.start=true;
  }
}
