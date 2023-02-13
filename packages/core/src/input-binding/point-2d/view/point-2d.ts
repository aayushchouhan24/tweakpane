import {createSvgIconElement} from '../../../common/dom-util';
import {bindValue} from '../../../common/model/reactive';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {PickerLayout} from '../../../common/params';
import {ClassName} from '../../../common/view/class-name';
import {valueToClassName} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

interface Config {
	expanded: Value<boolean>;
	pickerLayout: PickerLayout;
	viewProps: ViewProps;
}

const cn = ClassName('p2d');

/**
 * @hidden
 */
export class Point2dView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement;
	public readonly textElement: HTMLElement;
	public readonly pickerElement: HTMLElement | null;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);
		bindValue(
			config.expanded,
			valueToClassName(this.element, cn(undefined, 'expanded')),
		);

		const headElem = doc.createElement('div');
		headElem.classList.add(cn('h'));
		this.element.appendChild(headElem);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(cn('b'));
		buttonElem.appendChild(createSvgIconElement(doc, 'p2dpad'));
		config.viewProps.bindDisabled(buttonElem);
		headElem.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const textElem = doc.createElement('div');
		textElem.classList.add(cn('t'));
		headElem.appendChild(textElem);
		this.textElement = textElem;

		if (config.pickerLayout === 'inline') {
			const pickerElem = doc.createElement('div');
			pickerElem.classList.add(cn('p'));
			this.element.appendChild(pickerElem);
			this.pickerElement = pickerElem;
		} else {
			this.pickerElement = null;
		}
	}
}
