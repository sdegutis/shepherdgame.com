export module grid;

import pixel;
import std;

using namespace std;

export class grid {

	array<pixel, 320 * 180> pixels;

public:

	pixel& get(unsigned long long x, unsigned long long y);

};

pixel& grid::get(unsigned long long x, unsigned long long y) {
	return pixels[y * 320 + x];
}
