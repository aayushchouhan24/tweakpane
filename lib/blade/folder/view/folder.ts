import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {
	bindClassModifier,
	bindDisabled,
	bindTextContent,
	bindValueMap,
} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';
import {isEmpty} from '../../../misc/type-util';
import {
	Foldable,
	getFoldableStyleExpanded,
	getFoldableStyleHeight,
} from '../../common/model/foldable';
import {bladeContainerClassName} from '../../common/view/blade-container';

export type FolderProps = ValueMap<{
	title: string | undefined;
}>;

export interface Config {
	containerElement: HTMLElement;
	folder: Foldable;
	props: FolderProps;
	viewProps: ViewProps;

	viewName?: string;
}

/**
 * @hidden
 */
export class FolderView implements View {
	public readonly buttonElement: HTMLButtonElement;
	public readonly containerElement: HTMLElement;
	public readonly titleElement: HTMLElement;
	public readonly element: HTMLElement;
	private readonly folder_: Foldable;
	private readonly className_: ReturnType<typeof ClassName>;

	constructor(doc: Document, config: Config) {
		this.onFolderChange_ = this.onFolderChange_.bind(this);

		this.folder_ = config.folder;
		this.folder_.emitter.on('change', this.onFolderChange_);

		this.className_ = ClassName(config.viewName || 'fld');
		this.element = doc.createElement('div');
		this.element.classList.add(this.className_(), bladeContainerClassName());
		bindClassModifier(config.viewProps, this.element);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(this.className_('b'));
		bindValueMap(config.props, 'title', (title) => {
			if (isEmpty(title)) {
				this.element.classList.add(this.className_(undefined, 'not'));
			} else {
				this.element.classList.remove(this.className_(undefined, 'not'));
			}
		});
		bindDisabled(config.viewProps, buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const titleElem = doc.createElement('div');
		titleElem.classList.add(this.className_('t'));
		bindTextContent(config.props, 'title', titleElem);
		this.buttonElement.appendChild(titleElem);
		this.titleElement = titleElem;

		const markElem = doc.createElement('div');
		markElem.classList.add(this.className_('m'));
		this.buttonElement.appendChild(markElem);

		const containerElem = config.containerElement;
		containerElem.classList.add(this.className_('c'));
		this.element.appendChild(containerElem);
		this.containerElement = containerElem;

		this.applyModel_();
	}

	private applyModel_() {
		const expanded = getFoldableStyleExpanded(this.folder_);
		const expandedClass = this.className_(undefined, 'expanded');
		if (expanded) {
			this.element.classList.add(expandedClass);
		} else {
			this.element.classList.remove(expandedClass);
		}
		this.containerElement.style.height = getFoldableStyleHeight(this.folder_);
	}

	private onFolderChange_() {
		this.applyModel_();
	}
}
