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
                this.map[f.pos.y][f.pos.x]=f;
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
        size: 10,
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

        if (screen.view=='front')
        {
            //draw front of ship
            screen.ctx.beginPath();
            screen.ctx.moveTo(0,canvas.height);
            screen.ctx.lineTo(canvas.width/2,canvas.height/1.3);
            screen.ctx.lineTo(canvas.width,canvas.height);
            screen.ctx.stroke();
        }

        if (screen.view=='back')
        {
            //draw back of ship
            screen.ctx.beginPath();
            screen.ctx.moveTo(0,canvas.height);
            screen.ctx.lineTo(canvas.width/3,canvas.height/1.3);
            screen.ctx.lineTo(canvas.width/1.5,canvas.height/1.3);
            screen.ctx.lineTo(canvas.width,canvas.height);
            screen.ctx.stroke();
        }

        if (screen.view=='left' || screen.view=='right')
        {
            //draw side of ship
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
                    let dx=Math.abs(f.pos.x-p.pos.x);
                    let dy=Math.abs(f.pos.y-p.pos.y);
                    let d=Math.abs(Math.round(Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))));
                    
                    if (((screen.view=='front' || screen.view=='back') && (p.dir=='e' || p.dir=='w')) || ((p.dir=='n' || p.dir=='s') && (screen.view=='left' || screen.view=='right')))
                    {
                        let minY=p.pos.y-dx;
                        let maxY=p.pos.y+dx;
                        let dfov=Math.abs(f.pos.y-minY);
                        let nsplits=dx*2;
                        let splitsize=screen.canvas.width/nsplits;
                        let fsize={x:Math.round(f.size.x/d), y:Math.round(f.size.y/d)};
                        let ny;
                        
                        //earth curvature
                        if (d>apex)
                        {
                            fsize.y-=d-apex;
                            ny=Math.round(screen.canvas.height/2-fsize.y);
                        }
                        else
                        {
                            ny=Math.round(screen.canvas.height/2-fsize.y)+(fsize.y/4);
                        }
                        
                        if ((p.dir=='e' && screen.view=='front') || (p.dir=='n' && screen.view=='right') || (p.dir=='s' && screen.view=='left') || (p.dir=='w' && screen.view=='back'))
                        {
                            if (f.pos.x>p.pos.x && f.pos.y>=minY && f.pos.y<=maxY && fsize.y>0)
                            {
                                screen.ctx.fillRect(dfov*splitsize-(fsize.x/2),ny,fsize.x,fsize.y);
                            }
                        }

                        if ((p.dir=='w' && screen.view=='front') || (p.dir=='n' && screen.view=='left') || (p.dir=='s' && screen.view=='right') || (p.dir=='e' && screen.view=='back'))
                        {
                            if (f.pos.x<p.pos.x && f.pos.y>=minY && f.pos.y<=maxY && fsize.y>0)
                            {
                                screen.ctx.fillRect(dfov*splitsize-(fsize.x/2),ny,fsize.x,fsize.y);
                            }
                        }
                    }

                    if (((screen.view=='front' || screen.view=='back') && (p.dir=='n' || p.dir=='s')) || ((p.dir=='e' || p.dir=='w') && (screen.view=='left' || screen.view=='right')))
                    {
                        let minX=p.pos.x-dy;
                        let maxX=p.pos.x+dy;
                        let dfov=Math.abs(f.pos.x-minX);
                        let nsplits=dy*2;
                        let splitsize=screen.canvas.width/nsplits;
                        let fsize={x:Math.round(f.size.x/d), y:Math.round(f.size.y/d)};
                        let ny;
                        
                        //earth curvature
                        if (d>apex)
                        {
                            fsize.y-=d-apex;
                            ny=Math.round(screen.canvas.height/2-fsize.y);
                        }
                        else
                        {
                            ny=Math.round(screen.canvas.height/2-fsize.y)+(fsize.y/4);
                        }
                        
                        if ((p.dir=='n' && screen.view=='front') || (p.dir=='e' && screen.view=='left') || (p.dir=='w' && screen.view=='right') || (p.dir=='s' && screen.view=='back'))
                        {
                            if (f.pos.y<p.pos.y && f.pos.x>=minX && f.pos.x<=maxX && fsize.y>0)
                            {
                                screen.ctx.fillRect(dfov*splitsize-(fsize.x/2),ny,fsize.x,fsize.y);
                            }
                        }

                        if ((p.dir=='s' && screen.view=='front') || (p.dir=='e' && screen.view=='right') || (p.dir=='w' && screen.view=='left') || (p.dir=='n' && screen.view=='back'))
                        {
                            if (f.pos.y>p.pos.y && f.pos.x>=minX && f.pos.x<=maxX && fsize.y>0)
                            {
                                screen.ctx.fillRect(dfov*splitsize-(fsize.x/2),ny,fsize.x,fsize.y);
                            }
                        }
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
    constructor(name,pos)
    {
        this.name=name;
        this.pos=pos;
        this.size={x:800, y:100};

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

        //ship rotation
        if (e.key=='c')
        {
            if (dir>0) dir--;
            else dir=rdir.length-1;
            p.dir=rdir[dir];
        }
        if (e.key=='v')
        {
            if (dir<rdir.length-1) dir++;
            else dir=0;
            p.dir=rdir[dir];
        }
    }

    //update
    map.update();
    screen.draw();
})

//RUNTIME
screen.init();
map.init();

new Ship('Plack Bearl', {x:1,y:5}, 'n');
new Island('Turtoga', {x:7,y:5});
new Island('Skull', {x:0,y:2});

screen.draw();
map.update();