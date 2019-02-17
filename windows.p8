pico-8 cartridge // http://www.pico-8.com
version 16
__lua__
x=64
y=64
r=20
t=0

function _draw()
	cls(1)
	
	local a = t % 30 / 30
	
	for i = 1,4 do
		local a1 = a + 0.1*i*((cos(a+i*0.1)+1)/2) + 0.15
 	local x1 = x - cos(a1) * r
 	local y1 = y + sin(a1) * r
 	
 	circfill(x1,y1,2,10+i)
	end
end

function _update()
	t+=1
end

