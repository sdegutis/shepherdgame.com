#pragma once

#include <SDL2/SDL.h>
#include "grid.h"

constexpr auto SCALE = 5;

class Screen {

	SDL_Window* window;
	SDL_Surface* screenSurface;
	SDL_PixelFormat* pixelFormat;
	Uint32* surfacePixels;

public:

	Grid pixels;

	Screen();
	~Screen();

	void blit();

};
