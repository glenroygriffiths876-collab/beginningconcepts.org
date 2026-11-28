import test from 'node:test';import assert from 'node:assert/strict';import worker from './worker.mjs';
const call=(id,origin,body,env={})=>worker.fetch(new Request('https://example.test/v1/'+id,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)}),env);
const origin='https://beginningconcepts.org';
test('unknown tenant denied',async()=>assert.equal((await call('ella',origin,{message:'hello'})).status,403));
test('wrong origin denied',async()=>assert.equal((await call('beginning-concepts','https://other.test',{message:'hello'})).status,403));
test('prototype tenant denied',async()=>assert.equal((await call('__proto__',origin,{message:'hello'})).status,403));
test('client knowledge rejected',async()=>assert.equal((await call('beginning-concepts',origin,{message:'hello',knowledge:'secret'})).status,400));
test('no quota no inference',async()=>assert.equal((await call('beginning-concepts',origin,{message:'hello'},{AI:{run(){throw Error('must not run')}}})).status,503));
test('quota rejection prevents inference',async()=>assert.equal((await call('beginning-concepts',origin,{message:'hello'},{ENABLE_INFERENCE:'true',AI:{run(){throw Error('must not run')}},QUOTA:{fetch:async()=>new Response(null,{status:429})}})).status,429));
