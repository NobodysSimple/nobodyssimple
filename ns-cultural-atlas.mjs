/* Nobody's Simple · Cultural Psychology World Atlas
 * 258 mapped countries/territories via simplified Natural Earth features.
 * Admin1 regions load on demand via geoBoundaries gbOpen (attribution in UI).
 * Lessons are sourced, non-diagnostic editorial reflections; no national trait claims.
 */
import {escapeHTML as esc} from './core.mjs';
import {CULTURE_ARTICLES,articlesForCountry,articleCountries,articleById} from './ns-cultural-atlas-articles.mjs';
import {CULTURE_INVESTIGATIONS} from './ns-cultural-atlas-investigations.mjs';
import {SOUTH_ASIA_STORIES} from './ns-cultural-atlas-south-asia.mjs';
import {SOUTHEAST_ASIA_STORIES} from './ns-cultural-atlas-southeast-asia.mjs';
import {NORTH_AMERICA_STORIES} from './ns-cultural-atlas-north-america.mjs';
import {bindAtlasViewport,fitAtlasBounds,clampAtlasView,WORLD_VIEW} from './ns-cultural-atlas-viewport.mjs';
import {fetchAdministrativeLayer,fetchUSCounties,fetchUSIndigenousAreas,searchMapPlaces,filterAdministrativeChildren,mapDegreesToAtlas} from './ns-cultural-atlas-geography.mjs';

export const WORLD_COUNTRY_DATA='data/culture-world-countries.geojson';
export const SUBDIVISION_API='https://www.geoboundaries.org/api/current/gbOpen/';
export const WORLD_MAP_BOUNDS='0 0 960 480';
const e=value=>esc(String(value??''));
const cultureImageCache=new Map();
const commonsText=value=>{
 const raw=String(value||'');
 if(typeof DOMParser==='undefined')return raw.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
 return new DOMParser().parseFromString(raw,'text/html').body.textContent.replace(/\s+/g,' ').trim();
};
const commonsLicenseAllowed=(name,url)=>{
 const label=String(name||'').trim();
 if(/^(?:CC0|Public domain|PD(?:[-\s]|$))/i.test(label))return true;
 if(!/^(?:CC BY(?:-SA)?\s|Creative Commons Attribution(?:-Share Alike)?\s)/i.test(label))return false;
 return /^https:\/\/creativecommons\.org\/licenses\/(?:by|by-sa)\/[0-9.]+\/?$/i.test(String(url||''));
};
const WIKIPEDIA_PAGE_OVERRIDES={'henna-rituals':'Henna','uae-henna':'Henna'};
const WIKIPEDIA_STOPWORDS=new Set('the a an and of in for to with how what when whose who is are by from across more one into different story memory identity meaning psychology psychological event ritual social shared tradition traditions culture cultural practice practices community communities festival dance song music art craft skill belonging relationship connection place world life process making learned learning built made held work'.split(' '));
const wikipediaSearchTerm=article=>{
 const override=WIKIPEDIA_PAGE_OVERRIDES[article.id];
 if(override)return override;
 return String(article.title||'').split(/[:–—]/)[0].trim().replace(/^(?:the|a|an)\s+/i,'');
};
const wikipediaTopicTokens=article=>wikipediaSearchTerm(article).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(word=>word.length>2&&!WIKIPEDIA_STOPWORDS.has(word));
const wikipediaLeadPage=async article=>{
 const topic=wikipediaSearchTerm(article);
 if(!topic)return null;
 const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:topic,gsrnamespace:'0',gsrlimit:'10',prop:'pageimages',piprop:'name',pilicense:'free',format:'json',origin:'*'});
 try{
  const response=await fetch('https://en.wikipedia.org/w/api.php?'+params.toString(),{headers:{Accept:'application/json'}});
  if(!response.ok)return null;
  const data=await response.json();
  const tokens=wikipediaTopicTokens(article);
  const pages=Object.values(data?.query?.pages||{}).sort((a,b)=>(a.index||0)-(b.index||0));
  for(const page of pages){
   const title=String(page.title||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
   const titleTokens=new Set(title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(Boolean));
   const matched=tokens.filter(token=>titleTokens.has(token)||(token.length>4&&token.endsWith('s')&&titleTokens.has(token.slice(0,-1))));
   const exactOverride=WIKIPEDIA_PAGE_OVERRIDES[article.id];
   if(exactOverride&&page.title.toLowerCase()!==exactOverride.toLowerCase())continue;
   if(!exactOverride&&tokens.length&&!matched.length)continue;
   if(page.pageimage)return {file:page.pageimage,title:page.title,url:'https://en.wikipedia.org/wiki/'+encodeURIComponent(page.title.replace(/ /g,'_'))};
  }
 }catch{}
 return null;
};
const IMAGE_CONTEXT_TYPES=new Set('dance dances dancing painting paintings drawing drawings weaving woven textile textiles cloth meal food cuisine dish soup coffee tea beer bread cooking music song songs singing drum drumming mask masks theatre theater puppet puppets festival festivals ceremony ceremonies ritual rituals pilgrimage fishing sport competition calligraphy language sauna yoga harping carnival brewing performance storytelling epic craft crafts carving architecture henna adornment'.split(' '));
const IMAGE_CONTEXT_ALIASES={
 dance:['dance','dances','dancing','dancer','dancers'],
 painting:['painting','paintings'],
 drawing:['drawing','drawings'],
 weaving:['weaving','woven','weaver','weavers','textile','textiles'],
 textile:['textile','textiles','cloth','clothing','weaving'],
 meal:['meal','food','cuisine','dish','cooking'],
 food:['food','cuisine','dish','meal','cooking'],
 soup:['soup'],
 coffee:['coffee'],
 tea:['tea'],
 beer:['beer','brewing'],
 bread:['bread','baking'],
 music:['music','musician','musicians','song','singing'],
 song:['song','songs','singing','music'],
 singing:['singing','song','songs','music'],
 drum:['drum','drums','drumming'],
 mask:['mask','masks','masked'],
 theatre:['theatre','theater','performance'],
 theater:['theater','theatre','performance'],
 puppet:['puppet','puppets','puppetry'],
 festival:['festival','festivals','celebration'],
 ceremony:['ceremony','ceremonies','ritual'],
 ritual:['ritual','rituals','ceremony','ceremonies'],
 pilgrimage:['pilgrimage','pilgrims'],
 fishing:['fishing','fish'],
 calligraphy:['calligraphy','writing'],
 language:['language','linguistic'],
 sauna:['sauna'],
 yoga:['yoga'],
 harping:['harp','harping'],
 carnival:['carnival','parade'],
 brewing:['brewing','beer'],
 performance:['performance','performances','performing'],
 storytelling:['storytelling','story','stories'],
 epic:['epic','storytelling'],
 craft:['craft','crafts','craftsmanship'],
 carving:['carving','carved','woodworking'],
 architecture:['architecture','building'],
 henna:['henna','mehndi','body art'],
 adornment:['adornment','decoration','henna','jewellery','jewelry']
};
const IMAGE_CONTEXT_TERMS={
 'henna-rituals':['wedding','ceremony','mehndi','body art','dye','pattern','ritual'],
 'uae-henna':['wedding','ceremony','mehndi','body art','ritual','adornment']
};
const IMAGE_LOCATION_STOPWORDS=new Set([...WIKIPEDIA_STOPWORDS,'a','across','area','areas','around','central','coast','coastal','community','communities','country','countries','east','eastern','federal','from','group','groups','island','islands','kingdom','middle','multiple','nation','nations','north','northern','of','people','peoples','province','provinces','region','regions','republic','rural','south','southern','state','states','the','united','urban','west','western','world','between','along','and','in']);
const IMAGE_COUNTRY_ALIASES={
 JPN:['japanese'],FIN:['finnish'],IDN:['indonesian'],BRA:['brazilian'],GHA:['ghanaian'],IND:['indian'],ESP:['spanish'],FRA:['french'],CHN:['chinese'],MAR:['moroccan'],IRL:['irish'],PRT:['portuguese'],GRC:['greek'],POL:['polish'],ITA:['italian'],UKR:['ukrainian'],NGA:['nigerian'],KEN:['kenyan'],UGA:['ugandan'],ETH:['ethiopian'],ZWE:['zimbabwean'],MDG:['malagasy'],BTN:['bhutanese'],KHM:['khmer','cambodian'],LKA:['sri lankan'],THA:['thai'],PHL:['filipino','philippine'],BGD:['bangladeshi'],MNG:['mongolian'],PER:['peruvian'],ARG:['argentine','argentinian'],URY:['uruguayan'],HTI:['haitian'],GBR:['british','scottish','welsh','cornish'],USA:['american'],AUS:['australian'],NZL:['maori','aotearoa','new zealander'],VUT:['vanuatuan'],TON:['tongan'],TUR:['turkish','turkiye'],NLD:['dutch'],EGY:['egyptian'],COL:['colombian'],MUS:['mauritian'],SEN:['senegalese'],GMB:['gambian'],MRT:['mauritanian'],DJI:['djiboutian'],SOM:['somali'],CMR:['cameroonian'],SRB:['serbian'],DZA:['algerian'],BGR:['bulgarian'],NER:['nigerien'],PRY:['paraguayan'],RWA:['rwandan'],ZMB:['zambian'],CUB:['cuban'],ARE:['emirati','uae'],IRN:['iranian','persian'],EST:['estonian'],MEX:['mexican'],JAM:['jamaican'],VNM:['vietnamese','viet','nam'],KOR:['korean']
};
const normalizedImageText=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const imageTextHas=(text,term)=>{
 const normalized=normalizedImageText(text),needle=normalizedImageText(term);
 if(!normalized||!needle)return false;
 const padded=' '+normalized+' ';
 const variants=[needle];
 if(needle.length>4&&needle.endsWith('s'))variants.push(needle.slice(0,-1));
 return variants.some(variant=>padded.includes(' '+variant+' '));
};
const imageStoryContextTerms=article=>{
 const words=normalizedImageText(article.title).split(' ').filter(Boolean);
 return [...new Set([...words.filter(word=>IMAGE_CONTEXT_TYPES.has(word)),...(IMAGE_CONTEXT_TERMS[article.id]||[])])];
};
const imageStoryPlaceTerms=(article,country)=>{
 const topicWords=new Set(wikipediaTopicTokens(article));
 const raw=[article.place||'',article.region||'',country?.name||'',...(IMAGE_COUNTRY_ALIASES[country?.code]||[])].join(' ');
 return [...new Set(normalizedImageText(raw).split(' ').filter(word=>word.length>2&&!IMAGE_LOCATION_STOPWORDS.has(word)&&!topicWords.has(word)))];
};
const imageStoryMatch=(image,article,country,categories=[])=>{
 const imageSubjectText=image.fileName+' '+image.description;
 const metadataText=imageSubjectText+' '+categories.join(' ');
 const topicTokens=wikipediaTopicTokens(article);
 const topicHits=topicTokens.filter(token=>imageTextHas(imageSubjectText,token));
 if(!topicHits.length)return {matches:false,topicHits:0,contextHits:0,placeHits:0,titleHits:0};
 const contextTerms=imageStoryContextTerms(article);
 const contextHits=contextTerms.filter(term=>imageTextHas(metadataText,term));
 if(contextTerms.length&&!contextHits.length)return {matches:false,topicHits:topicHits.length,contextHits:0,placeHits:0,titleHits:0};
 const placeTerms=imageStoryPlaceTerms(article,country);
 const placeHits=placeTerms.filter(term=>imageTextHas(metadataText,term));
 if(placeTerms.length&&!placeHits.length)return {matches:false,topicHits:topicHits.length,contextHits:contextHits.length,placeHits:0,titleHits:0};
 const titleHits=topicTokens.filter(token=>imageTextHas(image.fileName,token)).length;
 return {matches:true,topicHits:topicHits.length,contextHits:contextHits.length,placeHits:placeHits.length,titleHits};
};
const commonsImageFromPage=(page,wikiPage,article,country,categories=[],curated=false)=>{
 const info=page?.imageinfo?.[0],meta=info?.extmetadata||{};
 const license=commonsText(meta.LicenseShortName?.value||'');
 const licenseUrl=commonsText(meta.LicenseUrl?.value||'').replace(/^http:\/\/creativecommons\.org\//i,'https://creativecommons.org/');
 const artist=commonsText(meta.Artist?.value||meta.Credit?.value||'');
 const thumb=String(info?.thumburl||info?.url||'');
 if(!/^https:\/\/upload\.wikimedia\.org\//i.test(thumb)||!commonsLicenseAllowed(license,licenseUrl))return null;
 if(!artist&&!/^(?:CC0|Public domain|PD(?:[-\s]|$))/i.test(license))return null;
 const fileName=String(page.title||'File:Image').replace(/^File:/,'').replace(/_/g,' ');
 const fileUrl='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(fileName.replace(/ /g,'_'));
 const image={thumb,fileName,fileUrl,artist,license,licenseUrl,description:commonsText(meta.ImageDescription?.value||''),wikiTitle:wikiPage?.title||'',wikiUrl:wikiPage?.url||''};
 return curated||imageStoryMatch(image,article,country,categories).matches?image:null;
};
const commonsFileMetadata=async(fileTitle,wikiPage,article,country,curated=false)=>{
 const params=new URLSearchParams({action:'query',titles:'File:'+fileTitle,prop:'imageinfo|categories',iiprop:'url|extmetadata',iiurlwidth:'1200',cllimit:'40',format:'json',origin:'*'});
 try{
  const response=await fetch('https://commons.wikimedia.org/w/api.php?'+params.toString(),{headers:{Accept:'application/json'}});
  if(!response.ok)return null;
  const data=await response.json(),page=Object.values(data?.query?.pages||{})[0];
  const categories=(page?.categories||[]).map(category=>category.title||'');
  return commonsImageFromPage(page,wikiPage,article,country,categories,curated);
 }catch{return null;}
};
const commonsSearchImage=async(article,country)=>{
 const topic=wikipediaSearchTerm(article);
 if(!topic)return null;
 const countryName=String(country?.name||'');
 const queries=[topic+' '+countryName,topic].filter((value,index,all)=>value&&all.indexOf(value)===index);
 const topicTokens=wikipediaTopicTokens(article);
 for(const query of queries){
  try{
   const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:query,gsrnamespace:'6',gsrlimit:'40',prop:'imageinfo|categories',iiprop:'url|extmetadata',iiurlwidth:'1200',cllimit:'40',format:'json',origin:'*'});
   const response=await fetch('https://commons.wikimedia.org/w/api.php?'+params.toString(),{headers:{Accept:'application/json'}});
   if(!response.ok)continue;
   const data=await response.json();
   const pages=Object.values(data?.query?.pages||{}).sort((a,b)=>(a.index||0)-(b.index||0));
   const candidates=[];
   for(const page of pages){
    const categories=(page.categories||[]).map(category=>category.title||'');
    const image=commonsImageFromPage(page,null,article,country,categories);
    if(!image)continue;
    const match=imageStoryMatch(image,article,country,categories);
    candidates.push({image,score:match.topicHits*8+match.contextHits*4+match.placeHits*3+match.titleHits*2,index:Number(page.index)||0});
   }
   candidates.sort((a,b)=>b.score-a.score||a.index-b.index);
   if(candidates.length)return candidates[0].image;
  }catch{}
 }
 return null;
};
const commonsImagesFor=async(article,country)=>{
 const cacheKey=article.id+'|'+String(country?.code||'');
 if(cultureImageCache.has(cacheKey))return cultureImageCache.get(cacheKey);
 const curated=(SOUTH_ASIA_STORIES[article.id]||SOUTHEAST_ASIA_STORIES[article.id]||NORTH_AMERICA_STORIES[article.id])?.images||[];
 if(curated.length){
  const images=(await Promise.all(curated.map(file=>commonsFileMetadata(file,null,article,country,true)))).filter(Boolean);
  if(images.length){cultureImageCache.set(cacheKey,images);return images;}
 }
 let wikiPage=null,result=null;
 if(article.id==='uae-henna'&&country?.code==='ARE'){
  wikiPage={title:'Henna',url:'https://en.wikipedia.org/wiki/Henna'};
  result=await commonsFileMetadata('Receiving henna; a symbol of culture being shared to you.jpg',wikiPage,article,country,true);
 }
 if(!result){
  wikiPage=await wikipediaLeadPage(article);
  if(wikiPage?.file)result=await commonsFileMetadata(wikiPage.file,wikiPage,article,country);
 }
 if(!result)result=await commonsSearchImage(article,country);
 const images=result?[result]:[];
 cultureImageCache.set(cacheKey,images);
 return images;
};
const renderCultureStoryImages=async(article,hosts,country)=>{
 hosts[0].innerHTML='<p class="ns-culture-image-status">Finding a topic-matched image with a reusable licence…</p>';
 const images=await commonsImagesFor(article,country);
 hosts.forEach((host,index)=>{
  if(!host.isConnected||host.dataset.articleId!==article.id)return;
  const image=images[index];
  if(!image){host.innerHTML=index?'':'<p class="ns-culture-image-status">No topic-matched image with a reusable licence was available.</p>';if(index)host.hidden=true;return;}
  const licenseHref=/^https:\/\/creativecommons\.org\//i.test(image.licenseUrl)?image.licenseUrl:'https://commons.wikimedia.org/wiki/Commons:Licensing';
  const context=article.id==='drametse'?'Drametse monastery, the festival’s setting. ':article.id==='suri-jagek'?'Kalasha Valley landscape, the setting of Suri Jagek. ':article.id==='brunei-pantun'?'An Indonesian-language example of the shared a-b-a-b pantun form; this is not a photograph of Bruneian recitation. ':article.id==='sbek-thom'?index?'A Cambodian Sbek Thom puppet displayed in a museum in Lisbon. ':'A Cambodian Sbek Thom puppet displayed in a museum in Phoenix. ':article.id==='hudhud'?'Artwork about the Ifugao epic of Aliguyon; it does not document a chant performance. ':article.id==='lao-khaen'&&index?'Lao musicians performing with a khaen at a Paris festival. ':article.id==='kelantan-mak-yong'&&index?'A Mak Yong costume displayed in a Kelantan museum. ':article.id==='greenland-qilaat'&&index?'A historical photograph of a Greenlandic drum-song duel, 1905. ':article.id==='nicaragua-gueguense'&&index?'El Güegüense masks displayed in a Costa Rican museum. ':article.id==='costa-rica-carretas'&&!index?'A large decorated oxcart displayed in Sarchí. ':article.id==='honduras-garifuna-voice'?'Garifuna participants at a rights demonstration in San Pedro Sula, 2021. ':article.id==='salvador-historiantes'?'Historiantes performers photographed at Panchimalco; the field study described here took place in Las Huertas. ':article.id==='curacao-tambu'?index?'The Tambú Museum in Curaçao; the photograph does not show a performance. ':'An older tambú drum from a Dutch museum collection, attributed to the Netherlands Antilles. ':article.id==='jamaica-moore-town'?'Moore Town photographed in 2010; the photograph does not show a Kromanti ritual. ':article.id==='cuba-rumba'&&index?'A cajón used for rumba percussion, photographed separately from the Camagüey dancers. ':'';
  const extraContext=article.id==='aruba-dera-gay'?'Dera Gay in Aruba, photographed in 1964. ':article.id==='dominica-larouman'?index?'A Kalinago Territory photograph; it does not document larouman preparation. ':'Baskets displayed in Kalinago Territory; their specific plant material is not recorded. ':article.id==='mexico-voladores'&&index?'Voladores photographed at the National Museum of Anthropology in Mexico City. ':'';
  const captionContext=context||extraContext;
  host.innerHTML='<figure><a href="'+e(image.fileUrl)+'" target="_blank" rel="noopener noreferrer"><img src="'+e(image.thumb)+'" alt="'+e(captionContext+image.description||article.title)+'" loading="lazy" decoding="async"></a><figcaption>'+e(captionContext)+'<cite>'+e(image.fileName)+'</cite>'+(image.artist?' · by '+e(image.artist):'')+' · '+(image.licenseUrl?'<a href="'+e(licenseHref)+'" target="_blank" rel="noopener noreferrer">'+e(image.license)+'</a>':e(image.license))+' · <a href="'+e(image.fileUrl)+'" target="_blank" rel="noopener noreferrer">Wikimedia Commons file details ↗</a>'+(image.wikiUrl?' · <a href="'+e(image.wikiUrl)+'" target="_blank" rel="noopener noreferrer">Wikipedia: '+e(image.wikiTitle)+' ↗</a>':'')+'</figcaption></figure>';
  host.querySelector('img')?.addEventListener('error',()=>{if(host.isConnected)host.innerHTML='<p class="ns-culture-image-status">This image is no longer available. Open another story to try again.</p>';},{once:true});
 });
};
const point=coord=>[(Number(coord[0])+180)*(960/360),(90-Number(coord[1]))*(480/180)];
const polys=g=>g?.type==='Polygon'?[g.coordinates]:g?.type==='MultiPolygon'?g.coordinates:[];
const fmt=n=>Number(n).toFixed(2);
export function geoPath(geometry){
 return polys(geometry).map(poly=>poly.map(ring=>{
  if(!Array.isArray(ring)||ring.length<3)return '';
  const parts=[],first=point(ring[0]);let prev=null;
  for(const pos of ring){
   const p=point(pos);
   if(!Number.isFinite(p[0])||!Number.isFinite(p[1]))continue;
   if(prev&&Math.abs(p[0]-prev[0])>480){parts.push('Z');parts.push('M'+fmt(p[0])+' '+fmt(p[1]));}
   else parts.push((prev?'L':'M')+fmt(p[0])+' '+fmt(p[1]));
   prev=p;
  }
  if(parts.length)parts.push('Z');
  return parts.join(' ');
 }).join(' ')).join(' ');
}
export function featureBounds(feature){
 const points=[];
 for(const poly of polys(feature?.geometry))for(const ring of poly)for(const pos of ring){
  const p=point(pos);if(p.every(Number.isFinite))points.push(p);
 }
 if(!points.length)return null;
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];
}
export function countryViewBox(feature){
 const b=featureBounds(feature);if(!b)return WORLD_MAP_BOUNDS;
 const cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2;
 // Enforce a comfortable minimum zoom for microstates and islands.
 let w=Math.max(16,(b[2]-b[0])*1.25),h=Math.max(10,(b[3]-b[1])*1.3);
 // Preserve the 2:1 aspect of the atlas viewport.
 w=Math.max(w,h*2);h=w/2;
 if(w>960)return WORLD_MAP_BOUNDS;
 return [fmt(cx-w/2),fmt(cy-h/2),fmt(w),fmt(h)].join(' ');
}
export const normaliseCountryData=data=>{
 if(!data||data.type!=='FeatureCollection'||!Array.isArray(data.features))throw Error('Country boundaries are invalid.');
 return data.features.filter(f=>f?.geometry&&f?.properties?.name).map((f,index)=>{
  const iso=String(f.properties.iso3||f.id||'').toUpperCase();
  return {...f,code:/^[A-Z]{3}$/.test(iso)?iso:'AREA-'+index,name:String(f.properties.name)};
 }).sort((a,b)=>a.name.localeCompare(b.name));
};
export function normaliseRegions(data){
 if(!data||data.type!=='FeatureCollection'||!Array.isArray(data.features))return [];
 return data.features.filter(f=>f?.geometry&&polys(f.geometry).length).map((f,i)=>({
  id:String(i),name:String(f.properties?.shapeName||f.properties?.name||f.properties?.NAME||f.properties?.NAME_1||'Region '+(i+1)),
  geometry:f.geometry
 })).sort((a,b)=>a.name.localeCompare(b.name));
}
export const regionArticles=(code,name)=>articlesForCountry(code).sort((a,b)=>{
 const score=x=>Number(Boolean(name&&x.region&&name.toLocaleLowerCase().includes(x.region.toLocaleLowerCase())));
 return score(b)-score(a);
});
const countryIndex=countries=>new Map(countries.map(c=>[c.code,c]));
const articleCard=a=>'<button class="ns-culture-story-tab" type="button" data-culture-article="'+e(a.id)+'" aria-current="false">'+
 '<span>'+e(a.theme)+'</span><strong>'+e(a.title)+'</strong></button>';
export function renderCultureAtlas(root,{fetcher=(...args)=>fetch(...args),random=Math.random}={}){
 if(!root)return ()=>{};
 let countries=[],selectedCountry=null,regions=[],selectedRegion=null,activeArticle='',regionError='',
     loadingRegions=false,regionSource=null,abort=null,generation=0,started=false,removed=false;
 let subregions=[],selectedSubregion=null,loadingSub=false,subError='',subAbort=null,subGeneration=0;
 let indigenousOn=false,indigenousAreas=[],indigenousError='',indigenousPartial=false,selectedIndigenousName='',tribalAbort=null,tribalGeneration=0,tribalTimer=null;
 let placeResults=[],selectedPlace=null,placeError='',loadingPlaces=false,placeAbort=null,placeGeneration=0,viewport=null;
 const articlesAvailable=articleCountries.length;
 root.innerHTML='<section class="ns-culture-atlas" aria-labelledby="ns-culture-heading">'+
 '<div class="ns-culture-heading"><div><p class="ns-culture-eyebrow">A WORLD OF PERSPECTIVES</p><h2 id="ns-culture-heading">The psychology of culture</h2>'+
 '<p>Travel through traditions, community practices and different ways of making meaning—without assuming everyone in a country thinks alike.</p></div>'+
 '<span class="ns-culture-stamp" aria-hidden="true">✦ CULTURE ATLAS</span></div>'+
 '<div class="ns-culture-controls"><label>Choose a country<select data-culture-country aria-label="Choose a country"><option value="">Select a country…</option></select></label>'+
 '<button type="button" data-culture-random class="ns-culture-random">✦ Surprise me with a territory</button>'+
 '<button type="button" data-culture-reset class="ns-culture-reset" disabled>← World view</button></div>'+
 '<div class="ns-culture-layout"><div class="ns-culture-map-column">'+
 '<div class="ns-culture-map-shell"><svg class="ns-culture-map" data-culture-map tabindex="0" viewBox="0 0 960 480" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Map: drag to pan, pinch or scroll to zoom; arrow keys pan and plus or minus zoom">'+
 '<rect class="ns-culture-sea" x="0" y="0" width="960" height="480"></rect><g data-culture-shapes></g><g data-culture-regions></g><g data-culture-subregions></g><g data-culture-indigenous-areas></g><g data-culture-place-pin></g></svg>'+
 '<div class="ns-culture-zoom" role="group" aria-label="Map controls"><button type="button" data-culture-fullscreen aria-pressed="false" aria-label="View map full screen">⛶</button><button type="button" data-culture-zoom-in aria-label="Zoom in">+</button><button type="button" data-culture-zoom-out aria-label="Zoom out">−</button><button type="button" data-culture-zoom-fit aria-label="Fit selected area">⊡</button></div>'+
 '<div data-culture-map-status class="ns-culture-map-status" role="status">Preparing the world map…</div></div>'+
 '<div class="ns-culture-map-foot"><span data-culture-region-info>Select a country to explore its regions.</span><span data-culture-count></span></div>'+
 '<label class="ns-culture-region-control" data-culture-region-wrap hidden>State / province / constituent country<select data-culture-region><option value="">All regions</option></select></label>'+
 '<div class="ns-culture-drill" data-culture-sub-wrap hidden><button type="button" data-culture-sub-load>Explore counties / districts / municipalities</button>'+
 '<label data-culture-sub-control hidden>County / district / second-level area<select data-culture-subregion><option value="">All local areas</option></select></label>'+
 '<p data-culture-sub-note>Load the next administrative level for the selected region.</p></div>'+
 '<div class="ns-culture-indigenous-control" data-culture-indigenous-wrap hidden><strong>Indigenous areas are shown automatically</strong>'+
 '<label data-culture-indigenous-list-wrap hidden>Browse visible mapped areas<select data-culture-indigenous-list><option value="">Select an area…</option></select></label>'+
 '<p data-culture-indigenous-note>U.S. Census statistical geography is included as you zoom into a state. These boundaries are not a complete map of Indigenous homelands or sovereignty.</p></div>'+
 '<div class="ns-culture-place-search" data-culture-place-wrap hidden><label>Find any city or town<input type="search" data-culture-place-query minlength="3" maxlength="100" placeholder="Type a place name" aria-label="City or town name"></label>'+
 '<button type="button" data-culture-place-search>Find place</button><label data-culture-place-results-wrap hidden>Choose a matching place<select data-culture-place-results></select></label><p data-culture-place-note>Search only happens when you press Find place.</p></div>'+
 '<p class="ns-culture-map-source">Country outlines: Natural Earth. Civil boundaries: <a href="https://www.geoboundaries.org/" rel="noopener noreferrer" target="_blank">geoBoundaries gbOpen ↗</a> (licences vary). Indigenous geography: <a href="https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/AIANNHA/MapServer/47" rel="noopener noreferrer" target="_blank">US Census AIANNHA, 2026 ↗</a>. Place search © <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap contributors ↗</a>. These boundaries are illustrative, never claims about sovereignty, ancestry, or the full extent of Indigenous homelands.</p></div>'+
 '<aside class="ns-culture-reading" aria-label="Culture stories" data-culture-panel><div data-culture-panel-content></div></aside></div>'+
 '<p class="ns-culture-disclaimer">Each story starts with a community’s own account of place and practice, then examines the psychological questions its local evidence can support.</p></section>';
 const svg=root.querySelector('[data-culture-map]'),land=root.querySelector('[data-culture-shapes]'),regionLayer=root.querySelector('[data-culture-regions]'),
   choose=root.querySelector('[data-culture-country]'),regionChoose=root.querySelector('[data-culture-region]'),
   regionWrap=root.querySelector('[data-culture-region-wrap]'),panel=root.querySelector('[data-culture-panel-content]'),
   mapStatus=root.querySelector('[data-culture-map-status]'),regionInfo=root.querySelector('[data-culture-region-info]'),
   worldButton=root.querySelector('[data-culture-reset]'),count=root.querySelector('[data-culture-count]'),
   subLayer=root.querySelector('[data-culture-subregions]'),tribalLayer=root.querySelector('[data-culture-indigenous-areas]'),
   pinLayer=root.querySelector('[data-culture-place-pin]'),subWrap=root.querySelector('[data-culture-sub-wrap]'),
   subChoose=root.querySelector('[data-culture-subregion]'),subControl=root.querySelector('[data-culture-sub-control]'),
   subNote=root.querySelector('[data-culture-sub-note]'),indigenousWrap=root.querySelector('[data-culture-indigenous-wrap]'),
   indigenousNote=root.querySelector('[data-culture-indigenous-note]'),
   indigenousList=root.querySelector('[data-culture-indigenous-list]'),indigenousListWrap=root.querySelector('[data-culture-indigenous-list-wrap]'),
   placeWrap=root.querySelector('[data-culture-place-wrap]'),placeQuery=root.querySelector('[data-culture-place-query]'),
   placeChoose=root.querySelector('[data-culture-place-results]'),placeResultWrap=root.querySelector('[data-culture-place-results-wrap]'),
   placeNote=root.querySelector('[data-culture-place-note]');
 count.textContent=articlesAvailable+' countries with stories';
 const drawIndigenous=()=>{
  tribalLayer.innerHTML=indigenousOn&&selectedCountry?.code==='USA'?indigenousAreas.map((f,i)=>{
   const name=String(f.properties?.NAMELSAD||f.properties?.NAME||'Census area');
   return '<path class="ns-culture-indigenous" data-culture-indigenous-id="'+i+'" role="button" tabindex="0" aria-label="View '+e(name)+'" d="'+geoPath(f.geometry)+'"><title>'+e(name)+'</title></path>';
  }).join(''):'';
 };
 const drawPlace=()=>{
  if(!selectedPlace){pinLayer.innerHTML='';return;}
  const [x,y]=mapDegreesToAtlas(selectedPlace.lon,selectedPlace.lat);
  pinLayer.innerHTML='<circle class="ns-culture-place-halo" cx="'+fmt(x)+'" cy="'+fmt(y)+'" r="4"/><circle class="ns-culture-place-dot" cx="'+fmt(x)+'" cy="'+fmt(y)+'" r="1.65"/>';
 };
 const paintMap=()=>{
  // The viewport is managed independently: changing a story must not erase manual zoom or pan.
  land.innerHTML=countries.map(c=>'<path class="ns-culture-country'+(selectedCountry?(selectedCountry.code===c.code?' is-selected':' is-dimmed'):'')+
   '" data-culture-code="'+e(c.code)+'" role="button" tabindex="0" aria-label="Explore '+e(c.name)+'" d="'+geoPath(c.geometry)+'"><title>'+e(c.name)+'</title></path>').join('');
  regionLayer.innerHTML=selectedCountry?regions.map(r=>'<path class="ns-culture-region'+(selectedRegion?.id===r.id?' is-selected':'')+
    '" data-culture-region-id="'+e(r.id)+'" role="button" tabindex="0" aria-label="Explore '+e(r.name)+'" d="'+geoPath(r.geometry)+'"><title>'+e(r.name)+'</title></path>').join(''):'';
  subLayer.innerHTML=selectedCountry?subregions.map(r=>'<path class="ns-culture-subregion'+(selectedSubregion?.id===r.id?' is-selected':'')+
   '" data-culture-subregion-id="'+e(r.id)+'" role="button" tabindex="0" aria-label="Explore '+e(r.name)+'" d="'+geoPath(r.geometry)+'"><title>'+e(r.name)+'</title></path>').join(''):'';
  drawIndigenous();drawPlace();
  mapStatus.textContent=selectedCountry?selectedCountry.name+(selectedRegion?' · '+selectedRegion.name:'')+(selectedSubregion?' · '+selectedSubregion.name:'')+(selectedPlace?' · '+selectedPlace.name.split(',')[0]:'')+(selectedIndigenousName?' · '+selectedIndigenousName:''):'World view · select a country';
  worldButton.disabled=!selectedCountry;
  choose.value=selectedCountry?.code||'';
  regionWrap.hidden=!selectedCountry||regions.length===0;
  regionChoose.innerHTML='<option value="">All regions</option>'+regions.map(r=>'<option value="'+e(r.id)+'">'+e(r.name)+'</option>').join('');
  regionChoose.value=selectedRegion?.id||'';
  regionInfo.textContent=loadingRegions?'Loading first-level boundaries…':selectedCountry?
    (regions.length?regions.length+' first-level regions · choose one to explore smaller places'+(selectedCountry.code==='GBR'?' · Scotland and Wales here; Cornwall under England → counties':''):
     regionError||'No administrative regions available for this country.'):
    'Select a country to explore its states or provinces.';
  subWrap.hidden=!selectedRegion;
  subControl.hidden=!selectedRegion||subregions.length===0;
  subChoose.innerHTML='<option value="">All local areas</option>'+subregions.map(r=>'<option value="'+e(r.id)+'">'+e(r.name)+'</option>').join('');
  subChoose.value=selectedSubregion?.id||'';
  subNote.textContent=loadingSub?'Loading county/district boundaries…':subregions.length?
   subregions.length+' local areas in '+selectedRegion.name:subError||'Select “Explore” to load smaller administrative areas.';
  indigenousWrap.hidden=selectedCountry?.code!=='USA';
  indigenousListWrap.hidden=!indigenousOn||indigenousAreas.length===0;
  indigenousList.innerHTML='<option value="">Select a visible area…</option>'+indigenousAreas.map((f,i)=>
   '<option value="'+i+'">'+e(f.properties?.NAMELSAD||f.properties?.NAME||'Census area')+'</option>').join('');
  indigenousNote.textContent=indigenousError||(indigenousAreas.length+
   ' U.S. Census areas currently visible'+(indigenousPartial?' (partial response; zoom closer)':'')+
   '. Boundaries are statistical geography, not a complete map of Indigenous homelands.');
  placeWrap.hidden=!selectedCountry;
  placeResultWrap.hidden=placeResults.length===0;
  placeChoose.innerHTML='<option value="">Choose a result…</option>'+placeResults.map((p,i)=>'<option value="'+i+'">'+e(p.name)+'</option>').join('');
  placeNote.textContent=loadingPlaces?'Searching OpenStreetMap…':placeError||'Enter a city, town or locality and press Find place.';
 };
 const paintPanel=()=>{
  if(!selectedCountry){
   panel.innerHTML='<div class="ns-culture-welcome"><span class="ns-culture-ornament" aria-hidden="true">✧</span>'+
    '<p class="ns-culture-eyebrow">YOUR NEXT DISCOVERY</p><h3>Every place has more than one story.</h3>'+
    '<p>Choose a country on the map, search the country list, or let the atlas pick a destination with a published story.</p>'+
    '<p class="ns-culture-promise">Begin with a documented tradition, explore the psychology it invites us to consider, and decide which parts fit your own life.</p>'+
    '<button type="button" data-culture-random class="ns-culture-random ns-culture-random--inside">Discover somewhere →</button></div>';return;
  }
  const localName=selectedSubregion?.name||selectedPlace?.name||selectedRegion?.name||'';
  const list=regionArticles(selectedCountry.code,localName);
  const active=list.find(a=>a.id===activeArticle)||list[0];
  if(active)activeArticle=active.id;
  const locallyRelevant=list.some(a=>localName&&a.region&&localName.toLowerCase().includes(a.region.toLowerCase()));
  const identity='<p class="ns-culture-eyebrow">CULTURE, HISTORY & PSYCHOLOGY</p><p class="ns-culture-place">'+e(selectedCountry.name)+(selectedRegion?' · '+e(selectedRegion.name):'')+(selectedSubregion?' · '+e(selectedSubregion.name):'')+(selectedPlace?' · '+e(selectedPlace.name.split(',')[0]):'')+'</p>';
  if(!list.length){
   panel.innerHTML=identity+'<h3>No story for '+e(selectedCountry.name)+' yet</h3><p>Choose another place to read a documented cultural practice and its psychology.</p><button type="button" data-culture-random class="ns-culture-random ns-culture-random--inside">Find a story →</button>';return;
  }
  const pos=list.findIndex(a=>a.id===active.id);
  const investigation=CULTURE_INVESTIGATIONS[active.id]||{sections:[],evidence:[]};
  const investigationMarkup='<div class="ns-culture-investigation">'+investigation.sections.map(section=>'<section class="ns-culture-investigation-section"><h4>'+e(section.heading)+'</h4>'+section.paragraphs.map((paragraph,index)=>{
   const body=typeof paragraph==='string'?e(paragraph):e(paragraph.text)+' <span class="ns-culture-inline-sources">'+paragraph.sources.map(s=>'<a href="'+e(s.url)+'" target="_blank" rel="noopener noreferrer">'+e(s.label)+' ↗</a>').join(' · ')+'</span>';
   const inlineImage=(SOUTH_ASIA_STORIES[active.id]||SOUTHEAST_ASIA_STORIES[active.id]||NORTH_AMERICA_STORIES[active.id])&&index===2?'<div class="ns-culture-story-image ns-culture-story-image--inline" data-culture-story-image data-article-id="'+e(active.id)+'"></div>':'';
   return '<p>'+body+'</p>'+inlineImage;
  }).join('')+'</section>').join('')+'</div>';
  const evidenceMarkup='<section class="ns-culture-evidence" aria-label="Local studies and cultural sources"><h4>Evidence from this place</h4><p class="ns-culture-evidence-intro">Local studies and community records are identified by source type, so the cultural account stays distinct from psychological findings.</p>'+investigation.evidence.map(item=>'<article class="ns-culture-evidence-card"><span class="ns-culture-evidence-kind">'+e(item.kind)+'</span><h5>'+e(item.title)+'</h5><p><strong>Method and setting.</strong> '+e(item.method)+'</p><p><strong>What it documents.</strong> '+e(item.finding)+'</p>'+(item.quote?'<blockquote><p>“'+e(item.quote)+'”</p><cite>'+e(item.quoteAttribution||item.citation)+'</cite></blockquote>':'')+'<a href="'+e(item.url)+'" target="_blank" rel="noopener noreferrer">Open source ↗</a><small>'+e(item.citation)+'</small></article>').join('')+'</section>';
  panel.innerHTML=identity+(localName&&!locallyRelevant?'<p class="ns-culture-region-note">Story scope: '+e(active.place)+'.</p>':'')+
   '<div class="ns-culture-story-head"><span>'+e(active.theme)+'</span><span>'+String(pos+1)+' / '+String(list.length)+'</span></div>'+
   '<h3>'+e(active.title)+'</h3><p class="ns-culture-where">'+e(active.place)+'</p><div class="ns-culture-story-image" data-culture-story-image data-article-id="'+e(active.id)+'" aria-live="polite"></div>'+investigationMarkup+evidenceMarkup+
   '<div class="ns-culture-story-nav"><button type="button" data-culture-step="-1" '+(list.length===1?'disabled':'')+'>← Previous</button><button type="button" data-culture-step="1" '+(list.length===1?'disabled':'')+'>Next story →</button></div>'+
   (list.length>1?'<details class="ns-culture-story-list"><summary>Browse '+list.length+' stories from this country</summary>'+list.map(articleCard).join('')+'</details>':'');
  const imageHosts=[...panel.querySelectorAll('[data-culture-story-image]')];
  if(imageHosts.length)void renderCultureStoryImages(active,imageHosts,selectedCountry);
 };
 const cancelRegions=()=>{generation++;if(abort)abort.abort();abort=null;};
 const cancelSub=()=>{subGeneration++;if(subAbort)subAbort.abort();subAbort=null;loadingSub=false;};
 const cancelTribal=()=>{tribalGeneration++;if(tribalAbort)tribalAbort.abort();tribalAbort=null;if(tribalTimer)clearTimeout(tribalTimer);tribalTimer=null;};
 const cancelPlace=()=>{placeGeneration++;if(placeAbort)placeAbort.abort();placeAbort=null;loadingPlaces=false;};
 const focusFeature=(feature,pad=1.35)=>{if(feature&&viewport)viewport.setView(fitAtlasBounds(featureBounds(feature),pad));};
 const selectSubregion=id=>{
  selectedSubregion=subregions.find(r=>r.id===String(id))||null;
  selectedPlace=null;
  if(selectedSubregion)focusFeature(selectedSubregion,1.45);
  else if(selectedRegion)focusFeature(selectedRegion,1.3);
  const list=regionArticles(selectedCountry?.code,selectedSubregion?.name||selectedRegion?.name||'');
  activeArticle=list[0]?.id||'';
  paintMap();paintPanel();
 };
 const selectRegion=id=>{
  cancelSub();selectedRegion=regions.find(r=>r.id===String(id))||null;
  selectedSubregion=null;selectedPlace=null;subregions=[];subError='';placeResults=[];selectedIndigenousName='';
  if(selectedRegion)focusFeature(selectedRegion);
  else if(selectedCountry)focusFeature(selectedCountry);
  const list=regionArticles(selectedCountry?.code,selectedRegion?.name||'');activeArticle=list[0]?.id||'';
  paintMap();paintPanel();
 };
 const loadRegions=async(country,token)=>{
  if(!/^[A-Z]{3}$/.test(country.code)){regionError='Civil subdivisions unavailable for this mapped unit.';loadingRegions=false;paintMap();return;}
  abort=typeof AbortController!=='undefined'?new AbortController():null;
  try{
   const {data,meta}=await fetchAdministrativeLayer(fetcher,country.code,'ADM1',abort?{signal:abort.signal}:{});
   if(token!==generation||removed)return;
   regions=normaliseRegions(data);regionSource=meta;
   regionError=regions.length?'':'No first-level boundaries available for this mapped unit.';
  }catch(err){
   if(token!==generation||removed)return;
   regionError='Regions could not load. Check your connection or try a different place.';
   regions=[];
  }finally{if(token===generation&&!removed){loadingRegions=false;paintMap();}}
 };
 const loadSubregions=async()=>{
  if(!selectedCountry||!selectedRegion||loadingSub)return;
  cancelSub();const token=subGeneration;
  loadingSub=true;subError='';subAbort=typeof AbortController!=='undefined'?new AbortController():null;paintMap();
  try{
   let data;
   if(selectedCountry.code==='USA'){
    ({data}=await fetchUSCounties(fetcher,selectedRegion.name,subAbort?{signal:subAbort.signal}:{}));
   }else{
    ({data}=await fetchAdministrativeLayer(fetcher,selectedCountry.code,'ADM2',subAbort?{signal:subAbort.signal}:{}));
   }
   if(token!==subGeneration||removed)return;
   const all=normaliseRegions(data);
   // Census counties are already filtered by exact state FIPS, so do not discard coastal/island counties by approximated parent geometry.
   subregions=selectedCountry.code==='USA'?all:filterAdministrativeChildren(all,selectedRegion);
   subError=subregions.length?'':'No matching second-level areas found in this dataset.';
  }catch(err){
   if(token!==subGeneration||removed)return;
   subError='Local boundaries unavailable here. Try another area or use the town/city search.';
   subregions=[];
  }finally{if(token===subGeneration&&!removed){loadingSub=false;paintMap();}}
 };
 const loadTribal=async()=>{
  if(!indigenousOn||selectedCountry?.code!=='USA'||!viewport)return;
  cancelTribal();const token=tribalGeneration;
  tribalAbort=typeof AbortController!=='undefined'?new AbortController():null;
  indigenousError='Loading US Census areas…';paintMap();
  try{
   const result=await fetchUSIndigenousAreas(fetcher,viewport.view,tribalAbort?{signal:tribalAbort.signal}:{});
   if(token!==tribalGeneration||removed)return;
   indigenousAreas=result.features;indigenousPartial=result.partial;indigenousError='';
  }catch(err){
   if(token!==tribalGeneration||removed)return;
   indigenousAreas=[];indigenousError=String(err.message||'Could not load Census data.');
  }finally{if(token===tribalGeneration&&!removed){
   drawIndigenous();
   indigenousListWrap.hidden=!indigenousAreas.length;
   indigenousList.innerHTML='<option value="">Select a visible area…</option>'+indigenousAreas.map((f,i)=>
    '<option value="'+i+'">'+e(f.properties?.NAMELSAD||f.properties?.NAME||'Census area')+'</option>').join('');
   indigenousNote.textContent=indigenousError||indigenousAreas.length+' Census geographic areas shown'+(indigenousPartial?' · result truncated; zoom closer':'');
  }}
 };
 const scheduleTribal=()=>{
  if(!indigenousOn||selectedCountry?.code!=='USA'||!viewport)return;
  if(tribalTimer)clearTimeout(tribalTimer);
  tribalTimer=setTimeout(()=>{tribalTimer=null;void loadTribal();},400);
 };
 const findPlaces=async()=>{
  if(!selectedCountry||loadingPlaces)return;
  cancelPlace();const token=placeGeneration;
  loadingPlaces=true;placeError='';placeResults=[];placeResultWrap.hidden=true;
  placeAbort=typeof AbortController!=='undefined'?new AbortController():null;
  placeNote.textContent='Searching OpenStreetMap…';
  try{
   const result=await searchMapPlaces(fetcher,placeQuery.value,selectedCountry,placeAbort?{signal:placeAbort.signal}:{});
   if(token!==placeGeneration||removed)return;
   placeResults=result;placeError=result.length?'':'No matching places found. Try a more specific name.';
  }catch(err){
   if(token!==placeGeneration||removed)return;
   placeError=err.message||'Place search unavailable. Please try again.';
  }finally{if(token===placeGeneration&&!removed){loadingPlaces=false;paintMap();}}
 };
 const selectPlace=index=>{
  const found=placeResults[Number(index)];if(!found)return;
  selectedPlace=found;selectedRegion=null;selectedSubregion=null;subregions=[];
  const [x,y]=mapDegreesToAtlas(found.lon,found.lat);
  const w=Math.min(viewport?.view.w||960,27);
  viewport?.setView(clampAtlasView({x:x-w/2,y:y-w/4,w}));
  activeArticle=regionArticles(selectedCountry.code,found.name)[0]?.id||'';
  paintMap();paintPanel();
 };
 const selectCountry=code=>{
  const found=countryIndex(countries).get(code)||null;
  cancelRegions();cancelSub();cancelTribal();cancelPlace();
  selectedCountry=found;selectedRegion=null;selectedSubregion=null;selectedPlace=null;selectedIndigenousName='';
  regions=[];subregions=[];placeResults=[];placeError='';subError='';regionError='';regionSource=null;
  indigenousAreas=[];indigenousOn=found?.code==='USA';indigenousError='';indigenousPartial=false;loadingRegions=Boolean(found);
  activeArticle=found?articlesForCountry(found.code)[0]?.id||'':'';
  if(found)focusFeature(found,1.3);else viewport?.reset();
  paintMap();paintPanel();
  if(found){
   const pending=loadRegions(found,generation);
   if(indigenousOn)void loadTribal();
   return pending;
  }
  return Promise.resolve();
 };
 const pickRandom=list=>list[Math.min(list.length-1,Math.max(0,Math.floor(Number(random())*list.length)||0))];
 const selectRandom=async()=>{
  if(!countries.length)return;
  const storyCountries=countries.filter(item=>articleCountries.includes(item.code));
  const country=pickRandom(storyCountries.length?storyCountries:countries);
  const depth=Math.floor(Number(random())*3);
  await selectCountry(country.code);
  if(depth===0||!selectedCountry||!regions.length)return;
  const region=pickRandom(regions);
  if(!region)return;
  selectRegion(region.id);
  if(depth<2)return;
  await loadSubregions();
  if(subregions.length)selectSubregion(pickRandom(subregions).id);
 };
 const selectIndigenous=index=>{
  const feature=indigenousAreas[Number(index)];if(!feature)return;
  selectedIndigenousName=String(feature.properties?.NAMELSAD||feature.properties?.NAME||'Census area');
  mapStatus.textContent=selectedCountry.name+' · '+selectedIndigenousName;
  indigenousNote.textContent=selectedIndigenousName+' — Census-defined area; not a comprehensive Indigenous homeland or cultural affiliation.';
  focusFeature(feature,1.5);
 };
 const respondToMap=(target)=>{
  const tribalNode=target.closest('[data-culture-indigenous-id]');
  if(tribalNode&&indigenousOn){selectIndigenous(tribalNode.dataset.cultureIndigenousId);return;}
  const subNode=target.closest('[data-culture-subregion-id]');
  if(subNode&&selectedCountry){selectSubregion(subNode.dataset.cultureSubregionId);return;}
  const regionNode=target.closest('[data-culture-region-id]');
  if(regionNode&&selectedCountry){selectRegion(regionNode.dataset.cultureRegionId);return;}
  const countryNode=target.closest('[data-culture-code]');
  if(countryNode)selectCountry(countryNode.dataset.cultureCode);
 };
 viewport=bindAtlasViewport(svg,{onChange:()=>scheduleTribal()});
 const fullscreenButton=root.querySelector('[data-culture-fullscreen]');
 const mapShell=root.querySelector('.ns-culture-map-shell');
 const syncFullscreen=()=>{
  const active=document.fullscreenElement===mapShell;
  fullscreenButton.setAttribute('aria-pressed',String(active));
  fullscreenButton.setAttribute('aria-label',active?'Exit full screen map':'View map full screen');
  fullscreenButton.textContent=active?'⤢':'⛶';
 };
 const onFullscreenChange=()=>syncFullscreen();
 document.addEventListener('fullscreenchange',onFullscreenChange);
 fullscreenButton.addEventListener('click',async()=>{
  try{
   if(document.fullscreenElement===mapShell)await document.exitFullscreen();
   else if(mapShell.requestFullscreen)await mapShell.requestFullscreen();
  }catch{mapStatus.textContent='Full screen is unavailable in this browser.';}
  syncFullscreen();
 });
 svg.addEventListener('click',event=>{
  if(viewport.consumeDragClick())return;
  respondToMap(event.target);
 });
 root.querySelector('[data-culture-zoom-in]').addEventListener('click',()=>viewport.zoom(1.55));
 root.querySelector('[data-culture-zoom-out]').addEventListener('click',()=>viewport.zoom(1/1.55));
 root.querySelector('[data-culture-zoom-fit]').addEventListener('click',()=>selectedSubregion?focusFeature(selectedSubregion):selectedRegion?focusFeature(selectedRegion):selectedCountry?focusFeature(selectedCountry):viewport.reset());
 svg.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  const target=event.target.closest('[data-culture-code],[data-culture-region-id],[data-culture-subregion-id],[data-culture-indigenous-id]');
  if(!target)return;
  event.preventDefault();respondToMap(target);
 });
 choose.addEventListener('change',()=>selectCountry(choose.value));
 regionChoose.addEventListener('change',()=>selectRegion(regionChoose.value));
 subChoose.addEventListener('change',()=>selectSubregion(subChoose.value));
 root.querySelector('[data-culture-sub-load]').addEventListener('click',()=>void loadSubregions());
 indigenousList.addEventListener('change',()=>selectIndigenous(indigenousList.value));
 root.querySelector('[data-culture-place-search]').addEventListener('click',()=>void findPlaces());
 placeQuery.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();void findPlaces();}});
 placeChoose.addEventListener('change',()=>selectPlace(placeChoose.value));
 worldButton.addEventListener('click',()=>selectCountry(''));
 root.addEventListener('click',event=>{
  if(event.target.closest('[data-culture-random]')){selectRandom();return;}
  const story=event.target.closest('[data-culture-article]');
  if(story){activeArticle=story.dataset.cultureArticle;paintPanel();return;}
  const step=event.target.closest('[data-culture-step]');
  if(step&&selectedCountry){
   const list=regionArticles(selectedCountry.code,selectedSubregion?.name||selectedPlace?.name||selectedRegion?.name||'');
   const current=list.findIndex(a=>a.id===activeArticle);
   if(list.length)activeArticle=list[(current+Number(step.dataset.cultureStep)+list.length)%list.length].id;
   paintPanel();
  }
 });
 const boot=async()=>{
  if(started||removed)return;started=true;
  try{
   const response=await fetcher(WORLD_COUNTRY_DATA);
   if(!response.ok)throw Error('World data unavailable');
   countries=normaliseCountryData(await response.json());
   if(removed)return;
   choose.innerHTML='<option value="">Select a country…</option>'+countries.map(c=>'<option value="'+e(c.code)+'">'+e(c.name)+'</option>').join('');
   root.querySelector('[data-culture-map-status]').textContent=countries.length+' mapped countries and territories';
   paintMap();paintPanel();
  }catch(err){
   if(removed)return;
   mapStatus.textContent='Map data could not load. Please check your connection and reload.';
   panel.innerHTML='<h3>Could not open the map</h3><p>The country boundaries could not be downloaded. Other homepage features are unaffected.</p>';
  }
 };
 paintPanel();
 if(typeof IntersectionObserver!=='undefined'){
  const observer=new IntersectionObserver(entries=>{if(entries.some(item=>item.isIntersecting)){observer.disconnect();void boot();}},{rootMargin:'280px'});
  observer.observe(root);
  return ()=>{removed=true;cancelRegions();cancelSub();cancelTribal();cancelPlace();viewport?.destroy();document.removeEventListener('fullscreenchange',onFullscreenChange);observer.disconnect();};
 }
 void boot();
 return ()=>{removed=true;cancelRegions();cancelSub();cancelTribal();cancelPlace();viewport?.destroy();document.removeEventListener('fullscreenchange',onFullscreenChange);};
}
