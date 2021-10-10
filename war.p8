pico-8 cartridge // http://www.pico-8.com
version 18
__lua__
cx=0
cy=0

minimap = true

poke(0x5f2d,1)

function _update()
	if (btn(⬅️)) cx-=10
	if (btn(➡️)) cx+=10
	if (btn(⬇️)) cy+=10
	if (btn(⬆️)) cy-=10
	cx = mid(0,128,cx)
	cy = mid(0,128,cy)
end

function _draw()
	cls()
 camera(cx,cy)
	map()
 camera()
	
 local mx =	stat(32)
 local my = stat(33)
 
 if minimap then
 	rectfill(2,2,18+16,18+16, 13)
 	rect(1,1,19+16,19+16, 7)
 	local x = 5
 	local y = 3
 	pset(x+2, y+2, 1)
 end
	
 spr(1, mx, my)
 
end

-->8
-----------------------------------------------
---simplex noise
-- original java source: http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
-- (most) original comments included
-----------------------------------------------

local math = {pi = 3.14159265358979}
local ipairs = function(t)
	-- do ( re-define ipairs? )
end

simplex = {}

simplex.dir_x = 0
simplex.dir_y = 1
simplex.dir_z = 2
simplex.dir_w = 3
simplex.internalcache = false


local gradients3d = {{1,1,0},{-1,1,0},{1,-1,0},{-1,-1,0},
{1,0,1},{-1,0,1},{1,0,-1},{-1,0,-1},
{0,1,1},{0,-1,1},{0,1,-1},{0,-1,-1}};
local gradients4d = {{0,1,1,1}, {0,1,1,-1}, {0,1,-1,1}, {0,1,-1,-1},
{0,-1,1,1}, {0,-1,1,-1}, {0,-1,-1,1}, {0,-1,-1,-1},
{1,0,1,1}, {1,0,1,-1}, {1,0,-1,1}, {1,0,-1,-1},
{-1,0,1,1}, {-1,0,1,-1}, {-1,0,-1,1}, {-1,0,-1,-1},
{1,1,0,1}, {1,1,0,-1}, {1,-1,0,1}, {1,-1,0,-1},
{-1,1,0,1}, {-1,1,0,-1}, {-1,-1,0,1}, {-1,-1,0,-1},
{1,1,1,0}, {1,1,-1,0}, {1,-1,1,0}, {1,-1,-1,0},
{-1,1,1,0}, {-1,1,-1,0}, {-1,-1,1,0}, {-1,-1,-1,0}};
local p = {151,160,137,91,90,15,
131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180};

-- to remove the need for index wrapping, double the permutation table length

for i=1,#p do
	p[i-1] = p[i]
	p[i] = nil
end

for i=1,#gradients3d do
	gradients3d[i-1] = gradients3d[i]
	gradients3d[i] = nil
end

for i=1,#gradients4d do
	gradients4d[i-1] = gradients4d[i]
	gradients4d[i] = nil
end

local perm = {}

for i=0,255 do
	perm[i] = p[i]
	perm[i+256] = p[i]
end

-- a lookup table to traverse the sim around a given point in 4d.
-- details can be found where this table is used, in the 4d noise method.

local sim = {
{0,1,2,3},{0,1,3,2},{0,0,0,0},{0,2,3,1},{0,0,0,0},{0,0,0,0},{0,0,0,0},{1,2,3,0},
{0,2,1,3},{0,0,0,0},{0,3,1,2},{0,3,2,1},{0,0,0,0},{0,0,0,0},{0,0,0,0},{1,3,2,0},
{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},
{1,2,0,3},{0,0,0,0},{1,3,0,2},{0,0,0,0},{0,0,0,0},{0,0,0,0},{2,3,0,1},{2,3,1,0},
{1,0,2,3},{1,0,3,2},{0,0,0,0},{0,0,0,0},{0,0,0,0},{2,0,3,1},{0,0,0,0},{2,1,3,0},
{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0},
{2,0,1,3},{0,0,0,0},{0,0,0,0},{0,0,0,0},{3,0,1,2},{3,0,2,1},{0,0,0,0},{3,1,2,0},
{2,1,0,3},{0,0,0,0},{0,0,0,0},{0,0,0,0},{3,1,0,2},{0,0,0,0},{3,2,0,1},{3,2,1,0}};

local function dot2d(tbl, x, y)
	return tbl[1]*x + tbl[2]*y; 
end

local function dot3d(tbl, x, y, z)
	return tbl[1]*x + tbl[2]*y + tbl[3]*z
end

local function dot4d( tbl, x,y,z,w) 
	return tbl[1]*x + tbl[2]*y + tbl[3]*z + tbl[3]*w;
end

local prev2d = {}


-- 2d simplex noise

function simplex.noise2d(xin, yin)
	if simplex.internalcache and prev2d[xin] and prev2d[xin][yin] then return prev2d[xin][yin] end 

	local n0, n1, n2; -- noise contributions from the three corners
	-- skew the input space to determine which simplex cell we're in
	local f2 = 0.5*(sqrt(3.0)-1.0);
	local s = (xin+yin)*f2; -- hairy factor for 2d
	local i = flr(xin+s);
	local j = flr(yin+s);
	local g2 = (3.0-sqrt(3.0))/6.0;
	
	local t = (i+j)*g2;
	local x0 = i-t; -- unskew the cell origin back to (x,y) space
	local y0 = j-t;
	local x0 = xin-x0; -- the x,y distances from the cell origin
	local y0 = yin-y0;
	
	-- for the 2d case, the simplex shape is an equilateral triangle.
	-- determine which simplex we are in.
	local i1, j1; -- offsets for second (middle) corner of simplex in (i,j) coords
	if(x0>y0) then 
		i1=1 
		j1=0  -- lower triangle, xy order: (0,0)->(1,0)->(1,1)
	else
		i1=0
		j1=1 -- upper triangle, yx order: (0,0)->(0,1)->(1,1)
	end
	
	-- a step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	-- a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	-- c = (3-sqrt(3))/6

	local x1 = x0 - i1 + g2; -- offsets for middle corner in (x,y) unskewed coords
	local y1 = y0 - j1 + g2;
	local x2 = x0 - 1.0 + 2.0 * g2; -- offsets for last corner in (x,y) unskewed coords
	local y2 = y0 - 1.0 + 2.0 * g2;

	-- work out the hashed gradient indices of the three simplex corners
	local ii = band(i , 255)
	local jj = band(j , 255)
	local gi0 = perm[ii+perm[jj]] % 12;
	local gi1 = perm[ii+i1+perm[jj+j1]] % 12;
	local gi2 = perm[ii+1+perm[jj+1]] % 12;

	-- calculate the contribution from the three corners
	local t0 = 0.5 - x0*x0-y0*y0;
	if t0<0 then 
		n0 = 0.0;
	else
		t0 = t0 * t0
		n0 = t0 * t0 * dot2d(gradients3d[gi0], x0, y0); -- (x,y) of gradients3d used for 2d gradient
	end
	
	local t1 = 0.5 - x1*x1-y1*y1;
	if (t1<0) then
		n1 = 0.0;
	else
		t1 = t1*t1
		n1 = t1 * t1 * dot2d(gradients3d[gi1], x1, y1);
	end
	
	local t2 = 0.5 - x2*x2-y2*y2;
	if (t2<0) then
		n2 = 0.0;
	else
		t2 = t2*t2
		n2 = t2 * t2 * dot2d(gradients3d[gi2], x2, y2);
	end

	
	-- add contributions from each corner to get the final noise value.
	-- the result is scaled to return values in the localerval [-1,1].
	
	local retval = 70.0 * (n0 + n1 + n2)
	
	if simplex.internalcache then
		if not prev2d[xin] then prev2d[xin] = {} end
		prev2d[xin][yin] = retval
	end
	
	return retval;
end

local prev3d = {}

-- 3d simplex noise
function simplex.noise3d(xin, yin, zin)
	
	if simplex.internalcache and prev3d[xin] and prev3d[xin][yin] and prev3d[xin][yin][zin] then return prev3d[xin][yin][zin] end
	
	local n0, n1, n2, n3; -- noise contributions from the four corners
	
	-- skew the input space to determine which simplex cell we're in
	local f3 = 1.0/3.0;
	local s = (xin+yin+zin)*f3; -- very nice and simple skew factor for 3d
	local i = flr(xin+s);
	local j = flr(yin+s);
	local k = flr(zin+s);
	
	local g3 = 1.0/6.0; -- very nice and simple unskew factor, too
	local t = (i+j+k)*g3;
	
	local x0 = i-t; -- unskew the cell origin back to (x,y,z) space
	local y0 = j-t;
	local z0 = k-t;
	
	local x0 = xin-x0; -- the x,y,z distances from the cell origin
	local y0 = yin-y0;
	local z0 = zin-z0;
	
	-- for the 3d case, the simplex shape is a slightly irregular tetrahedron.
	-- determine which simplex we are in.
	local i1, j1, k1; -- offsets for second corner of simplex in (i,j,k) coords
	local i2, j2, k2; -- offsets for third corner of simplex in (i,j,k) coords
	
	if (x0>=y0) then
		if (y0>=z0) then
			i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; -- x y z order
		elseif (x0>=z0) then
			i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; -- x z y order
		else 
			i1=0; j1=0; k1=1; i2=1; j2=0; k2=1;  -- z x y order
		end
	else -- x0<y0
		if (y0<z0) then 
			i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; -- z y x order
		elseif (x0<z0) then 
			i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; -- y z x order
		else 
			i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; -- y x z order
		end
	end
	
	-- a step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
	-- a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
	-- a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
	-- c = 1/6.
	
	local x1 = x0 - i1 + g3; -- offsets for second corner in (x,y,z) coords
	local y1 = y0 - j1 + g3;
	local z1 = z0 - k1 + g3;
	
	local x2 = x0 - i2 + 2.0*g3; -- offsets for third corner in (x,y,z) coords
	local y2 = y0 - j2 + 2.0*g3;
	local z2 = z0 - k2 + 2.0*g3;
	
	local x3 = x0 - 1.0 + 3.0*g3; -- offsets for last corner in (x,y,z) coords
	local y3 = y0 - 1.0 + 3.0*g3;
	local z3 = z0 - 1.0 + 3.0*g3;
	
	-- work out the hashed gradient indices of the four simplex corners
	local ii = band(i , 255)
	local jj = band(j , 255)
	local kk = band(k , 255)
	
	local gi0 = perm[ii+perm[jj+perm[kk]]] % 12;
	local gi1 = perm[ii+i1+perm[jj+j1+perm[kk+k1]]] % 12;
	local gi2 = perm[ii+i2+perm[jj+j2+perm[kk+k2]]] % 12;
	local gi3 = perm[ii+1+perm[jj+1+perm[kk+1]]] % 12;
	
	-- calculate the contribution from the four corners
	local t0 = 0.5 - x0*x0 - y0*y0 - z0*z0;
	
	if (t0<0) then
		n0 = 0.0;
	else 
		t0 = t0*t0;
		n0 = t0 * t0 * dot3d(gradients3d[gi0], x0, y0, z0);
	end
	
	local t1 = 0.5 - x1*x1 - y1*y1 - z1*z1;
	
	if (t1<0) then 
		n1 = 0.0;
	else
		t1 = t1*t1;
		n1 = t1 * t1 * dot3d(gradients3d[gi1], x1, y1, z1);
	end
	
	local t2 = 0.5 - x2*x2 - y2*y2 - z2*z2;
	
	if (t2<0) then 
		n2 = 0.0;
	else
		t2 = t2*t2;
		n2 = t2 * t2 * dot3d(gradients3d[gi2], x2, y2, z2);
	end
	
	local t3 = 0.5 - x3*x3 - y3*y3 - z3*z3;
	
	if (t3<0) then 
		n3 = 0.0;
	else
		t3 = t3*t3;
		n3 = t3 * t3 * dot3d(gradients3d[gi3], x3, y3, z3);
	end
	
	
	-- add contributions from each corner to get the final noise value.
	-- the result is scaled to stay just inside [-1,1]
	local retval = 32.0*(n0 + n1 + n2 + n3)
	
	if simplex.internalcache then
		if not prev3d[xin] then prev3d[xin] = {} end
		if not prev3d[xin][yin] then prev3d[xin][yin] = {} end
		prev3d[xin][yin][zin] = retval
	end
	
	return retval;
end

local prev4d = {}

-- 4d simplex noise
function simplex.noise4d(x,y,z,w)

	if simplex.internalcache and prev4d[x] and prev4d[x][y] and prev4d[x][y][z] and prev4d[x][y][z][w] then return prev4d[x][y][z][w] end
	
	-- the skewing and unskewing factors are hairy again for the 4d case
	local f4 = (sqrt(5.0)-1.0)/4.0;
	local g4 = (5.0-sqrt(5.0))/20.0;
	local n0, n1, n2, n3, n4; -- noise contributions from the five corners
	-- skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
	local s = (x + y + z + w) * f4; -- factor for 4d skewing
	local i = flr(x + s);
	local j = flr(y + s);
	local k = flr(z + s);
	local l = flr(w + s);
	local t = (i + j + k + l) * g4; -- factor for 4d unskewing
	local x0 = i - t; -- unskew the cell origin back to (x,y,z,w) space
	local y0 = j - t;
	local z0 = k - t;
	local w0 = l - t;
	local x0 = x - x0; -- the x,y,z,w distances from the cell origin
	local y0 = y - y0;
	local z0 = z - z0;
	local w0 = w - w0;
	-- for the 4d case, the simplex is a 4d shape i won't even try to describe.
	-- to find out which of the 24 possible simplices we're in, we need to
	-- determine the magnitude ordering of x0, y0, z0 and w0.
	-- the method below is a good way of finding the ordering of x,y,z,w and
	-- then find the correct traversal order for the simplex we�re in.
	-- first, six pair-wise comparisons are performed between each possible pair
	-- of the four coordinates, and the results are used to add up binary bits
	-- for an localeger index.
	local c1 = (x0 > y0) and 32 or 1;
	local c2 = (x0 > z0) and 16 or 1;
	local c3 = (y0 > z0) and 8 or 1;
	local c4 = (x0 > w0) and 4 or 1;
	local c5 = (y0 > w0) and 2 or 1;
	local c6 = (z0 > w0) and 1 or 1;
	local c = c1 + c2 + c3 + c4 + c5 + c6;
	local i1, j1, k1, l1; -- the localeger offsets for the second simplex corner
	local i2, j2, k2, l2; -- the localeger offsets for the third simplex corner
	local i3, j3, k3, l3; -- the localeger offsets for the fourth simplex corner
	
	-- sim[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
	-- many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
	-- impossible. only the 24 indices which have non-zero entries make any sense.
	-- we use a thresholding to set the coordinates in turn from the largest magnitude.
	-- the number 3 in the "sim" array is at the position of the largest coordinate.
	
	i1 = sim[c][1]>=3 and 1 or 0;
	j1 = sim[c][2]>=3 and 1 or 0;
	k1 = sim[c][3]>=3 and 1 or 0;
	l1 = sim[c][4]>=3 and 1 or 0;
	-- the number 2 in the "sim" array is at the second largest coordinate.
	i2 = sim[c][1]>=2 and 1 or 0;
	j2 = sim[c][2]>=2 and 1 or 0;
	k2 = sim[c][3]>=2 and 1 or 0;
	l2 = sim[c][4]>=2 and 1 or 0;
	-- the number 1 in the "sim" array is at the second smallest coordinate.
	i3 = sim[c][1]>=1 and 1 or 0;
	j3 = sim[c][2]>=1 and 1 or 0;
	k3 = sim[c][3]>=1 and 1 or 0;
	l3 = sim[c][4]>=1 and 1 or 0;
	-- the fifth corner has all coordinate offsets = 1, so no need to look that up.
	local x1 = x0 - i1 + g4; -- offsets for second corner in (x,y,z,w) coords
	local y1 = y0 - j1 + g4;
	local z1 = z0 - k1 + g4;
	local w1 = w0 - l1 + g4;
	local x2 = x0 - i2 + 2.0*g4; -- offsets for third corner in (x,y,z,w) coords
	local y2 = y0 - j2 + 2.0*g4;
	local z2 = z0 - k2 + 2.0*g4;
	local w2 = w0 - l2 + 2.0*g4;
	local x3 = x0 - i3 + 3.0*g4; -- offsets for fourth corner in (x,y,z,w) coords
	local y3 = y0 - j3 + 3.0*g4;
	local z3 = z0 - k3 + 3.0*g4;
	local w3 = w0 - l3 + 3.0*g4;
	local x4 = x0 - 1.0 + 4.0*g4; -- offsets for last corner in (x,y,z,w) coords
	local y4 = y0 - 1.0 + 4.0*g4;
	local z4 = z0 - 1.0 + 4.0*g4;
	local w4 = w0 - 1.0 + 4.0*g4;
	
	-- work out the hashed gradient indices of the five simplex corners
	local ii = band(i , 255)
	local jj = band(j , 255)
	local kk = band(k , 255)
	local ll = band(l , 255)
	local gi0 = perm[ii+perm[jj+perm[kk+perm[ll]]]] % 32;
	local gi1 = perm[ii+i1+perm[jj+j1+perm[kk+k1+perm[ll+l1]]]] % 32;
	local gi2 = perm[ii+i2+perm[jj+j2+perm[kk+k2+perm[ll+l2]]]] % 32;
	local gi3 = perm[ii+i3+perm[jj+j3+perm[kk+k3+perm[ll+l3]]]] % 32;
	local gi4 = perm[ii+1+perm[jj+1+perm[kk+1+perm[ll+1]]]] % 32;
	
	
	-- calculate the contribution from the five corners
	local t0 = 0.5 - x0*x0 - y0*y0 - z0*z0 - w0*w0;
	if (t0<0) then
		n0 = 0.0;
	else
		t0 = t0*t0;
		n0 = t0 * t0 * dot4d(gradients4d[gi0], x0, y0, z0, w0);
	end
	
	local t1 = 0.5 - x1*x1 - y1*y1 - z1*z1 - w1*w1;
	if (t1<0) then
		n1 = 0.0;
	else 
		t1 = t1*t1;
		n1 = t1 * t1 * dot4d(gradients4d[gi1], x1, y1, z1, w1);
	end
	
	local t2 = 0.5 - x2*x2 - y2*y2 - z2*z2 - w2*w2;
	if (t2<0) then
		n2 = 0.0;
	else
		t2 = t2*t2;
		n2 = t2 * t2 * dot4d(gradients4d[gi2], x2, y2, z2, w2);
	end
	
	local t3 = 0.5 - x3*x3 - y3*y3 - z3*z3 - w3*w3;
	if (t3<0) then
		n3 = 0.0;
	else 
		t3 = t3*t3;
		n3 = t3 * t3 * dot4d(gradients4d[gi3], x3, y3, z3, w3);
	end
	
	local t4 = 0.5 - x4*x4 - y4*y4 - z4*z4 - w4*w4;
	if (t4<0) then
		n4 = 0.0;
	else
		t4 = t4*t4;
		n4 = t4 * t4 * dot4d(gradients4d[gi4], x4, y4, z4, w4);
	end
	
	-- sum up and scale the result to cover the range [-1,1]
	
	local retval = 27.0 * (n0 + n1 + n2 + n3 + n4)
	
	if simplex.internalcache then
		if not prev4d[x] then prev4d[x] = {} end
		if not prev4d[x][y] then prev4d[x][y] = {} end
		if not prev4d[x][y][z] then prev4d[x][y][z] = {} end
		prev4d[x][y][z][w] = retval
	end
	
	return retval;


end 

local e = 2.71828182845904523536

local prevblur2d = {}

function simplex.gblur2d(x,y,stddev)
	if simplex.internalcache and prevblur2d[x] and prevblur2d[x][y] and prevblur2d[x][y][stddev] then return prevblur2d[x][y][stddev] end
	local pwr = ((x^2+y^2)/(2*(stddev^2)))*-1
	local ret = (1/(2*math.pi*(stddev^2)))*(e^pwr)
	
	if simplex.internalcache then
		if not prevblur2d[x] then prevblur2d[x] = {} end
		if not prevblur2d[x][y] then prevblur2d[x][y] = {} end
		prevblur2d[x][y][stddev] = ret
	end
	return ret
end 

local prevblur1d = {}

function simplex.gblur1d(x,stddev)
	if simplex.internalcache and prevblur1d[x] and prevblur1d[x][stddev] then return prevblur1d[x][stddev] end
	local pwr = (x^2/(2*stddev^2))*-1
	local ret = (1/(sqrt(2*math.pi)*stddev))*(e^pwr)

	if simplex.internalcache then
		if not prevblur1d[x] then prevblur1d[x] = {} end
		prevblur1d[x][stddev] = ret
	end
	return ret
end

function simplex.fractalsum(func, iter, ...)
    local ret = func(...)
    for i=1,iter do
        local power = 2^iter
        local s = power/i
        
        local scaled = {}
        for elem in ipairs({...}) do
            add(scaled, elem*s)
        end
        ret = ret + (i/power)*(func(unpack(scaled)))
    end
    return ret
end

function simplex.fractalsumabs(func, iter, ...)
    local ret = abs(func(...))
    for i=1,iter do
        local power = 2^iter
        local s = power/i
        
        local scaled = {}
        for elem in ipairs({...}) do
            add(scaled, elem*s)
        end
        ret = ret + (i/power)*(abs(func(unpack(scaled))))
    end
    return ret
end

function simplex.turbulence(func, direction, iter, ...)
    local ret = abs(func(...))
    for i=1,iter do
        local power = 2^iter
        local s = power/i
        
        local scaled = {}
        for elem in ipairs({...}) do
            add(scaled, elem*s)
        end
        ret = ret + (i/power)*(abs(func(unpack(scaled))))
    end
    local args = {...}
    local dir_component = args[direction+1]
    return sin(dir_component+ret)
end

__gfx__
00000000000aa0003333333355555555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000aa0003333333355555555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700000aa0003333333355555555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000aaa00aaa3333333355555555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000aaa00aaa3333333355555555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700000aa0003333333355555555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000aa0003333333355555555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000aa0003333333355555555000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
__map__
0202020202020202020303020202020200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020202020302030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020202020303030303030200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202030302030303030303030200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020203030303030303020203030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020303030303020303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202030302020303030303020300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020202020203030302020300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020202020202020202020200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020202020202020202020200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020202020202020202020200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020202020202020202020200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020203020202020202020200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020202020202020202020200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0202020202020303020202020202020200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
