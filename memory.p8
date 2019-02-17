pico-8 cartridge // http://www.pico-8.com
version 16
__lua__

cls()
memset(0x6000, bor(240, 15), 64)

do return end

cls()
	
while true do
	local n = rnd(0x2000)
	local p = rnd(40)

	local mem = peek(0x6000 + n)
	mem = bor(mem, p)

	poke(0x6000 + n, p)
end
