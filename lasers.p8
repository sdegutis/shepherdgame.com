pico-8 cartridge // http://www.pico-8.com
version 18
__lua__
local x = 0
local y = 64
local w = 30

function _draw()
	cls(13)
	for i = 0, w do
		local wavelength = 10
		local cx = x + i
		local per = cx / 128
		local h = 2
		local r = cos(per*wavelength)*h
		pset(x+i, y+r, 10)
		pset(x+i, y+r-2, 10)
		pset(x+i, y+r+2, 10)
	end
end

function _update()
	x += 1
end

