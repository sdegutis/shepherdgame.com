export module game;

#include <SDL2/SDL.h>

import screen;
import grid;
import std;

using namespace std;

export class Game {

	Screen screen;
	map<Sint32, SDL_Joystick*> gamepads;

public:

	Game() {
		SDL_Init(SDL_INIT_EVERYTHING);
	}

	~Game() {
		SDL_Quit();
	}

	void start() {
		setup();
		loop();
	}

	void setup() {
		for (int y = 0; y < HEIGHT - 20; y++) {
			int x = y;
			int i = y * WIDTH * 3 + x * 3;
			screen.pixels.get(x, y).r = 0xff;
			screen.pixels.get(x, y).g = 0x00;
			screen.pixels.get(x, y).b = 0x00;
		}

		screen.pixels.get(WIDTH - 2, HEIGHT - 2).r = 0x00;
		screen.pixels.get(WIDTH - 2, HEIGHT - 2).g = 0xff;
		screen.pixels.get(WIDTH - 2, HEIGHT - 2).b = 0x00;

		screen.blit();
	}

	void loop() {
		Uint64 last = SDL_GetTicks64();
		Uint64 fps = 1000 / 30;

		bool quit = false;
		SDL_Event event;
		while (!quit) {
			while (SDL_PollEvent(&event)) {
				if (event.type == SDL_CONTROLLERDEVICEADDED) {
					print("added: {}\n", event.cdevice.which);
					//printthem();

					auto con = SDL_JoystickOpen(event.cdevice.which);
					auto conid = SDL_JoystickGetDeviceInstanceID(event.cdevice.which);
					gamepads[conid] = con;
					auto i = SDL_JoystickGetPlayerIndex(con);
					print("player index: {}\n", i);

				}
				else if (event.type == SDL_CONTROLLERDEVICEREMOVED) {
					auto conid = event.cdevice.which;
					print("removed: {}\n", conid);

					SDL_JoystickClose(gamepads[conid]);
					gamepads.erase(conid);
				}
				else if (event.type == SDL_KEYDOWN && event.key.keysym.sym == SDLK_ESCAPE || event.type == SDL_QUIT) {
					quit = true;
					break;
				}
			}

			Uint64 now = SDL_GetTicks64();
			auto diff = now - last;
			if (diff >= fps) {
				print("{} ", diff);
				last = now;
				update(diff);
			}
		}
	}

	int ii = 0;

	void update(uint64_t delta) {
		for (auto& [k, j] : gamepads) {
			if (SDL_JoystickGetButton(j, SDL_CONTROLLER_BUTTON_A)) {
				auto i = SDL_JoystickGetPlayerIndex(j);

				print("{}", i);
			}
		}

		ii++;

		fill(screen.pixels.pixels.begin(), screen.pixels.pixels.end(), Pixel{});

		for (int y = 0; y < HEIGHT - 20; y++) {
			int x = y;
			int i = y * WIDTH * 3 + x * 3;
			screen.pixels.get(x, y).r = 0xff;
			screen.pixels.get(x, y).g = 0x00;
			screen.pixels.get(x, y).b = 0x00;
		}

		screen.pixels.get(WIDTH - 2 - ii, HEIGHT - 2).r = 0x00;
		screen.pixels.get(WIDTH - 2 - ii, HEIGHT - 2).g = 0xff;
		screen.pixels.get(WIDTH - 2 - ii, HEIGHT - 2).b = 0x00;

		screen.blit();
	}

};
