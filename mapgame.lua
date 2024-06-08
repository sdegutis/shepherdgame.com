love.graphics.setDefaultFilter("nearest", "nearest")
local loadP8 = require("pico8")

local W = 1700
local H = 900

local font1 = loadP8("font1.p8").createFont()
love.graphics.setFont(font1)

local map = loadP8("test3.p8")
local scaletile = 4
love.window.setMode(W, H)
love.physics.setMeter(64)
-- love.graphics.setBackgroundColor(0.1, 0.1, 0.3)

local gravity = false
local world = love.physics.newWorld(0, (gravity and 9.81 or 0) * 64, true)

local objects = {}
objects.players = {}
objects.tiles = {}

RED = 0
ORANGE = 1
YELLOW = 2
GREEN = 3
BLUE = 4
PURPLE = 5
PINK = 6
PEACH = 7

for y = 0, 63 do
  for x = 0, 127 do
    local spri = map.map[y][x]
    if spri ~= 0 then
      local spr = map.getOrMakeSpriteAt(spri)
      local tile = {}

      local scale = 1

      tile.scaletile = scaletile
      if spr.flags[GREEN] then scale = 2 end
      tile.scaletile = tile.scaletile * scale

      local w = tile.scaletile * 8
      local h = tile.scaletile * 8

      local px = x * (w / scale) + 100
      local py = y * (h / scale) + 100

      tile.body = love.physics.newBody(world, px, py, spr.flags[RED] and "static" or "dynamic")

      if spr.flags[ORANGE] then
        tile.shape = love.physics.newCircleShape(w / 2)
      else
        tile.shape = love.physics.newRectangleShape(w, h)
      end

      tile.fixture = love.physics.newFixture(tile.body, tile.shape, spr.flags[YELLOW] and 1 or 5)
      tile.spr = spr
      table.insert(objects.tiles, tile)

      if spr.flags[GREEN] then
        tile.fixture:setRestitution(0.9)
        table.insert(objects.players, tile)
      end
    end
  end
end

local ground = love.physics.newBody(world, 0, 0)
love.physics.newFixture(ground, love.physics.newEdgeShape(0, 0, W, 0))
love.physics.newFixture(ground, love.physics.newEdgeShape(0, H, W, H))
love.physics.newFixture(ground, love.physics.newEdgeShape(0, 0, 0, H))
love.physics.newFixture(ground, love.physics.newEdgeShape(W, 0, W, H))

function love.update(dt)
  world:update(dt)

  --- @type love.Joystick[]
  local joysticks = love.joystick.getJoysticks()

  for i = 1, love.joystick.getJoystickCount() do
    local x, y = joysticks[i]:getAxes()
    x = x or 0
    y = y or 0

    local force = 100
    if joysticks[i]:isDown(1) then
      force = force * 10
    end

    objects.players[i].body:applyForce(x * force, y * force)
  end
end

function love.draw()
  love.graphics.setColor(1, 1, 1)

  for _, tile in pairs(objects.tiles) do
    tile.spr:draw(tile.body:getX(), tile.body:getY(), tile.scaletile, tile.body:getAngle(), 4)
  end

  -- love.graphics.print("Hello\nWorld! a=b+1  c:d*2", 25, 205, 0, 2, 2)
end
