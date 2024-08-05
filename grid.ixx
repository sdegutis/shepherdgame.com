export module grid;

import pixel;
import std;

using namespace std;

export class Grid {

	array<Pixel, 320 * 180> pixels;

public:

	auto get(unsigned long long x, unsigned long long y) -> Pixel& {
		return pixels[y * 320 + x];
	}

};
