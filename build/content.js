(()=>{"use strict";var e={481:function(e,n,t){var o=this&&this.__awaiter||function(e,n,t,o){return new(t||(t=Promise))((function(r,i){function s(e){try{u(o.next(e))}catch(e){i(e)}}function c(e){try{u(o.throw(e))}catch(e){i(e)}}function u(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(s,c)}u((o=o.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0});const r=t(396);o(void 0,void 0,void 0,(function*(){if(!(0,r.isJSON)(document))return void console.log("this document is not json.");const e=document.getElementsByTagName("pre");if(!e)return;const n=e[0].innerText;if(!n)return;let t;try{t=JSON.parse(n)}catch(e){return console.log("JSONでは無いのでSKIP"),void console.error(e)}void 0!==t&&(yield chrome.runtime.sendMessage({type:"road",text:n}),e[0].remove(),document.body.innerHTML=function(e,n=2){let t="";for(let o in e)e.hasOwnProperty(o)&&(t+=`<pre><span class="jsonKey">${o}:</span>${JSON.stringify(e[o],null,n)}</pre>`);return t}(t))}))},396:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.isJSON=void 0,n.isJSON=e=>"application/json"===e.contentType}},n={};!function t(o){var r=n[o];if(void 0!==r)return r.exports;var i=n[o]={exports:{}};return e[o].call(i.exports,i,i.exports,t),i.exports}(481)})();