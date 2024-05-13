if pcall(require, "lldebugger") then require("lldebugger").start() end
if pcall(require, "mobdebug") then require("mobdebug").start() end

local winw, winh = love.window.getMode()
if winw ~= 800 or winh ~= 600 then
  love.window.setMode(800, 600)
end

love.graphics.setDefaultFilter("nearest", "nearest")

local loadP8 = require("pico8")
local basics = loadP8("test2.p8")
-- local basics = loadP8("sarah/untitled.p8")

local font1 = loadP8("font1.p8").createFont()
love.graphics.setFont(font1)

function love.draw()
  love.graphics.clear()

  local mx, my = love.mouse.getPosition()
  local mapx = mx - (128 * 8 / 2)
  local mapy = my - (64 * 8 / 2)

  love.graphics.setColor(1, 1, 1)
  love.graphics.rectangle('line', mapx - 1, mapy - 1, 128 * 8 + 1, 64 * 8 + 1)

  for y = 0, 63 do
    for x = 0, 127 do
      local spri = basics.map[y][x]
      local spr = basics.getOrMakeSpriteAt(spri)
      spr:draw(mapx + x * 8, mapy + y * 8)
    end
  end

  basics.getOrMakeSpriteAt(0):draw(10 * 3, 10, 3)
  basics.getOrMakeSpriteAt(1):draw(20 * 3, 10, 3)
  basics.getOrMakeSpriteAt(2):draw(30 * 3, 10, 3)
  basics.getOrMakeSpriteAt(3):draw(40 * 3, 10, 3)
  basics.getOrMakeSpriteAt(17):draw(50 * 3, 10, 3)
  basics.getOrMakeSpriteAt(18):draw(60 * 3, 10, 3)
  basics.getOrMakeSpriteAt(19):draw(70 * 3, 10, 3)
  basics.getOrMakeSpriteAt(37):draw(80 * 3, 10, 3)
  basics.getOrMakeSpriteAt(4, 16, 16):draw(90 * 3, 10, 3)

  love.graphics.print("Hello\nWorld! a=b+1  c:d*2", 25, 205, 0, 5, 5)
end
