#define SDL_MAIN_HANDLED

#include <SDL2/SDL.h>
#include <stdio.h>
#include <algorithm>
#include <fplus/fplus.hpp>
#include <fmt/core.h>

// extern char _binary_main_cpp_start[];
// extern char _binary_main_cpp_end[];
// extern size_t _binary_main_cpp_size;
    
constexpr auto SCALE = 5;

[[noreturn]] static void loop(SDL_Window* window)
{
    printf("testing\n");

    SDL_Event event;
    while (true)
    {
        while (SDL_PollEvent(&event))
        {
            if (event.type == SDL_CONTROLLERDEVICEADDED) {
                fmt::print("2testing {}", event.cdevice.which);
            }
            else if (event.type == SDL_KEYDOWN && event.key.keysym.sym == SDLK_ESCAPE || event.type == SDL_QUIT)
            {
                SDL_DestroyWindow(window);
                SDL_Quit();
                exit(0);
            }
        }
    }
}

[[noreturn]] int main(int argc, char* args[])
{
    SDL_Init(SDL_INIT_VIDEO | SDL_INIT_GAMECONTROLLER);

    fplus::fill_right(0, 10, std::string("hello"));

    SDL_Window* window = SDL_CreateWindow("testing...",
        SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
        320 * SCALE, 180 * SCALE,
        SDL_WINDOW_SHOWN);

    int *pixels = new int[320 * 180 * 3];
    memset(pixels, 0, 320ull *180 * 3 * sizeof(int));
    for (int y = 0; y < 160; y++)
    {
        int x = y;
        int i = y * 320 * 3 + x * 3;
        pixels[i + 0] = 0x00;
        pixels[i + 1] = 0x00;
        pixels[i + 2] = 0xff;
    }

    pixels[179 * 320 * 3 + 319 * 3 + 0] = 0x00;
    pixels[179 * 320 * 3 + 319 * 3 + 1] = 0xff;
    pixels[179 * 320 * 3 + 319 * 3 + 2] = 0x00;

    SDL_Surface* screenSurface = SDL_GetWindowSurface(window);
    Uint32* pixels2 = static_cast<Uint32*>(screenSurface->pixels);

    for (int y = 0; y < 180; y++)
    {
        for (int x = 0; x < 320; x++)
        {
            int r = pixels[y * 320 * 3 + x * 3 + 0];
            int g = pixels[y * 320 * 3 + x * 3 + 1];
            int b = pixels[y * 320 * 3 + x * 3 + 2];
            int c = SDL_MapRGB(screenSurface->format, r, g, b);

            for (int z = 0; z < SCALE; z++)
                std::fill_n(pixels2 + (y * 320 * (SCALE * SCALE) + (z * 320 * SCALE) + x * SCALE), SCALE, c);
        }
    }

    SDL_UpdateWindowSurface(window);

    loop(window);
}
