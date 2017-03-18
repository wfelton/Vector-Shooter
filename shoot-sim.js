////////////////////////////////////////////
var canvas = document.getElementById("myCanvas"),
  context = canvas.getContext("2d"),
  width = canvas.width = window.innerWidth,
  height = canvas.height = window.innerHeight * 2 / 3,
  particles = [],
  numParticles = 1,
  windVector = 0,
  groundY = height *2/3,
  displayVector=null,
    DEBUG=true,
    displayScale=10,
    gravity=2,
  //padding around grid
  p = 2,
  //scale size
  xSize = 20,
  ySize = 20;

function initialize() {
  inputX = $("#shootX").val() * xSize;
  inputY = $("#shootY").val() * ySize;
  displayVector=vector.create(PTS(inputX,inputY)*displayScale,-Math.atan2(inputY,inputX));
  for (var i = 0; i < numParticles; i += 1) {
    particles.push(particle.create(0, 0, PTS(inputX, inputY), -Math.atan2(inputY,inputX), gravity));
    particles[i].position.setLength( particles[i].position._magnitude*displayScale);
  }
drawBackground();
};

function drawBackground() {
  //context.clearRect(0, 0, width, height);
  if(displayVector._magnitude>0){
    displayVector.draw();
  }
  drawBoard();
  drawGround();
  //requestAnimationFrame(update);
};

function drawSimulation() {
  var partInView=true;
  for (var i = 0; i < numParticles; i += 1) {
    var p = particles[i];
    p.logParticle();
    p.update();
    p.drawParticle();

    partInView=(p.position.getY()<groundY);
  }
  return partInView;
};

function drawGround() {
  context.beginPath();
  context.fillStyle = "green";
  context.fillRect(0, groundY + 5, width, height);
  context.stroke();
  context.beginPath();
  context.fillStyle = "black";
  context.arc(2, groundY, 3, 0, Math.PI * 2, false);
  context.fill();
  context.stroke();
  context.closePath();
};

function drawBoard() {
  context.save();
  context.translate(0, groundY);
  //context.rotate(Math.PI);
  for (var x = 0; x <= width; x += xSize) {
    context.moveTo(0.5 + x + p, p);
    context.lineTo(0.5 + x + p, -height + p);
  }

  for (var x = 0; x >= -height; x -= ySize) {
    context.moveTo(p, 0.5 + x + p);
    context.lineTo(width + p, 0.5 + x + p);
  }

  context.strokeStyle = "black";
  context.stroke();
  context.restore();
}
///////////////////////////////////////////////////
var particle = {
  position: null,
  velocity: null,
  gravity: null,

  create: function(x, y, speed, direction, grav) {
    var obj = Object.create(this);
    obj.position = vector.create(PTS(x, groundY+y), Math.atan2(groundY+y, x));
    obj.velocity = vector.create(speed, direction);
    obj.gravity = vector.create(grav || 0, Math.PI / 2);
    return obj;
  },
  logParticle:function(){
    if (DEBUG){
      console.log("Position");
      console.log(this.position.logVector());
      console.log("Velocity");
      console.log(this.velocity.logVector());
      console.log("Gravity");
      console.log(this.gravity.logVector());
    }
  },
  setVelocity: function(mag, dir) {
    this.velocity.setLength(mag);
    this.velocity.setAngle(dir);
  },
  setPosition: function(mag,dir){
    this.position.setLength(mag);
    this.position.setAngle(dir);
  },

  accelerate: function(accel) {
    this.velocity.addTo(accel);
  },

  update: function() {
    this.position.addTo(this.velocity);
    this.velocity.addTo(this.gravity);
  },

  drawParticle: function() {
    context.beginPath();
    context.fillStyle = "red";
    context.arc(this.position.getX(), this.position.getY(), 4, 0, Math.PI * 2, false);
    context.fill();
  }
};

///////////////////////////////////////////////////
var vector = {
  _magnitude: 1,
  _direction: 0,
  _arrow: null,
  _startX: 0,
  _startY: groundY,
  create: function(mag, dir) {
    var obj = Object.create(this);
    obj._magnitude = mag/displayScale;
    obj._direction = dir;
    obj._arrow = vectorArrow.create();
    return obj;
  },

  move: function(x, y) {
    this._startX = x;
    this._startY = y;
  },

  draw: function(){
  this._arrow.drawVectorArrow(this._startX,this._startY,this.getX(),this.getY());
  },

  logVector: function (){
    if (DEBUG){
      console.log("----------------");
      console.log("Mag "+this._magnitude+" --Dir "+this._direction+" --startX "+this._startX+" --startY "+this._startY);
      console.log("xVal "+this.getX()+" --yVal "+this.getY());
    }
  },
  setAngle: function(angle) {
    this._direction = angle;
  },

  setLength: function(length) {
    this._magnitude = length;
  },
  getX: function() {
    return Math.cos(this._direction) * this._magnitude;
  },
  getY: function() {
    return Math.sin(this._direction) * this._magnitude;
  },

  add: function(v2) {
    return vector.create(this._x + v2.getX(), this._y + v2.getY());
  },

  addTo: function(v2) {
    this._magnitude = PTS(this.getX() + v2.getX(), this.getY() + v2.getY());
    this._direction = Math.atan2(this.getY() + v2.getY(), this.getX() + v2.getX())
  },

  subtractFrom: function(v2) {

  },

  multiplyBy: function(val) {
    this.magnitude *= val;
  },

  divideBy: function(val) {
    this._magnitude /= val;
  }
};
//////////////////////////////////////////////
/////////////////////////////////////////////////
var vectorArrow = {
  create: function() {
    var obj = Object.create(this);
    return obj;
  },

  drawVectorArrow: function(startX, startY, endX, endY) {
    context.save();
    context.translate(startX, startY);
    this.arrow(endX, endY);
    context.restore();

  },
  arrow: function(p1, p2) {
    context.save();
    p2=p2+3;
    p1=p1+1;
    var dist = PTS(p1,p2);
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = '#777';
    context.moveTo(0, 0);
    context.lineTo(p1, p2);
    context.stroke();

    var angle = Math.acos((p2) / dist);
    if (p1 < 0) angle = 2 * Math.PI - angle;
    var size = 8;
    context.beginPath();
    context.translate(p1, p2);
    context.rotate(-angle);
    context.fillStyle = '#777';
    context.lineWidth = 2;
    context.strokeStyle = '#333';
    context.moveTo(0, -size);
    context.lineTo(-size, -size);
    context.lineTo(0, 0);
    context.lineTo(size, -size);
    context.lineTo(0, -size);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
};


function runShoot() {
  drawBackground();
  while(drawSimulation()){
    requestAnimationFrame(runShoot);
  }
};

document.body.addEventListener("click", function(event) {
  if (event.clientX < width && event.clientY <groundY) {


    gridX = Math.round(event.clientX / xSize) * xSize;
    gridY = Math.round((groundY-event.clientY) / ySize) * ySize;
    if (DEBUG){
      console.log("eventX "+event.clientX+" eventY "+event.clientY);
      console.log("gridX "+gridX+" gridY "+gridY);
    }
    displayVector = vector.create(PTS(gridX,gridY)*displayScale, -Math.atan2(gridY,gridX));
    context.clearRect(0, 0, width, height);
    drawBackground();
    displayVector.draw();

    for (var i = 0; i < numParticles; i += 1) {
      var p = particles[i];
      p.setVelocity(PTS(gridX, gridY), -Math.atan2(gridY, gridX));
      p.setPosition(groundY,Math.PI/2);
    }
  }
});

function PTS(x, y) {
  return Math.sqrt(x * x + y * y);
};

initialize();
