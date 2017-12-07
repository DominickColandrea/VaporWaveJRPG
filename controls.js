$("canvas").prop('width', 1280);
$("canvas").prop('height', 720);

let hasGP = false,
repGP,
gp = navigator.getGamepads()[0],
controller = false;
function canGame() {
    return "getGamepads" in navigator;
}

let keyLeft = 37,
keyLeft2 = 65,
keyRight=39,
keyRight2=68,
keyUp=38,
keyUp2=87,
keyDown=40,
keyDown2=83,
keyAttack=32,
keyAttack2=90,
options = false;
let attack = false;
let kstate =[false, false, false, false];

let faceState=[false, false, false, false];

let img = [];
function preload() {
    for (let i = 0; i < preload.arguments.length; i++) {
        img[i] = new Image();
        img[i].src = preload.arguments[i];
    }
}
preload(
    "assets/player.png",
    "assets/playerLeft.png",
    "assets/playerRight.png",
    "assets/playerUp.png",
    "assets/playerDown.png",
    "assets/selectArrow.png",
    "assets/enemy1.png", //enemies
    "assets/enemy2.png",
    "assets/enemy3.png",
    "assets/enemy4.png",
    "assets/enemy5.png",
    "assets/enemy6.png"
);

        if(canGame()) {
            $(window).on("gamepadconnected", function() {
                console.log("connection event");
                repGP = window.setInterval(reportOnGamepad,50);
            });
 
            $(window).on("gamepaddisconnected", function() {
                console.log("disconnection event");
            });

                       let checkGP = window.setInterval(function() {
                if(navigator.getGamepads()[0]) {
                    if(!hasGP) $(window).trigger("gamepadconnected");
                    window.clearInterval(checkGP);
                }
            }, 1000);
 
        }

    function reportOnGamepad() {
    	if (controller) {
        let gp = navigator.getGamepads()[0];
		switch(true){
			case gp.buttons[0].pressed:
			attack =true;
			kstate[0] =false;
			kstate[1] =false;
			kstate[2] =false;
			kstate[3] =false;
			break;

			case gp.buttons[14].pressed:
			kstate[0] =true;

			kstate[1] =false;
			kstate[2] =false;
			kstate[3] =false;
			faceState=[true, false, false, false];
			break;

			case gp.buttons[15].pressed:
			kstate[1] =true;

			kstate[0] =false;
			kstate[2] =false;
			kstate[3] =false;

			faceState=[false, true, false, false];
			break;

			case gp.buttons[12].pressed:
			kstate[2] =true;

			kstate[0] =false;
			kstate[1] =false;
			kstate[3] =false;
			faceState=[false, false, true, false];
			break;

			case gp.buttons[13].pressed:
			kstate[3] =true;

			kstate[0] =false;
			kstate[1] =false;
			kstate[2] =false;
			faceState=[false, false, false, true];
			break;

			default:
			kstate[0] =false;
			kstate[1] =false;
			kstate[2] =false;
			kstate[3] =false;
			break;

		}
	}
 } //end reportOnGamepad

let delay = (function(){
  let timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

let delayEnemyDeath = (function(){
  let timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

let delayAttack = (function(){
  let timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

let delayLevelUp = (function(){
  let timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

let delayEndBattle = (function(){
  let timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

let delayRunning = (function(){
  let timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

let delayTakeDamage = (function(){
  let timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function InitKeyboard(){
	if (controller ==false) {
	$(window).keydown(function(e){
		switch(true){
			case e.keyCode ==keyAttack || e.keyCode ==keyAttack2:
			attack =true;
			break;

			case e.keyCode ==keyLeft || e.keyCode ==keyLeft2:
			kstate[0] =true;

			faceState=[true, false, false, false];
			break;

			case e.keyCode ==keyRight || e.keyCode ==keyRight2:
			kstate[1] =true;

			faceState=[false, true, false, false];
			break;

			case e.keyCode ==keyUp || e.keyCode ==keyUp2:
			kstate[2] =true;

			faceState=[false, false, true, false];
			break;

			case e.keyCode ==keyDown || e.keyCode ==keyDown2:
			kstate[3] =true;

			faceState=[false, false, false, true];
			break;
		}
	}); //end doc keydown

		$(window).keyup(function(e){
		switch(true){

			case e.keyCode ==keyAttack || e.keyCode ==keyAttack2:
			attack =false;
			break;

			case e.keyCode ==keyLeft || e.keyCode ==keyLeft2:
			kstate[0] =false;
			break;

			case e.keyCode ==keyRight || e.keyCode ==keyRight2:
			kstate[1] =false;
			break;

			case e.keyCode ==keyUp || e.keyCode ==keyUp2:
			kstate[2] =false;
			break;

			case e.keyCode ==keyDown || e.keyCode ==keyDown2:
			kstate[3] =false;
			break;
		}
	}); //end doc keyup
	}
} //end InitKeyboard

function fadeIntro(){
	$("#title").css("animation", "fadeINTRO 0.5s linear");
	delay(function(){
		$("#title").css("opacity", "0");
		$("#title").css("animation", "none");
	},500);
} //end fadeIntro