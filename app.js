var v="@vercel/speed-insights",h="1.3.1",g=()=>{window.si||(window.si=function(...n){(window.siq=window.siq||[]).push(n)})};function m(){return typeof window<"u"}function p(){try{let e="production";if(e==="development"||e==="test")return"development"}catch{}return"production"}function a(){return p()==="development"}function w(e){return e.scriptSrc?e.scriptSrc:a()?"https://va.vercel-scripts.com/v1/speed-insights/script.debug.js":e.dsn?"https://va.vercel-scripts.com/v1/speed-insights/script.js":e.basePath?`${e.basePath}/speed-insights/script.js`:"/_vercel/speed-insights/script.js"}function d(e={}){var n;if(!m()||e.route===null)return null;g();let r=w(e);if(document.head.querySelector(`script[src*="${r}"]`))return null;e.beforeSend&&((n=window.si)==null||n.call(window,"beforeSend",e.beforeSend));let t=document.createElement("script");return t.src=r,t.defer=!0,t.dataset.sdkn=v+(e.framework?`/${e.framework}`:""),t.dataset.sdkv=h,e.sampleRate&&(t.dataset.sampleRate=e.sampleRate.toString()),e.route&&(t.dataset.route=e.route),e.endpoint?t.dataset.endpoint=e.endpoint:e.basePath&&(t.dataset.endpoint=`${e.basePath}/speed-insights/vitals`),e.dsn&&(t.dataset.dsn=e.dsn),a()&&e.debug===!1&&(t.dataset.debug="false"),t.onerror=()=>{console.log(`[Vercel Speed Insights] Failed to load script from ${r}. Please check if any content blockers are enabled and try again.`)},document.head.appendChild(t),{setRoute:i=>{t.dataset.route=i??void 0}}}d();async function $(){let e=document.getElementById("productSections");if(!e){console.error("productSections \uC694\uC18C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");return}try{let n=await fetch("./products.json",{cache:"no-store"});if(!n.ok)throw new Error(`products.json \uBD88\uB7EC\uC624\uAE30 \uC2E4\uD328: ${n.status} ${n.statusText}`);let r=await n.json(),{sectionOrder:t,sectionTitles:i,products:l}=r,u=t.map(c=>{let o=l.filter(s=>s.section===c);if(!o.length)return"";let f=o.map(s=>`
              <a class="link" href="${s.href}" target="_blank" rel="noopener noreferrer">
                <img
                  src="${s.image}"
                  class="link-thumb"
                  alt="${s.alt||s.title}"
                  loading="lazy"
                />
                <span class="link-text">${s.title}</span>
              </a>
            `).join("");return`
          <section class="product-section">
            <div class="section-title"><span>${i[c]||c}</span></div>
            <div class="links">
              ${f}
            </div>
          </section>
        `}).join("");e.innerHTML=u}catch(n){console.error(n),e.innerHTML=`
      <div class="links">
        <div class="link" style="pointer-events:none;">
          <span class="link-text">\uC0C1\uD488 \uC5C5\uB370\uC774\uD2B8 \uC911.</span>
        </div>
      </div>
    `}}document.addEventListener("DOMContentLoaded",$);
