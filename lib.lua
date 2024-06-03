local function setScreenSize(w, h)
    local winw, winh = love.window.getMode()
    if winw ~= w or winh ~= h then
        love.window.setMode(w, h)
    end
end

return { setScreenSize = setScreenSize }
