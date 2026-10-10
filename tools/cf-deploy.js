const TOKEN=process.env.CF_TOKEN||'';
const H={Authorization:'Bearer '+TOKEN};
async function main(){
  // discover account id + project from token
  let who=await fetch('https://api.cloudflare.com/client/v4/accounts',{headers:H});
  console.log('accounts',who.status, await who.text().then(t=>t.slice(0,300)));
}
main().catch(err=>console.log('ERR',err.message));
