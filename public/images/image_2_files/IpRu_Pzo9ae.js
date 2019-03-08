if (self.CavalryLogger) { CavalryLogger.start_js(["SZxKw"]); }

__d("MUFIConversationGuideEmojiItem.react",["ConversationGuideSuggestionType","ConversationGuideUIEvent","ConversationGuideUITypedLogger","EmojiRenderer","FBEmojiResource","FBEmojiUtils","Image.react","React","ReactDOM","RelayModern","ShimButton.react","cx","joinClasses","MUFIConversationGuideEmojiItem_item.graphql"],(function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s){"use strict";__p&&__p();a=p.createFragmentContainer;p.graphql;var t=30;c=function(a){__p&&__p();babelHelpers.inheritsLoose(b,a);function b(){__p&&__p();var b,c;for(var d=arguments.length,e=new Array(d),f=0;f<d;f++)e[f]=arguments[f];return(b=c=a.call.apply(a,[this].concat(e))||this,c.itemRef=n.createRef(),c.hasLoggedVPV=!1,c.$1=function(){var a=c.props,b=a.ftentidentifier,d=a.trackingID,e=a.rankedIndex;a=a.item;var f=a.id;a=a.unicode_string;c.props.handleTextAdd(a);new i().setEvent(h.SUGGESTION_SELECTED).setFeedbackID(b).setSuggestionType(g.EMOJI).setSuggestionIndex(e).setSuggestionID(f).setTrackingID(d).setSessionID(c.props.sessionID).log();c.props.onClickHandled&&c.props.onClickHandled(c.props.key)},b)||babelHelpers.assertThisInitialized(c)}var c=b.prototype;c.checkForVpv=function(a,b){if(this.hasLoggedVPV||!this.itemRef.current)return;var c=o.findDOMNode(this.itemRef.current);if(!c)return;c=c.getBoundingClientRect();(c.left>a.left&&c.left<a.right-b||c.right>a.left+b&&c.right<a.right)&&this.logVpv()};c.logVpv=function(){if(this.hasLoggedVPV)return;this.hasLoggedVPV=!0;var a=this.props,b=a.ftentidentifier,c=a.rankedIndex;a=a.item.id;new i().setEvent(h.SUGGESTION_VPV).setFeedbackID(b).setSuggestionType(g.EMOJI).setSuggestionIndex(c).setSuggestionID(a).setTrackingID(this.props.trackingID).setSessionID(this.props.sessionID).log()};c.render=function(){var a=this.props.item.unicode_string;if(!a)return null;var b=j.render(a,function(a){var b=k.fromCodepoints(a);return b!=null?n.createElement(m,{key:l.getKeyFromCodepoints(a),className:"_7anx",src:b.getImageURL(t)}):a.join("")});return n.createElement(q,{onMouseDown:this.props.onMouseDown,ref:this.itemRef,className:s("_7any",this.props.className),"aria-label":a,onClick:this.$1},n.createElement("div",{className:"_7anz"},b))};return b}(n.Component);e.exports=a(c,{item:function(){return b("MUFIConversationGuideEmojiItem_item.graphql")}})}),null);