#define SDL_MAIN_HANDLED

import game;
import std;

using namespace std::chrono_literals;
using namespace std::string_view_literals;

constexpr int operator""hmm(unsigned long long n) {
	return n * 2;
}

int main() {
	auto foo = 3hmm;
	auto bar = "testing"sv;
	std::print("{}\n", bar.substr(1,4));
	//std::print("{}\n", std::chrono::duration_cast<std::chrono::minutes>(0.5h));

	Game game;
	game.start();
}
