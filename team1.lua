love.graphics.setDefaultFilter("nearest", "nearest")

local loadP8 = require("lib/pico8")

local font1 = loadP8("lib/font1.p8").createFont()
love.graphics.setFont(font1)

---@diagnostic disable-next-line: duplicate-set-field
function love.load()
  -- --- @type love.Joystick
  -- local joystick = love.joystick.getJoysticks()[1]

  -- joystick:setVibration(1, 1, 1)
end

---@diagnostic disable-next-line: duplicate-set-field
function love.draw()
  love.graphics.print("function _draw()\n  map()\nend", 25, 205, 0, 3, 3)
end
