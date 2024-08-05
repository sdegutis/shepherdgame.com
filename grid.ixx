export module grid;

import pixel;
import std;

using namespace std;

export class grid {

	array<pixel, 320 * 180> pixels;

public:

	auto get(unsigned long long x, unsigned long long y) -> pixel& {
		return pixels[y * 320 + x];
	}

};
