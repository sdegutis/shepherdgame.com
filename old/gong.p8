pico-8 cartridge // http://www.pico-8.com
version 16
__lua__
function _init()
	players={}
	make_player(10,10)
	make_player(110,10)
	make_player(10,110)
end

function make_player(x,y)
	local p = {x=x,y=y,dx=0,dy=0}
	add(players,p)
end

vel = 0.25
maxvel = 2.5
friction = 0.9

function move(i,p,d,neg,pos)
	if abs(p[d]) > 0.05 then
		p[d] *= friction
	else
		p[d] = 0
	end
	
	if btn(neg,i-1) then
		p[d] = max(-maxvel, p[d]-vel)
	elseif btn(pos,i-1) then
		p[d] = min(maxvel, p[d]+vel)
	end
end

function keepinside(p,k,vk)
	if p[k] <= 1 then
		p[vk] = -p[vk] * 0.5
	elseif p[k]+8 >= 126 then
		p[vk] = -p[vk] * 0.5
	end
end

function _update()
	for i = 1,3 do
		local p = players[i]
		move(i,p,"dx",⬅️,➡️)
		move(i,p,"dy",⬆️,⬇️)
		p.x += p.dx
		p.y += p.dy
		
		keepinside(p,"x","dx")
		keepinside(p,"y","dy")
		
		for j = i,3 do
			if i != j then
				local op = players[j]
				if collide(p,op) then
					bounce(p)
					bounce(op)
				end
			end
		end
	end
end

function bounce(p)
	p.dx = -p.dx * 1
	p.dy = -p.dy * 1
end

function collide(a,b)
	local r = 4
	local x = abs(a.x-b.x)
	local y = abs(a.y-b.y)
	local c = sqrt(x*x+y*y)
	return c < 2*r
end

function _draw()
	cls()
	rect(0,0,127,127,1)
	for i = 1,3 do
		local p = players[i]
		spr(i, p.x, p.y)
	end
end

__gfx__
0000000000bbbb0000eeee0000cccc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000bbbbbb00eeeeee00cccccc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700bbbb3333eeee8888cccc1111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000bbb33333eee88888ccc11111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000bb333333ee888888cc111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700bb333333ee888888cc111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000b3333300e8888800c111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000003333000088880000111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
