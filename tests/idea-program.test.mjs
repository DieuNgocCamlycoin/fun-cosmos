import test from 'node:test';
import assert from 'node:assert/strict';
import { checkProgram, isFunRichUrl, isBnbWallet, makeFunRichBatch, splitFunRichBatch } from '../src/lib/idea-program.ts';
const wallet='0x'+'a'.repeat(40);
const complete={title:'Thành phố ánh sáng',story:'Câu chuyện '.repeat(95),facebookPostUrl:'https://www.facebook.com/share/p/1jZZTMaauY/',funRichPostUrl:'https://fun.rich/posts/example',funRichUrl:'https://fun.rich/angel',recipientWallet:wallet};
test('the unified participation requires 1000 story characters and all reward evidence',()=>{
  assert.equal(checkProgram({...complete,story:'a'.repeat(999)},true)?.stage,0);
  assert.equal(checkProgram({...complete,story:'a'.repeat(1000)},true),null);
  assert.equal(checkProgram({...complete,funRichPostUrl:''},true)?.stage,1);
  assert.equal(checkProgram({...complete,recipientWallet:'0x123'},true)?.stage,1);
  assert.equal(checkProgram(complete,false)?.stage,2);
});
test('real FUN.Rich links and BNB wallets pass; lookalike URLs fail',()=>{
  assert.equal(isFunRichUrl('https://fun.rich/angel'),true);
  assert.equal(isFunRichUrl('https://fun.rich.evil.test/post'),false);
  assert.equal(isFunRichUrl('https://user:pass@fun.rich/post'),false);
  assert.equal(isBnbWallet(wallet),true);
  assert.equal(isBnbWallet('0xabc'),false);
});
test('batch file sums multiple selected ideas by verified wallet and excludes unapproved entries',()=>{
  const csv=makeFunRichBatch([
    {rewardStatus:'approved',rewardAmount:99999,wallet},
    {rewardStatus:'reward_pending',rewardAmount:100001,wallet},
    {rewardStatus:'not_selected',rewardAmount:99999,wallet},
    {rewardStatus:'approved',rewardAmount:99999,wallet:'=HYPERLINK("evil")'},
  ]);
  assert.equal(csv,`${wallet},200000\n`);
});
test('FUN.Rich import files stay within its 99-recipient limit',()=>{
  const rows=Array.from({length:100},(_,index)=>({rewardStatus:'approved',rewardAmount:99999,wallet:'0x'+index.toString(16).padStart(40,'0')}));
  const files=splitFunRichBatch(makeFunRichBatch(rows));
  assert.equal(files.length,2);
  assert.equal(files[0].trim().split('\n').length,99);
  assert.equal(files[1].trim().split('\n').length,1);
});
