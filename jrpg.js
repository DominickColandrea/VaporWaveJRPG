$(function(){
	"use strict";
	let b = document.getElementById("bg"); //eLayer
	let btx = b.getContext("2d");

	let c = document.getElementById("game");//game layer
	let ctx = c.getContext("2d");

	let u = document.getElementById("ui");//ui layer
	let utx = u.getContext("2d");

	let e = document.getElementById("enemy");//enemy layer
	let etx = e.getContext("2d");

	let t = document.getElementById("bText");//text layer
	let ttx = t.getContext("2d");

ttx.font = "italic 40px impact";

	let enter=13,
	GAMESTART=false,
	enemyLoaded = false,
	slothRNG,
	attackRNG,
	critRNG,
	enemyStatusRNG,
	enemyAttackRNG,
	enemyRNG,
	enemyItemDropRNG,
	battleIntro;

let player={
	level:1,
	page:1,
	currentHealth:1,
	totalHealth:13,
	currentMana:5,
	totalMana:5,
	damage:1,
	magicDamage:4,
	critChance:2,
	guardCritChance:10,
	hitChance:90,
	armor:0,
	guardArmor:1,
	guarding:false,
	runChance:50,
	x:945,
	y:360,
	speed:2,
	inBattle:false,
	inMagicScreen:false,
	inItemScreen:false,
	counter:0,
	selection:0,
	magicSelection:0,
	itemSelection:0,
	exp:0,
	levelCap:20,
	canAttack:false,
	cooldown:0,
	status:"",
	alive:true
}

let items =["Sin Coin","Melancholy P."];

let spells =[];

let enemy ={};

let options =["Run","Guard","Item","Magic","Attack"];

let enemy1={
	name:"Bloon-Boi",
	pages:[1,2],
	health:3,
	totalHealth:3,
	damage:1,
	hitChance:60,
	armor:0,
	exp:6,
	intro:true,
	item:"Melancholy P.",
	status:""
}

let enemy2={
	name:"LadBog",
	pages:[1,2],
	health:1,
	totalHealth:1,
	damage:1,
	hitChance:60,
	armor:0,
	exp:3,
	intro:true,
	item:"Sin Coin",
	status:""
}

let enemy3={
	name:"星",
	pages:[1,2],
	health:5,
	totalHealth:5,
	damage:1,
	hitChance:80,
	armor:0,
	exp:10,
	intro:true,
	item:"Sin Coin",
	status:"Sloth"
}

let enemy4={
	name:"TordLord",
	pages:[4,5,6],
	health:12,
	totalHealth:12,
	damage:3,
	hitChance:80,
	armor:1,
	exp:35,
	intro:true,
	item:"Depression Box",
	status:""
}

let enemy5={
	name:"Narcoleptic Guest",
	pages:[4,5,6],
	health:1,
	totalHealth:1,
	damage:5,
	hitChance:50,
	armor:6,
	exp:27,
	intro:true,
	item:"Essence of Capitalism",
	status:"Sloth"
}

let enemy6={
	name:"Visions of Skepticism",
	pages:[4,5,6],
	health:15,
	totalHealth:15,
	damage:2,
	hitChance:80,
	armor:2,
	exp:17,
	intro:true,
	item:"Essence of Capitalism",
	status:""
}

let boss={
	name:"Corporeal Corporation",
	pages:[7],
	health:50,
	totalHealth:50,
	damage:6,
	hitChance:100,
	armor:4,
	exp:0,
	intro:true,
	item:"",
	status:"Sloth",
	alive:true
}

let game ={
		start(){
		setInterval(function(){
			drawOverLays();
			InitKeyboard();
			movementOverworld();
			ui();
			enemyDraw();
		},16);
			setInterval(function(){
			battleActions();
			magic();
			itemScreen();
		},80);
	}
}

let magicCoolDown = setInterval(function(){
	if (player.inMagicScreen || player.inItemScreen) {
		player.cooldown++;
	}
		},100);

      let draw = {
      	drawPlayer() {
       ctx.drawImage(img[0], player.x, player.y);
      },
      	drawPlayerLeft() {
       ctx.drawImage(img[1], player.x, player.y);
      },
      	drawPlayerRight() {
       ctx.drawImage(img[2], player.x, player.y);
      },
      	drawPlayerUp() {
       ctx.drawImage(img[3], player.x, player.y);
      },
      	drawPlayerDown() {
       ctx.drawImage(img[4], player.x, player.y);
      }
  };

function movementOverworld(){
	if (!player.inBattle) {
		switch(true){
			
			case attack:
				draw.drawPlayer();
				if (player.page ==3 && player.x >=535 && player.x <= 595 && player.y >= 145 && player.y <= 200) {
					player.currentHealth = player.totalHealth;
					player.currentMana = player.totalMana;
					player.status ="";
					console.log("healz");
				}
				else if (player.page ==6 && player.x >=0 && player.x <= 135 && player.y >= 0 && player.y <= 60) {
					console.log("boss bois");
					player.page = 7;
					$("#bg").css("background", "url(assets/bg7.png)");
				}
			break;
			case kstate[0]:
				collisionLEFT(player.page);
				battle();
			break;

			case kstate[1]:
				collisionRIGHT(player.page);
				battle();
			break;

			case kstate[2]:
				collisionUP(player.page);
				battle();
			break;

			case kstate[3]:
				collisionDOWN(player.page);
				battle();
			break;

			default:
				draw.drawPlayer();
				console.log(player.x+"    "+player.y);
			break;
		}
	}
}//end movementOverworld

function battleActions(){
	if (player.inBattle && !player.inMagicScreen && !player.inItemScreen) {
		switch(true){
			case kstate[2]:
			if (player.selection>0) {
				player.selection--;
			}
				console.log(player.selection);
			break;

			case kstate[3]:
			if (player.selection<4) {
				player.selection++;
			}
				console.log(player.selection);
			break;

			case attack:
			if (player.canAttack) {
				player.canAttack = false;
				switch(true){
			case player.selection==0:
			ttx.clearRect(0,0,1280,720);
			if (player.status =="Sloth") {
				slothRNG = Math.floor((Math.random() * 100) + 0);
			}
				if (slothRNG>=70) {
					battleIntro = ttx.fillText("You're too lathargic to move...",180,550);
					player.guarding = false;
					delayAttack(function(){
						enemyAttack();
					},1000);
					enemy.intro= false;
				}
			else{
			attackRNG = Math.floor((Math.random() * 100) + 0);
			if (attackRNG<=player.hitChance) {
				critRNG = Math.floor((Math.random() * 100) + 0);
				if (player.guarding) {
					if (critRNG<=player.guardCritChance) {
						let totalDPS =  player.damage*3-enemy.armor.toString();
							if (totalDPS<=0) {
								totalDPS=0;
							}
						battleIntro = ttx.fillText("A MASSIVE STRIKE! "+ totalDPS +" damage!",180,550);
						console.log(totalDPS);
						enemy.health -= player.damage*3-enemy.armor;
							}
								else{
						let totalDPS =  player.damage-enemy.armor.toString();
							if (totalDPS<=0) {
								totalDPS=0;
							}
						battleIntro = ttx.fillText("You attack for "+ totalDPS +" damage!",180,550);
						console.log(totalDPS);
						enemy.health -= player.damage-enemy.armor;
							}
					}
				else if (critRNG<=player.critChance) {
				let totalDPS =  player.damage*3-enemy.armor.toString();
							if (totalDPS<=0) {
								totalDPS=0;
							}
				battleIntro = ttx.fillText("A MASSIVE STRIKE! "+ totalDPS +" damage!",180,550);
				console.log(totalDPS);
				enemy.health -= player.damage*3-enemy.armor;
				}
				else{
				let totalDPS =  player.damage-enemy.armor.toString();
							if (totalDPS<=0) {
								totalDPS=0;
							}
				battleIntro = ttx.fillText("You attack for "+ totalDPS +" damage!",180,550);
				console.log(totalDPS);
				enemy.health -= player.damage-enemy.armor;
				}
			$("#enemy").css("animation", "enemyTakeDamage 0.5s linear");
				delayTakeDamage(function(){
					$("#enemy").css("animation", "none");
				},500);	
			}
			else{
				battleIntro = ttx.fillText("You miss!",180,550);
			}
			player.guarding = false;
			delayAttack(function(){
				enemyAttack();
			},1000);
			enemy.intro= false;
	}//end sloth else
			break;

			case player.selection==1:
			ttx.clearRect(0,0,1280,720);
			player.guarding = false;
				if (spells.length ==0 ) {
					battleIntro = ttx.fillText("You don't have any spells.",180,550);
					player.canAttack = true;
				}
				else{
					player.inMagicScreen =true;
				}
			enemy.intro= false;
			break;

			case player.selection==2:
			ttx.clearRect(0,0,1280,720);
			player.guarding = false;
				if (items.length ==0 ) {
					battleIntro = ttx.fillText("You don't have any items.",180,550);
					player.canAttack = true;
				}
				else{
					player.inItemScreen =true;
				}
				enemy.intro= false;
			break;

			case player.selection==3:
			ttx.clearRect(0,0,1280,720);
				battleIntro = ttx.fillText("You take a defensive stance!",180,550);
				player.guarding = true;
			delayAttack(function(){
				enemyAttack();
			},1000);
				enemy.intro= false;
			break;

			case player.selection==4:
			attackRNG = Math.floor((Math.random() * 100) + 0);
			ttx.clearRect(0,0,1280,720);
			player.guarding = false;
				if (attackRNG<=player.runChance) {
					battleIntro = ttx.fillText("A swift retreat...",180,550);
					delayRunning(function(){
						player.inBattle = false;
						enemyLoaded =false;
						ttx.clearRect(0,0,1280,720);
					},1500)
					}
				else{
					battleIntro = ttx.fillText("You're blocked from running!",180,550);
						delayAttack(function(){
							enemyAttack();
						},1000);
				}
				enemy.intro= false;
			break;
		}
	}
			break;
		}

	}
}//end battleActions

function magic() {
if (player.inMagicScreen) {
	switch(true){
			case kstate[2]:
			if (player.magicSelection>0) {
				player.magicSelection--;
			}
				console.log(player.magicSelection);
			break;

			case kstate[3]:
			if (player.magicSelection<spells.length-1) {
				player.magicSelection++;
			}
				console.log(player.magicSelection);
			break;

			case kstate[0]:
			player.inMagicScreen = false;
			player.canAttack = true;
			player.cooldown = 0;
				console.log(player.magicSelection);
			break;

			case attack:
			if (player.cooldown>=5) {
				player.cooldown=0;
			switch(true){
	case player.magicSelection==0:
	console.log("Nostalgia");
	if (player.currentMana>=3) {
		player.currentMana-=3;
	let totalMDPSF =  player.magicDamage-enemy.armor.toString();
	battleIntro = ttx.fillText(enemy.name+" takes "+ totalMDPSF +" damage from Nostalgia!",180,550);
	console.log(totalMDPSF);
	enemy.health -= player.magicDamage-enemy.armor;
	$("#enemy").css("animation", "enemyTakeDamage 0.5s linear");
		delayTakeDamage(function(){
			$("#enemy").css("animation", "none");
			player.inMagicScreen =false;
		},500);
		delayAttack(function(){
			enemyAttack();
		},1000);
	}
	else{
		battleIntro = ttx.fillText("Not enough Vapor Power.",180,550);
	}
	enemy.intro= false;
	break;

	case player.magicSelection==1:
	console.log("Aesthetics");
	if (player.currentMana>=10) {
		player.currentMana-=10;
	let totalMDPST =  player.magicDamage*1.5-enemy.armor.toString();
	battleIntro = ttx.fillText(enemy.name+" takes "+ totalMDPSF +" damage from Aesthetics!",180,550);
	console.log(totalMDPST);
	enemy.health -= player.magicDamage-enemy.armor;
	$("#enemy").css("animation", "enemyTakeDamage 0.5s linear");
		delayTakeDamage(function(){
			$("#enemy").css("animation", "none");
			player.inMagicScreen =false;
		},500);
		delayAttack(function(){
			enemyAttack();
		},1000);
	}
	else{
		battleIntro = ttx.fillText("Not enough Vapor Power.",180,550);
	}
	enemy.intro= false;
	break;

	case player.magicSelection==2:
	console.log("wave");
	if (player.currentMana>=30) {
		player.currentMana-=30;
	let totalMDPSW =  player.magicDamage*2-enemy.armor.toString();
	battleIntro = ttx.fillText("Chill out... "+ totalMDPSW +" damage!",180,550);
	console.log(totalMDPSW);
	enemy.health -= player.magicDamage-enemy.armor;
	$("#enemy").css("animation", "enemyTakeDamage 0.5s linear");
		delayTakeDamage(function(){
			$("#enemy").css("animation", "none");
			player.inMagicScreen =false;
		},500);
		delayAttack(function(){
			enemyAttack();
		},1000);
	}
	else{
		battleIntro = ttx.fillText("Not enough Vapor Power.",180,550);
	}
	enemy.intro= false;
	break;
	}
	break;
}
}
}
}//end magic

function itemScreen(){
if (player.inItemScreen) {
	switch(true){
			case kstate[2]:
			if (player.itemSelection>0) {
				player.itemSelection--;
			}
				console.log(player.itemSelection);
			break;

			case kstate[3]:
			if (player.itemSelection<items.length-1) {
				player.itemSelection++;
			}
				console.log(player.itemSelection);
			break;

			case kstate[0]:
			player.inItemScreen = false;
			player.canAttack = true;
			player.cooldown = 0;
				console.log(player.itemSelection);
			break;

			case attack:
			if (player.cooldown>=5) {
				player.canAttack = false;
				player.cooldown = 0;
				player.inItemScreen =false;
				itemUse();
			}
			break;
}
}
}//end items

function itemUse(){
	switch(true){
	case player.itemSelection==0:
			if (items[items.length-1] == "Melancholy P.") { //perhaps abbreviate
				let itemUsed = items.pop();
				battleIntro = ttx.fillText("You eat some "+itemUsed+" and regain some HP!",180,550);
				if (player.currentHealth+=15>=player.totalHealth) {
					player.currentHealth = player.totalHealth;
				}
				else{
					player.currentHealth+=15;
				}
			}

			else if (items[items.length-1] == "Sin Coin") { //perhaps abbreviate
				let itemUsed = items.pop();
				battleIntro = ttx.fillText("You toss the "+itemUsed+" away and are lose your ailment!",180,550);
				player.status = "";
			}

			else if (items[items.length-1] == "Depression Box") { //perhaps abbreviate
				let itemUsed = items.pop();
				battleIntro = ttx.fillText("You look into the "+itemUsed+" and regain some VP!",180,550);
				if (player.currentMana+=7>=player.totalMana) {
					player.currentMana = player.totalMana;
				}
				else{
					player.currentMana+=7;
				}
			}

			else if (items[items.length-1] == "Essence of Capitalism") { //perhaps abbreviate
				let itemUsed = items.pop();
				battleIntro = ttx.fillText("You burn the "+itemUsed+" and are fully recovered!",180,550);
					player.currentHealth = player.totalHealth;
					player.currentMana = player.totalMana;
			}
	break;

	case player.itemSelection==1:
			if (items[items.length-2] == "Melancholy P.") {
				let itemUsed = items.splice(-2,1);
				battleIntro = ttx.fillText("You eat some "+itemUsed+" and regain some HP!",180,550);
				if (player.currentHealth+=15>=player.totalHealth) {
					player.currentHealth = player.totalHealth;
				}
				else{
					player.currentHealth+=15;
				}
			}

			else if (items[items.length-2] == "Sin Coin") { //perhaps abbreviate
				let itemUsed = items.splice(-2,1);
				battleIntro = ttx.fillText("You toss the "+itemUsed+" away and are lose your ailment!",180,550);
				player.status = "";
			}

			else if (items[items.length-2] == "Depression Box") {
				let itemUsed = items.splice(-2,1);
				battleIntro = ttx.fillText("You look into the "+itemUsed+" and regain some VP!",180,550);
				if (player.currentMana+=7>=player.totalMana) {
					player.currentMana = player.totalMana;
				}
				else{
					player.currentMana+=7;
				}
			}

			else if (items[items.length-2] == "Essence of Capitalism") {
				let itemUsed = items.splice(-2,1);
				battleIntro = ttx.fillText("You burn the "+itemUsed+" and are fully recovered!",180,550);
					player.currentHealth = player.totalHealth;
					player.currentMana = player.totalMana;
			}

	break;

	case player.itemSelection==2:
				if (items[items.length-3] == "Melancholy P.") {
				let itemUsed = items.splice(-3,1);
				battleIntro = ttx.fillText("You eat some "+itemUsed+" and regain some HP!",180,550);
				if (player.currentHealth+=15>=player.totalHealth) {
					player.currentHealth = player.totalHealth;
				}
				else{
					player.currentHealth+=15;
				}
			}

			else if (items[items.length-3] == "Sin Coin") { //perhaps abbreviate
				let itemUsed = items.splice(-3,1);
				battleIntro = ttx.fillText("You toss the "+itemUsed+" away and are lose your ailment!",180,550);
				player.status = "";
			}

			else if (items[items.length-3] == "Depression Box") {
				let itemUsed = items.splice(-3,1);
				battleIntro = ttx.fillText("You look into the "+itemUsed+" and regain some VP!",180,550);
				if (player.currentMana+=7>=player.totalMana) {
					player.currentMana = player.totalMana;
				}
				else{
					player.currentMana+=7;
				}
			}

			else if (items[items.length-3] == "Essence of Capitalism") {
				let itemUsed = items.splice(-3,1);
				battleIntro = ttx.fillText("You burn the "+itemUsed+" and are fully recovered!",180,550);
					player.currentHealth = player.totalHealth;
					player.currentMana = player.totalMana;
			}

	break;
	}
	delayAttack(function(){
		enemyAttack();
	},1000);
}//itemUse

function battle(){
	if (player.alive==true && player.page!=3 && player.counter>=300 && Math.floor((Math.random() * 100) + 1)>=75) {
		enemyRNG =Math.floor((Math.random() * 100) + 1);
		$("#enemy").css("opacity",1);
		player.counter=0;
		player.inBattle =true;
		$("#ui").css("animation", "battleIntro 1s linear");
		delayTakeDamage(function(){
		player.canAttack = true;
		console.log("BATTLE");
		$("#ui").css("animation", "none");
	},2000)
	}
}//end battle

function collisionLEFT(page){
	switch(true){
		case page == 1:
		case page == 2:
	if (player.x<=1) {
		pageChangeLeft();
	}
		break;

		case page == 3:
		case page == 4:
		case page == 5:
		case page == 6:
	if (player.x<=1) {
		draw.drawPlayer();
		return false;
	}
		break;
	}

player.x-=player.speed;
draw.drawPlayerLeft();
player.counter++;
}

function collisionRIGHT(page){
	switch(true){
		case page == 1:
		case page == 4:
		case page == 5:
		case page == 6:
	if (player.x>=1185) {
		draw.drawPlayer();
		return false;
	}
		break;

		case page == 2:
		case page == 3:
	if (player.x>=1185) {
		pageChangeRight();
	}
		break;
	}

player.x+=player.speed;
draw.drawPlayerRight();
player.counter++;
}

function collisionUP(page){
	switch(true){
		case page == 1:
		case page == 2:
		case page == 6:
	if (player.y<=1) {
		draw.drawPlayer();
		return false;
	}
		break;

		case page == 3:
		case page == 4:
		case page == 5:
	if (player.y<=-20) {
		pageChangeUp();
		return false;
	}
		break;
	}

player.y-=player.speed;
draw.drawPlayerUp();
player.counter++;
}

function collisionDOWN(page){
	switch(true){
		case page == 1:
		case page == 2:
		case page == 3:
		case page == 6:
	if (player.y>=620) {
		draw.drawPlayer();
		return false;
	}
		break;
		case page == 4:
		case page == 5:
	if (player.y>=700) {
		pageChangeDown();
	}
		break;
	}

player.y+=player.speed;
draw.drawPlayerDown();
player.counter++;
}

function pageChangeLeft(){
	switch(true){
		case player.page == 1:
			$("#bg").css("background", "url(assets/bg2.png)");
			player.x=1185;
			player.page=2;
		break;
		case player.page == 2:
			$("#bg").css("background", "url(assets/bg3.png)");
			player.x=1185;
			player.page=3;
		break;
	}
}//end pageChangeLeft

function pageChangeRight(){
	switch(true){
		case player.page == 2:
			$("#bg").css("background", "url(assets/bg1.png)");
			player.x=1;
			player.page=1;
		break;
		case player.page == 3:
			$("#bg").css("background", "url(assets/bg2.png)");
			player.counter=0;
			player.x=1;
			player.page=2;
		break;
	}
}//end pageChangeLeft

function pageChangeUp(){
	switch(true){
		case player.page == 3:
			$("#bg").css("background", "url(assets/bg4.png)");
			player.counter=0;
			player.y=680;
			player.page=4;
		break;
		case player.page == 4:
			$("#bg").css("background", "url(assets/bg5.png)");
			player.counter=0;
			player.y=680;
			player.page=5;
		break;
		case player.page == 5:
			$("#bg").css("background", "url(assets/bg6.png)");
			player.counter=0;
			player.y=680;
			player.page=6;
		break;
	}
}//end pageChangeUp

function pageChangeDown(){
	switch(true){
		case player.page == 4:
			$("#bg").css("background", "url(assets/bg3.png)");
			player.counter=0;
			player.y=1;
			player.page=3;
		break;
		case player.page == 5:
			$("#bg").css("background", "url(assets/bg4.png)");
			player.counter=0;
			player.y=1;
			player.page=4;
		break;
		case player.page == 6:
			$("#bg").css("background", "url(assets/bg5.png)");
			player.counter=0;
			player.y=1;
			player.page=5;
		break;
	}
}//end pageChangeDown

function ui(){
	if (player.inBattle) {
		$('#ui').css('background-image','url(assets/battleScreen.png)');
		if (player.inMagicScreen) {
			utx.font = "italic 20px impact";
			let y =200;
			for (let i = spells.length - 1; i >= 0; i--) {
				utx.fillText(spells[i],120,y);
				y+=40;
			}
			switch(true){
			case player.magicSelection==0:
				utx.drawImage(img[5],75,176);
			break;

			case player.magicSelection==1:
				utx.drawImage(img[5],75,218);
			break;

			case player.magicSelection==2:
				utx.drawImage(img[5],75,255);
			break;
		}
		}
		else if (player.inItemScreen) {
			utx.font = "italic 20px impact";
			let y =200;
			for (let i = items.length - 1; i >= 0; i--) {
				utx.fillText(items[i],120,y);
				y+=40;
			}
			switch(true){
			case player.itemSelection==0:
				utx.drawImage(img[5],75,176);
			break;

			case player.itemSelection==1:
				utx.drawImage(img[5],75,218);
			break;

			case player.itemSelection==2:
				utx.drawImage(img[5],75,255);
			break;
		}
		}
		else{
			utx.font = "italic 20px impact";
			let y =200;
			for (let i = options.length - 1; i >= 0; i--) {
				utx.fillText(options[i],120,y);
				y+=40;
			}
			switch(true){
			case player.selection==0:
				utx.drawImage(img[5],80,176);
			break;

			case player.selection==1:
				utx.drawImage(img[5],80,218);
			break;

			case player.selection==2:
				utx.drawImage(img[5],80,255);
			break;

			case player.selection==3:
				utx.drawImage(img[5],80,298);
			break;

			case player.selection==4:
				utx.drawImage(img[5],80,336);
			break;
		}
		}
		utx.font = "italic 20px Times New Roman";
		if (player.status == "") {
			utx.fillText("Level: "+ player.level ,75,120);
		}
		else{
			utx.fillText(player.status,75,120);
		}
		utx.fillText("HP: "+player.currentHealth + "/"+ player.totalHealth ,75,160);
		utx.fillText("VP: "+player.currentMana + "/"+ player.totalMana ,165,160);
	}
	else{
		$('#ui').css('background-image','none');
	}
}//end ui

function enemyDraw(){
	if (player.inBattle) {
		utx.font = "italic 60px impact";
	if (player.page ==1 || player.page==2) { //meh on syntax
		if (enemyRNG<=33) {
		etx.drawImage(img[6],380,80);
		if (!enemyLoaded) {
			for(let k in enemy1) enemy[k]=enemy1[k];
			enemyLoaded =true;
		}
		if (enemy.intro) {
		let battleIntro = utx.fillText(enemy1.name + " appeared!",410,580);
		}
	}
		else if (enemyRNG<=66){
		etx.drawImage(img[7],380,80);
		if (!enemyLoaded) {
			for(let k in enemy2) enemy[k]=enemy2[k];
			enemyLoaded =true;
		}
		if (enemy.intro) {
		let battleIntro = utx.fillText(enemy2.name + " appeared!",460,580);
		}
	}
		else{
		etx.drawImage(img[8],400,50);
		if (!enemyLoaded) {
			for(let k in enemy3) enemy[k]=enemy3[k];
			enemyLoaded =true;
		}
		if (enemy.intro) {
		let battleIntro = utx.fillText(enemy3.name + "   appeared!",440,580);
		}
	}
}
	else if (player.page>=4 && player.page<=6 && !player.page<=0) { //meh on syntax
		if (enemyRNG<=33) {
		etx.drawImage(img[9],450,80);
		if (!enemyLoaded) {
			for(let k in enemy4) enemy[k]=enemy4[k];
			enemyLoaded =true;
		}
		if (enemy.intro) {
		let battleIntro = utx.fillText(enemy4.name + " appeared!",410,580);
		}
	}
		else if (enemyRNG<=66) {
		etx.drawImage(img[10],450,80);
		if (!enemyLoaded) {
			for(let k in enemy5) enemy[k]=enemy5[k];
			enemyLoaded =true;
		}
		if (enemy.intro) {
		let battleIntro = utx.fillText(enemy5.name + " appeared!",350,580);
		}
	}

		else {
		etx.drawImage(img[11],450,80);
		if (!enemyLoaded) {
			for(let k in enemy6) enemy[k]=enemy6[k];
			enemyLoaded =true;
		}
		if (enemy.intro) {
		let battleIntro = utx.fillText(enemy6.name + " appeared!",350,580);
		}
	}

	}

	else{
	etx.drawImage(img[12],450,80);
		if (!enemyLoaded) {
			for(let k in boss) enemy[k]=boss[k];
			enemyLoaded =true;
		}
		if (enemy.intro) {
		let battleIntro = utx.fillText(boss.name + " looms near!",300,580);
		}
	}

}
}//end enemyDraw

function enemyAttack(){
	player.cooldown = 0;
	if (enemy.health<=0) {
		if (enemy.name == "Corporeal Corporation") {
			boss.alive = false;
		}
	$("#enemy").css("animation", "enemyDeath .5s linear");
			delayEnemyDeath(function(){
		$("#enemy").css("opacity",0);
		$("#enemy").css("animation", "none");
		},500);
	player.canAttack = false;
	ttx.clearRect(0,0,1280,720);
	ttx.fillText("The "+enemy.name+" vanished!" ,180,550);
	ttx.fillText("You got "+enemy.exp+" exp!" ,180,630);
	enemyItemDropRNG = Math.floor((Math.random() * 100) + 0);
if (enemyItemDropRNG>=90 && items.length ==5) {
	console.log("no dropparinooooo");
}
else if (enemyItemDropRNG>=90) {
	items.unshift(enemy.item);
	ttx.fillText("Got "+enemy.item ,690,550);
}
	delayEndBattle(function(){
	player.exp+=enemy.exp;
	ttx.clearRect(0,0,1280,720);
	player.inBattle =false;
	enemyLoaded =false;
	if (boss.alive ==false) {
		console.log("wiiiiiiiiiiiiiiin");
	}
		},3000);
	if (player.exp >= player.levelCap) {
		levelUp();
	}
}
else{
enemyAttackRNG = Math.floor((Math.random() * 100) + 0);
if (enemyAttackRNG<=enemy.hitChance) {
	enemyStatusRNG = Math.floor((Math.random() * 100) + 0);
	$("#ui").css("animation", "takeDamage .5s linear");
			delayTakeDamage(function(){
		$("#ui").css("animation", "none");
		player.canAttack = true;
		},500);
	if (!player.guarding) {
		let totalEDPS = enemy.damage - player.armor.toString();
		player.currentHealth-= enemy.damage - player.armor;
		ttx.fillText("You are hit for "+ totalEDPS +" damage!",180,600);
		if (enemyStatusRNG >=95 && enemy.status!="") {
			ttx.fillText("You're traumatized with Sloth",180,670);
			player.status = enemy.status;
		}
	}
	else{
		let totalEDPS = enemy.damage - player.guardArmor.toString();
		player.currentHealth-= enemy.damage - player.guardArmor;
		ttx.fillText("You are hit for "+ totalEDPS +" damage through your guard!",180,600);
		if (enemyStatusRNG >=95 && enemy.status!="") {
			ttx.fillText("You're traumatized with Sloth",180,670);
			player.status = enemy.status;
		}
	}
}
else{
	ttx.fillText("A nimble dodge!",180,600);
				delayTakeDamage(function(){
		player.canAttack = true;
		},500);
}
death();
}
}//end enemyAttack

function death(){
	if (player.currentHealth<=0) {
		player.canAttack = false;
			delayTakeDamage(function(){
		ttx.clearRect(0,0,1280,720);
		$("#ui").css("animation", "death 4s linear");
		$("#bText").css("animation", "death 4s linear");
		ttx.fillText("A Fatal Blow!",510,590);
		},1000);

		delayAttack(function(){
		ttx.clearRect(0,0,1280,720);
		$("#ui").css("opacity", 0);
		console.log("ded");
		$("#bg").css("background", "url(assets/gameOverScreen.png)");
		player.inBattle= false;
		player.page=0;
		player.alive=false;

		},4000);
	}
} //end death

function levelUp(){
ttx.fillStyle = '#C6ACC9';
	player.levelCap+= ((player.levelCap+13)*1.3); //check on these
	player.damage+= Math.floor((Math.random() * 3) + 1); //check on these
	player.magicDamage+= Math.floor((Math.random() * 3) + 1);
	player.totalHealth+= Math.floor((Math.random() * 10) + 5); //check on these
	player.totalMana+= Math.floor((Math.random() * 5) + 4);
	player.level++;
	console.log("Level Cap: "+player.levelCap);
	console.log("Damage: "+player.damage);
	console.log("Magic Damage: "+player.magicDamage);
	console.log("Total Health: "+player.totalHealth);
	console.log("Total Mana: "+player.totalMana);
	console.log("Level: "+player.level);
	delayLevelUp(function(){
		delayLevelUp(function(){
		ttx.clearRect(0,0,1280,720);
		ttx.fillStyle = "black";
	},3800);
		ttx.fillText("Level Up!" ,690,620);
		if (player.level == 2) {
		spells.unshift("Nostalgia");
		ttx.fillText("You learned Nostalgia!" ,610,670);
	}
	else if (player.level ==5) {
		spells.unshift("Aesthetics");
		ttx.fillText("You learned Aesthetics!" ,610,670);
	}
	else if (player.level ==12) {
		spells.unshift("Wave");
		ttx.fillText("You learned Wave!" ,610,670);
	}
	},200);
} //end levelUp

function drawOverLays(){
	btx.clearRect(0,0,1280,720);
	ctx.clearRect(0,0,1280,720);
	utx.clearRect(0,0,1280,720);
	etx.clearRect(0,0,1280,720);
} //end drawOverLays

$(document).on("keypress",function(e){
	if (e.which ==enter &! GAMESTART) {
GAMESTART=true;
game.start();
//music();
fadeIntro();
magicCoolDown;
}
}); //end one click

});//end ready