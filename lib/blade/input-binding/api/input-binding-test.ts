import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBinding} from '../../../common/binding/input';
import {BindingTarget} from '../../../common/binding/target';
import {
	createNumberFormatter,
	numberFromUnknown,
	parseNumber,
} from '../../../common/converter/number';
import {PrimitiveValue} from '../../../common/model/primitive-value';
import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {writePrimitive} from '../../../common/primitive';
import {TestUtil} from '../../../misc/test-util';
import {assertInitialState, assertUpdates} from '../../common/api/test-util';
import {TpChangeEvent} from '../../common/api/tp-event';
import {Blade} from '../../common/model/blade';
import {LabelPropsObject} from '../../label/view/label';
import {InputBindingController} from '../controller/input-binding';
import {InputBindingApi} from './input-binding';

function createApi(target: BindingTarget) {
	const doc = TestUtil.createWindow().document;
	const value = new PrimitiveValue(0);
	const ic = new NumberTextController(doc, {
		baseStep: 1,
		parser: parseNumber,
		props: ValueMap.fromObject({
			draggingScale: 1,
			formatter: createNumberFormatter(0),
		}),
		value: value,
		viewProps: createViewProps(),
	});
	const bc = new InputBindingController(doc, {
		binding: new InputBinding({
			reader: numberFromUnknown,
			target: target,
			value: value,
			writer: writePrimitive,
		}),
		blade: new Blade(),
		props: ValueMap.fromObject({
			label: 'label',
		} as LabelPropsObject),
		valueController: ic,
	});
	return new InputBindingApi(bc);
}

describe(InputBindingApi.name, () => {
	it('should listen change event', (done) => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		api.on('change', (ev) => {
			assert.strictEqual(ev instanceof TpChangeEvent, true);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.presetKey, 'foo');
			assert.strictEqual(ev.value, 123);
			done();
		});
		api.controller_.valueController.value.rawValue = 123;
	});

	it('should apply presetKey to event object', (done) => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo', 'renamed'));
		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, 'renamed');
			done();
		});
		api.controller_.valueController.value.rawValue = 123;
	});

	it('should refresh bound value', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));

		PARAMS.foo = 123;
		api.refresh();

		assert.strictEqual(api.controller_.binding.value.rawValue, 123);
	});

	it('should have initial state', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		assertInitialState(api);
	});

	it('should update properties', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		assertUpdates(api);
	});
});
