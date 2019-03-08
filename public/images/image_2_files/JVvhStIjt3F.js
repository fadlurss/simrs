if (self.CavalryLogger) { CavalryLogger.start_js(["krJHg"]); }

__d("MNTLimitActionHandler",["MNTActions"],(function(a,b,c,d,e,f){a={performAction:function(a){var c=b("MNTActions"),d=c.getObjectOnActionStore(a.actionid);d="remaining"in d?parseInt(d.remaining,10):a.limit;if(d===0)return;c.setObjectOnActionStore(a.actionid,{remaining:d-1});c.performAction(a.action)}};e.exports=a}),null);