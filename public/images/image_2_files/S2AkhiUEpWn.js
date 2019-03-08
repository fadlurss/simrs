if (self.CavalryLogger) { CavalryLogger.start_js(["+2AtO"]); }

__d("MGenericJewel",["CSS","Event","MHistory","MJewels","MParent","MViewport","ScriptPath","Stratcom","SubscriptionsHandler"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){__p&&__p();var p={};function a(a,b,c,d){__p&&__p();if(p[a])return;var e=new o();p[a]=e;var f,q;e.addSubscriptions(h.listen(b,"click",function(b){k.bySigil(b.target,"icon")&&(b.preventDefault(),!f?(i.pushSoftState(a),n.invoke("MGenericJewel::clicked",a,{open:!0})):a===j.SEARCH&&n.invoke("m:chrome:tab:show",a,{open:!0}),m.set("topbar_"+a))}),n.listen("m:history:change",null,function(d){var e=d.getData().soft===a;!e&&(f||q)&&n.invoke("m:chrome:tab:hide",a);g.conditionClass(b,"popoverOpen",e);c&&!r&&(g.conditionClass(c,"popover_hidden",!e),g.conditionClass(c,"popover_visible",e),e&&(c.style.minHeight=l.getUseableHeight()+"px"));e&&!f&&(n.invoke("m:chrome:tab:show",a),g.addClass(b,"noCount"),g.removeClass(b,"hasCount"));q=d.getData().soft===void 0;f=e}));var r=!1;a===j.SEARCH&&c&&e.addSubscriptions(n.listen("m:graph-search:rendered",null,function(){g.conditionClass(c,"popover_hidden",!0),r=!0}));d&&e.addSubscriptions(n.listen("m:page:unload",null,function(){e.release(),p[a]=void 0}))}e.exports={init:a}}),null);
__d("MJewelLite",["CSS","DOM","EventEmitter","MHistory","MLinkHack","MURI","Stratcom","$","intlNumUtils","invariant"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){"use strict";__p&&__p();a=function(a){__p&&__p();babelHelpers.inheritsLoose(b,a);function b(b,c){__p&&__p();var d;d=a.call(this)||this;d.$MJewelLite1=b;var e=n("mJewelNav");d.$MJewelLite2=h.find(e,"div",b);d.$MJewelLite3=h.find(d.$MJewelLite2,"span","count");d.$MJewelLite4=h.find(d.$MJewelLite2,"a","icon");d.$MJewelLite6=c.jewelActivePaths;d.$MJewelLite5=c.initialCount;d.$MJewelLite7=c.keepBadgeOnActive||!1;return d}var c=b.prototype;c.init=function(){var a=this;this.$MJewelLite8();this.$MJewelLite9();m.listen("m:history:change",null,function(){a.$MJewelLite9()});h.listen(this.$MJewelLite2,"click",null,function(){return a.$MJewelLite10()})};c.isActive=function(){return g.hasClass(this.$MJewelLite2,"popoverOpen")};c.getBadgeCount=function(){return this.$MJewelLite5};c.setBadgeCount=function(a,b){b===void 0&&(b=!1);if(this.$MJewelLite5===a||a<0)return;if(this.isActive()&&!b)return;b=this.$MJewelLite5;this.$MJewelLite5=a;this.$MJewelLite8();this.emit("badge-updated",{previousBadgeCount:b,newBadgeCount:a})};c.$MJewelLite8=function(){h.setContent(this.$MJewelLite3,o.formatNumberWithThousandDelimiters(this.$MJewelLite5)),g.conditionClass(this.$MJewelLite2,"noCount",!this.$MJewelLite5),g.conditionClass(this.$MJewelLite2,"hasCount",this.$MJewelLite5>0)};c.$MJewelLite9=function(){var a=this.isActive(),b=new l(j.getPath()).getPath();b=!j.hasSoftState()&&this.$MJewelLite6.includes(b);g.conditionClass(this.$MJewelLite2,"popoverOpen",b);!a&&b&&this.$MJewelLite11()};c.$MJewelLite11=function(){this.$MJewelLite7||this.setBadgeCount(0,!0)};c.$MJewelLite10=function(){this.emit("jewel-click")};c.getLink=function(){var a=k.getHref(this.$MJewelLite4);a!=null||p(0,13524,this.$MJewelLite1);return new l(a)};c.getSigil=function(){return this.$MJewelLite1};return b}(i);e.exports=a}),null);
__d("MJewelLiteLogging",["MJewelsLogger"],(function(a,b,c,d,e,f,g){"use strict";__p&&__p();var h=[];function a(a,b){if(h.includes(a))return;h.push(a);var c=!1;a.addListener("jewel-click",function(){a.isActive()||g.markJewelClick(a.getSigil(),{isFirstClick:!c,badgeCount:a.getBadgeCount(),jewelBehavior:"permalink",isPrefetching:b.isPrefetching,initialPrefetchPhase:b.prefetchOnStart?"after-tti":null}),c=!0})}e.exports={trackJewelClick:a}}),null);
__d("MJewelLitePrefetcher",["MPageCache","MPageFetcher","onAfterTTI"],(function(a,b,c,d,e,f,g,h,i){"use strict";__p&&__p();function j(a,b){a=a.getLink().toString();b&&g.removeCachedPage(a);h.prefetch(a)}function a(a){a.addListener("badge-updated",function(b){b=b.previousBadgeCount<b.newBadgeCount;b&&j(a,!0)})}function b(a){i(function(){return j(a,!1)})}e.exports={prefetchOnStart:b,prefetchOnBadgeUpdate:a}}),null);
__d("MJewelLiteReload",["MPageController","qex"],(function(a,b,c,d,e,f,g,h){"use strict";__p&&__p();var i=3*1e3,j=0;function a(a){if(!h._("832134"))return;a.isActive()&&(j=Date.now());a.addListener("jewel-activated",function(){j=Date.now()});a.addListener("jewel-click",function(){var b=Date.now()-j;!a.isActive()?j=Date.now():b>i&&(g.reload(),j=Date.now())})}e.exports={enableReloadOnActiveClick:a}}),null);
__d("MJewelSetLite",["Bootloader","MJewelLite","MJewelLiteLogging","MJewelLitePrefetcher","MJewelLiteReload","Run"],(function(a,b,c,d,e,f,g,h,i,j,k,l){"use strict";__p&&__p();var m={};function a(a,b){if(m[a])return;var c=new h(a,b);c.init();m[a]=c;b.shouldPrefetch&&(b.prefetchOnStart===!0&&j.prefetchOnStart(c),j.prefetchOnBadgeUpdate(c));i.trackJewelClick(c,{isPrefetching:b.shouldPrefetch,prefetchOnStart:b.prefetchOnStart});k.enableReloadOnActiveClick(c)}function b(a){return m[a]}function c(){l.onAfterLoad(function(){Object.keys(m).length>0&&g.loadModules(["MJewelChannelUpdates"],function(a){a.start()},"MJewelSetLite")})}e.exports={initJewel:a,getJewel:b,initialize:c}}),null);
__d("MJewelSet",["MJewelSetLite","MViewport","Popover","ScriptPath","Stratcom"],(function(a,b,c,d,e,f,g,h,i,j,k){__p&&__p();var l={_haveInitializedJewels:!1,init:function(){if(l._haveInitializedJewels)return;l._haveInitializedJewels=!0;g.initialize();k.listen("m:viewport:orientation-change",null,l._onOrientationChange);k.listen("m:jewel:flyout:open",null,l._onJewelOpen)},_onJewelOpen:function(a){a=a.getData();j.set("topbar_"+a.jewel)},_onOrientationChange:function(){setTimeout(function(){var a=i._activePopover;if(!a)return;h.getHeight()+"px"!==a.flyout.style.minHeight&&a.refreshConstraints()},800)}};e.exports=l}),null);
__d("MJewelsSafePageletLoader",["MRequest","PageletEventConstsJS","PageletEventsHelper","Stratcom"],(function(a,b,c,d,e,f,g,h,i,j){"use strict";__p&&__p();var k={};function l(a,b){var c=null,d=function(){c&&c.remove(),c=null};c=j.listen("m:page:unload",null,function(){d(),b()});i.subscribeToPageletEvents(function(b,c,e,f){b===a&&c===h.JS_END&&d()})}function m(a,b){j.listen(["m:chrome:tab:show","m:jewel:flyout:open"],a,function(){new g(b).send(),j.removeCurrentListener()})}function a(a){if(k[a.jewelSigil])return;k[a.jewelSigil]=!0;l(a.pageletID,m.bind(null,a.jewelSigil,a.retryUri))}e.exports={trackJewel:a}}),null);
__d("MBookmarksJewelClickTracking",["DOM","Event","MJewelsLogger","Stratcom","ge"],(function(a,b,c,d,e,f,g,h,i,j,k){"use strict";__p&&__p();var l=!1,m=!1,n=!0;function a(a){__p&&__p();if(l)return;l=!0;var b=g.find(k("mJewelNav"),"div","bookmarks"),c=!!a.noFlyout;h.listen(b,"click",function(){n&&(i.markJewelClick("bookmarks",{isFirstClick:!m,badgeCount:0,jewelBehavior:c?"permalink":"flyout",isPrefetching:!1,initialPrefetchPhase:null}),n=!1),m=!0});j.listen("m:side-area:show",null,function(){i.markJewelDisplayed("bookmarks")});j.listen("m:side-area:hide",null,function(){n=!0})}e.exports={init:a}}),null);
__d("XFeedNewStoriesBadgeController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/feed/badge/",{})}),null);
__d("MOutOfFeedNewStoriesPolling",["Arbiter","ArbiterToken","MPageController","MRequest","Stratcom","TimeSlice","XFeedNewStoriesBadgeController","setTimeoutAcrossTransitions"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){"use strict";__p&&__p();var o=null,p=0,q=!1,r=new g(),s=9,t=15e3;function u(){if(p>s)return;clearTimeout(o);o=n(l.guard(function(){v()},"Feed jewel count polling",{propagationType:l.PropagationType.ORPHAN}),t)}function v(){var a=m.getURIBuilder().getURI();a=new j(a);a.listen("done",function(a){x(a.payload.count)});a.listen("finally",function(){a=null,u()});a.send()}function w(){x(0),clearTimeout(o),o=null}function x(a){p=a,r.inform("MOutOfFeedNewStoriesPolling/updateCount",{count:a},"state")}function a(a){y();return r.subscribe("MOutOfFeedNewStoriesPolling/updateCount",a)}function y(){if(q)return;q=!0;k.listen("m:homepage:load",null,function(){w()});k.listen("m:homepage:unload",null,function(){u()});i.isHomeishPath(location.href)||u()}e.exports={addPollingListener:a,MAX_COUNT:s}}),null);
__d("MFeedJewel",["CSS","DOM","MHistory","MHome","MJewel","MJewelLinkFetcher","MJewels","MOutOfFeedNewStoriesPolling","MPageController","MURI","Stratcom","SubscriptionsHandler","URI","$","formatNumber","gkx"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v){__p&&__p();var w,x,y,z,A;function B(a){g.conditionClass(z,"popoverOpen",!0)}function C(a){g.conditionClass(z,"popoverOpen",!1)}function D(){if(y)return;y=new r();y.addSubscriptions(q.listen("m:history:change",null,F))}function E(){y&&y.release(),y=null}function F(a){a=a.getData().soft;for(var b=0,c=Object.keys(m);b<c.length;b++)if(m[c[b]]===a){C();return}B()}function G(a){return new p(a).normalize().toString()}function H(a){var b=l.get("feed");if(!b)return;var c=G(b),d=G(i.getPath());c===d?(a.kill(),o.reload({reloaded:!0})):I(d)&&(o.load(b,{expiration:o.EXPERIMENTAL_USER_EXPIRE_MS}),a.kill())}function I(a){if(!A)return;return A.some(function(b){return a.startsWith(b)})}function J(a){var b=u.withMaxLimit(a,n.MAX_COUNT);h.setContent(w,b);g.conditionClass(z,"noCount",a===0);g.conditionClass(z,"hasCount",a>0);g.conditionClass(z,"largeCount",b.length>1)}function K(a){q.listen("m:homepage:load",null,function(){B(),D()}),q.listen("m:homepage:unload",null,function(){C(),E()}),a&&D()}function L(a){q.listen("m:history:change",null,function(a){var b=new s(a.getData().path);b=b.getPath();a=a.getData().soft;j.isHome(b)&&!a?B():C()})}function a(a,b,c){__p&&__p();if(x)return;x=!0;z=a;w=h.find(z,"span","count");c.useCacheForPaths&&c.useCacheForPaths.length>0&&(A=c.useCacheForPaths);v("812549")?L(b):K(b);h.listen(t(k.JEWEL_NAV_NODE_ID),"click","feed",H);w&&n.addPollingListener(function(a,b){return J(b.count)})}e.exports={init:a}}),null);
__d("MTitleListener",["FBLogger","Stratcom"],(function(a,b,c,d,e,f,g,h){"use strict";__p&&__p();var i=!1,j=null,k="",l=!0;function m(){__p&&__p();if(j)return j;var a=document.getElementsByTagName("head");if(!a||!a.length)return null;a=a[0].getElementsByTagName("title");if(!a||!a.length)return null;a=a[0];if(a){a=a.childNodes;a&&a.length&&(j=a[0])}return j}function n(){var a=m();return!a?k:a.nodeValue||k}function o(a){k=a||"";typeof k!=="string"&&(k=String(k));a=m();a&&(a.nodeValue=k);h.invoke("MDocument:title",null,k)}e.exports={getTitle:function(){var a=document.title||k||"";a=typeof a==="string"?a:String(a);return a},getTitleAsString:function(a){a=a===null||a===void 0||typeof a==="object"?this.getTitle():a;a=typeof a==="string"?a:String(a);return a||""},init:function(){__p&&__p();if(i)return l;k=document.title||"";var a={get:function(){return n()},set:function(a){o(a)},enumerable:!0};try{Object.defineProperty(document,"title",a),l=!0}catch(a){l=!1}i=!0;return l}}}),null);
__d("MBackToNewsFeed",["JavelinHistory","MHistory","MHome","Stratcom"],(function(a,b,c,d,e,f,g,h,i,j){"use strict";__p&&__p();var k=!1,l=[];function m(){if(!l||!l.length)return;l.forEach(function(a){a.remove()});l=[]}var n={init:function(){n.updateHistory()},updateHistory:function(a){__p&&__p();a===void 0&&(a=!1);if(a&&k)return;k=!0;if(!n._isBrowserSupported())return;if(h.hasSoftState())return;if(history.state&&history.state.addedNewsFeed)return;a=location.href;var b=document.title;document.title="Facebook";window.history.replaceState({},"Facebook",i.HOME_PATH);window.history.pushState({addedNewsFeed:1},"Current",a);document.title=b},updateHistoryOnNav:function(a){__p&&__p();m();a=a.pattern;if(a.length){var b=new RegExp(a);l.push(j.listen("history:change",null,function(a){m();a=a.getData();if(!a||!a.path)return;a=a.path;b.test(a)&&n.updateHistory()}),j.listen("history:change-default",null,m),j.listen("m:homepage:load",null,m))}},_isBrowserSupported:function(){return g.CAN_USE_PUSH_STATE}};e.exports=n}),null);
__d("UnicodeBidiDirection",["invariant"],(function(a,b,c,d,e,f,g){"use strict";__p&&__p();b="NEUTRAL";var h="LTR",i="RTL";function j(a){return a===h||a===i}function k(a){j(a)||g(0,3045);return a===h?"ltr":"rtl"}function a(a,b){j(a)||g(0,3045);j(b)||g(0,3046);return a===b?null:k(a)}c={NEUTRAL:b,LTR:h,RTL:i,isStrong:j,getHTMLDir:k,getHTMLDirIfDifferent:a};e.exports=c}),null);
__d("UnicodeBidiGlobalDirectionCore",["UnicodeBidiDirection","invariant"],(function(a,b,c,d,e,f,g,h){"use strict";__p&&__p();var i=null;function j(a){i=a}function a(){j(g.LTR)}function b(){i||this.initDir();i||h(0,548);return i}c={setDir:j,initDir:a,getDir:b};e.exports=c}),null);
__d("UnicodeBidiGlobalDirection",["Locale","UnicodeBidiDirection","UnicodeBidiGlobalDirectionCore"],(function(a,b,c,d,e,f,g,h,i){"use strict";i.initDir=function(){i.setDir(g.isRTL()?h.RTL:h.LTR)},e.exports=i}),null);
__d("UnicodeBidi",["UnicodeBidiDirection","UnicodeBidiGlobalDirection","invariant"],(function(a,b,c,d,e,f,g,h,i){"use strict";__p&&__p();c={L:"A-Za-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02b8\u02bb-\u02c1\u02d0\u02d1\u02e0-\u02e4\u02ee\u0370-\u0373\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0482\u048a-\u052f\u0531-\u0556\u0559-\u055f\u0561-\u0587\u0589\u0903-\u0939\u093b\u093d-\u0940\u0949-\u094c\u094e-\u0950\u0958-\u0961\u0964-\u0980\u0982\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd-\u09c0\u09c7\u09c8\u09cb\u09cc\u09ce\u09d7\u09dc\u09dd\u09df-\u09e1\u09e6-\u09f1\u09f4-\u09fa\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3e-\u0a40\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a72-\u0a74\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac0\u0ac9\u0acb\u0acc\u0ad0\u0ae0\u0ae1\u0ae6-\u0af0\u0b02\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b3e\u0b40\u0b47\u0b48\u0b4b\u0b4c\u0b57\u0b5c\u0b5d\u0b5f-\u0b61\u0b66-\u0b77\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe\u0bbf\u0bc1\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcc\u0bd0\u0bd7\u0be6-\u0bf2\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c41-\u0c44\u0c58\u0c59\u0c60\u0c61\u0c66-\u0c6f\u0c7f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd-\u0cc4\u0cc6-\u0cc8\u0cca\u0ccb\u0cd5\u0cd6\u0cde\u0ce0\u0ce1\u0ce6-\u0cef\u0cf1\u0cf2\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d40\u0d46-\u0d48\u0d4a-\u0d4c\u0d4e\u0d57\u0d60\u0d61\u0d66-\u0d75\u0d79-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dcf-\u0dd1\u0dd8-\u0ddf\u0de6-\u0def\u0df2-\u0df4\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e4f-\u0e5b\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0ed0-\u0ed9\u0edc-\u0edf\u0f00-\u0f17\u0f1a-\u0f34\u0f36\u0f38\u0f3e-\u0f47\u0f49-\u0f6c\u0f7f\u0f85\u0f88-\u0f8c\u0fbe-\u0fc5\u0fc7-\u0fcc\u0fce-\u0fda\u1000-\u102c\u1031\u1038\u103b\u103c\u103f-\u1057\u105a-\u105d\u1061-\u1070\u1075-\u1081\u1083\u1084\u1087-\u108c\u108e-\u109c\u109e-\u10c5\u10c7\u10cd\u10d0-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1360-\u137c\u1380-\u138f\u13a0-\u13f4\u1401-\u167f\u1681-\u169a\u16a0-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1735\u1736\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17b6\u17be-\u17c5\u17c7\u17c8\u17d4-\u17da\u17dc\u17e0-\u17e9\u1810-\u1819\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1923-\u1926\u1929-\u192b\u1930\u1931\u1933-\u1938\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19da\u1a00-\u1a16\u1a19\u1a1a\u1a1e-\u1a55\u1a57\u1a61\u1a63\u1a64\u1a6d-\u1a72\u1a80-\u1a89\u1a90-\u1a99\u1aa0-\u1aad\u1b04-\u1b33\u1b35\u1b3b\u1b3d-\u1b41\u1b43-\u1b4b\u1b50-\u1b6a\u1b74-\u1b7c\u1b82-\u1ba1\u1ba6\u1ba7\u1baa\u1bae-\u1be5\u1be7\u1bea-\u1bec\u1bee\u1bf2\u1bf3\u1bfc-\u1c2b\u1c34\u1c35\u1c3b-\u1c49\u1c4d-\u1c7f\u1cc0-\u1cc7\u1cd3\u1ce1\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200e\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u214f\u2160-\u2188\u2336-\u237a\u2395\u249c-\u24e9\u26ac\u2800-\u28ff\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d70\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u302e\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u3190-\u31ba\u31f0-\u321c\u3220-\u324f\u3260-\u327b\u327f-\u32b0\u32c0-\u32cb\u32d0-\u32fe\u3300-\u3376\u337b-\u33dd\u33e0-\u33fe\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua60c\ua610-\ua62b\ua640-\ua66e\ua680-\ua69d\ua6a0-\ua6ef\ua6f2-\ua6f7\ua722-\ua787\ua789-\ua78e\ua790-\ua7ad\ua7b0\ua7b1\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua824\ua827\ua830-\ua837\ua840-\ua873\ua880-\ua8c3\ua8ce-\ua8d9\ua8f2-\ua8fb\ua900-\ua925\ua92e-\ua946\ua952\ua953\ua95f-\ua97c\ua983-\ua9b2\ua9b4\ua9b5\ua9ba\ua9bb\ua9bd-\ua9cd\ua9cf-\ua9d9\ua9de-\ua9e4\ua9e6-\ua9fe\uaa00-\uaa28\uaa2f\uaa30\uaa33\uaa34\uaa40-\uaa42\uaa44-\uaa4b\uaa4d\uaa50-\uaa59\uaa5c-\uaa7b\uaa7d-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaaeb\uaaee-\uaaf5\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5f\uab64\uab65\uabc0-\uabe4\uabe6\uabe7\uabe9-\uabec\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\ue000-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc",R:"\u0590\u05be\u05c0\u05c3\u05c6\u05c8-\u05ff\u07c0-\u07ea\u07f4\u07f5\u07fa-\u0815\u081a\u0824\u0828\u082e-\u0858\u085c-\u089f\u200f\ufb1d\ufb1f-\ufb28\ufb2a-\ufb4f",AL:"\u0608\u060b\u060d\u061b-\u064a\u066d-\u066f\u0671-\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u0710\u0712-\u072f\u074b-\u07a5\u07b1-\u07bf\u08a0-\u08e3\ufb50-\ufd3d\ufd40-\ufdcf\ufdf0-\ufdfc\ufdfe\ufdff\ufe70-\ufefe"};var j=new RegExp("["+c.L+c.R+c.AL+"]"),k=new RegExp("["+c.R+c.AL+"]");function l(a){a=j.exec(a);return a==null?null:a[0]}function m(a){a=l(a);return a==null?g.NEUTRAL:k.exec(a)?g.RTL:g.LTR}function n(a,b){b=b||g.NEUTRAL;if(!a.length)return b;a=m(a);return a===g.NEUTRAL?b:a}function o(a,b){b||(b=h.getDir());g.isStrong(b)||i(0,451);return n(a,b)}function a(a,b){return o(a,b)===g.LTR}function b(a,b){return o(a,b)===g.RTL}d={firstStrongChar:l,firstStrongCharDir:m,resolveBlockDir:n,getDirection:o,isDirectionLTR:a,isDirectionRTL:b};e.exports=d}),null);
__d("isElementPartiallyInViewport",["getElementRect","getViewportDimensions"],(function(a,b,c,d,e,f,g,h){"use strict";__p&&__p();function a(a){var b=h();if(!b.width||!b.height)return!1;a=g(a);if(!a.width||!a.height)return!1;var c=a.top<=b.height&&a.top+a.height>=0;b=a.left<=b.width&&a.left+a.width>=0;return c&&b}e.exports=a}),null);
__d("MBackNavbar",["CSS","DOM","Event","MAnimator","MArrays","MBackToNewsFeed","MHeaderLogger","MHistory","MHome","MPageCache","MPageController","MPageFetcher","MStoriesUIConstants","MTitleListener","MURI","MViewport","Stratcom","UnicodeBidi","UnicodeBidiDirection","Vector","cx","fbt","getViewportDimensions","gkx","isElementPartiallyInViewport","onAfterTTI","setTimeoutAcrossTransitions"],(function(a,b,c,d,e,f,g,aa,h,i,j,k,l,m,n,ba,ca,da,o,p,q,r,s,ea,t,fa,ga,ha,ia,ja,ka,la,u){"use strict";__p&&__p();var v=!1,w=!1,x=!1,y=[],z=!1,A=!1,B=!1,C=[],D=[],E=null,F=null,G=t.LTR,H=!1,I=!1,J=!0,K=null,L=!1,M=!1,N=!1,O=!1,P=!1,Q=[],R=!1;function S(a){return a.split(",").map(function(a){a=a.toLowerCase();a.startsWith("/")||(a="/"+a);return a})}function T(){if(H||!z)return;k.updateHistory(!0);!n.isHome()&&P&&la(function(){!n.isHome()&&R&&da.prefetch(n.HOME_PATH)})}function ma(a){try{a=new q(a);a=a.getDomain()}catch(b){a=""}return a}function na(){var a=oa();if(!a)return!1;a=ma(a);return a.length>0&&!a.endsWith(".facebook.com")}function U(a,b,c){__p&&__p();c=p.getTitleAsString(c);if(!c||typeof c.split!=="function")return;c=c.split("\n").join(" ");b.innerText=c;G=ea.getDirection(c,G);switch(G){case t.RTL:g.addClass(a,"rtl");break;default:g.removeClass(a,"rtl")}}function V(a,b,c,d){__p&&__p();var e=[];if(J){b.innerText="";e.push(s.listen("MDocument:title",null,function(c){var d=null;c&&(d=c.getData());U(a,b,d)}));var f=null;X()&&(f=ha._("Facebook").toString());U(a,b,f)}f=function(){L=!0,history.go(-1)};I?(c&&e.push(h.listen(c,"click",f)),d&&e.push(h.listen(d,"click",f))):e.push(h.listen(a,"click",f));var g=!1;return function(){if(g)return;g=!0;e.forEach(function(a){a.remove()})}}var W=!0;function oa(){if(W){W=!1;return document.referrer}return""}function X(){if(!Q.length)return!1;if(!m.hasSoftState)return!1;var a=m.getState();return!a?!1:Q.indexOf(a)!==-1}function Y(a){return m.hasSoftState()&&Q.length?!1:j.findPrefix(D,a)}function Z(a){a=a||m.getPath();var b="";if(a)try{a=new q(a).normalize();b=a.getPath().toLowerCase()}catch(a){b=""}return b}function pa(a){__p&&__p();var b=na();if(A&&!b)return!1;b=Z(a);if(Y(b))return!1;if(B)return!0;if(!C.length)return!1;for(var a=0;a<C.length;a++)if(b.indexOf(C[a])!==-1)return!0;return!1}function $(){__p&&__p();F&&(F(),F=null);if(!E)return;var a=E;u(function(){__p&&__p();var b=m.getPath(),c=n.isHome()&&!m.hasSoftState(),d=null,e=null;I&&(d=document.getElementById("MBackNavBarLeftArrow"),e=document.getElementById("MBackNavBarRightArrow"));var f=c||m.hasSoftState()&&!X()||I&&!d&&!e||!pa(b);if(f){g.removeClass(a,"show");if(w&&D.length&&y.length){f=Z();Y(f)&&j.findPrefix(y,f)&&l.logExposure(!0)}if(c&&N&&L){L=!1;f=document.getElementById("page");if(f){c=aa.scry(f,"article","story-div");var h=null;for(var f=c.length-1;f>=0;f--)if(ka(c[f]))break;else h=c[f];if(h){g.show(h);var k=ia();u(function(){var a=r.getScrollTop(),b=fa.getPos(h).y-k.height+300,c=Math.abs(b-a),d=a;i.play(a,b,500,function(a){var b=i.easeInOutCubic((a-d)/c);b=Math.round((a-d)*b+d);d=a;r.scrollToY(b)})},800)}}}s.invoke("m:backnav:show-jewels")}else{if(w){c=!1;if(x){f=Z(b);(y.length===0||j.findPrefix(y,f))&&(c=!0)}l.logExposure(c)}if(!z)return;K&&(I?F=V(a,K,d,e):F=V(a,K));g.addClass(a,"show");M&&T();s.invoke("m:backnav:show-backbar")}},1)}function qa(a){__p&&__p();if(v)return;v=!0;E=a.element;z=a.enabled;w=a.logExposure;x=a.qeExposure;A=a.enabledForExternalReferer;B=a.allPages;H=a.backToFeedDisabled;I=a.backOnArrowClick;K=a.linkElement;var b=a.forceRefreshFeed;N=b?!1:a.scrollToNextFeedItem;M=a.modifyHistoryOnNav;P=a.isPageLoggingAllowed;R=a.enableFeedPrefetch;!B?C=S(a.pages):a.excludedPages.length&&(D=S(a.excludedPages));var c=a.enableBackbarForSoftNav||"";c.length&&(Q=c.split(","));a.exposurePages&&(y=S(a.exposurePages));D.length?D=D.concat(o.HIDE_HEADER_URLS):D=o.HIDE_HEADER_URLS;s.listen("history:change",null,$);s.listen("m:homepage:load",null,$);J=!a.staticTitle;z&&J&&(J=p.init());J||g.addClass(K,"_6sow");if(!M){c=Z();a=Y(c);a||T()}$();b&&z&&(s.listen("m:page:beforeloading",null,function(a){__p&&__p();var b=L;L=!1;if(!a)return;a=a.getData();if(!a)return;var c=ca.getRenderedPath();c=c&&n.isHome(c);if(c){O=!1;c=String(a).indexOf("?");if(c===-1)return;try{c=new q(a);c=c.getQueryData()||{}}catch(a){c={}}c=c._bb_norefresh;c==="1"&&(O=!0)}else{c=n.isHome(a);var d=O;O=!1;b&&a&&c&&!d&&ba.removeCachedPage(a)}}),s.listen("m:backnav:invalidate-cached-feed",null,function(){O=!1}))}e.exports={init:function(a){qa(a)}}}),null);
__d("MBackToTop",["JavelinHistory","MPageController","MPageControllerPath","MStopNGo","MViewport","Stratcom"],(function(a,b,c,d,e,f,g,h,i,j,k,l){"use strict";__p&&__p();var m=k.getScreenHeight(),n={init:function(a){__p&&__p();if(!n._isBrowserSupported())return;if(n._initialized)return;n._initialized=!0;n._reload=a.reload;j.listen("go",n._pushScrollingStateIfNeeded);j.listen("stop",function(){return setTimeout(n._pushScrollingStateIfNeeded,1e3)});l.listen("popstate",null,n._onpopstate)},_onpopstate:function(a){n._lastpop=Date.now();if(!n._isPathSupported())return;if(n._isScrollingState())return;i.isRequestPath(location.href)&&k.getScrollTop()>m&&(window.setTimeout(function(){k.scrollToTop(),n._reload==="full"&&h.reload()},1),a.stop())},_pushScrollingStateIfNeeded:function(){if(!n._isPathSupported())return;if(n._isScrollingState())return;k.getScrollTop()>m&&Date.now()-n._lastpop>1e3&&window.history.pushState({scrolling:1},null)},_initialized:!1,_lastpop:0,_reload:null,_isScrollingState:function(){var a=window.history.state;return a&&a.scrolling},_isBrowserSupported:function(){return g.CAN_USE_PUSH_STATE},_isPathSupported:function(){return h.isHomeishPath(location.href)}};e.exports=n}),null);
__d("MBeeperController",["Bootloader","CSS","DOM","MHistory","Stratcom","URI","$","cx","getActiveElement","setTimeoutAcrossTransitions"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){__p&&__p();var q,r,s,t,u=[],v,w=3e3;function a(a){v=a,p(function(){k.listen("m_notification",null,x),k.listen("blur",null,y),k.listen("m:history:change",null,D)},w)}function x(a){a=a.getData();if(!a||!a.data||v&&!a.data.type||v&&v.indexOf(a.data.type)===-1)return;a={notification:a.data};C(a);!q&&!r?g.loadModules(["ReactComponentRenderer","MBeeper.react"],function(a,b){q=a,r=b,D()},"MBeeperController"):D()}function y(a){a=a.getTarget();a instanceof HTMLElement&&A(a)&&setTimeout(D,50)}function z(){u.shift(),D()}function A(a){var b=a.tagName;return b==="INPUT"||b==="TEXTAREA"||a.contentEditable==="true"}function B(){return!A(o())&&m("root").offsetHeight!==0}function C(a){var b=u.find(function(b){return b.notification.alert_id===a.notification.alert_id});b||u.push(a)}function D(){__p&&__p();if(!B())return;var a=new l(j.getPath());if(a.getQueryData().soft==="notifications"){u=[];return}a=u[0];if(!a)return;s||(s=i.create("div"),h.addClass(s,"_3hy8"),m("page").appendChild(s));!t?q&&(t=new q(r,s),t.setProps(babelHelpers["extends"]({},a,{onHide:z}))):t.component.isReady()&&t.setProps(a)}f.init=a}),null);
__d("MPageletTypes",[],(function(a,b,c,d,e,f){e.exports=Object.freeze({CHROME:"chrome",CONTENT:"content"})}),null);
__d("MFirstPageRecorder",["Arbiter","DOM","MDeepCopy","MHome","MJewelLinkFetcher","MPageCache","MPageController","MPageHeaderRight","MPageletTypes","MPageTitle","MRequestConfig","MResponseData","MURI","ScriptPath","ServerJS","Stratcom","$","ge"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x){__p&&__p();var y,z=!1,A=!1,B=[],C=new s(m.getRenderedPath()),D,E=[],F=[],G={},H=["m:chrome:schedulable-graph-search","first_response","last_response","MNotificationFlyoutContent","MMessegesFlyoutContent","MFriendRequestsFlyoutContent"];function I(){__p&&__p();if(!D)return;l.setCachedPage(C,D);l.clearCachedIUIResponses(C);E.forEach(function(a){l.addCachedIUIResponse(C,a)});if(G.should_save_cache_for_newsfeed_jewel_path&&j.isHome(C.getPath())){var a=new s(k.get("feed"));!a.isEmpty()&&C.getPath()!=a.getPath()&&(l.setCachedPage(a,D),l.clearCachedIUIResponses(a),E.forEach(function(b){l.addCachedIUIResponse(a,b)}))}A=!0}function J(){__p&&__p();if(z)return;z=!0;var a={ajax_response_token:q.ajaxResponseToken.secret,js:[],css:[],ixData:null,bxData:null,actions:[]},b=w("root").cloneNode(!0),c=[];D=new r({ajax_response_token:q.ajaxResponseToken.secret,js:[],css:[],ixData:[],bxData:[],actions:[{cmd:"script",type:"immediate",fn:function(){h.replace(w("root"),b.cloneNode(!0))}}]});var d=n.getChromeHeaderRightContent();d&&d.length>0&&c.push(function(){var a=document.createDocumentFragment();for(var b=0;b<d.length;b++)a.appendChild(d[0]);n.setup({node:a})});var e=document.title;c.push(function(){p.setTitle(e)});var f=t.getPageInfo();f&&c.push(function(){t.set(f.scriptPath,f.categoryToken,f.extraData)});a.actions=c.map(function(a){return{cmd:"script",type:"onload",fn:a}});E.push(new r(a))}function K(a,b,c){var d={ajax_response_token:q.ajaxResponseToken.secret,js:[],css:[],ixData:null,bxData:null,actions:[]};d.actions=Object.keys(a).map(function(b){return{cmd:"replace",target:b,html:a[b],replaceifexists:!1,allownull:!1}});b&&d.actions.push({cmd:"append",target:"static_templates",html:b,replaceifexists:!0});c&&d.actions.push({cmd:"script",type:"onload",fn:function(){new u().handle(i(c))}});J();E.push(new r(d))}function L(a,b){if(!a||H.includes(a.id))return;A?(K(a.contentMap,a.staticTemplates,a.jsmods),l.addCachedIUIResponse(C,E.pop())):F.push(a)}function M(){D=null,z=!0}function N(){for(var a=0,b=F.length;a<b;a++)K(F[a].contentMap,F[a].staticTemplates,F[a].jsmods);I();F=[];E=[]}function a(a){__p&&__p();if(y)return;y=!0;G=a;l.setPageCacheComplete(C,!0);var b=g.subscribe(["pagelet_performing_replayable_actions","pagelet_performing_replayable_actions_failed","all_pagelets_loaded"],function(b,c){switch(b){case"pagelet_performing_replayable_actions":L(c,a);break;case"pagelet_performing_replayable_actions_failed":M();break;case"all_pagelets_loaded":N();break}}),c=g.subscribe(["MRenderingScheduler/pageletSchedule","MRenderingScheduler/dd"],function(a,b){switch(a){case"MRenderingScheduler/pageletSchedule":if(b.pageletConfig.type===o.CONTENT){a=(a={},a[b.id]=b.element?x(b.element).innerHTML:b.content.__html,a);K(a,b.pageletConfig.templates.__html,i(b.pageletConfig.serverJSData))}break;case"MRenderingScheduler/dd":I();break}});B=[b,c]}v.listen("m:page:unload",null,function(){B.forEach(function(a){a&&a.unsubscribe()}),B=[],y=!0,D=null,E=[],F=[],v.removeCurrentListener()});f.startPageletCaching=a}),null);
__d("BanzaiLooper",["Banzai"],(function(a,b,c,d,e,f,g){var h={retry:!0};function i(a,b){g.post("banzai_looper:"+a,b,h)}a={labelBinaryClassificationExample:function(a){i("binary_classification_example",babelHelpers["extends"]({operation:"label"},a))}};e.exports=a}),null);
__d("MLinkPredictionLabeling",["BanzaiLooper"],(function(a,b,c,d,e,f,g){"use strict";__p&&__p();var h=g.labelBinaryClassificationExample,i=new Set();a={label:function(a){__p&&__p();if(a===null||typeof a!=="object")return;var b=a.trace;b=b===void 0?null:b;var c=a.loopName;c=c===void 0?null:c;a=a.label;a=a===void 0?null:a;if(typeof b!=="string"||typeof c!=="string"||typeof a!=="string")return;var d=c+":"+b;i.has(d)||(i.add(d),h({trace:b,loopName:c,label:a}))}};e.exports=a}),null);
__d("MLink",["DOM","ErrorUtils","FBLogger","MLegacyDataStore","MLinkHack","MLinkPredictionLabeling","MLynx","MPageCache","MPageController","Stratcom","URI"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){__p&&__p();var r="standalone"in window.navigator&&window.navigator.standalone,s=!1;function a(){__p&&__p();if(s)return;s=!0;g.listen(document.documentElement,"click",null,function(a){__p&&__p();if(a.getPrevented())return;h.applyWithGuard(function(){__p&&__p();var b=a.getNode("tag:a");if(b===null||b===void 0)return;var c=a.getRawEvent();if(b.getAttribute("onclick")||(c.which||c.button)>=2)return;k.remove(b);c=b.getAttribute("href")||null;var d=new q(c),e=d.getProtocol();if(e&&e!="http"&&e!="https")return;var f=d.getDomain();f=f&&!/\.facebook.com$/i.test(f);f&&!m.isShimmedLink(b)&&i("FIXME").mustfix("Loading an external URL without shimming: %s",c);var g=b.getAttribute("target")||null;if((g==="_blank"||f)&&r)return;if(b.hasAttribute("data-disable-mlink"))return;if(g==="_blank")window.open(c,"_blank");else if(d.getPath().toLowerCase().indexOf("/dialog/oauth")>-1)return;else if(g||e&&e+":"!==location.protocol||p.hasSigil(b,"no_mpc")||f)window.location=c;else if(c)if(c.indexOf("#")===0){d=document.getElementById(c.substr(1));d&&d.scrollIntoView()}else{g=j.get(b);g.fromCache&&n.setScrollHistory(c,0);o.load(c,{replace:g.behavior==="replace-state",expiration:g.fromCache?g.shortCache?o.EXPERIMENTAL_USER_EXPIRE_MS:o.HISTORY_EXPIRE_MS:null,noAutoScroll:g.noAutoScroll,prefetchHref:g.prefetchHref});l.label(g.predictionLabeling)}else{if(b.hasAttribute("data-sigil"))return;e="";f=a.getTarget();while(f&&f!=document.body)e=e+" <"+f.nodeName,typeof f.id==="string"&&f.id!==""&&(e=e+" id="+f.id),typeof f.className==="string"&&f.className!==""&&(e=e+" class="+f.className),e+=" >",f=f.parentNode;i("FIXME").warn('handleClick: unknown link action: <a id="%s" class="%s" /> Path: %s',b.id,b.className,e);return}a.prevent()},null,[],null,"LinkController")})}f.setupListener=a}),null);