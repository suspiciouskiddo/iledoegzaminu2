var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(e)}function a(t){return"function"==typeof t}function o(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function l(t){t.parentNode.removeChild(t)}function r(t){return document.createElement(t)}function u(t){return document.createTextNode(t)}function d(){return u(" ")}function v(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function f(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function m(t,e){t.value=null==e?"":e}function p(t,e,n,s){null===n?t.style.removeProperty(e):t.style.setProperty(e,n,s?"important":"")}let g;function w(t){g=t}const b=[],C=[],y=[],x=[],z=Promise.resolve();let $=!1;function k(t){y.push(t)}const M=new Set;let _=0;function j(){const t=g;do{for(;_<b.length;){const t=b[_];_++,w(t),L(t.$$)}for(w(null),b.length=0,_=0;C.length;)C.pop()();for(let t=0;t<y.length;t+=1){const e=y[t];M.has(e)||(M.add(e),e())}y.length=0}while(b.length);for(;x.length;)x.pop()();$=!1,M.clear(),w(t)}function L(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(k)}}const H=new Set;function A(t,e){-1===t.$$.dirty[0]&&(b.push(t),$||($=!0,z.then(j)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function E(o,i,c,r,u,d,v,f=[-1]){const h=g;w(o);const m=o.$$={fragment:null,ctx:null,props:d,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(i.context||(h?h.$$.context:[])),callbacks:n(),dirty:f,skip_bound:!1,root:i.target||h.$$.root};v&&v(m.root);let p=!1;if(m.ctx=c?c(o,i.props||{},((t,e,...n)=>{const s=n.length?n[0]:e;return m.ctx&&u(m.ctx[t],m.ctx[t]=s)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](s),p&&A(o,t)),e})):[],m.update(),p=!0,s(m.before_update),m.fragment=!!r&&r(m.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);m.fragment&&m.fragment.l(t),t.forEach(l)}else m.fragment&&m.fragment.c();i.intro&&((b=o.$$.fragment)&&b.i&&(H.delete(b),b.i(C))),function(t,n,o,i){const{fragment:c,on_mount:l,on_destroy:r,after_update:u}=t.$$;c&&c.m(n,o),i||k((()=>{const n=l.map(e).filter(a);r?r.push(...n):s(n),t.$$.on_mount=[]})),u.forEach(k)}(o,i.target,i.anchor,i.customElement),j()}var b,C;w(h)}function V(e){let n,a,o,g,w,b,C,y,x,z,$,k,M,_,j,L,H,A,E,V,O,T,B,S,N,I,K,W,P,D,G,U,Z,q,J,R,Y,F,Q,X,tt,et,nt,st,at,ot,it,ct,lt,rt,ut;return{c(){n=r("main"),a=r("div"),o=r("div"),o.innerHTML='<a href="/e8" style="color: black;"><h2>Odliczanie do egzaminu ósmoklasisty 2023</h2> \n\t\t<p style="font-size: 12px;">Kliknij w tekst aby zobaczyć więcej</p> \n\t\t\t\n\t\t<h3>Brak dokładnego terminu</h3></a>',g=d(),w=r("div"),w.innerHTML='<a href="/matura" style="color: black;"><h2>Odliczanie do matury 2023</h2> \n\t\t\t<p style="font-size: 12px;">Kliknij w tekst aby zobaczyć więcej</p> \n\t\t\t\n\t\t\t<h3>Brak dokładnego terminu</h3></a>',b=d(),C=r("div"),y=r("a"),x=r("h2"),x.textContent="Odliczanie do końca wakacji",z=d(),$=r("p"),$.textContent="Kliknij w tekst aby zobaczyć więcej",k=d(),M=r("h3"),_=u("W dniach "),j=u(e[0]),L=d(),H=r("h3"),A=u("W godzinach "),E=u(e[1]),V=d(),O=r("h3"),T=u("W minutach "),B=u(e[2]),S=d(),N=r("h3"),I=u("W sekundach "),K=u(e[3]),W=d(),P=r("div"),D=r("h2"),D.textContent="Generowanie własnego odliczania",G=d(),U=r("a"),U.innerHTML='<p style="font-size: 14px;">Aby zapisać odliczanie kliknij tutaj</p>',Z=d(),q=r("input"),J=d(),R=r("input"),Y=d(),F=r("input"),Q=d(),X=r("a"),tt=u("https://iledoegzaminu.pl/custom?name="),et=u(e[5]),nt=u("&date="),st=u(e[4]),at=u("&time="),ot=u(e[6]),ct=d(),lt=r("div"),lt.innerHTML='<ul class="svelte-wbgs4m"><li class="svelte-wbgs4m"><a href="/" style="text-decoration: none;"><div class="nav-item-div svelte-wbgs4m"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-li-icon svelte-wbgs4m"><path d="M352 0C369.7 0 384 14.33 384 32C384 49.67 369.7 64 352 64V74.98C352 117.4 335.1 158.1 305.1 188.1L237.3 256L305.1 323.9C335.1 353.9 352 394.6 352 437V448C369.7 448 384 462.3 384 480C384 497.7 369.7 512 352 512H32C14.33 512 0 497.7 0 480C0 462.3 14.33 448 32 448V437C32 394.6 48.86 353.9 78.86 323.9L146.7 256L78.86 188.1C48.86 158.1 32 117.4 32 74.98V64C14.33 64 0 49.67 0 32C0 14.33 14.33 0 32 0H352zM111.1 128H272C282.4 112.4 288 93.98 288 74.98V64H96V74.98C96 93.98 101.6 112.4 111.1 128zM111.1 384H272C268.5 378.7 264.5 373.7 259.9 369.1L192 301.3L124.1 369.1C119.5 373.7 115.5 378.7 111.1 384V384z"></path></svg> \n\t\t\t\t\t<div class="nav-text svelte-wbgs4m"><span>ILEDOEGZAMINU.PL</span></div></div></a></li> \n\t\t<li class="svelte-wbgs4m"><div style="height: 50px;"></div></li> \n\t\t<li class="svelte-wbgs4m"><a href="/matura"><div class="nav-item-div svelte-wbgs4m"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-li-icon svelte-wbgs4m"><path d="M0 219.2v212.5c0 14.25 11.62 26.25 26.5 27C75.32 461.2 180.2 471.3 240 511.9V245.2C181.4 205.5 79.99 194.8 29.84 192C13.59 191.1 0 203.6 0 219.2zM482.2 192c-50.09 2.848-151.3 13.47-209.1 53.09C272.1 245.2 272 245.3 272 245.5v266.5c60.04-40.39 164.7-50.76 213.5-53.28C500.4 457.9 512 445.9 512 431.7V219.2C512 203.6 498.4 191.1 482.2 192zM352 96c0-53-43-96-96-96S160 43 160 96s43 96 96 96S352 149 352 96z"></path></svg> \n\t\t\t\t\t<div class="nav-text svelte-wbgs4m"><span>MATURA</span></div></div></a></li> \n\t\t<li class="svelte-wbgs4m"><a href="/e8"><div class="nav-item-div svelte-wbgs4m"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-li-icon svelte-wbgs4m"><path d="M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z"></path></svg> \n\t\t\t\t\t<div class="nav-text svelte-wbgs4m"><span>EGZAMIN ÓSMOKLASISTY</span></div></div></a></li> \n\t\t<li class="svelte-wbgs4m"><a href="/wakacje"><div class="nav-item-div svelte-wbgs4m"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-li-icon svelte-wbgs4m"><path d="M115.4 136.8l102.1 37.35c35.13-81.62 86.25-144.4 139-173.7c-95.88-4.875-188.8 36.96-248.5 111.7C101.2 120.6 105.2 133.2 115.4 136.8zM247.6 185l238.5 86.87c35.75-121.4 18.62-231.6-42.63-253.9c-7.375-2.625-15.12-4.062-23.12-4.062C362.4 13.88 292.1 83.13 247.6 185zM521.5 60.51c6.25 16.25 10.75 34.62 13.13 55.25c5.75 49.87-1.376 108.1-18.88 166.9l102.6 37.37c10.13 3.75 21.25-3.375 21.5-14.12C642.3 210.1 598 118.4 521.5 60.51zM528 448h-207l65-178.5l-60.13-21.87l-72.88 200.4H48C21.49 448 0 469.5 0 496C0 504.8 7.163 512 16 512h544c8.837 0 16-7.163 16-15.1C576 469.5 554.5 448 528 448z"></path></svg> \n\t\t\t\t\t<div class="nav-text svelte-wbgs4m"><span>WAKACJE 2023</span></div></div></a></li></ul>',f(o,"class","counterdiv svelte-wbgs4m"),f(w,"class","counterdiv svelte-wbgs4m"),p($,"font-size","12px"),f(y,"href","/wakacje"),p(y,"color","black"),f(C,"class","counterdiv svelte-wbgs4m"),f(U,"href","/customsave"),p(U,"color","black"),f(q,"type","text"),f(q,"placeholder","Nazwa odliczania (bez znaków specjalnych)"),f(q,"class","svelte-wbgs4m"),f(R,"type","date"),f(R,"id","inputcustomdate"),f(R,"class","svelte-wbgs4m"),f(F,"type","time"),f(F,"id","inputcustomtime"),f(F,"class","svelte-wbgs4m"),f(X,"href",it="/custom?name="+e[5]+"&date="+e[4]+"&time="+e[6]),p(X,"font-size","14px"),f(P,"class","maeformdiv svelte-wbgs4m"),f(a,"class","counter-holder svelte-wbgs4m"),f(a,"id","counter-holder"),f(lt,"class","nav svelte-wbgs4m")},m(t,s){c(t,n,s),i(n,a),i(a,o),i(a,g),i(a,w),i(a,b),i(a,C),i(C,y),i(y,x),i(y,z),i(y,$),i(y,k),i(y,M),i(M,_),i(M,j),i(y,L),i(y,H),i(H,A),i(H,E),i(y,V),i(y,O),i(O,T),i(O,B),i(y,S),i(y,N),i(N,I),i(N,K),i(a,W),i(a,P),i(P,D),i(P,G),i(P,U),i(P,Z),i(P,q),m(q,e[5]),i(P,J),i(P,R),m(R,e[4]),i(P,Y),i(P,F),m(F,e[6]),i(P,Q),i(P,X),i(X,tt),i(X,et),i(X,nt),i(X,st),i(X,at),i(X,ot),c(t,ct,s),c(t,lt,s),rt||(ut=[v(q,"input",e[7]),v(R,"input",e[8]),v(F,"input",e[9])],rt=!0)},p(t,[e]){1&e&&h(j,t[0]),2&e&&h(E,t[1]),4&e&&h(B,t[2]),8&e&&h(K,t[3]),32&e&&q.value!==t[5]&&m(q,t[5]),16&e&&m(R,t[4]),64&e&&m(F,t[6]),32&e&&h(et,t[5]),16&e&&h(st,t[4]),64&e&&h(ot,t[6]),112&e&&it!==(it="/custom?name="+t[5]+"&date="+t[4]+"&time="+t[6])&&f(X,"href",it)},i:t,o:t,d(t){t&&l(n),t&&l(ct),t&&l(lt),rt=!1,s(ut)}}}function O(t,e,n){const s=new Date(2022,8,1,8,0,0);let a,o,i,c,l="",r="",u="";return setInterval((function(){const t=new Date,e=s-t;n(0,a=Math.floor(e/864e5*1e4)/1e4),n(1,o=Math.floor(e/36e5*1e3)/1e3),n(2,i=Math.floor(e/6e4*100)/100),n(3,c=Math.floor(e/1e3))}),500),[a,o,i,c,l,r,u,function(){r=this.value,n(5,r)},function(){l=this.value,n(4,l)},function(){u=this.value,n(6,u)}]}return new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),E(this,t,O,V,o,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
