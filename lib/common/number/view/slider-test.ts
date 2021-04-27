import * as assert from 'assert';
import {describe} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {PrimitiveValue} from '../../model/primitive-value';
import {SliderView} from './slider';

describe(SliderView.name, () => {
	it('should apply initial value', () => {
		const doc = TestUtil.createWindow().document;
		const props = ValueMap.fromObject({
			maxValue: 200,
			minValue: 0,
		});
		const v = new PrimitiveValue(100);
		const view = new SliderView(doc, {
			props: props,
			value: v,
			viewProps: createViewProps(),
		});

		assert.strictEqual(view.knobElement.style.width, '50%');
	});

	it('should apply value change', () => {
		const doc = TestUtil.createWindow().document;
		const props = ValueMap.fromObject({
			maxValue: 200,
			minValue: 0,
		});
		const v = new PrimitiveValue(100);
		const view = new SliderView(doc, {
			props: props,
			value: v,
			viewProps: createViewProps(),
		});

		v.rawValue = 0;

		assert.strictEqual(view.knobElement.style.width, '0%');
	});

	it('should apply props change', () => {
		const doc = TestUtil.createWindow().document;
		const props = ValueMap.fromObject({
			maxValue: 200,
			minValue: 0,
		});
		const v = new PrimitiveValue(100);
		const view = new SliderView(doc, {
			props: props,
			value: v,
			viewProps: createViewProps(),
		});

		props.set('maxValue', 100);

		assert.strictEqual(view.knobElement.style.width, '100%');
	});
});
