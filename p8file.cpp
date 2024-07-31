#include "p8file.h"

#include <vector>
#include <map>
#include <fstream>

template <int N>
void populate(std::vector<std::string>& lines, std::array<int, N>& vals, int linelen, int strlen) {
	for (int j = 0; j < lines.size(); j++) {
		auto& line = lines[j];
		for (int i = 0; i < linelen / strlen; i++) {
			auto str = line.substr(i * strlen, strlen);
			int n = std::stoi(str, nullptr, 16);
			vals[j * linelen / strlen + i] = n;
		}
	}
}

p8file::p8file(std::string filename) {
	std::ifstream file(filename);

	std::map<std::string, std::vector<std::string>> groups;
	std::string key;

	std::string line;
	while (std::getline(file, line)) {
		if (line.starts_with("__")) { key = line; }
		else { groups[key].push_back(line); }
	}

	file.close();

	populate(groups["__gfx__"], spriteColors, 128, 1);
	populate(groups["__gff__"], flags, 256, 2);
	populate(groups["__map__"], mapIndexes, 256, 2);
	//populate(groups["__gfx__"], spriteColors, 128, 1);
}
