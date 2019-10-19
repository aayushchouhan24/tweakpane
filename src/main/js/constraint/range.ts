import {TypeUtil} from '../misc/type-util';
import {Constraint} from './constraint';

interface Config {
	max?: number;
	min?: number;
}

/**
 * @hidden
 */
export class RangeConstraint implements Constraint<number> {
	public readonly maxValue: number | undefined;
	public readonly minValue: number | undefined;

	constructor(config: Config) {
		this.maxValue = config.max;
		this.minValue = config.min;
	}

	public constrain(value: number): number {
		let result = value;
		if (!TypeUtil.isEmpty(this.minValue)) {
			result = Math.max(result, this.minValue);
		}
		if (!TypeUtil.isEmpty(this.maxValue)) {
			result = Math.min(result, this.maxValue);
		}
		return result;
	}
}
