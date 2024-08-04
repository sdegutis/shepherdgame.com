export module grid;

import pixel;

#include <array>
#include <algorithm>

export class grid {

	std::array<pixel, 320 * 180> pixels;

public:

	void clear();
	pixel& get(unsigned long long x, unsigned long long y);

};

void grid::clear() {
	std::for_each(pixels.begin(), pixels.end(), [](pixel& p) {p.reset(); });
}

pixel& grid::get(unsigned long long x, unsigned long long y) {
	return pixels[y * 320 + x];
}
