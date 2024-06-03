love.graphics.setDefaultFilter("nearest", "nearest")
local loadP8 = require("pico8")

function love.load()
  love.physics.setMeter(64)
  world = love.physics.newWorld(0, 9.81 * 64, true)
  -- world = love.physics.newWorld(0, 0, true)

  objects = {}

  objects.ground1 = {}
  objects.ground1.body = love.physics.newBody(world, 650 / 2, 650 - 50 / 2)
  objects.ground1.shape = love.physics.newRectangleShape(650, 25)
  objects.ground1.fixture = love.physics.newFixture(objects.ground1.body, objects.ground1.shape)

  objects.ground2 = {}
  objects.ground2.body = love.physics.newBody(world, 650 / 2, 50 / 2 + 50)
  objects.ground2.shape = love.physics.newRectangleShape(650, 25)
  objects.ground2.fixture = love.physics.newFixture(objects.ground2.body, objects.ground2.shape)

  objects.ground3 = {}
  objects.ground3.body = love.physics.newBody(world, 50 / 2, 650 / 2)
  objects.ground3.shape = love.physics.newRectangleShape(25, 650)
  objects.ground3.fixture = love.physics.newFixture(objects.ground3.body, objects.ground3.shape)

  objects.ground4 = {}
  objects.ground4.body = love.physics.newBody(world, 650 - 50 / 2, 650 / 2)
  objects.ground4.shape = love.physics.newRectangleShape(25, 650)
  objects.ground4.fixture = love.physics.newFixture(objects.ground4.body, objects.ground4.shape)

  objects.players = {}
  objects.players[1] = {}
  objects.players[2] = {}
  objects.players[3] = {}

  for i = 1, 3 do
    objects.players[i] = {}
    objects.players[i].body = love.physics.newBody(world, 650 / 2 + i * 50, 650 / 2, "dynamic")
    objects.players[i].shape = love.physics.newCircleShape(20)
    objects.players[i].fixture = love.physics.newFixture(objects.players[i].body, objects.players[i].shape, 1)
    objects.players[i].fixture:setRestitution(0.9)
    objects.players[i].points = 0
  end

  objects.players[1].sprite = loadP8("sarah/untitled.p8").getOrMakeSpriteAt(1);
  objects.players[2].sprite = loadP8("jane/janegame2.p8").getOrMakeSpriteAt(1);
  objects.players[3].sprite = loadP8("bomberman.p8").getOrMakeSpriteAt(1);

  objects.block1 = {}
  objects.block1.body = love.physics.newBody(world, 200, 550, "dynamic")
  objects.block1.shape = love.physics.newRectangleShape(0, 0, 50, 100)
  objects.block1.fixture = love.physics.newFixture(objects.block1.body, objects.block1.shape, 5)

  objects.block2 = {}
  objects.block2.body = love.physics.newBody(world, 200, 400, "dynamic")
  objects.block2.shape = love.physics.newRectangleShape(0, 0, 100, 50)
  objects.block2.fixture = love.physics.newFixture(objects.block2.body, objects.block2.shape, 2)

  love.graphics.setBackgroundColor(0.41, 0.53, 0.97)
  love.window.setMode(650, 650)

  world:setCallbacks(function(fix1, fix2)
    for i = 1, 3 do
      if
          fix2 == objects.players[i].fixture
          and
          fix1 == objects.ground2.fixture
      then
        local p  = objects.players[i]
        p.points = p.points + 1
      end
    end
  end, function() end)
end

function love.update(dt)
  world:update(dt)

  --- @type love.Joystick[]
  local joysticks = love.joystick.getJoysticks()

  for i = 1, 3 do
    local x, y = joysticks[i]:getAxes()
    x = x or 0
    y = y or 0
    objects.players[i].body:applyForce(x * 300, y * 100)
  end
end

function love.draw()
  love.graphics.setColor(0.2, 0.2, 0.2)
  love.graphics.polygon("fill", objects.ground1.body:getWorldPoints(objects.ground1.shape:getPoints()))
  love.graphics.polygon("fill", objects.ground2.body:getWorldPoints(objects.ground2.shape:getPoints()))
  love.graphics.polygon("fill", objects.ground3.body:getWorldPoints(objects.ground3.shape:getPoints()))
  love.graphics.polygon("fill", objects.ground4.body:getWorldPoints(objects.ground4.shape:getPoints()))

  for i = 1, 3 do
    -- love.graphics.setColor(0.76, 0.25 * i, 0.05)
    -- love.graphics.circle("fill", objects.players[i].body:getX(), objects.players[i].body:getY(),
    --   objects.players[i].shape:getRadius())

    love.graphics.setColor(1, 1, 1)
    local body = objects.players[i].body
    objects.players[i].sprite:draw(body:getX(), body:getY(), 5, body:getAngle(), 3.75)

    local x = 100 * i + 30 * i
    love.graphics.setColor(0.2, 0.2, 0.5)
    love.graphics.rectangle('fill', x, 20, 100, 20)

    love.graphics.setColor(0.8, 0.8, 1.0)
    love.graphics.rectangle('fill', x, 20, objects.players[i].points, 20)
  end

  love.graphics.setColor(0.50, 0.50, 0.50)
  love.graphics.polygon("fill", objects.block1.body:getWorldPoints(objects.block1.shape:getPoints()))
  love.graphics.polygon("fill", objects.block2.body:getWorldPoints(objects.block2.shape:getPoints()))
end

-- if pcall(require, "lldebugger") then require("lldebugger").start() end
-- if pcall(require, "mobdebug") then require("mobdebug").start() end

-- local lib = require('lib')

-- lib.setScreenSize(1000, 1000)


-- local font1 = loadP8("font1.p8").createFont()
-- love.graphics.setFont(font1)

-- -- basics.map

-- local world, body1, shape1, fixture1, body2, shape2, fixture2

-- function love.load()
--   love.physics.setMeter(64)
--   world = love.physics.newWorld(0, 0, true)

--   body1 = love.physics.newBody(world, 200, 200, "dynamic")
--   shape1 = love.physics.newCircleShape(20)
--   fixture1 = love.physics.newFixture(body1, shape1, 1)
--   body1:setLinearDamping(10.0)
--   body1:setAngularDamping(3)
--   fixture1:setRestitution(0.9)

--   body2 = love.physics.newBody(world, 400, 400, "dynamic")
--   shape2 = love.physics.newCircleShape(20)
--   fixture2 = love.physics.newFixture(body2, shape2, 1)
--   body2:setLinearDamping(10.0)
--   body2:setAngularDamping(3)
--   fixture2:setRestitution(0.9)

--   wallBody1 = love.physics.newBody(world, 650 / 2, 650 - 50 / 2)
--   wallShape1 = love.physics.newRectangleShape(2200, 50)
--   wallFixture1 = love.physics.newFixture(wallBody1, wallShape1)
-- end

-- function love.update(dt)
--   world:update(dt)
--   if love.keyboard.isDown('space') then
--     body1:applyTorque(10)
--     local r = body1:getAngle()
--     local x = math.cos(r)
--     local y = math.sin(r)
--     local d = 4000
--     body1:applyForce(x * d, y * d)
--   end
--   if love.keyboard.isDown('left') then
--     body1:applyAngularImpulse(-10)
--   elseif love.keyboard.isDown('right') then
--     body1:applyAngularImpulse(10)
--   end
-- end

-- function love.draw()
--   -- love.graphics.setColor(0, 0, 1)
--   -- love.graphics.circle('fill', body1:getX(), body1:getY(), 20)

--   love.graphics.setColor(1, 1, 1)
--   basics.getOrMakeSpriteAt(33):draw(body1:getX(), body1:getY(), 5, body1:getAngle(), 3.75)
--   basics.getOrMakeSpriteAt(17):draw(body2:getX(), body2:getY(), 5, body2:getAngle(), 3.75)

--   love.graphics.setColor(0.20, 0.20, 0.20)
--   love.graphics.polygon("fill", wallBody1:getWorldPoints(wallShape1:getPoints()))


--   -- love.graphics.print("Hello\nWorld! a=b+1  c:d*2", 25, 205, 0, 5, 5)
-- end
