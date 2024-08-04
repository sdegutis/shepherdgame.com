export module grid;

#include <array>
#include <algorithm>

class pixel {

public:

	int r = 0, g = 0, b = 0;

	void reset() {
		r = 0;
		g = 0;
		b = 0;
	}

};



export class grid {

	std::array<pixel, 320 * 180> pixels;

public:

	void clear() {
		std::for_each(pixels.begin(), pixels.end(), [](pixel& p) {p.reset(); });
	}

	pixel& get(unsigned long long x, unsigned long long y) {
		return pixels[y * 320 + x];
	}

};
