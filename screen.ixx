export module screen;

#include <SDL2/SDL.h>

import grid;

export constexpr auto SCALE = 5;

export class Screen {

	SDL_Window* window;
	SDL_Surface* screenSurface;
	SDL_PixelFormat* pixelFormat;
	Uint32* surfacePixels;

public:

	Screen() :
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

	~Screen() {
		SDL_DestroyWindow(window);
	}

	void blit() {
		for (int y = 0; y < HEIGHT; y++) {
			for (int x = 0; x < WIDTH; x++) {
				int r = pixels.get(x, y).r;
				int g = pixels.get(x, y).g;
				int b = pixels.get(x, y).b;
				int c = SDL_MapRGB(pixelFormat, r, g, b);

				for (int z = 0; z < SCALE; z++) {
					std::fill_n(surfacePixels + (y * WIDTH * (SCALE * SCALE) + (z * WIDTH * SCALE) + x * SCALE), SCALE, c);
				}
			}
		}
		SDL_UpdateWindowSurface(window);
	}

	Grid pixels;

};
