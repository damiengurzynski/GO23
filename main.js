//GLOBAL VARIABLES
let player=0;
let dir=0;
let playerview=0;

//OBJECTS
let map=
{
    //variables
    size: 20,

    //functions
    init: function()
    {
        this.map=Array.from(Array(this.size), ()=>new Array(this.size));
        for (let i=0;i<this.size;i++)
            for (let j=0;j<this.size;j++)
                this.map[i][j]=null;
    },

    update: function()
    {
        //clear
        for (let i=0;i<this.size;i++)
        for (let j=0;j<this.size;j++)
            this.map[i][j]=null;

        //fill with world entities
        Object.values(world).forEach(e=>
        {
            e.forEach(f=>
            {
                for (let i=0;i<f.cellsize;i++) this.map[f.pos.y][f.pos.x+i]=f;
            });
        });
    }
}

let world=
{
    //static entities
    islands: [],

    //dynamic entities
    ships: [],
}

let screen=
{
    //variables
    menu: 'main',
    view: 'front',

    //objects
    map:
    {
        size: 20,
    },

    //functions
    init: function()
    {
        //canvas
        screen.canvas=document.getElementById('canvas');
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight/2;

        screen.ctx=canvas.getContext('2d');
        screen.ctx.fillStyle='white';
        screen.ctx.strokeStyle='white';
        screen.ctx.imageSmoothingEnabled=false;

        //map
        screen.map.map=Array.from(Array(screen.map.size), ()=>new Array(screen.map.size));

        for (let i=0;i<screen.map.size;i++)
            for (let j=0;j<screen.map.size;j++)
            screen.map.map[i][j]=null;
    },

    draw: ()=>
    {
        //variables
        let p=world.ships[player];
        let apex=6;

        //clear canvas
        screen.ctx.clearRect(0,0,screen.canvas.width,screen.canvas.height);

        //draw horizon
        screen.ctx.beginPath();
        screen.ctx.moveTo(0,canvas.height/2);
        screen.ctx.lineTo(canvas.width,canvas.height/2);
        screen.ctx.stroke();

        //draw front of ship
        if (screen.view=='front')
        {
            screen.ctx.beginPath();
            screen.ctx.moveTo(0,canvas.height);
            screen.ctx.lineTo(canvas.width/2,canvas.height/1.3);
            screen.ctx.lineTo(canvas.width,canvas.height);
            screen.ctx.stroke();
        }
        //draw back of ship
        if (screen.view=='back')
        {
            screen.ctx.beginPath();
            screen.ctx.moveTo(0,canvas.height);
            screen.ctx.lineTo(canvas.width/3,canvas.height/1.3);
            screen.ctx.lineTo(canvas.width/1.5,canvas.height/1.3);
            screen.ctx.lineTo(canvas.width,canvas.height);
            screen.ctx.stroke();
        }
        //draw side of ship
        if (screen.view=='left' || screen.view=='right')
        {
            screen.ctx.beginPath();
            screen.ctx.moveTo(0,canvas.height/1.3);
            screen.ctx.lineTo(canvas.width,canvas.height/1.3);
            screen.ctx.stroke();
        }

        //draw entities
        Object.values(world).forEach(e=>
        {
            e.forEach(f=>
            {
                if (f.name!=p.name)
                {
                    //GLOBAL VARIABLES
                    //distance x from player to entity
                    let dx=Math.abs(f.pos.x-p.pos.x);
                    //distance y from player to entity
                    let dy=Math.abs(f.pos.y-p.pos.y);
                    //distance from player to entity
                    let d=Math.abs(Math.round(Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))));

                    //screen splits
                    let nbSplits;
                    let splitSize;

                    //size of entity
                    let eSize={x:Math.round(f.size.x/d), y:Math.round(f.size.y/d)};

                    //position of entity
                    let ePosX=null;
                    let ePosY=null;

                    //fov limits
                    let fovMinY=p.pos.y-dx;
                    let fovMaxY=p.pos.y+dx;
                    let fovMinX=p.pos.x-dy;
                    let fovMaxX=p.pos.x+dy;

                    //PLAYER FACING NORTH
                    if (p.dir=='n')
                    {
                        //entity is in front of player
                        if (screen.view=='front')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y<p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=f.pos.x-fovMinX;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is behind player and back view
                        if (screen.view=='back')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y>p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=fovMaxX-f.pos.x;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is left of player and left view
                        if (screen.view=='left')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=fovMaxY-f.pos.y;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is right of player and right view
                        if (screen.view=='right')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x>p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=f.pos.y-fovMinY;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }
                    }

                    //PLAYER FACING SOUTH
                    if (p.dir=='s')
                    {
                        //entity is in front of player
                        if (screen.view=='front')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y>p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=fovMaxX-f.pos.x;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is behind player and back view
                        if (screen.view=='back')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y<p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=f.pos.x-fovMinX;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is left of player and left view
                        if (screen.view=='left')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x>p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=f.pos.y-fovMinY;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is right of player and right view
                        if (screen.view=='right')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=fovMaxY-f.pos.y;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }
                    }
                    
                    //PLAYER FACING EAST
                    if (p.dir=='e')
                    {
                        //entity is in front of player
                        if (screen.view=='front')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x>p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=f.pos.y-fovMinY;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is behind player and back view
                        if (screen.view=='back')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity is flipped
                                ePosX=fovMaxY-f.pos.y;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is left of player and left view
                        if (screen.view=='left')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y<p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=f.pos.x-fovMinX;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is right of player and right view
                        if (screen.view=='right')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y>p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity is flipped
                                ePosX=fovMaxX-f.pos.x;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }
                    }

                    //PLAYER FACING WEST
                    if (p.dir=='w')
                    {
                        //entity is in front of player
                        if (screen.view=='front')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=fovMaxY-f.pos.y;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is behind player and back view
                        if (screen.view=='back')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity is flipped
                                ePosX=f.pos.y-fovMinY;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is left of player and left view
                        if (screen.view=='left')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y>p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=fovMaxX-f.pos.x;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is right of player and right view
                        if (screen.view=='right')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y<p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=f.pos.x-fovMinX;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }
                    }

                    //earth curvature
                    if (d>apex)
                    {
                        eSize.y-=d-apex;
                        ePosY=Math.round(screen.canvas.height/2-eSize.y);
                    }
                    else
                    {
                        ePosY=Math.round(screen.canvas.height/2-eSize.y)+(eSize.y/4);
                    }

                    //draw entity
                    if (ePosX!=null && eSize.y>0)
                    {
                        splitSize=screen.canvas.width/nbSplits;
                        screen.ctx.fillRect(ePosX*splitSize-(eSize.x/2),ePosY,eSize.x,eSize.y);
                    }

                }
            });
        });

        //update compass
        let c=document.getElementById('compass');
        if (p.dir=='n') c.innerHTML='n<br>w &#11032 e<br>s';
        if (p.dir=='s') c.innerHTML='n<br>w &#11033 e<br>s';
        if (p.dir=='w') c.innerHTML='n<br>w &#11031 e<br>s';
        if (p.dir=='e') c.innerHTML='n<br>w &#11030 e<br>s';
    }
}

let actions=
{

}

//CLASSES
class Island
{
    constructor(name,pos,dir)
    {
        this.name=name;
        this.pos=pos;
        this.size={x:60, y:60};
        this.cellsize=1;
        this.dir=dir;

        world.islands.push(this);
    }
}

class Ship
{
    constructor(name,pos,dir)
    {
        this.name=name;
        this.pos=pos;
        this.size={x:20, y:20};
        this.cellsize=1;
        this.dir=dir;

        world.ships.push(this);
    } 
}

//KEYBOARD INPUT
document.addEventListener('keydown',e=>
{
    let p=world.ships[player];
    let rdir=['n','e','s','w'];
    let rview=['front','right','back','left'];
    
    if (screen.menu='main')
    {
        //change view
        if (e.key==' ')
        {
            if (playerview<rview.length-1) playerview++;
            else playerview=0;
            screen.view=rview[playerview];
        }

        //ship linear movement
        if (e.key=='ArrowLeft')
        {
            if (dir>0) dir--;
            else dir=rdir.length-1;
            p.dir=rdir[dir];
        }
        if (e.key=='ArrowRight')
        {
            if (dir<rdir.length-1) dir++;
            else dir=0;
            p.dir=rdir[dir];
        }
        if (e.key=='ArrowUp')
        {
            if (p.dir=='n' && p.pos.y>0 && map.map[p.pos.y-1][p.pos.x]==null)
                p.pos.y--;
            if (p.dir=='s' && p.pos.y<map.size-1 && map.map[p.pos.y+1][p.pos.x]==null)
                p.pos.y++;
            if (p.dir=='e' && p.pos.x<map.size-1 && map.map[p.pos.y][p.pos.x+1]==null)
                p.pos.x++;
            if (p.dir=='w' && p.pos.x>0 && map.map[p.pos.y][p.pos.x-1]==null)
                p.pos.x--;
        }
        if (e.key=='ArrowDown')
        {
            if (p.dir=='n' && p.pos.y<map.size-1 && map.map[p.pos.y+1][p.pos.x]==null)
                p.pos.y++;
            if (p.dir=='s' && p.pos.y>0 && map.map[p.pos.y-1][p.pos.x]==null)
                p.pos.y--;
            if (p.dir=='e' && p.pos.x>0 && map.map[p.pos.y][p.pos.x-1]==null)
                p.pos.x--;
            if (p.dir=='w' && p.pos.x<map.size-1 && map.map[p.pos.y][p.pos.x+1]==null)
                p.pos.x++;
        }
    }

    //update
    map.update();
    screen.draw();
})

//RUNTIME
screen.init();
map.init();

new Ship('Plack Bearl', {x:5,y:5}, 'n');
new Island('Turtoga', {x:5,y:3}, 'n');

//new Ship('Bollocks', {x:3,y:0}, 's');
//new Island('Skull', {x:2,y:2}), 'n';

screen.draw();
map.update();