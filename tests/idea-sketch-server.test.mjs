import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { z } from 'zod';

// Execute the actual server handler with a scripted database, without making live writes.
const source = readFileSync(new URL('../src/lib/ideas.functions.ts', import.meta.url), 'utf8');
const handlerSource = source.slice(source.indexOf('export const submitIdeaSketch'), source.indexOf('export const listMyIdeas')).replace('export const submitIdeaSketch =', 'return');
const id = '00000000-0000-4000-8000-000000000001';
function setup(responses) {
  const log = [];
  const admin = {
    from(table) {
      const query = {};
      for (const method of ['select', 'eq', 'in', 'update']) query[method] = (...args) => { log.push({table, method, args}); return query; };
      query.maybeSingle = async () => responses.shift();
      return query;
    },
    rpc: async (name) => { log.push({rpc: name}); return responses.shift(); },
  };
  const createServerFn = () => ({
    middleware() { return this; },
    inputValidator(validate) { this.validate = validate; return this; },
    handler(fn) { return async data => fn({data: this.validate(data), context: {userId: id}}); },
  });
  const submit = new Function('createServerFn', 'requireSupabaseAuth', 'submitSchema', 'requireVerifiedEmail', 'adminClient', handlerSource)(createServerFn, {}, z.object({id:z.string().uuid()}), async user => { assert.equal(user,id); }, async () => admin);
  return {submit, log};
}
const idea = {id, title:'mở khách sạn', summary:'ý tưởng ngắn', status:'draft', character_description:'angel',dream:'mở khách sạn',gameplay:'',angel_ai:'',reward:'',world_change:'',real_world_connection:'', public_code:null, submitted_at:null};
test('short sketch gets a confirmed receipt without requiring story, Facebook, wallet or reward fields', async () => {
  const {submit,log} = setup([{data:idea},{data:{consent_accuracy:true}},{data:'FC-2026-000128'},{data:{public_code:'FC-2026-000128',submitted_at:'2026-09-28T00:00:00Z'}}]);
  const result = await submit({id});
  assert.equal(result.code,'FC-2026-000128');
  assert.deepEqual(log.filter(x=>x.method==='update').map(x=>Object.keys(x.args[0]).sort()), [['public_code','status','submitted_at']]);
  assert.equal(log.some(x=>x.table?.includes('rewards') || x.table==='fun_cosmos_submissions'),false);
});
test('retry of the same submitted sketch returns the existing receipt without another write', async () => {
  const {submit,log}=setup([{data:{...idea,status:'submitted',public_code:'FC-existing',submitted_at:'2026-09-28T00:00:00Z'}}]);
  assert.equal((await submit({id})).code,'FC-existing');
  assert.equal(log.some(x=>x.method==='update'||x.rpc),false);
});
test('failed write does not return success or delete any content',async()=>{
  const {submit,log}=setup([{data:idea},{data:{consent_accuracy:true}},{data:'FC-code'},{data:null,error:{message:'offline'}}]);
  await assert.rejects(submit({id}),/Bản nháp vẫn được giữ lại/);
  assert.equal(log.some(x=>x.method==='delete'),false);
});
test('missing ownership or consent prevents a submission write',async()=>{
  for(const responses of [[{data:null}],[{data:idea},{data:{consent_accuracy:false}}]]){
    const {submit,log}=setup(responses);
    await assert.rejects(submit({id}));
    assert.equal(log.some(x=>x.method==='update'||x.rpc),false);
  }
});
