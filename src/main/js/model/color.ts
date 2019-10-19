import * as ColorModel from '../misc/color-model';
import {Emitter} from '../misc/emitter';
import {NumberUtil} from '../misc/number-util';

type EventType = 'change';
type ColorMode = 'hsv' | 'rgb';

export interface RgbColorObject {
	r: number;
	g: number;
	b: number;
}

const CONSTRAINT_MAP: {
	[mode in ColorMode]: (
		comps: [number, number, number],
	) => [number, number, number];
} = {
	hsv: (comps: [number, number, number]): [number, number, number] => {
		return [
			NumberUtil.loop(comps[0], 360),
			NumberUtil.constrain(comps[1], 0, 100),
			NumberUtil.constrain(comps[2], 0, 100),
		];
	},
	rgb: (comps: [number, number, number]): [number, number, number] => {
		return [
			NumberUtil.constrain(comps[0], 0, 255),
			NumberUtil.constrain(comps[1], 0, 255),
			NumberUtil.constrain(comps[2], 0, 255),
		];
	},
};

/**
 * @hidden
 */
export class Color {
	public readonly emitter: Emitter<EventType>;
	private comps_: [number, number, number];
	private mode_: ColorMode;

	constructor(comps: [number, number, number], mode: ColorMode) {
		this.emitter = new Emitter();

		this.mode_ = mode;
		this.comps_ = CONSTRAINT_MAP[mode](comps);
	}

	public get mode(): ColorMode {
		return this.mode_;
	}

	public getComponents(mode: ColorMode): [number, number, number] {
		if (this.mode_ === 'hsv' && mode === 'rgb') {
			return ColorModel.hsvToRgb(...this.comps_);
		}
		if (this.mode_ === 'rgb' && mode === 'hsv') {
			return ColorModel.rgbToHsv(...this.comps_);
		}
		return this.comps_;
	}

	public toRgbObject(): RgbColorObject {
		const rgbComps = this.getComponents('rgb');

		// tslint:disable:object-literal-sort-keys
		return {
			r: rgbComps[0],
			g: rgbComps[1],
			b: rgbComps[2],
		};
		// tslint:enable:object-literal-sort-keys
	}
}
