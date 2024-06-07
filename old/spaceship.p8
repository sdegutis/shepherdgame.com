pico-8 cartridge // http://www.pico-8.com
version 18
__lua__
// angle
local a = 0
local x = 64
local y = 64
// lasers
local lasers = {}

function _draw()
	cls(1)
	print(#lasers)
	// ship
	drawship(x,y,a)
	// lasers
	for l in all(lasers) do
 	local dx = l.dx
 	local dy =	l.dy
--		local x3 = l.x - d2
		
		local x2 = dx*5
		local y2 = dy*5

		line(l.x,l.y,l.x+x2,l.y+y2,9)
	end
end

function drawship(x,y,a)
	
	--[
	local a2 = a + 160
	local a3 = a - 160
	
	local r = 12
	
	local x1 = -cos(a/360)*r + x
	local y1 =		sin(a/360)*r + y
	x1=x y1=y
	
	local x2 = -cos(a2/360)*r + x
	local y2 =		sin(a2/360)*r + y

	local x3 = -cos(a3/360)*r + x
	local y3 =		sin(a3/360)*r + y
	
	line(x1,y1,x2,y2,8)
	line(x2,y2,x3,y3,8)
	line(x3,y3,x1,y1,8)
	--]]
	
	--[[
	circ(x, y, 5, 10)
	local r2 = 7
	local x2 = -cos(a/360) * r2
	local y2 =		sin(a/360) * r2
	pset(x2 + x, y2 + y, 8)
	--]]
end

function _update()
	local r2 = 10
	local x2 = -cos(a/360) * r2
	local y2 =		sin(a/360) * r2
	if btn(⬆️) then
		x += x2 * 0.1
		y += y2 * 0.1
	end
	
	// move
	if (btn(⬅️)) a -= 4
	if (btn(➡️)) a += 4
	if (a < 0) a = 359
	a %= 360
	// lasers
	if btnp(❎) then
		make_laser(a, x, y)
	end
	
	for l in all(lasers) do
 	local x2 = l.dx
 	local y2 =	l.dy
 	l.x += x2 * 0.9
 	l.y += y2 * 0.9
 	if (l.x < 0) 		or
 				(l.x > 127) or
 				(l.y < 0) 		or
 				(l.y > 127) then
 		del(lasers, l)
 	end
	end
end

function make_laser(a,x,y,col)
	local l = {
		x = x,
		y = y,
		c = col,
		dx = -cos(a/360),
 	dy =		sin(a/360),
	}
	add(lasers, l)
end

--[[	line(-sin(d/360)*12+x1,
											cos(d/360)*12+y1,
										-sin(d+10/360)*12+x1,
											cos(d+10/360)*12+y1, 8)
--]]
