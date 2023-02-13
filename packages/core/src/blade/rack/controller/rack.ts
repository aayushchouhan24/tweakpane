import {insertElementAt, removeElement} from '../../../common/dom-util';
import {ViewProps} from '../../../common/model/view-props';
import {PlainView} from '../../../common/view/plain';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {Rack, RackEvents} from '../../common/model/rack';

interface Config {
	blade: Blade;
	viewProps: ViewProps;

	root?: boolean;
}

export class RackController extends BladeController<PlainView> {
	public readonly rack: Rack;

	constructor(doc: Document, config: Config) {
		super({
			...config,
			view: new PlainView(doc, {
				viewName: 'rck',
				viewProps: config.viewProps,
			}),
		});

		this.onRackAdd_ = this.onRackAdd_.bind(this);
		this.onRackRemove_ = this.onRackRemove_.bind(this);

		const rack = new Rack({
			blade: config.root ? undefined : config.blade,
			viewProps: config.viewProps,
		});
		rack.emitter.on('add', this.onRackAdd_);
		rack.emitter.on('remove', this.onRackRemove_);
		this.rack = rack;

		this.viewProps.handleDispose(() => {
			for (let i = this.rack.children.length - 1; i >= 0; i--) {
				const bc = this.rack.children[i];
				bc.viewProps.set('disposed', true);
			}
		});
	}

	private onRackAdd_(ev: RackEvents['add']): void {
		if (!ev.isRoot) {
			return;
		}
		insertElementAt(
			this.view.element,
			ev.bladeController.view.element,
			ev.index,
		);
	}

	private onRackRemove_(ev: RackEvents['remove']): void {
		if (!ev.isRoot) {
			return;
		}
		removeElement(ev.bladeController.view.element);
	}
}
