import test from 'node:test';import assert from 'node:assert/strict';import worker from './worker.mjs';
const call=(id,origin,body,env={})=>worker.fetch(new Request('https://example.test/v1/'+id,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)}),env);
const origin='https://beginningconcepts.org';
test('unknown tenant denied',async()=>assert.equal((await call('ella',origin,{message:'hello'})).status,403));
test('wrong origin denied',async()=>assert.equal((await call('beginning-concepts','https://other.test',{message:'hello'})).status,403));
test('prototype tenant denied',async()=>assert.equal((await call('__proto__',origin,{message:'hello'})).status,403));
test('client knowledge rejected',async()=>assert.equal((await call('beginning-concepts',origin,{message:'hello',knowledge:'secret'})).status,400));
test('no quota no inference',async()=>assert.equal((await call('beginning-concepts',origin,{message:'hello'},{AI:{run(){throw Error('must not run')}}})).status,503));
test('quota rejection prevents inference',async()=>assert.equal((await call('beginning-concepts',origin,{message:'hello'},{ENABLE_INFERENCE:'true',AI:{run(){throw Error('must not run')}},QUOTA:{idFromName:()=> 'global',get:()=>({fetch:async()=>new Response(null,{status:429})})}})).status,429));

test('registered but unapproved Ella origin denied',async()=>assert.equal((await call('service-excellence',origin,{message:'hello'})).status,403));
test('large prompt rejected',async()=>assert.equal((await call('beginning-concepts',origin,{message:'x'.repeat(1201)})).status,400));

test('health endpoint works without AI',async()=>{const r=await worker.fetch(new Request('https://example.test/health'),{});assert.equal(r.status,200)});
test('unknown origin preflight denied',async()=>{const r=await worker.fetch(new Request('https://example.test/v1/beginning-concepts',{method:'OPTIONS',headers:{Origin:'https://evil.test'}}),{});assert.equal(r.status,403)});
test('allowed origin preflight accepted',async()=>{const r=await worker.fetch(new Request('https://example.test/v1/beginning-concepts',{method:'OPTIONS',headers:{Origin:origin}}),{});assert.equal(r.status,204)});
test('quota fails shut after daily limit',async()=>{const {Quota}=await import('./worker.mjs');let stored={day:new Date().toISOString().slice(0,10),count:20};const q=new Quota({storage:{transaction:async fn=>fn({get:async()=>stored,put:async(_k,v)=>{stored=v}})}});const r=await q.fetch(new Request('https://quota.internal/reserve',{method:'POST',body:JSON.stringify({tenant:'beginning-concepts',units:1})}));assert.equal(r.status,429);assert.equal(stored.count,20)});
