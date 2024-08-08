#pragma once

#include <array>
#include "pixel.h"

using std::array;

constexpr auto WIDTH = 320;
constexpr auto HEIGHT = 180;

class Grid {

public:

	array<Pixel, WIDTH* HEIGHT> pixels;

	auto get(unsigned long long x, unsigned long long y) -> Pixel& {
		return pixels[y * WIDTH + x];
	}

};
