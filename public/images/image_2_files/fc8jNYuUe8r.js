if (self.CavalryLogger) { CavalryLogger.start_js(["wZlZT"]); }

__d("generateLiteTypedLogger",["Banzai"],(function(a,b,c,d,e,f,g){"use strict";function a(a){return{log:function(b){g.post(a,b,g.BASIC)},logVital:function(b){g.post(a,b,g.VITAL)},logImmediately:function(b){g.post(a,b,{signal:!0})}}}e.exports=a}),null);
__d("MScrollFrameDropTypedLoggerLite",["Banzai","generateLiteTypedLogger"],(function(a,b,c,d,e,f,g,h){"use strict";e.exports=h("logger:MScrollFrameDropLoggerConfig")}),null);
__d("MScrollFrameDropTracking",["MScrollFrameDropTypedLoggerLite","Stratcom","performanceAbsoluteNow","requestAnimationFrame","throttle"],(function(a,b,c,d,e,f,g,h,i,j,k){"use strict";__p&&__p();var l=g.log,m=!1,n=16,o=200,p=50,q=!1,r=0,s={init:function(){__p&&__p();if(m)return;m=!0;h.listen("scroll",null,k(function(){__p&&__p();r=s._getCurrentTime();if(r===0||q)return;q=!0;var a=0,b=0,c=r;j(function d(e){var f=s._getCurrentTime();e=Math.round(f-e);e=Math.round(e/n)-1;e=Math.max(e,0);a+=e;e>=4&&(b+=e/4);f-r>o+p?(s._reset(),s._logScroll(a,b,Math.round(f-c))):j(d.bind(null,f))}.bind(null,r))},o))},_logScroll:function(a,b,c){l({total_frames_dropped:a,total_four_frames_dropped:b,scroll_time_in_ms:c,url:window.location.href})},_reset:function(){q=!1,r=0},_getCurrentTime:function(){return i()||0}};e.exports=s}),null);
__d("MFeedMoreItemsTypedLoggerLite",["Banzai","generateLiteTypedLogger"],(function(a,b,c,d,e,f,g,h){"use strict";e.exports=h("logger:MFeedMoreItemsLoggerConfig")}),null);
__d("MStorySpeedLogger",["MFeedMoreItemsTypedLoggerLite","Stratcom","SubscriptionsHandler","uuid"],(function(a,b,c,d,e,f,g,h,i,j){__p&&__p();var k=g.log,l=new i(),m=!1,n=null,o=!1,p=null;function q(){r(),m=!1,l.release(),l.engage()}function r(){o=!1,p=null}function s(a){if(a.getData()!==n||o)return;o=!0;p=j();u("spinner_visible")}function t(a){if(a.getData()!==n||!o)return;u("items_loaded");r()}function u(a){var b=v();if(b===0||p===null)return;k({client_event_time:b,event_type:a,load_id:p})}function v(){return Date.now()||0}a={init:function(a){if(m)return;m=!0;n=a;l.addSubscriptions(h.listen("m:page:unload",null,q),h.listen("m:more_item_automatic:spinner_visible",null,s),h.listen("m:more_item_automatic:items_loaded",null,t))}};e.exports=a}),null);