if (self.CavalryLogger) { CavalryLogger.start_js(["sdgay"]); }

__d("MNTStateStore",[],(function(a,b,c,d,e,f){__p&&__p();var g={};a={add:function(a){a!==null&&(g=Object.assign(a,g))},getValue:function(a,b){var c=this.getState(a);b.forEach(function(a){var b;c=(b=c)==null?void 0:b[a]});return c},getState:function(a){return g[a]},setState:function(a,b,c){if(b.length===0){g[a]=c;return}var d=this.getState(a);b.slice(0,b.length-1).forEach(function(a){d=d[a]});d[b[b.length-1]]=c}};e.exports=a}),null);