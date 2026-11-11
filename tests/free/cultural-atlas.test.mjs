import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WORLD_COUNTRY_DATA,geoPath,featureBounds,countryViewBox,normaliseCountryData,normaliseRegions,regionArticles} from '../../ns-cultural-atlas.mjs';
import {CULTURE_ARTICLES,articlesForCountry,articleCountries,articleById} from '../../ns-cultural-atlas-articles.mjs';
import {WORLD_VIEW,clampAtlasView,zoomAtlasView,panAtlasView,fitAtlasBounds} from '../../ns-cultural-atlas-viewport.mjs';
import {filterAdministrativeChildren,geometryContains,atlasViewDegrees,fetchUSIndigenousAreas,fetchUSCounties,US_STATE_FIPS,searchMapPlaces,fetchAdministrativeLayer} from '../../ns-cultural-atlas-geography.mjs';

const source=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const world=JSON.parse(source(WORLD_COUNTRY_DATA));
const countries=normaliseCountryData(world);

test('the atlas includes a selectable world map with small states and territories retained',()=>{
 assert.equal(world.type,'FeatureCollection');
 assert.ok(countries.length>=250,'expect the full-resolution 258-feature administrative world catalogue');
 assert.equal(new Set(countries.map(c=>c.code)).size,countries.length,'no selectable country ID collisions');
 for(const code of ['USA','GBR','MEX','IND','JPN','BRA','GHA','ESP','FRA','CHN','FIN','MAR','KOR','IDN']){
  const c=countries.find(c=>c.code===code);
  assert.ok(c,'missing '+code);
  assert.ok(geoPath(c.geometry).includes('M'),code);
  assert.ok(featureBounds(c)?.length===4,code);
  assert.ok(countryViewBox(c).split(' ').length===4,code);
 }
});
test('cultural readings use documentary sources and distinguish place from a psychological claim',()=>{
 assert.ok(CULTURE_ARTICLES.length>=67);
 assert.ok(articleCountries.length>=50);
 for(const a of CULTURE_ARTICLES){
  assert.ok(countries.some(c=>c.code===a.country),a.id+' country missing');
  assert.ok(a.body.length>=3&&a.body.every(p=>p.length>100),a.id+' missing article');
  assert.ok(a.reflection.length>50&&a.question.endsWith('?'),a.id+' missing psychological takeaway');
  assert.ok(a.source.url.startsWith('https://'),a.id+' missing reference');
  assert.equal(articleById(a.id),a);
  assert.ok(articlesForCountry(a.country).includes(a));
 }
 assert.equal(new Set(CULTURE_ARTICLES.map(a=>a.id)).size,CULTURE_ARTICLES.length);
 assert.equal(regionArticles('IND','Gujarat')[0].id,'garba');
 assert.equal(regionArticles('JPN','Hokkaidō')[0].id,'ainu-dance');
 assert.equal(regionArticles('ESP','Catalonia')[0].id,'castells');
 assert.equal(regionArticles('ESP','Andalusia')[0].id,'flamenco');
 assert.equal(regionArticles('KOR','Jeju')[0].id,'haenyeo');
 assert.equal(regionArticles('PER','Puno')[0].id,'taquile');
 assert.equal(regionArticles('BRA','Pernambuco')[0].id,'frevo');
 assert.equal(articlesForCountry('IND').length,3);
 assert.equal(articlesForCountry('MEX').length,2);
 assert.equal(articlesForCountry('MAR').length,2);
 assert.equal(articleById('tango-argentina').source.url,articleById('tango-uruguay').source.url,'transnational heritage has a shared documentary source');
 assert.ok(articlesForCountry('USA').length>=2);
 assert.equal(regionArticles('GBR','Scotland')[0].id,'gaelic-stories');
 assert.equal(regionArticles('GBR','Cornwall')[0].id,'cornish-language');
 assert.equal(regionArticles('GBR','Wales')[0].id,'welsh-eisteddfod');
 assert.equal(regionArticles('USA','Oklahoma')[0].id,'cherokee-language');
 assert.equal(regionArticles('USA','Louisiana')[0].id,'new-orleans-jazz');
 assert.equal(regionArticles('AUS','Victoria')[0].id,'budj-bim');
 for(const id of ['matariki','vanuatu-sand','tonga-lakalaka','kankurang-senegal','kankurang-gambia']){
  assert.ok(articleById(id),id+' must be published');
 }
 assert.equal(articleById('cherokee-language').source.label,'Cherokee Nation');
});
test('administrative regions have independent clickable geometries',()=>{
 const regionData={type:'FeatureCollection',features:[
  {type:'Feature',properties:{shapeName:'Catalonia'},geometry:{type:'Polygon',coordinates:[[[0,40],[3,40],[3,43],[0,40]]]}},
  {type:'Feature',properties:{shapeName:'Andalusia'},geometry:{type:'Polygon',coordinates:[[[-7,36],[-2,36],[-2,39],[-7,36]]]}}
 ]};
 const regions=normaliseRegions(regionData);
 assert.equal(regions.length,2);
 assert.equal(regions[0].name,'Andalusia');
 assert.equal(regions[1].name,'Catalonia');
 assert.ok(regions.every(r=>geoPath(r.geometry).includes('M')));
});
test('culture discovery is at the bottom of the homepage, not a separate tab',()=>{
 const strategy=source('strategy.mjs');
 const index=source('index.html');
 const sw=source('sw.js');
 assert.ok(strategy.includes("renderCultureAtlas(root.querySelector('#ns-home-culture-map'))"));
 assert.ok(strategy.indexOf('id="ns-home-culture-map"')>strategy.indexOf('class="ns-home-shortcuts"'));
 assert.ok(index.includes('ns-cultural-atlas.css'));
 assert.ok(sw.includes('ns-cultural-atlas.mjs'));
 assert.ok(!sw.includes("'data/culture-world-countries.geojson'"),'country polygons should lazy-load');
});

test('map zoom is continuous but remains inside the world, with deterministic pan and reset',()=>{
 const near=zoomAtlasView(WORLD_VIEW,4,.25,.75);
 assert.equal(near.w,240);assert.equal(near.h,120);
 assert.equal(near.x,180);assert.equal(near.y,270);
 const moved=panAtlasView(near,20,-45);
 assert.equal(moved.x,200);assert.equal(moved.y,225);
 assert.deepEqual(zoomAtlasView(WORLD_VIEW,.001),WORLD_VIEW);
 assert.equal(zoomAtlasView(WORLD_VIEW,999999).w,8);
 assert.deepEqual(clampAtlasView({x:-10000,y:10000,w:960}),WORLD_VIEW);
 const london=fitAtlasBounds([475,135,476,136]);
 assert.ok(london.w>=8&&london.w<=20);
 assert.equal(atlasViewDegrees(WORLD_VIEW)[0],-180);
});
test('subregions are geographically filtered instead of treating every district as part of the chosen state',()=>{
 const mk=(name,x,y)=>({name,geometry:{type:'Polygon',coordinates:[[[x,y],[x+1,y],[x+1,y+1],[x,y+1],[x,y]]]}});
 const england=mk('England',-4,50),cornwall=mk('Cornwall',-4,50),scottishDistrict=mk('Scotland county',-5,57);
 assert.equal(geometryContains(england.geometry,[-3.5,50.5]),true);
 assert.deepEqual(filterAdministrativeChildren([cornwall,scottishDistrict],england).map(x=>x.name),['Cornwall']);
});
test('the US Indigenous layer uses a geographically bounded 2026 Census service and distinguishes partial results',async()=>{
 let url='';
 const fetcher=async input=>{
  url=input;
  return {ok:true,json:async()=>({type:'FeatureCollection',features:[{
   type:'Feature',properties:{NAME:'Example reservation'},geometry:{type:'Polygon',coordinates:[[[-111,35],[-110,35],[-110,36],[-111,35]]]}}
  }]})};
 };
 await assert.rejects(fetchUSIndigenousAreas(fetcher,WORLD_VIEW),/Zoom closer/);
 const result=await fetchUSIndigenousAreas(fetcher,{x:180,y:110,w:90,h:45});
 assert.equal(result.features.length,1);
 assert.ok(url.startsWith('https://tigerweb.geo.census.gov/'));
 assert.ok(url.includes('geometryType=esriGeometryEnvelope'));
 assert.ok(url.includes('outSR=4326'));
});
test('cities require an explicit search term, while geography supports ADM2 layers',async()=>{
 const calls=[];
 const fetcher=async url=>{
  calls.push(url);
  if(url.includes('/ADM2/'))return {ok:true,json:async()=>({simplifiedGeometryGeoJSON:'https://example.test/local.geojson'})};
  if(url.includes('local.geojson'))return {ok:true,json:async()=>({type:'FeatureCollection',features:[]})};
  return {ok:true,json:async()=>[{place_id:5,display_name:'Cornwall, United Kingdom',lon:'-4.8',lat:'50.2'}]};
 };
 await assert.rejects(searchMapPlaces(fetcher,'UK',{name:'United Kingdom'}),/at least 3 characters/);
 const places=await searchMapPlaces(fetcher,'Cornwall',{name:'United Kingdom'});
 assert.equal(places[0].lon,-4.8);
 assert.ok(calls[0].includes('nominatim.openstreetmap.org/search'));
 const {data}=await fetchAdministrativeLayer(fetcher,'GBR','ADM2');
 assert.equal(data.type,'FeatureCollection');
 assert.ok(calls.some(url=>url.includes('gbOpen/GBR/ADM2/')));
});

test('all 50 US states, DC and populated US territories have stable Census identifiers',()=>{
 const states=['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
 'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana',
 'Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana',
 'Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina',
 'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
 'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
 'Wisconsin','Wyoming'];
 assert.equal(states.length,50);
 assert.ok(states.every(state=>/^\\d{2}$/.test(US_STATE_FIPS[state])));
 for(const name of ['District of Columbia','Puerto Rico','Guam','American Samoa','Northern Mariana Islands','U.S. Virgin Islands']){
  assert.ok(US_STATE_FIPS[name],name);
 }
});
test('US county drilldown is state-filtered on the Census 2026 layer',async()=>{
 let url='';
 const response=await fetchUSCounties(async input=>{
  url=String(input);
  return {ok:true,json:async()=>({type:'FeatureCollection',features:[{
   type:'Feature',properties:{NAME:'Travis County',STATE:'48'},geometry:{type:'Polygon',coordinates:[[[-98,30],[-97,30],[-97,31],[-98,30]]]}}
  }]})};
 },'Texas');
 assert.equal(response.data.features.length,1);
 assert.ok(url.includes('State_County/MapServer/1/query'));
 assert.ok(decodeURIComponent(url).includes("STATE='48'"));
 assert.equal(response.source,'US Census TIGERweb, January 2026');
 await assert.rejects(fetchUSCounties(async()=>{throw Error('must not fetch')},'Atlantis'),/identifier not available/);
});
