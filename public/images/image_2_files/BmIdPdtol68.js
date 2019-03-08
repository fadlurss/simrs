if (self.CavalryLogger) { CavalryLogger.start_js(["UO89c"]); }

__d("MNTAsyncMultiActionHandler",["DOM","FBJSON","FBLogger","MNTStateStore","MRequest","MResponseData","NativeTemplatesQuickLogModule","QuickPerformanceLogger","XNTAsyncController","ge","invariant","MNTActions"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){"use strict";__p&&__p();var r=Object.freeze({ANY_ORDER:"ANY_ORDER",BLOCKING:"BLOCKING",CANCEL_PENDING:"CANCEL_PENDING",FIRE_ONCE:"FIRE_ONCE",REQUEST_ORDER:"REQUEST_ORDER"}),s={performAction:function(a){__p&&__p();a.actionid&&(n.markerStart(m.MTOUCH_ASYNC_ACTION,a.actionid),n.annotateMarkerString(m.MTOUCH_ASYNC_ACTION,"async_payload",a["async-payload"],a.actionid));"send-actions"in a&&this._performActions(a["send-actions"]);var c={};if("form-id"in a){var d=p(a["form-id"]);d!==null&&d!==void 0&&(c=this._getRequestDataFromForm(d))}d=a.type;if(d===r.ANY_ORDER){this._fireAction(a,0,a.actionid,d,c);return}var e=b("MNTActions"),f=e.getObjectOnActionStore(a.actionid);f=Object.assign({sequenceNum:-1,payloads:new Map()},f);f instanceof Object||q(0,3561);var g=f.payloads;g instanceof Map||q(0,3561);f=f.sequenceNum+1;switch(d){case r.BLOCKING:case r.FIRE_ONCE:if(g.size>0)return;g.set(f,null);break;case r.CANCEL_PENDING:g=new Map().set(f,null);break;case r.REQUEST_ORDER:g.set(f,null);break}e.setObjectOnActionStore(a.actionid,{sequenceNum:f,payloads:g});this._fireAction(a,f,a.actionid,d,c)},_fireAction:function(a,b,c,d,e){__p&&__p();var f=this,g=new k(o.getURIBuilder().getURI()),i=null;if(a["state-ids"]!==null&&a["state-ids"]!==void 0){var m={};Object.entries(JSON.parse(a["state-ids"])).forEach(function(a){var b=a[0];a=a[1];return m[b]=j.getState(String(a))});i=h.stringify(m)}g.setMethod("POST");g.setData({payload:a["async-payload"],data:JSON.stringify(e),state:(e=i)!=null?e:""});g.setAutoProcess(!1);g.listen("done",function(a){s._onSuccess(a,b,c,d);var e=new l(a);a=g.invoke("process",{request:g,response:e,data:a});a.getStopped()||e.process()});"failure-actions"in a&&g.listen("error",function(){f._performActions(a["failure-actions"])});g.send()},_performActions:function(a){__p&&__p();for(var a=a,c=Array.isArray(a),d=0,a=c?a:a[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var e;if(c){if(d>=a.length)break;e=a[d++]}else{d=a.next();if(d.done)break;e=d.value}e=e;var f=b("MNTActions");f.performAction(e)}},_onSuccess:function(a,c,d,e){__p&&__p();var f=a.payload;if(!f){i("native_templates").warn("Empty async action payload. Data object is: %s",JSON.stringify(a));return}a=f.actions;if(e===r.ANY_ORDER){this._performActions(a);return}var g=b("MNTActions"),h=g.getObjectOnActionStore(d);h instanceof Object||q(0,3561);h=h.payloads;h instanceof Map||q(0,3561);if(!h.has(c))return;if(g.isActionCanceled(d))return;switch(e){case r.BLOCKING:case r.CANCEL_PENDING:this._performActions(a);h=new Map();break;case r.FIRE_ONCE:this._performActions(a);break;case r.REQUEST_ORDER:h.set(c,f);for(var e=h.entries(),a=Array.isArray(e),c=0,e=a?e:e[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){if(a){if(c>=e.length)break;f=e[c++]}else{c=e.next();if(c.done)break;f=c.value}f=f;var j=f[0];f=f[1];if(f===null)break;this._performActions(f.actions);h["delete"](j)}break}g.setObjectOnActionStore(d,{payloads:h});d&&n.markerEnd(m.MTOUCH_ASYNC_ACTION,"SUCCESS",d)},_getRequestDataFromForm:function(a){__p&&__p();var b={};a=g.convertFormToListOfPairs(a);for(var c=0;c<a.length;c++){var d=a[c][0];if(d.substr(-2)==="[]"){var e=d.slice(0,-2);e in b?b[e].push(a[c][1]):b[e]=[a[c][1]]}else b[d]=a[c][1]}return b}};e.exports=s}),null);