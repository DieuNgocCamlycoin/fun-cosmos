import test from 'node:test';
import assert from 'node:assert/strict';
import { sketchContent } from '../src/lib/idea-sketch.ts';
import { isFacebookPostUrl, STORY_MIN } from '../src/lib/idea-content.ts';

test('short Vietnamese answers remain submission content without a 1000-character gate', () => {
  const fields = ['angel', 'mở khách sạn', 'nấu ăn, giúp mọi người', 'gợi ý kế hoạch', 'huy hiệu', 'môi trường sạch đẹp', 'thiền cộng đồng'];
  const result = sketchContent(fields);
  assert.equal(result.title, 'mở khách sạn');
  assert.equal(result.characterDescription, 'angel');
  assert.equal(result.realWorldConnection, 'thiền cộng đồng');
  for (const answer of fields) assert.ok(result.story.includes(answer));
  assert.ok(result.story.length < STORY_MIN);
});
test('metadata fits database limits while every full answer remains in the submission', () => {
  const fields = Array.from({length: 7}, (_, i) => `ý ${i} ` + 'a'.repeat(990));
  const result = sketchContent(fields);
  assert.ok(result.title.length <= 140);
  assert.ok(result.summary.length <= 500);
  for (const answer of fields) assert.ok(result.story.includes(answer));
});
test('Facebook share links from the reported failure are accepted; impostor domains rejected', () => {
  assert.equal(isFacebookPostUrl('https://www.facebook.com/share/p/1jZZTMaauY/'), true);
  assert.equal(isFacebookPostUrl('https://facebook.com.evil.test/post'), false);
  assert.equal(isFacebookPostUrl('https://user:password@facebook.com/post'), false);
});
