pico-8 cartridge // http://www.pico-8.com
version 16
__lua__

function _init()
	poke(0x5f2d, 1)
	n=18
	op=1
	ops={rotl,rotr,shl,shr,lshr}
	opnames={"rotl","rotr","shl","shr","lshr"}
end

function _update()
	local k = stat(31)
	if k then
		if k == "-" then
			n = -n
		elseif k == "\b" then
			n = tonum(sub(n,1,#tostr(n)-1)) or 0
		elseif k == " " then
			n = 0
		elseif tonum(k) then
			n = tonum(n..k)
		end
	end
	
	if btnp(❎) then
		n=ops[op](n,1)
	elseif btnp(⬅️) then
		op -= 1
		if (op==0) op=5
	elseif btnp(➡️) then
		op += 1
		if (op==6) op=1
	end
end

function _draw()
	cls(1)
	for i = 0,31 do
		local b = band(rotr(n,31-i),1)
		local x = (i%16)*5
		local y = flr(i/16)*7
		local c = 10
		if (b==0) c = 5
		print(b, x, y, c)
	end
	cursor(0,20)
	color(12)
	print(n)
	print(opnames[op])
end

