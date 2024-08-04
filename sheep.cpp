#define SDL_MAIN_HANDLED


#include <SDL2/SDL.h>
//#include <fplus/fplus.hpp>

import crt;
import grid;
import std;


[[noreturn]] static void loop(SDL_Window* window) {
	SDL_Event event;
	while (true) {
		while (SDL_PollEvent(&event)) {
			if (event.type == SDL_CONTROLLERDEVICEADDED) {
				std::print("2testing {}", event.cdevice.which);
			}
			else if (event.type == SDL_KEYDOWN && event.key.keysym.sym == SDLK_ESCAPE || event.type == SDL_QUIT) {
				SDL_DestroyWindow(window);
				SDL_Quit();
				exit(0);
			}
		}
	}
}

class Foo {
public:
	void operator[](std::string s);
};

void Foo::operator[](std::string s) {
	std::print("testing: [{}]", s);
}

[[noreturn]] int main(int argc, char* args[]) {
	//Foo foo;
	//foo["bar"];

	//return 0;

	SDL_Init(SDL_INIT_VIDEO | SDL_INIT_GAMECONTROLLER);

	SDL_Window* window = SDL_CreateWindow("shepherdgame",
		SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
		320 * SCALE, 180 * SCALE,
		SDL_WINDOW_SHOWN);

	CRT* crt = new CRT(window);

	crt->pixels.clear();

	for (int y = 0; y < 160; y++) {
		int x = y;
		int i = y * 320 * 3 + x * 3;
		crt->pixels.get(x, y).r = 0xff;
		crt->pixels.get(x, y).g = 0x00;
		crt->pixels.get(x, y).b = 0x00;
	}

	crt->pixels.get(319, 179).r = 0x00;
	crt->pixels.get(319, 179).g = 0xff;
	crt->pixels.get(319, 179).b = 0x00;

	crt->blit();

	loop(window);
}
