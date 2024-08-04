export module p8file;

import std;
using namespace std;

export int COLORS[16][4] = {
	{0x00, 0x00, 0x00, 0x00},
	{0x1D, 0x2B, 0x53, 0xff},
	{0x7E, 0x25, 0x53, 0xff},
	{0x00, 0x87, 0x51, 0xff},
	{0xAB, 0x52, 0x36, 0xff},
	{0x5F, 0x57, 0x4F, 0xff},
	{0xC2, 0xC3, 0xC7, 0xff},
	{0xFF, 0xF1, 0xE8, 0xff},
	{0xFF, 0x00, 0x4D, 0xff},
	{0xFF, 0xA3, 0x00, 0xff},
	{0xFF, 0xEC, 0x27, 0xff},
	{0x00, 0xE4, 0x36, 0xff},
	{0x29, 0xAD, 0xFF, 0xff},
	{0x83, 0x76, 0x9C, 0xff},
	{0xFF, 0x77, 0xA8, 0xff},
	{0xFF, 0xCC, 0xAA, 0xff},
};

export class p8file {

public:

	array<int, 128 * 128> spriteColors{};
	array<int, 128 * 64> mapIndexes{};
	array<int, 256> flags{};

	p8file(string filename);

};

template <int N>
void populate(const vector<string>& lines, array<int, N>& vals, int linelen, int strlen) {
	for (int j = 0; j < lines.size(); j++) {
		auto& line = lines[j];
		for (int i = 0; i < linelen / strlen; i++) {
			auto str = line.substr(i * strlen, strlen);
			int n = stoi(str, nullptr, 16);
			vals[j * linelen / strlen + i] = n;
		}
	}
}

p8file::p8file(const string filename) {
	ifstream file(filename);

	map<string, vector<string>> groups;
	string key;

	string line;
	while (getline(file, line)) {
		if (line.starts_with("__")) { key = line; }
		else { groups[key].push_back(line); }
	}

	file.close();

	populate(groups["__gfx__"], spriteColors, 128, 1);
	populate(groups["__gff__"], flags, 256, 2);
	populate(groups["__map__"], mapIndexes, 256, 2);
	//populate(groups["__gfx__"], spriteColors, 128, 1);
}
