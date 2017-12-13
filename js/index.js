var map = document.getElementById("map");
var player = document.getElementById("rocketship");
var downDirector = document.getElementById("downDirector");
var velDirector = document.getElementById("velDirector");
var viewport = document.getElementById("viewport");
var output = document.getElementById("output1");
var output2 = document.getElementById("output2");
var output3 = document.getElementById("output3")

var mouse = [0,0];

var velocity = [-13.25,13.25,0,-13.5,13.5];
var currentMargin = [-3000,-3000];
var rocketAcc = .07;
var rocketMass = 1;
var mouseStillDown = false;
//distance from planet center: x, y, total
var d = [0,0,0,0,0];


//gravPoints[x-position, y-position, mass,...]
var gravPoints = [5000,5000,1000000];
var displayHeightNow = false;

/*alert("Welcome to Orbal! Controls: press anywhere on the map to fire your engines." +
"Click within the rocketship's circle to open the fire menu. From there you can select which weapons to fire, and click anywhere on screen to fire them.");
*/

window.setInterval(updatePosition, 70);
window.setInterval(updateApse, 100);
window.setInterval(rocketBurn, 100);

function updateApse() {
  //apoapse (highest point), periapse (lowest point)
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
  output2.innerHTML = "<p>Periapse (est): " + ((constant - pointsDifference)/2 - 2500) + "</p>";
  if (((constant - pointsDifference)/2 - 2500) < 0) {
    output2.innerHTML = "<p>Periapse (est): <span class='warning'>" + ((constant - pointsDifference)/2 - 2500) + "</span></p>";
  }
  output2.innerHTML += "<br /><p>Apoapse (est): " + ((constant - pointsDifference)/2 + pointsDifference - 2500) + "</p>";
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
  mouse = [(event.clientX - (.5*viewport.offsetWidth)),(event.clientY - (.5*viewport.offsetHeight))];
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
  rocketship.src = "resources/rocketship1Burning.svg";
  mouseStillDown = true;
  output3.innerHTML = "<p>Burning engines</p>";
}

function mouseUp() {
  rocketship.src = "resources/rocketship1.svg";
  mouseStillDown = false;
  output3.innerHTML = "<p>Burn completed</p>";
}

function rocketBurn(evt) {
  //alert("burn");
  if(mouseStillDown) {
    //alert(mouse[0] + ", " + mouse[1]);
    var total = Math.sqrt((mouse[0]*mouse[0]) + (mouse[1]*mouse[1]));
    velocity[0] -= (mouse[0]/total)*rocketAcc;
    velocity[1] += (-mouse[1]/total)*rocketAcc;
    //velocity[0] = 5;
  }
}

var menuOpen = false;
function lightUpBack() {
  if (!menuOpen) {
    cover.setAttribute("style","background-color: rgba(255,255,255,.04);");
  }
}
function hideBack() {
  if (!menuOpen) {
    cover.setAttribute("style","background-color: rgba(255,255,255,0);");
  }
}

function openMenu() {
  var cover = document.getElementById("cover");
  menuOpen = true;
  cover.setAttribute("style","background-color: rgba(204,102,102,.03); height: 100vh; width: 100vw; border-radius: 0%; top: 0; left: 0;");
  cover.removeAttribute("onclick");
  cover.setAttribute("onclick","openFire()");
  document.getElementById("menu").setAttribute("style","display: inline; opacity: 1;")
  output3.innerHTML = "<p>Standing by for fire</p>"
}

var weaponSelected = 1;

function openFire() {
  if (weaponSelected == 1) {
    output3.innerHTML = "<p>Primary weapon fired!</p>";
  } else if (weaponSelected == 2) {
    output3.innerHTML = "<p>Secondary weapon fired!</p>";
  }
}

function closeMenu() {
  var cover = document.getElementById("cover");
  cover.setAttribute("style","background-color: rgba(255,255,255,.03); height: 170px; width: 170px; border-radius: 50%; top: calc(50vh - 85px); left: calc(50vw - 85px);");
  cover.removeAttribute("onclick");
  cover.setAttribute("onclick","openMenu()");
  document.getElementById("menu").setAttribute("style","display: none; opacity: 0;");
  output3.innerHTML = "<p>Standing down</p>";
  menuOpen = false;
}

function loadPrimary() {
  weaponSelected = 1;
  output3.innerHTML = "<p>Primary weapon loaded!</p><br /><p>Standing by for fire</p>";
}

function loadSecondary() {
  weaponSelected = 2;
  output3.innerHTML = "<p>Secondary weapon loaded!</p><br /><p>Standing by for fire</p>";
}
