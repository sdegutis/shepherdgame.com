#define SDL_MAIN_HANDLED

#include <SDL2/SDL.h>

import screen;
import grid;
import std;

using namespace std;

//void printthem() {
//	print("num joysticks: {}\n", SDL_NumJoysticks());
//	for (int i = 0; i < SDL_NumJoysticks(); i++) {
//		::printf("%d: %d\n", i, SDL_IsGameController(i));
//	}
//	print("\n");
//}

int main(int argc, char* args[]) {
	//print("{}\n", thread::hardware_concurrency());

	SDL_Init(SDL_INIT_EVERYTHING);

	auto window = SDL_CreateWindow("shepherdgame",
		SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
		WIDTH * SCALE, HEIGHT * SCALE,
		SDL_WINDOW_SHOWN);

	auto screen = new Screen(window);

	for (int y = 0; y < HEIGHT - 20; y++) {
		int x = y;
		int i = y * WIDTH * 3 + x * 3;
		screen->pixels.get(x, y).r = 0xff;
		screen->pixels.get(x, y).g = 0x00;
		screen->pixels.get(x, y).b = 0x00;
	}

	screen->pixels.get(WIDTH - 2, HEIGHT - 2).r = 0x00;
	screen->pixels.get(WIDTH - 2, HEIGHT - 2).g = 0xff;
	screen->pixels.get(WIDTH - 2, HEIGHT - 2).b = 0x00;

	screen->blit();

	map<Sint32, SDL_GameController*> gamepads;

	//printthem();

	SDL_Event event;
	while (true) {
		while (SDL_PollEvent(&event)) {
			if (event.type == SDL_CONTROLLERDEVICEREMOVED) {
				print("removed: {}\n", event.cdevice.which);

				SDL_GameControllerClose(gamepads[event.cdevice.which]);
				gamepads.erase(event.cdevice.which);

				//SDL_GameControllerClose(gc);

				//printthem();
			}
			else if (event.type == SDL_CONTROLLERDEVICEADDED) {
				print("added: {}\n", event.cdevice.which);
				//printthem();

				auto j = SDL_GameControllerOpen(event.cdevice.which);
				gamepads[event.cdevice.which] = j;
				auto i = SDL_GameControllerGetPlayerIndex(j);
				print("player index: {}\n", i);

			}
			else if (event.type == SDL_KEYDOWN && event.key.keysym.sym == SDLK_ESCAPE || event.type == SDL_QUIT) {
				SDL_DestroyWindow(window);
				SDL_Quit();
				exit(0);
			}
		}

		if (gamepads.size() > 0) {

			auto o = gamepads.begin();
			auto k = *o;
			auto j = k.second;

			if (SDL_GameControllerGetButton(j, SDL_CONTROLLER_BUTTON_A)) {
				print(".");
			}
		}
	}


}
