// < >
var DEBUG=0;
//costant
var TO_RADIANS = Math.PI/180; 

//global variables
var canvas;
var canvasW;
var canvasH;
var ctx;
var activeTask;
var level;
var particles=[];
var gridOffsetX=100;
var gridOffsetY=500;

//mobile controls
var mousex=-100;
var mousey=-100;
var dragging=false;

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
canvasW=canvas.width  = 1080;//window.innerWidth;
canvasH=canvas.height = 1920;//window.innerHeight;
var tileSize=100;
var possibleValues=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var possibleValues=["4","0"];
var grid=[[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}],[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}],[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}],[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}],[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}],[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}],[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}],[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}],[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}],[{val:"A"},{val:"E"},{val:"I"},{val:"O"},{val:"U"},{val:"Y"},{val:"f"},{val:"o"},{val:"u"},{val:"r"}]];
for(var i=0;i<10;i++)
    for(var j=0;j<10;j++)
    {
        grid[i][j].val=possibleValues[rand(0,possibleValues.length-1)];
        grid[i][j].animationX=0;
        grid[i][j].animationY=-2000;
    }

//controls
canvas.addEventListener("mousemove",mossoMouse);
canvas.addEventListener("mousedown",cliccatoMouse);
canvas.addEventListener("mouseup",rilasciatoMouse);
canvas.addEventListener("touchstart", cliccatoTap);
canvas.addEventListener("touchmove", mossoTap);
canvas.addEventListener("touchend", rilasciatoTap);

level=0;//TODO change level here (menu is -1)
generateLevel();
activeTask=setInterval(run, 33);

function generateLevel()
{
    //TODO here
}
function run()
{
    /*
    if(inputDelay>0)
    {
        inputDelay--;
        dragging=false;
    }
    */
	ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvasW,canvasH);

    ctx.fillStyle="#FFF";
    ctx.fillRect(0,0,canvasW,1);
    ctx.fillRect(0,canvasH-1,canvasW,1);
    ctx.fillRect(0,0,1,canvasH);
    ctx.fillRect(canvasW-1,0,1,canvasH);

    //menu
    if(level==-1)
    {
        ctx.fillStyle="#EEE";
        ctx.font = "120px Lucida Console";
        four="";
        if(rand(0,3))
            four+="F";
        else
            four+="f";
        if(rand(0,3))
            four+="O";
        else
            four+="o";
        if(rand(0,3))
            four+="U";
        else
            four+="u";
        if(rand(0,3))
            four+="R";
        else
            four+="r";
        text="Four or "+four;
        ctx.fillText(text,120,120);
        
        ctx.fillStyle="#FFF";
        ctx.font = "12px Arial";
        ctx.fillText("By Infernet89",canvasW-75,canvasH-5);
        ctx.fillText("Made for JS13k Competition",5,canvasH-5);
    }
    else if(level==0)
    {
        var animatingObjects=0;
        var selectedList=[];

        ctx.fillStyle="#FFF";
        ctx.font = "80px Arial";
        ctx.textAlign = "center";
        for(var i=0;i<10;i++)
            for(var j=0;j<10;j++)
            {
                ctx.fillStyle="#FFF";
                ctx.fillText(grid[i][j].val,gridOffsetX+i*tileSize+grid[i][j].animationX,gridOffsetY+j*tileSize+grid[i][j].animationY);
                
                //gestisci le animazioni
                if(Math.abs(grid[i][j].animationX)>1)
                {
                    grid[i][j].animationX*=0.8
                    animatingObjects++;
                }                    
                else
                {
                    grid[i][j].animationX=0;
                }
                if(Math.abs(grid[i][j].animationY)>1)
                {
                    grid[i][j].animationY*=0.8;
                    animatingObjects++;
                }
                else
                {
                    grid[i][j].animationY=0;
                }                    

                //controlla se il mouse l'ha selezionato
                if(distanceFrom(mousex,mousey,i*tileSize+gridOffsetX,j*tileSize+gridOffsetY)<100)
                {
                    var tmp=new Object();
                    tmp.r=i;
                    tmp.c=j;
                    selectedList.push(tmp);
                    ctx.fillStyle="#F00";
                }
                else
                    ctx.fillStyle="#0F0";
                ctx.fillRect(i*tileSize+gridOffsetX,j*tileSize+gridOffsetY,10,10);
            }
        //sta cliccando, ed è in mezzo a 4 oggetti
        if(dragging && selectedList.length>=3)
        {
            dragging=false;
            rotateTiles(selectedList);
        }
        //le animazioni sono finite
        else if(animatingObjects==0)
            checkForFour();
        drawParticles();
    }
}
function checkForFour()
{
    for(var i=0;i<10 -1;i++)
        for(var j=0;j<10 -1;j++)
        {
            if(grid[i][j].val==grid[i+1][j].val && grid[i][j].val==grid[i][j+1].val && grid[i][j].val==grid[i+1][j+1].val)
            {
                //sposta in giù di 2 (gravità)
                for(var k=j+1;k>1;k--)
                {
                    grid[i][k].val=grid[i][k-2].val;
                    grid[i][k].animationY=-200;
                    grid[i+1][k].val=grid[i+1][k-2].val;
                    grid[i+1][k].animationY=-200;
                }
                //fai apparire 4 blocchi sopra
                grid[i][0].val=possibleValues[rand(0,possibleValues.length-1)];
                grid[i+1][0].val=possibleValues[rand(0,possibleValues.length-1)];
                grid[i][1].val=possibleValues[rand(0,possibleValues.length-1)];
                grid[i+1][1].val=possibleValues[rand(0,possibleValues.length-1)];
                grid[i][0].animationY=-800;
                grid[i+1][0].animationY=-800;
                grid[i][1].animationY=-800;
                grid[i+1][1].animationY=-800;
                //effetto esplosione
                explosionParticles(gridOffsetX+(i+0.5)*tileSize,gridOffsetY+(j+0.5)*tileSize,"#FFF");
            }
        }
}
function rotateTiles(selectedList)
{
    var Or=99;
    var Oc=99;
    for(var i=0;i<selectedList.length;i++)
    {
        if(selectedList[i].r<Or)
            Or=selectedList[i].r;
        if(selectedList[i].c<Oc)
            Oc=selectedList[i].c;
    }
    var tmp=grid[Or][Oc];
    grid[Or][Oc]=grid[Or][Oc+1];    
    grid[Or][Oc+1]=grid[Or+1][Oc+1];
    grid[Or+1][Oc+1]=grid[Or+1][Oc];
    grid[Or+1][Oc]=tmp;

    grid[Or][Oc].animationY=100;
    grid[Or][Oc+1].animationX=100;
    grid[Or+1][Oc+1].animationY=-100;
    grid[Or+1][Oc].animationX=-100;
}
function explosionParticles(x,y,color)
{
    for(ip=0;ip<50;ip++)
    {
        t=new Object();
        t.px=x;
        t.py=y;
        t.dx=rand(-3,3);
        t.dy=rand(-3,3);
        t.color=color;
        t.ttl=rand(5,50);
        particles.push(t);
    }
}
function drawParticles()
{
    ctx.save();
    for(ipd=0;ipd<particles.length;ipd++)
    {
        ctx.fillStyle=particles[ipd].color;
        ctx.fillRect(particles[ipd].px,particles[ipd].py,3,3);
        particles[ipd].px+=particles[ipd].dx;
        particles[ipd].py+=particles[ipd].dy;
        particles[ipd].ttl--;
        if(particles[ipd].ttl<=0)
        {
            particles.splice(ipd,1);
            ipd=ipd-1;
        }
    }
    ctx.restore();
}
/*#############
    Funzioni Utili
##############*/
function rand(da, a)
{
    if(da>a) return rand(a,da);
    a=a+1;
    return Math.floor(Math.random()*(a-da)+da);
}
function distanceFrom(a,b)
{
    return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
function distanceFrom(ax,ay,bx,by)
{
    return Math.sqrt((ax-bx)*(ax-bx)+(ay-by)*(ay-by));
}
//controlli mobile
function mossoTap(evt)
{
    evt.preventDefault();
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex = evt.targetTouches[0].pageX,
    mousey = evt.targetTouches[0].pageY;
}
function cliccatoTap(evt)
{
    evt.preventDefault();
    var rect = canvas.getBoundingClientRect();
    mousex = evt.targetTouches[0].pageX,
    mousey = evt.targetTouches[0].pageY;
}
function rilasciatoTap(evt)
{
    evt.preventDefault();
    dragging=false;
    mousey=-100;
    mousex=-100;
}
//uindows
function cliccatoMouse(evt)
{
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
//< >
}
function mossoMouse(evt)
{
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function rilasciatoMouse(evt)
{
    dragging=false;    
}
window.AutoScaler = function(element, initialWidth, initialHeight, skewAllowance){
    var self = this;
    
    this.viewportWidth  = 0;
    this.viewportHeight = 0;
    
    if (typeof element === "string")
        element = document.getElementById(element);
    
    this.element = element;
    this.gameAspect = initialWidth/initialHeight;
    this.skewAllowance = skewAllowance || 0;
    
    this.checkRescale = function() {
        if (window.innerWidth == self.viewportWidth && 
            window.innerHeight == self.viewportHeight) return;
        
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var windowAspect = w/h;
        var targetW = 0;
        var targetH = 0;
        
        targetW = w;
        targetH = h;
        
        if (Math.abs(windowAspect - self.gameAspect) > self.skewAllowance) {
            if (windowAspect < self.gameAspect)
                targetH = w / self.gameAspect;
            else
                targetW = h * self.gameAspect;
        }
        
        self.element.style.width  = targetW + "px";
        self.element.style.height = targetH + "px";
    
        self.element.style.marginLeft = ((w - targetW)/2) + "px";
        self.element.style.marginTop  = ((h - targetH)/2) + "px";
    
        self.viewportWidth  = w;
        self.viewportHeight = h;
        
    }
    
    // Ensure our element is going to behave:
    self.element.style.display = 'block';
    self.element.style.margin  = '0';
    self.element.style.padding = '0';
    
    // Add event listeners and timer based rescale checks:
    window.addEventListener('resize', this.checkRescale);
    rescalercheck=setInterval(this.checkRescale, 1500);
};
