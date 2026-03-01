const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-B2WcC-RY.js","./turf-CntlabHM.js","./index-D_Jpk_98.js"])))=>i.map(i=>d[i]);
import{i as Nn,a as Rn,p as In,b as Bn,g as Dn,c as Gs,d as ne,e as Yt,f as Ft,h as hr,s as Ha,w as ur,o as pr}from"./firebase-BrFGRS8q.js";import{a as $a,f as gi,u as mi,b as vi,s as Fn,d as On,e as jn,h as qn,p as zn,i as is}from"./turf-CntlabHM.js";import{L as z}from"./leaflet-CASSoK7o.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();const Un={apiKey:"AIzaSyB2OGgiXUUhyt1aKdHsqIaMS3NDN-tZOdU",authDomain:"vanuatu-nbsap-dashboard-9909a.firebaseapp.com",projectId:"vanuatu-nbsap-dashboard-9909a",storageBucket:"vanuatu-nbsap-dashboard-9909a.firebasestorage.app",messagingSenderId:"778670993904",appId:"1:778670993904:web:219c671804326d953aed35"},yi=Nn(Un,"nbsap-portal");let lt;try{lt=Rn(yi,{localCache:In({tabManager:Bn()})})}catch(t){console.warn("Firestore persistence not available, using default:",t.message),lt=Dn(yi)}const kt="nbsap_layers",Hn="nbsap_metrics",fr="nbsap_audit",Ns="nbsap_settings",Rs="chunks",wa=8e5,Vn=9e6,Wn=Math.floor(Vn/wa);async function Kn(t,e){await Is(t);const a=JSON.stringify(e),s=Math.ceil(a.length/wa),i=Math.min(499,Wn);for(let r=0;r<s;r+=i){const o=ur(lt),n=Math.min(r+i,s);for(let l=r;l<n;l++){const c=ne(lt,kt,t,Rs,String(l));o.set(c,{d:a.slice(l*wa,(l+1)*wa)})}await o.commit()}return s}async function gr(t){const e=await Yt(Ft(lt,kt,t,Rs));if(e.empty)return null;const a=e.docs.map(r=>({idx:parseInt(r.id,10),data:r.data().d})).sort((r,o)=>r.idx-o.idx);let s="";for(const r of a)s+=r.data,r.data=null;const i=JSON.parse(s);return s=null,i}async function Is(t){const e=await Yt(Ft(lt,kt,t,Rs));if(!e.empty)for(let a=0;a<e.docs.length;a+=499){const s=ur(lt),i=e.docs.slice(a,a+499);for(const r of i)s.delete(r.ref);await s.commit()}}async function mr(){const t=await Yt(Ft(lt,kt));if(t.empty)return[];const a=(await Promise.allSettled(t.docs.map(async s=>{const i=s.data(),r=await gr(s.id);return r?{id:s.id,metadata:i.metadata,geojson:r}:(console.warn(`Layer ${s.id}: no GeoJSON chunks found`),null)}))).filter(s=>s.status==="fulfilled"&&s.value!==null).map(s=>s.value);return a.sort((s,i)=>{var n,l;const r=((n=s.metadata)==null?void 0:n.uploadTimestamp)||"";return(((l=i.metadata)==null?void 0:l.uploadTimestamp)||"").localeCompare(r)}),a}async function Jn(){const t=await Yt(Ft(lt,kt));if(t.empty)return[];const e=t.docs.map(a=>{const s=a.data();return{id:a.id,metadata:s.metadata,geojson:null}});return e.sort((a,s)=>{var o,n;const i=((o=a.metadata)==null?void 0:o.uploadTimestamp)||"";return(((n=s.metadata)==null?void 0:n.uploadTimestamp)||"").localeCompare(i)}),e}async function Yn(){return(await Yt(Ft(lt,kt))).size}async function Zn(t){const e=ne(lt,kt,t),a=await Gs(e);if(!a.exists())return null;const s=a.data(),i=await gr(t);return{id:t,metadata:s.metadata,geojson:i}}async function Bs(t){const{id:e,metadata:a,geojson:s}=t,i=ne(lt,kt,e),r=await Kn(e,s);return await Ha(i,{metadata:a,_chunkCount:r}),t}async function Xn(t,e){const a=ne(lt,kt,t),s=await Gs(a);if(!s.exists())throw new Error(`Layer ${t} not found`);const i=s.data();await Ha(a,{...i,metadata:e})}async function Qn(t){await Is(t),await hr(ne(lt,kt,t))}async function vr(){return(await Yt(Ft(lt,Hn))).docs.map(e=>({id:e.id,...e.data()}))}async function yr(t){const e=`a_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,a={...t,timestamp:new Date().toISOString()};await Ha(ne(lt,fr,e),a)}async function Ds(){const e=(await Yt(Ft(lt,fr))).docs.map(a=>({id:a.id,...a.data()}));return e.sort((a,s)=>(s.timestamp||"").localeCompare(a.timestamp||"")),e}async function to(t){const e=await Gs(ne(lt,Ns,t));return e.exists()?e.data().value:null}async function eo(t,e){await Ha(ne(lt,Ns,t),{key:t,value:e})}async function ao(){const t=await mr(),e=await Ds(),a=await vr();return{version:1,exportTimestamp:new Date().toISOString(),layers:t,auditLog:e,metrics:a}}async function so(t){if(!t||t.version!==1)throw new Error("Invalid backup format");const e=await Yt(Ft(lt,kt));for(const a of e.docs)await Is(a.id),await hr(a.ref);for(const a of t.layers||[])await Bs(a);return{layersImported:(t.layers||[]).length}}async function io(t){if(!t||t.version!==1)throw new Error("Invalid backup format");let e=0,a=0;const s=await Yt(Ft(lt,kt)),i=new Set(s.docs.map(l=>l.id));for(const l of t.layers||[])l.id&&(i.has(l.id)?a++:e++,await Bs(l));const r=await Ds(),o=new Set(r.map(l=>`${l.timestamp}|${l.action}|${l.layer_id||""}`));let n=0;for(const l of t.auditLog||[]){const c=`${l.timestamp}|${l.action}|${l.layer_id||""}`;if(o.has(c)){n++;continue}await yr(l),o.add(c)}return{added:e,updated:a,skippedAudit:n}}function ro(t){return pr(Ft(lt,kt),e=>{const a={added:[],modified:[],removed:[]};e.docChanges().forEach(s=>{s.type==="added"&&a.added.push(s.doc.id),s.type==="modified"&&a.modified.push(s.doc.id),s.type==="removed"&&a.removed.push(s.doc.id)}),t(a)})}function no(t){return pr(Ft(lt,Ns),e=>{const a={};e.docs.forEach(s=>{a[s.id]=s.data().value}),t(a)})}const oo=Object.freeze(Object.defineProperty({__proto__:null,addAuditEntry:yr,countLayers:Yn,deleteLayer:Qn,exportBackup:ao,getAuditLog:Ds,getLayer:Zn,getMetrics:vr,getSetting:to,importBackup:so,listLayers:mr,listLayersMeta:Jn,onLayersChanged:ro,onSettingsChanged:no,saveLayer:Bs,saveLayerMetadata:Xn,setSetting:eo,syncImport:io},Symbol.toStringTag,{value:"Module"})),{listLayers:lo,listLayersMeta:co,countLayers:ho,getLayer:br,saveLayer:uo,saveLayerMetadata:_r,deleteLayer:Va,addAuditEntry:He,getAuditLog:bi,getSetting:_i,setSetting:pe,exportBackup:po,importBackup:fo,syncImport:go,onLayersChanged:mo,onSettingsChanged:vo}=oo,gt={basePath:"./",apiBaseUrl:"",storageBackend:"firestore",authProvider:"local-passphrase",tileSources:{osm:{name:"OpenStreetMap",url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19},esriSatellite:{name:"Esri Satellite",url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",attribution:"&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",maxZoom:18},cartoLight:{name:"CartoDB Light",url:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",attribution:'&copy; <a href="https://carto.com/">CARTO</a>',maxZoom:19}},maxUploadSizeMB:1024,maxFeaturesPerLayer:5e4,sliverThresholdM2:5,simplifyTolerance:1e-4,nationalBaselines:{terrestrial_ha:1219e3,marine_ha:663e5},mapCenter:[-16.5,168],mapZoom:7},K={EEZ:{label:"Exclusive Economic Zone",defaultRealm:"marine",color:"#0277BD"},ADMIN_BOUNDARY:{label:"National Boundary (Admin0)",defaultRealm:"terrestrial",color:"#37474F"},CCA:{label:"Community Conserved Area",defaultRealm:"terrestrial",color:"#2E7D32"},MPA:{label:"Marine Protected Area",defaultRealm:"marine",color:"#1565C0"},PA:{label:"Protected Area",defaultRealm:"terrestrial",color:"#1B5E20"},OECM:{label:"Other Effective Conservation Measure",defaultRealm:"terrestrial",color:"#7E57C2"},KBA:{label:"Key Biodiversity Area",defaultRealm:"terrestrial",color:"#EF6C00"},LMMA:{label:"Locally Managed Marine Area",defaultRealm:"marine",color:"#00796B"},INLAND_WATER:{label:"Inland Water",defaultRealm:"terrestrial",color:"#4FC3F7"},SPATIAL_PLAN:{label:"Biodiversity Spatial Plan",defaultRealm:"terrestrial",color:"#78909C"},DEGRADED:{label:"Degraded Area",defaultRealm:"terrestrial",color:"#D84315"},RESTORATION:{label:"Restoration Site",defaultRealm:"terrestrial",color:"#F9A825"},SPECIES_DIST:{label:"Species Distribution",defaultRealm:"terrestrial",color:"#26A69A"},MEGAPODE:{label:"Vanuatu Megapode",defaultRealm:"terrestrial",color:"#E65100"},STARLING:{label:"Mountain Starling",defaultRealm:"terrestrial",color:"#5C6BC0"},FANTAIL:{label:"Streaked Fantail",defaultRealm:"terrestrial",color:"#FFB300"},KINGFISHER:{label:"Vanuatu Kingfisher",defaultRealm:"terrestrial",color:"#00ACC1"},FLYING_FOX:{label:"Vanuatu Flying Fox",defaultRealm:"terrestrial",color:"#6D4C41"},PLERANDRA:{label:"Plerandra vanuatuensis",defaultRealm:"terrestrial",color:"#66BB6A"},INVASIVE:{label:"Invasive Alien Species",defaultRealm:"terrestrial",color:"#C62828"},MERREMIA:{label:"Merremia peltata (Big Leaf)",defaultRealm:"terrestrial",color:"#BF360C"},CROWN_OF_THORNS:{label:"Crown of Thorns Starfish",defaultRealm:"marine",color:"#FF6F00"},MILE_A_MINUTE:{label:"Mile a Minute Vine",defaultRealm:"terrestrial",color:"#AD1457"},SOLANUM_TORVUM:{label:"Solanum torvum (Devil Fig)",defaultRealm:"terrestrial",color:"#6A1B9A"},PESTICIDE:{label:"Pesticide / Herbicide Area",defaultRealm:"terrestrial",color:"#8E24AA"},EUTROPHICATION:{label:"Coastal Eutrophication Zone",defaultRealm:"marine",color:"#D81B60"},LAND_COVER:{label:"Land Cover / Land Use",defaultRealm:"terrestrial",color:"#795548"},GREEN_SPACE:{label:"Blue & Green Space",defaultRealm:"terrestrial",color:"#388E3C"},OTHER:{label:"Other",defaultRealm:"terrestrial",color:"#78909C"}},Mi=Object.keys(K);function fe(t,e){if(t.realm)return t.realm;if(e.realm&&e.realm!=="terrestrial")return e.realm;const a=e.category?K[e.category]:null;return a&&a.defaultRealm?a.defaultRealm:e.realm||"terrestrial"}const Wa=new Set(["Torba","Sanma","Penama","Malampa","Shefa","Tafea"]);let Mr=0;const Dt=new Map;function Ut(){Mr++,Dt.clear()}function ca(t,e,a){return`${Mr}:${t}:${e||""}:${JSON.stringify(a||{})}`}const Sa=100,Fs=500;function ht(t){if(!t||!t.geometry||!t.geometry.type.includes("Polygon"))return 0;try{return $a(t)/1e4}catch{return 0}}function xr(t){return{type:"FeatureCollection",features:(t.features||[]).map(e=>({...e,properties:{...e.properties,area_ha:Math.round(ht(e)*100)/100}}))}}function ot(t){const e=t.filter(a=>a&&a.geometry&&(a.geometry.type==="Polygon"||a.geometry.type==="MultiPolygon"));return e.length===0?null:e.length===1?e[0]:e.length>Fs?null:e.length>Sa?wr(e):vs(e)}function vs(t){try{const a=gi(t),s=mi(a);if(s)return s}catch{}let e=null;for(const a of t){if(!e){e=a;continue}try{const s=mi(gi([e,a]));s&&(e=s)}catch{}}return e}function wr(t){const e=[];for(let s=0;s<t.length;s+=Sa)e.push(t.slice(s,s+Sa));const a=e.map(s=>vs(s)).filter(Boolean);return a.length===0?null:a.length===1?a[0]:a.length>Sa?wr(a):vs(a)}function Le(t,e={}){var _;const a=ca("30x30",null,e),s=Dt.get(a);if(s)return s;const i=gt.nationalBaselines,r=[],o=[];let n=0,l=0,c=0;const u={};for(const x of t){const E=x.metadata;if(E.isReference||!E.countsToward30x30||!E.targets||!E.targets.includes("T3"))continue;const A=(((_=x.geojson)==null?void 0:_.features)||[]).filter(G=>!(e.province&&e.province!=="All"&&G.properties.province!==e.province));for(const G of A){const P=G.properties.area_ha||0,$=fe(G.properties,E);$==="marine"?(o.push(G),l+=P):(r.push(G),n+=P),c++;const S=G.properties.province||"Unassigned";u[S]||(u[S]={terrestrial:[],marine:[]}),$==="marine"?u[S].marine.push(G):u[S].terrestrial.push(G)}}const d=c>Fs,h=ot(r),f=ot(o),p=h?ht(h):n,m=f?ht(f):l,g=i.terrestrial_ha>0?p/i.terrestrial_ha*100:0,y=i.marine_ha>0?m/i.marine_ha*100:0,v=Object.entries(u).filter(([x])=>Wa.has(x)).map(([x,E])=>{let A,G;if(d)A=E.terrestrial.reduce((P,$)=>P+($.properties.area_ha||0),0),G=E.marine.reduce((P,$)=>P+($.properties.area_ha||0),0);else{const P=ot(E.terrestrial),$=ot(E.marine);A=P?ht(P):0,G=$?ht($):0}return{province:x,terrestrial_ha:U(A),marine_ha:U(G),total_ha:U(A+G),features:E.terrestrial.length+E.marine.length}}).sort((x,E)=>E.total_ha-x.total_ha),b={terrestrial_ha:U(p),marine_ha:U(m),terrestrial_pct:Wt(g),marine_pct:Wt(y),terrestrial_remaining_pct:Wt(Math.max(0,30-g)),marine_remaining_pct:Wt(Math.max(0,30-y)),gross_terrestrial_ha:U(n),gross_marine_ha:U(l),total_features:c,provinceBreakdown:v,baselines:i,dissolvedTerrestrial:h,dissolvedMarine:f};return Dt.set(a,b),b}const xi=new Set(["CCA","INLAND_WATER"]);function Ka(t,e={}){var $,S;const a=ca("t1",null,e),s=Dt.get(a);if(s)return s;const i=gt.nationalBaselines;let r=0,o=0;for(const w of t){const k=w.metadata;if(!k.isReference)continue;const I=(($=w.geojson)==null?void 0:$.features)||[];if(k.category==="EEZ")for(const O of I)r+=O.properties.area_ha||ht(O);else if(k.category==="ADMIN_BOUNDARY")for(const O of I)o+=O.properties.area_ha||ht(O)}r===0&&(r=i.marine_ha),o===0&&(o=i.terrestrial_ha);const n=Math.max(0,r-o),l=r>0?n/r*100:0,c=[];let u=0,d=0,h=0;const f={},p={},m={},g={};for(const w of t){const k=w.metadata;if(k.isReference||!xi.has(k.category))continue;const I=k.targets&&k.targets.includes("T1"),O=xi.has(k.category);if(!I&&!O||e.category&&e.category!=="All"&&k.category!==e.category)continue;h++;const C=k.category||"OTHER",L=(((S=w.geojson)==null?void 0:S.features)||[]).filter(N=>!(e.province&&e.province!=="All"&&N.properties.province!==e.province));for(const N of L){const j=N.properties.area_ha||0;d++,c.push(N),u+=j;const D=N.properties.province||"Unassigned";f[D]||(f[D]={terrestrial:0,tCount:0}),f[D].terrestrial+=j,f[D].tCount++,p[D]||(p[D]=[]),p[D].push(N),m[C]||(m[C]={area:0,count:0}),m[C].area+=j,m[C].count++,g[C]||(g[C]=[]),g[C].push(N)}}const y=ot(c),v=y?ht(y):u,b=i.terrestrial_ha>0?v/i.terrestrial_ha*100:0,_=Object.entries(f).filter(([w])=>Wa.has(w)).map(([w,k])=>{const I=p[w],O=I?ot(I):null,C=O?ht(O):k.terrestrial;return{province:w,terrestrial_ha:U(C),marine_ha:U(n),total_ha:U(C+n),features:k.tCount}}).sort((w,k)=>k.total_ha-w.total_ha),x=Object.entries(m).map(([w,k])=>{const I=ot(g[w]||[]),O=I?ht(I):k.area;return{category:w,area_ha:U(O),gross_area_ha:U(k.area),features:k.count}}).sort((w,k)=>k.area_ha-w.area_ha),E=i.terrestrial_ha+r,A=v+n,G=E>0?A/E*100:0,P={targetCode:"T1",terrestrial_ha:U(v),terrestrial_pct:Wt(b),gross_terrestrial_ha:U(u),marine_ha:U(n),marine_pct:Wt(l),eez_ha:U(r),boundary_ha:U(o),total_covered_ha:U(A),total_area_ha:U(E),total_pct:Wt(G),totalFeatures:d,layerCount:h,provinceBreakdown:_,categoryBreakdown:x,baselines:i,dissolvedTerrestrial:y};return Dt.set(a,P),P}const yo=new Set(["DEGRADED"]),bo=new Set(["RESTORATION"]);function Os(t,e={}){var $;const a=ca("t2",null,e),s=Dt.get(a);if(s)return s;const i=[],r=[];let o=0,n=0,l=0,c=0;const u={},d={},h={},f={};let p=0,m=0,g=0,y=0;for(const S of t){const w=S.metadata;if(w.isReference||!w.targets||!w.targets.includes("T2")||e.category&&e.category!=="All"&&w.category!==e.category)continue;const k=fe({},w);if(e.realm&&e.realm!=="All"&&k!==e.realm)continue;c++;const I=w.category||"OTHER",O=yo.has(I),C=bo.has(I),L=((($=S.geojson)==null?void 0:$.features)||[]).filter(N=>!(e.province&&e.province!=="All"&&N.properties.province!==e.province));for(const N of L){const j=N.properties.area_ha||0,D=fe(N.properties,w);l++,O?(i.push(N),o+=j,D==="marine"?m+=j:p+=j):C&&(r.push(N),n+=j,D==="marine"?y+=j:g+=j);const H=N.properties.province||"Unassigned";u[H]||(u[H]={degraded:0,restoration:0,count:0}),O&&(u[H].degraded+=j),C&&(u[H].restoration+=j),u[H].count++,d[H]||(d[H]={degraded:[],restoration:[]}),O&&d[H].degraded.push(N),C&&d[H].restoration.push(N),h[I]||(h[I]={area:0,count:0}),h[I].area+=j,h[I].count++,f[I]||(f[I]=[]),f[I].push(N)}}const v=ot(i),b=ot(r),_=v?ht(v):o,x=b?ht(b):n,E=_>0?x/_*100:0,A=Object.entries(u).filter(([S])=>Wa.has(S)).map(([S,w])=>{const k=d[S],I=k?ot(k.degraded):null,O=k?ot(k.restoration):null,C=I?ht(I):w.degraded,L=O?ht(O):w.restoration;return{province:S,degraded_ha:U(C),restoration_ha:U(L),terrestrial_ha:U(C+L),total_ha:U(C+L),features:w.count,restoration_pct:C>0?Wt(L/C*100):0}}).sort((S,w)=>w.total_ha-S.total_ha),G=Object.entries(h).map(([S,w])=>{const k=ot(f[S]||[]),I=k?ht(k):w.area;return{category:S,area_ha:U(I),gross_area_ha:U(w.area),features:w.count}}).sort((S,w)=>w.area_ha-S.area_ha),P={targetCode:"T2",degraded_ha:U(_),gross_degraded_ha:U(o),degraded_features:i.length,restoration_ha:U(x),gross_restoration_ha:U(n),restoration_features:r.length,restoration_pct:Wt(E),realmTotals:{degraded_terrestrial_ha:U(p),degraded_marine_ha:U(m),restoration_terrestrial_ha:U(g),restoration_marine_ha:U(y)},totalFeatures:l,layerCount:c,provinceBreakdown:A,categoryBreakdown:G,dissolvedDegraded:v,dissolvedRestoration:b};return Dt.set(a,P),P}function Sr(t,e={}){var h;const a=ca("general",null,e),s=Dt.get(a);if(s)return s;let i=0,r=0;const o=[],n={},l={terrestrial:0,marine:0};for(const f of t){const p=f.metadata;if(p.isReference||e.targets&&e.targets.length>0&&!p.targets.some(g=>e.targets.includes(g)))continue;const m=(((h=f.geojson)==null?void 0:h.features)||[]).filter(g=>!(e.province&&e.province!=="All"&&g.properties.province!==e.province));for(const g of m){i++,r+=g.properties.area_ha||0,o.push(g);const y=p.category||"OTHER";n[y]=(n[y]||0)+1;const v=fe(g.properties,p);l[v]=(l[v]||0)+1}}const c=ot(o),u=c?ht(c):r,d={totalFeatures:i,totalAreaHa:U(u),grossAreaHa:U(r),categoryCounts:n,realmCounts:l};return Dt.set(a,d),d}function ye(t,e,a={}){var k,I,O;const s=ca("target",e,a),i=Dt.get(s);if(i)return i;let r=0,o=0,n=0;const l={},c={},u={},d={},h={};let f=0,p=0,m=0;for(const C of t){const L=C.metadata;if(L.isReference||!L.targets||!L.targets.includes(e)||a.category&&a.category!=="All"&&L.category!==a.category)continue;const N=fe({},L);a.realm&&a.realm!=="All"&&N!==a.realm||(m+=((I=(k=C.geojson)==null?void 0:k.features)==null?void 0:I.length)||0)}const g=m>Fs,y=g?null:[],v=g?null:{terrestrial:[],marine:[]};for(const C of t){const L=C.metadata;if(L.isReference||!L.targets||!L.targets.includes(e)||a.category&&a.category!=="All"&&L.category!==a.category||a.realm&&a.realm!=="All"&&fe({},L)!==a.realm)continue;n++;const N=L.category||"OTHER",j=(((O=C.geojson)==null?void 0:O.features)||[]).filter(D=>{if(a.province&&a.province!=="All"&&D.properties.province!==a.province)return!1;if(a.year&&a.year!=="All"){const H=D.properties.year||L.year;if(H&&String(H)!==String(a.year))return!1}return!0});for(const D of j){const H=D.properties.area_ha||0,ct=fe(D.properties,L);r++,o+=H,ct==="marine"?(p+=H,v&&v.marine.push(D)):(f+=H,v&&v.terrestrial.push(D)),y&&y.push(D);const W=D.properties.province||"Unassigned";l[W]||(l[W]={terrestrial:0,marine:0,tCount:0,mCount:0}),ct==="marine"?(l[W].marine+=H,l[W].mCount++):(l[W].terrestrial+=H,l[W].tCount++),g||(c[W]||(c[W]={terrestrial:[],marine:[]}),ct==="marine"?c[W].marine.push(D):c[W].terrestrial.push(D)),u[N]||(u[N]={area:0,count:0}),u[N].area+=H,u[N].count++,g||(d[N]||(d[N]=[]),d[N].push(D));const V=D.properties.type||D.properties.species_name||D.properties.name||L.name||"Unknown";h[V]||(h[V]={area_ha:0,features:0}),h[V].area_ha+=H,h[V].features++}}let b,_,x,E=null,A=null;if(g)b=o,_=f,x=p;else{const C=ot(y);b=C?ht(C):o,E=ot(v.terrestrial),A=ot(v.marine),_=E?ht(E):f,x=A?ht(A):p}const G=Object.entries(l).filter(([C])=>Wa.has(C)).map(([C,L])=>{let N,j;if(g)N=L.terrestrial,j=L.marine;else{const D=c[C],H=D?ot(D.terrestrial):null,ct=D?ot(D.marine):null;N=H?ht(H):L.terrestrial,j=ct?ht(ct):L.marine}return{province:C,terrestrial_ha:U(N),marine_ha:U(j),total_ha:U(N+j),features:L.tCount+L.mCount}}).sort((C,L)=>L.total_ha-C.total_ha),P={},$=[];for(const[C,L]of Object.entries(u)){let N=null,j;g?j=L.area:(N=ot(d[C]||[]),j=N?ht(N):L.area),P[C]=N,$.push({category:C,area_ha:U(j),gross_area_ha:U(L.area),features:L.count})}$.sort((C,L)=>L.area_ha-C.area_ha);const S=Object.entries(h).map(([C,L])=>({type:C,...L})).sort((C,L)=>L.area_ha-C.area_ha),w={targetCode:e,totalFeatures:r,totalAreaHa:U(b),grossAreaHa:U(o),layerCount:n,realmTotals:{terrestrial_ha:U(_),marine_ha:U(x),gross_terrestrial_ha:U(f),gross_marine_ha:U(p)},provinceBreakdown:G,categoryBreakdown:$,typeBreakdown:S,dissolvedByCategory:P};return Dt.set(s,w),w}function U(t){return Math.round(t*100)/100}function Wt(t){return Math.round(t*1e3)/1e3}const q={layers:[],provincesGeojson:null,provinces:[],filters:{targets:["T3"],province:"All",category:"All",realm:"All",year:"All"},isAdmin:!1,customLayerNames:{},layerTracker:{}};function Y(){return q}function de(t){Object.assign(q.filters,t),Kt=null,Ut(),be()}function js(t){var a,s;const e=q.layers.findIndex(i=>i.id===t.id);if(e>=0)q.layers[e]=t;else{const i=(a=t.metadata)==null?void 0:a.originalFilename,r=(s=t.metadata)==null?void 0:s.category;i&&r&&(q.layers=q.layers.filter(o=>{var n,l;return((n=o.metadata)==null?void 0:n.originalFilename)===i&&((l=o.metadata)==null?void 0:l.category)===r?(console.warn(`Dedup on add: replacing "${o.metadata.name}" (${o.id}) with "${t.metadata.name}" (${t.id})`),!1):!0})),q.layers.push(t)}Kt=null,zs(),Ut(),be()}function Er(t,e){const a=q.layers.find(s=>s.id===t);a&&(Object.assign(a.metadata,e),Kt=null,Ut(),be())}function qs(t){q.layers=q.layers.filter(e=>e.id!==t);for(const[e,a]of Object.entries(q.layerTracker)){const s=a.filter(i=>i.layerId!==t);s.length===0?delete q.layerTracker[e]:s.length!==a.length&&(q.layerTracker[e]=s)}Ve=null,Kt=null,zs(),Ut(),be()}function wi(t){const{unique:e,removedIds:a}=_o(t);return q.layers=e,Kt=null,zs(),Ut(),a}function _o(t){var i,r;const e={},a=[],s=[];for(const o of t){const n=(i=o.metadata)==null?void 0:i.originalFilename,l=(r=o.metadata)==null?void 0:r.category;if(!n){a.push(o);continue}const c=`${n}::${l}`;e[c]||(e[c]=[]),e[c].push(o)}for(const o of Object.values(e))if(o.length===1)a.push(o[0]);else{o.sort((n,l)=>new Date(l.metadata.uploadTimestamp)-new Date(n.metadata.uploadTimestamp)),a.push(o[0]);for(let n=1;n<o.length;n++)s.push(o[n].id);console.warn(`Dedup: kept latest "${o[0].metadata.originalFilename}" (${o[0].metadata.category}), removed ${o.length-1} older duplicate(s)`)}return{unique:a,removedIds:s}}function Mo(t,e){return t&&q.layers.find(a=>{var s,i;return((s=a.metadata)==null?void 0:s.originalFilename)===t&&((i=a.metadata)==null?void 0:i.category)===e})||null}function xo(t,e,a){const s=[],i=new Set;for(const r of q.layers){const o=r.metadata;o&&(t&&o.originalFilename===t&&o.category===a&&(i.has(r.id)||(s.push(r),i.add(r.id))),e&&o.name===e&&o.category===a&&(i.has(r.id)||(s.push(r),i.add(r.id))))}return s}function wo(t){if(q.provincesGeojson=t,t&&t.features){const e=t.features.map(a=>a.properties.name||a.properties.province||a.properties.NAME||"").filter(Boolean).sort();q.provinces=[...new Set(e)]}}function Ar(t){q.customLayerNames=t||{}}function So(t,e){q.customLayerNames[t]=e}function ge(t){return q.customLayerNames[t.id]||t.name}function Pr(t){q.isAdmin=t,be()}function kr(t){if(!t){q.layerTracker={},ta();return}const e={};for(const[a,s]of Object.entries(t))Array.isArray(s)?e[a]=s:s&&s.layerId&&(e[a]=[s]);q.layerTracker=e,ta()}function Eo(t,e){q.layerTracker[t]||(q.layerTracker[t]=[]),q.layerTracker[t].find(s=>s.layerId===e)||q.layerTracker[t].push({layerId:e,uploadedAt:new Date().toISOString()}),ta(),be()}function Si(t,e=null){q.layerTracker[t]&&(e===null?delete q.layerTracker[t]:(q.layerTracker[t]=q.layerTracker[t].filter(a=>a.layerId!==e),q.layerTracker[t].length===0&&delete q.layerTracker[t]),ta(),be())}function Ao(){const t=new Set(q.layers.map(a=>a.id));let e=!1;for(const[a,s]of Object.entries(q.layerTracker)){const i=s.filter(r=>t.has(r.layerId));i.length!==s.length&&(e=!0,i.length===0?delete q.layerTracker[a]:q.layerTracker[a]=i)}return e&&ta(),e}let Ve=null;function Cr(){if(Ve)return Ve;const t=new Set;for(const e of Object.values(q.layerTracker))for(const a of e)t.add(a.layerId);return Ve=t,t}function ta(){Ve=null,Kt=null}function Po(){const t=Cr();return q.layers.filter(e=>t.has(e.id))}function ko(){return Cr().size>0}let Kt=null;function Gt(){if(Kt)return Kt;let t;if(ko())t=Po();else{const e=q.layers.filter(a=>!Co(a));t=e.length>0?e:q.layers}return Kt=t,t}function Co(t){const e=t.metadata;return e?e._isDemo||e.uploadedBy==="system"?!0:(e.name||"").toLowerCase().startsWith("demo "):!1}const De=new Set(["Torba","Sanma","Penama","Malampa","Shefa","Tafea"]);let La=!0;const Xt=new Set;function zs(){La=!0,Tr()}function Tr(){var e;if(!La)return;La=!1,Xt.clear();for(const a of q.provinces||[])De.has(a)&&Xt.add(a);if(Xt.size>=De.size){q.provinces=[...Xt].sort();return}const t=500;for(const a of q.layers){if(!a.geojson)continue;const s=a.geojson.features||[],i=Math.min(s.length,t);for(let r=0;r<i;r++){const o=(e=s[r].properties)==null?void 0:e.province;if(o&&De.has(o)&&(Xt.add(o),Xt.size>=De.size))break}if(Xt.size>=De.size)break}q.provinces=[...Xt].sort()}const rs=new Set,$r=new Set(["CCA","INLAND_WATER"]);async function Re(t){if(!t||t.length===0)return!1;const e=t.includes("T1"),a=q.layers.filter(r=>{if(r.geojson!==null||rs.has(r.id))return!1;const o=r.metadata;return o?!!(o.targets&&o.targets.some(n=>t.includes(n))||e&&$r.has(o.category)):!1});if(a.length===0)return!1;for(const r of a)rs.add(r.id);const i=(await Promise.allSettled(a.map(async r=>{try{const o=await br(r.id);if(o&&o.geojson){const n=q.layers.findIndex(l=>l.id===r.id);return n>=0&&(q.layers[n]={...q.layers[n],geojson:o.geojson}),!0}return!1}finally{rs.delete(r.id)}}))).some(r=>r.status==="fulfilled"&&r.value===!0);return i&&(La=!0,Tr(),Ut()),i}function Lr(t){if(!t||t.length===0)return!1;const e=t.includes("T1");return q.layers.some(a=>{if(a.geojson!==null)return!1;const s=a.metadata;return s?!!(s.targets&&s.targets.some(i=>t.includes(i))||e&&$r.has(s.category)):!1})}function be(){window.dispatchEvent(new CustomEvent("nbsap:refresh"))}const To="fcc1682b158fe80d089f1627dd31cf5fa6bf2162058ac3e688d24fe03cc538f8";let Ja=!1,Us=null;async function $o(t){const a=new TextEncoder().encode(t),s=await crypto.subtle.digest("SHA-256",a);return Array.from(new Uint8Array(s)).map(i=>i.toString(16).padStart(2,"0")).join("")}function Lo(){return localStorage.getItem("nbsap_admin_hash")||To}async function Go(t){if(!t)return{success:!1,error:"Passphrase required"};const e=await $o(t),a=Lo();return e===a?(Ja=!0,Us="admin",{success:!0}):{success:!1,error:"Invalid passphrase"}}function No(){Ja=!1,Us=null}function Ro(){return{isAuthenticated:Ja,user:Us,provider:"local-passphrase"}}function Io(){return Ja}const Bo=Object.freeze(Object.defineProperty({__proto__:null,getAuthState:Ro,isAdmin:Io,login:Go,logout:No},Symbol.toStringTag,{value:"Module"})),{login:Do,logout:Fo,getAuthState:Oo,isAdmin:Jt}=Bo,It={targets:[{code:"T1",name:"Target 1: Biodiversity Spatial Planning",icon:"🗺",color:"#1565C0",description:"Percentage of land and sea area covered by biodiversity-inclusive spatial plans. Terrestrial = (CCA + Inland Water) / land area. Marine = (EEZ − National Boundary) / EEZ.",isMetricTarget:!0,recommendedCategories:["CCA","INLAND_WATER"]},{code:"T2",name:"Target 2: Degraded Area Mapping & Restoration",icon:"🌿",color:"#D84315",description:"Mapping of degraded areas and restoration of degraded terrestrial, inland water, marine and coastal ecosystems.",isMetricTarget:!0,recommendedCategories:["DEGRADED","RESTORATION"]},{code:"T3",name:"Target 3: 30x30 Conservation",icon:"🌏",color:"#2E7D32",description:"Coverage of protected areas and other effective area-based conservation measures (Custom Tabu Areas, MPAs, LMMAs, Custom Forest Tabu Areas, Community Conservation Areas).",isMetricTarget:!0,recommendedCategories:["CCA","MPA","PA","OECM","LMMA"]},{code:"T4",name:"Target 4: Species & Biodiversity Distribution",icon:"🦜",color:"#7E57C2",description:"Distribution maps of significant species (Vanuatu Megapode, Mountain Starling, Streaked Fantail, Kingfisher, Flying Fox, Plerandra vanuatuensis) and Key Biodiversity Areas.",isMetricTarget:!0,recommendedCategories:["MEGAPODE","STARLING","FANTAIL","KINGFISHER","FLYING_FOX","PLERANDRA","KBA","SPECIES_DIST"]},{code:"T6",name:"Target 6: Invasive Alien Species",icon:"🪲",color:"#C62828",description:"Spatial analysis to identify total coverage (ha) and distribution of key Invasive Alien Species (IAS) — Merremia peltata (Big Leaf), Crown of Thorns Starfish, Mile a Minute Vine, Solanum torvum (Devil Fig), Fire Ants, African Snail, Sako, Coconut Beetle.",isMetricTarget:!0,recommendedCategories:["MERREMIA","CROWN_OF_THORNS","MILE_A_MINUTE","SOLANUM_TORVUM","INVASIVE"]},{code:"T7",name:"Target 7: Pesticide & Herbicide Mapping",icon:"⚗",color:"#8E24AA",description:"Map out areas of pesticide and herbicide used in large-scale and/or small-scale commercial farming.",isMetricTarget:!0,recommendedCategories:["PESTICIDE"]},{code:"T8",name:"Target 8: Coastal Eutrophication",icon:"🌊",color:"#00838F",description:"Mapping of coastal eutrophication and nutrient-impacted zones around Vanuatu islands.",isMetricTarget:!0,recommendedCategories:["EUTROPHICATION"]},{code:"T10",name:"Target 10: Agriculture & Land Cover Change",icon:"🌾",color:"#795548",description:"Mapping of land cover change for agriculture, livestock, fisheries and forestry.",isMetricTarget:!0,recommendedCategories:["LAND_COVER"]},{code:"T12",name:"Target 12: Blue & Green Spaces",icon:"🌳",color:"#388E3C",description:"Mapping of blue and green spaces — parks within provincial and municipal areas, and botanical gardens.",isMetricTarget:!0,recommendedCategories:["GREEN_SPACE"]}]};/**
 * SVG Icons for the Vanuatu NBSAP Portal.
 *
 * All icons sourced from Lucide (https://lucide.dev) — ISC License.
 * @license lucide-static v0.575.0 - ISC
 *
 * Each icon is a function returning an inline SVG string at a given size.
 * Default size 16px; stroke inherits currentColor for easy theming.
 */const jo='xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';function qo(t,e){return`<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${jo}>${e}</svg>`}const Gr={anchor:'<path d="M12 6v16"/><path d="m19 13 2-1a9 9 0 0 1-18 0l2 1"/><path d="M9 11h6"/><circle cx="12" cy="4" r="2"/>',landmark:'<path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',waves:'<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',shieldCheck:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',fish:'<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"/>',map:'<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',triangleAlert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',sprout:'<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/>',bird:'<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>',leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',wind:'<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',flaskConical:'<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',droplets:'<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',layers:'<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',trees:'<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',bug:'<path d="M12 20v-9"/><path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z"/><path d="M14.12 3.88 16 2"/><path d="M21 21a4 4 0 0 0-3.81-4"/><path d="M21 5a4 4 0 0 1-3.55 3.97"/><path d="M22 13h-4"/><path d="M3 21a4 4 0 0 1 3.81-4"/><path d="M3 5a4 4 0 0 0 3.55 3.97"/><path d="M6 13H2"/><path d="m8 2 1.88 1.88"/><path d="M9 7.13V6a3 3 0 1 1 6 0v1.13"/>',wheat:'<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/>',circle:'<circle cx="12" cy="12" r="10"/>'};Gr.bat='<path d="M12 4c-1 2-4 4-8 5 1 3 3 5 5 6l-2 3h10l-2-3c2-1 4-3 5-6-4-1-7-3-8-5z"/><circle cx="10" cy="9" r="1"/><circle cx="14" cy="9" r="1"/>';function Nr(t,e=16){const a=Gr[t];return a?qo(e,a):""}const zo={EEZ:"anchor",ADMIN_BOUNDARY:"landmark",CCA:"users",MPA:"waves",PA:"shield",OECM:"shieldCheck",KBA:"star",LMMA:"fish",SPATIAL_PLAN:"map",DEGRADED:"triangleAlert",RESTORATION:"sprout",SPECIES_DIST:"search",MEGAPODE:"bird",STARLING:"bird",FANTAIL:"bird",KINGFISHER:"bird",FLYING_FOX:"bat",PLERANDRA:"leaf",INVASIVE:"ban",MERREMIA:"leaf",CROWN_OF_THORNS:"star",MILE_A_MINUTE:"wind",SOLANUM_TORVUM:"sprout",PESTICIDE:"flaskConical",EUTROPHICATION:"droplets",LAND_COVER:"layers",GREEN_SPACE:"trees",OTHER:"circle"},Uo={T1:"map",T2:"sprout",T3:"globe",T4:"bird",T6:"bug",T7:"flaskConical",T8:"waves",T10:"wheat",T12:"trees"};function Ie(t,e=16){return Nr(zo[t]||"circle",e)}function Hs(t,e=16){return Nr(Uo[t]||"circle",e)}function Ho(t){const e=Y(),a=e.provinces||[];t.innerHTML=`
    <div class="filter-panel">
      <div class="filter-panel-header">
        <span>Filters</span>
        <button class="btn btn-sm btn-outline" id="btn-clear-filters">Clear</button>
      </div>

      <div class="filter-group">
        <label>NBSAP Target</label>
        <div class="target-checkboxes" id="target-filter-checkboxes">
          ${It.targets.map(s=>{const i=e.filters.targets.includes(s.code),r=i?`background:${s.color};border-color:${s.color};color:#fff`:"";return`
            <label class="target-checkbox ${i?"selected":""}"
                   data-code="${s.code}" title="${s.description}"
                   style="${r}">
              <input type="radio" name="nbsap-target" value="${s.code}" ${i?"checked":""}>
              <span class="target-pill-icon">${Hs(s.code,14)}</span>${s.code}
            </label>`}).join("")}
        </div>
      </div>

      <div class="filter-group">
        <label>Province</label>
        <select id="filter-province">
          <option value="All">All Provinces</option>
          ${a.map(s=>`
            <option value="${s}" ${e.filters.province===s?"selected":""}>${s}</option>
          `).join("")}
        </select>
      </div>

      <div class="filter-group">
        <label>Category</label>
        <select id="filter-category">
          <option value="All">All Categories</option>
          ${Object.entries(K).map(([s,i])=>`
            <option value="${s}" ${e.filters.category===s?"selected":""}>${i.label}</option>
          `).join("")}
        </select>
      </div>

      <div class="filter-group">
        <label>Realm</label>
        <select id="filter-realm">
          <option value="All" ${e.filters.realm==="All"?"selected":""}>All</option>
          <option value="terrestrial" ${e.filters.realm==="terrestrial"?"selected":""}>Terrestrial</option>
          <option value="marine" ${e.filters.realm==="marine"?"selected":""}>Marine</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Year</label>
        <select id="filter-year">
          <option value="All">All Years</option>
        </select>
      </div>
    </div>
  `,t.querySelectorAll(".target-checkbox").forEach(s=>{s.addEventListener("click",i=>{i.preventDefault();const r=s.dataset.code;de({targets:[r]})})}),t.querySelector("#filter-province").addEventListener("change",s=>{de({province:s.target.value})}),t.querySelector("#filter-category").addEventListener("change",s=>{de({category:s.target.value})}),t.querySelector("#filter-realm").addEventListener("change",s=>{de({realm:s.target.value})}),t.querySelector("#filter-year").addEventListener("change",s=>{de({year:s.target.value})}),t.querySelector("#btn-clear-filters").addEventListener("click",()=>{de({targets:["T3"],province:"All",category:"All",realm:"All",year:"All"})}),Vo(t.querySelector("#filter-year"),e)}let ns=null,Ei=-1;function Vo(t,e){var s,i;const a=Gt();if(!ns||Ei!==a.length){const r=new Set;for(const o of a){(s=o.metadata)!=null&&s.year&&r.add(o.metadata.year);const n=(i=o.geojson)==null?void 0:i.features;if(!n)continue;const l=Math.min(n.length,200);for(let c=0;c<l;c++)n[c].properties.year&&r.add(n[c].properties.year)}ns=[...r].sort((o,n)=>n-o),Ei=a.length}for(const r of ns){const o=document.createElement("option");o.value=r,o.textContent=r,e.filters.year===String(r)&&(o.selected=!0),t.appendChild(o)}}const ys={EEZ:{fill:"#0277BD",stroke:"#01579B"},ADMIN_BOUNDARY:{fill:"#37474F",stroke:"#263238"},CCA:{fill:"#2E7D32",stroke:"#1B5E20"},PA:{fill:"#1B5E20",stroke:"#0D3311"},OECM:{fill:"#7E57C2",stroke:"#5E35B1"},KBA:{fill:"#EF6C00",stroke:"#E65100"},MPA:{fill:"#1565C0",stroke:"#0D47A1"},LMMA:{fill:"#00796B",stroke:"#004D40"},INLAND_WATER:{fill:"#4FC3F7",stroke:"#0288D1"},SPATIAL_PLAN:{fill:"#78909C",stroke:"#546E7A"},DEGRADED:{fill:"#D84315",stroke:"#BF360C"},RESTORATION:{fill:"#F9A825",stroke:"#F57F17"},SPECIES_DIST:{fill:"#26A69A",stroke:"#00897B"},MEGAPODE:{fill:"#E65100",stroke:"#BF360C"},STARLING:{fill:"#5C6BC0",stroke:"#3949AB"},FANTAIL:{fill:"#FFB300",stroke:"#FF8F00"},KINGFISHER:{fill:"#00ACC1",stroke:"#00838F"},FLYING_FOX:{fill:"#6D4C41",stroke:"#4E342E"},PLERANDRA:{fill:"#66BB6A",stroke:"#43A047"},INVASIVE:{fill:"#C62828",stroke:"#B71C1C"},MERREMIA:{fill:"#BF360C",stroke:"#8D2409"},CROWN_OF_THORNS:{fill:"#FF6F00",stroke:"#E65100"},MILE_A_MINUTE:{fill:"#AD1457",stroke:"#880E4F"},SOLANUM_TORVUM:{fill:"#6A1B9A",stroke:"#4A148C"},PESTICIDE:{fill:"#8E24AA",stroke:"#6A1B9A"},EUTROPHICATION:{fill:"#D81B60",stroke:"#AD1457"},LAND_COVER:{fill:"#795548",stroke:"#5D4037"},GREEN_SPACE:{fill:"#388E3C",stroke:"#2E7D32"},OTHER:{fill:"#78909C",stroke:"#546E7A"}},Ai={Forest:{fill:"#1B5E20",stroke:"#0D3311"},"Dense Forest":{fill:"#1B5E20",stroke:"#0D3311"},"Sparse Forest":{fill:"#388E3C",stroke:"#2E7D32"},"Medium Forest":{fill:"#2E7D32",stroke:"#1B5E20"},"Thicket/Dense Shrub":{fill:"#558B2F",stroke:"#33691E"},Mangrove:{fill:"#004D40",stroke:"#00251A"},Agriculture:{fill:"#F9A825",stroke:"#F57F17"},Cropland:{fill:"#FFD54F",stroke:"#FFC107"},Plantation:{fill:"#827717",stroke:"#524A03"},Coconut:{fill:"#9E9D24",stroke:"#6D6B1E"},"Coconut Plantation":{fill:"#9E9D24",stroke:"#6D6B1E"},Agroforestry:{fill:"#8D6E63",stroke:"#6D4C41"},Grassland:{fill:"#AED581",stroke:"#8BC34A"},Shrub:{fill:"#7CB342",stroke:"#558B2F"},Savanna:{fill:"#C0CA33",stroke:"#9E9D24"},Urban:{fill:"#E53935",stroke:"#C62828"},"Built-up":{fill:"#E53935",stroke:"#C62828"},Settlement:{fill:"#EF5350",stroke:"#D32F2F"},Bare:{fill:"#A1887F",stroke:"#795548"},"Bare Ground":{fill:"#A1887F",stroke:"#795548"},Rock:{fill:"#8D6E63",stroke:"#5D4037"},Sand:{fill:"#FFE0B2",stroke:"#FFCC80"},Water:{fill:"#1565C0",stroke:"#0D47A1"},"Inland Water":{fill:"#1565C0",stroke:"#0D47A1"},Wetland:{fill:"#00838F",stroke:"#006064"},Swamp:{fill:"#00695C",stroke:"#004D40"},Coral:{fill:"#FF7043",stroke:"#E64A19"},Reef:{fill:"#FF7043",stroke:"#E64A19"},Lagoon:{fill:"#4FC3F7",stroke:"#0288D1"},Seagrass:{fill:"#26A69A",stroke:"#00897B"},Cloud:{fill:"#ECEFF1",stroke:"#CFD8DC"},Shadow:{fill:"#90A4AE",stroke:"#607D8B"},"No Data":{fill:"#BDBDBD",stroke:"#9E9E9E"}},Pi=[{fill:"#1B5E20",stroke:"#0D3311"},{fill:"#F9A825",stroke:"#F57F17"},{fill:"#0277BD",stroke:"#01579B"},{fill:"#E53935",stroke:"#C62828"},{fill:"#6A1B9A",stroke:"#4A148C"},{fill:"#00838F",stroke:"#006064"},{fill:"#EF6C00",stroke:"#E65100"},{fill:"#558B2F",stroke:"#33691E"},{fill:"#AD1457",stroke:"#880E4F"},{fill:"#4527A0",stroke:"#311B92"},{fill:"#00695C",stroke:"#004D40"},{fill:"#9E9D24",stroke:"#6D6B1E"},{fill:"#C62828",stroke:"#B71C1C"},{fill:"#1565C0",stroke:"#0D47A1"},{fill:"#FF8F00",stroke:"#FF6F00"},{fill:"#2E7D32",stroke:"#1B5E20"},{fill:"#5C6BC0",stroke:"#3949AB"},{fill:"#D84315",stroke:"#BF360C"},{fill:"#00897B",stroke:"#00695C"},{fill:"#827717",stroke:"#524A03"}],os=new Map;function Wo(t){if(os.has(t))return os.get(t);let e=0;for(let i=0;i<t.length;i++)e=(e<<5)-e+t.charCodeAt(i)|0;const a=Math.abs(e)%Pi.length,s=Pi[a];return os.set(t,s),s}const Rr={Designated:{fillOpacity:.35,dashArray:null,weight:2},Active:{fillOpacity:.35,dashArray:null,weight:2},Proposed:{fillOpacity:.18,dashArray:"6 4",weight:1.5},Inactive:{fillOpacity:.1,dashArray:"2 4",weight:1},Unknown:{fillOpacity:.28,dashArray:null,weight:1.5}},Ko=Rr.Unknown,Vs=new Set(["MEGAPODE","STARLING","FANTAIL","KINGFISHER","FLYING_FOX","PLERANDRA","SPECIES_DIST"]);function bt(t,e){const a=t||"OTHER",s=ys[a]||ys.OTHER;if(a==="LAND_COVER"&&e){const i=Ai[e];if(i)return i;const r=e.toUpperCase();for(const[o,n]of Object.entries(Ai))if(r.includes(o.toUpperCase())||o.toUpperCase().includes(r))return n;return Wo(e)}return s}function Ir(t,e){var a;return t==="LAND_COVER"?`LAND_COVER::${((a=e.properties)==null?void 0:a.type)||"Unknown"}`:t}function Jo(t,e){const a=bt(t,e);return{fillColor:a.fill,color:a.stroke,weight:2.5,fillOpacity:.45,interactive:!1}}function Yo(t,e){const a=t.properties||{},s=bt(e,a.type),i=Rr[a.status]||Ko;return{fillColor:s.fill,color:s.stroke,weight:i.weight*.8,fillOpacity:0,dashArray:i.dashArray||"4 3"}}function Br(t,e){const a=bt(t,e);return{fillColor:a.fill,color:a.stroke,weight:2,fillOpacity:.15,dashArray:"8 4"}}function Zo(t,e){const a=t.properties||{},s=bt(e,a.type);return{radius:Vs.has(e)?7:6,fillColor:s.fill,color:"#fff",weight:1.5,fillOpacity:.85}}function Dr(t){const e=bt(t);return{radius:Vs.has(t)?6:5,fillColor:e.fill,color:e.stroke,weight:1.5,fillOpacity:.3,dashArray:"3 3"}}function Fr(t,e){const a=bt(t,e);return{fillColor:a.fill,color:a.stroke,weight:2.5,fillOpacity:.5}}function Or(t){const e=bt(t);return{radius:Vs.has(t)?6:5,fillColor:e.fill,color:"#fff",weight:1,fillOpacity:.85}}const jr="#B0BEC5",qr="#78909C";function We(t){var a,s;const e=(((a=t.properties)==null?void 0:a.presence)||((s=t.properties)==null?void 0:s.type)||"").toLowerCase();return e.includes("extinct")||e.includes("possibly extinct")||e==="ex"}function Xo(t){return{fillColor:jr,color:qr,weight:2,fillOpacity:.25,dashArray:"6 4"}}function Qo(t){return{radius:6,fillColor:jr,color:qr,weight:1.5,fillOpacity:.5,dashArray:"4 3"}}function tl(t){var a,s;const e=new Map;for(const i of t){const r=i.metadata;if(!r)continue;const o=r.category||"OTHER",n=r.category?ys[o]?void 0:o:"Other";if(o==="LAND_COVER"&&((a=i.geojson)!=null&&a.features)){const l=new Set;for(const c of i.geojson.features)l.add(((s=c.properties)==null?void 0:s.type)||"Unknown");for(const c of l){const u=`LAND_COVER::${c}`;if(!e.has(u)){const d=bt("LAND_COVER",c);e.set(u,{label:c,fill:d.fill,stroke:d.stroke})}}}else if(!e.has(o)){const l=bt(o);e.set(o,{label:n,fill:l.fill,stroke:l.stroke})}}return[...e.entries()].map(([i,r])=>({key:i,label:r.label,fill:r.fill,stroke:r.stroke}))}const zr={T1:{label:"Biodiversity Spatial Planning",color:"#1565C0",unit:"ha planned"},T2:{label:"Degraded Areas & Restoration",color:"#D84315",unit:"ha mapped"},T3:{label:"30x30 Conservation",color:"#2E7D32",unit:"ha conserved"},T4:{label:"Species & Biodiversity",color:"#7E57C2",unit:"species records"},T6:{label:"Invasive Alien Species",color:"#C62828",unit:"ha detected"},T7:{label:"Pesticide & Herbicide",color:"#8E24AA",unit:"ha mapped"},T8:{label:"Coastal Eutrophication",color:"#00838F",unit:"ha impacted"},T10:{label:"Land Cover Change",color:"#795548",unit:"ha mapped"},T12:{label:"Blue & Green Spaces",color:"#388E3C",unit:"ha mapped"}};function el(t){const a=Y().filters,s=Gt(),i=a.targets;if(i.length===1){const o=i[0];if(!s.some(l=>l.metadata.targets&&l.metadata.targets.includes(o))){cl(t,o);return}o==="T1"?al(t,s,a):o==="T2"?sl(t,s,a):o==="T3"?ki(t,s,a):o==="T4"?il(t,s,a):o==="T6"?rl(t,s,a):o==="T10"?nl(t,s,a):ol(t,s,a,o);return}i.length===0||i.includes("T3")?ki(t,s,a):ll(t,s,a)}function al(t,e,a){const s=Ka(e,a),i=s.baselines,r=s.terrestrial_pct,o=Math.min(r,100),n=s.marine_pct,l=Math.min(n,100),c=s.total_pct,u=Math.min(c,100),d=s.categoryBreakdown.map(h=>{const f=K[h.category]||{label:h.category,color:"#95a5a6"};return`<span class="cat-badge" style="background:${f.color}20;color:${f.color};border:1px solid ${f.color}40">
      ${Ie(h.category,13)} ${f.label}: ${F(h.area_ha)} ha (${h.features})
    </span>`}).join("");t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${F(s.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
        <div class="kpi-sublabel">CCA + Inland Water (dissolved)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${F(s.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
        <div class="kpi-sublabel">EEZ minus National Boundary</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.totalFeatures}</div>
        <div class="kpi-label">Data Records</div>
        <div class="kpi-sublabel">${s.layerCount} dataset${s.layerCount!==1?"s":""}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With spatial plans</div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Terrestrial coverage: ${r.toFixed(2)}%</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill terrestrial"
               style="width: ${Math.min(o,100).toFixed(1)}%">
            ${r>=1?r.toFixed(1)+"%":""}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          (CCA + Inland Water) / ${F(i.terrestrial_ha)} ha total terrestrial = ${F(s.terrestrial_ha)} ha
        </div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Marine coverage: ${n.toFixed(2)}%</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill marine"
               style="width: ${Math.min(l,100).toFixed(1)}%">
            ${n>=1?n.toFixed(1)+"%":""}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          (EEZ ${F(s.eez_ha)} ha &minus; Boundary ${F(s.boundary_ha)} ha) / EEZ ${F(s.eez_ha)} ha
        </div>
      </div>

      <div class="kpi-card wide" style="background:var(--surface-alt, #f0fdf4);border:1px solid #bbf7d0">
        <div style="font-weight:600;font-size:13px;color:#065f46;margin-bottom:8px">
          Total Coverage: ${c.toFixed(2)}% of Vanuatu's land and sea area
        </div>
        <div class="progress-bar-container" style="height:20px">
          <div class="progress-bar-fill terrestrial"
               style="width: ${Math.min(u,100).toFixed(1)}%;background:linear-gradient(90deg, #065f46, #0ea5e9)">
            ${c>=.5?c.toFixed(1)+"%":""}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:var(--text-secondary)">
          <span>${F(s.total_covered_ha)} ha covered of ${F(s.total_area_ha)} ha</span>
          <span>Land: ${r.toFixed(1)}% | Sea: ${n.toFixed(1)}%</span>
        </div>
      </div>
    </div>
    ${d?`<div class="kpi-cat-badges">${d}</div>`:""}
    <div class="kpi-methodology-note">
      Terrestrial = (CCA + Inland Water) / ${F(i.terrestrial_ha)} ha &times; 100.
      Marine = (EEZ &minus; National Boundary) / EEZ &times; 100.
    </div>
  `}function sl(t,e,a){const s=Os(e,a),i=Math.min(s.restoration_pct,100),r=s.degraded_ha+s.restoration_ha,o=s.provinceBreakdown.filter(u=>u.degraded_ha>0||u.restoration_ha>0).map(u=>{const d=u.restoration_pct||0,h=Math.min(d,100);return`
        <div class="t2-province-card">
          <div class="t2-province-header">
            <span class="t2-province-name">${u.province}</span>
            <span class="t2-province-pct">${d.toFixed(1)}%</span>
          </div>
          <div class="progress-bar-container" style="height:10px;margin-top:4px">
            <div class="progress-bar-fill t2-restoration"
                 style="width: ${h.toFixed(1)}%">
            </div>
          </div>
          <div class="t2-province-stats">
            <span>Degraded: ${F(u.degraded_ha)} ha</span>
            <span>Restored: ${F(u.restoration_ha)} ha</span>
          </div>
        </div>
      `}).join(""),n=s.categoryBreakdown.map(u=>{const d=K[u.category]||{label:u.category,color:"#95a5a6"};return`<span class="cat-badge" style="background:${d.color}20;color:${d.color};border:1px solid ${d.color}40">
      ${Ie(u.category,13)} ${d.label}: ${F(u.area_ha)} ha (${u.features})
    </span>`}).join(""),l=s.restoration_pct>=30?"#065f46":s.restoration_pct>=10?"#b45309":"#991b1b",c=s.restoration_pct>=30?"Strong restoration progress":s.restoration_pct>=10?"Restoration underway":s.degraded_ha>0?"Early stages — more restoration needed":"No degraded area data uploaded yet";t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card accent-orange">
        <div class="kpi-value" style="color:#D84315">${F(s.degraded_ha)}</div>
        <div class="kpi-label">Degraded Area (ha)</div>
        <div class="kpi-sublabel">${s.degraded_features} record${s.degraded_features!==1?"s":""}</div>
      </div>
      <div class="kpi-card accent-green">
        <div class="kpi-value" style="color:#2E7D32">${F(s.restoration_ha)}</div>
        <div class="kpi-label">Restoration Area (ha)</div>
        <div class="kpi-sublabel">${s.restoration_features} site${s.restoration_features!==1?"s":""}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${F(r)}</div>
        <div class="kpi-label">Total Mapped (ha)</div>
        <div class="kpi-sublabel">${s.layerCount} dataset${s.layerCount!==1?"s":""}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With T2 data</div>
      </div>

      <div class="kpi-card wide" style="background:var(--surface-alt, #fef7f0);border:1px solid #fed7aa">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:600;font-size:13px;color:#92400e">
            Restoration Progress: ${s.restoration_pct.toFixed(1)}% of degraded area
          </div>
          <div style="font-size:11px;color:${l};font-weight:600">
            ${c}
          </div>
        </div>
        <div class="progress-bar-container" style="height:22px">
          <div class="progress-bar-fill t2-restoration"
               style="width: ${i.toFixed(1)}%">
            ${s.restoration_pct>=2?s.restoration_pct.toFixed(1)+"%":""}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:var(--text-secondary)">
          <span>${F(s.restoration_ha)} ha restored of ${F(s.degraded_ha)} ha degraded</span>
          <span>${s.degraded_ha>s.restoration_ha?F(s.degraded_ha-s.restoration_ha)+" ha remaining":"Target exceeded!"}</span>
        </div>
      </div>

      ${s.realmTotals.degraded_terrestrial_ha>0||s.realmTotals.degraded_marine_ha>0?`
        <div class="kpi-card">
          <div class="kpi-value" style="color:#D84315">${F(s.realmTotals.degraded_terrestrial_ha)}</div>
          <div class="kpi-label">Terrestrial Degraded</div>
          <div class="kpi-sublabel">${F(s.realmTotals.restoration_terrestrial_ha)} ha restoring</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value marine">${F(s.realmTotals.degraded_marine_ha)}</div>
          <div class="kpi-label">Marine/Coastal Degraded</div>
          <div class="kpi-sublabel">${F(s.realmTotals.restoration_marine_ha)} ha restoring</div>
        </div>
      `:""}
    </div>

    ${o?`
      <div class="t2-province-breakdown">
        <div class="breakdown-header" style="font-size:13px;font-weight:600;margin:12px 0 8px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Provincial Restoration Progress
        </div>
        <div class="t2-province-grid">${o}</div>
      </div>
    `:""}

    ${n?`<div class="kpi-cat-badges">${n}</div>`:""}

    <div class="kpi-methodology-note">
      Restoration progress = (restoration area &divide; degraded area) &times; 100. Areas dissolved to remove overlaps.
    </div>
  `}function ki(t,e,a){const s=Le(e,a),i=gt.nationalBaselines;Math.min(s.terrestrial_pct,100),Math.min(s.marine_pct,100);const r=i.terrestrial_ha*.3,o=i.marine_ha*.3,n=s.terrestrial_pct>0?s.terrestrial_pct/30*100:0,l=s.marine_pct>0?s.marine_pct/30*100:0,c=Math.max(0,r-s.terrestrial_ha),u=Math.max(0,o-s.marine_ha),d=i.terrestrial_ha+i.marine_ha,h=d*.3,f=s.terrestrial_ha+s.marine_ha,p=Math.max(0,h-f),m=d>0?f/d*100:0,g=m>0?m/30*100:0;s.gross_terrestrial_ha>0&&Math.abs(s.gross_terrestrial_ha-s.terrestrial_ha)>1,s.gross_marine_ha>0&&Math.abs(s.gross_marine_ha-s.marine_ha)>1,t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${F(s.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${F(s.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-value" style="color:#065f46">${s.terrestrial_pct.toFixed(2)}%</div>
        <div class="kpi-label">% of Total Land</div>
        <div class="kpi-sublabel">${F(s.terrestrial_ha)} of ${F(i.terrestrial_ha)} ha</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${s.marine_pct.toFixed(2)}%</div>
        <div class="kpi-label">% of Total Sea</div>
        <div class="kpi-sublabel">${F(s.marine_ha)} of ${F(i.marine_ha)} ha</div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Terrestrial: ${s.terrestrial_pct.toFixed(2)}% of 30% target (${n.toFixed(1)}% achieved)</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill terrestrial"
               style="width: ${Math.min(n,100).toFixed(1)}%">
            ${s.terrestrial_pct>=1?s.terrestrial_pct.toFixed(1)+"%":""}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${s.terrestrial_remaining_pct>0?`${s.terrestrial_remaining_pct.toFixed(2)}% remaining (${F(c)} ha needed)`:"Target reached!"}
        </div>
      </div>

      <div class="kpi-card wide">
        <div class="kpi-label" style="margin-bottom:6px">Marine: ${s.marine_pct.toFixed(2)}% of 30% target (${l.toFixed(1)}% achieved)</div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill marine"
               style="width: ${Math.min(l,100).toFixed(1)}%">
            ${s.marine_pct>=1?s.marine_pct.toFixed(1)+"%":""}
          </div>
        </div>
        <div class="kpi-sublabel" style="margin-top:4px">
          ${s.marine_remaining_pct>0?`${s.marine_remaining_pct.toFixed(2)}% remaining (${F(u)} ha needed)`:"Target reached!"}
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-value">${s.total_features}</div>
        <div class="kpi-label">Data Records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With conservation areas</div>
      </div>

      <div class="kpi-card wide" style="background:var(--surface-alt, #f0fdf4);border:1px solid #bbf7d0">
        <div style="font-weight:600;font-size:13px;color:#065f46;margin-bottom:8px">
          Combined: ${m.toFixed(2)}% of Vanuatu's total spatial zone
        </div>
        <div class="progress-bar-container" style="height:20px">
          <div class="progress-bar-fill terrestrial"
               style="width: ${Math.min(g,100).toFixed(1)}%;background:linear-gradient(90deg, #065f46, #0ea5e9)">
            ${m>=.5?m.toFixed(1)+"%":""}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:var(--text-secondary)">
          <span>${F(f)} ha conserved of ${F(d)} ha total</span>
          <span>30% target = ${F(h)} ha</span>
        </div>
        <div style="margin-top:6px;font-size:12px;font-weight:500;color:${g>=100?"#065f46":"#b45309"}">
          ${p>0?`${F(p)} ha remaining to reach 30% (${g.toFixed(1)}% of target achieved)`:"Target reached!"}
        </div>
      </div>
    </div>

    <div class="kpi-methodology-note">
      National baselines: ${F(i.terrestrial_ha)} ha terrestrial, ${F(i.marine_ha)} ha marine.
    </div>
  `}const ls=[{key:"MEGAPODE",name:"Vanuatu Megapode",scientific:"Megapodius layardi",taxa:"Bird"},{key:"STARLING",name:"Vanuatu Mountain Starling",scientific:"Aplonis santovestris",taxa:"Bird"},{key:"FANTAIL",name:"Vanuatu Streaked Fantail",scientific:"Rhipidura spilodera",taxa:"Bird"},{key:"KINGFISHER",name:"Vanuatu Kingfisher",scientific:"Todiramphus farquhari",taxa:"Bird"},{key:"FLYING_FOX",name:"Vanuatu Flying Fox",scientific:"Pteropus anetianus",taxa:"Mammal"},{key:"PLERANDRA",name:"Plerandra vanuatuensis",scientific:"Plerandra vanuatuensis",taxa:"Plant"}];function il(t,e,a){const s=ye(e,"T4",a),i=ls.filter(l=>s.categoryBreakdown.some(c=>c.category===l.key&&c.features>0)),r=s.categoryBreakdown.find(l=>l.category==="KBA"),o=s.categoryBreakdown.find(l=>l.category==="SPECIES_DIST"),n=ls.map(l=>{const c=s.categoryBreakdown.find(h=>h.category===l.key),u=K[l.key]||{color:"#95a5a6"},d=c&&c.features>0;return`
      <div class="species-card ${d?"":"species-no-data"}" style="border-left:4px solid ${u.color}">
        <div class="species-card-header">
          <span class="species-common-name">${l.name}</span>
          <span class="species-taxa-badge">${l.taxa}</span>
        </div>
        <div class="species-scientific"><i>${l.scientific}</i></div>
        ${d?`<div class="species-stats">
              <span class="species-stat-value">${F(c.area_ha)} ha</span>
              <span class="species-stat-label">${c.features} record${c.features!==1?"s":""}</span>
            </div>`:'<div class="species-no-data-label">No data uploaded</div>'}
      </div>
    `}).join("");t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${F(s.totalAreaHa)}</div>
        <div class="kpi-label">Total Distribution (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${i.length} / ${ls.length}</div>
        <div class="kpi-label">Species Mapped</div>
        <div class="kpi-sublabel">${s.totalFeatures} total records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${F(r?r.area_ha:0)}</div>
        <div class="kpi-label">KBA Area (ha)</div>
        <div class="kpi-sublabel">${r?r.features:0} Key Biodiversity Areas</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With species records</div>
      </div>
    </div>
    <div class="species-breakdown">
      <div class="breakdown-header" style="font-size:13px;font-weight:600;margin:12px 0 8px">Significant Species</div>
      <div class="species-grid">${n}</div>
    </div>
    ${o&&o.features>0?`
      <div class="kpi-cat-badges" style="margin-top:8px">
        <span class="cat-badge" style="background:${K.SPECIES_DIST.color}20;color:${K.SPECIES_DIST.color};border:1px solid ${K.SPECIES_DIST.color}40">
          ${Ie("SPECIES_DIST",13)} Other Species: ${F(o.area_ha)} ha (${o.features})
        </span>
      </div>
    `:""}
  `}function rl(t,e,a){const s=ye(e,"T6",a),i=s.categoryBreakdown.find(o=>o.category==="MERREMIA"),r=s.categoryBreakdown.find(o=>o.category==="INVASIVE");s.grossAreaHa>0&&Math.abs(s.grossAreaHa-s.totalAreaHa)>1,t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card accent-red">
        <div class="kpi-value">${F(s.totalAreaHa)}</div>
        <div class="kpi-label">Total IAS Area (ha)</div>
        <div class="kpi-sublabel">${s.totalFeatures} detections</div>
      </div>
      <div class="kpi-card accent-red">
        <div class="kpi-value">${F(i?i.area_ha:0)}</div>
        <div class="kpi-label">Merremia peltata (ha)</div>
        <div class="kpi-sublabel">${i?i.features:0} detections</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${F(r?r.area_ha:0)}</div>
        <div class="kpi-label">Other IAS (ha)</div>
        <div class="kpi-sublabel">${r?r.features:0} records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces Affected</div>
      </div>
    </div>
    ${s.typeBreakdown.length>0?Ur(s.typeBreakdown,"Species / Detection Type"):""}
  `}function nl(t,e,a){const s=ye(e,"T10",a);s.grossAreaHa>0&&Math.abs(s.grossAreaHa-s.totalAreaHa)>1;const i=s.typeBreakdown,r=i.length,n=i.slice(0,25),l=i.length-n.length,c=n.map(d=>{const f=bt("LAND_COVER",d.type).fill,p=s.grossAreaHa>0?d.area_ha/s.grossAreaHa*100:0;return`
      <tr>
        <td>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${f};margin-right:6px"></span>
          ${d.type}
        </td>
        <td style="text-align:right">${F(d.area_ha)}</td>
        <td style="text-align:right">${p.toFixed(1)}%</td>
        <td style="text-align:right">${d.features}</td>
      </tr>
    `}).join("")+(l>0?`<tr><td colspan="4" style="text-align:center;color:var(--text-tertiary);font-size:11px">+ ${l} more types</td></tr>`:""),u=`
    <tr style="font-weight:600;border-top:2px solid var(--border)">
      <td>Total</td>
      <td style="text-align:right">${F(s.grossAreaHa)}</td>
      <td style="text-align:right">100%</td>
      <td style="text-align:right">${s.totalFeatures}</td>
    </tr>
  `;t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${F(s.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.totalFeatures}</div>
        <div class="kpi-label">Data Records</div>
        <div class="kpi-sublabel">${s.layerCount} dataset${s.layerCount!==1?"s":""}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${r}</div>
        <div class="kpi-label">Land Use Types</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces</div>
        <div class="kpi-sublabel">With land cover data</div>
      </div>
    </div>
    ${i.length>0?`
      <div class="kpi-type-breakdown">
        <div class="breakdown-header" style="font-size:12px;margin:10px 0 6px">
          Land Use Breakdown
        </div>
        <table class="data-table compact">
          <thead><tr><th>Land Use Type</th><th style="text-align:right">Area (ha)</th><th style="text-align:right">%</th><th style="text-align:right">Count</th></tr></thead>
          <tbody>${c}${u}</tbody>
        </table>
      </div>
    `:""}
  `}function ol(t,e,a,s){const i=ye(e,s,a),r=zr[s]||{unit:"ha"};i.grossAreaHa>0&&Math.abs(i.grossAreaHa-i.totalAreaHa)>1;const o=i.categoryBreakdown.map(n=>{const l=K[n.category]||{label:n.category,color:"#95a5a6"};return`<span class="cat-badge" style="background:${l.color}20;color:${l.color};border:1px solid ${l.color}40">
      ${Ie(n.category,13)} ${l.label}: ${F(n.area_ha)} ha (${n.features})
    </span>`}).join("");t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${F(i.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
        <div class="kpi-sublabel">${r.unit}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${i.totalFeatures}</div>
        <div class="kpi-label">Data Records</div>
        <div class="kpi-sublabel">${i.layerCount} dataset${i.layerCount!==1?"s":""}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${F(i.realmTotals.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${F(i.realmTotals.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
      </div>
    </div>
    ${o?`<div class="kpi-cat-badges">${o}</div>`:""}
    ${i.typeBreakdown.length>1?Ur(i.typeBreakdown,"Type Breakdown"):""}
  `}function ll(t,e,a){const s=Sr(e,a);s.grossAreaHa>0&&Math.abs(s.grossAreaHa-s.totalAreaHa)>1,t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${s.totalFeatures}</div>
        <div class="kpi-label">Data Records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${F(s.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.realmCounts.terrestrial||0}</div>
        <div class="kpi-label">Terrestrial</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${s.realmCounts.marine||0}</div>
        <div class="kpi-label">Marine</div>
      </div>
    </div>
  `}function Ur(t,e){const a=t.slice(0,10).map(s=>`
    <tr>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${s.type}">${s.type}</td>
      <td style="text-align:right">${F(s.area_ha)}</td>
      <td style="text-align:right">${s.features}</td>
    </tr>
  `).join("");return`
    <div class="kpi-type-breakdown">
      <div class="breakdown-header" style="font-size:12px;margin:10px 0 6px">
        ${e}
      </div>
      <table class="data-table compact">
        <thead><tr><th>Type</th><th style="text-align:right">Area (ha)</th><th style="text-align:right">Count</th></tr></thead>
        <tbody>${a}</tbody>
      </table>
    </div>
  `}function F(t){return t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toFixed(t%1===0?0:1)}function cl(t,e){const a=zr[e]||{label:e,color:"#95a5a6"},s=Jt()?`<button class="kpi-empty-action" onclick="document.getElementById('nav-tab-admin')?.click()">
         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
         Upload Data Layer
       </button>`:`<div style="font-size:11px;color:var(--text-tertiary);margin-top:4px">
         Contact <a href="mailto:rbaereleo@vanuatu.gov.vu" style="color:var(--primary)">DEPC GIS Coordinator</a> to upload data for this target.
       </div>`;t.innerHTML=`
    <div class="kpi-empty-state">
      <div class="kpi-empty-icon">🗂️</div>
      <div class="kpi-empty-title">No Data for ${e}</div>
      <div class="kpi-empty-desc">
        <strong style="color:${a.color}">${a.label}</strong><br>
        No GIS datasets have been uploaded for this target yet.<br>
        Upload a shapefile to see metrics, maps, and provincial breakdowns.
      </div>
      ${s}
    </div>
  `}let vt=null,cs={},Se=null,Vt=null,ba=null,_e=null;const Ea=new Set;let ut=[],ea=!1;function Hr(t){const e=new Set(t.map(s=>s.id));ut=ut.filter(s=>e.has(s));for(const s of t)ut.includes(s.id)||ut.push(s.id);const a=new Map(ut.map((s,i)=>[s,i]));return[...t].sort((s,i)=>(a.get(s.id)??999)-(a.get(i.id)??999))}const ds=z.canvas({padding:.5}),Ci=1e3;function dl(t){if(vt)return vt.invalidateSize(),vt;vt=z.map(t,{center:gt.mapCenter,zoom:gt.mapZoom,zoomControl:!0});for(const[a,s]of Object.entries(gt.tileSources))cs[s.name]=z.tileLayer(s.url,{attribution:s.attribution,maxZoom:s.maxZoom,crossOrigin:"anonymous"});const e=Object.values(cs)[0];return e&&e.addTo(vt),Se=z.featureGroup(),Se.addTo(vt),Vt=z.featureGroup(),Vt.addTo(vt),z.control.layers(cs,{},{position:"topright"}).addTo(vt),z.control.scale({imperial:!1,position:"bottomleft"}).addTo(vt),vt}function Ya(){var p,m;if(!vt)return;Se&&Se.clearLayers(),Vt.clearLayers(),ba&&(ba.remove(),ba=null);const t=Y(),e=t.filters,a=Gt(),s=Hr(a);t.provincesGeojson&&(ba=z.geoJSON(t.provincesGeojson,{style:{color:"#555",weight:1.5,fillOpacity:.03,dashArray:"4 4"},onEachFeature:(g,y)=>{const v=g.properties.name||g.properties.province||"Unknown";y.bindTooltip(v,{sticky:!0,className:"province-tooltip"})}}).addTo(vt));const i={},r={},o={},n={},l=[],c=[],u=[];for(const g of s){const y=g.metadata;if(!g.geojson||e.targets.length>0&&!y.targets.some(A=>e.targets.includes(A))||e.category&&e.category!=="All"&&y.category!==e.category)continue;const v=y.category||"OTHER",b=fl(g.geojson.features||[],e),_=y.isReference===!0;if(b.length===0||(_||u.push(g),Ea.has(g.id)))continue;const x=[],E=[];for(const A of b){const G=(p=A.geometry)==null?void 0:p.type;if(G==="Polygon"||G==="MultiPolygon")if(_)l.push({feature:A,meta:y,cat:v});else{x.push(A);const P=Ir(v,A);i[P]||(i[P]=[]),i[P].push(A),r[P]||(r[P]={cat:v,typeValue:v==="LAND_COVER"&&((m=A.properties)==null?void 0:m.type)||null})}else(G==="Point"||G==="MultiPoint")&&(_?c.push({feature:A,meta:y,cat:v}):E.push(A))}x.length>0&&!_&&(o[v]||(o[v]=[]),o[v].push({features:x,meta:y})),E.length>0&&!_&&(n[v]||(n[v]={features:[],meta:y}),n[v].features.push(...E))}if(l.length>0){const g={};for(const{feature:y,meta:v,cat:b}of l)g[b]||(g[b]={features:[],meta:v}),g[b].features.push(y);for(const[y,v]of Object.entries(g)){const b=z.geoJSON({type:"FeatureCollection",features:v.features},{style:()=>Br(y),onEachFeature:(_,x)=>{Fe(_,x,v.meta,!0)}});Se.addLayer(b)}}if(c.length>0){const g={};for(const{feature:y,meta:v,cat:b}of c)g[b]||(g[b]={features:[],meta:v}),g[b].features.push(y);for(const[y,v]of Object.entries(g)){const b=z.geoJSON({type:"FeatureCollection",features:v.features},{pointToLayer:(_,x)=>z.circleMarker(x,Dr(y)),onEachFeature:(_,x)=>{Fe(_,x,v.meta,!0)}});Se.addLayer(b)}}let d=0;for(const g of Object.values(i))d+=g.length;const h=d>Ci,f=200;for(const[g,y]of Object.entries(i)){const{cat:v,typeValue:b}=r[g],_=Jo(v,b),x=h?{renderer:ds}:{};if(h||y.length>f){const E=z.geoJSON({type:"FeatureCollection",features:y},{style:()=>_,interactive:!0,renderer:ds});E.on("click",A=>{if(A.layer&&A.layer.feature){const G=A.layer.feature,P=pl(G,o[v]);P&&Fe(G,A.layer,P),A.layer.openPopup(A.latlng)}}),Vt.addLayer(E)}else{const E=ot(y);if(E){const A=z.geoJSON(E,{style:()=>_,interactive:!1,...x});Vt.addLayer(A)}}}if(!h)for(const[g,y]of Object.entries(o))for(const v of y){const b=z.geoJSON({type:"FeatureCollection",features:v.features},{style:_=>Yo(_,g),onEachFeature:(_,x)=>{Fe(_,x,v.meta)}});Vt.addLayer(b)}for(const[g,y]of Object.entries(n)){const v=y.features.length>Ci?{renderer:ds}:{},b=z.geoJSON({type:"FeatureCollection",features:y.features},{pointToLayer:(_,x)=>z.circleMarker(x,Zo(_,g)),onEachFeature:(_,x)=>{Fe(_,x,y.meta)},...v});Vt.addLayer(b)}if(hl(u),!ea&&Vt.getLayers().length>0){const g=Vt.getBounds();g.isValid()&&vt.fitBounds(g,{padding:[30,30],maxZoom:12})}ea=!1}function hl(t,e){if(_e&&(_e.remove(),_e=null),!vt||t.length===0)return;const a=Hr(t);_e=z.control({position:"bottomright"}),_e.onAdd=function(){const s=z.DomUtil.create("div","map-legend");z.DomEvent.disableClickPropagation(s),z.DomEvent.disableScrollPropagation(s);let i='<div class="map-legend-title">Layers <span class="map-legend-hint">(drag or use arrows to reorder)</span></div>';for(let n=0;n<a.length;n++){const l=a[n],c=l.metadata,u=c.category||"OTHER",d=bt(u),h=c.name||"Unnamed Layer",f=!Ea.has(l.id),p=n===0,m=n===a.length-1;i+=`<div class="map-legend-row map-layer-toggle ${f?"":"layer-hidden"}" data-layer-id="${l.id}" draggable="true" title="${h}">
        <div class="layer-order-controls">
          <button class="layer-order-btn layer-move-up" data-layer-id="${l.id}" ${m?"disabled":""} title="Bring forward">&#9650;</button>
          <button class="layer-order-btn layer-move-down" data-layer-id="${l.id}" ${p?"disabled":""} title="Send backward">&#9660;</button>
        </div>
        <label class="map-layer-label-wrap">
          <input type="checkbox" class="map-layer-cb" data-layer-id="${l.id}" ${f?"checked":""}>
          <span class="map-legend-swatch" style="background:${d.fill};border-color:${d.stroke}"></span>
          <span class="map-legend-label">${h}</span>
        </label>
      </div>`}s.innerHTML=i,s.querySelectorAll(".map-layer-cb").forEach(n=>{n.addEventListener("change",()=>{const l=n.dataset.layerId;n.checked?Ea.delete(l):Ea.add(l),ea=!0,Ya()})}),s.querySelectorAll(".layer-move-up").forEach(n=>{n.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),Ti(n.dataset.layerId,"up")})}),s.querySelectorAll(".layer-move-down").forEach(n=>{n.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),Ti(n.dataset.layerId,"down")})});let r=null;return s.querySelectorAll(".map-layer-toggle[draggable]").forEach(n=>{n.addEventListener("dragstart",l=>{r=n.dataset.layerId,n.classList.add("layer-dragging"),l.dataTransfer.effectAllowed="move"}),n.addEventListener("dragend",()=>{n.classList.remove("layer-dragging"),s.querySelectorAll(".layer-dragover").forEach(l=>l.classList.remove("layer-dragover")),r=null}),n.addEventListener("dragover",l=>{l.preventDefault(),l.dataTransfer.dropEffect="move",n.classList.add("layer-dragover")}),n.addEventListener("dragleave",()=>{n.classList.remove("layer-dragover")}),n.addEventListener("drop",l=>{l.preventDefault(),n.classList.remove("layer-dragover");const c=n.dataset.layerId;r&&r!==c&&ul(r,c)})}),s},_e.addTo(vt)}function Ti(t,e){const a=ut.indexOf(t);if(a!==-1){if(e==="up"&&a<ut.length-1)[ut[a],ut[a+1]]=[ut[a+1],ut[a]];else if(e==="down"&&a>0)[ut[a],ut[a-1]]=[ut[a-1],ut[a]];else return;ea=!0,Ya()}}function ul(t,e){const a=ut.indexOf(t),s=ut.indexOf(e);if(a===-1||s===-1)return;ut.splice(a,1);const i=ut.indexOf(e);ut.splice(i,0,t),ea=!0,Ya()}function pl(t,e){if(!e)return null;for(const a of e)if(a.features.includes(t))return a.meta;return e.length>0?e[0].meta:null}function Fe(t,e,a,s=!1){var u;const i=t.properties,r=bt(a.category,i.type),o=((u=K[a.category])==null?void 0:u.label)||a.category,n=s?'<span style="display:inline-block;background:#f0ad4e;color:#fff;font-size:10px;font-weight:600;padding:1px 6px;border-radius:10px;margin-left:6px">REF</span>':"",c=`
    <div style="min-width:200px">
      <strong>${`<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${r.fill};border:1px solid ${r.stroke};margin-right:5px;vertical-align:middle"></span>`}${i.name||"Unnamed"}</strong>${n}<br>
      <small>${o} | ${i.province||"No province"}</small>
      <hr style="margin:6px 0;border:none;border-top:1px solid #eee">
      <table style="font-size:12px;width:100%">
        ${i.type?`<tr><td><b>Type:</b></td><td>${i.type}</td></tr>`:""}
        ${i.status?`<tr><td><b>Status:</b></td><td>${i.status}</td></tr>`:""}
        ${i.year?`<tr><td><b>Year:</b></td><td>${i.year}</td></tr>`:""}
        ${i.area_ha?`<tr><td><b>Area:</b></td><td>${i.area_ha.toFixed(2)} ha</td></tr>`:""}
        ${i.source?`<tr><td><b>Source:</b></td><td>${i.source}</td></tr>`:""}
      </table>
      ${i.notes?`<p style="font-size:11px;margin-top:6px;color:#666">${i.notes}</p>`:""}
    </div>
  `;e.bindPopup(c)}function fl(t,e){return t.filter(a=>{const s=a.properties||{};return!(e.province&&e.province!=="All"&&s.province!==e.province||e.realm&&e.realm!=="All"&&s.realm!==e.realm||e.year&&e.year!=="All"&&String(s.year)!==String(e.year))})}function Vr(){return vt}function gl(){return[...ut]}function ml(){vt&&setTimeout(()=>vt.invalidateSize(),100)}function $i(t,e){if(!e||e.length===0){t.innerHTML='<p style="color:var(--text-light);font-size:13px;padding:10px">No province data available</p>';return}const a=Math.max(...e.map(i=>i.total_ha),1),s=e.map(i=>{const r=(i.terrestrial_ha/a*100).toFixed(1),o=(i.marine_ha/a*100).toFixed(1);return`
      <div class="bar-row">
        <a href="#" class="bar-label province-zoom-link" data-province="${i.province}" title="Zoom to ${i.province}" style="cursor:pointer;color:var(--primary);text-decoration:none">${i.province}</a>
        <div class="bar-track">
          <div class="bar-fill terrestrial" style="width: ${r}%; position:absolute; left:0; top:0; height:100%"></div>
          <div class="bar-fill marine" style="width: ${o}%; position:absolute; left:${r}%; top:0; height:100%"></div>
        </div>
        <span class="bar-value">${he(i.total_ha)}</span>
      </div>
    `}).join("");t.innerHTML=`
    <div class="chart-container">
      <div style="display:flex;gap:14px;margin-bottom:8px;font-size:11px">
        <span><span style="display:inline-block;width:10px;height:10px;background:var(--primary);border-radius:2px;margin-right:4px"></span>Terrestrial</span>
        <span><span style="display:inline-block;width:10px;height:10px;background:var(--secondary);border-radius:2px;margin-right:4px"></span>Marine</span>
      </div>
      <div class="bar-chart" style="position:relative">
        ${s}
      </div>
    </div>
  `,t.querySelectorAll(".bar-track").forEach(i=>{i.style.position="relative"}),t.querySelectorAll(".province-zoom-link").forEach(i=>{i.addEventListener("click",r=>{r.preventDefault(),Wr(i.dataset.province)})})}function Li(t,e){if(!e||e.length===0){t.innerHTML='<p style="color:var(--text-light);font-size:13px">No data</p>';return}const a=e.map(i=>`
    <tr>
      <td><a href="#" class="province-zoom-link" data-province="${i.province}" style="color:var(--primary);cursor:pointer;text-decoration:none;font-weight:500" title="Zoom to ${i.province}">${i.province}</a></td>
      <td style="text-align:right">${he(i.terrestrial_ha)}</td>
      <td style="text-align:right">${he(i.marine_ha)}</td>
      <td style="text-align:right"><strong>${he(i.total_ha)}</strong></td>
      <td style="text-align:right">${i.features}</td>
    </tr>
  `).join(""),s=e.reduce((i,r)=>({terrestrial_ha:i.terrestrial_ha+r.terrestrial_ha,marine_ha:i.marine_ha+r.marine_ha,total_ha:i.total_ha+r.total_ha,features:i.features+r.features}),{terrestrial_ha:0,marine_ha:0,total_ha:0,features:0});t.innerHTML=`
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
        ${a}
      </tbody>
      <tfoot>
        <tr style="font-weight:600;border-top:2px solid var(--border)">
          <td>Total</td>
          <td style="text-align:right">${he(s.terrestrial_ha)}</td>
          <td style="text-align:right">${he(s.marine_ha)}</td>
          <td style="text-align:right">${he(s.total_ha)}</td>
          <td style="text-align:right">${s.features}</td>
        </tr>
      </tfoot>
    </table>
  `,t.querySelectorAll(".province-zoom-link").forEach(i=>{i.addEventListener("click",r=>{r.preventDefault(),Wr(i.dataset.province)})})}function Wr(t){const e=Vr();if(!e)return;const s=Y().provincesGeojson;if(!s||!s.features)return;const i=s.features.find(n=>(n.properties.name||n.properties.province||n.properties.NAME||"")===t);if(!i)return;const o=z.geoJSON(i).getBounds();o.isValid()&&e.fitBounds(o,{padding:[40,40],maxZoom:11})}function he(t){return!t&&t!==0?"-":t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toFixed(1)}const vl=`
  position:fixed;inset:0;z-index:99999;
  display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.45);backdrop-filter:blur(2px);
  animation:nbsapDialogFadeIn 0.15s ease-out;
`,Ws=`
  background:#fff;border-radius:12px;padding:24px;
  min-width:320px;max-width:460px;width:90%;
  box-shadow:0 20px 60px rgba(0,0,0,0.25);
  font-family:var(--font, system-ui, sans-serif);
  animation:nbsapDialogSlideIn 0.2s ease-out;
`,Ks=`
  margin:0 0 8px;font-size:16px;font-weight:700;
  color:var(--text, #1A202C);
`,Js=`
  margin:0 0 20px;font-size:14px;line-height:1.5;
  color:var(--text-secondary, #616E7C);white-space:pre-line;
`,Ys=`
  padding:10px 20px;border-radius:8px;font-size:14px;
  font-weight:600;cursor:pointer;border:none;
  transition:all 0.15s;
`,Zs=`${Ys}
  background:var(--primary, #006B3F);color:#fff;
`,Kr=`${Ys}
  background:var(--gray-100, #F1F3F5);color:var(--text, #1A202C);
`,yl=`${Ys}
  background:var(--danger, #D32F2F);color:#fff;
`,bl=`
  width:100%;padding:10px 12px;border:2px solid var(--border, #E4E7EB);
  border-radius:8px;font-size:14px;margin-bottom:20px;
  font-family:inherit;box-sizing:border-box;
  outline:none;transition:border-color 0.15s;
`;let Gi=!1;function _l(){if(Gi)return;Gi=!0;const t=document.createElement("style");t.textContent=`
    @keyframes nbsapDialogFadeIn { from { opacity:0 } to { opacity:1 } }
    @keyframes nbsapDialogSlideIn { from { transform:translateY(-10px);opacity:0 } to { transform:translateY(0);opacity:1 } }
  `,document.head.appendChild(t)}function Xs(){_l();const t=document.createElement("div");return t.style.cssText=vl,t}function aa(t,e={}){const a=e.title||"Notice";return new Promise(s=>{const i=Xs();i.innerHTML=`
      <div style="${Ws}">
        <h3 style="${Ks}">${a}</h3>
        <p style="${Js}">${Qs(t)}</p>
        <div style="display:flex;justify-content:flex-end">
          <button data-action="ok" style="${Zs}">OK</button>
        </div>
      </div>
    `,i.querySelector('[data-action="ok"]').addEventListener("click",()=>{i.remove(),s()}),document.body.appendChild(i),i.querySelector('[data-action="ok"]').focus()})}function Ga(t,e={}){const a=e.title||"Confirm",s=e.okLabel||"OK",i=e.cancelLabel||"Cancel",r=e.danger?yl:Zs;return new Promise(o=>{const n=Xs();n.innerHTML=`
      <div style="${Ws}">
        <h3 style="${Ks}">${a}</h3>
        <p style="${Js}">${Qs(t)}</p>
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button data-action="cancel" style="${Kr}">${i}</button>
          <button data-action="ok" style="${r}">${s}</button>
        </div>
      </div>
    `,n.querySelector('[data-action="cancel"]').addEventListener("click",()=>{n.remove(),o(!1)}),n.querySelector('[data-action="ok"]').addEventListener("click",()=>{n.remove(),o(!0)}),document.body.appendChild(n),n.querySelector('[data-action="ok"]').focus()})}function Ml(t,e="",a={}){const s=a.title||"Input";return new Promise(i=>{const r=Xs();r.innerHTML=`
      <div style="${Ws}">
        <h3 style="${Ks}">${s}</h3>
        <p style="${Js}">${Qs(t)}</p>
        <input type="text" data-input style="${bl}" value="${xl(e)}">
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button data-action="cancel" style="${Kr}">Cancel</button>
          <button data-action="ok" style="${Zs}">OK</button>
        </div>
      </div>
    `;const o=r.querySelector("[data-input]");o.addEventListener("focus",()=>{o.style.borderColor="var(--primary, #006B3F)"}),o.addEventListener("blur",()=>{o.style.borderColor="var(--border, #E4E7EB)"}),o.addEventListener("keydown",n=>{n.key==="Enter"&&r.querySelector('[data-action="ok"]').click(),n.key==="Escape"&&r.querySelector('[data-action="cancel"]').click()}),r.querySelector('[data-action="cancel"]').addEventListener("click",()=>{r.remove(),i(null)}),r.querySelector('[data-action="ok"]').addEventListener("click",()=>{r.remove(),i(o.value)}),document.body.appendChild(r),o.focus(),o.select()})}function Qs(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function xl(t){return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}function wl(){var r;const t=Y(),e=Gt(),a=t.filters;a.targets.length===0||a.targets.includes("T3");const s=[["Layer","Category","Realm","Province","Name","Area (ha)","Targets","Status","Year"]];for(const o of e){const n=o.metadata;if(!(a.targets.length>0&&!n.targets.some(l=>a.targets.includes(l)))&&!(a.category&&a.category!=="All"&&n.category!==a.category))for(const l of((r=o.geojson)==null?void 0:r.features)||[]){const c=l.properties||{};a.province&&a.province!=="All"&&c.province!==a.province||a.realm&&a.realm!=="All"&&c.realm!==a.realm||a.year&&a.year!=="All"&&String(c.year)!==String(a.year)||s.push([n.name,n.category,c.realm||"",c.province||"",c.name||"",(c.area_ha||0).toFixed(2),(c.targets||[]).join(";"),c.status||"",c.year||""])}}const i=s.map(o=>o.map(n=>`"${String(n).replace(/"/g,'""')}"`).join(",")).join(`
`);Jr(i,"nbsap-export.csv","text/csv")}function Sl(){const e=Y().filters,a=Gt(),s=e.targets.length===0||e.targets.includes("T3"),i={type:"TOR_Reporting_Snapshot",version:"1.0",timestamp:new Date().toISOString(),filters:{...e},includedLayers:[],metrics:{}};s&&(i.metrics=Le(a,e));const r=Sr(a,e);i.metrics.general=r;for(const n of a){const l=n.metadata;e.targets.length>0&&!l.targets.some(c=>e.targets.includes(c))||e.category&&e.category!=="All"&&l.category!==e.category||i.includedLayers.push({id:l.id,name:l.name,category:l.category,targets:l.targets,realm:l.realm,featureCount:l.featureCount,totalAreaHa:l.totalAreaHa,countsToward30x30:l.countsToward30x30,status:l.status})}const o=JSON.stringify(i,null,2);Jr(o,"tor-snapshot.json","application/json")}async function El(){const t=Vr(),e=document.getElementById("map");if(!t||!e){aa("Map not ready. Please wait for layers to load.");return}try{const a=t.getSize(),s=2,i=document.createElement("canvas");i.width=a.x*s,i.height=a.y*s;const r=i.getContext("2d");r.scale(s,s),r.fillStyle="#fff",r.fillRect(0,0,a.x,a.y);const o=e.querySelector(".leaflet-map-pane"),n=Me(o),l=e.querySelector(".leaflet-tile-pane");if(l){const d=l.querySelectorAll(".leaflet-tile-container");for(const h of d){const f=Me(h),p=h.querySelectorAll("img.leaflet-tile");for(const m of p)if(!(!m.complete||m.naturalWidth===0))try{const g=Me(m),y=n.x+f.x+g.x,v=n.y+f.y+g.y;r.drawImage(m,y,v,m.width,m.height)}catch{}}}const c=e.querySelectorAll(".leaflet-overlay-pane canvas");for(const d of c)if(!(d.width===0||d.height===0))try{const h=Me(e.querySelector(".leaflet-overlay-pane")),f=Me(d),p=n.x+h.x+f.x,m=n.y+h.y+f.y;r.drawImage(d,p,m)}catch{}const u=e.querySelectorAll(".leaflet-overlay-pane svg");for(const d of u)try{const h=new XMLSerializer().serializeToString(d),f=new Blob([h],{type:"image/svg+xml;charset=utf-8"}),p=URL.createObjectURL(f),m=await Al(p);URL.revokeObjectURL(p);const g=Me(e.querySelector(".leaflet-overlay-pane")),y=d.getBoundingClientRect(),v=e.getBoundingClientRect(),b=y.left-v.left,_=y.top-v.top;r.drawImage(m,b,_,y.width,y.height)}catch{}r.fillStyle="rgba(255,255,255,0.8)",r.fillRect(0,a.y-22,a.x,22),r.fillStyle="#555",r.font="11px sans-serif",r.fillText("Vanuatu NBSAP GIS Portal — "+new Date().toLocaleDateString("en-GB"),8,a.y-7),i.toBlob(d=>{if(d){const h=URL.createObjectURL(d),f=document.createElement("a");f.href=h,f.download="nbsap-map.png",f.click(),URL.revokeObjectURL(h)}},"image/png")}catch(a){console.error("Map PNG export failed:",a),aa("Map PNG export failed. Try using browser Print/Screenshot (Ctrl+Shift+S) instead.")}}function Me(t){var r;if(!t)return{x:0,y:0};const e=((r=t.style)==null?void 0:r.transform)||window.getComputedStyle(t).transform||"",a=e.match(/translate3d\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);if(a)return{x:parseFloat(a[1]),y:parseFloat(a[2])};const s=e.match(/translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);if(s)return{x:parseFloat(s[1]),y:parseFloat(s[2])};const i=e.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/);return i?{x:parseFloat(i[1]),y:parseFloat(i[2])}:{x:0,y:0}}function Al(t){return new Promise((e,a)=>{const s=new Image;s.onload=()=>e(s),s.onerror=a,s.src=t})}function Jr(t,e,a){const s=new Blob([t],{type:a}),i=URL.createObjectURL(s),r=document.createElement("a");r.href=i,r.download=e,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}const xe=[{id:"spatial-plans",name:"Biodiversity Spatial Plans",category:"SPATIAL_PLAN",target:"T1",realm:"terrestrial",countsToward30x30:!1,description:"Provincial and municipal physical plans with CCA boundary zones"},{id:"kba-terrestrial",name:"Key Biodiversity Areas",category:"KBA",target:"T1",realm:"terrestrial",countsToward30x30:!1,description:"Sites of global importance for biodiversity (BirdLife / KBA Partnership)"},{id:"mpa-spatial-plan",name:"Marine Protected Areas (Spatial Planning)",category:"MPA",target:"T1",realm:"marine",countsToward30x30:!1,description:"Marine protected areas included in biodiversity spatial planning"},{id:"lmma-spatial-plan",name:"Locally Managed Marine Areas (Spatial Planning)",category:"LMMA",target:"T1",realm:"marine",countsToward30x30:!1,description:"Community-managed marine areas included in biodiversity spatial planning"},{id:"degraded-terrestrial",name:"Degraded Terrestrial Areas",category:"DEGRADED",target:"T2",realm:"terrestrial",countsToward30x30:!1,description:"Mapped degraded terrestrial and inland water ecosystems"},{id:"degraded-marine",name:"Degraded Marine & Coastal Areas",category:"DEGRADED",target:"T2",realm:"marine",countsToward30x30:!1,description:"Mapped degraded marine and coastal ecosystems"},{id:"restoration-sites",name:"Ecosystem Restoration Sites",category:"RESTORATION",target:"T2",realm:"terrestrial",countsToward30x30:!1,description:"Active and planned restoration sites for degraded ecosystems"},{id:"eez-boundary",name:"Exclusive Economic Zone (EEZ)",category:"EEZ",target:"T3",realm:"marine",countsToward30x30:!1,isReference:!0,description:"Vanuatu EEZ boundary — used to derive marine baseline area for 30x30 target"},{id:"admin0-boundary",name:"National Boundary (Admin0 Coastline)",category:"ADMIN_BOUNDARY",target:"T3",realm:"terrestrial",countsToward30x30:!1,isReference:!0,description:"Vanuatu national boundary / coastline — used as terrestrial baseline for 30x30 target"},{id:"cca-terrestrial",name:"Community Conserved Areas",category:"CCA",target:"T3",realm:"terrestrial",countsToward30x30:!0,description:"Community-managed conservation areas (Custom Tabu Areas, Community Conservation Areas)"},{id:"mpa-marine",name:"Marine Protected Areas",category:"MPA",target:"T3",realm:"marine",countsToward30x30:!0,description:"Nationally designated marine protected areas and management zones"},{id:"lmma-marine",name:"Locally Managed Marine Areas",category:"LMMA",target:"T3",realm:"marine",countsToward30x30:!0,description:"LMMAs managed by local communities for marine resource conservation"},{id:"pa-terrestrial",name:"Protected Areas (WDPA)",category:"PA",target:"T3",realm:"terrestrial",countsToward30x30:!0,description:"Protected areas from the World Database on Protected Areas"},{id:"oecm-terrestrial",name:"Other Effective Conservation Measures",category:"OECM",target:"T3",realm:"terrestrial",countsToward30x30:!0,description:"OECMs contributing to in-situ conservation outside protected areas"},{id:"megapode-distribution",name:"Vanuatu Megapode Distribution",category:"MEGAPODE",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range and nesting sites of Megapodius layardi (Vanuatu Megapode) — endemic ground-nesting bird"},{id:"starling-distribution",name:"Vanuatu Mountain Starling Distribution",category:"STARLING",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range of Aplonis santovestris (Vanuatu Mountain Starling) — critically endangered endemic bird"},{id:"fantail-distribution",name:"Vanuatu Streaked Fantail Distribution",category:"FANTAIL",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range of Rhipidura spilodera (Vanuatu Streaked Fantail) — endemic passerine bird"},{id:"kingfisher-distribution",name:"Vanuatu Kingfisher Distribution",category:"KINGFISHER",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range of Todiramphus farquhari (Vanuatu Kingfisher) — endemic kingfisher species"},{id:"flying-fox-distribution",name:"Vanuatu Flying Fox Distribution",category:"FLYING_FOX",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range and roost sites of Pteropus anetianus (Vanuatu Flying Fox) — endemic fruit bat"},{id:"plerandra-distribution",name:"Plerandra vanuatuensis Distribution",category:"PLERANDRA",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range of Plerandra vanuatuensis — endemic plant species of Vanuatu"},{id:"kba-t4",name:"Key Biodiversity Areas",category:"KBA",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Key Biodiversity Areas (KBAs) of Vanuatu — sites of global importance for biodiversity (BirdLife / KBA Partnership)"},{id:"merremia-detection",name:"Merremia peltata (Big Leaf)",category:"MERREMIA",target:"T6",realm:"terrestrial",countsToward30x30:!1,description:"Remote sensing and field survey detections of Merremia peltata invasive vine coverage"},{id:"crown-of-thorns",name:"Crown of Thorns Starfish",category:"CROWN_OF_THORNS",target:"T6",realm:"marine",countsToward30x30:!1,description:"Acanthaster planci (Crown-of-Thorns starfish) outbreak locations and affected reef areas"},{id:"mile-a-minute",name:"Mile a Minute Vine",category:"MILE_A_MINUTE",target:"T6",realm:"terrestrial",countsToward30x30:!1,description:"Mikania micrantha (Mile a Minute) invasive vine distribution and coverage areas"},{id:"solanum-torvum",name:"Solanum torvum (Devil Fig)",category:"SOLANUM_TORVUM",target:"T6",realm:"terrestrial",countsToward30x30:!1,description:"Solanum torvum (Devil Fig / Prickly Nightshade) distribution and infestation areas"},{id:"invasive-species",name:"Other Invasive Alien Species",category:"INVASIVE",target:"T6",realm:"terrestrial",countsToward30x30:!1,description:"Fire Ants, African Snail, Sako, Coconut Beetle and other IAS"},{id:"pesticide-areas",name:"Pesticide & Herbicide Use Areas",category:"PESTICIDE",target:"T7",realm:"terrestrial",countsToward30x30:!1,description:"Areas of pesticide and herbicide use in large-scale and small-scale commercial farming"},{id:"eutrophication-zones",name:"Coastal Eutrophication Zones",category:"EUTROPHICATION",target:"T8",realm:"marine",countsToward30x30:!1,description:"Mapped coastal eutrophication and nutrient-impacted zones"},{id:"land-cover",name:"Land Cover / Land Use Change",category:"LAND_COVER",target:"T10",realm:"terrestrial",countsToward30x30:!1,description:"Land cover change mapping for agriculture, livestock, fisheries and forestry"},{id:"green-spaces",name:"Blue & Green Spaces",category:"GREEN_SPACE",target:"T12",realm:"terrestrial",countsToward30x30:!1,description:"Parks within provincial and municipal areas, and botanical gardens"}],Yr="print-map-overlay";function sa(t,e,a){var s,i,r,o;if(e==="T3")return Le(t,a);if(e==="T1"){const n=Ka(t,a);return{...n,totalAreaHa:n.terrestrial_ha+n.marine_ha,grossAreaHa:n.gross_terrestrial_ha+n.gross_marine_ha,realmTotals:{terrestrial_ha:n.terrestrial_ha,marine_ha:n.marine_ha,gross_terrestrial_ha:n.gross_terrestrial_ha,gross_marine_ha:n.gross_marine_ha},typeBreakdown:[]}}if(e==="T2"){const n=Os(t,a),l=(((s=n.realmTotals)==null?void 0:s.degraded_terrestrial_ha)||0)+(((i=n.realmTotals)==null?void 0:i.restoration_terrestrial_ha)||0),c=(((r=n.realmTotals)==null?void 0:r.degraded_marine_ha)||0)+(((o=n.realmTotals)==null?void 0:o.restoration_marine_ha)||0);return{...n,totalAreaHa:n.degraded_ha+n.restoration_ha,grossAreaHa:n.gross_degraded_ha+n.gross_restoration_ha,realmTotals:{terrestrial_ha:l,marine_ha:c,gross_terrestrial_ha:l,gross_marine_ha:c},typeBreakdown:[]}}return ye(t,e,a)}const da='<svg width="48" height="36" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="border:0.5px solid #ccc;border-radius:2px;flex-shrink:0"><defs><clipPath id="vu-a"><path d="M0 0v475l420-195h480v-85H420Z"/></clipPath></defs><path fill="#009543" d="M0 0h640v480H0z"/><path fill="#d21034" d="M0 0h640v240H0z"/><g clip-path="url(#vu-a)" transform="scale(.71111 1.01053)"><path stroke="#fdce12" stroke-width="110" d="m0 0 420 195h480v85H420L0 475"/><path fill="none" stroke="#000" stroke-width="60" d="m0 0 420 195h480m0 85H420L0 475"/></g><g fill="#fdce12" transform="translate(-22)scale(1.01053)"><path d="M106.9 283v27c23.5 0 69.7-18 69.7-76.1s-49.3-68.9-64-68.9-60.3 10.6-60.3 58c0 47.6 44.7 52 53.5 52s41.8-8 38-43.6a35.5 35.5 0 0 1-35.4 31.5c-24 0-39-17.8-39-35.4s14.6-41.2 39.9-41.2 43.8 22.5 43.8 45.1-17.8 51.5-46.2 51.5z"/><g id="vu-b"><path stroke="#fdce12" stroke-width=".8" d="m86.2 247.7 1.4 1s11.2-25.5 41.1-43.6c-3.8 2-23.8 12-42.5 42.6z"/><path d="M89.1 243.3s-3.4-7-.4-10.2 1.7 8.3 1.7 8.3l1.3-1.9s-2-8.6.2-10.4 1.2 8.3 1.2 8.3l1.4-1.8s-1.5-8.4.7-10 .9 8 .9 8l1.6-2s-1.2-8 1.5-9.9.3 7.6.3 7.6l1.8-2s-.8-7.3 1.5-9c2.3-1.6.4 7 .4 7l1.6-1.8s-.5-6.8 1.7-8.4.2 6.5.2 6.5l1.7-1.6s-.4-6.9 2.4-8.2-.5 6.4-.5 6.4l2-1.6s.5-8 2.9-8.7c2.4-.8-1 7-1 7l1.7-1.4s.9-6.8 3.5-7.6c2.7-.9-1.6 6.2-1.6 6.2l1.7-1.3s1.9-6.8 4.4-7.6c2.4-.7-2.6 6.5-2.6 6.5l1.7-1.2s2.7-6.2 5-6.6c2.1-.4-2.6 5.1-2.6 5.1l2.1-1.2s3.5-6.4 4.8-4.5-5 4.9-5 4.9l-2 1.2s7.5-3.6 8.4-1.8-10.3 3-10.3 3l-1.8 1.2s7.5-2 6.6-.1-8.4 1.5-8.4 1.5l-1.7 1.2s7.5-1.8 6.5 0c-1 1.6-8.3 1.5-8.3 1.5l-1.8 1.5s7.3-2 6.2.3-9.4 2.1-9.4 2.1l-2 2s7.7-2.7 7-.6c-.6 2-9.4 3-9.4 3l-2 2s8.3-2.7 5.8-.2c-2.4 2.6-8.5 3.2-8.5 3.2l-2.3 3s8.2-5 7-2.2-9.2 4.7-9.2 4.7l-1.6 2s7.4-4.3 6.6-2c-.7 2.5-8.6 5-8.6 5l-1.3 1.8s8.7-5.2 8-2.5c-.8 2.6-9.1 4.5-9.1 4.5l-1 1.7s8-4.7 8-2.4c.2 2.2-9.4 4.4-9.4 4.4z"/></g><use xlink:href="#vu-b" width="100%" height="100%" transform="matrix(-1 0 0 1 220 0)"/></g></svg>';function ha(t){return Gt().filter(a=>{var s,i;return(i=(s=a.metadata)==null?void 0:s.targets)==null?void 0:i.includes(t)})}function Za(t){return It.targets.find(e=>e.code===t)}function ti(t){return xe.filter(e=>e.target===t)}function qt(t){return!t&&t!==0?"0":t>=1e6?(t/1e6).toFixed(2)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toFixed(1)}function B(t){return!t&&t!==0?"0.00":t.toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}function rt(t){return!t&&t!==0?"0.0%":t.toFixed(1)+"%"}function ei(t,e){let s=tl(t).map(i=>{var o;const r=i.label||((o=K[i.key])==null?void 0:o.label)||i.key;return`<div class="print-legend-item">
      <span class="print-legend-swatch" style="background:${i.fill};border-color:${i.stroke}"></span>
      <span>${r}</span>
    </div>`}).join("");return e&&(s+='<div class="print-legend-item"><span class="print-legend-swatch print-legend-swatch-province"></span><span>Province Boundary</span></div>'),s}async function Zr(t){se();const e=Za(t);if(!e)return;await Re([t]),Ut();const a=Xa([t]);document.body.appendChild(a),document.body.classList.add("print-mode");const s=a.querySelector("#print-pages");Xr(s,t,e),a.querySelector("#print-close-btn").addEventListener("click",se),a.querySelector("#print-print-btn").addEventListener("click",()=>window.print())}async function Pl(t){se();const e=Za(t);if(!e)return;await Re([t]),Ut();const a=Y(),s=a.provinces||[];if(s.length===0)return;const i=Xa([t],`${t} — By Province (${s.length})`);document.body.appendChild(i),document.body.classList.add("print-mode");const r=i.querySelector("#print-pages"),o=ha(t),n=Ll(t,o,s);let l=0;function c(){if(l>=s.length)return;const u=Nl(r,t,e,s[l],n);l++,requestAnimationFrame(()=>{Qa(u,t,o,a.provincesGeojson,s[l-1],!0),setTimeout(()=>requestAnimationFrame(c),600)})}c(),i.querySelector("#print-close-btn").addEventListener("click",se),i.querySelector("#print-print-btn").addEventListener("click",()=>window.print())}const kl=[{key:"MEGAPODE",name:"Vanuatu Megapode",scientific:"Megapodius layardi",taxa:"Bird"},{key:"STARLING",name:"Vanuatu Mountain Starling",scientific:"Aplonis santovestris",taxa:"Bird"},{key:"FANTAIL",name:"Vanuatu Streaked Fantail",scientific:"Rhipidura spilodera",taxa:"Bird"},{key:"KINGFISHER",name:"Vanuatu Kingfisher",scientific:"Todiramphus farquhari",taxa:"Bird"},{key:"FLYING_FOX",name:"Vanuatu Flying Fox",scientific:"Pteropus anetianus",taxa:"Mammal"},{key:"PLERANDRA",name:"Plerandra vanuatuensis",scientific:"Plerandra vanuatuensis",taxa:"Plant"}];async function Cl(t){var u,d,h,f,p,m,g;se();const e=Za(t);if(!e)return;await Re([t]),Ut();const a=Y(),s=ha(t),i=[];for(const y of kl){const v=[];for(const b of s)if(!((u=b.metadata)!=null&&u.isReference)&&((d=b.metadata)==null?void 0:d.category)===y.key)for(const _ of((h=b.geojson)==null?void 0:h.features)||[])v.push(_);v.length>0&&i.push({...y,features:v})}const r=["KBA","SPECIES_DIST"];for(const y of r){const v=[];for(const b of s)if(!((f=b.metadata)!=null&&f.isReference)&&((p=b.metadata)==null?void 0:p.category)===y)for(const _ of((m=b.geojson)==null?void 0:m.features)||[])v.push(_);if(v.length>0){const b=((g=K[y])==null?void 0:g.label)||y;i.push({key:y,name:b,scientific:"",taxa:"",features:v})}}if(i.length===0)return;const o=Xa([t],`T4 — By Species (${i.length})`);document.body.appendChild(o),document.body.classList.add("print-mode");const n=o.querySelector("#print-pages");let l=0;function c(){if(l>=i.length)return;const y=i[l],v=Tl(n,t,e,y);l++,requestAnimationFrame(()=>{$l(v,y,a.provincesGeojson),setTimeout(()=>requestAnimationFrame(c),600)})}c(),o.querySelector("#print-close-btn").addEventListener("click",se),o.querySelector("#print-print-btn").addEventListener("click",()=>window.print())}function Tl(t,e,a,s,i,r){var G,P,$,S,w;const o=gt.nationalBaselines,n=s.features,l=n.filter(k=>!We(k)),c=n.filter(k=>We(k)),u=c.length>0;let d=0,h=0,f=0;for(const k of l)h+=((G=k.properties)==null?void 0:G.area_ha)||0;for(const k of c)f+=((P=k.properties)==null?void 0:P.area_ha)||0;d=h+f;const p={};for(const k of n){const I=(($=k.properties)==null?void 0:$.province)||"Unassigned";p[I]||(p[I]={resident:0,extinct:0,features:0,area_ha:0}),p[I].features++;const O=((S=k.properties)==null?void 0:S.area_ha)||0;p[I].area_ha+=O,We(k)?p[I].extinct++:p[I].resident++}const m=document.createElement("div");m.className="print-page";const g=`print-map-species-${s.key}`,y=bt(s.key),v=`
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${qt(d)}</span><span class="print-metric-label">Total Area (ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${n.length}</span><span class="print-metric-label">Records</span></div>
      ${u?`
        <div class="print-metric"><span class="print-metric-value">${l.length}</span><span class="print-metric-label">Resident Records</span></div>
        <div class="print-metric"><span class="print-metric-value">${c.length}</span><span class="print-metric-label">Extinct Records</span></div>
      `:`
        <div class="print-metric"><span class="print-metric-value">${Object.keys(p).length}</span><span class="print-metric-label">Provinces</span></div>
        <div class="print-metric"><span class="print-metric-value">${qt(h)}</span><span class="print-metric-label">Distribution (ha)</span></div>
      `}
      <div class="print-metric"><span class="print-metric-value">${rt(o.terrestrial_ha>0?d/o.terrestrial_ha*100:0)}</span><span class="print-metric-label">% National Land</span></div>
      <div class="print-metric"><span class="print-metric-value"><span class="cat-dot" style="background:${y.fill};border-color:${y.stroke}"></span></span><span class="print-metric-label">${((w=K[s.key])==null?void 0:w.label)||s.name}</span></div>
    </div>
  `;let b=`<div class="print-legend-item">
    <span class="print-legend-swatch" style="background:${y.fill};border-color:${y.stroke}"></span>
    <span>${s.name}${u?" (Resident)":""}</span>
  </div>`;u&&(b+=`<div class="print-legend-item">
      <span class="print-legend-swatch" style="background:#B0BEC5;border-color:#78909C;border-style:dashed"></span>
      <span>${s.name} (Extinct)</span>
    </div>`),b+='<div class="print-legend-item"><span class="print-legend-swatch print-legend-swatch-province"></span><span>Province Boundary</span></div>';const _=Object.entries(p).sort((k,I)=>I[1].area_ha-k[1].area_ha);let x="";if(_.length>0){const k=_.map(([N,j])=>{const D=u?`<td class="r">${j.resident}</td><td class="r">${j.extinct}</td>`:"";return`<tr><td>${N}</td><td class="r">${B(j.area_ha)}</td><td class="r">${j.features}</td>${D}</tr>`}).join(""),I=_.reduce((N,[,j])=>N+j.features,0),O=_.reduce((N,[,j])=>N+j.area_ha,0),C=u?'<th class="r">Resident</th><th class="r">Extinct</th>':"",L=u?`<td class="r"><b>${l.length}</b></td><td class="r"><b>${c.length}</b></td>`:"";x=`
      <div class="print-detail-table">
        <div class="print-section-title">Province Distribution</div>
        <table>
          <thead><tr><th>Province</th><th class="r">Area (ha)</th><th class="r">Records</th>${C}</tr></thead>
          <tbody>${k}</tbody>
          <tfoot><tr class="total-row"><td><b>TOTAL</b></td><td class="r"><b>${B(O)}</b></td><td class="r"><b>${I}</b></td>${L}</tr></tfoot>
        </table>
      </div>
    `}const E=s.scientific?`<i>${s.scientific}</i>`:"",A=s.taxa?` (${s.taxa})`:"";return m.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${da}
          <div>
            <div class="print-title-main">Vanuatu NBSAP GIS Portal</div>
            <div class="print-title-sub">National Biodiversity Strategies and Action Plan</div>
          </div>
        </div>
      </div>
      <div class="print-title-right">
        <div class="print-title-date">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
        <div class="print-title-crs">CRS: EPSG:4326 (WGS 84)</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code" style="background:${y.fill}">${s.key}</div>
      <div class="print-target-info">
        <div class="print-target-name">${s.name}${A}</div>
        <div class="print-target-desc">${E} &mdash; T4: Species &amp; Biodiversity Distribution</div>
      </div>
    </div>

    ${v}

    <div class="print-map-area">
      <div class="print-map-container" id="${g}"></div>
      <div class="print-map-furniture">
        <div class="print-legend-box">
          <div class="print-legend-title">Legend</div>
          ${b}
        </div>
        <div class="print-north-arrow">
          <svg width="36" height="48" viewBox="0 0 36 48">
            <polygon points="18,2 24,22 18,18 12,22" fill="#333" stroke="#333" stroke-width="0.5"/>
            <polygon points="18,2 12,22 18,18 24,22" fill="#fff" stroke="#333" stroke-width="0.5" opacity="0.4"/>
            <text x="18" y="38" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">N</text>
          </svg>
        </div>
      </div>
    </div>

    <div class="print-summary-line">${s.name}: ${B(d)} ha across ${Object.keys(p).length} province${Object.keys(p).length!==1?"s":""} | ${n.length} records</div>

    <div class="print-bottom-section">
      ${x}
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString("en-GB")}
      </div>
    </div>
  `,t.appendChild(m),g}function $l(t,e,a){if(!document.getElementById(t))return;const i=z.map(t,{center:gt.mapCenter,zoom:gt.mapZoom,zoomControl:!1,attributionControl:!1,dragging:!1,scrollWheelZoom:!1,doubleClickZoom:!1,touchZoom:!1,preferCanvas:!0});z.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{maxZoom:19}).addTo(i),z.control.scale({imperial:!1,position:"bottomleft",maxWidth:150}).addTo(i),a&&z.geoJSON(a,{style:()=>({color:"#777",weight:1.2,fillOpacity:.02,dashArray:"4 4"}),onEachFeature:(v,b)=>{const _=v.properties.name||v.properties.province||"";_&&b.bindTooltip(_,{permanent:!0,direction:"center",className:"print-province-label"})}}).addTo(i);const r=z.featureGroup(),o=e.features,n=o.filter(v=>!We(v)),l=o.filter(v=>We(v)),c=e.key,u=Fr(c),d=Xo(),h=Or(c),f=Qo(),p=l.filter(v=>{var _;const b=(_=v.geometry)==null?void 0:_.type;return b==="Polygon"||b==="MultiPolygon"}),m=l.filter(v=>{var _;const b=(_=v.geometry)==null?void 0:_.type;return b==="Point"||b==="MultiPoint"});if(p.length>0){const v=ot(p);v?r.addLayer(z.geoJSON(v,{style:()=>d})):r.addLayer(z.geoJSON({type:"FeatureCollection",features:p},{style:()=>d}))}m.length>0&&r.addLayer(z.geoJSON({type:"FeatureCollection",features:m},{pointToLayer:(v,b)=>z.circleMarker(b,f)}));const g=n.filter(v=>{var _;const b=(_=v.geometry)==null?void 0:_.type;return b==="Polygon"||b==="MultiPolygon"}),y=n.filter(v=>{var _;const b=(_=v.geometry)==null?void 0:_.type;return b==="Point"||b==="MultiPoint"});if(g.length>0){const v=ot(g);v?r.addLayer(z.geoJSON(v,{style:()=>u})):r.addLayer(z.geoJSON({type:"FeatureCollection",features:g},{style:()=>u}))}y.length>0&&r.addLayer(z.geoJSON({type:"FeatureCollection",features:y},{pointToLayer:(v,b)=>z.circleMarker(b,h)})),r.addTo(i),setTimeout(()=>{if(i.invalidateSize(),r.getLayers().length>0){const v=r.getBounds();v.isValid()&&i.fitBounds(v,{padding:[40,40],maxZoom:12})}},200)}function Ll(t,e,a){var h,f,p,m;const s={},i={};for(const g of a)s[g]=[],i[g]=new Map;const r=new Set(a);for(const g of e){if((h=g.metadata)!=null&&h.isReference)continue;const y=g.id||((f=g.metadata)==null?void 0:f.name)||"unknown";for(const v of((p=g.geojson)==null?void 0:p.features)||[]){const b=(m=v.properties)==null?void 0:m.province;if(b&&r.has(b)){s[b].push(v);let _=i[b].get(y);_||(_=[],i[b].set(y,_)),_.push(v)}}}const o=ei(e,!0),n=Gt(),c=sa(n,t,{targets:[t],province:"All",category:"All",realm:"All",year:"All"}),u={};for(const g of a){const y={targets:[t],province:g,category:"All",realm:"All",year:"All"};u[g]=sa(n,t,y)}const d=ti(t);return{provinceFeatures:s,provinceFeaturesPerLayer:i,legendHtml:o,nationalMetrics:c,provinceMetrics:u,expected:d,layers:e}}async function Gl(){se();const t=It.targets.map(n=>n.code);await Re(t),Ut();const e=Xa(t);document.body.appendChild(e),document.body.classList.add("print-mode");const a=e.querySelector("#print-pages"),s=Y(),i=[];for(const n of t){const l=Za(n);if(!l)continue;const c=Xr(a,n,l,!0);i.push({mapId:c,code:n,layers:ha(n)})}let r=0;function o(){if(r>=i.length)return;const{mapId:n,code:l,layers:c}=i[r];r++,Qa(n,l,c,s.provincesGeojson),setTimeout(()=>requestAnimationFrame(o),600)}requestAnimationFrame(o),e.querySelector("#print-close-btn").addEventListener("click",se),e.querySelector("#print-print-btn").addEventListener("click",()=>window.print())}function se(){const t=document.getElementById(Yr);t&&t.remove(),document.body.classList.remove("print-mode")}function Xa(t,e){const a=document.createElement("div");a.id=Yr,a.className="print-overlay";const s=e?`Print Maps: ${e}`:t.length===1?`Print Map: ${t[0]}`:`Print All Target Maps (${t.length})`;return a.innerHTML=`
    <div class="print-toolbar no-print">
      <div style="display:flex;align-items:center;gap:12px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        <span style="font-weight:600;font-size:15px">${s}</span>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" id="print-print-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / Save PDF
        </button>
        <button class="btn btn-outline" id="print-close-btn">Close</button>
      </div>
    </div>
    <div class="print-pages" id="print-pages"></div>
  `,a}function Xr(t,e,a,s=!1){var C,L,N,j,D,H,ct;const i=Y(),r=Gt(),o=ha(e),n=ti(e),l=gt.nationalBaselines,c=sa(r,e,{targets:[e],province:"All",category:"All",realm:"All",year:"All"});let u=0,d=0;for(const W of o){if((C=W.metadata)!=null&&C.isReference){d++;continue}u+=((N=(L=W.geojson)==null?void 0:L.features)==null?void 0:N.length)||0}const h=o.length-d,f=e==="T3",p=f?c.terrestrial_ha||0:((j=c.realmTotals)==null?void 0:j.terrestrial_ha)||0,m=f?c.marine_ha||0:((D=c.realmTotals)==null?void 0:D.marine_ha)||0,g=f?c.gross_terrestrial_ha||0:((H=c.realmTotals)==null?void 0:H.gross_terrestrial_ha)||0,y=f?c.gross_marine_ha||0:((ct=c.realmTotals)==null?void 0:ct.gross_marine_ha)||0,v=f?p+m:c.totalAreaHa||0;f?g+y:c.grossAreaHa;const b=l.terrestrial_ha>0?p/l.terrestrial_ha*100:0,_=l.marine_ha>0?m/l.marine_ha*100:0,x=document.createElement("div");x.className="print-page";const E=`print-map-${e}`,A=ei(o,!!i.provincesGeojson),G=`
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${qt(p)}</span><span class="print-metric-label">Terrestrial (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${qt(m)}</span><span class="print-metric-label">Marine (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${rt(b)}</span><span class="print-metric-label">% Land (of ${qt(l.terrestrial_ha)})</span></div>
      <div class="print-metric"><span class="print-metric-value">${rt(_)}</span><span class="print-metric-label">% Sea (of ${qt(l.marine_ha)})</span></div>
      <div class="print-metric"><span class="print-metric-value">${u.toLocaleString()}</span><span class="print-metric-label">Records</span></div>
      <div class="print-metric"><span class="print-metric-value">${h}</span><span class="print-metric-label">Data Layers</span></div>
    </div>
  `,P=(c==null?void 0:c.provinceBreakdown)||[];let $="";if(P.length>0){const W=P.map(at=>{const ft=at.province||"Unknown",Ct=at.terrestrial_ha??0,Ot=at.marine_ha??0,jt=at.total_ha??0,J=at.features??0;return`<tr><td>${ft}</td><td class="r">${B(Ct)}</td><td class="r">${B(Ot)}</td><td class="r"><b>${B(jt)}</b></td><td class="r">${J}</td></tr>`}).join(""),V=P.reduce((at,ft)=>at+(ft.terrestrial_ha||0),0),et=P.reduce((at,ft)=>at+(ft.marine_ha||0),0),At=P.reduce((at,ft)=>at+(ft.total_ha||0),0),mt=P.reduce((at,ft)=>at+(ft.features||0),0);$=`
      <div class="print-detail-table">
        <div class="print-section-title">Provincial Breakdown</div>
        <table>
          <thead><tr><th>Province</th><th class="r">Terrestrial (ha)</th><th class="r">Marine (ha)</th><th class="r">Total (ha)</th><th class="r">Records</th></tr></thead>
          <tbody>${W}</tbody>
          <tfoot><tr class="total-row"><td><b>TOTAL</b></td><td class="r"><b>${B(V)}</b></td><td class="r"><b>${B(et)}</b></td><td class="r"><b>${B(At)}</b></td><td class="r"><b>${mt}</b></td></tr></tfoot>
        </table>
      </div>
    `}const S=(c==null?void 0:c.categoryBreakdown)||[];let w="";S.length>0&&(w=`
      <div class="print-detail-table">
        <div class="print-section-title">Category Breakdown</div>
        <table>
          <thead><tr><th>Category</th><th class="r">Area (ha)</th><th class="r">Records</th></tr></thead>
          <tbody>${S.map(V=>{const et=bt(V.category),At=K[V.category]||{label:V.category};return`<tr><td><span class="cat-dot" style="background:${et.fill};border-color:${et.stroke}"></span>${At.label}</td><td class="r">${B(V.area_ha)}</td><td class="r">${V.features}</td></tr>`}).join("")}</tbody>
        </table>
      </div>
    `);const k=o.map(W=>{var Ot,jt,J,st;const V=W.metadata||{},et=V.name||W.id,At=((Ot=K[V.category])==null?void 0:Ot.label)||V.category||"-",mt=V.realm||"terrestrial",at=((J=(jt=W.geojson)==null?void 0:jt.features)==null?void 0:J.length)||0;(((st=W.geojson)==null?void 0:st.features)||[]).reduce((le,Tt)=>{var Pt;return le+(((Pt=Tt.properties)==null?void 0:Pt.area_ha)||0)},0);const ft=V.uploadTimestamp?new Date(V.uploadTimestamp).toLocaleDateString("en-GB"):"-",Ct=V.isReference?'<span class="ref-badge">REF</span>':"";return`<tr><td>${et} ${Ct}</td><td>${At}</td><td>${mt}</td><td class="r">${at}</td><td>${ft}</td></tr>`}).join("");o.length>0&&`${k}`;const I=`Total area: ${B(v)} ha | ${u} records across ${o.filter(W=>{var V;return!((V=W.metadata)!=null&&V.isReference)}).length} dataset${o.filter(W=>{var V;return!((V=W.metadata)!=null&&V.isReference)}).length!==1?"s":""}`;x.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${da}
          <div>
            <div class="print-title-main">Vanuatu NBSAP GIS Portal</div>
            <div class="print-title-sub">National Biodiversity Strategies and Action Plan</div>
          </div>
        </div>
      </div>
      <div class="print-title-right">
        <div class="print-title-date">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
        <div class="print-title-crs">CRS: EPSG:4326 (WGS 84)</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code">${e}</div>
      <div class="print-target-info">
        <div class="print-target-name">${a.name}</div>
        <div class="print-target-desc">${a.description}</div>
      </div>
    </div>

    ${G}

    <div class="print-map-area">
      <div class="print-map-container" id="${E}"></div>
      <div class="print-map-furniture">
        <div class="print-legend-box">
          <div class="print-legend-title">Legend</div>
          ${A}
        </div>
        <div class="print-north-arrow">
          <svg width="36" height="48" viewBox="0 0 36 48">
            <polygon points="18,2 24,22 18,18 12,22" fill="#333" stroke="#333" stroke-width="0.5"/>
            <polygon points="18,2 12,22 18,18 24,22" fill="#fff" stroke="#333" stroke-width="0.5" opacity="0.4"/>
            <text x="18" y="38" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">N</text>
          </svg>
        </div>
      </div>
    </div>

    <div class="print-summary-line">${I}</div>

    <div class="print-bottom-section">
      ${$}
      <div class="print-bottom-right">
        ${w}
      </div>
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString("en-GB")}
      </div>
    </div>
  `,t.appendChild(x);const O=Bl(e,o,c,n,l);return jl(t,e,a,O),s||requestAnimationFrame(()=>{setTimeout(()=>Qa(E,e,o,i.provincesGeojson),100)}),E}function Nl(t,e,a,s,i){var w,k,I,O,C;const r=Y(),o=(i==null?void 0:i.layers)||ha(e),n=gt.nationalBaselines,l={targets:[e],province:s,category:"All",realm:"All",year:"All"},c=e==="T3",u=((w=i==null?void 0:i.provinceMetrics)==null?void 0:w[s])||sa(Gt(),e,l),d=((I=(k=i==null?void 0:i.provinceFeatures)==null?void 0:k[s])==null?void 0:I.length)??o.reduce((L,N)=>{var j,D;return(j=N.metadata)!=null&&j.isReference?L:L+(((D=N.geojson)==null?void 0:D.features)||[]).filter(H=>H.properties.province===s).length},0),h=c?u.terrestrial_ha||0:((O=u.realmTotals)==null?void 0:O.terrestrial_ha)||0,f=c?u.marine_ha||0:((C=u.realmTotals)==null?void 0:C.marine_ha)||0,p=c?h+f:u.totalAreaHa||0,m=c?(u.gross_terrestrial_ha||0)+(u.gross_marine_ha||0):u.grossAreaHa||0,g=n.terrestrial_ha>0?h/n.terrestrial_ha*100:0,y=n.marine_ha>0?f/n.marine_ha*100:0,v=document.createElement("div");v.className="print-page";const b=`print-map-${e}-${s.replace(/\s+/g,"-")}`,_=(i==null?void 0:i.legendHtml)||ei(o,!0),x=`
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${qt(h)}</span><span class="print-metric-label">Terrestrial (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${qt(f)}</span><span class="print-metric-label">Marine (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${rt(g)}</span><span class="print-metric-label">% National Land</span></div>
      <div class="print-metric"><span class="print-metric-value">${rt(y)}</span><span class="print-metric-label">% National Sea</span></div>
      <div class="print-metric"><span class="print-metric-value">${d.toLocaleString()}</span><span class="print-metric-label">Records</span></div>
      <div class="print-metric"><span class="print-metric-value">${qt(p)}</span><span class="print-metric-label">Total Net (ha)</span></div>
    </div>
  `,E=(u==null?void 0:u.categoryBreakdown)||[];let A="";E.length>0&&(A=`
      <div class="print-detail-table">
        <div class="print-section-title">Category Breakdown</div>
        <table>
          <thead><tr><th>Category</th><th class="r">Area (ha)</th><th class="r">Records</th></tr></thead>
          <tbody>${E.map(N=>{const j=bt(N.category),D=K[N.category]||{label:N.category};return`<tr><td><span class="cat-dot" style="background:${j.fill};border-color:${j.stroke}"></span>${D.label}</td><td class="r">${B(N.area_ha)}</td><td class="r">${N.features}</td></tr>`}).join("")}</tbody>
        </table>
      </div>
    `),o.filter(L=>{var N;return!((N=L.metadata)!=null&&N.isReference)}).map(L=>{var V,et,At,mt;const N=L.metadata||{},j=N.name||L.id,D=((V=K[N.category])==null?void 0:V.label)||N.category||"-",H=L.id||N.name||"unknown",ct=((At=(et=i==null?void 0:i.provinceFeaturesPerLayer)==null?void 0:et[s])==null?void 0:At.get(H))||(((mt=L.geojson)==null?void 0:mt.features)||[]).filter(at=>at.properties.province===s),W=ct.reduce((at,ft)=>{var Ct;return at+(((Ct=ft.properties)==null?void 0:Ct.area_ha)||0)},0);return ct.length===0?"":`<tr><td>${j}</td><td>${D}</td><td class="r">${ct.length}</td><td class="r">${B(W)}</td></tr>`}).filter(Boolean).join("");const G=m>0?((1-p/m)*100).toFixed(1):"0.0",P=`Net area: ${B(p)} ha | Gross area: ${B(m)} ha | Overlap removed: ${G}%`;v.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${da}
          <div>
            <div class="print-title-main">Vanuatu NBSAP GIS Portal</div>
            <div class="print-title-sub">National Biodiversity Strategies and Action Plan</div>
          </div>
        </div>
      </div>
      <div class="print-title-right">
        <div class="print-title-date">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
        <div class="print-title-crs">CRS: EPSG:4326 (WGS 84)</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code">${e}</div>
      <div class="print-target-info">
        <div class="print-target-name">${a.name} &mdash; ${s}</div>
        <div class="print-target-desc">${a.description}</div>
      </div>
    </div>

    ${x}

    <div class="print-map-area">
      <div class="print-map-container" id="${b}"></div>
      <div class="print-map-furniture">
        <div class="print-legend-box">
          <div class="print-legend-title">Legend</div>
          ${_}
        </div>
        <div class="print-north-arrow">
          <svg width="36" height="48" viewBox="0 0 36 48">
            <polygon points="18,2 24,22 18,18 12,22" fill="#333" stroke="#333" stroke-width="0.5"/>
            <polygon points="18,2 12,22 18,18 24,22" fill="#fff" stroke="#333" stroke-width="0.5" opacity="0.4"/>
            <text x="18" y="38" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">N</text>
          </svg>
        </div>
      </div>
    </div>

    <div class="print-summary-line">${P}</div>

    <div class="print-bottom-section">
      ${A}
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString("en-GB")}
      </div>
    </div>
  `,t.appendChild(v);const $=(i==null?void 0:i.expected)||ti(e),S=Fl(e,o,u,$,n,s,i==null?void 0:i.nationalMetrics);return Ol(t,e,a,s,S),i||requestAnimationFrame(()=>{setTimeout(()=>Qa(b,e,o,r.provincesGeojson,s),100)}),b}const Rl={T3:{terrestrial:30,marine:30,label:"30% by 2030 (GBF Target 3)"},T1:{terrestrial:100,marine:100,label:"100% spatial plan coverage (terrestrial & marine)"},T2:{terrestrial:null,marine:null,label:"Map all degraded areas"}},Il=["Torba","Sanma","Penama","Malampa","Shefa","Tafea"];function Bl(t,e,a,s,i){var at,ft,Ct,Ot,jt,J,st,le,Tt,Pt,ce;const r=t==="T3",o=e.filter(tt=>{var it;return!((it=tt.metadata)!=null&&it.isReference)}),n=e.filter(tt=>{var it;return(it=tt.metadata)==null?void 0:it.isReference});new Set(o.map(tt=>{var it;return(it=tt.metadata)==null?void 0:it.category})),new Set(s.map(tt=>tt.category));const l=s.filter(tt=>!o.some(it=>{var va;return((va=it.metadata)==null?void 0:va.category)===tt.category})),c=s.length>0?Math.round((1-l.length/s.length)*100):o.length>0?100:0;let u=0,d=0,h=0,f=0,p=0,m=0;for(const tt of o){const it=tt.metadata||{};u+=((ft=(at=tt.geojson)==null?void 0:at.features)==null?void 0:ft.length)||0,f+=it.validGeometryCount||0,p+=it.fixedCount||0,m+=it.droppedCount||0;for(const va of((Ct=tt.geojson)==null?void 0:Ct.features)||[]){const ya=(Ot=va.geometry)==null?void 0:Ot.type;ya==="Polygon"||ya==="MultiPolygon"?d++:(ya==="Point"||ya==="MultiPoint")&&h++}}const g=u>0?Math.round((u-m)/u*100):100,y=r?a.terrestrial_ha||0:((jt=a.realmTotals)==null?void 0:jt.terrestrial_ha)||0,v=r?a.marine_ha||0:((J=a.realmTotals)==null?void 0:J.marine_ha)||0,b=r?a.gross_terrestrial_ha||0:((st=a.realmTotals)==null?void 0:st.gross_terrestrial_ha)||0,_=r?a.gross_marine_ha||0:((le=a.realmTotals)==null?void 0:le.gross_marine_ha)||0,x=r?y+v:a.totalAreaHa||0,E=r?b+_:a.grossAreaHa||0,A=i.terrestrial_ha>0?y/i.terrestrial_ha*100:0,G=i.marine_ha>0?v/i.marine_ha*100:0,P=E>0?(1-x/E)*100:0,$=E>0?x/E:1,S=(a==null?void 0:a.provinceBreakdown)||[],w=S.filter(tt=>tt.total_ha>0),k=Il.filter(tt=>!S.some(it=>it.province===tt&&it.total_ha>0)),I=S.length>0?S.reduce((tt,it)=>it.total_ha>tt.total_ha?it:tt,S[0]):null,O=w.length>0?w.reduce((tt,it)=>it.total_ha<tt.total_ha?it:tt,w[0]):null,C=(a==null?void 0:a.categoryBreakdown)||[],L=C.length>0?C[0]:null,N=C.length>0&&x>0?C[0].area_ha/x*100:0,j=(a==null?void 0:a.typeBreakdown)||[],D=Rl[t];let H=null;if(D){const tt=D.terrestrial!==null?Math.max(0,D.terrestrial-A):null,it=D.marine!==null?Math.max(0,D.marine-G):null;H={threshold:D,tGap:tt,mGap:it}}let ct,W,V;o.length===0?(ct="No Data",W="#D32F2F",V="cross"):c>=80&&g>=90?(ct="Comprehensive",W="#2E7D32",V="check"):c>=50||o.length>=2?(ct="Moderate",W="#ED6C02",V="partial"):(ct="Minimal",W="#D32F2F",V="warning");const et=[];if(x>0&&et.push(`Total coverage is <strong>${B(x)} ha</strong>, representing <strong>${rt(A)}</strong> of national terrestrial area and <strong>${rt(G)}</strong> of marine area.`),P>5?et.push(`Significant spatial overlap detected: <strong>${P.toFixed(1)}%</strong> of gross area removed during dissolution, indicating overlapping ${((Pt=K[(Tt=C[0])==null?void 0:Tt.category])==null?void 0:Pt.label)||"conservation"} designations.`):P>0&&E>0&&et.push(`Minimal spatial overlap (<strong>${P.toFixed(1)}%</strong>) between layers — most designations occupy distinct areas.`),I&&w.length>1){const tt=x>0?(I.total_ha/x*100).toFixed(0):0;et.push(`<strong>${I.province}</strong> province has the highest coverage (<strong>${B(I.total_ha)} ha</strong>, ${tt}% of target total).`)}k.length>0&&o.length>0&&et.push(`<strong>${k.length}</strong> province(s) have no reported data: ${k.join(", ")}.`),r&&H&&(A>=30?et.push(`Terrestrial 30% target <strong>achieved</strong> at ${rt(A)} coverage.`):et.push(`Terrestrial coverage gap: <strong>${rt(H.tGap)}</strong> remaining to reach 30% target (need additional <strong>${B(H.tGap*i.terrestrial_ha/100)} ha</strong>).`),G>=30?et.push(`Marine 30% target <strong>achieved</strong> at ${rt(G)} coverage.`):et.push(`Marine coverage gap: <strong>${rt(H.mGap)}</strong> remaining to reach 30% target (need additional <strong>${B(H.mGap*i.marine_ha/100)} ha</strong>).`)),L&&C.length>1&&N>60&&et.push(`Coverage is concentrated in <strong>${((ce=K[L.category])==null?void 0:ce.label)||L.category}</strong> (${N.toFixed(0)}% of total), suggesting limited diversity of designation types.`),n.length>0&&et.push(`${n.length} reference dataset${n.length!==1?"s":""} shown for context (not included in area totals).`),h>0&&d>0?et.push(`Dataset contains both polygon (<strong>${d}</strong>) and point (<strong>${h}</strong>) features. Only polygon features contribute to area calculations.`):h>0&&d===0&&et.push(`Dataset contains only point features (<strong>${h}</strong>). Area calculations are not applicable for point data.`);const At=Dl(t,{tPct:A,mPct:G,totalNetArea:x,totalFeatures:u,dataLayers:o,catBreakdown:C,typeBreakdown:j,provincesWithData:w,missingLayers:l}),mt=[];return l.length>0&&mt.push(`Upload missing data layers: ${l.map(tt=>"<strong>"+tt.name+"</strong>").join(", ")}.`),k.length>0&&o.length>0&&mt.push(`Collect and upload spatial data for underrepresented provinces: ${k.join(", ")}.`),g<95&&m>0&&mt.push(`${m} feature(s) had invalid geometries and were dropped. Review source data quality for affected layers.`),p>0&&mt.push(`${p} geometry(s) were automatically repaired. Verify spatial accuracy of corrected features.`),P>20&&mt.push(`High overlap (${P.toFixed(0)}%) suggests potential boundary duplication. Review layer boundaries for redundant designations.`),h>0&&d===0&&mt.push("Convert point observations to polygon coverage areas where feasible to enable area-based reporting."),o.length===0&&mt.push("No data has been uploaded for this target yet. Upload datasets to enable analysis."),{dataLayers:o.length,refLayers:n.length,totalFeatures:u,totalPolygons:d,totalPoints:h,validGeoms:f,fixedGeoms:p,droppedGeoms:m,geomQuality:g,netTerrestrial:y,netMarine:v,grossTerrestrial:b,grossMarine:_,totalNetArea:x,totalGrossArea:E,tPct:A,mPct:G,overlapPct:P,dissolutionFactor:$,dataCompleteness:c,missingLayers:l,provBreakdown:S,provincesWithData:w,provincesWithoutData:k,maxProvince:I,minProvince:O,catBreakdown:C,dominantCategory:L,catConcentration:N,typeBreakdown:j,progressAssessment:H,status:ct,statusColor:W,statusIcon:V,findings:et,insights:At,recommendations:mt}}function Dl(t,e){const a=[];switch(t){case"T1":e.totalNetArea>0&&a.push(`Spatial planning coverage extends to ${rt(e.tPct)} of national land area. Comprehensive spatial plans are essential for effective biodiversity mainstreaming across all development sectors.`),e.catBreakdown.some(s=>s.category==="KBA")&&a.push("Key Biodiversity Areas (KBAs) have been mapped, providing critical context for biodiversity-inclusive spatial planning as required under GBF Target 1.");break;case"T2":if(e.catBreakdown.some(s=>s.category==="DEGRADED")){const s=e.catBreakdown.find(i=>i.category==="DEGRADED");a.push(`Degraded area mapping covers <strong>${B(s.area_ha)} ha</strong>. This baseline is critical for tracking restoration progress under Vanuatu's NBSAP commitments.`)}if(e.catBreakdown.some(s=>s.category==="RESTORATION")){const s=e.catBreakdown.find(i=>i.category==="RESTORATION");a.push(`Active restoration sites total <strong>${B(s.area_ha)} ha</strong>, contributing to the 30% ecosystem restoration goal.`)}e.catBreakdown.some(s=>s.category==="DEGRADED")||a.push("No degraded area mapping data available. Baseline degradation mapping is a prerequisite for planning effective restoration activities.");break;case"T3":{const s=Math.max(0,30-e.tPct),i=Math.max(0,30-e.mPct);if(e.tPct>=30&&e.mPct>=30)a.push("Vanuatu has achieved the GBF 30x30 target for both terrestrial and marine realms. Overlapping areas have been merged to prevent double-counting.");else{const n=[];s>0&&n.push(`terrestrial (${rt(s)} remaining)`),i>0&&n.push(`marine (${rt(i)} remaining)`),a.push(`Progress toward the 30x30 target shows gaps in ${n.join(" and ")}. Expansion of Community Conserved Areas (CCAs) and Locally Managed Marine Areas (LMMAs) represents the most culturally appropriate pathway for Vanuatu.`)}const r=e.catBreakdown.find(n=>n.category==="CCA"),o=e.catBreakdown.find(n=>n.category==="LMMA");if(r||o){const n=[];r&&n.push(`CCAs: ${B(r.area_ha)} ha`),o&&n.push(`LMMAs: ${B(o.area_ha)} ha`),a.push(`Community-based conservation is the primary mechanism: ${n.join("; ")}. These customary management areas reflect Vanuatu's unique governance structure.`)}break}case"T4":if(e.typeBreakdown.length>0){a.push(`Species distribution data covers <strong>${e.typeBreakdown.length}</strong> distinct species/taxa across <strong>${e.totalFeatures}</strong> observation records.`);const s=e.typeBreakdown.slice(0,4).map(i=>i.type).join(", ");a.push(`Mapped species include: ${s}${e.typeBreakdown.length>4?`, and ${e.typeBreakdown.length-4} more`:""}.`)}if(e.missingLayers.length>0){const s=e.missingLayers.map(i=>i.name).join(", ");a.push(`Distribution data is still needed for: ${s}. Complete species mapping is essential for effective conservation planning.`)}break;case"T6":{const s=[{cat:"MERREMIA",name:"Merremia peltata (Big Leaf)",desc:"This invasive vine is one of the most significant threats to Vanuatu's native forest ecosystems, smothering canopy trees and preventing regeneration."},{cat:"CROWN_OF_THORNS",name:"Crown of Thorns Starfish (Acanthaster planci)",desc:"Outbreaks cause devastating coral mortality across reef systems, threatening marine biodiversity and coastal livelihoods."},{cat:"MILE_A_MINUTE",name:"Mile a Minute Vine (Mikania micrantha)",desc:"A fast-growing tropical vine that forms dense mats over native vegetation, blocking sunlight and causing dieback of native species."},{cat:"SOLANUM_TORVUM",name:"Solanum torvum (Devil Fig)",desc:"A woody invasive shrub that colonises disturbed land, pastures and forest margins, displacing native undergrowth and reducing agricultural productivity."}],i=[];for(const o of s){const n=e.catBreakdown.find(l=>l.category===o.cat);n&&(i.push(o.name),a.push(`<strong>${o.name}</strong> covers <strong>${B(n.area_ha)} ha</strong> across ${n.features} feature(s). ${o.desc}`))}const r=e.catBreakdown.find(o=>o.category==="INVASIVE");if(r&&a.push(`Other invasive alien species collectively cover <strong>${B(r.area_ha)} ha</strong> (${r.features} features), including Fire Ants, African Snail, Sako, and Coconut Beetle.`),e.totalNetArea>0&&a.push(`Total IAS-affected area: <strong>${B(e.totalNetArea)} ha</strong> (${rt(e.tPct)} of national terrestrial area). ${i.length} of 4 priority species mapped. Spatial analysis of IAS distribution is critical for prioritising eradication and management interventions.`),e.missingLayers.length>0){const o=e.missingLayers.map(n=>n.name).join(", ");a.push(`Data gaps remain for: ${o}. Complete coverage mapping for all priority IAS is needed for national management planning.`)}break}case"T7":e.totalNetArea>0?a.push(`Pesticide and herbicide use areas cover <strong>${B(e.totalNetArea)} ha</strong>. This mapping supports biodiversity risk assessment for agricultural chemical impacts on adjacent ecosystems.`):a.push("No pesticide/herbicide mapping data available. Systematic mapping of chemical use areas is needed to assess biodiversity impacts from agricultural practices.");break;case"T8":e.totalNetArea>0?a.push(`Coastal eutrophication zones cover <strong>${B(e.totalNetArea)} ha</strong> of marine area. Nutrient pollution monitoring is critical for coral reef health and marine biodiversity in Vanuatu.`):a.push("No coastal eutrophication data available. Establishing water quality monitoring stations at key coastal sites would enable systematic tracking of nutrient impacts.");break;case"T10":if(e.typeBreakdown.length>0){a.push(`Land cover classification includes <strong>${e.typeBreakdown.length}</strong> distinct land use types.`);const s=e.typeBreakdown.slice(0,3).map(i=>`${i.type} (${B(i.area_ha)} ha)`).join(", ");a.push(`Dominant land cover types: ${s}.`)}e.provincesWithData.length>0&&e.provincesWithData.length<6&&a.push(`Land cover data is available for ${e.provincesWithData.length} of 6 provinces. Complete national coverage is needed for comprehensive agricultural and land use change analysis.`);break;case"T12":e.totalNetArea>0&&a.push(`Blue and green space mapping covers <strong>${B(e.totalNetArea)} ha</strong>. These spaces are vital for urban biodiversity, community wellbeing, and climate resilience.`),e.provincesWithData.length>0&&a.push(`Green space data available for ${e.provincesWithData.map(s=>s.province).join(", ")}. Expansion of urban green infrastructure should be prioritised in all provincial capitals.`);break;default:e.totalNetArea>0&&a.push(`Total coverage for this target is <strong>${B(e.totalNetArea)} ha</strong> across ${e.dataLayers.length} data layer(s).`)}return a}function Fl(t,e,a,s,i,r,o){var D,H,ct,W,V,et,At,mt,at,ft,Ct,Ot,jt;const n=t==="T3",l=e.filter(J=>{var st;return!((st=J.metadata)!=null&&st.isReference)}),c=e.filter(J=>{var st;return(st=J.metadata)==null?void 0:st.isReference});let u=0,d=0,h=0;const f=new Set,p={};for(const J of l){const st=((D=J.metadata)==null?void 0:D.category)||"OTHER",le=(((H=J.geojson)==null?void 0:H.features)||[]).filter(Tt=>{var Pt;return((Pt=Tt.properties)==null?void 0:Pt.province)===r});le.length>0&&f.add(st);for(const Tt of le){u++;const Pt=(ct=Tt.geometry)==null?void 0:ct.type;Pt==="Polygon"||Pt==="MultiPolygon"?d++:(Pt==="Point"||Pt==="MultiPoint")&&h++;const ce=((W=Tt.properties)==null?void 0:W.type)||((V=Tt.properties)==null?void 0:V.species_name)||((et=Tt.properties)==null?void 0:et.name)||((At=J.metadata)==null?void 0:At.name)||"Unknown";p[ce]||(p[ce]={area_ha:0,features:0}),p[ce].area_ha+=((mt=Tt.properties)==null?void 0:mt.area_ha)||0,p[ce].features++}}const m=n?a.terrestrial_ha||0:((at=a.realmTotals)==null?void 0:at.terrestrial_ha)||0,g=n?a.marine_ha||0:((ft=a.realmTotals)==null?void 0:ft.marine_ha)||0,y=n?a.gross_terrestrial_ha||0:((Ct=a.realmTotals)==null?void 0:Ct.gross_terrestrial_ha)||0,v=n?a.gross_marine_ha||0:((Ot=a.realmTotals)==null?void 0:Ot.gross_marine_ha)||0,b=n?m+g:a.totalAreaHa||0,_=n?y+v:a.grossAreaHa||0,x=i.terrestrial_ha>0?m/i.terrestrial_ha*100:0,E=i.marine_ha>0?g/i.marine_ha*100:0,A=_>0?(1-b/_)*100:0,G=(a==null?void 0:a.categoryBreakdown)||[],P=Object.entries(p).map(([J,st])=>({type:J,...st})).sort((J,st)=>st.area_ha-J.area_ha),$=s.filter(J=>!f.has(J.category)),S=s.length>0?Math.round((1-$.length/s.length)*100):u>0?100:0,w=o||(()=>{const J={targets:[t],province:"All",category:"All",realm:"All",year:"All"};return sa(Gt(),t,J)})(),k=n?(w.terrestrial_ha||0)+(w.marine_ha||0):w.totalAreaHa||0,I=k>0?b/k*100:0;let O,C;u===0?(O="No Data",C="#D32F2F"):S>=80?(O="Comprehensive",C="#2E7D32"):S>=40||f.size>=2?(O="Moderate",C="#ED6C02"):(O="Minimal",C="#D32F2F");const L=[];if(b>0&&L.push(`${r} province contributes <strong>${B(b)} ha</strong> to ${t}, representing <strong>${I.toFixed(1)}%</strong> of the national total for this target.`),m>0&&L.push(`Terrestrial coverage: <strong>${B(m)} ha</strong> (${rt(x)} of national terrestrial baseline).`),g>0&&L.push(`Marine coverage: <strong>${B(g)} ha</strong> (${rt(E)} of national marine baseline).`),A>5&&L.push(`Spatial overlap of <strong>${A.toFixed(1)}%</strong> detected between overlapping designations within ${r}.`),G.length>1){const J=G[0],st=((jt=K[J.category])==null?void 0:jt.label)||J.category;L.push(`Dominant designation type: <strong>${st}</strong> (${B(J.area_ha)} ha, ${b>0?(J.area_ha/b*100).toFixed(0):0}% of province total).`)}u===0&&L.push(`No geospatial data has been uploaded for ${r} province under ${t}. This represents a significant data gap.`);const N=[];if(n)b>0&&N.push(`Conservation areas in ${r} include ${G.map(J=>{var st;return((st=K[J.category])==null?void 0:st.label)||J.category}).join(", ")}. ${r}'s contribution to the 30x30 target should be assessed in the context of its total land and sea area.`),N.push(`Community-based conservation (CCAs, LMMAs) is the primary conservation mechanism in Vanuatu. Engaging local communities in ${r} is essential for expanding and maintaining conservation areas.`);else if(t==="T6")u>0?N.push(`Invasive species data in ${r} covers ${u} features across ${f.size} IAS category(s). Prioritise management interventions in areas adjacent to native forest and reef ecosystems.`):N.push(`No invasive species data available for ${r}. Field surveys should be prioritised to assess IAS presence and distribution in this province.`);else if(t==="T4")u>0&&N.push(`Species distribution records in ${r}: ${u} observations across ${P.length} taxa. Island-specific surveys are important for capturing Vanuatu's high endemism.`);else if(t==="T10"){if(P.length>0){const J=P.slice(0,3).map(st=>`${st.type} (${B(st.area_ha)} ha)`).join(", ");N.push(`Land cover in ${r} is dominated by: ${J}. Change detection analysis should focus on forest-to-agriculture conversion and urban expansion.`)}}else b>0&&N.push(`${r} has active data submissions for ${t}. Continued monitoring and data updates will strengthen provincial-level tracking for this NBSAP target.`);const j=[];return $.length>0&&u>0&&j.push(`Upload missing data for ${r}: ${$.map(J=>"<strong>"+J.name+"</strong>").join(", ")}.`),u===0&&j.push(`Prioritise data collection for ${r} to enable provincial-level assessment and reporting for ${t}.`),I>0&&I<5&&k>0&&j.push(`${r} currently contributes only ${I.toFixed(1)}% of the national total. Investigate whether this reflects actual low coverage or a data gap.`),{provinceName:r,totalFeatures:u,totalPolygons:d,totalPoints:h,netTerrestrial:m,netMarine:g,totalNetArea:b,totalGrossArea:_,tPct:x,mPct:E,overlapPct:A,catBreakdown:G,typeBreakdown:P,dataCompleteness:S,missingLayers:$,categoriesPresent:f.size,nationalNetArea:k,provinceSharePct:I,status:O,statusColor:C,findings:L,insights:N,recommendations:j,dataLayers:l.length,refLayers:c.length}}function Ol(t,e,a,s,i){const r=document.createElement("div");r.className="print-page print-analysis-page";const o=gt.nationalBaselines,n=ql(e),l={Comprehensive:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',Moderate:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',Minimal:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',"No Data":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'},c=[{label:"Terrestrial (net)",value:B(i.netTerrestrial)+" ha",pct:rt(i.tPct)},{label:"Marine (net)",value:B(i.netMarine)+" ha",pct:rt(i.mPct)},{label:"Total Area",value:B(i.totalNetArea)+" ha",pct:""},{label:"Total gross (sum)",value:B(i.totalGrossArea)+" ha",pct:""},{label:"Share of national total",value:i.provinceSharePct.toFixed(1)+"%",pct:""},{label:"Overlap removed",value:i.overlapPct.toFixed(1)+"%",pct:""}],u=i.catBreakdown.map(p=>{var v;const m=bt(p.category),g=((v=K[p.category])==null?void 0:v.label)||p.category,y=i.totalNetArea>0?(p.area_ha/i.totalNetArea*100).toFixed(1):"0.0";return`<tr><td><span class="cat-dot" style="background:${m.fill};border-color:${m.stroke}"></span>${g}</td><td class="r">${B(p.area_ha)}</td><td class="r">${y}%</td><td class="r">${p.features}</td></tr>`}).join("");let d="";if(i.typeBreakdown.length>1){const p=i.typeBreakdown.slice(0,8).map(g=>{const y=i.totalGrossArea>0?(g.area_ha/i.totalGrossArea*100).toFixed(1):"0.0";return`<tr><td>${g.type}</td><td class="r">${B(g.area_ha)}</td><td class="r">${y}%</td><td class="r">${g.features}</td></tr>`}).join("");d=`
      <div class="analysis-card">
        <div class="analysis-card-title">${e==="T10"?"Land Cover Types":e==="T4"?"Species Observed":e==="T6"?"IAS Species":"Type Breakdown"} &mdash; ${s}</div>
        <table class="analysis-table">
          <thead><tr><th>${e==="T4"?"Species":"Type"}</th><th class="r">Area (ha)</th><th class="r">%</th><th class="r">Records</th></tr></thead>
          <tbody>${p}</tbody>
        </table>
      </div>
    `}let h="";if(e==="T3"){const p=Math.min(100,i.tPct/30*100),m=Math.min(100,i.mPct/30*100),g=Math.max(0,30-i.tPct),y=Math.max(0,30-i.mPct);h=`
      <div class="analysis-card">
        <div class="analysis-card-title">30x30 Contribution &mdash; ${s}</div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Terrestrial: <strong>${rt(i.tPct)}</strong> of national baseline</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${p}%;background:${i.tPct>=30?"#2E7D32":"#006B3F"}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${i.tPct>=30?"Provincial contribution exceeds 30% threshold":`National gap: ${B(g*o.terrestrial_ha/100)} ha still needed`}</div>
        </div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Marine: <strong>${rt(i.mPct)}</strong> of national baseline</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${m}%;background:${i.mPct>=30?"#2E7D32":"#0072BC"}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${i.mPct>=30?"Provincial contribution exceeds 30% threshold":`National gap: ${B(y*o.marine_ha/100)} ha still needed`}</div>
        </div>
      </div>
    `}i.missingLayers.length>0&&i.missingLayers.map(p=>`<div class="analysis-gap-item"><span class="analysis-gap-dot"></span>${p.name}</div>`).join("");const f=i.dataCompleteness>=80?"#2E7D32":i.dataCompleteness>=50?"#ED6C02":"#D32F2F";n.proposedActions.slice(0,4).map((p,m)=>`<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F"><strong>${m+1}.</strong></span><span>${p}</span></div>`).join(""),r.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${da}
          <div>
            <div class="print-title-main">Vanuatu NBSAP GIS Portal</div>
            <div class="print-title-sub">National Biodiversity Strategies and Action Plan</div>
          </div>
        </div>
      </div>
      <div class="print-title-right">
        <div class="print-title-date">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
        <div class="print-title-crs">Provincial Analysis Report</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code">${e}</div>
      <div class="print-target-info">
        <div class="print-target-name">${a.name} &mdash; ${s} Province Analysis</div>
        <div class="print-target-desc">${a.description}</div>
      </div>
      <div class="analysis-status-badge" style="background:${i.statusColor}">
        ${l[i.status]||""} ${i.status}
      </div>
    </div>

    <div class="analysis-layout">
      <div class="analysis-col-left">
        <div class="analysis-card analysis-card-highlight">
          <div class="analysis-card-title">Coverage Assessment &mdash; ${s}</div>
          <table class="analysis-table">
            <thead><tr><th>Metric</th><th class="r">Value</th><th class="r">% National</th></tr></thead>
            <tbody>
              ${c.map(p=>`<tr><td>${p.label}</td><td class="r">${p.value}</td><td class="r">${p.pct}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>

        ${h}

        <div class="analysis-card">
          <div class="analysis-card-title">Category Composition &mdash; ${s}</div>
          ${i.catBreakdown.length>0?`
            <table class="analysis-table">
              <thead><tr><th>Category</th><th class="r">Net Area (ha)</th><th class="r">% Total</th><th class="r">Records</th></tr></thead>
              <tbody>${u}</tbody>
            </table>
          `:'<div style="color:#999;font-size:8px">No category data for this province</div>'}
        </div>

        ${d}
      </div>

      <div class="analysis-col-right">
        <div class="analysis-card analysis-card-highlight">
          <div class="analysis-card-title">Provincial Assessment</div>
          <div class="analysis-assessment">
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Status</span>
              <span class="analysis-assess-value" style="color:${i.statusColor};font-weight:700">${i.status}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Data Completeness</span>
              <div style="display:flex;align-items:center;gap:6px;flex:1">
                <div class="analysis-comp-track"><div class="analysis-comp-fill" style="width:${i.dataCompleteness}%;background:${f}"></div></div>
                <span class="analysis-assess-value" style="color:${f}">${i.dataCompleteness}%</span>
              </div>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Records</span>
              <span class="analysis-assess-value">${i.totalFeatures.toLocaleString()}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Categories</span>
              <span class="analysis-assess-value">${i.categoriesPresent}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">National Share</span>
              <span class="analysis-assess-value">${i.provinceSharePct.toFixed(1)}% of target total</span>
            </div>
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Key Findings</div>
          <div class="analysis-findings">
            ${i.findings.length>0?i.findings.map(p=>`<div class="analysis-finding-item"><span class="analysis-bullet">&#9654;</span><span>${p}</span></div>`).join(""):'<div style="color:#999;font-size:8px">No data available for analysis</div>'}
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Provincial Insights</div>
          <div class="analysis-findings">
            ${i.insights.length>0?i.insights.map(p=>`<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F">&#9679;</span><span>${p}</span></div>`).join(""):'<div style="color:#999;font-size:8px">Upload data to generate provincial insights</div>'}
          </div>
        </div>
      </div>
    </div>

    <div class="analysis-methodology">
      <strong>Note:</strong> Overlapping areas have been merged to avoid double-counting.
      National baselines: Terrestrial ${B(o.terrestrial_ha)} ha; Marine ${B(o.marine_ha)} ha.
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Generated: ${new Date().toLocaleString("en-GB")} &bull; Provincial Analysis &bull; ${s}
      </div>
    </div>
  `,t.appendChild(r)}function jl(t,e,a,s){const i=document.createElement("div");i.className="print-page print-analysis-page";const r=gt.nationalBaselines,o={check:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',partial:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',warning:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',cross:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'},n=s.provBreakdown.length>0?Math.max(...s.provBreakdown.map(p=>p.total_ha)):1,l=s.provBreakdown.length>0?s.provBreakdown.map(p=>{const m=n>0?Math.max(2,p.total_ha/n*100):0;return`<div class="analysis-prov-row">
          <span class="analysis-prov-name">${p.province}</span>
          <div class="analysis-prov-bar-bg">
            <div class="analysis-prov-bar" style="width:${m}%"></div>
          </div>
          <span class="analysis-prov-val">${qt(p.total_ha)} ha</span>
        </div>`}).join(""):'<div style="color:#999;font-size:8px;padding:4px 0">No provincial data available</div>',c=s.dataCompleteness>=80?"#2E7D32":s.dataCompleteness>=50?"#ED6C02":"#D32F2F",u=[{label:"Terrestrial",value:B(s.netTerrestrial)+" ha",pct:rt(s.tPct)},{label:"Marine",value:B(s.netMarine)+" ha",pct:rt(s.mPct)},{label:"Total Area",value:B(s.totalNetArea)+" ha",pct:""}],d=s.catBreakdown.map(p=>{var v;const m=bt(p.category),g=((v=K[p.category])==null?void 0:v.label)||p.category,y=s.totalNetArea>0?(p.area_ha/s.totalNetArea*100).toFixed(1):"0.0";return`<tr>
      <td><span class="cat-dot" style="background:${m.fill};border-color:${m.stroke}"></span>${g}</td>
      <td class="r">${B(p.area_ha)}</td>
      <td class="r">${y}%</td>
      <td class="r">${p.features}</td>
    </tr>`}).join("");s.missingLayers.length>0&&s.missingLayers.map(p=>{var m;return`<div class="analysis-gap-item"><span class="analysis-gap-dot"></span>${p.name} <span style="color:#999">(${((m=K[p.category])==null?void 0:m.label)||p.category})</span></div>`}).join("");let h="";if(s.progressAssessment&&e==="T3"){const{tGap:p,mGap:m}=s.progressAssessment,g=Math.min(100,s.tPct/30*100),y=Math.min(100,s.mPct/30*100);h=`
      <div class="analysis-card">
        <div class="analysis-card-title">30x30 Target Progress</div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Terrestrial: <strong>${rt(s.tPct)}</strong> of 30% target</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${g}%;background:${s.tPct>=30?"#2E7D32":"#006B3F"}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${s.tPct>=30?"Target achieved":`Gap: ${B(p*r.terrestrial_ha/100)} ha needed`}</div>
        </div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Marine: <strong>${rt(s.mPct)}</strong> of 30% target</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${y}%;background:${s.mPct>=30?"#2E7D32":"#0072BC"}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${s.mPct>=30?"Target achieved":`Gap: ${B(m*r.marine_ha/100)} ha needed`}</div>
        </div>
      </div>
    `}let f="";if(s.typeBreakdown.length>1){const p=s.typeBreakdown.slice(0,10).map(m=>{const g=s.totalGrossArea>0?(m.area_ha/s.totalGrossArea*100).toFixed(1):"0.0";return`<tr><td>${m.type}</td><td class="r">${B(m.area_ha)}</td><td class="r">${g}%</td><td class="r">${m.features}</td></tr>`}).join("");f=`
      <div class="analysis-card">
        <div class="analysis-card-title">${e==="T10"?"Land Cover Types":e==="T4"?"Species Distribution":"Type Breakdown"}</div>
        <table class="analysis-table">
          <thead><tr><th>${e==="T4"?"Species":"Type"}</th><th class="r">Area (ha)</th><th class="r">% Total</th><th class="r">Records</th></tr></thead>
          <tbody>${p}</tbody>
        </table>
        ${s.typeBreakdown.length>10?`<div style="font-size:7px;color:#999;margin-top:2px">Showing top 10 of ${s.typeBreakdown.length} types</div>`:""}
      </div>
    `}i.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${da}
          <div>
            <div class="print-title-main">Vanuatu NBSAP GIS Portal</div>
            <div class="print-title-sub">National Biodiversity Strategies and Action Plan</div>
          </div>
        </div>
      </div>
      <div class="print-title-right">
        <div class="print-title-date">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
        <div class="print-title-crs">Comprehensive Analysis Report</div>
      </div>
    </div>

    <div class="print-target-bar">
      <div class="print-target-code">${e}</div>
      <div class="print-target-info">
        <div class="print-target-name">${a.name} &mdash; Analysis Results</div>
        <div class="print-target-desc">${a.description}</div>
      </div>
      <div class="analysis-status-badge" style="background:${s.statusColor}">
        ${o[s.statusIcon]||""} ${s.status}
      </div>
    </div>

    <div class="analysis-layout">
      <div class="analysis-col-left">
        <div class="analysis-card">
          <div class="analysis-card-title">Coverage Assessment</div>
          <table class="analysis-table">
            <thead><tr><th>Metric</th><th class="r">Area</th><th class="r">% National</th></tr></thead>
            <tbody>
              ${u.map(p=>`<tr><td>${p.label}</td><td class="r">${p.value}</td><td class="r">${p.pct}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>

        ${h}

        <div class="analysis-card">
          <div class="analysis-card-title">Provincial Distribution</div>
          <div class="analysis-prov-chart">
            ${l}
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Category Composition</div>
          ${s.catBreakdown.length>0?`
            <table class="analysis-table">
              <thead><tr><th>Category</th><th class="r">Net Area (ha)</th><th class="r">% Total</th><th class="r">Records</th></tr></thead>
              <tbody>${d}</tbody>
            </table>
          `:'<div style="color:#999;font-size:8px">No category data available</div>'}
        </div>

        ${f}
      </div>

      <div class="analysis-col-right">
        <div class="analysis-card analysis-card-highlight">
          <div class="analysis-card-title">Overall Assessment</div>
          <div class="analysis-assessment">
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Status</span>
              <span class="analysis-assess-value" style="color:${s.statusColor};font-weight:700">${s.status}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Data Completeness</span>
              <div style="display:flex;align-items:center;gap:6px;flex:1">
                <div class="analysis-comp-track"><div class="analysis-comp-fill" style="width:${s.dataCompleteness}%;background:${c}"></div></div>
                <span class="analysis-assess-value" style="color:${c}">${s.dataCompleteness}%</span>
              </div>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Datasets</span>
              <span class="analysis-assess-value">${s.dataLayers}</span>
            </div>
            <div class="analysis-assess-row">
              <span class="analysis-assess-label">Records</span>
              <span class="analysis-assess-value">${s.totalFeatures.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Key Findings</div>
          <div class="analysis-findings">
            ${s.findings.length>0?s.findings.map(p=>`<div class="analysis-finding-item"><span class="analysis-bullet">&#9654;</span><span>${p}</span></div>`).join(""):'<div style="color:#999;font-size:8px">No data available for analysis</div>'}
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Target-Specific Insights</div>
          <div class="analysis-findings">
            ${s.insights.length>0?s.insights.map(p=>`<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F">&#9679;</span><span>${p}</span></div>`).join(""):'<div style="color:#999;font-size:8px">Upload data to generate target-specific insights</div>'}
          </div>
        </div>
      </div>
    </div>

    <div class="analysis-methodology">
      <strong>Note:</strong> Overlapping areas have been merged to avoid double-counting.
      National baselines: Terrestrial ${B(r.terrestrial_ha)} ha; Marine ${B(r.marine_ha)} ha.
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Generated: ${new Date().toLocaleString("en-GB")}
      </div>
    </div>
  `,t.appendChild(i)}function ql(t){return{T1:{feasibility:"High — Provincial and municipal planning boundaries are well-defined. Existing cadastral, environmental impact assessment (EIA), and provincial development plans provide a strong foundation. Integration with CCA boundary zones is operationally feasible.",clarity:"Clear — Target is well-defined with measurable spatial outputs: percentage of land and sea area under biodiversity-inclusive plans.",dataRequirements:["Provincial physical/development plans (shapefiles or digitised boundaries)","Municipal area boundaries and zoning maps","CCA boundary zone polygons","Marine spatial planning zones (where available)","Key Biodiversity Areas (KBA) boundaries for overlay analysis"],nationalSources:[{name:"Department of Local Authorities — Provincial Physical Plans",type:"Polygon",status:"Available (requires digitisation)",desc:"Provincial and municipal development plans with land use zones"},{name:"DEPC — Environmental Impact Assessment database",type:"Point/Polygon",status:"Partial",desc:"EIA locations and assessed areas"},{name:"Vanuatu National Statistics Office — Census boundaries",type:"Polygon",status:"Available",desc:"Administrative boundaries for spatial planning context"}],globalSources:[{name:"BirdLife / KBA Partnership — Key Biodiversity Areas",type:"Polygon",status:"Available",desc:"Internationally recognised sites of global importance for biodiversity"},{name:"UN-Habitat — National Urban Policies database",type:"Reference",status:"Available",desc:"Urban planning frameworks and policy documents"},{name:"UNEP-WCMC — Protected Planet (WDPA)",type:"Polygon",status:"Available",desc:"For cross-referencing spatial plans with existing protected areas"}],proposedActions:["Digitise all six provincial physical/development plans into GIS format (priority: Shefa, Sanma)","Overlay KBA boundaries with existing spatial plans to identify biodiversity gaps in planning","Develop marine spatial planning zones for coastal provinces (Torba, Sanma, Shefa)","Integrate CCA boundary zones into provincial spatial planning frameworks","Establish annual GIS update cycle for spatial plan monitoring"],revisions:["Expand target scope to explicitly include marine spatial planning alongside terrestrial plans","Add indicator for proportion of KBAs covered by spatial plans","Include climate vulnerability overlay in spatial planning data requirements"]},T2:{feasibility:"Moderate — Degradation mapping requires remote sensing analysis (satellite imagery change detection). Restoration site mapping relies on field survey data from DEPC and NGO partners. Technical capacity for remote sensing analysis may need strengthening.",clarity:'Moderate — Target references "degraded areas" without specifying degradation criteria or thresholds. Operational definitions needed for consistent mapping.',dataRequirements:["Satellite imagery time series (Sentinel-2, Landsat) for change detection","Field survey data on degraded terrestrial and marine ecosystems","Restoration project locations and boundaries","Baseline land cover / vegetation maps for comparison","Coral reef health assessment data"],nationalSources:[{name:"DEPC — Ecosystem health monitoring reports",type:"Report/Point",status:"Partial",desc:"Field assessments of ecosystem condition at specific sites"},{name:"Department of Forests — Forest inventory data",type:"Polygon",status:"Available",desc:"Forest cover assessments and logging concession areas"},{name:"Fisheries Department — Reef monitoring data",type:"Point",status:"Partial",desc:"Coral reef health survey points and assessments"}],globalSources:[{name:"Global Forest Watch (WRI) — Forest loss/gain layers",type:"Raster",status:"Available",desc:"Annual tree cover loss and gain at 30m resolution (Hansen et al.)"},{name:"Allen Coral Atlas — Coral reef maps",type:"Polygon",status:"Available",desc:"High-resolution benthic and geomorphic maps of coral reefs"},{name:"UNEP — World Environment Situation Room",type:"Raster/Vector",status:"Available",desc:"Environmental indicators and degradation indices"},{name:"ESA Climate Change Initiative — Land cover",type:"Raster",status:"Available",desc:"Global land cover time series at 300m resolution"}],proposedActions:["Conduct national satellite-based degradation assessment using Sentinel-2 change detection (2015–2025)","Map degraded coral reef areas using Allen Coral Atlas combined with local reef monitoring data","Establish degradation criteria and thresholds for consistent national mapping","Create a restoration project register with spatial boundaries for all active/planned sites","Integrate Global Forest Watch data for forest degradation baseline"],revisions:["Define clear degradation criteria (e.g., canopy loss >30%, reef health index <3)","Add quantitative restoration targets (hectares per province per year)","Include inland water ecosystem degradation explicitly"]},T3:{feasibility:"High — Vanuatu has a strong tradition of community-based conservation (Custom Tabu Areas, CCAs, LMMAs). Boundary mapping is operationally feasible through community participatory mapping. WDPA provides baseline for formal protected areas.",clarity:"High — Target is well-defined under GBF: 30% of terrestrial and 30% of marine areas effectively conserved by 2030. Clear, measurable indicators.",dataRequirements:["Community Conserved Area (CCA/Tabu) boundaries — all provinces","Marine Protected Area (MPA) boundaries — gazetted and proposed","Locally Managed Marine Area (LMMA) boundaries","World Database on Protected Areas (WDPA) records for Vanuatu","OECM (Other Effective Conservation Measures) boundaries"],nationalSources:[{name:"DEPC — Community Conservation Area register",type:"Polygon",status:"Partial",desc:"CCA and Tabu area boundaries from community participatory mapping"},{name:"DEPC — Protected Areas database",type:"Polygon",status:"Available",desc:"Nationally gazetted protected areas and management zones"},{name:"Vanuatu Fisheries Department — LMMA register",type:"Polygon",status:"Partial",desc:"Locally managed marine areas registered with fisheries authorities"},{name:"Provincial Government offices — Tabu area records",type:"Polygon/Tabular",status:"Incomplete",desc:"Custom Tabu area records held at provincial level"}],globalSources:[{name:"UNEP-WCMC — Protected Planet (WDPA)",type:"Polygon",status:"Available",desc:"Global database of protected areas — Vanuatu records"},{name:"UNEP-WCMC — World Database on OECMs",type:"Polygon",status:"Available",desc:"Other effective area-based conservation measures"},{name:"Blue Ventures / WCS — LMMA Network Pacific",type:"Polygon",status:"Available",desc:"Pacific LMMA network mapping data"},{name:"BirdLife / KBA Partnership — KBAs",type:"Polygon",status:"Available",desc:"For identifying priority areas for new conservation designations"}],proposedActions:["Complete participatory boundary mapping for all registered CCAs across six provinces","Update WDPA submissions for Vanuatu with latest CCA/MPA boundaries","Digitise and verify all LMMA boundaries in collaboration with Fisheries Department","Conduct gap analysis: overlay current protection with KBAs to identify priority expansion areas","Develop standardised area calculation methodology for official 30x30 reporting","Establish annual reporting cycle for conservation area changes"],revisions:["Include explicit recognition of Custom Tabu Areas as OECMs in national reporting","Add management effectiveness indicators alongside area-based targets","Set provincial sub-targets to ensure equitable distribution of conservation across all provinces"]},T4:{feasibility:"Moderate — Species distribution mapping requires systematic field surveys and expert identification. Some species (Megapode, Starling) have existing survey data; others (Plerandra) have very limited baseline data.",clarity:"Clear — Target specifies six priority species and KBAs. Distribution mapping is a standard conservation planning output.",dataRequirements:["Vanuatu Megapode (Megapodius layardi) — nesting sites and range polygons","Mountain Starling (Aplonis santovestris) — observation records and modelled range","Streaked Fantail (Rhipidura spilodera) — observation records and habitat range","Vanuatu Kingfisher (Todiramphus farquhari) — island-level distribution","Flying Fox (Pteropus anetianus) — roost sites and foraging range","Plerandra vanuatuensis — known populations and habitat suitability model"],nationalSources:[{name:"DEPC — National biodiversity database",type:"Point/Polygon",status:"Partial",desc:"Species observation records from government monitoring programmes"},{name:"Vanuatu Environment Science Society (VESS)",type:"Point",status:"Partial",desc:"Citizen science and research observation records"},{name:"National Herbarium — Plant collections",type:"Point",status:"Available",desc:"Herbarium specimen records for Plerandra and other endemic plants"}],globalSources:[{name:"GBIF — Global Biodiversity Information Facility",type:"Point",status:"Available",desc:"Aggregated species occurrence records from museums, surveys, and citizen science"},{name:"IUCN Red List — Species range maps",type:"Polygon",status:"Available",desc:"Expert-assessed range maps for listed species"},{name:"eBird / Cornell Lab — Bird observations",type:"Point",status:"Available",desc:"Citizen science bird observation records for Vanuatu"},{name:"BirdLife International — Important Bird Areas",type:"Polygon",status:"Available",desc:"IBA boundaries relevant to endemic bird species"}],proposedActions:["Compile all existing species observation records into a national spatial biodiversity database","Conduct targeted field surveys for Mountain Starling and Plerandra in under-sampled islands","Generate species distribution models (MaxEnt) using GBIF + local records for all six priority species","Map critical habitat for each species and overlay with existing conservation areas","Integrate eBird and GBIF data as reference layers for cross-validation"],revisions:["Add population trend indicators alongside distribution mapping","Include marine species (sea turtles, dugong) for comprehensive biodiversity assessment","Set explicit targets for species monitoring frequency and coverage"]},T6:{feasibility:"High — Invasive species are visible and mappable through remote sensing (Merremia, Mile a Minute) and field surveys (Solanum, Crown of Thorns). Drone and satellite imagery can detect vine coverage. Community reporting networks can support data collection.",clarity:"Clear — Target specifies key IAS and requires total coverage (ha) and distribution mapping. Measurable and achievable with available technology.",dataRequirements:["Merremia peltata (Big Leaf) — remote sensing detections and field survey polygons","Crown of Thorns Starfish (Acanthaster planci) — reef outbreak locations and affected areas","Mile a Minute Vine (Mikania micrantha) — coverage polygons from field/remote sensing","Solanum torvum (Devil Fig) — infestation area boundaries from field surveys","Other IAS: Fire Ants, African Snail, Sako, Coconut Beetle — occurrence points and affected areas"],nationalSources:[{name:"DEPC — Invasive species monitoring programme",type:"Point/Polygon",status:"Partial",desc:"Field survey records and management intervention sites"},{name:"Department of Agriculture — Pest control records",type:"Point",status:"Partial",desc:"Agricultural pest reporting and control intervention locations"},{name:"Fisheries Department — Crown of Thorns monitoring",type:"Point",status:"Partial",desc:"Reef monitoring stations tracking COTS outbreaks"},{name:"Vanuatu Biosecurity — Border interception data",type:"Point",status:"Available",desc:"IAS interception and quarantine records"}],globalSources:[{name:"GBIF — Invasive species occurrence records",type:"Point",status:"Available",desc:"Global observation records for target IAS species"},{name:"CABI — Invasive Species Compendium",type:"Reference",status:"Available",desc:"Comprehensive datasheets on ecology, distribution, and management of IAS"},{name:"Pacific Invasives Partnership — Regional IAS database",type:"Point/Reference",status:"Available",desc:"Pacific-focused invasive species occurrence and management data"},{name:"AIMS — Crown of Thorns Starfish monitoring (Pacific)",type:"Point",status:"Available",desc:"Australian Institute of Marine Science COTS reef monitoring data"}],proposedActions:["Conduct national Merremia peltata coverage mapping using Sentinel-2 satellite imagery and NDVI analysis","Establish systematic Crown of Thorns reef monitoring transects at priority reef sites","Map Mile a Minute Vine distribution through field surveys combined with drone imagery in affected provinces","Survey and map Solanum torvum infestations focusing on agricultural areas in Shefa and Sanma","Create IAS early warning system with community reporting linked to GIS database","Develop eradication priority map based on proximity to conservation areas and agricultural land"],revisions:["Add monitoring frequency targets for each priority IAS (e.g., annual Merremia coverage update)","Include cost-benefit analysis for IAS management actions per province","Link IAS distribution data to biodiversity impact assessment for conservation areas"]},T7:{feasibility:"Moderate — Mapping requires collaboration with agricultural sector and Department of Agriculture. Farmer surveys and agrochemical import records can provide spatial data. Remote sensing cannot directly detect pesticide use.",clarity:'Moderate — Target references "large-scale and small-scale commercial farming" but lacks quantitative thresholds. Criteria for what constitutes a mappable pesticide use area need definition.',dataRequirements:["Commercial farm boundaries (large-scale and smallholder)","Agrochemical use records by location and type","Agricultural land use maps","Water quality monitoring data near agricultural areas","Crop type maps for identifying high-pesticide-use crops"],nationalSources:[{name:"Department of Agriculture — Farm registration data",type:"Point/Polygon",status:"Partial",desc:"Registered commercial farm locations and crop types"},{name:"Vanuatu Customs — Agrochemical import records",type:"Tabular",status:"Available",desc:"Import volumes of pesticides and herbicides by product type"},{name:"Department of Agriculture — Extension office records",type:"Point",status:"Partial",desc:"Agricultural extension activities and pesticide advice records"}],globalSources:[{name:"FAO — Global agro-chemical use database",type:"Tabular",status:"Available",desc:"National-level pesticide use statistics"},{name:"ESA — Cropland mapping (WorldCover)",type:"Raster",status:"Available",desc:"10m resolution global land cover including cropland classes"},{name:"NASA — Agricultural productivity indices",type:"Raster",status:"Available",desc:"Satellite-derived crop health and agricultural intensity indicators"}],proposedActions:["Conduct agricultural pesticide use survey targeting commercial farms in Shefa, Sanma, and Malampa","Map all commercial farm boundaries and classify by crop type and pesticide intensity","Overlay pesticide use areas with adjacent conservation areas and water bodies for risk assessment","Establish baseline water quality monitoring near high-pesticide-use areas","Create pesticide risk heat map combining use intensity, proximity to conservation areas, and downstream impacts"],revisions:["Define measurable indicators (e.g., hectares under integrated pest management)","Add explicit targets for pesticide reduction in areas adjacent to KBAs and protected areas","Include organic farming promotion as a measurable alternative action"]},T8:{feasibility:"Moderate — Coastal eutrophication mapping requires water quality monitoring data (chlorophyll-a, nutrient levels). Satellite remote sensing (Sentinel-2) can detect chlorophyll concentrations in coastal waters. Field validation is needed.",clarity:'Moderate — Target references "coastal eutrophication and nutrient-impacted zones" without specifying monitoring methodology or thresholds.',dataRequirements:["Coastal water quality monitoring data (chlorophyll-a, nitrogen, phosphorus)","Sewage discharge and waste management site locations","River discharge points and catchment land use data","Satellite-derived chlorophyll-a concentration maps","Coral reef health data as impact indicator"],nationalSources:[{name:"DEPC — Water quality monitoring programme",type:"Point",status:"Partial",desc:"Coastal water quality sample stations and results"},{name:"Public Works Department — Sewage infrastructure",type:"Point",status:"Partial",desc:"Sewage treatment and discharge locations"},{name:"Port Vila Municipal Council — Waste management",type:"Point/Polygon",status:"Partial",desc:"Waste disposal sites and drainage infrastructure"}],globalSources:[{name:"Copernicus Marine Service — Ocean colour products",type:"Raster",status:"Available",desc:"Satellite-derived chlorophyll-a and water quality indicators"},{name:"UN Environment — Global Nutrient Management System",type:"Reference",status:"Available",desc:"Global nutrient pollution assessment data and methodology"},{name:"Allen Coral Atlas — Reef water quality",type:"Raster",status:"Available",desc:"Water clarity and turbidity indicators for reef areas"}],proposedActions:["Establish permanent coastal water quality monitoring stations at key sites (Port Vila, Luganville, Lakatoro)","Generate satellite-derived eutrophication risk maps using Sentinel-2 chlorophyll-a analysis","Map all point-source nutrient discharge locations (sewage, agriculture, aquaculture)","Conduct catchment-level nutrient loading analysis for priority coastal zones","Develop early warning thresholds for coastal eutrophication based on WHO/UNEP guidelines"],revisions:["Define specific eutrophication thresholds (e.g., chlorophyll-a >5 µg/L)","Add monitoring frequency targets (monthly at key sites)","Include freshwater eutrophication in inland water bodies"]},T10:{feasibility:"High — Land cover mapping is a well-established remote sensing application. Sentinel-2 (10m) and Landsat (30m) imagery are freely available. National land cover mapping can be completed with existing technical capacity.",clarity:"Clear — Target requires mapping of land cover change for agriculture, livestock, fisheries and forestry. Standard remote sensing classification output.",dataRequirements:["Multi-temporal satellite imagery (Sentinel-2, Landsat) for change detection","Ground truth / field survey points for classification training and validation","Existing land use maps and agricultural census data","Forest inventory and logging concession boundaries","Fisheries infrastructure and aquaculture site locations"],nationalSources:[{name:"Department of Forests — Forest inventory and concessions",type:"Polygon",status:"Available",desc:"Forest cover assessments and logging concession boundaries"},{name:"Department of Agriculture — Agricultural census",type:"Tabular/Point",status:"Available",desc:"Agricultural production data by area council"},{name:"Vanuatu Lands Department — Land tenure and use",type:"Polygon",status:"Partial",desc:"Registered land parcels and designated land uses"},{name:"VANRIS — Vanuatu Resource Information System",type:"Polygon",status:"Available",desc:"Historical land resource mapping (soils, vegetation, climate zones)"}],globalSources:[{name:"ESA WorldCover — 10m land cover",type:"Raster",status:"Available",desc:"10m resolution global land cover (2020/2021) with 11 classes"},{name:"Global Forest Watch — Tree cover loss/gain",type:"Raster",status:"Available",desc:"Annual forest change data at 30m resolution (Hansen et al.)"},{name:"FAO — Global Land Cover Network (GLCN)",type:"Raster",status:"Available",desc:"UN land cover classification system products"},{name:"Copernicus Global Land Service — Land cover",type:"Raster",status:"Available",desc:"Annual 100m dynamic land cover with change detection"}],proposedActions:["Produce national land cover / land use map at 10m resolution using Sentinel-2 imagery","Generate 2015–2025 land cover change analysis for agriculture expansion and deforestation","Classify agricultural areas by crop type (coconut, cocoa, kava, cattle, food crops)","Map forest-to-agriculture conversion hotspots per province for REDD+ reporting","Establish annual land cover monitoring programme using satellite change detection","Validate land cover maps using field surveys and community ground-truthing"],revisions:["Add explicit change detection indicators (e.g., hectares of forest loss per year)","Include sustainable land management practices as a positive action indicator","Link land cover change to carbon stock estimates for climate reporting"]},T12:{feasibility:"Moderate — Green and blue space mapping in urban areas requires detailed spatial data. Provincial capitals have varying levels of existing urban mapping. Drone surveys may be needed for accurate park boundary delineation.",clarity:'Moderate — Target references "parks within provincial and municipal areas, and botanical gardens" but lacks criteria for what constitutes a blue/green space. Needs operational definition.',dataRequirements:["Urban park and public garden boundaries","Botanical garden extents","Municipal area boundaries and land use zoning","Waterfront/coastal public access areas (blue spaces)","Tree canopy cover in urban areas"],nationalSources:[{name:"Port Vila Municipal Council — Park and open space register",type:"Polygon",status:"Partial",desc:"Municipal parks, gardens, and public open spaces in Port Vila"},{name:"Luganville Municipal Council — Green space inventory",type:"Polygon",status:"Partial",desc:"Parks and recreational areas in Luganville"},{name:"Department of Forests — Botanical garden boundaries",type:"Polygon",status:"Available",desc:"National botanical garden and arboretum boundaries"}],globalSources:[{name:"OpenStreetMap — Urban land use features",type:"Polygon",status:"Available",desc:"Community-mapped parks, gardens, and recreational areas"},{name:"ESA WorldCover — Urban vegetation detection",type:"Raster",status:"Available",desc:"Tree cover and vegetation within urban extents"},{name:"Google Open Buildings — Building footprints",type:"Polygon",status:"Available",desc:"For calculating green space ratio vs built-up area"}],proposedActions:["Map all public parks and green spaces in Port Vila and Luganville using drone imagery","Conduct green space inventory for all provincial capitals (Lakatoro, Saratamata, Isangel, Sola)","Calculate green space per capita ratios for each urban area (WHO recommends 9 m² per person)","Map blue spaces (coastal access, waterfront parks, mangrove boardwalks) in urban areas","Develop green space expansion plan for under-served urban communities"],revisions:["Define minimum green space standards (e.g., WHO 9 m² per capita)","Add accessibility indicators (% of population within 300m of green space)","Include urban tree canopy targets alongside ground-level green space"]}}[t]||{feasibility:"Assessment pending — requires further analysis of data availability and institutional capacity.",clarity:"Assessment pending — target definition review needed.",dataRequirements:["Spatial datasets relevant to target objectives"],nationalSources:[],globalSources:[],proposedActions:["Conduct baseline data assessment for this target"],revisions:["Review target indicators for measurability and spatial relevance"]}}const Ni=400;function Qa(t,e,a,s,i,r){var E,A,G,P;if(!document.getElementById(t))return;const n=z.map(t,{center:gt.mapCenter,zoom:gt.mapZoom,zoomControl:!1,attributionControl:!1,dragging:!1,scrollWheelZoom:!1,doubleClickZoom:!1,touchZoom:!1,preferCanvas:!0});z.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{maxZoom:19}).addTo(n),z.control.scale({imperial:!1,position:"bottomleft",maxWidth:150}).addTo(n);let l=null;s&&z.geoJSON(s,{style:$=>{const S=$.properties.name||$.properties.province||"",w=i&&S===i;return{color:w?"#333":"#777",weight:w?2.5:1.2,fillOpacity:w?.04:.02,dashArray:w?null:"4 4"}},onEachFeature:($,S)=>{const w=$.properties.name||$.properties.province||"";w&&S.bindTooltip(w,{permanent:!0,direction:"center",className:"print-province-label"}),i&&w===i&&(l=S)}}).addTo(n);const c=gl(),u=new Map(c.map(($,S)=>[$,S])),d=[...a].sort(($,S)=>(u.get($.id)??999)-(u.get(S.id)??999)),h={},f={},p={},m={},g={};for(const $ of d){const S=$.metadata,w=(S==null?void 0:S.category)||"OTHER",k=((E=$.geojson)==null?void 0:E.features)||[],I=(S==null?void 0:S.isReference)===!0;for(const O of k){if(i&&((A=O.properties)==null?void 0:A.province)!==i)continue;const C=(G=O.geometry)==null?void 0:G.type;if(I)C==="Polygon"||C==="MultiPolygon"?(p[w]||(p[w]=[]),p[w].push(O)):(C==="Point"||C==="MultiPoint")&&(m[w]||(m[w]=[]),m[w].push(O));else if(C==="Polygon"||C==="MultiPolygon"){const L=Ir(w,O);h[L]||(h[L]=[]),h[L].push(O),f[L]||(f[L]={cat:w,typeValue:w==="LAND_COVER"&&((P=O.properties)==null?void 0:P.type)||null})}else(C==="Point"||C==="MultiPoint")&&(g[w]||(g[w]=[]),g[w].push(O))}}let y=0;for(const $ of Object.values(h))y+=$.length;for(const $ of Object.values(g))y+=$.length;const v=!!i&&y>Ni;let b=Ni;const _=z.featureGroup();for(const[$,S]of Object.entries(p))_.addLayer(z.geoJSON({type:"FeatureCollection",features:S},{style:()=>Br($)}));for(const[$,S]of Object.entries(m)){const w=Dr($);_.addLayer(z.geoJSON({type:"FeatureCollection",features:S},{pointToLayer:(k,I)=>z.circleMarker(I,w)}))}const x=Object.entries(h).sort(($,S)=>S[1].length-$[1].length);for(const[$,S]of x){if(v&&b<=0)break;const{cat:w,typeValue:k}=f[$],I=Fr(w,k),O=r?null:ot(S);if(O)_.addLayer(z.geoJSON(O,{style:()=>I}));else if(S.length>0){const C=v?Math.min(S.length,b):S.length,L=C<S.length?S.slice(0,C):S;_.addLayer(z.geoJSON({type:"FeatureCollection",features:L},{style:()=>I})),v&&(b-=L.length)}}for(const[$,S]of Object.entries(g)){if(v&&b<=0)break;if(S.length>0){const w=Or($),k=v?Math.min(S.length,b):S.length,I=k<S.length?S.slice(0,k):S;_.addLayer(z.geoJSON({type:"FeatureCollection",features:I},{pointToLayer:(O,C)=>z.circleMarker(C,w)})),v&&(b-=I.length)}}_.addTo(n),setTimeout(()=>{if(n.invalidateSize(),i&&l){const $=l.getBounds();$.isValid()&&n.fitBounds($,{padding:[30,30],maxZoom:12})}else if(s){const $=z.geoJSON(s).getBounds();$.isValid()&&n.fitBounds($,{padding:[40,40],maxZoom:10})}else if(_.getLayers().length>0){const $=_.getBounds();$.isValid()&&n.fitBounds($,{padding:[40,40],maxZoom:12})}},200)}const zl={T1:"Spatial Planning",T2:"Restoration",T3:"30×30 Conserv.",T4:"Species",T6:"Invasive IAS",T7:"Pesticides",T8:"Eutrophication",T10:"Land Cover",T12:"Green Spaces"};function Ul(t){const e=Gt(),a=Y(),s=a.filters.targets,i={...a.filters,targets:[],province:"All",category:"All",realm:"All",year:"All"},r=It.targets.map(c=>{let u="—",d=!1,h="exec-card-none";try{if(d=e.filter(m=>m.metadata.targets&&m.metadata.targets.includes(c.code)).length>0,d){let m;c.code==="T3"?(m=Le(e,i),u=`${m.terrestrial_pct.toFixed(1)}% land`):c.code==="T1"?(m=Ka(e,i),u=`${m.total_pct.toFixed(1)}%`):c.code==="T2"?(m=Os(e,i),u=Ri(m.degraded_ha)):(m=ye(e,c.code,i),u=Ri(m.totalAreaHa)),h="exec-card-ok"}}catch{}const f=s.includes(c.code);return`
      <button class="exec-card ${h} ${f?"exec-card-active":""}"
              data-target="${c.code}"
              title="${c.name}"
              aria-pressed="${f}">
        <span class="exec-card-icon" style="color:${c.color}">${c.icon}</span>
        <span class="exec-card-code" style="color:${c.color}">${c.code}</span>
        <span class="exec-card-name">${zl[c.code]||c.code}</span>
        <span class="exec-card-metric ${d?"":"exec-card-metric-none"}">${u}</span>
        <span class="exec-card-dot ${h}-dot"></span>
      </button>`}).join(""),o=It.targets.filter(c=>e.some(u=>u.metadata.targets&&u.metadata.targets.includes(c.code))).length,n=It.targets.length-o,l=n>0?`<span class="exec-gap-badge" title="${n} target${n>1?"s":""} have no GIS data uploaded yet">
         <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
         ${n} data gap${n>1?"s":""}
       </span>`:`<span class="exec-complete-badge">
         <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
         All targets have data
       </span>`;t.innerHTML=`
    <div class="exec-summary">
      <div class="exec-summary-header">
        <span class="exec-summary-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          NBSAP Target Coverage
        </span>
        <div style="display:flex;align-items:center;gap:8px">
          ${l}
          <span class="exec-summary-count">${o}/${It.targets.length} targets with data</span>
        </div>
      </div>
      <div class="exec-cards" role="group" aria-label="NBSAP target quick-select">
        ${r}
      </div>
    </div>
  `,t.querySelectorAll(".exec-card").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.target;de({targets:[u]})})})}function Ri(t){return t?t>=1e6?(t/1e6).toFixed(1)+"M ha":t>=1e3?(t/1e3).toFixed(1)+"K ha":t.toFixed(0)+" ha":"0 ha"}const Hl=["rbaereleo@vanuatu.gov.vu","dlaunder@vanuatu.gov.vu"],Vl={T1:{title:"Target 1: Biodiversity Spatial Planning",desc:"Percentage of land and sea area covered by biodiversity-inclusive spatial plans"},T2:{title:"Target 2: Degraded Areas & Restoration",desc:"Mapping of degraded areas and active restoration sites"},T3:{title:"Target 3: 30x30 Conservation",desc:"Conserve 30% of terrestrial and 30% of marine areas by 2030"},T4:{title:"Target 4: Species & Biodiversity",desc:"Distribution maps of significant species and key biodiversity areas"},T6:{title:"Target 6: Invasive Alien Species",desc:"Coverage and distribution of key IAS — Merremia, Fire Ants, African Snail, Crown-of-Thorns, Sako, Coconut Beetle"},T7:{title:"Target 7: Pesticide & Herbicide",desc:"Areas of pesticide and herbicide use in commercial farming"},T8:{title:"Target 8: Coastal Eutrophication",desc:"Coastal eutrophication and nutrient-impacted zones"},T10:{title:"Target 10: Land Cover Change",desc:"Land cover change mapping for agriculture, livestock, fisheries and forestry"},T12:{title:"Target 12: Blue & Green Spaces",desc:"Parks within provincial and municipal areas, and botanical gardens"}};function Wl(){const t=document.getElementById("page-dashboard");t.innerHTML=`
    <div class="dashboard-layout">
      <div class="dashboard-sidebar">
        <div id="filter-panel-container"></div>
        <div id="kpi-container"></div>
        <div class="sidebar-section-title" style="margin-top:4px">Last Updated</div>
        <div id="last-updated-container" style="margin-bottom:8px">
          <span class="last-updated-badge" title="Data last refreshed from Firestore">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.58-4.7"/></svg>
            <span id="last-updated-text">Syncing&hellip;</span>
          </span>
        </div>
        <div class="sidebar-section-title">Export</div>
        <div class="export-toolbar">
          <button class="btn btn-sm btn-outline" id="btn-export-csv" title="${Jt()?"Export filtered data as CSV":"Request data access"}" style="position:relative">
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
        <div class="sidebar-section-title">Print Maps</div>
        <div class="export-toolbar">
          <button class="btn btn-sm btn-outline" id="btn-print-target" title="Print map for the selected target" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Target
          </button>
          <button class="btn btn-sm btn-outline" id="btn-print-province" title="Print target maps by province (select a target first)" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            By Province
          </button>
          <button class="btn btn-sm btn-outline" id="btn-print-species" title="Print T4 species maps (select T4 first)" disabled style="display:none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
            By Species
          </button>
          <button class="btn btn-sm btn-primary" id="btn-print-all" title="Print maps for all 9 NBSAP targets">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            All Targets
          </button>
        </div>
      </div>
      <div class="dashboard-main">
        <div id="exec-summary-container"></div>
        <div id="target-header-container"></div>
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
          <div id="category-breakdown-container" style="margin-top:20px"></div>
        </div>
      </div>
    </div>
  `,setTimeout(()=>{dl("map"),ts()},50),document.getElementById("btn-export-csv").addEventListener("click",()=>{Jt()?wl():aa(`CSV data download is restricted.

To request data access, please email:
${Hl.join(`
`)}`,{title:"Access Restricted"})}),document.getElementById("btn-export-json").addEventListener("click",Sl),document.getElementById("btn-export-png").addEventListener("click",El),document.getElementById("btn-print-all").addEventListener("click",Gl),document.getElementById("btn-print-target").addEventListener("click",()=>{const e=Y();e.filters.targets.length===1&&Zr(e.filters.targets[0])}),document.getElementById("btn-print-province").addEventListener("click",()=>{const e=Y();e.filters.targets.length===1&&Pl(e.filters.targets[0])}),document.getElementById("btn-print-species").addEventListener("click",()=>{const e=Y();e.filters.targets.length===1&&e.filters.targets[0]==="T4"&&Cl("T4")})}function ts(){ai=!1;const t=Y(),e=document.getElementById("exec-summary-container");e&&Ul(e);const a=document.getElementById("last-updated-text");if(a){const m=new Date,g=m.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),y=m.toLocaleDateString([],{day:"numeric",month:"short"});a.textContent=`${y}, ${g}`;const v=a.closest(".last-updated-badge");v&&v.classList.add("synced")}const s=document.getElementById("filter-panel-container");s&&Ho(s);const i=document.getElementById("kpi-container");i&&el(i),Ya();const r=t.filters,o=r.targets,n=Gt(),l=document.getElementById("target-header-container"),c=document.getElementById("btn-print-target"),u=document.getElementById("btn-print-province"),d=document.getElementById("btn-print-species");if(l)if(o.length===1){const m=o[0],g=Vl[m]||{title:m,desc:""};l.innerHTML=`
        <div class="target-header-bar">
          <div style="flex:1">
            <strong>${g.title}</strong>
            <span style="color:var(--text-secondary);font-size:13px;margin-left:12px">${g.desc}</span>
          </div>
          <button class="btn btn-sm btn-outline" id="btn-print-header" title="Print map for ${m}" style="flex-shrink:0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Map
          </button>
        </div>
      `,document.getElementById("btn-print-header").addEventListener("click",()=>Zr(m)),c&&(c.disabled=!1,c.title=`Print map for ${m}`),u&&(u.disabled=!1,u.title=`Print ${m} maps by province`),d&&(m==="T4"?(d.style.display="",d.disabled=!1,d.title="Print species distribution maps"):(d.style.display="none",d.disabled=!0))}else l.innerHTML="",c&&(c.disabled=!0,c.title="Select a single target first"),u&&(u.disabled=!0,u.title="Select a single target first"),d&&(d.style.display="none",d.disabled=!0);const h=document.getElementById("province-table-container"),f=document.getElementById("province-chart-container"),p=document.getElementById("category-breakdown-container");if(o.length===1){const m=o[0],g=m==="T3"?Le(n,r):m==="T1"?Ka(n,r):ye(n,m,r);h&&Li(h,g.provinceBreakdown),f&&$i(f,g.provinceBreakdown),p&&Kl(p,g)}else{if(o.length===0||o.includes("T3")){const g=Le(n,r);h&&Li(h,g.provinceBreakdown),f&&$i(f,g.provinceBreakdown)}else h&&(h.innerHTML='<p style="color:var(--text-tertiary);font-size:13px;padding:12px 0">Select a target to see provincial breakdown</p>'),f&&(f.innerHTML="");p&&(p.innerHTML="")}}function Kl(t,e){if(!e.categoryBreakdown||e.categoryBreakdown.length===0){t.innerHTML="";return}const a=e.categoryBreakdown.map(s=>{const i=K[s.category]||{label:s.category,color:"#95a5a6"};return`
      <tr>
        <td>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${i.color};margin-right:6px"></span>
          ${i.label}
        </td>
        <td style="text-align:right">${Jl(s.area_ha)}</td>
        <td style="text-align:right">${s.features}</td>
      </tr>
    `}).join("");t.innerHTML=`
    <div class="breakdown-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2v20"/></svg>
      Category Breakdown
    </div>
    <table class="data-table">
      <thead>
        <tr><th>Category</th><th style="text-align:right">Area (ha)</th><th style="text-align:right">Features</th></tr>
      </thead>
      <tbody>${a}</tbody>
    </table>
  `}function Jl(t){return!t&&t!==0?"-":t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toFixed(1)}let ai=!0;function Yl(){ai=!0}function Zl(){ml(),ai&&ts()}function bs(t={}){var e;return{id:t.id||Xl(),name:t.name||"Untitled Layer",originalFilename:t.originalFilename||"",category:t.category||"OTHER",targets:t.targets||[],realm:t.realm||((e=K[t.category])==null?void 0:e.defaultRealm)||"terrestrial",countsToward30x30:t.countsToward30x30||!1,isReference:t.isReference||!1,uploadTimestamp:t.uploadTimestamp||new Date().toISOString(),uploadedBy:t.uploadedBy||"admin",detectedCRS:t.detectedCRS||"EPSG:4326",featureCount:t.featureCount||0,validGeometryCount:t.validGeometryCount||0,fixedCount:t.fixedCount||0,droppedCount:t.droppedCount||0,totalAreaHa:t.totalAreaHa||0,status:t.status||"Clean",warnings:t.warnings||[],notes:t.notes||"",description:t.description||"",custodianAgency:t.custodianAgency||"",responsibleOfficer:t.responsibleOfficer||"",contactInformation:t.contactInformation||"",dateCreated:t.dateCreated||"",dateUpdated:t.dateUpdated||"",geographicCoverage:t.geographicCoverage||"",dataSource:t.dataSource||"",collectionMethod:t.collectionMethod||"",spatialResolution:t.spatialResolution||"",dataLimitations:t.dataLimitations||"",updateFrequency:t.updateFrequency||"",accessClassification:t.accessClassification||"Public"}}const Ge=[{key:"name",label:"Dataset Name",hint:"Use standardized naming format",required:!0},{key:"description",label:"Description",hint:"Brief 2-3 sentence summary",required:!0},{key:"custodianAgency",label:"Custodian Agency",hint:"Full agency name (e.g. DEPC)",required:!0},{key:"responsibleOfficer",label:"Responsible Officer",hint:"Name and position",required:!1},{key:"contactInformation",label:"Contact Information",hint:"Official email or phone",required:!1},{key:"dateCreated",label:"Date Created",hint:"YYYY-MM-DD format",type:"date",required:!0},{key:"dateUpdated",label:"Date Updated",hint:"Record when modified",type:"date",required:!1},{key:"geographicCoverage",label:"Geographic Coverage",hint:"Spatial extent",type:"select",options:["National","Provincial","Marine","National + Marine"],required:!0},{key:"detectedCRS",label:"CRS",hint:"EPSG code",required:!1},{key:"dataSource",label:"Data Source",hint:"Origin",type:"select",options:["Field","Satellite","Digitized","Census","Survey","Other"],required:!0},{key:"collectionMethod",label:"Collection Method",hint:"Brief description of how collected",required:!1},{key:"spatialResolution",label:"Spatial Resolution",hint:"Pixel size or scale",required:!1},{key:"dataLimitations",label:"Data Limitations",hint:"Coverage gaps, known constraints",required:!1},{key:"updateFrequency",label:"Update Frequency",hint:"Revision cycle",type:"select",options:["Annual","Biennial","Project-based","One-time","As needed"],required:!1},{key:"accessClassification",label:"Access Classification",hint:"Sensitivity level",type:"select",options:["Public","Restricted","Confidential"],required:!0}];function es(t){const e=[];let a=0;for(const i of Ge){const r=t[i.key];r&&String(r).trim()?a++:i.required&&e.push(i.label)}const s=Ge.length;return{complete:e.length===0,filled:a,total:s,pct:Math.round(a/s*100),missing:e}}function Xl(){return"layer_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8)}function Qr(t,e){const a=[],s=e.features||[];t.category||a.push("Layer has no category assigned");let i=0,r=0,o=0;for(const n of s){const l=n.properties||{};l.province||i++,(!l.name||l.name==="Unnamed")&&r++,n.geometry||o++}return i>0&&a.push(`${i} feature(s) missing province assignment`),r>0&&a.push(`${r} feature(s) with missing/default name`),o>0&&a.push(`${o} feature(s) with null geometry`),t.detectedCRS&&t.detectedCRS!=="EPSG:4326"&&a.push(`CRS is ${t.detectedCRS} — may need verification`),{compliant:a.length===0,issues:a}}let _s="",Ms="All",xs="All",ws="All",Ke=null;function Ql(){const t=document.getElementById("page-portal");t.innerHTML=`
    <div class="portal-layout">
      <div class="portal-main">
        <div class="portal-toolbar">
          <input type="text" class="search-input" id="portal-search" placeholder="Search layers by name, category, or target...">
          <select id="portal-filter-target">
            <option value="All">All Targets</option>
          </select>
          <select id="portal-filter-category">
            <option value="All">All Categories</option>
            ${Object.entries(K).map(([i,r])=>`<option value="${i}">${r.label}</option>`).join("")}
          </select>
          <select id="portal-filter-status">
            <option value="All">All Status</option>
            <option value="Clean">Clean</option>
            <option value="Warnings">Warnings</option>
            <option value="Failed">Failed</option>
          </select>
          ${Jt()?`<button class="btn btn-sm btn-outline" id="btn-metadata-report" title="Download metadata report for all datasets" style="margin-left:auto;white-space:nowrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Metadata Report
          </button>`:""}
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
        ${Jt()?"":`
        <div class="card" style="margin-top:16px">
          <div class="card-header">
            <span>Request Data Download</span>
          </div>
          <div class="card-body" style="font-size:13px">
            <p style="margin:0 0 8px;color:var(--text-secondary)">To download CSV or GeoJSON files, please contact:</p>
            <div style="margin-bottom:4px"><a href="mailto:rbaereleo@vanuatu.gov.vu" style="color:var(--primary)">Rolenas Baereleo</a></div>
            <div><a href="mailto:dlaunder@vanuatu.gov.vu" style="color:var(--primary)">Dean Wotlolan</a></div>
          </div>
        </div>`}
      </div>
    </div>
    <!-- Metadata editor modal -->
    <div class="modal-overlay" id="metadata-editor-modal">
      <div class="modal" style="max-width:600px;max-height:85vh;overflow-y:auto">
        <div class="modal-header">
          <h3>Edit Metadata</h3>
          <button class="modal-close" id="meta-editor-close">&times;</button>
        </div>
        <div id="meta-editor-body"></div>
      </div>
    </div>
  `;const e=document.getElementById("portal-filter-target"),a=It.targets||[];for(const i of a){const r=document.createElement("option");r.value=i.code,r.textContent=i.code,e.appendChild(r)}document.getElementById("portal-search").addEventListener("input",i=>{_s=i.target.value.toLowerCase(),Rt()}),document.getElementById("portal-filter-target").addEventListener("change",i=>{Ms=i.target.value,Rt()}),document.getElementById("portal-filter-category").addEventListener("change",i=>{xs=i.target.value,Rt()}),document.getElementById("portal-filter-status").addEventListener("change",i=>{ws=i.target.value,Rt()});const s=document.getElementById("btn-metadata-report");s&&s.addEventListener("click",en),document.getElementById("meta-editor-close").addEventListener("click",Ra),document.getElementById("metadata-editor-modal").addEventListener("click",i=>{i.target===i.currentTarget&&Ra()}),document.getElementById("portal-table-container").addEventListener("click",i=>{const r=i.target.closest("button");if(r){const n=r.dataset.id;r.classList.contains("action-view")?(Ke=n,Na(n),Rt()):r.classList.contains("action-rename")?tn(n):r.classList.contains("action-download")?ic(n):r.classList.contains("action-remove")&&rc(n);return}const o=i.target.closest("tr[data-layer-id]");o&&(Ke=o.dataset.layerId,Na(Ke),Rt())}),Rt()}function tc(t){const e=es(t);return e.complete?'<span class="badge badge-success" title="All required metadata filled" style="font-size:10px">META OK</span>':`<span class="badge" style="font-size:10px;background:#fff3cd;color:#856404;border:1px solid #ffc107" title="Missing: ${e.missing.join(", ")}">${e.pct}%</span>`}function ec(t){const e=es(t),a=e.pct||0,s=a===100?"complete":a>=60?"partial":"poor";return`
    <div class="completeness-bar" title="${a===100?"All metadata complete":`Missing: ${(e.missing||[]).join(", ")}`}">
      <div class="completeness-track">
        <div class="completeness-fill ${s}" style="width:${a}%"></div>
      </div>
      <span class="completeness-pct">${a}%</span>
    </div>`}function ac(t){if(!t)return'<span class="freshness-badge unknown">Unknown</span>';const e=Math.floor((Date.now()-new Date(t).getTime())/864e5);return e<=30?`<span class="freshness-badge fresh" title="${e}d ago">Fresh</span>`:e<=180?`<span class="freshness-badge recent" title="${e}d ago">${Math.floor(e/30)}mo</span>`:`<span class="freshness-badge stale" title="${e}d ago">${Math.floor(e/30)}mo old</span>`}function Ii(t){var n;const e=t.metadata,a=K[e.category]||{},s=e.isReference===!0,i=Jt();let r;if(s){const l=gt.nationalBaselines,c=e.realm==="marine"?l.marine_ha:l.terrestrial_ha;r=`<span style="font-weight:600">${(c>0?(e.totalAreaHa||0)/c*100:0).toFixed(1)}%</span>`}else r=`${e.featureCount}`;const o=i;return`
    <tr data-layer-id="${t.id}" class="${Ke===t.id?"selected":""}" style="cursor:pointer">
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:4px;height:24px;border-radius:2px;background:${a.color||"#95a5a6"};flex-shrink:0"></span>
          <div>
            <strong>${e.name}</strong>
            ${s?'<span style="display:inline-block;background:#fef3cd;color:#856404;font-size:10px;font-weight:700;padding:0 5px;border-radius:10px;margin-left:5px;vertical-align:middle">REF</span>':""}
            ${tc(e)}
          </div>
        </div>
      </td>
      <td><span style="font-size:12px;color:var(--text-secondary);display:inline-flex;align-items:center;gap:4px"><span style="color:${a.color||"#78909C"}">${Ie(e.category,14)}</span>${((n=K[e.category])==null?void 0:n.label)||e.category}</span></td>
      <td style="text-transform:capitalize">${e.realm}</td>
      <td>${r}</td>
      <td><span class="badge badge-${e.status.toLowerCase()}">${e.status}</span></td>
      <td>${ec(e)}</td>
      <td style="font-size:12px;color:var(--text-secondary)">${ac(e.uploadTimestamp)}</td>
      <td class="actions">
        <button class="btn btn-sm btn-outline action-view" data-id="${t.id}">View</button>
        ${i?`<button class="btn btn-sm btn-outline action-rename" data-id="${t.id}" title="Rename layer">Rename</button>`:""}
        ${i?`<button class="btn btn-sm btn-outline action-download" data-id="${t.id}">GeoJSON</button>`:""}
        ${o?`<button class="btn btn-sm btn-danger action-remove" data-id="${t.id}">Remove</button>`:""}
      </td>
    </tr>
  `}function Rt(){var c;const t=Y(),e=document.getElementById("portal-table-container");if(!e)return;let a=t.layers||[];if(a=a.filter(u=>{const d=u.metadata;return!(_s&&!`${d.name} ${d.category} ${(d.targets||[]).join(" ")} ${d.originalFilename}`.toLowerCase().includes(_s)||Ms!=="All"&&!(d.targets||[]).includes(Ms)||xs!=="All"&&d.category!==xs||ws!=="All"&&d.status!==ws)}),a.length===0){e.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
        </div>
        <div class="empty-state-title">No layers found</div>
        <div class="empty-state-text">${Jt()?"Go to the Admin tab to upload shapefiles":"No data available yet"}</div>
      </div>
    `;return}const s=It.targets||[],i={},r=[];for(const u of a){const d=((c=u.metadata)==null?void 0:c.targets)||[];if(d.length===0)r.push(u);else for(const h of d)i[h]||(i[h]=[]),i[h].push(u)}const o=`
    <thead>
      <tr>
        <th>Layer Name</th>
        <th>Category</th>
        <th>Realm</th>
        <th>Records</th>
        <th>Status</th>
        <th title="Metadata completeness score">Complete</th>
        <th title="Data freshness based on upload date">Freshness</th>
        <th>Actions</th>
      </tr>
    </thead>`;let n="";for(const u of s){const d=i[u.code];!d||d.length===0||(n+=`
      <div class="portal-target-group">
        <div class="portal-group-header" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:${u.color||"#0072BC"}0A;border:1px solid ${u.color||"#0072BC"}30;border-radius:8px 8px 0 0;margin-top:16px">
          <span class="badge" style="font-size:13px;font-weight:700;padding:3px 10px;background:${u.color||"#0072BC"};color:#fff;border-radius:20px;display:inline-flex;align-items:center;gap:4px">${Hs(u.code,14)} ${u.code}</span>
          <span style="font-weight:600;font-size:14px;color:var(--text-primary)">${u.name}</span>
          <span style="font-size:12px;color:var(--text-secondary);margin-left:auto">${d.length} dataset${d.length!==1?"s":""}</span>
        </div>
        <table class="data-table" style="border-top:none;border-radius:0 0 8px 8px;margin-bottom:0">
          ${o}
          <tbody>
            ${d.map(h=>Ii(h)).join("")}
          </tbody>
        </table>
      </div>
    `)}r.length>0&&(n+=`
      <div class="portal-target-group">
        <div class="portal-group-header" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--gray-50,#f8f9fa);border:1px solid var(--border-color,#e0e0e0);border-radius:8px 8px 0 0;margin-top:16px">
          <span class="badge" style="font-size:13px;font-weight:700;padding:3px 10px;background:#e0e0e0;color:#555">Admin</span>
          <span style="font-weight:600;font-size:14px;color:var(--text-primary)">Admin / Unassigned Datasets</span>
          <span style="font-size:12px;color:var(--text-secondary);margin-left:auto">${r.length} dataset${r.length!==1?"s":""}</span>
        </div>
        <table class="data-table" style="border-top:none;border-radius:0 0 8px 8px;margin-bottom:0">
          ${o}
          <tbody>
            ${r.map(u=>Ii(u)).join("")}
          </tbody>
        </table>
      </div>
    `),a.length>0&&(n+=`
      <div style="display:flex;justify-content:center;padding:24px 0 8px">
        <button class="btn btn-outline" id="btn-download-metadata-report" style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;font-size:14px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Metadata Report (CSV)
        </button>
      </div>
    `),e.innerHTML=n;const l=e.querySelector("#btn-download-metadata-report");l&&l.addEventListener("click",en)}function Na(t){var c;const e=Y(),a=document.getElementById("portal-sidebar"),s=e.layers.find(u=>u.id===t);if(!s){a.innerHTML='<div class="detail-placeholder"><p>Layer not found</p></div>';return}const i=s.metadata,r=Qr(i,s.geojson),o=K[i.category]||{},n=es(i),l=Jt();if(a.innerHTML=`
    <div class="detail-header">
      <span style="width:4px;height:28px;border-radius:2px;background:${o.color||"#95a5a6"};flex-shrink:0"></span>
      <h4>${i.name}</h4>
    </div>

    ${l?`<div style="display:flex;gap:6px;margin-bottom:12px">
      <button class="btn btn-sm btn-primary" id="btn-edit-metadata">Edit Metadata</button>
      <button class="btn btn-sm btn-outline" id="btn-rename-layer">Rename</button>
    </div>`:""}

    <div class="card" style="margin-bottom:14px">
      <div class="card-header">
        <span>Metadata</span>
        <span>${n.complete?'<span class="badge badge-success" style="font-size:10px">Complete</span>':`<span class="badge" style="font-size:10px;background:#fff3cd;color:#856404">${n.pct}% — ${n.missing.length} missing</span>`}</span>
      </div>
      <div class="card-body">
        <table class="metadata-table">
          <tr><td>Uploaded</td><td>${new Date(i.uploadTimestamp).toLocaleString()}</td></tr>
          <tr><td>Category</td><td><span style="display:inline-flex;align-items:center;gap:4px"><span style="color:${o.color||"#78909C"}">${Ie(i.category,14)}</span>${((c=K[i.category])==null?void 0:c.label)||i.category}</span></td></tr>
          <tr><td>Targets</td><td>${i.targets.map(u=>{const d=(It.targets||[]).find(h=>h.code===u);return`<span class="badge" style="margin-right:3px;background:${(d==null?void 0:d.color)||"#0072BC"}20;color:${(d==null?void 0:d.color)||"#0072BC"};border:1px solid ${(d==null?void 0:d.color)||"#0072BC"}40;display:inline-flex;align-items:center;gap:3px">${Hs(u,12)} ${u}</span>`}).join("")}</td></tr>
          <tr><td>Realm</td><td style="text-transform:capitalize">${i.realm}</td></tr>
          ${i.isReference?(()=>{const u=gt.nationalBaselines,d=i.realm==="marine"?u.marine_ha:u.terrestrial_ha;return`<tr><td>Coverage</td><td><strong>${(d>0?(i.totalAreaHa||0)/d*100:0).toFixed(1)}%</strong> of national ${i.realm==="marine"?"marine":"terrestrial"} area</td></tr>
          <tr><td>Total area</td><td><strong>${i.totalAreaHa.toFixed(2)} ha</strong></td></tr>`})():`<tr><td>Records</td><td>${i.featureCount}</td></tr>
          <tr><td>Total area</td><td><strong>${i.totalAreaHa.toFixed(2)} ha</strong></td></tr>`}
          <tr><td>30x30</td><td>${i.countsToward30x30?'<span class="badge badge-success">Yes</span>':'<span class="badge" style="background:var(--gray-100);color:var(--text-secondary)">No</span>'}</td></tr>
          ${i.description?`<tr><td>Description</td><td style="font-size:12px">${i.description}</td></tr>`:""}
          ${i.custodianAgency?`<tr><td>Custodian</td><td>${i.custodianAgency}</td></tr>`:""}
          ${i.dataSource?`<tr><td>Data Source</td><td>${i.dataSource}</td></tr>`:""}
          ${i.accessClassification&&i.accessClassification!=="Public"?`<tr><td>Access</td><td>${i.accessClassification}</td></tr>`:""}
        </table>
      </div>
    </div>

    ${n.complete?"":`
    <div class="card" style="margin-bottom:14px;border-color:#ffc107">
      <div class="card-header" style="background:#fff8e1">
        <span style="color:#856404;font-weight:600">Missing Metadata</span>
      </div>
      <div class="card-body">
        ${n.missing.map(u=>`<div style="font-size:12px;color:#856404;margin-bottom:3px">- ${u}</div>`).join("")}
        ${l?'<div style="margin-top:8px"><button class="btn btn-sm btn-primary" id="btn-fill-metadata">Fill in now</button></div>':""}
      </div>
    </div>`}

    <div class="card" style="margin-bottom:14px">
      <div class="card-header">TOR Compliance</div>
      <div class="card-body">
        ${r.compliant?'<div style="display:flex;align-items:center;gap:8px;color:var(--success);font-weight:600;font-size:13px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>All checks passed</div>':r.issues.map(u=>`<div style="display:flex;align-items:flex-start;gap:6px;color:var(--warning);font-size:12px;margin-bottom:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${u}</div>`).join("")}
      </div>
    </div>

    ${l?"":`
    <div class="card" style="margin-bottom:14px">
      <div class="card-header">
        <span>Request Data Download</span>
      </div>
      <div class="card-body" style="font-size:13px">
        <p style="margin:0 0 8px;color:var(--text-secondary)">To download CSV or GeoJSON files, please contact:</p>
        <div style="margin-bottom:4px"><a href="mailto:rbaereleo@vanuatu.gov.vu" style="color:var(--primary)">Rolenas Baereleo</a></div>
        <div><a href="mailto:dlaunder@vanuatu.gov.vu" style="color:var(--primary)">Dean Wotlolan</a></div>
      </div>
    </div>`}

    ${i.warnings.length>0?`
      <div class="card">
        <div class="card-header">Warnings (${i.warnings.length})</div>
        <div class="card-body">
          ${i.warnings.map(u=>`<div style="font-size:12px;color:var(--warning);margin-bottom:4px;display:flex;align-items:flex-start;gap:6px"><span style="flex-shrink:0">-</span>${u}</div>`).join("")}
        </div>
      </div>
    `:""}
  `,l){const u=a.querySelector("#btn-edit-metadata");u&&u.addEventListener("click",()=>Bi(t));const d=a.querySelector("#btn-rename-layer");d&&d.addEventListener("click",()=>tn(t));const h=a.querySelector("#btn-fill-metadata");h&&h.addEventListener("click",()=>Bi(t))}}async function tn(t){const a=Y().layers.find(r=>r.id===t);if(!a)return;const s=await Ml("Enter new layer name:",a.metadata.name,{title:"Rename Layer"});if(!s||s.trim()===""||s===a.metadata.name)return;const i={...a.metadata,name:s.trim(),dateUpdated:new Date().toISOString().split("T")[0]};Er(t,i),await _r(t,i),Na(t),Rt()}function Bi(t){const a=Y().layers.find(o=>o.id===t);if(!a)return;const s=a.metadata,i=document.getElementById("meta-editor-body");let r='<form id="meta-editor-form" style="padding:16px">';for(const o of Ge){const n=s[o.key]||"",l=o.required?'<span style="color:var(--danger);font-weight:700">*</span>':"";r+=`<div class="form-group" style="margin-bottom:12px">
      <label style="font-weight:600;font-size:13px">${o.label} ${l}</label>`,o.type==="select"&&o.options?r+=`<select name="${o.key}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm)">
        <option value="">-- Select --</option>
        ${o.options.map(c=>`<option value="${c}" ${n===c?"selected":""}>${c}</option>`).join("")}
      </select>`:o.type==="date"?r+=`<input type="date" name="${o.key}" value="${n}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm)">`:o.key==="description"||o.key==="dataLimitations"||o.key==="collectionMethod"?r+=`<textarea name="${o.key}" rows="2" class="form-control" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);resize:vertical">${n}</textarea>`:r+=`<input type="text" name="${o.key}" value="${sc(n)}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm)">`,r+=`<div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${o.hint}</div>
    </div>`}r+=`<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">
    <button type="button" class="btn btn-outline" id="meta-editor-cancel">Cancel</button>
    <button type="submit" class="btn btn-primary">Save Metadata</button>
  </div></form>`,i.innerHTML=r,document.getElementById("metadata-editor-modal").classList.add("active"),i.querySelector("#meta-editor-cancel").addEventListener("click",Ra),i.querySelector("#meta-editor-form").addEventListener("submit",async o=>{o.preventDefault();const n=o.target,l={};for(const u of Ge){const d=n.elements[u.key];d&&(l[u.key]=d.value.trim())}l.dateUpdated=new Date().toISOString().split("T")[0];const c={...s,...l};Er(t,c),await _r(t,c),Ra(),Na(t),Rt()})}function Ra(){document.getElementById("metadata-editor-modal").classList.remove("active")}function sc(t){return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}function en(){const e=Y().layers||[];if(e.length===0){aa("No datasets to export.");return}const a=Ge.map(l=>l.label);a.push("Targets","Realm","Feature Count","Total Area (ha)","Status","Upload Date","Completeness %");const s=[a];for(const l of e){const c=l.metadata,u=es(c),d=Ge.map(h=>{const f=c[h.key];return f!=null&&String(f).trim()!==""?String(f):"(empty)"});d.push((c.targets||[]).length>0?c.targets.join("; "):"(empty)",c.realm||"(empty)",String(c.featureCount||0),(c.totalAreaHa||0).toFixed(2),c.status||"(empty)",c.uploadTimestamp?new Date(c.uploadTimestamp).toLocaleDateString():"(empty)",String(u.pct)),s.push(d)}const i=s.map(l=>l.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join(`
`),r=new Blob([i],{type:"text/csv"}),o=URL.createObjectURL(r),n=document.createElement("a");n.href=o,n.download=`metadata-report-${new Date().toISOString().slice(0,10)}.csv`,n.click(),URL.revokeObjectURL(o)}function ic(t){const a=Y().layers.find(n=>n.id===t);if(!a||!a.geojson)return;const s=JSON.stringify(a.geojson),i=new Blob([s],{type:"application/json"}),r=URL.createObjectURL(i),o=document.createElement("a");o.href=r,o.download=`${a.metadata.name.replace(/\s+/g,"_")}.geojson`,o.click(),URL.revokeObjectURL(r)}async function rc(t){var s,i,r;if(!await Ga("Remove this layer? This cannot be undone.",{title:"Delete Layer",okLabel:"Delete",danger:!0}))return;const a=Y().layers.find(o=>o.id===t);try{await Va(t)}catch(o){console.error("Failed to delete layer from storage:",o),aa("Failed to delete layer. Please try again.",{title:"Error"});return}qs(t);try{await pe("layerTracker",Y().layerTracker)}catch(o){console.warn("Failed to save tracker after deletion:",o)}await He({action:"delete",layer_id:t,filename:((s=a==null?void 0:a.metadata)==null?void 0:s.originalFilename)||"",targets:((i=a==null?void 0:a.metadata)==null?void 0:i.targets)||[],category:((r=a==null?void 0:a.metadata)==null?void 0:r.category)||"",result:"deleted"}).catch(()=>{}),Ke=null,document.getElementById("portal-sidebar").innerHTML=`
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
  `,Rt()}function an(){Rt()}const nc="modulepreload",oc=function(t,e){return new URL(t,e).href},Di={},Fi=function(e,a,s){let i=Promise.resolve();if(a&&a.length>0){const o=document.getElementsByTagName("link"),n=document.querySelector("meta[property=csp-nonce]"),l=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));i=Promise.allSettled(a.map(c=>{if(c=oc(c,s),c in Di)return;Di[c]=!0;const u=c.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!s)for(let p=o.length-1;p>=0;p--){const m=o[p];if(m.href===c&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${d}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":nc,u||(f.as="script"),f.crossOrigin="",f.href=c,l&&f.setAttribute("nonce",l),document.head.appendChild(f),u)return new Promise((p,m)=>{f.addEventListener("load",p),f.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=o,window.dispatchEvent(n),!n.defaultPrevented)throw o}return i.then(o=>{for(const n of o||[])n.status==="rejected"&&r(n.reason);return e().catch(r)})};function lc(t){t("EPSG:4326","+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"),t("EPSG:4269","+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees"),t("EPSG:3857","+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");for(var e=1;e<=60;++e)t("EPSG:"+(32600+e),"+proj=utm +zone="+e+" +datum=WGS84 +units=m"),t("EPSG:"+(32700+e),"+proj=utm +zone="+e+" +south +datum=WGS84 +units=m");t("EPSG:5041","+title=WGS 84 / UPS North (E,N) +proj=stere +lat_0=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"),t("EPSG:5042","+title=WGS 84 / UPS South (E,N) +proj=stere +lat_0=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"),t.WGS84=t["EPSG:4326"],t["EPSG:3785"]=t["EPSG:3857"],t.GOOGLE=t["EPSG:3857"],t["EPSG:900913"]=t["EPSG:3857"],t["EPSG:102113"]=t["EPSG:3857"]}var me=1,ve=2,Te=3,cc=4,Ss=5,Oi=6378137,dc=6356752314e-3,ji=.0066943799901413165,Je=484813681109536e-20,M=Math.PI/2,hc=.16666666666666666,uc=.04722222222222222,pc=.022156084656084655,T=1e-10,dt=.017453292519943295,St=57.29577951308232,X=Math.PI/4,ia=Math.PI*2,pt=3.14159265359,Et={};Et.greenwich=0;Et.lisbon=-9.131906111111;Et.paris=2.337229166667;Et.bogota=-74.080916666667;Et.madrid=-3.687938888889;Et.rome=12.452333333333;Et.bern=7.439583333333;Et.jakarta=106.807719444444;Et.ferro=-17.666666666667;Et.brussels=4.367975;Et.stockholm=18.058277777778;Et.athens=23.7163375;Et.oslo=10.722916666667;const fc={mm:{to_meter:.001},cm:{to_meter:.01},ft:{to_meter:.3048},"us-ft":{to_meter:1200/3937},fath:{to_meter:1.8288},kmi:{to_meter:1852},"us-ch":{to_meter:20.1168402336805},"us-mi":{to_meter:1609.34721869444},km:{to_meter:1e3},"ind-ft":{to_meter:.30479841},"ind-yd":{to_meter:.91439523},mi:{to_meter:1609.344},yd:{to_meter:.9144},ch:{to_meter:20.1168},link:{to_meter:.201168},dm:{to_meter:.1},in:{to_meter:.0254},"ind-ch":{to_meter:20.11669506},"us-in":{to_meter:.025400050800101},"us-yd":{to_meter:.914401828803658}};var qi=/[\s_\-\/\(\)]/g;function ie(t,e){if(t[e])return t[e];for(var a=Object.keys(t),s=e.toLowerCase().replace(qi,""),i=-1,r,o;++i<a.length;)if(r=a[i],o=r.toLowerCase().replace(qi,""),o===s)return t[r]}function Es(t){var e={},a=t.split("+").map(function(n){return n.trim()}).filter(function(n){return n}).reduce(function(n,l){var c=l.split("=");return c.push(!0),n[c[0].toLowerCase()]=c[1],n},{}),s,i,r,o={proj:"projName",datum:"datumCode",rf:function(n){e.rf=parseFloat(n)},lat_0:function(n){e.lat0=n*dt},lat_1:function(n){e.lat1=n*dt},lat_2:function(n){e.lat2=n*dt},lat_ts:function(n){e.lat_ts=n*dt},lon_0:function(n){e.long0=n*dt},lon_1:function(n){e.long1=n*dt},lon_2:function(n){e.long2=n*dt},alpha:function(n){e.alpha=parseFloat(n)*dt},gamma:function(n){e.rectified_grid_angle=parseFloat(n)*dt},lonc:function(n){e.longc=n*dt},x_0:function(n){e.x0=parseFloat(n)},y_0:function(n){e.y0=parseFloat(n)},k_0:function(n){e.k0=parseFloat(n)},k:function(n){e.k0=parseFloat(n)},a:function(n){e.a=parseFloat(n)},b:function(n){e.b=parseFloat(n)},r:function(n){e.a=e.b=parseFloat(n)},r_a:function(){e.R_A=!0},zone:function(n){e.zone=parseInt(n,10)},south:function(){e.utmSouth=!0},towgs84:function(n){e.datum_params=n.split(",").map(function(l){return parseFloat(l)})},to_meter:function(n){e.to_meter=parseFloat(n)},units:function(n){e.units=n;var l=ie(fc,n);l&&(e.to_meter=l.to_meter)},from_greenwich:function(n){e.from_greenwich=n*dt},pm:function(n){var l=ie(Et,n);e.from_greenwich=(l||parseFloat(n))*dt},nadgrids:function(n){n==="@null"?e.datumCode="none":e.nadgrids=n},axis:function(n){var l="ewnsud";n.length===3&&l.indexOf(n.substr(0,1))!==-1&&l.indexOf(n.substr(1,1))!==-1&&l.indexOf(n.substr(2,1))!==-1&&(e.axis=n)},approx:function(){e.approx=!0},over:function(){e.over=!0}};for(s in a)i=a[s],s in o?(r=o[s],typeof r=="function"?r(i):e[r]=i):e[s]=i;return typeof e.datumCode=="string"&&e.datumCode!=="WGS84"&&(e.datumCode=e.datumCode.toLowerCase()),e.projStr=t,e}class sn{static getId(e){const a=e.find(s=>Array.isArray(s)&&s[0]==="ID");return a&&a.length>=3?{authority:a[1],code:parseInt(a[2],10)}:null}static convertUnit(e,a="unit"){if(!e||e.length<3)return{type:a,name:"unknown",conversion_factor:null};const s=e[1],i=parseFloat(e[2])||null,r=e.find(n=>Array.isArray(n)&&n[0]==="ID"),o=r?{authority:r[1],code:parseInt(r[2],10)}:null;return{type:a,name:s,conversion_factor:i,id:o}}static convertAxis(e){const a=e[1]||"Unknown";let s;const i=a.match(/^\((.)\)$/);if(i){const c=i[1].toUpperCase();if(c==="E")s="east";else if(c==="N")s="north";else if(c==="U")s="up";else throw new Error(`Unknown axis abbreviation: ${c}`)}else s=e[2]?e[2].toLowerCase():"unknown";const r=e.find(c=>Array.isArray(c)&&c[0]==="ORDER"),o=r?parseInt(r[1],10):null,n=e.find(c=>Array.isArray(c)&&(c[0]==="LENGTHUNIT"||c[0]==="ANGLEUNIT"||c[0]==="SCALEUNIT")),l=this.convertUnit(n);return{name:a,direction:s,unit:l,order:o}}static extractAxes(e){return e.filter(a=>Array.isArray(a)&&a[0]==="AXIS").map(a=>this.convertAxis(a)).sort((a,s)=>(a.order||0)-(s.order||0))}static convert(e,a={}){switch(e[0]){case"PROJCRS":a.type="ProjectedCRS",a.name=e[1],a.base_crs=e.find(h=>Array.isArray(h)&&h[0]==="BASEGEOGCRS")?this.convert(e.find(h=>Array.isArray(h)&&h[0]==="BASEGEOGCRS")):null,a.conversion=e.find(h=>Array.isArray(h)&&h[0]==="CONVERSION")?this.convert(e.find(h=>Array.isArray(h)&&h[0]==="CONVERSION")):null;const s=e.find(h=>Array.isArray(h)&&h[0]==="CS");s&&(a.coordinate_system={type:s[1],axis:this.extractAxes(e)});const i=e.find(h=>Array.isArray(h)&&h[0]==="LENGTHUNIT");if(i){const h=this.convertUnit(i);a.coordinate_system.unit=h}a.id=this.getId(e);break;case"BASEGEOGCRS":case"GEOGCRS":a.type="GeographicCRS",a.name=e[1];const r=e.find(h=>Array.isArray(h)&&(h[0]==="DATUM"||h[0]==="ENSEMBLE"));if(r){const h=this.convert(r);r[0]==="ENSEMBLE"?a.datum_ensemble=h:a.datum=h;const f=e.find(p=>Array.isArray(p)&&p[0]==="PRIMEM");f&&f[1]!=="Greenwich"&&(h.prime_meridian={name:f[1],longitude:parseFloat(f[2])})}a.coordinate_system={type:"ellipsoidal",axis:this.extractAxes(e)},a.id=this.getId(e);break;case"DATUM":a.type="GeodeticReferenceFrame",a.name=e[1],a.ellipsoid=e.find(h=>Array.isArray(h)&&h[0]==="ELLIPSOID")?this.convert(e.find(h=>Array.isArray(h)&&h[0]==="ELLIPSOID")):null;break;case"ENSEMBLE":a.type="DatumEnsemble",a.name=e[1],a.members=e.filter(h=>Array.isArray(h)&&h[0]==="MEMBER").map(h=>({type:"DatumEnsembleMember",name:h[1],id:this.getId(h)}));const o=e.find(h=>Array.isArray(h)&&h[0]==="ENSEMBLEACCURACY");o&&(a.accuracy=parseFloat(o[1]));const n=e.find(h=>Array.isArray(h)&&h[0]==="ELLIPSOID");n&&(a.ellipsoid=this.convert(n)),a.id=this.getId(e);break;case"ELLIPSOID":a.type="Ellipsoid",a.name=e[1],a.semi_major_axis=parseFloat(e[2]),a.inverse_flattening=parseFloat(e[3]),e.find(h=>Array.isArray(h)&&h[0]==="LENGTHUNIT")&&this.convert(e.find(h=>Array.isArray(h)&&h[0]==="LENGTHUNIT"),a);break;case"CONVERSION":a.type="Conversion",a.name=e[1],a.method=e.find(h=>Array.isArray(h)&&h[0]==="METHOD")?this.convert(e.find(h=>Array.isArray(h)&&h[0]==="METHOD")):null,a.parameters=e.filter(h=>Array.isArray(h)&&h[0]==="PARAMETER").map(h=>this.convert(h));break;case"METHOD":a.type="Method",a.name=e[1],a.id=this.getId(e);break;case"PARAMETER":a.type="Parameter",a.name=e[1],a.value=parseFloat(e[2]),a.unit=this.convertUnit(e.find(h=>Array.isArray(h)&&(h[0]==="LENGTHUNIT"||h[0]==="ANGLEUNIT"||h[0]==="SCALEUNIT"))),a.id=this.getId(e);break;case"BOUNDCRS":a.type="BoundCRS";const l=e.find(h=>Array.isArray(h)&&h[0]==="SOURCECRS");if(l){const h=l.find(f=>Array.isArray(f));a.source_crs=h?this.convert(h):null}const c=e.find(h=>Array.isArray(h)&&h[0]==="TARGETCRS");if(c){const h=c.find(f=>Array.isArray(f));a.target_crs=h?this.convert(h):null}const u=e.find(h=>Array.isArray(h)&&h[0]==="ABRIDGEDTRANSFORMATION");u?a.transformation=this.convert(u):a.transformation=null;break;case"ABRIDGEDTRANSFORMATION":if(a.type="Transformation",a.name=e[1],a.method=e.find(h=>Array.isArray(h)&&h[0]==="METHOD")?this.convert(e.find(h=>Array.isArray(h)&&h[0]==="METHOD")):null,a.parameters=e.filter(h=>Array.isArray(h)&&(h[0]==="PARAMETER"||h[0]==="PARAMETERFILE")).map(h=>{if(h[0]==="PARAMETER")return this.convert(h);if(h[0]==="PARAMETERFILE")return{name:h[1],value:h[2],id:{authority:"EPSG",code:8656}}}),a.parameters.length===7){const h=a.parameters[6];h.name==="Scale difference"&&(h.value=Math.round((h.value-1)*1e12)/1e6)}a.id=this.getId(e);break;case"AXIS":a.coordinate_system||(a.coordinate_system={type:"unspecified",axis:[]}),a.coordinate_system.axis.push(this.convertAxis(e));break;case"LENGTHUNIT":const d=this.convertUnit(e,"LinearUnit");a.coordinate_system&&a.coordinate_system.axis&&a.coordinate_system.axis.forEach(h=>{h.unit||(h.unit=d)}),d.conversion_factor&&d.conversion_factor!==1&&a.semi_major_axis&&(a.semi_major_axis={value:a.semi_major_axis,unit:d});break;default:a.keyword=e[0];break}return a}}class gc extends sn{static convert(e,a={}){return super.convert(e,a),a.coordinate_system&&a.coordinate_system.subtype==="Cartesian"&&delete a.coordinate_system,a.usage&&delete a.usage,a}}class mc extends sn{static convert(e,a={}){super.convert(e,a);const s=e.find(r=>Array.isArray(r)&&r[0]==="CS");s&&(a.coordinate_system={subtype:s[1],axis:this.extractAxes(e)});const i=e.find(r=>Array.isArray(r)&&r[0]==="USAGE");if(i){const r=i.find(l=>Array.isArray(l)&&l[0]==="SCOPE"),o=i.find(l=>Array.isArray(l)&&l[0]==="AREA"),n=i.find(l=>Array.isArray(l)&&l[0]==="BBOX");a.usage={},r&&(a.usage.scope=r[1]),o&&(a.usage.area=o[1]),n&&(a.usage.bbox=n.slice(1))}return a}}function vc(t){return t.find(e=>Array.isArray(e)&&e[0]==="USAGE")?"2019":(t.find(e=>Array.isArray(e)&&e[0]==="CS")||t[0]==="BOUNDCRS"||t[0]==="PROJCRS"||t[0]==="GEOGCRS","2015")}function yc(t){return(vc(t)==="2019"?mc:gc).convert(t)}function bc(t){const e=t.toUpperCase();return e.includes("PROJCRS")||e.includes("GEOGCRS")||e.includes("BOUNDCRS")||e.includes("VERTCRS")||e.includes("LENGTHUNIT")||e.includes("ANGLEUNIT")||e.includes("SCALEUNIT")?"WKT2":(e.includes("PROJCS")||e.includes("GEOGCS")||e.includes("LOCAL_CS")||e.includes("VERT_CS")||e.includes("UNIT"),"WKT1")}var ra=1,rn=2,nn=3,Ia=4,on=5,si=-1,_c=/\s/,Mc=/[A-Za-z]/,xc=/[A-Za-z84_]/,as=/[,\]]/,ln=/[\d\.E\-\+]/;function Zt(t){if(typeof t!="string")throw new Error("not a string");this.text=t.trim(),this.level=0,this.place=0,this.root=null,this.stack=[],this.currentObject=null,this.state=ra}Zt.prototype.readCharicter=function(){var t=this.text[this.place++];if(this.state!==Ia)for(;_c.test(t);){if(this.place>=this.text.length)return;t=this.text[this.place++]}switch(this.state){case ra:return this.neutral(t);case rn:return this.keyword(t);case Ia:return this.quoted(t);case on:return this.afterquote(t);case nn:return this.number(t);case si:return}};Zt.prototype.afterquote=function(t){if(t==='"'){this.word+='"',this.state=Ia;return}if(as.test(t)){this.word=this.word.trim(),this.afterItem(t);return}throw new Error(`havn't handled "`+t+'" in afterquote yet, index '+this.place)};Zt.prototype.afterItem=function(t){if(t===","){this.word!==null&&this.currentObject.push(this.word),this.word=null,this.state=ra;return}if(t==="]"){this.level--,this.word!==null&&(this.currentObject.push(this.word),this.word=null),this.state=ra,this.currentObject=this.stack.pop(),this.currentObject||(this.state=si);return}};Zt.prototype.number=function(t){if(ln.test(t)){this.word+=t;return}if(as.test(t)){this.word=parseFloat(this.word),this.afterItem(t);return}throw new Error(`havn't handled "`+t+'" in number yet, index '+this.place)};Zt.prototype.quoted=function(t){if(t==='"'){this.state=on;return}this.word+=t};Zt.prototype.keyword=function(t){if(xc.test(t)){this.word+=t;return}if(t==="["){var e=[];e.push(this.word),this.level++,this.root===null?this.root=e:this.currentObject.push(e),this.stack.push(this.currentObject),this.currentObject=e,this.state=ra;return}if(as.test(t)){this.afterItem(t);return}throw new Error(`havn't handled "`+t+'" in keyword yet, index '+this.place)};Zt.prototype.neutral=function(t){if(Mc.test(t)){this.word=t,this.state=rn;return}if(t==='"'){this.word="",this.state=Ia;return}if(ln.test(t)){this.word=t,this.state=nn;return}if(as.test(t)){this.afterItem(t);return}throw new Error(`havn't handled "`+t+'" in neutral yet, index '+this.place)};Zt.prototype.output=function(){for(;this.place<this.text.length;)this.readCharicter();if(this.state===si)return this.root;throw new Error('unable to parse string "'+this.text+'". State is '+this.state)};function wc(t){var e=new Zt(t);return e.output()}function hs(t,e,a){Array.isArray(e)&&(a.unshift(e),e=null);var s=e?{}:t,i=a.reduce(function(r,o){return Ee(o,r),r},s);e&&(t[e]=i)}function Ee(t,e){if(!Array.isArray(t)){e[t]=!0;return}var a=t.shift();if(a==="PARAMETER"&&(a=t.shift()),t.length===1){if(Array.isArray(t[0])){e[a]={},Ee(t[0],e[a]);return}e[a]=t[0];return}if(!t.length){e[a]=!0;return}if(a==="TOWGS84"){e[a]=t;return}if(a==="AXIS"){a in e||(e[a]=[]),e[a].push(t);return}Array.isArray(a)||(e[a]={});var s;switch(a){case"UNIT":case"PRIMEM":case"VERT_DATUM":e[a]={name:t[0].toLowerCase(),convert:t[1]},t.length===3&&Ee(t[2],e[a]);return;case"SPHEROID":case"ELLIPSOID":e[a]={name:t[0],a:t[1],rf:t[2]},t.length===4&&Ee(t[3],e[a]);return;case"EDATUM":case"ENGINEERINGDATUM":case"LOCAL_DATUM":case"DATUM":case"VERT_CS":case"VERTCRS":case"VERTICALCRS":t[0]=["name",t[0]],hs(e,a,t);return;case"COMPD_CS":case"COMPOUNDCRS":case"FITTED_CS":case"PROJECTEDCRS":case"PROJCRS":case"GEOGCS":case"GEOCCS":case"PROJCS":case"LOCAL_CS":case"GEODCRS":case"GEODETICCRS":case"GEODETICDATUM":case"ENGCRS":case"ENGINEERINGCRS":t[0]=["name",t[0]],hs(e,a,t),e[a].type=a;return;default:for(s=-1;++s<t.length;)if(!Array.isArray(t[s]))return Ee(t,e[a]);return hs(e,a,t)}}var Sc=.017453292519943295;function Nt(t){return t*Sc}function cn(t){const e=(t.projName||"").toLowerCase().replace(/_/g," ");!t.long0&&t.longc&&(e==="albers conic equal area"||e==="lambert azimuthal equal area")&&(t.long0=t.longc),!t.lat_ts&&t.lat1&&(e==="stereographic south pole"||e==="polar stereographic (variant b)")?(t.lat0=Nt(t.lat1>0?90:-90),t.lat_ts=t.lat1,delete t.lat1):!t.lat_ts&&t.lat0&&(e==="polar stereographic"||e==="polar stereographic (variant a)")&&(t.lat_ts=t.lat0,t.lat0=Nt(t.lat0>0?90:-90),delete t.lat1)}function zi(t){let e={units:null,to_meter:void 0};return typeof t=="string"?(e.units=t.toLowerCase(),e.units==="metre"&&(e.units="meter"),e.units==="meter"&&(e.to_meter=1)):t&&t.name&&(e.units=t.name.toLowerCase(),e.units==="metre"&&(e.units="meter"),e.to_meter=t.conversion_factor),e}function Ui(t){return typeof t=="object"?t.value*t.unit.conversion_factor:t}function Hi(t,e){t.ellipsoid.radius?(e.a=t.ellipsoid.radius,e.rf=0):(e.a=Ui(t.ellipsoid.semi_major_axis),t.ellipsoid.inverse_flattening!==void 0?e.rf=t.ellipsoid.inverse_flattening:t.ellipsoid.semi_major_axis!==void 0&&t.ellipsoid.semi_minor_axis!==void 0&&(e.rf=e.a/(e.a-Ui(t.ellipsoid.semi_minor_axis))))}function Ba(t,e={}){return!t||typeof t!="object"?t:t.type==="BoundCRS"?(Ba(t.source_crs,e),t.transformation&&(t.transformation.method&&t.transformation.method.name==="NTv2"?e.nadgrids=t.transformation.parameters[0].value:e.datum_params=t.transformation.parameters.map(a=>a.value)),e):(Object.keys(t).forEach(a=>{const s=t[a];if(s!==null)switch(a){case"name":if(e.srsCode)break;e.name=s,e.srsCode=s;break;case"type":s==="GeographicCRS"?e.projName="longlat":s==="ProjectedCRS"&&t.conversion&&t.conversion.method&&(e.projName=t.conversion.method.name);break;case"datum":case"datum_ensemble":s.ellipsoid&&(e.ellps=s.ellipsoid.name,Hi(s,e)),s.prime_meridian&&(e.from_greenwich=s.prime_meridian.longitude*Math.PI/180);break;case"ellipsoid":e.ellps=s.name,Hi(s,e);break;case"prime_meridian":e.long0=(s.longitude||0)*Math.PI/180;break;case"coordinate_system":if(s.axis){if(e.axis=s.axis.map(i=>{const r=i.direction;if(r==="east")return"e";if(r==="north")return"n";if(r==="west")return"w";if(r==="south")return"s";throw new Error(`Unknown axis direction: ${r}`)}).join("")+"u",s.unit){const{units:i,to_meter:r}=zi(s.unit);e.units=i,e.to_meter=r}else if(s.axis[0]&&s.axis[0].unit){const{units:i,to_meter:r}=zi(s.axis[0].unit);e.units=i,e.to_meter=r}}break;case"id":s.authority&&s.code&&(e.title=s.authority+":"+s.code);break;case"conversion":s.method&&s.method.name&&(e.projName=s.method.name),s.parameters&&s.parameters.forEach(i=>{const r=i.name.toLowerCase().replace(/\s+/g,"_"),o=i.value;i.unit&&i.unit.conversion_factor?e[r]=o*i.unit.conversion_factor:i.unit==="degree"?e[r]=o*Math.PI/180:e[r]=o});break;case"unit":s.name&&(e.units=s.name.toLowerCase(),e.units==="metre"&&(e.units="meter")),s.conversion_factor&&(e.to_meter=s.conversion_factor);break;case"base_crs":Ba(s,e),e.datumCode=s.id?s.id.authority+"_"+s.id.code:s.name;break}}),e.latitude_of_false_origin!==void 0&&(e.lat0=e.latitude_of_false_origin),e.longitude_of_false_origin!==void 0&&(e.long0=e.longitude_of_false_origin),e.latitude_of_standard_parallel!==void 0&&(e.lat0=e.latitude_of_standard_parallel,e.lat1=e.latitude_of_standard_parallel),e.latitude_of_1st_standard_parallel!==void 0&&(e.lat1=e.latitude_of_1st_standard_parallel),e.latitude_of_2nd_standard_parallel!==void 0&&(e.lat2=e.latitude_of_2nd_standard_parallel),e.latitude_of_projection_centre!==void 0&&(e.lat0=e.latitude_of_projection_centre),e.longitude_of_projection_centre!==void 0&&(e.longc=e.longitude_of_projection_centre),e.easting_at_false_origin!==void 0&&(e.x0=e.easting_at_false_origin),e.northing_at_false_origin!==void 0&&(e.y0=e.northing_at_false_origin),e.latitude_of_natural_origin!==void 0&&(e.lat0=e.latitude_of_natural_origin),e.longitude_of_natural_origin!==void 0&&(e.long0=e.longitude_of_natural_origin),e.longitude_of_origin!==void 0&&(e.long0=e.longitude_of_origin),e.false_easting!==void 0&&(e.x0=e.false_easting),e.easting_at_projection_centre&&(e.x0=e.easting_at_projection_centre),e.false_northing!==void 0&&(e.y0=e.false_northing),e.northing_at_projection_centre&&(e.y0=e.northing_at_projection_centre),e.standard_parallel_1!==void 0&&(e.lat1=e.standard_parallel_1),e.standard_parallel_2!==void 0&&(e.lat2=e.standard_parallel_2),e.scale_factor_at_natural_origin!==void 0&&(e.k0=e.scale_factor_at_natural_origin),e.scale_factor_at_projection_centre!==void 0&&(e.k0=e.scale_factor_at_projection_centre),e.scale_factor_on_pseudo_standard_parallel!==void 0&&(e.k0=e.scale_factor_on_pseudo_standard_parallel),e.azimuth!==void 0&&(e.alpha=e.azimuth),e.azimuth_at_projection_centre!==void 0&&(e.alpha=e.azimuth_at_projection_centre),e.angle_from_rectified_to_skew_grid&&(e.rectified_grid_angle=e.angle_from_rectified_to_skew_grid),cn(e),e)}var Ec=["PROJECTEDCRS","PROJCRS","GEOGCS","GEOCCS","PROJCS","LOCAL_CS","GEODCRS","GEODETICCRS","GEODETICDATUM","ENGCRS","ENGINEERINGCRS"];function Ac(t,e){var a=e[0],s=e[1];!(a in t)&&s in t&&(t[a]=t[s],e.length===3&&(t[a]=e[2](t[a])))}function dn(t){for(var e=Object.keys(t),a=0,s=e.length;a<s;++a){var i=e[a];Ec.indexOf(i)!==-1&&Pc(t[i]),typeof t[i]=="object"&&dn(t[i])}}function Pc(t){if(t.AUTHORITY){var e=Object.keys(t.AUTHORITY)[0];e&&e in t.AUTHORITY&&(t.title=e+":"+t.AUTHORITY[e])}if(t.type==="GEOGCS"?t.projName="longlat":t.type==="LOCAL_CS"?(t.projName="identity",t.local=!0):typeof t.PROJECTION=="object"?t.projName=Object.keys(t.PROJECTION)[0]:t.projName=t.PROJECTION,t.AXIS){for(var a="",s=0,i=t.AXIS.length;s<i;++s){var r=[t.AXIS[s][0].toLowerCase(),t.AXIS[s][1].toLowerCase()];r[0].indexOf("north")!==-1||(r[0]==="y"||r[0]==="lat")&&r[1]==="north"?a+="n":r[0].indexOf("south")!==-1||(r[0]==="y"||r[0]==="lat")&&r[1]==="south"?a+="s":r[0].indexOf("east")!==-1||(r[0]==="x"||r[0]==="lon")&&r[1]==="east"?a+="e":(r[0].indexOf("west")!==-1||(r[0]==="x"||r[0]==="lon")&&r[1]==="west")&&(a+="w")}a.length===2&&(a+="u"),a.length===3&&(t.axis=a)}t.UNIT&&(t.units=t.UNIT.name.toLowerCase(),t.units==="metre"&&(t.units="meter"),t.UNIT.convert&&(t.type==="GEOGCS"?t.DATUM&&t.DATUM.SPHEROID&&(t.to_meter=t.UNIT.convert*t.DATUM.SPHEROID.a):t.to_meter=t.UNIT.convert));var o=t.GEOGCS;t.type==="GEOGCS"&&(o=t),o&&(o.DATUM?t.datumCode=o.DATUM.name.toLowerCase():t.datumCode=o.name.toLowerCase(),t.datumCode.slice(0,2)==="d_"&&(t.datumCode=t.datumCode.slice(2)),t.datumCode==="new_zealand_1949"&&(t.datumCode="nzgd49"),(t.datumCode==="wgs_1984"||t.datumCode==="world_geodetic_system_1984")&&(t.PROJECTION==="Mercator_Auxiliary_Sphere"&&(t.sphere=!0),t.datumCode="wgs84"),t.datumCode==="belge_1972"&&(t.datumCode="rnb72"),o.DATUM&&o.DATUM.SPHEROID&&(t.ellps=o.DATUM.SPHEROID.name.replace("_19","").replace(/[Cc]larke\_18/,"clrk"),t.ellps.toLowerCase().slice(0,13)==="international"&&(t.ellps="intl"),t.a=o.DATUM.SPHEROID.a,t.rf=parseFloat(o.DATUM.SPHEROID.rf,10)),o.DATUM&&o.DATUM.TOWGS84&&(t.datum_params=o.DATUM.TOWGS84),~t.datumCode.indexOf("osgb_1936")&&(t.datumCode="osgb36"),~t.datumCode.indexOf("osni_1952")&&(t.datumCode="osni52"),(~t.datumCode.indexOf("tm65")||~t.datumCode.indexOf("geodetic_datum_of_1965"))&&(t.datumCode="ire65"),t.datumCode==="ch1903+"&&(t.datumCode="ch1903"),~t.datumCode.indexOf("israel")&&(t.datumCode="isr93")),t.b&&!isFinite(t.b)&&(t.b=t.a),t.rectified_grid_angle&&(t.rectified_grid_angle=Nt(t.rectified_grid_angle));function n(u){var d=t.to_meter||1;return u*d}var l=function(u){return Ac(t,u)},c=[["standard_parallel_1","Standard_Parallel_1"],["standard_parallel_1","Latitude of 1st standard parallel"],["standard_parallel_2","Standard_Parallel_2"],["standard_parallel_2","Latitude of 2nd standard parallel"],["false_easting","False_Easting"],["false_easting","False easting"],["false-easting","Easting at false origin"],["false_northing","False_Northing"],["false_northing","False northing"],["false_northing","Northing at false origin"],["central_meridian","Central_Meridian"],["central_meridian","Longitude of natural origin"],["central_meridian","Longitude of false origin"],["latitude_of_origin","Latitude_Of_Origin"],["latitude_of_origin","Central_Parallel"],["latitude_of_origin","Latitude of natural origin"],["latitude_of_origin","Latitude of false origin"],["scale_factor","Scale_Factor"],["k0","scale_factor"],["latitude_of_center","Latitude_Of_Center"],["latitude_of_center","Latitude_of_center"],["lat0","latitude_of_center",Nt],["longitude_of_center","Longitude_Of_Center"],["longitude_of_center","Longitude_of_center"],["longc","longitude_of_center",Nt],["x0","false_easting",n],["y0","false_northing",n],["long0","central_meridian",Nt],["lat0","latitude_of_origin",Nt],["lat0","standard_parallel_1",Nt],["lat1","standard_parallel_1",Nt],["lat2","standard_parallel_2",Nt],["azimuth","Azimuth"],["alpha","azimuth",Nt],["srsCode","name"]];c.forEach(l),cn(t)}function Da(t){if(typeof t=="object")return Ba(t);const e=bc(t);var a=wc(t);if(e==="WKT2"){const r=yc(a);return Ba(r)}var s=a[0],i={};return Ee(a,i),dn(i),i[s]}function yt(t){var e=this;if(arguments.length===2){var a=arguments[1];typeof a=="string"?a.charAt(0)==="+"?yt[t]=Es(arguments[1]):yt[t]=Da(arguments[1]):a&&typeof a=="object"&&!("projName"in a)?yt[t]=Da(arguments[1]):(yt[t]=a,a||delete yt[t])}else if(arguments.length===1){if(Array.isArray(t))return t.map(function(s){return Array.isArray(s)?yt.apply(e,s):yt(s)});if(typeof t=="string"){if(t in yt)return yt[t]}else"EPSG"in t?yt["EPSG:"+t.EPSG]=t:"ESRI"in t?yt["ESRI:"+t.ESRI]=t:"IAU2000"in t?yt["IAU2000:"+t.IAU2000]=t:console.log(t);return}}lc(yt);function kc(t){return typeof t=="string"}function Cc(t){return t in yt}function Tc(t){return t.indexOf("+")!==0&&t.indexOf("[")!==-1||typeof t=="object"&&!("srsCode"in t)}var $c=["3857","900913","3785","102113"];function Lc(t){var e=ie(t,"authority");if(e){var a=ie(e,"epsg");return a&&$c.indexOf(a)>-1}}function Gc(t){var e=ie(t,"extension");if(e)return ie(e,"proj4")}function Nc(t){return t[0]==="+"}function Rc(t){if(kc(t)){if(Cc(t))return yt[t];if(Tc(t)){var e=Da(t);if(Lc(e))return yt["EPSG:3857"];var a=Gc(e);return a?Es(a):e}if(Nc(t))return Es(t)}else return"projName"in t?t:Da(t)}function Vi(t,e){t=t||{};var a,s;if(!e)return t;for(s in e)a=e[s],a!==void 0&&(t[s]=a);return t}function zt(t,e,a){var s=t*e;return a/Math.sqrt(1-s*s)}function ua(t){return t<0?-1:1}function R(t,e){return e||Math.abs(t)<=pt?t:t-ua(t)*ia}function Bt(t,e,a){var s=t*a,i=.5*t;return s=Math.pow((1-s)/(1+s),i),Math.tan(.5*(M-e))/s}function na(t,e){for(var a=.5*t,s,i,r=M-2*Math.atan(e),o=0;o<=15;o++)if(s=t*Math.sin(r),i=M-2*Math.atan(e*Math.pow((1-s)/(1+s),a))-r,r+=i,Math.abs(i)<=1e-10)return r;return-9999}function Ic(){var t=this.b/this.a;this.es=1-t*t,"x0"in this||(this.x0=0),"y0"in this||(this.y0=0),this.e=Math.sqrt(this.es),this.lat_ts?this.sphere?this.k0=Math.cos(this.lat_ts):this.k0=zt(this.e,Math.sin(this.lat_ts),Math.cos(this.lat_ts)):this.k0||(this.k?this.k0=this.k:this.k0=1)}function Bc(t){var e=t.x,a=t.y;if(a*St>90&&a*St<-90&&e*St>180&&e*St<-180)return null;var s,i;if(Math.abs(Math.abs(a)-M)<=T)return null;if(this.sphere)s=this.x0+this.a*this.k0*R(e-this.long0,this.over),i=this.y0+this.a*this.k0*Math.log(Math.tan(X+.5*a));else{var r=Math.sin(a),o=Bt(this.e,a,r);s=this.x0+this.a*this.k0*R(e-this.long0,this.over),i=this.y0-this.a*this.k0*Math.log(o)}return t.x=s,t.y=i,t}function Dc(t){var e=t.x-this.x0,a=t.y-this.y0,s,i;if(this.sphere)i=M-2*Math.atan(Math.exp(-a/(this.a*this.k0)));else{var r=Math.exp(-a/(this.a*this.k0));if(i=na(this.e,r),i===-9999)return null}return s=R(this.long0+e/(this.a*this.k0),this.over),t.x=s,t.y=i,t}var Fc=["Mercator","Popular Visualisation Pseudo Mercator","Mercator_1SP","Mercator_Auxiliary_Sphere","Mercator_Variant_A","merc"];const Oc={init:Ic,forward:Bc,inverse:Dc,names:Fc};function jc(){}function Wi(t){return t}var hn=["longlat","identity"];const qc={init:jc,forward:Wi,inverse:Wi,names:hn};var zc=[Oc,qc],ue={},Ae=[];function un(t,e){var a=Ae.length;return t.names?(Ae[a]=t,t.names.forEach(function(s){ue[s.toLowerCase()]=a}),this):(console.log(e),!0)}function pn(t){return t.replace(/[-\(\)\s]+/g," ").trim().replace(/ /g,"_")}function Uc(t){if(!t)return!1;var e=t.toLowerCase();if(typeof ue[e]<"u"&&Ae[ue[e]]||(e=pn(e),e in ue&&Ae[ue[e]]))return Ae[ue[e]]}function Hc(){zc.forEach(un)}const Vc={start:Hc,add:un,get:Uc};var fn={MERIT:{a:6378137,rf:298.257,ellipseName:"MERIT 1983"},SGS85:{a:6378136,rf:298.257,ellipseName:"Soviet Geodetic System 85"},GRS80:{a:6378137,rf:298.257222101,ellipseName:"GRS 1980(IUGG, 1980)"},IAU76:{a:6378140,rf:298.257,ellipseName:"IAU 1976"},airy:{a:6377563396e-3,b:635625691e-2,ellipseName:"Airy 1830"},APL4:{a:6378137,rf:298.25,ellipseName:"Appl. Physics. 1965"},NWL9D:{a:6378145,rf:298.25,ellipseName:"Naval Weapons Lab., 1965"},mod_airy:{a:6377340189e-3,b:6356034446e-3,ellipseName:"Modified Airy"},andrae:{a:637710443e-2,rf:300,ellipseName:"Andrae 1876 (Den., Iclnd.)"},aust_SA:{a:6378160,rf:298.25,ellipseName:"Australian Natl & S. Amer. 1969"},GRS67:{a:6378160,rf:298.247167427,ellipseName:"GRS 67(IUGG 1967)"},bessel:{a:6377397155e-3,rf:299.1528128,ellipseName:"Bessel 1841"},bess_nam:{a:6377483865e-3,rf:299.1528128,ellipseName:"Bessel 1841 (Namibia)"},clrk66:{a:63782064e-1,b:63565838e-1,ellipseName:"Clarke 1866"},clrk80:{a:6378249145e-3,rf:293.4663,ellipseName:"Clarke 1880 mod."},clrk80ign:{a:63782492e-1,b:6356515,rf:293.4660213,ellipseName:"Clarke 1880 (IGN)"},clrk58:{a:6378293645208759e-9,rf:294.2606763692654,ellipseName:"Clarke 1858"},CPM:{a:63757387e-1,rf:334.29,ellipseName:"Comm. des Poids et Mesures 1799"},delmbr:{a:6376428,rf:311.5,ellipseName:"Delambre 1810 (Belgium)"},engelis:{a:637813605e-2,rf:298.2566,ellipseName:"Engelis 1985"},evrst30:{a:6377276345e-3,rf:300.8017,ellipseName:"Everest 1830"},evrst48:{a:6377304063e-3,rf:300.8017,ellipseName:"Everest 1948"},evrst56:{a:6377301243e-3,rf:300.8017,ellipseName:"Everest 1956"},evrst69:{a:6377295664e-3,rf:300.8017,ellipseName:"Everest 1969"},evrstSS:{a:6377298556e-3,rf:300.8017,ellipseName:"Everest (Sabah & Sarawak)"},fschr60:{a:6378166,rf:298.3,ellipseName:"Fischer (Mercury Datum) 1960"},fschr60m:{a:6378155,rf:298.3,ellipseName:"Fischer 1960"},fschr68:{a:6378150,rf:298.3,ellipseName:"Fischer 1968"},helmert:{a:6378200,rf:298.3,ellipseName:"Helmert 1906"},hough:{a:6378270,rf:297,ellipseName:"Hough"},intl:{a:6378388,rf:297,ellipseName:"International 1909 (Hayford)"},kaula:{a:6378163,rf:298.24,ellipseName:"Kaula 1961"},lerch:{a:6378139,rf:298.257,ellipseName:"Lerch 1979"},mprts:{a:6397300,rf:191,ellipseName:"Maupertius 1738"},new_intl:{a:63781575e-1,b:63567722e-1,ellipseName:"New International 1967"},plessis:{a:6376523,rf:6355863,ellipseName:"Plessis 1817 (France)"},krass:{a:6378245,rf:298.3,ellipseName:"Krassovsky, 1942"},SEasia:{a:6378155,b:63567733205e-4,ellipseName:"Southeast Asia"},walbeck:{a:6376896,b:63558348467e-4,ellipseName:"Walbeck"},WGS60:{a:6378165,rf:298.3,ellipseName:"WGS 60"},WGS66:{a:6378145,rf:298.25,ellipseName:"WGS 66"},WGS7:{a:6378135,rf:298.26,ellipseName:"WGS 72"},WGS84:{a:6378137,rf:298.257223563,ellipseName:"WGS 84"},sphere:{a:6370997,b:6370997,ellipseName:"Normal Sphere (r=6370997)"}};const Wc=fn.WGS84;function Kc(t,e,a,s){var i=t*t,r=e*e,o=(i-r)/i,n=0;s?(t*=1-o*(hc+o*(uc+o*pc)),i=t*t,o=0):n=Math.sqrt(o);var l=(i-r)/r;return{es:o,e:n,ep2:l}}function Jc(t,e,a,s,i){if(!t){var r=ie(fn,s);r||(r=Wc),t=r.a,e=r.b,a=r.rf}return a&&!e&&(e=(1-1/a)*t),(a===0||Math.abs(t-e)<T)&&(i=!0,e=t),{a:t,b:e,rf:a,sphere:i}}var Aa={wgs84:{towgs84:"0,0,0",ellipse:"WGS84",datumName:"WGS84"},ch1903:{towgs84:"674.374,15.056,405.346",ellipse:"bessel",datumName:"swiss"},ggrs87:{towgs84:"-199.87,74.79,246.62",ellipse:"GRS80",datumName:"Greek_Geodetic_Reference_System_1987"},nad83:{towgs84:"0,0,0",ellipse:"GRS80",datumName:"North_American_Datum_1983"},nad27:{nadgrids:"@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",ellipse:"clrk66",datumName:"North_American_Datum_1927"},potsdam:{towgs84:"598.1,73.7,418.2,0.202,0.045,-2.455,6.7",ellipse:"bessel",datumName:"Potsdam Rauenberg 1950 DHDN"},carthage:{towgs84:"-263.0,6.0,431.0",ellipse:"clark80",datumName:"Carthage 1934 Tunisia"},hermannskogel:{towgs84:"577.326,90.129,463.919,5.137,1.474,5.297,2.4232",ellipse:"bessel",datumName:"Hermannskogel"},mgi:{towgs84:"577.326,90.129,463.919,5.137,1.474,5.297,2.4232",ellipse:"bessel",datumName:"Militar-Geographische Institut"},osni52:{towgs84:"482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",ellipse:"airy",datumName:"Irish National"},ire65:{towgs84:"482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",ellipse:"mod_airy",datumName:"Ireland 1965"},rassadiran:{towgs84:"-133.63,-157.5,-158.62",ellipse:"intl",datumName:"Rassadiran"},nzgd49:{towgs84:"59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",ellipse:"intl",datumName:"New Zealand Geodetic Datum 1949"},osgb36:{towgs84:"446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",ellipse:"airy",datumName:"Ordnance Survey of Great Britain 1936"},s_jtsk:{towgs84:"589,76,480",ellipse:"bessel",datumName:"S-JTSK (Ferro)"},beduaram:{towgs84:"-106,-87,188",ellipse:"clrk80",datumName:"Beduaram"},gunung_segara:{towgs84:"-403,684,41",ellipse:"bessel",datumName:"Gunung Segara Jakarta"},rnb72:{towgs84:"106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",ellipse:"intl",datumName:"Reseau National Belge 1972"},EPSG_5451:{towgs84:"6.41,-49.05,-11.28,1.5657,0.5242,6.9718,-5.7649"},IGNF_LURESG:{towgs84:"-192.986,13.673,-39.309,-0.4099,-2.9332,2.6881,0.43"},EPSG_4614:{towgs84:"-119.4248,-303.65872,-11.00061,1.164298,0.174458,1.096259,3.657065"},EPSG_4615:{towgs84:"-494.088,-312.129,279.877,-1.423,-1.013,1.59,-0.748"},ESRI_37241:{towgs84:"-76.822,257.457,-12.817,2.136,-0.033,-2.392,-0.031"},ESRI_37249:{towgs84:"-440.296,58.548,296.265,1.128,10.202,4.559,-0.438"},ESRI_37245:{towgs84:"-511.151,-181.269,139.609,1.05,2.703,1.798,3.071"},EPSG_4178:{towgs84:"24.9,-126.4,-93.2,-0.063,-0.247,-0.041,1.01"},EPSG_4622:{towgs84:"-472.29,-5.63,-304.12,0.4362,-0.8374,0.2563,1.8984"},EPSG_4625:{towgs84:"126.93,547.94,130.41,-2.7867,5.1612,-0.8584,13.8227"},EPSG_5252:{towgs84:"0.023,0.036,-0.068,0.00176,0.00912,-0.01136,0.00439"},EPSG_4314:{towgs84:"597.1,71.4,412.1,0.894,0.068,-1.563,7.58"},EPSG_4282:{towgs84:"-178.3,-316.7,-131.5,5.278,6.077,10.979,19.166"},EPSG_4231:{towgs84:"-83.11,-97.38,-117.22,0.0276,-0.2167,0.2147,0.1218"},EPSG_4274:{towgs84:"-230.994,102.591,25.199,0.633,-0.239,0.9,1.95"},EPSG_4134:{towgs84:"-180.624,-225.516,173.919,-0.81,-1.898,8.336,16.71006"},EPSG_4254:{towgs84:"18.38,192.45,96.82,0.056,-0.142,-0.2,-0.0013"},EPSG_4159:{towgs84:"-194.513,-63.978,-25.759,-3.4027,3.756,-3.352,-0.9175"},EPSG_4687:{towgs84:"0.072,-0.507,-0.245,0.0183,-0.0003,0.007,-0.0093"},EPSG_4227:{towgs84:"-83.58,-397.54,458.78,-17.595,-2.847,4.256,3.225"},EPSG_4746:{towgs84:"599.4,72.4,419.2,-0.062,-0.022,-2.723,6.46"},EPSG_4745:{towgs84:"612.4,77,440.2,-0.054,0.057,-2.797,2.55"},EPSG_6311:{towgs84:"8.846,-4.394,-1.122,-0.00237,-0.146528,0.130428,0.783926"},EPSG_4289:{towgs84:"565.7381,50.4018,465.2904,-1.91514,1.60363,-9.09546,4.07244"},EPSG_4230:{towgs84:"-68.863,-134.888,-111.49,-0.53,-0.14,0.57,-3.4"},EPSG_4154:{towgs84:"-123.02,-158.95,-168.47"},EPSG_4156:{towgs84:"570.8,85.7,462.8,4.998,1.587,5.261,3.56"},EPSG_4299:{towgs84:"482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"},EPSG_4179:{towgs84:"33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84"},EPSG_4313:{towgs84:"-106.8686,52.2978,-103.7239,0.3366,-0.457,1.8422,-1.2747"},EPSG_4194:{towgs84:"163.511,127.533,-159.789"},EPSG_4195:{towgs84:"105,326,-102.5"},EPSG_4196:{towgs84:"-45,417,-3.5"},EPSG_4611:{towgs84:"-162.619,-276.959,-161.764,0.067753,-2.243649,-1.158827,-1.094246"},EPSG_4633:{towgs84:"137.092,131.66,91.475,-1.9436,-11.5993,-4.3321,-7.4824"},EPSG_4641:{towgs84:"-408.809,366.856,-412.987,1.8842,-0.5308,2.1655,-121.0993"},EPSG_4643:{towgs84:"-480.26,-438.32,-643.429,16.3119,20.1721,-4.0349,-111.7002"},EPSG_4300:{towgs84:"482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"},EPSG_4188:{towgs84:"482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"},EPSG_4660:{towgs84:"982.6087,552.753,-540.873,32.39344,-153.25684,-96.2266,16.805"},EPSG_4662:{towgs84:"97.295,-263.247,310.882,-1.5999,0.8386,3.1409,13.3259"},EPSG_3906:{towgs84:"577.88891,165.22205,391.18289,4.9145,-0.94729,-13.05098,7.78664"},EPSG_4307:{towgs84:"-209.3622,-87.8162,404.6198,0.0046,3.4784,0.5805,-1.4547"},EPSG_6892:{towgs84:"-76.269,-16.683,68.562,-6.275,10.536,-4.286,-13.686"},EPSG_4690:{towgs84:"221.597,152.441,176.523,2.403,1.3893,0.884,11.4648"},EPSG_4691:{towgs84:"218.769,150.75,176.75,3.5231,2.0037,1.288,10.9817"},EPSG_4629:{towgs84:"72.51,345.411,79.241,-1.5862,-0.8826,-0.5495,1.3653"},EPSG_4630:{towgs84:"165.804,216.213,180.26,-0.6251,-0.4515,-0.0721,7.4111"},EPSG_4692:{towgs84:"217.109,86.452,23.711,0.0183,-0.0003,0.007,-0.0093"},EPSG_9333:{towgs84:"0,0,0,-8.393,0.749,-10.276,0"},EPSG_9059:{towgs84:"0,0,0"},EPSG_4312:{towgs84:"601.705,84.263,485.227,4.7354,1.3145,5.393,-2.3887"},EPSG_4123:{towgs84:"-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496"},EPSG_4309:{towgs84:"-124.45,183.74,44.64,-0.4384,0.5446,-0.9706,-2.1365"},ESRI_104106:{towgs84:"-283.088,-70.693,117.445,-1.157,0.059,-0.652,-4.058"},EPSG_4281:{towgs84:"-219.247,-73.802,269.529"},EPSG_4322:{towgs84:"0,0,4.5"},EPSG_4324:{towgs84:"0,0,1.9"},EPSG_4284:{towgs84:"43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549"},EPSG_4277:{towgs84:"446.448,-125.157,542.06,0.15,0.247,0.842,-20.489"},EPSG_4207:{towgs84:"-282.1,-72.2,120,-1.529,0.145,-0.89,-4.46"},EPSG_4688:{towgs84:"347.175,1077.618,2623.677,33.9058,-70.6776,9.4013,186.0647"},EPSG_4689:{towgs84:"410.793,54.542,80.501,-2.5596,-2.3517,-0.6594,17.3218"},EPSG_4720:{towgs84:"0,0,4.5"},EPSG_4273:{towgs84:"278.3,93,474.5,7.889,0.05,-6.61,6.21"},EPSG_4240:{towgs84:"204.64,834.74,293.8"},EPSG_4817:{towgs84:"278.3,93,474.5,7.889,0.05,-6.61,6.21"},ESRI_104131:{towgs84:"426.62,142.62,460.09,4.98,4.49,-12.42,-17.1"},EPSG_4265:{towgs84:"-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68"},EPSG_4263:{towgs84:"-111.92,-87.85,114.5,1.875,0.202,0.219,0.032"},EPSG_4298:{towgs84:"-689.5937,623.84046,-65.93566,-0.02331,1.17094,-0.80054,5.88536"},EPSG_4270:{towgs84:"-253.4392,-148.452,386.5267,0.15605,0.43,-0.1013,-0.0424"},EPSG_4229:{towgs84:"-121.8,98.1,-10.7"},EPSG_4220:{towgs84:"-55.5,-348,-229.2"},EPSG_4214:{towgs84:"12.646,-155.176,-80.863"},EPSG_4232:{towgs84:"-345,3,223"},EPSG_4238:{towgs84:"-1.977,-13.06,-9.993,0.364,0.254,0.689,-1.037"},EPSG_4168:{towgs84:"-170,33,326"},EPSG_4131:{towgs84:"199,931,318.9"},EPSG_4152:{towgs84:"-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"},EPSG_5228:{towgs84:"572.213,85.334,461.94,4.9732,1.529,5.2484,3.5378"},EPSG_8351:{towgs84:"485.021,169.465,483.839,7.786342,4.397554,4.102655,0"},EPSG_4683:{towgs84:"-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06"},EPSG_4133:{towgs84:"0,0,0"},EPSG_7373:{towgs84:"0.819,-0.5762,-1.6446,-0.00378,-0.03317,0.00318,0.0693"},EPSG_9075:{towgs84:"-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"},EPSG_9072:{towgs84:"-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"},EPSG_9294:{towgs84:"1.16835,-1.42001,-2.24431,-0.00822,-0.05508,0.01818,0.23388"},EPSG_4212:{towgs84:"-267.434,173.496,181.814,-13.4704,8.7154,7.3926,14.7492"},EPSG_4191:{towgs84:"-44.183,-0.58,-38.489,2.3867,2.7072,-3.5196,-8.2703"},EPSG_4237:{towgs84:"52.684,-71.194,-13.975,-0.312,-0.1063,-0.3729,1.0191"},EPSG_4740:{towgs84:"-1.08,-0.27,-0.9"},EPSG_4124:{towgs84:"419.3836,99.3335,591.3451,0.850389,1.817277,-7.862238,-0.99496"},EPSG_5681:{towgs84:"584.9636,107.7175,413.8067,1.1155,0.2824,-3.1384,7.9922"},EPSG_4141:{towgs84:"23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262"},EPSG_4204:{towgs84:"-85.645,-273.077,-79.708,2.289,-1.421,2.532,3.194"},EPSG_4319:{towgs84:"226.702,-193.337,-35.371,-2.229,-4.391,9.238,0.9798"},EPSG_4200:{towgs84:"24.82,-131.21,-82.66"},EPSG_4130:{towgs84:"0,0,0"},EPSG_4127:{towgs84:"-82.875,-57.097,-156.768,-2.158,1.524,-0.982,-0.359"},EPSG_4149:{towgs84:"674.374,15.056,405.346"},EPSG_4617:{towgs84:"-0.991,1.9072,0.5129,1.25033e-7,4.6785e-8,5.6529e-8,0"},EPSG_4663:{towgs84:"-210.502,-66.902,-48.476,2.094,-15.067,-5.817,0.485"},EPSG_4664:{towgs84:"-211.939,137.626,58.3,-0.089,0.251,0.079,0.384"},EPSG_4665:{towgs84:"-105.854,165.589,-38.312,-0.003,-0.026,0.024,-0.048"},EPSG_4666:{towgs84:"631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43"},EPSG_4756:{towgs84:"-192.873,-39.382,-111.202,-0.00205,-0.0005,0.00335,0.0188"},EPSG_4723:{towgs84:"-179.483,-69.379,-27.584,-7.862,8.163,6.042,-13.925"},EPSG_4726:{towgs84:"8.853,-52.644,180.304,-0.393,-2.323,2.96,-24.081"},EPSG_4267:{towgs84:"-8.0,160.0,176.0"},EPSG_5365:{towgs84:"-0.16959,0.35312,0.51846,0.03385,-0.16325,0.03446,0.03693"},EPSG_4218:{towgs84:"304.5,306.5,-318.1"},EPSG_4242:{towgs84:"-33.722,153.789,94.959,-8.581,-4.478,4.54,8.95"},EPSG_4216:{towgs84:"-292.295,248.758,429.447,4.9971,2.99,6.6906,1.0289"},ESRI_104105:{towgs84:"631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43"},ESRI_104129:{towgs84:"0,0,0"},EPSG_4673:{towgs84:"174.05,-25.49,112.57"},EPSG_4202:{towgs84:"-124,-60,154"},EPSG_4203:{towgs84:"-117.763,-51.51,139.061,0.292,0.443,0.277,-0.191"},EPSG_3819:{towgs84:"595.48,121.69,515.35,4.115,-2.9383,0.853,-3.408"},EPSG_8694:{towgs84:"-93.799,-132.737,-219.073,-1.844,0.648,-6.37,-0.169"},EPSG_4145:{towgs84:"275.57,676.78,229.6"},EPSG_4283:{towgs84:"61.55,-10.87,-40.19,39.4924,32.7221,32.8979,-9.994"},EPSG_4317:{towgs84:"2.3287,-147.0425,-92.0802,-0.3092483,0.32482185,0.49729934,5.68906266"},EPSG_4272:{towgs84:"59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993"},EPSG_4248:{towgs84:"-307.7,265.3,-363.5"},EPSG_5561:{towgs84:"24,-121,-76"},EPSG_5233:{towgs84:"-0.293,766.95,87.713,0.195704,1.695068,3.473016,-0.039338"},ESRI_104130:{towgs84:"-86,-98,-119"},ESRI_104102:{towgs84:"682,-203,480"},ESRI_37207:{towgs84:"7,-10,-26"},EPSG_4675:{towgs84:"59.935,118.4,-10.871"},ESRI_104109:{towgs84:"-89.121,-348.182,260.871"},ESRI_104112:{towgs84:"-185.583,-230.096,281.361"},ESRI_104113:{towgs84:"25.1,-275.6,222.6"},IGNF_WGS72G:{towgs84:"0,12,6"},IGNF_NTFG:{towgs84:"-168,-60,320"},IGNF_EFATE57G:{towgs84:"-127,-769,472"},IGNF_PGP50G:{towgs84:"324.8,153.6,172.1"},IGNF_REUN47G:{towgs84:"94,-948,-1262"},IGNF_CSG67G:{towgs84:"-186,230,110"},IGNF_GUAD48G:{towgs84:"-467,-16,-300"},IGNF_TAHI51G:{towgs84:"162,117,154"},IGNF_TAHAAG:{towgs84:"65,342,77"},IGNF_NUKU72G:{towgs84:"84,274,65"},IGNF_PETRELS72G:{towgs84:"365,194,166"},IGNF_WALL78G:{towgs84:"253,-133,-127"},IGNF_MAYO50G:{towgs84:"-382,-59,-262"},IGNF_TANNAG:{towgs84:"-139,-967,436"},IGNF_IGN72G:{towgs84:"-13,-348,292"},IGNF_ATIGG:{towgs84:"1118,23,66"},IGNF_FANGA84G:{towgs84:"150.57,158.33,118.32"},IGNF_RUSAT84G:{towgs84:"202.13,174.6,-15.74"},IGNF_KAUE70G:{towgs84:"126.74,300.1,-75.49"},IGNF_MOP90G:{towgs84:"-10.8,-1.8,12.77"},IGNF_MHPF67G:{towgs84:"338.08,212.58,-296.17"},IGNF_TAHI79G:{towgs84:"160.61,116.05,153.69"},IGNF_ANAA92G:{towgs84:"1.5,3.84,4.81"},IGNF_MARQUI72G:{towgs84:"330.91,-13.92,58.56"},IGNF_APAT86G:{towgs84:"143.6,197.82,74.05"},IGNF_TUBU69G:{towgs84:"237.17,171.61,-77.84"},IGNF_STPM50G:{towgs84:"11.363,424.148,373.13"},EPSG_4150:{towgs84:"674.374,15.056,405.346"},EPSG_4754:{towgs84:"-208.4058,-109.8777,-2.5764"},ESRI_104101:{towgs84:"374,150,588"},EPSG_4693:{towgs84:"0,-0.15,0.68"},EPSG_6207:{towgs84:"293.17,726.18,245.36"},EPSG_4153:{towgs84:"-133.63,-157.5,-158.62"},EPSG_4132:{towgs84:"-241.54,-163.64,396.06"},EPSG_4221:{towgs84:"-154.5,150.7,100.4"},EPSG_4266:{towgs84:"-80.7,-132.5,41.1"},EPSG_4193:{towgs84:"-70.9,-151.8,-41.4"},EPSG_5340:{towgs84:"-0.41,0.46,-0.35"},EPSG_4246:{towgs84:"-294.7,-200.1,525.5"},EPSG_4318:{towgs84:"-3.2,-5.7,2.8"},EPSG_4121:{towgs84:"-199.87,74.79,246.62"},EPSG_4223:{towgs84:"-260.1,5.5,432.2"},EPSG_4158:{towgs84:"-0.465,372.095,171.736"},EPSG_4285:{towgs84:"-128.16,-282.42,21.93"},EPSG_4613:{towgs84:"-404.78,685.68,45.47"},EPSG_4607:{towgs84:"195.671,332.517,274.607"},EPSG_4475:{towgs84:"-381.788,-57.501,-256.673"},EPSG_4208:{towgs84:"-157.84,308.54,-146.6"},EPSG_4743:{towgs84:"70.995,-335.916,262.898"},EPSG_4710:{towgs84:"-323.65,551.39,-491.22"},EPSG_7881:{towgs84:"-0.077,0.079,0.086"},EPSG_4682:{towgs84:"283.729,735.942,261.143"},EPSG_4739:{towgs84:"-156,-271,-189"},EPSG_4679:{towgs84:"-80.01,253.26,291.19"},EPSG_4750:{towgs84:"-56.263,16.136,-22.856"},EPSG_4644:{towgs84:"-10.18,-350.43,291.37"},EPSG_4695:{towgs84:"-103.746,-9.614,-255.95"},EPSG_4292:{towgs84:"-355,21,72"},EPSG_4302:{towgs84:"-61.702,284.488,472.052"},EPSG_4143:{towgs84:"-124.76,53,466.79"},EPSG_4606:{towgs84:"-153,153,307"},EPSG_4699:{towgs84:"-770.1,158.4,-498.2"},EPSG_4247:{towgs84:"-273.5,110.6,-357.9"},EPSG_4160:{towgs84:"8.88,184.86,106.69"},EPSG_4161:{towgs84:"-233.43,6.65,173.64"},EPSG_9251:{towgs84:"-9.5,122.9,138.2"},EPSG_9253:{towgs84:"-78.1,101.6,133.3"},EPSG_4297:{towgs84:"-198.383,-240.517,-107.909"},EPSG_4269:{towgs84:"0,0,0"},EPSG_4301:{towgs84:"-147,506,687"},EPSG_4618:{towgs84:"-59,-11,-52"},EPSG_4612:{towgs84:"0,0,0"},EPSG_4678:{towgs84:"44.585,-131.212,-39.544"},EPSG_4250:{towgs84:"-130,29,364"},EPSG_4144:{towgs84:"214,804,268"},EPSG_4147:{towgs84:"-17.51,-108.32,-62.39"},EPSG_4259:{towgs84:"-254.1,-5.36,-100.29"},EPSG_4164:{towgs84:"-76,-138,67"},EPSG_4211:{towgs84:"-378.873,676.002,-46.255"},EPSG_4182:{towgs84:"-422.651,-172.995,84.02"},EPSG_4224:{towgs84:"-143.87,243.37,-33.52"},EPSG_4225:{towgs84:"-205.57,168.77,-4.12"},EPSG_5527:{towgs84:"-67.35,3.88,-38.22"},EPSG_4752:{towgs84:"98,390,-22"},EPSG_4310:{towgs84:"-30,190,89"},EPSG_9248:{towgs84:"-192.26,65.72,132.08"},EPSG_4680:{towgs84:"124.5,-63.5,-281"},EPSG_4701:{towgs84:"-79.9,-158,-168.9"},EPSG_4706:{towgs84:"-146.21,112.63,4.05"},EPSG_4805:{towgs84:"682,-203,480"},EPSG_4201:{towgs84:"-165,-11,206"},EPSG_4210:{towgs84:"-157,-2,-299"},EPSG_4183:{towgs84:"-104,167,-38"},EPSG_4139:{towgs84:"11,72,-101"},EPSG_4668:{towgs84:"-86,-98,-119"},EPSG_4717:{towgs84:"-2,151,181"},EPSG_4732:{towgs84:"102,52,-38"},EPSG_4280:{towgs84:"-377,681,-50"},EPSG_4209:{towgs84:"-138,-105,-289"},EPSG_4261:{towgs84:"31,146,47"},EPSG_4658:{towgs84:"-73,46,-86"},EPSG_4721:{towgs84:"265.025,384.929,-194.046"},EPSG_4222:{towgs84:"-136,-108,-292"},EPSG_4601:{towgs84:"-255,-15,71"},EPSG_4602:{towgs84:"725,685,536"},EPSG_4603:{towgs84:"72,213.7,93"},EPSG_4605:{towgs84:"9,183,236"},EPSG_4621:{towgs84:"137,248,-430"},EPSG_4657:{towgs84:"-28,199,5"},EPSG_4316:{towgs84:"103.25,-100.4,-307.19"},EPSG_4642:{towgs84:"-13,-348,292"},EPSG_4698:{towgs84:"145,-187,103"},EPSG_4192:{towgs84:"-206.1,-174.7,-87.7"},EPSG_4311:{towgs84:"-265,120,-358"},EPSG_4135:{towgs84:"58,-283,-182"},ESRI_104138:{towgs84:"198,-226,-347"},EPSG_4245:{towgs84:"-11,851,5"},EPSG_4142:{towgs84:"-125,53,467"},EPSG_4213:{towgs84:"-106,-87,188"},EPSG_4253:{towgs84:"-133,-77,-51"},EPSG_4129:{towgs84:"-132,-110,-335"},EPSG_4713:{towgs84:"-77,-128,142"},EPSG_4239:{towgs84:"217,823,299"},EPSG_4146:{towgs84:"295,736,257"},EPSG_4155:{towgs84:"-83,37,124"},EPSG_4165:{towgs84:"-173,253,27"},EPSG_4672:{towgs84:"175,-38,113"},EPSG_4236:{towgs84:"-637,-549,-203"},EPSG_4251:{towgs84:"-90,40,88"},EPSG_4271:{towgs84:"-2,374,172"},EPSG_4175:{towgs84:"-88,4,101"},EPSG_4716:{towgs84:"298,-304,-375"},EPSG_4315:{towgs84:"-23,259,-9"},EPSG_4744:{towgs84:"-242.2,-144.9,370.3"},EPSG_4244:{towgs84:"-97,787,86"},EPSG_4293:{towgs84:"616,97,-251"},EPSG_4714:{towgs84:"-127,-769,472"},EPSG_4736:{towgs84:"260,12,-147"},EPSG_6883:{towgs84:"-235,-110,393"},EPSG_6894:{towgs84:"-63,176,185"},EPSG_4205:{towgs84:"-43,-163,45"},EPSG_4256:{towgs84:"41,-220,-134"},EPSG_4262:{towgs84:"639,405,60"},EPSG_4604:{towgs84:"174,359,365"},EPSG_4169:{towgs84:"-115,118,426"},EPSG_4620:{towgs84:"-106,-129,165"},EPSG_4184:{towgs84:"-203,141,53"},EPSG_4616:{towgs84:"-289,-124,60"},EPSG_9403:{towgs84:"-307,-92,127"},EPSG_4684:{towgs84:"-133,-321,50"},EPSG_4708:{towgs84:"-491,-22,435"},EPSG_4707:{towgs84:"114,-116,-333"},EPSG_4709:{towgs84:"145,75,-272"},EPSG_4712:{towgs84:"-205,107,53"},EPSG_4711:{towgs84:"124,-234,-25"},EPSG_4718:{towgs84:"230,-199,-752"},EPSG_4719:{towgs84:"211,147,111"},EPSG_4724:{towgs84:"208,-435,-229"},EPSG_4725:{towgs84:"189,-79,-202"},EPSG_4735:{towgs84:"647,1777,-1124"},EPSG_4722:{towgs84:"-794,119,-298"},EPSG_4728:{towgs84:"-307,-92,127"},EPSG_4734:{towgs84:"-632,438,-609"},EPSG_4727:{towgs84:"912,-58,1227"},EPSG_4729:{towgs84:"185,165,42"},EPSG_4730:{towgs84:"170,42,84"},EPSG_4733:{towgs84:"276,-57,149"},ESRI_37218:{towgs84:"230,-199,-752"},ESRI_37240:{towgs84:"-7,215,225"},ESRI_37221:{towgs84:"252,-209,-751"},ESRI_4305:{towgs84:"-123,-206,219"},ESRI_104139:{towgs84:"-73,-247,227"},EPSG_4748:{towgs84:"51,391,-36"},EPSG_4219:{towgs84:"-384,664,-48"},EPSG_4255:{towgs84:"-333,-222,114"},EPSG_4257:{towgs84:"-587.8,519.75,145.76"},EPSG_4646:{towgs84:"-963,510,-359"},EPSG_6881:{towgs84:"-24,-203,268"},EPSG_6882:{towgs84:"-183,-15,273"},EPSG_4715:{towgs84:"-104,-129,239"},IGNF_RGF93GDD:{towgs84:"0,0,0"},IGNF_RGM04GDD:{towgs84:"0,0,0"},IGNF_RGSPM06GDD:{towgs84:"0,0,0"},IGNF_RGTAAF07GDD:{towgs84:"0,0,0"},IGNF_RGFG95GDD:{towgs84:"0,0,0"},IGNF_RGNCG:{towgs84:"0,0,0"},IGNF_RGPFGDD:{towgs84:"0,0,0"},IGNF_ETRS89G:{towgs84:"0,0,0"},IGNF_RGR92GDD:{towgs84:"0,0,0"},EPSG_4173:{towgs84:"0,0,0"},EPSG_4180:{towgs84:"0,0,0"},EPSG_4619:{towgs84:"0,0,0"},EPSG_4667:{towgs84:"0,0,0"},EPSG_4075:{towgs84:"0,0,0"},EPSG_6706:{towgs84:"0,0,0"},EPSG_7798:{towgs84:"0,0,0"},EPSG_4661:{towgs84:"0,0,0"},EPSG_4669:{towgs84:"0,0,0"},EPSG_8685:{towgs84:"0,0,0"},EPSG_4151:{towgs84:"0,0,0"},EPSG_9702:{towgs84:"0,0,0"},EPSG_4758:{towgs84:"0,0,0"},EPSG_4761:{towgs84:"0,0,0"},EPSG_4765:{towgs84:"0,0,0"},EPSG_8997:{towgs84:"0,0,0"},EPSG_4023:{towgs84:"0,0,0"},EPSG_4670:{towgs84:"0,0,0"},EPSG_4694:{towgs84:"0,0,0"},EPSG_4148:{towgs84:"0,0,0"},EPSG_4163:{towgs84:"0,0,0"},EPSG_4167:{towgs84:"0,0,0"},EPSG_4189:{towgs84:"0,0,0"},EPSG_4190:{towgs84:"0,0,0"},EPSG_4176:{towgs84:"0,0,0"},EPSG_4659:{towgs84:"0,0,0"},EPSG_3824:{towgs84:"0,0,0"},EPSG_3889:{towgs84:"0,0,0"},EPSG_4046:{towgs84:"0,0,0"},EPSG_4081:{towgs84:"0,0,0"},EPSG_4558:{towgs84:"0,0,0"},EPSG_4483:{towgs84:"0,0,0"},EPSG_5013:{towgs84:"0,0,0"},EPSG_5264:{towgs84:"0,0,0"},EPSG_5324:{towgs84:"0,0,0"},EPSG_5354:{towgs84:"0,0,0"},EPSG_5371:{towgs84:"0,0,0"},EPSG_5373:{towgs84:"0,0,0"},EPSG_5381:{towgs84:"0,0,0"},EPSG_5393:{towgs84:"0,0,0"},EPSG_5489:{towgs84:"0,0,0"},EPSG_5593:{towgs84:"0,0,0"},EPSG_6135:{towgs84:"0,0,0"},EPSG_6365:{towgs84:"0,0,0"},EPSG_5246:{towgs84:"0,0,0"},EPSG_7886:{towgs84:"0,0,0"},EPSG_8431:{towgs84:"0,0,0"},EPSG_8427:{towgs84:"0,0,0"},EPSG_8699:{towgs84:"0,0,0"},EPSG_8818:{towgs84:"0,0,0"},EPSG_4757:{towgs84:"0,0,0"},EPSG_9140:{towgs84:"0,0,0"},EPSG_8086:{towgs84:"0,0,0"},EPSG_4686:{towgs84:"0,0,0"},EPSG_4737:{towgs84:"0,0,0"},EPSG_4702:{towgs84:"0,0,0"},EPSG_4747:{towgs84:"0,0,0"},EPSG_4749:{towgs84:"0,0,0"},EPSG_4674:{towgs84:"0,0,0"},EPSG_4755:{towgs84:"0,0,0"},EPSG_4759:{towgs84:"0,0,0"},EPSG_4762:{towgs84:"0,0,0"},EPSG_4763:{towgs84:"0,0,0"},EPSG_4764:{towgs84:"0,0,0"},EPSG_4166:{towgs84:"0,0,0"},EPSG_4170:{towgs84:"0,0,0"},EPSG_5546:{towgs84:"0,0,0"},EPSG_7844:{towgs84:"0,0,0"},EPSG_4818:{towgs84:"589,76,480"}};for(var Yc in Aa){var us=Aa[Yc];us.datumName&&(Aa[us.datumName]=us)}function Zc(t,e,a,s,i,r,o){var n={};return t===void 0||t==="none"?n.datum_type=Ss:n.datum_type=cc,e&&(n.datum_params=e.map(parseFloat),(n.datum_params[0]!==0||n.datum_params[1]!==0||n.datum_params[2]!==0)&&(n.datum_type=me),n.datum_params.length>3&&(n.datum_params[3]!==0||n.datum_params[4]!==0||n.datum_params[5]!==0||n.datum_params[6]!==0)&&(n.datum_type=ve,n.datum_params[3]*=Je,n.datum_params[4]*=Je,n.datum_params[5]*=Je,n.datum_params[6]=n.datum_params[6]/1e6+1)),o&&(n.datum_type=Te,n.grids=o),n.a=a,n.b=s,n.es=i,n.ep2=r,n}var ii={};function Xc(t,e,a){return e instanceof ArrayBuffer?Qc(t,e,a):{ready:td(t,e)}}function Qc(t,e,a){var s=!0;a!==void 0&&a.includeErrorFields===!1&&(s=!1);var i=new DataView(e),r=sd(i),o=id(i,r),n=rd(i,o,r,s),l={header:o,subgrids:n};return ii[t]=l,l}async function td(t,e){for(var a=[],s=await e.getImageCount(),i=s-1;i>=0;i--){var r=await e.getImage(i),o=await r.readRasters(),n=o,l=[r.getWidth(),r.getHeight()],c=r.getBoundingBox().map(Ki),u=[r.fileDirectory.ModelPixelScale[0],r.fileDirectory.ModelPixelScale[1]].map(Ki),d=c[0]+(l[0]-1)*u[0],h=c[3]-(l[1]-1)*u[1],f=n[0],p=n[1],m=[];for(let v=l[1]-1;v>=0;v--)for(let b=l[0]-1;b>=0;b--){var g=v*l[0]+b;m.push([-te(p[g]),te(f[g])])}a.push({del:u,lim:l,ll:[-d,h],cvs:m})}var y={header:{nSubgrids:s},subgrids:a};return ii[t]=y,y}function ed(t){if(t===void 0)return null;var e=t.split(",");return e.map(ad)}function ad(t){if(t.length===0)return null;var e=t[0]==="@";return e&&(t=t.slice(1)),t==="null"?{name:"null",mandatory:!e,grid:null,isNull:!0}:{name:t,mandatory:!e,grid:ii[t]||null,isNull:!1}}function Ki(t){return t*Math.PI/180}function te(t){return t/3600*Math.PI/180}function sd(t){var e=t.getInt32(8,!1);return e===11?!1:(e=t.getInt32(8,!0),e!==11&&console.warn("Failed to detect nadgrid endian-ness, defaulting to little-endian"),!0)}function id(t,e){return{nFields:t.getInt32(8,e),nSubgridFields:t.getInt32(24,e),nSubgrids:t.getInt32(40,e),shiftType:As(t,56,64).trim(),fromSemiMajorAxis:t.getFloat64(120,e),fromSemiMinorAxis:t.getFloat64(136,e),toSemiMajorAxis:t.getFloat64(152,e),toSemiMinorAxis:t.getFloat64(168,e)}}function As(t,e,a){return String.fromCharCode.apply(null,new Uint8Array(t.buffer.slice(e,a)))}function rd(t,e,a,s){for(var i=176,r=[],o=0;o<e.nSubgrids;o++){var n=od(t,i,a),l=ld(t,i,n,a,s),c=Math.round(1+(n.upperLongitude-n.lowerLongitude)/n.longitudeInterval),u=Math.round(1+(n.upperLatitude-n.lowerLatitude)/n.latitudeInterval);r.push({ll:[te(n.lowerLongitude),te(n.lowerLatitude)],del:[te(n.longitudeInterval),te(n.latitudeInterval)],lim:[c,u],count:n.gridNodeCount,cvs:nd(l)});var d=16;s===!1&&(d=8),i+=176+n.gridNodeCount*d}return r}function nd(t){return t.map(function(e){return[te(e.longitudeShift),te(e.latitudeShift)]})}function od(t,e,a){return{name:As(t,e+8,e+16).trim(),parent:As(t,e+24,e+24+8).trim(),lowerLatitude:t.getFloat64(e+72,a),upperLatitude:t.getFloat64(e+88,a),lowerLongitude:t.getFloat64(e+104,a),upperLongitude:t.getFloat64(e+120,a),latitudeInterval:t.getFloat64(e+136,a),longitudeInterval:t.getFloat64(e+152,a),gridNodeCount:t.getInt32(e+168,a)}}function ld(t,e,a,s,i){var r=e+176,o=16;i===!1&&(o=8);for(var n=[],l=0;l<a.gridNodeCount;l++){var c={latitudeShift:t.getFloat32(r+l*o,s),longitudeShift:t.getFloat32(r+l*o+4,s)};i!==!1&&(c.latitudeAccuracy=t.getFloat32(r+l*o+8,s),c.longitudeAccuracy=t.getFloat32(r+l*o+12,s)),n.push(c)}return n}function Lt(t,e){if(!(this instanceof Lt))return new Lt(t);this.forward=null,this.inverse=null,this.init=null,this.name,this.names=null,this.title,e=e||function(c){if(c)throw c};var a=Rc(t);if(typeof a!="object"){e("Could not parse to valid json: "+t);return}var s=Lt.projections.get(a.projName);if(!s){e("Could not get projection name from: "+t);return}if(a.datumCode&&a.datumCode!=="none"){var i=ie(Aa,a.datumCode);i&&(a.datum_params=a.datum_params||(i.towgs84?i.towgs84.split(","):null),a.ellps=i.ellipse,a.datumName=i.datumName?i.datumName:a.datumCode)}a.k0=a.k0||1,a.axis=a.axis||"enu",a.ellps=a.ellps||"wgs84",a.lat1=a.lat1||a.lat0;var r=Jc(a.a,a.b,a.rf,a.ellps,a.sphere),o=Kc(r.a,r.b,r.rf,a.R_A),n=ed(a.nadgrids),l=a.datum||Zc(a.datumCode,a.datum_params,r.a,r.b,o.es,o.ep2,n);Vi(this,a),Vi(this,s),this.a=r.a,this.b=r.b,this.rf=r.rf,this.sphere=r.sphere,this.es=o.es,this.e=o.e,this.ep2=o.ep2,this.datum=l,"init"in this&&typeof this.init=="function"&&this.init(),e(null,this)}Lt.projections=Vc;Lt.projections.start();function cd(t,e){return t.datum_type!==e.datum_type||t.a!==e.a||Math.abs(t.es-e.es)>5e-11?!1:t.datum_type===me?t.datum_params[0]===e.datum_params[0]&&t.datum_params[1]===e.datum_params[1]&&t.datum_params[2]===e.datum_params[2]:t.datum_type===ve?t.datum_params[0]===e.datum_params[0]&&t.datum_params[1]===e.datum_params[1]&&t.datum_params[2]===e.datum_params[2]&&t.datum_params[3]===e.datum_params[3]&&t.datum_params[4]===e.datum_params[4]&&t.datum_params[5]===e.datum_params[5]&&t.datum_params[6]===e.datum_params[6]:!0}function gn(t,e,a){var s=t.x,i=t.y,r=t.z?t.z:0,o,n,l,c;if(i<-M&&i>-1.001*M)i=-M;else if(i>M&&i<1.001*M)i=M;else{if(i<-M)return{x:-1/0,y:-1/0,z:t.z};if(i>M)return{x:1/0,y:1/0,z:t.z}}return s>Math.PI&&(s-=2*Math.PI),n=Math.sin(i),c=Math.cos(i),l=n*n,o=a/Math.sqrt(1-e*l),{x:(o+r)*c*Math.cos(s),y:(o+r)*c*Math.sin(s),z:(o*(1-e)+r)*n}}function mn(t,e,a,s){var i=1e-12,r=i*i,o=30,n,l,c,u,d,h,f,p,m,g,y,v,b,_=t.x,x=t.y,E=t.z?t.z:0,A,G,P;if(n=Math.sqrt(_*_+x*x),l=Math.sqrt(_*_+x*x+E*E),n/a<i){if(A=0,l/a<i)return G=M,P=-s,{x:t.x,y:t.y,z:t.z}}else A=Math.atan2(x,_);c=E/l,u=n/l,d=1/Math.sqrt(1-e*(2-e)*u*u),p=u*(1-e)*d,m=c*d,b=0;do b++,f=a/Math.sqrt(1-e*m*m),P=n*p+E*m-f*(1-e*m*m),h=e*f/(f+P),d=1/Math.sqrt(1-h*(2-h)*u*u),g=u*(1-h)*d,y=c*d,v=y*p-g*m,p=g,m=y;while(v*v>r&&b<o);return G=Math.atan(y/Math.abs(g)),{x:A,y:G,z:P}}function dd(t,e,a){if(e===me)return{x:t.x+a[0],y:t.y+a[1],z:t.z+a[2]};if(e===ve){var s=a[0],i=a[1],r=a[2],o=a[3],n=a[4],l=a[5],c=a[6];return{x:c*(t.x-l*t.y+n*t.z)+s,y:c*(l*t.x+t.y-o*t.z)+i,z:c*(-n*t.x+o*t.y+t.z)+r}}}function hd(t,e,a){if(e===me)return{x:t.x-a[0],y:t.y-a[1],z:t.z-a[2]};if(e===ve){var s=a[0],i=a[1],r=a[2],o=a[3],n=a[4],l=a[5],c=a[6],u=(t.x-s)/c,d=(t.y-i)/c,h=(t.z-r)/c;return{x:u+l*d-n*h,y:-l*u+d+o*h,z:n*u-o*d+h}}}function _a(t){return t===me||t===ve}function ud(t,e,a){if(cd(t,e)||t.datum_type===Ss||e.datum_type===Ss)return a;var s=t.a,i=t.es;if(t.datum_type===Te){var r=Ji(t,!1,a);if(r!==0)return;s=Oi,i=ji}var o=e.a,n=e.b,l=e.es;if(e.datum_type===Te&&(o=Oi,n=dc,l=ji),i===l&&s===o&&!_a(t.datum_type)&&!_a(e.datum_type))return a;if(a=gn(a,i,s),_a(t.datum_type)&&(a=dd(a,t.datum_type,t.datum_params)),_a(e.datum_type)&&(a=hd(a,e.datum_type,e.datum_params)),a=mn(a,l,o,n),e.datum_type===Te){var c=Ji(e,!0,a);if(c!==0)return}return a}function Ji(t,e,a){if(t.grids===null||t.grids.length===0)return console.log("Grid shift grids not found"),-1;var s={x:-a.x,y:a.y},i={x:Number.NaN,y:Number.NaN},r=[];t:for(var o=0;o<t.grids.length;o++){var n=t.grids[o];if(r.push(n.name),n.isNull){i=s;break}if(n.grid===null){if(n.mandatory)return console.log("Unable to find mandatory grid '"+n.name+"'"),-1;continue}for(var l=n.grid.subgrids,c=0,u=l.length;c<u;c++){var d=l[c],h=(Math.abs(d.del[1])+Math.abs(d.del[0]))/1e4,f=d.ll[0]-h,p=d.ll[1]-h,m=d.ll[0]+(d.lim[0]-1)*d.del[0]+h,g=d.ll[1]+(d.lim[1]-1)*d.del[1]+h;if(!(p>s.y||f>s.x||g<s.y||m<s.x)&&(i=pd(s,e,d),!isNaN(i.x)))break t}}return isNaN(i.x)?(console.log("Failed to find a grid shift table for location '"+-s.x*St+" "+s.y*St+" tried: '"+r+"'"),-1):(a.x=-i.x,a.y=i.y,0)}function pd(t,e,a){var s={x:Number.NaN,y:Number.NaN};if(isNaN(t.x))return s;var i={x:t.x,y:t.y};i.x-=a.ll[0],i.y-=a.ll[1],i.x=R(i.x-Math.PI)+Math.PI;var r=Yi(i,a);if(e){if(isNaN(r.x))return s;r.x=i.x-r.x,r.y=i.y-r.y;var o=9,n=1e-12,l,c;do{if(c=Yi(r,a),isNaN(c.x)){console.log("Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.");break}l={x:i.x-(c.x+r.x),y:i.y-(c.y+r.y)},r.x+=l.x,r.y+=l.y}while(o--&&Math.abs(l.x)>n&&Math.abs(l.y)>n);if(o<0)return console.log("Inverse grid shift iterator failed to converge."),s;s.x=R(r.x+a.ll[0]),s.y=r.y+a.ll[1]}else isNaN(r.x)||(s.x=t.x+r.x,s.y=t.y+r.y);return s}function Yi(t,e){var a={x:t.x/e.del[0],y:t.y/e.del[1]},s={x:Math.floor(a.x),y:Math.floor(a.y)},i={x:a.x-1*s.x,y:a.y-1*s.y},r={x:Number.NaN,y:Number.NaN},o;if(s.x<0||s.x>=e.lim[0]||s.y<0||s.y>=e.lim[1])return r;o=s.y*e.lim[0]+s.x;var n={x:e.cvs[o][0],y:e.cvs[o][1]};o++;var l={x:e.cvs[o][0],y:e.cvs[o][1]};o+=e.lim[0];var c={x:e.cvs[o][0],y:e.cvs[o][1]};o--;var u={x:e.cvs[o][0],y:e.cvs[o][1]},d=i.x*i.y,h=i.x*(1-i.y),f=(1-i.x)*(1-i.y),p=(1-i.x)*i.y;return r.x=f*n.x+h*l.x+p*u.x+d*c.x,r.y=f*n.y+h*l.y+p*u.y+d*c.y,r}function Zi(t,e,a){var s=a.x,i=a.y,r=a.z||0,o,n,l,c={};for(l=0;l<3;l++)if(!(e&&l===2&&a.z===void 0))switch(l===0?(o=s,"ew".indexOf(t.axis[l])!==-1?n="x":n="y"):l===1?(o=i,"ns".indexOf(t.axis[l])!==-1?n="y":n="x"):(o=r,n="z"),t.axis[l]){case"e":c[n]=o;break;case"w":c[n]=-o;break;case"n":c[n]=o;break;case"s":c[n]=-o;break;case"u":a[n]!==void 0&&(c.z=o);break;case"d":a[n]!==void 0&&(c.z=-o);break;default:return null}return c}function vn(t){var e={x:t[0],y:t[1]};return t.length>2&&(e.z=t[2]),t.length>3&&(e.m=t[3]),e}function fd(t){Xi(t.x),Xi(t.y)}function Xi(t){if(typeof Number.isFinite=="function"){if(Number.isFinite(t))return;throw new TypeError("coordinates must be finite numbers")}if(typeof t!="number"||t!==t||!isFinite(t))throw new TypeError("coordinates must be finite numbers")}function gd(t,e){return(t.datum.datum_type===me||t.datum.datum_type===ve||t.datum.datum_type===Te)&&e.datumCode!=="WGS84"||(e.datum.datum_type===me||e.datum.datum_type===ve||e.datum.datum_type===Te)&&t.datumCode!=="WGS84"}function Fa(t,e,a,s){var i;Array.isArray(a)?a=vn(a):a={x:a.x,y:a.y,z:a.z,m:a.m};var r=a.z!==void 0;if(fd(a),t.datum&&e.datum&&gd(t,e)&&(i=new Lt("WGS84"),a=Fa(t,i,a,s),t=i),s&&t.axis!=="enu"&&(a=Zi(t,!1,a)),t.projName==="longlat")a={x:a.x*dt,y:a.y*dt,z:a.z||0};else if(t.to_meter&&(a={x:a.x*t.to_meter,y:a.y*t.to_meter,z:a.z||0}),a=t.inverse(a),!a)return;if(t.from_greenwich&&(a.x+=t.from_greenwich),a=ud(t.datum,e.datum,a),!!a)return a=a,e.from_greenwich&&(a={x:a.x-e.from_greenwich,y:a.y,z:a.z||0}),e.projName==="longlat"?a={x:a.x*St,y:a.y*St,z:a.z||0}:(a=e.forward(a),e.to_meter&&(a={x:a.x/e.to_meter,y:a.y/e.to_meter,z:a.z||0})),s&&e.axis!=="enu"?Zi(e,!0,a):(a&&!r&&delete a.z,a)}var Qi=Lt("WGS84");function ps(t,e,a,s){var i,r,o;return Array.isArray(a)?(i=Fa(t,e,a,s)||{x:NaN,y:NaN},a.length>2?typeof t.name<"u"&&t.name==="geocent"||typeof e.name<"u"&&e.name==="geocent"?typeof i.z=="number"?[i.x,i.y,i.z].concat(a.slice(3)):[i.x,i.y,a[2]].concat(a.slice(3)):[i.x,i.y].concat(a.slice(2)):[i.x,i.y]):(r=Fa(t,e,a,s),o=Object.keys(a),o.length===2||o.forEach(function(n){if(typeof t.name<"u"&&t.name==="geocent"||typeof e.name<"u"&&e.name==="geocent"){if(n==="x"||n==="y"||n==="z")return}else if(n==="x"||n==="y")return;r[n]=a[n]}),r)}function Ma(t){return t instanceof Lt?t:typeof t=="object"&&"oProj"in t?t.oProj:Lt(t)}function md(t,e,a){var s,i,r=!1,o;return typeof e>"u"?(i=Ma(t),s=Qi,r=!0):(typeof e.x<"u"||Array.isArray(e))&&(a=e,i=Ma(t),s=Qi,r=!0),s||(s=Ma(t)),i||(i=Ma(e)),a?ps(s,i,a):(o={forward:function(n,l){return ps(s,i,n,l)},inverse:function(n,l){return ps(i,s,n,l)}},r&&(o.oProj=i),o)}var tr=6,yn="AJSAJS",bn="AFAFAF",Pe=65,xt=73,$t=79,qe=86,ze=90;const vd={forward:_n,inverse:yd,toPoint:Mn};function _n(t,e){return e=e||5,Md(bd({lat:t[1],lon:t[0]}),e)}function yd(t){var e=ri(wn(t.toUpperCase()));return e.lat&&e.lon?[e.lon,e.lat,e.lon,e.lat]:[e.left,e.bottom,e.right,e.top]}function Mn(t){var e=ri(wn(t.toUpperCase()));return e.lat&&e.lon?[e.lon,e.lat]:[(e.left+e.right)/2,(e.top+e.bottom)/2]}function fs(t){return t*(Math.PI/180)}function er(t){return 180*(t/Math.PI)}function bd(t){var e=t.lat,a=t.lon,s=6378137,i=.00669438,r=.9996,o,n,l,c,u,d,h,f=fs(e),p=fs(a),m,g;g=Math.floor((a+180)/6)+1,a===180&&(g=60),e>=56&&e<64&&a>=3&&a<12&&(g=32),e>=72&&e<84&&(a>=0&&a<9?g=31:a>=9&&a<21?g=33:a>=21&&a<33?g=35:a>=33&&a<42&&(g=37)),o=(g-1)*6-180+3,m=fs(o),n=i/(1-i),l=s/Math.sqrt(1-i*Math.sin(f)*Math.sin(f)),c=Math.tan(f)*Math.tan(f),u=n*Math.cos(f)*Math.cos(f),d=Math.cos(f)*(p-m),h=s*((1-i/4-3*i*i/64-5*i*i*i/256)*f-(3*i/8+3*i*i/32+45*i*i*i/1024)*Math.sin(2*f)+(15*i*i/256+45*i*i*i/1024)*Math.sin(4*f)-35*i*i*i/3072*Math.sin(6*f));var y=r*l*(d+(1-c+u)*d*d*d/6+(5-18*c+c*c+72*u-58*n)*d*d*d*d*d/120)+5e5,v=r*(h+l*Math.tan(f)*(d*d/2+(5-c+9*u+4*u*u)*d*d*d*d/24+(61-58*c+c*c+600*u-330*n)*d*d*d*d*d*d/720));return e<0&&(v+=1e7),{northing:Math.round(v),easting:Math.round(y),zoneNumber:g,zoneLetter:_d(e)}}function ri(t){var e=t.northing,a=t.easting,s=t.zoneLetter,i=t.zoneNumber;if(i<0||i>60)return null;var r=.9996,o=6378137,n=.00669438,l,c=(1-Math.sqrt(1-n))/(1+Math.sqrt(1-n)),u,d,h,f,p,m,g,y,v,b=a-5e5,_=e;s<"N"&&(_-=1e7),g=(i-1)*6-180+3,l=n/(1-n),m=_/r,y=m/(o*(1-n/4-3*n*n/64-5*n*n*n/256)),v=y+(3*c/2-27*c*c*c/32)*Math.sin(2*y)+(21*c*c/16-55*c*c*c*c/32)*Math.sin(4*y)+151*c*c*c/96*Math.sin(6*y),u=o/Math.sqrt(1-n*Math.sin(v)*Math.sin(v)),d=Math.tan(v)*Math.tan(v),h=l*Math.cos(v)*Math.cos(v),f=o*(1-n)/Math.pow(1-n*Math.sin(v)*Math.sin(v),1.5),p=b/(u*r);var x=v-u*Math.tan(v)/f*(p*p/2-(5+3*d+10*h-4*h*h-9*l)*p*p*p*p/24+(61+90*d+298*h+45*d*d-252*l-3*h*h)*p*p*p*p*p*p/720);x=er(x);var E=(p-(1+2*d+h)*p*p*p/6+(5-2*h+28*d-3*h*h+8*l+24*d*d)*p*p*p*p*p/120)/Math.cos(v);E=g+er(E);var A;if(t.accuracy){var G=ri({northing:t.northing+t.accuracy,easting:t.easting+t.accuracy,zoneLetter:t.zoneLetter,zoneNumber:t.zoneNumber});A={top:G.lat,right:G.lon,bottom:x,left:E}}else A={lat:x,lon:E};return A}function _d(t){var e="Z";return 84>=t&&t>=72?e="X":72>t&&t>=64?e="W":64>t&&t>=56?e="V":56>t&&t>=48?e="U":48>t&&t>=40?e="T":40>t&&t>=32?e="S":32>t&&t>=24?e="R":24>t&&t>=16?e="Q":16>t&&t>=8?e="P":8>t&&t>=0?e="N":0>t&&t>=-8?e="M":-8>t&&t>=-16?e="L":-16>t&&t>=-24?e="K":-24>t&&t>=-32?e="J":-32>t&&t>=-40?e="H":-40>t&&t>=-48?e="G":-48>t&&t>=-56?e="F":-56>t&&t>=-64?e="E":-64>t&&t>=-72?e="D":-72>t&&t>=-80&&(e="C"),e}function Md(t,e){var a="00000"+t.easting,s="00000"+t.northing;return t.zoneNumber+t.zoneLetter+xd(t.easting,t.northing,t.zoneNumber)+a.substr(a.length-5,e)+s.substr(s.length-5,e)}function xd(t,e,a){var s=xn(a),i=Math.floor(t/1e5),r=Math.floor(e/1e5)%20;return wd(i,r,s)}function xn(t){var e=t%tr;return e===0&&(e=tr),e}function wd(t,e,a){var s=a-1,i=yn.charCodeAt(s),r=bn.charCodeAt(s),o=i+t-1,n=r+e,l=!1;o>ze&&(o=o-ze+Pe-1,l=!0),(o===xt||i<xt&&o>xt||(o>xt||i<xt)&&l)&&o++,(o===$t||i<$t&&o>$t||(o>$t||i<$t)&&l)&&(o++,o===xt&&o++),o>ze&&(o=o-ze+Pe-1),n>qe?(n=n-qe+Pe-1,l=!0):l=!1,(n===xt||r<xt&&n>xt||(n>xt||r<xt)&&l)&&n++,(n===$t||r<$t&&n>$t||(n>$t||r<$t)&&l)&&(n++,n===xt&&n++),n>qe&&(n=n-qe+Pe-1);var c=String.fromCharCode(o)+String.fromCharCode(n);return c}function wn(t){if(t&&t.length===0)throw"MGRSPoint coverting from nothing";for(var e=t.length,a=null,s="",i,r=0;!/[A-Z]/.test(i=t.charAt(r));){if(r>=2)throw"MGRSPoint bad conversion from: "+t;s+=i,r++}var o=parseInt(s,10);if(r===0||r+3>e)throw"MGRSPoint bad conversion from: "+t;var n=t.charAt(r++);if(n<="A"||n==="B"||n==="Y"||n>="Z"||n==="I"||n==="O")throw"MGRSPoint zone letter "+n+" not handled: "+t;a=t.substring(r,r+=2);for(var l=xn(o),c=Sd(a.charAt(0),l),u=Ed(a.charAt(1),l);u<Ad(n);)u+=2e6;var d=e-r;if(d%2!==0)throw`MGRSPoint has to have an even number 
of digits after the zone letter and two 100km letters - front 
half for easting meters, second half for 
northing meters`+t;var h=d/2,f=0,p=0,m,g,y,v,b;return h>0&&(m=1e5/Math.pow(10,h),g=t.substring(r,r+h),f=parseFloat(g)*m,y=t.substring(r+h),p=parseFloat(y)*m),v=f+c,b=p+u,{easting:v,northing:b,zoneLetter:n,zoneNumber:o,accuracy:m}}function Sd(t,e){for(var a=yn.charCodeAt(e-1),s=1e5,i=!1;a!==t.charCodeAt(0);){if(a++,a===xt&&a++,a===$t&&a++,a>ze){if(i)throw"Bad character: "+t;a=Pe,i=!0}s+=1e5}return s}function Ed(t,e){if(t>"V")throw"MGRSPoint given invalid Northing "+t;for(var a=bn.charCodeAt(e-1),s=0,i=!1;a!==t.charCodeAt(0);){if(a++,a===xt&&a++,a===$t&&a++,a>qe){if(i)throw"Bad character: "+t;a=Pe,i=!0}s+=1e5}return s}function Ad(t){var e;switch(t){case"C":e=11e5;break;case"D":e=2e6;break;case"E":e=28e5;break;case"F":e=37e5;break;case"G":e=46e5;break;case"H":e=55e5;break;case"J":e=64e5;break;case"K":e=73e5;break;case"L":e=82e5;break;case"M":e=91e5;break;case"N":e=0;break;case"P":e=8e5;break;case"Q":e=17e5;break;case"R":e=26e5;break;case"S":e=35e5;break;case"T":e=44e5;break;case"U":e=53e5;break;case"V":e=62e5;break;case"W":e=7e6;break;case"X":e=79e5;break;default:e=-1}if(e>=0)return e;throw"Invalid zone letter: "+t}function Ne(t,e,a){if(!(this instanceof Ne))return new Ne(t,e,a);if(Array.isArray(t))this.x=t[0],this.y=t[1],this.z=t[2]||0;else if(typeof t=="object")this.x=t.x,this.y=t.y,this.z=t.z||0;else if(typeof t=="string"&&typeof e>"u"){var s=t.split(",");this.x=parseFloat(s[0]),this.y=parseFloat(s[1]),this.z=parseFloat(s[2])||0}else this.x=t,this.y=e,this.z=a||0;console.warn("proj4.Point will be removed in version 3, use proj4.toPoint")}Ne.fromMGRS=function(t){return new Ne(Mn(t))};Ne.prototype.toMGRS=function(t){return _n([this.x,this.y],t)};var Pd=1,kd=.25,ar=.046875,sr=.01953125,ir=.01068115234375,Cd=.75,Td=.46875,$d=.013020833333333334,Ld=.007120768229166667,Gd=.3645833333333333,Nd=.005696614583333333,Rd=.3076171875;function ni(t){var e=[];e[0]=Pd-t*(kd+t*(ar+t*(sr+t*ir))),e[1]=t*(Cd-t*(ar+t*(sr+t*ir)));var a=t*t;return e[2]=a*(Td-t*($d+t*Ld)),a*=t,e[3]=a*(Gd-t*Nd),e[4]=a*t*Rd,e}function Be(t,e,a,s){return a*=e,e*=e,s[0]*t-a*(s[1]+e*(s[2]+e*(s[3]+e*s[4])))}var Id=20;function oi(t,e,a){for(var s=1/(1-e),i=t,r=Id;r;--r){var o=Math.sin(i),n=1-e*o*o;if(n=(Be(i,o,Math.cos(i),a)-t)*(n*Math.sqrt(n))*s,i-=n,Math.abs(n)<T)return i}return i}function Bd(){this.x0=this.x0!==void 0?this.x0:0,this.y0=this.y0!==void 0?this.y0:0,this.long0=this.long0!==void 0?this.long0:0,this.lat0=this.lat0!==void 0?this.lat0:0,this.es&&(this.en=ni(this.es),this.ml0=Be(this.lat0,Math.sin(this.lat0),Math.cos(this.lat0),this.en))}function Dd(t){var e=t.x,a=t.y,s=R(e-this.long0,this.over),i,r,o,n=Math.sin(a),l=Math.cos(a);if(this.es){var u=l*s,d=Math.pow(u,2),h=this.ep2*Math.pow(l,2),f=Math.pow(h,2),p=Math.abs(l)>T?Math.tan(a):0,m=Math.pow(p,2),g=Math.pow(m,2);i=1-this.es*Math.pow(n,2),u=u/Math.sqrt(i);var y=Be(a,n,l,this.en);r=this.a*(this.k0*u*(1+d/6*(1-m+h+d/20*(5-18*m+g+14*h-58*m*h+d/42*(61+179*g-g*m-479*m)))))+this.x0,o=this.a*(this.k0*(y-this.ml0+n*s*u/2*(1+d/12*(5-m+9*h+4*f+d/30*(61+g-58*m+270*h-330*m*h+d/56*(1385+543*g-g*m-3111*m))))))+this.y0}else{var c=l*Math.sin(s);if(Math.abs(Math.abs(c)-1)<T)return 93;if(r=.5*this.a*this.k0*Math.log((1+c)/(1-c))+this.x0,o=l*Math.cos(s)/Math.sqrt(1-Math.pow(c,2)),c=Math.abs(o),c>=1){if(c-1>T)return 93;o=0}else o=Math.acos(o);a<0&&(o=-o),o=this.a*this.k0*(o-this.lat0)+this.y0}return t.x=r,t.y=o,t}function Fd(t){var e,a,s,i,r=(t.x-this.x0)*(1/this.a),o=(t.y-this.y0)*(1/this.a);if(this.es)if(e=this.ml0+o/this.k0,a=oi(e,this.es,this.en),Math.abs(a)<M){var d=Math.sin(a),h=Math.cos(a),f=Math.abs(h)>T?Math.tan(a):0,p=this.ep2*Math.pow(h,2),m=Math.pow(p,2),g=Math.pow(f,2),y=Math.pow(g,2);e=1-this.es*Math.pow(d,2);var v=r*Math.sqrt(e)/this.k0,b=Math.pow(v,2);e=e*f,s=a-e*b/(1-this.es)*.5*(1-b/12*(5+3*g-9*p*g+p-4*m-b/30*(61+90*g-252*p*g+45*y+46*p-b/56*(1385+3633*g+4095*y+1574*y*g)))),i=R(this.long0+v*(1-b/6*(1+2*g+p-b/20*(5+28*g+24*y+8*p*g+6*p-b/42*(61+662*g+1320*y+720*y*g))))/h,this.over)}else s=M*ua(o),i=0;else{var n=Math.exp(r/this.k0),l=.5*(n-1/n),c=this.lat0+o/this.k0,u=Math.cos(c);e=Math.sqrt((1-Math.pow(u,2))/(1+Math.pow(l,2))),s=Math.asin(e),o<0&&(s=-s),l===0&&u===0?i=0:i=R(Math.atan2(l,u)+this.long0,this.over)}return t.x=i,t.y=s,t}var Od=["Fast_Transverse_Mercator","Fast Transverse Mercator"];const Pa={init:Bd,forward:Dd,inverse:Fd,names:Od};function Sn(t){var e=Math.exp(t);return e=(e-1/e)/2,e}function wt(t,e){t=Math.abs(t),e=Math.abs(e);var a=Math.max(t,e),s=Math.min(t,e)/(a||1);return a*Math.sqrt(1+Math.pow(s,2))}function jd(t){var e=1+t,a=e-1;return a===0?t:t*Math.log(e)/a}function qd(t){var e=Math.abs(t);return e=jd(e*(1+e/(wt(1,e)+1))),t<0?-e:e}function li(t,e){for(var a=2*Math.cos(2*e),s=t.length-1,i=t[s],r=0,o;--s>=0;)o=-r+a*i+t[s],r=i,i=o;return e+o*Math.sin(2*e)}function zd(t,e){for(var a=2*Math.cos(e),s=t.length-1,i=t[s],r=0,o;--s>=0;)o=-r+a*i+t[s],r=i,i=o;return Math.sin(e)*o}function Ud(t){var e=Math.exp(t);return e=(e+1/e)/2,e}function En(t,e,a){for(var s=Math.sin(e),i=Math.cos(e),r=Sn(a),o=Ud(a),n=2*i*o,l=-2*s*r,c=t.length-1,u=t[c],d=0,h=0,f=0,p,m;--c>=0;)p=h,m=d,h=u,d=f,u=-p+n*h-l*d+t[c],f=-m+l*h+n*d;return n=s*o,l=i*r,[n*u-l*f,n*f+l*u]}function Hd(){if(!this.approx&&(isNaN(this.es)||this.es<=0))throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');this.approx&&(Pa.init.apply(this),this.forward=Pa.forward,this.inverse=Pa.inverse),this.x0=this.x0!==void 0?this.x0:0,this.y0=this.y0!==void 0?this.y0:0,this.long0=this.long0!==void 0?this.long0:0,this.lat0=this.lat0!==void 0?this.lat0:0,this.cgb=[],this.cbg=[],this.utg=[],this.gtu=[];var t=this.es/(1+Math.sqrt(1-this.es)),e=t/(2-t),a=e;this.cgb[0]=e*(2+e*(-2/3+e*(-2+e*(116/45+e*(26/45+e*(-2854/675)))))),this.cbg[0]=e*(-2+e*(2/3+e*(4/3+e*(-82/45+e*(32/45+e*(4642/4725)))))),a=a*e,this.cgb[1]=a*(7/3+e*(-8/5+e*(-227/45+e*(2704/315+e*(2323/945))))),this.cbg[1]=a*(5/3+e*(-16/15+e*(-13/9+e*(904/315+e*(-1522/945))))),a=a*e,this.cgb[2]=a*(56/15+e*(-136/35+e*(-1262/105+e*(73814/2835)))),this.cbg[2]=a*(-26/15+e*(34/21+e*(8/5+e*(-12686/2835)))),a=a*e,this.cgb[3]=a*(4279/630+e*(-332/35+e*(-399572/14175))),this.cbg[3]=a*(1237/630+e*(-12/5+e*(-24832/14175))),a=a*e,this.cgb[4]=a*(4174/315+e*(-144838/6237)),this.cbg[4]=a*(-734/315+e*(109598/31185)),a=a*e,this.cgb[5]=a*(601676/22275),this.cbg[5]=a*(444337/155925),a=Math.pow(e,2),this.Qn=this.k0/(1+e)*(1+a*(1/4+a*(1/64+a/256))),this.utg[0]=e*(-.5+e*(2/3+e*(-37/96+e*(1/360+e*(81/512+e*(-96199/604800)))))),this.gtu[0]=e*(.5+e*(-2/3+e*(5/16+e*(41/180+e*(-127/288+e*(7891/37800)))))),this.utg[1]=a*(-1/48+e*(-1/15+e*(437/1440+e*(-46/105+e*(1118711/3870720))))),this.gtu[1]=a*(13/48+e*(-3/5+e*(557/1440+e*(281/630+e*(-1983433/1935360))))),a=a*e,this.utg[2]=a*(-17/480+e*(37/840+e*(209/4480+e*(-5569/90720)))),this.gtu[2]=a*(61/240+e*(-103/140+e*(15061/26880+e*(167603/181440)))),a=a*e,this.utg[3]=a*(-4397/161280+e*(11/504+e*(830251/7257600))),this.gtu[3]=a*(49561/161280+e*(-179/168+e*(6601661/7257600))),a=a*e,this.utg[4]=a*(-4583/161280+e*(108847/3991680)),this.gtu[4]=a*(34729/80640+e*(-3418889/1995840)),a=a*e,this.utg[5]=a*(-20648693/638668800),this.gtu[5]=a*(212378941/319334400);var s=li(this.cbg,this.lat0);this.Zb=-this.Qn*(s+zd(this.gtu,2*s))}function Vd(t){var e=R(t.x-this.long0,this.over),a=t.y;a=li(this.cbg,a);var s=Math.sin(a),i=Math.cos(a),r=Math.sin(e),o=Math.cos(e);a=Math.atan2(s,o*i),e=Math.atan2(r*i,wt(s,i*o)),e=qd(Math.tan(e));var n=En(this.gtu,2*a,2*e);a=a+n[0],e=e+n[1];var l,c;return Math.abs(e)<=2.623395162778?(l=this.a*(this.Qn*e)+this.x0,c=this.a*(this.Qn*a+this.Zb)+this.y0):(l=1/0,c=1/0),t.x=l,t.y=c,t}function Wd(t){var e=(t.x-this.x0)*(1/this.a),a=(t.y-this.y0)*(1/this.a);a=(a-this.Zb)/this.Qn,e=e/this.Qn;var s,i;if(Math.abs(e)<=2.623395162778){var r=En(this.utg,2*a,2*e);a=a+r[0],e=e+r[1],e=Math.atan(Sn(e));var o=Math.sin(a),n=Math.cos(a),l=Math.sin(e),c=Math.cos(e);a=Math.atan2(o*c,wt(l,c*n)),e=Math.atan2(l,c*n),s=R(e+this.long0,this.over),i=li(this.cgb,a)}else s=1/0,i=1/0;return t.x=s,t.y=i,t}var Kd=["Extended_Transverse_Mercator","Extended Transverse Mercator","etmerc","Transverse_Mercator","Transverse Mercator","Gauss Kruger","Gauss_Kruger","tmerc"];const ka={init:Hd,forward:Vd,inverse:Wd,names:Kd};function Jd(t,e){if(t===void 0){if(t=Math.floor((R(e)+Math.PI)*30/Math.PI)+1,t<0)return 0;if(t>60)return 60}return t}var Yd="etmerc";function Zd(){var t=Jd(this.zone,this.long0);if(t===void 0)throw new Error("unknown utm zone");this.lat0=0,this.long0=(6*Math.abs(t)-183)*dt,this.x0=5e5,this.y0=this.utmSouth?1e7:0,this.k0=.9996,ka.init.apply(this),this.forward=ka.forward,this.inverse=ka.inverse}var Xd=["Universal Transverse Mercator System","utm"];const Qd={init:Zd,names:Xd,dependsOn:Yd};function ci(t,e){return Math.pow((1-t)/(1+t),e)}var th=20;function eh(){var t=Math.sin(this.lat0),e=Math.cos(this.lat0);e*=e,this.rc=Math.sqrt(1-this.es)/(1-this.es*t*t),this.C=Math.sqrt(1+this.es*e*e/(1-this.es)),this.phic0=Math.asin(t/this.C),this.ratexp=.5*this.C*this.e,this.K=Math.tan(.5*this.phic0+X)/(Math.pow(Math.tan(.5*this.lat0+X),this.C)*ci(this.e*t,this.ratexp))}function ah(t){var e=t.x,a=t.y;return t.y=2*Math.atan(this.K*Math.pow(Math.tan(.5*a+X),this.C)*ci(this.e*Math.sin(a),this.ratexp))-M,t.x=this.C*e,t}function sh(t){for(var e=1e-14,a=t.x/this.C,s=t.y,i=Math.pow(Math.tan(.5*s+X)/this.K,1/this.C),r=th;r>0&&(s=2*Math.atan(i*ci(this.e*Math.sin(t.y),-.5*this.e))-M,!(Math.abs(s-t.y)<e));--r)t.y=s;return r?(t.x=a,t.y=s,t):null}const di={init:eh,forward:ah,inverse:sh};function ih(){di.init.apply(this),this.rc&&(this.sinc0=Math.sin(this.phic0),this.cosc0=Math.cos(this.phic0),this.R2=2*this.rc,this.title||(this.title="Oblique Stereographic Alternative"))}function rh(t){var e,a,s,i;return t.x=R(t.x-this.long0,this.over),di.forward.apply(this,[t]),e=Math.sin(t.y),a=Math.cos(t.y),s=Math.cos(t.x),i=this.k0*this.R2/(1+this.sinc0*e+this.cosc0*a*s),t.x=i*a*Math.sin(t.x),t.y=i*(this.cosc0*e-this.sinc0*a*s),t.x=this.a*t.x+this.x0,t.y=this.a*t.y+this.y0,t}function nh(t){var e,a,s,i,r;if(t.x=(t.x-this.x0)/this.a,t.y=(t.y-this.y0)/this.a,t.x/=this.k0,t.y/=this.k0,r=wt(t.x,t.y)){var o=2*Math.atan2(r,this.R2);e=Math.sin(o),a=Math.cos(o),i=Math.asin(a*this.sinc0+t.y*e*this.cosc0/r),s=Math.atan2(t.x*e,r*this.cosc0*a-t.y*this.sinc0*e)}else i=this.phic0,s=0;return t.x=s,t.y=i,di.inverse.apply(this,[t]),t.x=R(t.x+this.long0,this.over),t}var oh=["Stereographic_North_Pole","Oblique_Stereographic","sterea","Oblique Stereographic Alternative","Double_Stereographic"];const lh={init:ih,forward:rh,inverse:nh,names:oh};function hi(t,e,a){return e*=a,Math.tan(.5*(M+t))*Math.pow((1-e)/(1+e),.5*a)}function ch(){this.x0=this.x0||0,this.y0=this.y0||0,this.lat0=this.lat0||0,this.long0=this.long0||0,this.coslat0=Math.cos(this.lat0),this.sinlat0=Math.sin(this.lat0),this.sphere?this.k0===1&&!isNaN(this.lat_ts)&&Math.abs(this.coslat0)<=T&&(this.k0=.5*(1+ua(this.lat0)*Math.sin(this.lat_ts))):(Math.abs(this.coslat0)<=T&&(this.lat0>0?this.con=1:this.con=-1),this.cons=Math.sqrt(Math.pow(1+this.e,1+this.e)*Math.pow(1-this.e,1-this.e)),this.k0===1&&!isNaN(this.lat_ts)&&Math.abs(this.coslat0)<=T&&Math.abs(Math.cos(this.lat_ts))>T&&(this.k0=.5*this.cons*zt(this.e,Math.sin(this.lat_ts),Math.cos(this.lat_ts))/Bt(this.e,this.con*this.lat_ts,this.con*Math.sin(this.lat_ts))),this.ms1=zt(this.e,this.sinlat0,this.coslat0),this.X0=2*Math.atan(hi(this.lat0,this.sinlat0,this.e))-M,this.cosX0=Math.cos(this.X0),this.sinX0=Math.sin(this.X0))}function dh(t){var e=t.x,a=t.y,s=Math.sin(a),i=Math.cos(a),r,o,n,l,c,u,d=R(e-this.long0,this.over);return Math.abs(Math.abs(e-this.long0)-Math.PI)<=T&&Math.abs(a+this.lat0)<=T?(t.x=NaN,t.y=NaN,t):this.sphere?(r=2*this.k0/(1+this.sinlat0*s+this.coslat0*i*Math.cos(d)),t.x=this.a*r*i*Math.sin(d)+this.x0,t.y=this.a*r*(this.coslat0*s-this.sinlat0*i*Math.cos(d))+this.y0,t):(o=2*Math.atan(hi(a,s,this.e))-M,l=Math.cos(o),n=Math.sin(o),Math.abs(this.coslat0)<=T?(c=Bt(this.e,a*this.con,this.con*s),u=2*this.a*this.k0*c/this.cons,t.x=this.x0+u*Math.sin(e-this.long0),t.y=this.y0-this.con*u*Math.cos(e-this.long0),t):(Math.abs(this.sinlat0)<T?(r=2*this.a*this.k0/(1+l*Math.cos(d)),t.y=r*n):(r=2*this.a*this.k0*this.ms1/(this.cosX0*(1+this.sinX0*n+this.cosX0*l*Math.cos(d))),t.y=r*(this.cosX0*n-this.sinX0*l*Math.cos(d))+this.y0),t.x=r*l*Math.sin(d)+this.x0,t))}function hh(t){t.x-=this.x0,t.y-=this.y0;var e,a,s,i,r,o=Math.sqrt(t.x*t.x+t.y*t.y);if(this.sphere){var n=2*Math.atan(o/(2*this.a*this.k0));return e=this.long0,a=this.lat0,o<=T?(t.x=e,t.y=a,t):(a=Math.asin(Math.cos(n)*this.sinlat0+t.y*Math.sin(n)*this.coslat0/o),Math.abs(this.coslat0)<T?this.lat0>0?e=R(this.long0+Math.atan2(t.x,-1*t.y),this.over):e=R(this.long0+Math.atan2(t.x,t.y),this.over):e=R(this.long0+Math.atan2(t.x*Math.sin(n),o*this.coslat0*Math.cos(n)-t.y*this.sinlat0*Math.sin(n)),this.over),t.x=e,t.y=a,t)}else if(Math.abs(this.coslat0)<=T){if(o<=T)return a=this.lat0,e=this.long0,t.x=e,t.y=a,t;t.x*=this.con,t.y*=this.con,s=o*this.cons/(2*this.a*this.k0),a=this.con*na(this.e,s),e=this.con*R(this.con*this.long0+Math.atan2(t.x,-1*t.y),this.over)}else i=2*Math.atan(o*this.cosX0/(2*this.a*this.k0*this.ms1)),e=this.long0,o<=T?r=this.X0:(r=Math.asin(Math.cos(i)*this.sinX0+t.y*Math.sin(i)*this.cosX0/o),e=R(this.long0+Math.atan2(t.x*Math.sin(i),o*this.cosX0*Math.cos(i)-t.y*this.sinX0*Math.sin(i)),this.over)),a=-1*na(this.e,Math.tan(.5*(M+r)));return t.x=e,t.y=a,t}var uh=["stere","Stereographic_South_Pole","Polar_Stereographic_variant_A","Polar_Stereographic_variant_B","Polar_Stereographic"];const ph={init:ch,forward:dh,inverse:hh,names:uh,ssfn_:hi};function fh(){var t=this.lat0;this.lambda0=this.long0;var e=Math.sin(t),a=this.a,s=this.rf,i=1/s,r=2*i-Math.pow(i,2),o=this.e=Math.sqrt(r);this.R=this.k0*a*Math.sqrt(1-r)/(1-r*Math.pow(e,2)),this.alpha=Math.sqrt(1+r/(1-r)*Math.pow(Math.cos(t),4)),this.b0=Math.asin(e/this.alpha);var n=Math.log(Math.tan(Math.PI/4+this.b0/2)),l=Math.log(Math.tan(Math.PI/4+t/2)),c=Math.log((1+o*e)/(1-o*e));this.K=n-this.alpha*l+this.alpha*o/2*c}function gh(t){var e=Math.log(Math.tan(Math.PI/4-t.y/2)),a=this.e/2*Math.log((1+this.e*Math.sin(t.y))/(1-this.e*Math.sin(t.y))),s=-this.alpha*(e+a)+this.K,i=2*(Math.atan(Math.exp(s))-Math.PI/4),r=this.alpha*(t.x-this.lambda0),o=Math.atan(Math.sin(r)/(Math.sin(this.b0)*Math.tan(i)+Math.cos(this.b0)*Math.cos(r))),n=Math.asin(Math.cos(this.b0)*Math.sin(i)-Math.sin(this.b0)*Math.cos(i)*Math.cos(r));return t.y=this.R/2*Math.log((1+Math.sin(n))/(1-Math.sin(n)))+this.y0,t.x=this.R*o+this.x0,t}function mh(t){for(var e=t.x-this.x0,a=t.y-this.y0,s=e/this.R,i=2*(Math.atan(Math.exp(a/this.R))-Math.PI/4),r=Math.asin(Math.cos(this.b0)*Math.sin(i)+Math.sin(this.b0)*Math.cos(i)*Math.cos(s)),o=Math.atan(Math.sin(s)/(Math.cos(this.b0)*Math.cos(s)-Math.sin(this.b0)*Math.tan(i))),n=this.lambda0+o/this.alpha,l=0,c=r,u=-1e3,d=0;Math.abs(c-u)>1e-7;){if(++d>20)return;l=1/this.alpha*(Math.log(Math.tan(Math.PI/4+r/2))-this.K)+this.e*Math.log(Math.tan(Math.PI/4+Math.asin(this.e*Math.sin(c))/2)),u=c,c=2*Math.atan(Math.exp(l))-Math.PI/2}return t.x=n,t.y=c,t}var vh=["somerc"];const yh={init:fh,forward:gh,inverse:mh,names:vh};var we=1e-7;function bh(t){var e=["Hotine_Oblique_Mercator","Hotine_Oblique_Mercator_variant_A","Hotine_Oblique_Mercator_Azimuth_Natural_Origin"],a=typeof t.projName=="object"?Object.keys(t.projName)[0]:t.projName;return"no_uoff"in t||"no_off"in t||e.indexOf(a)!==-1||e.indexOf(pn(a))!==-1}function _h(){var t,e,a,s,i,r,o,n,l,c,u=0,d,h=0,f=0,p=0,m=0,g=0,y=0;this.no_off=bh(this),this.no_rot="no_rot"in this;var v=!1;"alpha"in this&&(v=!0);var b=!1;if("rectified_grid_angle"in this&&(b=!0),v&&(y=this.alpha),b&&(u=this.rectified_grid_angle),v||b)h=this.longc;else if(f=this.long1,m=this.lat1,p=this.long2,g=this.lat2,Math.abs(m-g)<=we||(t=Math.abs(m))<=we||Math.abs(t-M)<=we||Math.abs(Math.abs(this.lat0)-M)<=we||Math.abs(Math.abs(g)-M)<=we)throw new Error;var _=1-this.es;e=Math.sqrt(_),Math.abs(this.lat0)>T?(n=Math.sin(this.lat0),a=Math.cos(this.lat0),t=1-this.es*n*n,this.B=a*a,this.B=Math.sqrt(1+this.es*this.B*this.B/_),this.A=this.B*this.k0*e/t,s=this.B*e/(a*Math.sqrt(t)),i=s*s-1,i<=0?i=0:(i=Math.sqrt(i),this.lat0<0&&(i=-i)),this.E=i+=s,this.E*=Math.pow(Bt(this.e,this.lat0,n),this.B)):(this.B=1/e,this.A=this.k0,this.E=s=i=1),v||b?(v?(d=Math.asin(Math.sin(y)/s),b||(u=y)):(d=u,y=Math.asin(s*Math.sin(d))),this.lam0=h-Math.asin(.5*(i-1/i)*Math.tan(d))/this.B):(r=Math.pow(Bt(this.e,m,Math.sin(m)),this.B),o=Math.pow(Bt(this.e,g,Math.sin(g)),this.B),i=this.E/r,l=(o-r)/(o+r),c=this.E*this.E,c=(c-o*r)/(c+o*r),t=f-p,t<-Math.PI?p-=ia:t>Math.PI&&(p+=ia),this.lam0=R(.5*(f+p)-Math.atan(c*Math.tan(.5*this.B*(f-p))/l)/this.B,this.over),d=Math.atan(2*Math.sin(this.B*R(f-this.lam0,this.over))/(i-1/i)),u=y=Math.asin(s*Math.sin(d))),this.singam=Math.sin(d),this.cosgam=Math.cos(d),this.sinrot=Math.sin(u),this.cosrot=Math.cos(u),this.rB=1/this.B,this.ArB=this.A*this.rB,this.BrA=1/this.ArB,this.no_off?this.u_0=0:(this.u_0=Math.abs(this.ArB*Math.atan(Math.sqrt(s*s-1)/Math.cos(y))),this.lat0<0&&(this.u_0=-this.u_0)),i=.5*d,this.v_pole_n=this.ArB*Math.log(Math.tan(X-i)),this.v_pole_s=this.ArB*Math.log(Math.tan(X+i))}function Mh(t){var e={},a,s,i,r,o,n,l,c;if(t.x=t.x-this.lam0,Math.abs(Math.abs(t.y)-M)>T){if(o=this.E/Math.pow(Bt(this.e,t.y,Math.sin(t.y)),this.B),n=1/o,a=.5*(o-n),s=.5*(o+n),r=Math.sin(this.B*t.x),i=(a*this.singam-r*this.cosgam)/s,Math.abs(Math.abs(i)-1)<T)throw new Error;c=.5*this.ArB*Math.log((1-i)/(1+i)),n=Math.cos(this.B*t.x),Math.abs(n)<we?l=this.A*t.x:l=this.ArB*Math.atan2(a*this.cosgam+r*this.singam,n)}else c=t.y>0?this.v_pole_n:this.v_pole_s,l=this.ArB*t.y;return this.no_rot?(e.x=l,e.y=c):(l-=this.u_0,e.x=c*this.cosrot+l*this.sinrot,e.y=l*this.cosrot-c*this.sinrot),e.x=this.a*e.x+this.x0,e.y=this.a*e.y+this.y0,e}function xh(t){var e,a,s,i,r,o,n,l={};if(t.x=(t.x-this.x0)*(1/this.a),t.y=(t.y-this.y0)*(1/this.a),this.no_rot?(a=t.y,e=t.x):(a=t.x*this.cosrot-t.y*this.sinrot,e=t.y*this.cosrot+t.x*this.sinrot+this.u_0),s=Math.exp(-this.BrA*a),i=.5*(s-1/s),r=.5*(s+1/s),o=Math.sin(this.BrA*e),n=(o*this.cosgam+i*this.singam)/r,Math.abs(Math.abs(n)-1)<T)l.x=0,l.y=n<0?-M:M;else{if(l.y=this.E/Math.sqrt((1+n)/(1-n)),l.y=na(this.e,Math.pow(l.y,1/this.B)),l.y===1/0)throw new Error;l.x=-this.rB*Math.atan2(i*this.cosgam-o*this.singam,Math.cos(this.BrA*e))}return l.x+=this.lam0,l}var wh=["Hotine_Oblique_Mercator","Hotine Oblique Mercator","Hotine_Oblique_Mercator_variant_A","Hotine_Oblique_Mercator_Variant_B","Hotine_Oblique_Mercator_Azimuth_Natural_Origin","Hotine_Oblique_Mercator_Two_Point_Natural_Origin","Hotine_Oblique_Mercator_Azimuth_Center","Oblique_Mercator","omerc"];const Sh={init:_h,forward:Mh,inverse:xh,names:wh};function Eh(){if(this.lat2||(this.lat2=this.lat1),this.k0||(this.k0=1),this.x0=this.x0||0,this.y0=this.y0||0,!(Math.abs(this.lat1+this.lat2)<T)){var t=this.b/this.a;this.e=Math.sqrt(1-t*t);var e=Math.sin(this.lat1),a=Math.cos(this.lat1),s=zt(this.e,e,a),i=Bt(this.e,this.lat1,e),r=Math.sin(this.lat2),o=Math.cos(this.lat2),n=zt(this.e,r,o),l=Bt(this.e,this.lat2,r),c=Math.abs(Math.abs(this.lat0)-M)<T?0:Bt(this.e,this.lat0,Math.sin(this.lat0));Math.abs(this.lat1-this.lat2)>T?this.ns=Math.log(s/n)/Math.log(i/l):this.ns=e,isNaN(this.ns)&&(this.ns=e),this.f0=s/(this.ns*Math.pow(i,this.ns)),this.rh=this.a*this.f0*Math.pow(c,this.ns),this.title||(this.title="Lambert Conformal Conic")}}function Ah(t){var e=t.x,a=t.y;Math.abs(2*Math.abs(a)-Math.PI)<=T&&(a=ua(a)*(M-2*T));var s=Math.abs(Math.abs(a)-M),i,r;if(s>T)i=Bt(this.e,a,Math.sin(a)),r=this.a*this.f0*Math.pow(i,this.ns);else{if(s=a*this.ns,s<=0)return null;r=0}var o=this.ns*R(e-this.long0,this.over);return t.x=this.k0*(r*Math.sin(o))+this.x0,t.y=this.k0*(this.rh-r*Math.cos(o))+this.y0,t}function Ph(t){var e,a,s,i,r,o=(t.x-this.x0)/this.k0,n=this.rh-(t.y-this.y0)/this.k0;this.ns>0?(e=Math.sqrt(o*o+n*n),a=1):(e=-Math.sqrt(o*o+n*n),a=-1);var l=0;if(e!==0&&(l=Math.atan2(a*o,a*n)),e!==0||this.ns>0){if(a=1/this.ns,s=Math.pow(e/(this.a*this.f0),a),i=na(this.e,s),i===-9999)return null}else i=-M;return r=R(l/this.ns+this.long0,this.over),t.x=r,t.y=i,t}var kh=["Lambert Tangential Conformal Conic Projection","Lambert_Conformal_Conic","Lambert_Conformal_Conic_1SP","Lambert_Conformal_Conic_2SP","lcc","Lambert Conic Conformal (1SP)","Lambert Conic Conformal (2SP)"];const Ch={init:Eh,forward:Ah,inverse:Ph,names:kh};function Th(){this.a=6377397155e-3,this.es=.006674372230614,this.e=Math.sqrt(this.es),this.lat0||(this.lat0=.863937979737193),this.long0||(this.long0=.7417649320975901-.308341501185665),this.k0||(this.k0=.9999),this.s45=.785398163397448,this.s90=2*this.s45,this.fi0=this.lat0,this.e2=this.es,this.e=Math.sqrt(this.e2),this.alfa=Math.sqrt(1+this.e2*Math.pow(Math.cos(this.fi0),4)/(1-this.e2)),this.uq=1.04216856380474,this.u0=Math.asin(Math.sin(this.fi0)/this.alfa),this.g=Math.pow((1+this.e*Math.sin(this.fi0))/(1-this.e*Math.sin(this.fi0)),this.alfa*this.e/2),this.k=Math.tan(this.u0/2+this.s45)/Math.pow(Math.tan(this.fi0/2+this.s45),this.alfa)*this.g,this.k1=this.k0,this.n0=this.a*Math.sqrt(1-this.e2)/(1-this.e2*Math.pow(Math.sin(this.fi0),2)),this.s0=1.37008346281555,this.n=Math.sin(this.s0),this.ro0=this.k1*this.n0/Math.tan(this.s0),this.ad=this.s90-this.uq}function $h(t){var e,a,s,i,r,o,n,l=t.x,c=t.y,u=R(l-this.long0,this.over);return e=Math.pow((1+this.e*Math.sin(c))/(1-this.e*Math.sin(c)),this.alfa*this.e/2),a=2*(Math.atan(this.k*Math.pow(Math.tan(c/2+this.s45),this.alfa)/e)-this.s45),s=-u*this.alfa,i=Math.asin(Math.cos(this.ad)*Math.sin(a)+Math.sin(this.ad)*Math.cos(a)*Math.cos(s)),r=Math.asin(Math.cos(a)*Math.sin(s)/Math.cos(i)),o=this.n*r,n=this.ro0*Math.pow(Math.tan(this.s0/2+this.s45),this.n)/Math.pow(Math.tan(i/2+this.s45),this.n),t.y=n*Math.cos(o)/1,t.x=n*Math.sin(o)/1,this.czech||(t.y*=-1,t.x*=-1),t}function Lh(t){var e,a,s,i,r,o,n,l,c=t.x;t.x=t.y,t.y=c,this.czech||(t.y*=-1,t.x*=-1),o=Math.sqrt(t.x*t.x+t.y*t.y),r=Math.atan2(t.y,t.x),i=r/Math.sin(this.s0),s=2*(Math.atan(Math.pow(this.ro0/o,1/this.n)*Math.tan(this.s0/2+this.s45))-this.s45),e=Math.asin(Math.cos(this.ad)*Math.sin(s)-Math.sin(this.ad)*Math.cos(s)*Math.cos(i)),a=Math.asin(Math.cos(s)*Math.sin(i)/Math.cos(e)),t.x=this.long0-a/this.alfa,n=e,l=0;var u=0;do t.y=2*(Math.atan(Math.pow(this.k,-1/this.alfa)*Math.pow(Math.tan(e/2+this.s45),1/this.alfa)*Math.pow((1+this.e*Math.sin(n))/(1-this.e*Math.sin(n)),this.e/2))-this.s45),Math.abs(n-t.y)<1e-10&&(l=1),n=t.y,u+=1;while(l===0&&u<15);return u>=15?null:t}var Gh=["Krovak","krovak"];const Nh={init:Th,forward:$h,inverse:Lh,names:Gh};function Mt(t,e,a,s,i){return t*i-e*Math.sin(2*i)+a*Math.sin(4*i)-s*Math.sin(6*i)}function pa(t){return 1-.25*t*(1+t/16*(3+1.25*t))}function fa(t){return .375*t*(1+.25*t*(1+.46875*t))}function ga(t){return .05859375*t*t*(1+.75*t)}function ma(t){return t*t*t*(35/3072)}function ui(t,e,a){var s=e*a;return t/Math.sqrt(1-s*s)}function oe(t){return Math.abs(t)<M?t:t-ua(t)*Math.PI}function Oa(t,e,a,s,i){var r,o;r=t/e;for(var n=0;n<15;n++)if(o=(t-(e*r-a*Math.sin(2*r)+s*Math.sin(4*r)-i*Math.sin(6*r)))/(e-2*a*Math.cos(2*r)+4*s*Math.cos(4*r)-6*i*Math.cos(6*r)),r+=o,Math.abs(o)<=1e-10)return r;return NaN}function Rh(){this.sphere||(this.e0=pa(this.es),this.e1=fa(this.es),this.e2=ga(this.es),this.e3=ma(this.es),this.ml0=this.a*Mt(this.e0,this.e1,this.e2,this.e3,this.lat0))}function Ih(t){var e,a,s=t.x,i=t.y;if(s=R(s-this.long0,this.over),this.sphere)e=this.a*Math.asin(Math.cos(i)*Math.sin(s)),a=this.a*(Math.atan2(Math.tan(i),Math.cos(s))-this.lat0);else{var r=Math.sin(i),o=Math.cos(i),n=ui(this.a,this.e,r),l=Math.tan(i)*Math.tan(i),c=s*Math.cos(i),u=c*c,d=this.es*o*o/(1-this.es),h=this.a*Mt(this.e0,this.e1,this.e2,this.e3,i);e=n*c*(1-u*l*(1/6-(8-l+8*d)*u/120)),a=h-this.ml0+n*r/o*u*(.5+(5-l+6*d)*u/24)}return t.x=e+this.x0,t.y=a+this.y0,t}function Bh(t){t.x-=this.x0,t.y-=this.y0;var e=t.x/this.a,a=t.y/this.a,s,i;if(this.sphere){var r=a+this.lat0;s=Math.asin(Math.sin(r)*Math.cos(e)),i=Math.atan2(Math.tan(e),Math.cos(r))}else{var o=this.ml0/this.a+a,n=Oa(o,this.e0,this.e1,this.e2,this.e3);if(Math.abs(Math.abs(n)-M)<=T)return t.x=this.long0,t.y=M,a<0&&(t.y*=-1),t;var l=ui(this.a,this.e,Math.sin(n)),c=l*l*l/this.a/this.a*(1-this.es),u=Math.pow(Math.tan(n),2),d=e*this.a/l,h=d*d;s=n-l*Math.tan(n)/c*d*d*(.5-(1+3*u)*d*d/24),i=d*(1-h*(u/3+(1+3*u)*u*h/15))/Math.cos(n)}return t.x=R(i+this.long0,this.over),t.y=oe(s),t}var Dh=["Cassini","Cassini_Soldner","cass"];const Fh={init:Rh,forward:Ih,inverse:Bh,names:Dh};function ae(t,e){var a;return t>1e-7?(a=t*e,(1-t*t)*(e/(1-a*a)-.5/t*Math.log((1-a)/(1+a)))):2*e}var Ps=1,ks=2,Cs=3,Ca=4;function Oh(){var t=Math.abs(this.lat0);if(Math.abs(t-M)<T?this.mode=this.lat0<0?Ps:ks:Math.abs(t)<T?this.mode=Cs:this.mode=Ca,this.es>0){var e;switch(this.qp=ae(this.e,1),this.mmf=.5/(1-this.es),this.apa=Jh(this.es),this.mode){case ks:this.dd=1;break;case Ps:this.dd=1;break;case Cs:this.rq=Math.sqrt(.5*this.qp),this.dd=1/this.rq,this.xmf=1,this.ymf=.5*this.qp;break;case Ca:this.rq=Math.sqrt(.5*this.qp),e=Math.sin(this.lat0),this.sinb1=ae(this.e,e)/this.qp,this.cosb1=Math.sqrt(1-this.sinb1*this.sinb1),this.dd=Math.cos(this.lat0)/(Math.sqrt(1-this.es*e*e)*this.rq*this.cosb1),this.ymf=(this.xmf=this.rq)/this.dd,this.xmf*=this.dd;break}}else this.mode===Ca&&(this.sinph0=Math.sin(this.lat0),this.cosph0=Math.cos(this.lat0))}function jh(t){var e,a,s,i,r,o,n,l,c,u,d=t.x,h=t.y;if(d=R(d-this.long0,this.over),this.sphere){if(r=Math.sin(h),u=Math.cos(h),s=Math.cos(d),this.mode===this.OBLIQ||this.mode===this.EQUIT){if(a=this.mode===this.EQUIT?1+u*s:1+this.sinph0*r+this.cosph0*u*s,a<=T)return null;a=Math.sqrt(2/a),e=a*u*Math.sin(d),a*=this.mode===this.EQUIT?r:this.cosph0*r-this.sinph0*u*s}else if(this.mode===this.N_POLE||this.mode===this.S_POLE){if(this.mode===this.N_POLE&&(s=-s),Math.abs(h+this.lat0)<T)return null;a=X-h*.5,a=2*(this.mode===this.S_POLE?Math.cos(a):Math.sin(a)),e=a*Math.sin(d),a*=s}}else{switch(n=0,l=0,c=0,s=Math.cos(d),i=Math.sin(d),r=Math.sin(h),o=ae(this.e,r),(this.mode===this.OBLIQ||this.mode===this.EQUIT)&&(n=o/this.qp,l=Math.sqrt(1-n*n)),this.mode){case this.OBLIQ:c=1+this.sinb1*n+this.cosb1*l*s;break;case this.EQUIT:c=1+l*s;break;case this.N_POLE:c=M+h,o=this.qp-o;break;case this.S_POLE:c=h-M,o=this.qp+o;break}if(Math.abs(c)<T)return null;switch(this.mode){case this.OBLIQ:case this.EQUIT:c=Math.sqrt(2/c),this.mode===this.OBLIQ?a=this.ymf*c*(this.cosb1*n-this.sinb1*l*s):a=(c=Math.sqrt(2/(1+l*s)))*n*this.ymf,e=this.xmf*c*l*i;break;case this.N_POLE:case this.S_POLE:o>=0?(e=(c=Math.sqrt(o))*i,a=s*(this.mode===this.S_POLE?c:-c)):e=a=0;break}}return t.x=this.a*e+this.x0,t.y=this.a*a+this.y0,t}function qh(t){t.x-=this.x0,t.y-=this.y0;var e=t.x/this.a,a=t.y/this.a,s,i,r,o,n,l,c;if(this.sphere){var u=0,d,h=0;if(d=Math.sqrt(e*e+a*a),i=d*.5,i>1)return null;switch(i=2*Math.asin(i),(this.mode===this.OBLIQ||this.mode===this.EQUIT)&&(h=Math.sin(i),u=Math.cos(i)),this.mode){case this.EQUIT:i=Math.abs(d)<=T?0:Math.asin(a*h/d),e*=h,a=u*d;break;case this.OBLIQ:i=Math.abs(d)<=T?this.lat0:Math.asin(u*this.sinph0+a*h*this.cosph0/d),e*=h*this.cosph0,a=(u-Math.sin(i)*this.sinph0)*d;break;case this.N_POLE:a=-a,i=M-i;break;case this.S_POLE:i-=M;break}s=a===0&&(this.mode===this.EQUIT||this.mode===this.OBLIQ)?0:Math.atan2(e,a)}else{if(c=0,this.mode===this.OBLIQ||this.mode===this.EQUIT){if(e/=this.dd,a*=this.dd,l=Math.sqrt(e*e+a*a),l<T)return t.x=this.long0,t.y=this.lat0,t;o=2*Math.asin(.5*l/this.rq),r=Math.cos(o),e*=o=Math.sin(o),this.mode===this.OBLIQ?(c=r*this.sinb1+a*o*this.cosb1/l,n=this.qp*c,a=l*this.cosb1*r-a*this.sinb1*o):(c=a*o/l,n=this.qp*c,a=l*r)}else if(this.mode===this.N_POLE||this.mode===this.S_POLE){if(this.mode===this.N_POLE&&(a=-a),n=e*e+a*a,!n)return t.x=this.long0,t.y=this.lat0,t;c=1-n/this.qp,this.mode===this.S_POLE&&(c=-c)}s=Math.atan2(e,a),i=Yh(Math.asin(c),this.apa)}return t.x=R(this.long0+s,this.over),t.y=i,t}var zh=.3333333333333333,Uh=.17222222222222222,Hh=.10257936507936508,Vh=.06388888888888888,Wh=.0664021164021164,Kh=.016415012942191543;function Jh(t){var e,a=[];return a[0]=t*zh,e=t*t,a[0]+=e*Uh,a[1]=e*Vh,e*=t,a[0]+=e*Hh,a[1]+=e*Wh,a[2]=e*Kh,a}function Yh(t,e){var a=t+t;return t+e[0]*Math.sin(a)+e[1]*Math.sin(a+a)+e[2]*Math.sin(a+a+a)}var Zh=["Lambert Azimuthal Equal Area","Lambert_Azimuthal_Equal_Area","laea"];const Xh={init:Oh,forward:jh,inverse:qh,names:Zh,S_POLE:Ps,N_POLE:ks,EQUIT:Cs,OBLIQ:Ca};function re(t){return Math.abs(t)>1&&(t=t>1?1:-1),Math.asin(t)}function Qh(){Math.abs(this.lat1+this.lat2)<T||(this.temp=this.b/this.a,this.es=1-Math.pow(this.temp,2),this.e3=Math.sqrt(this.es),this.sin_po=Math.sin(this.lat1),this.cos_po=Math.cos(this.lat1),this.t1=this.sin_po,this.con=this.sin_po,this.ms1=zt(this.e3,this.sin_po,this.cos_po),this.qs1=ae(this.e3,this.sin_po),this.sin_po=Math.sin(this.lat2),this.cos_po=Math.cos(this.lat2),this.t2=this.sin_po,this.ms2=zt(this.e3,this.sin_po,this.cos_po),this.qs2=ae(this.e3,this.sin_po),this.sin_po=Math.sin(this.lat0),this.cos_po=Math.cos(this.lat0),this.t3=this.sin_po,this.qs0=ae(this.e3,this.sin_po),Math.abs(this.lat1-this.lat2)>T?this.ns0=(this.ms1*this.ms1-this.ms2*this.ms2)/(this.qs2-this.qs1):this.ns0=this.con,this.c=this.ms1*this.ms1+this.ns0*this.qs1,this.rh=this.a*Math.sqrt(this.c-this.ns0*this.qs0)/this.ns0)}function t0(t){var e=t.x,a=t.y;this.sin_phi=Math.sin(a),this.cos_phi=Math.cos(a);var s=ae(this.e3,this.sin_phi),i=this.a*Math.sqrt(this.c-this.ns0*s)/this.ns0,r=this.ns0*R(e-this.long0,this.over),o=i*Math.sin(r)+this.x0,n=this.rh-i*Math.cos(r)+this.y0;return t.x=o,t.y=n,t}function e0(t){var e,a,s,i,r,o;return t.x-=this.x0,t.y=this.rh-t.y+this.y0,this.ns0>=0?(e=Math.sqrt(t.x*t.x+t.y*t.y),s=1):(e=-Math.sqrt(t.x*t.x+t.y*t.y),s=-1),i=0,e!==0&&(i=Math.atan2(s*t.x,s*t.y)),s=e*this.ns0/this.a,this.sphere?o=Math.asin((this.c-s*s)/(2*this.ns0)):(a=(this.c-s*s)/this.ns0,o=this.phi1z(this.e3,a)),r=R(i/this.ns0+this.long0,this.over),t.x=r,t.y=o,t}function a0(t,e){var a,s,i,r,o,n=re(.5*e);if(t<T)return n;for(var l=t*t,c=1;c<=25;c++)if(a=Math.sin(n),s=Math.cos(n),i=t*a,r=1-i*i,o=.5*r*r/s*(e/(1-l)-a/r+.5/t*Math.log((1-i)/(1+i))),n=n+o,Math.abs(o)<=1e-7)return n;return null}var s0=["Albers_Conic_Equal_Area","Albers_Equal_Area","Albers","aea"];const i0={init:Qh,forward:t0,inverse:e0,names:s0,phi1z:a0};function r0(){this.sin_p14=Math.sin(this.lat0),this.cos_p14=Math.cos(this.lat0),this.infinity_dist=1e3*this.a,this.rc=1}function n0(t){var e,a,s,i,r,o,n,l,c=t.x,u=t.y;return s=R(c-this.long0,this.over),e=Math.sin(u),a=Math.cos(u),i=Math.cos(s),o=this.sin_p14*e+this.cos_p14*a*i,r=1,o>0||Math.abs(o)<=T?(n=this.x0+this.a*r*a*Math.sin(s)/o,l=this.y0+this.a*r*(this.cos_p14*e-this.sin_p14*a*i)/o):(n=this.x0+this.infinity_dist*a*Math.sin(s),l=this.y0+this.infinity_dist*(this.cos_p14*e-this.sin_p14*a*i)),t.x=n,t.y=l,t}function o0(t){var e,a,s,i,r,o;return t.x=(t.x-this.x0)/this.a,t.y=(t.y-this.y0)/this.a,t.x/=this.k0,t.y/=this.k0,(e=Math.sqrt(t.x*t.x+t.y*t.y))?(i=Math.atan2(e,this.rc),a=Math.sin(i),s=Math.cos(i),o=re(s*this.sin_p14+t.y*a*this.cos_p14/e),r=Math.atan2(t.x*a,e*this.cos_p14*s-t.y*this.sin_p14*a),r=R(this.long0+r,this.over)):(o=this.phic0,r=0),t.x=r,t.y=o,t}var l0=["gnom"];const c0={init:r0,forward:n0,inverse:o0,names:l0};function d0(t,e){var a=1-(1-t*t)/(2*t)*Math.log((1-t)/(1+t));if(Math.abs(Math.abs(e)-a)<1e-6)return e<0?-1*M:M;for(var s=Math.asin(.5*e),i,r,o,n,l=0;l<30;l++)if(r=Math.sin(s),o=Math.cos(s),n=t*r,i=Math.pow(1-n*n,2)/(2*o)*(e/(1-t*t)-r/(1-n*n)+.5/t*Math.log((1-n)/(1+n))),s+=i,Math.abs(i)<=1e-10)return s;return NaN}function h0(){this.sphere||(this.k0=zt(this.e,Math.sin(this.lat_ts),Math.cos(this.lat_ts)))}function u0(t){var e=t.x,a=t.y,s,i,r=R(e-this.long0,this.over);if(this.sphere)s=this.x0+this.a*r*Math.cos(this.lat_ts),i=this.y0+this.a*Math.sin(a)/Math.cos(this.lat_ts);else{var o=ae(this.e,Math.sin(a));s=this.x0+this.a*this.k0*r,i=this.y0+this.a*o*.5/this.k0}return t.x=s,t.y=i,t}function p0(t){t.x-=this.x0,t.y-=this.y0;var e,a;return this.sphere?(e=R(this.long0+t.x/this.a/Math.cos(this.lat_ts),this.over),a=Math.asin(t.y/this.a*Math.cos(this.lat_ts))):(a=d0(this.e,2*t.y*this.k0/this.a),e=R(this.long0+t.x/(this.a*this.k0),this.over)),t.x=e,t.y=a,t}var f0=["cea"];const g0={init:h0,forward:u0,inverse:p0,names:f0};function m0(){this.x0=this.x0||0,this.y0=this.y0||0,this.lat0=this.lat0||0,this.long0=this.long0||0,this.lat_ts=this.lat_ts||0,this.title=this.title||"Equidistant Cylindrical (Plate Carre)",this.rc=Math.cos(this.lat_ts)}function v0(t){var e=t.x,a=t.y,s=R(e-this.long0,this.over),i=oe(a-this.lat0);return t.x=this.x0+this.a*s*this.rc,t.y=this.y0+this.a*i,t}function y0(t){var e=t.x,a=t.y;return t.x=R(this.long0+(e-this.x0)/(this.a*this.rc),this.over),t.y=oe(this.lat0+(a-this.y0)/this.a),t}var b0=["Equirectangular","Equidistant_Cylindrical","Equidistant_Cylindrical_Spherical","eqc"];const _0={init:m0,forward:v0,inverse:y0,names:b0};var rr=20;function M0(){this.temp=this.b/this.a,this.es=1-Math.pow(this.temp,2),this.e=Math.sqrt(this.es),this.e0=pa(this.es),this.e1=fa(this.es),this.e2=ga(this.es),this.e3=ma(this.es),this.ml0=this.a*Mt(this.e0,this.e1,this.e2,this.e3,this.lat0)}function x0(t){var e=t.x,a=t.y,s,i,r,o=R(e-this.long0,this.over);if(r=o*Math.sin(a),this.sphere)Math.abs(a)<=T?(s=this.a*o,i=-1*this.a*this.lat0):(s=this.a*Math.sin(r)/Math.tan(a),i=this.a*(oe(a-this.lat0)+(1-Math.cos(r))/Math.tan(a)));else if(Math.abs(a)<=T)s=this.a*o,i=-1*this.ml0;else{var n=ui(this.a,this.e,Math.sin(a))/Math.tan(a);s=n*Math.sin(r),i=this.a*Mt(this.e0,this.e1,this.e2,this.e3,a)-this.ml0+n*(1-Math.cos(r))}return t.x=s+this.x0,t.y=i+this.y0,t}function w0(t){var e,a,s,i,r,o,n,l,c;if(s=t.x-this.x0,i=t.y-this.y0,this.sphere)if(Math.abs(i+this.a*this.lat0)<=T)e=R(s/this.a+this.long0,this.over),a=0;else{o=this.lat0+i/this.a,n=s*s/this.a/this.a+o*o,l=o;var u;for(r=rr;r;--r)if(u=Math.tan(l),c=-1*(o*(l*u+1)-l-.5*(l*l+n)*u)/((l-o)/u-1),l+=c,Math.abs(c)<=T){a=l;break}e=R(this.long0+Math.asin(s*Math.tan(l)/this.a)/Math.sin(a),this.over)}else if(Math.abs(i+this.ml0)<=T)a=0,e=R(this.long0+s/this.a,this.over);else{o=(this.ml0+i)/this.a,n=s*s/this.a/this.a+o*o,l=o;var d,h,f,p,m;for(r=rr;r;--r)if(m=this.e*Math.sin(l),d=Math.sqrt(1-m*m)*Math.tan(l),h=this.a*Mt(this.e0,this.e1,this.e2,this.e3,l),f=this.e0-2*this.e1*Math.cos(2*l)+4*this.e2*Math.cos(4*l)-6*this.e3*Math.cos(6*l),p=h/this.a,c=(o*(d*p+1)-p-.5*d*(p*p+n))/(this.es*Math.sin(2*l)*(p*p+n-2*o*p)/(4*d)+(o-p)*(d*f-2/Math.sin(2*l))-f),l-=c,Math.abs(c)<=T){a=l;break}d=Math.sqrt(1-this.es*Math.pow(Math.sin(a),2))*Math.tan(a),e=R(this.long0+Math.asin(s*d/this.a)/Math.sin(a),this.over)}return t.x=e,t.y=a,t}var S0=["Polyconic","American_Polyconic","poly"];const E0={init:M0,forward:x0,inverse:w0,names:S0};function A0(){this.A=[],this.A[1]=.6399175073,this.A[2]=-.1358797613,this.A[3]=.063294409,this.A[4]=-.02526853,this.A[5]=.0117879,this.A[6]=-.0055161,this.A[7]=.0026906,this.A[8]=-.001333,this.A[9]=67e-5,this.A[10]=-34e-5,this.B_re=[],this.B_im=[],this.B_re[1]=.7557853228,this.B_im[1]=0,this.B_re[2]=.249204646,this.B_im[2]=.003371507,this.B_re[3]=-.001541739,this.B_im[3]=.04105856,this.B_re[4]=-.10162907,this.B_im[4]=.01727609,this.B_re[5]=-.26623489,this.B_im[5]=-.36249218,this.B_re[6]=-.6870983,this.B_im[6]=-1.1651967,this.C_re=[],this.C_im=[],this.C_re[1]=1.3231270439,this.C_im[1]=0,this.C_re[2]=-.577245789,this.C_im[2]=-.007809598,this.C_re[3]=.508307513,this.C_im[3]=-.112208952,this.C_re[4]=-.15094762,this.C_im[4]=.18200602,this.C_re[5]=1.01418179,this.C_im[5]=1.64497696,this.C_re[6]=1.9660549,this.C_im[6]=2.5127645,this.D=[],this.D[1]=1.5627014243,this.D[2]=.5185406398,this.D[3]=-.03333098,this.D[4]=-.1052906,this.D[5]=-.0368594,this.D[6]=.007317,this.D[7]=.0122,this.D[8]=.00394,this.D[9]=-.0013}function P0(t){var e,a=t.x,s=t.y,i=s-this.lat0,r=a-this.long0,o=i/Je*1e-5,n=r,l=1,c=0;for(e=1;e<=10;e++)l=l*o,c=c+this.A[e]*l;var u=c,d=n,h=1,f=0,p,m,g=0,y=0;for(e=1;e<=6;e++)p=h*u-f*d,m=f*u+h*d,h=p,f=m,g=g+this.B_re[e]*h-this.B_im[e]*f,y=y+this.B_im[e]*h+this.B_re[e]*f;return t.x=y*this.a+this.x0,t.y=g*this.a+this.y0,t}function k0(t){var e,a=t.x,s=t.y,i=a-this.x0,r=s-this.y0,o=r/this.a,n=i/this.a,l=1,c=0,u,d,h=0,f=0;for(e=1;e<=6;e++)u=l*o-c*n,d=c*o+l*n,l=u,c=d,h=h+this.C_re[e]*l-this.C_im[e]*c,f=f+this.C_im[e]*l+this.C_re[e]*c;for(var p=0;p<this.iterations;p++){var m=h,g=f,y,v,b=o,_=n;for(e=2;e<=6;e++)y=m*h-g*f,v=g*h+m*f,m=y,g=v,b=b+(e-1)*(this.B_re[e]*m-this.B_im[e]*g),_=_+(e-1)*(this.B_im[e]*m+this.B_re[e]*g);m=1,g=0;var x=this.B_re[1],E=this.B_im[1];for(e=2;e<=6;e++)y=m*h-g*f,v=g*h+m*f,m=y,g=v,x=x+e*(this.B_re[e]*m-this.B_im[e]*g),E=E+e*(this.B_im[e]*m+this.B_re[e]*g);var A=x*x+E*E;h=(b*x+_*E)/A,f=(_*x-b*E)/A}var G=h,P=f,$=1,S=0;for(e=1;e<=9;e++)$=$*G,S=S+this.D[e]*$;var w=this.lat0+S*Je*1e5,k=this.long0+P;return t.x=k,t.y=w,t}var C0=["New_Zealand_Map_Grid","nzmg"];const T0={init:A0,forward:P0,inverse:k0,names:C0};function $0(){}function L0(t){var e=t.x,a=t.y,s=R(e-this.long0,this.over),i=this.x0+this.a*s,r=this.y0+this.a*Math.log(Math.tan(Math.PI/4+a/2.5))*1.25;return t.x=i,t.y=r,t}function G0(t){t.x-=this.x0,t.y-=this.y0;var e=R(this.long0+t.x/this.a,this.over),a=2.5*(Math.atan(Math.exp(.8*t.y/this.a))-Math.PI/4);return t.x=e,t.y=a,t}var N0=["Miller_Cylindrical","mill"];const R0={init:$0,forward:L0,inverse:G0,names:N0};var I0=20;function B0(){this.sphere?(this.n=1,this.m=0,this.es=0,this.C_y=Math.sqrt((this.m+1)/this.n),this.C_x=this.C_y/(this.m+1)):this.en=ni(this.es)}function D0(t){var e,a,s=t.x,i=t.y;if(s=R(s-this.long0,this.over),this.sphere){if(!this.m)i=this.n!==1?Math.asin(this.n*Math.sin(i)):i;else for(var r=this.n*Math.sin(i),o=I0;o;--o){var n=(this.m*i+Math.sin(i)-r)/(this.m+Math.cos(i));if(i-=n,Math.abs(n)<T)break}e=this.a*this.C_x*s*(this.m+Math.cos(i)),a=this.a*this.C_y*i}else{var l=Math.sin(i),c=Math.cos(i);a=this.a*Be(i,l,c,this.en),e=this.a*s*c/Math.sqrt(1-this.es*l*l)}return t.x=e,t.y=a,t}function F0(t){var e,a,s,i;return t.x-=this.x0,s=t.x/this.a,t.y-=this.y0,e=t.y/this.a,this.sphere?(e/=this.C_y,s=s/(this.C_x*(this.m+Math.cos(e))),this.m?e=re((this.m*e+Math.sin(e))/this.n):this.n!==1&&(e=re(Math.sin(e)/this.n)),s=R(s+this.long0,this.over),e=oe(e)):(e=oi(t.y/this.a,this.es,this.en),i=Math.abs(e),i<M?(i=Math.sin(e),a=this.long0+t.x*Math.sqrt(1-this.es*i*i)/(this.a*Math.cos(e)),s=R(a,this.over)):i-T<M&&(s=this.long0)),t.x=s,t.y=e,t}var O0=["Sinusoidal","sinu"];const j0={init:B0,forward:D0,inverse:F0,names:O0};function q0(){this.x0=this.x0!==void 0?this.x0:0,this.y0=this.y0!==void 0?this.y0:0,this.long0=this.long0!==void 0?this.long0:0}function z0(t){for(var e=t.x,a=t.y,s=R(e-this.long0,this.over),i=a,r=Math.PI*Math.sin(a);;){var o=-(i+Math.sin(i)-r)/(1+Math.cos(i));if(i+=o,Math.abs(o)<T)break}i/=2,Math.PI/2-Math.abs(a)<T&&(s=0);var n=.900316316158*this.a*s*Math.cos(i)+this.x0,l=1.4142135623731*this.a*Math.sin(i)+this.y0;return t.x=n,t.y=l,t}function U0(t){var e,a;t.x-=this.x0,t.y-=this.y0,a=t.y/(1.4142135623731*this.a),Math.abs(a)>.999999999999&&(a=.999999999999),e=Math.asin(a);var s=R(this.long0+t.x/(.900316316158*this.a*Math.cos(e)),this.over);s<-Math.PI&&(s=-Math.PI),s>Math.PI&&(s=Math.PI),a=(2*e+Math.sin(2*e))/Math.PI,Math.abs(a)>1&&(a=1);var i=Math.asin(a);return t.x=s,t.y=i,t}var H0=["Mollweide","moll"];const V0={init:q0,forward:z0,inverse:U0,names:H0};function W0(){Math.abs(this.lat1+this.lat2)<T||(this.lat2=this.lat2||this.lat1,this.temp=this.b/this.a,this.es=1-Math.pow(this.temp,2),this.e=Math.sqrt(this.es),this.e0=pa(this.es),this.e1=fa(this.es),this.e2=ga(this.es),this.e3=ma(this.es),this.sin_phi=Math.sin(this.lat1),this.cos_phi=Math.cos(this.lat1),this.ms1=zt(this.e,this.sin_phi,this.cos_phi),this.ml1=Mt(this.e0,this.e1,this.e2,this.e3,this.lat1),Math.abs(this.lat1-this.lat2)<T?this.ns=this.sin_phi:(this.sin_phi=Math.sin(this.lat2),this.cos_phi=Math.cos(this.lat2),this.ms2=zt(this.e,this.sin_phi,this.cos_phi),this.ml2=Mt(this.e0,this.e1,this.e2,this.e3,this.lat2),this.ns=(this.ms1-this.ms2)/(this.ml2-this.ml1)),this.g=this.ml1+this.ms1/this.ns,this.ml0=Mt(this.e0,this.e1,this.e2,this.e3,this.lat0),this.rh=this.a*(this.g-this.ml0))}function K0(t){var e=t.x,a=t.y,s;if(this.sphere)s=this.a*(this.g-a);else{var i=Mt(this.e0,this.e1,this.e2,this.e3,a);s=this.a*(this.g-i)}var r=this.ns*R(e-this.long0,this.over),o=this.x0+s*Math.sin(r),n=this.y0+this.rh-s*Math.cos(r);return t.x=o,t.y=n,t}function J0(t){t.x-=this.x0,t.y=this.rh-t.y+this.y0;var e,a,s,i;this.ns>=0?(a=Math.sqrt(t.x*t.x+t.y*t.y),e=1):(a=-Math.sqrt(t.x*t.x+t.y*t.y),e=-1);var r=0;if(a!==0&&(r=Math.atan2(e*t.x,e*t.y)),this.sphere)return i=R(this.long0+r/this.ns,this.over),s=oe(this.g-a/this.a),t.x=i,t.y=s,t;var o=this.g-a/this.a;return s=Oa(o,this.e0,this.e1,this.e2,this.e3),i=R(this.long0+r/this.ns,this.over),t.x=i,t.y=s,t}var Y0=["Equidistant_Conic","eqdc"];const Z0={init:W0,forward:K0,inverse:J0,names:Y0};function X0(){this.R=this.a}function Q0(t){var e=t.x,a=t.y,s=R(e-this.long0,this.over),i,r;Math.abs(a)<=T&&(i=this.x0+this.R*s,r=this.y0);var o=re(2*Math.abs(a/Math.PI));(Math.abs(s)<=T||Math.abs(Math.abs(a)-M)<=T)&&(i=this.x0,a>=0?r=this.y0+Math.PI*this.R*Math.tan(.5*o):r=this.y0+Math.PI*this.R*-Math.tan(.5*o));var n=.5*Math.abs(Math.PI/s-s/Math.PI),l=n*n,c=Math.sin(o),u=Math.cos(o),d=u/(c+u-1),h=d*d,f=d*(2/c-1),p=f*f,m=Math.PI*this.R*(n*(d-p)+Math.sqrt(l*(d-p)*(d-p)-(p+l)*(h-p)))/(p+l);s<0&&(m=-m),i=this.x0+m;var g=l+d;return m=Math.PI*this.R*(f*g-n*Math.sqrt((p+l)*(l+1)-g*g))/(p+l),a>=0?r=this.y0+m:r=this.y0-m,t.x=i,t.y=r,t}function tu(t){var e,a,s,i,r,o,n,l,c,u,d,h,f;return t.x-=this.x0,t.y-=this.y0,d=Math.PI*this.R,s=t.x/d,i=t.y/d,r=s*s+i*i,o=-Math.abs(i)*(1+r),n=o-2*i*i+s*s,l=-2*o+1+2*i*i+r*r,f=i*i/l+(2*n*n*n/l/l/l-9*o*n/l/l)/27,c=(o-n*n/3/l)/l,u=2*Math.sqrt(-c/3),d=3*f/c/u,Math.abs(d)>1&&(d>=0?d=1:d=-1),h=Math.acos(d)/3,t.y>=0?a=(-u*Math.cos(h+Math.PI/3)-n/3/l)*Math.PI:a=-(-u*Math.cos(h+Math.PI/3)-n/3/l)*Math.PI,Math.abs(s)<T?e=this.long0:e=R(this.long0+Math.PI*(r-1+Math.sqrt(1+2*(s*s-i*i)+r*r))/2/s,this.over),t.x=e,t.y=a,t}var eu=["Van_der_Grinten_I","VanDerGrinten","Van_der_Grinten","vandg"];const au={init:X0,forward:Q0,inverse:tu,names:eu};function su(t,e,a,s,i,r){const o=s-e,n=Math.atan((1-r)*Math.tan(t)),l=Math.atan((1-r)*Math.tan(a)),c=Math.sin(n),u=Math.cos(n),d=Math.sin(l),h=Math.cos(l);let f=o,p,m=100,g,y,v,b,_,x,E,A,G,P,$,S,w,k;do{if(g=Math.sin(f),y=Math.cos(f),v=Math.sqrt(h*g*(h*g)+(u*d-c*h*y)*(u*d-c*h*y)),v===0)return{azi1:0,s12:0};b=c*d+u*h*y,_=Math.atan2(v,b),x=u*h*g/v,E=1-x*x,A=E!==0?b-2*c*d/E:0,G=r/16*E*(4+r*(4-3*E)),p=f,f=o+(1-G)*r*x*(_+G*v*(A+G*b*(-1+2*A*A)))}while(Math.abs(f-p)>1e-12&&--m>0);return m===0?{azi1:NaN,s12:NaN}:(P=E*(i*i-i*(1-r)*(i*(1-r)))/(i*(1-r)*(i*(1-r))),$=1+P/16384*(4096+P*(-768+P*(320-175*P))),S=P/1024*(256+P*(-128+P*(74-47*P))),w=S*v*(A+S/4*(b*(-1+2*A*A)-S/6*A*(-3+4*v*v)*(-3+4*A*A))),k=i*(1-r)*$*(_-w),{azi1:Math.atan2(h*g,u*d-c*h*y),s12:k})}function iu(t,e,a,s,i,r){const o=Math.atan((1-r)*Math.tan(t)),n=Math.sin(o),l=Math.cos(o),c=Math.sin(a),u=Math.cos(a),d=Math.atan2(n,l*u),h=l*c,f=1-h*h,p=f*(i*i-i*(1-r)*(i*(1-r)))/(i*(1-r)*(i*(1-r))),m=1+p/16384*(4096+p*(-768+p*(320-175*p))),g=p/1024*(256+p*(-128+p*(74-47*p)));let y=s/(i*(1-r)*m),v,b=100,_,x,E,A;do _=Math.cos(2*d+y),x=Math.sin(y),E=Math.cos(y),A=g*x*(_+g/4*(E*(-1+2*_*_)-g/6*_*(-3+4*x*x)*(-3+4*_*_))),v=y,y=s/(i*(1-r)*m)+A;while(Math.abs(y-v)>1e-12&&--b>0);if(b===0)return{lat2:NaN,lon2:NaN};const G=n*x-l*E*u,P=Math.atan2(n*E+l*x*u,(1-r)*Math.sqrt(h*h+G*G)),$=Math.atan2(x*c,l*E-n*x*u),S=r/16*f*(4+r*(4-3*f)),w=$-(1-S)*r*h*(y+S*x*(_+S*E*(-1+2*_*_))),k=e+w;return{lat2:P,lon2:k}}function ru(){this.sin_p12=Math.sin(this.lat0),this.cos_p12=Math.cos(this.lat0),this.f=this.es/(1+Math.sqrt(1-this.es))}function nu(t){var e=t.x,a=t.y,s=Math.sin(t.y),i=Math.cos(t.y),r=R(e-this.long0,this.over),o,n,l,c,u,d,h,f,p,m,g;return this.sphere?Math.abs(this.sin_p12-1)<=T?(t.x=this.x0+this.a*(M-a)*Math.sin(r),t.y=this.y0-this.a*(M-a)*Math.cos(r),t):Math.abs(this.sin_p12+1)<=T?(t.x=this.x0+this.a*(M+a)*Math.sin(r),t.y=this.y0+this.a*(M+a)*Math.cos(r),t):(p=this.sin_p12*s+this.cos_p12*i*Math.cos(r),h=Math.acos(p),f=h?h/Math.sin(h):1,t.x=this.x0+this.a*f*i*Math.sin(r),t.y=this.y0+this.a*f*(this.cos_p12*s-this.sin_p12*i*Math.cos(r)),t):(o=pa(this.es),n=fa(this.es),l=ga(this.es),c=ma(this.es),Math.abs(this.sin_p12-1)<=T?(u=this.a*Mt(o,n,l,c,M),d=this.a*Mt(o,n,l,c,a),t.x=this.x0+(u-d)*Math.sin(r),t.y=this.y0-(u-d)*Math.cos(r),t):Math.abs(this.sin_p12+1)<=T?(u=this.a*Mt(o,n,l,c,M),d=this.a*Mt(o,n,l,c,a),t.x=this.x0+(u+d)*Math.sin(r),t.y=this.y0+(u+d)*Math.cos(r),t):Math.abs(e)<T&&Math.abs(a-this.lat0)<T?(t.x=t.y=0,t):(m=su(this.lat0,this.long0,a,e,this.a,this.f),g=m.azi1,t.x=m.s12*Math.sin(g),t.y=m.s12*Math.cos(g),t))}function ou(t){t.x-=this.x0,t.y-=this.y0;var e,a,s,i,r,o,n,l,c,u,d,h,f,p,m,g;return this.sphere?(e=Math.sqrt(t.x*t.x+t.y*t.y),e>2*M*this.a?void 0:(a=e/this.a,s=Math.sin(a),i=Math.cos(a),r=this.long0,Math.abs(e)<=T?o=this.lat0:(o=re(i*this.sin_p12+t.y*s*this.cos_p12/e),n=Math.abs(this.lat0)-M,Math.abs(n)<=T?this.lat0>=0?r=R(this.long0+Math.atan2(t.x,-t.y),this.over):r=R(this.long0-Math.atan2(-t.x,t.y),this.over):r=R(this.long0+Math.atan2(t.x*s,e*this.cos_p12*i-t.y*this.sin_p12*s),this.over)),t.x=r,t.y=o,t)):(l=pa(this.es),c=fa(this.es),u=ga(this.es),d=ma(this.es),Math.abs(this.sin_p12-1)<=T?(h=this.a*Mt(l,c,u,d,M),e=Math.sqrt(t.x*t.x+t.y*t.y),f=h-e,o=Oa(f/this.a,l,c,u,d),r=R(this.long0+Math.atan2(t.x,-1*t.y),this.over),t.x=r,t.y=o,t):Math.abs(this.sin_p12+1)<=T?(h=this.a*Mt(l,c,u,d,M),e=Math.sqrt(t.x*t.x+t.y*t.y),f=e-h,o=Oa(f/this.a,l,c,u,d),r=R(this.long0+Math.atan2(t.x,t.y),this.over),t.x=r,t.y=o,t):(p=Math.atan2(t.x,t.y),m=Math.sqrt(t.x*t.x+t.y*t.y),g=iu(this.lat0,this.long0,p,m,this.a,this.f),t.x=g.lon2,t.y=g.lat2,t))}var lu=["Azimuthal_Equidistant","aeqd"];const cu={init:ru,forward:nu,inverse:ou,names:lu};function du(){this.sin_p14=Math.sin(this.lat0),this.cos_p14=Math.cos(this.lat0)}function hu(t){var e,a,s,i,r,o,n,l,c=t.x,u=t.y;return s=R(c-this.long0,this.over),e=Math.sin(u),a=Math.cos(u),i=Math.cos(s),o=this.sin_p14*e+this.cos_p14*a*i,r=1,(o>0||Math.abs(o)<=T)&&(n=this.a*r*a*Math.sin(s),l=this.y0+this.a*r*(this.cos_p14*e-this.sin_p14*a*i)),t.x=n,t.y=l,t}function uu(t){var e,a,s,i,r,o,n;return t.x-=this.x0,t.y-=this.y0,e=Math.sqrt(t.x*t.x+t.y*t.y),a=re(e/this.a),s=Math.sin(a),i=Math.cos(a),o=this.long0,Math.abs(e)<=T?(n=this.lat0,t.x=o,t.y=n,t):(n=re(i*this.sin_p14+t.y*s*this.cos_p14/e),r=Math.abs(this.lat0)-M,Math.abs(r)<=T?(this.lat0>=0?o=R(this.long0+Math.atan2(t.x,-t.y),this.over):o=R(this.long0-Math.atan2(-t.x,t.y),this.over),t.x=o,t.y=n,t):(o=R(this.long0+Math.atan2(t.x*s,e*this.cos_p14*i-t.y*this.sin_p14*s),this.over),t.x=o,t.y=n,t))}var pu=["ortho"];const fu={init:du,forward:hu,inverse:uu,names:pu};var nt={FRONT:1,RIGHT:2,BACK:3,LEFT:4,TOP:5,BOTTOM:6},Q={AREA_0:1,AREA_1:2,AREA_2:3,AREA_3:4};function gu(){this.x0=this.x0||0,this.y0=this.y0||0,this.lat0=this.lat0||0,this.long0=this.long0||0,this.lat_ts=this.lat_ts||0,this.title=this.title||"Quadrilateralized Spherical Cube",this.lat0>=M-X/2?this.face=nt.TOP:this.lat0<=-(M-X/2)?this.face=nt.BOTTOM:Math.abs(this.long0)<=X?this.face=nt.FRONT:Math.abs(this.long0)<=M+X?this.face=this.long0>0?nt.RIGHT:nt.LEFT:this.face=nt.BACK,this.es!==0&&(this.one_minus_f=1-(this.a-this.b)/this.a,this.one_minus_f_squared=this.one_minus_f*this.one_minus_f)}function mu(t){var e={x:0,y:0},a,s,i,r,o,n,l={value:0};if(t.x-=this.long0,this.es!==0?a=Math.atan(this.one_minus_f_squared*Math.tan(t.y)):a=t.y,s=t.x,this.face===nt.TOP)r=M-a,s>=X&&s<=M+X?(l.value=Q.AREA_0,i=s-M):s>M+X||s<=-(M+X)?(l.value=Q.AREA_1,i=s>0?s-pt:s+pt):s>-(M+X)&&s<=-X?(l.value=Q.AREA_2,i=s+M):(l.value=Q.AREA_3,i=s);else if(this.face===nt.BOTTOM)r=M+a,s>=X&&s<=M+X?(l.value=Q.AREA_0,i=-s+M):s<X&&s>=-X?(l.value=Q.AREA_1,i=-s):s<-X&&s>=-(M+X)?(l.value=Q.AREA_2,i=-s-M):(l.value=Q.AREA_3,i=s>0?-s+pt:-s-pt);else{var c,u,d,h,f,p,m;this.face===nt.RIGHT?s=$e(s,+M):this.face===nt.BACK?s=$e(s,+pt):this.face===nt.LEFT&&(s=$e(s,-M)),h=Math.sin(a),f=Math.cos(a),p=Math.sin(s),m=Math.cos(s),c=f*m,u=f*p,d=h,this.face===nt.FRONT?(r=Math.acos(c),i=xa(r,d,u,l)):this.face===nt.RIGHT?(r=Math.acos(u),i=xa(r,d,-c,l)):this.face===nt.BACK?(r=Math.acos(-c),i=xa(r,d,-u,l)):this.face===nt.LEFT?(r=Math.acos(-u),i=xa(r,d,c,l)):(r=i=0,l.value=Q.AREA_0)}return n=Math.atan(12/pt*(i+Math.acos(Math.sin(i)*Math.cos(X))-M)),o=Math.sqrt((1-Math.cos(r))/(Math.cos(n)*Math.cos(n))/(1-Math.cos(Math.atan(1/Math.cos(i))))),l.value===Q.AREA_1?n+=M:l.value===Q.AREA_2?n+=pt:l.value===Q.AREA_3&&(n+=1.5*pt),e.x=o*Math.cos(n),e.y=o*Math.sin(n),e.x=e.x*this.a+this.x0,e.y=e.y*this.a+this.y0,t.x=e.x,t.y=e.y,t}function vu(t){var e={lam:0,phi:0},a,s,i,r,o,n,l,c,u,d={value:0};if(t.x=(t.x-this.x0)/this.a,t.y=(t.y-this.y0)/this.a,s=Math.atan(Math.sqrt(t.x*t.x+t.y*t.y)),a=Math.atan2(t.y,t.x),t.x>=0&&t.x>=Math.abs(t.y)?d.value=Q.AREA_0:t.y>=0&&t.y>=Math.abs(t.x)?(d.value=Q.AREA_1,a-=M):t.x<0&&-t.x>=Math.abs(t.y)?(d.value=Q.AREA_2,a=a<0?a+pt:a-pt):(d.value=Q.AREA_3,a+=M),u=pt/12*Math.tan(a),o=Math.sin(u)/(Math.cos(u)-1/Math.sqrt(2)),n=Math.atan(o),i=Math.cos(a),r=Math.tan(s),l=1-i*i*r*r*(1-Math.cos(Math.atan(1/Math.cos(n)))),l<-1?l=-1:l>1&&(l=1),this.face===nt.TOP)c=Math.acos(l),e.phi=M-c,d.value===Q.AREA_0?e.lam=n+M:d.value===Q.AREA_1?e.lam=n<0?n+pt:n-pt:d.value===Q.AREA_2?e.lam=n-M:e.lam=n;else if(this.face===nt.BOTTOM)c=Math.acos(l),e.phi=c-M,d.value===Q.AREA_0?e.lam=-n+M:d.value===Q.AREA_1?e.lam=-n:d.value===Q.AREA_2?e.lam=-n-M:e.lam=n<0?-n-pt:-n+pt;else{var h,f,p;h=l,u=h*h,u>=1?p=0:p=Math.sqrt(1-u)*Math.sin(n),u+=p*p,u>=1?f=0:f=Math.sqrt(1-u),d.value===Q.AREA_1?(u=f,f=-p,p=u):d.value===Q.AREA_2?(f=-f,p=-p):d.value===Q.AREA_3&&(u=f,f=p,p=-u),this.face===nt.RIGHT?(u=h,h=-f,f=u):this.face===nt.BACK?(h=-h,f=-f):this.face===nt.LEFT&&(u=h,h=f,f=-u),e.phi=Math.acos(-p)-M,e.lam=Math.atan2(f,h),this.face===nt.RIGHT?e.lam=$e(e.lam,-M):this.face===nt.BACK?e.lam=$e(e.lam,-pt):this.face===nt.LEFT&&(e.lam=$e(e.lam,+M))}if(this.es!==0){var m,g,y;m=e.phi<0?1:0,g=Math.tan(e.phi),y=this.b/Math.sqrt(g*g+this.one_minus_f_squared),e.phi=Math.atan(Math.sqrt(this.a*this.a-y*y)/(this.one_minus_f*y)),m&&(e.phi=-e.phi)}return e.lam+=this.long0,t.x=e.lam,t.y=e.phi,t}function xa(t,e,a,s){var i;return t<T?(s.value=Q.AREA_0,i=0):(i=Math.atan2(e,a),Math.abs(i)<=X?s.value=Q.AREA_0:i>X&&i<=M+X?(s.value=Q.AREA_1,i-=M):i>M+X||i<=-(M+X)?(s.value=Q.AREA_2,i=i>=0?i-pt:i+pt):(s.value=Q.AREA_3,i+=M)),i}function $e(t,e){var a=t+e;return a<-pt?a+=ia:a>+pt&&(a-=ia),a}var yu=["Quadrilateralized Spherical Cube","Quadrilateralized_Spherical_Cube","qsc"];const bu={init:gu,forward:mu,inverse:vu,names:yu};var Ts=[[1,22199e-21,-715515e-10,31103e-10],[.9986,-482243e-9,-24897e-9,-13309e-10],[.9954,-83103e-8,-448605e-10,-986701e-12],[.99,-.00135364,-59661e-9,36777e-10],[.9822,-.00167442,-449547e-11,-572411e-11],[.973,-.00214868,-903571e-10,18736e-12],[.96,-.00305085,-900761e-10,164917e-11],[.9427,-.00382792,-653386e-10,-26154e-10],[.9216,-.00467746,-10457e-8,481243e-11],[.8962,-.00536223,-323831e-10,-543432e-11],[.8679,-.00609363,-113898e-9,332484e-11],[.835,-.00698325,-640253e-10,934959e-12],[.7986,-.00755338,-500009e-10,935324e-12],[.7597,-.00798324,-35971e-9,-227626e-11],[.7186,-.00851367,-701149e-10,-86303e-10],[.6732,-.00986209,-199569e-9,191974e-10],[.6213,-.010418,883923e-10,624051e-11],[.5722,-.00906601,182e-6,624051e-11],[.5322,-.00677797,275608e-9,624051e-11]],Ue=[[-520417e-23,.0124,121431e-23,-845284e-16],[.062,.0124,-126793e-14,422642e-15],[.124,.0124,507171e-14,-160604e-14],[.186,.0123999,-190189e-13,600152e-14],[.248,.0124002,710039e-13,-224e-10],[.31,.0123992,-264997e-12,835986e-13],[.372,.0124029,988983e-12,-311994e-12],[.434,.0123893,-369093e-11,-435621e-12],[.4958,.0123198,-102252e-10,-345523e-12],[.5571,.0121916,-154081e-10,-582288e-12],[.6176,.0119938,-241424e-10,-525327e-12],[.6769,.011713,-320223e-10,-516405e-12],[.7346,.0113541,-397684e-10,-609052e-12],[.7903,.0109107,-489042e-10,-104739e-11],[.8435,.0103431,-64615e-9,-140374e-14],[.8936,.00969686,-64636e-9,-8547e-9],[.9394,.00840947,-192841e-9,-42106e-10],[.9761,.00616527,-256e-6,-42106e-10],[1,.00328947,-319159e-9,-42106e-10]],An=.8487,Pn=1.3523,kn=St/5,_u=1/kn,ke=18,ja=function(t,e){return t[0]+e*(t[1]+e*(t[2]+e*t[3]))},Mu=function(t,e){return t[1]+e*(2*t[2]+e*3*t[3])};function xu(t,e,a,s){for(var i=e;s;--s){var r=t(i);if(i-=r,Math.abs(r)<a)break}return i}function wu(){this.x0=this.x0||0,this.y0=this.y0||0,this.long0=this.long0||0,this.es=0,this.title=this.title||"Robinson"}function Su(t){var e=R(t.x-this.long0,this.over),a=Math.abs(t.y),s=Math.floor(a*kn);s<0?s=0:s>=ke&&(s=ke-1),a=St*(a-_u*s);var i={x:ja(Ts[s],a)*e,y:ja(Ue[s],a)};return t.y<0&&(i.y=-i.y),i.x=i.x*this.a*An+this.x0,i.y=i.y*this.a*Pn+this.y0,i}function Eu(t){var e={x:(t.x-this.x0)/(this.a*An),y:Math.abs(t.y-this.y0)/(this.a*Pn)};if(e.y>=1)e.x/=Ts[ke][0],e.y=t.y<0?-M:M;else{var a=Math.floor(e.y*ke);for(a<0?a=0:a>=ke&&(a=ke-1);;)if(Ue[a][0]>e.y)--a;else if(Ue[a+1][0]<=e.y)++a;else break;var s=Ue[a],i=5*(e.y-s[0])/(Ue[a+1][0]-s[0]);i=xu(function(r){return(ja(s,r)-e.y)/Mu(s,r)},i,T,100),e.x/=ja(Ts[a],i),e.y=(5*a+i)*dt,t.y<0&&(e.y=-e.y)}return e.x=R(e.x+this.long0,this.over),e}var Au=["Robinson","robin"];const Pu={init:wu,forward:Su,inverse:Eu,names:Au};function ku(){this.name="geocent"}function Cu(t){var e=gn(t,this.es,this.a);return e}function Tu(t){var e=mn(t,this.es,this.a,this.b);return e}var $u=["Geocentric","geocentric","geocent","Geocent"];const Lu={init:ku,forward:Cu,inverse:Tu,names:$u};var _t={N_POLE:0,S_POLE:1,EQUIT:2,OBLIQ:3},Oe={h:{def:1e5,num:!0},azi:{def:0,num:!0,degrees:!0},tilt:{def:0,num:!0,degrees:!0},long0:{def:0,num:!0},lat0:{def:0,num:!0}};function Gu(){if(Object.keys(Oe).forEach((function(a){if(typeof this[a]>"u")this[a]=Oe[a].def;else{if(Oe[a].num&&isNaN(this[a]))throw new Error("Invalid parameter value, must be numeric "+a+" = "+this[a]);Oe[a].num&&(this[a]=parseFloat(this[a]))}Oe[a].degrees&&(this[a]=this[a]*dt)}).bind(this)),Math.abs(Math.abs(this.lat0)-M)<T?this.mode=this.lat0<0?_t.S_POLE:_t.N_POLE:Math.abs(this.lat0)<T?this.mode=_t.EQUIT:(this.mode=_t.OBLIQ,this.sinph0=Math.sin(this.lat0),this.cosph0=Math.cos(this.lat0)),this.pn1=this.h/this.a,this.pn1<=0||this.pn1>1e10)throw new Error("Invalid height");this.p=1+this.pn1,this.rp=1/this.p,this.h1=1/this.pn1,this.pfact=(this.p+1)*this.h1,this.es=0;var t=this.tilt,e=this.azi;this.cg=Math.cos(e),this.sg=Math.sin(e),this.cw=Math.cos(t),this.sw=Math.sin(t)}function Nu(t){t.x-=this.long0;var e=Math.sin(t.y),a=Math.cos(t.y),s=Math.cos(t.x),i,r;switch(this.mode){case _t.OBLIQ:r=this.sinph0*e+this.cosph0*a*s;break;case _t.EQUIT:r=a*s;break;case _t.S_POLE:r=-e;break;case _t.N_POLE:r=e;break}switch(r=this.pn1/(this.p-r),i=r*a*Math.sin(t.x),this.mode){case _t.OBLIQ:r*=this.cosph0*e-this.sinph0*a*s;break;case _t.EQUIT:r*=e;break;case _t.N_POLE:r*=-(a*s);break;case _t.S_POLE:r*=a*s;break}var o,n;return o=r*this.cg+i*this.sg,n=1/(o*this.sw*this.h1+this.cw),i=(i*this.cg-r*this.sg)*this.cw*n,r=o*n,t.x=i*this.a,t.y=r*this.a,t}function Ru(t){t.x/=this.a,t.y/=this.a;var e={x:t.x,y:t.y},a,s,i;i=1/(this.pn1-t.y*this.sw),a=this.pn1*t.x*i,s=this.pn1*t.y*this.cw*i,t.x=a*this.cg+s*this.sg,t.y=s*this.cg-a*this.sg;var r=wt(t.x,t.y);if(Math.abs(r)<T)e.x=0,e.y=t.y;else{var o,n;switch(n=1-r*r*this.pfact,n=(this.p-Math.sqrt(n))/(this.pn1/r+r/this.pn1),o=Math.sqrt(1-n*n),this.mode){case _t.OBLIQ:e.y=Math.asin(o*this.sinph0+t.y*n*this.cosph0/r),t.y=(o-this.sinph0*Math.sin(e.y))*r,t.x*=n*this.cosph0;break;case _t.EQUIT:e.y=Math.asin(t.y*n/r),t.y=o*r,t.x*=n;break;case _t.N_POLE:e.y=Math.asin(o),t.y=-t.y;break;case _t.S_POLE:e.y=-Math.asin(o);break}e.x=Math.atan2(t.x,t.y)}return t.x=e.x+this.long0,t.y=e.y,t}var Iu=["Tilted_Perspective","tpers"];const Bu={init:Gu,forward:Nu,inverse:Ru,names:Iu};function Du(){if(this.flip_axis=this.sweep==="x"?1:0,this.h=Number(this.h),this.radius_g_1=this.h/this.a,this.radius_g_1<=0||this.radius_g_1>1e10)throw new Error;if(this.radius_g=1+this.radius_g_1,this.C=this.radius_g*this.radius_g-1,this.es!==0){var t=1-this.es,e=1/t;this.radius_p=Math.sqrt(t),this.radius_p2=t,this.radius_p_inv2=e,this.shape="ellipse"}else this.radius_p=1,this.radius_p2=1,this.radius_p_inv2=1,this.shape="sphere";this.title||(this.title="Geostationary Satellite View")}function Fu(t){var e=t.x,a=t.y,s,i,r,o;if(e=e-this.long0,this.shape==="ellipse"){a=Math.atan(this.radius_p2*Math.tan(a));var n=this.radius_p/wt(this.radius_p*Math.cos(a),Math.sin(a));if(i=n*Math.cos(e)*Math.cos(a),r=n*Math.sin(e)*Math.cos(a),o=n*Math.sin(a),(this.radius_g-i)*i-r*r-o*o*this.radius_p_inv2<0)return t.x=Number.NaN,t.y=Number.NaN,t;s=this.radius_g-i,this.flip_axis?(t.x=this.radius_g_1*Math.atan(r/wt(o,s)),t.y=this.radius_g_1*Math.atan(o/s)):(t.x=this.radius_g_1*Math.atan(r/s),t.y=this.radius_g_1*Math.atan(o/wt(r,s)))}else this.shape==="sphere"&&(s=Math.cos(a),i=Math.cos(e)*s,r=Math.sin(e)*s,o=Math.sin(a),s=this.radius_g-i,this.flip_axis?(t.x=this.radius_g_1*Math.atan(r/wt(o,s)),t.y=this.radius_g_1*Math.atan(o/s)):(t.x=this.radius_g_1*Math.atan(r/s),t.y=this.radius_g_1*Math.atan(o/wt(r,s))));return t.x=t.x*this.a,t.y=t.y*this.a,t}function Ou(t){var e=-1,a=0,s=0,i,r,o,n;if(t.x=t.x/this.a,t.y=t.y/this.a,this.shape==="ellipse"){this.flip_axis?(s=Math.tan(t.y/this.radius_g_1),a=Math.tan(t.x/this.radius_g_1)*wt(1,s)):(a=Math.tan(t.x/this.radius_g_1),s=Math.tan(t.y/this.radius_g_1)*wt(1,a));var l=s/this.radius_p;if(i=a*a+l*l+e*e,r=2*this.radius_g*e,o=r*r-4*i*this.C,o<0)return t.x=Number.NaN,t.y=Number.NaN,t;n=(-r-Math.sqrt(o))/(2*i),e=this.radius_g+n*e,a*=n,s*=n,t.x=Math.atan2(a,e),t.y=Math.atan(s*Math.cos(t.x)/e),t.y=Math.atan(this.radius_p_inv2*Math.tan(t.y))}else if(this.shape==="sphere"){if(this.flip_axis?(s=Math.tan(t.y/this.radius_g_1),a=Math.tan(t.x/this.radius_g_1)*Math.sqrt(1+s*s)):(a=Math.tan(t.x/this.radius_g_1),s=Math.tan(t.y/this.radius_g_1)*Math.sqrt(1+a*a)),i=a*a+s*s+e*e,r=2*this.radius_g*e,o=r*r-4*i*this.C,o<0)return t.x=Number.NaN,t.y=Number.NaN,t;n=(-r-Math.sqrt(o))/(2*i),e=this.radius_g+n*e,a*=n,s*=n,t.x=Math.atan2(a,e),t.y=Math.atan(s*Math.cos(t.x)/e)}return t.x=t.x+this.long0,t}var ju=["Geostationary Satellite View","Geostationary_Satellite","geos"];const qu={init:Du,forward:Fu,inverse:Ou,names:ju};var Ye=1.340264,Ze=-.081106,Xe=893e-6,Qe=.003796,qa=Math.sqrt(3)/2;function zu(){this.es=0,this.long0=this.long0!==void 0?this.long0:0,this.x0=this.x0!==void 0?this.x0:0,this.y0=this.y0!==void 0?this.y0:0}function Uu(t){var e=R(t.x-this.long0,this.over),a=t.y,s=Math.asin(qa*Math.sin(a)),i=s*s,r=i*i*i;return t.x=e*Math.cos(s)/(qa*(Ye+3*Ze*i+r*(7*Xe+9*Qe*i))),t.y=s*(Ye+Ze*i+r*(Xe+Qe*i)),t.x=this.a*t.x+this.x0,t.y=this.a*t.y+this.y0,t}function Hu(t){t.x=(t.x-this.x0)/this.a,t.y=(t.y-this.y0)/this.a;var e=1e-9,a=12,s=t.y,i,r,o,n,l,c;for(c=0;c<a&&(i=s*s,r=i*i*i,o=s*(Ye+Ze*i+r*(Xe+Qe*i))-t.y,n=Ye+3*Ze*i+r*(7*Xe+9*Qe*i),s-=l=o/n,!(Math.abs(l)<e));++c);return i=s*s,r=i*i*i,t.x=qa*t.x*(Ye+3*Ze*i+r*(7*Xe+9*Qe*i))/Math.cos(s),t.y=Math.asin(Math.sin(s)/qa),t.x=R(t.x+this.long0,this.over),t}var Vu=["eqearth","Equal Earth","Equal_Earth"];const Wu={init:zu,forward:Uu,inverse:Hu,names:Vu};var oa=1e-10;function Ku(){var t;if(this.phi1=this.lat1,Math.abs(this.phi1)<oa)throw new Error;this.es?(this.en=ni(this.es),this.m1=Be(this.phi1,this.am1=Math.sin(this.phi1),t=Math.cos(this.phi1),this.en),this.am1=t/(Math.sqrt(1-this.es*this.am1*this.am1)*this.am1),this.inverse=Yu,this.forward=Ju):(Math.abs(this.phi1)+oa>=M?this.cphi1=0:this.cphi1=1/Math.tan(this.phi1),this.inverse=Xu,this.forward=Zu)}function Ju(t){var e=R(t.x-(this.long0||0),this.over),a=t.y,s,i,r;return s=this.am1+this.m1-Be(a,i=Math.sin(a),r=Math.cos(a),this.en),i=r*e/(s*Math.sqrt(1-this.es*i*i)),t.x=s*Math.sin(i),t.y=this.am1-s*Math.cos(i),t.x=this.a*t.x+(this.x0||0),t.y=this.a*t.y+(this.y0||0),t}function Yu(t){t.x=(t.x-(this.x0||0))/this.a,t.y=(t.y-(this.y0||0))/this.a;var e,a,s,i;if(a=wt(t.x,t.y=this.am1-t.y),i=oi(this.am1+this.m1-a,this.es,this.en),(e=Math.abs(i))<M)e=Math.sin(i),s=a*Math.atan2(t.x,t.y)*Math.sqrt(1-this.es*e*e)/Math.cos(i);else if(Math.abs(e-M)<=oa)s=0;else throw new Error;return t.x=R(s+(this.long0||0),this.over),t.y=oe(i),t}function Zu(t){var e=R(t.x-(this.long0||0),this.over),a=t.y,s,i;return i=this.cphi1+this.phi1-a,Math.abs(i)>oa?(t.x=i*Math.sin(s=e*Math.cos(a)/i),t.y=this.cphi1-i*Math.cos(s)):t.x=t.y=0,t.x=this.a*t.x+(this.x0||0),t.y=this.a*t.y+(this.y0||0),t}function Xu(t){t.x=(t.x-(this.x0||0))/this.a,t.y=(t.y-(this.y0||0))/this.a;var e,a,s=wt(t.x,t.y=this.cphi1-t.y);if(a=this.cphi1+this.phi1-s,Math.abs(a)>M)throw new Error;return Math.abs(Math.abs(a)-M)<=oa?e=0:e=s*Math.atan2(t.x,t.y)/Math.cos(a),t.x=R(e+(this.long0||0),this.over),t.y=oe(a),t}var Qu=["bonne","Bonne (Werner lat_1=90)"];const tp={init:Ku,names:Qu},nr={OBLIQUE:{forward:rp,inverse:op},TRANSVERSE:{forward:np,inverse:lp}},za={ROTATE:{o_alpha:"oAlpha",o_lon_c:"oLongC",o_lat_c:"oLatC"},NEW_POLE:{o_lat_p:"oLatP",o_lon_p:"oLongP"},NEW_EQUATOR:{o_lon_1:"oLong1",o_lat_1:"oLat1",o_lon_2:"oLong2",o_lat_2:"oLat2"}};function ep(){if(this.x0=this.x0||0,this.y0=this.y0||0,this.long0=this.long0||0,this.title=this.title||"General Oblique Transformation",this.isIdentity=hn.includes(this.o_proj),!this.o_proj)throw new Error("Missing parameter: o_proj");if(this.o_proj==="ob_tran")throw new Error("Invalid value for o_proj: "+this.o_proj);const t=this.projStr.replace("+proj=ob_tran","").replace("+o_proj=","+proj=").trim(),e=Lt(t);if(!e)throw new Error("Invalid parameter: o_proj. Unknown projection "+this.o_proj);e.long0=0,this.obliqueProjection=e;let a;const s=Object.keys(za),i=n=>{if(typeof this[n]>"u")return;const l=parseFloat(this[n])*dt;if(isNaN(l))throw new Error("Invalid value for "+n+": "+this[n]);return l};for(let n=0;n<s.length;n++){const l=s[n],c=za[l],u=Object.entries(c);if(u.some(([h])=>typeof this[h]<"u")){a=c;for(let h=0;h<u.length;h++){const[f,p]=u[h],m=i(f);if(typeof m>"u")throw new Error("Missing parameter: "+f+".");this[p]=m}break}}if(!a)throw new Error("No valid parameters provided for ob_tran projection.");const{lamp:r,phip:o}=ip(this,a);this.lamp=r,Math.abs(o)>T?(this.cphip=Math.cos(o),this.sphip=Math.sin(o),this.projectionType=nr.OBLIQUE):this.projectionType=nr.TRANSVERSE}function ap(t){return this.projectionType.forward(this,t)}function sp(t){return this.projectionType.inverse(this,t)}function ip(t,e){let a,s;if(e===za.ROTATE){let i=t.oLongC,r=t.oLatC,o=t.oAlpha;if(Math.abs(Math.abs(r)-M)<=T)throw new Error("Invalid value for o_lat_c: "+t.o_lat_c+" should be < 90°");s=i+Math.atan2(-1*Math.cos(o),-1*Math.sin(o)*Math.sin(r)),a=Math.asin(Math.cos(r)*Math.sin(o))}else if(e===za.NEW_POLE)s=t.oLongP,a=t.oLatP;else{let i=t.oLong1,r=t.oLat1,o=t.oLong2,n=t.oLat2,l=Math.abs(r);if(Math.abs(r)>M-T)throw new Error("Invalid value for o_lat_1: "+t.o_lat_1+" should be < 90°");if(Math.abs(n)>M-T)throw new Error("Invalid value for o_lat_2: "+t.o_lat_2+" should be < 90°");if(Math.abs(r-n)<T)throw new Error("Invalid value for o_lat_1 and o_lat_2: o_lat_1 should be different from o_lat_2");if(l<T)throw new Error("Invalid value for o_lat_1: o_lat_1 should be different from zero");s=Math.atan2(Math.cos(r)*Math.sin(n)*Math.cos(i)-Math.sin(r)*Math.cos(n)*Math.cos(o),Math.sin(r)*Math.cos(n)*Math.sin(o)-Math.cos(r)*Math.sin(n)*Math.sin(i)),a=Math.atan(-1*Math.cos(s-i)/Math.tan(r))}return{lamp:s,phip:a}}function rp(t,e){let{x:a,y:s}=e;a+=t.long0;const i=Math.cos(a),r=Math.sin(s),o=Math.cos(s);e.x=R(Math.atan2(o*Math.sin(a),t.sphip*o*i+t.cphip*r)+t.lamp),e.y=Math.asin(t.sphip*r-t.cphip*o*i);const n=t.obliqueProjection.forward(e);return t.isIdentity&&(n.x*=St,n.y*=St),n}function np(t,e){let{x:a,y:s}=e;a+=t.long0;const i=Math.cos(s),r=Math.cos(a);e.x=R(Math.atan2(i*Math.sin(a),Math.sin(s))+t.lamp),e.y=Math.asin(-1*i*r);const o=t.obliqueProjection.forward(e);return t.isIdentity&&(o.x*=St,o.y*=St),o}function op(t,e){t.isIdentity&&(e.x*=dt,e.y*=dt);const a=t.obliqueProjection.inverse(e);let{x:s,y:i}=a;if(s<Number.MAX_VALUE){s-=t.lamp;const r=Math.cos(s),o=Math.sin(i),n=Math.cos(i);e.x=Math.atan2(n*Math.sin(s),t.sphip*n*r-t.cphip*o),e.y=Math.asin(t.sphip*o+t.cphip*n*r)}return e.x=R(e.x+t.long0),e}function lp(t,e){t.isIdentity&&(e.x*=dt,e.y*=dt);const a=t.obliqueProjection.inverse(e);let{x:s,y:i}=a;if(s<Number.MAX_VALUE){const r=Math.cos(i);s-=t.lamp,e.x=Math.atan2(r*Math.sin(s),-1*Math.sin(i)),e.y=Math.asin(r*Math.cos(s))}return e.x=R(e.x+t.long0),e}var cp=["General Oblique Transformation","General_Oblique_Transformation","ob_tran"];const dp={init:ep,forward:ap,inverse:sp,names:cp};function hp(t){t.Proj.projections.add(Pa),t.Proj.projections.add(ka),t.Proj.projections.add(Qd),t.Proj.projections.add(lh),t.Proj.projections.add(ph),t.Proj.projections.add(yh),t.Proj.projections.add(Sh),t.Proj.projections.add(Ch),t.Proj.projections.add(Nh),t.Proj.projections.add(Fh),t.Proj.projections.add(Xh),t.Proj.projections.add(i0),t.Proj.projections.add(c0),t.Proj.projections.add(g0),t.Proj.projections.add(_0),t.Proj.projections.add(E0),t.Proj.projections.add(T0),t.Proj.projections.add(R0),t.Proj.projections.add(j0),t.Proj.projections.add(V0),t.Proj.projections.add(Z0),t.Proj.projections.add(au),t.Proj.projections.add(cu),t.Proj.projections.add(fu),t.Proj.projections.add(bu),t.Proj.projections.add(Pu),t.Proj.projections.add(Lu),t.Proj.projections.add(Bu),t.Proj.projections.add(qu),t.Proj.projections.add(Wu),t.Proj.projections.add(tp),t.Proj.projections.add(dp)}const pi=Object.assign(md,{defaultDatum:"WGS84",Proj:Lt,WGS84:new Lt("WGS84"),Point:Ne,toPoint:vn,defs:yt,nadgrid:Xc,transform:Fa,mgrs:vd,version:"__VERSION__"});hp(pi);const af=Object.freeze(Object.defineProperty({__proto__:null,default:pi},Symbol.toStringTag,{value:"Module"}));function up(t){if(!t)return"EPSG:4326";const e=t.trim();if(/WGS.?84/i.test(e)&&/GEOGCS/i.test(e)&&!/UTM/i.test(e))return"EPSG:4326";const a=e.match(/UTM[_ ]?[Zz]one[_ ]?(\d+)([NS]?)/i);if(a){const s=parseInt(a[1],10);return/S/i.test(a[2])||/south/i.test(e)?`EPSG:${32700+s}`:`EPSG:${32600+s}`}return e.length>10?e:"EPSG:4326"}function pp(t,e){if(!e||e==="EPSG:4326")return{geojson:t,reprojected:!1,error:null};try{const a=pi(e,"EPSG:4326");return{geojson:{type:"FeatureCollection",features:t.features.map(i=>i.geometry?{...i,geometry:fp(i.geometry,a)}:i)},reprojected:!0,error:null}}catch(a){return{geojson:t,reprojected:!1,error:`Reprojection failed: ${a.message}`}}}function fp(t,e){const a=t.type;return a==="Point"?{type:a,coordinates:e.forward(t.coordinates)}:a==="MultiPoint"||a==="LineString"?{type:a,coordinates:t.coordinates.map(s=>e.forward(s))}:a==="MultiLineString"||a==="Polygon"?{type:a,coordinates:t.coordinates.map(s=>s.map(i=>e.forward(i)))}:a==="MultiPolygon"?{type:a,coordinates:t.coordinates.map(s=>s.map(i=>i.map(r=>e.forward(r))))}:t}function gp(t){const e=[],a={},s=[];let i=0;for(const r of t.features||[]){if(!r.geometry||!r.geometry.type||!r.geometry.coordinates){i++;continue}const o=r.geometry.type;a[o]=(a[o]||0)+1,s.push(r)}return i>0&&e.push(`Removed ${i} feature(s) with null/empty geometry`),{cleaned:{type:"FeatureCollection",features:s},stats:{typeCounts:a,originalCount:(t.features||[]).length,validCount:s.length},warnings:e}}function mp(t){var r,o;const e=[];let a=0,s=0;const i=[];for(const n of t.features){if(!n.geometry.type.includes("Polygon")){i.push(n);continue}try{let c=vi(n,0,{units:"meters"});if(!c||!c.geometry){const h=Fn(n,{tolerance:gt.simplifyTolerance,highQuality:!0});c=vi(h,0,{units:"meters"})}if(!c||!c.geometry){s++,e.push(`Dropped feature "${((r=n.properties)==null?void 0:r.name)||"unknown"}" — unfixable geometry`);continue}const u=$a(c);if(u<gt.sliverThresholdM2){s++,e.push(`Removed sliver polygon (${u.toFixed(1)} m²)`);continue}const d=$a(n);Math.abs(d-u)>.01&&a++,i.push({type:"Feature",geometry:c.geometry,properties:n.properties})}catch(c){i.push(n),e.push(`Could not validate geometry for "${((o=n.properties)==null?void 0:o.name)||"unknown"}": ${c.message}`)}}return a>0&&e.push(`Fixed ${a} geometry issue(s) via buffer(0)`),{cleaned:{type:"FeatureCollection",features:i},fixedCount:a,droppedCount:s,warnings:e}}const or={global:{name:["name","site_name","area_name","site_nm","NAME","Name","SITE_NAME","AREA_NAME","label","LABEL","title","TITLE"],type:["type","TYPE","Type","category","CATEGORY","designation","DESIGNATION","desig","DESIG","class","CLASS"],realm:["realm","REALM","Realm","domain","DOMAIN","environment","ENVIRONMENT"],province:["province","PROVINCE","Province","state","STATE","region","REGION","island","ISLAND","prov","PROV"],year:["year","YEAR","Year","est_year","EST_YEAR","date","DATE","year_est","YEAR_EST","established"],status:["status","STATUS","Status","condition","CONDITION","state","mgmt_status"],source:["source","SOURCE","Source","data_src","DATA_SRC","origin","ORIGIN","provider"],notes:["notes","NOTES","Notes","comments","COMMENTS","description","DESCRIPTION","desc","DESC","remarks","REMARKS"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL"]},CCA:{name:["cca_name","CCA_NAME","community_area","COMMUNITY_AREA","tabu_name"],type:["cca_type","CCA_TYPE","tabu_type"]},MPA:{name:["mpa_name","MPA_NAME","marine_area","MARINE_AREA"],type:["mpa_type","MPA_TYPE","protection_level"]},PA:{name:["pa_name","PA_NAME","park_name","PARK_NAME","protected_area"],type:["pa_type","PA_TYPE","iucn_cat","IUCN_CAT"]},OECM:{name:["oecm_name","OECM_NAME"],type:["oecm_type","OECM_TYPE"]},KBA:{name:["kba_name","KBA_NAME","iba_name"],type:["kba_type","KBA_TYPE","trigger"]},LMMA:{name:["lmma_name","LMMA_NAME","managed_area"],type:["lmma_type","LMMA_TYPE","management_type"]},SPATIAL_PLAN:{name:["plan_name","PLAN_NAME","spatial_plan"],type:["plan_type","PLAN_TYPE","planning_zone"]},DEGRADED:{name:["degraded_name","site_name","SITE_NAME"],type:["degradation_type","DEGRADATION_TYPE","deg_type","cause"]},RESTORATION:{name:["restoration_name","project_name","PROJECT_NAME"],type:["restoration_type","activity"]},SPECIES_DIST:{name:["species_name","SPECIES_NAME","common_name","sci_name"],type:["species_type","taxa","TAXA","group"]},MEGAPODE:{name:["site_name","SITE_NAME","nesting_site","location","name"],type:["obs_type","record_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},STARLING:{name:["site_name","SITE_NAME","location","name"],type:["obs_type","record_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},FANTAIL:{name:["site_name","SITE_NAME","location","name"],type:["obs_type","record_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},KINGFISHER:{name:["site_name","SITE_NAME","location","name"],type:["obs_type","record_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},FLYING_FOX:{name:["site_name","SITE_NAME","roost_name","colony","location","name"],type:["obs_type","record_type","colony_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},PLERANDRA:{name:["site_name","SITE_NAME","population","location","name"],type:["obs_type","record_type","habitat_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},INVASIVE:{name:["species_name","SPECIES","invasive_name","ias_name"],type:["invasive_type","threat_type","species_type","ias_type"]},MERREMIA:{name:["site_name","detection_id","SITE_NAME","patch_id"],type:["detection_method","confidence","CONFIDENCE","source_type"]},PESTICIDE:{name:["farm_name","FARM_NAME","site_name","operator"],type:["chemical_type","pesticide_type","PESTICIDE_TYPE","product"]},EUTROPHICATION:{name:["zone_name","ZONE_NAME","site_name","station"],type:["severity","SEVERITY","nutrient_level","trophic_state"]},LAND_COVER:{name:["class_name","CLASS_NAME","cover_type","land_use","Land_Use_P","LAND_USE_P"],type:["lc_class","LC_CLASS","land_cover","LAND_COVER","use_type","Land_Use_P","LAND_USE_P","land_use_p"]},GREEN_SPACE:{name:["park_name","PARK_NAME","space_name","garden_name"],type:["space_type","SPACE_TYPE","park_type","green_type"]}};function Ht(t,e,a){const s=Object.keys(t),i=s.map(n=>n.toLowerCase()),r=or[a];if(r&&r[e])for(const n of r[e]){const l=i.indexOf(n.toLowerCase());if(l!==-1)return t[s[l]]}const o=or.global;if(o&&o[e])for(const n of o[e]){const l=i.indexOf(n.toLowerCase());if(l!==-1)return t[s[l]]}}function Qt(t){return typeof t!="string"?t:t.trim().normalize("NFC").replace(/\s+/g," ")}function vp(t,e){const a=e.category||"OTHER",s=Qt(Ht(t,"name",a))||"Unnamed",i=Qt(Ht(t,"type",a))||a,r=Qt(Ht(t,"realm",a))||e.realm||"terrestrial",o=Qt(Ht(t,"province",a))||"",n=Ht(t,"year",a),l=n&&parseInt(n,10)||null,c=Qt(Ht(t,"status",a))||"Unknown",u=Qt(Ht(t,"source",a))||"",d=Qt(Ht(t,"notes",a))||"",h=Qt(Ht(t,"presence",a))||"",f={name:s,type:i,realm:r,province:o,year:l,status:c,source:u,notes:d,targets:[...e.targets||[]],upload_timestamp:e.uploadTimestamp||new Date().toISOString(),layer_id:e.layerId||"",original_filename:e.originalFilename||"",uploaded_by:e.uploadedBy||"admin"};return h&&(f.presence=h),f}function yp(t,e){return{type:"FeatureCollection",features:(t.features||[]).map(a=>({type:"Feature",geometry:a.geometry,properties:vp(a.properties||{},e)}))}}function bp(t){if(!t.geometry)return null;const e=t.geometry.type;if(e==="Point")return t;if(e==="MultiPolygon"){const a=t.geometry.coordinates;let s=0,i=null;for(const r of a){const o=zn(r),n=$a(o);n>s&&(s=n,i=o)}return i?is(i):is(t)}try{return is(t)}catch{return null}}const _p=()=>new Promise(t=>setTimeout(t,0)),Mp=2e3;function xp(t){return qn(t)}function wp(t,e){return t[0]>=e[0]&&t[0]<=e[2]&&t[1]>=e[1]&&t[1]<=e[3]}async function Sp(t,e){const a=e.features||[],s=t.features,i=new Array(s.length),r=a.map(o=>({feature:o,name:o.properties.name||o.properties.province||o.properties.NAME||o.properties.PROVINCE||"",bbox:xp(o)}));for(let o=0;o<s.length;o++){const n=s[o],l=bp(n);if(l){const c=On(l);let u=!1;for(const d of r)if(wp(c,d.bbox))try{if(jn(l,d.feature)){i[o]={...n,properties:{...n.properties,province:d.name}},u=!0;break}}catch{continue}u||(i[o]=n)}else i[o]=n;o>0&&o%Mp===0&&await _p()}return{type:"FeatureCollection",features:i}}async function Ep(t,e,a,s){const i={steps:[],warnings:[],errors:[]},r=(G,P)=>{i.steps.push({step:G,message:P,timestamp:new Date().toISOString()}),s&&s(G,P)},o=()=>new Promise(G=>setTimeout(G,0));r(1,"Validating geometries...");const{cleaned:n,stats:l,warnings:c}=gp(t);if(i.warnings.push(...c),r(1,`Valid: ${l.validCount}/${l.originalCount} features. Types: ${JSON.stringify(l.typeCounts)}`),n.features.length===0)return i.errors.push("No valid features found after basic validation"),{geojson:n,metadata:bs({name:e.name,status:"Failed"}),report:i};await o(),r(2,"Checking CRS...");const u=up(e.prjText);r(2,`Detected CRS: ${u}`);let d=n;if(u!=="EPSG:4326"){r(2,"Reprojecting to WGS84...");const{geojson:G,reprojected:P,error:$}=pp(n,u);$&&(i.warnings.push($),i.warnings.push("Unverified CRS — layer loaded but coordinates may be incorrect")),d=G,P&&r(2,"Reprojection successful")}await o(),r(3,"Fixing geometry issues...");const{cleaned:h,fixedCount:f,droppedCount:p,warnings:m}=mp(d);i.warnings.push(...m),r(3,`Fixed: ${f}, Dropped: ${p}`),await o(),r(4,"Standardizing attributes...");const g=bs({name:e.name||e.originalFilename,originalFilename:e.originalFilename,category:e.category,targets:e.targets,realm:e.realm,countsToward30x30:e.countsToward30x30,isReference:e.isReference,detectedCRS:u,uploadedBy:e.uploadedBy||"admin"}),y=yp(h,{category:e.category,targets:e.targets,realm:e.realm,layerId:g.id,originalFilename:e.originalFilename,uploadTimestamp:g.uploadTimestamp,uploadedBy:e.uploadedBy||"admin"});r(4,`Mapped ${y.features.length} features to standard schema`),await o(),r(5,"Assigning provinces...");let v=y;if(a&&a.features&&a.features.length>0){v=await Sp(y,a);const G=v.features.filter(P=>P.properties.province).length;r(5,`Province assigned to ${G}/${v.features.length} features`)}else i.warnings.push("No provinces boundary data — province assignment skipped"),r(5,"Skipped — no provinces data");await o(),r(6,"Computing areas...");const b=xr(v),_=b.features.reduce((G,P)=>G+(P.properties.area_ha||0),0);r(6,`Total area: ${_.toFixed(2)} ha`),g.featureCount=b.features.length,g.validGeometryCount=b.features.filter(G=>G.geometry).length,g.fixedCount=f,g.droppedCount=p,g.totalAreaHa=_;const x=i.errors.length>0,E=i.warnings.length>0;g.status=x?"Failed":E?"Warnings":"Clean",g.warnings=i.warnings;const A=Qr(g,b);return i.torCompliance=A,r(7,`Pipeline complete. Status: ${g.status}`),{geojson:b,metadata:g,report:i}}let Z={step:1,file:null,geojson:null,prjText:null,opts:{},expectedLayer:null},fi=!1;function Cn(){return fi}function Tn(t){t.preventDefault(),t.returnValue=""}function lr(t={}){Z={step:1,file:null,geojson:null,prjText:null,opts:{},expectedLayer:t.expectedLayer||null},fi=!0,window.addEventListener("beforeunload",Tn),document.getElementById("upload-wizard-modal").classList.add("active");const a=document.getElementById("wizard-modal-close-btn");a&&(a.onclick=()=>ss()),la()}function ss(){fi=!1,window.removeEventListener("beforeunload",Tn),document.getElementById("upload-wizard-modal").classList.remove("active")}function la(){const t=document.getElementById("wizard-body"),e=document.getElementById("wizard-steps"),a=["File","Configure","Processing","Results"];switch(e.innerHTML=a.map((s,i)=>{const r=i+1;let o="";return r<Z.step&&(o="done"),r===Z.step&&(o="active"),`<div class="wizard-step ${o}">${r}. ${s}</div>`}).join(""),Z.step){case 1:Lp(t);break;case 2:Gp(t);break;case 3:Np(t);break;case 4:Rp(t);break}}function Ap(t){const e=t.toLowerCase().split(".").pop();return e==="zip"?"shapefile":e==="kml"?"kml":e==="csv"?"csv":e==="geojson"||e==="json"?"geojson":null}async function Pp(t){if(typeof globalThis.Buffer>"u"){const s=await Fi(()=>import("./index-B2WcC-RY.js").then(i=>i.i),__vite__mapDeps([0,1]),import.meta.url);globalThis.Buffer=s.Buffer}const{default:e}=await Fi(async()=>{const{default:s}=await import("./index-D_Jpk_98.js").then(i=>i.i);return{default:s}},__vite__mapDeps([2,1,0]),import.meta.url),a=await e(t);return Array.isArray(a)?a[0]:a}function kp(t){const a=new DOMParser().parseFromString(t,"text/xml");if(a.querySelector("parsererror"))throw new Error("Invalid KML: XML parsing failed");const i=[],r=a.querySelectorAll("Placemark");for(const o of r){const n={},l=o.querySelector("name");l&&(n.name=l.textContent.trim());const c=o.querySelector("description");c&&(n.notes=c.textContent.trim());const u=o.querySelectorAll("SimpleData");for(const f of u){const p=f.getAttribute("name");p&&(n[p]=f.textContent.trim())}const d=o.querySelectorAll("Data");for(const f of d){const p=f.getAttribute("name"),m=f.querySelector("value");p&&m&&(n[p]=m.textContent.trim())}const h=Cp(o);h&&i.push({type:"Feature",properties:n,geometry:h})}return{type:"FeatureCollection",features:i}}function Cp(t){const e=t.querySelector("Point");if(e){const r=Ce(e.querySelector("coordinates"));if(r.length>0)return{type:"Point",coordinates:r[0]}}const a=t.querySelector("LineString");if(a){const r=Ce(a.querySelector("coordinates"));if(r.length>0)return{type:"LineString",coordinates:r}}const s=t.querySelector("Polygon");if(s)return cr(s);const i=t.querySelector("MultiGeometry");if(i){const r=[];for(const o of i.children){const n=o.tagName;if(n==="Point"){const l=Ce(o.querySelector("coordinates"));l.length>0&&r.push({type:"Point",coordinates:l[0]})}else if(n==="LineString"){const l=Ce(o.querySelector("coordinates"));l.length>0&&r.push({type:"LineString",coordinates:l})}else if(n==="Polygon"){const l=cr(o);l&&r.push(l)}}return r.length===0?null:r.length===1?r[0]:{type:"GeometryCollection",geometries:r}}return null}function cr(t){const e=[],a=t.querySelector("outerBoundaryIs");if(a){const i=Ce(a.querySelector("coordinates"));i.length>0&&e.push(i)}const s=t.querySelectorAll("innerBoundaryIs");for(const i of s){const r=Ce(i.querySelector("coordinates"));r.length>0&&e.push(r)}return e.length===0?null:{type:"Polygon",coordinates:e}}function Ce(t){if(!t)return[];const e=t.textContent.trim();return e?e.split(/\s+/).map(a=>{const s=a.split(",").map(Number);return s.length>=2&&!isNaN(s[0])&&!isNaN(s[1])?s.length>=3?[s[0],s[1],s[2]]:[s[0],s[1]]:null}).filter(Boolean):[]}function Tp(t){var c;const e=t.trim().split(/\r?\n/);if(e.length<2)throw new Error("CSV must have a header row and at least one data row");const a=dr(e[0]),s=a.map(u=>u.toLowerCase().trim()),i=["latitude","lat","y","lat_dd","latitude_dd","decimallatitude"],r=["longitude","lon","lng","long","x","lon_dd","longitude_dd","decimallongitude"],o=s.findIndex(u=>i.includes(u)),n=s.findIndex(u=>r.includes(u));if(o===-1||n===-1)throw new Error(`Could not detect latitude/longitude columns. Found headers: ${a.join(", ")}. Expected column names like: latitude/lat/y and longitude/lon/lng/x`);const l=[];for(let u=1;u<e.length;u++){if(!e[u].trim())continue;const d=dr(e[u]),h=parseFloat(d[o]),f=parseFloat(d[n]);if(isNaN(h)||isNaN(f))continue;const p={};for(let m=0;m<a.length;m++)m===o||m===n||(p[a[m].trim()]=((c=d[m])==null?void 0:c.trim())||"");l.push({type:"Feature",properties:p,geometry:{type:"Point",coordinates:[f,h]}})}if(l.length===0)throw new Error("No valid features found in CSV (no rows with valid lat/lon)");return{type:"FeatureCollection",features:l}}function dr(t){const e=[];let a="",s=!1;for(let i=0;i<t.length;i++){const r=t[i];s?r==='"'?i+1<t.length&&t[i+1]==='"'?(a+='"',i++):s=!1:a+=r:r==='"'?s=!0:r===","?(e.push(a),a=""):a+=r}return e.push(a),e}function $p(t){const e=JSON.parse(t);if(e.type==="FeatureCollection"&&Array.isArray(e.features))return e;if(e.type==="Feature"&&e.geometry)return{type:"FeatureCollection",features:[e]};if(e.type&&e.coordinates)return{type:"FeatureCollection",features:[{type:"Feature",properties:{},geometry:e}]};throw new Error("Invalid GeoJSON: must be a FeatureCollection, Feature, or Geometry object")}function Lp(t){const e=Z.expectedLayer,a=e?`<div style="padding:10px 14px;background:var(--primary-lighter);border:1px solid var(--primary);border-radius:var(--radius-sm);margin-bottom:14px;font-size:13px">
         Uploading for: <strong>${ge(e)}</strong> (${e.category} / ${e.target})
       </div>`:"";t.innerHTML=`
    ${a}
    <div class="form-group">
      <label>Upload Data Layer</label>
      <input type="file" id="wizard-file-input" accept=".zip,.kml,.csv,.geojson,.json">
      <div class="form-hint">
        Supported formats:
        <strong>Shapefile</strong> (.zip with .shp, .shx, .dbf, .prj),
        <strong>KML</strong> (.kml),
        <strong>CSV</strong> (.csv with lat/lon columns),
        <strong>GeoJSON</strong> (.geojson, .json)
      </div>
    </div>
    <div id="wizard-file-status" style="margin-top:10px"></div>
    <div style="margin-top:16px;text-align:right">
      <button class="btn btn-outline" id="wizard-cancel-btn">Cancel</button>
      <button class="btn btn-primary" id="wizard-next-1" disabled>Next</button>
    </div>
  `;const s=t.querySelector("#wizard-file-input"),i=t.querySelector("#wizard-next-1"),r=t.querySelector("#wizard-file-status");t.querySelector("#wizard-cancel-btn").addEventListener("click",()=>ss()),s.addEventListener("change",async o=>{const n=o.target.files[0];if(!n)return;const l=Ap(n.name);if(!l){r.innerHTML='<p style="color:var(--danger)">Unsupported file format. Please upload .zip, .kml, .csv, .geojson, or .json</p>';return}r.innerHTML=`<p>Parsing ${l} file...</p>`,i.disabled=!0;try{let c;if(l==="shapefile"){const d=await n.arrayBuffer();c=await Pp(d)}else{const d=await n.text();l==="kml"?c=kp(d):l==="csv"?c=Tp(d):l==="geojson"&&(c=$p(d))}if(!c||!c.features||c.features.length===0){r.innerHTML='<p style="color:var(--danger)">No features found in file</p>';return}Z.file=n,Z.geojson=c,Z.opts.originalFilename=n.name,Z.prjText=null;const u=[...new Set(c.features.map(d=>{var h;return(h=d.geometry)==null?void 0:h.type}).filter(Boolean))];r.innerHTML=`
        <p style="color:var(--success)">Parsed successfully: ${c.features.length} features</p>
        <p style="font-size:12px;color:var(--text-light)">
          Format: ${l.toUpperCase()} | Geometry types: ${u.join(", ")}
        </p>
      `,i.disabled=!1}catch(c){r.innerHTML=`<p style="color:var(--danger)">Error parsing: ${c.message}</p>`}}),i.addEventListener("click",()=>{Z.step=2,la()})}function Gp(t){var c;const e=Z.expectedLayer,a=e?ge(e):(Z.opts.originalFilename||"").replace(/\.(zip|kml|csv|geojson|json)$/i,""),s=e?e.category:Mi[0],i=e?e.realm:((c=K[s])==null?void 0:c.defaultRealm)||"terrestrial",r=e?e.target:null,o=e?e.countsToward30x30:!1;t.innerHTML=`
    ${e?`<div style="padding:10px 14px;background:var(--primary-lighter);border:1px solid var(--primary);border-radius:var(--radius-sm);margin-bottom:14px;font-size:13px">
      Uploading for: <strong>${ge(e)}</strong> &mdash; fields have been pre-filled.
    </div>`:""}
    <div class="form-group">
      <label>Layer Name</label>
      <input type="text" id="wizard-name" value="${a}">
    </div>

    <div class="form-group">
      <label>Category</label>
      <select id="wizard-category">
        ${Mi.map(u=>`<option value="${u}" ${u===s?"selected":""}>${K[u].label}</option>`).join("")}
      </select>
    </div>

    <div class="form-group">
      <label>Targets</label>
      <div id="wizard-targets" class="target-checkboxes">
        ${It.targets.map(u=>{const d=r===u.code;return`
          <label class="target-checkbox ${d?"selected":""}" data-code="${u.code}">
            <input type="checkbox" value="${u.code}" ${d?"checked":""}>
            ${u.code}
          </label>
        `}).join("")}
      </div>
      <div class="form-hint">Leave unchecked to store as an admin dataset (not assigned to any target)</div>
    </div>

    <div class="form-group">
      <label>Realm</label>
      <select id="wizard-realm">
        <option value="terrestrial" ${i==="terrestrial"?"selected":""}>Terrestrial</option>
        <option value="marine" ${i==="marine"?"selected":""}>Marine</option>
      </select>
    </div>

    <div class="form-group">
      <label class="toggle-switch">
        <input type="checkbox" id="wizard-30x30" ${o?"checked":""}>
        <span class="toggle-track"></span>
        Counts toward 30x30 (Target 3 only)
      </label>
      <div class="form-hint">Only meaningful if Target 3 is selected</div>
    </div>

    <div class="form-group">
      <label class="toggle-switch">
        <input type="checkbox" id="wizard-reference">
        <span class="toggle-track"></span>
        Reference layer (visual only)
      </label>
      <div class="form-hint">Reference layers are displayed on the map but excluded from area calculations and KPI metrics</div>
    </div>

    <div style="margin-top:16px;display:flex;justify-content:space-between">
      <button class="btn btn-outline" id="wizard-back-2">Back</button>
      <button class="btn btn-primary" id="wizard-next-2">Process</button>
    </div>
  `;const n=t.querySelector("#wizard-category"),l=t.querySelector("#wizard-realm");n.addEventListener("change",()=>{const u=K[n.value];u&&(l.value=u.defaultRealm)}),t.querySelectorAll("#wizard-targets .target-checkbox").forEach(u=>{u.addEventListener("click",d=>{d.preventDefault(),u.classList.toggle("selected");const h=u.querySelector("input");h.checked=!h.checked})}),t.querySelector("#wizard-back-2").addEventListener("click",()=>{Z.step=1,la()}),t.querySelector("#wizard-next-2").addEventListener("click",async()=>{var h;const u=[...t.querySelectorAll("#wizard-targets input:checked")].map(f=>f.value);Z.opts.name=t.querySelector("#wizard-name").value||"Untitled",Z.opts.category=n.value,Z.opts.targets=u,Z.opts.realm=l.value,Z.opts.countsToward30x30=t.querySelector("#wizard-30x30").checked,Z.opts.isReference=t.querySelector("#wizard-reference").checked,Z.opts.prjText=Z.prjText;const d=xo(((h=Z.file)==null?void 0:h.name)||"",Z.opts.name,Z.opts.category);if(d.length>0){const f=d.map(m=>`  - "${m.metadata.name}" (${m.metadata.category}, uploaded ${new Date(m.metadata.uploadTimestamp).toLocaleDateString()})`).join(`
`);if(!await Ga(`A dataset with the same name or file already exists:

${f}

Uploading will replace the existing dataset.
Do you want to continue?`,{title:"Duplicate Dataset",okLabel:"Replace"}))return}Z.step=3,la()})}function Np(t){t.innerHTML=`
    <p style="margin-bottom:10px;font-weight:600">Running auto-cleaning pipeline...</p>
    <div class="pipeline-log" id="pipeline-log"></div>
    <div id="pipeline-status" style="margin-top:10px"></div>
  `;const e=t.querySelector("#pipeline-log"),a=t.querySelector("#pipeline-status");function s(r,o=""){const n=document.createElement("div");n.className=`log-entry ${o}`,n.textContent=`[${new Date().toLocaleTimeString()}] ${r}`,e.appendChild(n),e.scrollTop=e.scrollHeight}const i=Y();Ep(Z.geojson,Z.opts,i.provincesGeojson,(r,o)=>s(`Step ${r}: ${o}`)).then(async r=>{Z.result=r;for(const l of r.report.warnings)s(`WARNING: ${l}`,"log-warn");for(const l of r.report.errors)s(`ERROR: ${l}`,"log-error");const o=Mo(r.metadata.originalFilename,r.metadata.category);if(o){s(`Replacing existing layer "${o.metadata.name}" (same file + category)`,"log-warn");try{await Va(o.id),qs(o.id)}catch(l){s(`Warning: could not remove old layer: ${l.message}`,"log-warn")}}const n={id:r.metadata.id,metadata:r.metadata,geojson:r.geojson};await uo(n),js(n),await He({action:o?"replace":"upload",layer_id:r.metadata.id,replaced_layer_id:(o==null?void 0:o.id)||null,filename:r.metadata.originalFilename,targets:r.metadata.targets,category:r.metadata.category,result:r.metadata.status}),Z.expectedLayer&&(Eo(Z.expectedLayer.id,r.metadata.id),await pe("layerTracker",Y().layerTracker),s(`Tracked as: ${ge(Z.expectedLayer)}`)),a.innerHTML=`
      <p style="color:var(--success);font-weight:600">Pipeline complete. Status: ${r.metadata.status}</p>
      <button class="btn btn-primary" id="wizard-next-3" style="margin-top:10px">View Results</button>
    `,t.querySelector("#wizard-next-3").addEventListener("click",()=>{Z.step=4,la()})}).catch(r=>{s(`FATAL: ${r.message}`,"log-error"),a.innerHTML=`
      <p style="color:var(--danger)">Pipeline failed: ${r.message}</p>
      <button class="btn btn-outline" id="wizard-error-close-btn">Close</button>
    `,t.querySelector("#wizard-error-close-btn").addEventListener("click",()=>ss())})}function Rp(t){const e=Z.result;if(!e){t.innerHTML="<p>No results</p>";return}const a=e.metadata,s=e.report.torCompliance||{compliant:!1,issues:[]};t.innerHTML=`
    <h4 style="margin-bottom:12px">${a.name}</h4>
    <table class="data-table" style="margin-bottom:16px">
      <tr><td><b>Category</b></td><td>${a.category}</td></tr>
      <tr><td><b>Targets</b></td><td>${a.targets.join(", ")}</td></tr>
      <tr><td><b>Realm</b></td><td>${a.realm}</td></tr>
      <tr><td><b>Features</b></td><td>${a.featureCount}</td></tr>
      <tr><td><b>Area</b></td><td>${a.totalAreaHa.toFixed(2)} ha</td></tr>
      <tr><td><b>Fixed</b></td><td>${a.fixedCount} geometries</td></tr>
      <tr><td><b>Dropped</b></td><td>${a.droppedCount} geometries</td></tr>
      <tr><td><b>CRS</b></td><td>${a.detectedCRS}</td></tr>
      <tr><td><b>Status</b></td><td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td></tr>
      <tr><td><b>30x30</b></td><td>${a.countsToward30x30?"Yes":"No"}</td></tr>
      <tr><td><b>Reference</b></td><td>${a.isReference?"Yes (visual only)":"No"}</td></tr>
    </table>

    <div class="card" style="margin-bottom:12px">
      <div class="card-header">TOR Compliance</div>
      <div class="card-body">
        ${s.compliant?'<p style="color:var(--success);font-weight:600">All checks passed</p>':s.issues.map(i=>`<p style="color:var(--warning);font-size:13px">- ${i}</p>`).join("")}
      </div>
    </div>

    ${a.warnings.length>0?`
      <div class="card" style="margin-bottom:12px">
        <div class="card-header">Warnings</div>
        <div class="card-body">
          ${a.warnings.map(i=>`<p style="color:var(--warning);font-size:12px">- ${i}</p>`).join("")}
        </div>
      </div>
    `:""}

    <div style="display:flex;justify-content:space-between;margin-top:16px">
      <button class="btn btn-outline" id="wizard-download-geojson">Download Cleaned GeoJSON</button>
      <button class="btn btn-primary" id="wizard-done">Done</button>
    </div>
  `,t.querySelector("#wizard-download-geojson").addEventListener("click",()=>{const i=JSON.stringify(e.geojson,null,2),r=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(r),n=document.createElement("a");n.href=o,n.download=`${a.name.replace(/\s+/g,"_")}_cleaned.geojson`,n.click(),URL.revokeObjectURL(o)}),t.querySelector("#wizard-done").addEventListener("click",()=>{ss(),window.dispatchEvent(new CustomEvent("nbsap:refresh"))})}const Ip={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1};function Bp(){try{return Ip&&"./"||"./"}catch{return"./"}}function Dp(){ee()}function ee(){const t=document.getElementById("page-admin");Oo().isAuthenticated?Op(t):Fp(t)}function Fp(t){const e=Bp();t.innerHTML=`
    <div class="lcp-outer">
      <div class="lcp-card">

        <!-- Seal / Branding header -->
        <div class="lcp-header">
          <div class="lcp-seal-ring">
            <img src="${e}vanuatu-coat-of-arms.svg"
                 alt="Republic of Vanuatu Coat of Arms"
                 width="96" height="96"
                 class="lcp-seal-img">
          </div>
          <div class="lcp-titles">
            <span class="lcp-republic">Republic of Vanuatu</span>
            <h1 class="lcp-portal-name">NBSAP GIS Portal</h1>
            <span class="lcp-dept">Dept. of Environmental Protection &amp; Conservation</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="lcp-divider"><span>Administrator Access</span></div>

        <!-- Form -->
        <div class="lcp-form">
          <div class="lcp-input-wrap">
            <span class="lcp-input-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input type="password" id="admin-passphrase" class="lcp-input"
                   placeholder="Enter passphrase" autocomplete="current-password"
                   aria-label="Admin passphrase">
            <button type="button" class="lcp-pw-toggle" id="btn-toggle-pw" aria-label="Show passphrase">
              <svg class="icon-eye" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="icon-eye-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>

          <div id="login-error" class="lcp-error" role="alert" style="display:none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span id="login-error-text"></span>
          </div>

          <button class="lcp-btn-signin" id="btn-admin-login">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Sign In to Admin Panel
          </button>
        </div>

        <!-- Footer -->
        <div class="lcp-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Secure Access &nbsp;&middot;&nbsp; Encrypted &nbsp;&middot;&nbsp; Official Use Only
        </div>

      </div>
    </div>
  `;const a=t.querySelector("#admin-passphrase"),s=t.querySelector("#btn-admin-login"),i=t.querySelector("#login-error"),r=t.querySelector("#login-error-text"),o=t.querySelector("#btn-toggle-pw"),n=o.querySelector(".icon-eye"),l=o.querySelector(".icon-eye-off");o.addEventListener("click",()=>{const u=a.type==="password";a.type=u?"text":"password",n.style.display=u?"none":"",l.style.display=u?"":"none",o.setAttribute("aria-label",u?"Hide passphrase":"Show passphrase")});const c=async()=>{s.disabled=!0,i.style.display="none";const u=await Do(a.value);u.success?(Pr(!0),ee(),$n(!0)):(r.textContent=u.error||"Login failed",i.style.display="",s.disabled=!1,a.focus())};s.addEventListener("click",c),a.addEventListener("keydown",u=>{u.key==="Enter"&&c()})}async function Op(t){const e=await bi(),a=Y(),s=a.layerTracker,i=Object.keys(s).length,r=xe.length,o=Object.values(s).reduce((d,h)=>d+(Array.isArray(h)?h.length:0),0);t.innerHTML=`
    <div class="admin-layout">
      <div class="admin-header">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
            <h2>Admin Panel</h2>
            <span class="badge badge-success" style="font-size:11px;padding:3px 10px">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:3px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Authenticated
            </span>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);margin-top:2px">
            Vanuatu NBSAP GIS Portal &mdash; DEPC Administrator &mdash; data syncs in real time via Firestore
          </p>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="session-timer" id="admin-session-elapsed" title="Time since login">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span id="session-elapsed-text">0:00</span>
          </span>
          <button class="btn btn-danger" id="btn-admin-logout" style="font-size:12px;padding:6px 14px">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Data Layer Tracker
          </div>
          <span style="font-size:13px;color:var(--text-secondary)">${i} / ${r} layers &middot; ${o} file${o!==1?"s":""} uploaded</span>
        </div>
        <div class="card-body" style="padding:0">
          <div style="padding:12px 16px 8px;border-bottom:1px solid var(--border)">
            <div class="progress-bar-container" style="height:8px">
              <div class="progress-bar-fill terrestrial" style="width:${r>0?(i/r*100).toFixed(0):0}%;transition:width 0.3s"></div>
            </div>
            <p style="font-size:12px;color:var(--text-tertiary);margin-top:6px">Upload GIS data layers. You can upload <strong>multiple shapefiles</strong> per target. Data syncs across all devices in real time.</p>
          </div>
          <table class="data-table" id="tracker-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Layer</th>
                <th>Category</th>
                <th>Target</th>
                <th>Realm</th>
                <th>Uploaded Files</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${xe.map(d=>{const h=s[d.id]||[],f=h.length>0,p=K[d.category]||{},m=h.map(g=>{var x;const y=a.layers.find(E=>E.id===g.layerId),v=((x=y==null?void 0:y.metadata)==null?void 0:x.originalFilename)||g.layerId,b=new Date(g.uploadedAt).toLocaleDateString(),_=v.length>22?v.slice(0,22)+"...":v;return`<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">
                    <span style="font-size:11px" title="${v}">${_}</span>
                    <span style="font-size:10px;color:var(--text-tertiary)">${b}</span>
                    <button class="btn btn-sm btn-ghost tracker-remove-one" data-expected-id="${d.id}" data-layer-id="${g.layerId}" title="Remove this file" style="padding:1px 4px;font-size:10px;color:var(--danger);min-width:0">&times;</button>
                  </div>`}).join("");return`
                  <tr>
                    <td>
                      ${f?`<span class="badge badge-success">${h.length} file${h.length!==1?"s":""}</span>`:'<span class="badge" style="background:var(--warning-light);color:var(--warning)">Pending</span>'}
                    </td>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <span style="width:4px;height:24px;border-radius:2px;background:${p.color||"#95a5a6"};flex-shrink:0"></span>
                        <div>
                          <strong class="layer-name-editable" data-expected-id="${d.id}" style="font-size:13px;cursor:pointer;border-bottom:1px dashed var(--text-tertiary)" title="Click to rename">${ge(d)}</strong>
                          <div style="font-size:11px;color:var(--text-tertiary)">${d.description}</div>
                        </div>
                      </div>
                    </td>
                    <td style="font-size:12px">${p.label||d.category}</td>
                    <td><span class="badge badge-info">${d.target}</span></td>
                    <td style="text-transform:capitalize;font-size:12px">${d.realm}</td>
                    <td style="font-size:12px;color:var(--text-secondary)">
                      ${f?m:'<span style="color:var(--text-tertiary)">--</span>'}
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary tracker-upload" data-expected-id="${d.id}">
                        ${f?"Add More":"Upload"}
                      </button>
                      ${f?`<button class="btn btn-sm btn-danger tracker-remove-all" data-expected-id="${d.id}" style="margin-left:4px" title="Remove all files for this layer">Clear</button>`:""}
                    </td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Other Data
          </div>
        </div>
        <div class="card-body">
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">Upload additional GIS data not listed in the tracker above.</p>
          <button class="btn btn-primary" id="btn-admin-upload">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload File
          </button>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            Sync & Backup
          </div>
        </div>
        <div class="card-body">
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">Data syncs automatically via Firestore. Use Export/Import for offline backup or migration.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <button class="btn btn-primary" id="btn-export-backup">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Data
            </button>
            <label class="btn btn-secondary" style="cursor:pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Sync / Import
              <input type="file" id="btn-sync-import" accept=".json" style="display:none">
            </label>
            <label class="btn btn-outline" style="cursor:pointer" title="Destructive: clears all data before importing">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Full Restore
              <input type="file" id="btn-import-backup" accept=".json" style="display:none">
            </label>
            <span id="backup-status" style="font-size:13px;color:var(--text-secondary);margin-left:4px"></span>
          </div>
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
          ${e.length===0?'<div class="empty-state" style="padding:32px"><div class="empty-state-title">No actions recorded</div><div class="empty-state-text">Audit log entries will appear here as actions are performed</div></div>':`
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
                  ${e.map(d=>`
                    <tr>
                      <td style="font-size:12px;color:var(--text-secondary)">${new Date(d.timestamp).toLocaleString()}</td>
                      <td style="text-transform:capitalize;font-weight:500">${d.action||""}</td>
                      <td style="font-size:12px">${d.filename||d.layer_id||""}</td>
                      <td>${d.category||""}</td>
                      <td>${(d.targets||[]).map(h=>`<span class="badge badge-info" style="margin-right:2px">${h}</span>`).join("")}</td>
                      <td><span class="badge badge-${(d.result||"").toLowerCase()}">${d.result||""}</span></td>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
            System Information
          </div>
          <span class="badge badge-success" style="font-size:10px">Online</span>
        </div>
        <div class="card-body" style="font-size:13px">
          <table class="metadata-table">
            <tr><td>Portal Version</td><td><strong>v2.0.0</strong></td></tr>
            <tr><td>Operator</td><td>Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu</td></tr>
            <tr><td>Framework</td><td>Kunming-Montreal Global Biodiversity Framework, 2024&ndash;2030</td></tr>
            <tr><td>Auth Provider</td><td>Local Passphrase (bcrypt)</td></tr>
            <tr><td>Storage</td><td>Google Firestore &mdash; real-time sync across all devices</td></tr>
            <tr><td>Auth Status</td><td><span class="badge badge-success">Authenticated</span></td></tr>
            <tr><td>Session</td><td>Active &mdash; clears on page reload</td></tr>
            <tr><td>Session Time</td><td id="admin-session-time">&mdash;</td></tr>
          </table>
          <p style="margin-top:12px;color:var(--text-tertiary);font-size:12px;line-height:1.6">
            To change the admin passphrase, update the hash stored in localStorage key
            <code style="background:var(--gray-100);padding:2px 6px;border-radius:4px;font-size:11px">nbsap_admin_hash</code>.
            For security incidents, contact DEPC system administrator immediately.
          </p>
        </div>
      </div>
    </div>
  `;const n=t.querySelector("#admin-session-time");if(n){const d=new Date;n.textContent=d.toLocaleString([],{dateStyle:"medium",timeStyle:"short"})}const l=Date.now(),c=t.querySelector("#session-elapsed-text"),u=t.querySelector("#admin-session-elapsed");if(c){const d=()=>{if(!document.getElementById("session-elapsed-text"))return;const h=Math.floor((Date.now()-l)/1e3),f=Math.floor(h/60),p=h%60;c.textContent=`${f}:${String(p).padStart(2,"0")}`,h>14400&&u&&u.classList.add("warning"),setTimeout(d,1e3)};d()}t.querySelector("#btn-admin-logout").addEventListener("click",()=>{Fo(),Pr(!1),ee(),$n(!1)}),t.querySelector("#btn-admin-upload").addEventListener("click",()=>lr()),t.querySelectorAll(".tracker-upload").forEach(d=>{d.addEventListener("click",()=>{const h=d.dataset.expectedId,f=xe.find(p=>p.id===h);f&&lr({expectedLayer:f})})}),t.querySelectorAll(".tracker-remove-one").forEach(d=>{d.addEventListener("click",async()=>{const h=d.dataset.expectedId,f=d.dataset.layerId;Si(h,f),await pe("layerTracker",Y().layerTracker),ee()})}),t.querySelectorAll(".layer-name-editable").forEach(d=>{d.addEventListener("click",h=>{h.stopPropagation();const f=d.dataset.expectedId,p=xe.find(b=>b.id===f);if(!p)return;const m=ge(p),g=document.createElement("input");g.type="text",g.value=m,g.style.cssText="font-size:13px;font-weight:600;padding:2px 6px;border:2px solid var(--primary);border-radius:4px;outline:none;width:100%;box-sizing:border-box",d.parentNode.replaceChild(g,d),g.focus(),g.select();const v=async()=>{const b=g.value.trim();if(b&&b!==p.name)So(f,b),await pe("customLayerNames",Y().customLayerNames);else if(b===p.name){const _=Y();delete _.customLayerNames[f],await pe("customLayerNames",_.customLayerNames)}ee()};g.addEventListener("blur",v),g.addEventListener("keydown",b=>{b.key==="Enter"&&(b.preventDefault(),g.blur()),b.key==="Escape"&&(g.value=m,g.blur())})})}),t.querySelectorAll(".tracker-remove-all").forEach(d=>{d.addEventListener("click",async()=>{const h=d.dataset.expectedId,f=xe.find(m=>m.id===h),p=f?ge(f):h;await Ga(`Remove all uploaded files for "${p}"? The files remain in storage but won't appear on the dashboard.`,{title:"Remove Files",okLabel:"Remove",danger:!0})&&(Si(h,null),await pe("layerTracker",Y().layerTracker),ee())})}),t.querySelector("#btn-export-backup").addEventListener("click",async()=>{const d=t.querySelector("#backup-status");d.textContent="Exporting...";try{const h=await po(),f=JSON.stringify(h,null,2),p=new Blob([f],{type:"application/json"}),m=URL.createObjectURL(p),g=document.createElement("a");g.href=m,g.download=`nbsap-backup-${new Date().toISOString().slice(0,10)}.json`,g.click(),URL.revokeObjectURL(m),await He({action:"export_backup",result:"success"}),d.textContent="Backup exported successfully"}catch(h){d.textContent=`Error: ${h.message}`}}),t.querySelector("#btn-sync-import").addEventListener("change",async d=>{const h=d.target.files[0];if(!h)return;const f=t.querySelector("#backup-status");f.textContent="Syncing...";try{const p=await h.text(),m=JSON.parse(p),g=await go(m);await He({action:"sync_import",result:"success",notes:`${g.added} added, ${g.updated} updated, ${g.skippedAudit} audit entries skipped`}),f.textContent=`Sync complete: ${g.added} new layers, ${g.updated} updated.`,window.dispatchEvent(new CustomEvent("nbsap:refresh"))}catch(p){f.textContent=`Sync failed: ${p.message}`}d.target.value=""}),t.querySelector("#btn-import-backup").addEventListener("change",async d=>{const h=d.target.files[0];if(!h)return;if(!await Ga("Full Restore will clear ALL existing data and replace it with the backup. Continue?",{title:"Full Restore",okLabel:"Restore",danger:!0})){d.target.value="";return}const f=t.querySelector("#backup-status");f.textContent="Restoring...";try{const p=await h.text(),m=JSON.parse(p),g=await fo(m);await He({action:"import_backup",result:"success",notes:`${g.layersImported} layers imported`}),f.textContent=`Restored ${g.layersImported} layers.`,window.dispatchEvent(new CustomEvent("nbsap:refresh"))}catch(p){f.textContent=`Restore failed: ${p.message}`}d.target.value=""}),t.querySelector("#btn-export-audit").addEventListener("click",async()=>{const d=await bi(),h=[["Timestamp","Action","Layer ID","Filename","Category","Targets","Result"]];for(const y of d)h.push([y.timestamp||"",y.action||"",y.layer_id||"",y.filename||"",y.category||"",(y.targets||[]).join(";"),y.result||""]);const f=h.map(y=>y.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join(`
`),p=new Blob([f],{type:"text/csv"}),m=URL.createObjectURL(p),g=document.createElement("a");g.href=m,g.download="audit-log.csv",g.click(),URL.revokeObjectURL(m)})}function $n(t){const e=document.getElementById("auth-badge");if(e){const a=e.querySelector("span");t?(a&&(a.textContent="Admin"),e.classList.add("admin")):(a&&(a.textContent="Public"),e.classList.remove("admin"))}}const jp={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1};function qp(){try{return jp&&"./"||"./"}catch{return"./"}}function zp(){const t=document.getElementById("page-about"),e=qp();t.innerHTML=`
    <div class="about-layout">

      <!-- ── Page Header ───────────────────────────────────── -->
      <div class="about-page-header">
        <div class="about-page-header-left">
          <img src="${e}vanuatu-coat-of-arms.svg" alt="Vanuatu Coat of Arms" width="28" height="28" style="opacity:0.85">
          <div>
            <div class="about-page-title">Vanuatu NBSAP GIS Data Portal</div>
            <div class="about-page-subtitle">National Biodiversity Strategy &amp; Action Plan &mdash; Kunming-Montreal GBF Monitoring System</div>
          </div>
        </div>
        <div class="about-page-header-meta">
          <span class="about-meta-chip">v2.0.0</span>
          <span class="about-meta-chip">DEPC Vanuatu</span>
          <span class="about-meta-chip">GBF 2024&ndash;2030</span>
        </div>
      </div>

      <!-- ── System Specifications ─────────────────────────── -->
      <h3>System Specifications</h3>
      <div class="about-specs-grid">
        <table class="about-specs-table">
          <tbody>
            <tr><td class="spec-key">Terrestrial Baseline</td><td class="spec-val">1,219,000 ha</td></tr>
            <tr><td class="spec-key">Marine EEZ Baseline</td><td class="spec-val spec-val-marine">66,300,000 ha</td></tr>
            <tr><td class="spec-key">NBSAP Targets Tracked</td><td class="spec-val">9 targets (T1, T2, T3, T4, T6, T7, T8, T10, T12)</td></tr>
            <tr><td class="spec-key">Provinces Covered</td><td class="spec-val">6 (Torba, Sanma, Penama, Malampa, Shefa, Tafea)</td></tr>
            <tr><td class="spec-key">30×30 Conservation Goal</td><td class="spec-val">≥ 30% terrestrial &amp; marine area by 2030</td></tr>
            <tr><td class="spec-key">GBF Reporting Period</td><td class="spec-val">2024 &ndash; 2030</td></tr>
          </tbody>
        </table>
        <table class="about-specs-table">
          <tbody>
            <tr><td class="spec-key">Coordinate System</td><td class="spec-val">WGS84 / EPSG:4326</td></tr>
            <tr><td class="spec-key">Area Calculation</td><td class="spec-val">Geodesic (turf.js), union/dissolve to prevent double-counting</td></tr>
            <tr><td class="spec-key">GIS Library</td><td class="spec-val">Leaflet.js + turf.js + proj4js</td></tr>
            <tr><td class="spec-key">Data Storage</td><td class="spec-val">Google Firestore (real-time sync)</td></tr>
            <tr><td class="spec-key">Auth</td><td class="spec-val">Local passphrase (bcrypt)</td></tr>
            <tr><td class="spec-key">Portal Version</td><td class="spec-val">v2.0.0 &mdash; built for DEPC Vanuatu</td></tr>
          </tbody>
        </table>
      </div>

      <!-- ── Capabilities ──────────────────────────────────── -->
      <h3>Capabilities</h3>
      <table class="about-caps-table">
        <tbody>
          <tr>
            <td class="caps-module">Dashboard &amp; Analytics</td>
            <td>Interactive Leaflet map with per-layer toggles and ordering; target-specific KPI widgets; progress bars toward 30×30 goals; provincial breakdown tables and bar charts; category breakdown tables.</td>
          </tr>
          <tr>
            <td class="caps-module">Data Portal</td>
            <td>Layer catalogue grouped by GBF target; metadata compliance tracking and TOR compliance checks; completeness scoring; GeoJSON export; full-text search and filter by target, category, realm, status.</td>
          </tr>
          <tr>
            <td class="caps-module">Shapefile Upload</td>
            <td>7-step automated pipeline: file validation → CRS detection → WGS84 reprojection (proj4js) → geometry cleaning → field mapping → province assignment (centroid-in-polygon) → geodesic area calculation.</td>
          </tr>
          <tr>
            <td class="caps-module">Reporting &amp; Export</td>
            <td>CSV export of filtered data; JSON reporting snapshots aligned with TOR requirements; print-quality A4 cartographic maps for individual targets, by province, by species, or all 9 targets.</td>
          </tr>
        </tbody>
      </table>

      <div class="about-section-divider"></div>

      <!-- ── GBF Target Alignment ───────────────────────────── -->
      <h3>GBF Target Alignment &mdash; NBSAP Targets Tracked</h3>
      <table class="about-targets-table">
        <thead>
          <tr>
            <th style="width:52px">Target</th>
            <th style="width:200px">Name</th>
            <th>Description</th>
            <th>Primary Layers</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="about-target-badge" style="background:#1565C0">T1</span></td>
            <td><strong>Biodiversity Spatial Planning</strong></td>
            <td>% of land and sea area covered by biodiversity-inclusive spatial plans.</td>
            <td class="spec-layers">Spatial Plans, KBAs, MPAs, LMMAs, CCAs, Inland Water</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#D84315">T2</span></td>
            <td><strong>Degraded Area &amp; Restoration</strong></td>
            <td>Mapping of degraded terrestrial, inland water, marine, and coastal ecosystems; active and planned restoration sites.</td>
            <td class="spec-layers">Degraded Terrestrial, Degraded Marine/Coastal, Restoration Sites</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#2E7D32">T3</span></td>
            <td><strong>30×30 Conservation</strong></td>
            <td>Conserve ≥ 30% terrestrial and marine areas by 2030 via PAs, CCAs, MPAs, LMMAs, OECMs. Primary dashboard target. Baselines: 1,219,000 ha terrestrial / 66,300,000 ha marine.</td>
            <td class="spec-layers">CCAs, MPAs, LMMAs, Protected Areas (WDPA), OECMs</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#7E57C2">T4</span></td>
            <td><strong>Species Distribution</strong></td>
            <td>Distribution maps for 6 significant species: Megapode, Mountain Starling, Streaked Fantail, Kingfisher, Flying Fox, Plerandra.</td>
            <td class="spec-layers">Significant Species Distribution, Key Biodiversity Areas</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#C62828">T6</span></td>
            <td><strong>Invasive Alien Species</strong></td>
            <td>Coverage and distribution of key IAS: <em>Merremia peltata</em>, Fire Ants, African Snail, Crown-of-Thorns, Sako, Coconut Beetle.</td>
            <td class="spec-layers">Merremia peltata Detection, Other IAS</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#8E24AA">T7</span></td>
            <td><strong>Pesticide &amp; Herbicide</strong></td>
            <td>Spatial mapping of pesticide and herbicide use in large-scale and small-scale commercial farming across Vanuatu.</td>
            <td class="spec-layers">Pesticide &amp; Herbicide Use Areas</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#00838F">T8</span></td>
            <td><strong>Coastal Eutrophication</strong></td>
            <td>Mapping of coastal eutrophication zones and nutrient-impacted marine areas around Vanuatu's islands.</td>
            <td class="spec-layers">Coastal Eutrophication Zones</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#795548">T10</span></td>
            <td><strong>Agriculture &amp; Land Cover</strong></td>
            <td>Land cover change for agriculture, livestock, fisheries, and forestry; tracking conversion from natural ecosystems.</td>
            <td class="spec-layers">Land Cover / Land Use Change</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#388E3C">T12</span></td>
            <td><strong>Blue &amp; Green Spaces</strong></td>
            <td>Urban and peri-urban blue and green spaces — parks, botanical gardens, and coastal blue spaces in provincial/municipal areas.</td>
            <td class="spec-layers">Blue &amp; Green Spaces</td>
          </tr>
        </tbody>
      </table>

      <div class="about-section-divider"></div>

      <!-- ── Partner Organisations ──────────────────────────── -->
      <h3>Partner Organisations</h3>
      <table class="about-attribution-table">
        <thead>
          <tr><th>Organisation</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>DEPC Vanuatu</strong> — Dept. of Environmental Protection &amp; Conservation</td>
            <td>Lead implementing agency &amp; data custodian</td>
          </tr>
          <tr>
            <td><strong>CBD</strong> — Convention on Biological Diversity</td>
            <td>Kunming-Montreal GBF framework &amp; reporting standards</td>
          </tr>
          <tr>
            <td><strong>Ministry of Climate Change</strong>, Meteorology, Geo-Hazards, Environment, Energy &amp; Disaster Management</td>
            <td>Policy ownership &amp; national mandate</td>
          </tr>
          <tr>
            <td><strong>Vanua Spatial Solutions</strong></td>
            <td>GIS system design, development &amp; technical implementation (portal, dashboard, upload pipeline)</td>
          </tr>
          <tr>
            <td><strong>UNDP</strong> — United Nations Development Programme</td>
            <td>Funding partner &amp; technical advisory for GBF implementation support</td>
          </tr>
          <tr>
            <td><strong>GEF</strong> — Global Environment Facility</td>
            <td>Financial support for biodiversity monitoring infrastructure</td>
          </tr>
        </tbody>
      </table>

      <div class="about-section-divider"></div>

      <!-- ── Data Governance ────────────────────────────────── -->
      <h3>Data Governance &amp; Attribution</h3>
      <div class="about-governance-box">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Data Use Requirements
        </h4>
        <ul>
          <li>All data displayed in this portal is the property of the Department of Environmental Protection &amp; Conservation (DEPC), Republic of Vanuatu, unless otherwise stated.</li>
          <li>Users of this portal must cite: <em>"Vanuatu NBSAP GIS Portal, DEPC Vanuatu, [year]"</em> in any publications, reports, or presentations that use data from this system.</li>
          <li>Data classified as <strong>Restricted</strong> must not be shared publicly without prior written approval from DEPC.</li>
          <li>All spatial analyses use geodesic methods with WGS84 (EPSG:4326) coordinates to ensure internationally comparable area measurements.</li>
          <li>For data download requests, contact the DEPC Data Management team (details below).</li>
        </ul>
      </div>

      <div class="about-disclaimer-box">
        <h4>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Data Quality Notice
        </h4>
        <p>
          Spatial data in this portal represents best-available information at the time of upload and may not reflect the most current field conditions.
          Area calculations are computed using union/dissolve methodology to prevent double-counting of overlapping polygons.
          Users should validate data independently before using it for legal or policy decisions.
          Baseline figures (terrestrial: 1,219,000 ha; marine EEZ: 66,300,000 ha) are derived from nationally agreed spatial datasets.
        </p>
      </div>

      <div class="about-section-divider"></div>

      <!-- ── How to Use ─────────────────────────────────────── -->
      <h3>How to Use This Portal</h3>
      <ol style="margin-left:20px;margin-bottom:16px;line-height:2">
        <li>Open the <strong style="color:var(--text)">Dashboard</strong> tab to explore data on an interactive map with legend controls</li>
        <li>Apply <strong style="color:var(--text)">filters</strong> by target, province, category, realm, or year from the sidebar</li>
        <li>Select a <strong style="color:var(--text)">single target</strong> to see target-specific KPIs, progress bars toward GBF targets, provincial breakdown, and category analysis</li>
        <li>For <strong style="color:var(--text)">Target 3</strong>, view 30x30 progress bars showing % of terrestrial and marine baselines conserved toward the 30% GBF goal</li>
        <li>For <strong style="color:var(--text)">Target 6</strong>, view invasive species detection breakdown with Merremia-specific metrics and provincial spread</li>
        <li>Use <strong style="color:var(--text)">Export</strong> buttons to download data as CSV, JSON reporting snapshots, or PNG map screenshots for reports</li>
        <li>Use <strong style="color:var(--text)">Print Maps</strong> to generate standardised A4 cartographic maps for individual targets, by province, or all 9 targets at once</li>
        <li>Admin users can <strong style="color:var(--text)">upload</strong> new shapefile layers and manage metadata via the Admin tab</li>
      </ol>

      <div class="about-section-divider"></div>

      <!-- ── Upload & Analysis Pipeline ────────────────────── -->
      <h3>Automated GIS Processing Pipeline</h3>
      <p style="margin-bottom:12px">When a shapefile is uploaded, the portal runs a fully automated 7-step GIS pipeline:</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px;margin-bottom:20px">
        ${[["1. Validation","File format, geometry type, and attribute completeness checks"],["2. CRS Detection","Identifies coordinate reference system from .prj file"],["3. Reprojection","Converts to WGS84 (EPSG:4326) using proj4js if needed"],["4. Geometry Cleaning","Fixes invalid polygons, removes slivers and self-intersections"],["5. Field Mapping","Maps attributes to standard names (name, type, province, area_ha)"],["6. Province Assignment","Centroid-in-polygon spatial join against Vanuatu province boundaries"],["7. Area Calculation","Geodesic area computation using turf.area() in hectares (ha)"]].map(([a,s],i)=>`
          <div style="display:flex;gap:10px;padding:10px 12px;background:var(--bg-white);border:1px solid var(--border);border-radius:var(--radius-sm)">
            <div style="width:28px;height:28px;background:var(--primary);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">${i+1}</div>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--text)">${a}</div>
              <div style="font-size:11px;color:var(--text-secondary)">${s}</div>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="about-section-divider"></div>

      <!-- ── Contact ────────────────────────────────────────── -->
      <h3>Contact &amp; Data Requests</h3>
      <div class="about-contact-grid">
        <div class="about-contact-card">
          <div class="contact-card-name">Rolenas Baereleo</div>
          <div class="contact-card-title">Manager BioDiversity &amp; Conservation, DEPC</div>
          <a href="mailto:rbaereleo@vanuatu.gov.vu" class="contact-card-email">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            rbaereleo@vanuatu.gov.vu
          </a>
        </div>
        <div class="about-contact-card">
          <div class="contact-card-name">Dean Wotlolan</div>
          <div class="contact-card-title">Senior Biodiversity &amp; Conservation Officer, DEPC</div>
          <a href="mailto:dlaunder@vanuatu.gov.vu" class="contact-card-email">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            dlaunder@vanuatu.gov.vu
          </a>
        </div>
        <div class="about-contact-card">
          <div class="contact-card-name">DEPC Vanuatu</div>
          <div class="contact-card-title">Department of Environmental Protection &amp; Conservation</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Port Vila, Republic of Vanuatu</div>
        </div>
        <div class="about-contact-card" style="border-left-color:var(--secondary)">
          <div class="contact-card-name">Vanua Spatial Solutions</div>
          <div class="contact-card-title">GIS Technical Implementation Partner</div>
          <a href="mailto:support@vanuaspatial.vu" class="contact-card-email">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            support@vanuaspatial.vu
          </a>
          <div style="font-size:11px;color:var(--text-tertiary);margin-top:4px">For portal bugs, data issues, or feature requests</div>
        </div>
      </div>

      <div class="about-section-divider"></div>

      <!-- ── Links & Resources ──────────────────────────────── -->
      <h3>Links &amp; Resources</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px">
        ${[["CBD GBF Targets","https://www.cbd.int/gbf/targets/"],["Protected Planet / WDPA","https://www.protectedplanet.net/"],["Key Biodiversity Areas","https://www.keybiodiversityareas.org/"],["LMMA Network","https://lmmanetwork.org/"],["UNDP Biodiversity","https://www.undp.org/topics/nature-environment/biodiversity"],["Vanuatu DEPC","https://depc.gov.vu/"]].map(([a,s])=>`
          <a href="${s}" target="_blank" rel="noopener noreferrer"
             style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;
                    padding:7px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);
                    background:var(--bg-white);color:var(--secondary);text-decoration:none;
                    transition:all 0.15s ease">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            ${a}
          </a>
        `).join("")}
      </div>

      <!-- ── Version ────────────────────────────────────────── -->
      <div style="padding:12px 16px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border);font-size:12px;color:var(--text-secondary);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
        <span>
          <strong style="color:var(--text)">Version:</strong> v2.0.0 &mdash;
          Built for DEPC Vanuatu.
          GBF reporting period: 2024&ndash;2030.
        </span>
        <span style="font-size:11px;color:var(--text-tertiary)">
          Developed by <strong style="color:var(--text-secondary)">Vanua Spatial Solutions</strong>
        </span>
      </div>

    </div>
  `}const Up={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1};delete z.Icon.Default.prototype._getIconUrl;z.Icon.Default.mergeOptions({iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"});let Ta="dashboard",Ua=!1;function Ln(){try{return Up&&"./"||"./"}catch{return"./"}}async function Hp(){Wl(),Ql(),Dp(),zp(),window.__nbsapLoaded=!0,Zp();let t=null;window.addEventListener("nbsap:refresh",()=>{t&&clearTimeout(t),t=setTimeout(async()=>{if(t=null,Ua){const a=Y().filters.targets;a.length>0&&Lr(a)&&($s(`Loading data for ${a.join(", ")}...`),await Re(a),Ls())}Ta==="dashboard"?ts():Yl(),Ta==="portal"&&an(),Ta==="admin"&&!Cn()&&ee(),Xp()},150)}),Gn("dashboard"),await Vp(),Wp()}function $s(t){let e=document.getElementById("nbsap-loading-status");e||(e=document.createElement("div"),e.id="nbsap-loading-status",e.style.cssText=`
      position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
      z-index: 9998; background: #006B3F; color: white; padding: 8px 20px;
      border-radius: 8px; font-size: 13px; font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex; align-items: center; gap: 8px;
    `,document.body.appendChild(e)),e.innerHTML=`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    ${t}
  `,e.style.display="flex"}function Ls(){const t=document.getElementById("nbsap-loading-status");t&&(t.style.display="none")}async function Vp(){const t=Ln();$s("Loading data from Firestore...");try{const s=await fetch(`${t}data/provinces.geojson`);if(s.ok){const i=await s.json();wo(i)}}catch(s){console.warn("Failed to load provinces data:",s)}try{const s=await je(_i("layerTracker"),1e4);s&&kr(s)}catch(s){console.warn("Failed to load layer tracker:",s)}try{const s=await je(_i("customLayerNames"),1e4);s&&Ar(s)}catch(s){console.warn("Failed to load custom layer names:",s)}try{const s=await je(co(),15e3),i=s.filter(o=>!gs(o)),r=s.filter(o=>gs(o));if(i.length>0){const o=wi(i);console.log(`Loaded metadata for ${i.length} layers from Firestore (excluded ${r.length} demo layers)`),o.length>0&&(console.warn(`Removing ${o.length} duplicate layer(s) from Firestore`),Yp(o)),r.length>0&&Jp(r)}else if(s.length>0){const o=await je(lo(),6e4);wi(o.filter(n=>gs(n)))}else try{const o=await je(ho(),1e4);o>0?console.warn(`Firestore has ${o} layer docs but metadata failed to load. Real-time listener will retry.`):await ms(t)}catch{await ms(t)}}catch(s){console.warn("Failed to load stored layers:",s);try{await ms(t)}catch(i){console.warn("Failed to load demo data:",i)}}Ao()&&(console.log("Cleaned stale tracker entries for previously deleted layers"),pe("layerTracker",Y().layerTracker).catch(s=>console.warn("Failed to persist cleaned tracker:",s))),Ls(),Ua=!0;const a=Y().filters.targets;a.length>0&&Lr(a)&&($s(`Loading GeoJSON for ${a.join(", ")}...`),await Re(a),Ls()),ts()}function Wp(){let t=!0;mo(async e=>{if(!Ua||!(e.added.length>0||e.modified.length>0||e.removed.length>0))return;const s=Y(),i=new Set(s.layers.map(o=>o.id)),r=[];for(const o of[...e.added,...e.modified])t&&i.has(o)||r.push(o);if(t=!1,!(r.length===0&&e.removed.length===0)){if(r.length>0){const o=await Promise.allSettled(r.map(async n=>{const l=await br(n);return l&&js(l),n}));for(const n of o)n.status==="rejected"&&console.warn("Failed to load layer via real-time sync:",n.reason)}for(const o of e.removed)qs(o);(r.length>0||e.removed.length>0)&&Kp({added:r.filter(o=>e.added.includes(o)),modified:r.filter(o=>e.modified.includes(o)),removed:e.removed})}}),vo(e=>{if(!Ua)return;let a=!1;e.layerTracker&&(kr(e.layerTracker),a=!0),e.customLayerNames&&(Ar(e.customLayerNames),a=!0),a&&window.dispatchEvent(new CustomEvent("nbsap:refresh"))})}function Kp(t){if(t.added.length+t.modified.length+t.removed.length===0)return;const a=[];t.added.length>0&&a.push(`${t.added.length} added`),t.modified.length>0&&a.push(`${t.modified.length} updated`),t.removed.length>0&&a.push(`${t.removed.length} removed`);const s=`Synced: ${a.join(", ")}`;let i=document.getElementById("sync-toast");i||(i=document.createElement("div"),i.id="sync-toast",i.style.cssText=`
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: #006B3F; color: white; padding: 10px 20px;
      border-radius: 8px; font-size: 13px; font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: opacity 0.3s, transform 0.3s;
      opacity: 0; transform: translateY(10px);
      display: flex; align-items: center; gap: 8px;
    `,document.body.appendChild(i)),i.innerHTML=`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
    ${s}
  `,requestAnimationFrame(()=>{i.style.opacity="1",i.style.transform="translateY(0)"}),setTimeout(()=>{i.style.opacity="0",i.style.transform="translateY(10px)"},3e3)}function je(t,e){return Promise.race([t,new Promise((a,s)=>setTimeout(()=>s(new Error("Operation timed out")),e))])}function gs(t){const e=t.metadata;return e?e.uploadedBy==="system"||e._isDemo?!0:(e.name||"").toLowerCase().startsWith("demo "):!1}function Jp(t){for(const e of t)Va(e.id).then(()=>{var a;console.log(`Cleaned up demo layer from Firestore: ${((a=e.metadata)==null?void 0:a.name)||e.id}`)}).catch(a=>{console.warn(`Failed to clean up demo layer ${e.id}:`,a)})}function Yp(t){for(const e of t)Va(e).then(()=>{console.log(`Removed duplicate layer from Firestore: ${e}`)}).catch(a=>{console.warn(`Failed to remove duplicate layer ${e}:`,a)})}async function ms(t){t||(t=Ln());const e=[{file:"demo_cca.geojson",name:"Demo CCAs",category:"CCA",realm:"terrestrial"},{file:"demo_mpa.geojson",name:"Demo MPAs",category:"MPA",realm:"marine"}];for(const a of e)try{const s=await fetch(`${t}data/${a.file}`);if(!s.ok)continue;const i=await s.json(),r=xr(i),o=bs({name:a.name,originalFilename:a.file,category:a.category,targets:["T3"],realm:a.realm,countsToward30x30:!0,detectedCRS:"EPSG:4326",featureCount:r.features.length,validGeometryCount:r.features.length,totalAreaHa:r.features.reduce((l,c)=>l+(c.properties.area_ha||0),0),status:"Clean",uploadedBy:"system",_isDemo:!0}),n={id:o.id,metadata:o,geojson:r};js(n)}catch(s){console.warn(`Failed to load demo data ${a.name}:`,s)}}function Zp(){document.querySelectorAll(".nav-tab").forEach(t=>{t.addEventListener("click",()=>{Gn(t.dataset.tab)})})}function Gn(t){Ta=t,document.querySelectorAll(".nav-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===t)}),document.querySelectorAll(".page").forEach(e=>{e.classList.toggle("active",e.id===`page-${t}`)}),t==="dashboard"&&Zl(),t==="portal"&&an(),t==="admin"&&!Cn()&&ee()}function Xp(){const t=document.getElementById("auth-badge");if(t){const e=t.querySelector("span");Jt()?(e&&(e.textContent="Admin"),t.classList.add("admin")):(e&&(e.textContent="Public"),t.classList.remove("admin"))}}Hp().catch(t=>{console.error("App initialization failed:",t);const e=document.getElementById("page-dashboard");e&&(e.innerHTML=`<div style="padding:40px;max-width:600px;margin:0 auto">
      <h2 style="color:#065f46;margin-bottom:12px">Failed to initialize</h2>
      <p style="color:#64748b;font-size:14px">${t.message}</p>
    </div>`)});export{af as l};
