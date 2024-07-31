#pragma once

#include <array>
#include <string>

class p8file
{

public:

	std::array<int, 128 * 128> spriteColors{};
	std::array<int, 128 * 64> mapIndexes{};
	std::array<int, 256> flags{};

	p8file(std::string filename);

};

