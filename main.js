//GLOBAL VARIABLES
let player=0;
let dir=1;

//OBJECTS
let world=
{
    //static entities
    islands: [],

    //dynamic entities
    ships: [],
}

let screen=
{
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

        //draw front of ship
        screen.ctx.beginPath();
        screen.ctx.moveTo(0,canvas.height);
        screen.ctx.lineTo(canvas.width/2,canvas.height/1.3);
        screen.ctx.lineTo(canvas.width,canvas.height);
        screen.ctx.stroke();

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
                    
                    if (p.dir=='e' || p.dir=='w')
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
                        
                        if (p.dir=='e')
                        {
                            if (f.pos.x>p.pos.x && f.pos.y>=minY && f.pos.y<=maxY && fsize.y>0)
                            {
                                screen.ctx.fillRect(dfov*splitsize-(fsize.x/2),ny,fsize.x,fsize.y);
                            }
                        }

                        if (p.dir=='w')
                        {
                            if (f.pos.x<p.pos.x && f.pos.y>=minY && f.pos.y<=maxY && fsize.y>0)
                            {
                                screen.ctx.fillRect(dfov*splitsize-(fsize.x/2),ny,fsize.x,fsize.y);
                            }
                        }
                    }

                    if (p.dir=='n' || p.dir=='s')
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
                        
                        if (p.dir=='n')
                        {
                            if (f.pos.y<p.pos.y && f.pos.x>=minX && f.pos.x<=maxX && fsize.y>0)
                            {
                                screen.ctx.fillRect(dfov*splitsize-(fsize.x/2),ny,fsize.x,fsize.y);
                            }
                        }

                        if (p.dir=='s')
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
        if (p.dir=='n') c.innerHTML='&#11032';
        if (p.dir=='s') c.innerHTML='&#11033';
        if (p.dir=='w') c.innerHTML='&#11031';
        if (p.dir=='e') c.innerHTML='&#11030';
    }
}

//CLASSES
class Island
{
    constructor(name,pos)
    {
        this.name=name;
        this.pos=pos;
        this.size={x:300, y:100};

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

//RUNTIME
screen.init();

new Ship('Plack Bearl', {x:1,y:5}, 'e');
new Island('Turtoga', {x:7,y:5});
new Island('Turtoga', {x:0,y:2});

screen.draw();


//KEYBOARD INPUT
document.addEventListener('keydown',e=>
{
    let p=world.ships[player];

    //move ship
    if (p.dir=='n')
    {
        if (e.key=='ArrowLeft') world.ships[player].pos.x--;
        if (e.key=='ArrowRight') world.ships[player].pos.x++;
        if (e.key=='ArrowUp') world.ships[player].pos.y--;
        if (e.key=='ArrowDown') world.ships[player].pos.y++;
    }

    if (p.dir=='s')
    {
        if (e.key=='ArrowLeft') world.ships[player].pos.x--;
        if (e.key=='ArrowRight') world.ships[player].pos.x++;
        if (e.key=='ArrowUp') world.ships[player].pos.y++;
        if (e.key=='ArrowDown') world.ships[player].pos.y--;
    }

    if (p.dir=='e')
    {
        if (e.key=='ArrowLeft') world.ships[player].pos.y--;
        if (e.key=='ArrowRight') world.ships[player].pos.y++;
        if (e.key=='ArrowUp') world.ships[player].pos.x++;
        if (e.key=='ArrowDown') world.ships[player].pos.x--;
    }

    if (p.dir=='w')
    {
        if (e.key=='ArrowLeft') world.ships[player].pos.y--;
        if (e.key=='ArrowRight') world.ships[player].pos.y++;
        if (e.key=='ArrowUp') world.ships[player].pos.x--;
        if (e.key=='ArrowDown') world.ships[player].pos.x++;
    }

    //rotate ship
    let rdir=['n','e','s','w'];

    if (e.key=='v')
    {
        if (dir<rdir.length-1) dir++;
        else dir=0;
        p.dir=rdir[dir];
    }

    if (e.key=='c')
    {
        if (dir>0) dir--;
        else dir=rdir.length-1;
        p.dir=rdir[dir];
    }

    //update screen
    screen.draw();
})