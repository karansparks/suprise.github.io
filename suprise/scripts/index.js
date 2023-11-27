const count = document.getElementById('count');
const head = document.getElementById('head');
const giftbox = document.getElementById('merrywrap');
const canvasC = document.getElementById('c');
const config = {
  birthdate: 'Nov 29, 2023',
  name: 'Pavi'
};

function hideEverything() {
  head.style.display = 'none';
  count.style.display = 'none';
  giftbox.style.display = 'none';
  canvasC.style.display = 'none';
}

hideEverything();

const confettiSettings = { target: 'confetti' };
const confetti = new window.ConfettiGenerator(confettiSettings);
confetti.render();

const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;

let countDown = new Date(`${config.birthdate} 00:00:00`).getTime();
x = setInterval(function() {
  let now = new Date().getTime(),
    distance = countDown - now;

  document.getElementById('day').innerText = Math.floor(distance / day);
  document.getElementById('hour').innerText = Math.floor(
    (distance % day) / hour
  );
  document.getElementById('minute').innerText = Math.floor(
    (distance % hour) / minute
  );
  document.getElementById('second').innerText = Math.floor(
    (distance % minute) / second
  );
  document.getElementById('vid').play();

  let w = (c.width = window.innerWidth),
    h = (c.height = window.innerHeight),
    ctx = c.getContext('2d'),
    hw = w / 2, // half-width
    hh = h / 2,
    opts = {
      strings: ['HAPPY', 'BIRTHDAY!', config.name],
      charSize: 30,
      charSpacing: 35,
      lineHeight: 40,

      cx: w / 2,
      cy: h / 2,

      fireworkPrevPoints: 10,
      fireworkBaseLineWidth: 5,
      fireworkAddedLineWidth: 8,
      fireworkSpawnTime: 200,
      fireworkBaseReachTime: 30,
      fireworkAddedReachTime: 30,
      fireworkCircleBaseSize: 20,
      fireworkCircleAddedSize: 10,
      fireworkCircleBaseTime: 30,
      fireworkCircleAddedTime: 30,
      fireworkCircleFadeBaseTime: 10,
      fireworkCircleFadeAddedTime: 5,
      fireworkBaseShards: 5,
      fireworkAddedShards: 5,
      fireworkShardPrevPoints: 3,
      fireworkShardBaseVel: 4,
      fireworkShardAddedVel: 2,
      fireworkShardBaseSize: 3,
      fireworkShardAddedSize: 3,
      gravity: 0.1,
      upFlow: -0.1,
      letterContemplatingWaitTime: 360,
      balloonSpawnTime: 20,
      balloonBaseInflateTime: 10,
      balloonAddedInflateTime: 10,
      balloonBaseSize: 20,
      balloonAddedSize: 20,
      balloonBaseVel: 0.4,
      balloonAddedVel: 0.4,
      balloonBaseRadian: -(Math.PI / 2 - 0.5),
      balloonAddedRadian: -1
    },
    calc = {
      totalWidth:
        opts.charSpacing *
        Math.max(opts.strings[0].length, opts.strings[1].length)
    },
    Tau = Math.PI * 2,
    TauQuarter = Tau / 4,
    letters = [];

  ctx.font = opts.charSize + 'px Verdana';

  function Letter(char, x, y) {
    this.char = char;
    this.x = x;
    this.y = y;

    this.dx = -ctx.measureText(char).width / 2;
    this.dy = +opts.charSize / 2;

    this.fireworkDy = this.y - hh;

    let hue = (x / calc.totalWidth) * 360;

    this.color = 'hsl(hue,80%,50%)'.replace('hue', hue);
    this.lightAlphaColor = 'hsla(hue,80%,light%,alp)'.replace('hue', hue);
    this.lightColor = 'hsl(hue,80%,light%)'.replace('hue', hue);
    this.alphaColor = 'hsla(hue,80%,50%,alp)'.replace('hue', hue);

    this.reset();
  }
  Letter.prototype.reset = function() {
    this.phase = 'firework';
    this.tick = 0;
    this.spawned = false;
    this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
    this.reachTime =
      (opts.fireworkBaseReachTime +
        opts.fireworkAddedReachTime * Math.random()) |
      0;
    this.lineWidth =
      opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
    this.prevPoints = [[0, hh, 0]];
  };
  Letter.prototype.step = function() {
    if (this.phase === 'firework') {
      if (!this.spawned) {
        ++this.tick;
        if (this.tick >= this.spawningTime) {
          this.tick = 0;
          this.spawned = true;
        }
      } else {
        ++this.tick;

        let linearProportion = this.tick / this.reachTime,
          armonicProportion = Math.sin(linearProportion * TauQuarter),
          x = linearProportion * this.x,
          y = hh + armonicProportion * this.fireworkDy;

        if (this.prevPoints.length > opts.fireworkPrevPoints)
          this.prevPoints.shift();

        this.prevPoints.push([x, y, linearProportion * this.lineWidth]);

        let lineWidthProportion = 1 / (this.prevPoints.length - 1);

        for (let i = 1; i < this.prevPoints.length; ++i) {
          let point = this.prevPoints[i],
            point2 = this.prevPoints[i - 1];

          ctx.strokeStyle = this.alphaColor.replace(
            'alp',
            i / this.prevPoints.length
          );
          ctx.lineWidth = point[2] * lineWidthProportion * i;
          ctx.beginPath();
          ctx.moveTo(point[0], point[1]);
          ctx.lineTo(point2[0], point2[1]);
          ctx.stroke();
        }

        if (this.tick >= this.reachTime) {
          this.phase = 'contemplate';

          this.circleFinalSize =
            opts.fireworkCircleBaseSize +
            opts.fireworkCircleAddedSize * Math.random();
          this.circleCompleteTime =
            (opts.fireworkCircleBaseTime +
              opts.fireworkCircleAddedTime * Math.random()) |
            0;
          this.circleCreating = true;
          this.circleFading = false;

          this.circleFadeTime =
            (opts.fireworkCircleFadeBaseTime +
              opts.fireworkCircleFadeAddedTime * Math.random()) |
            0;
          this.tick = 0;
          this.tick2 = 0;

          this.shards = [];

          let shardCount =
              (opts.fireworkBaseShards +
                opts.fireworkAddedShards * Math.random()) |
              0,
            angle = Tau / shardCount,
            cos = Math.cos(angle),
            sin = Math.sin(angle),
            x = 1,
            y = 0;

          for (let i = 0; i < shardCount; ++i) {
            let x1 = x;
            x = x * cos - y * sin;
            y = y * cos + x1 * sin;

            this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
          }
        }
      }
    } else if (this.phase === 'contemplate') {
      ++this.tick;

      if (this.circleCreating) {
        ++this.tick2;
        let proportion = this.tick2 / this.circleCompleteTime,
          armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

        ctx.beginPath();
        ctx.fillStyle = this.lightAlphaColor
          .replace('light', 50 + 50 * proportion)
          .replace('alp', proportion);
        ctx.beginPath();
        ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
        ctx.fill();

        if (this.tick2 > this.circleCompleteTime) {
          this.tick2 = 0;
          this.circleCreating = false;
          this.circleFading = true;
        }
      } else if (this.circleFading) {
        ctx.fillStyle = this.lightColor.replace('light', 70);
        ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

        ++this.tick2;
        let proportion = this.tick2 / this.circleFadeTime,
          armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

        ctx.beginPath();
        ctx.fillStyle = this.lightAlphaColor
          .replace('light', 100)
          .replace('alp', 1 - armonic);
        ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
        ctx.fill();

        if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
      } else {
        ctx.fillStyle = this.lightColor.replace('light', 70);
        ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
      }

      for (let i = 0; i < this.shards.length; ++i) {
        this.shards[i].step();

        if (!this.shards[i].alive) {
          this.shards.splice(i, 1);
          --i;
        }
      }

      if (this.tick > opts.letterContemplatingWaitTime) {
        this.phase = 'balloon';

        this.tick = 0;
        this.spawning = true;
        this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;
        this.inflating = false;
        this.inflateTime =
          (opts.balloonBaseInflateTime +
            opts.balloonAddedInflateTime * Math.random()) |
          0;
        this.size =
          (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;

        let rad =
            opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
          vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

        this.vx = Math.cos(rad) * vel;
        this.vy = Math.sin(rad) * vel;
      }
    } else if (this.phase === 'balloon') {
      ctx.strokeStyle = this.lightColor.replace('light', 80);

      if (this.spawning) {
        ++this.tick;
        ctx.fillStyle = this.lightColor.replace('light', 70);
        ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

        if (this.tick >= this.spawnTime) {
          this.tick = 0;
          this.spawning = false;
          this.inflating = true;
        }
      } else if (this.inflating) {
        ++this.tick;

        let proportion = this.tick / this.inflateTime,
          x = (this.cx = this.x),
          y = (this.cy = this.y - this.size * proportion);

        ctx.fillStyle = this.alphaColor.replace('alp', proportion);
        ctx.beginPath();
        generateBalloonPath(x, y, this.size * proportion);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, this.y);
        ctx.stroke();

        ctx.fillStyle = this.lightColor.replace('light', 70);
        ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

        if (this.tick >= this.inflateTime) {
          this.tick = 0;
          this.inflating = false;
        }
      } else {
        this.cx += this.vx;
        this.cy += this.vy += opts.upFlow;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        generateBalloonPath(this.cx, this.cy, this.size);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.cx, this.cy);
        ctx.lineTo(this.cx, this.cy + this.size);
        ctx.stroke();

        ctx.fillStyle = this.lightColor.replace('light', 70);
        ctx.fillText(
          this.char,
          this.cx + this.dx,
          this.cy + this.dy + this.size
        );

        if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw)
          this.phase = 'done';
      }
    }
  };

  function Shard(x, y, vx, vy, color) {
    let vel =
      opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();

    this.vx = vx * vel;
    this.vy = vy * vel;

    this.x = x;
    this.y = y;

    this.prevPoints = [[x, y]];
    this.color = color;

    this.alive = true;

    this.size =
      opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
  }
  Shard.prototype.step = function() {
    this.x += this.vx;
    this.y += this.vy += opts.gravity;

    if (this.prevPoints.length > opts.fireworkShardPrevPoints)
      this.prevPoints.shift();

    this.prevPoints.push([this.x, this.y]);

    let lineWidthProportion = this.size / this.prevPoints.length;

    for (let k = 0; k < this.prevPoints.length - 1; ++k) {
      let point = this.prevPoints[k],
        point2 = this.prevPoints[k + 1];

      ctx.strokeStyle = this.color.replace('alp', k / this.prevPoints.length);
      ctx.lineWidth = k * lineWidthProportion;
      ctx.beginPath();
      ctx.moveTo(point[0], point[1]);
      ctx.lineTo(point2[0], point2[1]);
      ctx.stroke();
    }

    if (this.prevPoints[0][1] > hh) this.alive = false;
  };

  function generateBalloonPath(x, y, size) {
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x - size / 2,
      y - size / 2,
      x - size / 4,
      y - size,
      x,
      y - size
    );
    ctx.bezierCurveTo(x + size / 4, y - size, x + size / 2, y - size / 2, x, y);
  }

  function anim() {
    window.requestAnimationFrame(anim);

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);

    ctx.translate(hw, hh);

    let done = true;
    for (let l = 0; l < letters.length; ++l) {
      letters[l].step();
      if (letters[l].phase !== 'done') done = false;
    }

    ctx.translate(-hw, -hh);

    if (done) for (let l = 0; l < letters.length; ++l) letters[l].reset();
  }

  for (let i = 0; i < opts.strings.length; ++i) {
    for (let j = 0; j < opts.strings[i].length; ++j) {
      letters.push(
        new Letter(
          opts.strings[i][j],
          j * opts.charSpacing +
            opts.charSpacing / 2 -
            (opts.strings[i].length * opts.charSize) / 2,
          i * opts.lineHeight +
            opts.lineHeight / 2 -
            (opts.strings.length * opts.lineHeight) / 2
        )
      );
    }
  }

  window.addEventListener('resize', function() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;

    hw = w / 2;
    hh = h / 2;

    ctx.font = opts.charSize + 'px Verdana';
  });

  if (distance > 0) {
    head.style.display = 'initial';
    count.style.display = 'initial';
  } else {
    head.style.display = 'none';
    count.style.display = 'none';
    giftbox.style.display = 'initial';
    clearInterval(x);
    let merrywrap = document.getElementById('merrywrap');
    let box = merrywrap.getElementsByClassName('giftbox')[0];
    let step = 1;
    let stepMinutes = [2000, 2000, 1000, 1000];

    function init() {
      box.addEventListener('click', openBox, false);
      box.addEventListener('click', showfireworks, false);
    }

    function stepClass(step) {
      merrywrap.className = 'merrywrap';
      merrywrap.className = 'merrywrap step-' + step;
    }

    function openBox() {
      if (step === 1) {
        box.removeEventListener('click', openBox, false);
      }
      stepClass(step);
      if (step === 3) {
      }
      if (step === 4) {
        return;
      }
      setTimeout(openBox, stepMinutes[step - 1]);
      step++;
      //   setTimeout(anim, 1900);
    }

    function showfireworks() {
      canvasC.style.display = 'initial';
      setTimeout(anim, 1500);
    }

    init();
  }

  // if (distance < 0) {
  //     clearInterval(x);
  //     console.log("happy birthday");
  // }
}, second);





function getLength(x0, y0, x1, y1) {
  // returns the length of a line segment
  const x = x1 - x0;
  const y = y1 - y0;
  return Math.sqrt(x * x + y * y);
}

function getDegAngle(x0, y0, x1, y1) {
  const y = y1 - y0;
  const x = x1 - x0;
  return Math.atan2(y, x) * (180 / Math.PI);
}

// some constants
const DECAY = 4;        // confetti decay in seconds
const SPREAD = 60;      // degrees to spread from the angle of the cannon
const GRAVITY = 1200;

class ConfettiCannon {
  constructor() {
      // setup a canvas
      this.canvas = document.getElementById('canvas');
      this.dpr = window.devicePixelRatio || 1;
      this.ctx = this.canvas.getContext('2d');
      this.ctx.scale(this.dpr, this.dpr);

      // add confetti here
      this.confettiSpriteIds = [];
      this.confettiSprites = {};
      
      // vector line representing the firing angle
      this.drawVector = false;
      this.vector = [{
          x: window.innerWidth, 
          y: window.innerHeight * 1.25,
      }, {
          x: window.innerWidth, 
          y: window.innerHeight * 2,
      }];
      
      this.pointer = {};
      
      // bind methods
      this.render = this.render.bind(this);
      this.handleMousedown = this.handleMousedown.bind(this);
      this.handleMouseup = this.handleMouseup.bind(this);
      this.handleMousemove = this.handleMousemove.bind(this);
      this.handleTouchstart = this.handleTouchstart.bind(this);
      this.handleTouchmove = this.handleTouchmove.bind(this);
      this.setCanvasSize = this.setCanvasSize.bind(this);
      
      this.setupListeners();
      this.setCanvasSize();
      
      // fire off for a demo
      this.timer = setTimeout(this.handleMouseup, 1000);
  }
  
  setupListeners() {
      // Use TweenLite tick event for the render loop
      TweenLite.ticker.addEventListener('tick', this.render);
      
      // bind events
      window.addEventListener('mousedown', this.handleMousedown);
      window.addEventListener('mouseup', this.handleMouseup);
      window.addEventListener('mousemove', this.handleMousemove);
      window.addEventListener('touchstart', this.handleTouchstart);
      window.addEventListener('touchend', this.handleMouseup);
      window.addEventListener('touchmove', this.handleTouchmove);
      window.addEventListener('resize', this.setCanvasSize);
  }

  setCanvasSize() {
      this.canvas.width = window.innerWidth * this.dpr;
      this.canvas.height = window.innerHeight * this.dpr;
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
  }
  
  handleMousedown(event) {
      clearTimeout(this.timer);
      const x = event.clientX * this.dpr;
      const y = event.clientY * this.dpr;
      
      this.vector[0] = {
          x,
          y,
      };
      this.drawVector = true;
  }
  
  handleTouchstart(event) {
      clearTimeout(this.timer);
      event.preventDefault();
      const x = event.touches[0].clientX * this.dpr;
      const y = event.touches[0].clientY * this.dpr;
      this.vector[0] = {
          x,
          y,
      };
      
      this.drawVector = true;
  }
  
  handleMouseup(event) {
      this.drawVector = false;
      
      const x0 = this.vector[0].x;
      const y0 = this.vector[0].y;
      const x1 = this.vector[1].x;
      const y1 = this.vector[1].y;
      
      const length = getLength(x0, y0, x1, y1);
      const angle = getDegAngle(x0, y0, x1, y1) + 180;

      const particles = length / 5 + 5;
      const velocity = length * 10;
      this.addConfettiParticles(particles, angle, velocity, x0, y0);
  }
  
  handleMousemove(event) {
      const x = event.clientX * this.dpr;
      const y = event.clientY * this.dpr;   
      this.vector[1] = {
          x,
          y,
      };
      this.pointer = this.vector[1];
  }
  
  handleTouchmove(event) {
      event.preventDefault();
      const x = event.changedTouches[0].clientX * this.dpr;
      const y = event.changedTouches[0].clientY * this.dpr;   
      this.vector[1] = {
          x,
          y,
      };
      this.pointer = this.vector[1];
  }
  
  drawVectorLine() {
      this.ctx.strokeStyle = 'pink';
      this.ctx.lineWidth = 2 * this.dpr;
      
      const x0 = this.vector[0].x;
      const y0 = this.vector[0].y;
      const x1 = this.vector[1].x;
      const y1 = this.vector[1].y;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.stroke();
  }

  addConfettiParticles(amount, angle, velocity, x, y) {
      let i = 0;
      while (i < amount) {
          // sprite
          const r = _.random(4, 6) * this.dpr;
          const d = _.random(15, 25) * this.dpr;
          
          const cr = _.random(30, 255);
          const cg = _.random(30, 230);
          const cb = _.random(30, 230);
          const color = `rgb(${cr}, ${cg}, ${cb})`;
          
          const tilt = _.random(10, -10);
          const tiltAngleIncremental = _.random(0.07, 0.05);
          const tiltAngle = 0;

          const id = _.uniqueId();
          const sprite = {
              [id]: {
                  angle,
                  velocity,
                  x,
                  y,
                  r,
                  d,
                  color,
                  tilt,
                  tiltAngleIncremental,
                  tiltAngle,
              },
          };

          Object.assign(this.confettiSprites, sprite);
          this.confettiSpriteIds.push(id);
          this.tweenConfettiParticle(id);
          i++;
      }
  }

  tweenConfettiParticle(id) {
      const minAngle = this.confettiSprites[id].angle - SPREAD / 2;
      const maxAngle = this.confettiSprites[id].angle + SPREAD / 2;
      
      const minVelocity = this.confettiSprites[id].velocity / 4;
      const maxVelocity = this.confettiSprites[id].velocity;

      // Physics Props
      const velocity = _.random(minVelocity, maxVelocity);
      const angle = _.random(minAngle, maxAngle);
      const gravity = GRAVITY;
      const friction = _.random(0.1, 0.25);
      const d = 0;

      TweenLite.to(this.confettiSprites[id], DECAY, {
          physics2D: {
              velocity,
              angle,
              gravity,
              friction,
          },
          d,
          ease: Power4.easeIn,
          onComplete: () => {
              // remove confetti sprite and id
              _.pull(this.confettiSpriteIds, id);
              delete this.confettiSprites[id];
          },
      });
  }

  updateConfettiParticle(id) {
      const sprite = this.confettiSprites[id];
      
      const tiltAngle = 0.0005 * sprite.d;
      
      sprite.angle += 0.01;
      sprite.tiltAngle += tiltAngle;
      sprite.tiltAngle += sprite.tiltAngleIncremental;
      sprite.tilt = (Math.sin(sprite.tiltAngle - (sprite.r / 2))) * sprite.r * 2;
      sprite.y += Math.sin(sprite.angle + sprite.r / 2) * 2;
      sprite.x += Math.cos(sprite.angle) / 2;
  }

  drawConfetti() {
      this.confettiSpriteIds.map(id => {
          const sprite = this.confettiSprites[id];
          
          this.ctx.beginPath();
          this.ctx.lineWidth = sprite.d / 2;
          this.ctx.strokeStyle = sprite.color;
          this.ctx.moveTo(sprite.x + sprite.tilt + sprite.r, sprite.y);
          this.ctx.lineTo(sprite.x + sprite.tilt, sprite.y + sprite.tilt + sprite.r);
          this.ctx.stroke();

          this.updateConfettiParticle(id);
      });
  }
  
  drawPointer() {
      const centerX = this.pointer.x;
      const centerY = this.pointer.y;
      const radius = 15 * this.dpr;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'transparent';
      this.ctx.fill();
      this.ctx.lineWidth = 2 * this.dpr;
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.stroke();
  }
  
  drawPower() {
      const x0 = this.vector[0].x;
      const y0 = this.vector[0].y;
      const x1 = this.vector[1].x;
      const y1 = this.vector[1].y;
      
      const length = getLength(x0, y0, x1, y1);
      const centerX = x0;
      const centerY = y0;
      const radius = 1 * this.dpr * length / 20;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'transparent';
      this.ctx.fill();
      this.ctx.lineWidth = 2 * this.dpr;
      this.ctx.strokeStyle = '#333333';
      this.ctx.stroke();
  }

  render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // only draw the vector when the drawVector flag is on
      this.drawVector && this.drawVectorLine();
      this.drawVector && this.drawPower();
      
      this.drawPointer();
      this.drawConfetti();
  }
}

const confettis = new ConfettiCannon();
