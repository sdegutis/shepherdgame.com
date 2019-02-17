pico-8 cartridge // http://www.pico-8.com
version 16
__lua__
r = 9
showlines=false
m=4

function _draw()
 cls()
 print(r)
 rrect(20,40,80,80,r)
end

function _update()
	if (btn(⬅️)) r-=1
	if (btn(➡️)) r+=1
	if (btnp(❎)) showlines = not showlines
	if (btnp(🅾️)) then
		if m==1 then m=4 else m=1 end
	end
end

function round(n)
	if n + 0.5 >= ceil(n) then
		return ceil(n)
	else
		return flr(n)
	end
end

function drawcorner(c,x,y,r,dx,dy)
	r = abs(r)
 for n = 0,r*2*m do
 	local px = x+sin(n/(r*8)+dx)*r
 	local py = y-cos(n/(r*8)+dy)*r
 	px=round(px)
 	py=round(py)
 	pset(px,py,c)
	end
end

function rrect(x,y,w,h,r)
	local x1 = x
	local x2 = x+w-1
	local y1 = y
	local y2 = y+h-1
	
	color(5)
	if showlines then
 	line(x1+r,y1,x2-r,y1)
 	line(x1+r,y2,x2-r,y2)
 	line(x1,y1+r,x1,y2-r)
 	line(x2,y1+r,x2,y2-r)
	end
	
 drawcorner(1,x1+r,y1+r,r,0,0)
 drawcorner(2,x2-r,y1+r,r,0.5,0)
 drawcorner(3,x1+r,y2-r,r,0,0.5)
 drawcorner(4,x2-r,y2-r,r,0.5,0.5)
end

