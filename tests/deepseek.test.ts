import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDefaultQuestionResolver } from '../packages/core/src/core/worker/question.resolver';
import type { WorkContext } from '../packages/core/src/core/worker/interface';
import { resolveCompletion } from '../packages/core/src/core/worker/resolvers/completion';
import { resolveJudgement } from '../packages/core/src/core/worker/resolvers/judgement';
import { resolveMultiple } from '../packages/core/src/core/worker/resolvers/multiple';
import { resolveSingle } from '../packages/core/src/core/worker/resolvers/single';
import {
	DEEPSEEK_API_URL,
	isDeepSeekConfigured,
	requestDeepSeekAnswer,
	saveDeepSeekApiKey
} from '../packages/scripts/src/utils/deepseek';
import { buildAnswererEnv } from '../packages/scripts/src/utils/answerer-env';
import type { AnswererEnv } from '../packages/scripts/src/utils/answerer-env';

test('DeepSeek 请求与现有答案匹配器', async (t) => {
	const gm = globalThis as typeof globalThis & {
		GM_getValue?: (key: string, fallback: string) => string;
		GM_setValue?: (key: string, value: string) => void;
		GM_deleteValue?: (key: string) => void;
		GM_xmlhttpRequest?: (request: {
			url: string;
			headers: Record<string, string>;
			data: string;
			onload: (response: { status: number; responseText: string }) => void;
		}) => { abort: () => void };
	};
	const storage = new Map<string, string>();
	let status = 200;
	const nextStatuses: number[] = [];
	let requestCount = 0;
	let output: object = {};
	let finishReason = 'stop';
	let lastRequest: Parameters<NonNullable<typeof gm.GM_xmlhttpRequest>>[0] | undefined;
	gm.GM_getValue = (key, fallback) => storage.get(key) ?? fallback;
	gm.GM_setValue = (key, value) => void storage.set(key, value);
	gm.GM_deleteValue = (key) => void storage.delete(key);
	gm.GM_xmlhttpRequest = (request) => {
		lastRequest = request;
		requestCount++;
		request.onload({
			status: nextStatuses.shift() ?? status,
			responseText: JSON.stringify({
				choices: [{ finish_reason: finishReason, message: { content: JSON.stringify(output) } }]
			})
		});
		return { abort() {} };
	};
	t.after(() => {
		delete gm.GM_getValue;
		delete gm.GM_setValue;
		delete gm.GM_deleteValue;
		delete gm.GM_xmlhttpRequest;
	});

	const options = ['A. 第一项', 'B. 第二项', 'C. 第三项'];
	const env: AnswererEnv = { type: 'single', title: '示例题目', options };

	assert.equal(isDeepSeekConfigured(), false);
	assert.match((await requestDeepSeekAnswer(env, 1))[0].error!, /API Key/);
	assert.equal(lastRequest, undefined);

	saveDeepSeekApiKey(' mock-api-key ');
	assert.equal(isDeepSeekConfigured(), true);
	output = { choices: [2] };
	const [single] = await requestDeepSeekAnswer(env, 1);
	assert.equal(resolveSingle([single.results[0].answer], options).option, options[1]);
	assert.equal(lastRequest!.url, DEEPSEEK_API_URL);
	assert.equal(lastRequest!.headers.Authorization, 'Bearer mock-api-key');
	assert.equal(lastRequest!.data.includes('mock-api-key'), false);
	assert.equal(JSON.parse(lastRequest!.data).model, 'deepseek-flash');

	output = { choices: [1, 3] };
	const [multiple] = await requestDeepSeekAnswer({ ...env, type: 'multiple' }, 1);
	assert.deepEqual(resolveMultiple([multiple.results[0].answer], options).options, [options[0], options[2]]);

	const numberedOptions = ['51', '5.1', '第一行\n第二行', '重复的选项', '重复的选项'];
	const { env: numberedQuestion } = await buildAnswererEnv({
		type: 'single',
		title: '检查选项编号',
		options: numberedOptions
	});
	const elements = numberedOptions.map((innerText) => ({ innerText } as HTMLElement));
	const resolver = createDefaultQuestionResolver({} as WorkContext<{}>);
	const selected: number[] = [];
	const record = (_type: unknown, _text: string, element: HTMLElement) => {
		selected.push(elements.indexOf(element) + 1);
	};

	output = { choices: [2] };
	const exactSingle = await requestDeepSeekAnswer(numberedQuestion, 1);
	assert.equal((await resolver.single(exactSingle, elements, record)).option, '5.1');
	assert.deepEqual(selected, [2]);
	assert.deepEqual(
		JSON.parse(JSON.parse(lastRequest!.data).messages[1].content).选项,
		numberedOptions.map((text, index) => ({ 编号: index + 1, 内容: text }))
	);
	assert.equal((await resolver.single(exactSingle, elements.slice(1), record)).finish, false);
	assert.deepEqual(selected, [2]);

	output = { choices: [2, 3, 5] };
	const exactMultiple = await requestDeepSeekAnswer({ ...numberedQuestion, type: 'multiple' }, 1);
	selected.length = 0;
	assert.equal((await resolver.multiple(exactMultiple, elements, record)).finish, true);
	assert.deepEqual(selected, [2, 3, 5]);

	output = { judgement: false };
	const [judgement] = await requestDeepSeekAnswer({ ...env, type: 'judgement' }, 1);
	assert.equal(resolveJudgement([[judgement.results[0].answer]], ['对', '错']).option, '错');

	output = { answers: ['第一空;含分隔符', '第二空'] };
	const completion = { ...env, type: 'completion' };
	const context = { blankCount: 2, cacheContext: 'test' };
	const [blanks] = await requestDeepSeekAnswer(completion, 1, context);
	assert.deepEqual(resolveCompletion([[blanks.results[0].answer]], 2).answers, output.answers);
	assert.deepEqual(blanks.results[0].extra_data, { ai: true, deepSeekContext: 'test' });

	const imageUrl = 'https://example.com/question.png';
	const image = 'data:image/png;base64,ZmFrZQ==';
	output = { choices: [1] };
	const [picture] = await requestDeepSeekAnswer(
		{
			...env,
			options: [`A. ${imageUrl}`, options[1]],
			images: [image],
			suggestion_options: ['A. [图片1]', options[1]]
		},
		1
	);
	assert.equal(resolveSingle([picture.results[0].answer], [`A. ${imageUrl}`, options[1]]).option, `A. ${imageUrl}`);
	assert.deepEqual(JSON.parse(lastRequest!.data).messages[1].content[2], {
		type: 'image_url',
		image_url: { url: image }
	});

	output = { choices: [99] };
	assert.match((await requestDeepSeekAnswer(env, 1))[0].error!, /编号无效/);
	output = { answers: [options[1]] };
	assert.match((await requestDeepSeekAnswer({ ...env, type: 'unknown' }, 1))[0].error!, /格式与题型不匹配/);
	output = { answers: ['只有一空'] };
	const [missingBlank] = await requestDeepSeekAnswer(completion, 1, context);
	assert.match(missingBlank.error!, /空位数量/);
	assert.equal(missingBlank.requestFailed, false);
	finishReason = 'length';
	assert.match((await requestDeepSeekAnswer(env, 1))[0].error!, /完整答案/);
	for (const [code, errorMessage] of [
		[401, /API Key 无效/],
		[402, /余额不足/]
	] as const) {
		status = code;
		const before = requestCount;
		const [failed] = await requestDeepSeekAnswer(env, 2);
		assert.match(failed.error!, errorMessage);
		assert.equal(failed.stopWork, true);
		assert.equal(failed.requestFailed, true);
		assert.equal(requestCount - before, 1);
	}

	finishReason = 'stop';
	output = { choices: [2] };
	status = 200;
	nextStatuses.push(429, 200);
	let before = requestCount;
	assert.equal((await requestDeepSeekAnswer(env, 3))[0].results.length, 1);
	assert.equal(requestCount - before, 2);
	status = 429;
	before = requestCount;
	assert.match((await requestDeepSeekAnswer(env, 3))[0].error!, /过于频繁/);
	assert.equal(requestCount - before, 2);

	saveDeepSeekApiKey(' ');
	assert.equal(isDeepSeekConfigured(), false);
});

test('账号错误结束本轮，跳过其余题目和提交', async () => {
	require('browser-env')();
	(globalThis as any).unsafeWindow = {};
	const { OCSWorker } = await import('../packages/core/src/core/worker/worker');
	const { $message } = require('easy-us');
	const showError = $message.error;
	$message.error = () => undefined;

	try {
		const root = document.createElement('div');
		root.innerHTML = '<p class="title">测试题</p><button class="choice">A</button>';
		let requests = 0;
		let clicks = 0;
		let submitted = false;
		const worker = new OCSWorker({
			root: [root, root.cloneNode(true) as HTMLElement],
			elements: { title: '.title', options: '.choice' },
			thread: 1,
			answerer: async () => {
				requests++;
				return [{ name: 'DeepSeek', results: [], stopWork: true, error: '余额不足' }];
			},
			work: {
				type: 'single',
				handler: () => {
					clicks++;
				}
			}
		});
		const results = await worker.doWork();
		worker.uploadHandler({
			results,
			type: 'force',
			callback: () => {
				submitted = true;
			}
		});
		assert.equal(worker.isClose, true);
		assert.equal(requests, 1);
		assert.equal(clicks, 0);
		assert.equal(submitted, false);
		assert.equal(results[0].error, '余额不足');
		assert.equal(results[1].requested, false);
	} finally {
		$message.error = showError;
	}
});
