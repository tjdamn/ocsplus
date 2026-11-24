/* eslint-disable max-len */
import { h, $ui, $modal, $message } from 'easy-us';
import { $ } from '@ocsjs/core';

/**
 * OCS 图标 SVG（唯一数据源）
 * - entry.js 标题栏使用（经 index.ts 导出后从 OCS 全局解构）
 * - edge-minimize.ts 边缘最小化图标模式使用
 */
export const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1080 1080" style="vertical-align:middle;"><path fill-rule="evenodd" d="M504.5 1.109c-72.713 4.577-147.529 25.339-212.035 58.842-50.191 26.068-92.985 57.474-133.527 97.996-41.255 41.234-72.652 84.102-98.549 134.553-63.294 123.306-76.989 265.444-38.445 399 25.189 87.279 71.847 166.103 136.667 230.88 51 50.967 110.694 90.846 176.835 118.135 49.129 20.27 108.457 34.223 163.504 38.452 17.303 1.329 66.996 1.333 83.655.006 55.204-4.397 107.295-16.401 158.822-36.6 17.371-6.81 57.946-26.767 74.073-36.433 41.445-24.842 72.509-49.199 110.493-86.637l21.507-21.198-71.734-71.786-71.734-71.785-19.766 19.567c-10.871 10.762-23.591 22.705-28.266 26.54-53.604 43.971-115.935 69.551-185 75.921-81.757 7.541-165.599-15.992-231.454-64.964-6.35-4.722-11.546-8.93-11.546-9.349s11.385-12.142 25.3-26.049l25.3-25.286 4.777-3.648c13.463 10.28 36.952 23.436 55.855 31.285 52.351 21.738 113.089 25.925 168.768 11.634 35.263-9.05 73.276-28.363 100.754-51.188C722.543 734.838 751 705.231 751 702.338c0-1.002-47.194-48.338-48.193-48.338-.39 0-4.279 4.388-8.642 9.75-24.686 30.342-55.543 51.652-92.165 63.652-22.77 7.461-33.447 9.027-61.5 9.025-20.917-.002-25.46-.293-35.363-2.266-31.598-6.297-58.925-18.374-83.801-37.035-4.858-3.644-16.847-14.474-26.642-24.066l-17.809-17.44-73.994 73.94-73.994 73.94 21.324 21c28.787 28.349 48.737 44.364 77.279 62.033 15.029 9.303 48.315 26.086 63 31.763 35.072 13.559 69.772 21.993 108 26.249 20.372 2.268 63.437 2.268 84-.001 76.772-8.471 146.44-36.203 205.832-81.934 6.508-5.01 12.471-9.558 13.252-10.106 1.101-.773 6.563 4.151 24.406 22l22.988 22.996-10.739 8.675c-65.679 53.053-141.564 86.866-223.817 99.729-27.363 4.279-43.823 5.505-73.922 5.505-46.468 0-83.994-5.037-127.455-17.107C272.797 955.351 156.557 850.805 102.504 715c-22.28-55.977-32.803-111.402-32.94-173.5-.116-52.401 7.047-99.278 22.432-146.793C147.295 223.918 294.816 99.581 473 73.582c41.922-6.117 98.943-5.919 138.5.481 72.78 11.775 134.913 36.126 194.048 76.05C823.221 162.046 848 181.418 848 183.304c0 .661-32.624 33.823-72.498 73.694-55.881 55.877-72.815 72.265-73.88 71.498-41.919-30.237-86.474-47.748-133.478-52.458-13.265-1.329-41.947-1.334-55.288-.01-78.286 7.774-150.572 51.845-194.318 118.472-31.523 48.011-46.706 105.616-42.723 162.094 1.179 16.71 3.688 33.737 6.74 45.73C287.22 620.654 297.35 649 299.235 649c.53 0 12.635-11.675 26.9-25.945l25.936-25.944-1.984-7.806c-4.264-16.777-5.55-28.045-5.569-48.805-.019-21.105.931-29.802 5.136-47 13.445-54.989 48.145-99.893 98.346-127.264 16.503-8.998 39.898-16.833 60.379-20.222 15.558-2.575 45.897-2.791 61.002-.436C638.18 356.306 694.057 399.38 721.704 463c15.443 35.539 19.804 79.228 11.676 117-1.36 6.325-2.706 12.85-2.989 14.5-.482 2.81 1.166 4.677 25.998 29.444 25.179 25.113 26.56 26.321 27.443 24 .512-1.344 2.056-5.144 3.432-8.444 22.118-53.055 24.905-120.158 7.36-177.223-8.309-27.026-22.775-56.32-38.077-77.106-2.501-3.397-4.547-6.512-4.547-6.922s43.893-44.64 97.54-98.289l97.539-97.543-23.289-22.984c-24.441-24.12-39.625-37.373-61.265-53.476C760.232 29.842 634.23-7.058 504.5 1.109m453.75 253.895C944.913 268.521 934 279.798 934 280.065s4.308 7.673 9.574 16.46c22.263 37.147 39.526 77.171 50.801 117.778 3.005 10.825 4.205 15.733 7.623 31.197 10.804 48.879 12.225 117.979 3.485 169.5-11.438 67.422-31.332 118.888-70.557 182.535l-1.87 3.036 24.863 24.848 24.863 24.848 7.942-11.884c45.969-68.783 75.805-150.569 85.686-234.883 5.282-45.065 4.544-97.517-2.004-142.5-11.025-75.743-37.133-146.086-78.498-211.5-4.87-7.7-9.878-15.141-11.131-16.536l-2.277-2.536z"/></svg>`;

/** 加载中旋转图标（旋转动画由 custom.less 的 .aw-spin 控制） */
export const loadingSpinSvg = `<svg class="aw-spin" width="14" height="14" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="10" stroke-linecap="round"/></svg>`;

/**
 * 通用口风琴卡片（下拉展开/收起列表组件）
 *
 * 结构：头部（点击整行展开/收起）+ 详情区（默认收起），展开状态由 expanded class 驱动，
 * 样式见 custom.less 的 .accordion-card-*（含详情区超高时内部滚动的 scroll 样式）。
 *
 * 使用方：搜索结果下拉列表（search.infos.ts）
 */
export function createAccordionCard(options: {
	/** 头部左侧内容 */
	header: (HTMLElement | string)[];
	/** 头部右侧内容（位于展开箭头左侧，如开关/标签） */
	headerTrailing?: (HTMLElement | string)[];
	/** 详情区内容 */
	body: (HTMLElement | string)[];
	/** 默认是否展开 */
	expanded?: boolean;
	/** 卡片附加 class */
	className?: string;
}): HTMLElement {
	const card = h('div', {
		className:
			'accordion-card' + (options.className ? ' ' + options.className : '') + (options.expanded ? ' expanded' : '')
	});
	const header = h('div', { className: 'accordion-card-header' }, [
		...options.header,
		h('span', { className: 'accordion-card-spacer' }),
		...(options.headerTrailing ?? []),
		h('span', { className: 'accordion-card-chevron', innerHTML: CHEVRON_SVG })
	]);
	header.onclick = () => card.classList.toggle('expanded');
	card.append(header, h('div', { className: 'accordion-card-body' }, options.body));
	return card;
}

/** 展开箭头 SVG（代替 details/summary 的默认箭头，旋转动画由 CSS 控制） */
const CHEVRON_SVG = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** 渲染步骤提示 */
export function createSteps(items: string[]): HTMLElement {
	const children: (HTMLElement | string)[] = [];
	items.forEach((text, i) => {
		children.push(h('span', { className: 'aw-step' }, [h('span', { className: 'aw-step-num' }, String(i + 1)), text]));
		if (i < items.length - 1) {
			children.push(h('span', { className: 'aw-step-arrow' }, '→'));
		}
	});
	return h('div', { className: 'aw-steps' }, children);
}

/** 状态提示类型：info 进行中 / success 成功 / error 失败 */
/** 弹窗引导组件输入参数 */
export interface PopupBlockedGuideOptions {
	/**
	 * 被拦截的 window.open 原始参数，用户点击 “重新打开” 时原样传递重试。
	 * 组件显示期间再次调用 showPopupBlockedGuide 会用新参数替换旧参数。
	 */
	openArgs: any[];
	/**
	 * 实际执行打开的函数，默认使用当前页面 window.open。
	 * 劫持了 unsafeWindow.open 的场景（如超星积分课）需注入 unsafeWindow 上的原始 open。
	 */
	opener?: (...args: any[]) => Window | null;
	/** 引导文案中提示 “始终允许 xx 显示弹出式窗口” 的站点名，默认取 openArgs[0] 的 hostname，取不到则为 location.hostname */
	siteName?: string;
	/** 允许弹窗的操作演示图（GIF）地址；传 null 则不显示图片 */
	guideImage?: string | null;
	/** 弹窗标题 */
	title?: string;
	/** 确认（重试）按钮文案 */
	confirmText?: string;
	/** 取消按钮文案 */
	cancelText?: string;
}

/** 引导弹窗关闭时返回的用户操作结果 */
export interface PopupBlockedGuideResult {
	/**
	 * retry-success：用户点击 “重新打开” 且窗口成功打开（win 为新窗口对象）
	 * cancel：用户点击取消（或弹窗以其他方式关闭），win 为 null
	 * 注意：重试仍被拦截时弹窗保持打开并提示错误，不产生结果，等待用户再次操作
	 */
	action: 'retry-success' | 'cancel';
	/** 重试成功时的窗口对象 */
	win: Window | null;
}

/**
 * 判断 window.open 的返回值是否被浏览器拦截：
 * 返回 null（Chrome 等），或返回一个已被立即关闭的窗口（部分浏览器、站点传 noopener 时）
 */
export function isPopupBlocked(win: Window | null): boolean {
	return win === null || win.closed;
}

/**
 * 重试打开窗口（必须在真实用户手势事件中调用，浏览器处于用户激活状态才能绕过拦截）。
 * 仍被拦截时弹出错误提示并返回 null，由调用方决定后续处理。
 */
export function retryOpenWindow(options: Pick<PopupBlockedGuideOptions, 'openArgs' | 'opener'>): Window | null {
	const opener = options.opener ?? ((...args: any[]) => window.open(...args));
	const win = opener(...options.openArgs);
	if (isPopupBlocked(win)) {
		$message.error({ content: '弹窗仍被拦截，请在浏览器地址栏允许本站弹窗后重试。' });
		return null;
	}
	return win;
}

/** 当前正在显示的引导弹窗（同一时间只显示一个，重复调用时更新重试参数并复用同一个 Promise） */
let currentGuide:
	| {
			options: PopupBlockedGuideOptions;
			resolve: (result: PopupBlockedGuideResult) => void;
			promise: Promise<PopupBlockedGuideResult>;
	  }
	| undefined;

/**
 * 显示 “弹窗被浏览器拦截” 引导弹窗，返回用户操作结果的 Promise：
 * - 引导用户前往地址栏允许本站弹窗（配 GIF 操作演示），或点击 “重新打开” 手动重试
 * - 重试成功：弹窗关闭，Promise  resolve { action: 'retry-success', win }
 * - 重试仍被拦截：弹窗保持打开并提示错误，等待用户允许弹窗后再次点击
 * - 用户取消：Promise resolve { action: 'cancel', win: null }
 * - 弹窗显示期间重复调用：不重复弹窗，仅更新重试参数，并返回同一个 Promise
 */
export function showPopupBlockedGuide(options: PopupBlockedGuideOptions): Promise<PopupBlockedGuideResult> {
	if (currentGuide) {
		currentGuide.options = options;
		return currentGuide.promise;
	}

	const promise = new Promise<PopupBlockedGuideResult>((resolve) => {
		currentGuide = { options, resolve, promise: undefined as any };

		/** 从 openArgs[0] 解析站点名，解析失败时退化为当前站点 */
		const resolveSiteName = () => {
			try {
				return new URL(String(options.openArgs[0]), location.href).hostname || location.hostname;
			} catch {
				return location.hostname;
			}
		};

		const {
			siteName = resolveSiteName(),
			guideImage = 'https://cdn.ocsjs.com/public/images/cx_jfk_dialog_enable_guide.gif',
			title = '⚠️ 弹窗被拦截',
			confirmText = '重新打开',
			cancelText = '取消'
		} = options;

		/** 是否已通过 onConfirm/onCancel 产生结果（onClose 兜底用） */
		let settled = false;
		const settle = (result: PopupBlockedGuideResult) => {
			settled = true;
			resolve(result);
		};

		$modal.confirm({
			title,
			width: 560,
			maskCloseable: false,
			content: h('div', [
				$ui.notes([
					'浏览器拦截了新窗口，脚本无法自动打开页面。',
					[
						'请点击地址栏右侧的 “弹出式窗口已拦截” 图标，',
						`选择 “始终允许 ${siteName} 显示弹出式窗口和重定向” ，之后刷新页面即可全自动运行。`
					],
					`或者点击下方 “${confirmText}” 按钮，手动打开本次窗口（用户真实点击不受拦截限制）。`
				]),
				...(guideImage
					? [
							h('img', {
								src: guideImage,
								title: '允许弹窗操作演示',
								style: {
									width: '100%',
									marginTop: '8px',
									border: '1px solid #e4e7ed',
									borderRadius: '4px'
								}
							})
					  ]
					: [])
			]),
			confirmButtonText: confirmText,
			cancelButtonText: cancelText,
			onConfirm: () => {
				const win = retryOpenWindow(currentGuide!.options);
				if (win) {
					settle({ action: 'retry-success', win });
					// 返回 true 关闭弹窗
					return true;
				}
				// 重试仍被拦截：不关闭弹窗，等待用户允许弹窗后重试
				return false;
			},
			onCancel: () => {
				settle({ action: 'cancel', win: null });
			},
			onClose: () => {
				currentGuide = undefined;
				// 兜底：弹窗以其他方式关闭时按取消处理
				if (!settled) {
					settle({ action: 'cancel', win: null });
				}
			}
		});
	});

	currentGuide!.promise = promise;
	return promise;
}

/** 主动探测弹窗权限的输入参数 */
export interface PopupPermissionProbeOptions {
	/**
	 * 实际执行打开的函数，默认使用当前页面 window.open。
	 * 需要探测 unsafeWindow.open（站点 hook 场景）时由调用方注入。
	 */
	opener?: (...args: any[]) => Window | null;
	/** 探测前等待的毫秒数（如等待页面加载完成后再探测），默认 0 立即探测 */
	delay?: number;
	/** 探测被拦截时透传给 showPopupBlockedGuide 的引导弹窗配置（openArgs/opener 由探测函数接管） */
	guide?: Partial<Omit<PopupBlockedGuideOptions, 'openArgs' | 'opener'>>;
	/** 用户在引导弹窗中点击取消时的回调 */
	onCancel?: () => void;
}

/**
 * 主动探测浏览器是否允许脚本打开弹窗：
 * 1. （可选延迟后）以 about:blank 小窗口试开弹窗
 * 2. 未被拦截：立即关闭探测窗口，resolve true
 * 3. 被拦截：自动弹出 showPopupBlockedGuide 引导弹窗，
 *    用户点击 “重新打开” 重试成功后关闭探测窗口并 resolve true；用户取消则 resolve false
 *
 * 注意：若当前已有引导弹窗显示，将复用该弹窗（重试参数会被探测参数替换），
 * 因此本函数适合在 “没有真实打开目标” 的场景做纯权限检测；
 * 有真实目标时建议直接打开目标窗口并用 isPopupBlocked 判断，被拦截再走引导（见超星积分课实现）。
 */
export async function probePopupPermission(options: PopupPermissionProbeOptions = {}): Promise<boolean> {
	const opener = options.opener ?? ((...args: any[]) => window.open(...args));
	const openArgs = ['about:blank', '_blank', 'width=400,height=300'];

	if (options.delay && options.delay > 0) {
		await $.sleep(options.delay);
	}

	const closeProbeWin = (win: Window | null) => {
		try {
			win?.close();
		} catch {
			// 忽略关闭异常（窗口可能已被用户手动关闭）
		}
	};

	const win = opener(...openArgs);
	if (!isPopupBlocked(win)) {
		closeProbeWin(win);
		return true;
	}

	const result = await showPopupBlockedGuide({
		openArgs,
		opener,
		...options.guide
	});
	if (result.action === 'retry-success') {
		closeProbeWin(result.win);
		return true;
	}
	options.onCancel?.();
	return false;
}
