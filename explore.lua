love.graphics.setDefaultFilter("nearest", "nearest")

local p8 = require("lib/pico8")

local font1 = p8.load("lib/font1.p8").createFont()
love.graphics.setFont(font1)

local map1 = p8.load('explore.p8')

local SCALE = 3

--- @interface Entity

local entities = {}
local players = {}

for y = 0, 63 do
  for x = 0, 127 do
    local spri = map1.map[y][x]
    if spri ~= 0 then
      local spr = map1.getOrMakeSpriteAt(spri)

      local e = {
        spr = spr,
        x = x * 8 * SCALE,
        y = y * 8 * SCALE,
      }

      if spr.flags[p8.colors.GREEN] then
        table.insert(players, e)
      else
        table.insert(entities, e)
      end
    end
  end
end

---@diagnostic disable-next-line: duplicate-set-field
function love.update()
  local joysticks = love.joystick.getJoysticks()
  for i = 1, #joysticks do
    --- @type love.Joystick
    local joystick = joysticks[i]
    local player = players[i]

    local x, y = joystick:getAxes()
    player.x = player.x + x
    player.y = player.y + y

    if joystick:isDown(1) then
      joystick:setVibration(.01, .01, 0.01)
    end
  end
end

---@diagnostic disable-next-line: duplicate-set-field
function love.draw()
  for i = 1, #entities do
    local e = entities[i]

    --- @type Sprite
    local spr = e.spr
    spr:draw(e.x, e.y, SCALE)
  end
  for i = 1, #players do
    local e = players[i]

    --- @type Sprite
    local spr = e.spr
    spr:draw(e.x, e.y, SCALE)
  end
end
