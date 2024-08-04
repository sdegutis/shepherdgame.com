export module grid;

import pixel;
import std;

using namespace std;

export class grid {

	array<pixel, 320 * 180> pixels;

public:

	void clear();
	pixel& get(unsigned long long x, unsigned long long y);

};

void grid::clear() {
	for_each(pixels.begin(), pixels.end(), [](pixel& p) {p.reset(); });
}

pixel& grid::get(unsigned long long x, unsigned long long y) {
	return pixels[y * 320 + x];
}
