love.graphics.setDefaultFilter("nearest", "nearest")
local loadP8 = require("pico8")

local NP = 2

local W = 1700
local H = 900

local font1 = loadP8("font1.p8").createFont()
love.graphics.setFont(font1)

local map = loadP8("sarah/untitled.p8")
local scaletile = 4
love.window.setMode(W, H)
love.physics.setMeter(64)

-- local world = love.physics.newWorld(0, 0, true)
local world = love.physics.newWorld(0, 9.81 * 64, true)

local objects = {}

objects.tiles = {}

for y = 0, 63 do
  for x = 0, 127 do
    local spri = map.map[y][x]
    if spri ~= 0 then
      local spr = map.getOrMakeSpriteAt(spri)
      local tile = {}

      local w = scaletile * 8
      local h = scaletile * 8

      tile.body = love.physics.newBody(world, x * w + 100, y * h + 100, "dynamic")
      tile.shape = love.physics.newRectangleShape(w, h)
      tile.fixture = love.physics.newFixture(tile.body, tile.shape, 1)
      tile.spr = spr
      table.insert(objects.tiles, tile)
    end
  end
end

local ground = love.physics.newBody(world, 0, 0)
love.physics.newFixture(ground, love.physics.newEdgeShape(0, 0, W, 0))
love.physics.newFixture(ground, love.physics.newEdgeShape(0, H, W, H))
love.physics.newFixture(ground, love.physics.newEdgeShape(0, 0, 0, H))
love.physics.newFixture(ground, love.physics.newEdgeShape(W, 0, W, H))


objects.players = {}
objects.players[1] = {}
objects.players[2] = {}
objects.players[3] = {}

for i = 1, 3 do
  objects.players[i] = {}
  objects.players[i].body = love.physics.newBody(world, i * 50, 50, "dynamic")
  objects.players[i].shape = love.physics.newRectangleShape(8 * scaletile, 8 * scaletile)
  objects.players[i].fixture = love.physics.newFixture(objects.players[i].body, objects.players[i].shape, 1)
  objects.players[i].fixture:setRestitution(0.9)
end

objects.players[1].sprite = loadP8("sarah/untitled.p8").getOrMakeSpriteAt(1);
objects.players[2].sprite = loadP8("jane/janegame2.p8").getOrMakeSpriteAt(1);
objects.players[3].sprite = loadP8("bomberman.p8").getOrMakeSpriteAt(1);

love.graphics.setBackgroundColor(0.1, 0.1, 0.3)

function love.update(dt)
  world:update(dt)

  --- @type love.Joystick[]
  local joysticks = love.joystick.getJoysticks()

  for i = 1, NP do
    local x, y = joysticks[i]:getAxes()
    x = x or 0
    y = y or 0
    objects.players[i].body:applyForce(x * 300, y * 300)

    if joysticks[i]:isDown(1) then
      objects.players[i].body:applyForce(0, -1000)
    end
  end
end

function love.draw()
  love.graphics.setColor(1, 1, 1)

  for i = 1, NP do
    local body = objects.players[i].body
    -- local shape = objects.players[i].shape
    -- love.graphics.polygon("fill", body:getWorldPoints(shape:getPoints()))
    objects.players[i].sprite:draw(body:getX(), body:getY(), scaletile, body:getAngle(), 4)
  end

  -- love.graphics.setColor(0.50, 0.50, 0.50)
  -- love.graphics.polygon("fill", objects.block2.body:getWorldPoints(objects.block2.shape:getPoints()))

  for _, tile in pairs(objects.tiles) do
    -- love.graphics.polygon("fill", tile.body:getWorldPoints(tile.shape:getPoints()))
    tile.spr:draw(tile.body:getX(), tile.body:getY(), scaletile, tile.body:getAngle(), 4)
  end

  -- love.graphics.print("Hello\nWorld! a=b+1  c:d*2", 25, 205, 0, 2, 2)
end
