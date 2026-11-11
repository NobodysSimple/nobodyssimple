import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('the culture map appears last on the homepage and country selection opens source-backed reading',async({page})=>{
 await page.goto('/index.html#home');
 const atlas=page.locator('#ns-home-culture-map');
 await expect(atlas).toBeAttached();
 const atBottom=await atlas.evaluate(el=>el===el.parentElement.lastElementChild);
 expect(atBottom).toBe(true);
 await atlas.scrollIntoViewIfNeeded();
 await expect(atlas.locator('[data-culture-map] [data-culture-code="ESP"]')).toBeAttached({timeout:20000});
 await atlas.locator('[data-culture-country]').selectOption('ESP');
 await expect(atlas.locator('[data-culture-map] [data-culture-code="ESP"]')).toHaveClass(/is-selected/);
 await expect(atlas.locator('[data-culture-panel-content] h3')).toContainText('Castells');
 await expect(atlas.locator('.ns-culture-source')).toHaveAttribute('href',/ich.unesco.org/);
 await expect(atlas.locator('[data-culture-reset]')).toBeEnabled();
 await atlas.locator('[data-culture-reset]').click();
 await expect(atlas.locator('[data-culture-map] [data-culture-code="ESP"]')).not.toHaveClass(/is-selected/);
 await expect(atlas.locator('[data-culture-panel-content]')).toContainText('Every place has more than one story');
});
test('first-level provinces are displayed and the selected region changes colour',async({page})=>{
 await page.route('https://www.geoboundaries.org/api/current/gbOpen/ESP/ADM1/',route=>
  route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({
   simplifiedGeometryGeoJSON:'https://example.test/cultural-atlas/esp-admin1.geojson',boundaryLicense:'CC BY 4.0'
  })}));
 await page.route('https://example.test/cultural-atlas/esp-admin1.geojson',route=>
  route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({
   type:'FeatureCollection',features:[
    {type:'Feature',properties:{shapeName:'Catalonia'},geometry:{type:'Polygon',coordinates:[[[0,40],[3,40],[3,43],[0,40]]]}},
    {type:'Feature',properties:{shapeName:'Andalusia'},geometry:{type:'Polygon',coordinates:[[[-7,36],[-2,36],[-2,39],[-7,36]]]}}
   ]
  })}));
 await page.goto('/index.html#home');
 const atlas=page.locator('#ns-home-culture-map');
 await atlas.scrollIntoViewIfNeeded();
 await expect(atlas.locator('[data-culture-country] option')).not.toHaveCount(1,{timeout:20000});
 await atlas.locator('[data-culture-country]').selectOption('ESP');
 await expect(atlas.locator('[data-culture-region-id]')).toHaveCount(2);
 await atlas.locator('[data-culture-region]').selectOption({label:'Catalonia'});
 await expect(atlas.locator('[data-culture-region-id].is-selected')).toHaveCount(1);
 await expect(atlas.locator('[data-culture-map-status]')).toContainText('Catalonia');
 await expect(atlas.locator('[data-culture-panel-content]')).toContainText('Catalonia');
});
test('random country discovery picks published articles and unresearched places are not stereotyped',async({page})=>{
 await page.goto('/index.html#home');
 const atlas=page.locator('#ns-home-culture-map');
 await atlas.scrollIntoViewIfNeeded();
 await expect(atlas.locator('[data-culture-country] option')).not.toHaveCount(1,{timeout:20000});
 await atlas.locator('[data-culture-random]').first().click();
 await expect(atlas.locator('.ns-culture-story-body p').first()).toBeVisible();
 await atlas.locator('[data-culture-country]').selectOption('NOR');
 await expect(atlas.locator('[data-culture-panel-content]')).toContainText('Stories for');
 await expect(atlas.locator('[data-culture-panel-content]')).toContainText('have not published');
 const accessibility=await new AxeBuilder({page}).include('#ns-home-culture-map').analyze();
 expect(accessibility.violations).toEqual([]);
});

test('map can be zoomed with buttons, a mouse wheel and keyboard without resetting the chosen country',async({page})=>{
 await page.goto('/index.html#home');
 const atlas=page.locator('#ns-home-culture-map');
 await atlas.scrollIntoViewIfNeeded();
 const svg=atlas.locator('[data-culture-map]');
 await expect(atlas.locator('[data-culture-country] option')).not.toHaveCount(1,{timeout:20000});
 const before=await svg.getAttribute('viewBox');
 await atlas.locator('[data-culture-zoom-in]').click();
 const zoomed=await svg.getAttribute('viewBox');
 expect(zoomed).not.toEqual(before);
 await atlas.locator('[data-culture-zoom-out]').click();
 await expect(svg).toHaveAttribute('viewBox',before);
 await svg.focus();
 await page.keyboard.press('+');
 expect(await svg.getAttribute('viewBox')).not.toEqual(before);
 await page.keyboard.press('Home');
 await expect(svg).toHaveAttribute('viewBox',before);
 await atlas.locator('[data-culture-country]').selectOption('GBR');
 expect(await svg.getAttribute('viewBox')).not.toEqual(before);
 await svg.hover();
 await page.mouse.wheel(0,-500);
 await expect(atlas.locator('[data-culture-country]')).toHaveValue('GBR');
});
test('UK country layer includes Scotland and England; the following layer can reveal Cornwall',async({page})=>{
 const meta=level=>({simplifiedGeometryGeoJSON:'https://example.test/atlas-gbr-'+level+'.geojson',boundaryLicense:'CC BY 4.0'});
 for(const level of ['ADM1','ADM2']){
  await page.route('https://www.geoboundaries.org/api/current/gbOpen/GBR/'+level+'/',route=>
   route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(meta(level))}));
 }
 const box=(name,x0,y0,x1,y1)=>({type:'Feature',properties:{shapeName:name},
  geometry:{type:'Polygon',coordinates:[[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]]}});
 await page.route('https://example.test/atlas-gbr-ADM1.geojson',route=>route.fulfill({status:200,contentType:'application/json',
  headers:{'access-control-allow-origin':'*'},body:JSON.stringify({type:'FeatureCollection',features:[
   box('England',-6,50,2,55),box('Scotland',-6,55,0,59),box('Wales',-5,51,-3,54),box('Northern Ireland',-8,54,-6,55)
  ]})}));
 await page.route('https://example.test/atlas-gbr-ADM2.geojson',route=>route.fulfill({status:200,contentType:'application/json',
  headers:{'access-control-allow-origin':'*'},body:JSON.stringify({type:'FeatureCollection',features:[
   box('Cornwall',-5.8,50.1,-4.3,50.9),box('Highland',-5.5,56,-4.5,57)
  ]})}));
 await page.goto('/index.html#home');
 const atlas=page.locator('#ns-home-culture-map');
 await atlas.scrollIntoViewIfNeeded();
 await expect(atlas.locator('[data-culture-country] option')).not.toHaveCount(1,{timeout:20000});
 await atlas.locator('[data-culture-country]').selectOption('GBR');
 await expect(atlas.locator('[data-culture-region] option')).toHaveCount(5);
 await atlas.locator('[data-culture-region]').selectOption({label:'Scotland'});
 await expect(atlas.locator('.ns-culture-reading h3')).toContainText('Scottish Gaelic');
 await atlas.locator('[data-culture-region]').selectOption({label:'England'});
 await atlas.locator('[data-culture-sub-load]').click();
 await expect(atlas.locator('[data-culture-subregion] option')).toHaveCount(2);
 await atlas.locator('[data-culture-subregion]').selectOption({label:'Cornwall'});
 await expect(atlas.locator('.ns-culture-reading h3')).toContainText('Kernewek');
});
