export module pixel;


export class Pixel {

public:

	int r = 0x00;
	int g = 0x00;
	int b = 0x00;

	Pixel() {};

	Pixel(int n) {
		r = n;
		g = n;
		b = n;
	}

};
