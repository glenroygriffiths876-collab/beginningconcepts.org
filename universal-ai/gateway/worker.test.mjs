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
test('quota fails shut after daily limit',async()=>{const {Quota}=await import('./worker.mjs');let stored={day:new Date().toISOString().slice(0,10),count:8000};const q=new Quota({storage:{transaction:async fn=>fn({get:async()=>stored,put:async(_k,v)=>{stored=v}})}});const r=await q.fetch(new Request('https://quota.internal/reserve',{method:'POST',body:JSON.stringify({tenant:'beginning-concepts',units:1})}));assert.equal(r.status,429);assert.equal(stored.count,8000)});

test('mock AI success returns tenant assistant and does not leak another profile',async()=>{
 let invoked=0;
 const env={ENABLE_INFERENCE:'true',QUOTA:{idFromName:()=> 'global',get:()=>({fetch:async()=>new Response(null,{status:204})})},AI:{run:async(_model,payload)=>{invoked++;assert.match(payload.messages[0].content,/Beginning Concepts/);assert.doesNotMatch(payload.messages[0].content,/internal CSAT report/);return {response:'Welcome to Beginning Concepts'}}}};
 const r=await call('beginning-concepts',origin,{message:'What do you do?'},env);
 assert.equal(r.status,200);assert.equal((await r.json()).assistant,'Gia');assert.equal(invoked,1);
});
test('malformed request shape rejected',async()=>{
 assert.equal((await call('beginning-concepts',origin,[],{})).status,400);
 assert.equal((await call('beginning-concepts',origin,{message:'hi',history:{}},{})).status,400);
});

test('admin page loads but statistics require secret',async()=>{
 const page=await worker.fetch(new Request('https://example.test/admin'),{});
 assert.equal(page.status,200);assert.match(await page.text(),/Universal Gia/);
 const denied=await worker.fetch(new Request('https://example.test/admin/usage'),{});
 assert.equal(denied.status,403);
});
test('admin usage shows request counts but does not claim neuron consumption',async()=>{
 const {Quota}=await import('./worker.mjs');
 const values=new Map([['daily',{day:new Date().toISOString().slice(0,10),count:3}],['tenant-counts',{day:new Date().toISOString().slice(0,10),counts:{'beginning-concepts':3}}]]);
 const quota=new Quota({storage:{get:async key=>values.get(key)}});
 const env={ADMIN_TOKEN:'test-token',QUOTA:{idFromName:()=> 'global',get:()=>({fetch:req=>quota.fetch(new Request(req))})}};
 const denied=await worker.fetch(new Request('https://example.test/admin/usage',{headers:{Authorization:'Bearer wrong'}}),env);
 assert.equal(denied.status,403);
 const response=await worker.fetch(new Request('https://example.test/admin/usage',{headers:{Authorization:'Bearer test-token'}}),env);
 assert.equal(response.status,200);
 const data=await response.json();
 assert.equal(data.requestsToday,3);
 assert.equal(data.byBot.find(b=>b.id==='beginning-concepts').requests,3);
 assert.equal(data.aiNeuronsUsed,null);
 assert.equal(data.aiNeuronUsageVerified,false);
});
