const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-B2WcC-RY.js","./turf-CntlabHM.js","./index-CAYd62CZ.js"])))=>i.map(i=>d[i]);
import{i as zo,a as jo,p as qo,b as Ho,g as Uo,c as xi,d as ye,e as ne,f as Rt,h as dn,s as As,w as hn,j as rr,o as un}from"./firebase-B___2JLs.js";import{a as ds,f as nr,u as or,b as lr,s as Vo,d as Wo,e as Ko,h as Yo,p as Jo,i as Fs}from"./turf-CntlabHM.js";import{L as D}from"./leaflet-CASSoK7o.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();const Zo={apiKey:"AIzaSyB2OGgiXUUhyt1aKdHsqIaMS3NDN-tZOdU",authDomain:"vanuatu-nbsap-dashboard-9909a.firebaseapp.com",projectId:"vanuatu-nbsap-dashboard-9909a",storageBucket:"vanuatu-nbsap-dashboard-9909a.firebasestorage.app",messagingSenderId:"778670993904",appId:"1:778670993904:web:219c671804326d953aed35"},cr=zo(Zo,"nbsap-portal");let lt;try{lt=jo(cr,{localCache:qo({tabManager:Ho()})})}catch(t){console.warn("Firestore persistence not available, using default:",t.message),lt=Uo(cr)}const St="nbsap_layers",Xo="nbsap_metrics",pn="nbsap_audit",_i="nbsap_settings",ks="chunks",es=8e5,Qo=9e6,tl=Math.floor(Qo/es);async function el(t,e){await wi(t);const a=JSON.stringify(e),s=Math.ceil(a.length/es),i=Math.min(499,tl);for(let r=0;r<s;r+=i){const o=hn(lt),n=Math.min(r+i,s);for(let l=r;l<n;l++){const c=ye(lt,St,t,ks,String(l));o.set(c,{d:a.slice(l*es,(l+1)*es)})}await o.commit()}return s}async function fn(t){const e=await ne(Rt(lt,St,t,ks));if(e.empty)return null;const a=e.docs.map(r=>({idx:parseInt(r.id,10),data:r.data().d})).sort((r,o)=>r.idx-o.idx);let s="";for(const r of a)s+=r.data,r.data=null;const i=JSON.parse(s);return s=null,i}async function wi(t){const e=await ne(Rt(lt,St,t,ks));if(!e.empty)for(let a=0;a<e.docs.length;a+=499){const s=hn(lt),i=e.docs.slice(a,a+499);for(const r of i)s.delete(r.ref);await s.commit()}}async function gn(){const t=await ne(Rt(lt,St));if(t.empty)return[];const a=(await Promise.allSettled(t.docs.map(async s=>{const i=s.data(),r=await fn(s.id);return r?{id:s.id,metadata:i.metadata,geojson:r}:(console.warn(`Layer ${s.id}: no GeoJSON chunks found`),null)}))).filter(s=>s.status==="fulfilled"&&s.value!==null).map(s=>s.value);return a.sort((s,i)=>{var n,l;const r=((n=s.metadata)==null?void 0:n.uploadTimestamp)||"";return(((l=i.metadata)==null?void 0:l.uploadTimestamp)||"").localeCompare(r)}),a}async function al(){const t=await ne(Rt(lt,St));if(t.empty)return[];const e=t.docs.map(a=>{const s=a.data();return{id:a.id,metadata:s.metadata||null,geojson:null}}).filter(a=>a.metadata!=null);return e.sort((a,s)=>{var o,n;const i=((o=a.metadata)==null?void 0:o.uploadTimestamp)||"";return(((n=s.metadata)==null?void 0:n.uploadTimestamp)||"").localeCompare(i)}),e}async function sl(){return(await ne(Rt(lt,St))).size}async function il(t){const e=ye(lt,St,t),a=await xi(e);if(!a.exists())return null;const s=a.data(),i=await fn(t);return{id:t,metadata:s.metadata,geojson:i}}async function Mi(t){const{id:e,metadata:a,geojson:s}=t,i=ye(lt,St,e),r=await el(e,s);return await As(i,{metadata:a,_chunkCount:r}),t}async function rl(t,e){const a=ye(lt,St,t),s=await xi(a);if(!s.exists())throw new Error(`Layer ${t} not found`);const i=s.data();await As(a,{...i,metadata:e})}async function nl(t){await wi(t),await dn(ye(lt,St,t))}async function mn(){return(await ne(Rt(lt,Xo))).docs.map(e=>({id:e.id,...e.data()}))}async function vn(t){const e=`a_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,a={...t,timestamp:new Date().toISOString()};await As(ye(lt,pn,e),a)}async function Si(){const e=(await ne(Rt(lt,pn))).docs.map(a=>({id:a.id,...a.data()}));return e.sort((a,s)=>(s.timestamp||"").localeCompare(a.timestamp||"")),e}async function ol(t){const e=await xi(ye(lt,_i,t));return e.exists()?e.data().value:null}async function ll(t,e){await As(ye(lt,_i,t),{key:t,value:e})}async function cl(){const t=await gn(),e=await Si(),a=await mn();return{version:1,exportTimestamp:new Date().toISOString(),layers:t,auditLog:e,metrics:a}}async function dl(t){if(!t||t.version!==1)throw new Error("Invalid backup format");const e=await ne(Rt(lt,St));for(const a of e.docs)await wi(a.id),await dn(a.ref);for(const a of t.layers||[])await Mi(a);return{layersImported:(t.layers||[]).length}}async function hl(){let t;try{t=await rr(Rt(lt,St))}catch(a){throw new Error(`Local cache unavailable: ${a.message}`)}if(t.empty)return[];const e=[];for(const a of t.docs){const s=a.data();if(s.metadata)try{const i=await rr(Rt(lt,St,a.id,ks));if(i.empty)continue;const r=i.docs.map(l=>({idx:parseInt(l.id,10),data:l.data().d})).sort((l,c)=>l.idx-c.idx);let o="";for(const l of r)o+=l.data,l.data=null;const n=JSON.parse(o);o=null,e.push({id:a.id,metadata:s.metadata,geojson:n})}catch(i){console.warn(`Cache recovery: skipping layer ${a.id} — ${i.message}`)}}return e}async function ul(t){if(!t||t.version!==1)throw new Error("Invalid backup format");let e=0,a=0;const s=await ne(Rt(lt,St)),i=new Set(s.docs.map(l=>l.id));for(const l of t.layers||[])l.id&&(i.has(l.id)?a++:e++,await Mi(l));const r=await Si(),o=new Set(r.map(l=>`${l.timestamp}|${l.action}|${l.layer_id||""}`));let n=0;for(const l of t.auditLog||[]){const c=`${l.timestamp}|${l.action}|${l.layer_id||""}`;if(o.has(c)){n++;continue}await vn(l),o.add(c)}return{added:e,updated:a,skippedAudit:n}}function pl(t){return un(Rt(lt,St),e=>{const a={added:[],modified:[],removed:[]};e.docChanges().forEach(s=>{s.type==="added"&&a.added.push(s.doc.id),s.type==="modified"&&a.modified.push(s.doc.id),s.type==="removed"&&a.removed.push(s.doc.id)}),t(a)})}function fl(t){return un(Rt(lt,_i),e=>{const a={};e.docs.forEach(s=>{a[s.id]=s.data().value}),t(a)})}const gl=Object.freeze(Object.defineProperty({__proto__:null,addAuditEntry:vn,countLayers:sl,deleteLayer:nl,exportBackup:cl,getAuditLog:Si,getLayer:il,getMetrics:mn,getSetting:ol,importBackup:dl,listLayers:gn,listLayersMeta:al,onLayersChanged:pl,onSettingsChanged:fl,recoverFromLocalCache:hl,saveLayer:Mi,saveLayerMetadata:rl,setSetting:ll,syncImport:ul},Symbol.toStringTag,{value:"Module"})),{listLayers:ml,listLayersMeta:vl,countLayers:yl,getLayer:Aa,saveLayer:aa,saveLayerMetadata:yn,deleteLayer:Ra,addAuditEntry:se,getAuditLog:dr,getSetting:ke,setSetting:Nt,exportBackup:bl,importBackup:xl,syncImport:_l,onLayersChanged:wl,onSettingsChanged:Ml,recoverFromLocalCache:Sl}=gl,ct={basePath:"./",apiBaseUrl:"",storageBackend:"firestore",authProvider:"local-passphrase",tileSources:{osm:{name:"OpenStreetMap",url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19},esriSatellite:{name:"Esri Satellite",url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",attribution:"&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",maxZoom:18},cartoLight:{name:"CartoDB Light",url:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",attribution:'&copy; <a href="https://carto.com/">CARTO</a>',maxZoom:19}},maxUploadSizeMB:1024,maxFeaturesPerLayer:5e4,sliverThresholdM2:5,simplifyTolerance:1e-4,nationalBaselines:{terrestrial_ha:1219e3,marine_ha:663e5},mapCenter:[-16.5,168],mapZoom:7},Y={EEZ:{label:"Exclusive Economic Zone",defaultRealm:"marine",color:"#FF0000"},ADMIN_BOUNDARY:{label:"National Boundary (Admin0)",defaultRealm:"terrestrial",color:"#37474F"},CCA:{label:"Community Conserved Area",defaultRealm:"terrestrial",color:"#2E7D32"},MPA:{label:"Marine Protected Area",defaultRealm:"marine",color:"#1565C0"},PA:{label:"Protected Area",defaultRealm:"terrestrial",color:"#1B5E20"},OECM:{label:"Other Effective Conservation Measure",defaultRealm:"terrestrial",color:"#7E57C2"},KBA:{label:"Key Biodiversity Area",defaultRealm:"terrestrial",color:"#EF6C00"},LMMA:{label:"Locally Managed Marine Area",defaultRealm:"marine",color:"#00796B"},INLAND_WATER:{label:"Inland Water",defaultRealm:"terrestrial",color:"#4FC3F7"},SPATIAL_PLAN:{label:"Biodiversity Spatial Plan",defaultRealm:"terrestrial",color:"#78909C"},DEGRADED:{label:"Degraded Area",defaultRealm:"terrestrial",color:"#D84315"},RESTORATION:{label:"Restoration Site",defaultRealm:"terrestrial",color:"#F9A825"},SPECIES_DIST:{label:"Species Distribution",defaultRealm:"terrestrial",color:"#26A69A"},MEGAPODE:{label:"Vanuatu Megapode",defaultRealm:"terrestrial",color:"#E65100"},STARLING:{label:"Mountain Starling",defaultRealm:"terrestrial",color:"#5C6BC0"},FANTAIL:{label:"Streaked Fantail",defaultRealm:"terrestrial",color:"#FFB300"},KINGFISHER:{label:"Vanuatu Kingfisher",defaultRealm:"terrestrial",color:"#00ACC1"},FLYING_FOX:{label:"Vanuatu Flying Fox",defaultRealm:"terrestrial",color:"#6D4C41"},PLERANDRA:{label:"Plerandra vanuatuensis",defaultRealm:"terrestrial",color:"#66BB6A"},INVASIVE:{label:"Invasive Alien Species",defaultRealm:"terrestrial",color:"#C62828"},MERREMIA:{label:"Merremia peltata (Big Leaf)",defaultRealm:"terrestrial",color:"#BF360C"},CROWN_OF_THORNS:{label:"Crown of Thorns Starfish",defaultRealm:"marine",color:"#FF6F00"},MILE_A_MINUTE:{label:"Mile a Minute Vine",defaultRealm:"terrestrial",color:"#AD1457"},SOLANUM_TORVUM:{label:"Solanum torvum (Devil Fig)",defaultRealm:"terrestrial",color:"#6A1B9A"},PESTICIDE:{label:"Pesticide / Herbicide Area",defaultRealm:"terrestrial",color:"#8E24AA"},EUTROPHICATION:{label:"Coastal Eutrophication Zone",defaultRealm:"marine",color:"#D81B60"},LAND_COVER:{label:"Land Cover / Land Use",defaultRealm:"terrestrial",color:"#795548"},GREEN_SPACE:{label:"Blue & Green Space",defaultRealm:"terrestrial",color:"#388E3C"},OTHER:{label:"Other",defaultRealm:"terrestrial",color:"#78909C"}},hr=Object.keys(Y);function Pe(t,e){if(t.realm)return t.realm;if(e.realm&&e.realm!=="terrestrial")return e.realm;const a=e.category?Y[e.category]:null;return a&&a.defaultRealm?a.defaultRealm:e.realm||"terrestrial"}const Ps=new Set(["Torba","Sanma","Penama","Malampa","Shefa","Tafea"]);let Ei=0;const Ht=new Map;function Vt(){Ei++,Ht.clear()}function El(){return Ei}function Ga(t,e,a){return`${Ei}:${t}:${e||""}:${JSON.stringify(a||{})}`}const as=100,Ai=500;function pt(t){if(!t||!t.geometry||!t.geometry.type.includes("Polygon"))return 0;try{return ds(t)/1e4}catch{return 0}}function ki(t){return{type:"FeatureCollection",features:(t.features||[]).map(e=>({...e,properties:{...e.properties,area_ha:Math.round(pt(e)*100)/100}}))}}function ht(t){const e=t.filter(a=>a&&a.geometry&&(a.geometry.type==="Polygon"||a.geometry.type==="MultiPolygon"));return e.length===0?null:e.length===1?e[0]:e.length>Ai?null:e.length>as?bn(e):ti(e)}function ti(t){try{const a=nr(t),s=or(a);if(s)return s}catch{}let e=null;for(const a of t){if(!e){e=a;continue}try{const s=or(nr([e,a]));s&&(e=s)}catch{}}return e}function bn(t){const e=[];for(let s=0;s<t.length;s+=as)e.push(t.slice(s,s+as));const a=e.map(s=>ti(s)).filter(Boolean);return a.length===0?null:a.length===1?a[0]:a.length>as?bn(a):ti(a)}function Je(t,e={}){var b;const a=Ga("30x30",null,e),s=Ht.get(a);if(s)return s;const i=ct.nationalBaselines,r=[],o=[];let n=0,l=0,c=0;const h={};for(const x of t){const w=x.metadata;if(w.isReference||!w.countsToward30x30||!w.targets||!w.targets.includes("T3"))continue;const E=(((b=x.geojson)==null?void 0:b.features)||[]).filter(P=>!(e.province&&e.province!=="All"&&P.properties.province!==e.province));for(const P of E){const $=P.properties.area_ha||0,S=Pe(P.properties,w);S==="marine"?(o.push(P),l+=$):(r.push(P),n+=$),c++;const A=P.properties.province||"Unassigned";h[A]||(h[A]={terrestrial:[],marine:[]}),S==="marine"?h[A].marine.push(P):h[A].terrestrial.push(P)}}const u=c>Ai,d=ht(r),p=ht(o),f=d?pt(d):n,m=p?pt(p):l,g=i.terrestrial_ha>0?f/i.terrestrial_ha*100:0,v=i.marine_ha>0?m/i.marine_ha*100:0,y=Object.entries(h).filter(([x])=>Ps.has(x)).map(([x,w])=>{let E,P;if(u)E=w.terrestrial.reduce(($,S)=>$+(S.properties.area_ha||0),0),P=w.marine.reduce(($,S)=>$+(S.properties.area_ha||0),0);else{const $=ht(w.terrestrial),S=ht(w.marine);E=$?pt($):0,P=S?pt(S):0}return{province:x,terrestrial_ha:V(E),marine_ha:V(P),total_ha:V(E+P),features:w.terrestrial.length+w.marine.length}}).sort((x,w)=>w.total_ha-x.total_ha),_={terrestrial_ha:V(f),marine_ha:V(m),terrestrial_pct:ie(g),marine_pct:ie(v),terrestrial_remaining_pct:ie(Math.max(0,30-g)),marine_remaining_pct:ie(Math.max(0,30-v)),gross_terrestrial_ha:V(n),gross_marine_ha:V(l),total_features:c,provinceBreakdown:y,baselines:i,dissolvedTerrestrial:d,dissolvedMarine:p};return Ht.set(a,_),_}const ur=new Set(["CCA","INLAND_WATER"]);function Cs(t,e={}){var S,A;const a=Ga("t1",null,e),s=Ht.get(a);if(s)return s;const i=ct.nationalBaselines;let r=0,o=0;for(const M of t){const k=M.metadata;if(!k.isReference)continue;const C=((S=M.geojson)==null?void 0:S.features)||[];if(k.category==="EEZ")for(const G of C)r+=G.properties.area_ha||pt(G);else if(k.category==="ADMIN_BOUNDARY")for(const G of C)o+=G.properties.area_ha||pt(G)}r===0&&(r=i.marine_ha),o===0&&(o=i.terrestrial_ha);const n=Math.max(0,r-o),l=r>0?n/r*100:0,c=[];let h=0,u=0,d=0;const p={},f={},m={},g={};for(const M of t){const k=M.metadata;if(k.isReference||!ur.has(k.category))continue;const C=k.targets&&k.targets.includes("T1"),G=ur.has(k.category);if(!C&&!G||e.category&&e.category!=="All"&&k.category!==e.category)continue;d++;const T=k.category||"OTHER",I=(((A=M.geojson)==null?void 0:A.features)||[]).filter(N=>!(e.province&&e.province!=="All"&&N.properties.province!==e.province));for(const N of I){const O=N.properties.area_ha||0;u++,c.push(N),h+=O;const F=N.properties.province||"Unassigned";p[F]||(p[F]={terrestrial:0,tCount:0}),p[F].terrestrial+=O,p[F].tCount++,f[F]||(f[F]=[]),f[F].push(N),m[T]||(m[T]={area:0,count:0}),m[T].area+=O,m[T].count++,g[T]||(g[T]=[]),g[T].push(N)}}const v=ht(c),y=v?pt(v):h,_=i.terrestrial_ha>0?y/i.terrestrial_ha*100:0,b=Object.entries(p).filter(([M])=>Ps.has(M)).map(([M,k])=>{const C=f[M],G=C?ht(C):null,T=G?pt(G):k.terrestrial;return{province:M,terrestrial_ha:V(T),marine_ha:V(n),total_ha:V(T+n),features:k.tCount}}).sort((M,k)=>k.total_ha-M.total_ha),x=Object.entries(m).map(([M,k])=>{const C=ht(g[M]||[]),G=C?pt(C):k.area;return{category:M,area_ha:V(G),gross_area_ha:V(k.area),features:k.count}}).sort((M,k)=>k.area_ha-M.area_ha),w=i.terrestrial_ha+r,E=y+n,P=w>0?E/w*100:0,$={targetCode:"T1",terrestrial_ha:V(y),terrestrial_pct:ie(_),gross_terrestrial_ha:V(h),marine_ha:V(n),marine_pct:ie(l),eez_ha:V(r),boundary_ha:V(o),total_covered_ha:V(E),total_area_ha:V(w),total_pct:ie(P),totalFeatures:u,layerCount:d,provinceBreakdown:b,categoryBreakdown:x,baselines:i,dissolvedTerrestrial:v};return Ht.set(a,$),$}const Al=new Set(["DEGRADED"]),kl=new Set(["RESTORATION"]);function Pi(t,e={}){var S;const a=Ga("t2",null,e),s=Ht.get(a);if(s)return s;const i=[],r=[];let o=0,n=0,l=0,c=0;const h={},u={},d={},p={};let f=0,m=0,g=0,v=0;for(const A of t){const M=A.metadata;if(M.isReference||!M.targets||!M.targets.includes("T2")||e.category&&e.category!=="All"&&M.category!==e.category)continue;const k=Pe({},M);if(e.realm&&e.realm!=="All"&&k!==e.realm)continue;c++;const C=M.category||"OTHER",G=Al.has(C),T=kl.has(C),I=(((S=A.geojson)==null?void 0:S.features)||[]).filter(N=>!(e.province&&e.province!=="All"&&N.properties.province!==e.province));for(const N of I){const O=N.properties.area_ha||0,F=Pe(N.properties,M);l++,G?(i.push(N),o+=O,F==="marine"?m+=O:f+=O):T&&(r.push(N),n+=O,F==="marine"?v+=O:g+=O);const U=N.properties.province||"Unassigned";h[U]||(h[U]={degraded:0,restoration:0,count:0}),G&&(h[U].degraded+=O),T&&(h[U].restoration+=O),h[U].count++,u[U]||(u[U]={degraded:[],restoration:[]}),G&&u[U].degraded.push(N),T&&u[U].restoration.push(N),d[C]||(d[C]={area:0,count:0}),d[C].area+=O,d[C].count++,p[C]||(p[C]=[]),p[C].push(N)}}const y=ht(i),_=ht(r),b=y?pt(y):o,x=_?pt(_):n,w=b>0?x/b*100:0,E=Object.entries(h).filter(([A])=>Ps.has(A)).map(([A,M])=>{const k=u[A],C=k?ht(k.degraded):null,G=k?ht(k.restoration):null,T=C?pt(C):M.degraded,I=G?pt(G):M.restoration;return{province:A,degraded_ha:V(T),restoration_ha:V(I),terrestrial_ha:V(T+I),total_ha:V(T+I),features:M.count,restoration_pct:T>0?ie(I/T*100):0}}).sort((A,M)=>M.total_ha-A.total_ha),P=Object.entries(d).map(([A,M])=>{const k=ht(p[A]||[]),C=k?pt(k):M.area;return{category:A,area_ha:V(C),gross_area_ha:V(M.area),features:M.count}}).sort((A,M)=>M.area_ha-A.area_ha),$={targetCode:"T2",degraded_ha:V(b),gross_degraded_ha:V(o),degraded_features:i.length,restoration_ha:V(x),gross_restoration_ha:V(n),restoration_features:r.length,restoration_pct:ie(w),realmTotals:{degraded_terrestrial_ha:V(f),degraded_marine_ha:V(m),restoration_terrestrial_ha:V(g),restoration_marine_ha:V(v)},totalFeatures:l,layerCount:c,provinceBreakdown:E,categoryBreakdown:P,dissolvedDegraded:y,dissolvedRestoration:_};return Ht.set(a,$),$}function Ci(t,e={}){var d;const a=Ga("general",null,e),s=Ht.get(a);if(s)return s;let i=0,r=0;const o=[],n={},l={terrestrial:0,marine:0};for(const p of t){const f=p.metadata;if(f.isReference||e.targets&&e.targets.length>0&&!f.targets.some(g=>e.targets.includes(g)))continue;const m=(((d=p.geojson)==null?void 0:d.features)||[]).filter(g=>!(e.province&&e.province!=="All"&&g.properties.province!==e.province));for(const g of m){i++,r+=g.properties.area_ha||0,o.push(g);const v=f.category||"OTHER";n[v]=(n[v]||0)+1;const y=Pe(g.properties,f);l[y]=(l[y]||0)+1}}const c=ht(o),h=c?pt(c):r,u={totalFeatures:i,totalAreaHa:V(h),grossAreaHa:V(r),categoryCounts:n,realmCounts:l};return Ht.set(a,u),u}function fe(t,e,a={}){var k,C,G;const s=Ga("target",e,a),i=Ht.get(s);if(i)return i;let r=0,o=0,n=0;const l={},c={},h={},u={},d={};let p=0,f=0,m=0;for(const T of t){const I=T.metadata;if(I.isReference||!I.targets||!I.targets.includes(e)||a.category&&a.category!=="All"&&I.category!==a.category)continue;const N=Pe({},I);a.realm&&a.realm!=="All"&&N!==a.realm||(m+=((C=(k=T.geojson)==null?void 0:k.features)==null?void 0:C.length)||0)}const g=m>Ai,v=g?null:[],y=g?null:{terrestrial:[],marine:[]};for(const T of t){const I=T.metadata;if(I.isReference||!I.targets||!I.targets.includes(e)||a.category&&a.category!=="All"&&I.category!==a.category||a.realm&&a.realm!=="All"&&Pe({},I)!==a.realm)continue;n++;const N=I.category||"OTHER",O=(((G=T.geojson)==null?void 0:G.features)||[]).filter(F=>{if(a.province&&a.province!=="All"&&F.properties.province!==a.province)return!1;if(a.year&&a.year!=="All"){const U=F.properties.year||I.year;if(U&&String(U)!==String(a.year))return!1}return!0});for(const F of O){const U=F.properties.area_ha||0,st=Pe(F.properties,I);r++,o+=U,st==="marine"?(f+=U,y&&y.marine.push(F)):(p+=U,y&&y.terrestrial.push(F)),v&&v.push(F);const K=F.properties.province||"Unassigned";l[K]||(l[K]={terrestrial:0,marine:0,tCount:0,mCount:0}),st==="marine"?(l[K].marine+=U,l[K].mCount++):(l[K].terrestrial+=U,l[K].tCount++),g||(c[K]||(c[K]={terrestrial:[],marine:[]}),st==="marine"?c[K].marine.push(F):c[K].terrestrial.push(F)),h[N]||(h[N]={area:0,count:0}),h[N].area+=U,h[N].count++,g||(u[N]||(u[N]=[]),u[N].push(F));const W=F.properties.type||F.properties.species_name||F.properties.name||I.name||"Unknown";d[W]||(d[W]={area_ha:0,features:0}),d[W].area_ha+=U,d[W].features++}}let _,b,x,w=null,E=null;if(g)_=o,b=p,x=f;else{const T=ht(v);_=T?pt(T):o,w=ht(y.terrestrial),E=ht(y.marine),b=w?pt(w):p,x=E?pt(E):f}const P=Object.entries(l).filter(([T])=>Ps.has(T)).map(([T,I])=>{let N,O;if(g)N=I.terrestrial,O=I.marine;else{const F=c[T],U=F?ht(F.terrestrial):null,st=F?ht(F.marine):null;N=U?pt(U):I.terrestrial,O=st?pt(st):I.marine}return{province:T,terrestrial_ha:V(N),marine_ha:V(O),total_ha:V(N+O),features:I.tCount+I.mCount}}).sort((T,I)=>I.total_ha-T.total_ha),$={},S=[];for(const[T,I]of Object.entries(h)){let N=null,O;g?O=I.area:(N=ht(u[T]||[]),O=N?pt(N):I.area),$[T]=N,S.push({category:T,area_ha:V(O),gross_area_ha:V(I.area),features:I.count})}S.sort((T,I)=>I.area_ha-T.area_ha);const A=Object.entries(d).map(([T,I])=>({type:T,...I})).sort((T,I)=>I.area_ha-T.area_ha),M={targetCode:e,totalFeatures:r,totalAreaHa:V(_),grossAreaHa:V(o),layerCount:n,realmTotals:{terrestrial_ha:V(b),marine_ha:V(x),gross_terrestrial_ha:V(p),gross_marine_ha:V(f)},provinceBreakdown:P,categoryBreakdown:S,typeBreakdown:A,dissolvedByCategory:$};return Ht.set(s,M),M}function V(t){return Math.round(t*100)/100}function ie(t){return Math.round(t*1e3)/1e3}const q={layers:[],provincesGeojson:null,provinces:[],filters:{targets:["T3"],province:"All",category:"All",realm:"All",year:"All"},isAdmin:!1,customLayerNames:{},layerTracker:{}};function H(){return q}function Wa(t){Object.assign(q.filters,t),Zt=null,Vt(),be()}function Ze(t){var a,s;const e=q.layers.findIndex(i=>i.id===t.id);if(e>=0)q.layers[e]=t;else{const i=(a=t.metadata)==null?void 0:a.originalFilename,r=(s=t.metadata)==null?void 0:s.category;i&&r&&(q.layers=q.layers.filter(o=>{var n,l;return((n=o.metadata)==null?void 0:n.originalFilename)===i&&((l=o.metadata)==null?void 0:l.category)===r?(console.warn(`Dedup on add: replacing "${o.metadata.name}" (${o.id}) with "${t.metadata.name}" (${t.id})`),!1):!0})),q.layers.push(t)}Zt=null,Ti(),Vt(),be()}function xn(t,e){const a=q.layers.find(s=>s.id===t);a&&(Object.assign(a.metadata,e),Zt=null,Vt(),be())}function $s(t){q.layers=q.layers.filter(e=>e.id!==t);for(const[e,a]of Object.entries(q.layerTracker)){const s=a.filter(i=>i.layerId!==t);s.length===0?delete q.layerTracker[e]:s.length!==a.length&&(q.layerTracker[e]=s)}va=null,Zt=null,Ti(),Vt(),be()}function pr(t){const{unique:e,removedIds:a}=Pl(t);return q.layers=e,Zt=null,Ti(),Vt(),be(),a}function Pl(t){var i,r;const e={},a=[],s=[];for(const o of t){const n=(i=o.metadata)==null?void 0:i.originalFilename,l=(r=o.metadata)==null?void 0:r.category;if(!n){a.push(o);continue}const c=`${n}::${l}`;e[c]||(e[c]=[]),e[c].push(o)}for(const o of Object.values(e))if(o.length===1)a.push(o[0]);else{o.sort((n,l)=>new Date(l.metadata.uploadTimestamp)-new Date(n.metadata.uploadTimestamp)),a.push(o[0]);for(let n=1;n<o.length;n++)s.push(o[n].id);console.warn(`Dedup: kept latest "${o[0].metadata.originalFilename}" (${o[0].metadata.category}), removed ${o.length-1} older duplicate(s)`)}return{unique:a,removedIds:s}}function Cl(t,e){return t&&q.layers.find(a=>{var s,i;return((s=a.metadata)==null?void 0:s.originalFilename)===t&&((i=a.metadata)==null?void 0:i.category)===e})||null}function $l(t,e,a){const s=[],i=new Set;for(const r of q.layers){const o=r.metadata;o&&(t&&o.originalFilename===t&&o.category===a&&(i.has(r.id)||(s.push(r),i.add(r.id))),e&&o.name===e&&o.category===a&&(i.has(r.id)||(s.push(r),i.add(r.id))))}return s}function Tl(t){if(q.provincesGeojson=t,t&&t.features){const e=t.features.map(a=>a.properties.name||a.properties.province||a.properties.NAME||"").filter(Boolean).sort();q.provinces=[...new Set(e)]}}function _n(t){q.customLayerNames=t||{}}function Ll(t,e){q.customLayerNames[t]=e}function re(t){return q.customLayerNames[t.id]||t.name}function $i(t){q.isAdmin=t,be()}function Ts(t){if(!t){q.layerTracker={},ka();return}const e={};for(const[a,s]of Object.entries(t))Array.isArray(s)?e[a]=s:s&&s.layerId&&(e[a]=[s]);q.layerTracker=e,ka()}function Il(t,e){q.layerTracker[t]||(q.layerTracker[t]=[]),q.layerTracker[t].find(s=>s.layerId===e)||q.layerTracker[t].push({layerId:e,uploadedAt:new Date().toISOString()}),ka(),be()}function fr(t,e=null){q.layerTracker[t]&&(e===null?delete q.layerTracker[t]:(q.layerTracker[t]=q.layerTracker[t].filter(a=>a.layerId!==e),q.layerTracker[t].length===0&&delete q.layerTracker[t]),ka(),be())}function Nl(){const t=new Set(q.layers.map(a=>a.id));let e=!1;for(const[a,s]of Object.entries(q.layerTracker)){const i=s.filter(r=>t.has(r.layerId));i.length!==s.length&&(e=!0,i.length===0?delete q.layerTracker[a]:q.layerTracker[a]=i)}return e&&ka(),e}let va=null;function wn(){if(va)return va;const t=new Set;for(const e of Object.values(q.layerTracker))for(const a of e)t.add(a.layerId);return va=t,t}function ka(){va=null,Zt=null,Vt()}function Rl(){const t=wn();return q.layers.filter(e=>t.has(e.id))}function Gl(){return wn().size>0}let Zt=null;function Gt(){if(Zt)return Zt;let t;if(Gl()){const e=Rl();if(e.length>0)t=e;else{const a=q.layers.filter(s=>!gr(s));t=a.length>0?a:q.layers}}else{const e=q.layers.filter(a=>!gr(a));t=e.length>0?e:q.layers}return Zt=t,t}const Bl=new Set(["demo_cca.geojson","demo_mpa.geojson","vut_invasive_merremia_efate_2026_v1.geojson"]);function gr(t){const e=t.metadata;return e?!!(e._isDemo||e.uploadedBy==="system"||Bl.has(e.originalFilename)):!1}const la=new Set(["Torba","Sanma","Penama","Malampa","Shefa","Tafea"]);let hs=!0;const le=new Set;function Ti(){hs=!0,Mn()}function Mn(){var e;if(!hs)return;hs=!1,le.clear();for(const a of q.provinces||[])la.has(a)&&le.add(a);if(le.size>=la.size){q.provinces=[...le].sort();return}const t=500;for(const a of q.layers){if(!a.geojson)continue;const s=a.geojson.features||[],i=Math.min(s.length,t);for(let r=0;r<i;r++){const o=(e=s[r].properties)==null?void 0:e.province;if(o&&la.has(o)&&(le.add(o),le.size>=la.size))break}if(le.size>=la.size)break}q.provinces=[...le].sort()}const Os=new Set,Sn=new Set(["ADMIN_BOUNDARY","EEZ","SPATIAL_PLAN"]);async function sa(t){if(!t||t.length===0)return!1;const e=t.includes("T1"),a=q.layers.filter(r=>{if(r.geojson!==null||Os.has(r.id))return!1;const o=r.metadata;return o?!!(o.targets&&o.targets.some(n=>t.includes(n))||e&&Sn.has(o.category)):!1});if(a.length===0)return!1;for(const r of a)Os.add(r.id);const i=(await Promise.allSettled(a.map(async r=>{try{const o=await Aa(r.id);if(o&&o.geojson){const n=q.layers.findIndex(l=>l.id===r.id);return n>=0&&(q.layers[n]={...q.layers[n],geojson:o.geojson}),!0}return!1}finally{Os.delete(r.id)}}))).some(r=>r.status==="fulfilled"&&r.value===!0);return i&&(hs=!0,Mn(),Vt(),Zt=null),i}function En(t){if(!t||t.length===0)return!1;const e=t.includes("T1");return q.layers.some(a=>{if(a.geojson!==null)return!1;const s=a.metadata;return s?!!(s.targets&&s.targets.some(i=>t.includes(i))||e&&Sn.has(s.category)):!1})}function be(){window.dispatchEvent(new CustomEvent("nbsap:refresh"))}const Dl="fcc1682b158fe80d089f1627dd31cf5fa6bf2162058ac3e688d24fe03cc538f8",Li="nbsap_admin_session";let Ba=sessionStorage.getItem(Li)==="1",Ii=Ba?"admin":null;const Fl=5,Ol=15*60*1e3;let Ka=0,Ya=0;async function zl(t){const a=new TextEncoder().encode(t),s=await crypto.subtle.digest("SHA-256",a);return Array.from(new Uint8Array(s)).map(i=>i.toString(16).padStart(2,"0")).join("")}function jl(){return localStorage.getItem("nbsap_admin_hash")||Dl}async function ql(t){if(!t)return{success:!1,error:"Passphrase required"};const e=Date.now();if(e<Ya){const i=Math.ceil((Ya-e)/6e4);return{success:!1,error:`Too many attempts. Try again in ${i} minute${i!==1?"s":""}.`}}const a=await zl(t),s=jl();return a===s?(Ka=0,Ya=0,Ba=!0,Ii="admin",sessionStorage.setItem(Li,"1"),{success:!0}):(Ka+=1,Ka>=Fl?(Ya=Date.now()+Ol,Ka=0,{success:!1,error:"Too many failed attempts. Locked out for 15 minutes."}):{success:!1,error:"Invalid passphrase"})}function Hl(){Ba=!1,Ii=null,sessionStorage.removeItem(Li)}function Ul(){return{isAuthenticated:Ba,user:Ii,provider:"local-passphrase"}}function Vl(){return Ba}const Wl=Object.freeze(Object.defineProperty({__proto__:null,getAuthState:Ul,isAdmin:Vl,login:ql,logout:Hl},Symbol.toStringTag,{value:"Module"})),{login:Kl,logout:Yl,getAuthState:Jl,isAdmin:Ct}=Wl,Ut={targets:[{code:"T1",name:"Target 1: Biodiversity Spatial Planning",icon:"🗺",color:"#1565C0",description:"Participatory spatial planning across all land and sea areas to reduce biodiversity loss from land and sea-use change. Tracks % of land and sea area covered by biodiversity-inclusive spatial plans. Terrestrial = (CCA + Inland Water) / land area. Marine = (EEZ − National Boundary) / EEZ.",isMetricTarget:!0,recommendedCategories:["CCA","INLAND_WATER"]},{code:"T2",name:"Target 2: Ecosystem Restoration",icon:"🌿",color:"#D84315",description:"Restore at least 30% of degraded terrestrial, inland water, marine and coastal ecosystems by 2030. Maps degraded areas and active restoration sites to track Vanuatu's restoration progress toward the global 30% goal.",isMetricTarget:!0,recommendedCategories:["DEGRADED","RESTORATION"]},{code:"T3",name:"Target 3: 30×30 Conservation",icon:"🌏",color:"#2E7D32",description:"Conserve and effectively manage at least 30% of terrestrial, inland water, and marine areas by 2030 through protected areas and other effective area-based conservation measures (CCAs, MPAs, LMMAs, Custom Forest Tabu Areas, OECMs).",isMetricTarget:!0,recommendedCategories:["CCA","MPA","PA","OECM","LMMA"]},{code:"T4",name:"Target 4: Species Recovery & Biodiversity",icon:"🦜",color:"#7E57C2",description:"Halt human-induced species extinction and support recovery of threatened species while maintaining genetic diversity. Maps distribution of significant Vanuatu species (Megapode, Mountain Starling, Streaked Fantail, Kingfisher, Flying Fox, Plerandra vanuatuensis) and Key Biodiversity Areas.",isMetricTarget:!0,recommendedCategories:["MEGAPODE","STARLING","FANTAIL","KINGFISHER","FLYING_FOX","PLERANDRA","KBA","SPECIES_DIST"]},{code:"T6",name:"Target 6: Invasive Alien Species",icon:"🪲",color:"#C62828",description:"Reduce invasive alien species introductions by at least 50% and minimize their ecological impacts. Spatial analysis of key IAS coverage and distribution — Merremia peltata (Big Leaf), Crown-of-Thorns Starfish, Mile-a-Minute Vine, Solanum torvum (Devil Fig), Fire Ants, African Snail, Sako, Coconut Beetle.",isMetricTarget:!0,recommendedCategories:["MERREMIA","CROWN_OF_THORNS","MILE_A_MINUTE","SOLANUM_TORVUM","INVASIVE"]},{code:"T7",name:"Target 7: Pollution Reduction",icon:"⚗",color:"#8E24AA",description:"Reduce pollution from all sources to levels not harmful to biodiversity, including halving nutrient and pesticide risks. Maps areas of pesticide and herbicide use in large-scale and small-scale commercial farming across Vanuatu.",isMetricTarget:!0,recommendedCategories:["PESTICIDE"]},{code:"T8",name:"Target 8: Climate & Ocean Impacts",icon:"🌊",color:"#00838F",description:"Minimize climate change and ocean acidification impacts on biodiversity through mitigation and nature-based solutions. Maps coastal eutrophication and nutrient-impacted marine zones around Vanuatu's islands as indicators of cumulative environmental pressures.",isMetricTarget:!0,recommendedCategories:["EUTROPHICATION"]},{code:"T10",name:"Target 10: Sustainable Land Use",icon:"🌾",color:"#795548",description:"Ensure sustainable biodiversity-compatible management across agriculture, aquaculture, fisheries and forestry. Maps land cover change to track ecosystem conversion and support integration of biodiversity practices across productive sectors.",isMetricTarget:!0,recommendedCategories:["LAND_COVER"]},{code:"T12",name:"Target 12: Urban Green & Blue Spaces",icon:"🌳",color:"#388E3C",description:"Increase and enhance green and blue spaces in urban and peri-urban areas to improve biodiversity, ecological connectivity, and human well-being. Maps parks, botanical gardens and coastal blue spaces across provincial and municipal areas.",isMetricTarget:!0,recommendedCategories:["GREEN_SPACE"]}]};/**
 * SVG Icons for the Vanuatu NBSAP Portal.
 *
 * All icons sourced from Lucide (https://lucide.dev) — ISC License.
 * @license lucide-static v0.575.0 - ISC
 *
 * Each icon is a function returning an inline SVG string at a given size.
 * Default size 16px; stroke inherits currentColor for easy theming.
 */const Zl='xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';function Xl(t,e){return`<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${Zl}>${e}</svg>`}const An={anchor:'<path d="M12 6v16"/><path d="m19 13 2-1a9 9 0 0 1-18 0l2 1"/><path d="M9 11h6"/><circle cx="12" cy="4" r="2"/>',landmark:'<path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',waves:'<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',shieldCheck:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',fish:'<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"/>',map:'<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',triangleAlert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',sprout:'<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/>',bird:'<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>',leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',wind:'<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',flaskConical:'<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',droplets:'<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',layers:'<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',trees:'<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',bug:'<path d="M12 20v-9"/><path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z"/><path d="M14.12 3.88 16 2"/><path d="M21 21a4 4 0 0 0-3.81-4"/><path d="M21 5a4 4 0 0 1-3.55 3.97"/><path d="M22 13h-4"/><path d="M3 21a4 4 0 0 1 3.81-4"/><path d="M3 5a4 4 0 0 0 3.55 3.97"/><path d="M6 13H2"/><path d="m8 2 1.88 1.88"/><path d="M9 7.13V6a3 3 0 1 1 6 0v1.13"/>',wheat:'<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/>',circle:'<circle cx="12" cy="12" r="10"/>'};An.bat='<path d="M12 4c-1 2-4 4-8 5 1 3 3 5 5 6l-2 3h10l-2-3c2-1 4-3 5-6-4-1-7-3-8-5z"/><circle cx="10" cy="9" r="1"/><circle cx="14" cy="9" r="1"/>';function kn(t,e=16){const a=An[t];return a?Xl(e,a):""}const Ql={EEZ:"anchor",ADMIN_BOUNDARY:"landmark",CCA:"users",MPA:"waves",PA:"shield",OECM:"shieldCheck",KBA:"star",LMMA:"fish",SPATIAL_PLAN:"map",DEGRADED:"triangleAlert",RESTORATION:"sprout",SPECIES_DIST:"search",MEGAPODE:"bird",STARLING:"bird",FANTAIL:"bird",KINGFISHER:"bird",FLYING_FOX:"bat",PLERANDRA:"leaf",INVASIVE:"ban",MERREMIA:"leaf",CROWN_OF_THORNS:"star",MILE_A_MINUTE:"wind",SOLANUM_TORVUM:"sprout",PESTICIDE:"flaskConical",EUTROPHICATION:"droplets",LAND_COVER:"layers",GREEN_SPACE:"trees",OTHER:"circle"},tc={T1:"map",T2:"sprout",T3:"globe",T4:"bird",T6:"bug",T7:"flaskConical",T8:"waves",T10:"wheat",T12:"trees"};function ia(t,e=16){return kn(Ql[t]||"circle",e)}function Ni(t,e=16){return kn(tc[t]||"circle",e)}function ec(t){const e=H(),a=e.provinces||[],s=ac();t.innerHTML=`
    <div class="filter-panel">
      <div class="filter-panel-header">
        <span>Filters</span>
        <button class="btn btn-sm btn-outline" id="btn-clear-filters">Clear</button>
      </div>

      <div class="filter-group">
        <label>NBSAP Target</label>
        <div class="target-checkboxes" id="target-filter-checkboxes">
          ${Ut.targets.map(i=>{const r=e.filters.targets.includes(i.code),o=r?`background:${i.color};border-color:${i.color};color:#fff`:"",n=s[i.code],l=n!=null?`${n.toFixed(1)}%`:"—",c=r?"rgba(255,255,255,0.4)":i.color,h=n!=null?Math.min(n,100):0;return`
            <label class="target-checkbox ${r?"selected":""}"
                   data-code="${i.code}" title="${i.description}"
                   style="${o}">
              <input type="radio" name="nbsap-target" value="${i.code}" ${r?"checked":""}>
              <span class="target-pill-icon">${Ni(i.code,14)}</span>
              <span class="target-pill-label">${i.code}</span>
              <span class="target-pill-pct">${l}</span>
              <span class="target-pill-bar" style="width:${h}%;background:${c}"></span>
            </label>`}).join("")}
        </div>
      </div>

      <div class="filter-group">
        <label>Province</label>
        <select id="filter-province">
          <option value="All">All Provinces</option>
          ${a.map(i=>`
            <option value="${i}" ${e.filters.province===i?"selected":""}>${i}</option>
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

    </div>
  `,t.querySelectorAll(".target-checkbox").forEach(i=>{i.addEventListener("click",r=>{r.preventDefault();const o=i.dataset.code;Wa({targets:[o]})})}),t.querySelector("#filter-province").addEventListener("change",i=>{Wa({province:i.target.value})}),t.querySelector("#filter-realm").addEventListener("change",i=>{Wa({realm:i.target.value})}),t.querySelector("#btn-clear-filters").addEventListener("click",()=>{Wa({targets:["T3"],province:"All",category:"All",realm:"All",year:"All"})})}let zs=null,mr=-1,vr=-1;const ca={targets:[],province:"All",category:"All",realm:"All",year:"All"},yr=["MEGAPODE","STARLING","FANTAIL","KINGFISHER","FLYING_FOX","PLERANDRA"];function ac(){const t=Gt(),e=El();if(zs&&t.length===mr&&e===vr)return zs;mr=t.length,vr=e;const a=ct.nationalBaselines,s={};for(const i of Ut.targets){if(!t.some(o=>{var n,l;return(l=(n=o.metadata)==null?void 0:n.targets)==null?void 0:l.includes(i.code)})){s[i.code]=null;continue}try{if(i.code==="T3"){const o=Je(t,ca),n=a.terrestrial_ha+a.marine_ha;s.T3=n>0?(o.terrestrial_ha+o.marine_ha)/n*100:0}else if(i.code==="T1"){const o=Cs(t,ca);s.T1=o.total_pct||0}else if(i.code==="T2"){const o=Pi(t,ca);s.T2=o.restoration_pct||0}else if(i.code==="T4"){const o=fe(t,"T4",ca),n=yr.filter(l=>o.categoryBreakdown.some(c=>c.category===l&&c.features>0)).length;s.T4=n/yr.length*100}else{const o=fe(t,i.code,ca),n=6;s[i.code]=o.provinceBreakdown.length/n*100}}catch{s[i.code]=null}}return zs=s,s}const ei={EEZ:{fill:"#FF0000",stroke:"#CC0000"},ADMIN_BOUNDARY:{fill:"#37474F",stroke:"#263238"},CCA:{fill:"#2E7D32",stroke:"#1B5E20"},PA:{fill:"#1B5E20",stroke:"#0D3311"},OECM:{fill:"#7E57C2",stroke:"#5E35B1"},KBA:{fill:"#EF6C00",stroke:"#E65100"},MPA:{fill:"#1565C0",stroke:"#0D47A1"},LMMA:{fill:"#00796B",stroke:"#004D40"},INLAND_WATER:{fill:"#4FC3F7",stroke:"#0288D1"},SPATIAL_PLAN:{fill:"#78909C",stroke:"#546E7A"},DEGRADED:{fill:"#D84315",stroke:"#BF360C"},RESTORATION:{fill:"#F9A825",stroke:"#F57F17"},SPECIES_DIST:{fill:"#26A69A",stroke:"#00897B"},MEGAPODE:{fill:"#E65100",stroke:"#BF360C"},STARLING:{fill:"#5C6BC0",stroke:"#3949AB"},FANTAIL:{fill:"#FFB300",stroke:"#FF8F00"},KINGFISHER:{fill:"#00ACC1",stroke:"#00838F"},FLYING_FOX:{fill:"#6D4C41",stroke:"#4E342E"},PLERANDRA:{fill:"#66BB6A",stroke:"#43A047"},INVASIVE:{fill:"#C62828",stroke:"#B71C1C"},MERREMIA:{fill:"#BF360C",stroke:"#8D2409"},CROWN_OF_THORNS:{fill:"#FF6F00",stroke:"#E65100"},MILE_A_MINUTE:{fill:"#AD1457",stroke:"#880E4F"},SOLANUM_TORVUM:{fill:"#6A1B9A",stroke:"#4A148C"},PESTICIDE:{fill:"#8E24AA",stroke:"#6A1B9A"},EUTROPHICATION:{fill:"#D81B60",stroke:"#AD1457"},LAND_COVER:{fill:"#795548",stroke:"#5D4037"},GREEN_SPACE:{fill:"#388E3C",stroke:"#2E7D32"},OTHER:{fill:"#78909C",stroke:"#546E7A"}},br={Forest:{fill:"#1B5E20",stroke:"#0D3311"},"Dense Forest":{fill:"#1B5E20",stroke:"#0D3311"},"Sparse Forest":{fill:"#388E3C",stroke:"#2E7D32"},"Medium Forest":{fill:"#2E7D32",stroke:"#1B5E20"},"Thicket/Dense Shrub":{fill:"#558B2F",stroke:"#33691E"},Mangrove:{fill:"#004D40",stroke:"#00251A"},Agriculture:{fill:"#F9A825",stroke:"#F57F17"},Cropland:{fill:"#FFD54F",stroke:"#FFC107"},Plantation:{fill:"#827717",stroke:"#524A03"},Coconut:{fill:"#9E9D24",stroke:"#6D6B1E"},"Coconut Plantation":{fill:"#9E9D24",stroke:"#6D6B1E"},Agroforestry:{fill:"#8D6E63",stroke:"#6D4C41"},Grassland:{fill:"#AED581",stroke:"#8BC34A"},Shrub:{fill:"#7CB342",stroke:"#558B2F"},Savanna:{fill:"#C0CA33",stroke:"#9E9D24"},Urban:{fill:"#E53935",stroke:"#C62828"},"Built-up":{fill:"#E53935",stroke:"#C62828"},Settlement:{fill:"#EF5350",stroke:"#D32F2F"},Bare:{fill:"#A1887F",stroke:"#795548"},"Bare Ground":{fill:"#A1887F",stroke:"#795548"},Rock:{fill:"#8D6E63",stroke:"#5D4037"},Sand:{fill:"#FFE0B2",stroke:"#FFCC80"},Water:{fill:"#1565C0",stroke:"#0D47A1"},"Inland Water":{fill:"#1565C0",stroke:"#0D47A1"},Wetland:{fill:"#00838F",stroke:"#006064"},Swamp:{fill:"#00695C",stroke:"#004D40"},Coral:{fill:"#FF7043",stroke:"#E64A19"},Reef:{fill:"#FF7043",stroke:"#E64A19"},Lagoon:{fill:"#4FC3F7",stroke:"#0288D1"},Seagrass:{fill:"#26A69A",stroke:"#00897B"},Cloud:{fill:"#ECEFF1",stroke:"#CFD8DC"},Shadow:{fill:"#90A4AE",stroke:"#607D8B"},"No Data":{fill:"#BDBDBD",stroke:"#9E9E9E"}},xr=[{fill:"#1B5E20",stroke:"#0D3311"},{fill:"#F9A825",stroke:"#F57F17"},{fill:"#0277BD",stroke:"#01579B"},{fill:"#E53935",stroke:"#C62828"},{fill:"#6A1B9A",stroke:"#4A148C"},{fill:"#00838F",stroke:"#006064"},{fill:"#EF6C00",stroke:"#E65100"},{fill:"#558B2F",stroke:"#33691E"},{fill:"#AD1457",stroke:"#880E4F"},{fill:"#4527A0",stroke:"#311B92"},{fill:"#00695C",stroke:"#004D40"},{fill:"#9E9D24",stroke:"#6D6B1E"},{fill:"#C62828",stroke:"#B71C1C"},{fill:"#1565C0",stroke:"#0D47A1"},{fill:"#FF8F00",stroke:"#FF6F00"},{fill:"#2E7D32",stroke:"#1B5E20"},{fill:"#5C6BC0",stroke:"#3949AB"},{fill:"#D84315",stroke:"#BF360C"},{fill:"#00897B",stroke:"#00695C"},{fill:"#827717",stroke:"#524A03"}],js=new Map;function sc(t){if(js.has(t))return js.get(t);let e=0;for(let i=0;i<t.length;i++)e=(e<<5)-e+t.charCodeAt(i)|0;const a=Math.abs(e)%xr.length,s=xr[a];return js.set(t,s),s}const Pn={Designated:{fillOpacity:.35,dashArray:null,weight:2},Active:{fillOpacity:.35,dashArray:null,weight:2},Proposed:{fillOpacity:.18,dashArray:"6 4",weight:1.5},Inactive:{fillOpacity:.1,dashArray:"2 4",weight:1},Unknown:{fillOpacity:.28,dashArray:null,weight:1.5}},ic=Pn.Unknown,Ri=new Set(["MEGAPODE","STARLING","FANTAIL","KINGFISHER","FLYING_FOX","PLERANDRA","SPECIES_DIST"]);function mt(t,e){const a=t||"OTHER",s=ei[a]||ei.OTHER;if(a==="LAND_COVER"&&e){const i=br[e];if(i)return i;const r=e.toUpperCase();for(const[o,n]of Object.entries(br))if(r.includes(o.toUpperCase())||o.toUpperCase().includes(r))return n;return sc(e)}return s}function Cn(t,e){var a;return t==="LAND_COVER"?`LAND_COVER::${((a=e.properties)==null?void 0:a.type)||"Unknown"}`:t}function rc(t,e){const a=mt(t,e);return t==="EEZ"?{fillColor:a.fill,color:a.stroke,weight:2.5,fillOpacity:0,interactive:!1}:{fillColor:a.fill,color:a.stroke,weight:2.5,fillOpacity:.45,interactive:!1}}function nc(t,e){const a=t.properties||{},s=mt(e,a.type),i=Pn[a.status]||ic;return{fillColor:s.fill,color:s.stroke,weight:i.weight*.8,fillOpacity:0,dashArray:i.dashArray||"4 3"}}function $n(t,e){const a=mt(t,e);return t==="EEZ"?{fillColor:a.fill,color:a.stroke,weight:2.5,fillOpacity:0,dashArray:null}:{fillColor:a.fill,color:a.stroke,weight:2,fillOpacity:.15,dashArray:"8 4"}}function oc(t,e){const a=t.properties||{},s=mt(e,a.type);return{radius:Ri.has(e)?7:6,fillColor:s.fill,color:"#fff",weight:1.5,fillOpacity:.85}}function Tn(t){const e=mt(t);return{radius:Ri.has(t)?6:5,fillColor:e.fill,color:e.stroke,weight:1.5,fillOpacity:.3,dashArray:"3 3"}}function Ln(t,e){const a=mt(t,e);return{fillColor:a.fill,color:a.stroke,weight:2.5,fillOpacity:.5}}function In(t){const e=mt(t);return{radius:Ri.has(t)?6:5,fillColor:e.fill,color:"#fff",weight:1,fillOpacity:.85}}const Nn="#B0BEC5",Rn="#78909C";function ya(t){var a,s;const e=(((a=t.properties)==null?void 0:a.presence)||((s=t.properties)==null?void 0:s.type)||"").toLowerCase();return e.includes("extinct")||e.includes("possibly extinct")||e==="ex"}function lc(t){return{fillColor:Nn,color:Rn,weight:2,fillOpacity:.25,dashArray:"6 4"}}function cc(t){return{radius:6,fillColor:Nn,color:Rn,weight:1.5,fillOpacity:.5,dashArray:"4 3"}}function dc(t){var a,s;const e=new Map;for(const i of t){const r=i.metadata;if(!r)continue;const o=r.category||"OTHER",n=r.category?ei[o]?void 0:o:"Other";if(o==="LAND_COVER"&&((a=i.geojson)!=null&&a.features)){const l=new Set;for(const c of i.geojson.features)l.add(((s=c.properties)==null?void 0:s.type)||"Unknown");for(const c of l){const h=`LAND_COVER::${c}`;if(!e.has(h)){const u=mt("LAND_COVER",c);e.set(h,{label:c,fill:u.fill,stroke:u.stroke})}}}else if(!e.has(o)){const l=mt(o);e.set(o,{label:n,fill:l.fill,stroke:l.stroke})}}return[...e.entries()].map(([i,r])=>({key:i,label:r.label,fill:r.fill,stroke:r.stroke}))}const Gn={T1:{label:"Biodiversity Spatial Planning",color:"#1565C0",unit:"ha planned"},T2:{label:"Degraded Areas & Restoration",color:"#D84315",unit:"ha mapped"},T3:{label:"30x30 Conservation",color:"#2E7D32",unit:"ha conserved"},T4:{label:"Species & Biodiversity",color:"#7E57C2",unit:"species records"},T6:{label:"Invasive Alien Species",color:"#C62828",unit:"ha detected"},T7:{label:"Pesticide & Herbicide",color:"#8E24AA",unit:"ha mapped"},T8:{label:"Coastal Eutrophication",color:"#00838F",unit:"ha impacted"},T10:{label:"Land Cover Change",color:"#795548",unit:"ha mapped"},T12:{label:"Blue & Green Spaces",color:"#388E3C",unit:"ha mapped"}};function hc(t){const a=H().filters,s=Gt(),i=a.targets;if(i.length===1){const o=i[0];if(!s.some(l=>l.metadata.targets&&l.metadata.targets.includes(o))){xc(t,o);return}o==="T1"?uc(t,s,a):o==="T2"?pc(t,s,a):o==="T3"?_r(t,s,a):o==="T4"?fc(t,s,a):o==="T6"?gc(t,s,a):o==="T10"?mc(t,s,a):vc(t,s,a,o);return}i.length===0||i.includes("T3")?_r(t,s,a):yc(t,s,a)}function uc(t,e,a){const s=Cs(e,a),i=s.baselines,r=s.terrestrial_pct,o=Math.min(r,100),n=s.marine_pct,l=Math.min(n,100),c=s.total_pct,h=Math.min(c,100),u=s.categoryBreakdown.map(d=>{const p=Y[d.category]||{label:d.category,color:"#95a5a6"};return`<span class="cat-badge" style="background:${p.color}20;color:${p.color};border:1px solid ${p.color}40">
      ${ia(d.category,13)} ${p.label}: ${j(d.area_ha)} ha (${d.features})
    </span>`}).join("");t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${j(s.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
        <div class="kpi-sublabel">CCA + Inland Water (dissolved)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${j(s.marine_ha)}</div>
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
          (CCA + Inland Water) / ${j(i.terrestrial_ha)} ha total terrestrial = ${j(s.terrestrial_ha)} ha
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
          (EEZ ${j(s.eez_ha)} ha &minus; Boundary ${j(s.boundary_ha)} ha) / EEZ ${j(s.eez_ha)} ha
        </div>
      </div>

      <div class="kpi-card wide" style="background:var(--surface-alt, #f0fdf4);border:1px solid #bbf7d0">
        <div style="font-weight:600;font-size:13px;color:#065f46;margin-bottom:8px">
          Total Coverage: ${c.toFixed(2)}% of Vanuatu's land and sea area
        </div>
        <div class="progress-bar-container" style="height:20px">
          <div class="progress-bar-fill terrestrial"
               style="width: ${Math.min(h,100).toFixed(1)}%;background:linear-gradient(90deg, #065f46, #0ea5e9)">
            ${c>=.5?c.toFixed(1)+"%":""}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:var(--text-secondary)">
          <span>${j(s.total_covered_ha)} ha covered of ${j(s.total_area_ha)} ha</span>
          <span>Land: ${r.toFixed(1)}% | Sea: ${n.toFixed(1)}%</span>
        </div>
      </div>
    </div>
    ${u?`<div class="kpi-cat-badges">${u}</div>`:""}
    <div class="kpi-methodology-note">
      Terrestrial = (CCA + Inland Water) / ${j(i.terrestrial_ha)} ha &times; 100.
      Marine = (EEZ &minus; National Boundary) / EEZ &times; 100.
    </div>
  `}function pc(t,e,a){const s=Pi(e,a),i=Math.min(s.restoration_pct,100),r=s.degraded_ha+s.restoration_ha,o=s.provinceBreakdown.filter(h=>h.degraded_ha>0||h.restoration_ha>0).map(h=>{const u=h.restoration_pct||0,d=Math.min(u,100);return`
        <div class="t2-province-card">
          <div class="t2-province-header">
            <span class="t2-province-name">${h.province}</span>
            <span class="t2-province-pct">${u.toFixed(1)}%</span>
          </div>
          <div class="progress-bar-container" style="height:10px;margin-top:4px">
            <div class="progress-bar-fill t2-restoration"
                 style="width: ${d.toFixed(1)}%">
            </div>
          </div>
          <div class="t2-province-stats">
            <span>Degraded: ${j(h.degraded_ha)} ha</span>
            <span>Restored: ${j(h.restoration_ha)} ha</span>
          </div>
        </div>
      `}).join(""),n=s.categoryBreakdown.map(h=>{const u=Y[h.category]||{label:h.category,color:"#95a5a6"};return`<span class="cat-badge" style="background:${u.color}20;color:${u.color};border:1px solid ${u.color}40">
      ${ia(h.category,13)} ${u.label}: ${j(h.area_ha)} ha (${h.features})
    </span>`}).join(""),l=s.restoration_pct>=30?"#065f46":s.restoration_pct>=10?"#b45309":"#991b1b",c=s.restoration_pct>=30?"Strong restoration progress":s.restoration_pct>=10?"Restoration underway":s.degraded_ha>0?"Early stages — more restoration needed":"No degraded area data uploaded yet";t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card accent-orange">
        <div class="kpi-value" style="color:#D84315">${j(s.degraded_ha)}</div>
        <div class="kpi-label">Degraded Area (ha)</div>
        <div class="kpi-sublabel">${s.degraded_features} record${s.degraded_features!==1?"s":""}</div>
      </div>
      <div class="kpi-card accent-green">
        <div class="kpi-value" style="color:#2E7D32">${j(s.restoration_ha)}</div>
        <div class="kpi-label">Restoration Area (ha)</div>
        <div class="kpi-sublabel">${s.restoration_features} site${s.restoration_features!==1?"s":""}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${j(r)}</div>
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
          <span>${j(s.restoration_ha)} ha restored of ${j(s.degraded_ha)} ha degraded</span>
          <span>${s.degraded_ha>s.restoration_ha?j(s.degraded_ha-s.restoration_ha)+" ha remaining":"Target exceeded!"}</span>
        </div>
      </div>

      ${s.realmTotals.degraded_terrestrial_ha>0||s.realmTotals.degraded_marine_ha>0?`
        <div class="kpi-card">
          <div class="kpi-value" style="color:#D84315">${j(s.realmTotals.degraded_terrestrial_ha)}</div>
          <div class="kpi-label">Terrestrial Degraded</div>
          <div class="kpi-sublabel">${j(s.realmTotals.restoration_terrestrial_ha)} ha restoring</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value marine">${j(s.realmTotals.degraded_marine_ha)}</div>
          <div class="kpi-label">Marine/Coastal Degraded</div>
          <div class="kpi-sublabel">${j(s.realmTotals.restoration_marine_ha)} ha restoring</div>
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
  `}function _r(t,e,a){const s=Je(e,a),i=ct.nationalBaselines;Math.min(s.terrestrial_pct,100),Math.min(s.marine_pct,100);const r=i.terrestrial_ha*.3,o=i.marine_ha*.3,n=s.terrestrial_pct>0?s.terrestrial_pct/30*100:0,l=s.marine_pct>0?s.marine_pct/30*100:0,c=Math.max(0,r-s.terrestrial_ha),h=Math.max(0,o-s.marine_ha),u=i.terrestrial_ha+i.marine_ha,d=u*.3,p=s.terrestrial_ha+s.marine_ha,f=Math.max(0,d-p),m=u>0?p/u*100:0,g=m>0?m/30*100:0;s.gross_terrestrial_ha>0&&Math.abs(s.gross_terrestrial_ha-s.terrestrial_ha)>1,s.gross_marine_ha>0&&Math.abs(s.gross_marine_ha-s.marine_ha)>1,t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${j(s.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${j(s.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-value" style="color:#065f46">${s.terrestrial_pct.toFixed(2)}%</div>
        <div class="kpi-label">% of Total Land</div>
        <div class="kpi-sublabel">${j(s.terrestrial_ha)} of ${j(i.terrestrial_ha)} ha</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${s.marine_pct.toFixed(2)}%</div>
        <div class="kpi-label">% of Total Sea</div>
        <div class="kpi-sublabel">${j(s.marine_ha)} of ${j(i.marine_ha)} ha</div>
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
          ${s.terrestrial_remaining_pct>0?`${s.terrestrial_remaining_pct.toFixed(2)}% remaining (${j(c)} ha needed)`:"Target reached!"}
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
          ${s.marine_remaining_pct>0?`${s.marine_remaining_pct.toFixed(2)}% remaining (${j(h)} ha needed)`:"Target reached!"}
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
          <span>${j(p)} ha conserved of ${j(u)} ha total</span>
          <span>30% target = ${j(d)} ha</span>
        </div>
        <div style="margin-top:6px;font-size:12px;font-weight:500;color:${g>=100?"#065f46":"#b45309"}">
          ${f>0?`${j(f)} ha remaining to reach 30% (${g.toFixed(1)}% of target achieved)`:"Target reached!"}
        </div>
      </div>
    </div>

    <div class="kpi-methodology-note">
      National baselines: ${j(i.terrestrial_ha)} ha terrestrial, ${j(i.marine_ha)} ha marine.
    </div>
  `}const qs=[{key:"MEGAPODE",name:"Vanuatu Megapode",scientific:"Megapodius layardi",taxa:"Bird",photo:"species-photos/megapode.jpg",credit:"Euan Moore / iNaturalist (CC BY)"},{key:"STARLING",name:"Vanuatu Mountain Starling",scientific:"Aplonis santovestris",taxa:"Bird",photo:null,credit:null},{key:"FANTAIL",name:"Vanuatu Streaked Fantail",scientific:"Rhipidura spilodera",taxa:"Bird",photo:"species-photos/fantail.jpg",credit:"iNaturalist (CC BY-NC)"},{key:"KINGFISHER",name:"Vanuatu Kingfisher",scientific:"Todiramphus farquhari",taxa:"Bird",photo:"species-photos/kingfisher.jpg",credit:"Andrew Toara Morris / iNaturalist (CC BY-NC)"},{key:"FLYING_FOX",name:"Vanuatu Flying Fox",scientific:"Pteropus anetianus",taxa:"Mammal",photo:"species-photos/flying-fox.jpg",credit:"craigjhowe / iNaturalist (CC BY-NC)"},{key:"PLERANDRA",name:"Plerandra vanuatuensis",scientific:"Plerandra vanuatuensis",taxa:"Plant",photo:null,credit:null}];function fc(t,e,a){const s=fe(e,"T4",a),i=qs.filter(l=>s.categoryBreakdown.some(c=>c.category===l.key&&c.features>0)),r=s.categoryBreakdown.find(l=>l.category==="KBA"),o=s.categoryBreakdown.find(l=>l.category==="SPECIES_DIST"),n=qs.map(l=>{const c=s.categoryBreakdown.find(p=>p.category===l.key),h=Y[l.key]||{color:"#95a5a6"},u=c&&c.features>0,d=l.photo?`<div class="species-photo" style="background-image:url('${l.photo}')" title="${l.credit||""}"></div>`:`<div class="species-photo species-photo-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${h.color}" stroke-width="1.5" opacity="0.4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg></div>`;return`
      <div class="species-card ${u?"":"species-no-data"}" style="border-left:4px solid ${h.color}">
        ${d}
        <div class="species-card-body">
          <div class="species-card-header">
            <span class="species-common-name">${l.name}</span>
            <span class="species-taxa-badge">${l.taxa}</span>
          </div>
          <div class="species-scientific"><i>${l.scientific}</i></div>
          ${u?`<div class="species-stats">
                <span class="species-stat-value">${j(c.area_ha)} ha</span>
                <span class="species-stat-label">${c.features} record${c.features!==1?"s":""}</span>
              </div>`:'<div class="species-no-data-label">No data uploaded</div>'}
          ${l.credit?`<div class="species-photo-credit">${l.credit}</div>`:""}
        </div>
      </div>
    `}).join("");t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${j(s.totalAreaHa)}</div>
        <div class="kpi-label">Total Distribution (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${i.length} / ${qs.length}</div>
        <div class="kpi-label">Species Mapped</div>
        <div class="kpi-sublabel">${s.totalFeatures} total records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${j(r?r.area_ha:0)}</div>
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
        <span class="cat-badge" style="background:${Y.SPECIES_DIST.color}20;color:${Y.SPECIES_DIST.color};border:1px solid ${Y.SPECIES_DIST.color}40">
          ${ia("SPECIES_DIST",13)} Other Species: ${j(o.area_ha)} ha (${o.features})
        </span>
      </div>
    `:""}
  `}function gc(t,e,a){const s=fe(e,"T6",a),i=s.categoryBreakdown.find(o=>o.category==="MERREMIA"),r=s.categoryBreakdown.find(o=>o.category==="INVASIVE");s.grossAreaHa>0&&Math.abs(s.grossAreaHa-s.totalAreaHa)>1,t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card accent-red">
        <div class="kpi-value">${j(s.totalAreaHa)}</div>
        <div class="kpi-label">Total IAS Area (ha)</div>
        <div class="kpi-sublabel">${s.totalFeatures} detections</div>
      </div>
      <div class="kpi-card accent-red">
        <div class="kpi-value">${j(i?i.area_ha:0)}</div>
        <div class="kpi-label">Merremia peltata (ha)</div>
        <div class="kpi-sublabel">${i?i.features:0} detections</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${j(r?r.area_ha:0)}</div>
        <div class="kpi-label">Other IAS (ha)</div>
        <div class="kpi-sublabel">${r?r.features:0} records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${s.provinceBreakdown.length}</div>
        <div class="kpi-label">Provinces Affected</div>
      </div>
    </div>
    ${s.typeBreakdown.length>0?Bn(s.typeBreakdown,"Species / Detection Type"):""}
  `}function mc(t,e,a){const s=fe(e,"T10",a);s.grossAreaHa>0&&Math.abs(s.grossAreaHa-s.totalAreaHa)>1;const i=s.typeBreakdown,r=i.length,n=i.slice(0,25),l=i.length-n.length,c=n.map(u=>{const p=mt("LAND_COVER",u.type).fill,f=s.grossAreaHa>0?u.area_ha/s.grossAreaHa*100:0;return`
      <tr>
        <td>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p};margin-right:6px"></span>
          ${u.type}
        </td>
        <td style="text-align:right">${j(u.area_ha)}</td>
        <td style="text-align:right">${f.toFixed(1)}%</td>
        <td style="text-align:right">${u.features}</td>
      </tr>
    `}).join("")+(l>0?`<tr><td colspan="4" style="text-align:center;color:var(--text-tertiary);font-size:11px">+ ${l} more types</td></tr>`:""),h=`
    <tr style="font-weight:600;border-top:2px solid var(--border)">
      <td>Total</td>
      <td style="text-align:right">${j(s.grossAreaHa)}</td>
      <td style="text-align:right">100%</td>
      <td style="text-align:right">${s.totalFeatures}</td>
    </tr>
  `;t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${j(s.totalAreaHa)}</div>
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
          <tbody>${c}${h}</tbody>
        </table>
      </div>
    `:""}
  `}function vc(t,e,a,s){const i=fe(e,s,a),r=Gn[s]||{unit:"ha"};i.grossAreaHa>0&&Math.abs(i.grossAreaHa-i.totalAreaHa)>1;const o=i.categoryBreakdown.map(n=>{const l=Y[n.category]||{label:n.category,color:"#95a5a6"};return`<span class="cat-badge" style="background:${l.color}20;color:${l.color};border:1px solid ${l.color}40">
      ${ia(n.category,13)} ${l.label}: ${j(n.area_ha)} ha (${n.features})
    </span>`}).join("");t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${j(i.totalAreaHa)}</div>
        <div class="kpi-label">Total Area (ha)</div>
        <div class="kpi-sublabel">${r.unit}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${i.totalFeatures}</div>
        <div class="kpi-label">Data Records</div>
        <div class="kpi-sublabel">${i.layerCount} dataset${i.layerCount!==1?"s":""}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${j(i.realmTotals.terrestrial_ha)}</div>
        <div class="kpi-label">Terrestrial (ha)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value marine">${j(i.realmTotals.marine_ha)}</div>
        <div class="kpi-label">Marine (ha)</div>
      </div>
    </div>
    ${o?`<div class="kpi-cat-badges">${o}</div>`:""}
    ${i.typeBreakdown.length>1?Bn(i.typeBreakdown,"Type Breakdown"):""}
  `}function yc(t,e,a){const s=Ci(e,a);s.grossAreaHa>0&&Math.abs(s.grossAreaHa-s.totalAreaHa)>1,t.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${s.totalFeatures}</div>
        <div class="kpi-label">Data Records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${j(s.totalAreaHa)}</div>
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
  `}function Bn(t,e){const a=t.slice(0,10).map(s=>`
    <tr>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${s.type}">${s.type}</td>
      <td style="text-align:right">${j(s.area_ha)}</td>
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
  `}function j(t){return t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toFixed(t%1===0?0:1)}function bc(t){t.querySelectorAll(".kpi-value").forEach(a=>{const s=a.textContent.trim(),i=s.match(/^([\d.]+)([KM%]?)$/);if(!i)return;const r=parseFloat(i[1]),o=i[2];if(isNaN(r)||r===0)return;const n=(i[1].split(".")[1]||"").length,l=performance.now();a.setAttribute("data-counting","1"),a.textContent="0"+(n>0?"."+"0".repeat(n):"")+o;const c=h=>{const u=Math.min((h-l)/650,1),d=1-Math.pow(1-u,3);a.textContent=(r*d).toFixed(n)+o,u<1?requestAnimationFrame(c):(a.textContent=s,a.removeAttribute("data-counting"))};requestAnimationFrame(c)})}function xc(t,e){const a=Gn[e]||{label:e,color:"#95a5a6"},s=Ct()?`<button class="kpi-empty-action" onclick="document.getElementById('nav-tab-admin')?.click()">
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
  `}const Dn="nbsap_layer_styles_v1";let ra={};try{const t=localStorage.getItem(Dn);t&&(ra=JSON.parse(t))}catch{}function Fn(){try{localStorage.setItem(Dn,JSON.stringify(ra))}catch{}}function he(t){return ra[t]||null}function Hs(t,e){ra[t]=e,Fn()}function _c(t){delete ra[t],Fn()}function wc(t){return!!ra[t]}function wr(t,e,a){if(!e)return t;if(e.mode==="categorized"&&e.categoryColors){const i=e.categoryColors[a];return i?{...t,...i.fillColor&&{fillColor:i.fillColor},...i.strokeColor&&{color:i.strokeColor}}:t}const s={...t};return e.fillTransparent?(s.fill=!1,s.fillOpacity=0):(e.fillColor&&(s.fillColor=e.fillColor),e.fillOpacity!==void 0&&(s.fillOpacity=e.fillOpacity)),e.strokeTransparent?(s.stroke=!1,s.weight=0):(e.strokeColor&&(s.color=e.strokeColor),e.weight!==void 0&&(s.weight=e.weight)),e.dashArray!==void 0&&(s.dashArray=e.dashArray||null),s}function Mc(t,e,a){if(!e)return t;if(e.mode==="categorized"&&e.categoryColors){const i=e.categoryColors[a];return i?{...t,...i.fillColor&&{fillColor:i.fillColor},...i.strokeColor&&{color:i.strokeColor}}:t}const s={...t};return e.fillTransparent?(s.fill=!1,s.fillOpacity=0):(e.fillColor&&(s.fillColor=e.fillColor),e.fillOpacity!==void 0&&(s.fillOpacity=e.fillOpacity)),e.strokeTransparent?(s.stroke=!1,s.weight=0):(e.strokeColor&&(s.color=e.strokeColor),e.weight!==void 0&&(s.weight=e.weight)),e.pointRadius!==void 0&&(s.radius=e.pointRadius),s}let ae=null,us=null,Fe=null;const Sc=[{label:"Solid",value:""},{label:"Dashed",value:"8 4"},{label:"Short dash",value:"6 4"},{label:"Dotted",value:"2 4"},{label:"Dash-dot",value:"10 4 2 4"}];function On(t){var e,a;return!!((a=(e=t.geojson)==null?void 0:e.features)!=null&&a.some(s=>{var i,r;return((i=s.geometry)==null?void 0:i.type)==="Point"||((r=s.geometry)==null?void 0:r.type)==="MultiPoint"}))}function zn(t,e){var s,i;if(!((s=t.geojson)!=null&&s.features))return[];const a=new Set;for(const r of t.geojson.features){const o=(i=r.properties)==null?void 0:i[e];o!=null&&o!==""&&a.add(String(o))}return[...a].sort()}function Ec(t){var a,s;if(!((s=(a=t.geojson)==null?void 0:a.features)!=null&&s.length))return[];const e=new Set;for(const i of t.geojson.features)i.properties&&Object.keys(i.properties).forEach(r=>e.add(r));return[...e].sort()}function Ac(t,e,a){if(ae&&us===t.id){ps();return}ps(),us=t.id,Fe=e,ae=document.createElement("div"),ae.className="sym-panel",ae.innerHTML=Pc(t),document.body.appendChild(ae),$c(ae,t)}function ps(){ae&&(ae.remove(),ae=null),us=null,Fe=null}function kc(){return us}function Pc(t){const e=t.metadata,a=e.category||"OTHER",s=e.name||"Unnamed Layer",i=he(t.id),r=mt(a),o=On(t),n=Ec(t),l=n.length>0,c=(i==null?void 0:i.mode)||"single",h=(i==null?void 0:i.fillColor)||r.fill,u=(i==null?void 0:i.strokeColor)||r.stroke,d=(i==null?void 0:i.fillOpacity)??.45,p=(i==null?void 0:i.weight)??2.5,f=(i==null?void 0:i.dashArray)||"",m=(i==null?void 0:i.pointRadius)??6,g=(i==null?void 0:i.fillTransparent)||!1,v=(i==null?void 0:i.strokeTransparent)||!1,y=Ct(),_=c!=="categorized"&&c!=="labels"?"active":"",b=c==="categorized"?"active":"";let x="";y&&(x+=`<button class="sym-tab ${_}" data-tab="single">Simple</button>`,l&&(x+=`<button class="sym-tab ${b}" data-tab="categorized">Categorized</button>`));const w=f?"dashed":"solid",E=g?"transparent":h,P=v?"none":`${p}px ${w} ${u}`,$=g?"":`opacity:${Math.min(d+.55,1)}`,S=g?"disabled":"",A=v?"disabled":"",M=g?"sym-field sym-field-disabled":"sym-field",k=v?"sym-field sym-field-disabled":"sym-field",C=`
    <div class="sym-tab-content ${_}" data-content="single">
      <div class="${M}" id="sym-fill-group">
        <label>Fill Color
          <label class="sym-check-label"><input type="checkbox" id="sym-fill-none" ${g?"checked":""}> No fill</label>
        </label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-fill" value="${h}" ${S}>
          <span class="sym-color-hex">${h}</span>
        </div>
      </div>
      <div class="${M}" id="sym-opacity-group">
        <label>Fill Opacity</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-opacity" min="0" max="1" step="0.05" value="${d}" ${S}>
          <span class="sym-slider-val">${Math.round(d*100)}%</span>
        </div>
      </div>
      <div class="${k}" id="sym-stroke-group">
        <label>Stroke Color
          <label class="sym-check-label"><input type="checkbox" id="sym-stroke-none" ${v?"checked":""}> No stroke</label>
        </label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-stroke" value="${u}" ${A}>
          <span class="sym-color-hex">${u}</span>
        </div>
      </div>
      <div class="${k}" id="sym-weight-group">
        <label>Stroke Width</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-weight" min="0.5" max="8" step="0.5" value="${p}" ${A}>
          <span class="sym-slider-val">${p}px</span>
        </div>
      </div>
      <div class="${k}" id="sym-dash-group">
        <label>Stroke Style</label>
        <select class="sym-select" id="sym-dash" ${A}>
          ${Sc.map(N=>`<option value="${N.value}" ${f===N.value?"selected":""}>${N.label}</option>`).join("")}
        </select>
      </div>
      ${o?`
      <div class="sym-field">
        <label>Point Size</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-radius" min="3" max="20" step="1" value="${m}">
          <span class="sym-slider-val">${m}px</span>
        </div>
      </div>`:""}
      <div class="sym-preview-row">
        <div class="sym-preview-swatch ${g?"sym-preview-transparent":""}" id="sym-preview"
          style="background:${E};border:${P};${$}">
        </div>
        <span class="sym-preview-label">Preview</span>
      </div>
    </div>`;let G="";if(l){const N=i!=null&&i.categoryBy&&n.includes(i.categoryBy)?i.categoryBy:n[0]||"",O=zn(t,N),F=(i==null?void 0:i.categoryColors)||{},U=n.map(st=>`<option value="${st}" ${N===st?"selected":""}>${st}</option>`).join("");G=`
      <div class="sym-tab-content ${b}" data-content="categorized">
        <div class="sym-field">
          <label>Categorize by column</label>
          <select class="sym-select" id="sym-col-select">
            ${U}
          </select>
        </div>
        <div class="sym-cat-list" data-groupby="${N}">
          ${jn(O,a,F)}
        </div>
      </div>`}x+=`<button class="sym-tab ${!y||c==="labels"?"active":""}" data-tab="labels">Labels</button>`;const I=Cc(n,i,!y);return`
    <div class="sym-header">
      <div class="sym-title">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;opacity:0.9">
          <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/>
          <circle cx="8.5"  cy="7.5"  r="0.5" fill="currentColor"/>
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5l-4 .5.5-4Z"/>
        </svg>
        Symbolize
      </div>
      <span class="sym-layer-name" title="${s}">${s}</span>
      <button class="sym-close" title="Close">×</button>
    </div>
    <div class="sym-tabs">${x}</div>
    <div class="sym-body">
      ${y?C:""}
      ${y?G:""}
      ${I}
    </div>
    <div class="sym-footer">
      <button class="sym-btn sym-btn-reset">Reset Default</button>
      <button class="sym-btn sym-btn-apply">Apply</button>
    </div>`}function jn(t,e,a){return t.length===0?'<p class="sym-no-types">No values found in layer data.</p>':t.map(s=>{var n,l;const i=mt(e,s),r=((n=a[s])==null?void 0:n.fillColor)||i.fill,o=((l=a[s])==null?void 0:l.strokeColor)||i.stroke;return`
      <div class="sym-cat-row" data-type="${s}">
        <span class="sym-cat-swatch" style="background:${r};border:2px solid ${o}"></span>
        <span class="sym-cat-label" title="${s}">${s}</span>
        <input type="color" class="sym-cat-fill"   value="${r}"   title="Fill color">
        <input type="color" class="sym-cat-stroke" value="${o}" title="Stroke color">
      </div>`}).join("")}function Cc(t,e,a=!1){const s=(e==null?void 0:e.labels)||{},i=s.enabled||!1,r=s.field&&t.includes(s.field)?s.field:t[0]||"name",o=s.fontSize??11,n=s.fontColor||"#222222",l=s.bufferSize??2,c=s.bufferColor||"#ffffff",h=i?"":"disabled",u=i?"sym-field":"sym-field sym-field-disabled",d=t.length>0?t.map(p=>`<option value="${p}" ${r===p?"selected":""}>${p}</option>`).join(""):'<option value="name">name</option>';return`
    <div class="sym-tab-content ${a?"active":""}" data-content="labels">
      <div class="sym-field">
        <label>Show Labels
          <label class="sym-check-label" style="float:right">
            <input type="checkbox" id="sym-label-enabled" ${i?"checked":""}> On
          </label>
        </label>
      </div>
      <div class="${u}" id="sym-label-field-group">
        <label>Label Field</label>
        <select class="sym-select" id="sym-label-field" ${h}>
          ${d}
        </select>
      </div>
      <div class="${u}" id="sym-label-size-group">
        <label>Font Size</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-label-size" min="8" max="24" step="1" value="${o}" ${h}>
          <span class="sym-slider-val">${o}px</span>
        </div>
      </div>
      <div class="${u}" id="sym-label-color-group">
        <label>Font Color</label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-label-color" value="${n}" ${h}>
          <span class="sym-color-hex">${n}</span>
        </div>
      </div>
      <div class="${u}" id="sym-label-buf-group">
        <label>Buffer Size</label>
        <div class="sym-slider-row">
          <input type="range" class="sym-slider" id="sym-label-bufsize" min="0" max="5" step="1" value="${l}" ${h}>
          <span class="sym-slider-val">${l}px</span>
        </div>
      </div>
      <div class="${u}" id="sym-label-bufcol-group">
        <label>Buffer Color</label>
        <div class="sym-color-row">
          <input type="color" class="sym-color" id="sym-label-bufcolor" value="${c}" ${h}>
          <span class="sym-color-hex">${c}</span>
        </div>
      </div>
      <div class="sym-label-preview-row" id="sym-label-preview-row">
        <span class="sym-label-preview-text" id="sym-label-preview-text"
          style="font-size:${o}px;color:${n};${qn(l,c)}">
          Label Preview
        </span>
      </div>
    </div>`}function qn(t,e){if(!t||t<=0)return"";const a=t,s=e;return`text-shadow:${-a}px ${-a}px ${a}px ${s},${a}px ${-a}px ${a}px ${s},${-a}px ${a}px ${a}px ${s},${a}px ${a}px ${a}px ${s},${-a}px 0 ${a}px ${s},${a}px 0 ${a}px ${s},0 ${-a}px ${a}px ${s},0 ${a}px ${a}px ${s};`}function $c(t,e){var m,g,v,y,_;t.querySelector(".sym-close").addEventListener("click",ps),t.querySelectorAll(".sym-tab").forEach(b=>{b.addEventListener("click",()=>{var x;t.querySelectorAll(".sym-tab").forEach(w=>w.classList.remove("active")),t.querySelectorAll(".sym-tab-content").forEach(w=>w.classList.remove("active")),b.classList.add("active"),(x=t.querySelector(`[data-content="${b.dataset.tab}"]`))==null||x.classList.add("active")})}),(m=t.querySelector("#sym-col-select"))==null||m.addEventListener("change",b=>{Tc(t,e,b.target.value)});const a=t.querySelector("#sym-fill"),s=t.querySelector("#sym-stroke"),i=t.querySelector("#sym-opacity"),r=t.querySelector("#sym-weight"),o=t.querySelector("#sym-dash"),n=t.querySelector("#sym-preview"),l=t.querySelector("#sym-fill-none"),c=t.querySelector("#sym-stroke-none");function h(b,x){b.forEach(w=>{const E=t.querySelector(`#${w}`);E&&(E.classList.toggle("sym-field-disabled",x),E.querySelectorAll("input:not([type=checkbox]), select").forEach(P=>{P.disabled=x}))})}function u(){if(!n)return;const b=l==null?void 0:l.checked,x=c==null?void 0:c.checked,w=(a==null?void 0:a.value)||"#ccc",E=(s==null?void 0:s.value)||"#000",P=parseFloat((i==null?void 0:i.value)??.45),$=parseFloat((r==null?void 0:r.value)??2.5),S=o&&o.value!=="";n.classList.toggle("sym-preview-transparent",b),n.style.background=b?"transparent":w,n.style.border=x?"none":`${$}px ${S?"dashed":"solid"} ${E}`,n.style.opacity=b?"":String(Math.min(P+.55,1))}l==null||l.addEventListener("change",()=>{h(["sym-fill-group","sym-opacity-group"],l.checked),u()}),c==null||c.addEventListener("change",()=>{h(["sym-stroke-group","sym-weight-group","sym-dash-group"],c.checked),u()}),t.querySelectorAll(".sym-color").forEach(b=>{b.addEventListener("input",()=>{const x=b.nextElementSibling;x&&(x.textContent=b.value),u()})}),t.querySelectorAll(".sym-slider").forEach(b=>{b.addEventListener("input",()=>{const x=b.nextElementSibling;x&&(x.textContent=b.id==="sym-opacity"?Math.round(parseFloat(b.value)*100)+"%":b.value+"px"),u()})}),o==null||o.addEventListener("change",u);const d=t.querySelector("#sym-label-enabled"),p=["sym-label-field-group","sym-label-size-group","sym-label-color-group","sym-label-buf-group","sym-label-bufcol-group"];function f(){var $,S,A,M;const b=t.querySelector("#sym-label-preview-text");if(!b)return;const x=(($=t.querySelector("#sym-label-size"))==null?void 0:$.value)||11,w=((S=t.querySelector("#sym-label-color"))==null?void 0:S.value)||"#222222",E=parseInt(((A=t.querySelector("#sym-label-bufsize"))==null?void 0:A.value)??2,10),P=((M=t.querySelector("#sym-label-bufcolor"))==null?void 0:M.value)||"#ffffff";b.style.fontSize=x+"px",b.style.color=w,b.style.cssText+=qn(E,P)}d==null||d.addEventListener("change",()=>{const b=d.checked;p.forEach(x=>{const w=t.querySelector(`#${x}`);w&&(w.classList.toggle("sym-field-disabled",!b),w.querySelectorAll("input:not([type=checkbox]), select").forEach(E=>{E.disabled=!b}))}),f()}),(g=t.querySelector("#sym-label-size"))==null||g.addEventListener("input",b=>{const x=b.target.nextElementSibling;x&&(x.textContent=b.target.value+"px"),f()}),(v=t.querySelector("#sym-label-bufsize"))==null||v.addEventListener("input",b=>{const x=b.target.nextElementSibling;x&&(x.textContent=b.target.value+"px"),f()}),(y=t.querySelector("#sym-label-color"))==null||y.addEventListener("input",b=>{const x=b.target.nextElementSibling;x&&(x.textContent=b.target.value),f()}),(_=t.querySelector("#sym-label-bufcolor"))==null||_.addEventListener("input",b=>{const x=b.target.nextElementSibling;x&&(x.textContent=b.target.value),f()}),Hn(t),t.querySelector(".sym-btn-reset").addEventListener("click",()=>{_c(e.id),Fe&&Fe(),ps()}),t.querySelector(".sym-btn-apply").addEventListener("click",()=>{var M,k;const b=((M=t.querySelector(".sym-tab.active"))==null?void 0:M.dataset.tab)||"single",x=t.querySelector("#sym-label-enabled"),w=t.querySelector("#sym-label-field"),E=t.querySelector("#sym-label-size"),P=t.querySelector("#sym-label-color"),$=t.querySelector("#sym-label-bufsize"),S=t.querySelector("#sym-label-bufcolor"),A={enabled:(x==null?void 0:x.checked)||!1,field:(w==null?void 0:w.value)||"name",fontSize:parseInt((E==null?void 0:E.value)??11,10),fontColor:(P==null?void 0:P.value)||"#222222",bufferSize:parseInt(($==null?void 0:$.value)??2,10),bufferColor:(S==null?void 0:S.value)||"#ffffff"};if(b==="single"){const C=On(e),G={mode:"single",fillColor:(a==null?void 0:a.value)||mt(e.metadata.category||"OTHER").fill,strokeColor:(s==null?void 0:s.value)||mt(e.metadata.category||"OTHER").stroke,fillOpacity:parseFloat((i==null?void 0:i.value)??.45),weight:parseFloat((r==null?void 0:r.value)??2.5),dashArray:(o==null?void 0:o.value)||null,fillTransparent:(l==null?void 0:l.checked)||!1,strokeTransparent:(c==null?void 0:c.checked)||!1,labels:A};if(C){const T=t.querySelector("#sym-radius");T&&(G.pointRadius=parseFloat(T.value))}Hs(e.id,G)}else if(b==="labels"){const C=he(e.id)||{mode:"single"};Hs(e.id,{...C,labels:A})}else{const C=t.querySelector(".sym-cat-list");(k=t.querySelector("#sym-col-select"))!=null&&k.value||C!=null&&C.dataset.groupby;const G={};t.querySelectorAll(".sym-cat-row").forEach(T=>{var F,U;const I=T.dataset.type,N=(F=T.querySelector(".sym-cat-fill"))==null?void 0:F.value,O=(U=T.querySelector(".sym-cat-stroke"))==null?void 0:U.value;I&&N&&(G[I]={fillColor:N,strokeColor:O})}),Hs(e.id,{mode:"categorized",categoryBy,categoryColors:G,labels:A})}Fe&&Fe()})}function Hn(t){t.querySelectorAll(".sym-cat-fill, .sym-cat-stroke").forEach(e=>{e.addEventListener("input",()=>{const a=e.closest(".sym-cat-row"),s=a==null?void 0:a.querySelector(".sym-cat-swatch");s&&(s.style.background=a.querySelector(".sym-cat-fill").value,s.style.borderColor=a.querySelector(".sym-cat-stroke").value)})})}function Tc(t,e,a){const i=e.metadata.category||"OTHER",r=he(e.id),o=(r==null?void 0:r.categoryColors)||{},n=zn(e,a),l=t.querySelector(".sym-cat-list");l&&(l.dataset.groupby=a,l.innerHTML=jn(n,i,o),Hn(t))}let yt=null,Us={},Oe=null,ee=null,ba=null,Ja=null,Ne=null;const ss=new Set,Lc=new Set(["ADMIN_BOUNDARY","EEZ","SPATIAL_PLAN"]),Ic=new Set(["CCA","LMMA"]);let ft=[],Xe=!1;function Un(t){const e=new Set(t.map(s=>s.id));ft=ft.filter(s=>e.has(s));for(const s of t)ft.includes(s.id)||ft.push(s.id);const a=new Map(ft.map((s,i)=>[s,i]));return[...t].sort((s,i)=>(a.get(s.id)??999)-(a.get(i.id)??999))}const Vs=D.canvas({padding:.5}),Mr=1e3;function Nc(t){if(yt)return yt.invalidateSize(),yt;yt=D.map(t,{center:ct.mapCenter,zoom:ct.mapZoom,zoomControl:!0});for(const[a,s]of Object.entries(ct.tileSources))Us[s.name]=D.tileLayer(s.url,{attribution:s.attribution,maxZoom:s.maxZoom});const e=Object.values(Us)[0];return e&&e.addTo(yt),Oe=D.featureGroup(),Oe.addTo(yt),ee=D.featureGroup(),ee.addTo(yt),ba=D.layerGroup(),ba.addTo(yt),D.control.layers(Us,{},{position:"topright"}).addTo(yt),D.control.scale({imperial:!1,position:"bottomleft"}).addTo(yt),yt}function Pa(){var g,v,y,_,b;if(!yt)return;Oe&&Oe.clearLayers(),ee.clearLayers(),ba&&ba.clearLayers(),Ja&&(Ja.remove(),Ja=null);const t=H(),e=t.filters,a=Gt(),s=Un(a);t.provincesGeojson&&(Ja=D.geoJSON(t.provincesGeojson,{style:{color:"#555",weight:1.5,fillOpacity:.03,dashArray:"4 4"},onEachFeature:(x,w)=>{const E=x.properties.name||x.properties.province||"Unknown";w.bindTooltip(E,{sticky:!0,className:"province-tooltip"})}}).addTo(yt));const i={},r={},o={},n={},l={},c=[],h=[],u=[],d=[];for(const x of s){const w=x.metadata;if(!x.geojson)continue;if(e.targets.length>0){const M=e.targets.includes("T1"),k=M&&Lc.has(w.category),C=M&&w.targets.includes("T1")&&!Ic.has(w.category),G=w.targets.some(T=>e.targets.includes(T)&&T!=="T1");if(!k&&!C&&!G)continue}if(e.category&&e.category!=="All"&&w.category!==e.category)continue;const E=w.category||"OTHER",P=Oc(x.geojson.features||[],e),$=w.isReference===!0;if(P.length===0||($||d.push(x),ss.has(x.id)))continue;$||u.push(x);const S=[],A=[];for(const M of P){const k=(g=M.geometry)==null?void 0:g.type;if(k==="Polygon"||k==="MultiPolygon")if($)c.push({feature:M,meta:w,cat:E});else{S.push(M);const C=Cn(E,M);i[C]||(i[C]=[]),i[C].push(M),r[C]||(r[C]={cat:E,typeValue:E==="LAND_COVER"&&((v=M.properties)==null?void 0:v.type)||null}),o[C]||(o[C]=x.id)}else(k==="Point"||k==="MultiPoint")&&($?h.push({feature:M,meta:w,cat:E}):A.push(M))}S.length>0&&!$&&(n[E]||(n[E]=[]),n[E].push({features:S,meta:w})),A.length>0&&!$&&(l[E]||(l[E]={features:[],meta:w}),l[E].features.push(...A))}if(c.length>0){const x={};for(const{feature:w,meta:E,cat:P}of c)x[P]||(x[P]={features:[],meta:E}),x[P].features.push(w);for(const[w,E]of Object.entries(x)){const P=D.geoJSON({type:"FeatureCollection",features:E.features},{style:()=>$n(w),onEachFeature:($,S)=>{da($,S,E.meta,!0)}});Oe.addLayer(P)}}if(h.length>0){const x={};for(const{feature:w,meta:E,cat:P}of h)x[P]||(x[P]={features:[],meta:E}),x[P].features.push(w);for(const[w,E]of Object.entries(x)){const P=D.geoJSON({type:"FeatureCollection",features:E.features},{pointToLayer:($,S)=>D.circleMarker(S,Tn(w)),onEachFeature:($,S)=>{da($,S,E.meta,!0)}});Oe.addLayer(P)}}let p=0;for(const x of Object.values(i))p+=x.length;const f=p>Mr,m=200;for(const[x,w]of Object.entries(i)){const{cat:E,typeValue:P}=r[x],$=o[x],S=he($),A=f?{renderer:Vs}:{},M=k=>{var T,I;const C=rc(E,P),G=S!=null&&S.categoryBy?String(((T=k==null?void 0:k.properties)==null?void 0:T[S.categoryBy])??"")||P:((I=k==null?void 0:k.properties)==null?void 0:I.type)||P;return wr(C,S,G)};if(f||w.length>m){const k=D.geoJSON({type:"FeatureCollection",features:w},{style:M,interactive:!0,renderer:Vs});k.on("click",C=>{if(C.layer&&C.layer.feature){const G=C.layer.feature,T=Bc(G,n[E]);T&&da(G,C.layer,T),C.layer.openPopup(C.latlng)}}),ee.addLayer(k)}else{const k=ht(w);if(k){const C=D.geoJSON(k,{style:G=>M(G),interactive:!1,...A});ee.addLayer(C)}}}if(!f)for(const[x,w]of Object.entries(n))for(const E of w){const P=he(E.meta.id),$=D.geoJSON({type:"FeatureCollection",features:E.features},{style:S=>{var k,C;const A=nc(S,x),M=(P==null?void 0:P.categoryBy)==="status"?(k=S.properties)==null?void 0:k.status:(C=S.properties)==null?void 0:C.type;return wr(A,P,M)},onEachFeature:(S,A)=>{da(S,A,E.meta)}});ee.addLayer($)}for(const[x,w]of Object.entries(l)){const E=w.features.length>Mr?{renderer:Vs}:{},P=he(w.meta.id),$=D.geoJSON({type:"FeatureCollection",features:w.features},{pointToLayer:(S,A)=>{var C,G;const M=oc(S,x),k=(P==null?void 0:P.categoryBy)==="status"?(C=S.properties)==null?void 0:C.status:(G=S.properties)==null?void 0:G.type;return D.circleMarker(A,Mc(M,P,k))},onEachFeature:(S,A)=>{da(S,A,w.meta)},...E});ee.addLayer($)}for(const x of u){const w=(y=he(x.id))==null?void 0:y.labels;if(!(w!=null&&w.enabled))continue;const E=w.field||"name",P=w.fontSize??11,$=w.fontColor||"#222222",S=w.bufferSize??2,A=w.bufferColor||"#ffffff",M=Dc(S,A);for(const k of((_=x.geojson)==null?void 0:_.features)||[]){const C=String(((b=k.properties)==null?void 0:b[E])??"");if(!C)continue;const G=Fc(k);if(!G)continue;const T=C.replace(/</g,"&lt;").replace(/>/g,"&gt;"),I=D.marker(G,{icon:D.divIcon({className:"feature-label",html:`<span class="feature-label-text" style="font-size:${P}px;color:${$};${M}">${T}</span>`,iconSize:null,iconAnchor:null}),interactive:!1,zIndexOffset:1e3});ba.addLayer(I)}}if(Rc(d),!Xe&&ee.getLayers().length>0){const x=ee.getBounds();x.isValid()&&yt.fitBounds(x,{padding:[30,30],maxZoom:12})}Xe=!1}function Rc(t,e){if(Ne&&(Ne.remove(),Ne=null),!yt||t.length===0)return;const a=Un(t);Ne=D.control({position:"bottomright"}),Ne.onAdd=function(){const s=D.DomUtil.create("div","map-legend");D.DomEvent.disableClickPropagation(s),D.DomEvent.disableScrollPropagation(s);const i=Ct();let r='<div class="map-legend-title">Layers <span class="map-legend-hint">(use arrows to reorder)</span></div>';for(let o=0;o<a.length;o++){const n=a[o],l=n.metadata,c=l.category||"OTHER",h=mt(c),u=l.name||"Unnamed Layer",d=!ss.has(n.id),p=o===0,f=o===a.length-1,m=he(n.id),g=(m==null?void 0:m.mode)==="single"&&m.fillColor?m.fillColor:h.fill,v=(m==null?void 0:m.mode)==="single"&&m.strokeColor?m.strokeColor:h.stroke,y=kc()===n.id,_=wc(n.id);r+=`<div class="map-legend-row map-layer-toggle ${d?"":"layer-hidden"}" data-layer-id="${n.id}" ${i?'draggable="true"':""} title="${u}">
        <div class="layer-order-controls">
          <button class="layer-order-btn layer-move-up" data-layer-id="${n.id}" ${f?"disabled":""} title="Bring forward">&#9650;</button>
          <button class="layer-order-btn layer-move-down" data-layer-id="${n.id}" ${p?"disabled":""} title="Send backward">&#9660;</button>
        </div>
        <label class="map-layer-label-wrap">
          <input type="checkbox" class="map-layer-cb" data-layer-id="${n.id}" ${d?"checked":""}>
          <span class="map-legend-swatch" style="background:${g};border-color:${v}"></span>
          <span class="map-legend-label">${u}</span>
        </label>
        <button class="layer-style-btn ${_?"has-override":""} ${y?"is-open":""}" data-layer-id="${n.id}" title="Labels / Symbolize layer" draggable="false">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5l-4 .5.5-4Z"/>
          </svg>
        </button>
      </div>`}if(s.innerHTML=r,s.querySelectorAll(".map-layer-cb").forEach(o=>{o.addEventListener("change",()=>{const n=o.dataset.layerId;o.checked?ss.delete(n):ss.add(n),Xe=!0,Pa()})}),s.querySelectorAll(".layer-move-up").forEach(o=>{o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Sr(o.dataset.layerId,"up")})}),s.querySelectorAll(".layer-move-down").forEach(o=>{o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Sr(o.dataset.layerId,"down")})}),s.querySelectorAll(".layer-style-btn").forEach(o=>{o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const l=o.dataset.layerId,c=a.find(h=>h.id===l);c&&Ac(c,()=>{Xe=!0,Pa()})})}),i){let o=null;s.querySelectorAll(".map-layer-toggle[draggable]").forEach(l=>{l.addEventListener("dragstart",c=>{o=l.dataset.layerId,l.classList.add("layer-dragging"),c.dataTransfer.effectAllowed="move"}),l.addEventListener("dragend",()=>{l.classList.remove("layer-dragging"),s.querySelectorAll(".layer-dragover").forEach(c=>c.classList.remove("layer-dragover")),o=null}),l.addEventListener("dragover",c=>{c.preventDefault(),c.dataTransfer.dropEffect="move",l.classList.add("layer-dragover")}),l.addEventListener("dragleave",()=>{l.classList.remove("layer-dragover")}),l.addEventListener("drop",c=>{c.preventDefault(),l.classList.remove("layer-dragover");const h=l.dataset.layerId;o&&o!==h&&Gc(o,h)})})}return s},Ne.addTo(yt)}function Sr(t,e){const a=ft.indexOf(t);if(a!==-1){if(e==="up"&&a<ft.length-1)[ft[a],ft[a+1]]=[ft[a+1],ft[a]];else if(e==="down"&&a>0)[ft[a],ft[a-1]]=[ft[a-1],ft[a]];else return;Xe=!0,Pa()}}function Gc(t,e){const a=ft.indexOf(t),s=ft.indexOf(e);if(a===-1||s===-1)return;ft.splice(a,1);const i=ft.indexOf(e);ft.splice(i,0,t),Xe=!0,Pa()}function Bc(t,e){if(!e)return null;for(const a of e)if(a.features.includes(t))return a.meta;return e.length>0?e[0].meta:null}function da(t,e,a,s=!1){var h;const i=t.properties,r=mt(a.category,i.type),o=((h=Y[a.category])==null?void 0:h.label)||a.category,n=s?'<span style="display:inline-block;background:#f0ad4e;color:#fff;font-size:10px;font-weight:600;padding:1px 6px;border-radius:10px;margin-left:6px">REF</span>':"",c=`
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
  `;e.bindPopup(c)}function Dc(t,e){if(!t||t<=0)return"";const a=t,s=e;return`text-shadow:${[`${-a}px ${-a}px ${a}px ${s}`,`${a}px ${-a}px ${a}px ${s}`,`${-a}px ${a}px ${a}px ${s}`,`${a}px ${a}px ${a}px ${s}`,`${-a}px 0 ${a}px ${s}`,`${a}px 0 ${a}px ${s}`,`0 ${-a}px ${a}px ${s}`,`0 ${a}px ${a}px ${s}`].join(",")};`}function Fc(t){const e=t==null?void 0:t.geometry;if(!e)return null;const a=e.type;if(a==="Point")return D.latLng(e.coordinates[1],e.coordinates[0]);if(a==="MultiPoint")return D.latLng(e.coordinates[0][1],e.coordinates[0][0]);try{const s=D.geoJSON(t).getBounds();if(s.isValid())return s.getCenter()}catch{}return null}function Oc(t,e){return t.filter(a=>{const s=a.properties||{};return!(e.province&&e.province!=="All"&&s.province!==e.province||e.realm&&e.realm!=="All"&&s.realm!==e.realm||e.year&&e.year!=="All"&&String(s.year)!==String(e.year))})}function Vn(){return yt}function zc(){return[...ft]}function jc(){yt&&setTimeout(()=>yt.invalidateSize(),100)}function Er(t,e){if(!e||e.length===0){t.innerHTML='<p style="color:var(--text-light);font-size:13px;padding:10px">No province data available</p>';return}const a=Math.max(...e.map(i=>i.total_ha),1),s=e.map(i=>{const r=(i.terrestrial_ha/a*100).toFixed(1),o=(i.marine_ha/a*100).toFixed(1);return`
      <div class="bar-row">
        <a href="#" class="bar-label province-zoom-link" data-province="${i.province}" title="Zoom to ${i.province}" style="cursor:pointer;color:var(--primary);text-decoration:none">${i.province}</a>
        <div class="bar-track">
          <div class="bar-fill terrestrial" style="width: ${r}%; position:absolute; left:0; top:0; height:100%"></div>
          <div class="bar-fill marine" style="width: ${o}%; position:absolute; left:${r}%; top:0; height:100%"></div>
        </div>
        <span class="bar-value">${Me(i.total_ha)}</span>
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
  `,t.querySelectorAll(".bar-track").forEach(i=>{i.style.position="relative"}),t.querySelectorAll(".province-zoom-link").forEach(i=>{i.addEventListener("click",r=>{r.preventDefault(),Wn(i.dataset.province)})})}function Ar(t,e){if(!e||e.length===0){t.innerHTML='<p style="color:var(--text-light);font-size:13px">No data</p>';return}const a=e.map(i=>`
    <tr>
      <td><a href="#" class="province-zoom-link" data-province="${i.province}" style="color:var(--primary);cursor:pointer;text-decoration:none;font-weight:500" title="Zoom to ${i.province}">${i.province}</a></td>
      <td style="text-align:right">${Me(i.terrestrial_ha)}</td>
      <td style="text-align:right">${Me(i.marine_ha)}</td>
      <td style="text-align:right"><strong>${Me(i.total_ha)}</strong></td>
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
          <td style="text-align:right">${Me(s.terrestrial_ha)}</td>
          <td style="text-align:right">${Me(s.marine_ha)}</td>
          <td style="text-align:right">${Me(s.total_ha)}</td>
          <td style="text-align:right">${s.features}</td>
        </tr>
      </tfoot>
    </table>
  `,t.querySelectorAll(".province-zoom-link").forEach(i=>{i.addEventListener("click",r=>{r.preventDefault(),Wn(i.dataset.province)})})}function Wn(t){const e=Vn();if(!e)return;const s=H().provincesGeojson;if(!s||!s.features)return;const i=s.features.find(n=>(n.properties.name||n.properties.province||n.properties.NAME||"")===t);if(!i)return;const o=D.geoJSON(i).getBounds();o.isValid()&&e.fitBounds(o,{padding:[40,40],maxZoom:11})}function Me(t){return!t&&t!==0?"-":t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toFixed(1)}const qc=`
  position:fixed;inset:0;z-index:99999;
  display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.45);backdrop-filter:blur(2px);
  animation:nbsapDialogFadeIn 0.15s ease-out;
`,Gi=`
  background:#fff;border-radius:12px;padding:24px;
  min-width:320px;max-width:460px;width:90%;
  box-shadow:0 20px 60px rgba(0,0,0,0.25);
  font-family:var(--font, system-ui, sans-serif);
  animation:nbsapDialogSlideIn 0.2s ease-out;
`,Bi=`
  margin:0 0 8px;font-size:16px;font-weight:700;
  color:var(--text, #1A202C);
`,Di=`
  margin:0 0 20px;font-size:14px;line-height:1.5;
  color:var(--text-secondary, #616E7C);white-space:pre-line;
`,Fi=`
  padding:10px 20px;border-radius:8px;font-size:14px;
  font-weight:600;cursor:pointer;border:none;
  transition:all 0.15s;
`,Oi=`${Fi}
  background:var(--primary, #006B3F);color:#fff;
`,Kn=`${Fi}
  background:var(--gray-100, #F1F3F5);color:var(--text, #1A202C);
`,Hc=`${Fi}
  background:var(--danger, #D32F2F);color:#fff;
`,Uc=`
  width:100%;padding:10px 12px;border:2px solid var(--border, #E4E7EB);
  border-radius:8px;font-size:14px;margin-bottom:20px;
  font-family:inherit;box-sizing:border-box;
  outline:none;transition:border-color 0.15s;
`;let kr=!1;function Vc(){if(kr)return;kr=!0;const t=document.createElement("style");t.textContent=`
    @keyframes nbsapDialogFadeIn { from { opacity:0 } to { opacity:1 } }
    @keyframes nbsapDialogSlideIn { from { transform:translateY(-10px);opacity:0 } to { transform:translateY(0);opacity:1 } }
  `,document.head.appendChild(t)}function zi(){Vc();const t=document.createElement("div");return t.style.cssText=qc,t}function Qe(t,e={}){const a=e.title||"Notice";return new Promise(s=>{const i=zi();i.innerHTML=`
      <div style="${Gi}">
        <h3 style="${Bi}">${a}</h3>
        <p style="${Di}">${ji(t)}</p>
        <div style="display:flex;justify-content:flex-end">
          <button data-action="ok" style="${Oi}">OK</button>
        </div>
      </div>
    `,i.querySelector('[data-action="ok"]').addEventListener("click",()=>{i.remove(),s()}),document.body.appendChild(i),i.querySelector('[data-action="ok"]').focus()})}function Xt(t,e={}){const a=e.title||"Confirm",s=e.okLabel||"OK",i=e.cancelLabel||"Cancel",r=e.danger?Hc:Oi;return new Promise(o=>{const n=zi();n.innerHTML=`
      <div style="${Gi}">
        <h3 style="${Bi}">${a}</h3>
        <p style="${Di}">${ji(t)}</p>
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button data-action="cancel" style="${Kn}">${i}</button>
          <button data-action="ok" style="${r}">${s}</button>
        </div>
      </div>
    `,n.querySelector('[data-action="cancel"]').addEventListener("click",()=>{n.remove(),o(!1)}),n.querySelector('[data-action="ok"]').addEventListener("click",()=>{n.remove(),o(!0)}),document.body.appendChild(n),n.querySelector('[data-action="ok"]').focus()})}function Yn(t,e="",a={}){const s=a.title||"Input";return new Promise(i=>{const r=zi();r.innerHTML=`
      <div style="${Gi}">
        <h3 style="${Bi}">${s}</h3>
        <p style="${Di}">${ji(t)}</p>
        <input type="text" data-input style="${Uc}" value="${Wc(e)}">
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button data-action="cancel" style="${Kn}">Cancel</button>
          <button data-action="ok" style="${Oi}">OK</button>
        </div>
      </div>
    `;const o=r.querySelector("[data-input]");o.addEventListener("focus",()=>{o.style.borderColor="var(--primary, #006B3F)"}),o.addEventListener("blur",()=>{o.style.borderColor="var(--border, #E4E7EB)"}),o.addEventListener("keydown",n=>{n.key==="Enter"&&r.querySelector('[data-action="ok"]').click(),n.key==="Escape"&&r.querySelector('[data-action="cancel"]').click()}),r.querySelector('[data-action="cancel"]').addEventListener("click",()=>{r.remove(),i(null)}),r.querySelector('[data-action="ok"]').addEventListener("click",()=>{r.remove(),i(o.value)}),document.body.appendChild(r),o.focus(),o.select()})}function ji(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Wc(t){return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}function Kc(){var r;const t=H(),e=Gt(),a=t.filters;a.targets.length===0||a.targets.includes("T3");const s=[["Layer","Category","Realm","Province","Name","Area (ha)","Targets","Status","Year"]];for(const o of e){const n=o.metadata;if(!(a.targets.length>0&&!n.targets.some(l=>a.targets.includes(l)))&&!(a.category&&a.category!=="All"&&n.category!==a.category))for(const l of((r=o.geojson)==null?void 0:r.features)||[]){const c=l.properties||{};a.province&&a.province!=="All"&&c.province!==a.province||a.realm&&a.realm!=="All"&&c.realm!==a.realm||a.year&&a.year!=="All"&&String(c.year)!==String(a.year)||s.push([n.name,n.category,c.realm||"",c.province||"",c.name||"",(c.area_ha||0).toFixed(2),(c.targets||[]).join(";"),c.status||"",c.year||""])}}const i=s.map(o=>o.map(n=>`"${String(n).replace(/"/g,'""')}"`).join(",")).join(`
`);Jn(i,"nbsap-export.csv","text/csv")}function Yc(){const e=H().filters,a=Gt(),s=e.targets.length===0||e.targets.includes("T3"),i={type:"TOR_Reporting_Snapshot",version:"1.0",timestamp:new Date().toISOString(),filters:{...e},includedLayers:[],metrics:{}};s&&(i.metrics=Je(a,e));const r=Ci(a,e);i.metrics.general=r;for(const n of a){const l=n.metadata;e.targets.length>0&&!l.targets.some(c=>e.targets.includes(c))||e.category&&e.category!=="All"&&l.category!==e.category||i.includedLayers.push({id:l.id,name:l.name,category:l.category,targets:l.targets,realm:l.realm,featureCount:l.featureCount,totalAreaHa:l.totalAreaHa,countsToward30x30:l.countsToward30x30,status:l.status})}const o=JSON.stringify(i,null,2);Jn(o,"tor-snapshot.json","application/json")}async function Jc(){const t=Vn(),e=document.getElementById("map");if(!t||!e){Qe("Map not ready. Please wait for layers to load.");return}try{const a=t.getSize(),s=2,i=document.createElement("canvas");i.width=a.x*s,i.height=a.y*s;const r=i.getContext("2d");r.scale(s,s),r.fillStyle="#fff",r.fillRect(0,0,a.x,a.y);const o=e.querySelector(".leaflet-map-pane"),n=Re(o),l=e.querySelector(".leaflet-tile-pane");if(l){const u=l.querySelectorAll(".leaflet-tile-container");for(const d of u){const p=Re(d),f=d.querySelectorAll("img.leaflet-tile");for(const m of f)if(!(!m.complete||m.naturalWidth===0))try{const g=Re(m),v=n.x+p.x+g.x,y=n.y+p.y+g.y;r.drawImage(m,v,y,m.width,m.height)}catch{}}}const c=e.querySelectorAll(".leaflet-overlay-pane canvas");for(const u of c)if(!(u.width===0||u.height===0))try{const d=Re(e.querySelector(".leaflet-overlay-pane")),p=Re(u),f=n.x+d.x+p.x,m=n.y+d.y+p.y;r.drawImage(u,f,m)}catch{}const h=e.querySelectorAll(".leaflet-overlay-pane svg");for(const u of h)try{const d=new XMLSerializer().serializeToString(u),p=new Blob([d],{type:"image/svg+xml;charset=utf-8"}),f=URL.createObjectURL(p),m=await Zc(f);URL.revokeObjectURL(f);const g=Re(e.querySelector(".leaflet-overlay-pane")),v=u.getBoundingClientRect(),y=e.getBoundingClientRect(),_=v.left-y.left,b=v.top-y.top;r.drawImage(m,_,b,v.width,v.height)}catch{}r.fillStyle="rgba(255,255,255,0.8)",r.fillRect(0,a.y-22,a.x,22),r.fillStyle="#555",r.font="11px sans-serif",r.fillText("Vanuatu NBSAP GIS Portal — "+new Date().toLocaleDateString("en-GB"),8,a.y-7),i.toBlob(u=>{if(u){const d=URL.createObjectURL(u),p=document.createElement("a");p.href=d,p.download="nbsap-map.png",p.click(),URL.revokeObjectURL(d)}},"image/png")}catch(a){console.error("Map PNG export failed:",a),Qe("Map PNG export failed. Try using browser Print/Screenshot (Ctrl+Shift+S) instead.")}}function Re(t){var r;if(!t)return{x:0,y:0};const e=((r=t.style)==null?void 0:r.transform)||window.getComputedStyle(t).transform||"",a=e.match(/translate3d\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);if(a)return{x:parseFloat(a[1]),y:parseFloat(a[2])};const s=e.match(/translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/);if(s)return{x:parseFloat(s[1]),y:parseFloat(s[2])};const i=e.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/);return i?{x:parseFloat(i[1]),y:parseFloat(i[2])}:{x:0,y:0}}function Zc(t){return new Promise((e,a)=>{const s=new Image;s.onload=()=>e(s),s.onerror=a,s.src=t})}function Jn(t,e,a){const s=new Blob([t],{type:a}),i=URL.createObjectURL(s),r=document.createElement("a");r.href=i,r.download=e,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}const de=[{id:"spatial-plans",name:"Biodiversity Spatial Plans",category:"SPATIAL_PLAN",target:"T1",realm:"terrestrial",countsToward30x30:!1,description:"Provincial and municipal physical plans with CCA boundary zones"},{id:"kba-terrestrial",name:"Key Biodiversity Areas",category:"KBA",target:"T1",realm:"terrestrial",countsToward30x30:!1,description:"Sites of global importance for biodiversity (BirdLife / KBA Partnership)"},{id:"mpa-spatial-plan",name:"Marine Protected Areas (Spatial Planning)",category:"MPA",target:"T1",realm:"marine",countsToward30x30:!1,description:"Marine protected areas included in biodiversity spatial planning"},{id:"lmma-spatial-plan",name:"Locally Managed Marine Areas (Spatial Planning)",category:"LMMA",target:"T1",realm:"marine",countsToward30x30:!1,description:"Community-managed marine areas included in biodiversity spatial planning"},{id:"degraded-terrestrial",name:"Degraded Terrestrial Areas",category:"DEGRADED",target:"T2",realm:"terrestrial",countsToward30x30:!1,description:"Mapped degraded terrestrial and inland water ecosystems"},{id:"degraded-marine",name:"Degraded Marine & Coastal Areas",category:"DEGRADED",target:"T2",realm:"marine",countsToward30x30:!1,description:"Mapped degraded marine and coastal ecosystems"},{id:"restoration-sites",name:"Ecosystem Restoration Sites",category:"RESTORATION",target:"T2",realm:"terrestrial",countsToward30x30:!1,description:"Active and planned restoration sites for degraded ecosystems"},{id:"eez-boundary",name:"Exclusive Economic Zone (EEZ)",category:"EEZ",target:"T3",realm:"marine",countsToward30x30:!1,isReference:!0,description:"Vanuatu EEZ boundary — used to derive marine baseline area for 30x30 target"},{id:"admin0-boundary",name:"National Boundary (Admin0 Coastline)",category:"ADMIN_BOUNDARY",target:"T3",realm:"terrestrial",countsToward30x30:!1,isReference:!0,description:"Vanuatu national boundary / coastline — used as terrestrial baseline for 30x30 target"},{id:"cca-terrestrial",name:"Community Conserved Areas",category:"CCA",target:"T3",realm:"terrestrial",countsToward30x30:!0,description:"Community-managed conservation areas (Custom Tabu Areas, Community Conservation Areas)"},{id:"mpa-marine",name:"Marine Protected Areas",category:"MPA",target:"T3",realm:"marine",countsToward30x30:!0,description:"Nationally designated marine protected areas and management zones"},{id:"lmma-marine",name:"Locally Managed Marine Areas",category:"LMMA",target:"T3",realm:"marine",countsToward30x30:!0,description:"LMMAs managed by local communities for marine resource conservation"},{id:"pa-terrestrial",name:"Protected Areas (WDPA)",category:"PA",target:"T3",realm:"terrestrial",countsToward30x30:!0,description:"Protected areas from the World Database on Protected Areas"},{id:"oecm-terrestrial",name:"Other Effective Conservation Measures",category:"OECM",target:"T3",realm:"terrestrial",countsToward30x30:!0,description:"OECMs contributing to in-situ conservation outside protected areas"},{id:"megapode-distribution",name:"Vanuatu Megapode Distribution",category:"MEGAPODE",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range and nesting sites of Megapodius layardi (Vanuatu Megapode) — endemic ground-nesting bird"},{id:"starling-distribution",name:"Vanuatu Mountain Starling Distribution",category:"STARLING",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range of Aplonis santovestris (Vanuatu Mountain Starling) — critically endangered endemic bird"},{id:"fantail-distribution",name:"Vanuatu Streaked Fantail Distribution",category:"FANTAIL",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range of Rhipidura spilodera (Vanuatu Streaked Fantail) — endemic passerine bird"},{id:"kingfisher-distribution",name:"Vanuatu Kingfisher Distribution",category:"KINGFISHER",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range of Todiramphus farquhari (Vanuatu Kingfisher) — endemic kingfisher species"},{id:"flying-fox-distribution",name:"Vanuatu Flying Fox Distribution",category:"FLYING_FOX",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range and roost sites of Pteropus anetianus (Vanuatu Flying Fox) — endemic fruit bat"},{id:"plerandra-distribution",name:"Plerandra vanuatuensis Distribution",category:"PLERANDRA",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Distribution range of Plerandra vanuatuensis — endemic plant species of Vanuatu"},{id:"kba-t4",name:"Key Biodiversity Areas",category:"KBA",target:"T4",realm:"terrestrial",countsToward30x30:!1,description:"Key Biodiversity Areas (KBAs) of Vanuatu — sites of global importance for biodiversity (BirdLife / KBA Partnership)"},{id:"merremia-detection",name:"Merremia peltata (Big Leaf)",category:"MERREMIA",target:"T6",realm:"terrestrial",countsToward30x30:!1,description:"Remote sensing and field survey detections of Merremia peltata invasive vine coverage"},{id:"crown-of-thorns",name:"Crown of Thorns Starfish",category:"CROWN_OF_THORNS",target:"T6",realm:"marine",countsToward30x30:!1,description:"Acanthaster planci (Crown-of-Thorns starfish) outbreak locations and affected reef areas"},{id:"mile-a-minute",name:"Mile a Minute Vine",category:"MILE_A_MINUTE",target:"T6",realm:"terrestrial",countsToward30x30:!1,description:"Mikania micrantha (Mile a Minute) invasive vine distribution and coverage areas"},{id:"solanum-torvum",name:"Solanum torvum (Devil Fig)",category:"SOLANUM_TORVUM",target:"T6",realm:"terrestrial",countsToward30x30:!1,description:"Solanum torvum (Devil Fig / Prickly Nightshade) distribution and infestation areas"},{id:"invasive-species",name:"Other Invasive Alien Species",category:"INVASIVE",target:"T6",realm:"terrestrial",countsToward30x30:!1,description:"Fire Ants, African Snail, Sako, Coconut Beetle and other IAS"},{id:"pesticide-areas",name:"Pesticide & Herbicide Use Areas",category:"PESTICIDE",target:"T7",realm:"terrestrial",countsToward30x30:!1,description:"Areas of pesticide and herbicide use in large-scale and small-scale commercial farming"},{id:"eutrophication-zones",name:"Coastal Eutrophication Zones",category:"EUTROPHICATION",target:"T8",realm:"marine",countsToward30x30:!1,description:"Mapped coastal eutrophication and nutrient-impacted zones"},{id:"land-cover",name:"Land Cover / Land Use Change",category:"LAND_COVER",target:"T10",realm:"terrestrial",countsToward30x30:!1,description:"Land cover change mapping for agriculture, livestock, fisheries and forestry"},{id:"green-spaces",name:"Blue & Green Spaces",category:"GREEN_SPACE",target:"T12",realm:"terrestrial",countsToward30x30:!1,description:"Parks within provincial and municipal areas, and botanical gardens"}],Zn="print-map-overlay";function Ca(t,e,a){var s,i,r,o;if(e==="T3")return Je(t,a);if(e==="T1"){const n=Cs(t,a);return{...n,totalAreaHa:n.terrestrial_ha+n.marine_ha,grossAreaHa:n.gross_terrestrial_ha+n.gross_marine_ha,realmTotals:{terrestrial_ha:n.terrestrial_ha,marine_ha:n.marine_ha,gross_terrestrial_ha:n.gross_terrestrial_ha,gross_marine_ha:n.gross_marine_ha},typeBreakdown:[]}}if(e==="T2"){const n=Pi(t,a),l=(((s=n.realmTotals)==null?void 0:s.degraded_terrestrial_ha)||0)+(((i=n.realmTotals)==null?void 0:i.restoration_terrestrial_ha)||0),c=(((r=n.realmTotals)==null?void 0:r.degraded_marine_ha)||0)+(((o=n.realmTotals)==null?void 0:o.restoration_marine_ha)||0);return{...n,totalAreaHa:n.degraded_ha+n.restoration_ha,grossAreaHa:n.gross_degraded_ha+n.gross_restoration_ha,realmTotals:{terrestrial_ha:l,marine_ha:c,gross_terrestrial_ha:l,gross_marine_ha:c},typeBreakdown:[]}}return fe(t,e,a)}const Da='<svg width="48" height="36" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="border:0.5px solid #ccc;border-radius:2px;flex-shrink:0"><defs><clipPath id="vu-a"><path d="M0 0v475l420-195h480v-85H420Z"/></clipPath></defs><path fill="#009543" d="M0 0h640v480H0z"/><path fill="#d21034" d="M0 0h640v240H0z"/><g clip-path="url(#vu-a)" transform="scale(.71111 1.01053)"><path stroke="#fdce12" stroke-width="110" d="m0 0 420 195h480v85H420L0 475"/><path fill="none" stroke="#000" stroke-width="60" d="m0 0 420 195h480m0 85H420L0 475"/></g><g fill="#fdce12" transform="translate(-22)scale(1.01053)"><path d="M106.9 283v27c23.5 0 69.7-18 69.7-76.1s-49.3-68.9-64-68.9-60.3 10.6-60.3 58c0 47.6 44.7 52 53.5 52s41.8-8 38-43.6a35.5 35.5 0 0 1-35.4 31.5c-24 0-39-17.8-39-35.4s14.6-41.2 39.9-41.2 43.8 22.5 43.8 45.1-17.8 51.5-46.2 51.5z"/><g id="vu-b"><path stroke="#fdce12" stroke-width=".8" d="m86.2 247.7 1.4 1s11.2-25.5 41.1-43.6c-3.8 2-23.8 12-42.5 42.6z"/><path d="M89.1 243.3s-3.4-7-.4-10.2 1.7 8.3 1.7 8.3l1.3-1.9s-2-8.6.2-10.4 1.2 8.3 1.2 8.3l1.4-1.8s-1.5-8.4.7-10 .9 8 .9 8l1.6-2s-1.2-8 1.5-9.9.3 7.6.3 7.6l1.8-2s-.8-7.3 1.5-9c2.3-1.6.4 7 .4 7l1.6-1.8s-.5-6.8 1.7-8.4.2 6.5.2 6.5l1.7-1.6s-.4-6.9 2.4-8.2-.5 6.4-.5 6.4l2-1.6s.5-8 2.9-8.7c2.4-.8-1 7-1 7l1.7-1.4s.9-6.8 3.5-7.6c2.7-.9-1.6 6.2-1.6 6.2l1.7-1.3s1.9-6.8 4.4-7.6c2.4-.7-2.6 6.5-2.6 6.5l1.7-1.2s2.7-6.2 5-6.6c2.1-.4-2.6 5.1-2.6 5.1l2.1-1.2s3.5-6.4 4.8-4.5-5 4.9-5 4.9l-2 1.2s7.5-3.6 8.4-1.8-10.3 3-10.3 3l-1.8 1.2s7.5-2 6.6-.1-8.4 1.5-8.4 1.5l-1.7 1.2s7.5-1.8 6.5 0c-1 1.6-8.3 1.5-8.3 1.5l-1.8 1.5s7.3-2 6.2.3-9.4 2.1-9.4 2.1l-2 2s7.7-2.7 7-.6c-.6 2-9.4 3-9.4 3l-2 2s8.3-2.7 5.8-.2c-2.4 2.6-8.5 3.2-8.5 3.2l-2.3 3s8.2-5 7-2.2-9.2 4.7-9.2 4.7l-1.6 2s7.4-4.3 6.6-2c-.7 2.5-8.6 5-8.6 5l-1.3 1.8s8.7-5.2 8-2.5c-.8 2.6-9.1 4.5-9.1 4.5l-1 1.7s8-4.7 8-2.4c.2 2.2-9.4 4.4-9.4 4.4z"/></g><use xlink:href="#vu-b" width="100%" height="100%" transform="matrix(-1 0 0 1 220 0)"/></g></svg>';function Fa(t){return Gt().filter(a=>{var s,i;return(i=(s=a.metadata)==null?void 0:s.targets)==null?void 0:i.includes(t)})}function Ls(t){return Ut.targets.find(e=>e.code===t)}function qi(t){return de.filter(e=>e.target===t)}function Yt(t){return!t&&t!==0?"0":t>=1e6?(t/1e6).toFixed(2)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toFixed(1)}function z(t){return!t&&t!==0?"0.00":t.toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}function ot(t){return!t&&t!==0?"0.0%":t.toFixed(1)+"%"}function Hi(t,e){let s=dc(t).map(i=>{var o;const r=i.label||((o=Y[i.key])==null?void 0:o.label)||i.key;return`<div class="print-legend-item">
      <span class="print-legend-swatch" style="background:${i.fill};border-color:${i.stroke}"></span>
      <span>${r}</span>
    </div>`}).join("");return e&&(s+='<div class="print-legend-item"><span class="print-legend-swatch print-legend-swatch-province"></span><span>Province Boundary</span></div>'),s}async function Xn(t){ge();const e=Ls(t);if(!e)return;await sa([t]),Vt();const a=Is([t]);document.body.appendChild(a),document.body.classList.add("print-mode");const s=a.querySelector("#print-pages");Qn(s,t,e),a.querySelector("#print-close-btn").addEventListener("click",ge),a.querySelector("#print-print-btn").addEventListener("click",()=>window.print())}async function Xc(t){ge();const e=Ls(t);if(!e)return;await sa([t]),Vt();const a=H(),s=a.provinces||[];if(s.length===0)return;const i=Is([t],`${t} — By Province (${s.length})`);document.body.appendChild(i),document.body.classList.add("print-mode");const r=i.querySelector("#print-pages"),o=Fa(t),n=sd(t,o,s);let l=0;function c(){if(l>=s.length)return;const h=rd(r,t,e,s[l],n);l++,requestAnimationFrame(()=>{Ns(h,t,o,a.provincesGeojson,s[l-1],!0),setTimeout(()=>requestAnimationFrame(c),600)})}c(),i.querySelector("#print-close-btn").addEventListener("click",ge),i.querySelector("#print-print-btn").addEventListener("click",()=>window.print())}const Qc=[{key:"MEGAPODE",name:"Vanuatu Megapode",scientific:"Megapodius layardi",taxa:"Bird"},{key:"STARLING",name:"Vanuatu Mountain Starling",scientific:"Aplonis santovestris",taxa:"Bird"},{key:"FANTAIL",name:"Vanuatu Streaked Fantail",scientific:"Rhipidura spilodera",taxa:"Bird"},{key:"KINGFISHER",name:"Vanuatu Kingfisher",scientific:"Todiramphus farquhari",taxa:"Bird"},{key:"FLYING_FOX",name:"Vanuatu Flying Fox",scientific:"Pteropus anetianus",taxa:"Mammal"},{key:"PLERANDRA",name:"Plerandra vanuatuensis",scientific:"Plerandra vanuatuensis",taxa:"Plant"}];async function td(t){var h,u,d,p,f,m,g;ge();const e=Ls(t);if(!e)return;await sa([t]),Vt();const a=H(),s=Fa(t),i=[];for(const v of Qc){const y=[];for(const _ of s)if(!((h=_.metadata)!=null&&h.isReference)&&((u=_.metadata)==null?void 0:u.category)===v.key)for(const b of((d=_.geojson)==null?void 0:d.features)||[])y.push(b);y.length>0&&i.push({...v,features:y})}const r=["KBA","SPECIES_DIST"];for(const v of r){const y=[];for(const _ of s)if(!((p=_.metadata)!=null&&p.isReference)&&((f=_.metadata)==null?void 0:f.category)===v)for(const b of((m=_.geojson)==null?void 0:m.features)||[])y.push(b);if(y.length>0){const _=((g=Y[v])==null?void 0:g.label)||v;i.push({key:v,name:_,scientific:"",taxa:"",features:y})}}if(i.length===0)return;const o=Is([t],`T4 — By Species (${i.length})`);document.body.appendChild(o),document.body.classList.add("print-mode");const n=o.querySelector("#print-pages");let l=0;function c(){if(l>=i.length)return;const v=i[l],y=ed(n,t,e,v);l++,requestAnimationFrame(()=>{ad(y,v,a.provincesGeojson),setTimeout(()=>requestAnimationFrame(c),600)})}c(),o.querySelector("#print-close-btn").addEventListener("click",ge),o.querySelector("#print-print-btn").addEventListener("click",()=>window.print())}function ed(t,e,a,s,i,r){var P,$,S,A,M;const o=ct.nationalBaselines,n=s.features,l=n.filter(k=>!ya(k)),c=n.filter(k=>ya(k)),h=c.length>0;let u=0,d=0,p=0;for(const k of l)d+=((P=k.properties)==null?void 0:P.area_ha)||0;for(const k of c)p+=(($=k.properties)==null?void 0:$.area_ha)||0;u=d+p;const f={};for(const k of n){const C=((S=k.properties)==null?void 0:S.province)||"Unassigned";f[C]||(f[C]={resident:0,extinct:0,features:0,area_ha:0}),f[C].features++;const G=((A=k.properties)==null?void 0:A.area_ha)||0;f[C].area_ha+=G,ya(k)?f[C].extinct++:f[C].resident++}const m=document.createElement("div");m.className="print-page";const g=`print-map-species-${s.key}`,v=mt(s.key),y=`
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${Yt(u)}</span><span class="print-metric-label">Total Area (ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${n.length}</span><span class="print-metric-label">Records</span></div>
      ${h?`
        <div class="print-metric"><span class="print-metric-value">${l.length}</span><span class="print-metric-label">Resident Records</span></div>
        <div class="print-metric"><span class="print-metric-value">${c.length}</span><span class="print-metric-label">Extinct Records</span></div>
      `:`
        <div class="print-metric"><span class="print-metric-value">${Object.keys(f).length}</span><span class="print-metric-label">Provinces</span></div>
        <div class="print-metric"><span class="print-metric-value">${Yt(d)}</span><span class="print-metric-label">Distribution (ha)</span></div>
      `}
      <div class="print-metric"><span class="print-metric-value">${ot(o.terrestrial_ha>0?u/o.terrestrial_ha*100:0)}</span><span class="print-metric-label">% National Land</span></div>
      <div class="print-metric"><span class="print-metric-value"><span class="cat-dot" style="background:${v.fill};border-color:${v.stroke}"></span></span><span class="print-metric-label">${((M=Y[s.key])==null?void 0:M.label)||s.name}</span></div>
    </div>
  `;let _=`<div class="print-legend-item">
    <span class="print-legend-swatch" style="background:${v.fill};border-color:${v.stroke}"></span>
    <span>${s.name}${h?" (Resident)":""}</span>
  </div>`;h&&(_+=`<div class="print-legend-item">
      <span class="print-legend-swatch" style="background:#B0BEC5;border-color:#78909C;border-style:dashed"></span>
      <span>${s.name} (Extinct)</span>
    </div>`),_+='<div class="print-legend-item"><span class="print-legend-swatch print-legend-swatch-province"></span><span>Province Boundary</span></div>';const b=Object.entries(f).sort((k,C)=>C[1].area_ha-k[1].area_ha);let x="";if(b.length>0){const k=b.map(([N,O])=>{const F=h?`<td class="r">${O.resident}</td><td class="r">${O.extinct}</td>`:"";return`<tr><td>${N}</td><td class="r">${z(O.area_ha)}</td><td class="r">${O.features}</td>${F}</tr>`}).join(""),C=b.reduce((N,[,O])=>N+O.features,0),G=b.reduce((N,[,O])=>N+O.area_ha,0),T=h?'<th class="r">Resident</th><th class="r">Extinct</th>':"",I=h?`<td class="r"><b>${l.length}</b></td><td class="r"><b>${c.length}</b></td>`:"";x=`
      <div class="print-detail-table">
        <div class="print-section-title">Province Distribution</div>
        <table>
          <thead><tr><th>Province</th><th class="r">Area (ha)</th><th class="r">Records</th>${T}</tr></thead>
          <tbody>${k}</tbody>
          <tfoot><tr class="total-row"><td><b>TOTAL</b></td><td class="r"><b>${z(G)}</b></td><td class="r"><b>${C}</b></td>${I}</tr></tfoot>
        </table>
      </div>
    `}const w=s.scientific?`<i>${s.scientific}</i>`:"",E=s.taxa?` (${s.taxa})`:"";return m.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${Da}
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
      <div class="print-target-code" style="background:${v.fill}">${s.key}</div>
      <div class="print-target-info">
        <div class="print-target-name">${s.name}${E}</div>
        <div class="print-target-desc">${w} &mdash; T4: Species &amp; Biodiversity Distribution</div>
      </div>
    </div>

    ${y}

    <div class="print-map-area">
      <div class="print-map-container" id="${g}"></div>
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

    <div class="print-summary-line">${s.name}: ${z(u)} ha across ${Object.keys(f).length} province${Object.keys(f).length!==1?"s":""} | ${n.length} records</div>

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
  `,t.appendChild(m),g}function ad(t,e,a){if(!document.getElementById(t))return;const i=D.map(t,{center:ct.mapCenter,zoom:ct.mapZoom,zoomControl:!1,attributionControl:!1,dragging:!1,scrollWheelZoom:!1,doubleClickZoom:!1,touchZoom:!1,preferCanvas:!0});D.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{maxZoom:19}).addTo(i),D.control.scale({imperial:!1,position:"bottomleft",maxWidth:150}).addTo(i),a&&D.geoJSON(a,{style:()=>({color:"#777",weight:1.2,fillOpacity:.02,dashArray:"4 4"}),onEachFeature:(y,_)=>{const b=y.properties.name||y.properties.province||"";b&&_.bindTooltip(b,{permanent:!0,direction:"center",className:"print-province-label"})}}).addTo(i);const r=D.featureGroup(),o=e.features,n=o.filter(y=>!ya(y)),l=o.filter(y=>ya(y)),c=e.key,h=Ln(c),u=lc(),d=In(c),p=cc(),f=l.filter(y=>{var b;const _=(b=y.geometry)==null?void 0:b.type;return _==="Polygon"||_==="MultiPolygon"}),m=l.filter(y=>{var b;const _=(b=y.geometry)==null?void 0:b.type;return _==="Point"||_==="MultiPoint"});if(f.length>0){const y=ht(f);y?r.addLayer(D.geoJSON(y,{style:()=>u})):r.addLayer(D.geoJSON({type:"FeatureCollection",features:f},{style:()=>u}))}m.length>0&&r.addLayer(D.geoJSON({type:"FeatureCollection",features:m},{pointToLayer:(y,_)=>D.circleMarker(_,p)}));const g=n.filter(y=>{var b;const _=(b=y.geometry)==null?void 0:b.type;return _==="Polygon"||_==="MultiPolygon"}),v=n.filter(y=>{var b;const _=(b=y.geometry)==null?void 0:b.type;return _==="Point"||_==="MultiPoint"});if(g.length>0){const y=ht(g);y?r.addLayer(D.geoJSON(y,{style:()=>h})):r.addLayer(D.geoJSON({type:"FeatureCollection",features:g},{style:()=>h}))}v.length>0&&r.addLayer(D.geoJSON({type:"FeatureCollection",features:v},{pointToLayer:(y,_)=>D.circleMarker(_,d)})),r.addTo(i),setTimeout(()=>{if(i.invalidateSize(),r.getLayers().length>0){const y=r.getBounds();y.isValid()&&i.fitBounds(y,{padding:[40,40],maxZoom:12})}},200)}function sd(t,e,a){var d,p,f,m;const s={},i={};for(const g of a)s[g]=[],i[g]=new Map;const r=new Set(a);for(const g of e){if((d=g.metadata)!=null&&d.isReference)continue;const v=g.id||((p=g.metadata)==null?void 0:p.name)||"unknown";for(const y of((f=g.geojson)==null?void 0:f.features)||[]){const _=(m=y.properties)==null?void 0:m.province;if(_&&r.has(_)){s[_].push(y);let b=i[_].get(v);b||(b=[],i[_].set(v,b)),b.push(y)}}}const o=Hi(e,!0),n=Gt(),c=Ca(n,t,{targets:[t],province:"All",category:"All",realm:"All",year:"All"}),h={};for(const g of a){const v={targets:[t],province:g,category:"All",realm:"All",year:"All"};h[g]=Ca(n,t,v)}const u=qi(t);return{provinceFeatures:s,provinceFeaturesPerLayer:i,legendHtml:o,nationalMetrics:c,provinceMetrics:h,expected:u,layers:e}}async function id(){ge();const t=Ut.targets.map(n=>n.code);await sa(t),Vt();const e=Is(t);document.body.appendChild(e),document.body.classList.add("print-mode");const a=e.querySelector("#print-pages"),s=H(),i=[];for(const n of t){const l=Ls(n);if(!l)continue;const c=Qn(a,n,l,!0);i.push({mapId:c,code:n,layers:Fa(n)})}let r=0;function o(){if(r>=i.length)return;const{mapId:n,code:l,layers:c}=i[r];r++,Ns(n,l,c,s.provincesGeojson),setTimeout(()=>requestAnimationFrame(o),600)}requestAnimationFrame(o),e.querySelector("#print-close-btn").addEventListener("click",ge),e.querySelector("#print-print-btn").addEventListener("click",()=>window.print())}function ge(){const t=document.getElementById(Zn);t&&t.remove(),document.body.classList.remove("print-mode")}function Is(t,e){const a=document.createElement("div");a.id=Zn,a.className="print-overlay";const s=e?`Print Maps: ${e}`:t.length===1?`Print Map: ${t[0]}`:`Print All Target Maps (${t.length})`;return a.innerHTML=`
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
  `,a}function Qn(t,e,a,s=!1){var T,I,N,O,F,U,st;const i=H(),r=Gt(),o=Fa(e),n=qi(e),l=ct.nationalBaselines,c=Ca(r,e,{targets:[e],province:"All",category:"All",realm:"All",year:"All"});let h=0,u=0;for(const K of o){if((T=K.metadata)!=null&&T.isReference){u++;continue}h+=((N=(I=K.geojson)==null?void 0:I.features)==null?void 0:N.length)||0}const d=o.length-u,p=e==="T3",f=p?c.terrestrial_ha||0:((O=c.realmTotals)==null?void 0:O.terrestrial_ha)||0,m=p?c.marine_ha||0:((F=c.realmTotals)==null?void 0:F.marine_ha)||0,g=p?c.gross_terrestrial_ha||0:((U=c.realmTotals)==null?void 0:U.gross_terrestrial_ha)||0,v=p?c.gross_marine_ha||0:((st=c.realmTotals)==null?void 0:st.gross_marine_ha)||0,y=p?f+m:c.totalAreaHa||0;p?g+v:c.grossAreaHa;const _=l.terrestrial_ha>0?f/l.terrestrial_ha*100:0,b=l.marine_ha>0?m/l.marine_ha*100:0,x=document.createElement("div");x.className="print-page";const w=`print-map-${e}`,E=Hi(o,!!i.provincesGeojson),P=`
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${Yt(f)}</span><span class="print-metric-label">Terrestrial (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${Yt(m)}</span><span class="print-metric-label">Marine (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${ot(_)}</span><span class="print-metric-label">% Land (of ${Yt(l.terrestrial_ha)})</span></div>
      <div class="print-metric"><span class="print-metric-value">${ot(b)}</span><span class="print-metric-label">% Sea (of ${Yt(l.marine_ha)})</span></div>
      <div class="print-metric"><span class="print-metric-value">${h.toLocaleString()}</span><span class="print-metric-label">Records</span></div>
      <div class="print-metric"><span class="print-metric-value">${d}</span><span class="print-metric-label">Data Layers</span></div>
    </div>
  `,$=(c==null?void 0:c.provinceBreakdown)||[];let S="";if($.length>0){const K=$.map(it=>{const vt=it.province||"Unknown",Bt=it.terrestrial_ha??0,Wt=it.marine_ha??0,Kt=it.total_ha??0,J=it.features??0;return`<tr><td>${vt}</td><td class="r">${z(Bt)}</td><td class="r">${z(Wt)}</td><td class="r"><b>${z(Kt)}</b></td><td class="r">${J}</td></tr>`}).join(""),W=$.reduce((it,vt)=>it+(vt.terrestrial_ha||0),0),at=$.reduce((it,vt)=>it+(vt.marine_ha||0),0),Tt=$.reduce((it,vt)=>it+(vt.total_ha||0),0),bt=$.reduce((it,vt)=>it+(vt.features||0),0);S=`
      <div class="print-detail-table">
        <div class="print-section-title">Provincial Breakdown</div>
        <table>
          <thead><tr><th>Province</th><th class="r">Terrestrial (ha)</th><th class="r">Marine (ha)</th><th class="r">Total (ha)</th><th class="r">Records</th></tr></thead>
          <tbody>${K}</tbody>
          <tfoot><tr class="total-row"><td><b>TOTAL</b></td><td class="r"><b>${z(W)}</b></td><td class="r"><b>${z(at)}</b></td><td class="r"><b>${z(Tt)}</b></td><td class="r"><b>${bt}</b></td></tr></tfoot>
        </table>
      </div>
    `}const A=(c==null?void 0:c.categoryBreakdown)||[];let M="";A.length>0&&(M=`
      <div class="print-detail-table">
        <div class="print-section-title">Category Breakdown</div>
        <table>
          <thead><tr><th>Category</th><th class="r">Area (ha)</th><th class="r">Records</th></tr></thead>
          <tbody>${A.map(W=>{const at=mt(W.category),Tt=Y[W.category]||{label:W.category};return`<tr><td><span class="cat-dot" style="background:${at.fill};border-color:${at.stroke}"></span>${Tt.label}</td><td class="r">${z(W.area_ha)}</td><td class="r">${W.features}</td></tr>`}).join("")}</tbody>
        </table>
      </div>
    `);const k=o.map(K=>{var Wt,Kt,J,rt;const W=K.metadata||{},at=W.name||K.id,Tt=((Wt=Y[W.category])==null?void 0:Wt.label)||W.category||"-",bt=W.realm||"terrestrial",it=((J=(Kt=K.geojson)==null?void 0:Kt.features)==null?void 0:J.length)||0;(((rt=K.geojson)==null?void 0:rt.features)||[]).reduce((_e,Dt)=>{var Lt;return _e+(((Lt=Dt.properties)==null?void 0:Lt.area_ha)||0)},0);const vt=W.uploadTimestamp?new Date(W.uploadTimestamp).toLocaleDateString("en-GB"):"-",Bt=W.isReference?'<span class="ref-badge">REF</span>':"";return`<tr><td>${at} ${Bt}</td><td>${Tt}</td><td>${bt}</td><td class="r">${it}</td><td>${vt}</td></tr>`}).join("");o.length>0&&`${k}`;const C=`Total area: ${z(y)} ha | ${h} records across ${o.filter(K=>{var W;return!((W=K.metadata)!=null&&W.isReference)}).length} dataset${o.filter(K=>{var W;return!((W=K.metadata)!=null&&W.isReference)}).length!==1?"s":""}`;x.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${Da}
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

    ${P}

    <div class="print-map-area">
      <div class="print-map-container" id="${w}"></div>
      <div class="print-map-furniture">
        <div class="print-legend-box">
          <div class="print-legend-title">Legend</div>
          ${E}
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

    <div class="print-summary-line">${C}</div>

    <div class="print-bottom-section">
      ${S}
      <div class="print-bottom-right">
        ${M}
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
  `,t.appendChild(x);const G=ld(e,o,c,n,l);return ud(t,e,a,G),s||requestAnimationFrame(()=>{setTimeout(()=>Ns(w,e,o,i.provincesGeojson),100)}),w}function rd(t,e,a,s,i){var M,k,C,G,T;const r=H(),o=(i==null?void 0:i.layers)||Fa(e),n=ct.nationalBaselines,l={targets:[e],province:s,category:"All",realm:"All",year:"All"},c=e==="T3",h=((M=i==null?void 0:i.provinceMetrics)==null?void 0:M[s])||Ca(Gt(),e,l),u=((C=(k=i==null?void 0:i.provinceFeatures)==null?void 0:k[s])==null?void 0:C.length)??o.reduce((I,N)=>{var O,F;return(O=N.metadata)!=null&&O.isReference?I:I+(((F=N.geojson)==null?void 0:F.features)||[]).filter(U=>U.properties.province===s).length},0),d=c?h.terrestrial_ha||0:((G=h.realmTotals)==null?void 0:G.terrestrial_ha)||0,p=c?h.marine_ha||0:((T=h.realmTotals)==null?void 0:T.marine_ha)||0,f=c?d+p:h.totalAreaHa||0,m=c?(h.gross_terrestrial_ha||0)+(h.gross_marine_ha||0):h.grossAreaHa||0,g=n.terrestrial_ha>0?d/n.terrestrial_ha*100:0,v=n.marine_ha>0?p/n.marine_ha*100:0,y=document.createElement("div");y.className="print-page";const _=`print-map-${e}-${s.replace(/\s+/g,"-")}`,b=(i==null?void 0:i.legendHtml)||Hi(o,!0),x=`
    <div class="print-metrics-row">
      <div class="print-metric"><span class="print-metric-value">${Yt(d)}</span><span class="print-metric-label">Terrestrial (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${Yt(p)}</span><span class="print-metric-label">Marine (net, ha)</span></div>
      <div class="print-metric"><span class="print-metric-value">${ot(g)}</span><span class="print-metric-label">% National Land</span></div>
      <div class="print-metric"><span class="print-metric-value">${ot(v)}</span><span class="print-metric-label">% National Sea</span></div>
      <div class="print-metric"><span class="print-metric-value">${u.toLocaleString()}</span><span class="print-metric-label">Records</span></div>
      <div class="print-metric"><span class="print-metric-value">${Yt(f)}</span><span class="print-metric-label">Total Net (ha)</span></div>
    </div>
  `,w=(h==null?void 0:h.categoryBreakdown)||[];let E="";w.length>0&&(E=`
      <div class="print-detail-table">
        <div class="print-section-title">Category Breakdown</div>
        <table>
          <thead><tr><th>Category</th><th class="r">Area (ha)</th><th class="r">Records</th></tr></thead>
          <tbody>${w.map(N=>{const O=mt(N.category),F=Y[N.category]||{label:N.category};return`<tr><td><span class="cat-dot" style="background:${O.fill};border-color:${O.stroke}"></span>${F.label}</td><td class="r">${z(N.area_ha)}</td><td class="r">${N.features}</td></tr>`}).join("")}</tbody>
        </table>
      </div>
    `),o.filter(I=>{var N;return!((N=I.metadata)!=null&&N.isReference)}).map(I=>{var W,at,Tt,bt;const N=I.metadata||{},O=N.name||I.id,F=((W=Y[N.category])==null?void 0:W.label)||N.category||"-",U=I.id||N.name||"unknown",st=((Tt=(at=i==null?void 0:i.provinceFeaturesPerLayer)==null?void 0:at[s])==null?void 0:Tt.get(U))||(((bt=I.geojson)==null?void 0:bt.features)||[]).filter(it=>it.properties.province===s),K=st.reduce((it,vt)=>{var Bt;return it+(((Bt=vt.properties)==null?void 0:Bt.area_ha)||0)},0);return st.length===0?"":`<tr><td>${O}</td><td>${F}</td><td class="r">${st.length}</td><td class="r">${z(K)}</td></tr>`}).filter(Boolean).join("");const P=m>0?((1-f/m)*100).toFixed(1):"0.0",$=`Net area: ${z(f)} ha | Gross area: ${z(m)} ha | Overlap removed: ${P}%`;y.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${Da}
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
      <div class="print-map-container" id="${_}"></div>
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

    <div class="print-summary-line">${$}</div>

    <div class="print-bottom-section">
      ${E}
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Printed: ${new Date().toLocaleString("en-GB")}
      </div>
    </div>
  `,t.appendChild(y);const S=(i==null?void 0:i.expected)||qi(e),A=dd(e,o,h,S,n,s,i==null?void 0:i.nationalMetrics);return hd(t,e,a,s,A),i||requestAnimationFrame(()=>{setTimeout(()=>Ns(_,e,o,r.provincesGeojson,s),100)}),_}const nd={T3:{terrestrial:30,marine:30,label:"30% by 2030 (GBF Target 3)"},T1:{terrestrial:100,marine:100,label:"100% spatial plan coverage (terrestrial & marine)"},T2:{terrestrial:null,marine:null,label:"Map all degraded areas"}},od=["Torba","Sanma","Penama","Malampa","Shefa","Tafea"];function ld(t,e,a,s,i){var it,vt,Bt,Wt,Kt,J,rt,_e,Dt,Lt,we;const r=t==="T3",o=e.filter(et=>{var nt;return!((nt=et.metadata)!=null&&nt.isReference)}),n=e.filter(et=>{var nt;return(nt=et.metadata)==null?void 0:nt.isReference});new Set(o.map(et=>{var nt;return(nt=et.metadata)==null?void 0:nt.category})),new Set(s.map(et=>et.category));const l=s.filter(et=>!o.some(nt=>{var Ua;return((Ua=nt.metadata)==null?void 0:Ua.category)===et.category})),c=s.length>0?Math.round((1-l.length/s.length)*100):o.length>0?100:0;let h=0,u=0,d=0,p=0,f=0,m=0;for(const et of o){const nt=et.metadata||{};h+=((vt=(it=et.geojson)==null?void 0:it.features)==null?void 0:vt.length)||0,p+=nt.validGeometryCount||0,f+=nt.fixedCount||0,m+=nt.droppedCount||0;for(const Ua of((Bt=et.geojson)==null?void 0:Bt.features)||[]){const Va=(Wt=Ua.geometry)==null?void 0:Wt.type;Va==="Polygon"||Va==="MultiPolygon"?u++:(Va==="Point"||Va==="MultiPoint")&&d++}}const g=h>0?Math.round((h-m)/h*100):100,v=r?a.terrestrial_ha||0:((Kt=a.realmTotals)==null?void 0:Kt.terrestrial_ha)||0,y=r?a.marine_ha||0:((J=a.realmTotals)==null?void 0:J.marine_ha)||0,_=r?a.gross_terrestrial_ha||0:((rt=a.realmTotals)==null?void 0:rt.gross_terrestrial_ha)||0,b=r?a.gross_marine_ha||0:((_e=a.realmTotals)==null?void 0:_e.gross_marine_ha)||0,x=r?v+y:a.totalAreaHa||0,w=r?_+b:a.grossAreaHa||0,E=i.terrestrial_ha>0?v/i.terrestrial_ha*100:0,P=i.marine_ha>0?y/i.marine_ha*100:0,$=w>0?(1-x/w)*100:0,S=w>0?x/w:1,A=(a==null?void 0:a.provinceBreakdown)||[],M=A.filter(et=>et.total_ha>0),k=od.filter(et=>!A.some(nt=>nt.province===et&&nt.total_ha>0)),C=A.length>0?A.reduce((et,nt)=>nt.total_ha>et.total_ha?nt:et,A[0]):null,G=M.length>0?M.reduce((et,nt)=>nt.total_ha<et.total_ha?nt:et,M[0]):null,T=(a==null?void 0:a.categoryBreakdown)||[],I=T.length>0?T[0]:null,N=T.length>0&&x>0?T[0].area_ha/x*100:0,O=(a==null?void 0:a.typeBreakdown)||[],F=nd[t];let U=null;if(F){const et=F.terrestrial!==null?Math.max(0,F.terrestrial-E):null,nt=F.marine!==null?Math.max(0,F.marine-P):null;U={threshold:F,tGap:et,mGap:nt}}let st,K,W;o.length===0?(st="No Data",K="#D32F2F",W="cross"):c>=80&&g>=90?(st="Comprehensive",K="#2E7D32",W="check"):c>=50||o.length>=2?(st="Moderate",K="#ED6C02",W="partial"):(st="Minimal",K="#D32F2F",W="warning");const at=[];if(x>0&&at.push(`Total coverage is <strong>${z(x)} ha</strong>, representing <strong>${ot(E)}</strong> of national terrestrial area and <strong>${ot(P)}</strong> of marine area.`),$>5?at.push(`Significant spatial overlap detected: <strong>${$.toFixed(1)}%</strong> of gross area removed during dissolution, indicating overlapping ${((Lt=Y[(Dt=T[0])==null?void 0:Dt.category])==null?void 0:Lt.label)||"conservation"} designations.`):$>0&&w>0&&at.push(`Minimal spatial overlap (<strong>${$.toFixed(1)}%</strong>) between layers — most designations occupy distinct areas.`),C&&M.length>1){const et=x>0?(C.total_ha/x*100).toFixed(0):0;at.push(`<strong>${C.province}</strong> province has the highest coverage (<strong>${z(C.total_ha)} ha</strong>, ${et}% of target total).`)}k.length>0&&o.length>0&&at.push(`<strong>${k.length}</strong> province(s) have no reported data: ${k.join(", ")}.`),r&&U&&(E>=30?at.push(`Terrestrial 30% target <strong>achieved</strong> at ${ot(E)} coverage.`):at.push(`Terrestrial coverage gap: <strong>${ot(U.tGap)}</strong> remaining to reach 30% target (need additional <strong>${z(U.tGap*i.terrestrial_ha/100)} ha</strong>).`),P>=30?at.push(`Marine 30% target <strong>achieved</strong> at ${ot(P)} coverage.`):at.push(`Marine coverage gap: <strong>${ot(U.mGap)}</strong> remaining to reach 30% target (need additional <strong>${z(U.mGap*i.marine_ha/100)} ha</strong>).`)),I&&T.length>1&&N>60&&at.push(`Coverage is concentrated in <strong>${((we=Y[I.category])==null?void 0:we.label)||I.category}</strong> (${N.toFixed(0)}% of total), suggesting limited diversity of designation types.`),n.length>0&&at.push(`${n.length} reference dataset${n.length!==1?"s":""} shown for context (not included in area totals).`),d>0&&u>0?at.push(`Dataset contains both polygon (<strong>${u}</strong>) and point (<strong>${d}</strong>) features. Only polygon features contribute to area calculations.`):d>0&&u===0&&at.push(`Dataset contains only point features (<strong>${d}</strong>). Area calculations are not applicable for point data.`);const Tt=cd(t,{tPct:E,mPct:P,totalNetArea:x,totalFeatures:h,dataLayers:o,catBreakdown:T,typeBreakdown:O,provincesWithData:M,missingLayers:l}),bt=[];return l.length>0&&bt.push(`Upload missing data layers: ${l.map(et=>"<strong>"+et.name+"</strong>").join(", ")}.`),k.length>0&&o.length>0&&bt.push(`Collect and upload spatial data for underrepresented provinces: ${k.join(", ")}.`),g<95&&m>0&&bt.push(`${m} feature(s) had invalid geometries and were dropped. Review source data quality for affected layers.`),f>0&&bt.push(`${f} geometry(s) were automatically repaired. Verify spatial accuracy of corrected features.`),$>20&&bt.push(`High overlap (${$.toFixed(0)}%) suggests potential boundary duplication. Review layer boundaries for redundant designations.`),d>0&&u===0&&bt.push("Convert point observations to polygon coverage areas where feasible to enable area-based reporting."),o.length===0&&bt.push("No data has been uploaded for this target yet. Upload datasets to enable analysis."),{dataLayers:o.length,refLayers:n.length,totalFeatures:h,totalPolygons:u,totalPoints:d,validGeoms:p,fixedGeoms:f,droppedGeoms:m,geomQuality:g,netTerrestrial:v,netMarine:y,grossTerrestrial:_,grossMarine:b,totalNetArea:x,totalGrossArea:w,tPct:E,mPct:P,overlapPct:$,dissolutionFactor:S,dataCompleteness:c,missingLayers:l,provBreakdown:A,provincesWithData:M,provincesWithoutData:k,maxProvince:C,minProvince:G,catBreakdown:T,dominantCategory:I,catConcentration:N,typeBreakdown:O,progressAssessment:U,status:st,statusColor:K,statusIcon:W,findings:at,insights:Tt,recommendations:bt}}function cd(t,e){const a=[];switch(t){case"T1":e.totalNetArea>0&&a.push(`Spatial planning coverage extends to ${ot(e.tPct)} of national land area. Comprehensive spatial plans are essential for effective biodiversity mainstreaming across all development sectors.`),e.catBreakdown.some(s=>s.category==="KBA")&&a.push("Key Biodiversity Areas (KBAs) have been mapped, providing critical context for biodiversity-inclusive spatial planning as required under GBF Target 1.");break;case"T2":if(e.catBreakdown.some(s=>s.category==="DEGRADED")){const s=e.catBreakdown.find(i=>i.category==="DEGRADED");a.push(`Degraded area mapping covers <strong>${z(s.area_ha)} ha</strong>. This baseline is critical for tracking restoration progress under Vanuatu's NBSAP commitments.`)}if(e.catBreakdown.some(s=>s.category==="RESTORATION")){const s=e.catBreakdown.find(i=>i.category==="RESTORATION");a.push(`Active restoration sites total <strong>${z(s.area_ha)} ha</strong>, contributing to the 30% ecosystem restoration goal.`)}e.catBreakdown.some(s=>s.category==="DEGRADED")||a.push("No degraded area mapping data available. Baseline degradation mapping is a prerequisite for planning effective restoration activities.");break;case"T3":{const s=Math.max(0,30-e.tPct),i=Math.max(0,30-e.mPct);if(e.tPct>=30&&e.mPct>=30)a.push("Vanuatu has achieved the GBF 30x30 target for both terrestrial and marine realms. Overlapping areas have been merged to prevent double-counting.");else{const n=[];s>0&&n.push(`terrestrial (${ot(s)} remaining)`),i>0&&n.push(`marine (${ot(i)} remaining)`),a.push(`Progress toward the 30x30 target shows gaps in ${n.join(" and ")}. Expansion of Community Conserved Areas (CCAs) and Locally Managed Marine Areas (LMMAs) represents the most culturally appropriate pathway for Vanuatu.`)}const r=e.catBreakdown.find(n=>n.category==="CCA"),o=e.catBreakdown.find(n=>n.category==="LMMA");if(r||o){const n=[];r&&n.push(`CCAs: ${z(r.area_ha)} ha`),o&&n.push(`LMMAs: ${z(o.area_ha)} ha`),a.push(`Community-based conservation is the primary mechanism: ${n.join("; ")}. These customary management areas reflect Vanuatu's unique governance structure.`)}break}case"T4":if(e.typeBreakdown.length>0){a.push(`Species distribution data covers <strong>${e.typeBreakdown.length}</strong> distinct species/taxa across <strong>${e.totalFeatures}</strong> observation records.`);const s=e.typeBreakdown.slice(0,4).map(i=>i.type).join(", ");a.push(`Mapped species include: ${s}${e.typeBreakdown.length>4?`, and ${e.typeBreakdown.length-4} more`:""}.`)}if(e.missingLayers.length>0){const s=e.missingLayers.map(i=>i.name).join(", ");a.push(`Distribution data is still needed for: ${s}. Complete species mapping is essential for effective conservation planning.`)}break;case"T6":{const s=[{cat:"MERREMIA",name:"Merremia peltata (Big Leaf)",desc:"This invasive vine is one of the most significant threats to Vanuatu's native forest ecosystems, smothering canopy trees and preventing regeneration."},{cat:"CROWN_OF_THORNS",name:"Crown of Thorns Starfish (Acanthaster planci)",desc:"Outbreaks cause devastating coral mortality across reef systems, threatening marine biodiversity and coastal livelihoods."},{cat:"MILE_A_MINUTE",name:"Mile a Minute Vine (Mikania micrantha)",desc:"A fast-growing tropical vine that forms dense mats over native vegetation, blocking sunlight and causing dieback of native species."},{cat:"SOLANUM_TORVUM",name:"Solanum torvum (Devil Fig)",desc:"A woody invasive shrub that colonises disturbed land, pastures and forest margins, displacing native undergrowth and reducing agricultural productivity."}],i=[];for(const o of s){const n=e.catBreakdown.find(l=>l.category===o.cat);n&&(i.push(o.name),a.push(`<strong>${o.name}</strong> covers <strong>${z(n.area_ha)} ha</strong> across ${n.features} feature(s). ${o.desc}`))}const r=e.catBreakdown.find(o=>o.category==="INVASIVE");if(r&&a.push(`Other invasive alien species collectively cover <strong>${z(r.area_ha)} ha</strong> (${r.features} features), including Fire Ants, African Snail, Sako, and Coconut Beetle.`),e.totalNetArea>0&&a.push(`Total IAS-affected area: <strong>${z(e.totalNetArea)} ha</strong> (${ot(e.tPct)} of national terrestrial area). ${i.length} of 4 priority species mapped. Spatial analysis of IAS distribution is critical for prioritising eradication and management interventions.`),e.missingLayers.length>0){const o=e.missingLayers.map(n=>n.name).join(", ");a.push(`Data gaps remain for: ${o}. Complete coverage mapping for all priority IAS is needed for national management planning.`)}break}case"T7":e.totalNetArea>0?a.push(`Pesticide and herbicide use areas cover <strong>${z(e.totalNetArea)} ha</strong>. This mapping supports biodiversity risk assessment for agricultural chemical impacts on adjacent ecosystems.`):a.push("No pesticide/herbicide mapping data available. Systematic mapping of chemical use areas is needed to assess biodiversity impacts from agricultural practices.");break;case"T8":e.totalNetArea>0?a.push(`Coastal eutrophication zones cover <strong>${z(e.totalNetArea)} ha</strong> of marine area. Nutrient pollution monitoring is critical for coral reef health and marine biodiversity in Vanuatu.`):a.push("No coastal eutrophication data available. Establishing water quality monitoring stations at key coastal sites would enable systematic tracking of nutrient impacts.");break;case"T10":if(e.typeBreakdown.length>0){a.push(`Land cover classification includes <strong>${e.typeBreakdown.length}</strong> distinct land use types.`);const s=e.typeBreakdown.slice(0,3).map(i=>`${i.type} (${z(i.area_ha)} ha)`).join(", ");a.push(`Dominant land cover types: ${s}.`)}e.provincesWithData.length>0&&e.provincesWithData.length<6&&a.push(`Land cover data is available for ${e.provincesWithData.length} of 6 provinces. Complete national coverage is needed for comprehensive agricultural and land use change analysis.`);break;case"T12":e.totalNetArea>0&&a.push(`Blue and green space mapping covers <strong>${z(e.totalNetArea)} ha</strong>. These spaces are vital for urban biodiversity, community wellbeing, and climate resilience.`),e.provincesWithData.length>0&&a.push(`Green space data available for ${e.provincesWithData.map(s=>s.province).join(", ")}. Expansion of urban green infrastructure should be prioritised in all provincial capitals.`);break;default:e.totalNetArea>0&&a.push(`Total coverage for this target is <strong>${z(e.totalNetArea)} ha</strong> across ${e.dataLayers.length} data layer(s).`)}return a}function dd(t,e,a,s,i,r,o){var F,U,st,K,W,at,Tt,bt,it,vt,Bt,Wt,Kt;const n=t==="T3",l=e.filter(J=>{var rt;return!((rt=J.metadata)!=null&&rt.isReference)}),c=e.filter(J=>{var rt;return(rt=J.metadata)==null?void 0:rt.isReference});let h=0,u=0,d=0;const p=new Set,f={};for(const J of l){const rt=((F=J.metadata)==null?void 0:F.category)||"OTHER",_e=(((U=J.geojson)==null?void 0:U.features)||[]).filter(Dt=>{var Lt;return((Lt=Dt.properties)==null?void 0:Lt.province)===r});_e.length>0&&p.add(rt);for(const Dt of _e){h++;const Lt=(st=Dt.geometry)==null?void 0:st.type;Lt==="Polygon"||Lt==="MultiPolygon"?u++:(Lt==="Point"||Lt==="MultiPoint")&&d++;const we=((K=Dt.properties)==null?void 0:K.type)||((W=Dt.properties)==null?void 0:W.species_name)||((at=Dt.properties)==null?void 0:at.name)||((Tt=J.metadata)==null?void 0:Tt.name)||"Unknown";f[we]||(f[we]={area_ha:0,features:0}),f[we].area_ha+=((bt=Dt.properties)==null?void 0:bt.area_ha)||0,f[we].features++}}const m=n?a.terrestrial_ha||0:((it=a.realmTotals)==null?void 0:it.terrestrial_ha)||0,g=n?a.marine_ha||0:((vt=a.realmTotals)==null?void 0:vt.marine_ha)||0,v=n?a.gross_terrestrial_ha||0:((Bt=a.realmTotals)==null?void 0:Bt.gross_terrestrial_ha)||0,y=n?a.gross_marine_ha||0:((Wt=a.realmTotals)==null?void 0:Wt.gross_marine_ha)||0,_=n?m+g:a.totalAreaHa||0,b=n?v+y:a.grossAreaHa||0,x=i.terrestrial_ha>0?m/i.terrestrial_ha*100:0,w=i.marine_ha>0?g/i.marine_ha*100:0,E=b>0?(1-_/b)*100:0,P=(a==null?void 0:a.categoryBreakdown)||[],$=Object.entries(f).map(([J,rt])=>({type:J,...rt})).sort((J,rt)=>rt.area_ha-J.area_ha),S=s.filter(J=>!p.has(J.category)),A=s.length>0?Math.round((1-S.length/s.length)*100):h>0?100:0,M=o||(()=>{const J={targets:[t],province:"All",category:"All",realm:"All",year:"All"};return Ca(Gt(),t,J)})(),k=n?(M.terrestrial_ha||0)+(M.marine_ha||0):M.totalAreaHa||0,C=k>0?_/k*100:0;let G,T;h===0?(G="No Data",T="#D32F2F"):A>=80?(G="Comprehensive",T="#2E7D32"):A>=40||p.size>=2?(G="Moderate",T="#ED6C02"):(G="Minimal",T="#D32F2F");const I=[];if(_>0&&I.push(`${r} province contributes <strong>${z(_)} ha</strong> to ${t}, representing <strong>${C.toFixed(1)}%</strong> of the national total for this target.`),m>0&&I.push(`Terrestrial coverage: <strong>${z(m)} ha</strong> (${ot(x)} of national terrestrial baseline).`),g>0&&I.push(`Marine coverage: <strong>${z(g)} ha</strong> (${ot(w)} of national marine baseline).`),E>5&&I.push(`Spatial overlap of <strong>${E.toFixed(1)}%</strong> detected between overlapping designations within ${r}.`),P.length>1){const J=P[0],rt=((Kt=Y[J.category])==null?void 0:Kt.label)||J.category;I.push(`Dominant designation type: <strong>${rt}</strong> (${z(J.area_ha)} ha, ${_>0?(J.area_ha/_*100).toFixed(0):0}% of province total).`)}h===0&&I.push(`No geospatial data has been uploaded for ${r} province under ${t}. This represents a significant data gap.`);const N=[];if(n)_>0&&N.push(`Conservation areas in ${r} include ${P.map(J=>{var rt;return((rt=Y[J.category])==null?void 0:rt.label)||J.category}).join(", ")}. ${r}'s contribution to the 30x30 target should be assessed in the context of its total land and sea area.`),N.push(`Community-based conservation (CCAs, LMMAs) is the primary conservation mechanism in Vanuatu. Engaging local communities in ${r} is essential for expanding and maintaining conservation areas.`);else if(t==="T6")h>0?N.push(`Invasive species data in ${r} covers ${h} features across ${p.size} IAS category(s). Prioritise management interventions in areas adjacent to native forest and reef ecosystems.`):N.push(`No invasive species data available for ${r}. Field surveys should be prioritised to assess IAS presence and distribution in this province.`);else if(t==="T4")h>0&&N.push(`Species distribution records in ${r}: ${h} observations across ${$.length} taxa. Island-specific surveys are important for capturing Vanuatu's high endemism.`);else if(t==="T10"){if($.length>0){const J=$.slice(0,3).map(rt=>`${rt.type} (${z(rt.area_ha)} ha)`).join(", ");N.push(`Land cover in ${r} is dominated by: ${J}. Change detection analysis should focus on forest-to-agriculture conversion and urban expansion.`)}}else _>0&&N.push(`${r} has active data submissions for ${t}. Continued monitoring and data updates will strengthen provincial-level tracking for this NBSAP target.`);const O=[];return S.length>0&&h>0&&O.push(`Upload missing data for ${r}: ${S.map(J=>"<strong>"+J.name+"</strong>").join(", ")}.`),h===0&&O.push(`Prioritise data collection for ${r} to enable provincial-level assessment and reporting for ${t}.`),C>0&&C<5&&k>0&&O.push(`${r} currently contributes only ${C.toFixed(1)}% of the national total. Investigate whether this reflects actual low coverage or a data gap.`),{provinceName:r,totalFeatures:h,totalPolygons:u,totalPoints:d,netTerrestrial:m,netMarine:g,totalNetArea:_,totalGrossArea:b,tPct:x,mPct:w,overlapPct:E,catBreakdown:P,typeBreakdown:$,dataCompleteness:A,missingLayers:S,categoriesPresent:p.size,nationalNetArea:k,provinceSharePct:C,status:G,statusColor:T,findings:I,insights:N,recommendations:O,dataLayers:l.length,refLayers:c.length}}function hd(t,e,a,s,i){const r=document.createElement("div");r.className="print-page print-analysis-page";const o=ct.nationalBaselines,n=pd(e),l={Comprehensive:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',Moderate:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',Minimal:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',"No Data":'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'},c=[{label:"Terrestrial (net)",value:z(i.netTerrestrial)+" ha",pct:ot(i.tPct)},{label:"Marine (net)",value:z(i.netMarine)+" ha",pct:ot(i.mPct)},{label:"Total Area",value:z(i.totalNetArea)+" ha",pct:""},{label:"Total gross (sum)",value:z(i.totalGrossArea)+" ha",pct:""},{label:"Share of national total",value:i.provinceSharePct.toFixed(1)+"%",pct:""},{label:"Overlap removed",value:i.overlapPct.toFixed(1)+"%",pct:""}],h=i.catBreakdown.map(f=>{var y;const m=mt(f.category),g=((y=Y[f.category])==null?void 0:y.label)||f.category,v=i.totalNetArea>0?(f.area_ha/i.totalNetArea*100).toFixed(1):"0.0";return`<tr><td><span class="cat-dot" style="background:${m.fill};border-color:${m.stroke}"></span>${g}</td><td class="r">${z(f.area_ha)}</td><td class="r">${v}%</td><td class="r">${f.features}</td></tr>`}).join("");let u="";if(i.typeBreakdown.length>1){const f=i.typeBreakdown.slice(0,8).map(g=>{const v=i.totalGrossArea>0?(g.area_ha/i.totalGrossArea*100).toFixed(1):"0.0";return`<tr><td>${g.type}</td><td class="r">${z(g.area_ha)}</td><td class="r">${v}%</td><td class="r">${g.features}</td></tr>`}).join("");u=`
      <div class="analysis-card">
        <div class="analysis-card-title">${e==="T10"?"Land Cover Types":e==="T4"?"Species Observed":e==="T6"?"IAS Species":"Type Breakdown"} &mdash; ${s}</div>
        <table class="analysis-table">
          <thead><tr><th>${e==="T4"?"Species":"Type"}</th><th class="r">Area (ha)</th><th class="r">%</th><th class="r">Records</th></tr></thead>
          <tbody>${f}</tbody>
        </table>
      </div>
    `}let d="";if(e==="T3"){const f=Math.min(100,i.tPct/30*100),m=Math.min(100,i.mPct/30*100),g=Math.max(0,30-i.tPct),v=Math.max(0,30-i.mPct);d=`
      <div class="analysis-card">
        <div class="analysis-card-title">30x30 Contribution &mdash; ${s}</div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Terrestrial: <strong>${ot(i.tPct)}</strong> of national baseline</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${f}%;background:${i.tPct>=30?"#2E7D32":"#006B3F"}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${i.tPct>=30?"Provincial contribution exceeds 30% threshold":`National gap: ${z(g*o.terrestrial_ha/100)} ha still needed`}</div>
        </div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Marine: <strong>${ot(i.mPct)}</strong> of national baseline</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${m}%;background:${i.mPct>=30?"#2E7D32":"#0072BC"}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${i.mPct>=30?"Provincial contribution exceeds 30% threshold":`National gap: ${z(v*o.marine_ha/100)} ha still needed`}</div>
        </div>
      </div>
    `}i.missingLayers.length>0&&i.missingLayers.map(f=>`<div class="analysis-gap-item"><span class="analysis-gap-dot"></span>${f.name}</div>`).join("");const p=i.dataCompleteness>=80?"#2E7D32":i.dataCompleteness>=50?"#ED6C02":"#D32F2F";n.proposedActions.slice(0,4).map((f,m)=>`<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F"><strong>${m+1}.</strong></span><span>${f}</span></div>`).join(""),r.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${Da}
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
              ${c.map(f=>`<tr><td>${f.label}</td><td class="r">${f.value}</td><td class="r">${f.pct}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>

        ${d}

        <div class="analysis-card">
          <div class="analysis-card-title">Category Composition &mdash; ${s}</div>
          ${i.catBreakdown.length>0?`
            <table class="analysis-table">
              <thead><tr><th>Category</th><th class="r">Net Area (ha)</th><th class="r">% Total</th><th class="r">Records</th></tr></thead>
              <tbody>${h}</tbody>
            </table>
          `:'<div style="color:#999;font-size:8px">No category data for this province</div>'}
        </div>

        ${u}
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
                <div class="analysis-comp-track"><div class="analysis-comp-fill" style="width:${i.dataCompleteness}%;background:${p}"></div></div>
                <span class="analysis-assess-value" style="color:${p}">${i.dataCompleteness}%</span>
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
            ${i.findings.length>0?i.findings.map(f=>`<div class="analysis-finding-item"><span class="analysis-bullet">&#9654;</span><span>${f}</span></div>`).join(""):'<div style="color:#999;font-size:8px">No data available for analysis</div>'}
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Provincial Insights</div>
          <div class="analysis-findings">
            ${i.insights.length>0?i.insights.map(f=>`<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F">&#9679;</span><span>${f}</span></div>`).join(""):'<div style="color:#999;font-size:8px">Upload data to generate provincial insights</div>'}
          </div>
        </div>
      </div>
    </div>

    <div class="analysis-methodology">
      <strong>Note:</strong> Overlapping areas have been merged to avoid double-counting.
      National baselines: Terrestrial ${z(o.terrestrial_ha)} ha; Marine ${z(o.marine_ha)} ha.
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Generated: ${new Date().toLocaleString("en-GB")} &bull; Provincial Analysis &bull; ${s}
      </div>
    </div>
  `,t.appendChild(r)}function ud(t,e,a,s){const i=document.createElement("div");i.className="print-page print-analysis-page";const r=ct.nationalBaselines,o={check:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',partial:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',warning:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',cross:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'},n=s.provBreakdown.length>0?Math.max(...s.provBreakdown.map(f=>f.total_ha)):1,l=s.provBreakdown.length>0?s.provBreakdown.map(f=>{const m=n>0?Math.max(2,f.total_ha/n*100):0;return`<div class="analysis-prov-row">
          <span class="analysis-prov-name">${f.province}</span>
          <div class="analysis-prov-bar-bg">
            <div class="analysis-prov-bar" style="width:${m}%"></div>
          </div>
          <span class="analysis-prov-val">${Yt(f.total_ha)} ha</span>
        </div>`}).join(""):'<div style="color:#999;font-size:8px;padding:4px 0">No provincial data available</div>',c=s.dataCompleteness>=80?"#2E7D32":s.dataCompleteness>=50?"#ED6C02":"#D32F2F",h=[{label:"Terrestrial",value:z(s.netTerrestrial)+" ha",pct:ot(s.tPct)},{label:"Marine",value:z(s.netMarine)+" ha",pct:ot(s.mPct)},{label:"Total Area",value:z(s.totalNetArea)+" ha",pct:""}],u=s.catBreakdown.map(f=>{var y;const m=mt(f.category),g=((y=Y[f.category])==null?void 0:y.label)||f.category,v=s.totalNetArea>0?(f.area_ha/s.totalNetArea*100).toFixed(1):"0.0";return`<tr>
      <td><span class="cat-dot" style="background:${m.fill};border-color:${m.stroke}"></span>${g}</td>
      <td class="r">${z(f.area_ha)}</td>
      <td class="r">${v}%</td>
      <td class="r">${f.features}</td>
    </tr>`}).join("");s.missingLayers.length>0&&s.missingLayers.map(f=>{var m;return`<div class="analysis-gap-item"><span class="analysis-gap-dot"></span>${f.name} <span style="color:#999">(${((m=Y[f.category])==null?void 0:m.label)||f.category})</span></div>`}).join("");let d="";if(s.progressAssessment&&e==="T3"){const{tGap:f,mGap:m}=s.progressAssessment,g=Math.min(100,s.tPct/30*100),v=Math.min(100,s.mPct/30*100);d=`
      <div class="analysis-card">
        <div class="analysis-card-title">30x30 Target Progress</div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Terrestrial: <strong>${ot(s.tPct)}</strong> of 30% target</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${g}%;background:${s.tPct>=30?"#2E7D32":"#006B3F"}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${s.tPct>=30?"Target achieved":`Gap: ${z(f*r.terrestrial_ha/100)} ha needed`}</div>
        </div>
        <div class="analysis-progress-group">
          <div class="analysis-progress-label">Marine: <strong>${ot(s.mPct)}</strong> of 30% target</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" style="width:${v}%;background:${s.mPct>=30?"#2E7D32":"#0072BC"}"></div>
            <div class="analysis-progress-marker" style="left:100%"></div>
          </div>
          <div class="analysis-progress-detail">${s.mPct>=30?"Target achieved":`Gap: ${z(m*r.marine_ha/100)} ha needed`}</div>
        </div>
      </div>
    `}let p="";if(s.typeBreakdown.length>1){const f=s.typeBreakdown.slice(0,10).map(m=>{const g=s.totalGrossArea>0?(m.area_ha/s.totalGrossArea*100).toFixed(1):"0.0";return`<tr><td>${m.type}</td><td class="r">${z(m.area_ha)}</td><td class="r">${g}%</td><td class="r">${m.features}</td></tr>`}).join("");p=`
      <div class="analysis-card">
        <div class="analysis-card-title">${e==="T10"?"Land Cover Types":e==="T4"?"Species Distribution":"Type Breakdown"}</div>
        <table class="analysis-table">
          <thead><tr><th>${e==="T4"?"Species":"Type"}</th><th class="r">Area (ha)</th><th class="r">% Total</th><th class="r">Records</th></tr></thead>
          <tbody>${f}</tbody>
        </table>
        ${s.typeBreakdown.length>10?`<div style="font-size:7px;color:#999;margin-top:2px">Showing top 10 of ${s.typeBreakdown.length} types</div>`:""}
      </div>
    `}i.innerHTML=`
    <div class="print-title-block">
      <div class="print-title-left">
        <div class="print-title-brand">
          ${Da}
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
              ${h.map(f=>`<tr><td>${f.label}</td><td class="r">${f.value}</td><td class="r">${f.pct}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>

        ${d}

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
              <tbody>${u}</tbody>
            </table>
          `:'<div style="color:#999;font-size:8px">No category data available</div>'}
        </div>

        ${p}
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
            ${s.findings.length>0?s.findings.map(f=>`<div class="analysis-finding-item"><span class="analysis-bullet">&#9654;</span><span>${f}</span></div>`).join(""):'<div style="color:#999;font-size:8px">No data available for analysis</div>'}
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-title">Target-Specific Insights</div>
          <div class="analysis-findings">
            ${s.insights.length>0?s.insights.map(f=>`<div class="analysis-finding-item"><span class="analysis-bullet" style="color:#006B3F">&#9679;</span><span>${f}</span></div>`).join(""):'<div style="color:#999;font-size:8px">Upload data to generate target-specific insights</div>'}
          </div>
        </div>
      </div>
    </div>

    <div class="analysis-methodology">
      <strong>Note:</strong> Overlapping areas have been merged to avoid double-counting.
      National baselines: Terrestrial ${z(r.terrestrial_ha)} ha; Marine ${z(r.marine_ha)} ha.
    </div>

    <div class="print-footer">
      <div class="print-footer-left">
        <strong>Prepared by:</strong> NBSAP &mdash; Department of Environmental Protection &amp; Conservation (DEPC), Vanuatu
      </div>
      <div class="print-footer-right">
        Generated: ${new Date().toLocaleString("en-GB")}
      </div>
    </div>
  `,t.appendChild(i)}function pd(t){return{T1:{feasibility:"High — Provincial and municipal planning boundaries are well-defined. Existing cadastral, environmental impact assessment (EIA), and provincial development plans provide a strong foundation. Integration with CCA boundary zones is operationally feasible.",clarity:"Clear — Target is well-defined with measurable spatial outputs: percentage of land and sea area under biodiversity-inclusive plans.",dataRequirements:["Provincial physical/development plans (shapefiles or digitised boundaries)","Municipal area boundaries and zoning maps","CCA boundary zone polygons","Marine spatial planning zones (where available)","Key Biodiversity Areas (KBA) boundaries for overlay analysis"],nationalSources:[{name:"Department of Local Authorities — Provincial Physical Plans",type:"Polygon",status:"Available (requires digitisation)",desc:"Provincial and municipal development plans with land use zones"},{name:"DEPC — Environmental Impact Assessment database",type:"Point/Polygon",status:"Partial",desc:"EIA locations and assessed areas"},{name:"Vanuatu National Statistics Office — Census boundaries",type:"Polygon",status:"Available",desc:"Administrative boundaries for spatial planning context"}],globalSources:[{name:"BirdLife / KBA Partnership — Key Biodiversity Areas",type:"Polygon",status:"Available",desc:"Internationally recognised sites of global importance for biodiversity"},{name:"UN-Habitat — National Urban Policies database",type:"Reference",status:"Available",desc:"Urban planning frameworks and policy documents"},{name:"UNEP-WCMC — Protected Planet (WDPA)",type:"Polygon",status:"Available",desc:"For cross-referencing spatial plans with existing protected areas"}],proposedActions:["Digitise all six provincial physical/development plans into GIS format (priority: Shefa, Sanma)","Overlay KBA boundaries with existing spatial plans to identify biodiversity gaps in planning","Develop marine spatial planning zones for coastal provinces (Torba, Sanma, Shefa)","Integrate CCA boundary zones into provincial spatial planning frameworks","Establish annual GIS update cycle for spatial plan monitoring"],revisions:["Expand target scope to explicitly include marine spatial planning alongside terrestrial plans","Add indicator for proportion of KBAs covered by spatial plans","Include climate vulnerability overlay in spatial planning data requirements"]},T2:{feasibility:"Moderate — Degradation mapping requires remote sensing analysis (satellite imagery change detection). Restoration site mapping relies on field survey data from DEPC and NGO partners. Technical capacity for remote sensing analysis may need strengthening.",clarity:'Moderate — Target references "degraded areas" without specifying degradation criteria or thresholds. Operational definitions needed for consistent mapping.',dataRequirements:["Satellite imagery time series (Sentinel-2, Landsat) for change detection","Field survey data on degraded terrestrial and marine ecosystems","Restoration project locations and boundaries","Baseline land cover / vegetation maps for comparison","Coral reef health assessment data"],nationalSources:[{name:"DEPC — Ecosystem health monitoring reports",type:"Report/Point",status:"Partial",desc:"Field assessments of ecosystem condition at specific sites"},{name:"Department of Forests — Forest inventory data",type:"Polygon",status:"Available",desc:"Forest cover assessments and logging concession areas"},{name:"Fisheries Department — Reef monitoring data",type:"Point",status:"Partial",desc:"Coral reef health survey points and assessments"}],globalSources:[{name:"Global Forest Watch (WRI) — Forest loss/gain layers",type:"Raster",status:"Available",desc:"Annual tree cover loss and gain at 30m resolution (Hansen et al.)"},{name:"Allen Coral Atlas — Coral reef maps",type:"Polygon",status:"Available",desc:"High-resolution benthic and geomorphic maps of coral reefs"},{name:"UNEP — World Environment Situation Room",type:"Raster/Vector",status:"Available",desc:"Environmental indicators and degradation indices"},{name:"ESA Climate Change Initiative — Land cover",type:"Raster",status:"Available",desc:"Global land cover time series at 300m resolution"}],proposedActions:["Conduct national satellite-based degradation assessment using Sentinel-2 change detection (2015–2025)","Map degraded coral reef areas using Allen Coral Atlas combined with local reef monitoring data","Establish degradation criteria and thresholds for consistent national mapping","Create a restoration project register with spatial boundaries for all active/planned sites","Integrate Global Forest Watch data for forest degradation baseline"],revisions:["Define clear degradation criteria (e.g., canopy loss >30%, reef health index <3)","Add quantitative restoration targets (hectares per province per year)","Include inland water ecosystem degradation explicitly"]},T3:{feasibility:"High — Vanuatu has a strong tradition of community-based conservation (Custom Tabu Areas, CCAs, LMMAs). Boundary mapping is operationally feasible through community participatory mapping. WDPA provides baseline for formal protected areas.",clarity:"High — Target is well-defined under GBF: 30% of terrestrial and 30% of marine areas effectively conserved by 2030. Clear, measurable indicators.",dataRequirements:["Community Conserved Area (CCA/Tabu) boundaries — all provinces","Marine Protected Area (MPA) boundaries — gazetted and proposed","Locally Managed Marine Area (LMMA) boundaries","World Database on Protected Areas (WDPA) records for Vanuatu","OECM (Other Effective Conservation Measures) boundaries"],nationalSources:[{name:"DEPC — Community Conservation Area register",type:"Polygon",status:"Partial",desc:"CCA and Tabu area boundaries from community participatory mapping"},{name:"DEPC — Protected Areas database",type:"Polygon",status:"Available",desc:"Nationally gazetted protected areas and management zones"},{name:"Vanuatu Fisheries Department — LMMA register",type:"Polygon",status:"Partial",desc:"Locally managed marine areas registered with fisheries authorities"},{name:"Provincial Government offices — Tabu area records",type:"Polygon/Tabular",status:"Incomplete",desc:"Custom Tabu area records held at provincial level"}],globalSources:[{name:"UNEP-WCMC — Protected Planet (WDPA)",type:"Polygon",status:"Available",desc:"Global database of protected areas — Vanuatu records"},{name:"UNEP-WCMC — World Database on OECMs",type:"Polygon",status:"Available",desc:"Other effective area-based conservation measures"},{name:"Blue Ventures / WCS — LMMA Network Pacific",type:"Polygon",status:"Available",desc:"Pacific LMMA network mapping data"},{name:"BirdLife / KBA Partnership — KBAs",type:"Polygon",status:"Available",desc:"For identifying priority areas for new conservation designations"}],proposedActions:["Complete participatory boundary mapping for all registered CCAs across six provinces","Update WDPA submissions for Vanuatu with latest CCA/MPA boundaries","Digitise and verify all LMMA boundaries in collaboration with Fisheries Department","Conduct gap analysis: overlay current protection with KBAs to identify priority expansion areas","Develop standardised area calculation methodology for official 30x30 reporting","Establish annual reporting cycle for conservation area changes"],revisions:["Include explicit recognition of Custom Tabu Areas as OECMs in national reporting","Add management effectiveness indicators alongside area-based targets","Set provincial sub-targets to ensure equitable distribution of conservation across all provinces"]},T4:{feasibility:"Moderate — Species distribution mapping requires systematic field surveys and expert identification. Some species (Megapode, Starling) have existing survey data; others (Plerandra) have very limited baseline data.",clarity:"Clear — Target specifies six priority species and KBAs. Distribution mapping is a standard conservation planning output.",dataRequirements:["Vanuatu Megapode (Megapodius layardi) — nesting sites and range polygons","Mountain Starling (Aplonis santovestris) — observation records and modelled range","Streaked Fantail (Rhipidura spilodera) — observation records and habitat range","Vanuatu Kingfisher (Todiramphus farquhari) — island-level distribution","Flying Fox (Pteropus anetianus) — roost sites and foraging range","Plerandra vanuatuensis — known populations and habitat suitability model"],nationalSources:[{name:"DEPC — National biodiversity database",type:"Point/Polygon",status:"Partial",desc:"Species observation records from government monitoring programmes"},{name:"Vanuatu Environment Science Society (VESS)",type:"Point",status:"Partial",desc:"Citizen science and research observation records"},{name:"National Herbarium — Plant collections",type:"Point",status:"Available",desc:"Herbarium specimen records for Plerandra and other endemic plants"}],globalSources:[{name:"GBIF — Global Biodiversity Information Facility",type:"Point",status:"Available",desc:"Aggregated species occurrence records from museums, surveys, and citizen science"},{name:"IUCN Red List — Species range maps",type:"Polygon",status:"Available",desc:"Expert-assessed range maps for listed species"},{name:"eBird / Cornell Lab — Bird observations",type:"Point",status:"Available",desc:"Citizen science bird observation records for Vanuatu"},{name:"BirdLife International — Important Bird Areas",type:"Polygon",status:"Available",desc:"IBA boundaries relevant to endemic bird species"}],proposedActions:["Compile all existing species observation records into a national spatial biodiversity database","Conduct targeted field surveys for Mountain Starling and Plerandra in under-sampled islands","Generate species distribution models (MaxEnt) using GBIF + local records for all six priority species","Map critical habitat for each species and overlay with existing conservation areas","Integrate eBird and GBIF data as reference layers for cross-validation"],revisions:["Add population trend indicators alongside distribution mapping","Include marine species (sea turtles, dugong) for comprehensive biodiversity assessment","Set explicit targets for species monitoring frequency and coverage"]},T6:{feasibility:"High — Invasive species are visible and mappable through remote sensing (Merremia, Mile a Minute) and field surveys (Solanum, Crown of Thorns). Drone and satellite imagery can detect vine coverage. Community reporting networks can support data collection.",clarity:"Clear — Target specifies key IAS and requires total coverage (ha) and distribution mapping. Measurable and achievable with available technology.",dataRequirements:["Merremia peltata (Big Leaf) — remote sensing detections and field survey polygons","Crown of Thorns Starfish (Acanthaster planci) — reef outbreak locations and affected areas","Mile a Minute Vine (Mikania micrantha) — coverage polygons from field/remote sensing","Solanum torvum (Devil Fig) — infestation area boundaries from field surveys","Other IAS: Fire Ants, African Snail, Sako, Coconut Beetle — occurrence points and affected areas"],nationalSources:[{name:"DEPC — Invasive species monitoring programme",type:"Point/Polygon",status:"Partial",desc:"Field survey records and management intervention sites"},{name:"Department of Agriculture — Pest control records",type:"Point",status:"Partial",desc:"Agricultural pest reporting and control intervention locations"},{name:"Fisheries Department — Crown of Thorns monitoring",type:"Point",status:"Partial",desc:"Reef monitoring stations tracking COTS outbreaks"},{name:"Vanuatu Biosecurity — Border interception data",type:"Point",status:"Available",desc:"IAS interception and quarantine records"}],globalSources:[{name:"GBIF — Invasive species occurrence records",type:"Point",status:"Available",desc:"Global observation records for target IAS species"},{name:"CABI — Invasive Species Compendium",type:"Reference",status:"Available",desc:"Comprehensive datasheets on ecology, distribution, and management of IAS"},{name:"Pacific Invasives Partnership — Regional IAS database",type:"Point/Reference",status:"Available",desc:"Pacific-focused invasive species occurrence and management data"},{name:"AIMS — Crown of Thorns Starfish monitoring (Pacific)",type:"Point",status:"Available",desc:"Australian Institute of Marine Science COTS reef monitoring data"}],proposedActions:["Conduct national Merremia peltata coverage mapping using Sentinel-2 satellite imagery and NDVI analysis","Establish systematic Crown of Thorns reef monitoring transects at priority reef sites","Map Mile a Minute Vine distribution through field surveys combined with drone imagery in affected provinces","Survey and map Solanum torvum infestations focusing on agricultural areas in Shefa and Sanma","Create IAS early warning system with community reporting linked to GIS database","Develop eradication priority map based on proximity to conservation areas and agricultural land"],revisions:["Add monitoring frequency targets for each priority IAS (e.g., annual Merremia coverage update)","Include cost-benefit analysis for IAS management actions per province","Link IAS distribution data to biodiversity impact assessment for conservation areas"]},T7:{feasibility:"Moderate — Mapping requires collaboration with agricultural sector and Department of Agriculture. Farmer surveys and agrochemical import records can provide spatial data. Remote sensing cannot directly detect pesticide use.",clarity:'Moderate — Target references "large-scale and small-scale commercial farming" but lacks quantitative thresholds. Criteria for what constitutes a mappable pesticide use area need definition.',dataRequirements:["Commercial farm boundaries (large-scale and smallholder)","Agrochemical use records by location and type","Agricultural land use maps","Water quality monitoring data near agricultural areas","Crop type maps for identifying high-pesticide-use crops"],nationalSources:[{name:"Department of Agriculture — Farm registration data",type:"Point/Polygon",status:"Partial",desc:"Registered commercial farm locations and crop types"},{name:"Vanuatu Customs — Agrochemical import records",type:"Tabular",status:"Available",desc:"Import volumes of pesticides and herbicides by product type"},{name:"Department of Agriculture — Extension office records",type:"Point",status:"Partial",desc:"Agricultural extension activities and pesticide advice records"}],globalSources:[{name:"FAO — Global agro-chemical use database",type:"Tabular",status:"Available",desc:"National-level pesticide use statistics"},{name:"ESA — Cropland mapping (WorldCover)",type:"Raster",status:"Available",desc:"10m resolution global land cover including cropland classes"},{name:"NASA — Agricultural productivity indices",type:"Raster",status:"Available",desc:"Satellite-derived crop health and agricultural intensity indicators"}],proposedActions:["Conduct agricultural pesticide use survey targeting commercial farms in Shefa, Sanma, and Malampa","Map all commercial farm boundaries and classify by crop type and pesticide intensity","Overlay pesticide use areas with adjacent conservation areas and water bodies for risk assessment","Establish baseline water quality monitoring near high-pesticide-use areas","Create pesticide risk heat map combining use intensity, proximity to conservation areas, and downstream impacts"],revisions:["Define measurable indicators (e.g., hectares under integrated pest management)","Add explicit targets for pesticide reduction in areas adjacent to KBAs and protected areas","Include organic farming promotion as a measurable alternative action"]},T8:{feasibility:"Moderate — Coastal eutrophication mapping requires water quality monitoring data (chlorophyll-a, nutrient levels). Satellite remote sensing (Sentinel-2) can detect chlorophyll concentrations in coastal waters. Field validation is needed.",clarity:'Moderate — Target references "coastal eutrophication and nutrient-impacted zones" without specifying monitoring methodology or thresholds.',dataRequirements:["Coastal water quality monitoring data (chlorophyll-a, nitrogen, phosphorus)","Sewage discharge and waste management site locations","River discharge points and catchment land use data","Satellite-derived chlorophyll-a concentration maps","Coral reef health data as impact indicator"],nationalSources:[{name:"DEPC — Water quality monitoring programme",type:"Point",status:"Partial",desc:"Coastal water quality sample stations and results"},{name:"Public Works Department — Sewage infrastructure",type:"Point",status:"Partial",desc:"Sewage treatment and discharge locations"},{name:"Port Vila Municipal Council — Waste management",type:"Point/Polygon",status:"Partial",desc:"Waste disposal sites and drainage infrastructure"}],globalSources:[{name:"Copernicus Marine Service — Ocean colour products",type:"Raster",status:"Available",desc:"Satellite-derived chlorophyll-a and water quality indicators"},{name:"UN Environment — Global Nutrient Management System",type:"Reference",status:"Available",desc:"Global nutrient pollution assessment data and methodology"},{name:"Allen Coral Atlas — Reef water quality",type:"Raster",status:"Available",desc:"Water clarity and turbidity indicators for reef areas"}],proposedActions:["Establish permanent coastal water quality monitoring stations at key sites (Port Vila, Luganville, Lakatoro)","Generate satellite-derived eutrophication risk maps using Sentinel-2 chlorophyll-a analysis","Map all point-source nutrient discharge locations (sewage, agriculture, aquaculture)","Conduct catchment-level nutrient loading analysis for priority coastal zones","Develop early warning thresholds for coastal eutrophication based on WHO/UNEP guidelines"],revisions:["Define specific eutrophication thresholds (e.g., chlorophyll-a >5 µg/L)","Add monitoring frequency targets (monthly at key sites)","Include freshwater eutrophication in inland water bodies"]},T10:{feasibility:"High — Land cover mapping is a well-established remote sensing application. Sentinel-2 (10m) and Landsat (30m) imagery are freely available. National land cover mapping can be completed with existing technical capacity.",clarity:"Clear — Target requires mapping of land cover change for agriculture, livestock, fisheries and forestry. Standard remote sensing classification output.",dataRequirements:["Multi-temporal satellite imagery (Sentinel-2, Landsat) for change detection","Ground truth / field survey points for classification training and validation","Existing land use maps and agricultural census data","Forest inventory and logging concession boundaries","Fisheries infrastructure and aquaculture site locations"],nationalSources:[{name:"Department of Forests — Forest inventory and concessions",type:"Polygon",status:"Available",desc:"Forest cover assessments and logging concession boundaries"},{name:"Department of Agriculture — Agricultural census",type:"Tabular/Point",status:"Available",desc:"Agricultural production data by area council"},{name:"Vanuatu Lands Department — Land tenure and use",type:"Polygon",status:"Partial",desc:"Registered land parcels and designated land uses"},{name:"VANRIS — Vanuatu Resource Information System",type:"Polygon",status:"Available",desc:"Historical land resource mapping (soils, vegetation, climate zones)"}],globalSources:[{name:"ESA WorldCover — 10m land cover",type:"Raster",status:"Available",desc:"10m resolution global land cover (2020/2021) with 11 classes"},{name:"Global Forest Watch — Tree cover loss/gain",type:"Raster",status:"Available",desc:"Annual forest change data at 30m resolution (Hansen et al.)"},{name:"FAO — Global Land Cover Network (GLCN)",type:"Raster",status:"Available",desc:"UN land cover classification system products"},{name:"Copernicus Global Land Service — Land cover",type:"Raster",status:"Available",desc:"Annual 100m dynamic land cover with change detection"}],proposedActions:["Produce national land cover / land use map at 10m resolution using Sentinel-2 imagery","Generate 2015–2025 land cover change analysis for agriculture expansion and deforestation","Classify agricultural areas by crop type (coconut, cocoa, kava, cattle, food crops)","Map forest-to-agriculture conversion hotspots per province for REDD+ reporting","Establish annual land cover monitoring programme using satellite change detection","Validate land cover maps using field surveys and community ground-truthing"],revisions:["Add explicit change detection indicators (e.g., hectares of forest loss per year)","Include sustainable land management practices as a positive action indicator","Link land cover change to carbon stock estimates for climate reporting"]},T12:{feasibility:"Moderate — Green and blue space mapping in urban areas requires detailed spatial data. Provincial capitals have varying levels of existing urban mapping. Drone surveys may be needed for accurate park boundary delineation.",clarity:'Moderate — Target references "parks within provincial and municipal areas, and botanical gardens" but lacks criteria for what constitutes a blue/green space. Needs operational definition.',dataRequirements:["Urban park and public garden boundaries","Botanical garden extents","Municipal area boundaries and land use zoning","Waterfront/coastal public access areas (blue spaces)","Tree canopy cover in urban areas"],nationalSources:[{name:"Port Vila Municipal Council — Park and open space register",type:"Polygon",status:"Partial",desc:"Municipal parks, gardens, and public open spaces in Port Vila"},{name:"Luganville Municipal Council — Green space inventory",type:"Polygon",status:"Partial",desc:"Parks and recreational areas in Luganville"},{name:"Department of Forests — Botanical garden boundaries",type:"Polygon",status:"Available",desc:"National botanical garden and arboretum boundaries"}],globalSources:[{name:"OpenStreetMap — Urban land use features",type:"Polygon",status:"Available",desc:"Community-mapped parks, gardens, and recreational areas"},{name:"ESA WorldCover — Urban vegetation detection",type:"Raster",status:"Available",desc:"Tree cover and vegetation within urban extents"},{name:"Google Open Buildings — Building footprints",type:"Polygon",status:"Available",desc:"For calculating green space ratio vs built-up area"}],proposedActions:["Map all public parks and green spaces in Port Vila and Luganville using drone imagery","Conduct green space inventory for all provincial capitals (Lakatoro, Saratamata, Isangel, Sola)","Calculate green space per capita ratios for each urban area (WHO recommends 9 m² per person)","Map blue spaces (coastal access, waterfront parks, mangrove boardwalks) in urban areas","Develop green space expansion plan for under-served urban communities"],revisions:["Define minimum green space standards (e.g., WHO 9 m² per capita)","Add accessibility indicators (% of population within 300m of green space)","Include urban tree canopy targets alongside ground-level green space"]}}[t]||{feasibility:"Assessment pending — requires further analysis of data availability and institutional capacity.",clarity:"Assessment pending — target definition review needed.",dataRequirements:["Spatial datasets relevant to target objectives"],nationalSources:[],globalSources:[],proposedActions:["Conduct baseline data assessment for this target"],revisions:["Review target indicators for measurability and spatial relevance"]}}const Pr=400;function Ns(t,e,a,s,i,r){var w,E,P,$;if(!document.getElementById(t))return;const n=D.map(t,{center:ct.mapCenter,zoom:ct.mapZoom,zoomControl:!1,attributionControl:!1,dragging:!1,scrollWheelZoom:!1,doubleClickZoom:!1,touchZoom:!1,preferCanvas:!0});D.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{maxZoom:19}).addTo(n),D.control.scale({imperial:!1,position:"bottomleft",maxWidth:150}).addTo(n);let l=null;s&&D.geoJSON(s,{style:S=>{const A=S.properties.name||S.properties.province||"",M=i&&A===i;return{color:M?"#333":"#777",weight:M?2.5:1.2,fillOpacity:M?.04:.02,dashArray:M?null:"4 4"}},onEachFeature:(S,A)=>{const M=S.properties.name||S.properties.province||"";M&&A.bindTooltip(M,{permanent:!0,direction:"center",className:"print-province-label"}),i&&M===i&&(l=A)}}).addTo(n);const c=zc(),h=new Map(c.map((S,A)=>[S,A])),u=[...a].sort((S,A)=>(h.get(S.id)??999)-(h.get(A.id)??999)),d={},p={},f={},m={},g={};for(const S of u){const A=S.metadata,M=(A==null?void 0:A.category)||"OTHER",k=((w=S.geojson)==null?void 0:w.features)||[],C=(A==null?void 0:A.isReference)===!0;for(const G of k){if(i&&((E=G.properties)==null?void 0:E.province)!==i)continue;const T=(P=G.geometry)==null?void 0:P.type;if(C)T==="Polygon"||T==="MultiPolygon"?(f[M]||(f[M]=[]),f[M].push(G)):(T==="Point"||T==="MultiPoint")&&(m[M]||(m[M]=[]),m[M].push(G));else if(T==="Polygon"||T==="MultiPolygon"){const I=Cn(M,G);d[I]||(d[I]=[]),d[I].push(G),p[I]||(p[I]={cat:M,typeValue:M==="LAND_COVER"&&(($=G.properties)==null?void 0:$.type)||null})}else(T==="Point"||T==="MultiPoint")&&(g[M]||(g[M]=[]),g[M].push(G))}}let v=0;for(const S of Object.values(d))v+=S.length;for(const S of Object.values(g))v+=S.length;const y=!!i&&v>Pr;let _=Pr;const b=D.featureGroup();for(const[S,A]of Object.entries(f))b.addLayer(D.geoJSON({type:"FeatureCollection",features:A},{style:()=>$n(S)}));for(const[S,A]of Object.entries(m)){const M=Tn(S);b.addLayer(D.geoJSON({type:"FeatureCollection",features:A},{pointToLayer:(k,C)=>D.circleMarker(C,M)}))}const x=Object.entries(d).sort((S,A)=>A[1].length-S[1].length);for(const[S,A]of x){if(y&&_<=0)break;const{cat:M,typeValue:k}=p[S],C=Ln(M,k),G=r?null:ht(A);if(G)b.addLayer(D.geoJSON(G,{style:()=>C}));else if(A.length>0){const T=y?Math.min(A.length,_):A.length,I=T<A.length?A.slice(0,T):A;b.addLayer(D.geoJSON({type:"FeatureCollection",features:I},{style:()=>C})),y&&(_-=I.length)}}for(const[S,A]of Object.entries(g)){if(y&&_<=0)break;if(A.length>0){const M=In(S),k=y?Math.min(A.length,_):A.length,C=k<A.length?A.slice(0,k):A;b.addLayer(D.geoJSON({type:"FeatureCollection",features:C},{pointToLayer:(G,T)=>D.circleMarker(T,M)})),y&&(_-=C.length)}}b.addTo(n),setTimeout(()=>{if(n.invalidateSize(),i&&l){const S=l.getBounds();S.isValid()&&n.fitBounds(S,{padding:[30,30],maxZoom:12})}else if(s){const S=D.geoJSON(s).getBounds();S.isValid()&&n.fitBounds(S,{padding:[40,40],maxZoom:10})}else if(b.getLayers().length>0){const S=b.getBounds();S.isValid()&&n.fitBounds(S,{padding:[40,40],maxZoom:12})}},200)}const Ge=(t,e=16)=>`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`,Be={layers:Ge('<path d="m2 8 10-6 10 6v10l-10 6L2 18V8z"/><path d="m22 8-10 6L2 8"/>'),records:Ge('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>'),area:Ge('<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>'),provinces:Ge('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),targets:Ge('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),calendar:Ge('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>')};function fd(t){var p,f,m;const e=Gt(),a=H(),s=e.length;let i=0;for(const g of e)i+=((f=(p=g.geojson)==null?void 0:p.features)==null?void 0:f.length)??0;let r=0;try{r=Ci(e,{targets:[],province:"All",category:"All",realm:"All",year:"All"}).grossAreaHa}catch{}const o=a.provinces.length,n=Ut.targets.filter(g=>e.some(v=>{var y,_;return(_=(y=v.metadata)==null?void 0:y.targets)==null?void 0:_.includes(g.code)})).length,l=Ut.targets.length;let c=null;for(const g of e){const v=(m=g.metadata)==null?void 0:m.uploadTimestamp;if(v){const y=new Date(v);(!c||y>c)&&(c=y)}}const h=c?c.toLocaleDateString("en-GB",{month:"short",year:"numeric"}):"—",d=[{icon:Be.layers,value:s||"—",label:"Datasets",color:"#1565C0"},{icon:Be.records,value:md(i),label:"Features",color:"#7E57C2"},{icon:Be.area,value:gd(r),label:"Mapped Area",color:"#2E7D32"},{icon:Be.provinces,value:o?`${o}/6`:"—",label:"Provinces",color:"#D84315"},{icon:Be.targets,value:`${n}/${l}`,label:"Targets",color:"#00838F"},{icon:Be.calendar,value:h,label:"Last Upload",color:"#795548"}].map(g=>`
    <div class="data-stat-tile">
      <span class="data-stat-icon" style="color:${g.color}">${g.icon}</span>
      <div class="data-stat-body">
        <span class="data-stat-value">${g.value}</span>
        <span class="data-stat-label">${g.label}</span>
      </div>
    </div>
  `).join('<div class="data-stat-divider"></div>');t.innerHTML=`
    <div class="exec-summary">
      <div class="data-stat-bar">${d}</div>
    </div>
  `}function gd(t){return t?t>=1e6?(t/1e6).toFixed(1)+"M ha":t>=1e3?(t/1e3).toFixed(1)+"K ha":Math.round(t)+" ha":"0 ha"}function md(t){return t?t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toString():"0"}const vd=["rbaereleo@vanuatu.gov.vu","dlaunder@vanuatu.gov.vu"],yd={T1:{title:"Target 1: Biodiversity Spatial Planning",desc:"Participatory spatial planning to reduce biodiversity loss — tracking % of land and sea area covered by biodiversity-inclusive plans"},T2:{title:"Target 2: Ecosystem Restoration",desc:"Restore ≥30% of degraded terrestrial, inland water, marine and coastal ecosystems by 2030"},T3:{title:"Target 3: 30×30 Conservation",desc:"Conserve ≥30% of terrestrial, inland water, and marine areas by 2030 through protected areas and other effective area-based conservation measures"},T4:{title:"Target 4: Species Recovery & Biodiversity",desc:"Halt human-induced extinction and support recovery of threatened species — distribution maps of significant Vanuatu species and Key Biodiversity Areas"},T6:{title:"Target 6: Invasive Alien Species",desc:"Reduce IAS introductions by ≥50% and minimize ecological impacts — coverage and distribution of Merremia, Fire Ants, African Snail, Crown-of-Thorns, Sako, Coconut Beetle"},T7:{title:"Target 7: Pollution Reduction",desc:"Reduce pollution to non-harmful levels — spatial mapping of pesticide and herbicide use in commercial farming across Vanuatu"},T8:{title:"Target 8: Climate & Ocean Impacts",desc:"Minimize climate change and ocean acidification impacts on biodiversity — mapping coastal eutrophication and nutrient-impacted zones"},T10:{title:"Target 10: Sustainable Land Use",desc:"Sustainable biodiversity practices across agriculture, aquaculture, fisheries and forestry — land cover change mapping"},T12:{title:"Target 12: Urban Green & Blue Spaces",desc:"Increase and enhance urban and peri-urban green and blue spaces for biodiversity, connectivity and human well-being"}};function bd(){const t=document.getElementById("page-dashboard");t.innerHTML=`
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
          <button class="btn btn-sm btn-outline" id="btn-export-csv" title="${Ct()?"Export filtered data as CSV":"Request data access"}" style="position:relative">
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
          <div id="context-panel-container"></div>
        </div>
      </div>
    </div>
  `,setTimeout(()=>{Nc("map"),Rs()},50),document.getElementById("btn-export-csv").addEventListener("click",()=>{Ct()?Kc():Qe(`CSV data download is restricted.

To request data access, please email:
${vd.join(`
`)}`,{title:"Access Restricted"})}),document.getElementById("btn-export-json").addEventListener("click",Yc),document.getElementById("btn-export-png").addEventListener("click",Jc),document.getElementById("btn-print-all").addEventListener("click",id),document.getElementById("btn-print-target").addEventListener("click",()=>{const e=H();e.filters.targets.length===1&&Xn(e.filters.targets[0])}),document.getElementById("btn-print-province").addEventListener("click",()=>{const e=H();e.filters.targets.length===1&&Xc(e.filters.targets[0])}),document.getElementById("btn-print-species").addEventListener("click",()=>{const e=H();e.filters.targets.length===1&&e.filters.targets[0]==="T4"&&td("T4")})}function Rs(){Ui=!1;const t=H(),e=document.getElementById("exec-summary-container");e&&fd(e);const a=document.getElementById("last-updated-text");if(a){const g=new Date,v=g.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),y=g.toLocaleDateString([],{day:"numeric",month:"short"});a.textContent=`${y}, ${v}`;const _=a.closest(".last-updated-badge");_&&_.classList.add("synced")}const s=document.getElementById("filter-panel-container");s&&ec(s),ha!==null&&(clearTimeout(ha),ha=null);const i=document.getElementById("kpi-container");i&&(i.style.opacity="0",i.style.pointerEvents="none",ha=setTimeout(()=>{ha=null,i.innerHTML=`
        <div class="kpi-computing">
          <div class="loading-spinner" style="width:20px;height:20px;border-width:2px"></div>
          <span>Recalculating&hellip;</span>
        </div>`,i.style.opacity="1",requestAnimationFrame(()=>{setTimeout(()=>{hc(i),bc(i),i.style.pointerEvents=""},0)})},120)),Pa();const r=t.filters,o=r.targets,n=Gt(),l=document.getElementById("target-header-container"),c=document.getElementById("btn-print-target"),h=document.getElementById("btn-print-province"),u=document.getElementById("btn-print-species");if(l)if(o.length===1){const g=o[0],v=yd[g]||{title:g,desc:""};l.innerHTML=`
        <div class="target-header-bar">
          <div style="flex:1">
            <strong>${v.title}</strong>
            <span style="color:var(--text-secondary);font-size:13px;margin-left:12px">${v.desc}</span>
          </div>
          <button class="btn btn-sm btn-outline" id="btn-print-header" title="Print map for ${g}" style="flex-shrink:0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Map
          </button>
        </div>
      `,document.getElementById("btn-print-header").addEventListener("click",()=>Xn(g)),c&&(c.disabled=!1,c.title=`Print map for ${g}`),h&&(h.disabled=!1,h.title=`Print ${g} maps by province`),u&&(g==="T4"?(u.style.display="",u.disabled=!1,u.title="Print species distribution maps"):(u.style.display="none",u.disabled=!0))}else l.innerHTML="",c&&(c.disabled=!0,c.title="Select a single target first"),h&&(h.disabled=!0,h.title="Select a single target first"),u&&(u.style.display="none",u.disabled=!0);const d=document.getElementById("province-table-container"),p=document.getElementById("province-chart-container"),f=document.getElementById("category-breakdown-container");if(o.length===1){const g=o[0],v=g==="T3"?Je(n,r):g==="T1"?Cs(n,r):fe(n,g,r);d&&Ar(d,v.provinceBreakdown),p&&Er(p,v.provinceBreakdown),f&&xd(f,v)}else{if(o.length===0||o.includes("T3")){const v=Je(n,r);d&&Ar(d,v.provinceBreakdown),p&&Er(p,v.provinceBreakdown)}else d&&(d.innerHTML='<p style="color:var(--text-tertiary);font-size:13px;padding:12px 0">Select a target to see provincial breakdown</p>'),p&&(p.innerHTML="");f&&_d(f)}const m=document.getElementById("context-panel-container");m&&wd(m)}function xd(t,e){if(!e.categoryBreakdown||e.categoryBreakdown.length===0){t.innerHTML="";return}const a=e.categoryBreakdown.map(s=>{const i=Y[s.category]||{label:s.category,color:"#95a5a6"};return`
      <tr>
        <td>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${i.color};margin-right:6px"></span>
          ${i.label}
        </td>
        <td style="text-align:right">${Se(s.area_ha)}</td>
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
  `}function _d(t){var p,f,m;const e=Gt(),a=Ut.targets,s={};let i=0,r=0,o=0;for(const g of e){i++;for(const y of((p=g.metadata)==null?void 0:p.targets)||[])s[y]=(s[y]||0)+1;const v=((f=g.metadata)==null?void 0:f.totalAreaHa)||0;((m=g.metadata)==null?void 0:m.realm)==="marine"?o+=v:r+=v}let n=0,l=0;for(const g of e){const v=g.metadata;!(v!=null&&v.totalAreaHa)||!v.countsToward30x30||(v.targets||[]).includes("T3")&&(v.realm==="marine"?l+=v.totalAreaHa:n+=v.totalAreaHa)}const c=Math.min(n/ct.nationalBaselines.terrestrial_ha*100,100),h=Math.min(l/ct.nationalBaselines.marine_ha*100,100),u=a.filter(g=>(s[g.code]||0)>0).length,d=a.map(g=>{const v=s[g.code]||0,y=v>0?"var(--success)":"var(--text-tertiary)";return`
      <tr>
        <td><span class="badge" style="background:${g.color}20;color:${g.color};border:1px solid ${g.color}40;font-weight:700;font-size:11px;white-space:nowrap">${g.code}</span></td>
        <td style="font-size:13px">${g.name.replace(/^Target \d+:\s*/,"")}</td>
        <td style="font-size:12px">
          <span style="display:inline-flex;align-items:center;gap:5px;color:${y}">
            <span style="width:7px;height:7px;border-radius:50%;background:${y};flex-shrink:0"></span>
            ${v>0?`${v} dataset${v!==1?"s":""}`:"No data yet"}
          </span>
        </td>
        <td style="font-size:11px;color:var(--text-secondary)">${(g.recommendedCategories||[]).slice(0,4).join(", ")}</td>
      </tr>`}).join("");t.innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">

      <div class="card">
        <div class="card-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          30&times;30 Conservation Progress
          <span style="margin-left:auto;font-size:10px;color:var(--text-tertiary)">Target: 30% by 2030</span>
        </div>
        <div class="card-body">
          <div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
              <span style="font-size:12px;font-weight:600">Terrestrial</span>
              <span style="font-size:14px;font-weight:700;color:${c>=30?"var(--success)":"var(--primary)"}">${c.toFixed(1)}%</span>
            </div>
            <div style="background:var(--gray-200);border-radius:4px;height:10px;overflow:hidden;position:relative">
              <div style="width:${c}%;background:var(--primary);height:100%;border-radius:4px;transition:width 0.6s ease"></div>
              <div style="position:absolute;left:30%;top:-1px;bottom:-1px;width:2px;background:var(--danger);opacity:0.7" title="30% GBF target"></div>
            </div>
            <div style="font-size:11px;color:var(--text-tertiary);margin-top:3px">${Se(n)} ha conserved of ${Se(ct.nationalBaselines.terrestrial_ha)} ha total</div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
              <span style="font-size:12px;font-weight:600">Marine</span>
              <span style="font-size:14px;font-weight:700;color:${h>=30?"var(--success)":"var(--secondary)"}">${h.toFixed(1)}%</span>
            </div>
            <div style="background:var(--gray-200);border-radius:4px;height:10px;overflow:hidden;position:relative">
              <div style="width:${h}%;background:var(--secondary);height:100%;border-radius:4px;transition:width 0.6s ease"></div>
              <div style="position:absolute;left:30%;top:-1px;bottom:-1px;width:2px;background:var(--danger);opacity:0.7" title="30% GBF target"></div>
            </div>
            <div style="font-size:11px;color:var(--text-tertiary);margin-top:3px">${Se(l)} ha conserved of ${Se(ct.nationalBaselines.marine_ha)} ha total</div>
          </div>
          <div style="margin-top:10px;font-size:11px;color:var(--text-tertiary);display:flex;align-items:center;gap:5px">
            <span style="display:inline-block;width:14px;height:2px;background:var(--danger);opacity:0.7;flex-shrink:0"></span>
            Red line marks the 30% GBF target threshold
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Dataset Summary
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div style="text-align:center;padding:10px 8px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border)">
              <div style="font-size:24px;font-weight:800;color:var(--primary);line-height:1">${i}</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Datasets Loaded</div>
            </div>
            <div style="text-align:center;padding:10px 8px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border)">
              <div style="font-size:24px;font-weight:800;color:var(--secondary);line-height:1">${u}/${a.length}</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Targets with Data</div>
            </div>
            <div style="text-align:center;padding:10px 8px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border)">
              <div style="font-size:18px;font-weight:700;color:var(--primary);line-height:1">${Se(r)}</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Terrestrial ha</div>
            </div>
            <div style="text-align:center;padding:10px 8px;background:var(--gray-50);border-radius:var(--radius-md);border:1px solid var(--border)">
              <div style="font-size:18px;font-weight:700;color:var(--secondary);line-height:1">${Se(o)}</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Marine ha</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="breakdown-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      All NBSAP Targets &mdash; Data Coverage
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width:56px">Target</th>
          <th>GBF Objective</th>
          <th style="width:130px">Datasets</th>
          <th>Key Data Layers</th>
        </tr>
      </thead>
      <tbody>${d}</tbody>
    </table>
  `}function wd(t){!t||t.dataset.rendered||(t.dataset.rendered="1",t.innerHTML=`
    <div style="margin-top:16px;padding:12px 16px;background:linear-gradient(135deg,var(--primary-lighter),var(--secondary-lighter));border:1px solid var(--border);border-radius:var(--radius-md);display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start">
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">Country</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">Republic of Vanuatu</div>
        <div style="font-size:12px;color:var(--text-secondary)">Melanesia &bull; 83 islands</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">Land Area</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">12,190 km&sup2;</div>
        <div style="font-size:12px;color:var(--text-secondary)">6 provinces</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">EEZ</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">663,251 km&sup2;</div>
        <div style="font-size:12px;color:var(--text-secondary)">Coral Triangle adjacent</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">30&times;30 Deadline</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">2030</div>
        <div style="font-size:12px;color:var(--text-secondary)">Kunming-Montreal GBF</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">NBSAP Targets</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">9 National Targets</div>
        <div style="font-size:12px;color:var(--text-secondary)">T1, T2, T3, T4, T6, T7, T8, T10, T12</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-tertiary);margin-bottom:2px">Data Custodian</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">DEPC</div>
        <div style="font-size:12px;color:var(--text-secondary)">Dept. of Env. Protection &amp; Conservation</div>
      </div>
    </div>
  `)}function Se(t){return!t&&t!==0?"-":t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toFixed(1)}let Ui=!0,ha=null;function Md(){Ui=!0}function Sd(){jc(),Ui&&Rs()}const Ed=["name","type","realm","province","year","status","source","notes","targets"];function fs(t={}){var e;return{id:t.id||Ad(),name:t.name||"Untitled Layer",originalFilename:t.originalFilename||"",category:t.category||"OTHER",targets:t.targets||[],realm:t.realm||((e=Y[t.category])==null?void 0:e.defaultRealm)||"terrestrial",countsToward30x30:t.countsToward30x30||!1,isReference:t.isReference||!1,uploadTimestamp:t.uploadTimestamp||new Date().toISOString(),uploadedBy:t.uploadedBy||"admin",detectedCRS:t.detectedCRS||"EPSG:4326",featureCount:t.featureCount||0,validGeometryCount:t.validGeometryCount||0,fixedCount:t.fixedCount||0,droppedCount:t.droppedCount||0,totalAreaHa:t.totalAreaHa||0,status:t.status||"Clean",warnings:t.warnings||[],notes:t.notes||"",description:t.description||"",custodianAgency:t.custodianAgency||"",responsibleOfficer:t.responsibleOfficer||"",contactInformation:t.contactInformation||"",dateCreated:t.dateCreated||"",dateUpdated:t.dateUpdated||"",geographicCoverage:t.geographicCoverage||"",dataSource:t.dataSource||"",collectionMethod:t.collectionMethod||"",spatialResolution:t.spatialResolution||"",dataLimitations:t.dataLimitations||"",updateFrequency:t.updateFrequency||"",accessClassification:t.accessClassification||"Public"}}const ta=[{key:"name",label:"Dataset Name",hint:"Use standardized naming format",required:!0},{key:"description",label:"Description",hint:"Brief 2-3 sentence summary",required:!0},{key:"custodianAgency",label:"Custodian Agency",hint:"Full agency name (e.g. DEPC)",required:!0},{key:"responsibleOfficer",label:"Responsible Officer",hint:"Name and position",required:!1},{key:"contactInformation",label:"Contact Information",hint:"Official email or phone",required:!1},{key:"dateCreated",label:"Date Created",hint:"YYYY-MM-DD format",type:"date",required:!0},{key:"dateUpdated",label:"Date Updated",hint:"Record when modified",type:"date",required:!1},{key:"geographicCoverage",label:"Geographic Coverage",hint:"Spatial extent",type:"select",options:["National","Provincial","Marine","National + Marine"],required:!0},{key:"detectedCRS",label:"CRS",hint:"EPSG code",required:!1},{key:"dataSource",label:"Data Source",hint:"Origin",type:"select",options:["Field","Satellite","Digitized","Census","Survey","Other"],required:!0},{key:"collectionMethod",label:"Collection Method",hint:"Brief description of how collected",required:!1},{key:"spatialResolution",label:"Spatial Resolution",hint:"Pixel size or scale",required:!1},{key:"dataLimitations",label:"Data Limitations",hint:"Coverage gaps, known constraints",required:!1},{key:"updateFrequency",label:"Update Frequency",hint:"Revision cycle",type:"select",options:["Annual","Biennial","Project-based","One-time","As needed"],required:!1},{key:"accessClassification",label:"Access Classification",hint:"Sensitivity level",type:"select",options:["Public","Restricted","Confidential"],required:!0}];function Gs(t){const e=[];let a=0;for(const i of ta){const r=t[i.key];r&&String(r).trim()?a++:i.required&&e.push(i.label)}const s=ta.length;return{complete:e.length===0,filled:a,total:s,pct:Math.round(a/s*100),missing:e}}function Ad(){return"layer_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8)}function to(t,e){const a=[],s=e.features||[];t.category||a.push("Layer has no category assigned");let i=0,r=0,o=0;for(const n of s){const l=n.properties||{};l.province||i++,(!l.name||l.name==="Unnamed")&&r++,n.geometry||o++}return i>0&&a.push(`${i} feature(s) missing province assignment`),r>0&&a.push(`${r} feature(s) with missing/default name`),o>0&&a.push(`${o} feature(s) with null geometry`),t.detectedCRS&&t.detectedCRS!=="EPSG:4326"&&a.push(`CRS is ${t.detectedCRS} — may need verification`),{compliant:a.length===0,issues:a}}function _t(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const kd=["Torba","Sanma","Penama","Malampa","Shefa","Tafea"],Cr=[{key:"name",label:"Name",type:"text",required:!0},{key:"type",label:"Type",type:"text"},{key:"realm",label:"Realm",type:"select",options:["terrestrial","marine","freshwater"]},{key:"province",label:"Province",type:"select",options:["",...kd]},{key:"year",label:"Year",type:"number"},{key:"status",label:"Status",type:"select",options:["Unknown","Proposed","Gazetted","Active","Inactive","Restored"]},{key:"source",label:"Source",type:"text"},{key:"notes",label:"Notes",type:"textarea"}],$r=new Set(["upload_timestamp","layer_id","original_filename","uploaded_by"]),Pd=new Set(Ed);let Ce=null;function eo(){if(Ce)return;const t=document.createElement("div");t.className="modal-overlay",t.id="feature-editor-modal",t.style.zIndex="2100",t.innerHTML=`
    <div class="modal" style="max-width:540px;max-height:88vh;display:flex;flex-direction:column">
      <div class="modal-header" style="flex-shrink:0">
        <h3 id="fe-title">Edit Feature</h3>
        <button class="modal-close" id="fe-close">&times;</button>
      </div>
      <div id="fe-body" style="overflow-y:auto;flex:1"></div>
    </div>
  `,document.body.appendChild(t),Ce=t,t.querySelector("#fe-close").addEventListener("click",Ve),t.addEventListener("click",e=>{e.target===t&&Ve()})}function Ve(){Ce==null||Ce.classList.remove("active")}function ao(t,{onSave:e,onDelete:a}={}){var s;eo(),document.getElementById("fe-title").textContent="Edit Feature",so(t.properties||{},((s=t.geometry)==null?void 0:s.type)||"Unknown",!1,e,a),Ce.classList.add("active")}function ai(t,{onSave:e}={}){eo(),document.getElementById("fe-title").textContent="Add New Feature",so({},t,!0,e,null),Ce.classList.add("active")}function so(t,e,a,s,i){const r=document.getElementById("fe-body"),o=Object.entries(t).filter(([l])=>!Pd.has(l)&&!$r.has(l));let n='<div style="padding:16px">';n+=`<div style="font-size:12px;color:var(--text-secondary);margin-bottom:14px;padding:5px 10px;background:var(--gray-50,#f8f9fa);border-radius:4px;display:inline-flex;align-items:center;gap:6px">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
    Geometry: <strong>${e}</strong>
  </div>`,n+='<form id="fe-form">',n+='<div style="font-weight:700;font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">NBSAP Standard Fields</div>';for(const l of Cr){const c=t[l.key]??"",h=l.required?' <span style="color:var(--danger)">*</span>':"";n+=`<div style="margin-bottom:10px">
      <label style="font-size:12px;font-weight:600;display:block;margin-bottom:3px">${l.label}${h}</label>`,l.type==="select"?n+=`<select name="${l.key}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px">
        ${l.options.map(u=>`<option value="${Za(u)}" ${String(c)===u?"selected":""}>${u||"(none)"}</option>`).join("")}
      </select>`:l.type==="textarea"?n+=`<textarea name="${l.key}" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px;resize:vertical;box-sizing:border-box">${Tr(c)}</textarea>`:n+=`<input type="${l.type}" name="${l.key}" value="${Za(c)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px;box-sizing:border-box">`,n+="</div>"}if(o.length>0){n+='<div style="font-weight:700;font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.6px;margin:14px 0 10px">Other Attributes</div>';for(const[l,c]of o)n+=`<div style="margin-bottom:8px">
        <label style="font-size:12px;font-weight:600;display:block;margin-bottom:3px">${Tr(l)}</label>
        <input type="text" name="__custom__${Za(l)}" value="${Za(String(c??""))}" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;box-sizing:border-box">
      </div>`}n+='<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">',!a&&i&&(n+='<button type="button" class="btn btn-sm btn-danger" id="fe-delete" style="margin-right:auto">Delete Feature</button>'),n+=`<button type="button" class="btn btn-sm btn-outline" id="fe-cancel">Cancel</button>
    <button type="submit" class="btn btn-sm btn-primary">${a?"Add Feature":"Save Changes"}</button>
  </div></form></div>`,r.innerHTML=n,document.getElementById("fe-cancel").addEventListener("click",Ve),!a&&i&&document.getElementById("fe-delete").addEventListener("click",async()=>{await Xt("Delete this feature? This cannot be undone.",{title:"Delete Feature",okLabel:"Delete",danger:!0})&&(Ve(),i())}),document.getElementById("fe-form").addEventListener("submit",l=>{l.preventDefault();const c=l.target,h={};for(const u of Cr){const d=c.elements[u.key];if(!d)continue;const p=d.value.trim();h[u.key]=u.type==="number"&&p!==""?Number(p):p||null}h.targets=t.targets??[];for(const u of $r)t[u]!=null&&(h[u]=t[u]);for(const[u]of o){const d=c.elements[`__custom__${u}`];d&&(h[u]=d.value)}Ve(),s==null||s(h)})}function Tr(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Za(t){return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}let si="",ii="All",ri="All",ni="All",We=null;function Cd(){const t=document.getElementById("page-portal");t.innerHTML=`
    <div class="portal-layout">
      <div class="portal-main">
        <div class="portal-toolbar">
          <input type="text" class="search-input" id="portal-search" placeholder="Search layers by name, category, or target...">
          <select id="portal-filter-target">
            <option value="All">All Targets</option>
          </select>
          <select id="portal-filter-category">
            <option value="All">All Categories</option>
            ${Object.entries(Y).map(([i,r])=>`<option value="${i}">${r.label}</option>`).join("")}
          </select>
          <select id="portal-filter-status">
            <option value="All">All Status</option>
            <option value="Clean">Clean</option>
            <option value="Warnings">Warnings</option>
            <option value="Failed">Failed</option>
          </select>
          ${Ct()?`<button class="btn btn-sm btn-outline" id="btn-metadata-report" title="Download metadata report for all datasets" style="margin-left:auto;white-space:nowrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Metadata Report
          </button>`:""}
        </div>
        <div id="portal-table-container"></div>
      </div>
      <div class="portal-sidebar" id="portal-sidebar" style="display:none"></div>
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

    <!-- Dataset preview modal -->
    <div class="modal-overlay" id="preview-modal">
      <div class="modal" style="max-width:900px;width:95vw;height:90vh;max-height:90vh;display:flex;flex-direction:column;overflow:hidden">
        <div class="modal-header" style="flex-shrink:0">
          <h3 id="preview-modal-title">Dataset Preview</h3>
          <button class="modal-close" id="preview-modal-close">&times;</button>
        </div>
        <div style="display:flex;gap:6px;padding:8px 16px;border-bottom:1px solid var(--border);flex-shrink:0;align-items:center">
          <button class="btn btn-sm btn-primary" id="preview-tab-map">Map View</button>
          <button class="btn btn-sm btn-outline" id="preview-tab-table">Attribute Table</button>
          <span id="preview-feature-count" style="font-size:12px;color:var(--text-secondary);margin-left:auto;align-self:center"></span>
        </div>
        ${Ct()?`<div id="preview-draw-toolbar" style="display:none;gap:6px;padding:6px 16px;border-bottom:1px solid var(--border);background:var(--gray-50,#f8f9fa);flex-shrink:0;align-items:center;flex-wrap:wrap">
          <span style="font-size:12px;font-weight:600;color:var(--text-secondary)">Add Feature:</span>
          <button class="btn btn-sm btn-outline" id="draw-point-btn" title="Click map to place a point">Point</button>
          <button class="btn btn-sm btn-outline" id="draw-polygon-btn" title="Click vertices, double-click to finish">Polygon</button>
          <button class="btn btn-sm btn-outline" id="draw-line-btn" title="Click vertices, double-click to finish">Line</button>
          <button class="btn btn-sm btn-danger" id="draw-cancel-btn" style="display:none">Cancel Draw</button>
          <span id="draw-hint" style="font-size:12px;color:var(--primary);font-style:italic"></span>
        </div>`:""}
        <div id="preview-loading" style="display:none;padding:48px;text-align:center;color:var(--text-secondary)">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:8px;opacity:.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <div>Loading dataset&hellip;</div>
        </div>
        <div id="preview-map-panel" style="flex:1;min-height:0;display:flex;flex-direction:column">
          <div id="preview-map" style="flex:1;min-height:0"></div>
        </div>
        <div id="preview-table-panel" style="display:none;flex:1;min-height:0;overflow:auto;padding:0">
          <div id="preview-table-body"></div>
        </div>
        <div id="preview-no-data" style="display:none;padding:48px;text-align:center;color:var(--text-secondary)">
          No spatial data available for this dataset.
        </div>
      </div>
    </div>
  `;const e=document.getElementById("portal-filter-target"),a=Ut.targets||[];for(const i of a){const r=document.createElement("option");r.value=i.code,r.textContent=i.code,e.appendChild(r)}document.getElementById("portal-search").addEventListener("input",i=>{si=i.target.value.toLowerCase(),It()}),document.getElementById("portal-filter-target").addEventListener("change",i=>{ii=i.target.value,It()}),document.getElementById("portal-filter-category").addEventListener("change",i=>{ri=i.target.value,It()}),document.getElementById("portal-filter-status").addEventListener("change",i=>{ni=i.target.value,It()});const s=document.getElementById("btn-metadata-report");s&&s.addEventListener("click",ro),document.getElementById("meta-editor-close").addEventListener("click",ms),document.getElementById("metadata-editor-modal").addEventListener("click",i=>{i.target===i.currentTarget&&ms()}),document.getElementById("preview-modal-close").addEventListener("click",Nr),document.getElementById("preview-modal").addEventListener("click",i=>{i.target===i.currentTarget&&Nr()}),document.getElementById("preview-tab-map").addEventListener("click",()=>li("map")),document.getElementById("preview-tab-table").addEventListener("click",()=>li("table")),document.getElementById("portal-table-container").addEventListener("click",i=>{const r=i.target.closest("button");if(r){const n=r.dataset.id;r.classList.contains("action-preview")?Id(n):r.classList.contains("action-view")?(We=n,gs(n),It()):r.classList.contains("action-rename")?io(n):r.classList.contains("action-download")?Nd(n):r.classList.contains("action-remove")&&Rd(n);return}const o=i.target.closest("tr[data-layer-id]");o&&(We=o.dataset.layerId,gs(We),It())}),It()}function $d(t){const e=Gs(t);return e.complete?'<span class="badge badge-success" title="All required metadata filled" style="font-size:10px">META OK</span>':`<span class="badge" style="font-size:10px;background:#fff3cd;color:#856404;border:1px solid #ffc107" title="Missing: ${e.missing.join(", ")}">${e.pct}%</span>`}function Td(t){const e=Gs(t),a=e.pct||0,s=a===100?"complete":a>=60?"partial":"poor";return`
    <div class="completeness-bar" title="${a===100?"All metadata complete":`Missing: ${(e.missing||[]).join(", ")}`}">
      <div class="completeness-track">
        <div class="completeness-fill ${s}" style="width:${a}%"></div>
      </div>
      <span class="completeness-pct">${a}%</span>
    </div>`}function Ld(t){if(!t)return'<span class="freshness-badge unknown">Unknown</span>';const e=Math.floor((Date.now()-new Date(t).getTime())/864e5);return e<=30?`<span class="freshness-badge fresh" title="${e}d ago">Fresh</span>`:e<=180?`<span class="freshness-badge recent" title="${e}d ago">${Math.floor(e/30)}mo</span>`:`<span class="freshness-badge stale" title="${e}d ago">${Math.floor(e/30)}mo old</span>`}function Lr(t){var l;const e=t.metadata;if(!e)return"";const a=Y[e.category]||{},s=e.isReference===!0,i=Ct(),r=e.status||"Clean";let o;if(s){const c=ct.nationalBaselines,h=e.realm==="marine"?c.marine_ha:c.terrestrial_ha;o=`<span style="font-weight:600">${(h>0?(e.totalAreaHa||0)/h*100:0).toFixed(1)}%</span>`}else o=`${e.featureCount||0}`;const n=i;return`
    <tr data-layer-id="${t.id}" class="${We===t.id?"selected":""}" style="cursor:pointer">
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:4px;height:24px;border-radius:2px;background:${a.color||"#95a5a6"};flex-shrink:0"></span>
          <div>
            <strong>${_t(e.name)||"Untitled"}</strong>
            ${s?'<span style="display:inline-block;background:#fef3cd;color:#856404;font-size:10px;font-weight:700;padding:0 5px;border-radius:10px;margin-left:5px;vertical-align:middle">REF</span>':""}
            ${$d(e)}
          </div>
        </div>
      </td>
      <td><span style="font-size:12px;color:var(--text-secondary);display:inline-flex;align-items:center;gap:4px"><span style="color:${a.color||"#78909C"}">${ia(e.category,14)}</span>${((l=Y[e.category])==null?void 0:l.label)||e.category||"Other"}</span></td>
      <td style="text-transform:capitalize">${e.realm||"unknown"}</td>
      <td>${o}</td>
      <td><span class="badge badge-${r.toLowerCase()}">${r}</span></td>
      <td>${Td(e)}</td>
      <td style="font-size:12px;color:var(--text-secondary)">${Ld(e.uploadTimestamp)}</td>
      <td class="actions">
        <button class="btn btn-sm btn-outline action-view" data-id="${t.id}">Details</button>
        <button class="btn btn-sm btn-outline action-preview" data-id="${t.id}" title="Preview map and attributes">Preview</button>
        ${i?`<button class="btn btn-sm btn-outline action-rename" data-id="${t.id}" title="Rename layer">Rename</button>`:""}
        ${i?`<button class="btn btn-sm btn-outline action-download" data-id="${t.id}">GeoJSON</button>`:""}
        ${n?`<button class="btn btn-sm btn-danger action-remove" data-id="${t.id}">Remove</button>`:""}
      </td>
    </tr>
  `}function It(){var c;const t=H(),e=document.getElementById("portal-table-container");if(!e)return;let a=t.layers||[];if(a=a.filter(h=>h.metadata!=null),a=a.filter(h=>{const u=h.metadata;return!(si&&!`${u.name||""} ${u.category||""} ${(u.targets||[]).join(" ")} ${u.originalFilename||""}`.toLowerCase().includes(si)||ii!=="All"&&!(u.targets||[]).includes(ii)||ri!=="All"&&u.category!==ri||ni!=="All"&&(u.status||"")!==ni)}),a.length===0){e.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
        </div>
        <div class="empty-state-title">No layers found</div>
        <div class="empty-state-text">${Ct()?"Go to the Admin tab to upload shapefiles":"No data available yet"}</div>
      </div>
    `;return}const s=Ut.targets||[],i={},r=[];for(const h of a){const u=((c=h.metadata)==null?void 0:c.targets)||[];if(u.length===0)r.push(h);else for(const d of u)i[d]||(i[d]=[]),i[d].push(h)}const o=`
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
    </thead>`;let n="";for(const h of s){const u=i[h.code];!u||u.length===0||(n+=`
      <div class="portal-target-group">
        <div class="portal-group-header" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:${h.color||"#0072BC"}0A;border:1px solid ${h.color||"#0072BC"}30;border-radius:8px 8px 0 0;margin-top:16px">
          <span class="badge" style="font-size:13px;font-weight:700;padding:3px 10px;background:${h.color||"#0072BC"};color:#fff;border-radius:20px;display:inline-flex;align-items:center;gap:4px">${Ni(h.code,14)} ${h.code}</span>
          <span style="font-weight:600;font-size:14px;color:var(--text-primary)">${h.name}</span>
          <span style="font-size:12px;color:var(--text-secondary);margin-left:auto">${u.length} dataset${u.length!==1?"s":""}</span>
        </div>
        <table class="data-table" style="border-top:none;border-radius:0 0 8px 8px;margin-bottom:0">
          ${o}
          <tbody>
            ${u.map(d=>Lr(d)).join("")}
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
            ${r.map(h=>Lr(h)).join("")}
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
    `),e.innerHTML=n;const l=e.querySelector("#btn-download-metadata-report");l&&l.addEventListener("click",ro)}function gs(t){var c;const e=H(),a=document.getElementById("portal-sidebar"),s=e.layers.find(h=>h.id===t);if(!s){a.style.display="none",a.innerHTML="";return}a.style.display="";const i=s.metadata,r=to(i,s.geojson),o=Y[i.category]||{},n=Gs(i),l=Ct();if(a.innerHTML=`
    <div class="detail-header" style="justify-content:space-between">
      <div style="display:flex;align-items:center;gap:10px;min-width:0">
        <span style="width:4px;height:28px;border-radius:2px;background:${o.color||"#95a5a6"};flex-shrink:0"></span>
        <h4 style="margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${_t(i.name)}</h4>
      </div>
      <button id="btn-close-sidebar" style="background:none;border:none;cursor:pointer;color:var(--text-secondary);padding:4px;line-height:1;flex-shrink:0" title="Close">&times;</button>
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
          <tr><td>Category</td><td><span style="display:inline-flex;align-items:center;gap:4px"><span style="color:${o.color||"#78909C"}">${ia(i.category,14)}</span>${((c=Y[i.category])==null?void 0:c.label)||i.category}</span></td></tr>
          <tr><td>Targets</td><td>${i.targets.map(h=>{const u=(Ut.targets||[]).find(d=>d.code===h);return`<span class="badge" style="margin-right:3px;background:${(u==null?void 0:u.color)||"#0072BC"}20;color:${(u==null?void 0:u.color)||"#0072BC"};border:1px solid ${(u==null?void 0:u.color)||"#0072BC"}40;display:inline-flex;align-items:center;gap:3px">${Ni(h,12)} ${h}</span>`}).join("")}</td></tr>
          <tr><td>Realm</td><td style="text-transform:capitalize">${i.realm}</td></tr>
          ${i.isReference?(()=>{const h=ct.nationalBaselines,u=i.realm==="marine"?h.marine_ha:h.terrestrial_ha;return`<tr><td>Coverage</td><td><strong>${(u>0?(i.totalAreaHa||0)/u*100:0).toFixed(1)}%</strong> of national ${i.realm==="marine"?"marine":"terrestrial"} area</td></tr>
          <tr><td>Total area</td><td><strong>${i.totalAreaHa.toFixed(2)} ha</strong></td></tr>`})():`<tr><td>Records</td><td>${i.featureCount}</td></tr>
          <tr><td>Total area</td><td><strong>${i.totalAreaHa.toFixed(2)} ha</strong></td></tr>`}
          <tr><td>30x30</td><td>${i.countsToward30x30?'<span class="badge badge-success">Yes</span>':'<span class="badge" style="background:var(--gray-100);color:var(--text-secondary)">No</span>'}</td></tr>
          ${i.description?`<tr><td>Description</td><td style="font-size:12px">${_t(i.description)}</td></tr>`:""}
          ${i.custodianAgency?`<tr><td>Custodian</td><td>${_t(i.custodianAgency)}</td></tr>`:""}
          ${i.dataSource?`<tr><td>Data Source</td><td>${_t(i.dataSource)}</td></tr>`:""}
          ${i.accessClassification&&i.accessClassification!=="Public"?`<tr><td>Access</td><td>${_t(i.accessClassification)}</td></tr>`:""}
        </table>
      </div>
    </div>

    ${n.complete?"":`
    <div class="card" style="margin-bottom:14px;border-color:#ffc107">
      <div class="card-header" style="background:#fff8e1">
        <span style="color:#856404;font-weight:600">Missing Metadata</span>
      </div>
      <div class="card-body">
        ${n.missing.map(h=>`<div style="font-size:12px;color:#856404;margin-bottom:3px">- ${h}</div>`).join("")}
        ${l?'<div style="margin-top:8px"><button class="btn btn-sm btn-primary" id="btn-fill-metadata">Fill in now</button></div>':""}
      </div>
    </div>`}

    <div class="card" style="margin-bottom:14px">
      <div class="card-header">TOR Compliance</div>
      <div class="card-body">
        ${r.compliant?'<div style="display:flex;align-items:center;gap:8px;color:var(--success);font-weight:600;font-size:13px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>All checks passed</div>':r.issues.map(h=>`<div style="display:flex;align-items:flex-start;gap:6px;color:var(--warning);font-size:12px;margin-bottom:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${h}</div>`).join("")}
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
          ${i.warnings.map(h=>`<div style="font-size:12px;color:var(--warning);margin-bottom:4px;display:flex;align-items:flex-start;gap:6px"><span style="flex-shrink:0">-</span>${h}</div>`).join("")}
        </div>
      </div>
    `:""}
  `,a.querySelector("#btn-close-sidebar").addEventListener("click",()=>{We=null,a.style.display="none",a.innerHTML="",It()}),l){const h=a.querySelector("#btn-edit-metadata");h&&h.addEventListener("click",()=>Ir(t));const u=a.querySelector("#btn-rename-layer");u&&u.addEventListener("click",()=>io(t));const d=a.querySelector("#btn-fill-metadata");d&&d.addEventListener("click",()=>Ir(t))}}async function io(t){const a=H().layers.find(r=>r.id===t);if(!a)return;const s=await Yn("Enter new layer name:",a.metadata.name,{title:"Rename Layer"});if(!s||s.trim()===""||s===a.metadata.name)return;const i={...a.metadata,name:s.trim(),dateUpdated:new Date().toISOString().split("T")[0]};xn(t,i),await yn(t,i),gs(t),It()}function Ir(t){const a=H().layers.find(o=>o.id===t);if(!a)return;const s=a.metadata,i=document.getElementById("meta-editor-body");let r='<form id="meta-editor-form" style="padding:16px">';for(const o of ta){const n=s[o.key]||"",l=o.required?'<span style="color:var(--danger);font-weight:700">*</span>':"";r+=`<div class="form-group" style="margin-bottom:12px">
      <label style="font-weight:600;font-size:13px">${o.label} ${l}</label>`,o.type==="select"&&o.options?r+=`<select name="${o.key}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm)">
        <option value="">-- Select --</option>
        ${o.options.map(c=>`<option value="${c}" ${n===c?"selected":""}>${c}</option>`).join("")}
      </select>`:o.type==="date"?r+=`<input type="date" name="${o.key}" value="${n}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm)">`:o.key==="description"||o.key==="dataLimitations"||o.key==="collectionMethod"?r+=`<textarea name="${o.key}" rows="2" class="form-control" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);resize:vertical">${n}</textarea>`:r+=`<input type="text" name="${o.key}" value="${oi(n)}" class="form-control" style="width:100%;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm)">`,r+=`<div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${o.hint}</div>
    </div>`}r+=`<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">
    <button type="button" class="btn btn-outline" id="meta-editor-cancel">Cancel</button>
    <button type="submit" class="btn btn-primary">Save Metadata</button>
  </div></form>`,i.innerHTML=r,document.getElementById("metadata-editor-modal").classList.add("active"),i.querySelector("#meta-editor-cancel").addEventListener("click",ms),i.querySelector("#meta-editor-form").addEventListener("submit",async o=>{o.preventDefault();const n=o.target,l={};for(const h of ta){const u=n.elements[h.key];u&&(l[h.key]=u.value.trim())}l.dateUpdated=new Date().toISOString().split("T")[0];const c={...s,...l};xn(t,c),await yn(t,c),ms(),gs(t),It()})}function ms(){document.getElementById("metadata-editor-modal").classList.remove("active")}function oi(t){return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}function ro(){const e=H().layers||[];if(e.length===0){Qe("No datasets to export.");return}const a=ta.map(l=>l.label);a.push("Targets","Realm","Feature Count","Total Area (ha)","Status","Upload Date","Completeness %");const s=[a];for(const l of e){const c=l.metadata,h=Gs(c),u=ta.map(d=>{const p=c[d.key];return p!=null&&String(p).trim()!==""?String(p):"(empty)"});u.push((c.targets||[]).length>0?c.targets.join("; "):"(empty)",c.realm||"(empty)",String(c.featureCount||0),(c.totalAreaHa||0).toFixed(2),c.status||"(empty)",c.uploadTimestamp?new Date(c.uploadTimestamp).toLocaleDateString():"(empty)",String(h.pct)),s.push(u)}const i=s.map(l=>l.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join(`
`),r=new Blob([i],{type:"text/csv"}),o=URL.createObjectURL(r),n=document.createElement("a");n.href=o,n.download=`metadata-report-${new Date().toISOString().slice(0,10)}.csv`,n.click(),URL.revokeObjectURL(o)}let $e=[],X=null,At=null,Ot=[],Ae=null,Te=!1;async function Id(t){const e=H();let a=e.layers.find(h=>h.id===t);if(!a)return;At=t,$e=[];const s=document.getElementById("preview-modal"),i=document.getElementById("preview-loading"),r=document.getElementById("preview-map-panel"),o=document.getElementById("preview-table-panel"),n=document.getElementById("preview-no-data");if(document.getElementById("preview-modal-title").textContent=a.metadata.name,document.getElementById("preview-feature-count").textContent="",i.style.display="block",r.style.display="none",o.style.display="none",n.style.display="none",li("map"),s.classList.add("active"),!a.geojson)try{const h=await Aa(t);if(h&&h.geojson){const u=e.layers.findIndex(d=>d.id===t);u>=0&&(e.layers[u]={...e.layers[u],geojson:h.geojson},a=e.layers[u])}}catch(h){console.error("Preview: failed to load GeoJSON",h)}if(i.style.display="none",!a.geojson||!(a.geojson.features||[]).length){n.style.display="block";return}const l=(a.geojson.features||[]).length;document.getElementById("preview-feature-count").textContent=`${l.toLocaleString()} feature${l!==1?"s":""}`,r.style.display="flex",no(a),oo(a);const c=document.getElementById("preview-draw-toolbar");c&&(c.style.display="flex",co())}function Nr(){xa(),Ve(),document.getElementById("preview-modal").classList.remove("active"),X&&(X.remove(),X=null),At=null}function li(t){const e=document.getElementById("preview-map-panel"),a=document.getElementById("preview-table-panel"),s=document.getElementById("preview-tab-map"),i=document.getElementById("preview-tab-table");t==="map"?(e.style.display="flex",a.style.display="none",s.className="btn btn-sm btn-primary",i.className="btn btn-sm btn-outline",X&&setTimeout(()=>X.invalidateSize(),50)):(e.style.display="none",a.style.display="block",s.className="btn btn-sm btn-outline",i.className="btn btn-sm btn-primary")}function no(t){const e=document.getElementById("preview-map"),s=(Y[t.metadata.category]||{}).color||"#006B3F";X&&(X.remove(),X=null),X=D.map(e,{zoomControl:!0}),D.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"&copy; OpenStreetMap contributors &copy; CARTO",subdomains:"abcd",maxZoom:19}).addTo(X);const i=D.geoJSON(t.geojson,{style:()=>({color:s,weight:1.5,opacity:.9,fillColor:s,fillOpacity:.25}),pointToLayer:(r,o)=>D.circleMarker(o,{radius:6,fillColor:s,color:"#fff",weight:1,opacity:1,fillOpacity:.8}),onEachFeature:(r,o)=>{if(r.properties)if(Ct())o.on("click",n=>{if(Te)return;D.DomEvent.stopPropagation(n);const l=H().layers.find(h=>h.id===At);if(!(l!=null&&l.geojson))return;const c=l.geojson.features.indexOf(r);c<0||ao(r,{onSave:h=>lo(c,h),onDelete:()=>ci(c)})}),o.on("mouseover",()=>{var n;Te||(n=o.setStyle)==null||n.call(o,{weight:3,fillOpacity:.5})}),o.on("mouseout",()=>{var n;Te||(n=o.setStyle)==null||n.call(o,{weight:1.5,fillOpacity:.25})});else{const n=Object.entries(r.properties).filter(([,l])=>l!=null&&String(l).trim()!=="").map(([l,c])=>`<tr><td style="font-weight:600;padding:2px 8px 2px 0;white-space:nowrap">${l}</td><td style="padding:2px 0">${c}</td></tr>`).join("");n&&o.bindPopup(`<table style="font-size:12px;border-collapse:collapse">${n}</table>`,{maxWidth:280})}}}).addTo(X);try{X.fitBounds(i.getBounds(),{padding:[20,20]})}catch{X.setView([-15.3767,166.9592],7)}}function oo(t){var f,m,g;const e=document.getElementById("preview-table-body"),a=t.geojson.features||[],s=200,i=new Set,r=a.slice(0,s);for(const v of r)v.properties&&Object.keys(v.properties).forEach(y=>i.add(y));const o=[...i];if(o.length===0){e.innerHTML='<div style="padding:24px;color:var(--text-secondary);text-align:center">No attribute data found.</div>';return}const n=Ct(),l=$e.length===0?"disabled":"",c=n?`
    <div style="display:flex;gap:6px;padding:6px 12px;border-bottom:1px solid var(--border);background:var(--gray-50,#f8f9fa);align-items:center;flex-wrap:wrap;flex-shrink:0">
      <span style="font-size:12px;font-weight:600;color:var(--text-secondary)">Admin:</span>
      <button class="btn btn-sm btn-outline" id="tbl-add-row-btn" style="font-size:11px;padding:2px 10px">+ Add Row</button>
      <button class="btn btn-sm btn-outline" id="tbl-add-col-btn" style="font-size:11px;padding:2px 10px">+ Add Column</button>
      <button class="btn btn-sm btn-outline" id="tbl-undo-btn" style="font-size:11px;padding:2px 10px" ${l}>&#8617; Undo</button>
    </div>`:"",h=n?'<th style="padding:6px 10px;background:var(--gray-50,#f8f9fa);font-weight:600;font-size:12px;border-bottom:2px solid var(--border);white-space:nowrap">Actions</th>':"",u=o.map(v=>{const y=n?`<button class="tbl-del-col btn btn-sm btn-danger" data-key="${oi(v)}" title="Delete column" style="padding:0 5px;font-size:10px;margin-left:4px;line-height:1.4">&times;</button>`:"";return`<th style="white-space:nowrap;padding:6px 10px;background:var(--gray-50,#f8f9fa);font-weight:600;font-size:12px;border-bottom:2px solid var(--border)">${v}${y}</th>`}).join("")+h,d=r.map((v,y)=>{const _=v.properties||{},b=o.map(w=>`<td style="padding:5px 10px;font-size:12px;white-space:nowrap;max-width:200px;overflow:hidden;text-overflow:ellipsis" title="${oi(String(_[w]??""))}">${_[w]??""}</td>`).join(""),x=n?`<td style="padding:4px 8px;white-space:nowrap">
          <button class="btn btn-sm btn-outline tbl-edit-feat" data-idx="${y}" style="padding:2px 8px;font-size:11px">Edit</button>
          <button class="btn btn-sm btn-danger tbl-del-feat" data-idx="${y}" style="padding:2px 8px;font-size:11px;margin-left:4px">Del</button>
        </td>`:"";return`<tr style="background:${y%2===0?"#fff":"var(--gray-50,#f8f9fa)"}">${b}${x}</tr>`}).join(""),p=a.length>s?`<div style="padding:8px 12px;font-size:12px;color:var(--text-secondary);background:var(--gray-50,#f8f9fa);border-top:1px solid var(--border)">Showing first ${s} of ${a.length.toLocaleString()} features.</div>`:"";e.innerHTML=c+`
    <div style="overflow:auto">
      <table style="border-collapse:collapse;width:100%;min-width:max-content">
        <thead><tr>${u}</tr></thead>
        <tbody>${d}</tbody>
      </table>
    </div>
    ${p}
  `,n&&((f=document.getElementById("tbl-add-row-btn"))==null||f.addEventListener("click",()=>Gd()),(m=document.getElementById("tbl-add-col-btn"))==null||m.addEventListener("click",()=>Bd()),(g=document.getElementById("tbl-undo-btn"))==null||g.addEventListener("click",()=>Fd()),e.querySelectorAll(".tbl-del-col").forEach(v=>{v.addEventListener("click",()=>Dd(v.dataset.key))}),e.querySelectorAll(".tbl-edit-feat").forEach(v=>{v.addEventListener("click",()=>{var x,w;const y=parseInt(v.dataset.idx,10),_=H().layers.find(E=>E.id===At),b=(w=(x=_==null?void 0:_.geojson)==null?void 0:x.features)==null?void 0:w[y];b&&ao(b,{onSave:E=>lo(y,E),onDelete:()=>ci(y)})})}),e.querySelectorAll(".tbl-del-feat").forEach(v=>{v.addEventListener("click",()=>{const y=parseInt(v.dataset.idx,10);ci(y)})}))}function Nd(t){const a=H().layers.find(n=>n.id===t);if(!a||!a.geojson)return;const s=JSON.stringify(a.geojson),i=new Blob([s],{type:"application/json"}),r=URL.createObjectURL(i),o=document.createElement("a");o.href=r,o.download=`${a.metadata.name.replace(/\s+/g,"_")}.geojson`,o.click(),URL.revokeObjectURL(r)}async function Rd(t){var i,r,o;if(!await Xt("Remove this layer? This cannot be undone.",{title:"Delete Layer",okLabel:"Delete",danger:!0}))return;const a=H().layers.find(n=>n.id===t);try{await Ra(t)}catch(n){console.error("Failed to delete layer from storage:",n),Qe("Failed to delete layer. Please try again.",{title:"Error"});return}$s(t);try{await Nt("layerTracker",H().layerTracker)}catch(n){console.warn("Failed to save tracker after deletion:",n)}await se({action:"delete",layer_id:t,filename:((i=a==null?void 0:a.metadata)==null?void 0:i.originalFilename)||"",targets:((r=a==null?void 0:a.metadata)==null?void 0:r.targets)||[],category:((o=a==null?void 0:a.metadata)==null?void 0:o.category)||"",result:"deleted"}).catch(()=>{}),We=null;const s=document.getElementById("portal-sidebar");s.style.display="none",s.innerHTML="",It()}async function na(t,e="edit_feature",a=!1){var c,h,u,d;const s=H(),i=s.layers.find(p=>p.id===At);if(!i)return;!a&&((c=i.geojson)!=null&&c.features)&&($e.push(JSON.parse(JSON.stringify(i.geojson.features))),$e.length>50&&$e.shift());const r={...i.geojson,features:t},o={...i.metadata,featureCount:t.length},n=s.layers.findIndex(p=>p.id===At);n>=0&&(s.layers[n]={...s.layers[n],geojson:r,metadata:o});try{await aa({id:At,metadata:o,geojson:r})}catch(p){console.error("Failed to save feature changes:",p),Qe("Failed to save changes. Please try again.",{title:"Error"});return}await se({action:e,layer_id:At,filename:((h=i.metadata)==null?void 0:h.originalFilename)||"",targets:((u=i.metadata)==null?void 0:u.targets)||[],category:((d=i.metadata)==null?void 0:d.category)||"",result:"success"}).catch(()=>{});const l=s.layers.find(p=>p.id===At);l&&(document.getElementById("preview-feature-count").textContent=`${t.length.toLocaleString()} feature${t.length!==1?"s":""}`,no(l),oo(l),document.getElementById("preview-draw-toolbar")&&co()),It()}function lo(t,e){const s=H().layers.find(r=>r.id===At);if(!(s!=null&&s.geojson))return;const i=[...s.geojson.features];i[t]={...i[t],properties:e},na(i,"edit_feature")}async function ci(t){const a=H().layers.find(r=>r.id===At);if(!(a!=null&&a.geojson)||!await Xt("Delete this feature? This cannot be undone.",{title:"Delete Feature",okLabel:"Delete",danger:!0}))return;const i=a.geojson.features.filter((r,o)=>o!==t);na(i,"delete_feature")}function di(t,e){const s=H().layers.find(o=>o.id===At);if(!(s!=null&&s.geojson))return;const i={type:"Feature",geometry:t,properties:e},r=[...s.geojson.features,i];na(r,"add_feature")}function Gd(){ai("None",{onSave:t=>di(null,t)})}async function Bd(){const t=await Yn("Column name:","",{title:"Add Column"});if(!(t!=null&&t.trim()))return;const e=t.trim(),s=H().layers.find(r=>r.id===At);if(!(s!=null&&s.geojson))return;const i=s.geojson.features.map(r=>({...r,properties:{...r.properties||{},[e]:""}}));na(i,"add_column")}async function Dd(t){if(!await Xt(`Delete column '${t}' from all features?`,{title:"Delete Column",okLabel:"Delete",danger:!0}))return;const s=H().layers.find(r=>r.id===At);if(!(s!=null&&s.geojson))return;const i=s.geojson.features.map(r=>{const o={...r.properties||{}};return delete o[t],{...r,properties:o}});na(i,"delete_column")}async function Fd(){if($e.length===0)return;const t=$e.pop();na(t,"undo",!0)}function co(t){const e=document.getElementById("draw-point-btn"),a=document.getElementById("draw-polygon-btn"),s=document.getElementById("draw-line-btn"),i=document.getElementById("draw-cancel-btn");e&&(e.onclick=()=>Ws("Point"),a.onclick=()=>Ws("Polygon"),s.onclick=()=>Ws("LineString"),i.onclick=()=>xa())}function Ws(t){if(!X)return;xa(),Te=!0,Ot=[];const e=X.getContainer();e.style.cursor="crosshair";const a=document.getElementById("draw-hint"),s=document.getElementById("draw-cancel-btn");a&&(a.textContent=t==="Point"?"Click to place point":"Click vertices — double-click to finish"),s&&(s.style.display="");function i(n){if(Te){if(t==="Point"){const l={type:"Point",coordinates:[n.latlng.lng,n.latlng.lat]};xa(),ai(t,{onSave:c=>di(l,c)});return}Ot.push([n.latlng.lng,n.latlng.lat]),Rr(n.latlng,t)}}function r(n){if(!Te||t==="Point")return;Ot.length>0&&Ot.pop();const l=t==="Polygon"?3:2;if(Ot.length<l){const h=document.getElementById("draw-hint");h&&(h.textContent=`Need at least ${l} vertices`);return}let c;t==="Polygon"?c={type:"Polygon",coordinates:[[...Ot,Ot[0]]]}:c={type:"LineString",coordinates:[...Ot]},xa(),ai(t,{onSave:h=>di(c,h)})}function o(n){Ot.length>0&&Rr(n.latlng,t)}X.on("click",i),X.on("dblclick",r),X.on("mousemove",o),is=()=>{X==null||X.off("click",i),X==null||X.off("dblclick",r),X==null||X.off("mousemove",o),e&&(e.style.cursor="");const n=document.getElementById("draw-hint"),l=document.getElementById("draw-cancel-btn");n&&(n.textContent=""),l&&(l.style.display="none")}}let is=null;function xa(){Te=!1,Ot=[],Ae&&X&&(X.removeLayer(Ae),Ae=null),is&&(is(),is=null)}function Rr(t,e){if(Ae&&X&&X.removeLayer(Ae),Ot.length===0)return;const a=[...Ot,[t.lng,t.lat]],s=a.map(([i,r])=>[r,i]);e==="Polygon"&&a.length>=3?Ae=D.polygon(s,{color:"#0072BC",weight:2,fillOpacity:.15,dashArray:"6,4"}).addTo(X):Ae=D.polyline(s,{color:"#0072BC",weight:2,dashArray:"6,4"}).addTo(X)}function Vi(){It()}const Od="modulepreload",zd=function(t,e){return new URL(t,e).href},Gr={},Br=function(e,a,s){let i=Promise.resolve();if(a&&a.length>0){const o=document.getElementsByTagName("link"),n=document.querySelector("meta[property=csp-nonce]"),l=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));i=Promise.allSettled(a.map(c=>{if(c=zd(c,s),c in Gr)return;Gr[c]=!0;const h=c.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!s)for(let f=o.length-1;f>=0;f--){const m=o[f];if(m.href===c&&(!h||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${u}`))return;const p=document.createElement("link");if(p.rel=h?"stylesheet":Od,h||(p.as="script"),p.crossOrigin="",p.href=c,l&&p.setAttribute("nonce",l),document.head.appendChild(p),h)return new Promise((f,m)=>{p.addEventListener("load",f),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=o,window.dispatchEvent(n),!n.defaultPrevented)throw o}return i.then(o=>{for(const n of o||[])n.status==="rejected"&&r(n.reason);return e().catch(r)})};function jd(t){t("EPSG:4326","+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"),t("EPSG:4269","+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees"),t("EPSG:3857","+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");for(var e=1;e<=60;++e)t("EPSG:"+(32600+e),"+proj=utm +zone="+e+" +datum=WGS84 +units=m"),t("EPSG:"+(32700+e),"+proj=utm +zone="+e+" +south +datum=WGS84 +units=m");t("EPSG:5041","+title=WGS 84 / UPS North (E,N) +proj=stere +lat_0=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"),t("EPSG:5042","+title=WGS 84 / UPS South (E,N) +proj=stere +lat_0=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"),t.WGS84=t["EPSG:4326"],t["EPSG:3785"]=t["EPSG:3857"],t.GOOGLE=t["EPSG:3857"],t["EPSG:900913"]=t["EPSG:3857"],t["EPSG:102113"]=t["EPSG:3857"]}var Le=1,Ie=2,Ke=3,qd=4,hi=5,Dr=6378137,Hd=6356752314e-3,Fr=.0066943799901413165,_a=484813681109536e-20,L=Math.PI/2,Ud=.16666666666666666,Vd=.04722222222222222,Wd=.022156084656084655,R=1e-10,ut=.017453292519943295,Pt=57.29577951308232,Q=Math.PI/4,$a=Math.PI*2,gt=3.14159265359,$t={};$t.greenwich=0;$t.lisbon=-9.131906111111;$t.paris=2.337229166667;$t.bogota=-74.080916666667;$t.madrid=-3.687938888889;$t.rome=12.452333333333;$t.bern=7.439583333333;$t.jakarta=106.807719444444;$t.ferro=-17.666666666667;$t.brussels=4.367975;$t.stockholm=18.058277777778;$t.athens=23.7163375;$t.oslo=10.722916666667;const Kd={mm:{to_meter:.001},cm:{to_meter:.01},ft:{to_meter:.3048},"us-ft":{to_meter:1200/3937},fath:{to_meter:1.8288},kmi:{to_meter:1852},"us-ch":{to_meter:20.1168402336805},"us-mi":{to_meter:1609.34721869444},km:{to_meter:1e3},"ind-ft":{to_meter:.30479841},"ind-yd":{to_meter:.91439523},mi:{to_meter:1609.344},yd:{to_meter:.9144},ch:{to_meter:20.1168},link:{to_meter:.201168},dm:{to_meter:.1},in:{to_meter:.0254},"ind-ch":{to_meter:20.11669506},"us-in":{to_meter:.025400050800101},"us-yd":{to_meter:.914401828803658}};var Or=/[\s_\-\/\(\)]/g;function me(t,e){if(t[e])return t[e];for(var a=Object.keys(t),s=e.toLowerCase().replace(Or,""),i=-1,r,o;++i<a.length;)if(r=a[i],o=r.toLowerCase().replace(Or,""),o===s)return t[r]}function ui(t){var e={},a=t.split("+").map(function(n){return n.trim()}).filter(function(n){return n}).reduce(function(n,l){var c=l.split("=");return c.push(!0),n[c[0].toLowerCase()]=c[1],n},{}),s,i,r,o={proj:"projName",datum:"datumCode",rf:function(n){e.rf=parseFloat(n)},lat_0:function(n){e.lat0=n*ut},lat_1:function(n){e.lat1=n*ut},lat_2:function(n){e.lat2=n*ut},lat_ts:function(n){e.lat_ts=n*ut},lon_0:function(n){e.long0=n*ut},lon_1:function(n){e.long1=n*ut},lon_2:function(n){e.long2=n*ut},alpha:function(n){e.alpha=parseFloat(n)*ut},gamma:function(n){e.rectified_grid_angle=parseFloat(n)*ut},lonc:function(n){e.longc=n*ut},x_0:function(n){e.x0=parseFloat(n)},y_0:function(n){e.y0=parseFloat(n)},k_0:function(n){e.k0=parseFloat(n)},k:function(n){e.k0=parseFloat(n)},a:function(n){e.a=parseFloat(n)},b:function(n){e.b=parseFloat(n)},r:function(n){e.a=e.b=parseFloat(n)},r_a:function(){e.R_A=!0},zone:function(n){e.zone=parseInt(n,10)},south:function(){e.utmSouth=!0},towgs84:function(n){e.datum_params=n.split(",").map(function(l){return parseFloat(l)})},to_meter:function(n){e.to_meter=parseFloat(n)},units:function(n){e.units=n;var l=me(Kd,n);l&&(e.to_meter=l.to_meter)},from_greenwich:function(n){e.from_greenwich=n*ut},pm:function(n){var l=me($t,n);e.from_greenwich=(l||parseFloat(n))*ut},nadgrids:function(n){n==="@null"?e.datumCode="none":e.nadgrids=n},axis:function(n){var l="ewnsud";n.length===3&&l.indexOf(n.substr(0,1))!==-1&&l.indexOf(n.substr(1,1))!==-1&&l.indexOf(n.substr(2,1))!==-1&&(e.axis=n)},approx:function(){e.approx=!0},over:function(){e.over=!0}};for(s in a)i=a[s],s in o?(r=o[s],typeof r=="function"?r(i):e[r]=i):e[s]=i;return typeof e.datumCode=="string"&&e.datumCode!=="WGS84"&&(e.datumCode=e.datumCode.toLowerCase()),e.projStr=t,e}class ho{static getId(e){const a=e.find(s=>Array.isArray(s)&&s[0]==="ID");return a&&a.length>=3?{authority:a[1],code:parseInt(a[2],10)}:null}static convertUnit(e,a="unit"){if(!e||e.length<3)return{type:a,name:"unknown",conversion_factor:null};const s=e[1],i=parseFloat(e[2])||null,r=e.find(n=>Array.isArray(n)&&n[0]==="ID"),o=r?{authority:r[1],code:parseInt(r[2],10)}:null;return{type:a,name:s,conversion_factor:i,id:o}}static convertAxis(e){const a=e[1]||"Unknown";let s;const i=a.match(/^\((.)\)$/);if(i){const c=i[1].toUpperCase();if(c==="E")s="east";else if(c==="N")s="north";else if(c==="U")s="up";else throw new Error(`Unknown axis abbreviation: ${c}`)}else s=e[2]?e[2].toLowerCase():"unknown";const r=e.find(c=>Array.isArray(c)&&c[0]==="ORDER"),o=r?parseInt(r[1],10):null,n=e.find(c=>Array.isArray(c)&&(c[0]==="LENGTHUNIT"||c[0]==="ANGLEUNIT"||c[0]==="SCALEUNIT")),l=this.convertUnit(n);return{name:a,direction:s,unit:l,order:o}}static extractAxes(e){return e.filter(a=>Array.isArray(a)&&a[0]==="AXIS").map(a=>this.convertAxis(a)).sort((a,s)=>(a.order||0)-(s.order||0))}static convert(e,a={}){switch(e[0]){case"PROJCRS":a.type="ProjectedCRS",a.name=e[1],a.base_crs=e.find(d=>Array.isArray(d)&&d[0]==="BASEGEOGCRS")?this.convert(e.find(d=>Array.isArray(d)&&d[0]==="BASEGEOGCRS")):null,a.conversion=e.find(d=>Array.isArray(d)&&d[0]==="CONVERSION")?this.convert(e.find(d=>Array.isArray(d)&&d[0]==="CONVERSION")):null;const s=e.find(d=>Array.isArray(d)&&d[0]==="CS");s&&(a.coordinate_system={type:s[1],axis:this.extractAxes(e)});const i=e.find(d=>Array.isArray(d)&&d[0]==="LENGTHUNIT");if(i){const d=this.convertUnit(i);a.coordinate_system.unit=d}a.id=this.getId(e);break;case"BASEGEOGCRS":case"GEOGCRS":a.type="GeographicCRS",a.name=e[1];const r=e.find(d=>Array.isArray(d)&&(d[0]==="DATUM"||d[0]==="ENSEMBLE"));if(r){const d=this.convert(r);r[0]==="ENSEMBLE"?a.datum_ensemble=d:a.datum=d;const p=e.find(f=>Array.isArray(f)&&f[0]==="PRIMEM");p&&p[1]!=="Greenwich"&&(d.prime_meridian={name:p[1],longitude:parseFloat(p[2])})}a.coordinate_system={type:"ellipsoidal",axis:this.extractAxes(e)},a.id=this.getId(e);break;case"DATUM":a.type="GeodeticReferenceFrame",a.name=e[1],a.ellipsoid=e.find(d=>Array.isArray(d)&&d[0]==="ELLIPSOID")?this.convert(e.find(d=>Array.isArray(d)&&d[0]==="ELLIPSOID")):null;break;case"ENSEMBLE":a.type="DatumEnsemble",a.name=e[1],a.members=e.filter(d=>Array.isArray(d)&&d[0]==="MEMBER").map(d=>({type:"DatumEnsembleMember",name:d[1],id:this.getId(d)}));const o=e.find(d=>Array.isArray(d)&&d[0]==="ENSEMBLEACCURACY");o&&(a.accuracy=parseFloat(o[1]));const n=e.find(d=>Array.isArray(d)&&d[0]==="ELLIPSOID");n&&(a.ellipsoid=this.convert(n)),a.id=this.getId(e);break;case"ELLIPSOID":a.type="Ellipsoid",a.name=e[1],a.semi_major_axis=parseFloat(e[2]),a.inverse_flattening=parseFloat(e[3]),e.find(d=>Array.isArray(d)&&d[0]==="LENGTHUNIT")&&this.convert(e.find(d=>Array.isArray(d)&&d[0]==="LENGTHUNIT"),a);break;case"CONVERSION":a.type="Conversion",a.name=e[1],a.method=e.find(d=>Array.isArray(d)&&d[0]==="METHOD")?this.convert(e.find(d=>Array.isArray(d)&&d[0]==="METHOD")):null,a.parameters=e.filter(d=>Array.isArray(d)&&d[0]==="PARAMETER").map(d=>this.convert(d));break;case"METHOD":a.type="Method",a.name=e[1],a.id=this.getId(e);break;case"PARAMETER":a.type="Parameter",a.name=e[1],a.value=parseFloat(e[2]),a.unit=this.convertUnit(e.find(d=>Array.isArray(d)&&(d[0]==="LENGTHUNIT"||d[0]==="ANGLEUNIT"||d[0]==="SCALEUNIT"))),a.id=this.getId(e);break;case"BOUNDCRS":a.type="BoundCRS";const l=e.find(d=>Array.isArray(d)&&d[0]==="SOURCECRS");if(l){const d=l.find(p=>Array.isArray(p));a.source_crs=d?this.convert(d):null}const c=e.find(d=>Array.isArray(d)&&d[0]==="TARGETCRS");if(c){const d=c.find(p=>Array.isArray(p));a.target_crs=d?this.convert(d):null}const h=e.find(d=>Array.isArray(d)&&d[0]==="ABRIDGEDTRANSFORMATION");h?a.transformation=this.convert(h):a.transformation=null;break;case"ABRIDGEDTRANSFORMATION":if(a.type="Transformation",a.name=e[1],a.method=e.find(d=>Array.isArray(d)&&d[0]==="METHOD")?this.convert(e.find(d=>Array.isArray(d)&&d[0]==="METHOD")):null,a.parameters=e.filter(d=>Array.isArray(d)&&(d[0]==="PARAMETER"||d[0]==="PARAMETERFILE")).map(d=>{if(d[0]==="PARAMETER")return this.convert(d);if(d[0]==="PARAMETERFILE")return{name:d[1],value:d[2],id:{authority:"EPSG",code:8656}}}),a.parameters.length===7){const d=a.parameters[6];d.name==="Scale difference"&&(d.value=Math.round((d.value-1)*1e12)/1e6)}a.id=this.getId(e);break;case"AXIS":a.coordinate_system||(a.coordinate_system={type:"unspecified",axis:[]}),a.coordinate_system.axis.push(this.convertAxis(e));break;case"LENGTHUNIT":const u=this.convertUnit(e,"LinearUnit");a.coordinate_system&&a.coordinate_system.axis&&a.coordinate_system.axis.forEach(d=>{d.unit||(d.unit=u)}),u.conversion_factor&&u.conversion_factor!==1&&a.semi_major_axis&&(a.semi_major_axis={value:a.semi_major_axis,unit:u});break;default:a.keyword=e[0];break}return a}}class Yd extends ho{static convert(e,a={}){return super.convert(e,a),a.coordinate_system&&a.coordinate_system.subtype==="Cartesian"&&delete a.coordinate_system,a.usage&&delete a.usage,a}}class Jd extends ho{static convert(e,a={}){super.convert(e,a);const s=e.find(r=>Array.isArray(r)&&r[0]==="CS");s&&(a.coordinate_system={subtype:s[1],axis:this.extractAxes(e)});const i=e.find(r=>Array.isArray(r)&&r[0]==="USAGE");if(i){const r=i.find(l=>Array.isArray(l)&&l[0]==="SCOPE"),o=i.find(l=>Array.isArray(l)&&l[0]==="AREA"),n=i.find(l=>Array.isArray(l)&&l[0]==="BBOX");a.usage={},r&&(a.usage.scope=r[1]),o&&(a.usage.area=o[1]),n&&(a.usage.bbox=n.slice(1))}return a}}function Zd(t){return t.find(e=>Array.isArray(e)&&e[0]==="USAGE")?"2019":(t.find(e=>Array.isArray(e)&&e[0]==="CS")||t[0]==="BOUNDCRS"||t[0]==="PROJCRS"||t[0]==="GEOGCRS","2015")}function Xd(t){return(Zd(t)==="2019"?Jd:Yd).convert(t)}function Qd(t){const e=t.toUpperCase();return e.includes("PROJCRS")||e.includes("GEOGCRS")||e.includes("BOUNDCRS")||e.includes("VERTCRS")||e.includes("LENGTHUNIT")||e.includes("ANGLEUNIT")||e.includes("SCALEUNIT")?"WKT2":(e.includes("PROJCS")||e.includes("GEOGCS")||e.includes("LOCAL_CS")||e.includes("VERT_CS")||e.includes("UNIT"),"WKT1")}var Ta=1,uo=2,po=3,vs=4,fo=5,Wi=-1,th=/\s/,eh=/[A-Za-z]/,ah=/[A-Za-z84_]/,Bs=/[,\]]/,go=/[\d\.E\-\+]/;function oe(t){if(typeof t!="string")throw new Error("not a string");this.text=t.trim(),this.level=0,this.place=0,this.root=null,this.stack=[],this.currentObject=null,this.state=Ta}oe.prototype.readCharicter=function(){var t=this.text[this.place++];if(this.state!==vs)for(;th.test(t);){if(this.place>=this.text.length)return;t=this.text[this.place++]}switch(this.state){case Ta:return this.neutral(t);case uo:return this.keyword(t);case vs:return this.quoted(t);case fo:return this.afterquote(t);case po:return this.number(t);case Wi:return}};oe.prototype.afterquote=function(t){if(t==='"'){this.word+='"',this.state=vs;return}if(Bs.test(t)){this.word=this.word.trim(),this.afterItem(t);return}throw new Error(`havn't handled "`+t+'" in afterquote yet, index '+this.place)};oe.prototype.afterItem=function(t){if(t===","){this.word!==null&&this.currentObject.push(this.word),this.word=null,this.state=Ta;return}if(t==="]"){this.level--,this.word!==null&&(this.currentObject.push(this.word),this.word=null),this.state=Ta,this.currentObject=this.stack.pop(),this.currentObject||(this.state=Wi);return}};oe.prototype.number=function(t){if(go.test(t)){this.word+=t;return}if(Bs.test(t)){this.word=parseFloat(this.word),this.afterItem(t);return}throw new Error(`havn't handled "`+t+'" in number yet, index '+this.place)};oe.prototype.quoted=function(t){if(t==='"'){this.state=fo;return}this.word+=t};oe.prototype.keyword=function(t){if(ah.test(t)){this.word+=t;return}if(t==="["){var e=[];e.push(this.word),this.level++,this.root===null?this.root=e:this.currentObject.push(e),this.stack.push(this.currentObject),this.currentObject=e,this.state=Ta;return}if(Bs.test(t)){this.afterItem(t);return}throw new Error(`havn't handled "`+t+'" in keyword yet, index '+this.place)};oe.prototype.neutral=function(t){if(eh.test(t)){this.word=t,this.state=uo;return}if(t==='"'){this.word="",this.state=vs;return}if(go.test(t)){this.word=t,this.state=po;return}if(Bs.test(t)){this.afterItem(t);return}throw new Error(`havn't handled "`+t+'" in neutral yet, index '+this.place)};oe.prototype.output=function(){for(;this.place<this.text.length;)this.readCharicter();if(this.state===Wi)return this.root;throw new Error('unable to parse string "'+this.text+'". State is '+this.state)};function sh(t){var e=new oe(t);return e.output()}function Ks(t,e,a){Array.isArray(e)&&(a.unshift(e),e=null);var s=e?{}:t,i=a.reduce(function(r,o){return ze(o,r),r},s);e&&(t[e]=i)}function ze(t,e){if(!Array.isArray(t)){e[t]=!0;return}var a=t.shift();if(a==="PARAMETER"&&(a=t.shift()),t.length===1){if(Array.isArray(t[0])){e[a]={},ze(t[0],e[a]);return}e[a]=t[0];return}if(!t.length){e[a]=!0;return}if(a==="TOWGS84"){e[a]=t;return}if(a==="AXIS"){a in e||(e[a]=[]),e[a].push(t);return}Array.isArray(a)||(e[a]={});var s;switch(a){case"UNIT":case"PRIMEM":case"VERT_DATUM":e[a]={name:t[0].toLowerCase(),convert:t[1]},t.length===3&&ze(t[2],e[a]);return;case"SPHEROID":case"ELLIPSOID":e[a]={name:t[0],a:t[1],rf:t[2]},t.length===4&&ze(t[3],e[a]);return;case"EDATUM":case"ENGINEERINGDATUM":case"LOCAL_DATUM":case"DATUM":case"VERT_CS":case"VERTCRS":case"VERTICALCRS":t[0]=["name",t[0]],Ks(e,a,t);return;case"COMPD_CS":case"COMPOUNDCRS":case"FITTED_CS":case"PROJECTEDCRS":case"PROJCRS":case"GEOGCS":case"GEOCCS":case"PROJCS":case"LOCAL_CS":case"GEODCRS":case"GEODETICCRS":case"GEODETICDATUM":case"ENGCRS":case"ENGINEERINGCRS":t[0]=["name",t[0]],Ks(e,a,t),e[a].type=a;return;default:for(s=-1;++s<t.length;)if(!Array.isArray(t[s]))return ze(t,e[a]);return Ks(e,a,t)}}var ih=.017453292519943295;function jt(t){return t*ih}function mo(t){const e=(t.projName||"").toLowerCase().replace(/_/g," ");!t.long0&&t.longc&&(e==="albers conic equal area"||e==="lambert azimuthal equal area")&&(t.long0=t.longc),!t.lat_ts&&t.lat1&&(e==="stereographic south pole"||e==="polar stereographic (variant b)")?(t.lat0=jt(t.lat1>0?90:-90),t.lat_ts=t.lat1,delete t.lat1):!t.lat_ts&&t.lat0&&(e==="polar stereographic"||e==="polar stereographic (variant a)")&&(t.lat_ts=t.lat0,t.lat0=jt(t.lat0>0?90:-90),delete t.lat1)}function zr(t){let e={units:null,to_meter:void 0};return typeof t=="string"?(e.units=t.toLowerCase(),e.units==="metre"&&(e.units="meter"),e.units==="meter"&&(e.to_meter=1)):t&&t.name&&(e.units=t.name.toLowerCase(),e.units==="metre"&&(e.units="meter"),e.to_meter=t.conversion_factor),e}function jr(t){return typeof t=="object"?t.value*t.unit.conversion_factor:t}function qr(t,e){t.ellipsoid.radius?(e.a=t.ellipsoid.radius,e.rf=0):(e.a=jr(t.ellipsoid.semi_major_axis),t.ellipsoid.inverse_flattening!==void 0?e.rf=t.ellipsoid.inverse_flattening:t.ellipsoid.semi_major_axis!==void 0&&t.ellipsoid.semi_minor_axis!==void 0&&(e.rf=e.a/(e.a-jr(t.ellipsoid.semi_minor_axis))))}function ys(t,e={}){return!t||typeof t!="object"?t:t.type==="BoundCRS"?(ys(t.source_crs,e),t.transformation&&(t.transformation.method&&t.transformation.method.name==="NTv2"?e.nadgrids=t.transformation.parameters[0].value:e.datum_params=t.transformation.parameters.map(a=>a.value)),e):(Object.keys(t).forEach(a=>{const s=t[a];if(s!==null)switch(a){case"name":if(e.srsCode)break;e.name=s,e.srsCode=s;break;case"type":s==="GeographicCRS"?e.projName="longlat":s==="ProjectedCRS"&&t.conversion&&t.conversion.method&&(e.projName=t.conversion.method.name);break;case"datum":case"datum_ensemble":s.ellipsoid&&(e.ellps=s.ellipsoid.name,qr(s,e)),s.prime_meridian&&(e.from_greenwich=s.prime_meridian.longitude*Math.PI/180);break;case"ellipsoid":e.ellps=s.name,qr(s,e);break;case"prime_meridian":e.long0=(s.longitude||0)*Math.PI/180;break;case"coordinate_system":if(s.axis){if(e.axis=s.axis.map(i=>{const r=i.direction;if(r==="east")return"e";if(r==="north")return"n";if(r==="west")return"w";if(r==="south")return"s";throw new Error(`Unknown axis direction: ${r}`)}).join("")+"u",s.unit){const{units:i,to_meter:r}=zr(s.unit);e.units=i,e.to_meter=r}else if(s.axis[0]&&s.axis[0].unit){const{units:i,to_meter:r}=zr(s.axis[0].unit);e.units=i,e.to_meter=r}}break;case"id":s.authority&&s.code&&(e.title=s.authority+":"+s.code);break;case"conversion":s.method&&s.method.name&&(e.projName=s.method.name),s.parameters&&s.parameters.forEach(i=>{const r=i.name.toLowerCase().replace(/\s+/g,"_"),o=i.value;i.unit&&i.unit.conversion_factor?e[r]=o*i.unit.conversion_factor:i.unit==="degree"?e[r]=o*Math.PI/180:e[r]=o});break;case"unit":s.name&&(e.units=s.name.toLowerCase(),e.units==="metre"&&(e.units="meter")),s.conversion_factor&&(e.to_meter=s.conversion_factor);break;case"base_crs":ys(s,e),e.datumCode=s.id?s.id.authority+"_"+s.id.code:s.name;break}}),e.latitude_of_false_origin!==void 0&&(e.lat0=e.latitude_of_false_origin),e.longitude_of_false_origin!==void 0&&(e.long0=e.longitude_of_false_origin),e.latitude_of_standard_parallel!==void 0&&(e.lat0=e.latitude_of_standard_parallel,e.lat1=e.latitude_of_standard_parallel),e.latitude_of_1st_standard_parallel!==void 0&&(e.lat1=e.latitude_of_1st_standard_parallel),e.latitude_of_2nd_standard_parallel!==void 0&&(e.lat2=e.latitude_of_2nd_standard_parallel),e.latitude_of_projection_centre!==void 0&&(e.lat0=e.latitude_of_projection_centre),e.longitude_of_projection_centre!==void 0&&(e.longc=e.longitude_of_projection_centre),e.easting_at_false_origin!==void 0&&(e.x0=e.easting_at_false_origin),e.northing_at_false_origin!==void 0&&(e.y0=e.northing_at_false_origin),e.latitude_of_natural_origin!==void 0&&(e.lat0=e.latitude_of_natural_origin),e.longitude_of_natural_origin!==void 0&&(e.long0=e.longitude_of_natural_origin),e.longitude_of_origin!==void 0&&(e.long0=e.longitude_of_origin),e.false_easting!==void 0&&(e.x0=e.false_easting),e.easting_at_projection_centre&&(e.x0=e.easting_at_projection_centre),e.false_northing!==void 0&&(e.y0=e.false_northing),e.northing_at_projection_centre&&(e.y0=e.northing_at_projection_centre),e.standard_parallel_1!==void 0&&(e.lat1=e.standard_parallel_1),e.standard_parallel_2!==void 0&&(e.lat2=e.standard_parallel_2),e.scale_factor_at_natural_origin!==void 0&&(e.k0=e.scale_factor_at_natural_origin),e.scale_factor_at_projection_centre!==void 0&&(e.k0=e.scale_factor_at_projection_centre),e.scale_factor_on_pseudo_standard_parallel!==void 0&&(e.k0=e.scale_factor_on_pseudo_standard_parallel),e.azimuth!==void 0&&(e.alpha=e.azimuth),e.azimuth_at_projection_centre!==void 0&&(e.alpha=e.azimuth_at_projection_centre),e.angle_from_rectified_to_skew_grid&&(e.rectified_grid_angle=e.angle_from_rectified_to_skew_grid),mo(e),e)}var rh=["PROJECTEDCRS","PROJCRS","GEOGCS","GEOCCS","PROJCS","LOCAL_CS","GEODCRS","GEODETICCRS","GEODETICDATUM","ENGCRS","ENGINEERINGCRS"];function nh(t,e){var a=e[0],s=e[1];!(a in t)&&s in t&&(t[a]=t[s],e.length===3&&(t[a]=e[2](t[a])))}function vo(t){for(var e=Object.keys(t),a=0,s=e.length;a<s;++a){var i=e[a];rh.indexOf(i)!==-1&&oh(t[i]),typeof t[i]=="object"&&vo(t[i])}}function oh(t){if(t.AUTHORITY){var e=Object.keys(t.AUTHORITY)[0];e&&e in t.AUTHORITY&&(t.title=e+":"+t.AUTHORITY[e])}if(t.type==="GEOGCS"?t.projName="longlat":t.type==="LOCAL_CS"?(t.projName="identity",t.local=!0):typeof t.PROJECTION=="object"?t.projName=Object.keys(t.PROJECTION)[0]:t.projName=t.PROJECTION,t.AXIS){for(var a="",s=0,i=t.AXIS.length;s<i;++s){var r=[t.AXIS[s][0].toLowerCase(),t.AXIS[s][1].toLowerCase()];r[0].indexOf("north")!==-1||(r[0]==="y"||r[0]==="lat")&&r[1]==="north"?a+="n":r[0].indexOf("south")!==-1||(r[0]==="y"||r[0]==="lat")&&r[1]==="south"?a+="s":r[0].indexOf("east")!==-1||(r[0]==="x"||r[0]==="lon")&&r[1]==="east"?a+="e":(r[0].indexOf("west")!==-1||(r[0]==="x"||r[0]==="lon")&&r[1]==="west")&&(a+="w")}a.length===2&&(a+="u"),a.length===3&&(t.axis=a)}t.UNIT&&(t.units=t.UNIT.name.toLowerCase(),t.units==="metre"&&(t.units="meter"),t.UNIT.convert&&(t.type==="GEOGCS"?t.DATUM&&t.DATUM.SPHEROID&&(t.to_meter=t.UNIT.convert*t.DATUM.SPHEROID.a):t.to_meter=t.UNIT.convert));var o=t.GEOGCS;t.type==="GEOGCS"&&(o=t),o&&(o.DATUM?t.datumCode=o.DATUM.name.toLowerCase():t.datumCode=o.name.toLowerCase(),t.datumCode.slice(0,2)==="d_"&&(t.datumCode=t.datumCode.slice(2)),t.datumCode==="new_zealand_1949"&&(t.datumCode="nzgd49"),(t.datumCode==="wgs_1984"||t.datumCode==="world_geodetic_system_1984")&&(t.PROJECTION==="Mercator_Auxiliary_Sphere"&&(t.sphere=!0),t.datumCode="wgs84"),t.datumCode==="belge_1972"&&(t.datumCode="rnb72"),o.DATUM&&o.DATUM.SPHEROID&&(t.ellps=o.DATUM.SPHEROID.name.replace("_19","").replace(/[Cc]larke\_18/,"clrk"),t.ellps.toLowerCase().slice(0,13)==="international"&&(t.ellps="intl"),t.a=o.DATUM.SPHEROID.a,t.rf=parseFloat(o.DATUM.SPHEROID.rf,10)),o.DATUM&&o.DATUM.TOWGS84&&(t.datum_params=o.DATUM.TOWGS84),~t.datumCode.indexOf("osgb_1936")&&(t.datumCode="osgb36"),~t.datumCode.indexOf("osni_1952")&&(t.datumCode="osni52"),(~t.datumCode.indexOf("tm65")||~t.datumCode.indexOf("geodetic_datum_of_1965"))&&(t.datumCode="ire65"),t.datumCode==="ch1903+"&&(t.datumCode="ch1903"),~t.datumCode.indexOf("israel")&&(t.datumCode="isr93")),t.b&&!isFinite(t.b)&&(t.b=t.a),t.rectified_grid_angle&&(t.rectified_grid_angle=jt(t.rectified_grid_angle));function n(h){var u=t.to_meter||1;return h*u}var l=function(h){return nh(t,h)},c=[["standard_parallel_1","Standard_Parallel_1"],["standard_parallel_1","Latitude of 1st standard parallel"],["standard_parallel_2","Standard_Parallel_2"],["standard_parallel_2","Latitude of 2nd standard parallel"],["false_easting","False_Easting"],["false_easting","False easting"],["false-easting","Easting at false origin"],["false_northing","False_Northing"],["false_northing","False northing"],["false_northing","Northing at false origin"],["central_meridian","Central_Meridian"],["central_meridian","Longitude of natural origin"],["central_meridian","Longitude of false origin"],["latitude_of_origin","Latitude_Of_Origin"],["latitude_of_origin","Central_Parallel"],["latitude_of_origin","Latitude of natural origin"],["latitude_of_origin","Latitude of false origin"],["scale_factor","Scale_Factor"],["k0","scale_factor"],["latitude_of_center","Latitude_Of_Center"],["latitude_of_center","Latitude_of_center"],["lat0","latitude_of_center",jt],["longitude_of_center","Longitude_Of_Center"],["longitude_of_center","Longitude_of_center"],["longc","longitude_of_center",jt],["x0","false_easting",n],["y0","false_northing",n],["long0","central_meridian",jt],["lat0","latitude_of_origin",jt],["lat0","standard_parallel_1",jt],["lat1","standard_parallel_1",jt],["lat2","standard_parallel_2",jt],["azimuth","Azimuth"],["alpha","azimuth",jt],["srsCode","name"]];c.forEach(l),mo(t)}function bs(t){if(typeof t=="object")return ys(t);const e=Qd(t);var a=sh(t);if(e==="WKT2"){const r=Xd(a);return ys(r)}var s=a[0],i={};return ze(a,i),vo(i),i[s]}function xt(t){var e=this;if(arguments.length===2){var a=arguments[1];typeof a=="string"?a.charAt(0)==="+"?xt[t]=ui(arguments[1]):xt[t]=bs(arguments[1]):a&&typeof a=="object"&&!("projName"in a)?xt[t]=bs(arguments[1]):(xt[t]=a,a||delete xt[t])}else if(arguments.length===1){if(Array.isArray(t))return t.map(function(s){return Array.isArray(s)?xt.apply(e,s):xt(s)});if(typeof t=="string"){if(t in xt)return xt[t]}else"EPSG"in t?xt["EPSG:"+t.EPSG]=t:"ESRI"in t?xt["ESRI:"+t.ESRI]=t:"IAU2000"in t?xt["IAU2000:"+t.IAU2000]=t:console.log(t);return}}jd(xt);function lh(t){return typeof t=="string"}function ch(t){return t in xt}function dh(t){return t.indexOf("+")!==0&&t.indexOf("[")!==-1||typeof t=="object"&&!("srsCode"in t)}var hh=["3857","900913","3785","102113"];function uh(t){var e=me(t,"authority");if(e){var a=me(e,"epsg");return a&&hh.indexOf(a)>-1}}function ph(t){var e=me(t,"extension");if(e)return me(e,"proj4")}function fh(t){return t[0]==="+"}function gh(t){if(lh(t)){if(ch(t))return xt[t];if(dh(t)){var e=bs(t);if(uh(e))return xt["EPSG:3857"];var a=ph(e);return a?ui(a):e}if(fh(t))return ui(t)}else return"projName"in t?t:bs(t)}function Hr(t,e){t=t||{};var a,s;if(!e)return t;for(s in e)a=e[s],a!==void 0&&(t[s]=a);return t}function Qt(t,e,a){var s=t*e;return a/Math.sqrt(1-s*s)}function Oa(t){return t<0?-1:1}function B(t,e){return e||Math.abs(t)<=gt?t:t-Oa(t)*$a}function qt(t,e,a){var s=t*a,i=.5*t;return s=Math.pow((1-s)/(1+s),i),Math.tan(.5*(L-e))/s}function La(t,e){for(var a=.5*t,s,i,r=L-2*Math.atan(e),o=0;o<=15;o++)if(s=t*Math.sin(r),i=L-2*Math.atan(e*Math.pow((1-s)/(1+s),a))-r,r+=i,Math.abs(i)<=1e-10)return r;return-9999}function mh(){var t=this.b/this.a;this.es=1-t*t,"x0"in this||(this.x0=0),"y0"in this||(this.y0=0),this.e=Math.sqrt(this.es),this.lat_ts?this.sphere?this.k0=Math.cos(this.lat_ts):this.k0=Qt(this.e,Math.sin(this.lat_ts),Math.cos(this.lat_ts)):this.k0||(this.k?this.k0=this.k:this.k0=1)}function vh(t){var e=t.x,a=t.y;if(a*Pt>90&&a*Pt<-90&&e*Pt>180&&e*Pt<-180)return null;var s,i;if(Math.abs(Math.abs(a)-L)<=R)return null;if(this.sphere)s=this.x0+this.a*this.k0*B(e-this.long0,this.over),i=this.y0+this.a*this.k0*Math.log(Math.tan(Q+.5*a));else{var r=Math.sin(a),o=qt(this.e,a,r);s=this.x0+this.a*this.k0*B(e-this.long0,this.over),i=this.y0-this.a*this.k0*Math.log(o)}return t.x=s,t.y=i,t}function yh(t){var e=t.x-this.x0,a=t.y-this.y0,s,i;if(this.sphere)i=L-2*Math.atan(Math.exp(-a/(this.a*this.k0)));else{var r=Math.exp(-a/(this.a*this.k0));if(i=La(this.e,r),i===-9999)return null}return s=B(this.long0+e/(this.a*this.k0),this.over),t.x=s,t.y=i,t}var bh=["Mercator","Popular Visualisation Pseudo Mercator","Mercator_1SP","Mercator_Auxiliary_Sphere","Mercator_Variant_A","merc"];const xh={init:mh,forward:vh,inverse:yh,names:bh};function _h(){}function Ur(t){return t}var yo=["longlat","identity"];const wh={init:_h,forward:Ur,inverse:Ur,names:yo};var Mh=[xh,wh],Ee={},je=[];function bo(t,e){var a=je.length;return t.names?(je[a]=t,t.names.forEach(function(s){Ee[s.toLowerCase()]=a}),this):(console.log(e),!0)}function xo(t){return t.replace(/[-\(\)\s]+/g," ").trim().replace(/ /g,"_")}function Sh(t){if(!t)return!1;var e=t.toLowerCase();if(typeof Ee[e]<"u"&&je[Ee[e]]||(e=xo(e),e in Ee&&je[Ee[e]]))return je[Ee[e]]}function Eh(){Mh.forEach(bo)}const Ah={start:Eh,add:bo,get:Sh};var _o={MERIT:{a:6378137,rf:298.257,ellipseName:"MERIT 1983"},SGS85:{a:6378136,rf:298.257,ellipseName:"Soviet Geodetic System 85"},GRS80:{a:6378137,rf:298.257222101,ellipseName:"GRS 1980(IUGG, 1980)"},IAU76:{a:6378140,rf:298.257,ellipseName:"IAU 1976"},airy:{a:6377563396e-3,b:635625691e-2,ellipseName:"Airy 1830"},APL4:{a:6378137,rf:298.25,ellipseName:"Appl. Physics. 1965"},NWL9D:{a:6378145,rf:298.25,ellipseName:"Naval Weapons Lab., 1965"},mod_airy:{a:6377340189e-3,b:6356034446e-3,ellipseName:"Modified Airy"},andrae:{a:637710443e-2,rf:300,ellipseName:"Andrae 1876 (Den., Iclnd.)"},aust_SA:{a:6378160,rf:298.25,ellipseName:"Australian Natl & S. Amer. 1969"},GRS67:{a:6378160,rf:298.247167427,ellipseName:"GRS 67(IUGG 1967)"},bessel:{a:6377397155e-3,rf:299.1528128,ellipseName:"Bessel 1841"},bess_nam:{a:6377483865e-3,rf:299.1528128,ellipseName:"Bessel 1841 (Namibia)"},clrk66:{a:63782064e-1,b:63565838e-1,ellipseName:"Clarke 1866"},clrk80:{a:6378249145e-3,rf:293.4663,ellipseName:"Clarke 1880 mod."},clrk80ign:{a:63782492e-1,b:6356515,rf:293.4660213,ellipseName:"Clarke 1880 (IGN)"},clrk58:{a:6378293645208759e-9,rf:294.2606763692654,ellipseName:"Clarke 1858"},CPM:{a:63757387e-1,rf:334.29,ellipseName:"Comm. des Poids et Mesures 1799"},delmbr:{a:6376428,rf:311.5,ellipseName:"Delambre 1810 (Belgium)"},engelis:{a:637813605e-2,rf:298.2566,ellipseName:"Engelis 1985"},evrst30:{a:6377276345e-3,rf:300.8017,ellipseName:"Everest 1830"},evrst48:{a:6377304063e-3,rf:300.8017,ellipseName:"Everest 1948"},evrst56:{a:6377301243e-3,rf:300.8017,ellipseName:"Everest 1956"},evrst69:{a:6377295664e-3,rf:300.8017,ellipseName:"Everest 1969"},evrstSS:{a:6377298556e-3,rf:300.8017,ellipseName:"Everest (Sabah & Sarawak)"},fschr60:{a:6378166,rf:298.3,ellipseName:"Fischer (Mercury Datum) 1960"},fschr60m:{a:6378155,rf:298.3,ellipseName:"Fischer 1960"},fschr68:{a:6378150,rf:298.3,ellipseName:"Fischer 1968"},helmert:{a:6378200,rf:298.3,ellipseName:"Helmert 1906"},hough:{a:6378270,rf:297,ellipseName:"Hough"},intl:{a:6378388,rf:297,ellipseName:"International 1909 (Hayford)"},kaula:{a:6378163,rf:298.24,ellipseName:"Kaula 1961"},lerch:{a:6378139,rf:298.257,ellipseName:"Lerch 1979"},mprts:{a:6397300,rf:191,ellipseName:"Maupertius 1738"},new_intl:{a:63781575e-1,b:63567722e-1,ellipseName:"New International 1967"},plessis:{a:6376523,rf:6355863,ellipseName:"Plessis 1817 (France)"},krass:{a:6378245,rf:298.3,ellipseName:"Krassovsky, 1942"},SEasia:{a:6378155,b:63567733205e-4,ellipseName:"Southeast Asia"},walbeck:{a:6376896,b:63558348467e-4,ellipseName:"Walbeck"},WGS60:{a:6378165,rf:298.3,ellipseName:"WGS 60"},WGS66:{a:6378145,rf:298.25,ellipseName:"WGS 66"},WGS7:{a:6378135,rf:298.26,ellipseName:"WGS 72"},WGS84:{a:6378137,rf:298.257223563,ellipseName:"WGS 84"},sphere:{a:6370997,b:6370997,ellipseName:"Normal Sphere (r=6370997)"}};const kh=_o.WGS84;function Ph(t,e,a,s){var i=t*t,r=e*e,o=(i-r)/i,n=0;s?(t*=1-o*(Ud+o*(Vd+o*Wd)),i=t*t,o=0):n=Math.sqrt(o);var l=(i-r)/r;return{es:o,e:n,ep2:l}}function Ch(t,e,a,s,i){if(!t){var r=me(_o,s);r||(r=kh),t=r.a,e=r.b,a=r.rf}return a&&!e&&(e=(1-1/a)*t),(a===0||Math.abs(t-e)<R)&&(i=!0,e=t),{a:t,b:e,rf:a,sphere:i}}var rs={wgs84:{towgs84:"0,0,0",ellipse:"WGS84",datumName:"WGS84"},ch1903:{towgs84:"674.374,15.056,405.346",ellipse:"bessel",datumName:"swiss"},ggrs87:{towgs84:"-199.87,74.79,246.62",ellipse:"GRS80",datumName:"Greek_Geodetic_Reference_System_1987"},nad83:{towgs84:"0,0,0",ellipse:"GRS80",datumName:"North_American_Datum_1983"},nad27:{nadgrids:"@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",ellipse:"clrk66",datumName:"North_American_Datum_1927"},potsdam:{towgs84:"598.1,73.7,418.2,0.202,0.045,-2.455,6.7",ellipse:"bessel",datumName:"Potsdam Rauenberg 1950 DHDN"},carthage:{towgs84:"-263.0,6.0,431.0",ellipse:"clark80",datumName:"Carthage 1934 Tunisia"},hermannskogel:{towgs84:"577.326,90.129,463.919,5.137,1.474,5.297,2.4232",ellipse:"bessel",datumName:"Hermannskogel"},mgi:{towgs84:"577.326,90.129,463.919,5.137,1.474,5.297,2.4232",ellipse:"bessel",datumName:"Militar-Geographische Institut"},osni52:{towgs84:"482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",ellipse:"airy",datumName:"Irish National"},ire65:{towgs84:"482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",ellipse:"mod_airy",datumName:"Ireland 1965"},rassadiran:{towgs84:"-133.63,-157.5,-158.62",ellipse:"intl",datumName:"Rassadiran"},nzgd49:{towgs84:"59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",ellipse:"intl",datumName:"New Zealand Geodetic Datum 1949"},osgb36:{towgs84:"446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",ellipse:"airy",datumName:"Ordnance Survey of Great Britain 1936"},s_jtsk:{towgs84:"589,76,480",ellipse:"bessel",datumName:"S-JTSK (Ferro)"},beduaram:{towgs84:"-106,-87,188",ellipse:"clrk80",datumName:"Beduaram"},gunung_segara:{towgs84:"-403,684,41",ellipse:"bessel",datumName:"Gunung Segara Jakarta"},rnb72:{towgs84:"106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",ellipse:"intl",datumName:"Reseau National Belge 1972"},EPSG_5451:{towgs84:"6.41,-49.05,-11.28,1.5657,0.5242,6.9718,-5.7649"},IGNF_LURESG:{towgs84:"-192.986,13.673,-39.309,-0.4099,-2.9332,2.6881,0.43"},EPSG_4614:{towgs84:"-119.4248,-303.65872,-11.00061,1.164298,0.174458,1.096259,3.657065"},EPSG_4615:{towgs84:"-494.088,-312.129,279.877,-1.423,-1.013,1.59,-0.748"},ESRI_37241:{towgs84:"-76.822,257.457,-12.817,2.136,-0.033,-2.392,-0.031"},ESRI_37249:{towgs84:"-440.296,58.548,296.265,1.128,10.202,4.559,-0.438"},ESRI_37245:{towgs84:"-511.151,-181.269,139.609,1.05,2.703,1.798,3.071"},EPSG_4178:{towgs84:"24.9,-126.4,-93.2,-0.063,-0.247,-0.041,1.01"},EPSG_4622:{towgs84:"-472.29,-5.63,-304.12,0.4362,-0.8374,0.2563,1.8984"},EPSG_4625:{towgs84:"126.93,547.94,130.41,-2.7867,5.1612,-0.8584,13.8227"},EPSG_5252:{towgs84:"0.023,0.036,-0.068,0.00176,0.00912,-0.01136,0.00439"},EPSG_4314:{towgs84:"597.1,71.4,412.1,0.894,0.068,-1.563,7.58"},EPSG_4282:{towgs84:"-178.3,-316.7,-131.5,5.278,6.077,10.979,19.166"},EPSG_4231:{towgs84:"-83.11,-97.38,-117.22,0.0276,-0.2167,0.2147,0.1218"},EPSG_4274:{towgs84:"-230.994,102.591,25.199,0.633,-0.239,0.9,1.95"},EPSG_4134:{towgs84:"-180.624,-225.516,173.919,-0.81,-1.898,8.336,16.71006"},EPSG_4254:{towgs84:"18.38,192.45,96.82,0.056,-0.142,-0.2,-0.0013"},EPSG_4159:{towgs84:"-194.513,-63.978,-25.759,-3.4027,3.756,-3.352,-0.9175"},EPSG_4687:{towgs84:"0.072,-0.507,-0.245,0.0183,-0.0003,0.007,-0.0093"},EPSG_4227:{towgs84:"-83.58,-397.54,458.78,-17.595,-2.847,4.256,3.225"},EPSG_4746:{towgs84:"599.4,72.4,419.2,-0.062,-0.022,-2.723,6.46"},EPSG_4745:{towgs84:"612.4,77,440.2,-0.054,0.057,-2.797,2.55"},EPSG_6311:{towgs84:"8.846,-4.394,-1.122,-0.00237,-0.146528,0.130428,0.783926"},EPSG_4289:{towgs84:"565.7381,50.4018,465.2904,-1.91514,1.60363,-9.09546,4.07244"},EPSG_4230:{towgs84:"-68.863,-134.888,-111.49,-0.53,-0.14,0.57,-3.4"},EPSG_4154:{towgs84:"-123.02,-158.95,-168.47"},EPSG_4156:{towgs84:"570.8,85.7,462.8,4.998,1.587,5.261,3.56"},EPSG_4299:{towgs84:"482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"},EPSG_4179:{towgs84:"33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84"},EPSG_4313:{towgs84:"-106.8686,52.2978,-103.7239,0.3366,-0.457,1.8422,-1.2747"},EPSG_4194:{towgs84:"163.511,127.533,-159.789"},EPSG_4195:{towgs84:"105,326,-102.5"},EPSG_4196:{towgs84:"-45,417,-3.5"},EPSG_4611:{towgs84:"-162.619,-276.959,-161.764,0.067753,-2.243649,-1.158827,-1.094246"},EPSG_4633:{towgs84:"137.092,131.66,91.475,-1.9436,-11.5993,-4.3321,-7.4824"},EPSG_4641:{towgs84:"-408.809,366.856,-412.987,1.8842,-0.5308,2.1655,-121.0993"},EPSG_4643:{towgs84:"-480.26,-438.32,-643.429,16.3119,20.1721,-4.0349,-111.7002"},EPSG_4300:{towgs84:"482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"},EPSG_4188:{towgs84:"482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"},EPSG_4660:{towgs84:"982.6087,552.753,-540.873,32.39344,-153.25684,-96.2266,16.805"},EPSG_4662:{towgs84:"97.295,-263.247,310.882,-1.5999,0.8386,3.1409,13.3259"},EPSG_3906:{towgs84:"577.88891,165.22205,391.18289,4.9145,-0.94729,-13.05098,7.78664"},EPSG_4307:{towgs84:"-209.3622,-87.8162,404.6198,0.0046,3.4784,0.5805,-1.4547"},EPSG_6892:{towgs84:"-76.269,-16.683,68.562,-6.275,10.536,-4.286,-13.686"},EPSG_4690:{towgs84:"221.597,152.441,176.523,2.403,1.3893,0.884,11.4648"},EPSG_4691:{towgs84:"218.769,150.75,176.75,3.5231,2.0037,1.288,10.9817"},EPSG_4629:{towgs84:"72.51,345.411,79.241,-1.5862,-0.8826,-0.5495,1.3653"},EPSG_4630:{towgs84:"165.804,216.213,180.26,-0.6251,-0.4515,-0.0721,7.4111"},EPSG_4692:{towgs84:"217.109,86.452,23.711,0.0183,-0.0003,0.007,-0.0093"},EPSG_9333:{towgs84:"0,0,0,-8.393,0.749,-10.276,0"},EPSG_9059:{towgs84:"0,0,0"},EPSG_4312:{towgs84:"601.705,84.263,485.227,4.7354,1.3145,5.393,-2.3887"},EPSG_4123:{towgs84:"-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496"},EPSG_4309:{towgs84:"-124.45,183.74,44.64,-0.4384,0.5446,-0.9706,-2.1365"},ESRI_104106:{towgs84:"-283.088,-70.693,117.445,-1.157,0.059,-0.652,-4.058"},EPSG_4281:{towgs84:"-219.247,-73.802,269.529"},EPSG_4322:{towgs84:"0,0,4.5"},EPSG_4324:{towgs84:"0,0,1.9"},EPSG_4284:{towgs84:"43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549"},EPSG_4277:{towgs84:"446.448,-125.157,542.06,0.15,0.247,0.842,-20.489"},EPSG_4207:{towgs84:"-282.1,-72.2,120,-1.529,0.145,-0.89,-4.46"},EPSG_4688:{towgs84:"347.175,1077.618,2623.677,33.9058,-70.6776,9.4013,186.0647"},EPSG_4689:{towgs84:"410.793,54.542,80.501,-2.5596,-2.3517,-0.6594,17.3218"},EPSG_4720:{towgs84:"0,0,4.5"},EPSG_4273:{towgs84:"278.3,93,474.5,7.889,0.05,-6.61,6.21"},EPSG_4240:{towgs84:"204.64,834.74,293.8"},EPSG_4817:{towgs84:"278.3,93,474.5,7.889,0.05,-6.61,6.21"},ESRI_104131:{towgs84:"426.62,142.62,460.09,4.98,4.49,-12.42,-17.1"},EPSG_4265:{towgs84:"-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68"},EPSG_4263:{towgs84:"-111.92,-87.85,114.5,1.875,0.202,0.219,0.032"},EPSG_4298:{towgs84:"-689.5937,623.84046,-65.93566,-0.02331,1.17094,-0.80054,5.88536"},EPSG_4270:{towgs84:"-253.4392,-148.452,386.5267,0.15605,0.43,-0.1013,-0.0424"},EPSG_4229:{towgs84:"-121.8,98.1,-10.7"},EPSG_4220:{towgs84:"-55.5,-348,-229.2"},EPSG_4214:{towgs84:"12.646,-155.176,-80.863"},EPSG_4232:{towgs84:"-345,3,223"},EPSG_4238:{towgs84:"-1.977,-13.06,-9.993,0.364,0.254,0.689,-1.037"},EPSG_4168:{towgs84:"-170,33,326"},EPSG_4131:{towgs84:"199,931,318.9"},EPSG_4152:{towgs84:"-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"},EPSG_5228:{towgs84:"572.213,85.334,461.94,4.9732,1.529,5.2484,3.5378"},EPSG_8351:{towgs84:"485.021,169.465,483.839,7.786342,4.397554,4.102655,0"},EPSG_4683:{towgs84:"-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06"},EPSG_4133:{towgs84:"0,0,0"},EPSG_7373:{towgs84:"0.819,-0.5762,-1.6446,-0.00378,-0.03317,0.00318,0.0693"},EPSG_9075:{towgs84:"-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"},EPSG_9072:{towgs84:"-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"},EPSG_9294:{towgs84:"1.16835,-1.42001,-2.24431,-0.00822,-0.05508,0.01818,0.23388"},EPSG_4212:{towgs84:"-267.434,173.496,181.814,-13.4704,8.7154,7.3926,14.7492"},EPSG_4191:{towgs84:"-44.183,-0.58,-38.489,2.3867,2.7072,-3.5196,-8.2703"},EPSG_4237:{towgs84:"52.684,-71.194,-13.975,-0.312,-0.1063,-0.3729,1.0191"},EPSG_4740:{towgs84:"-1.08,-0.27,-0.9"},EPSG_4124:{towgs84:"419.3836,99.3335,591.3451,0.850389,1.817277,-7.862238,-0.99496"},EPSG_5681:{towgs84:"584.9636,107.7175,413.8067,1.1155,0.2824,-3.1384,7.9922"},EPSG_4141:{towgs84:"23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262"},EPSG_4204:{towgs84:"-85.645,-273.077,-79.708,2.289,-1.421,2.532,3.194"},EPSG_4319:{towgs84:"226.702,-193.337,-35.371,-2.229,-4.391,9.238,0.9798"},EPSG_4200:{towgs84:"24.82,-131.21,-82.66"},EPSG_4130:{towgs84:"0,0,0"},EPSG_4127:{towgs84:"-82.875,-57.097,-156.768,-2.158,1.524,-0.982,-0.359"},EPSG_4149:{towgs84:"674.374,15.056,405.346"},EPSG_4617:{towgs84:"-0.991,1.9072,0.5129,1.25033e-7,4.6785e-8,5.6529e-8,0"},EPSG_4663:{towgs84:"-210.502,-66.902,-48.476,2.094,-15.067,-5.817,0.485"},EPSG_4664:{towgs84:"-211.939,137.626,58.3,-0.089,0.251,0.079,0.384"},EPSG_4665:{towgs84:"-105.854,165.589,-38.312,-0.003,-0.026,0.024,-0.048"},EPSG_4666:{towgs84:"631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43"},EPSG_4756:{towgs84:"-192.873,-39.382,-111.202,-0.00205,-0.0005,0.00335,0.0188"},EPSG_4723:{towgs84:"-179.483,-69.379,-27.584,-7.862,8.163,6.042,-13.925"},EPSG_4726:{towgs84:"8.853,-52.644,180.304,-0.393,-2.323,2.96,-24.081"},EPSG_4267:{towgs84:"-8.0,160.0,176.0"},EPSG_5365:{towgs84:"-0.16959,0.35312,0.51846,0.03385,-0.16325,0.03446,0.03693"},EPSG_4218:{towgs84:"304.5,306.5,-318.1"},EPSG_4242:{towgs84:"-33.722,153.789,94.959,-8.581,-4.478,4.54,8.95"},EPSG_4216:{towgs84:"-292.295,248.758,429.447,4.9971,2.99,6.6906,1.0289"},ESRI_104105:{towgs84:"631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43"},ESRI_104129:{towgs84:"0,0,0"},EPSG_4673:{towgs84:"174.05,-25.49,112.57"},EPSG_4202:{towgs84:"-124,-60,154"},EPSG_4203:{towgs84:"-117.763,-51.51,139.061,0.292,0.443,0.277,-0.191"},EPSG_3819:{towgs84:"595.48,121.69,515.35,4.115,-2.9383,0.853,-3.408"},EPSG_8694:{towgs84:"-93.799,-132.737,-219.073,-1.844,0.648,-6.37,-0.169"},EPSG_4145:{towgs84:"275.57,676.78,229.6"},EPSG_4283:{towgs84:"61.55,-10.87,-40.19,39.4924,32.7221,32.8979,-9.994"},EPSG_4317:{towgs84:"2.3287,-147.0425,-92.0802,-0.3092483,0.32482185,0.49729934,5.68906266"},EPSG_4272:{towgs84:"59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993"},EPSG_4248:{towgs84:"-307.7,265.3,-363.5"},EPSG_5561:{towgs84:"24,-121,-76"},EPSG_5233:{towgs84:"-0.293,766.95,87.713,0.195704,1.695068,3.473016,-0.039338"},ESRI_104130:{towgs84:"-86,-98,-119"},ESRI_104102:{towgs84:"682,-203,480"},ESRI_37207:{towgs84:"7,-10,-26"},EPSG_4675:{towgs84:"59.935,118.4,-10.871"},ESRI_104109:{towgs84:"-89.121,-348.182,260.871"},ESRI_104112:{towgs84:"-185.583,-230.096,281.361"},ESRI_104113:{towgs84:"25.1,-275.6,222.6"},IGNF_WGS72G:{towgs84:"0,12,6"},IGNF_NTFG:{towgs84:"-168,-60,320"},IGNF_EFATE57G:{towgs84:"-127,-769,472"},IGNF_PGP50G:{towgs84:"324.8,153.6,172.1"},IGNF_REUN47G:{towgs84:"94,-948,-1262"},IGNF_CSG67G:{towgs84:"-186,230,110"},IGNF_GUAD48G:{towgs84:"-467,-16,-300"},IGNF_TAHI51G:{towgs84:"162,117,154"},IGNF_TAHAAG:{towgs84:"65,342,77"},IGNF_NUKU72G:{towgs84:"84,274,65"},IGNF_PETRELS72G:{towgs84:"365,194,166"},IGNF_WALL78G:{towgs84:"253,-133,-127"},IGNF_MAYO50G:{towgs84:"-382,-59,-262"},IGNF_TANNAG:{towgs84:"-139,-967,436"},IGNF_IGN72G:{towgs84:"-13,-348,292"},IGNF_ATIGG:{towgs84:"1118,23,66"},IGNF_FANGA84G:{towgs84:"150.57,158.33,118.32"},IGNF_RUSAT84G:{towgs84:"202.13,174.6,-15.74"},IGNF_KAUE70G:{towgs84:"126.74,300.1,-75.49"},IGNF_MOP90G:{towgs84:"-10.8,-1.8,12.77"},IGNF_MHPF67G:{towgs84:"338.08,212.58,-296.17"},IGNF_TAHI79G:{towgs84:"160.61,116.05,153.69"},IGNF_ANAA92G:{towgs84:"1.5,3.84,4.81"},IGNF_MARQUI72G:{towgs84:"330.91,-13.92,58.56"},IGNF_APAT86G:{towgs84:"143.6,197.82,74.05"},IGNF_TUBU69G:{towgs84:"237.17,171.61,-77.84"},IGNF_STPM50G:{towgs84:"11.363,424.148,373.13"},EPSG_4150:{towgs84:"674.374,15.056,405.346"},EPSG_4754:{towgs84:"-208.4058,-109.8777,-2.5764"},ESRI_104101:{towgs84:"374,150,588"},EPSG_4693:{towgs84:"0,-0.15,0.68"},EPSG_6207:{towgs84:"293.17,726.18,245.36"},EPSG_4153:{towgs84:"-133.63,-157.5,-158.62"},EPSG_4132:{towgs84:"-241.54,-163.64,396.06"},EPSG_4221:{towgs84:"-154.5,150.7,100.4"},EPSG_4266:{towgs84:"-80.7,-132.5,41.1"},EPSG_4193:{towgs84:"-70.9,-151.8,-41.4"},EPSG_5340:{towgs84:"-0.41,0.46,-0.35"},EPSG_4246:{towgs84:"-294.7,-200.1,525.5"},EPSG_4318:{towgs84:"-3.2,-5.7,2.8"},EPSG_4121:{towgs84:"-199.87,74.79,246.62"},EPSG_4223:{towgs84:"-260.1,5.5,432.2"},EPSG_4158:{towgs84:"-0.465,372.095,171.736"},EPSG_4285:{towgs84:"-128.16,-282.42,21.93"},EPSG_4613:{towgs84:"-404.78,685.68,45.47"},EPSG_4607:{towgs84:"195.671,332.517,274.607"},EPSG_4475:{towgs84:"-381.788,-57.501,-256.673"},EPSG_4208:{towgs84:"-157.84,308.54,-146.6"},EPSG_4743:{towgs84:"70.995,-335.916,262.898"},EPSG_4710:{towgs84:"-323.65,551.39,-491.22"},EPSG_7881:{towgs84:"-0.077,0.079,0.086"},EPSG_4682:{towgs84:"283.729,735.942,261.143"},EPSG_4739:{towgs84:"-156,-271,-189"},EPSG_4679:{towgs84:"-80.01,253.26,291.19"},EPSG_4750:{towgs84:"-56.263,16.136,-22.856"},EPSG_4644:{towgs84:"-10.18,-350.43,291.37"},EPSG_4695:{towgs84:"-103.746,-9.614,-255.95"},EPSG_4292:{towgs84:"-355,21,72"},EPSG_4302:{towgs84:"-61.702,284.488,472.052"},EPSG_4143:{towgs84:"-124.76,53,466.79"},EPSG_4606:{towgs84:"-153,153,307"},EPSG_4699:{towgs84:"-770.1,158.4,-498.2"},EPSG_4247:{towgs84:"-273.5,110.6,-357.9"},EPSG_4160:{towgs84:"8.88,184.86,106.69"},EPSG_4161:{towgs84:"-233.43,6.65,173.64"},EPSG_9251:{towgs84:"-9.5,122.9,138.2"},EPSG_9253:{towgs84:"-78.1,101.6,133.3"},EPSG_4297:{towgs84:"-198.383,-240.517,-107.909"},EPSG_4269:{towgs84:"0,0,0"},EPSG_4301:{towgs84:"-147,506,687"},EPSG_4618:{towgs84:"-59,-11,-52"},EPSG_4612:{towgs84:"0,0,0"},EPSG_4678:{towgs84:"44.585,-131.212,-39.544"},EPSG_4250:{towgs84:"-130,29,364"},EPSG_4144:{towgs84:"214,804,268"},EPSG_4147:{towgs84:"-17.51,-108.32,-62.39"},EPSG_4259:{towgs84:"-254.1,-5.36,-100.29"},EPSG_4164:{towgs84:"-76,-138,67"},EPSG_4211:{towgs84:"-378.873,676.002,-46.255"},EPSG_4182:{towgs84:"-422.651,-172.995,84.02"},EPSG_4224:{towgs84:"-143.87,243.37,-33.52"},EPSG_4225:{towgs84:"-205.57,168.77,-4.12"},EPSG_5527:{towgs84:"-67.35,3.88,-38.22"},EPSG_4752:{towgs84:"98,390,-22"},EPSG_4310:{towgs84:"-30,190,89"},EPSG_9248:{towgs84:"-192.26,65.72,132.08"},EPSG_4680:{towgs84:"124.5,-63.5,-281"},EPSG_4701:{towgs84:"-79.9,-158,-168.9"},EPSG_4706:{towgs84:"-146.21,112.63,4.05"},EPSG_4805:{towgs84:"682,-203,480"},EPSG_4201:{towgs84:"-165,-11,206"},EPSG_4210:{towgs84:"-157,-2,-299"},EPSG_4183:{towgs84:"-104,167,-38"},EPSG_4139:{towgs84:"11,72,-101"},EPSG_4668:{towgs84:"-86,-98,-119"},EPSG_4717:{towgs84:"-2,151,181"},EPSG_4732:{towgs84:"102,52,-38"},EPSG_4280:{towgs84:"-377,681,-50"},EPSG_4209:{towgs84:"-138,-105,-289"},EPSG_4261:{towgs84:"31,146,47"},EPSG_4658:{towgs84:"-73,46,-86"},EPSG_4721:{towgs84:"265.025,384.929,-194.046"},EPSG_4222:{towgs84:"-136,-108,-292"},EPSG_4601:{towgs84:"-255,-15,71"},EPSG_4602:{towgs84:"725,685,536"},EPSG_4603:{towgs84:"72,213.7,93"},EPSG_4605:{towgs84:"9,183,236"},EPSG_4621:{towgs84:"137,248,-430"},EPSG_4657:{towgs84:"-28,199,5"},EPSG_4316:{towgs84:"103.25,-100.4,-307.19"},EPSG_4642:{towgs84:"-13,-348,292"},EPSG_4698:{towgs84:"145,-187,103"},EPSG_4192:{towgs84:"-206.1,-174.7,-87.7"},EPSG_4311:{towgs84:"-265,120,-358"},EPSG_4135:{towgs84:"58,-283,-182"},ESRI_104138:{towgs84:"198,-226,-347"},EPSG_4245:{towgs84:"-11,851,5"},EPSG_4142:{towgs84:"-125,53,467"},EPSG_4213:{towgs84:"-106,-87,188"},EPSG_4253:{towgs84:"-133,-77,-51"},EPSG_4129:{towgs84:"-132,-110,-335"},EPSG_4713:{towgs84:"-77,-128,142"},EPSG_4239:{towgs84:"217,823,299"},EPSG_4146:{towgs84:"295,736,257"},EPSG_4155:{towgs84:"-83,37,124"},EPSG_4165:{towgs84:"-173,253,27"},EPSG_4672:{towgs84:"175,-38,113"},EPSG_4236:{towgs84:"-637,-549,-203"},EPSG_4251:{towgs84:"-90,40,88"},EPSG_4271:{towgs84:"-2,374,172"},EPSG_4175:{towgs84:"-88,4,101"},EPSG_4716:{towgs84:"298,-304,-375"},EPSG_4315:{towgs84:"-23,259,-9"},EPSG_4744:{towgs84:"-242.2,-144.9,370.3"},EPSG_4244:{towgs84:"-97,787,86"},EPSG_4293:{towgs84:"616,97,-251"},EPSG_4714:{towgs84:"-127,-769,472"},EPSG_4736:{towgs84:"260,12,-147"},EPSG_6883:{towgs84:"-235,-110,393"},EPSG_6894:{towgs84:"-63,176,185"},EPSG_4205:{towgs84:"-43,-163,45"},EPSG_4256:{towgs84:"41,-220,-134"},EPSG_4262:{towgs84:"639,405,60"},EPSG_4604:{towgs84:"174,359,365"},EPSG_4169:{towgs84:"-115,118,426"},EPSG_4620:{towgs84:"-106,-129,165"},EPSG_4184:{towgs84:"-203,141,53"},EPSG_4616:{towgs84:"-289,-124,60"},EPSG_9403:{towgs84:"-307,-92,127"},EPSG_4684:{towgs84:"-133,-321,50"},EPSG_4708:{towgs84:"-491,-22,435"},EPSG_4707:{towgs84:"114,-116,-333"},EPSG_4709:{towgs84:"145,75,-272"},EPSG_4712:{towgs84:"-205,107,53"},EPSG_4711:{towgs84:"124,-234,-25"},EPSG_4718:{towgs84:"230,-199,-752"},EPSG_4719:{towgs84:"211,147,111"},EPSG_4724:{towgs84:"208,-435,-229"},EPSG_4725:{towgs84:"189,-79,-202"},EPSG_4735:{towgs84:"647,1777,-1124"},EPSG_4722:{towgs84:"-794,119,-298"},EPSG_4728:{towgs84:"-307,-92,127"},EPSG_4734:{towgs84:"-632,438,-609"},EPSG_4727:{towgs84:"912,-58,1227"},EPSG_4729:{towgs84:"185,165,42"},EPSG_4730:{towgs84:"170,42,84"},EPSG_4733:{towgs84:"276,-57,149"},ESRI_37218:{towgs84:"230,-199,-752"},ESRI_37240:{towgs84:"-7,215,225"},ESRI_37221:{towgs84:"252,-209,-751"},ESRI_4305:{towgs84:"-123,-206,219"},ESRI_104139:{towgs84:"-73,-247,227"},EPSG_4748:{towgs84:"51,391,-36"},EPSG_4219:{towgs84:"-384,664,-48"},EPSG_4255:{towgs84:"-333,-222,114"},EPSG_4257:{towgs84:"-587.8,519.75,145.76"},EPSG_4646:{towgs84:"-963,510,-359"},EPSG_6881:{towgs84:"-24,-203,268"},EPSG_6882:{towgs84:"-183,-15,273"},EPSG_4715:{towgs84:"-104,-129,239"},IGNF_RGF93GDD:{towgs84:"0,0,0"},IGNF_RGM04GDD:{towgs84:"0,0,0"},IGNF_RGSPM06GDD:{towgs84:"0,0,0"},IGNF_RGTAAF07GDD:{towgs84:"0,0,0"},IGNF_RGFG95GDD:{towgs84:"0,0,0"},IGNF_RGNCG:{towgs84:"0,0,0"},IGNF_RGPFGDD:{towgs84:"0,0,0"},IGNF_ETRS89G:{towgs84:"0,0,0"},IGNF_RGR92GDD:{towgs84:"0,0,0"},EPSG_4173:{towgs84:"0,0,0"},EPSG_4180:{towgs84:"0,0,0"},EPSG_4619:{towgs84:"0,0,0"},EPSG_4667:{towgs84:"0,0,0"},EPSG_4075:{towgs84:"0,0,0"},EPSG_6706:{towgs84:"0,0,0"},EPSG_7798:{towgs84:"0,0,0"},EPSG_4661:{towgs84:"0,0,0"},EPSG_4669:{towgs84:"0,0,0"},EPSG_8685:{towgs84:"0,0,0"},EPSG_4151:{towgs84:"0,0,0"},EPSG_9702:{towgs84:"0,0,0"},EPSG_4758:{towgs84:"0,0,0"},EPSG_4761:{towgs84:"0,0,0"},EPSG_4765:{towgs84:"0,0,0"},EPSG_8997:{towgs84:"0,0,0"},EPSG_4023:{towgs84:"0,0,0"},EPSG_4670:{towgs84:"0,0,0"},EPSG_4694:{towgs84:"0,0,0"},EPSG_4148:{towgs84:"0,0,0"},EPSG_4163:{towgs84:"0,0,0"},EPSG_4167:{towgs84:"0,0,0"},EPSG_4189:{towgs84:"0,0,0"},EPSG_4190:{towgs84:"0,0,0"},EPSG_4176:{towgs84:"0,0,0"},EPSG_4659:{towgs84:"0,0,0"},EPSG_3824:{towgs84:"0,0,0"},EPSG_3889:{towgs84:"0,0,0"},EPSG_4046:{towgs84:"0,0,0"},EPSG_4081:{towgs84:"0,0,0"},EPSG_4558:{towgs84:"0,0,0"},EPSG_4483:{towgs84:"0,0,0"},EPSG_5013:{towgs84:"0,0,0"},EPSG_5264:{towgs84:"0,0,0"},EPSG_5324:{towgs84:"0,0,0"},EPSG_5354:{towgs84:"0,0,0"},EPSG_5371:{towgs84:"0,0,0"},EPSG_5373:{towgs84:"0,0,0"},EPSG_5381:{towgs84:"0,0,0"},EPSG_5393:{towgs84:"0,0,0"},EPSG_5489:{towgs84:"0,0,0"},EPSG_5593:{towgs84:"0,0,0"},EPSG_6135:{towgs84:"0,0,0"},EPSG_6365:{towgs84:"0,0,0"},EPSG_5246:{towgs84:"0,0,0"},EPSG_7886:{towgs84:"0,0,0"},EPSG_8431:{towgs84:"0,0,0"},EPSG_8427:{towgs84:"0,0,0"},EPSG_8699:{towgs84:"0,0,0"},EPSG_8818:{towgs84:"0,0,0"},EPSG_4757:{towgs84:"0,0,0"},EPSG_9140:{towgs84:"0,0,0"},EPSG_8086:{towgs84:"0,0,0"},EPSG_4686:{towgs84:"0,0,0"},EPSG_4737:{towgs84:"0,0,0"},EPSG_4702:{towgs84:"0,0,0"},EPSG_4747:{towgs84:"0,0,0"},EPSG_4749:{towgs84:"0,0,0"},EPSG_4674:{towgs84:"0,0,0"},EPSG_4755:{towgs84:"0,0,0"},EPSG_4759:{towgs84:"0,0,0"},EPSG_4762:{towgs84:"0,0,0"},EPSG_4763:{towgs84:"0,0,0"},EPSG_4764:{towgs84:"0,0,0"},EPSG_4166:{towgs84:"0,0,0"},EPSG_4170:{towgs84:"0,0,0"},EPSG_5546:{towgs84:"0,0,0"},EPSG_7844:{towgs84:"0,0,0"},EPSG_4818:{towgs84:"589,76,480"}};for(var $h in rs){var Ys=rs[$h];Ys.datumName&&(rs[Ys.datumName]=Ys)}function Th(t,e,a,s,i,r,o){var n={};return t===void 0||t==="none"?n.datum_type=hi:n.datum_type=qd,e&&(n.datum_params=e.map(parseFloat),(n.datum_params[0]!==0||n.datum_params[1]!==0||n.datum_params[2]!==0)&&(n.datum_type=Le),n.datum_params.length>3&&(n.datum_params[3]!==0||n.datum_params[4]!==0||n.datum_params[5]!==0||n.datum_params[6]!==0)&&(n.datum_type=Ie,n.datum_params[3]*=_a,n.datum_params[4]*=_a,n.datum_params[5]*=_a,n.datum_params[6]=n.datum_params[6]/1e6+1)),o&&(n.datum_type=Ke,n.grids=o),n.a=a,n.b=s,n.es=i,n.ep2=r,n}var Ki={};function Lh(t,e,a){return e instanceof ArrayBuffer?Ih(t,e,a):{ready:Nh(t,e)}}function Ih(t,e,a){var s=!0;a!==void 0&&a.includeErrorFields===!1&&(s=!1);var i=new DataView(e),r=Bh(i),o=Dh(i,r),n=Fh(i,o,r,s),l={header:o,subgrids:n};return Ki[t]=l,l}async function Nh(t,e){for(var a=[],s=await e.getImageCount(),i=s-1;i>=0;i--){var r=await e.getImage(i),o=await r.readRasters(),n=o,l=[r.getWidth(),r.getHeight()],c=r.getBoundingBox().map(Vr),h=[r.fileDirectory.ModelPixelScale[0],r.fileDirectory.ModelPixelScale[1]].map(Vr),u=c[0]+(l[0]-1)*h[0],d=c[3]-(l[1]-1)*h[1],p=n[0],f=n[1],m=[];for(let y=l[1]-1;y>=0;y--)for(let _=l[0]-1;_>=0;_--){var g=y*l[0]+_;m.push([-ue(f[g]),ue(p[g])])}a.push({del:h,lim:l,ll:[-u,d],cvs:m})}var v={header:{nSubgrids:s},subgrids:a};return Ki[t]=v,v}function Rh(t){if(t===void 0)return null;var e=t.split(",");return e.map(Gh)}function Gh(t){if(t.length===0)return null;var e=t[0]==="@";return e&&(t=t.slice(1)),t==="null"?{name:"null",mandatory:!e,grid:null,isNull:!0}:{name:t,mandatory:!e,grid:Ki[t]||null,isNull:!1}}function Vr(t){return t*Math.PI/180}function ue(t){return t/3600*Math.PI/180}function Bh(t){var e=t.getInt32(8,!1);return e===11?!1:(e=t.getInt32(8,!0),e!==11&&console.warn("Failed to detect nadgrid endian-ness, defaulting to little-endian"),!0)}function Dh(t,e){return{nFields:t.getInt32(8,e),nSubgridFields:t.getInt32(24,e),nSubgrids:t.getInt32(40,e),shiftType:pi(t,56,64).trim(),fromSemiMajorAxis:t.getFloat64(120,e),fromSemiMinorAxis:t.getFloat64(136,e),toSemiMajorAxis:t.getFloat64(152,e),toSemiMinorAxis:t.getFloat64(168,e)}}function pi(t,e,a){return String.fromCharCode.apply(null,new Uint8Array(t.buffer.slice(e,a)))}function Fh(t,e,a,s){for(var i=176,r=[],o=0;o<e.nSubgrids;o++){var n=zh(t,i,a),l=jh(t,i,n,a,s),c=Math.round(1+(n.upperLongitude-n.lowerLongitude)/n.longitudeInterval),h=Math.round(1+(n.upperLatitude-n.lowerLatitude)/n.latitudeInterval);r.push({ll:[ue(n.lowerLongitude),ue(n.lowerLatitude)],del:[ue(n.longitudeInterval),ue(n.latitudeInterval)],lim:[c,h],count:n.gridNodeCount,cvs:Oh(l)});var u=16;s===!1&&(u=8),i+=176+n.gridNodeCount*u}return r}function Oh(t){return t.map(function(e){return[ue(e.longitudeShift),ue(e.latitudeShift)]})}function zh(t,e,a){return{name:pi(t,e+8,e+16).trim(),parent:pi(t,e+24,e+24+8).trim(),lowerLatitude:t.getFloat64(e+72,a),upperLatitude:t.getFloat64(e+88,a),lowerLongitude:t.getFloat64(e+104,a),upperLongitude:t.getFloat64(e+120,a),latitudeInterval:t.getFloat64(e+136,a),longitudeInterval:t.getFloat64(e+152,a),gridNodeCount:t.getInt32(e+168,a)}}function jh(t,e,a,s,i){var r=e+176,o=16;i===!1&&(o=8);for(var n=[],l=0;l<a.gridNodeCount;l++){var c={latitudeShift:t.getFloat32(r+l*o,s),longitudeShift:t.getFloat32(r+l*o+4,s)};i!==!1&&(c.latitudeAccuracy=t.getFloat32(r+l*o+8,s),c.longitudeAccuracy=t.getFloat32(r+l*o+12,s)),n.push(c)}return n}function zt(t,e){if(!(this instanceof zt))return new zt(t);this.forward=null,this.inverse=null,this.init=null,this.name,this.names=null,this.title,e=e||function(c){if(c)throw c};var a=gh(t);if(typeof a!="object"){e("Could not parse to valid json: "+t);return}var s=zt.projections.get(a.projName);if(!s){e("Could not get projection name from: "+t);return}if(a.datumCode&&a.datumCode!=="none"){var i=me(rs,a.datumCode);i&&(a.datum_params=a.datum_params||(i.towgs84?i.towgs84.split(","):null),a.ellps=i.ellipse,a.datumName=i.datumName?i.datumName:a.datumCode)}a.k0=a.k0||1,a.axis=a.axis||"enu",a.ellps=a.ellps||"wgs84",a.lat1=a.lat1||a.lat0;var r=Ch(a.a,a.b,a.rf,a.ellps,a.sphere),o=Ph(r.a,r.b,r.rf,a.R_A),n=Rh(a.nadgrids),l=a.datum||Th(a.datumCode,a.datum_params,r.a,r.b,o.es,o.ep2,n);Hr(this,a),Hr(this,s),this.a=r.a,this.b=r.b,this.rf=r.rf,this.sphere=r.sphere,this.es=o.es,this.e=o.e,this.ep2=o.ep2,this.datum=l,"init"in this&&typeof this.init=="function"&&this.init(),e(null,this)}zt.projections=Ah;zt.projections.start();function qh(t,e){return t.datum_type!==e.datum_type||t.a!==e.a||Math.abs(t.es-e.es)>5e-11?!1:t.datum_type===Le?t.datum_params[0]===e.datum_params[0]&&t.datum_params[1]===e.datum_params[1]&&t.datum_params[2]===e.datum_params[2]:t.datum_type===Ie?t.datum_params[0]===e.datum_params[0]&&t.datum_params[1]===e.datum_params[1]&&t.datum_params[2]===e.datum_params[2]&&t.datum_params[3]===e.datum_params[3]&&t.datum_params[4]===e.datum_params[4]&&t.datum_params[5]===e.datum_params[5]&&t.datum_params[6]===e.datum_params[6]:!0}function wo(t,e,a){var s=t.x,i=t.y,r=t.z?t.z:0,o,n,l,c;if(i<-L&&i>-1.001*L)i=-L;else if(i>L&&i<1.001*L)i=L;else{if(i<-L)return{x:-1/0,y:-1/0,z:t.z};if(i>L)return{x:1/0,y:1/0,z:t.z}}return s>Math.PI&&(s-=2*Math.PI),n=Math.sin(i),c=Math.cos(i),l=n*n,o=a/Math.sqrt(1-e*l),{x:(o+r)*c*Math.cos(s),y:(o+r)*c*Math.sin(s),z:(o*(1-e)+r)*n}}function Mo(t,e,a,s){var i=1e-12,r=i*i,o=30,n,l,c,h,u,d,p,f,m,g,v,y,_,b=t.x,x=t.y,w=t.z?t.z:0,E,P,$;if(n=Math.sqrt(b*b+x*x),l=Math.sqrt(b*b+x*x+w*w),n/a<i){if(E=0,l/a<i)return P=L,$=-s,{x:t.x,y:t.y,z:t.z}}else E=Math.atan2(x,b);c=w/l,h=n/l,u=1/Math.sqrt(1-e*(2-e)*h*h),f=h*(1-e)*u,m=c*u,_=0;do _++,p=a/Math.sqrt(1-e*m*m),$=n*f+w*m-p*(1-e*m*m),d=e*p/(p+$),u=1/Math.sqrt(1-d*(2-d)*h*h),g=h*(1-d)*u,v=c*u,y=v*f-g*m,f=g,m=v;while(y*y>r&&_<o);return P=Math.atan(v/Math.abs(g)),{x:E,y:P,z:$}}function Hh(t,e,a){if(e===Le)return{x:t.x+a[0],y:t.y+a[1],z:t.z+a[2]};if(e===Ie){var s=a[0],i=a[1],r=a[2],o=a[3],n=a[4],l=a[5],c=a[6];return{x:c*(t.x-l*t.y+n*t.z)+s,y:c*(l*t.x+t.y-o*t.z)+i,z:c*(-n*t.x+o*t.y+t.z)+r}}}function Uh(t,e,a){if(e===Le)return{x:t.x-a[0],y:t.y-a[1],z:t.z-a[2]};if(e===Ie){var s=a[0],i=a[1],r=a[2],o=a[3],n=a[4],l=a[5],c=a[6],h=(t.x-s)/c,u=(t.y-i)/c,d=(t.z-r)/c;return{x:h+l*u-n*d,y:-l*h+u+o*d,z:n*h-o*u+d}}}function Xa(t){return t===Le||t===Ie}function Vh(t,e,a){if(qh(t,e)||t.datum_type===hi||e.datum_type===hi)return a;var s=t.a,i=t.es;if(t.datum_type===Ke){var r=Wr(t,!1,a);if(r!==0)return;s=Dr,i=Fr}var o=e.a,n=e.b,l=e.es;if(e.datum_type===Ke&&(o=Dr,n=Hd,l=Fr),i===l&&s===o&&!Xa(t.datum_type)&&!Xa(e.datum_type))return a;if(a=wo(a,i,s),Xa(t.datum_type)&&(a=Hh(a,t.datum_type,t.datum_params)),Xa(e.datum_type)&&(a=Uh(a,e.datum_type,e.datum_params)),a=Mo(a,l,o,n),e.datum_type===Ke){var c=Wr(e,!0,a);if(c!==0)return}return a}function Wr(t,e,a){if(t.grids===null||t.grids.length===0)return console.log("Grid shift grids not found"),-1;var s={x:-a.x,y:a.y},i={x:Number.NaN,y:Number.NaN},r=[];t:for(var o=0;o<t.grids.length;o++){var n=t.grids[o];if(r.push(n.name),n.isNull){i=s;break}if(n.grid===null){if(n.mandatory)return console.log("Unable to find mandatory grid '"+n.name+"'"),-1;continue}for(var l=n.grid.subgrids,c=0,h=l.length;c<h;c++){var u=l[c],d=(Math.abs(u.del[1])+Math.abs(u.del[0]))/1e4,p=u.ll[0]-d,f=u.ll[1]-d,m=u.ll[0]+(u.lim[0]-1)*u.del[0]+d,g=u.ll[1]+(u.lim[1]-1)*u.del[1]+d;if(!(f>s.y||p>s.x||g<s.y||m<s.x)&&(i=Wh(s,e,u),!isNaN(i.x)))break t}}return isNaN(i.x)?(console.log("Failed to find a grid shift table for location '"+-s.x*Pt+" "+s.y*Pt+" tried: '"+r+"'"),-1):(a.x=-i.x,a.y=i.y,0)}function Wh(t,e,a){var s={x:Number.NaN,y:Number.NaN};if(isNaN(t.x))return s;var i={x:t.x,y:t.y};i.x-=a.ll[0],i.y-=a.ll[1],i.x=B(i.x-Math.PI)+Math.PI;var r=Kr(i,a);if(e){if(isNaN(r.x))return s;r.x=i.x-r.x,r.y=i.y-r.y;var o=9,n=1e-12,l,c;do{if(c=Kr(r,a),isNaN(c.x)){console.log("Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.");break}l={x:i.x-(c.x+r.x),y:i.y-(c.y+r.y)},r.x+=l.x,r.y+=l.y}while(o--&&Math.abs(l.x)>n&&Math.abs(l.y)>n);if(o<0)return console.log("Inverse grid shift iterator failed to converge."),s;s.x=B(r.x+a.ll[0]),s.y=r.y+a.ll[1]}else isNaN(r.x)||(s.x=t.x+r.x,s.y=t.y+r.y);return s}function Kr(t,e){var a={x:t.x/e.del[0],y:t.y/e.del[1]},s={x:Math.floor(a.x),y:Math.floor(a.y)},i={x:a.x-1*s.x,y:a.y-1*s.y},r={x:Number.NaN,y:Number.NaN},o;if(s.x<0||s.x>=e.lim[0]||s.y<0||s.y>=e.lim[1])return r;o=s.y*e.lim[0]+s.x;var n={x:e.cvs[o][0],y:e.cvs[o][1]};o++;var l={x:e.cvs[o][0],y:e.cvs[o][1]};o+=e.lim[0];var c={x:e.cvs[o][0],y:e.cvs[o][1]};o--;var h={x:e.cvs[o][0],y:e.cvs[o][1]},u=i.x*i.y,d=i.x*(1-i.y),p=(1-i.x)*(1-i.y),f=(1-i.x)*i.y;return r.x=p*n.x+d*l.x+f*h.x+u*c.x,r.y=p*n.y+d*l.y+f*h.y+u*c.y,r}function Yr(t,e,a){var s=a.x,i=a.y,r=a.z||0,o,n,l,c={};for(l=0;l<3;l++)if(!(e&&l===2&&a.z===void 0))switch(l===0?(o=s,"ew".indexOf(t.axis[l])!==-1?n="x":n="y"):l===1?(o=i,"ns".indexOf(t.axis[l])!==-1?n="y":n="x"):(o=r,n="z"),t.axis[l]){case"e":c[n]=o;break;case"w":c[n]=-o;break;case"n":c[n]=o;break;case"s":c[n]=-o;break;case"u":a[n]!==void 0&&(c.z=o);break;case"d":a[n]!==void 0&&(c.z=-o);break;default:return null}return c}function So(t){var e={x:t[0],y:t[1]};return t.length>2&&(e.z=t[2]),t.length>3&&(e.m=t[3]),e}function Kh(t){Jr(t.x),Jr(t.y)}function Jr(t){if(typeof Number.isFinite=="function"){if(Number.isFinite(t))return;throw new TypeError("coordinates must be finite numbers")}if(typeof t!="number"||t!==t||!isFinite(t))throw new TypeError("coordinates must be finite numbers")}function Yh(t,e){return(t.datum.datum_type===Le||t.datum.datum_type===Ie||t.datum.datum_type===Ke)&&e.datumCode!=="WGS84"||(e.datum.datum_type===Le||e.datum.datum_type===Ie||e.datum.datum_type===Ke)&&t.datumCode!=="WGS84"}function xs(t,e,a,s){var i;Array.isArray(a)?a=So(a):a={x:a.x,y:a.y,z:a.z,m:a.m};var r=a.z!==void 0;if(Kh(a),t.datum&&e.datum&&Yh(t,e)&&(i=new zt("WGS84"),a=xs(t,i,a,s),t=i),s&&t.axis!=="enu"&&(a=Yr(t,!1,a)),t.projName==="longlat")a={x:a.x*ut,y:a.y*ut,z:a.z||0};else if(t.to_meter&&(a={x:a.x*t.to_meter,y:a.y*t.to_meter,z:a.z||0}),a=t.inverse(a),!a)return;if(t.from_greenwich&&(a.x+=t.from_greenwich),a=Vh(t.datum,e.datum,a),!!a)return a=a,e.from_greenwich&&(a={x:a.x-e.from_greenwich,y:a.y,z:a.z||0}),e.projName==="longlat"?a={x:a.x*Pt,y:a.y*Pt,z:a.z||0}:(a=e.forward(a),e.to_meter&&(a={x:a.x/e.to_meter,y:a.y/e.to_meter,z:a.z||0})),s&&e.axis!=="enu"?Yr(e,!0,a):(a&&!r&&delete a.z,a)}var Zr=zt("WGS84");function Js(t,e,a,s){var i,r,o;return Array.isArray(a)?(i=xs(t,e,a,s)||{x:NaN,y:NaN},a.length>2?typeof t.name<"u"&&t.name==="geocent"||typeof e.name<"u"&&e.name==="geocent"?typeof i.z=="number"?[i.x,i.y,i.z].concat(a.slice(3)):[i.x,i.y,a[2]].concat(a.slice(3)):[i.x,i.y].concat(a.slice(2)):[i.x,i.y]):(r=xs(t,e,a,s),o=Object.keys(a),o.length===2||o.forEach(function(n){if(typeof t.name<"u"&&t.name==="geocent"||typeof e.name<"u"&&e.name==="geocent"){if(n==="x"||n==="y"||n==="z")return}else if(n==="x"||n==="y")return;r[n]=a[n]}),r)}function Qa(t){return t instanceof zt?t:typeof t=="object"&&"oProj"in t?t.oProj:zt(t)}function Jh(t,e,a){var s,i,r=!1,o;return typeof e>"u"?(i=Qa(t),s=Zr,r=!0):(typeof e.x<"u"||Array.isArray(e))&&(a=e,i=Qa(t),s=Zr,r=!0),s||(s=Qa(t)),i||(i=Qa(e)),a?Js(s,i,a):(o={forward:function(n,l){return Js(s,i,n,l)},inverse:function(n,l){return Js(i,s,n,l)}},r&&(o.oProj=i),o)}var Xr=6,Eo="AJSAJS",Ao="AFAFAF",qe=65,Et=73,Ft=79,fa=86,ga=90;const Zh={forward:ko,inverse:Xh,toPoint:Po};function ko(t,e){return e=e||5,eu(Qh({lat:t[1],lon:t[0]}),e)}function Xh(t){var e=Yi($o(t.toUpperCase()));return e.lat&&e.lon?[e.lon,e.lat,e.lon,e.lat]:[e.left,e.bottom,e.right,e.top]}function Po(t){var e=Yi($o(t.toUpperCase()));return e.lat&&e.lon?[e.lon,e.lat]:[(e.left+e.right)/2,(e.top+e.bottom)/2]}function Zs(t){return t*(Math.PI/180)}function Qr(t){return 180*(t/Math.PI)}function Qh(t){var e=t.lat,a=t.lon,s=6378137,i=.00669438,r=.9996,o,n,l,c,h,u,d,p=Zs(e),f=Zs(a),m,g;g=Math.floor((a+180)/6)+1,a===180&&(g=60),e>=56&&e<64&&a>=3&&a<12&&(g=32),e>=72&&e<84&&(a>=0&&a<9?g=31:a>=9&&a<21?g=33:a>=21&&a<33?g=35:a>=33&&a<42&&(g=37)),o=(g-1)*6-180+3,m=Zs(o),n=i/(1-i),l=s/Math.sqrt(1-i*Math.sin(p)*Math.sin(p)),c=Math.tan(p)*Math.tan(p),h=n*Math.cos(p)*Math.cos(p),u=Math.cos(p)*(f-m),d=s*((1-i/4-3*i*i/64-5*i*i*i/256)*p-(3*i/8+3*i*i/32+45*i*i*i/1024)*Math.sin(2*p)+(15*i*i/256+45*i*i*i/1024)*Math.sin(4*p)-35*i*i*i/3072*Math.sin(6*p));var v=r*l*(u+(1-c+h)*u*u*u/6+(5-18*c+c*c+72*h-58*n)*u*u*u*u*u/120)+5e5,y=r*(d+l*Math.tan(p)*(u*u/2+(5-c+9*h+4*h*h)*u*u*u*u/24+(61-58*c+c*c+600*h-330*n)*u*u*u*u*u*u/720));return e<0&&(y+=1e7),{northing:Math.round(y),easting:Math.round(v),zoneNumber:g,zoneLetter:tu(e)}}function Yi(t){var e=t.northing,a=t.easting,s=t.zoneLetter,i=t.zoneNumber;if(i<0||i>60)return null;var r=.9996,o=6378137,n=.00669438,l,c=(1-Math.sqrt(1-n))/(1+Math.sqrt(1-n)),h,u,d,p,f,m,g,v,y,_=a-5e5,b=e;s<"N"&&(b-=1e7),g=(i-1)*6-180+3,l=n/(1-n),m=b/r,v=m/(o*(1-n/4-3*n*n/64-5*n*n*n/256)),y=v+(3*c/2-27*c*c*c/32)*Math.sin(2*v)+(21*c*c/16-55*c*c*c*c/32)*Math.sin(4*v)+151*c*c*c/96*Math.sin(6*v),h=o/Math.sqrt(1-n*Math.sin(y)*Math.sin(y)),u=Math.tan(y)*Math.tan(y),d=l*Math.cos(y)*Math.cos(y),p=o*(1-n)/Math.pow(1-n*Math.sin(y)*Math.sin(y),1.5),f=_/(h*r);var x=y-h*Math.tan(y)/p*(f*f/2-(5+3*u+10*d-4*d*d-9*l)*f*f*f*f/24+(61+90*u+298*d+45*u*u-252*l-3*d*d)*f*f*f*f*f*f/720);x=Qr(x);var w=(f-(1+2*u+d)*f*f*f/6+(5-2*d+28*u-3*d*d+8*l+24*u*u)*f*f*f*f*f/120)/Math.cos(y);w=g+Qr(w);var E;if(t.accuracy){var P=Yi({northing:t.northing+t.accuracy,easting:t.easting+t.accuracy,zoneLetter:t.zoneLetter,zoneNumber:t.zoneNumber});E={top:P.lat,right:P.lon,bottom:x,left:w}}else E={lat:x,lon:w};return E}function tu(t){var e="Z";return 84>=t&&t>=72?e="X":72>t&&t>=64?e="W":64>t&&t>=56?e="V":56>t&&t>=48?e="U":48>t&&t>=40?e="T":40>t&&t>=32?e="S":32>t&&t>=24?e="R":24>t&&t>=16?e="Q":16>t&&t>=8?e="P":8>t&&t>=0?e="N":0>t&&t>=-8?e="M":-8>t&&t>=-16?e="L":-16>t&&t>=-24?e="K":-24>t&&t>=-32?e="J":-32>t&&t>=-40?e="H":-40>t&&t>=-48?e="G":-48>t&&t>=-56?e="F":-56>t&&t>=-64?e="E":-64>t&&t>=-72?e="D":-72>t&&t>=-80&&(e="C"),e}function eu(t,e){var a="00000"+t.easting,s="00000"+t.northing;return t.zoneNumber+t.zoneLetter+au(t.easting,t.northing,t.zoneNumber)+a.substr(a.length-5,e)+s.substr(s.length-5,e)}function au(t,e,a){var s=Co(a),i=Math.floor(t/1e5),r=Math.floor(e/1e5)%20;return su(i,r,s)}function Co(t){var e=t%Xr;return e===0&&(e=Xr),e}function su(t,e,a){var s=a-1,i=Eo.charCodeAt(s),r=Ao.charCodeAt(s),o=i+t-1,n=r+e,l=!1;o>ga&&(o=o-ga+qe-1,l=!0),(o===Et||i<Et&&o>Et||(o>Et||i<Et)&&l)&&o++,(o===Ft||i<Ft&&o>Ft||(o>Ft||i<Ft)&&l)&&(o++,o===Et&&o++),o>ga&&(o=o-ga+qe-1),n>fa?(n=n-fa+qe-1,l=!0):l=!1,(n===Et||r<Et&&n>Et||(n>Et||r<Et)&&l)&&n++,(n===Ft||r<Ft&&n>Ft||(n>Ft||r<Ft)&&l)&&(n++,n===Et&&n++),n>fa&&(n=n-fa+qe-1);var c=String.fromCharCode(o)+String.fromCharCode(n);return c}function $o(t){if(t&&t.length===0)throw"MGRSPoint coverting from nothing";for(var e=t.length,a=null,s="",i,r=0;!/[A-Z]/.test(i=t.charAt(r));){if(r>=2)throw"MGRSPoint bad conversion from: "+t;s+=i,r++}var o=parseInt(s,10);if(r===0||r+3>e)throw"MGRSPoint bad conversion from: "+t;var n=t.charAt(r++);if(n<="A"||n==="B"||n==="Y"||n>="Z"||n==="I"||n==="O")throw"MGRSPoint zone letter "+n+" not handled: "+t;a=t.substring(r,r+=2);for(var l=Co(o),c=iu(a.charAt(0),l),h=ru(a.charAt(1),l);h<nu(n);)h+=2e6;var u=e-r;if(u%2!==0)throw`MGRSPoint has to have an even number 
of digits after the zone letter and two 100km letters - front 
half for easting meters, second half for 
northing meters`+t;var d=u/2,p=0,f=0,m,g,v,y,_;return d>0&&(m=1e5/Math.pow(10,d),g=t.substring(r,r+d),p=parseFloat(g)*m,v=t.substring(r+d),f=parseFloat(v)*m),y=p+c,_=f+h,{easting:y,northing:_,zoneLetter:n,zoneNumber:o,accuracy:m}}function iu(t,e){for(var a=Eo.charCodeAt(e-1),s=1e5,i=!1;a!==t.charCodeAt(0);){if(a++,a===Et&&a++,a===Ft&&a++,a>ga){if(i)throw"Bad character: "+t;a=qe,i=!0}s+=1e5}return s}function ru(t,e){if(t>"V")throw"MGRSPoint given invalid Northing "+t;for(var a=Ao.charCodeAt(e-1),s=0,i=!1;a!==t.charCodeAt(0);){if(a++,a===Et&&a++,a===Ft&&a++,a>fa){if(i)throw"Bad character: "+t;a=qe,i=!0}s+=1e5}return s}function nu(t){var e;switch(t){case"C":e=11e5;break;case"D":e=2e6;break;case"E":e=28e5;break;case"F":e=37e5;break;case"G":e=46e5;break;case"H":e=55e5;break;case"J":e=64e5;break;case"K":e=73e5;break;case"L":e=82e5;break;case"M":e=91e5;break;case"N":e=0;break;case"P":e=8e5;break;case"Q":e=17e5;break;case"R":e=26e5;break;case"S":e=35e5;break;case"T":e=44e5;break;case"U":e=53e5;break;case"V":e=62e5;break;case"W":e=7e6;break;case"X":e=79e5;break;default:e=-1}if(e>=0)return e;throw"Invalid zone letter: "+t}function ea(t,e,a){if(!(this instanceof ea))return new ea(t,e,a);if(Array.isArray(t))this.x=t[0],this.y=t[1],this.z=t[2]||0;else if(typeof t=="object")this.x=t.x,this.y=t.y,this.z=t.z||0;else if(typeof t=="string"&&typeof e>"u"){var s=t.split(",");this.x=parseFloat(s[0]),this.y=parseFloat(s[1]),this.z=parseFloat(s[2])||0}else this.x=t,this.y=e,this.z=a||0;console.warn("proj4.Point will be removed in version 3, use proj4.toPoint")}ea.fromMGRS=function(t){return new ea(Po(t))};ea.prototype.toMGRS=function(t){return ko([this.x,this.y],t)};var ou=1,lu=.25,tn=.046875,en=.01953125,an=.01068115234375,cu=.75,du=.46875,hu=.013020833333333334,uu=.007120768229166667,pu=.3645833333333333,fu=.005696614583333333,gu=.3076171875;function Ji(t){var e=[];e[0]=ou-t*(lu+t*(tn+t*(en+t*an))),e[1]=t*(cu-t*(tn+t*(en+t*an)));var a=t*t;return e[2]=a*(du-t*(hu+t*uu)),a*=t,e[3]=a*(pu-t*fu),e[4]=a*t*gu,e}function oa(t,e,a,s){return a*=e,e*=e,s[0]*t-a*(s[1]+e*(s[2]+e*(s[3]+e*s[4])))}var mu=20;function Zi(t,e,a){for(var s=1/(1-e),i=t,r=mu;r;--r){var o=Math.sin(i),n=1-e*o*o;if(n=(oa(i,o,Math.cos(i),a)-t)*(n*Math.sqrt(n))*s,i-=n,Math.abs(n)<R)return i}return i}function vu(){this.x0=this.x0!==void 0?this.x0:0,this.y0=this.y0!==void 0?this.y0:0,this.long0=this.long0!==void 0?this.long0:0,this.lat0=this.lat0!==void 0?this.lat0:0,this.es&&(this.en=Ji(this.es),this.ml0=oa(this.lat0,Math.sin(this.lat0),Math.cos(this.lat0),this.en))}function yu(t){var e=t.x,a=t.y,s=B(e-this.long0,this.over),i,r,o,n=Math.sin(a),l=Math.cos(a);if(this.es){var h=l*s,u=Math.pow(h,2),d=this.ep2*Math.pow(l,2),p=Math.pow(d,2),f=Math.abs(l)>R?Math.tan(a):0,m=Math.pow(f,2),g=Math.pow(m,2);i=1-this.es*Math.pow(n,2),h=h/Math.sqrt(i);var v=oa(a,n,l,this.en);r=this.a*(this.k0*h*(1+u/6*(1-m+d+u/20*(5-18*m+g+14*d-58*m*d+u/42*(61+179*g-g*m-479*m)))))+this.x0,o=this.a*(this.k0*(v-this.ml0+n*s*h/2*(1+u/12*(5-m+9*d+4*p+u/30*(61+g-58*m+270*d-330*m*d+u/56*(1385+543*g-g*m-3111*m))))))+this.y0}else{var c=l*Math.sin(s);if(Math.abs(Math.abs(c)-1)<R)return 93;if(r=.5*this.a*this.k0*Math.log((1+c)/(1-c))+this.x0,o=l*Math.cos(s)/Math.sqrt(1-Math.pow(c,2)),c=Math.abs(o),c>=1){if(c-1>R)return 93;o=0}else o=Math.acos(o);a<0&&(o=-o),o=this.a*this.k0*(o-this.lat0)+this.y0}return t.x=r,t.y=o,t}function bu(t){var e,a,s,i,r=(t.x-this.x0)*(1/this.a),o=(t.y-this.y0)*(1/this.a);if(this.es)if(e=this.ml0+o/this.k0,a=Zi(e,this.es,this.en),Math.abs(a)<L){var u=Math.sin(a),d=Math.cos(a),p=Math.abs(d)>R?Math.tan(a):0,f=this.ep2*Math.pow(d,2),m=Math.pow(f,2),g=Math.pow(p,2),v=Math.pow(g,2);e=1-this.es*Math.pow(u,2);var y=r*Math.sqrt(e)/this.k0,_=Math.pow(y,2);e=e*p,s=a-e*_/(1-this.es)*.5*(1-_/12*(5+3*g-9*f*g+f-4*m-_/30*(61+90*g-252*f*g+45*v+46*f-_/56*(1385+3633*g+4095*v+1574*v*g)))),i=B(this.long0+y*(1-_/6*(1+2*g+f-_/20*(5+28*g+24*v+8*f*g+6*f-_/42*(61+662*g+1320*v+720*v*g))))/d,this.over)}else s=L*Oa(o),i=0;else{var n=Math.exp(r/this.k0),l=.5*(n-1/n),c=this.lat0+o/this.k0,h=Math.cos(c);e=Math.sqrt((1-Math.pow(h,2))/(1+Math.pow(l,2))),s=Math.asin(e),o<0&&(s=-s),l===0&&h===0?i=0:i=B(Math.atan2(l,h)+this.long0,this.over)}return t.x=i,t.y=s,t}var xu=["Fast_Transverse_Mercator","Fast Transverse Mercator"];const ns={init:vu,forward:yu,inverse:bu,names:xu};function To(t){var e=Math.exp(t);return e=(e-1/e)/2,e}function kt(t,e){t=Math.abs(t),e=Math.abs(e);var a=Math.max(t,e),s=Math.min(t,e)/(a||1);return a*Math.sqrt(1+Math.pow(s,2))}function _u(t){var e=1+t,a=e-1;return a===0?t:t*Math.log(e)/a}function wu(t){var e=Math.abs(t);return e=_u(e*(1+e/(kt(1,e)+1))),t<0?-e:e}function Xi(t,e){for(var a=2*Math.cos(2*e),s=t.length-1,i=t[s],r=0,o;--s>=0;)o=-r+a*i+t[s],r=i,i=o;return e+o*Math.sin(2*e)}function Mu(t,e){for(var a=2*Math.cos(e),s=t.length-1,i=t[s],r=0,o;--s>=0;)o=-r+a*i+t[s],r=i,i=o;return Math.sin(e)*o}function Su(t){var e=Math.exp(t);return e=(e+1/e)/2,e}function Lo(t,e,a){for(var s=Math.sin(e),i=Math.cos(e),r=To(a),o=Su(a),n=2*i*o,l=-2*s*r,c=t.length-1,h=t[c],u=0,d=0,p=0,f,m;--c>=0;)f=d,m=u,d=h,u=p,h=-f+n*d-l*u+t[c],p=-m+l*d+n*u;return n=s*o,l=i*r,[n*h-l*p,n*p+l*h]}function Eu(){if(!this.approx&&(isNaN(this.es)||this.es<=0))throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');this.approx&&(ns.init.apply(this),this.forward=ns.forward,this.inverse=ns.inverse),this.x0=this.x0!==void 0?this.x0:0,this.y0=this.y0!==void 0?this.y0:0,this.long0=this.long0!==void 0?this.long0:0,this.lat0=this.lat0!==void 0?this.lat0:0,this.cgb=[],this.cbg=[],this.utg=[],this.gtu=[];var t=this.es/(1+Math.sqrt(1-this.es)),e=t/(2-t),a=e;this.cgb[0]=e*(2+e*(-2/3+e*(-2+e*(116/45+e*(26/45+e*(-2854/675)))))),this.cbg[0]=e*(-2+e*(2/3+e*(4/3+e*(-82/45+e*(32/45+e*(4642/4725)))))),a=a*e,this.cgb[1]=a*(7/3+e*(-8/5+e*(-227/45+e*(2704/315+e*(2323/945))))),this.cbg[1]=a*(5/3+e*(-16/15+e*(-13/9+e*(904/315+e*(-1522/945))))),a=a*e,this.cgb[2]=a*(56/15+e*(-136/35+e*(-1262/105+e*(73814/2835)))),this.cbg[2]=a*(-26/15+e*(34/21+e*(8/5+e*(-12686/2835)))),a=a*e,this.cgb[3]=a*(4279/630+e*(-332/35+e*(-399572/14175))),this.cbg[3]=a*(1237/630+e*(-12/5+e*(-24832/14175))),a=a*e,this.cgb[4]=a*(4174/315+e*(-144838/6237)),this.cbg[4]=a*(-734/315+e*(109598/31185)),a=a*e,this.cgb[5]=a*(601676/22275),this.cbg[5]=a*(444337/155925),a=Math.pow(e,2),this.Qn=this.k0/(1+e)*(1+a*(1/4+a*(1/64+a/256))),this.utg[0]=e*(-.5+e*(2/3+e*(-37/96+e*(1/360+e*(81/512+e*(-96199/604800)))))),this.gtu[0]=e*(.5+e*(-2/3+e*(5/16+e*(41/180+e*(-127/288+e*(7891/37800)))))),this.utg[1]=a*(-1/48+e*(-1/15+e*(437/1440+e*(-46/105+e*(1118711/3870720))))),this.gtu[1]=a*(13/48+e*(-3/5+e*(557/1440+e*(281/630+e*(-1983433/1935360))))),a=a*e,this.utg[2]=a*(-17/480+e*(37/840+e*(209/4480+e*(-5569/90720)))),this.gtu[2]=a*(61/240+e*(-103/140+e*(15061/26880+e*(167603/181440)))),a=a*e,this.utg[3]=a*(-4397/161280+e*(11/504+e*(830251/7257600))),this.gtu[3]=a*(49561/161280+e*(-179/168+e*(6601661/7257600))),a=a*e,this.utg[4]=a*(-4583/161280+e*(108847/3991680)),this.gtu[4]=a*(34729/80640+e*(-3418889/1995840)),a=a*e,this.utg[5]=a*(-20648693/638668800),this.gtu[5]=a*(212378941/319334400);var s=Xi(this.cbg,this.lat0);this.Zb=-this.Qn*(s+Mu(this.gtu,2*s))}function Au(t){var e=B(t.x-this.long0,this.over),a=t.y;a=Xi(this.cbg,a);var s=Math.sin(a),i=Math.cos(a),r=Math.sin(e),o=Math.cos(e);a=Math.atan2(s,o*i),e=Math.atan2(r*i,kt(s,i*o)),e=wu(Math.tan(e));var n=Lo(this.gtu,2*a,2*e);a=a+n[0],e=e+n[1];var l,c;return Math.abs(e)<=2.623395162778?(l=this.a*(this.Qn*e)+this.x0,c=this.a*(this.Qn*a+this.Zb)+this.y0):(l=1/0,c=1/0),t.x=l,t.y=c,t}function ku(t){var e=(t.x-this.x0)*(1/this.a),a=(t.y-this.y0)*(1/this.a);a=(a-this.Zb)/this.Qn,e=e/this.Qn;var s,i;if(Math.abs(e)<=2.623395162778){var r=Lo(this.utg,2*a,2*e);a=a+r[0],e=e+r[1],e=Math.atan(To(e));var o=Math.sin(a),n=Math.cos(a),l=Math.sin(e),c=Math.cos(e);a=Math.atan2(o*c,kt(l,c*n)),e=Math.atan2(l,c*n),s=B(e+this.long0,this.over),i=Xi(this.cgb,a)}else s=1/0,i=1/0;return t.x=s,t.y=i,t}var Pu=["Extended_Transverse_Mercator","Extended Transverse Mercator","etmerc","Transverse_Mercator","Transverse Mercator","Gauss Kruger","Gauss_Kruger","tmerc"];const os={init:Eu,forward:Au,inverse:ku,names:Pu};function Cu(t,e){if(t===void 0){if(t=Math.floor((B(e)+Math.PI)*30/Math.PI)+1,t<0)return 0;if(t>60)return 60}return t}var $u="etmerc";function Tu(){var t=Cu(this.zone,this.long0);if(t===void 0)throw new Error("unknown utm zone");this.lat0=0,this.long0=(6*Math.abs(t)-183)*ut,this.x0=5e5,this.y0=this.utmSouth?1e7:0,this.k0=.9996,os.init.apply(this),this.forward=os.forward,this.inverse=os.inverse}var Lu=["Universal Transverse Mercator System","utm"];const Iu={init:Tu,names:Lu,dependsOn:$u};function Qi(t,e){return Math.pow((1-t)/(1+t),e)}var Nu=20;function Ru(){var t=Math.sin(this.lat0),e=Math.cos(this.lat0);e*=e,this.rc=Math.sqrt(1-this.es)/(1-this.es*t*t),this.C=Math.sqrt(1+this.es*e*e/(1-this.es)),this.phic0=Math.asin(t/this.C),this.ratexp=.5*this.C*this.e,this.K=Math.tan(.5*this.phic0+Q)/(Math.pow(Math.tan(.5*this.lat0+Q),this.C)*Qi(this.e*t,this.ratexp))}function Gu(t){var e=t.x,a=t.y;return t.y=2*Math.atan(this.K*Math.pow(Math.tan(.5*a+Q),this.C)*Qi(this.e*Math.sin(a),this.ratexp))-L,t.x=this.C*e,t}function Bu(t){for(var e=1e-14,a=t.x/this.C,s=t.y,i=Math.pow(Math.tan(.5*s+Q)/this.K,1/this.C),r=Nu;r>0&&(s=2*Math.atan(i*Qi(this.e*Math.sin(t.y),-.5*this.e))-L,!(Math.abs(s-t.y)<e));--r)t.y=s;return r?(t.x=a,t.y=s,t):null}const tr={init:Ru,forward:Gu,inverse:Bu};function Du(){tr.init.apply(this),this.rc&&(this.sinc0=Math.sin(this.phic0),this.cosc0=Math.cos(this.phic0),this.R2=2*this.rc,this.title||(this.title="Oblique Stereographic Alternative"))}function Fu(t){var e,a,s,i;return t.x=B(t.x-this.long0,this.over),tr.forward.apply(this,[t]),e=Math.sin(t.y),a=Math.cos(t.y),s=Math.cos(t.x),i=this.k0*this.R2/(1+this.sinc0*e+this.cosc0*a*s),t.x=i*a*Math.sin(t.x),t.y=i*(this.cosc0*e-this.sinc0*a*s),t.x=this.a*t.x+this.x0,t.y=this.a*t.y+this.y0,t}function Ou(t){var e,a,s,i,r;if(t.x=(t.x-this.x0)/this.a,t.y=(t.y-this.y0)/this.a,t.x/=this.k0,t.y/=this.k0,r=kt(t.x,t.y)){var o=2*Math.atan2(r,this.R2);e=Math.sin(o),a=Math.cos(o),i=Math.asin(a*this.sinc0+t.y*e*this.cosc0/r),s=Math.atan2(t.x*e,r*this.cosc0*a-t.y*this.sinc0*e)}else i=this.phic0,s=0;return t.x=s,t.y=i,tr.inverse.apply(this,[t]),t.x=B(t.x+this.long0,this.over),t}var zu=["Stereographic_North_Pole","Oblique_Stereographic","sterea","Oblique Stereographic Alternative","Double_Stereographic"];const ju={init:Du,forward:Fu,inverse:Ou,names:zu};function er(t,e,a){return e*=a,Math.tan(.5*(L+t))*Math.pow((1-e)/(1+e),.5*a)}function qu(){this.x0=this.x0||0,this.y0=this.y0||0,this.lat0=this.lat0||0,this.long0=this.long0||0,this.coslat0=Math.cos(this.lat0),this.sinlat0=Math.sin(this.lat0),this.sphere?this.k0===1&&!isNaN(this.lat_ts)&&Math.abs(this.coslat0)<=R&&(this.k0=.5*(1+Oa(this.lat0)*Math.sin(this.lat_ts))):(Math.abs(this.coslat0)<=R&&(this.lat0>0?this.con=1:this.con=-1),this.cons=Math.sqrt(Math.pow(1+this.e,1+this.e)*Math.pow(1-this.e,1-this.e)),this.k0===1&&!isNaN(this.lat_ts)&&Math.abs(this.coslat0)<=R&&Math.abs(Math.cos(this.lat_ts))>R&&(this.k0=.5*this.cons*Qt(this.e,Math.sin(this.lat_ts),Math.cos(this.lat_ts))/qt(this.e,this.con*this.lat_ts,this.con*Math.sin(this.lat_ts))),this.ms1=Qt(this.e,this.sinlat0,this.coslat0),this.X0=2*Math.atan(er(this.lat0,this.sinlat0,this.e))-L,this.cosX0=Math.cos(this.X0),this.sinX0=Math.sin(this.X0))}function Hu(t){var e=t.x,a=t.y,s=Math.sin(a),i=Math.cos(a),r,o,n,l,c,h,u=B(e-this.long0,this.over);return Math.abs(Math.abs(e-this.long0)-Math.PI)<=R&&Math.abs(a+this.lat0)<=R?(t.x=NaN,t.y=NaN,t):this.sphere?(r=2*this.k0/(1+this.sinlat0*s+this.coslat0*i*Math.cos(u)),t.x=this.a*r*i*Math.sin(u)+this.x0,t.y=this.a*r*(this.coslat0*s-this.sinlat0*i*Math.cos(u))+this.y0,t):(o=2*Math.atan(er(a,s,this.e))-L,l=Math.cos(o),n=Math.sin(o),Math.abs(this.coslat0)<=R?(c=qt(this.e,a*this.con,this.con*s),h=2*this.a*this.k0*c/this.cons,t.x=this.x0+h*Math.sin(e-this.long0),t.y=this.y0-this.con*h*Math.cos(e-this.long0),t):(Math.abs(this.sinlat0)<R?(r=2*this.a*this.k0/(1+l*Math.cos(u)),t.y=r*n):(r=2*this.a*this.k0*this.ms1/(this.cosX0*(1+this.sinX0*n+this.cosX0*l*Math.cos(u))),t.y=r*(this.cosX0*n-this.sinX0*l*Math.cos(u))+this.y0),t.x=r*l*Math.sin(u)+this.x0,t))}function Uu(t){t.x-=this.x0,t.y-=this.y0;var e,a,s,i,r,o=Math.sqrt(t.x*t.x+t.y*t.y);if(this.sphere){var n=2*Math.atan(o/(2*this.a*this.k0));return e=this.long0,a=this.lat0,o<=R?(t.x=e,t.y=a,t):(a=Math.asin(Math.cos(n)*this.sinlat0+t.y*Math.sin(n)*this.coslat0/o),Math.abs(this.coslat0)<R?this.lat0>0?e=B(this.long0+Math.atan2(t.x,-1*t.y),this.over):e=B(this.long0+Math.atan2(t.x,t.y),this.over):e=B(this.long0+Math.atan2(t.x*Math.sin(n),o*this.coslat0*Math.cos(n)-t.y*this.sinlat0*Math.sin(n)),this.over),t.x=e,t.y=a,t)}else if(Math.abs(this.coslat0)<=R){if(o<=R)return a=this.lat0,e=this.long0,t.x=e,t.y=a,t;t.x*=this.con,t.y*=this.con,s=o*this.cons/(2*this.a*this.k0),a=this.con*La(this.e,s),e=this.con*B(this.con*this.long0+Math.atan2(t.x,-1*t.y),this.over)}else i=2*Math.atan(o*this.cosX0/(2*this.a*this.k0*this.ms1)),e=this.long0,o<=R?r=this.X0:(r=Math.asin(Math.cos(i)*this.sinX0+t.y*Math.sin(i)*this.cosX0/o),e=B(this.long0+Math.atan2(t.x*Math.sin(i),o*this.cosX0*Math.cos(i)-t.y*this.sinX0*Math.sin(i)),this.over)),a=-1*La(this.e,Math.tan(.5*(L+r)));return t.x=e,t.y=a,t}var Vu=["stere","Stereographic_South_Pole","Polar_Stereographic_variant_A","Polar_Stereographic_variant_B","Polar_Stereographic"];const Wu={init:qu,forward:Hu,inverse:Uu,names:Vu,ssfn_:er};function Ku(){var t=this.lat0;this.lambda0=this.long0;var e=Math.sin(t),a=this.a,s=this.rf,i=1/s,r=2*i-Math.pow(i,2),o=this.e=Math.sqrt(r);this.R=this.k0*a*Math.sqrt(1-r)/(1-r*Math.pow(e,2)),this.alpha=Math.sqrt(1+r/(1-r)*Math.pow(Math.cos(t),4)),this.b0=Math.asin(e/this.alpha);var n=Math.log(Math.tan(Math.PI/4+this.b0/2)),l=Math.log(Math.tan(Math.PI/4+t/2)),c=Math.log((1+o*e)/(1-o*e));this.K=n-this.alpha*l+this.alpha*o/2*c}function Yu(t){var e=Math.log(Math.tan(Math.PI/4-t.y/2)),a=this.e/2*Math.log((1+this.e*Math.sin(t.y))/(1-this.e*Math.sin(t.y))),s=-this.alpha*(e+a)+this.K,i=2*(Math.atan(Math.exp(s))-Math.PI/4),r=this.alpha*(t.x-this.lambda0),o=Math.atan(Math.sin(r)/(Math.sin(this.b0)*Math.tan(i)+Math.cos(this.b0)*Math.cos(r))),n=Math.asin(Math.cos(this.b0)*Math.sin(i)-Math.sin(this.b0)*Math.cos(i)*Math.cos(r));return t.y=this.R/2*Math.log((1+Math.sin(n))/(1-Math.sin(n)))+this.y0,t.x=this.R*o+this.x0,t}function Ju(t){for(var e=t.x-this.x0,a=t.y-this.y0,s=e/this.R,i=2*(Math.atan(Math.exp(a/this.R))-Math.PI/4),r=Math.asin(Math.cos(this.b0)*Math.sin(i)+Math.sin(this.b0)*Math.cos(i)*Math.cos(s)),o=Math.atan(Math.sin(s)/(Math.cos(this.b0)*Math.cos(s)-Math.sin(this.b0)*Math.tan(i))),n=this.lambda0+o/this.alpha,l=0,c=r,h=-1e3,u=0;Math.abs(c-h)>1e-7;){if(++u>20)return;l=1/this.alpha*(Math.log(Math.tan(Math.PI/4+r/2))-this.K)+this.e*Math.log(Math.tan(Math.PI/4+Math.asin(this.e*Math.sin(c))/2)),h=c,c=2*Math.atan(Math.exp(l))-Math.PI/2}return t.x=n,t.y=c,t}var Zu=["somerc"];const Xu={init:Ku,forward:Yu,inverse:Ju,names:Zu};var De=1e-7;function Qu(t){var e=["Hotine_Oblique_Mercator","Hotine_Oblique_Mercator_variant_A","Hotine_Oblique_Mercator_Azimuth_Natural_Origin"],a=typeof t.projName=="object"?Object.keys(t.projName)[0]:t.projName;return"no_uoff"in t||"no_off"in t||e.indexOf(a)!==-1||e.indexOf(xo(a))!==-1}function tp(){var t,e,a,s,i,r,o,n,l,c,h=0,u,d=0,p=0,f=0,m=0,g=0,v=0;this.no_off=Qu(this),this.no_rot="no_rot"in this;var y=!1;"alpha"in this&&(y=!0);var _=!1;if("rectified_grid_angle"in this&&(_=!0),y&&(v=this.alpha),_&&(h=this.rectified_grid_angle),y||_)d=this.longc;else if(p=this.long1,m=this.lat1,f=this.long2,g=this.lat2,Math.abs(m-g)<=De||(t=Math.abs(m))<=De||Math.abs(t-L)<=De||Math.abs(Math.abs(this.lat0)-L)<=De||Math.abs(Math.abs(g)-L)<=De)throw new Error;var b=1-this.es;e=Math.sqrt(b),Math.abs(this.lat0)>R?(n=Math.sin(this.lat0),a=Math.cos(this.lat0),t=1-this.es*n*n,this.B=a*a,this.B=Math.sqrt(1+this.es*this.B*this.B/b),this.A=this.B*this.k0*e/t,s=this.B*e/(a*Math.sqrt(t)),i=s*s-1,i<=0?i=0:(i=Math.sqrt(i),this.lat0<0&&(i=-i)),this.E=i+=s,this.E*=Math.pow(qt(this.e,this.lat0,n),this.B)):(this.B=1/e,this.A=this.k0,this.E=s=i=1),y||_?(y?(u=Math.asin(Math.sin(v)/s),_||(h=v)):(u=h,v=Math.asin(s*Math.sin(u))),this.lam0=d-Math.asin(.5*(i-1/i)*Math.tan(u))/this.B):(r=Math.pow(qt(this.e,m,Math.sin(m)),this.B),o=Math.pow(qt(this.e,g,Math.sin(g)),this.B),i=this.E/r,l=(o-r)/(o+r),c=this.E*this.E,c=(c-o*r)/(c+o*r),t=p-f,t<-Math.PI?f-=$a:t>Math.PI&&(f+=$a),this.lam0=B(.5*(p+f)-Math.atan(c*Math.tan(.5*this.B*(p-f))/l)/this.B,this.over),u=Math.atan(2*Math.sin(this.B*B(p-this.lam0,this.over))/(i-1/i)),h=v=Math.asin(s*Math.sin(u))),this.singam=Math.sin(u),this.cosgam=Math.cos(u),this.sinrot=Math.sin(h),this.cosrot=Math.cos(h),this.rB=1/this.B,this.ArB=this.A*this.rB,this.BrA=1/this.ArB,this.no_off?this.u_0=0:(this.u_0=Math.abs(this.ArB*Math.atan(Math.sqrt(s*s-1)/Math.cos(v))),this.lat0<0&&(this.u_0=-this.u_0)),i=.5*u,this.v_pole_n=this.ArB*Math.log(Math.tan(Q-i)),this.v_pole_s=this.ArB*Math.log(Math.tan(Q+i))}function ep(t){var e={},a,s,i,r,o,n,l,c;if(t.x=t.x-this.lam0,Math.abs(Math.abs(t.y)-L)>R){if(o=this.E/Math.pow(qt(this.e,t.y,Math.sin(t.y)),this.B),n=1/o,a=.5*(o-n),s=.5*(o+n),r=Math.sin(this.B*t.x),i=(a*this.singam-r*this.cosgam)/s,Math.abs(Math.abs(i)-1)<R)throw new Error;c=.5*this.ArB*Math.log((1-i)/(1+i)),n=Math.cos(this.B*t.x),Math.abs(n)<De?l=this.A*t.x:l=this.ArB*Math.atan2(a*this.cosgam+r*this.singam,n)}else c=t.y>0?this.v_pole_n:this.v_pole_s,l=this.ArB*t.y;return this.no_rot?(e.x=l,e.y=c):(l-=this.u_0,e.x=c*this.cosrot+l*this.sinrot,e.y=l*this.cosrot-c*this.sinrot),e.x=this.a*e.x+this.x0,e.y=this.a*e.y+this.y0,e}function ap(t){var e,a,s,i,r,o,n,l={};if(t.x=(t.x-this.x0)*(1/this.a),t.y=(t.y-this.y0)*(1/this.a),this.no_rot?(a=t.y,e=t.x):(a=t.x*this.cosrot-t.y*this.sinrot,e=t.y*this.cosrot+t.x*this.sinrot+this.u_0),s=Math.exp(-this.BrA*a),i=.5*(s-1/s),r=.5*(s+1/s),o=Math.sin(this.BrA*e),n=(o*this.cosgam+i*this.singam)/r,Math.abs(Math.abs(n)-1)<R)l.x=0,l.y=n<0?-L:L;else{if(l.y=this.E/Math.sqrt((1+n)/(1-n)),l.y=La(this.e,Math.pow(l.y,1/this.B)),l.y===1/0)throw new Error;l.x=-this.rB*Math.atan2(i*this.cosgam-o*this.singam,Math.cos(this.BrA*e))}return l.x+=this.lam0,l}var sp=["Hotine_Oblique_Mercator","Hotine Oblique Mercator","Hotine_Oblique_Mercator_variant_A","Hotine_Oblique_Mercator_Variant_B","Hotine_Oblique_Mercator_Azimuth_Natural_Origin","Hotine_Oblique_Mercator_Two_Point_Natural_Origin","Hotine_Oblique_Mercator_Azimuth_Center","Oblique_Mercator","omerc"];const ip={init:tp,forward:ep,inverse:ap,names:sp};function rp(){if(this.lat2||(this.lat2=this.lat1),this.k0||(this.k0=1),this.x0=this.x0||0,this.y0=this.y0||0,!(Math.abs(this.lat1+this.lat2)<R)){var t=this.b/this.a;this.e=Math.sqrt(1-t*t);var e=Math.sin(this.lat1),a=Math.cos(this.lat1),s=Qt(this.e,e,a),i=qt(this.e,this.lat1,e),r=Math.sin(this.lat2),o=Math.cos(this.lat2),n=Qt(this.e,r,o),l=qt(this.e,this.lat2,r),c=Math.abs(Math.abs(this.lat0)-L)<R?0:qt(this.e,this.lat0,Math.sin(this.lat0));Math.abs(this.lat1-this.lat2)>R?this.ns=Math.log(s/n)/Math.log(i/l):this.ns=e,isNaN(this.ns)&&(this.ns=e),this.f0=s/(this.ns*Math.pow(i,this.ns)),this.rh=this.a*this.f0*Math.pow(c,this.ns),this.title||(this.title="Lambert Conformal Conic")}}function np(t){var e=t.x,a=t.y;Math.abs(2*Math.abs(a)-Math.PI)<=R&&(a=Oa(a)*(L-2*R));var s=Math.abs(Math.abs(a)-L),i,r;if(s>R)i=qt(this.e,a,Math.sin(a)),r=this.a*this.f0*Math.pow(i,this.ns);else{if(s=a*this.ns,s<=0)return null;r=0}var o=this.ns*B(e-this.long0,this.over);return t.x=this.k0*(r*Math.sin(o))+this.x0,t.y=this.k0*(this.rh-r*Math.cos(o))+this.y0,t}function op(t){var e,a,s,i,r,o=(t.x-this.x0)/this.k0,n=this.rh-(t.y-this.y0)/this.k0;this.ns>0?(e=Math.sqrt(o*o+n*n),a=1):(e=-Math.sqrt(o*o+n*n),a=-1);var l=0;if(e!==0&&(l=Math.atan2(a*o,a*n)),e!==0||this.ns>0){if(a=1/this.ns,s=Math.pow(e/(this.a*this.f0),a),i=La(this.e,s),i===-9999)return null}else i=-L;return r=B(l/this.ns+this.long0,this.over),t.x=r,t.y=i,t}var lp=["Lambert Tangential Conformal Conic Projection","Lambert_Conformal_Conic","Lambert_Conformal_Conic_1SP","Lambert_Conformal_Conic_2SP","lcc","Lambert Conic Conformal (1SP)","Lambert Conic Conformal (2SP)"];const cp={init:rp,forward:np,inverse:op,names:lp};function dp(){this.a=6377397155e-3,this.es=.006674372230614,this.e=Math.sqrt(this.es),this.lat0||(this.lat0=.863937979737193),this.long0||(this.long0=.7417649320975901-.308341501185665),this.k0||(this.k0=.9999),this.s45=.785398163397448,this.s90=2*this.s45,this.fi0=this.lat0,this.e2=this.es,this.e=Math.sqrt(this.e2),this.alfa=Math.sqrt(1+this.e2*Math.pow(Math.cos(this.fi0),4)/(1-this.e2)),this.uq=1.04216856380474,this.u0=Math.asin(Math.sin(this.fi0)/this.alfa),this.g=Math.pow((1+this.e*Math.sin(this.fi0))/(1-this.e*Math.sin(this.fi0)),this.alfa*this.e/2),this.k=Math.tan(this.u0/2+this.s45)/Math.pow(Math.tan(this.fi0/2+this.s45),this.alfa)*this.g,this.k1=this.k0,this.n0=this.a*Math.sqrt(1-this.e2)/(1-this.e2*Math.pow(Math.sin(this.fi0),2)),this.s0=1.37008346281555,this.n=Math.sin(this.s0),this.ro0=this.k1*this.n0/Math.tan(this.s0),this.ad=this.s90-this.uq}function hp(t){var e,a,s,i,r,o,n,l=t.x,c=t.y,h=B(l-this.long0,this.over);return e=Math.pow((1+this.e*Math.sin(c))/(1-this.e*Math.sin(c)),this.alfa*this.e/2),a=2*(Math.atan(this.k*Math.pow(Math.tan(c/2+this.s45),this.alfa)/e)-this.s45),s=-h*this.alfa,i=Math.asin(Math.cos(this.ad)*Math.sin(a)+Math.sin(this.ad)*Math.cos(a)*Math.cos(s)),r=Math.asin(Math.cos(a)*Math.sin(s)/Math.cos(i)),o=this.n*r,n=this.ro0*Math.pow(Math.tan(this.s0/2+this.s45),this.n)/Math.pow(Math.tan(i/2+this.s45),this.n),t.y=n*Math.cos(o)/1,t.x=n*Math.sin(o)/1,this.czech||(t.y*=-1,t.x*=-1),t}function up(t){var e,a,s,i,r,o,n,l,c=t.x;t.x=t.y,t.y=c,this.czech||(t.y*=-1,t.x*=-1),o=Math.sqrt(t.x*t.x+t.y*t.y),r=Math.atan2(t.y,t.x),i=r/Math.sin(this.s0),s=2*(Math.atan(Math.pow(this.ro0/o,1/this.n)*Math.tan(this.s0/2+this.s45))-this.s45),e=Math.asin(Math.cos(this.ad)*Math.sin(s)-Math.sin(this.ad)*Math.cos(s)*Math.cos(i)),a=Math.asin(Math.cos(s)*Math.sin(i)/Math.cos(e)),t.x=this.long0-a/this.alfa,n=e,l=0;var h=0;do t.y=2*(Math.atan(Math.pow(this.k,-1/this.alfa)*Math.pow(Math.tan(e/2+this.s45),1/this.alfa)*Math.pow((1+this.e*Math.sin(n))/(1-this.e*Math.sin(n)),this.e/2))-this.s45),Math.abs(n-t.y)<1e-10&&(l=1),n=t.y,h+=1;while(l===0&&h<15);return h>=15?null:t}var pp=["Krovak","krovak"];const fp={init:dp,forward:hp,inverse:up,names:pp};function Mt(t,e,a,s,i){return t*i-e*Math.sin(2*i)+a*Math.sin(4*i)-s*Math.sin(6*i)}function za(t){return 1-.25*t*(1+t/16*(3+1.25*t))}function ja(t){return .375*t*(1+.25*t*(1+.46875*t))}function qa(t){return .05859375*t*t*(1+.75*t)}function Ha(t){return t*t*t*(35/3072)}function ar(t,e,a){var s=e*a;return t/Math.sqrt(1-s*s)}function xe(t){return Math.abs(t)<L?t:t-Oa(t)*Math.PI}function _s(t,e,a,s,i){var r,o;r=t/e;for(var n=0;n<15;n++)if(o=(t-(e*r-a*Math.sin(2*r)+s*Math.sin(4*r)-i*Math.sin(6*r)))/(e-2*a*Math.cos(2*r)+4*s*Math.cos(4*r)-6*i*Math.cos(6*r)),r+=o,Math.abs(o)<=1e-10)return r;return NaN}function gp(){this.sphere||(this.e0=za(this.es),this.e1=ja(this.es),this.e2=qa(this.es),this.e3=Ha(this.es),this.ml0=this.a*Mt(this.e0,this.e1,this.e2,this.e3,this.lat0))}function mp(t){var e,a,s=t.x,i=t.y;if(s=B(s-this.long0,this.over),this.sphere)e=this.a*Math.asin(Math.cos(i)*Math.sin(s)),a=this.a*(Math.atan2(Math.tan(i),Math.cos(s))-this.lat0);else{var r=Math.sin(i),o=Math.cos(i),n=ar(this.a,this.e,r),l=Math.tan(i)*Math.tan(i),c=s*Math.cos(i),h=c*c,u=this.es*o*o/(1-this.es),d=this.a*Mt(this.e0,this.e1,this.e2,this.e3,i);e=n*c*(1-h*l*(1/6-(8-l+8*u)*h/120)),a=d-this.ml0+n*r/o*h*(.5+(5-l+6*u)*h/24)}return t.x=e+this.x0,t.y=a+this.y0,t}function vp(t){t.x-=this.x0,t.y-=this.y0;var e=t.x/this.a,a=t.y/this.a,s,i;if(this.sphere){var r=a+this.lat0;s=Math.asin(Math.sin(r)*Math.cos(e)),i=Math.atan2(Math.tan(e),Math.cos(r))}else{var o=this.ml0/this.a+a,n=_s(o,this.e0,this.e1,this.e2,this.e3);if(Math.abs(Math.abs(n)-L)<=R)return t.x=this.long0,t.y=L,a<0&&(t.y*=-1),t;var l=ar(this.a,this.e,Math.sin(n)),c=l*l*l/this.a/this.a*(1-this.es),h=Math.pow(Math.tan(n),2),u=e*this.a/l,d=u*u;s=n-l*Math.tan(n)/c*u*u*(.5-(1+3*h)*u*u/24),i=u*(1-d*(h/3+(1+3*h)*h*d/15))/Math.cos(n)}return t.x=B(i+this.long0,this.over),t.y=xe(s),t}var yp=["Cassini","Cassini_Soldner","cass"];const bp={init:gp,forward:mp,inverse:vp,names:yp};function pe(t,e){var a;return t>1e-7?(a=t*e,(1-t*t)*(e/(1-a*a)-.5/t*Math.log((1-a)/(1+a)))):2*e}var fi=1,gi=2,mi=3,ls=4;function xp(){var t=Math.abs(this.lat0);if(Math.abs(t-L)<R?this.mode=this.lat0<0?fi:gi:Math.abs(t)<R?this.mode=mi:this.mode=ls,this.es>0){var e;switch(this.qp=pe(this.e,1),this.mmf=.5/(1-this.es),this.apa=Cp(this.es),this.mode){case gi:this.dd=1;break;case fi:this.dd=1;break;case mi:this.rq=Math.sqrt(.5*this.qp),this.dd=1/this.rq,this.xmf=1,this.ymf=.5*this.qp;break;case ls:this.rq=Math.sqrt(.5*this.qp),e=Math.sin(this.lat0),this.sinb1=pe(this.e,e)/this.qp,this.cosb1=Math.sqrt(1-this.sinb1*this.sinb1),this.dd=Math.cos(this.lat0)/(Math.sqrt(1-this.es*e*e)*this.rq*this.cosb1),this.ymf=(this.xmf=this.rq)/this.dd,this.xmf*=this.dd;break}}else this.mode===ls&&(this.sinph0=Math.sin(this.lat0),this.cosph0=Math.cos(this.lat0))}function _p(t){var e,a,s,i,r,o,n,l,c,h,u=t.x,d=t.y;if(u=B(u-this.long0,this.over),this.sphere){if(r=Math.sin(d),h=Math.cos(d),s=Math.cos(u),this.mode===this.OBLIQ||this.mode===this.EQUIT){if(a=this.mode===this.EQUIT?1+h*s:1+this.sinph0*r+this.cosph0*h*s,a<=R)return null;a=Math.sqrt(2/a),e=a*h*Math.sin(u),a*=this.mode===this.EQUIT?r:this.cosph0*r-this.sinph0*h*s}else if(this.mode===this.N_POLE||this.mode===this.S_POLE){if(this.mode===this.N_POLE&&(s=-s),Math.abs(d+this.lat0)<R)return null;a=Q-d*.5,a=2*(this.mode===this.S_POLE?Math.cos(a):Math.sin(a)),e=a*Math.sin(u),a*=s}}else{switch(n=0,l=0,c=0,s=Math.cos(u),i=Math.sin(u),r=Math.sin(d),o=pe(this.e,r),(this.mode===this.OBLIQ||this.mode===this.EQUIT)&&(n=o/this.qp,l=Math.sqrt(1-n*n)),this.mode){case this.OBLIQ:c=1+this.sinb1*n+this.cosb1*l*s;break;case this.EQUIT:c=1+l*s;break;case this.N_POLE:c=L+d,o=this.qp-o;break;case this.S_POLE:c=d-L,o=this.qp+o;break}if(Math.abs(c)<R)return null;switch(this.mode){case this.OBLIQ:case this.EQUIT:c=Math.sqrt(2/c),this.mode===this.OBLIQ?a=this.ymf*c*(this.cosb1*n-this.sinb1*l*s):a=(c=Math.sqrt(2/(1+l*s)))*n*this.ymf,e=this.xmf*c*l*i;break;case this.N_POLE:case this.S_POLE:o>=0?(e=(c=Math.sqrt(o))*i,a=s*(this.mode===this.S_POLE?c:-c)):e=a=0;break}}return t.x=this.a*e+this.x0,t.y=this.a*a+this.y0,t}function wp(t){t.x-=this.x0,t.y-=this.y0;var e=t.x/this.a,a=t.y/this.a,s,i,r,o,n,l,c;if(this.sphere){var h=0,u,d=0;if(u=Math.sqrt(e*e+a*a),i=u*.5,i>1)return null;switch(i=2*Math.asin(i),(this.mode===this.OBLIQ||this.mode===this.EQUIT)&&(d=Math.sin(i),h=Math.cos(i)),this.mode){case this.EQUIT:i=Math.abs(u)<=R?0:Math.asin(a*d/u),e*=d,a=h*u;break;case this.OBLIQ:i=Math.abs(u)<=R?this.lat0:Math.asin(h*this.sinph0+a*d*this.cosph0/u),e*=d*this.cosph0,a=(h-Math.sin(i)*this.sinph0)*u;break;case this.N_POLE:a=-a,i=L-i;break;case this.S_POLE:i-=L;break}s=a===0&&(this.mode===this.EQUIT||this.mode===this.OBLIQ)?0:Math.atan2(e,a)}else{if(c=0,this.mode===this.OBLIQ||this.mode===this.EQUIT){if(e/=this.dd,a*=this.dd,l=Math.sqrt(e*e+a*a),l<R)return t.x=this.long0,t.y=this.lat0,t;o=2*Math.asin(.5*l/this.rq),r=Math.cos(o),e*=o=Math.sin(o),this.mode===this.OBLIQ?(c=r*this.sinb1+a*o*this.cosb1/l,n=this.qp*c,a=l*this.cosb1*r-a*this.sinb1*o):(c=a*o/l,n=this.qp*c,a=l*r)}else if(this.mode===this.N_POLE||this.mode===this.S_POLE){if(this.mode===this.N_POLE&&(a=-a),n=e*e+a*a,!n)return t.x=this.long0,t.y=this.lat0,t;c=1-n/this.qp,this.mode===this.S_POLE&&(c=-c)}s=Math.atan2(e,a),i=$p(Math.asin(c),this.apa)}return t.x=B(this.long0+s,this.over),t.y=i,t}var Mp=.3333333333333333,Sp=.17222222222222222,Ep=.10257936507936508,Ap=.06388888888888888,kp=.0664021164021164,Pp=.016415012942191543;function Cp(t){var e,a=[];return a[0]=t*Mp,e=t*t,a[0]+=e*Sp,a[1]=e*Ap,e*=t,a[0]+=e*Ep,a[1]+=e*kp,a[2]=e*Pp,a}function $p(t,e){var a=t+t;return t+e[0]*Math.sin(a)+e[1]*Math.sin(a+a)+e[2]*Math.sin(a+a+a)}var Tp=["Lambert Azimuthal Equal Area","Lambert_Azimuthal_Equal_Area","laea"];const Lp={init:xp,forward:_p,inverse:wp,names:Tp,S_POLE:fi,N_POLE:gi,EQUIT:mi,OBLIQ:ls};function ve(t){return Math.abs(t)>1&&(t=t>1?1:-1),Math.asin(t)}function Ip(){Math.abs(this.lat1+this.lat2)<R||(this.temp=this.b/this.a,this.es=1-Math.pow(this.temp,2),this.e3=Math.sqrt(this.es),this.sin_po=Math.sin(this.lat1),this.cos_po=Math.cos(this.lat1),this.t1=this.sin_po,this.con=this.sin_po,this.ms1=Qt(this.e3,this.sin_po,this.cos_po),this.qs1=pe(this.e3,this.sin_po),this.sin_po=Math.sin(this.lat2),this.cos_po=Math.cos(this.lat2),this.t2=this.sin_po,this.ms2=Qt(this.e3,this.sin_po,this.cos_po),this.qs2=pe(this.e3,this.sin_po),this.sin_po=Math.sin(this.lat0),this.cos_po=Math.cos(this.lat0),this.t3=this.sin_po,this.qs0=pe(this.e3,this.sin_po),Math.abs(this.lat1-this.lat2)>R?this.ns0=(this.ms1*this.ms1-this.ms2*this.ms2)/(this.qs2-this.qs1):this.ns0=this.con,this.c=this.ms1*this.ms1+this.ns0*this.qs1,this.rh=this.a*Math.sqrt(this.c-this.ns0*this.qs0)/this.ns0)}function Np(t){var e=t.x,a=t.y;this.sin_phi=Math.sin(a),this.cos_phi=Math.cos(a);var s=pe(this.e3,this.sin_phi),i=this.a*Math.sqrt(this.c-this.ns0*s)/this.ns0,r=this.ns0*B(e-this.long0,this.over),o=i*Math.sin(r)+this.x0,n=this.rh-i*Math.cos(r)+this.y0;return t.x=o,t.y=n,t}function Rp(t){var e,a,s,i,r,o;return t.x-=this.x0,t.y=this.rh-t.y+this.y0,this.ns0>=0?(e=Math.sqrt(t.x*t.x+t.y*t.y),s=1):(e=-Math.sqrt(t.x*t.x+t.y*t.y),s=-1),i=0,e!==0&&(i=Math.atan2(s*t.x,s*t.y)),s=e*this.ns0/this.a,this.sphere?o=Math.asin((this.c-s*s)/(2*this.ns0)):(a=(this.c-s*s)/this.ns0,o=this.phi1z(this.e3,a)),r=B(i/this.ns0+this.long0,this.over),t.x=r,t.y=o,t}function Gp(t,e){var a,s,i,r,o,n=ve(.5*e);if(t<R)return n;for(var l=t*t,c=1;c<=25;c++)if(a=Math.sin(n),s=Math.cos(n),i=t*a,r=1-i*i,o=.5*r*r/s*(e/(1-l)-a/r+.5/t*Math.log((1-i)/(1+i))),n=n+o,Math.abs(o)<=1e-7)return n;return null}var Bp=["Albers_Conic_Equal_Area","Albers_Equal_Area","Albers","aea"];const Dp={init:Ip,forward:Np,inverse:Rp,names:Bp,phi1z:Gp};function Fp(){this.sin_p14=Math.sin(this.lat0),this.cos_p14=Math.cos(this.lat0),this.infinity_dist=1e3*this.a,this.rc=1}function Op(t){var e,a,s,i,r,o,n,l,c=t.x,h=t.y;return s=B(c-this.long0,this.over),e=Math.sin(h),a=Math.cos(h),i=Math.cos(s),o=this.sin_p14*e+this.cos_p14*a*i,r=1,o>0||Math.abs(o)<=R?(n=this.x0+this.a*r*a*Math.sin(s)/o,l=this.y0+this.a*r*(this.cos_p14*e-this.sin_p14*a*i)/o):(n=this.x0+this.infinity_dist*a*Math.sin(s),l=this.y0+this.infinity_dist*(this.cos_p14*e-this.sin_p14*a*i)),t.x=n,t.y=l,t}function zp(t){var e,a,s,i,r,o;return t.x=(t.x-this.x0)/this.a,t.y=(t.y-this.y0)/this.a,t.x/=this.k0,t.y/=this.k0,(e=Math.sqrt(t.x*t.x+t.y*t.y))?(i=Math.atan2(e,this.rc),a=Math.sin(i),s=Math.cos(i),o=ve(s*this.sin_p14+t.y*a*this.cos_p14/e),r=Math.atan2(t.x*a,e*this.cos_p14*s-t.y*this.sin_p14*a),r=B(this.long0+r,this.over)):(o=this.phic0,r=0),t.x=r,t.y=o,t}var jp=["gnom"];const qp={init:Fp,forward:Op,inverse:zp,names:jp};function Hp(t,e){var a=1-(1-t*t)/(2*t)*Math.log((1-t)/(1+t));if(Math.abs(Math.abs(e)-a)<1e-6)return e<0?-1*L:L;for(var s=Math.asin(.5*e),i,r,o,n,l=0;l<30;l++)if(r=Math.sin(s),o=Math.cos(s),n=t*r,i=Math.pow(1-n*n,2)/(2*o)*(e/(1-t*t)-r/(1-n*n)+.5/t*Math.log((1-n)/(1+n))),s+=i,Math.abs(i)<=1e-10)return s;return NaN}function Up(){this.sphere||(this.k0=Qt(this.e,Math.sin(this.lat_ts),Math.cos(this.lat_ts)))}function Vp(t){var e=t.x,a=t.y,s,i,r=B(e-this.long0,this.over);if(this.sphere)s=this.x0+this.a*r*Math.cos(this.lat_ts),i=this.y0+this.a*Math.sin(a)/Math.cos(this.lat_ts);else{var o=pe(this.e,Math.sin(a));s=this.x0+this.a*this.k0*r,i=this.y0+this.a*o*.5/this.k0}return t.x=s,t.y=i,t}function Wp(t){t.x-=this.x0,t.y-=this.y0;var e,a;return this.sphere?(e=B(this.long0+t.x/this.a/Math.cos(this.lat_ts),this.over),a=Math.asin(t.y/this.a*Math.cos(this.lat_ts))):(a=Hp(this.e,2*t.y*this.k0/this.a),e=B(this.long0+t.x/(this.a*this.k0),this.over)),t.x=e,t.y=a,t}var Kp=["cea"];const Yp={init:Up,forward:Vp,inverse:Wp,names:Kp};function Jp(){this.x0=this.x0||0,this.y0=this.y0||0,this.lat0=this.lat0||0,this.long0=this.long0||0,this.lat_ts=this.lat_ts||0,this.title=this.title||"Equidistant Cylindrical (Plate Carre)",this.rc=Math.cos(this.lat_ts)}function Zp(t){var e=t.x,a=t.y,s=B(e-this.long0,this.over),i=xe(a-this.lat0);return t.x=this.x0+this.a*s*this.rc,t.y=this.y0+this.a*i,t}function Xp(t){var e=t.x,a=t.y;return t.x=B(this.long0+(e-this.x0)/(this.a*this.rc),this.over),t.y=xe(this.lat0+(a-this.y0)/this.a),t}var Qp=["Equirectangular","Equidistant_Cylindrical","Equidistant_Cylindrical_Spherical","eqc"];const t0={init:Jp,forward:Zp,inverse:Xp,names:Qp};var sn=20;function e0(){this.temp=this.b/this.a,this.es=1-Math.pow(this.temp,2),this.e=Math.sqrt(this.es),this.e0=za(this.es),this.e1=ja(this.es),this.e2=qa(this.es),this.e3=Ha(this.es),this.ml0=this.a*Mt(this.e0,this.e1,this.e2,this.e3,this.lat0)}function a0(t){var e=t.x,a=t.y,s,i,r,o=B(e-this.long0,this.over);if(r=o*Math.sin(a),this.sphere)Math.abs(a)<=R?(s=this.a*o,i=-1*this.a*this.lat0):(s=this.a*Math.sin(r)/Math.tan(a),i=this.a*(xe(a-this.lat0)+(1-Math.cos(r))/Math.tan(a)));else if(Math.abs(a)<=R)s=this.a*o,i=-1*this.ml0;else{var n=ar(this.a,this.e,Math.sin(a))/Math.tan(a);s=n*Math.sin(r),i=this.a*Mt(this.e0,this.e1,this.e2,this.e3,a)-this.ml0+n*(1-Math.cos(r))}return t.x=s+this.x0,t.y=i+this.y0,t}function s0(t){var e,a,s,i,r,o,n,l,c;if(s=t.x-this.x0,i=t.y-this.y0,this.sphere)if(Math.abs(i+this.a*this.lat0)<=R)e=B(s/this.a+this.long0,this.over),a=0;else{o=this.lat0+i/this.a,n=s*s/this.a/this.a+o*o,l=o;var h;for(r=sn;r;--r)if(h=Math.tan(l),c=-1*(o*(l*h+1)-l-.5*(l*l+n)*h)/((l-o)/h-1),l+=c,Math.abs(c)<=R){a=l;break}e=B(this.long0+Math.asin(s*Math.tan(l)/this.a)/Math.sin(a),this.over)}else if(Math.abs(i+this.ml0)<=R)a=0,e=B(this.long0+s/this.a,this.over);else{o=(this.ml0+i)/this.a,n=s*s/this.a/this.a+o*o,l=o;var u,d,p,f,m;for(r=sn;r;--r)if(m=this.e*Math.sin(l),u=Math.sqrt(1-m*m)*Math.tan(l),d=this.a*Mt(this.e0,this.e1,this.e2,this.e3,l),p=this.e0-2*this.e1*Math.cos(2*l)+4*this.e2*Math.cos(4*l)-6*this.e3*Math.cos(6*l),f=d/this.a,c=(o*(u*f+1)-f-.5*u*(f*f+n))/(this.es*Math.sin(2*l)*(f*f+n-2*o*f)/(4*u)+(o-f)*(u*p-2/Math.sin(2*l))-p),l-=c,Math.abs(c)<=R){a=l;break}u=Math.sqrt(1-this.es*Math.pow(Math.sin(a),2))*Math.tan(a),e=B(this.long0+Math.asin(s*u/this.a)/Math.sin(a),this.over)}return t.x=e,t.y=a,t}var i0=["Polyconic","American_Polyconic","poly"];const r0={init:e0,forward:a0,inverse:s0,names:i0};function n0(){this.A=[],this.A[1]=.6399175073,this.A[2]=-.1358797613,this.A[3]=.063294409,this.A[4]=-.02526853,this.A[5]=.0117879,this.A[6]=-.0055161,this.A[7]=.0026906,this.A[8]=-.001333,this.A[9]=67e-5,this.A[10]=-34e-5,this.B_re=[],this.B_im=[],this.B_re[1]=.7557853228,this.B_im[1]=0,this.B_re[2]=.249204646,this.B_im[2]=.003371507,this.B_re[3]=-.001541739,this.B_im[3]=.04105856,this.B_re[4]=-.10162907,this.B_im[4]=.01727609,this.B_re[5]=-.26623489,this.B_im[5]=-.36249218,this.B_re[6]=-.6870983,this.B_im[6]=-1.1651967,this.C_re=[],this.C_im=[],this.C_re[1]=1.3231270439,this.C_im[1]=0,this.C_re[2]=-.577245789,this.C_im[2]=-.007809598,this.C_re[3]=.508307513,this.C_im[3]=-.112208952,this.C_re[4]=-.15094762,this.C_im[4]=.18200602,this.C_re[5]=1.01418179,this.C_im[5]=1.64497696,this.C_re[6]=1.9660549,this.C_im[6]=2.5127645,this.D=[],this.D[1]=1.5627014243,this.D[2]=.5185406398,this.D[3]=-.03333098,this.D[4]=-.1052906,this.D[5]=-.0368594,this.D[6]=.007317,this.D[7]=.0122,this.D[8]=.00394,this.D[9]=-.0013}function o0(t){var e,a=t.x,s=t.y,i=s-this.lat0,r=a-this.long0,o=i/_a*1e-5,n=r,l=1,c=0;for(e=1;e<=10;e++)l=l*o,c=c+this.A[e]*l;var h=c,u=n,d=1,p=0,f,m,g=0,v=0;for(e=1;e<=6;e++)f=d*h-p*u,m=p*h+d*u,d=f,p=m,g=g+this.B_re[e]*d-this.B_im[e]*p,v=v+this.B_im[e]*d+this.B_re[e]*p;return t.x=v*this.a+this.x0,t.y=g*this.a+this.y0,t}function l0(t){var e,a=t.x,s=t.y,i=a-this.x0,r=s-this.y0,o=r/this.a,n=i/this.a,l=1,c=0,h,u,d=0,p=0;for(e=1;e<=6;e++)h=l*o-c*n,u=c*o+l*n,l=h,c=u,d=d+this.C_re[e]*l-this.C_im[e]*c,p=p+this.C_im[e]*l+this.C_re[e]*c;for(var f=0;f<this.iterations;f++){var m=d,g=p,v,y,_=o,b=n;for(e=2;e<=6;e++)v=m*d-g*p,y=g*d+m*p,m=v,g=y,_=_+(e-1)*(this.B_re[e]*m-this.B_im[e]*g),b=b+(e-1)*(this.B_im[e]*m+this.B_re[e]*g);m=1,g=0;var x=this.B_re[1],w=this.B_im[1];for(e=2;e<=6;e++)v=m*d-g*p,y=g*d+m*p,m=v,g=y,x=x+e*(this.B_re[e]*m-this.B_im[e]*g),w=w+e*(this.B_im[e]*m+this.B_re[e]*g);var E=x*x+w*w;d=(_*x+b*w)/E,p=(b*x-_*w)/E}var P=d,$=p,S=1,A=0;for(e=1;e<=9;e++)S=S*P,A=A+this.D[e]*S;var M=this.lat0+A*_a*1e5,k=this.long0+$;return t.x=k,t.y=M,t}var c0=["New_Zealand_Map_Grid","nzmg"];const d0={init:n0,forward:o0,inverse:l0,names:c0};function h0(){}function u0(t){var e=t.x,a=t.y,s=B(e-this.long0,this.over),i=this.x0+this.a*s,r=this.y0+this.a*Math.log(Math.tan(Math.PI/4+a/2.5))*1.25;return t.x=i,t.y=r,t}function p0(t){t.x-=this.x0,t.y-=this.y0;var e=B(this.long0+t.x/this.a,this.over),a=2.5*(Math.atan(Math.exp(.8*t.y/this.a))-Math.PI/4);return t.x=e,t.y=a,t}var f0=["Miller_Cylindrical","mill"];const g0={init:h0,forward:u0,inverse:p0,names:f0};var m0=20;function v0(){this.sphere?(this.n=1,this.m=0,this.es=0,this.C_y=Math.sqrt((this.m+1)/this.n),this.C_x=this.C_y/(this.m+1)):this.en=Ji(this.es)}function y0(t){var e,a,s=t.x,i=t.y;if(s=B(s-this.long0,this.over),this.sphere){if(!this.m)i=this.n!==1?Math.asin(this.n*Math.sin(i)):i;else for(var r=this.n*Math.sin(i),o=m0;o;--o){var n=(this.m*i+Math.sin(i)-r)/(this.m+Math.cos(i));if(i-=n,Math.abs(n)<R)break}e=this.a*this.C_x*s*(this.m+Math.cos(i)),a=this.a*this.C_y*i}else{var l=Math.sin(i),c=Math.cos(i);a=this.a*oa(i,l,c,this.en),e=this.a*s*c/Math.sqrt(1-this.es*l*l)}return t.x=e,t.y=a,t}function b0(t){var e,a,s,i;return t.x-=this.x0,s=t.x/this.a,t.y-=this.y0,e=t.y/this.a,this.sphere?(e/=this.C_y,s=s/(this.C_x*(this.m+Math.cos(e))),this.m?e=ve((this.m*e+Math.sin(e))/this.n):this.n!==1&&(e=ve(Math.sin(e)/this.n)),s=B(s+this.long0,this.over),e=xe(e)):(e=Zi(t.y/this.a,this.es,this.en),i=Math.abs(e),i<L?(i=Math.sin(e),a=this.long0+t.x*Math.sqrt(1-this.es*i*i)/(this.a*Math.cos(e)),s=B(a,this.over)):i-R<L&&(s=this.long0)),t.x=s,t.y=e,t}var x0=["Sinusoidal","sinu"];const _0={init:v0,forward:y0,inverse:b0,names:x0};function w0(){this.x0=this.x0!==void 0?this.x0:0,this.y0=this.y0!==void 0?this.y0:0,this.long0=this.long0!==void 0?this.long0:0}function M0(t){for(var e=t.x,a=t.y,s=B(e-this.long0,this.over),i=a,r=Math.PI*Math.sin(a);;){var o=-(i+Math.sin(i)-r)/(1+Math.cos(i));if(i+=o,Math.abs(o)<R)break}i/=2,Math.PI/2-Math.abs(a)<R&&(s=0);var n=.900316316158*this.a*s*Math.cos(i)+this.x0,l=1.4142135623731*this.a*Math.sin(i)+this.y0;return t.x=n,t.y=l,t}function S0(t){var e,a;t.x-=this.x0,t.y-=this.y0,a=t.y/(1.4142135623731*this.a),Math.abs(a)>.999999999999&&(a=.999999999999),e=Math.asin(a);var s=B(this.long0+t.x/(.900316316158*this.a*Math.cos(e)),this.over);s<-Math.PI&&(s=-Math.PI),s>Math.PI&&(s=Math.PI),a=(2*e+Math.sin(2*e))/Math.PI,Math.abs(a)>1&&(a=1);var i=Math.asin(a);return t.x=s,t.y=i,t}var E0=["Mollweide","moll"];const A0={init:w0,forward:M0,inverse:S0,names:E0};function k0(){Math.abs(this.lat1+this.lat2)<R||(this.lat2=this.lat2||this.lat1,this.temp=this.b/this.a,this.es=1-Math.pow(this.temp,2),this.e=Math.sqrt(this.es),this.e0=za(this.es),this.e1=ja(this.es),this.e2=qa(this.es),this.e3=Ha(this.es),this.sin_phi=Math.sin(this.lat1),this.cos_phi=Math.cos(this.lat1),this.ms1=Qt(this.e,this.sin_phi,this.cos_phi),this.ml1=Mt(this.e0,this.e1,this.e2,this.e3,this.lat1),Math.abs(this.lat1-this.lat2)<R?this.ns=this.sin_phi:(this.sin_phi=Math.sin(this.lat2),this.cos_phi=Math.cos(this.lat2),this.ms2=Qt(this.e,this.sin_phi,this.cos_phi),this.ml2=Mt(this.e0,this.e1,this.e2,this.e3,this.lat2),this.ns=(this.ms1-this.ms2)/(this.ml2-this.ml1)),this.g=this.ml1+this.ms1/this.ns,this.ml0=Mt(this.e0,this.e1,this.e2,this.e3,this.lat0),this.rh=this.a*(this.g-this.ml0))}function P0(t){var e=t.x,a=t.y,s;if(this.sphere)s=this.a*(this.g-a);else{var i=Mt(this.e0,this.e1,this.e2,this.e3,a);s=this.a*(this.g-i)}var r=this.ns*B(e-this.long0,this.over),o=this.x0+s*Math.sin(r),n=this.y0+this.rh-s*Math.cos(r);return t.x=o,t.y=n,t}function C0(t){t.x-=this.x0,t.y=this.rh-t.y+this.y0;var e,a,s,i;this.ns>=0?(a=Math.sqrt(t.x*t.x+t.y*t.y),e=1):(a=-Math.sqrt(t.x*t.x+t.y*t.y),e=-1);var r=0;if(a!==0&&(r=Math.atan2(e*t.x,e*t.y)),this.sphere)return i=B(this.long0+r/this.ns,this.over),s=xe(this.g-a/this.a),t.x=i,t.y=s,t;var o=this.g-a/this.a;return s=_s(o,this.e0,this.e1,this.e2,this.e3),i=B(this.long0+r/this.ns,this.over),t.x=i,t.y=s,t}var $0=["Equidistant_Conic","eqdc"];const T0={init:k0,forward:P0,inverse:C0,names:$0};function L0(){this.R=this.a}function I0(t){var e=t.x,a=t.y,s=B(e-this.long0,this.over),i,r;Math.abs(a)<=R&&(i=this.x0+this.R*s,r=this.y0);var o=ve(2*Math.abs(a/Math.PI));(Math.abs(s)<=R||Math.abs(Math.abs(a)-L)<=R)&&(i=this.x0,a>=0?r=this.y0+Math.PI*this.R*Math.tan(.5*o):r=this.y0+Math.PI*this.R*-Math.tan(.5*o));var n=.5*Math.abs(Math.PI/s-s/Math.PI),l=n*n,c=Math.sin(o),h=Math.cos(o),u=h/(c+h-1),d=u*u,p=u*(2/c-1),f=p*p,m=Math.PI*this.R*(n*(u-f)+Math.sqrt(l*(u-f)*(u-f)-(f+l)*(d-f)))/(f+l);s<0&&(m=-m),i=this.x0+m;var g=l+u;return m=Math.PI*this.R*(p*g-n*Math.sqrt((f+l)*(l+1)-g*g))/(f+l),a>=0?r=this.y0+m:r=this.y0-m,t.x=i,t.y=r,t}function N0(t){var e,a,s,i,r,o,n,l,c,h,u,d,p;return t.x-=this.x0,t.y-=this.y0,u=Math.PI*this.R,s=t.x/u,i=t.y/u,r=s*s+i*i,o=-Math.abs(i)*(1+r),n=o-2*i*i+s*s,l=-2*o+1+2*i*i+r*r,p=i*i/l+(2*n*n*n/l/l/l-9*o*n/l/l)/27,c=(o-n*n/3/l)/l,h=2*Math.sqrt(-c/3),u=3*p/c/h,Math.abs(u)>1&&(u>=0?u=1:u=-1),d=Math.acos(u)/3,t.y>=0?a=(-h*Math.cos(d+Math.PI/3)-n/3/l)*Math.PI:a=-(-h*Math.cos(d+Math.PI/3)-n/3/l)*Math.PI,Math.abs(s)<R?e=this.long0:e=B(this.long0+Math.PI*(r-1+Math.sqrt(1+2*(s*s-i*i)+r*r))/2/s,this.over),t.x=e,t.y=a,t}var R0=["Van_der_Grinten_I","VanDerGrinten","Van_der_Grinten","vandg"];const G0={init:L0,forward:I0,inverse:N0,names:R0};function B0(t,e,a,s,i,r){const o=s-e,n=Math.atan((1-r)*Math.tan(t)),l=Math.atan((1-r)*Math.tan(a)),c=Math.sin(n),h=Math.cos(n),u=Math.sin(l),d=Math.cos(l);let p=o,f,m=100,g,v,y,_,b,x,w,E,P,$,S,A,M,k;do{if(g=Math.sin(p),v=Math.cos(p),y=Math.sqrt(d*g*(d*g)+(h*u-c*d*v)*(h*u-c*d*v)),y===0)return{azi1:0,s12:0};_=c*u+h*d*v,b=Math.atan2(y,_),x=h*d*g/y,w=1-x*x,E=w!==0?_-2*c*u/w:0,P=r/16*w*(4+r*(4-3*w)),f=p,p=o+(1-P)*r*x*(b+P*y*(E+P*_*(-1+2*E*E)))}while(Math.abs(p-f)>1e-12&&--m>0);return m===0?{azi1:NaN,s12:NaN}:($=w*(i*i-i*(1-r)*(i*(1-r)))/(i*(1-r)*(i*(1-r))),S=1+$/16384*(4096+$*(-768+$*(320-175*$))),A=$/1024*(256+$*(-128+$*(74-47*$))),M=A*y*(E+A/4*(_*(-1+2*E*E)-A/6*E*(-3+4*y*y)*(-3+4*E*E))),k=i*(1-r)*S*(b-M),{azi1:Math.atan2(d*g,h*u-c*d*v),s12:k})}function D0(t,e,a,s,i,r){const o=Math.atan((1-r)*Math.tan(t)),n=Math.sin(o),l=Math.cos(o),c=Math.sin(a),h=Math.cos(a),u=Math.atan2(n,l*h),d=l*c,p=1-d*d,f=p*(i*i-i*(1-r)*(i*(1-r)))/(i*(1-r)*(i*(1-r))),m=1+f/16384*(4096+f*(-768+f*(320-175*f))),g=f/1024*(256+f*(-128+f*(74-47*f)));let v=s/(i*(1-r)*m),y,_=100,b,x,w,E;do b=Math.cos(2*u+v),x=Math.sin(v),w=Math.cos(v),E=g*x*(b+g/4*(w*(-1+2*b*b)-g/6*b*(-3+4*x*x)*(-3+4*b*b))),y=v,v=s/(i*(1-r)*m)+E;while(Math.abs(v-y)>1e-12&&--_>0);if(_===0)return{lat2:NaN,lon2:NaN};const P=n*x-l*w*h,$=Math.atan2(n*w+l*x*h,(1-r)*Math.sqrt(d*d+P*P)),S=Math.atan2(x*c,l*w-n*x*h),A=r/16*p*(4+r*(4-3*p)),M=S-(1-A)*r*d*(v+A*x*(b+A*w*(-1+2*b*b))),k=e+M;return{lat2:$,lon2:k}}function F0(){this.sin_p12=Math.sin(this.lat0),this.cos_p12=Math.cos(this.lat0),this.f=this.es/(1+Math.sqrt(1-this.es))}function O0(t){var e=t.x,a=t.y,s=Math.sin(t.y),i=Math.cos(t.y),r=B(e-this.long0,this.over),o,n,l,c,h,u,d,p,f,m,g;return this.sphere?Math.abs(this.sin_p12-1)<=R?(t.x=this.x0+this.a*(L-a)*Math.sin(r),t.y=this.y0-this.a*(L-a)*Math.cos(r),t):Math.abs(this.sin_p12+1)<=R?(t.x=this.x0+this.a*(L+a)*Math.sin(r),t.y=this.y0+this.a*(L+a)*Math.cos(r),t):(f=this.sin_p12*s+this.cos_p12*i*Math.cos(r),d=Math.acos(f),p=d?d/Math.sin(d):1,t.x=this.x0+this.a*p*i*Math.sin(r),t.y=this.y0+this.a*p*(this.cos_p12*s-this.sin_p12*i*Math.cos(r)),t):(o=za(this.es),n=ja(this.es),l=qa(this.es),c=Ha(this.es),Math.abs(this.sin_p12-1)<=R?(h=this.a*Mt(o,n,l,c,L),u=this.a*Mt(o,n,l,c,a),t.x=this.x0+(h-u)*Math.sin(r),t.y=this.y0-(h-u)*Math.cos(r),t):Math.abs(this.sin_p12+1)<=R?(h=this.a*Mt(o,n,l,c,L),u=this.a*Mt(o,n,l,c,a),t.x=this.x0+(h+u)*Math.sin(r),t.y=this.y0+(h+u)*Math.cos(r),t):Math.abs(e)<R&&Math.abs(a-this.lat0)<R?(t.x=t.y=0,t):(m=B0(this.lat0,this.long0,a,e,this.a,this.f),g=m.azi1,t.x=m.s12*Math.sin(g),t.y=m.s12*Math.cos(g),t))}function z0(t){t.x-=this.x0,t.y-=this.y0;var e,a,s,i,r,o,n,l,c,h,u,d,p,f,m,g;return this.sphere?(e=Math.sqrt(t.x*t.x+t.y*t.y),e>2*L*this.a?void 0:(a=e/this.a,s=Math.sin(a),i=Math.cos(a),r=this.long0,Math.abs(e)<=R?o=this.lat0:(o=ve(i*this.sin_p12+t.y*s*this.cos_p12/e),n=Math.abs(this.lat0)-L,Math.abs(n)<=R?this.lat0>=0?r=B(this.long0+Math.atan2(t.x,-t.y),this.over):r=B(this.long0-Math.atan2(-t.x,t.y),this.over):r=B(this.long0+Math.atan2(t.x*s,e*this.cos_p12*i-t.y*this.sin_p12*s),this.over)),t.x=r,t.y=o,t)):(l=za(this.es),c=ja(this.es),h=qa(this.es),u=Ha(this.es),Math.abs(this.sin_p12-1)<=R?(d=this.a*Mt(l,c,h,u,L),e=Math.sqrt(t.x*t.x+t.y*t.y),p=d-e,o=_s(p/this.a,l,c,h,u),r=B(this.long0+Math.atan2(t.x,-1*t.y),this.over),t.x=r,t.y=o,t):Math.abs(this.sin_p12+1)<=R?(d=this.a*Mt(l,c,h,u,L),e=Math.sqrt(t.x*t.x+t.y*t.y),p=e-d,o=_s(p/this.a,l,c,h,u),r=B(this.long0+Math.atan2(t.x,t.y),this.over),t.x=r,t.y=o,t):(f=Math.atan2(t.x,t.y),m=Math.sqrt(t.x*t.x+t.y*t.y),g=D0(this.lat0,this.long0,f,m,this.a,this.f),t.x=g.lon2,t.y=g.lat2,t))}var j0=["Azimuthal_Equidistant","aeqd"];const q0={init:F0,forward:O0,inverse:z0,names:j0};function H0(){this.sin_p14=Math.sin(this.lat0),this.cos_p14=Math.cos(this.lat0)}function U0(t){var e,a,s,i,r,o,n,l,c=t.x,h=t.y;return s=B(c-this.long0,this.over),e=Math.sin(h),a=Math.cos(h),i=Math.cos(s),o=this.sin_p14*e+this.cos_p14*a*i,r=1,(o>0||Math.abs(o)<=R)&&(n=this.a*r*a*Math.sin(s),l=this.y0+this.a*r*(this.cos_p14*e-this.sin_p14*a*i)),t.x=n,t.y=l,t}function V0(t){var e,a,s,i,r,o,n;return t.x-=this.x0,t.y-=this.y0,e=Math.sqrt(t.x*t.x+t.y*t.y),a=ve(e/this.a),s=Math.sin(a),i=Math.cos(a),o=this.long0,Math.abs(e)<=R?(n=this.lat0,t.x=o,t.y=n,t):(n=ve(i*this.sin_p14+t.y*s*this.cos_p14/e),r=Math.abs(this.lat0)-L,Math.abs(r)<=R?(this.lat0>=0?o=B(this.long0+Math.atan2(t.x,-t.y),this.over):o=B(this.long0-Math.atan2(-t.x,t.y),this.over),t.x=o,t.y=n,t):(o=B(this.long0+Math.atan2(t.x*s,e*this.cos_p14*i-t.y*this.sin_p14*s),this.over),t.x=o,t.y=n,t))}var W0=["ortho"];const K0={init:H0,forward:U0,inverse:V0,names:W0};var dt={FRONT:1,RIGHT:2,BACK:3,LEFT:4,TOP:5,BOTTOM:6},tt={AREA_0:1,AREA_1:2,AREA_2:3,AREA_3:4};function Y0(){this.x0=this.x0||0,this.y0=this.y0||0,this.lat0=this.lat0||0,this.long0=this.long0||0,this.lat_ts=this.lat_ts||0,this.title=this.title||"Quadrilateralized Spherical Cube",this.lat0>=L-Q/2?this.face=dt.TOP:this.lat0<=-(L-Q/2)?this.face=dt.BOTTOM:Math.abs(this.long0)<=Q?this.face=dt.FRONT:Math.abs(this.long0)<=L+Q?this.face=this.long0>0?dt.RIGHT:dt.LEFT:this.face=dt.BACK,this.es!==0&&(this.one_minus_f=1-(this.a-this.b)/this.a,this.one_minus_f_squared=this.one_minus_f*this.one_minus_f)}function J0(t){var e={x:0,y:0},a,s,i,r,o,n,l={value:0};if(t.x-=this.long0,this.es!==0?a=Math.atan(this.one_minus_f_squared*Math.tan(t.y)):a=t.y,s=t.x,this.face===dt.TOP)r=L-a,s>=Q&&s<=L+Q?(l.value=tt.AREA_0,i=s-L):s>L+Q||s<=-(L+Q)?(l.value=tt.AREA_1,i=s>0?s-gt:s+gt):s>-(L+Q)&&s<=-Q?(l.value=tt.AREA_2,i=s+L):(l.value=tt.AREA_3,i=s);else if(this.face===dt.BOTTOM)r=L+a,s>=Q&&s<=L+Q?(l.value=tt.AREA_0,i=-s+L):s<Q&&s>=-Q?(l.value=tt.AREA_1,i=-s):s<-Q&&s>=-(L+Q)?(l.value=tt.AREA_2,i=-s-L):(l.value=tt.AREA_3,i=s>0?-s+gt:-s-gt);else{var c,h,u,d,p,f,m;this.face===dt.RIGHT?s=Ye(s,+L):this.face===dt.BACK?s=Ye(s,+gt):this.face===dt.LEFT&&(s=Ye(s,-L)),d=Math.sin(a),p=Math.cos(a),f=Math.sin(s),m=Math.cos(s),c=p*m,h=p*f,u=d,this.face===dt.FRONT?(r=Math.acos(c),i=ts(r,u,h,l)):this.face===dt.RIGHT?(r=Math.acos(h),i=ts(r,u,-c,l)):this.face===dt.BACK?(r=Math.acos(-c),i=ts(r,u,-h,l)):this.face===dt.LEFT?(r=Math.acos(-h),i=ts(r,u,c,l)):(r=i=0,l.value=tt.AREA_0)}return n=Math.atan(12/gt*(i+Math.acos(Math.sin(i)*Math.cos(Q))-L)),o=Math.sqrt((1-Math.cos(r))/(Math.cos(n)*Math.cos(n))/(1-Math.cos(Math.atan(1/Math.cos(i))))),l.value===tt.AREA_1?n+=L:l.value===tt.AREA_2?n+=gt:l.value===tt.AREA_3&&(n+=1.5*gt),e.x=o*Math.cos(n),e.y=o*Math.sin(n),e.x=e.x*this.a+this.x0,e.y=e.y*this.a+this.y0,t.x=e.x,t.y=e.y,t}function Z0(t){var e={lam:0,phi:0},a,s,i,r,o,n,l,c,h,u={value:0};if(t.x=(t.x-this.x0)/this.a,t.y=(t.y-this.y0)/this.a,s=Math.atan(Math.sqrt(t.x*t.x+t.y*t.y)),a=Math.atan2(t.y,t.x),t.x>=0&&t.x>=Math.abs(t.y)?u.value=tt.AREA_0:t.y>=0&&t.y>=Math.abs(t.x)?(u.value=tt.AREA_1,a-=L):t.x<0&&-t.x>=Math.abs(t.y)?(u.value=tt.AREA_2,a=a<0?a+gt:a-gt):(u.value=tt.AREA_3,a+=L),h=gt/12*Math.tan(a),o=Math.sin(h)/(Math.cos(h)-1/Math.sqrt(2)),n=Math.atan(o),i=Math.cos(a),r=Math.tan(s),l=1-i*i*r*r*(1-Math.cos(Math.atan(1/Math.cos(n)))),l<-1?l=-1:l>1&&(l=1),this.face===dt.TOP)c=Math.acos(l),e.phi=L-c,u.value===tt.AREA_0?e.lam=n+L:u.value===tt.AREA_1?e.lam=n<0?n+gt:n-gt:u.value===tt.AREA_2?e.lam=n-L:e.lam=n;else if(this.face===dt.BOTTOM)c=Math.acos(l),e.phi=c-L,u.value===tt.AREA_0?e.lam=-n+L:u.value===tt.AREA_1?e.lam=-n:u.value===tt.AREA_2?e.lam=-n-L:e.lam=n<0?-n-gt:-n+gt;else{var d,p,f;d=l,h=d*d,h>=1?f=0:f=Math.sqrt(1-h)*Math.sin(n),h+=f*f,h>=1?p=0:p=Math.sqrt(1-h),u.value===tt.AREA_1?(h=p,p=-f,f=h):u.value===tt.AREA_2?(p=-p,f=-f):u.value===tt.AREA_3&&(h=p,p=f,f=-h),this.face===dt.RIGHT?(h=d,d=-p,p=h):this.face===dt.BACK?(d=-d,p=-p):this.face===dt.LEFT&&(h=d,d=p,p=-h),e.phi=Math.acos(-f)-L,e.lam=Math.atan2(p,d),this.face===dt.RIGHT?e.lam=Ye(e.lam,-L):this.face===dt.BACK?e.lam=Ye(e.lam,-gt):this.face===dt.LEFT&&(e.lam=Ye(e.lam,+L))}if(this.es!==0){var m,g,v;m=e.phi<0?1:0,g=Math.tan(e.phi),v=this.b/Math.sqrt(g*g+this.one_minus_f_squared),e.phi=Math.atan(Math.sqrt(this.a*this.a-v*v)/(this.one_minus_f*v)),m&&(e.phi=-e.phi)}return e.lam+=this.long0,t.x=e.lam,t.y=e.phi,t}function ts(t,e,a,s){var i;return t<R?(s.value=tt.AREA_0,i=0):(i=Math.atan2(e,a),Math.abs(i)<=Q?s.value=tt.AREA_0:i>Q&&i<=L+Q?(s.value=tt.AREA_1,i-=L):i>L+Q||i<=-(L+Q)?(s.value=tt.AREA_2,i=i>=0?i-gt:i+gt):(s.value=tt.AREA_3,i+=L)),i}function Ye(t,e){var a=t+e;return a<-gt?a+=$a:a>+gt&&(a-=$a),a}var X0=["Quadrilateralized Spherical Cube","Quadrilateralized_Spherical_Cube","qsc"];const Q0={init:Y0,forward:J0,inverse:Z0,names:X0};var vi=[[1,22199e-21,-715515e-10,31103e-10],[.9986,-482243e-9,-24897e-9,-13309e-10],[.9954,-83103e-8,-448605e-10,-986701e-12],[.99,-.00135364,-59661e-9,36777e-10],[.9822,-.00167442,-449547e-11,-572411e-11],[.973,-.00214868,-903571e-10,18736e-12],[.96,-.00305085,-900761e-10,164917e-11],[.9427,-.00382792,-653386e-10,-26154e-10],[.9216,-.00467746,-10457e-8,481243e-11],[.8962,-.00536223,-323831e-10,-543432e-11],[.8679,-.00609363,-113898e-9,332484e-11],[.835,-.00698325,-640253e-10,934959e-12],[.7986,-.00755338,-500009e-10,935324e-12],[.7597,-.00798324,-35971e-9,-227626e-11],[.7186,-.00851367,-701149e-10,-86303e-10],[.6732,-.00986209,-199569e-9,191974e-10],[.6213,-.010418,883923e-10,624051e-11],[.5722,-.00906601,182e-6,624051e-11],[.5322,-.00677797,275608e-9,624051e-11]],ma=[[-520417e-23,.0124,121431e-23,-845284e-16],[.062,.0124,-126793e-14,422642e-15],[.124,.0124,507171e-14,-160604e-14],[.186,.0123999,-190189e-13,600152e-14],[.248,.0124002,710039e-13,-224e-10],[.31,.0123992,-264997e-12,835986e-13],[.372,.0124029,988983e-12,-311994e-12],[.434,.0123893,-369093e-11,-435621e-12],[.4958,.0123198,-102252e-10,-345523e-12],[.5571,.0121916,-154081e-10,-582288e-12],[.6176,.0119938,-241424e-10,-525327e-12],[.6769,.011713,-320223e-10,-516405e-12],[.7346,.0113541,-397684e-10,-609052e-12],[.7903,.0109107,-489042e-10,-104739e-11],[.8435,.0103431,-64615e-9,-140374e-14],[.8936,.00969686,-64636e-9,-8547e-9],[.9394,.00840947,-192841e-9,-42106e-10],[.9761,.00616527,-256e-6,-42106e-10],[1,.00328947,-319159e-9,-42106e-10]],Io=.8487,No=1.3523,Ro=Pt/5,tf=1/Ro,He=18,ws=function(t,e){return t[0]+e*(t[1]+e*(t[2]+e*t[3]))},ef=function(t,e){return t[1]+e*(2*t[2]+e*3*t[3])};function af(t,e,a,s){for(var i=e;s;--s){var r=t(i);if(i-=r,Math.abs(r)<a)break}return i}function sf(){this.x0=this.x0||0,this.y0=this.y0||0,this.long0=this.long0||0,this.es=0,this.title=this.title||"Robinson"}function rf(t){var e=B(t.x-this.long0,this.over),a=Math.abs(t.y),s=Math.floor(a*Ro);s<0?s=0:s>=He&&(s=He-1),a=Pt*(a-tf*s);var i={x:ws(vi[s],a)*e,y:ws(ma[s],a)};return t.y<0&&(i.y=-i.y),i.x=i.x*this.a*Io+this.x0,i.y=i.y*this.a*No+this.y0,i}function nf(t){var e={x:(t.x-this.x0)/(this.a*Io),y:Math.abs(t.y-this.y0)/(this.a*No)};if(e.y>=1)e.x/=vi[He][0],e.y=t.y<0?-L:L;else{var a=Math.floor(e.y*He);for(a<0?a=0:a>=He&&(a=He-1);;)if(ma[a][0]>e.y)--a;else if(ma[a+1][0]<=e.y)++a;else break;var s=ma[a],i=5*(e.y-s[0])/(ma[a+1][0]-s[0]);i=af(function(r){return(ws(s,r)-e.y)/ef(s,r)},i,R,100),e.x/=ws(vi[a],i),e.y=(5*a+i)*ut,t.y<0&&(e.y=-e.y)}return e.x=B(e.x+this.long0,this.over),e}var of=["Robinson","robin"];const lf={init:sf,forward:rf,inverse:nf,names:of};function cf(){this.name="geocent"}function df(t){var e=wo(t,this.es,this.a);return e}function hf(t){var e=Mo(t,this.es,this.a,this.b);return e}var uf=["Geocentric","geocentric","geocent","Geocent"];const pf={init:cf,forward:df,inverse:hf,names:uf};var wt={N_POLE:0,S_POLE:1,EQUIT:2,OBLIQ:3},ua={h:{def:1e5,num:!0},azi:{def:0,num:!0,degrees:!0},tilt:{def:0,num:!0,degrees:!0},long0:{def:0,num:!0},lat0:{def:0,num:!0}};function ff(){if(Object.keys(ua).forEach((function(a){if(typeof this[a]>"u")this[a]=ua[a].def;else{if(ua[a].num&&isNaN(this[a]))throw new Error("Invalid parameter value, must be numeric "+a+" = "+this[a]);ua[a].num&&(this[a]=parseFloat(this[a]))}ua[a].degrees&&(this[a]=this[a]*ut)}).bind(this)),Math.abs(Math.abs(this.lat0)-L)<R?this.mode=this.lat0<0?wt.S_POLE:wt.N_POLE:Math.abs(this.lat0)<R?this.mode=wt.EQUIT:(this.mode=wt.OBLIQ,this.sinph0=Math.sin(this.lat0),this.cosph0=Math.cos(this.lat0)),this.pn1=this.h/this.a,this.pn1<=0||this.pn1>1e10)throw new Error("Invalid height");this.p=1+this.pn1,this.rp=1/this.p,this.h1=1/this.pn1,this.pfact=(this.p+1)*this.h1,this.es=0;var t=this.tilt,e=this.azi;this.cg=Math.cos(e),this.sg=Math.sin(e),this.cw=Math.cos(t),this.sw=Math.sin(t)}function gf(t){t.x-=this.long0;var e=Math.sin(t.y),a=Math.cos(t.y),s=Math.cos(t.x),i,r;switch(this.mode){case wt.OBLIQ:r=this.sinph0*e+this.cosph0*a*s;break;case wt.EQUIT:r=a*s;break;case wt.S_POLE:r=-e;break;case wt.N_POLE:r=e;break}switch(r=this.pn1/(this.p-r),i=r*a*Math.sin(t.x),this.mode){case wt.OBLIQ:r*=this.cosph0*e-this.sinph0*a*s;break;case wt.EQUIT:r*=e;break;case wt.N_POLE:r*=-(a*s);break;case wt.S_POLE:r*=a*s;break}var o,n;return o=r*this.cg+i*this.sg,n=1/(o*this.sw*this.h1+this.cw),i=(i*this.cg-r*this.sg)*this.cw*n,r=o*n,t.x=i*this.a,t.y=r*this.a,t}function mf(t){t.x/=this.a,t.y/=this.a;var e={x:t.x,y:t.y},a,s,i;i=1/(this.pn1-t.y*this.sw),a=this.pn1*t.x*i,s=this.pn1*t.y*this.cw*i,t.x=a*this.cg+s*this.sg,t.y=s*this.cg-a*this.sg;var r=kt(t.x,t.y);if(Math.abs(r)<R)e.x=0,e.y=t.y;else{var o,n;switch(n=1-r*r*this.pfact,n=(this.p-Math.sqrt(n))/(this.pn1/r+r/this.pn1),o=Math.sqrt(1-n*n),this.mode){case wt.OBLIQ:e.y=Math.asin(o*this.sinph0+t.y*n*this.cosph0/r),t.y=(o-this.sinph0*Math.sin(e.y))*r,t.x*=n*this.cosph0;break;case wt.EQUIT:e.y=Math.asin(t.y*n/r),t.y=o*r,t.x*=n;break;case wt.N_POLE:e.y=Math.asin(o),t.y=-t.y;break;case wt.S_POLE:e.y=-Math.asin(o);break}e.x=Math.atan2(t.x,t.y)}return t.x=e.x+this.long0,t.y=e.y,t}var vf=["Tilted_Perspective","tpers"];const yf={init:ff,forward:gf,inverse:mf,names:vf};function bf(){if(this.flip_axis=this.sweep==="x"?1:0,this.h=Number(this.h),this.radius_g_1=this.h/this.a,this.radius_g_1<=0||this.radius_g_1>1e10)throw new Error;if(this.radius_g=1+this.radius_g_1,this.C=this.radius_g*this.radius_g-1,this.es!==0){var t=1-this.es,e=1/t;this.radius_p=Math.sqrt(t),this.radius_p2=t,this.radius_p_inv2=e,this.shape="ellipse"}else this.radius_p=1,this.radius_p2=1,this.radius_p_inv2=1,this.shape="sphere";this.title||(this.title="Geostationary Satellite View")}function xf(t){var e=t.x,a=t.y,s,i,r,o;if(e=e-this.long0,this.shape==="ellipse"){a=Math.atan(this.radius_p2*Math.tan(a));var n=this.radius_p/kt(this.radius_p*Math.cos(a),Math.sin(a));if(i=n*Math.cos(e)*Math.cos(a),r=n*Math.sin(e)*Math.cos(a),o=n*Math.sin(a),(this.radius_g-i)*i-r*r-o*o*this.radius_p_inv2<0)return t.x=Number.NaN,t.y=Number.NaN,t;s=this.radius_g-i,this.flip_axis?(t.x=this.radius_g_1*Math.atan(r/kt(o,s)),t.y=this.radius_g_1*Math.atan(o/s)):(t.x=this.radius_g_1*Math.atan(r/s),t.y=this.radius_g_1*Math.atan(o/kt(r,s)))}else this.shape==="sphere"&&(s=Math.cos(a),i=Math.cos(e)*s,r=Math.sin(e)*s,o=Math.sin(a),s=this.radius_g-i,this.flip_axis?(t.x=this.radius_g_1*Math.atan(r/kt(o,s)),t.y=this.radius_g_1*Math.atan(o/s)):(t.x=this.radius_g_1*Math.atan(r/s),t.y=this.radius_g_1*Math.atan(o/kt(r,s))));return t.x=t.x*this.a,t.y=t.y*this.a,t}function _f(t){var e=-1,a=0,s=0,i,r,o,n;if(t.x=t.x/this.a,t.y=t.y/this.a,this.shape==="ellipse"){this.flip_axis?(s=Math.tan(t.y/this.radius_g_1),a=Math.tan(t.x/this.radius_g_1)*kt(1,s)):(a=Math.tan(t.x/this.radius_g_1),s=Math.tan(t.y/this.radius_g_1)*kt(1,a));var l=s/this.radius_p;if(i=a*a+l*l+e*e,r=2*this.radius_g*e,o=r*r-4*i*this.C,o<0)return t.x=Number.NaN,t.y=Number.NaN,t;n=(-r-Math.sqrt(o))/(2*i),e=this.radius_g+n*e,a*=n,s*=n,t.x=Math.atan2(a,e),t.y=Math.atan(s*Math.cos(t.x)/e),t.y=Math.atan(this.radius_p_inv2*Math.tan(t.y))}else if(this.shape==="sphere"){if(this.flip_axis?(s=Math.tan(t.y/this.radius_g_1),a=Math.tan(t.x/this.radius_g_1)*Math.sqrt(1+s*s)):(a=Math.tan(t.x/this.radius_g_1),s=Math.tan(t.y/this.radius_g_1)*Math.sqrt(1+a*a)),i=a*a+s*s+e*e,r=2*this.radius_g*e,o=r*r-4*i*this.C,o<0)return t.x=Number.NaN,t.y=Number.NaN,t;n=(-r-Math.sqrt(o))/(2*i),e=this.radius_g+n*e,a*=n,s*=n,t.x=Math.atan2(a,e),t.y=Math.atan(s*Math.cos(t.x)/e)}return t.x=t.x+this.long0,t}var wf=["Geostationary Satellite View","Geostationary_Satellite","geos"];const Mf={init:bf,forward:xf,inverse:_f,names:wf};var wa=1.340264,Ma=-.081106,Sa=893e-6,Ea=.003796,Ms=Math.sqrt(3)/2;function Sf(){this.es=0,this.long0=this.long0!==void 0?this.long0:0,this.x0=this.x0!==void 0?this.x0:0,this.y0=this.y0!==void 0?this.y0:0}function Ef(t){var e=B(t.x-this.long0,this.over),a=t.y,s=Math.asin(Ms*Math.sin(a)),i=s*s,r=i*i*i;return t.x=e*Math.cos(s)/(Ms*(wa+3*Ma*i+r*(7*Sa+9*Ea*i))),t.y=s*(wa+Ma*i+r*(Sa+Ea*i)),t.x=this.a*t.x+this.x0,t.y=this.a*t.y+this.y0,t}function Af(t){t.x=(t.x-this.x0)/this.a,t.y=(t.y-this.y0)/this.a;var e=1e-9,a=12,s=t.y,i,r,o,n,l,c;for(c=0;c<a&&(i=s*s,r=i*i*i,o=s*(wa+Ma*i+r*(Sa+Ea*i))-t.y,n=wa+3*Ma*i+r*(7*Sa+9*Ea*i),s-=l=o/n,!(Math.abs(l)<e));++c);return i=s*s,r=i*i*i,t.x=Ms*t.x*(wa+3*Ma*i+r*(7*Sa+9*Ea*i))/Math.cos(s),t.y=Math.asin(Math.sin(s)/Ms),t.x=B(t.x+this.long0,this.over),t}var kf=["eqearth","Equal Earth","Equal_Earth"];const Pf={init:Sf,forward:Ef,inverse:Af,names:kf};var Ia=1e-10;function Cf(){var t;if(this.phi1=this.lat1,Math.abs(this.phi1)<Ia)throw new Error;this.es?(this.en=Ji(this.es),this.m1=oa(this.phi1,this.am1=Math.sin(this.phi1),t=Math.cos(this.phi1),this.en),this.am1=t/(Math.sqrt(1-this.es*this.am1*this.am1)*this.am1),this.inverse=Tf,this.forward=$f):(Math.abs(this.phi1)+Ia>=L?this.cphi1=0:this.cphi1=1/Math.tan(this.phi1),this.inverse=If,this.forward=Lf)}function $f(t){var e=B(t.x-(this.long0||0),this.over),a=t.y,s,i,r;return s=this.am1+this.m1-oa(a,i=Math.sin(a),r=Math.cos(a),this.en),i=r*e/(s*Math.sqrt(1-this.es*i*i)),t.x=s*Math.sin(i),t.y=this.am1-s*Math.cos(i),t.x=this.a*t.x+(this.x0||0),t.y=this.a*t.y+(this.y0||0),t}function Tf(t){t.x=(t.x-(this.x0||0))/this.a,t.y=(t.y-(this.y0||0))/this.a;var e,a,s,i;if(a=kt(t.x,t.y=this.am1-t.y),i=Zi(this.am1+this.m1-a,this.es,this.en),(e=Math.abs(i))<L)e=Math.sin(i),s=a*Math.atan2(t.x,t.y)*Math.sqrt(1-this.es*e*e)/Math.cos(i);else if(Math.abs(e-L)<=Ia)s=0;else throw new Error;return t.x=B(s+(this.long0||0),this.over),t.y=xe(i),t}function Lf(t){var e=B(t.x-(this.long0||0),this.over),a=t.y,s,i;return i=this.cphi1+this.phi1-a,Math.abs(i)>Ia?(t.x=i*Math.sin(s=e*Math.cos(a)/i),t.y=this.cphi1-i*Math.cos(s)):t.x=t.y=0,t.x=this.a*t.x+(this.x0||0),t.y=this.a*t.y+(this.y0||0),t}function If(t){t.x=(t.x-(this.x0||0))/this.a,t.y=(t.y-(this.y0||0))/this.a;var e,a,s=kt(t.x,t.y=this.cphi1-t.y);if(a=this.cphi1+this.phi1-s,Math.abs(a)>L)throw new Error;return Math.abs(Math.abs(a)-L)<=Ia?e=0:e=s*Math.atan2(t.x,t.y)/Math.cos(a),t.x=B(e+(this.long0||0),this.over),t.y=xe(a),t}var Nf=["bonne","Bonne (Werner lat_1=90)"];const Rf={init:Cf,names:Nf},rn={OBLIQUE:{forward:Of,inverse:jf},TRANSVERSE:{forward:zf,inverse:qf}},Ss={ROTATE:{o_alpha:"oAlpha",o_lon_c:"oLongC",o_lat_c:"oLatC"},NEW_POLE:{o_lat_p:"oLatP",o_lon_p:"oLongP"},NEW_EQUATOR:{o_lon_1:"oLong1",o_lat_1:"oLat1",o_lon_2:"oLong2",o_lat_2:"oLat2"}};function Gf(){if(this.x0=this.x0||0,this.y0=this.y0||0,this.long0=this.long0||0,this.title=this.title||"General Oblique Transformation",this.isIdentity=yo.includes(this.o_proj),!this.o_proj)throw new Error("Missing parameter: o_proj");if(this.o_proj==="ob_tran")throw new Error("Invalid value for o_proj: "+this.o_proj);const t=this.projStr.replace("+proj=ob_tran","").replace("+o_proj=","+proj=").trim(),e=zt(t);if(!e)throw new Error("Invalid parameter: o_proj. Unknown projection "+this.o_proj);e.long0=0,this.obliqueProjection=e;let a;const s=Object.keys(Ss),i=n=>{if(typeof this[n]>"u")return;const l=parseFloat(this[n])*ut;if(isNaN(l))throw new Error("Invalid value for "+n+": "+this[n]);return l};for(let n=0;n<s.length;n++){const l=s[n],c=Ss[l],h=Object.entries(c);if(h.some(([d])=>typeof this[d]<"u")){a=c;for(let d=0;d<h.length;d++){const[p,f]=h[d],m=i(p);if(typeof m>"u")throw new Error("Missing parameter: "+p+".");this[f]=m}break}}if(!a)throw new Error("No valid parameters provided for ob_tran projection.");const{lamp:r,phip:o}=Ff(this,a);this.lamp=r,Math.abs(o)>R?(this.cphip=Math.cos(o),this.sphip=Math.sin(o),this.projectionType=rn.OBLIQUE):this.projectionType=rn.TRANSVERSE}function Bf(t){return this.projectionType.forward(this,t)}function Df(t){return this.projectionType.inverse(this,t)}function Ff(t,e){let a,s;if(e===Ss.ROTATE){let i=t.oLongC,r=t.oLatC,o=t.oAlpha;if(Math.abs(Math.abs(r)-L)<=R)throw new Error("Invalid value for o_lat_c: "+t.o_lat_c+" should be < 90°");s=i+Math.atan2(-1*Math.cos(o),-1*Math.sin(o)*Math.sin(r)),a=Math.asin(Math.cos(r)*Math.sin(o))}else if(e===Ss.NEW_POLE)s=t.oLongP,a=t.oLatP;else{let i=t.oLong1,r=t.oLat1,o=t.oLong2,n=t.oLat2,l=Math.abs(r);if(Math.abs(r)>L-R)throw new Error("Invalid value for o_lat_1: "+t.o_lat_1+" should be < 90°");if(Math.abs(n)>L-R)throw new Error("Invalid value for o_lat_2: "+t.o_lat_2+" should be < 90°");if(Math.abs(r-n)<R)throw new Error("Invalid value for o_lat_1 and o_lat_2: o_lat_1 should be different from o_lat_2");if(l<R)throw new Error("Invalid value for o_lat_1: o_lat_1 should be different from zero");s=Math.atan2(Math.cos(r)*Math.sin(n)*Math.cos(i)-Math.sin(r)*Math.cos(n)*Math.cos(o),Math.sin(r)*Math.cos(n)*Math.sin(o)-Math.cos(r)*Math.sin(n)*Math.sin(i)),a=Math.atan(-1*Math.cos(s-i)/Math.tan(r))}return{lamp:s,phip:a}}function Of(t,e){let{x:a,y:s}=e;a+=t.long0;const i=Math.cos(a),r=Math.sin(s),o=Math.cos(s);e.x=B(Math.atan2(o*Math.sin(a),t.sphip*o*i+t.cphip*r)+t.lamp),e.y=Math.asin(t.sphip*r-t.cphip*o*i);const n=t.obliqueProjection.forward(e);return t.isIdentity&&(n.x*=Pt,n.y*=Pt),n}function zf(t,e){let{x:a,y:s}=e;a+=t.long0;const i=Math.cos(s),r=Math.cos(a);e.x=B(Math.atan2(i*Math.sin(a),Math.sin(s))+t.lamp),e.y=Math.asin(-1*i*r);const o=t.obliqueProjection.forward(e);return t.isIdentity&&(o.x*=Pt,o.y*=Pt),o}function jf(t,e){t.isIdentity&&(e.x*=ut,e.y*=ut);const a=t.obliqueProjection.inverse(e);let{x:s,y:i}=a;if(s<Number.MAX_VALUE){s-=t.lamp;const r=Math.cos(s),o=Math.sin(i),n=Math.cos(i);e.x=Math.atan2(n*Math.sin(s),t.sphip*n*r-t.cphip*o),e.y=Math.asin(t.sphip*o+t.cphip*n*r)}return e.x=B(e.x+t.long0),e}function qf(t,e){t.isIdentity&&(e.x*=ut,e.y*=ut);const a=t.obliqueProjection.inverse(e);let{x:s,y:i}=a;if(s<Number.MAX_VALUE){const r=Math.cos(i);s-=t.lamp,e.x=Math.atan2(r*Math.sin(s),-1*Math.sin(i)),e.y=Math.asin(r*Math.cos(s))}return e.x=B(e.x+t.long0),e}var Hf=["General Oblique Transformation","General_Oblique_Transformation","ob_tran"];const Uf={init:Gf,forward:Bf,inverse:Df,names:Hf};function Vf(t){t.Proj.projections.add(ns),t.Proj.projections.add(os),t.Proj.projections.add(Iu),t.Proj.projections.add(ju),t.Proj.projections.add(Wu),t.Proj.projections.add(Xu),t.Proj.projections.add(ip),t.Proj.projections.add(cp),t.Proj.projections.add(fp),t.Proj.projections.add(bp),t.Proj.projections.add(Lp),t.Proj.projections.add(Dp),t.Proj.projections.add(qp),t.Proj.projections.add(Yp),t.Proj.projections.add(t0),t.Proj.projections.add(r0),t.Proj.projections.add(d0),t.Proj.projections.add(g0),t.Proj.projections.add(_0),t.Proj.projections.add(A0),t.Proj.projections.add(T0),t.Proj.projections.add(G0),t.Proj.projections.add(q0),t.Proj.projections.add(K0),t.Proj.projections.add(Q0),t.Proj.projections.add(lf),t.Proj.projections.add(pf),t.Proj.projections.add(yf),t.Proj.projections.add(Mf),t.Proj.projections.add(Pf),t.Proj.projections.add(Rf),t.Proj.projections.add(Uf)}const sr=Object.assign(Jh,{defaultDatum:"WGS84",Proj:zt,WGS84:new zt("WGS84"),Point:ea,toPoint:So,defs:xt,nadgrid:Lh,transform:xs,mgrs:Zh,version:"__VERSION__"});Vf(sr);const zg=Object.freeze(Object.defineProperty({__proto__:null,default:sr},Symbol.toStringTag,{value:"Module"}));function Wf(t){if(!t)return"EPSG:4326";const e=t.trim();if(/WGS.?84/i.test(e)&&/GEOGCS/i.test(e)&&!/UTM/i.test(e))return"EPSG:4326";const a=e.match(/UTM[_ ]?[Zz]one[_ ]?(\d+)([NS]?)/i);if(a){const s=parseInt(a[1],10);return/S/i.test(a[2])||/south/i.test(e)?`EPSG:${32700+s}`:`EPSG:${32600+s}`}return e.length>10?e:"EPSG:4326"}function Kf(t,e){if(!e||e==="EPSG:4326")return{geojson:t,reprojected:!1,error:null};try{const a=sr(e,"EPSG:4326");return{geojson:{type:"FeatureCollection",features:t.features.map(i=>i.geometry?{...i,geometry:Yf(i.geometry,a)}:i)},reprojected:!0,error:null}}catch(a){return{geojson:t,reprojected:!1,error:`Reprojection failed: ${a.message}`}}}function Yf(t,e){const a=t.type;return a==="Point"?{type:a,coordinates:e.forward(t.coordinates)}:a==="MultiPoint"||a==="LineString"?{type:a,coordinates:t.coordinates.map(s=>e.forward(s))}:a==="MultiLineString"||a==="Polygon"?{type:a,coordinates:t.coordinates.map(s=>s.map(i=>e.forward(i)))}:a==="MultiPolygon"?{type:a,coordinates:t.coordinates.map(s=>s.map(i=>i.map(r=>e.forward(r))))}:t}function Jf(t){const e=[],a={},s=[];let i=0;for(const r of t.features||[]){if(!r.geometry||!r.geometry.type||!r.geometry.coordinates){i++;continue}const o=r.geometry.type;a[o]=(a[o]||0)+1,s.push(r)}return i>0&&e.push(`Removed ${i} feature(s) with null/empty geometry`),{cleaned:{type:"FeatureCollection",features:s},stats:{typeCounts:a,originalCount:(t.features||[]).length,validCount:s.length},warnings:e}}function Zf(t){var r,o;const e=[];let a=0,s=0;const i=[];for(const n of t.features){if(!n.geometry.type.includes("Polygon")){i.push(n);continue}try{let c=lr(n,0,{units:"meters"});if(!c||!c.geometry){const d=Vo(n,{tolerance:ct.simplifyTolerance,highQuality:!0});c=lr(d,0,{units:"meters"})}if(!c||!c.geometry){s++,e.push(`Dropped feature "${((r=n.properties)==null?void 0:r.name)||"unknown"}" — unfixable geometry`);continue}const h=ds(c);if(h<ct.sliverThresholdM2){s++,e.push(`Removed sliver polygon (${h.toFixed(1)} m²)`);continue}const u=ds(n);Math.abs(u-h)>.01&&a++,i.push({type:"Feature",geometry:c.geometry,properties:n.properties})}catch(c){i.push(n),e.push(`Could not validate geometry for "${((o=n.properties)==null?void 0:o.name)||"unknown"}": ${c.message}`)}}return a>0&&e.push(`Fixed ${a} geometry issue(s) via buffer(0)`),{cleaned:{type:"FeatureCollection",features:i},fixedCount:a,droppedCount:s,warnings:e}}const nn={global:{name:["name","site_name","area_name","site_nm","NAME","Name","SITE_NAME","AREA_NAME","label","LABEL","title","TITLE"],type:["type","TYPE","Type","category","CATEGORY","designation","DESIGNATION","desig","DESIG","class","CLASS"],realm:["realm","REALM","Realm","domain","DOMAIN","environment","ENVIRONMENT"],province:["province","PROVINCE","Province","state","STATE","region","REGION","island","ISLAND","prov","PROV"],year:["year","YEAR","Year","est_year","EST_YEAR","date","DATE","year_est","YEAR_EST","established"],status:["status","STATUS","Status","condition","CONDITION","state","mgmt_status"],source:["source","SOURCE","Source","data_src","DATA_SRC","origin","ORIGIN","provider"],notes:["notes","NOTES","Notes","comments","COMMENTS","description","DESCRIPTION","desc","DESC","remarks","REMARKS"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL"]},CCA:{name:["cca_name","CCA_NAME","community_area","COMMUNITY_AREA","tabu_name"],type:["cca_type","CCA_TYPE","tabu_type"]},MPA:{name:["mpa_name","MPA_NAME","marine_area","MARINE_AREA"],type:["mpa_type","MPA_TYPE","protection_level"]},PA:{name:["pa_name","PA_NAME","park_name","PARK_NAME","protected_area"],type:["pa_type","PA_TYPE","iucn_cat","IUCN_CAT"]},OECM:{name:["oecm_name","OECM_NAME"],type:["oecm_type","OECM_TYPE"]},KBA:{name:["kba_name","KBA_NAME","iba_name"],type:["kba_type","KBA_TYPE","trigger"]},LMMA:{name:["lmma_name","LMMA_NAME","managed_area"],type:["lmma_type","LMMA_TYPE","management_type"]},SPATIAL_PLAN:{name:["plan_name","PLAN_NAME","spatial_plan"],type:["plan_type","PLAN_TYPE","planning_zone"]},DEGRADED:{name:["degraded_name","site_name","SITE_NAME"],type:["degradation_type","DEGRADATION_TYPE","deg_type","cause"]},RESTORATION:{name:["restoration_name","project_name","PROJECT_NAME"],type:["restoration_type","activity"]},SPECIES_DIST:{name:["species_name","SPECIES_NAME","common_name","sci_name"],type:["species_type","taxa","TAXA","group"]},MEGAPODE:{name:["site_name","SITE_NAME","nesting_site","location","name"],type:["obs_type","record_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},STARLING:{name:["site_name","SITE_NAME","location","name"],type:["obs_type","record_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},FANTAIL:{name:["site_name","SITE_NAME","location","name"],type:["obs_type","record_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},KINGFISHER:{name:["site_name","SITE_NAME","location","name"],type:["obs_type","record_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},FLYING_FOX:{name:["site_name","SITE_NAME","roost_name","colony","location","name"],type:["obs_type","record_type","colony_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},PLERANDRA:{name:["site_name","SITE_NAME","population","location","name"],type:["obs_type","record_type","habitat_type","method","status"],presence:["presence","PRESENCE","Presence","seasonal","SEASONAL","origin","ORIGIN"]},INVASIVE:{name:["species_name","SPECIES","invasive_name","ias_name"],type:["invasive_type","threat_type","species_type","ias_type"]},MERREMIA:{name:["site_name","detection_id","SITE_NAME","patch_id"],type:["detection_method","confidence","CONFIDENCE","source_type"]},PESTICIDE:{name:["farm_name","FARM_NAME","site_name","operator"],type:["chemical_type","pesticide_type","PESTICIDE_TYPE","product"]},EUTROPHICATION:{name:["zone_name","ZONE_NAME","site_name","station"],type:["severity","SEVERITY","nutrient_level","trophic_state"]},LAND_COVER:{name:["class_name","CLASS_NAME","cover_type","land_use","Land_Use_P","LAND_USE_P"],type:["lc_class","LC_CLASS","land_cover","LAND_COVER","use_type","Land_Use_P","LAND_USE_P","land_use_p"]},GREEN_SPACE:{name:["park_name","PARK_NAME","space_name","garden_name"],type:["space_type","SPACE_TYPE","park_type","green_type"]}};function te(t,e,a){const s=Object.keys(t),i=s.map(n=>n.toLowerCase()),r=nn[a];if(r&&r[e])for(const n of r[e]){const l=i.indexOf(n.toLowerCase());if(l!==-1)return t[s[l]]}const o=nn.global;if(o&&o[e])for(const n of o[e]){const l=i.indexOf(n.toLowerCase());if(l!==-1)return t[s[l]]}}function ce(t){return typeof t!="string"?t:t.trim().normalize("NFC").replace(/\s+/g," ")}function Xf(t,e){const a=e.category||"OTHER",s=ce(te(t,"name",a))||"Unnamed",i=ce(te(t,"type",a))||a,r=ce(te(t,"realm",a))||e.realm||"terrestrial",o=ce(te(t,"province",a))||"",n=te(t,"year",a),l=n&&parseInt(n,10)||null,c=ce(te(t,"status",a))||"Unknown",h=ce(te(t,"source",a))||"",u=ce(te(t,"notes",a))||"",d=ce(te(t,"presence",a))||"",p={name:s,type:i,realm:r,province:o,year:l,status:c,source:h,notes:u,targets:[...e.targets||[]],upload_timestamp:e.uploadTimestamp||new Date().toISOString(),layer_id:e.layerId||"",original_filename:e.originalFilename||"",uploaded_by:e.uploadedBy||"admin"};return d&&(p.presence=d),p}function Qf(t,e){return{type:"FeatureCollection",features:(t.features||[]).map(a=>({type:"Feature",geometry:a.geometry,properties:Xf(a.properties||{},e)}))}}function tg(t){if(!t.geometry)return null;const e=t.geometry.type;if(e==="Point")return t;if(e==="MultiPolygon"){const a=t.geometry.coordinates;let s=0,i=null;for(const r of a){const o=Jo(r),n=ds(o);n>s&&(s=n,i=o)}return i?Fs(i):Fs(t)}try{return Fs(t)}catch{return null}}const eg=()=>new Promise(t=>setTimeout(t,0)),ag=2e3;function sg(t){return Yo(t)}function ig(t,e){return t[0]>=e[0]&&t[0]<=e[2]&&t[1]>=e[1]&&t[1]<=e[3]}async function rg(t,e){const a=e.features||[],s=t.features,i=new Array(s.length),r=a.map(o=>({feature:o,name:o.properties.name||o.properties.province||o.properties.NAME||o.properties.PROVINCE||"",bbox:sg(o)}));for(let o=0;o<s.length;o++){const n=s[o],l=tg(n);if(l){const c=Wo(l);let h=!1;for(const u of r)if(ig(c,u.bbox))try{if(Ko(l,u.feature)){i[o]={...n,properties:{...n.properties,province:u.name}},h=!0;break}}catch{continue}h||(i[o]=n)}else i[o]=n;o>0&&o%ag===0&&await eg()}return{type:"FeatureCollection",features:i}}async function ng(t,e,a,s){const i={steps:[],warnings:[],errors:[]},r=(P,$)=>{i.steps.push({step:P,message:$,timestamp:new Date().toISOString()}),s&&s(P,$)},o=()=>new Promise(P=>setTimeout(P,0));r(1,"Validating geometries...");const{cleaned:n,stats:l,warnings:c}=Jf(t);if(i.warnings.push(...c),r(1,`Valid: ${l.validCount}/${l.originalCount} features. Types: ${JSON.stringify(l.typeCounts)}`),n.features.length===0)return i.errors.push("No valid features found after basic validation"),{geojson:n,metadata:fs({name:e.name,status:"Failed"}),report:i};await o(),r(2,"Checking CRS...");const h=Wf(e.prjText);r(2,`Detected CRS: ${h}`);let u=n;if(h!=="EPSG:4326"){r(2,"Reprojecting to WGS84...");const{geojson:P,reprojected:$,error:S}=Kf(n,h);S&&(i.warnings.push(S),i.warnings.push("Unverified CRS — layer loaded but coordinates may be incorrect")),u=P,$&&r(2,"Reprojection successful")}await o(),r(3,"Fixing geometry issues...");const{cleaned:d,fixedCount:p,droppedCount:f,warnings:m}=Zf(u);i.warnings.push(...m),r(3,`Fixed: ${p}, Dropped: ${f}`),await o(),r(4,"Standardizing attributes...");const g=fs({name:e.name||e.originalFilename,originalFilename:e.originalFilename,category:e.category,targets:e.targets,realm:e.realm,countsToward30x30:e.countsToward30x30,isReference:e.isReference,detectedCRS:h,uploadedBy:e.uploadedBy||"admin"}),v=Qf(d,{category:e.category,targets:e.targets,realm:e.realm,layerId:g.id,originalFilename:e.originalFilename,uploadTimestamp:g.uploadTimestamp,uploadedBy:e.uploadedBy||"admin"});r(4,`Mapped ${v.features.length} features to standard schema`),await o(),r(5,"Assigning provinces...");let y=v;if(a&&a.features&&a.features.length>0){y=await rg(v,a);const P=y.features.filter($=>$.properties.province).length;r(5,`Province assigned to ${P}/${y.features.length} features`)}else i.warnings.push("No provinces boundary data — province assignment skipped"),r(5,"Skipped — no provinces data");await o(),r(6,"Computing areas...");const _=ki(y),b=_.features.reduce((P,$)=>P+($.properties.area_ha||0),0);r(6,`Total area: ${b.toFixed(2)} ha`),g.featureCount=_.features.length,g.validGeometryCount=_.features.filter(P=>P.geometry).length,g.fixedCount=p,g.droppedCount=f,g.totalAreaHa=b;const x=i.errors.length>0,w=i.warnings.length>0;g.status=x?"Failed":w?"Warnings":"Clean",g.warnings=i.warnings;const E=to(g,_);return i.torCompliance=E,r(7,`Pipeline complete. Status: ${g.status}`),{geojson:_,metadata:g,report:i}}let Z={step:1,file:null,geojson:null,prjText:null,opts:{},expectedLayer:null},ir=!1;function Go(){return ir}function Bo(t){t.preventDefault(),t.returnValue=""}function on(t={}){Z={step:1,file:null,geojson:null,prjText:null,opts:{},expectedLayer:t.expectedLayer||null},ir=!0,window.addEventListener("beforeunload",Bo),document.getElementById("upload-wizard-modal").classList.add("active");const a=document.getElementById("wizard-modal-close-btn");a&&(a.onclick=()=>Ds()),Na()}function Ds(){ir=!1,window.removeEventListener("beforeunload",Bo),document.getElementById("upload-wizard-modal").classList.remove("active")}function Na(){const t=document.getElementById("wizard-body"),e=document.getElementById("wizard-steps"),a=["File","Configure","Processing","Results"];switch(e.innerHTML=a.map((s,i)=>{const r=i+1;let o="";return r<Z.step&&(o="done"),r===Z.step&&(o="active"),`<div class="wizard-step ${o}">${r}. ${s}</div>`}).join(""),Z.step){case 1:pg(t);break;case 2:fg(t);break;case 3:gg(t);break;case 4:mg(t);break}}function og(t){const e=t.toLowerCase().split(".").pop();return e==="zip"?"shapefile":e==="kml"?"kml":e==="csv"?"csv":e==="geojson"||e==="json"?"geojson":null}async function lg(t){if(typeof globalThis.Buffer>"u"){const s=await Br(()=>import("./index-B2WcC-RY.js").then(i=>i.i),__vite__mapDeps([0,1]),import.meta.url);globalThis.Buffer=s.Buffer}const{default:e}=await Br(async()=>{const{default:s}=await import("./index-CAYd62CZ.js").then(i=>i.i);return{default:s}},__vite__mapDeps([2,1,0]),import.meta.url),a=await e(t);return Array.isArray(a)?a[0]:a}function cg(t){const a=new DOMParser().parseFromString(t,"text/xml");if(a.querySelector("parsererror"))throw new Error("Invalid KML: XML parsing failed");const i=[],r=a.querySelectorAll("Placemark");for(const o of r){const n={},l=o.querySelector("name");l&&(n.name=l.textContent.trim());const c=o.querySelector("description");c&&(n.notes=c.textContent.trim());const h=o.querySelectorAll("SimpleData");for(const p of h){const f=p.getAttribute("name");f&&(n[f]=p.textContent.trim())}const u=o.querySelectorAll("Data");for(const p of u){const f=p.getAttribute("name"),m=p.querySelector("value");f&&m&&(n[f]=m.textContent.trim())}const d=dg(o);d&&i.push({type:"Feature",properties:n,geometry:d})}return{type:"FeatureCollection",features:i}}function dg(t){const e=t.querySelector("Point");if(e){const r=Ue(e.querySelector("coordinates"));if(r.length>0)return{type:"Point",coordinates:r[0]}}const a=t.querySelector("LineString");if(a){const r=Ue(a.querySelector("coordinates"));if(r.length>0)return{type:"LineString",coordinates:r}}const s=t.querySelector("Polygon");if(s)return ln(s);const i=t.querySelector("MultiGeometry");if(i){const r=[];for(const o of i.children){const n=o.tagName;if(n==="Point"){const l=Ue(o.querySelector("coordinates"));l.length>0&&r.push({type:"Point",coordinates:l[0]})}else if(n==="LineString"){const l=Ue(o.querySelector("coordinates"));l.length>0&&r.push({type:"LineString",coordinates:l})}else if(n==="Polygon"){const l=ln(o);l&&r.push(l)}}return r.length===0?null:r.length===1?r[0]:{type:"GeometryCollection",geometries:r}}return null}function ln(t){const e=[],a=t.querySelector("outerBoundaryIs");if(a){const i=Ue(a.querySelector("coordinates"));i.length>0&&e.push(i)}const s=t.querySelectorAll("innerBoundaryIs");for(const i of s){const r=Ue(i.querySelector("coordinates"));r.length>0&&e.push(r)}return e.length===0?null:{type:"Polygon",coordinates:e}}function Ue(t){if(!t)return[];const e=t.textContent.trim();return e?e.split(/\s+/).map(a=>{const s=a.split(",").map(Number);return s.length>=2&&!isNaN(s[0])&&!isNaN(s[1])?s.length>=3?[s[0],s[1],s[2]]:[s[0],s[1]]:null}).filter(Boolean):[]}function hg(t){var c;const e=t.trim().split(/\r?\n/);if(e.length<2)throw new Error("CSV must have a header row and at least one data row");const a=cn(e[0]),s=a.map(h=>h.toLowerCase().trim()),i=["latitude","lat","y","lat_dd","latitude_dd","decimallatitude"],r=["longitude","lon","lng","long","x","lon_dd","longitude_dd","decimallongitude"],o=s.findIndex(h=>i.includes(h)),n=s.findIndex(h=>r.includes(h));if(o===-1||n===-1)throw new Error(`Could not detect latitude/longitude columns. Found headers: ${a.join(", ")}. Expected column names like: latitude/lat/y and longitude/lon/lng/x`);const l=[];for(let h=1;h<e.length;h++){if(!e[h].trim())continue;const u=cn(e[h]),d=parseFloat(u[o]),p=parseFloat(u[n]);if(isNaN(d)||isNaN(p))continue;const f={};for(let m=0;m<a.length;m++)m===o||m===n||(f[a[m].trim()]=((c=u[m])==null?void 0:c.trim())||"");l.push({type:"Feature",properties:f,geometry:{type:"Point",coordinates:[p,d]}})}if(l.length===0)throw new Error("No valid features found in CSV (no rows with valid lat/lon)");return{type:"FeatureCollection",features:l}}function cn(t){const e=[];let a="",s=!1;for(let i=0;i<t.length;i++){const r=t[i];s?r==='"'?i+1<t.length&&t[i+1]==='"'?(a+='"',i++):s=!1:a+=r:r==='"'?s=!0:r===","?(e.push(a),a=""):a+=r}return e.push(a),e}function ug(t){const e=JSON.parse(t);if(e.type==="FeatureCollection"&&Array.isArray(e.features))return e;if(e.type==="Feature"&&e.geometry)return{type:"FeatureCollection",features:[e]};if(e.type&&e.coordinates)return{type:"FeatureCollection",features:[{type:"Feature",properties:{},geometry:e}]};throw new Error("Invalid GeoJSON: must be a FeatureCollection, Feature, or Geometry object")}function pg(t){const e=Z.expectedLayer,a=e?`<div style="padding:10px 14px;background:var(--primary-lighter);border:1px solid var(--primary);border-radius:var(--radius-sm);margin-bottom:14px;font-size:13px">
         Uploading for: <strong>${re(e)}</strong> (${e.category} / ${e.target})
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
  `;const s=t.querySelector("#wizard-file-input"),i=t.querySelector("#wizard-next-1"),r=t.querySelector("#wizard-file-status");t.querySelector("#wizard-cancel-btn").addEventListener("click",()=>Ds()),s.addEventListener("change",async o=>{const n=o.target.files[0];if(!n)return;const l=og(n.name);if(!l){r.innerHTML='<p style="color:var(--danger)">Unsupported file format. Please upload .zip, .kml, .csv, .geojson, or .json</p>';return}r.innerHTML=`<p>Parsing ${l} file...</p>`,i.disabled=!0;try{let c;if(l==="shapefile"){const u=await n.arrayBuffer();c=await lg(u)}else{const u=await n.text();l==="kml"?c=cg(u):l==="csv"?c=hg(u):l==="geojson"&&(c=ug(u))}if(!c||!c.features||c.features.length===0){r.innerHTML='<p style="color:var(--danger)">No features found in file</p>';return}Z.file=n,Z.geojson=c,Z.opts.originalFilename=n.name,Z.prjText=null;const h=[...new Set(c.features.map(u=>{var d;return(d=u.geometry)==null?void 0:d.type}).filter(Boolean))];r.innerHTML=`
        <p style="color:var(--success)">Parsed successfully: ${c.features.length} features</p>
        <p style="font-size:12px;color:var(--text-light)">
          Format: ${l.toUpperCase()} | Geometry types: ${h.join(", ")}
        </p>
      `,i.disabled=!1}catch(c){r.innerHTML=`<p style="color:var(--danger)">Error parsing: ${_t(c.message)}</p>`}}),i.addEventListener("click",()=>{Z.step=2,Na()})}function fg(t){var c;const e=Z.expectedLayer,a=e?re(e):(Z.opts.originalFilename||"").replace(/\.(zip|kml|csv|geojson|json)$/i,""),s=e?e.category:hr[0],i=e?e.realm:((c=Y[s])==null?void 0:c.defaultRealm)||"terrestrial",r=e?e.target:null,o=e?e.countsToward30x30:!1;t.innerHTML=`
    ${e?`<div style="padding:10px 14px;background:var(--primary-lighter);border:1px solid var(--primary);border-radius:var(--radius-sm);margin-bottom:14px;font-size:13px">
      Uploading for: <strong>${re(e)}</strong> &mdash; fields have been pre-filled.
    </div>`:""}
    <div class="form-group">
      <label>Layer Name</label>
      <input type="text" id="wizard-name" value="${a}">
    </div>

    <div class="form-group">
      <label>Category</label>
      <select id="wizard-category">
        ${hr.map(h=>`<option value="${h}" ${h===s?"selected":""}>${Y[h].label}</option>`).join("")}
      </select>
    </div>

    <div class="form-group">
      <label>Targets</label>
      <div id="wizard-targets" class="target-checkboxes">
        ${Ut.targets.map(h=>{const u=r===h.code;return`
          <label class="target-checkbox ${u?"selected":""}" data-code="${h.code}">
            <input type="checkbox" value="${h.code}" ${u?"checked":""}>
            ${h.code}
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
  `;const n=t.querySelector("#wizard-category"),l=t.querySelector("#wizard-realm");n.addEventListener("change",()=>{const h=Y[n.value];h&&(l.value=h.defaultRealm)}),t.querySelectorAll("#wizard-targets .target-checkbox").forEach(h=>{h.addEventListener("click",u=>{u.preventDefault(),h.classList.toggle("selected");const d=h.querySelector("input");d.checked=!d.checked})}),t.querySelector("#wizard-back-2").addEventListener("click",()=>{Z.step=1,Na()}),t.querySelector("#wizard-next-2").addEventListener("click",async()=>{var d;const h=[...t.querySelectorAll("#wizard-targets input:checked")].map(p=>p.value);Z.opts.name=t.querySelector("#wizard-name").value||"Untitled",Z.opts.category=n.value,Z.opts.targets=h,Z.opts.realm=l.value,Z.opts.countsToward30x30=t.querySelector("#wizard-30x30").checked,Z.opts.isReference=t.querySelector("#wizard-reference").checked,Z.opts.prjText=Z.prjText;const u=$l(((d=Z.file)==null?void 0:d.name)||"",Z.opts.name,Z.opts.category);if(u.length>0){const p=u.map(m=>`  - "${m.metadata.name}" (${m.metadata.category}, uploaded ${new Date(m.metadata.uploadTimestamp).toLocaleDateString()})`).join(`
`);if(!await Xt(`A dataset with the same name or file already exists:

${p}

Uploading will replace the existing dataset.
Do you want to continue?`,{title:"Duplicate Dataset",okLabel:"Replace"}))return}Z.step=3,Na()})}function gg(t){t.innerHTML=`
    <p style="margin-bottom:10px;font-weight:600">Running auto-cleaning pipeline...</p>
    <div class="pipeline-log" id="pipeline-log"></div>
    <div id="pipeline-status" style="margin-top:10px"></div>
  `;const e=t.querySelector("#pipeline-log"),a=t.querySelector("#pipeline-status");function s(r,o=""){const n=document.createElement("div");n.className=`log-entry ${o}`,n.textContent=`[${new Date().toLocaleTimeString()}] ${r}`,e.appendChild(n),e.scrollTop=e.scrollHeight}const i=H();ng(Z.geojson,Z.opts,i.provincesGeojson,(r,o)=>s(`Step ${r}: ${o}`)).then(async r=>{Z.result=r;for(const l of r.report.warnings)s(`WARNING: ${l}`,"log-warn");for(const l of r.report.errors)s(`ERROR: ${l}`,"log-error");const o=Cl(r.metadata.originalFilename,r.metadata.category);if(o){s(`Replacing existing layer "${o.metadata.name}" (same file + category)`,"log-warn");try{await Ra(o.id),$s(o.id)}catch(l){s(`Warning: could not remove old layer: ${l.message}`,"log-warn")}}const n={id:r.metadata.id,metadata:r.metadata,geojson:r.geojson};await aa(n),Ze(n),await se({action:o?"replace":"upload",layer_id:r.metadata.id,replaced_layer_id:(o==null?void 0:o.id)||null,filename:r.metadata.originalFilename,targets:r.metadata.targets,category:r.metadata.category,result:r.metadata.status}),Z.expectedLayer&&(Il(Z.expectedLayer.id,r.metadata.id),await Nt("layerTracker",H().layerTracker),s(`Tracked as: ${re(Z.expectedLayer)}`)),a.innerHTML=`
      <p style="color:var(--success);font-weight:600">Pipeline complete. Status: ${r.metadata.status}</p>
      <button class="btn btn-primary" id="wizard-next-3" style="margin-top:10px">View Results</button>
    `,t.querySelector("#wizard-next-3").addEventListener("click",()=>{Z.step=4,Na()})}).catch(r=>{s(`FATAL: ${r.message}`,"log-error"),a.innerHTML=`
      <p style="color:var(--danger)">Pipeline failed: ${r.message}</p>
      <button class="btn btn-outline" id="wizard-error-close-btn">Close</button>
    `,t.querySelector("#wizard-error-close-btn").addEventListener("click",()=>Ds())})}function mg(t){const e=Z.result;if(!e){t.innerHTML="<p>No results</p>";return}const a=e.metadata,s=e.report.torCompliance||{compliant:!1,issues:[]};t.innerHTML=`
    <h4 style="margin-bottom:12px">${_t(a.name)}</h4>
    <table class="data-table" style="margin-bottom:16px">
      <tr><td><b>Category</b></td><td>${_t(a.category)}</td></tr>
      <tr><td><b>Targets</b></td><td>${_t(a.targets.join(", "))}</td></tr>
      <tr><td><b>Realm</b></td><td>${_t(a.realm)}</td></tr>
      <tr><td><b>Features</b></td><td>${a.featureCount}</td></tr>
      <tr><td><b>Area</b></td><td>${a.totalAreaHa.toFixed(2)} ha</td></tr>
      <tr><td><b>Fixed</b></td><td>${a.fixedCount} geometries</td></tr>
      <tr><td><b>Dropped</b></td><td>${a.droppedCount} geometries</td></tr>
      <tr><td><b>CRS</b></td><td>${_t(a.detectedCRS)}</td></tr>
      <tr><td><b>Status</b></td><td><span class="badge badge-${_t(a.status.toLowerCase())}">${_t(a.status)}</span></td></tr>
      <tr><td><b>30x30</b></td><td>${a.countsToward30x30?"Yes":"No"}</td></tr>
      <tr><td><b>Reference</b></td><td>${a.isReference?"Yes (visual only)":"No"}</td></tr>
    </table>

    <div class="card" style="margin-bottom:12px">
      <div class="card-header">TOR Compliance</div>
      <div class="card-body">
        ${s.compliant?'<p style="color:var(--success);font-weight:600">All checks passed</p>':s.issues.map(i=>`<p style="color:var(--warning);font-size:13px">- ${_t(i)}</p>`).join("")}
      </div>
    </div>

    ${a.warnings.length>0?`
      <div class="card" style="margin-bottom:12px">
        <div class="card-header">Warnings</div>
        <div class="card-body">
          ${a.warnings.map(i=>`<p style="color:var(--warning);font-size:12px">- ${_t(i)}</p>`).join("")}
        </div>
      </div>
    `:""}

    <div style="display:flex;justify-content:space-between;margin-top:16px">
      <button class="btn btn-outline" id="wizard-download-geojson">Download Cleaned GeoJSON</button>
      <button class="btn btn-primary" id="wizard-done">Done</button>
    </div>
  `,t.querySelector("#wizard-download-geojson").addEventListener("click",()=>{const i=JSON.stringify(e.geojson,null,2),r=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(r),n=document.createElement("a");n.href=o,n.download=`${a.name.replace(/\s+/g,"_")}_cleaned.geojson`,n.click(),URL.revokeObjectURL(o)}),t.querySelector("#wizard-done").addEventListener("click",()=>{Ds(),window.dispatchEvent(new CustomEvent("nbsap:refresh"))})}const vg={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1};function yg(){try{return vg&&"./"||"./"}catch{return"./"}}function bg(){Ct()&&$i(!0),Jt()}function Jt(){const t=document.getElementById("page-admin");Jl().isAuthenticated?_g(t):xg(t)}function xg(t){const e=yg();t.innerHTML=`
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
  `;const a=t.querySelector("#admin-passphrase"),s=t.querySelector("#btn-admin-login"),i=t.querySelector("#login-error"),r=t.querySelector("#login-error-text"),o=t.querySelector("#btn-toggle-pw"),n=o.querySelector(".icon-eye"),l=o.querySelector(".icon-eye-off");o.addEventListener("click",()=>{const h=a.type==="password";a.type=h?"text":"password",n.style.display=h?"none":"",l.style.display=h?"":"none",o.setAttribute("aria-label",h?"Hide passphrase":"Show passphrase")});const c=async()=>{s.disabled=!0,i.style.display="none";const h=await Kl(a.value);h.success?($i(!0),Jt(),Do(!0)):(r.textContent=h.error||"Login failed",i.style.display="",s.disabled=!1,a.focus())};s.addEventListener("click",c),a.addEventListener("keydown",h=>{h.key==="Enter"&&c()})}async function _g(t){t.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:center;min-height:300px;gap:12px;color:var(--text-secondary)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Loading admin dashboard…
    </div>`;let e,a;try{const d=(p,f)=>Promise.race([p,new Promise((m,g)=>setTimeout(()=>g(new Error("Request timed out")),f))]);[e,a]=await Promise.all([d(dr(),1e4).catch(()=>[]),d(ke("mergeHistory"),1e4).catch(()=>null)])}catch{e=[],a=null}a=a||{};const s=H(),i=s.layerTracker,r=Object.keys(i).length,o=de.length,n=Object.values(i).reduce((d,p)=>d+(Array.isArray(p)?p.length:0),0);t.innerHTML=`
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
          <span style="font-size:13px;color:var(--text-secondary)">${r} / ${o} layers &middot; ${n} file${n!==1?"s":""} uploaded</span>
        </div>
        <div class="card-body" style="padding:0">
          <div style="padding:12px 16px 8px;border-bottom:1px solid var(--border)">
            <div class="progress-bar-container" style="height:8px">
              <div class="progress-bar-fill terrestrial" style="width:${o>0?(r/o*100).toFixed(0):0}%;transition:width 0.3s"></div>
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
              ${de.map(d=>{const p=i[d.id]||[],f=p.length>0,m=Y[d.category]||{},g=p.map(v=>{var w;const y=s.layers.find(E=>E.id===v.layerId),_=((w=y==null?void 0:y.metadata)==null?void 0:w.originalFilename)||v.layerId,b=new Date(v.uploadedAt).toLocaleDateString(),x=_.length>22?_.slice(0,22)+"...":_;return`<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">
                    <span style="font-size:11px" title="${_}">${x}</span>
                    <span style="font-size:10px;color:var(--text-tertiary)">${b}</span>
                    <button class="btn btn-sm btn-ghost tracker-remove-one" data-expected-id="${d.id}" data-layer-id="${v.layerId}" title="Remove this file" style="padding:1px 4px;font-size:10px;color:var(--danger);min-width:0">&times;</button>
                  </div>`}).join("");return`
                  <tr>
                    <td>
                      ${f?`<span class="badge badge-success">${p.length} file${p.length!==1?"s":""}</span>`:'<span class="badge" style="background:var(--warning-light);color:var(--warning)">Pending</span>'}
                    </td>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <span style="width:4px;height:24px;border-radius:2px;background:${m.color||"#95a5a6"};flex-shrink:0"></span>
                        <div>
                          <strong class="layer-name-editable" data-expected-id="${d.id}" style="font-size:13px;cursor:pointer;border-bottom:1px dashed var(--text-tertiary)" title="Click to rename">${re(d)}</strong>
                          <div style="font-size:11px;color:var(--text-tertiary)">${d.description}</div>
                        </div>
                      </div>
                    </td>
                    <td style="font-size:12px">${m.label||d.category}</td>
                    <td><span class="badge badge-info">${d.target}</span></td>
                    <td style="text-transform:capitalize;font-size:12px">${d.realm}</td>
                    <td style="font-size:12px;color:var(--text-secondary)">
                      ${f?g:'<span style="color:var(--text-tertiary)">--</span>'}
                    </td>
                    <td>
                      <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center">
                        <button class="btn btn-sm btn-primary tracker-upload" data-expected-id="${d.id}">
                          ${f?"Add More":"Upload"}
                        </button>
                        ${f&&p.length>=2?`<button class="btn btn-sm btn-secondary tracker-merge" data-expected-id="${d.id}" title="Merge all uploaded files into one combined dataset">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:3px"><path d="M8 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M16 6h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"/><line x1="12" y1="3" x2="12" y2="21"/></svg>Merge</button>`:""}
                        ${a[d.id]?`<button class="btn btn-sm btn-outline tracker-undo-merge" data-expected-id="${d.id}" title="Undo merge — restores the original separate files" style="border-color:var(--warning);color:var(--warning)">&#8617; Undo</button>`:""}
                        ${f?`<button class="btn btn-sm btn-danger tracker-remove-all" data-expected-id="${d.id}" title="Remove all files for this layer">Clear</button>`:""}
                      </div>
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
            <button class="btn btn-outline" id="btn-recover-cache" title="Recover datasets from this browser's local cache (IndexedDB)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
              Recover from Cache
            </button>
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
                      <td>${(d.targets||[]).map(p=>`<span class="badge badge-info" style="margin-right:2px">${p}</span>`).join("")}</td>
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
  `;const l=t.querySelector("#admin-session-time");if(l){const d=new Date;l.textContent=d.toLocaleString([],{dateStyle:"medium",timeStyle:"short"})}const c=Date.now(),h=t.querySelector("#session-elapsed-text"),u=t.querySelector("#admin-session-elapsed");if(h){const d=()=>{if(!document.getElementById("session-elapsed-text"))return;const p=Math.floor((Date.now()-c)/1e3),f=Math.floor(p/60),m=p%60;h.textContent=`${f}:${String(m).padStart(2,"0")}`,p>14400&&u&&u.classList.add("warning"),setTimeout(d,1e3)};d()}t.querySelector("#btn-admin-logout").addEventListener("click",()=>{Yl(),$i(!1),Jt(),Do(!1)}),t.querySelector("#btn-admin-upload").addEventListener("click",()=>on()),t.querySelectorAll(".tracker-upload").forEach(d=>{d.addEventListener("click",()=>{const p=d.dataset.expectedId,f=de.find(m=>m.id===p);f&&on({expectedLayer:f})})}),t.querySelectorAll(".tracker-remove-one").forEach(d=>{d.addEventListener("click",async()=>{var g;const p=d.dataset.expectedId,f=d.dataset.layerId;fr(p,f),await Nt("layerTracker",H().layerTracker);const m=await ke("mergeHistory")||{};((g=m[p])==null?void 0:g.mergedLayerId)===f&&(delete m[p],await Nt("mergeHistory",m)),Jt()})}),t.querySelectorAll(".layer-name-editable").forEach(d=>{d.addEventListener("click",p=>{p.stopPropagation();const f=d.dataset.expectedId,m=de.find(b=>b.id===f);if(!m)return;const g=re(m),v=document.createElement("input");v.type="text",v.value=g,v.style.cssText="font-size:13px;font-weight:600;padding:2px 6px;border:2px solid var(--primary);border-radius:4px;outline:none;width:100%;box-sizing:border-box",d.parentNode.replaceChild(v,d),v.focus(),v.select();const _=async()=>{const b=v.value.trim();if(b&&b!==m.name)Ll(f,b),await Nt("customLayerNames",H().customLayerNames);else if(b===m.name){const x=H();delete x.customLayerNames[f],await Nt("customLayerNames",x.customLayerNames)}Jt()};v.addEventListener("blur",_),v.addEventListener("keydown",b=>{b.key==="Enter"&&(b.preventDefault(),v.blur()),b.key==="Escape"&&(v.value=g,v.blur())})})}),t.querySelectorAll(".tracker-remove-all").forEach(d=>{d.addEventListener("click",async()=>{const p=d.dataset.expectedId,f=de.find(v=>v.id===p),m=f?re(f):p;if(!await Xt(`Remove all uploaded files for "${m}"? The files remain in storage but won't appear on the dashboard.`,{title:"Remove Files",okLabel:"Remove",danger:!0}))return;fr(p,null),await Nt("layerTracker",H().layerTracker);const g=await ke("mergeHistory")||{};g[p]&&(delete g[p],await Nt("mergeHistory",g)),Jt()})}),t.querySelectorAll(".tracker-merge").forEach(d=>{d.addEventListener("click",async()=>{await wg(d.dataset.expectedId,t)})}),t.querySelectorAll(".tracker-undo-merge").forEach(d=>{d.addEventListener("click",async()=>{await Mg(d.dataset.expectedId,t)})}),t.querySelector("#btn-export-backup").addEventListener("click",async()=>{const d=t.querySelector("#backup-status");d.textContent="Exporting...";try{const p=await bl(),f=JSON.stringify(p,null,2),m=new Blob([f],{type:"application/json"}),g=URL.createObjectURL(m),v=document.createElement("a");v.href=g,v.download=`nbsap-backup-${new Date().toISOString().slice(0,10)}.json`,v.click(),URL.revokeObjectURL(g),await se({action:"export_backup",result:"success"}),d.textContent="Backup exported successfully"}catch(p){d.textContent=`Error: ${p.message}`}}),t.querySelector("#btn-sync-import").addEventListener("change",async d=>{const p=d.target.files[0];if(!p)return;const f=t.querySelector("#backup-status");f.textContent="Syncing...";try{const m=await p.text(),g=JSON.parse(m),v=await _l(g);await se({action:"sync_import",result:"success",notes:`${v.added} added, ${v.updated} updated, ${v.skippedAudit} audit entries skipped`}),f.textContent=`Sync complete: ${v.added} new layers, ${v.updated} updated.`,window.dispatchEvent(new CustomEvent("nbsap:refresh"))}catch(m){f.textContent=`Sync failed: ${m.message}`}d.target.value=""}),t.querySelector("#btn-import-backup").addEventListener("change",async d=>{const p=d.target.files[0];if(!p)return;if(!await Xt("Full Restore will clear ALL existing data and replace it with the backup. Continue?",{title:"Full Restore",okLabel:"Restore",danger:!0})){d.target.value="";return}const f=t.querySelector("#backup-status");f.textContent="Restoring...";try{const m=await p.text(),g=JSON.parse(m),v=await xl(g);await se({action:"import_backup",result:"success",notes:`${v.layersImported} layers imported`}),f.textContent=`Restored ${v.layersImported} layers.`,window.dispatchEvent(new CustomEvent("nbsap:refresh"))}catch(m){f.textContent=`Restore failed: ${m.message}`}d.target.value=""}),t.querySelector("#btn-recover-cache").addEventListener("click",async()=>{var v;const d=t.querySelector("#backup-status");d.textContent="Scanning local cache...";let p;try{p=await Sl()}catch(y){d.textContent=`Cache unavailable: ${y.message}`;return}if(p.length===0){d.textContent="No datasets found in local cache.";return}const f=`Found ${p.length} dataset(s) in your browser cache:

`+p.map(y=>{var _;return`• ${((_=y.metadata)==null?void 0:_.name)||y.id}`}).join(`
`)+`

Restore these to Firestore?`;if(!await Xt(f,{title:"Recover from Cache",okLabel:"Restore",danger:!1})){d.textContent="Recovery cancelled.";return}d.textContent="Restoring...";let m=0,g=0;for(const y of p)try{await aa(y),await se({action:"cache_recovery",layer_id:y.id,filename:((v=y.metadata)==null?void 0:v.originalFilename)||y.id,result:"success"}),m++}catch(_){console.error(`Failed to restore layer ${y.id}:`,_),g++}d.textContent=`Restored ${m} dataset(s)${g>0?`, ${g} failed`:""}.`,window.dispatchEvent(new CustomEvent("nbsap:refresh"))}),t.querySelector("#btn-export-audit").addEventListener("click",async()=>{const d=await dr(),p=[["Timestamp","Action","Layer ID","Filename","Category","Targets","Result"]];for(const y of d)p.push([y.timestamp||"",y.action||"",y.layer_id||"",y.filename||"",y.category||"",(y.targets||[]).join(";"),y.result||""]);const f=p.map(y=>y.map(_=>`"${String(_).replace(/"/g,'""')}"`).join(",")).join(`
`),m=new Blob([f],{type:"text/csv"}),g=URL.createObjectURL(m),v=document.createElement("a");v.href=g,v.download="audit-log.csv",v.click(),URL.revokeObjectURL(g)})}async function wg(t,e){var c,h,u;const a=H(),s=a.layerTracker[t]||[];if(s.length<2)return;const i=de.find(d=>d.id===t),r=i?re(i):t,n=s.map(d=>{var f;const p=a.layers.find(m=>m.id===d.layerId);return((f=p==null?void 0:p.metadata)==null?void 0:f.originalFilename)||d.layerId}).map(d=>`• ${d}`).join(`
`);if(!await Xt(`Merge ${s.length} files into one combined dataset for “${r}”?

${n}

All features will be combined into a single layer. You can undo this action.`,{title:"Merge Datasets",okLabel:"Merge"}))return;const l=e.querySelector(`.tracker-merge[data-expected-id="${t}"]`);l&&(l.disabled=!0,l.textContent="Merging…");try{const d=await Promise.all(s.map(async b=>{const x=a.layers.find(w=>w.id===b.layerId);return x!=null&&x.geojson?x:await Aa(b.layerId)})),p=[];let f=0;for(const b of d)(c=b==null?void 0:b.geojson)!=null&&c.features&&(p.push(...b.geojson.features),f+=((h=b.metadata)==null?void 0:h.totalAreaHa)||0);if(p.length===0)throw new Error("No features found in selected layers. Cannot merge.");const m=crypto.randomUUID(),g=((u=d.find(b=>b==null?void 0:b.metadata))==null?void 0:u.metadata)||{},v={...g,id:m,name:`${r} (merged)`,originalFilename:"(merged)",featureCount:p.length,totalAreaHa:Math.round(f*100)/100,uploadTimestamp:new Date().toISOString(),uploadedBy:"admin",category:(i==null?void 0:i.category)||g.category,targets:i?[i.target]:g.targets,realm:(i==null?void 0:i.realm)||g.realm,mergedFrom:s.map(b=>b.layerId),_mergedSourceCount:s.length},y={id:m,metadata:v,geojson:{type:"FeatureCollection",features:p}};await aa(y),Ze(y);const _=await ke("mergeHistory")||{};_[t]={mergedLayerId:m,originalEntries:[...s],mergedAt:new Date().toISOString()},await Nt("mergeHistory",_),Ts({...H().layerTracker,[t]:[{layerId:m,uploadedAt:new Date().toISOString()}]}),await Nt("layerTracker",H().layerTracker),await se({action:"merge",layer_id:m,filename:v.name,category:v.category,targets:v.targets,result:"success",notes:`Merged ${s.length} layers (${p.length} total features)`}),Jt()}catch(d){console.error("Merge failed:",d),l&&(l.disabled=!1,l.textContent="Merge"),alert(`Merge failed: ${d.message}`)}}async function Mg(t,e){const a=await ke("mergeHistory")||{},s=a[t];if(!s)return;const{mergedLayerId:i,originalEntries:r}=s,o=de.find(c=>c.id===t),n=o?re(o):t;if(!await Xt(`Undo merge for “${n}”?

The merged dataset will be deleted and the ${r.length} original files will be restored.`,{title:"Undo Merge",okLabel:"Undo Merge"}))return;const l=e.querySelector(`.tracker-undo-merge[data-expected-id="${t}"]`);l&&(l.disabled=!0,l.textContent="Undoing…");try{await Ra(i),$s(i),Ts({...H().layerTracker,[t]:r}),await Nt("layerTracker",H().layerTracker),delete a[t],await Nt("mergeHistory",a),await se({action:"undo_merge",layer_id:i,result:"success",notes:`Restored ${r.length} original layers for "${n}"`}),Jt()}catch(c){console.error("Undo merge failed:",c),l&&(l.disabled=!1,l.textContent="↵ Undo"),alert(`Undo failed: ${c.message}`)}}function Do(t){const e=document.getElementById("auth-badge");if(e){const a=e.querySelector("span");t?(a&&(a.textContent="Admin"),e.classList.add("admin")):(a&&(a.textContent="Public"),e.classList.remove("admin"))}}const Sg={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1};function Eg(){try{return Sg&&"./"||"./"}catch{return"./"}}function Ag(){const t=document.getElementById("page-about"),e=Eg();t.innerHTML=`
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
      <p style="font-size:13px;color:var(--text-secondary);margin:-4px 0 12px">
        Vanuatu tracks 9 of the 23 Kunming-Montreal GBF 2030 Targets, spanning two of the three GBF goal areas.
        Targets are grouped below by their official GBF category.
      </p>
      <table class="about-targets-table">
        <thead>
          <tr>
            <th style="width:52px">Target</th>
            <th style="width:200px">Name</th>
            <th>GBF Objective &amp; Vanuatu Implementation</th>
            <th>Primary Layers</th>
          </tr>
        </thead>
        <tbody>
          <!-- ── Category A: Reducing Threats to Biodiversity (T1–T8) ── -->
          <tr>
            <td colspan="4" style="background:var(--surface-2);padding:6px 10px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary)">
              A &mdash; Reducing Threats to Biodiversity
            </td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#1565C0">T1</span></td>
            <td><strong>Biodiversity Spatial Planning</strong></td>
            <td>Plan and manage all areas through participatory spatial planning to reduce biodiversity loss from land and sea-use change. Vanuatu tracks % of land and sea area covered by biodiversity-inclusive spatial plans.</td>
            <td class="spec-layers">Spatial Plans, KBAs, MPAs, LMMAs, CCAs, Inland Water</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#D84315">T2</span></td>
            <td><strong>Ecosystem Restoration</strong></td>
            <td>Restore at least 30% of degraded terrestrial, freshwater, marine and coastal ecosystems by 2030. Vanuatu maps degraded areas and active restoration sites to track progress toward this goal.</td>
            <td class="spec-layers">Degraded Terrestrial, Degraded Marine/Coastal, Restoration Sites</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#2E7D32">T3</span></td>
            <td><strong>30×30 Conservation</strong></td>
            <td>Conserve and effectively manage ≥30% of terrestrial, inland water, and marine areas by 2030 through protected areas and OECMs. Primary dashboard target. Baselines: 1,219,000 ha terrestrial / 66,300,000 ha marine.</td>
            <td class="spec-layers">CCAs, MPAs, LMMAs, Protected Areas (WDPA), OECMs</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#7E57C2">T4</span></td>
            <td><strong>Species Recovery &amp; Biodiversity</strong></td>
            <td>Halt human-induced species extinction and support recovery of threatened species while maintaining genetic diversity. Vanuatu maps distribution of 6 significant endemic and threatened species and Key Biodiversity Areas.</td>
            <td class="spec-layers">Significant Species Distribution, Key Biodiversity Areas</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#C62828">T6</span></td>
            <td><strong>Invasive Alien Species</strong></td>
            <td>Reduce IAS introductions by at least 50% and minimize their ecological impacts on ecosystems and species. Vanuatu maps coverage and distribution of key IAS: <em>Merremia peltata</em>, Fire Ants, African Snail, Crown-of-Thorns, Mile-a-Minute, Sako, Coconut Beetle.</td>
            <td class="spec-layers">Merremia peltata Detection, Other IAS</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#8E24AA">T7</span></td>
            <td><strong>Pollution Reduction</strong></td>
            <td>Reduce pollution from all sources to levels not harmful to biodiversity, including halving excess nutrients and pesticide risks. Vanuatu maps pesticide and herbicide use in large-scale and small-scale commercial farming.</td>
            <td class="spec-layers">Pesticide &amp; Herbicide Use Areas</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#00838F">T8</span></td>
            <td><strong>Climate &amp; Ocean Impacts</strong></td>
            <td>Minimize climate change and ocean acidification impacts on biodiversity through mitigation, adaptation and nature-based solutions. Vanuatu maps coastal eutrophication and nutrient-impacted marine zones as indicators of cumulative environmental pressures.</td>
            <td class="spec-layers">Coastal Eutrophication Zones</td>
          </tr>
          <!-- ── Category B: Meeting People's Needs (T9–T13) ── -->
          <tr>
            <td colspan="4" style="background:var(--surface-2);padding:6px 10px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary)">
              B &mdash; Meeting People&rsquo;s Needs through Sustainable Use and Benefit-Sharing
            </td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#795548">T10</span></td>
            <td><strong>Sustainable Land Use</strong></td>
            <td>Implement sustainable biodiversity-compatible management practices across agriculture, aquaculture, fisheries and forestry. Vanuatu maps land cover change to track ecosystem conversion and promote biodiversity-compatible production.</td>
            <td class="spec-layers">Land Cover / Land Use Change</td>
          </tr>
          <tr>
            <td><span class="about-target-badge" style="background:#388E3C">T12</span></td>
            <td><strong>Urban Green &amp; Blue Spaces</strong></td>
            <td>Increase and enhance urban and peri-urban green and blue spaces to improve biodiversity, ecological connectivity, and human well-being. Vanuatu maps parks, botanical gardens and coastal blue spaces across provincial and municipal areas.</td>
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
          <a href="mailto:vanua.spatialsolutions@gmail.com" class="contact-card-email">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            vanua.spatialsolutions@gmail.com
          </a>
          <div style="font-size:11px;color:var(--text-tertiary);margin-top:4px">For portal bugs, data issues, or feature requests</div>
        </div>
      </div>

      <div class="about-section-divider"></div>

      <!-- ── Links & Resources ──────────────────────────────── -->
      <h3>Links &amp; Resources</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px">
        ${[["CBD GBF Targets","https://www.cbd.int/gbf/targets/"],["Key Biodiversity Areas","https://www.keybiodiversityareas.org/"],["Vanuatu DEPC","https://depc.gov.vu/"]].map(([a,s])=>`
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
  `}const kg={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1};delete D.Icon.Default.prototype._getIconUrl;D.Icon.Default.mergeOptions({iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"});let cs="dashboard",Es=!1;function Fo(){try{return kg&&"./"||"./"}catch{return"./"}}async function Pg(){bd(),Cd(),bg(),Ag(),window.__nbsapLoaded=!0,Gg();let t=null;window.addEventListener("nbsap:refresh",()=>{t&&clearTimeout(t),t=setTimeout(async()=>{if(t=null,Es){const a=H().filters.targets;a.length>0&&En(a)&&(yi(`Loading data for ${a.join(", ")}...`),await sa(a),bi())}cs==="dashboard"?Rs():Md(),cs==="portal"&&Vi(),cs==="admin"&&!Go()&&Jt(),Bg()},150)}),Oo("dashboard"),await Cg(),$g()}function yi(t){let e=document.getElementById("nbsap-loading-status");e||(e=document.createElement("div"),e.id="nbsap-loading-status",e.style.cssText=`
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
  `,e.style.display="flex"}function bi(){const t=document.getElementById("nbsap-loading-status");t&&(t.style.display="none")}async function Cg(){const t=Fo();yi("Loading data from Firestore...");try{const i=await fetch(`${t}data/provinces.geojson`);if(i.ok){const r=await i.json();Tl(r)}}catch(i){console.warn("Failed to load provinces data:",i)}try{const i=await pa(ke("layerTracker"),1e4);i&&Ts(i)}catch(i){console.warn("Failed to load layer tracker:",i)}try{const i=await pa(ke("customLayerNames"),1e4);i&&_n(i)}catch(i){console.warn("Failed to load custom layer names:",i)}let e=!1;try{const i=await pa(vl(),15e3),r=i.filter(n=>!Xs(n)),o=i.filter(n=>Xs(n));if(r.length>0){const n=pr(r);console.log(`Loaded metadata for ${r.length} layers from Firestore (excluded ${o.length} demo layers)`),e=!0,n.length>0&&(console.warn(`Removing ${n.length} duplicate layer(s) from Firestore`),Ng(n)),o.length>0&&(console.log(`Removing ${o.length} seed/demo layer(s) from Firestore (real data present)`),Ig(o))}else if(i.length>0){const n=await pa(ml(),6e4);pr(n.filter(l=>Xs(l))),e=!0}else try{const n=await pa(yl(),1e4);n>0?(console.warn(`Firestore has ${n} layer docs but metadata failed to load. Real-time listener will retry.`),e=!0):(await Qs(t),e=!0)}catch{await Qs(t),e=!0}}catch(i){console.warn("Failed to load stored layers:",i);try{await Qs(t)}catch(r){console.warn("Failed to load demo data:",r)}}e&&Nl()&&(console.log("Cleaned stale tracker entries for previously deleted layers"),Nt("layerTracker",H().layerTracker).catch(i=>console.warn("Failed to persist cleaned tracker:",i))),bi(),Es=!0;const s=H().filters.targets;s.length>0&&En(s)&&(yi(`Loading GeoJSON for ${s.join(", ")}...`),await sa(s),bi()),Rs(),Vi()}function $g(){let t=!0;wl(async e=>{if(!Es||!(e.added.length>0||e.modified.length>0||e.removed.length>0))return;const s=H(),i=new Set(s.layers.map(o=>o.id)),r=[];for(const o of[...e.added,...e.modified])t&&i.has(o)||r.push(o);if(t=!1,!(r.length===0&&e.removed.length===0)){if(r.length>0){const o=await Promise.allSettled(r.map(async n=>{const l=await Aa(n);return l&&Ze(l),n}));for(const n of o)n.status==="rejected"&&console.warn("Failed to load layer via real-time sync:",n.reason)}for(const o of e.removed)$s(o);(r.length>0||e.removed.length>0)&&Tg({added:r.filter(o=>e.added.includes(o)),modified:r.filter(o=>e.modified.includes(o)),removed:e.removed})}}),Ml(async e=>{if(!Es)return;let a=!1;if(e.layerTracker){Ts(e.layerTracker),a=!0;const s=H(),i=new Set(s.layers.map(o=>o.id)),r=[];for(const o of Object.values(s.layerTracker))for(const n of o)i.has(n.layerId)||r.push(n.layerId);r.length>0&&await Promise.allSettled(r.map(async o=>{const n=await Aa(o);n&&Ze(n)}))}e.customLayerNames&&(_n(e.customLayerNames),a=!0),a&&window.dispatchEvent(new CustomEvent("nbsap:refresh"))})}function Tg(t){if(t.added.length+t.modified.length+t.removed.length===0)return;const a=[];t.added.length>0&&a.push(`${t.added.length} added`),t.modified.length>0&&a.push(`${t.modified.length} updated`),t.removed.length>0&&a.push(`${t.removed.length} removed`);const s=`Synced: ${a.join(", ")}`;let i=document.getElementById("sync-toast");i||(i=document.createElement("div"),i.id="sync-toast",i.style.cssText=`
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
  `,requestAnimationFrame(()=>{i.style.opacity="1",i.style.transform="translateY(0)"}),setTimeout(()=>{i.style.opacity="0",i.style.transform="translateY(10px)"},3e3)}function pa(t,e){return Promise.race([t,new Promise((a,s)=>setTimeout(()=>s(new Error("Operation timed out")),e))])}const Lg=new Set(["demo_cca.geojson","demo_mpa.geojson","vut_invasive_merremia_efate_2026_v1.geojson"]);function Xs(t){const e=t.metadata;return e?!!(e._isDemo||e.uploadedBy==="system"||Lg.has(e.originalFilename)):!1}function Ig(t){for(const e of t)Ra(e.id).then(()=>{var a;console.log(`Cleaned up old demo layer from Firestore: ${((a=e.metadata)==null?void 0:a.name)||e.id}`)}).catch(a=>{console.warn(`Failed to clean up demo layer ${e.id}:`,a)})}function Ng(t){for(const e of t)Ra(e).then(()=>{console.log(`Removed duplicate layer from Firestore: ${e}`)}).catch(a=>{console.warn(`Failed to remove duplicate layer ${e}:`,a)})}async function Qs(t){t||(t=Fo());const e=[{file:"demo_cca.geojson",name:"Community Conserved Areas (CCA)",category:"CCA",realm:"terrestrial",targets:["T3"],countsToward30x30:!0,description:"Community-managed conservation areas across Vanuatu including Vatthe, Loru Rainforest, Nagha mo Pineia, and others",custodianAgency:"DEPC Vanuatu",dataSource:"Field",geographicCoverage:"National",accessClassification:"Public"},{file:"demo_mpa.geojson",name:"Marine Protected Areas (MPA)",category:"MPA",realm:"marine",targets:["T3"],countsToward30x30:!0,description:"Nationally designated marine protected areas including Aore Island, Hideaway Island, Nguna-Pele, Maskelyne Islands, and Aneityum",custodianAgency:"DEPC Vanuatu",dataSource:"Field",geographicCoverage:"National + Marine",accessClassification:"Public"}];for(const a of e)try{const s=await fetch(`${t}data/${a.file}`);if(!s.ok)continue;const i=await s.json(),r=ki(i),o=fs({name:a.name,originalFilename:a.file,category:a.category,targets:a.targets,realm:a.realm,countsToward30x30:a.countsToward30x30,detectedCRS:"EPSG:4326",featureCount:r.features.length,validGeometryCount:r.features.length,totalAreaHa:r.features.reduce((l,c)=>l+(c.properties.area_ha||0),0),status:"Clean",uploadedBy:"system",description:a.description,custodianAgency:a.custodianAgency,dataSource:a.dataSource,geographicCoverage:a.geographicCoverage,accessClassification:a.accessClassification,dateCreated:"2026-03-16"});o._isDemo=!0;const n={id:o.id,metadata:o,geojson:r};Ze(n),await aa(n).catch(l=>console.warn(`Failed to persist seed layer ${a.name}:`,l))}catch(s){console.warn(`Failed to load seed data ${a.name}:`,s)}try{await Rg(t)}catch(a){console.warn("Failed to load invasive species seed data:",a)}}async function Rg(){const e=ki({features:[{type:"Feature",geometry:{type:"Point",coordinates:[168.3273,-17.7333]},properties:{name:"Merremia - Mele Bay",type:"MERREMIA",realm:"terrestrial",province:"Shefa",year:2026,status:"Not controlled",source:"DEPC Field Survey 2026",notes:"Dense coverage along coastal area, threatening native vegetation",targets:["T6"],species:"Merremia peltata",coverage_category:"Dense (>50%)",affected_area_sqm:2500,threat_level:"High"}},{type:"Feature",geometry:{type:"Point",coordinates:[168.2947,-17.7184]},properties:{name:"Merremia - Port Vila Harbor",type:"MERREMIA",realm:"terrestrial",province:"Shefa",year:2026,status:"Under monitoring",source:"DEPC Field Survey 2026",notes:"Urban area invasion, manual removal planned",targets:["T6"],species:"Merremia peltata",coverage_category:"Moderate (10-50%)",affected_area_sqm:1200,threat_level:"Medium"}},{type:"Feature",geometry:{type:"Point",coordinates:[168.3512,-17.6891]},properties:{name:"Merremia - Erakor Village",type:"MERREMIA",realm:"terrestrial",province:"Shefa",year:2026,status:"Controlled",source:"DEPC Field Survey 2026",notes:"Recently cleared area, monitoring for regrowth",targets:["T6"],species:"Merremia peltata",coverage_category:"Sparse (<10%)",affected_area_sqm:450,threat_level:"Low"}}]}),a=fs({name:"Merremia peltata (Big Leaf) - Efate",originalFilename:"vut_invasive_merremia_efate_2026_v1.geojson",category:"MERREMIA",targets:["T6"],realm:"terrestrial",countsToward30x30:!1,detectedCRS:"EPSG:4326",featureCount:e.features.length,validGeometryCount:e.features.length,totalAreaHa:e.features.reduce((i,r)=>i+(r.properties.area_ha||0),0),status:"Clean",uploadedBy:"system",description:"Remote sensing and field survey detections of Merremia peltata invasive vine coverage on Efate Island",custodianAgency:"DEPC Vanuatu",dataSource:"Field",geographicCoverage:"Provincial",accessClassification:"Public",dateCreated:"2026-02-10"});a._isDemo=!0;const s={id:a.id,metadata:a,geojson:e};Ze(s),await aa(s).catch(i=>console.warn("Failed to persist invasive species layer:",i))}function Gg(){document.querySelectorAll(".nav-tab").forEach(t=>{t.addEventListener("click",()=>{Oo(t.dataset.tab)})})}function Oo(t){cs=t,document.querySelectorAll(".nav-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===t)}),document.querySelectorAll(".page").forEach(e=>{e.classList.toggle("active",e.id===`page-${t}`)}),t==="dashboard"&&Sd(),t==="portal"&&Vi(),t==="admin"&&!Go()&&Jt()}function Bg(){const t=document.getElementById("auth-badge");if(t){const e=t.querySelector("span");Ct()?(e&&(e.textContent="Admin"),t.classList.add("admin")):(e&&(e.textContent="Public"),t.classList.remove("admin"))}}document.body.addEventListener("click",t=>{const e=t.target.closest(".btn");if(!e||e.disabled)return;const a=e.getBoundingClientRect(),s=Math.max(a.width,a.height),i=document.createElement("span");i.className="btn-ripple-wave",i.style.cssText=`width:${s}px;height:${s}px;left:${t.clientX-a.left-s/2}px;top:${t.clientY-a.top-s/2}px`,e.appendChild(i),i.addEventListener("animationend",()=>i.remove(),{once:!0})},!0);Pg().catch(t=>{console.error("App initialization failed:",t);const e=document.getElementById("page-dashboard");e&&(e.innerHTML=`<div style="padding:40px;max-width:600px;margin:0 auto">
      <h2 style="color:#065f46;margin-bottom:12px">Failed to initialize</h2>
      <p style="color:#64748b;font-size:14px">${t.message}</p>
    </div>`)});export{zg as l};
