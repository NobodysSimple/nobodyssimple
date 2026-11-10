import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WORLD_COUNTRY_DATA,geoPath,featureBounds,countryViewBox,normaliseCountryData,normaliseRegions,regionArticles} from '../../ns-cultural-atlas.mjs';
import {CULTURE_ARTICLES,articlesForCountry,articleCountries,articleById} from '../../ns-cultural-atlas-articles.mjs';

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
 assert.ok(CULTURE_ARTICLES.length>=47);
 assert.ok(articleCountries.length>=36);
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
 assert.equal(articlesForCountry('USA').length,0,'do not fabricate traditions for countries not yet covered');
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
