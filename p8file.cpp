#include "p8file.h"

#include <vector>
#include <map>
#include <fstream>

using namespace std;

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

P8file::P8file(string filename) {
	ifstream file(filename);

	map<string, vector<string>> groups;
	string key;

	string line;
	while (getline(file, line)) {
		if (line.starts_with("__")) { key = line; }
		else { groups[key].push_back(line); }
	}

	populate(groups["__gfx__"], spriteColors, 128, 1);
	populate(groups["__gff__"], flags, 256, 2);
	populate(groups["__map__"], mapIndexes, 256, 2);
	//populate(groups["__gfx__"], spriteColors, 128, 1);
}
