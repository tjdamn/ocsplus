import assert from 'node:assert/strict';
import { test } from 'node:test';
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
	let output: object = {};
	let finishReason = 'stop';
	let lastRequest: Parameters<NonNullable<typeof gm.GM_xmlhttpRequest>>[0] | undefined;
	gm.GM_getValue = (key, fallback) => storage.get(key) ?? fallback;
	gm.GM_setValue = (key, value) => void storage.set(key, value);
	gm.GM_deleteValue = (key) => void storage.delete(key);
	gm.GM_xmlhttpRequest = (request) => {
		lastRequest = request;
		request.onload({
			status,
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

	const env: AnswererEnv = { type: 'single', title: '示例题目', options: 'A. 第一项\nB. 第二项\nC. 第三项' };
	const options = env.options.split('\n');

	assert.equal(isDeepSeekConfigured(), false);
	assert.match((await requestDeepSeekAnswer(env, [], 1))[0].error!, /API Key/);
	assert.equal(lastRequest, undefined);

	saveDeepSeekApiKey(' mock-api-key ');
	assert.equal(isDeepSeekConfigured(), true);
	output = { choices: [2] };
	const [single] = await requestDeepSeekAnswer(env, [], 1);
	assert.equal(resolveSingle([single.results[0].answer], options).option, options[1]);
	assert.equal(lastRequest!.url, DEEPSEEK_API_URL);
	assert.equal(lastRequest!.headers.Authorization, 'Bearer mock-api-key');
	assert.equal(lastRequest!.data.includes('mock-api-key'), false);
	assert.equal(JSON.parse(lastRequest!.data).model, 'deepseek-flash');

	output = { choices: [1, 3] };
	const [multiple] = await requestDeepSeekAnswer({ ...env, type: 'multiple' }, [], 1);
	assert.deepEqual(resolveMultiple([multiple.results[0].answer], options).options, [options[0], options[2]]);

	output = { judgement: false };
	const [judgement] = await requestDeepSeekAnswer({ ...env, type: 'judgement' }, [], 1);
	assert.equal(resolveJudgement([[judgement.results[0].answer]], ['对', '错']).option, '错');

	output = { answers: ['第一空;含分隔符', '第二空'] };
	const completion = { ...env, type: 'completion' };
	const context = { blankCount: 2, cacheContext: 'test' };
	const [blanks] = await requestDeepSeekAnswer(completion, [], 1, context);
	assert.deepEqual(resolveCompletion([[blanks.results[0].answer]], 2).answers, output.answers);
	assert.deepEqual(blanks.results[0].extra_data, { ai: true, deepSeekContext: 'test' });

	const imageUrl = 'https://example.com/question.png';
	const image = 'data:image/png;base64,ZmFrZQ==';
	output = { choices: [1] };
	const [picture] = await requestDeepSeekAnswer(
		{ ...env, images: [image], suggestion_options: 'A. [图片1]\nB. 第二项' },
		[imageUrl],
		1
	);
	assert.equal(resolveSingle([picture.results[0].answer], [`A. ${imageUrl}`, options[1]]).option, `A. ${imageUrl}`);
	assert.deepEqual(JSON.parse(lastRequest!.data).messages[1].content[2], {
		type: 'image_url',
		image_url: { url: image }
	});

	output = { choices: [99] };
	assert.match((await requestDeepSeekAnswer(env, [], 1))[0].error!, /编号无效/);
	output = { answers: ['只有一空'] };
	assert.match((await requestDeepSeekAnswer(completion, [], 1, context))[0].error!, /空位数量/);
	finishReason = 'length';
	assert.match((await requestDeepSeekAnswer(env, [], 1))[0].error!, /完整答案/);
	status = 401;
	assert.match((await requestDeepSeekAnswer(env, [], 1))[0].error!, /API Key 无效/);
	status = 429;
	assert.match((await requestDeepSeekAnswer(env, [], 1))[0].error!, /过于频繁/);

	saveDeepSeekApiKey(' ');
	assert.equal(isDeepSeekConfigured(), false);
});
