// Public client: never embed a pilot key or other secret.
export function createAssistant({endpoint,application,fallback,timeout=18000}){
 if(!/^[a-z0-9-]+$/.test(application)||typeof fallback!=="function")throw new Error("Invalid assistant configuration");
 const history=[];
 return {reset(){history.length=0},async ask(message){
 if(typeof message!=="string"||!message.trim()||message.length>1200)throw new Error("Invalid message");
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);
 let reply,mode="local";
 try{
 const response=await fetch(endpoint.replace(/\/$/,"")+"/v1/"+application,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,history:history.slice(-8)}),signal:controller.signal});
 if(!response.ok)throw new Error("Gateway unavailable");
 const data=await response.json();if(typeof data.reply!=="string"||!data.reply.trim())throw new Error("Invalid reply");
 reply=data.reply;mode="cloud";
 }catch{reply=await fallback(message,history.slice(-8))}finally{clearTimeout(timer)}
 history.push({role:"user",content:message},{role:"assistant",content:reply});if(history.length>8)history.splice(0,history.length-8);
 return {reply,mode};
 }};
}
