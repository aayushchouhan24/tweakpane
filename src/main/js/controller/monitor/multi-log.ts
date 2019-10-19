import {Formatter} from '../../formatter/formatter';
import {MonitorValue} from '../../model/monitor-value';
import {MultiLogMonitorView} from '../../view/monitor/multi-log';
import {MonitorController} from './monitor';

interface Config<T> {
	formatter: Formatter<T>;
	value: MonitorValue<T>;
}

/**
 * @hidden
 */
export class MultiLogMonitorController<T> implements MonitorController<T> {
	public readonly value: MonitorValue<T>;
	public readonly view: MultiLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.view = new MultiLogMonitorView(document, {
			formatter: config.formatter,
			value: this.value,
		});
	}

	public dispose(): void {
		this.view.dispose();
	}
}
