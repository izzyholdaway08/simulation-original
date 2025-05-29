let cars = [];
let pedestrians = [];
let speedSlider;
let collisions = [];
let trafficLightColor;
let trafficLightTimer = 0;
let trafficLightInterval = 120;

function setup() {
  createCanvas(600, 600);
  speedSlider = createSlider(0.5, 5, 2, 0.1);
  speedSlider.position(10, height + 10);

  // Create cars
  for (let i = 0; i < 5; i++) {
    cars.push(new Car(0, i * 60 + 100, random(1, 2), 'right'));
  }

  // Create pedestrians
  for (let i = 0; i < 5; i++) {
    pedestrians.push(new Pedestrian(i * 60 + 100, 0));
  }

  trafficLightColor = "green";
}

function draw() {
  background(220);
  drawIntersection();
  updateTrafficLight();
  drawTrafficLight();

  for (let car of cars) {
    car.move();
    car.display();
  }

  for (let p of pedestrians) {
    p.move();
    p.display();
  }

  checkCollisions();

  // UI
  fill(0);
  textSize(12);
  text("Car Speed", 10, height + 35);
  text("Collisions: " + collisions.length, 180, height + 35);
}

function drawIntersection() {
  fill(180);
  rect(0, 250, width, 100);
  rect(250, 0, 100, height);
}

function updateTrafficLight() {
  trafficLightTimer++;
  if (trafficLightTimer > trafficLightInterval) {
    let r = random();
    if (r < 0.33) trafficLightColor = "red";
    else if (r < 0.66) trafficLightColor = "yellow";
    else trafficLightColor = "green";
    trafficLightTimer = 0;
  }
}

function drawTrafficLight() {
  fill(50);
  rect(520, 20, 20, 60);

  fill(trafficLightColor === "red" ? color(255, 0, 0) : 100);
  ellipse(530, 30, 15, 15);

  fill(trafficLightColor === "yellow" ? color(255, 255, 0) : 100);
  ellipse(530, 45, 15, 15);

  fill(trafficLightColor === "green" ? color(0, 255, 0) : 100);
  ellipse(530, 60, 15, 15);
}

function checkCollisions() {
  for (let car of cars) {
    for (let p of pedestrians) {
      let d = dist(car.x, car.y, p.x, p.y);
      let collision = d < 20 ? 1 : 0;

      if (collision === 1) {
        collisions.push({ x: p.x, y: p.y, frame: frameCount });
        fill(255, 0, 0, 150);
        ellipse(p.x, p.y, 30, 30);
        fill(0);
        textSize(20);
        text("💥", p.x - 10, p.y - 20);
      }
    }
  }
}

class Car {
  constructor(x, y, speed, direction) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.direction = direction;
    this.col = color(random(100, 255), random(100, 255), random(100, 255));
  }

  move() {
    if (this.direction === 'right') {
      this.x += this.speed * speedSlider.value();
      if (this.x > width) this.x = -30;
    }
  }

  display() {
    fill(this.col);
    rect(this.x, this.y, 30, 15);
  }
}

class Pedestrian {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(1.5, 2.5);
    this.xOffset = random(-1, 1);
  }

  move() {
    this.y += this.speed;
    this.x += this.xOffset * noise(frameCount * 0.01);
    if (this.y > height) this.y = 0;
  }

  display() {
    fill(0);
    ellipse(this.x, this.y, 10, 10);
  }
}
