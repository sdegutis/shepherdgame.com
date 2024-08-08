#include "screen.h"

Screen::Screen() :
	window(
		SDL_CreateWindow("shepherdgame",
			SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
			WIDTH* SCALE, HEIGHT* SCALE,
			SDL_WINDOW_SHOWN)
	),
	screenSurface(SDL_GetWindowSurface(window)),
	pixelFormat(screenSurface->format),
	surfacePixels(static_cast<Uint32*>(screenSurface->pixels))
{}

Screen::~Screen() {
	SDL_DestroyWindow(window);
}

void Screen::blit() {
	for (int y = 0; y < HEIGHT; y++) {
		for (int x = 0; x < WIDTH; x++) {
			auto& p = pixels.get(x, y);
			int c = SDL_MapRGB(pixelFormat, p.r, p.g, p.b);

			for (int z = 0; z < SCALE; z++) {
				std::fill_n(surfacePixels + (y * WIDTH * (SCALE * SCALE) + (z * WIDTH * SCALE) + x * SCALE), SCALE, c);
			}
		}
	}
	SDL_UpdateWindowSurface(window);
}
