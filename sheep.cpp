#define SDL_MAIN_HANDLED

#include <SDL2/SDL.h>
#include <stdio.h>
#include <algorithm>
#include <fplus/fplus.hpp>
#include <fmt/core.h>

constexpr auto SCALE = 5;



class pixel {

public:

	int r = 0, g = 0, b = 0;

	void reset();

};

void pixel::reset() {
	r = 0;
	g = 0;
	b = 0;
}




class grid {

	std::array<pixel, 320 * 180> pixels;

public:

	void clear();

	pixel& get(unsigned long long x, unsigned long long y);

};

void grid::clear() {
	for (auto& pixel : pixels) {
		pixel.reset();
	}
}

pixel& grid::get(unsigned long long x, unsigned long long y) {
	return pixels[y * 320 + x];
}



class crt {

public:

	crt(SDL_Window* window);
	void blit();

	grid pixels;

private:

	SDL_Window* window;
	SDL_Surface* screenSurface;
	SDL_PixelFormat* pixelFormat;
	Uint32* surfacePixels;

};

crt::crt(SDL_Window* window) :
	window(window),
	screenSurface(SDL_GetWindowSurface(window)),
	pixelFormat(screenSurface->format),
	surfacePixels(static_cast<Uint32*>(screenSurface->pixels))
{}

void crt::blit() {
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

[[noreturn]] static void loop(SDL_Window* window) {
	SDL_Event event;
	while (true) {
		while (SDL_PollEvent(&event)) {
			if (event.type == SDL_CONTROLLERDEVICEADDED) {
				fmt::print("2testing {}", event.cdevice.which);
			}
			else if (event.type == SDL_KEYDOWN && event.key.keysym.sym == SDLK_ESCAPE || event.type == SDL_QUIT) {
				SDL_DestroyWindow(window);
				SDL_Quit();
				exit(0);
			}
		}
	}
}

[[noreturn]] int main(int argc, char* args[]) {
	SDL_Init(SDL_INIT_VIDEO | SDL_INIT_GAMECONTROLLER);

	SDL_Window* window = SDL_CreateWindow("shepherdgame",
		SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
		320 * SCALE, 180 * SCALE,
		SDL_WINDOW_SHOWN);

	crt crt(window);

	crt.pixels.clear();

	for (int y = 0; y < 160; y++) {
		int x = y;
		int i = y * 320 * 3 + x * 3;
		crt.pixels.get(x, y).r = 0xff;
		crt.pixels.get(x, y).g = 0x00;
		crt.pixels.get(x, y).b = 0x00;
	}

	crt.pixels.get(319, 179).r = 0x00;
	crt.pixels.get(319, 179).g = 0xff;
	crt.pixels.get(319, 179).b = 0x00;

	crt.blit();

	loop(window);
}
