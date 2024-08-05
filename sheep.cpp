#define SDL_MAIN_HANDLED

#include <SDL2/SDL.h>

import screen;
import grid;
import std;

using namespace std;

void printthem() {
	print("num joysticks: {}\n", SDL_NumJoysticks());
	for (int i = 0; i < SDL_NumJoysticks(); i++) {
		::printf("%d: %d\n", i, SDL_IsGameController(i));
	}
	print("\n");
}

int main(int argc, char* args[]) {
	SDL_Init(SDL_INIT_VIDEO | SDL_INIT_GAMECONTROLLER);

	SDL_Window* window = SDL_CreateWindow("shepherdgame",
		SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
		320 * SCALE, 180 * SCALE,
		SDL_WINDOW_SHOWN);

	Screen* screen = new Screen(window);

	for (int y = 0; y < 160; y++) {
		int x = y;
		int i = y * 320 * 3 + x * 3;
		screen->pixels.get(x, y).r = 0xff;
		screen->pixels.get(x, y).g = 0x00;
		screen->pixels.get(x, y).b = 0x00;
	}

	screen->pixels.get(319, 179).r = 0x00;
	screen->pixels.get(319, 179).g = 0xff;
	screen->pixels.get(319, 179).b = 0x00;

	screen->blit();

	printthem();

	SDL_Event event;
	while (true) {
		while (SDL_PollEvent(&event)) {
			if (event.type == SDL_CONTROLLERDEVICEREMOVED) {
				print("removed: {}\n", event.cdevice.which);
				printthem();
			}
			else if (event.type == SDL_CONTROLLERDEVICEADDED) {
				print("added: {}\n", event.cdevice.which);
				printthem();
			}
			else if (event.type == SDL_KEYDOWN && event.key.keysym.sym == SDLK_ESCAPE || event.type == SDL_QUIT) {
				SDL_DestroyWindow(window);
				SDL_Quit();
				exit(0);
			}
		}
	}
}
