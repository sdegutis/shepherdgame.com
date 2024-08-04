export module crt;

#include <SDL2/SDL.h>

import grid;

export constexpr auto SCALE = 5;

export class CRT {

public:

	CRT(SDL_Window* window);
	void blit();

	grid pixels;

private:

	SDL_Window* window;
	SDL_Surface* screenSurface;
	SDL_PixelFormat* pixelFormat;
	Uint32* surfacePixels;

};

CRT::CRT(SDL_Window* window) :
	window(window),
	screenSurface(SDL_GetWindowSurface(window)),
	pixelFormat(screenSurface->format),
	surfacePixels(static_cast<Uint32*>(screenSurface->pixels))
{}

void CRT::blit() {
	for (int y = 0; y < 180; y++) {
		for (int x = 0; x < 320; x++) {
			int r = pixels.get(x, y).r;
			int g = pixels.get(x, y).g;
			int b = pixels.get(x, y).b;
			int c = SDL_MapRGB(pixelFormat, r, g, b);

			for (int z = 0; z < SCALE; z++) {
				std::fill_n(surfacePixels + (y * 320 * (SCALE * SCALE) + (z * 320 * SCALE) + x * SCALE), SCALE, c);
			}
		}
	}
	SDL_UpdateWindowSurface(window);
}
