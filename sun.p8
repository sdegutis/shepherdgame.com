pico-8 cartridge // http://www.pico-8.com
version 16
__lua__
t=0

function _update()
	t+=1
	t%=30*5
end

function _draw()
	cls()
	
	local x = 64-cos(t/30/5)*40
	local y = 64+sin(t/30/5)*40
	
	circ(64,64,40,5)
	circfill(64,64,20,10)--sun
	circfill(x-1,y-1,7,3)
	circfill(x,y,7,1)
end

