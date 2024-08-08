#pragma once

#include <SDL2/SDL.h>
#include "screen.h"
#include <map>

class Game {

	Screen screen;
	std::map<Sint32, SDL_Joystick*> gamepads;

	int ii = 0;
	bool quit = false;

	void setup();
	void loop();
	void processSdlEvents();
	void update(uint64_t delta);

public:

	Game();
	~Game();

	void start();

};
