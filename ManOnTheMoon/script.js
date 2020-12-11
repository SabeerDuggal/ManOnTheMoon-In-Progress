var astronaut, alien, metal, glass, fuel, resourceImg;
var laser, booster, moonImg, astroImg;
var alienGroup, lives, gameState;
var bullet, bulletGroup;
var database, dataBaseCount, aliens, alienImg, grenade, mothership, superBullets;
var aliens = [];
var superBulletsImg;
var b1, b2, b3, b4, b5, b6, b7, b8;
var resourceGroup;
var flag = 0;
var edges, fire, fireImg;
var kills = 0;
var lives = 5, hearts = '', greeners = '';
looper = lives;
var mothershipSprite;
var green = 10;
points = 0;
var mothership_lives = 30;
var stopper = 0;
function preload() {
    gameState = 0
    lives = 5
    moonImg = loadImage("Images/Moon.jpg")
    astroImg = loadImage("Images/Astronaut.png")
    alienImg = loadImage("Images/Alien.png")
    grenade = loadImage("Images/Grenade.png")
    resourceImg = loadImage("Images/Resource.png")
    shootImg = loadImage("Images/Gun.png")
    superBulletsImg = loadImage("Images/SuperBullet.png")
    bgSound = loadSound("Images/alien_breath.ogg")
    mothership = loadImage("Images/MotherShip.png")
    fireImg = loadImage("Images/Fire.png")
    mothershipSprite = createSprite(screen.width / 2, screen.height / 8)
}

function setup() {
    createCanvas(screen.width, screen.height);
    database = firebase.database();
    astronaut = createSprite(screen.width / 2, screen.height / 2, 10, 10)
    astronaut.addImage(astroImg, "astro")
    astronaut.setCollider("rectangle", -30, 40, 150, 300);
    astronaut.scale = 0.2
    alienGroup = new Group()
    bulletGroup = new Group();
    resourceGroup = new Group();
    fireGroup = new Group()
    superBulletsGroup = new Group()
    edges = createEdgeSprites()
    var shooter = createSprite(3 * screen.width / 4, astronaut.y, 40, 20)
    shooter.addImage(shootImg)
    shooter.scale = 0.1
    b = createSprite(screen.width - 50, screen.height - 50, 50, 50);


}



function draw() {

    superBullets()
    looper = lives
    while (looper > 0) {
        hearts = hearts + '💗'
        looper = looper - 1;
    }
    if (points >= 1 && kills >= 2) {
        gameState = 2;
    }
    if (gameState == 2) {

        gameState2()

    }

    document.getElementById('display').innerHTML = 'Kills ⚔: ' + kills + '<br><b>Lives:</b>' + hearts + '<br><b>Resources collected ⛵</b> ' + points;
    astronaut.bounceOff(edges); hearts = ''
    background(moonImg)
    if ((lives > 0 && gameState == 1 || gameState == 2)) {




        if (touches.length > 0 || keyWentDown("up")) {
            astronaut.velocityY = -50
            touches = [];
        }
        else if (touches.length > 0 || keyWentDown("down")) {
            astronaut.velocityY = 50
            touches = [];
        }
        else if (keyWentDown("right") || touches.length > 0) {
            astronaut.velocityX = 50
            touches = [];
        }
        else if (keyWentDown("left") || touches.length > 0) {
            astronaut.velocityX = -50
            touches = [];
        }

        else {
            astronaut.velocityX = 0;
            astronaut.velocityY = 0;
        }
        if (keyDown("D") && (frameCount % 10 == 0)) {
            bullet = createSprite(astronaut.x, astronaut.y, 10, 30);
            bullet.velocityX = 10
            bulletGroup.add(bullet);
            bullet.addImage(grenade, "g")
            grenade.resize(90, 90)
        }
        else if (keyDown("A") && (frameCount % 10 == 0)) {
            bullet = createSprite(astronaut.x, astronaut.y, 10, 30);
            bullet.velocityX = -10
            bulletGroup.add(bullet);
            bullet.addImage(grenade, "g")
            grenade.resize(90, 90)
        }
        else if (keyDown("W") && (frameCount % 10 == 0)) {
            bullet = createSprite(astronaut.x, astronaut.y, 10, 30);
            bullet.velocityY = -10
            bulletGroup.add(bullet);
            bullet.addImage(grenade, "g")
            grenade.resize(90, 90)
        }
        else if (keyDown("S") && (frameCount % 10 == 0)) {
            bullet = createSprite(astronaut.x, astronaut.y, 10, 30);
            bullet.velocityY = 10
            bulletGroup.add(bullet);
            bullet.addImage(grenade, "g")
            grenade.resize(90, 90)
        }
        else {

        }

        spawnAliens()
        spawnResources()
        if (alienGroup.isTouching(astronaut)) {
            astronaut.velocityX = 0
            astronaut.velocityY = 0;
            astronaut.velocityX = 0
            astronaut.velocityY = 0;
            lives -= 1
            astronaut.x = screen.width / 2
            astronaut.y = screen.height / 2
            alert(lives + " lives left! Be careful!")
            alienGroup.destroyEach();
            console.log(astronaut.x);
            flag = 1;


            astronaut.velocityX = 0;
            astronaut.velocityY = 0;
            bulletGroup.destroyEach()
            astronaut.setVelocity(0, 0)

        }
        if (resourceGroup.isTouching(astronaut)) {
            points += 1
            alert(points + " points achieved! Hurray! 😀😁")
            astronaut.x = screen.width / 2
            astronaut.y = screen.height / 2
            astronaut.velocityX = 0;
            astronaut.velocityY = 0;
            resourceGroup.destroyEach()
            bulletGroup.destroyEach()
            astronaut.setVelocity(0, 0)
            return
        }
        if (lives == 0) {

            gameState = 0;
            alert("👽GAME OVER, you lost our earth to extraterestrials 👾")
        }
        aliens.forEach(a => {
            if (bulletGroup.isTouching(a)) {
                a.lifetime = 0;
                kills = kills + 1
                if (stopper == 0) {
                    bulletGroup.destroyEach()
                }
                else {

                }
            }

        });
    }
    drawSprites()
}
function superBullets() {

    if (keyDown('X') && gameState == 2) {
        if (frameCount % 12 == 0) {
            superbullet = createSprite(astronaut.x, astronaut.y, 50, 50)
            superbullet.addImage(superBulletsImg)
            superBulletsImg.resize(40, 80)
            superBulletsImg.velocityY = -20;
            superBulletsGroup.add(superbullet)
            superbullet.velocityY = -20
        }
    }
    if (superBulletsGroup.isTouching(mothershipSprite)) {
        mothership_lives -= 1;
        superBulletsGroup.destroyEach()
    }
    if(superBulletsGroup.isTouching(alienGroup)){
        superBulletsGroup.destroyEach()
        aliens.forEach(a => {
            if (superBulletsGroup.isTouching(a)) {
                a.lifetime = 0;
            }

        });
    }
}
function backToNormal() {
    document.getElementById('welcome').style.display = 'none'
    document.getElementById('backblur').style.filter = 'blur(0px)'
    document.getElementById('backblur').style.webkitFilter = 'blur(0px)'
    gameState = 1;
}



function spawnAliens() {
    alien = createSprite(Math.round(random(0, screen.width)), Math.round(random(0, screen.height)), 20, 20)
    alien.visible = false
    alien.x = 0
    alien.y = 0
    alien.setVelocity(0, 0)
    if (frameCount % 20 == 0) {
        alien.visible = true
        alien.shapeColor = "green"
        aliens.push(alien)
        alienGroup.add(alien)
        alien.velocityX = Math.random(20, 30)
        alien.velocityY = Math.random(8, 20)
        alien.addImage(alienImg, "a")
        alienImg.resize(60, 40)
    }


}

function spawnResources() {
    if (frameCount % 200 == 0) {
        var resource = createSprite(Math.round(random(0, screen.width)), Math.round(random(0, screen.height)), 20, 20)
        resource.shapeColor = "orange"
        resource.lifetime = 300
        resourceGroup.add(resource);
        resource.addImage(resourceImg, "r")
        resourceImg.resize(140, 90)
    }
}

function up() {
    astronaut.y -= 50
}
function down() {
    astronaut.y += 50
}
function left() {
    astronaut.x -= 50
}
function right() {
    astronaut.x += 50
}


function shoot() {
    bullet = createSprite(astronaut.x, astronaut.y, 10, 30);
    bullet.velocityY = -10
    bulletGroup.add(bullet);
    bullet.addImage(grenade, "g")
    grenade.resize(90, 90)
}

function gameState2() {
    alien = createSprite(mothershipSprite.x, mothershipSprite.y, 20, 20)
    alien.visible = false
    alien.x = 0
    alien.y = 0
    alien.setVelocity(0, 0)
    if (frameCount % 5 == 0) {
        alien.visible = true
        alien.shapeColor = "green"
        aliens.push(alien)
        alienGroup.add(alien)
        alien.velocityX = Math.random(20, 30)
        alien.velocityY = Math.random(8, 20)
        alien.addImage(alienImg, "a")
        alienImg.resize(60, 40)
    }

    if (stopper == 0) {
        alert('Now you will be faced with the bulk of the alien force and their mothership (And Oh! the Mothership can shoot all your lives away in one go). So, now you can fire bullets repeatedly without any restriction 🎯🎯')
        stopper = 1
    }
    mothershipSprite.addImage(mothership)
    mothershipSprite.bounceOff(edges)


    if (frameCount % 200 == 0) {
        fire = createSprite(mothershipSprite.x, mothershipSprite.y, 200, 200)
        fire.velocityY = 10
        fire.addImage(fireImg)
        fireImg.resize(200, 200)
        fireGroup.add(fire);


    }
    if (fireGroup.isTouching(astronaut)) {
        lives = 0;
    }
    if (kills >= 2 && points >= 4) {
        gameState = 0
        alert("GAME OVER ! Oh boy you did beat those aliens good and proper. 🐱‍👤 Now their forces are decimated 💥! Share your score to secure a place for yourself among the top 3")

    }
}





