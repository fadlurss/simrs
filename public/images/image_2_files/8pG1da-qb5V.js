if (self.CavalryLogger) { CavalryLogger.start_js(["wt2o6"]); }

__d("MUFIConversationGuideMentionItem.react",["ConversationGuideSuggestionType","ConversationGuideUIEvent","ConversationGuideUITypedLogger","Image.react","React","ReactDOM","RelayModern","SearchableEntry","ShimButton.react","cx","joinClasses","MUFIConversationGuideMentionItem_item.graphql"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){"use strict";__p&&__p();a=m.createFragmentContainer;m.graphql;c=function(a){__p&&__p();babelHelpers.inheritsLoose(b,a);function b(){__p&&__p();var b,c;for(var d=arguments.length,e=new Array(d),f=0;f<d;f++)e[f]=arguments[f];return(b=c=a.call.apply(a,[this].concat(e))||this,c.itemRef=k.createRef(),c.hasLoggedVPV=!1,c.$1=function(){__p&&__p();var a=c.props,b=a.ftentidentifier,d=a.trackingID,e=a.rankedIndex;a=a.item;var f=a.id,j=a.name;a=a.short_name;if(!f||!a)return;a=new n({uniqueID:f,title:a,subtitle:j,type:"user"});c.props.handleMentionAdd(a);new i().setEvent(h.SUGGESTION_SELECTED).setFeedbackID(b).setSuggestionType(g.MENTION).setSuggestionIndex(e).setSuggestionID(f).setTrackingID(d).setSessionID(c.props.sessionID).log();c.props.onClickHandled&&c.props.onClickHandled(c.props.key)},b)||babelHelpers.assertThisInitialized(c)}var c=b.prototype;c.checkForVpv=function(a,b){if(this.hasLoggedVPV||!this.itemRef.current)return;var c=l.findDOMNode(this.itemRef.current);if(!c)return;c=c.getBoundingClientRect();(c.left>a.left&&c.left<a.right-b||c.right>a.left+b&&c.right<a.right)&&this.logVpv()};c.logVpv=function(){if(this.hasLoggedVPV)return;this.hasLoggedVPV=!0;var a=this.props,b=a.ftentidentifier,c=a.rankedIndex;a=a.item.id;new i().setEvent(h.SUGGESTION_VPV).setFeedbackID(b).setSuggestionType(g.MENTION).setSuggestionIndex(c).setSuggestionID(a).setTrackingID(this.props.trackingID).setSessionID(this.props.sessionID).log()};c.render=function(){var a=this.props.item,b=a.name,c=a.profile_picture;a=a.short_name;c=c?c.uri:void 0;c=c?k.createElement(j,{className:"_7ant",src:c}):null;return k.createElement(o,{onMouseDown:this.props.onMouseDown,ref:this.itemRef,className:q("_7anu"+(c?"":" _7anv"),this.props.className),"data-hover":"tooltip","aria-label":b,"data-tooltip-content":b,onClick:this.$1},c,k.createElement("div",{className:"_7anw"},"@",a))};return b}(k.Component);e.exports=a(c,{item:function(){return b("MUFIConversationGuideMentionItem_item.graphql")}})}),null);