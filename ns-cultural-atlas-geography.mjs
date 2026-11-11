/* Geographic services are deliberately separate from cultural articles.
 * geoBoundaries provides modern civil administrative units; Census AIANNHA
 * supplies a distinct US Indigenous-land/statistical geography layer.
 * Neither is a full map of Indigenous homelands or a sovereignty ruling.
 */
export const GEOBOUNDARIES_API='https://www.geoboundaries.org/api/current/gbOpen/';
export const CENSUS_TRIBAL_LAYER='https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/AIANNHA/MapServer/47';
export const OSM_PLACE_SEARCH='https://nominatim.openstreetmap.org/search';

export const US_COUNTY_LAYER='https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1';
// US Census two-digit state/territory codes, including DC and populated territories.
export const US_STATE_FIPS=Object.freeze({
 Alabama:'01',Alaska:'02',Arizona:'04',Arkansas:'05',California:'06',Colorado:'08',Connecticut:'09',
 Delaware:'10','District of Columbia':'11',Florida:'12',Georgia:'13',Hawaii:'15',Idaho:'16',Illinois:'17',
 Indiana:'18',Iowa:'19',Kansas:'20',Kentucky:'21',Louisiana:'22',Maine:'23',Maryland:'24',
 Massachusetts:'25',Michigan:'26',Minnesota:'27',Mississippi:'28',Missouri:'29',Montana:'30',
 Nebraska:'31',Nevada:'32','New Hampshire':'33','New Jersey':'34','New Mexico':'35','New York':'36',
 'North Carolina':'37','North Dakota':'38',Ohio:'39',Oklahoma:'40',Oregon:'41',Pennsylvania:'42',
 'Rhode Island':'44','South Carolina':'45','South Dakota':'46',Tennessee:'47',Texas:'48',Utah:'49',
 Vermont:'50',Virginia:'51',Washington:'53','West Virginia':'54',Wisconsin:'55',Wyoming:'56',
 'American Samoa':'60',Guam:'66','Northern Mariana Islands':'69','Puerto Rico':'72','U.S. Virgin Islands':'78',
 'United States Virgin Islands':'78'
});
const polygonSets=g=>g?.type==='Polygon'?[g.coordinates]:g?.type==='MultiPolygon'?g.coordinates:[];
export function ringContains(point,ring){
 const [x,y]=point;let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [xi,yi]=ring[i],[xj,yj]=ring[j];
  if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
 }
 return inside;
}
export function geometryContains(g,point){
 return polygonSets(g).some(poly=>poly.length&&ringContains(point,poly[0])&&!poly.slice(1).some(hole=>ringContains(point,hole)));
}
export function geometryCentre(geometry){
 let ring=null,maxArea=-1;
 for(const poly of polygonSets(geometry))for(const r of poly.slice(0,1)){
  if(r.length>maxArea){ring=r;maxArea=r.length;}
 }
 if(!ring)return null;
 let minX=180,maxX=-180,minY=90,maxY=-90;
 for(const [lon,lat] of ring){minX=Math.min(minX,lon);maxX=Math.max(maxX,lon);minY=Math.min(minY,lat);maxY=Math.max(maxY,lat);}
 const mid=[(minX+maxX)/2,(minY+maxY)/2];
 if(geometryContains(geometry,mid))return mid;
 // A vertex may be on the border; interior nearby samples are more reliable.
 for(let i=0;i<ring.length;i+=Math.max(1,Math.floor(ring.length/12))){
  const p=[ring[i][0]*.9+mid[0]*.1,ring[i][1]*.9+mid[1]*.1];
  if(geometryContains(geometry,p))return p;
 }
 return ring[0];
}
export function filterAdministrativeChildren(children,parent){
 if(!parent)return children;
 return children.filter(child=>{
  const centre=geometryCentre(child.geometry);
  if(centre&&geometryContains(parent.geometry,centre))return true;
  // Some thin/coastal polygons have a centre outside the parent due to simplification.
  return polygonSets(child.geometry).some(poly=>poly[0]?.some((p,i)=>i%Math.max(1,Math.floor(poly[0].length/12))===0&&geometryContains(parent.geometry,p)));
 });
}
export function mapDegreesToAtlas(lon,lat){return [(lon+180)*(960/360),(90-lat)*(480/180)];}
export function atlasViewDegrees(v){
 const west=v.x*(360/960)-180,east=(v.x+v.w)*(360/960)-180;
 const north=90-v.y*(180/480),south=90-(v.y+v.h)*(180/480);
 return [west,south,east,north];
}
const checkResponse=async(response,label)=>{
 if(!response?.ok)throw Error(label+' request failed');
 return response.json();
};
export async function fetchAdministrativeLayer(fetcher,code,level,{signal}={}){
 if(!/^[A-Z]{3}$/.test(code)||!/^ADM[1-5]$/.test(level))throw Error('Unsupported administrative layer');
 const options=signal?{signal}:{};
 const meta=await checkResponse(await fetcher(GEOBOUNDARIES_API+encodeURIComponent(code)+'/'+level+'/',options),'Boundary metadata');
 const url=meta.simplifiedGeometryGeoJSON||meta.gjDownloadURL;
 if(typeof url!=='string'||!url.startsWith('https://'))throw Error('No geographic shapes supplied');
 // geoBoundaries release files are held in Git LFS; github.com/raw may redirect
 // to media.githubusercontent.com, while raw.githubusercontent.com can expose an
 // LFS pointer instead of the GeoJSON. Retry the official Git LFS media path.
 const alternatives=[url];
 if(url.startsWith('https://github.com/wmgeolab/geoBoundaries/raw/')){
  alternatives.push(url.replace('https://github.com/wmgeolab/geoBoundaries/raw/','https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/'));
 }
 let lastError=Error('Boundary shapes unavailable');
 for(const candidate of alternatives){
  try{
   const data=await checkResponse(await fetcher(candidate,options),'Boundary shapes');
   if(data?.type==='FeatureCollection'&&Array.isArray(data.features))return {data,meta};
   lastError=Error('Boundary provider returned a non-GeoJSON payload');
  }catch(err){if(signal?.aborted)throw err;lastError=err;}
 }
 throw lastError;
}
export async function fetchUSCounties(fetcher,stateName,{signal}={}){
 const code=US_STATE_FIPS[String(stateName).trim()];
 if(!code)throw Error('US Census state identifier not available for this area.');
 const params=new URLSearchParams({
  where:"STATE='"+code+"'",outFields:'NAME,STATE,COUNTY,GEOID',returnGeometry:'true',
  outSR:'4326',geometryPrecision:'3',maxAllowableOffset:'0.015',f:'geojson',resultRecordCount:'500'
 });
 const response=await fetcher(US_COUNTY_LAYER+'/query?'+params.toString(),signal?{signal}:{});
 const data=await checkResponse(response,'US Census county layer');
 if(data?.error||data?.type!=='FeatureCollection'||!Array.isArray(data.features))
  throw Error('US Census county data unavailable.');
 if(data.exceededTransferLimit||data.features.length>=500)throw Error('County response exceeded its coverage limit.');
 return {data,source:'US Census TIGERweb, January 2026'};
}
export async function fetchUSIndigenousAreas(fetcher,view,{signal}={}){
 // National layer is too large to draw in one request; request only a zoomed viewport.
 if(view.w>165)throw Error('Zoom closer to a US state to inspect Indigenous land areas.');
 const [west,south,east,north]=atlasViewDegrees(view);
 const params=new URLSearchParams({
  where:'1=1',geometry:[west,south,east,north].join(','),
  geometryType:'esriGeometryEnvelope',inSR:'4326',outSR:'4326',
  spatialRel:'esriSpatialRelIntersects',outFields:'*',returnGeometry:'true',
  geometryPrecision:'3',maxAllowableOffset:'0.02',f:'geojson',resultRecordCount:'500'
 });
 const response=await fetcher(CENSUS_TRIBAL_LAYER+'/query?'+params.toString(),signal?{signal}:{});
 const data=await checkResponse(response,'Census Indigenous areas');
 if(data?.error||!Array.isArray(data.features))throw Error('Census boundary service did not return geographic areas.');
 return {features:data.features.filter(f=>polygonSets(f.geometry).length),partial:Boolean(data.exceededTransferLimit)||data.features.length>=500};
}
export async function searchMapPlaces(fetcher,query,country,{signal}={}){
 const q=String(query||'').trim();
 if(q.length<3||q.length>100)throw Error('Enter a place name of at least 3 characters.');
 // Explicit search only: no automatic requests while the user types.
 const params=new URLSearchParams({q:q+', '+country.name,format:'jsonv2',addressdetails:'1',limit:'8'});
 const response=await fetcher(OSM_PLACE_SEARCH+'?'+params.toString(),signal?{signal,headers:{'Accept':'application/json'}}:{headers:{'Accept':'application/json'}});
 const data=await checkResponse(response,'OpenStreetMap place search');
 if(!Array.isArray(data))throw Error('Invalid place search response');
 return data.filter(item=>Number.isFinite(Number(item.lon))&&Number.isFinite(Number(item.lat))).map(item=>({
  id:String(item.place_id),name:String(item.display_name||item.name||q),lat:Number(item.lat),lon:Number(item.lon),
  kind:String(item.type||item.addresstype||'place')
 }));
}
