import{b as D,d as le,s as $e,e as je,p as Pe,f as J}from"./turf-BP-HaPIv.js";import{L as S}from"./leaflet-Dnf0cGhb.js";import{p as Ne,s as ze}from"./shpjs-CdX8gPbU.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function r(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(a){if(a.ep)return;a.ep=!0;const n=r(a);fetch(a.href,n)}})();const Oe="VanuatuNBSAP",Ie=1;let _=null;function O(){return _?Promise.resolve(_):new Promise((e,t)=>{const r=indexedDB.open(Oe,Ie);r.onupgradeneeded=o=>{const a=o.target.result;if(!a.objectStoreNames.contains("layers")){const n=a.createObjectStore("layers",{keyPath:"id"});n.createIndex("category","metadata.category",{unique:!1}),n.createIndex("uploadTimestamp","metadata.uploadTimestamp",{unique:!1})}a.objectStoreNames.contains("metrics")||a.createObjectStore("metrics",{keyPath:"id",autoIncrement:!0}),a.objectStoreNames.contains("auditLog")||a.createObjectStore("auditLog",{keyPath:"id",autoIncrement:!0}).createIndex("timestamp","timestamp",{unique:!1}),a.objectStoreNames.contains("settings")||a.createObjectStore("settings",{keyPath:"key"})},r.onsuccess=o=>{_=o.target.result,e(_)},r.onerror=o=>{t(new Error(`IndexedDB error: ${o.target.error}`))}})}async function P(e,t,r){const o=await O();return new Promise((a,n)=>{const i=o.transaction(e,t),s=i.objectStore(e),l=r(s);l&&l.onsuccess!==void 0?(l.onsuccess=()=>a(l.result),l.onerror=()=>n(l.error)):(i.oncomplete=()=>a(l),i.onerror=()=>n(i.error))})}async function me(){const e=await O();return new Promise((t,r)=>{const n=e.transaction("layers","readonly").objectStore("layers").getAll();n.onsuccess=()=>t(n.result||[]),n.onerror=()=>r(n.error)})}async function fe(e){return P("layers","readwrite",t=>t.put(e))}async function _e(e){return P("layers","readwrite",t=>t.delete(e))}async function ye(e={}){const t=await O();return new Promise((r,o)=>{const n=t.transaction("metrics","readonly").objectStore("metrics").getAll();n.onsuccess=()=>r(n.result||[]),n.onerror=()=>o(n.error)})}async function Fe(e){const t={...e,timestamp:new Date().toISOString()};return P("auditLog","readwrite",r=>r.add(t))}async function ve(){const e=await O();return new Promise((t,r)=>{const a=e.transaction("auditLog","readonly").objectStore("auditLog").getAll();a.onsuccess=()=>{const n=a.result||[];n.sort((i,s)=>(s.timestamp||"").localeCompare(i.timestamp||"")),t(n)},a.onerror=()=>r(a.error)})}async function He(){const e=await me(),t=await ve(),r=await ye();return{version:1,exportTimestamp:new Date().toISOString(),layers:e,auditLog:t,metrics:r}}async function Ue(e){if(!e||e.version!==1)throw new Error("Invalid backup format");const t=await O(),r=["layers","auditLog","metrics"];for(const o of r)await new Promise((a,n)=>{const s=t.transaction(o,"readwrite").objectStore(o).clear();s.onsuccess=()=>a(),s.onerror=()=>n(s.error)});for(const o of e.layers||[])await fe(o);for(const o of e.auditLog||[])await P("auditLog","readwrite",a=>{const{id:n,...i}=o;return a.add(i)});for(const o of e.metrics||[])await P("metrics","readwrite",a=>{const{id:n,...i}=o;return a.add(i)});return{layersImported:(e.layers||[]).length}}const De=Object.freeze(Object.defineProperty({__proto__:null,addAuditEntry:Fe,deleteLayer:_e,exportBackup:He,getAuditLog:ve,getMetrics:ye,importBackup:Ue,listLayers:me,saveLayer:fe},Symbol.toStringTag,{value:"Module"})),{listLayers:qe,saveLayer:he,deleteLayer:Ve,addAuditEntry:q,getAuditLog:ce,exportBackup:Ge,importBackup:Je}=De,v={layers:[],provincesGeojson:null,provinces:[],filters:{targets:[],province:"All",category:"All",realm:"All",year:"All"},isAdmin:!1};function x(){return v}function B(e){Object.assign(v.filters,e),V()}function be(e){const t=v.layers.findIndex(r=>r.id===e.id);t>=0?v.layers[t]=e:v.layers.push(e),te(),V()}function Ke(e){v.layers=v.layers.filter(t=>t.id!==e),te(),V()}function Ye(e){v.layers=e,te()}function We(e){if(v.provincesGeojson=e,e&&e.features){const t=e.features.map(r=>r.properties.name||r.properties.province||r.properties.NAME||"").filter(Boolean).sort();v.provinces=[...new Set(t)]}}function xe(e){v.isAdmin=e,V()}function te(){var t,r;const e=new Set(v.provinces);for(const o of v.layers)for(const a of((t=o.geojson)==null?void 0:t.features)||[])(r=a.properties)!=null&&r.province&&e.add(a.properties.province);v.provinces=[...e].sort()}function V(){window.dispatchEvent(new CustomEvent("nbsap:refresh"))}const Ze="7a92f1b582a6cde7e41f2f5ed6e89a9d1f5a8d3b9c0e7f2a4b6c8d0e1f3a5b7c";let G=!1,ae=null;async function Xe(e){const r=new TextEncoder().encode(e),o=await crypto.subtle.digest("SHA-256",r);return Array.from(new Uint8Array(o)).map(a=>a.toString(16).padStart(2,"0")).join("")}function Qe(){return localStorage.getItem("nbsap_admin_hash")||Ze}async function et(e){if(!e)return{success:!1,error:"Passphrase required"};const t=await Xe(e),r=Qe();return t===r?(G=!0,ae="admin",{success:!0}):{success:!1,error:"Invalid passphrase"}}function tt(){G=!1,ae=null}function at(){return{isAuthenticated:G,user:ae,provider:"local-passphrase"}}function rt(){return G}const ot=Object.freeze(Object.defineProperty({__proto__:null,getAuthState:at,isAdmin:rt,login:et,logout:tt},Symbol.toStringTag,{value:"Module"})),{login:nt,logout:it,getAuthState:st,isAdmin:N}=ot,we=[{code:"T1",name:"Target 1: Spatial Planning",description:"Plan and manage all areas to reduce biodiversity loss, ensuring participation of indigenous peoples and local communities.",isMetricTarget:!1,recommendedCategories:["OTHER"]},{code:"T2",name:"Target 2: Ecosystem Restoration",description:"Ensure effective restoration of at least 30% of degraded terrestrial, inland water, coastal and marine ecosystems.",isMetricTarget:!1,recommendedCategories:["RESTORATION"]},{code:"T3",name:"Target 3: 30x30 Conservation",description:"Ensure at least 30% of terrestrial and 30% of marine areas are effectively conserved through protected areas and OECMs.",isMetricTarget:!0,recommendedCategories:["CCA","MPA","PA","OECM"]},{code:"T4",name:"Target 4: Species Recovery",description:"Ensure urgent management actions to halt human-induced extinction of known threatened species and recover populations.",isMetricTarget:!1,recommendedCategories:["OTHER"]},{code:"T5",name:"Target 5: Sustainable Harvesting",description:"Ensure sustainable, safe and legal harvesting and trade of wild species.",isMetricTarget:!1,recommendedCategories:["OTHER"]},{code:"T6",name:"Target 6: Invasive Species",description:"Eliminate, minimize, reduce or mitigate impacts of invasive alien species on biodiversity.",isMetricTarget:!1,recommendedCategories:["INVASIVE"]},{code:"T7",name:"Target 7: Pollution Reduction",description:"Reduce pollution risks and the negative impact of pollution from all sources.",isMetricTarget:!1,recommendedCategories:["OTHER"]},{code:"T8",name:"Target 8: Climate Change",description:"Minimize the impact of climate change on biodiversity and contribute to mitigation and adaptation.",isMetricTarget:!1,recommendedCategories:["OTHER"]}],re={targets:we},lt=Object.freeze(Object.defineProperty({__proto__:null,default:re,targets:we},Symbol.toStringTag,{value:"Module"})),b={CCA:{label:"Community Conserved Area",defaultRealm:"terrestrial",color:"#2ecc71"},MPA:{label:"Marine Protected Area",defaultRealm:"marine",color:"#3498db"},PA:{label:"Protected Area",defaultRealm:"terrestrial",color:"#27ae60"},OECM:{label:"Other Effective Conservation Measure",defaultRealm:"terrestrial",color:"#9b59b6"},KBA:{label:"Key Biodiversity Area",defaultRealm:"terrestrial",color:"#e67e22"},RESTORATION:{label:"Restoration Site",defaultRealm:"terrestrial",color:"#f1c40f"},INVASIVE:{label:"Invasive Species Area",defaultRealm:"terrestrial",color:"#e74c3c"},OTHER:{label:"Other",defaultRealm:"terrestrial",color:"#95a5a6"}},ct=Object.keys(b);function dt(e){const t=x(),r=t.provinces||[];e.innerHTML=`
    <div class="filter-panel">
      <div class="filter-panel-header">
        <span>Filters</span>
        <button class="btn btn-sm btn-outline" id="btn-clear-filters">Clear</button>
      </div>

      <div class="filter-group">
        <label>NBSAP Target</label>
        <div class="target-checkboxes" id="target-filter-checkboxes">
          ${re.targets.map(o=>`
            <label class="target-checkbox ${t.filters.targets.includes(o.code)?"selected":""}"
                   data-code="${o.code}" title="${o.description}">
              <input type="checkbox" value="${o.code}"
                     ${t.filters.targets.includes(o.code)?"checked":""}>
              ${o.code}
            </label>
          `).join("")}
        </div>
      </div>

      <div class="filter-group">
        <label>Province</label>
        <select id="filter-province">
          <option value="All">All Provinces</option>
          ${r.map(o=>`
            <option value="${o}" ${t.filters.province===o?"selected":""}>${o}</option>
          `).join("")}
        </select>
      </div>

      <div class="filter-group">
        <label>Category</label>
        <select id="filter-category">
          <option value="All">All Categories</option>
          ${Object.entries(b).map(([o,a])=>`
            <option value="${o}" ${t.filters.category===o?"selected":""}>${a.label}</option>
          `).join("")}
        </select>
      </div>

      <div class="filter-group">
        <label>Realm</label>
        <select id="filter-realm">
          <option value="All" ${t.filters.realm==="All"?"selected":""}>All</option>
          <option value="terrestrial" ${t.filters.realm==="terrestrial"?"selected":""}>Terrestrial</option>
          <option value="marine" ${t.filters.realm==="marine"?"selected":""}>Marine</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Year</label>
        <select id="filter-year">
          <option value="All">All Years</option>
        </select>
      </div>
    </div>
  `,e.querySelectorAll(".target-checkbox").forEach(o=>{o.addEventListener("click",a=>{a.preventDefault();const n=o.dataset.code,i=[...t.filters.targets],s=i.indexOf(n);s>=0?i.splice(s,1):i.push(n),B({targets:i})})}),e.querySelector("#filter-province").addEventListener("change",o=>{B({province:o.target.value})}),e.querySelector("#filter-category").addEventListener("change",o=>{B({category:o.target.value})}),e.querySelector("#filter-realm").addEventListener("change",o=>{B({realm:o.target.value})}),e.querySelector("#filter-year").addEventListener("change",o=>{B({year:o.target.value})}),e.querySelector("#btn-clear-filters").addEventListener("click",()=>{B({targets:[],province:"All",category:"All",realm:"All",year:"All"})}),pt(e.querySelector("#filter-year"),t)}function pt(e,t){var a;const r=new Set;for(const n of t.layers||[])for(const i of((a=n.geojson)==null?void 0:a.features)||[])i.properties.year&&r.add(i.properties.year);const o=[...r].sort((n,i)=>i-n);for(const n of o){const i=document.createElement("option");i.value=n,i.textContent=n,t.filters.year===String(n)&&(i.selected=!0),e.appendChild(i)}}const R={basePath:"./",apiBaseUrl:"",storageBackend:"indexeddb",authProvider:"local-passphrase",tileSources:{osm:{name:"OpenStreetMap",url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19},esriSatellite:{name:"Esri Satellite",url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",attribution:"&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",maxZoom:18},cartoLight:{name:"CartoDB Light",url:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",attribution:'&copy; <a href="https://carto.com/">CARTO</a>',maxZoom:19}},maxUploadSizeMB:50,maxFeaturesPerLayer:5e4,sliverThresholdM2:5,simplifyTolerance:1e-4,nationalBaselines:{terrestrial_ha:1219e3,marine_ha:663e5},mapCenter:[-16.5,168],mapZoom:7};function ut(e){if(!e||!e.geometry||!e.geometry.type.includes("Polygon"))return 0;try{return D(e)/1e4}catch{return 0}}function Ae(e){return{type:"FeatureCollection",features:(e.features||[]).map(t=>({...t,properties:{...t.properties,area_ha:Math.round(ut(t)*100)/100}}))}}function oe(e,t={}){var d;const r=R.nationalBaselines;let o=0,a=0,n=0;const i={};for(const m of e){const p=m.metadata;if(!p.countsToward30x30||!p.targets||!p.targets.includes("T3"))continue;const f=(((d=m.geojson)==null?void 0:d.features)||[]).filter(h=>!(t.province&&t.province!=="All"&&h.properties.province!==t.province));for(const h of f){const g=h.properties.area_ha||0,M=h.properties.realm||p.realm||"terrestrial";M==="marine"?a+=g:o+=g,n++;const w=h.properties.province||"Unassigned";i[w]||(i[w]={terrestrial_ha:0,marine_ha:0,features:0}),M==="marine"?i[w].marine_ha+=g:i[w].terrestrial_ha+=g,i[w].features++}}const s=r.terrestrial_ha>0?o/r.terrestrial_ha*100:0,l=r.marine_ha>0?a/r.marine_ha*100:0,c=Object.entries(i).map(([m,p])=>({province:m,...p,total_ha:p.terrestrial_ha+p.marine_ha})).sort((m,p)=>p.total_ha-m.total_ha);return{terrestrial_ha:Math.round(o*100)/100,marine_ha:Math.round(a*100)/100,terrestrial_pct:Math.round(s*1e3)/1e3,marine_pct:Math.round(l*1e3)/1e3,terrestrial_remaining_pct:Math.round((30-s)*1e3)/1e3,marine_remaining_pct:Math.round((30-l)*1e3)/1e3,total_features:n,provinceBreakdown:c,baselines:r}}function Se(e,t={}){var i;let r=0,o=0;const a={},n={terrestrial:0,marine:0};for(const s of e){const l=s.metadata;if(t.targets&&t.targets.length>0&&!l.targets.some(d=>t.targets.includes(d)))continue;const c=(((i=s.geojson)==null?void 0:i.features)||[]).filter(d=>!(t.province&&t.province!=="All"&&d.properties.province!==t.province));for(const d of c){r++,o+=d.properties.area_ha||0;const m=l.category||"OTHER";a[m]=(a[m]||0)+1;const p=d.properties.realm||"terrestrial";n[p]=(n[p]||0)+1}}return{totalFeatures:r,totalAreaHa:Math.round(o*100)/100,categoryCounts:a,realmCounts:n}}function gt(e){const t=x(),r=t.filters,o=t.layers||[];r.targets.length===0||r.targets.includes("T3")?mt(e,o,r):ft(e,o,r)}function mt(e,t,r){const o=oe(t,r),a=Math.min(o.terrestrial_pct,100),n=Math.min(o.marine_pct,100);e.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${Y(o.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
        <div class="kpi-sublabel">Conserved area</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${Y(o.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
        <div class="kpi-sublabel">Conserved area</div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Terrestrial: ${o.terrestrial_pct.toFixed(2)}% of 30% target</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill terrestrial"
               style="width: ${(a/30*100).toFixed(1)}%">
            ${o.terrestrial_pct>=1?o.terrestrial_pct.toFixed(1)+"%":""}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${o.terrestrial_remaining_pct>0?`${o.terrestrial_remaining_pct.toFixed(2)}% remaining to reach 30%`:"Target reached!"}
        </div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Marine: ${o.marine_pct.toFixed(2)}% of 30% target</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill marine"
               style="width: ${(n/30*100).toFixed(1)}%">
            ${o.marine_pct>=1?o.marine_pct.toFixed(1)+"%":""}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${o.marine_remaining_pct>0?`${o.marine_remaining_pct.toFixed(2)}% remaining to reach 30%`:"Target reached!"}
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-value">${o.total_features}</div>
        <div class="kpi-label">Features</div>
        <div class="kpi-sublabel">Counted toward 30x30</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${o.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With conservation areas</div>
      </div>
    </div>
  `}function ft(e,t,r){const o=Se(t,r);e.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${o.totalFeatures}</div>
        <div class="kpi-label">Total Features</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${Y(o.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${o.realmCounts.terrestrial||0}</div>
        <div class="kpi-label">Terrestrial</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${o.realmCounts.marine||0}</div>
        <div class="kpi-label">Marine</div>
      </div>
    </div>
  `}function Y(e){return e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":e.toFixed(e%1===0?0:1)}let y=null,K={},H=S.layerGroup(),F=null;function yt(e){if(y)return y.invalidateSize(),y;y=S.map(e,{center:R.mapCenter,zoom:R.mapZoom,zoomControl:!0});for(const[r,o]of Object.entries(R.tileSources))K[o.name]=S.tileLayer(o.url,{attribution:o.attribution,maxZoom:o.maxZoom});const t=Object.values(K)[0];return t&&t.addTo(y),H.addTo(y),S.control.layers(K,{},{position:"topright"}).addTo(y),S.control.scale({imperial:!1,position:"bottomleft"}).addTo(y),y}function vt(){var a;if(!y)return;H.clearLayers(),F&&(F.remove(),F=null);const e=x(),t=e.filters,r=e.layers||[];e.provincesGeojson&&(F=S.geoJSON(e.provincesGeojson,{style:{color:"#555",weight:1.5,fillOpacity:.03,dashArray:"4 4"},onEachFeature:(n,i)=>{const s=n.properties.name||n.properties.province||"Unknown";i.bindTooltip(s,{sticky:!0,className:"province-tooltip"})}}).addTo(y));for(const n of r){const i=n.metadata;if(t.targets.length>0&&!i.targets.some(d=>t.targets.includes(d))||t.category&&t.category!=="All"&&i.category!==t.category)continue;const s=b[i.category]||b.OTHER,l=ht(((a=n.geojson)==null?void 0:a.features)||[],t);if(l.length===0)continue;const c=S.geoJSON({type:"FeatureCollection",features:l},{style:()=>({color:s.color,weight:2,fillOpacity:.25,fillColor:s.color}),pointToLayer:(d,m)=>S.circleMarker(m,{radius:6,fillColor:s.color,color:"#fff",weight:1,fillOpacity:.8}),onEachFeature:(d,m)=>{const p=d.properties,f=`
          <div style="min-width:200px">
            <strong>${p.name||"Unnamed"}</strong><br>
            <small>${i.category} | ${p.realm||""} | ${p.province||"No province"}</small>
            <hr style="margin:6px 0;border:none;border-top:1px solid #eee">
            <table style="font-size:12px;width:100%">
              <tr><td><b>Type:</b></td><td>${p.type||"-"}</td></tr>
              <tr><td><b>Status:</b></td><td>${p.status||"-"}</td></tr>
              <tr><td><b>Year:</b></td><td>${p.year||"-"}</td></tr>
              <tr><td><b>Area:</b></td><td>${p.area_ha?p.area_ha.toFixed(2)+" ha":"-"}</td></tr>
              <tr><td><b>Source:</b></td><td>${p.source||"-"}</td></tr>
              <tr><td><b>Targets:</b></td><td>${(p.targets||[]).join(", ")}</td></tr>
            </table>
            ${p.notes?`<p style="font-size:11px;margin-top:6px;color:#666">${p.notes}</p>`:""}
          </div>
        `;m.bindPopup(f)}});H.addLayer(c)}const o=H.getBounds();o.isValid()&&y.fitBounds(o,{padding:[30,30],maxZoom:12})}function ht(e,t){return e.filter(r=>{const o=r.properties||{};return!(t.province&&t.province!=="All"&&o.province!==t.province||t.realm&&t.realm!=="All"&&o.realm!==t.realm||t.year&&t.year!=="All"&&String(o.year)!==String(t.year))})}function bt(){y&&setTimeout(()=>y.invalidateSize(),100)}function xt(e,t){if(!t||t.length===0){e.innerHTML='<p style="color:var(--text-light);font-size:13px;padding:10px">No province data available</p>';return}const r=Math.max(...t.map(a=>a.total_ha),1),o=t.map(a=>{const n=(a.terrestrial_ha/r*100).toFixed(1),i=(a.marine_ha/r*100).toFixed(1);return`
      <div class="bar-row">
        <span class="bar-label" title="${a.province}">${a.province}</span>
        <div class="bar-track">
          <div class="bar-fill terrestrial" style="width: ${n}%; position:absolute; left:0; top:0; height:100%"></div>
          <div class="bar-fill marine" style="width: ${i}%; position:absolute; left:${n}%; top:0; height:100%"></div>
        </div>
        <span class="bar-value">${L(a.total_ha)}</span>
      </div>
    `}).join("");e.innerHTML=`
    <div class="chart-container">
      <div style="display:flex;gap:14px;margin-bottom:8px;font-size:11px">
        <span><span style="display:inline-block;width:10px;height:10px;background:var(--primary);border-radius:2px;margin-right:4px"></span>Terrestrial</span>
        <span><span style="display:inline-block;width:10px;height:10px;background:var(--secondary);border-radius:2px;margin-right:4px"></span>Marine</span>
      </div>
      <div class="bar-chart" style="position:relative">
        ${o}
      </div>
    </div>
  `,e.querySelectorAll(".bar-track").forEach(a=>{a.style.position="relative"})}function wt(e,t){if(!t||t.length===0){e.innerHTML='<p style="color:var(--text-light);font-size:13px">No data</p>';return}const r=t.map(a=>`
    <tr>
      <td>${a.province}</td>
      <td style="text-align:right">${L(a.terrestrial_ha)}</td>
      <td style="text-align:right">${L(a.marine_ha)}</td>
      <td style="text-align:right"><strong>${L(a.total_ha)}</strong></td>
      <td style="text-align:right">${a.features}</td>
    </tr>
  `).join(""),o=t.reduce((a,n)=>({terrestrial_ha:a.terrestrial_ha+n.terrestrial_ha,marine_ha:a.marine_ha+n.marine_ha,total_ha:a.total_ha+n.total_ha,features:a.features+n.features}),{terrestrial_ha:0,marine_ha:0,total_ha:0,features:0});e.innerHTML=`
    <table class="data-table">
      <thead>
        <tr>
          <th>Province</th>
          <th style="text-align:right">Terrestrial (ha)</th>
          <th style="text-align:right">Marine (ha)</th>
          <th style="text-align:right">Total (ha)</th>
          <th style="text-align:right">Features</th>
        </tr>
      </thead>
      <tbody>
        ${r}
      </tbody>
      <tfoot>
        <tr style="font-weight:600;border-top:2px solid var(--border)">
          <td>Total</td>
          <td style="text-align:right">${L(o.terrestrial_ha)}</td>
          <td style="text-align:right">${L(o.marine_ha)}</td>
          <td style="text-align:right">${L(o.total_ha)}</td>
          <td style="text-align:right">${o.features}</td>
        </tr>
      </tfoot>
    </table>
  `}function L(e){return!e&&e!==0?"-":e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":e.toFixed(1)}function At(){var n;const e=x(),t=e.layers||[],r=e.filters;r.targets.length===0||r.targets.includes("T3");const o=[["Layer","Category","Realm","Province","Name","Area (ha)","Targets","Status","Year"]];for(const i of t){const s=i.metadata;if(!(r.targets.length>0&&!s.targets.some(l=>r.targets.includes(l)))&&!(r.category&&r.category!=="All"&&s.category!==r.category))for(const l of((n=i.geojson)==null?void 0:n.features)||[]){const c=l.properties||{};r.province&&r.province!=="All"&&c.province!==r.province||r.realm&&r.realm!=="All"&&c.realm!==r.realm||r.year&&r.year!=="All"&&String(c.year)!==String(r.year)||o.push([s.name,s.category,c.realm||"",c.province||"",c.name||"",(c.area_ha||0).toFixed(2),(c.targets||[]).join(";"),c.status||"",c.year||""])}}const a=o.map(i=>i.map(s=>`"${String(s).replace(/"/g,'""')}"`).join(",")).join(`
`);Ee(a,"nbsap-export.csv","text/csv")}function St(){const e=x(),t=e.filters,r=e.layers||[],o=t.targets.length===0||t.targets.includes("T3"),a={type:"TOR_Reporting_Snapshot",version:"1.0",timestamp:new Date().toISOString(),filters:{...t},includedLayers:[],metrics:{}};o&&(a.metrics=oe(r,t));const n=Se(r,t);a.metrics.general=n;for(const s of r){const l=s.metadata;t.targets.length>0&&!l.targets.some(c=>t.targets.includes(c))||t.category&&t.category!=="All"&&l.category!==t.category||a.includedLayers.push({id:l.id,name:l.name,category:l.category,targets:l.targets,realm:l.realm,featureCount:l.featureCount,totalAreaHa:l.totalAreaHa,countsToward30x30:l.countsToward30x30,status:l.status})}const i=JSON.stringify(a,null,2);Ee(i,"tor-snapshot.json","application/json")}async function Et(){try{const e=document.getElementById("map");if(!e)throw new Error("Map not found");const t=document.createElement("canvas"),r=e.getBoundingClientRect();t.width=r.width*2,t.height=r.height*2;const o=t.getContext("2d");o.scale(2,2),o.fillStyle="#f0f0f0",o.fillRect(0,0,r.width,r.height),o.fillStyle="#333",o.font="14px sans-serif",o.fillText("Map export — use browser Print/Screenshot for full fidelity",20,r.height/2),t.toBlob(a=>{if(a){const n=URL.createObjectURL(a),i=document.createElement("a");i.href=n,i.download="nbsap-map.png",i.click(),URL.revokeObjectURL(n)}})}catch{alert("Map PNG export is limited in-browser. Use browser screenshot (Ctrl+Shift+S) for best results.")}}function Ee(e,t,r){const o=new Blob([e],{type:r}),a=URL.createObjectURL(o),n=document.createElement("a");n.href=a,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(a)}function kt(){const e=document.getElementById("page-dashboard");e.innerHTML=`
    <div class="dashboard-layout">
      <div class="dashboard-sidebar">
        <div id="filter-panel-container"></div>
        <div id="kpi-container"></div>
        <div class="sidebar-section-title">Export Data</div>
        <div class="export-toolbar">
          <button class="btn btn-sm btn-outline" id="btn-export-csv" title="Export filtered data as CSV">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>
          <button class="btn btn-sm btn-outline" id="btn-export-json" title="Export TOR reporting snapshot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            JSON
          </button>
          <button class="btn btn-sm btn-outline" id="btn-export-png" title="Export map view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            PNG
          </button>
        </div>
      </div>
      <div class="dashboard-main">
        <div class="map-container">
          <div id="map"></div>
        </div>
        <div class="dashboard-bottom" id="dashboard-bottom">
          <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap">
            <div style="flex:1;min-width:300px">
              <div class="breakdown-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8"/><rect x="14" y="6" width="3" height="12"/></svg>
                Provincial Breakdown
              </div>
              <div id="province-table-container"></div>
            </div>
            <div style="flex:1;min-width:300px">
              <div class="breakdown-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                Area by Province
              </div>
              <div id="province-chart-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,setTimeout(()=>{yt("map"),ne()},50),document.getElementById("btn-export-csv").addEventListener("click",At),document.getElementById("btn-export-json").addEventListener("click",St),document.getElementById("btn-export-png").addEventListener("click",Et)}function ne(){const e=x(),t=document.getElementById("filter-panel-container");t&&dt(t);const r=document.getElementById("kpi-container");r&&gt(r),vt();const o=e.filters,a=o.targets.length===0||o.targets.includes("T3"),n=document.getElementById("province-table-container"),i=document.getElementById("province-chart-container");if(a){const s=oe(e.layers,o);n&&wt(n,s.provinceBreakdown),i&&xt(i,s.provinceBreakdown)}else n&&(n.innerHTML='<p style="color:var(--text-tertiary);font-size:13px;padding:12px 0">Select Target 3 to see provincial breakdown</p>'),i&&(i.innerHTML="")}function Ct(){bt(),ne()}const Tt="modulepreload",Lt=function(e,t){return new URL(e,t).href},de={},Mt=function(t,r,o){let a=Promise.resolve();if(r&&r.length>0){const i=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),l=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));a=Promise.allSettled(r.map(c=>{if(c=Lt(c,o),c in de)return;de[c]=!0;const d=c.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(!!o)for(let h=i.length-1;h>=0;h--){const g=i[h];if(g.href===c&&(!d||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${m}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":Tt,d||(f.as="script"),f.crossOrigin="",f.href=c,l&&f.setAttribute("nonce",l),document.head.appendChild(f),d)return new Promise((h,g)=>{f.addEventListener("load",h),f.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(i){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=i,window.dispatchEvent(s),!s.defaultPrevented)throw i}return a.then(i=>{for(const s of i||[])s.status==="rejected"&&n(s.reason);return t().catch(n)})};function Bt(e){if(!e)return"EPSG:4326";const t=e.trim();if(/WGS.?84/i.test(t)&&/GEOGCS/i.test(t)&&!/UTM/i.test(t))return"EPSG:4326";const r=t.match(/UTM[_ ]?[Zz]one[_ ]?(\d+)([NS]?)/i);if(r){const o=parseInt(r[1],10);return/S/i.test(r[2])||/south/i.test(t)?`EPSG:${32700+o}`:`EPSG:${32600+o}`}return t.length>10?t:"EPSG:4326"}function Rt(e,t){if(!t||t==="EPSG:4326")return{geojson:e,reprojected:!1,error:null};try{const r=Ne(t,"EPSG:4326");return{geojson:{type:"FeatureCollection",features:e.features.map(a=>a.geometry?{...a,geometry:$t(a.geometry,r)}:a)},reprojected:!0,error:null}}catch(r){return{geojson:e,reprojected:!1,error:`Reprojection failed: ${r.message}`}}}function $t(e,t){const r=e.type;return r==="Point"?{type:r,coordinates:t.forward(e.coordinates)}:r==="MultiPoint"||r==="LineString"?{type:r,coordinates:e.coordinates.map(o=>t.forward(o))}:r==="MultiLineString"||r==="Polygon"?{type:r,coordinates:e.coordinates.map(o=>o.map(a=>t.forward(a)))}:r==="MultiPolygon"?{type:r,coordinates:e.coordinates.map(o=>o.map(a=>a.map(n=>t.forward(n))))}:e}function jt(e){const t=[],r={},o=[];let a=0;for(const n of e.features||[]){if(!n.geometry||!n.geometry.type||!n.geometry.coordinates){a++;continue}const i=n.geometry.type;r[i]=(r[i]||0)+1,o.push(n)}return a>0&&t.push(`Removed ${a} feature(s) with null/empty geometry`),{cleaned:{type:"FeatureCollection",features:o},stats:{typeCounts:r,originalCount:(e.features||[]).length,validCount:o.length},warnings:t}}function Pt(e){var n,i;const t=[];let r=0,o=0;const a=[];for(const s of e.features){if(!s.geometry.type.includes("Polygon")){a.push(s);continue}try{let c=le(s,0,{units:"meters"});if(!c||!c.geometry){const p=$e(s,{tolerance:R.simplifyTolerance,highQuality:!0});c=le(p,0,{units:"meters"})}if(!c||!c.geometry){o++,t.push(`Dropped feature "${((n=s.properties)==null?void 0:n.name)||"unknown"}" — unfixable geometry`);continue}const d=D(c);if(d<R.sliverThresholdM2){o++,t.push(`Removed sliver polygon (${d.toFixed(1)} m²)`);continue}const m=D(s);Math.abs(m-d)>.01&&r++,a.push({type:"Feature",geometry:c.geometry,properties:s.properties})}catch(c){a.push(s),t.push(`Could not validate geometry for "${((i=s.properties)==null?void 0:i.name)||"unknown"}": ${c.message}`)}}return r>0&&t.push(`Fixed ${r} geometry issue(s) via buffer(0)`),{cleaned:{type:"FeatureCollection",features:a},fixedCount:r,droppedCount:o,warnings:t}}const Nt="Maps uploaded shapefile field names to standard schema fields, by category. First match wins.",zt={name:["name","site_name","area_name","site_nm","NAME","Name","SITE_NAME","AREA_NAME","label","LABEL","title","TITLE"],type:["type","TYPE","Type","category","CATEGORY","designation","DESIGNATION","desig","DESIG","class","CLASS"],realm:["realm","REALM","Realm","domain","DOMAIN","environment","ENVIRONMENT"],province:["province","PROVINCE","Province","state","STATE","region","REGION","island","ISLAND","prov","PROV"],year:["year","YEAR","Year","est_year","EST_YEAR","date","DATE","year_est","YEAR_EST","established"],status:["status","STATUS","Status","condition","CONDITION","state","mgmt_status"],source:["source","SOURCE","Source","data_src","DATA_SRC","origin","ORIGIN","provider"],notes:["notes","NOTES","Notes","comments","COMMENTS","description","DESCRIPTION","desc","DESC","remarks","REMARKS"]},Ot={name:["cca_name","CCA_NAME","community_area","COMMUNITY_AREA"],type:["cca_type","CCA_TYPE"]},It={name:["mpa_name","MPA_NAME","marine_area","MARINE_AREA"],type:["mpa_type","MPA_TYPE","protection_level"]},_t={name:["pa_name","PA_NAME","park_name","PARK_NAME","protected_area"],type:["pa_type","PA_TYPE","iucn_cat","IUCN_CAT"]},Ft={name:["oecm_name","OECM_NAME"],type:["oecm_type","OECM_TYPE"]},Ht={name:["kba_name","KBA_NAME","iba_name"],type:["kba_type","KBA_TYPE","trigger"]},Ut={name:["restoration_name","project_name","PROJECT_NAME"],type:["restoration_type","activity"]},Dt={name:["species_name","SPECIES","invasive_name"],type:["invasive_type","threat_type","species_type"]},pe={_comment:Nt,global:zt,CCA:Ot,MPA:It,PA:_t,OECM:Ft,KBA:Ht,RESTORATION:Ut,INVASIVE:Dt};function C(e,t,r){const o=Object.keys(e),a=o.map(s=>s.toLowerCase()),n=pe[r];if(n&&n[t])for(const s of n[t]){const l=a.indexOf(s.toLowerCase());if(l!==-1)return e[o[l]]}const i=pe.global;if(i&&i[t])for(const s of i[t]){const l=a.indexOf(s.toLowerCase());if(l!==-1)return e[o[l]]}}function T(e){return typeof e!="string"?e:e.trim().normalize("NFC").replace(/\s+/g," ")}function qt(e,t){const r=t.category||"OTHER",o=T(C(e,"name",r))||"Unnamed",a=T(C(e,"type",r))||r,n=T(C(e,"realm",r))||t.realm||"terrestrial",i=T(C(e,"province",r))||"",s=C(e,"year",r),l=s&&parseInt(s,10)||null,c=T(C(e,"status",r))||"Unknown",d=T(C(e,"source",r))||"",m=T(C(e,"notes",r))||"";return{name:o,type:a,realm:n,province:i,year:l,status:c,source:d,notes:m,targets:[...t.targets||[]],upload_timestamp:t.uploadTimestamp||new Date().toISOString(),layer_id:t.layerId||"",original_filename:t.originalFilename||"",uploaded_by:t.uploadedBy||"admin"}}function Vt(e,t){return{type:"FeatureCollection",features:(e.features||[]).map(r=>({type:"Feature",geometry:r.geometry,properties:qt(r.properties||{},t)}))}}function Gt(e){if(!e.geometry)return null;const t=e.geometry.type;if(t==="Point")return e;if(t==="MultiPolygon"){const r=e.geometry.coordinates;let o=0,a=null;for(const n of r){const i=Pe(n),s=D(i);s>o&&(o=s,a=i)}return a?J(a):J(e)}try{return J(e)}catch{return null}}function Jt(e,t){const r=t.features||[];return{type:"FeatureCollection",features:e.features.map(a=>{if(a.properties.province)return a;const n=Gt(a);if(!n)return a;for(const i of r)try{const s=i.properties.name||i.properties.province||i.properties.NAME||i.properties.PROVINCE||"";if(je(n,i))return{...a,properties:{...a.properties,province:s}}}catch{continue}return a})}}function W(e={}){return{id:e.id||Kt(),name:e.name||"Untitled Layer",originalFilename:e.originalFilename||"",category:e.category||"OTHER",targets:e.targets||[],realm:e.realm||"terrestrial",countsToward30x30:e.countsToward30x30||!1,uploadTimestamp:e.uploadTimestamp||new Date().toISOString(),uploadedBy:e.uploadedBy||"admin",detectedCRS:e.detectedCRS||"EPSG:4326",featureCount:e.featureCount||0,validGeometryCount:e.validGeometryCount||0,fixedCount:e.fixedCount||0,droppedCount:e.droppedCount||0,totalAreaHa:e.totalAreaHa||0,status:e.status||"Clean",warnings:e.warnings||[],notes:e.notes||""}}function Kt(){return"layer_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8)}function ke(e,t){const r=[],o=t.features||[];(!e.targets||e.targets.length===0)&&r.push("Layer has no targets assigned"),e.category||r.push("Layer has no category assigned");let a=0,n=0,i=0;for(const s of o){const l=s.properties||{};l.province||a++,(!l.name||l.name==="Unnamed")&&n++,s.geometry||i++}return a>0&&r.push(`${a} feature(s) missing province assignment`),n>0&&r.push(`${n} feature(s) with missing/default name`),i>0&&r.push(`${i} feature(s) with null geometry`),e.detectedCRS&&e.detectedCRS!=="EPSG:4326"&&r.push(`CRS is ${e.detectedCRS} — may need verification`),{compliant:r.length===0,issues:r}}async function Yt(e,t,r,o){const a={steps:[],warnings:[],errors:[]},n=(A,k)=>{a.steps.push({step:A,message:k,timestamp:new Date().toISOString()}),o&&o(A,k)};n(1,"Validating geometries...");const{cleaned:i,stats:s,warnings:l}=jt(e);if(a.warnings.push(...l),n(1,`Valid: ${s.validCount}/${s.originalCount} features. Types: ${JSON.stringify(s.typeCounts)}`),i.features.length===0)return a.errors.push("No valid features found after basic validation"),{geojson:i,metadata:W({name:t.name,status:"Failed"}),report:a};n(2,"Checking CRS...");const c=Bt(t.prjText);n(2,`Detected CRS: ${c}`);let d=i;if(c!=="EPSG:4326"){n(2,"Reprojecting to WGS84...");const{geojson:A,reprojected:k,error:se}=Rt(i,c);se&&(a.warnings.push(se),a.warnings.push("Unverified CRS — layer loaded but coordinates may be incorrect")),d=A,k&&n(2,"Reprojection successful")}n(3,"Fixing geometry issues...");const{cleaned:m,fixedCount:p,droppedCount:f,warnings:h}=Pt(d);a.warnings.push(...h),n(3,`Fixed: ${p}, Dropped: ${f}`),n(4,"Standardizing attributes...");const g=W({name:t.name||t.originalFilename,originalFilename:t.originalFilename,category:t.category,targets:t.targets,realm:t.realm,countsToward30x30:t.countsToward30x30,detectedCRS:c,uploadedBy:t.uploadedBy||"admin"}),M=Vt(m,{category:t.category,targets:t.targets,realm:t.realm,layerId:g.id,originalFilename:t.originalFilename,uploadTimestamp:g.uploadTimestamp,uploadedBy:t.uploadedBy||"admin"});n(4,`Mapped ${M.features.length} features to standard schema`),n(5,"Assigning provinces...");let w=M;if(r&&r.features&&r.features.length>0){w=Jt(M,r);const A=w.features.filter(k=>k.properties.province).length;n(5,`Province assigned to ${A}/${w.features.length} features`)}else a.warnings.push("No provinces boundary data — province assignment skipped"),n(5,"Skipped — no provinces data");n(6,"Computing areas...");const $=Ae(w),ie=$.features.reduce((A,k)=>A+(k.properties.area_ha||0),0);n(6,`Total area: ${ie.toFixed(2)} ha`),g.featureCount=$.features.length,g.validGeometryCount=$.features.filter(A=>A.geometry).length,g.fixedCount=p,g.droppedCount=f,g.totalAreaHa=ie;const Me=a.errors.length>0,Be=a.warnings.length>0;g.status=Me?"Failed":Be?"Warnings":"Clean",g.warnings=a.warnings;const Re=ke(g,$);return a.torCompliance=Re,n(7,`Pipeline complete. Status: ${g.status}`),{geojson:$,metadata:g,report:a}}let u={step:1,file:null,geojson:null,prjText:null,opts:{}};function Wt(){u={step:1,file:null,geojson:null,prjText:null,opts:{}},document.getElementById("upload-wizard-modal").classList.add("active"),z()}function Zt(){document.getElementById("upload-wizard-modal").classList.remove("active")}function z(){const e=document.getElementById("wizard-body"),t=document.getElementById("wizard-steps"),r=["File","Configure","Processing","Results"];switch(t.innerHTML=r.map((o,a)=>{const n=a+1;let i="";return n<u.step&&(i="done"),n===u.step&&(i="active"),`<div class="wizard-step ${i}">${n}. ${o}</div>`}).join(""),u.step){case 1:Xt(e);break;case 2:Qt(e);break;case 3:ea(e);break;case 4:ta(e);break}}function Xt(e){e.innerHTML=`
    <div class="form-group">
      <label>Upload Zipped Shapefile (.zip)</label>
      <input type="file" id="wizard-file-input" accept=".zip">
      <div class="form-hint">Must contain .shp, .shx, .dbf, .prj (optionally .cpg)</div>
    </div>
    <div id="wizard-file-status" style="margin-top:10px"></div>
    <div style="margin-top:16px;text-align:right">
      <button class="btn btn-outline" onclick="document.getElementById('upload-wizard-modal').classList.remove('active')">Cancel</button>
      <button class="btn btn-primary" id="wizard-next-1" disabled>Next</button>
    </div>
  `;const t=e.querySelector("#wizard-file-input"),r=e.querySelector("#wizard-next-1"),o=e.querySelector("#wizard-file-status");t.addEventListener("change",async a=>{const n=a.target.files[0];if(n){o.innerHTML="<p>Parsing shapefile...</p>";try{const i=await n.arrayBuffer(),s=await ze(i),l=Array.isArray(s)?s[0]:s;if(!l||!l.features||l.features.length===0){o.innerHTML='<p style="color:var(--danger)">No features found in shapefile</p>';return}u.file=n,u.geojson=l,u.opts.originalFilename=n.name,u.prjText=null,o.innerHTML=`
        <p style="color:var(--success)">Parsed successfully: ${l.features.length} features</p>
        <p style="font-size:12px;color:var(--text-light)">
          Geometry types: ${[...new Set(l.features.map(c=>{var d;return(d=c.geometry)==null?void 0:d.type}).filter(Boolean))].join(", ")}
        </p>
      `,r.disabled=!1}catch(i){o.innerHTML=`<p style="color:var(--danger)">Error parsing: ${i.message}</p>`}}}),r.addEventListener("click",()=>{u.step=2,z()})}function Qt(e){var o;e.innerHTML=`
    <div class="form-group">
      <label>Layer Name</label>
      <input type="text" id="wizard-name" value="${((o=u.opts.originalFilename)==null?void 0:o.replace(".zip",""))||""}">
    </div>

    <div class="form-group">
      <label>Category</label>
      <select id="wizard-category">
        ${ct.map(a=>`<option value="${a}">${b[a].label}</option>`).join("")}
      </select>
    </div>

    <div class="form-group">
      <label>Targets (select at least one)</label>
      <div id="wizard-targets" class="target-checkboxes">
        ${re.targets.map(a=>`
          <label class="target-checkbox" data-code="${a.code}">
            <input type="checkbox" value="${a.code}">
            ${a.code}
          </label>
        `).join("")}
      </div>
    </div>

    <div class="form-group">
      <label>Realm</label>
      <select id="wizard-realm">
        <option value="terrestrial">Terrestrial</option>
        <option value="marine">Marine</option>
      </select>
    </div>

    <div class="form-group">
      <label class="toggle-switch">
        <input type="checkbox" id="wizard-30x30">
        <span class="toggle-track"></span>
        Counts toward 30x30 (Target 3 only)
      </label>
      <div class="form-hint">Only meaningful if Target 3 is selected</div>
    </div>

    <div style="margin-top:16px;display:flex;justify-content:space-between">
      <button class="btn btn-outline" id="wizard-back-2">Back</button>
      <button class="btn btn-primary" id="wizard-next-2">Process</button>
    </div>
  `;const t=e.querySelector("#wizard-category"),r=e.querySelector("#wizard-realm");t.addEventListener("change",()=>{const a=b[t.value];a&&(r.value=a.defaultRealm)}),e.querySelectorAll("#wizard-targets .target-checkbox").forEach(a=>{a.addEventListener("click",n=>{n.preventDefault(),a.classList.toggle("selected");const i=a.querySelector("input");i.checked=!i.checked})}),e.querySelector("#wizard-back-2").addEventListener("click",()=>{u.step=1,z()}),e.querySelector("#wizard-next-2").addEventListener("click",()=>{const a=[...e.querySelectorAll("#wizard-targets input:checked")].map(n=>n.value);if(a.length===0){alert("Please select at least one target");return}u.opts.name=e.querySelector("#wizard-name").value||"Untitled",u.opts.category=t.value,u.opts.targets=a,u.opts.realm=r.value,u.opts.countsToward30x30=e.querySelector("#wizard-30x30").checked,u.opts.prjText=u.prjText,u.step=3,z()})}function ea(e){e.innerHTML=`
    <p style="margin-bottom:10px;font-weight:600">Running auto-cleaning pipeline...</p>
    <div class="pipeline-log" id="pipeline-log"></div>
    <div id="pipeline-status" style="margin-top:10px"></div>
  `;const t=e.querySelector("#pipeline-log"),r=e.querySelector("#pipeline-status");function o(n,i=""){const s=document.createElement("div");s.className=`log-entry ${i}`,s.textContent=`[${new Date().toLocaleTimeString()}] ${n}`,t.appendChild(s),t.scrollTop=t.scrollHeight}const a=x();Yt(u.geojson,u.opts,a.provincesGeojson,(n,i)=>o(`Step ${n}: ${i}`)).then(async n=>{u.result=n;for(const s of n.report.warnings)o(`WARNING: ${s}`,"log-warn");for(const s of n.report.errors)o(`ERROR: ${s}`,"log-error");const i={id:n.metadata.id,metadata:n.metadata,geojson:n.geojson};await he(i),be(i),await q({action:"upload",layer_id:n.metadata.id,filename:n.metadata.originalFilename,targets:n.metadata.targets,category:n.metadata.category,result:n.metadata.status}),r.innerHTML=`
      <p style="color:var(--success);font-weight:600">Pipeline complete. Status: ${n.metadata.status}</p>
      <button class="btn btn-primary" id="wizard-next-3" style="margin-top:10px">View Results</button>
    `,e.querySelector("#wizard-next-3").addEventListener("click",()=>{u.step=4,z()})}).catch(n=>{o(`FATAL: ${n.message}`,"log-error"),r.innerHTML=`
      <p style="color:var(--danger)">Pipeline failed: ${n.message}</p>
      <button class="btn btn-outline" onclick="document.getElementById('upload-wizard-modal').classList.remove('active')">Close</button>
    `})}function ta(e){const t=u.result;if(!t){e.innerHTML="<p>No results</p>";return}const r=t.metadata,o=t.report.torCompliance||{compliant:!1,issues:[]};e.innerHTML=`
    <h4 style="margin-bottom:12px">${r.name}</h4>
    <table class="data-table" style="margin-bottom:16px">
      <tr><td><b>Category</b></td><td>${r.category}</td></tr>
      <tr><td><b>Targets</b></td><td>${r.targets.join(", ")}</td></tr>
      <tr><td><b>Realm</b></td><td>${r.realm}</td></tr>
      <tr><td><b>Features</b></td><td>${r.featureCount}</td></tr>
      <tr><td><b>Area</b></td><td>${r.totalAreaHa.toFixed(2)} ha</td></tr>
      <tr><td><b>Fixed</b></td><td>${r.fixedCount} geometries</td></tr>
      <tr><td><b>Dropped</b></td><td>${r.droppedCount} geometries</td></tr>
      <tr><td><b>CRS</b></td><td>${r.detectedCRS}</td></tr>
      <tr><td><b>Status</b></td><td><span class="badge badge-${r.status.toLowerCase()}">${r.status}</span></td></tr>
      <tr><td><b>30x30</b></td><td>${r.countsToward30x30?"Yes":"No"}</td></tr>
    </table>

    <div class="card" style="margin-bottom:12px">
      <div class="card-header">TOR Compliance</div>
      <div class="card-body">
        ${o.compliant?'<p style="color:var(--success);font-weight:600">All checks passed</p>':o.issues.map(a=>`<p style="color:var(--warning);font-size:13px">- ${a}</p>`).join("")}
      </div>
    </div>

    ${r.warnings.length>0?`
      <div class="card" style="margin-bottom:12px">
        <div class="card-header">Warnings</div>
        <div class="card-body">
          ${r.warnings.map(a=>`<p style="color:var(--warning);font-size:12px">- ${a}</p>`).join("")}
        </div>
      </div>
    `:""}

    <div style="display:flex;justify-content:space-between;margin-top:16px">
      <button class="btn btn-outline" id="wizard-download-geojson">Download Cleaned GeoJSON</button>
      <button class="btn btn-primary" id="wizard-done">Done</button>
    </div>
  `,e.querySelector("#wizard-download-geojson").addEventListener("click",()=>{const a=JSON.stringify(t.geojson,null,2),n=new Blob([a],{type:"application/json"}),i=URL.createObjectURL(n),s=document.createElement("a");s.href=i,s.download=`${r.name.replace(/\s+/g,"_")}_cleaned.geojson`,s.click(),URL.revokeObjectURL(i)}),e.querySelector("#wizard-done").addEventListener("click",()=>{Zt(),window.dispatchEvent(new CustomEvent("nbsap:refresh"))})}let Z="",X="All",Q="All",ee="All",j=null;function aa(){const e=document.getElementById("page-portal");e.innerHTML=`
    <div class="portal-layout">
      <div class="portal-main">
        <div class="portal-toolbar">
          <input type="text" class="search-input" id="portal-search" placeholder="Search layers by name, category, or target...">
          <select id="portal-filter-target">
            <option value="All">All Targets</option>
          </select>
          <select id="portal-filter-category">
            <option value="All">All Categories</option>
            ${Object.entries(b).map(([t,r])=>`<option value="${t}">${r.label}</option>`).join("")}
          </select>
          <select id="portal-filter-status">
            <option value="All">All Status</option>
            <option value="Clean">Clean</option>
            <option value="Warnings">Warnings</option>
            <option value="Failed">Failed</option>
          </select>
          <button class="btn btn-primary" id="btn-upload-layer" style="display:none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Layer
          </button>
        </div>
        <div id="portal-table-container"></div>
      </div>
      <div class="portal-sidebar" id="portal-sidebar">
        <div class="detail-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <p><strong>Layer Details</strong></p>
          <p>Select a layer to view metadata and compliance information</p>
        </div>
      </div>
    </div>
  `,N()&&(document.getElementById("btn-upload-layer").style.display=""),Mt(()=>Promise.resolve().then(()=>lt),void 0,import.meta.url).then(t=>{const r=document.getElementById("portal-filter-target");for(const o of t.default.targets){const a=document.createElement("option");a.value=o.code,a.textContent=o.code,r.appendChild(a)}}),document.getElementById("portal-search").addEventListener("input",t=>{Z=t.target.value.toLowerCase(),E()}),document.getElementById("portal-filter-target").addEventListener("change",t=>{X=t.target.value,E()}),document.getElementById("portal-filter-category").addEventListener("change",t=>{Q=t.target.value,E()}),document.getElementById("portal-filter-status").addEventListener("change",t=>{ee=t.target.value,E()}),document.getElementById("btn-upload-layer").addEventListener("click",Wt),E()}function E(){const e=x(),t=document.getElementById("portal-table-container");if(!t)return;let r=e.layers||[];if(r=r.filter(o=>{const a=o.metadata;return!(Z&&!`${a.name} ${a.category} ${a.targets.join(" ")} ${a.originalFilename}`.toLowerCase().includes(Z)||X!=="All"&&!a.targets.includes(X)||Q!=="All"&&a.category!==Q||ee!=="All"&&a.status!==ee)}),r.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
        </div>
        <div class="empty-state-title">No layers found</div>
        <div class="empty-state-text">${N()?"Upload a shapefile to get started":"No data available yet"}</div>
      </div>
    `;return}t.innerHTML=`
    <table class="data-table">
      <thead>
        <tr>
          <th>Layer Name</th>
          <th>Category</th>
          <th>Targets</th>
          <th>Realm</th>
          <th>Features</th>
          <th>Status</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${r.map(o=>{var i;const a=o.metadata,n=b[a.category]||{};return`
            <tr data-layer-id="${o.id}" class="${j===o.id?"selected":""}" style="cursor:pointer">
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="width:4px;height:24px;border-radius:2px;background:${n.color||"#95a5a6"};flex-shrink:0"></span>
                  <strong>${a.name}</strong>
                </div>
              </td>
              <td><span style="font-size:12px;color:var(--text-secondary)">${((i=b[a.category])==null?void 0:i.label)||a.category}</span></td>
              <td>${a.targets.map(s=>`<span class="badge badge-info" style="margin-right:3px">${s}</span>`).join("")}</td>
              <td style="text-transform:capitalize">${a.realm}</td>
              <td>${a.featureCount}</td>
              <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
              <td style="font-size:12px;color:var(--text-secondary)">${new Date(a.uploadTimestamp).toLocaleDateString()}</td>
              <td class="actions">
                <button class="btn btn-sm btn-outline action-view" data-id="${o.id}">View</button>
                <button class="btn btn-sm btn-outline action-download" data-id="${o.id}">GeoJSON</button>
                ${N()?`<button class="btn btn-sm btn-danger action-remove" data-id="${o.id}">Remove</button>`:""}
              </td>
            </tr>
          `}).join("")}
      </tbody>
    </table>
  `,t.querySelectorAll("tr[data-layer-id]").forEach(o=>{o.addEventListener("click",a=>{a.target.closest("button")||(j=o.dataset.layerId,ue(j),E())})}),t.querySelectorAll(".action-view").forEach(o=>{o.addEventListener("click",()=>{j=o.dataset.id,ue(o.dataset.id),E()})}),t.querySelectorAll(".action-download").forEach(o=>{o.addEventListener("click",()=>ra(o.dataset.id))}),t.querySelectorAll(".action-remove").forEach(o=>{o.addEventListener("click",()=>oa(o.dataset.id))})}function ue(e){var s;const t=x(),r=document.getElementById("portal-sidebar"),o=t.layers.find(l=>l.id===e);if(!o){r.innerHTML='<div class="detail-placeholder"><p>Layer not found</p></div>';return}const a=o.metadata,n=ke(a,o.geojson),i=b[a.category]||{};r.innerHTML=`
    <div class="detail-header">
      <span style="width:4px;height:28px;border-radius:2px;background:${i.color||"#95a5a6"};flex-shrink:0"></span>
      <h4>${a.name}</h4>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="card-header">
        <span>Metadata</span>
        <span class="badge badge-${a.status.toLowerCase()}">${a.status}</span>
      </div>
      <div class="card-body">
        <table class="metadata-table">
          <tr><td>Original file</td><td>${a.originalFilename}</td></tr>
          <tr><td>Uploaded</td><td>${new Date(a.uploadTimestamp).toLocaleString()}</td></tr>
          <tr><td>Uploaded by</td><td>${a.uploadedBy}</td></tr>
          <tr><td>Category</td><td>${((s=b[a.category])==null?void 0:s.label)||a.category}</td></tr>
          <tr><td>Targets</td><td>${a.targets.map(l=>`<span class="badge badge-info" style="margin-right:3px">${l}</span>`).join("")}</td></tr>
          <tr><td>Realm</td><td style="text-transform:capitalize">${a.realm}</td></tr>
          <tr><td>CRS</td><td><code style="background:var(--gray-100);padding:2px 6px;border-radius:4px;font-size:12px">${a.detectedCRS}</code></td></tr>
          <tr><td>Features</td><td>${a.featureCount}</td></tr>
          <tr><td>Valid geometries</td><td>${a.validGeometryCount}</td></tr>
          <tr><td>Fixed</td><td>${a.fixedCount}</td></tr>
          <tr><td>Dropped</td><td>${a.droppedCount}</td></tr>
          <tr><td>Total area</td><td><strong>${a.totalAreaHa.toFixed(2)} ha</strong></td></tr>
          <tr><td>30x30</td><td>${a.countsToward30x30?'<span class="badge badge-success">Yes</span>':'<span class="badge" style="background:var(--gray-100);color:var(--text-secondary)">No</span>'}</td></tr>
        </table>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="card-header">TOR Compliance</div>
      <div class="card-body">
        ${n.compliant?'<div style="display:flex;align-items:center;gap:8px;color:var(--success);font-weight:600;font-size:13px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>All checks passed</div>':n.issues.map(l=>`<div style="display:flex;align-items:flex-start;gap:6px;color:var(--warning);font-size:12px;margin-bottom:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${l}</div>`).join("")}
      </div>
    </div>

    ${a.warnings.length>0?`
      <div class="card">
        <div class="card-header">Warnings (${a.warnings.length})</div>
        <div class="card-body">
          ${a.warnings.map(l=>`<div style="font-size:12px;color:var(--warning);margin-bottom:4px;display:flex;align-items:flex-start;gap:6px"><span style="flex-shrink:0">-</span>${l}</div>`).join("")}
        </div>
      </div>
    `:""}
  `}function ra(e){const r=x().layers.find(s=>s.id===e);if(!r)return;const o=JSON.stringify(r.geojson,null,2),a=new Blob([o],{type:"application/json"}),n=URL.createObjectURL(a),i=document.createElement("a");i.href=n,i.download=`${r.metadata.name.replace(/\s+/g,"_")}.geojson`,i.click(),URL.revokeObjectURL(n)}async function oa(e){var o,a,n;if(!confirm("Remove this layer? This cannot be undone."))return;const r=x().layers.find(i=>i.id===e);await Ve(e),Ke(e),await q({action:"delete",layer_id:e,filename:((o=r==null?void 0:r.metadata)==null?void 0:o.originalFilename)||"",targets:((a=r==null?void 0:r.metadata)==null?void 0:a.targets)||[],category:((n=r==null?void 0:r.metadata)==null?void 0:n.category)||"",result:"deleted"}),j=null,document.getElementById("portal-sidebar").innerHTML=`
    <div class="detail-placeholder">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
      <p><strong>Layer Details</strong></p>
      <p>Select a layer to view metadata and compliance information</p>
    </div>
  `,E()}function Ce(){if(N()){const e=document.getElementById("btn-upload-layer");e&&(e.style.display="")}E()}function na(){I()}function I(){const e=document.getElementById("page-admin");st().isAuthenticated?sa(e):ia(e)}function ia(e){e.innerHTML=`
    <div class="admin-layout">
      <div class="login-container">
        <div class="login-card">
          <div class="login-card-header">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:8px">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h3>Admin Login</h3>
            <p>Enter your passphrase to access management features</p>
          </div>
          <div class="login-card-body">
            <div class="form-group">
              <label>Passphrase</label>
              <input type="password" id="admin-passphrase" placeholder="Enter admin passphrase">
            </div>
            <div id="login-error" style="color:var(--danger);font-size:13px;margin-bottom:12px;display:none;padding:8px 12px;background:var(--danger-light);border-radius:var(--radius-sm)"></div>
            <button class="btn btn-primary" id="btn-admin-login" style="width:100%;justify-content:center;padding:10px">Login</button>
          </div>
        </div>
        <p style="font-size:11px;color:var(--text-tertiary);margin-top:16px;text-align:center">
          Default passphrase for demo: <code style="background:var(--gray-100);padding:2px 6px;border-radius:4px;font-size:11px">vanuatu2024</code>
        </p>
      </div>
    </div>
  `;const t=e.querySelector("#admin-passphrase"),r=e.querySelector("#btn-admin-login"),o=e.querySelector("#login-error"),a=async()=>{const n=await nt(t.value);n.success?(xe(!0),I(),Te(!0)):(o.textContent=n.error||"Login failed",o.style.display="")};r.addEventListener("click",a),t.addEventListener("keydown",n=>{n.key==="Enter"&&a()})}async function sa(e){const t=await ce();e.innerHTML=`
    <div class="admin-layout">
      <div class="admin-header">
        <div>
          <h2>Admin Panel</h2>
          <p style="font-size:13px;color:var(--text-secondary);margin-top:2px">Manage data, backups, and system settings</p>
        </div>
        <button class="btn btn-outline" id="btn-admin-logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Backup & Restore
          </div>
        </div>
        <div class="card-body" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <button class="btn btn-primary" id="btn-export-backup">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Backup
          </button>
          <label class="btn btn-secondary" style="cursor:pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import Backup
            <input type="file" id="btn-import-backup" accept=".json" style="display:none">
          </label>
          <span id="backup-status" style="font-size:13px;color:var(--text-secondary);margin-left:4px"></span>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Audit Log
          </div>
          <button class="btn btn-sm btn-outline" id="btn-export-audit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
        <div class="card-body" style="max-height:400px;overflow-y:auto;padding:0">
          ${t.length===0?'<div class="empty-state" style="padding:32px"><div class="empty-state-title">No actions recorded</div><div class="empty-state-text">Audit log entries will appear here as actions are performed</div></div>':`
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Layer</th>
                    <th>Category</th>
                    <th>Targets</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  ${t.map(r=>`
                    <tr>
                      <td style="font-size:12px;color:var(--text-secondary)">${new Date(r.timestamp).toLocaleString()}</td>
                      <td style="text-transform:capitalize;font-weight:500">${r.action||""}</td>
                      <td style="font-size:12px">${r.filename||r.layer_id||""}</td>
                      <td>${r.category||""}</td>
                      <td>${(r.targets||[]).map(o=>`<span class="badge badge-info" style="margin-right:2px">${o}</span>`).join("")}</td>
                      <td><span class="badge badge-${(r.result||"").toLowerCase()}">${r.result||""}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            `}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Auth Status
          </div>
        </div>
        <div class="card-body" style="font-size:13px">
          <table class="metadata-table">
            <tr><td>Provider</td><td>Local Passphrase</td></tr>
            <tr><td>Status</td><td><span class="badge badge-success">Authenticated</span></td></tr>
            <tr><td>Session</td><td>Active (clears on page reload)</td></tr>
          </table>
          <p style="margin-top:12px;color:var(--text-tertiary);font-size:12px">
            To change passphrase, update the hash in localStorage key <code style="background:var(--gray-100);padding:2px 6px;border-radius:4px;font-size:11px">nbsap_admin_hash</code>
            or use the auth provider API.
          </p>
        </div>
      </div>
    </div>
  `,e.querySelector("#btn-admin-logout").addEventListener("click",()=>{it(),xe(!1),I(),Te(!1)}),e.querySelector("#btn-export-backup").addEventListener("click",async()=>{const r=e.querySelector("#backup-status");r.textContent="Exporting...";try{const o=await Ge(),a=JSON.stringify(o,null,2),n=new Blob([a],{type:"application/json"}),i=URL.createObjectURL(n),s=document.createElement("a");s.href=i,s.download=`nbsap-backup-${new Date().toISOString().slice(0,10)}.json`,s.click(),URL.revokeObjectURL(i),await q({action:"export_backup",result:"success"}),r.textContent="Backup exported successfully"}catch(o){r.textContent=`Error: ${o.message}`}}),e.querySelector("#btn-import-backup").addEventListener("change",async r=>{const o=r.target.files[0];if(!o)return;const a=e.querySelector("#backup-status");a.textContent="Importing...";try{const n=await o.text(),i=JSON.parse(n),s=await Je(i);await q({action:"import_backup",result:"success",notes:`${s.layersImported} layers imported`}),a.textContent=`Imported ${s.layersImported} layers. Reloading...`,setTimeout(()=>window.location.reload(),1e3)}catch(n){a.textContent=`Import failed: ${n.message}`}}),e.querySelector("#btn-export-audit").addEventListener("click",async()=>{const r=await ce(),o=[["Timestamp","Action","Layer ID","Filename","Category","Targets","Result"]];for(const l of r)o.push([l.timestamp||"",l.action||"",l.layer_id||"",l.filename||"",l.category||"",(l.targets||[]).join(";"),l.result||""]);const a=o.map(l=>l.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join(`
`),n=new Blob([a],{type:"text/csv"}),i=URL.createObjectURL(n),s=document.createElement("a");s.href=i,s.download="audit-log.csv",s.click(),URL.revokeObjectURL(i)})}function Te(e){const t=document.getElementById("auth-badge");if(t){const r=t.querySelector("span");e?(r&&(r.textContent="Admin"),t.classList.add("admin")):(r&&(r.textContent="Public"),t.classList.remove("admin"))}}function la(){const e=document.getElementById("page-about");e.innerHTML=`
    <div class="about-layout">
      <h2>Vanuatu NBSAP GIS Data Portal</h2>
      <p>
        This portal supports monitoring and reporting for Vanuatu's
        <strong style="color:var(--text)">National Biodiversity Strategy and Action Plan (NBSAP)</strong>,
        with a focus on <strong style="color:var(--text)">Target 3 (30x30)</strong> &mdash; conserving at least 30%
        of terrestrial and 30% of marine areas by 2030.
      </p>

      <h3>What This Portal Does</h3>
      <ul>
        <li><strong style="color:var(--text)">Dashboard:</strong> View interactive maps, KPI widgets, and charts showing conservation progress by target and province.</li>
        <li><strong style="color:var(--text)">Data Portal:</strong> Upload, clean, and manage GIS layers (shapefiles). Automatic validation, CRS reprojection, and attribute standardization.</li>
        <li><strong style="color:var(--text)">Admin:</strong> Manage authentication, audit logs, and backup/restore operations.</li>
        <li><strong style="color:var(--text)">Exports:</strong> Download filtered data as CSV, JSON reporting snapshots, or cleaned GeoJSON files.</li>
      </ul>

      <h3>Data Sources</h3>
      <ul>
        <li><strong style="color:var(--text)">Protected Areas:</strong> WDPA (World Database on Protected Areas)</li>
        <li><strong style="color:var(--text)">Community Conserved Areas:</strong> DEPC Vanuatu records</li>
        <li><strong style="color:var(--text)">Marine Protected Areas:</strong> National marine management plans</li>
        <li><strong style="color:var(--text)">Key Biodiversity Areas:</strong> BirdLife International / KBA Partnership</li>
        <li><strong style="color:var(--text)">Province Boundaries:</strong> Vanuatu National Statistics Office</li>
      </ul>

      <h3>NBSAP Targets</h3>
      <p>
        The Kunming-Montreal Global Biodiversity Framework (GBF) sets 23 targets.
        This portal currently tracks Vanuatu's progress on key targets including:
      </p>
      <ul>
        <li><strong style="color:var(--text)">Target 3 (30x30):</strong> Conserve 30% of land and 30% of ocean by 2030</li>
        <li><strong style="color:var(--text)">Target 2:</strong> Restore 30% of degraded ecosystems</li>
        <li><strong style="color:var(--text)">Target 6:</strong> Manage invasive alien species</li>
      </ul>

      <h3>How to Use</h3>
      <ol style="margin-left:20px;margin-bottom:12px">
        <li>Use the <strong style="color:var(--text)">Dashboard</strong> tab to explore conservation data on the map</li>
        <li>Apply <strong style="color:var(--text)">filters</strong> by target, province, category, realm, or year</li>
        <li>View <strong style="color:var(--text)">KPI widgets</strong> for 30x30 progress metrics</li>
        <li>Use <strong style="color:var(--text)">Export</strong> buttons to download data for reporting</li>
        <li>Admin users can <strong style="color:var(--text)">upload</strong> new shapefile layers via the Data Portal</li>
      </ol>

      <h3>Technical Notes</h3>
      <ul>
        <li>All data is stored locally in your browser (IndexedDB) when using static hosting.</li>
        <li>Area calculations use geodesic methods (turf.area) for accuracy on WGS84 coordinates.</li>
        <li>The union/dissolve process removes overlapping areas to prevent double-counting.</li>
        <li>Province assignment uses centroid-in-polygon spatial joins.</li>
      </ul>

      <h3>Links & Resources</h3>
      <ul>
        <li><a href="https://www.cbd.int/gbf/targets/" target="_blank" rel="noopener">GBF Targets (CBD)</a></li>
        <li><a href="https://www.protectedplanet.net/" target="_blank" rel="noopener">Protected Planet / WDPA</a></li>
        <li><a href="https://www.keybiodiversityareas.org/" target="_blank" rel="noopener">Key Biodiversity Areas</a></li>
      </ul>

      <h3>Version</h3>
      <p>v1.0.0 &mdash; Built for the Department of Environmental Protection and Conservation (DEPC), Vanuatu.</p>

      <div style="margin-top:32px;padding:20px;background:var(--gray-50);border:1px solid var(--border);border-radius:var(--radius-md);font-size:12px;color:var(--text-secondary)">
        <p><strong style="color:var(--text)">Disclaimer:</strong> This is a monitoring tool. Data accuracy depends on the quality of uploaded layers.
        Always verify against official sources before using in formal reports.</p>
      </div>
    </div>
  `}const ca="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",da="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABSCAMAAAAhFXfZAAAC91BMVEVMaXEzeak2f7I4g7g3g7cua5gzeKg8hJo3grY4g7c3grU0gLI2frE0daAubJc2gbQwd6QzeKk2gLMtd5sxdKIua5g1frA2f7IydaM0e6w2fq41fK01eqo3grgubJgta5cxdKI1f7AydaQydaMxc6EubJgvbJkwcZ4ubZkwcJwubZgubJcydqUydKIxapgubJctbJcubZcubJcvbJYubJcvbZkubJctbJctbZcubJg2f7AubJcrbZcubJcubJcua5g3grY0fq8ubJcubJdEkdEwhsw6i88vhswuhcsuhMtBjMgthMsrg8srgss6is8qgcs8i9A9iMYtg8spgcoogMo7hcMngMonf8olfso4gr8kfck5iM8jfMk4iM8he8k1fro7itAgesk2hs8eecgzfLcofssdeMg0hc4cd8g2hcsxeLQbdsgZdcgxeLImfcszhM0vda4xgckzhM4xg84wf8Yxgs4udKsvfcQucqhUndROmdM1fK0wcZ8vb5w0eqpQm9MzeKhXoNVcpdYydKNWn9VZotVKltJFjsIwcJ1Rms9OlslLmtH///8+kc9epdYzd6dbo9VHkMM2f7FHmNBClM8ydqVcpNY9hro3gLM9hLczealQmcw3fa46f7A8gLMxc6I3eagyc6FIldJMl9JSnNRSntNNl9JPnNJFi75UnM9ZodVKksg8kM45jc09e6ZHltFBk883gbRBh7pDk9EwcaBzn784g7dKkcY2i81Om9M7j85Llc81is09g7Q4grY/j9A0eqxKmdFFltBEjcXf6fFImdBCiLxJl9FGlNFBi78yiMxVndEvbpo6js74+vx+psPP3+o/ks5HkcpGmNCjwdZCkNDM3ehYoNJEls+lxNkxh8xHks0+jdC1zd5Lg6r+/v/H2ufz9/o3jM3t8/edvdM/k89Th61OiLBSjbZklbaTt9BfptdjmL1AicBHj8hGk9FAgK1dkLNTjLRekrdClc/k7fM0icy0y9tgp9c4jc2NtM9Dlc8zicxeXZn3AAAAQ3RSTlMAHDdTb4yPA+LtnEQmC4L2EmHqB7XA0d0sr478x4/Yd5i1zOfyPkf1sLVq4Nh3FvjxopQ2/STNuFzUwFIwxKaejILpIBEV9wAABhVJREFUeF6s1NdyFEcYBeBeoQIhRAkLlRDGrhIgY3BJL8CVeKzuyXFzzjkn5ZxzzuScg3PO8cKzu70JkO0LfxdTU//pM9vTu7Xgf6KqOVTb9X7toRrVEfBf1HTVjZccrT/2by1VV928Yty9ZbVuucdz90frG8DBjl9pVApbOstvmMuvVgaNXSfAAd6pGxpy6yxf5ph43pS/4f3uoaGm2rdu72S9xzOvMymkZFq/ptDrk90mhW7e4zl7HLzhxGWPR20xmSxJ/VqldG5m9XhaVOA1DadsNh3Pu5L2N6QtPO/32JpqQBVVk20oy/Pi2s23WEvyfHbe1thadVQttvm7Llf65gGmXK67XtupyoM7HQhmXdLS8oGWJNeOJ3C5fG5XCEJnkez3/oFdsvgJ4l2ANZwhrJKk/7OSXa+3Vw2WJMlKnGkobouYk6T0TyX30klOUnTD9HJ5qpckL3EW/w4XF3Xd0FGywXUrstrclVsqz5Pd/sXFYyDnPdrLcQODmGOK47IZb4CmibmMn+MYRzFZ5jg33ZL/EJrWcszHmANy3ARBK/IXtciJy8VsitPSdE3uuHxzougojcUdr8/32atnz/ev3f/K5wtpxUTpcaI45zusVDpYtZi+jg0oU9b3x74h7+n9ABvYEZeKaVq0sh0AtLKsFtqNBdeT0MrSzwwlq9+x6xAO4tgOtSzbCjrNQQiNvQUbUEubvzBUeGw26yDCsRHCoLkTHDa7IdOLIThs/gHvChszh2CimE8peRs47cxANI0lYNB5y1DljpOF0IhzBDPOZnDOqYYbeGKECbPzWnXludPphw5c2YBq5zlwXphIbO4VDCZ0gnPfUO1TwZoYwAs2ExPCedAu9DAjfQUjzITQb3jNj0KG2Sgt6BHaQUdYzWz+XmBktOHwanXjaSTcwwziBcuMOtwBmqPrTOxFQR/DRKKPqyur0aiW6cULYsx6tBm0jXpR/AUWR6HRq9WVW6MRhIq5jLyjbaCTDCijyYJNpCajdyobP/eTw0iexBAKkJ3gA5KcQb2zBXsIBckn+xVv8jkZSaEFHE+jFEleAEfayRU0MouNoBmB/L50Ai/HSLIHxcrpCvnhSQAuakKp2C/YbCylJjXRVy/z3+Kv/RrNcCo+WUzlVEhzKffnTQnxeN9fWF88fiNCUdSTsaufaChKWInHeysygfpIqagoakW+vV20J8uyl6TyNKEZWV4oRSPyCkWpgOLSbkCObT8o2r6tlG58HQquf6O0v50tB7JM7F4EORd2dx/K0w/KHsVkLPaoYrwgP/y7krr3SSMA4zj+OBgmjYkxcdIJQyQRKgg2viX9Hddi9UBb29LrKR7CVVEEEXWojUkXNyfTNDE14W9gbHJNuhjDettN3ZvbOvdOqCD3Jp/9l+/wJE+9PkYGjx/fqkys3S2rMozM/o2106rfMUINo6hVqz+eu/hd1c4xTg0TAfy5kV+4UG6+IthHTU9woWmxuKNbTfuCSfovBCxq7EtHqvYL4Sm6F8GVxsSXHMQ07TOi1DKtZxjWaaIyi4CXWjxPccUw8WVbMYY5wxC1mzEyXMJWkllpRloi+Kkoq69sxBTlElF6aAxYUbjXNlhlDZilDnM4U5SlN5biRsRHnbx3mbeWjEh4mEyiuJDl5XcWVmX5GvNkFgLWZM5qwsop4/AWfLhU1cR7k1VVvcYCWRkOI6Xy5gmnphCYIkvzuNYzHzosq2oNk2RtSs8khfUOfHIDgR6ysYBaMpl4uEgk2U/oJTs9AaTSwma7dT69geAE2ZpEjUsn2ieJNHeKfrI3EcAGJ2ZaNgVuC8EBctCLc57P5u5led6IOBkIYkuQMrmmjChs4VkfOerHqSBkPzZlhe06RslZ3zMjk2sscqKwY0RcjKK+LWbzd7KiHhkncs/siFJ+V5eXxD34B8nVuJEpGJNmxN2gH3vSvp7J70tF+D1Ej8qUJD1TkErAND2GZwTFg/LubvmgiBG3SOvdlsqFQrkEzJCL1rstlnVFROixZoDDSuXQFHESwVGlcuQcMb/b42NgjLowh5MTDFE3vNB5qStRIErdCQEh6pLPR92anSUb/wAIhldAaDMpGgAAAABJRU5ErkJggg==",pa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC";delete S.Icon.Default.prototype._getIconUrl;S.Icon.Default.mergeOptions({iconUrl:ca,iconRetinaUrl:da,shadowUrl:pa});let U="dashboard";async function ua(){try{const r=await(await fetch("./data/provinces.geojson")).json();We(r)}catch(e){console.warn("Failed to load provinces data:",e)}try{const e=await qe();e.length>0?Ye(e):await ge()}catch(e){console.warn("Failed to load stored layers:",e),await ge()}kt(),aa(),na(),la(),ga(),window.addEventListener("nbsap:refresh",()=>{U==="dashboard"&&ne(),U==="portal"&&Ce(),U==="admin"&&I(),ma()}),Le("dashboard")}async function ge(){const e="./",t=[{file:"demo_cca.geojson",name:"Demo CCAs",category:"CCA",realm:"terrestrial"},{file:"demo_mpa.geojson",name:"Demo MPAs",category:"MPA",realm:"marine"}];for(const r of t)try{const a=await(await fetch(`${e}data/${r.file}`)).json(),n=Ae(a),i=W({name:r.name,originalFilename:r.file,category:r.category,targets:["T3"],realm:r.realm,countsToward30x30:!0,detectedCRS:"EPSG:4326",featureCount:n.features.length,validGeometryCount:n.features.length,totalAreaHa:n.features.reduce((l,c)=>l+(c.properties.area_ha||0),0),status:"Clean",uploadedBy:"system"}),s={id:i.id,metadata:i,geojson:n};await he(s),be(s)}catch(o){console.warn(`Failed to load demo data ${r.name}:`,o)}}function ga(){document.querySelectorAll(".nav-tab").forEach(e=>{e.addEventListener("click",()=>{Le(e.dataset.tab)})})}function Le(e){U=e,document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.toggle("active",t.dataset.tab===e)}),document.querySelectorAll(".page").forEach(t=>{t.classList.toggle("active",t.id===`page-${e}`)}),e==="dashboard"&&Ct(),e==="portal"&&Ce(),e==="admin"&&I()}function ma(){const e=document.getElementById("auth-badge");if(e){const t=e.querySelector("span");N()?(t&&(t.textContent="Admin"),e.classList.add("admin")):(t&&(t.textContent="Public"),e.classList.remove("admin"))}}ua().catch(e=>{console.error("App initialization failed:",e),document.body.innerHTML=`<div style="padding:40px;text-align:center">
    <h2>Failed to initialize</h2>
    <p>${e.message}</p>
  </div>`});
