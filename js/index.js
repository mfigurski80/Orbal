var map = document.getElementById("map");
var player = document.getElementById("rocketship");
var downDirector = document.getElementById("downDirector");
var velDirector = document.getElementById("velDirector");
var viewport = document.getElementById("viewport");
var output = document.getElementById("output1");
var output2 = document.getElementById("output2");

var velocity = [-13.25,13.25,0,13.5,13.5];
var currentMargin = [-3000,-3000];
var rocketAcc = .2;
var rocketMass = 1;
var mouseStillDown = false;
//distance from planet center: x, y, total
var d = [0,0,0,0,0];


//gravPoints[x-position, y-position, mass,...]
var gravPoints = [5000,5000,1000000];
var displayHeightNow = false;


window.setInterval(updatePosition, 70);
window.setInterval(updateApse, 100);

function updateApse() {
  //apoapse (highest point), periapse (lowest point)
  //output2.innerHTML = "<p>Velocity: " + velocity[0] + ", " + velocity[1] + "</p>";
  //output2.innerHTML += "<p>Dist: " + d[0] + ", " + d[1] + "</p>";
  //          0    1    2     3    4
  //velocity[-Vx1, Vy1, null, -Vx2, Vy2];
  //distance[Px1, -Py1, null, Px2, -Py2];
  var x = ( ((-d[4])-(velocity[3]/velocity[4])*d[3]) - ((-d[1])+(-velocity[0]/velocity[1])*d[0]) ) / (velocity[0]/velocity[1]-velocity[3]/velocity[4] );
  var y = (velocity[0]/velocity[1])*x + ((-d[1])+(-velocity[0]/velocity[1])*d[0]);
  //output2.innerHTML = "<br /><p>x: " + x + "</p><p> y: " + y + "</p>";
  var secondPoint = [(2*x), (2*y)];
  var constant = Math.sqrt((d[0]-secondPoint[0])*(d[0]-secondPoint[0]) + ((-d[1])-secondPoint[1])*((-d[1])-secondPoint[1])) + Math.sqrt((d[0]*d[0]) + (-d[1])*(-d[1]));
  //output2.innerHTML += "<br /><p>Constant: " + constant + "</p>";
  var pointsDifference = Math.sqrt(secondPoint[0]*secondPoint[0] + secondPoint[1]*secondPoint[1]);
  output2.innerHTML = "<p>Periapse(est): " + ((constant - pointsDifference)/2 - 2500) + "</p>";
  if (((constant - pointsDifference)/2 - 2500) < 0) {
    output2.innerHTML = "<p><span class='red'>Periapse(est): " + ((constant - pointsDifference)/2 - 2500) + "</span></p>";
  }
  output2.innerHTML += "<br /><p>Apoapse(est): " + ((constant - pointsDifference)/2 + pointsDifference - 2500) + "</p>";
  updateDownDirector();
  updateVelDirector();
}

function updateDownDirector() {
  var angleRad = Math.atan(d[0]/d[1]);
  var angleDeg = (angleRad * 180 / Math.PI);
  if (d[1] > 0) {
    angleDeg += 180;
  }
  downDirector.setAttribute("style","transform: rotate(" + (180-angleDeg) + "deg);");
}

function updateVelDirector() {
  var angleRad = Math.atan(velocity[0]/velocity[1]);
  var angleDeg = (angleRad * 180 / Math.PI);
  if (velocity[1] > 0) {
    angleDeg += 180;
  }
  velDirector.setAttribute("style","transform: rotate(" + (180-angleDeg) + "deg);");
}

function alertHeight() {
  displayHeightNow = true;
}

function updateRocketRotation(evt) {
  var mouse = [(event.clientX - (.5*viewport.offsetWidth)),(event.clientY - (.5*viewport.offsetHeight))];
  var angleRad = Math.atan(mouse[0]/mouse[1]);
  var angleDeg = (angleRad * 180 / Math.PI) + 180;
  if (mouse[1] > 0) {
    angleDeg += 180;
  }
  rocketship.setAttribute("style","transform: rotate(" + (180-angleDeg) + "deg);");
}

function updatePosition() {
  currentMargin[0] += velocity[0];
  currentMargin[1] += velocity[1];
  map.style.marginLeft = "calc(" + currentMargin[0] + "px + 50vw)";
  map.style.marginTop = "calc(" + currentMargin[1] + "px + 50vh)";
  updateVelocity();
}
function updateVelocity() {
  d[3] = d[0];
  d[4] = d[1];
  velocity[3] = velocity[0];
  velocity[4] = velocity[1];
  //output.innerHTML = "<p>Velocity: " + velocity[0] + ", " + velocity[1] + "</p>";
  d[0] = -(gravPoints[0] + currentMargin[0]);
  d[1] = -(gravPoints[1] + currentMargin[1]);
  d[2] = Math.sqrt((d[0]*d[0]) + (d[1]*d[1]));
  output.innerHTML = "<p>Height: " + (d[2]-2500) + "</p>";
  var grav = 0;
  grav = (gravPoints[2]/(d[2]*d[2]));
  velocity[0] += (d[0]/d[2])*grav;
  velocity[1] += (d[1]/d[2])*grav;

  /*if (displayHeightNow) {
    alert("Height: x=" + d[0] + ", y=" + -d[1] +  ", -- Velocity: x=" + -velocity[0] + ", y=" + velocity[1]);
    displayHeightNow = false;
  }*/
  if (d[2] < 2500) {
    velocity[0] = 0;
    velocity[1] = 0;
  }
  //output numbers
  velocity[2] = Math.sqrt((velocity[0]*velocity[0]) + (velocity[1]*velocity[1]));
  output.innerHTML += "<br /><p>Velocity: " + velocity[2] + "</p>";
}

function mouseDown() {
  //alert("mousedown");
  window.setInterval("rocketBurn()", 500);
  rocketBurn();
}

function mouseUp() {
  //alert("mouseup");
  window.clearInterval(rocketBurn);
}

window.setInterval(rocketBurn, 500);
function rocketBurn(evt) {
  //alert("burn");
  var mouse = [(event.clientX - (.5*viewport.offsetWidth)),-(event.clientY - (.5*viewport.offsetHeight))];
  //alert(mouse[0] + ", " + mouse[1]);
  var total = Math.sqrt((mouse[0]*mouse[0]) + (mouse[1]*mouse[1]));
  velocity[0] -= (mouse[0]/total)*rocketAcc;
  velocity[1] += (mouse[1]/total)*rocketAcc;
  //velocity[0] = 5;
}
