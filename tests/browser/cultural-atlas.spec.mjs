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
 await atlas.locator('[data-culture-country]').selectOption('USA');
 await expect(atlas.locator('[data-culture-panel-content]')).toContainText('Stories for');
 await expect(atlas.locator('[data-culture-panel-content]')).toContainText('have not published');
 const accessibility=await new AxeBuilder({page}).include('#ns-home-culture-map').analyze();
 expect(accessibility.violations).toEqual([]);
});
