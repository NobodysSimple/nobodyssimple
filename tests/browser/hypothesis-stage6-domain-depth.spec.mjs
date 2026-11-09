import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function choose(page,id){
 await expect(page.locator('[data-hypo-drill-answer="'+id+'"]')).toBeVisible();
 await page.locator('[data-hypo-drill-answer="'+id+'"]').click();
}
async function beginCategory(page,category,cluster,leaf){
 await page.goto('/index.html#hypothesis');
 await page.locator('.ns-hypo-all-areas > summary').click();
 await page.locator('[data-hypo-category="'+category+'"]').click();
 for(const id of [cluster,leaf,'yes','mostly_neutral','personal_preference','with_other_people'])
  await choose(page,id);
 await expect(page.locator('[data-hypo-domain-start]')).toBeVisible();
 await page.locator('[data-hypo-domain-start]').click();
 await expect(page.locator('.ns-hypo-domain')).toBeVisible();
}
async function reply(page,value,quote=''){
 const input=page.locator('[data-hypo-domain-words]');
 await expect(input).toBeVisible();
 if(quote)await input.fill(quote);
 await page.locator('[data-hypo-domain-answer="'+value+'"]').click();
}
test('an unreviewed real-life area investigates specific contributing factors, instead of only sorting',async({page})=>{
 await beginCategory(page,'DIGITAL','DIGITAL-GAMES','DIGITAL-GAMES-VALUED-ONLINE-FRIENDSHIPS');
 await expect(page.locator('.ns-hypo-domain #ns-hypo-question')).toContainText('valued online friendships');
 await reply(page,'factor3','I make meaningful friendships online');
 await expect(page.locator('.ns-hypo-domain #ns-hypo-question')).toContainText('condition is less present');
 await reply(page,'easier','The experience changes when my offline friendships improve');
 await reply(page,'extra1','My real-life friends are not always available');
 await page.locator('[data-hypo-domain-stop]').click();
 const report=page.locator('.ns-hypo-depth-map');
 await expect(report).toContainText('I make meaningful friendships online');
 await expect(report).toContainText('The experience changes when my offline friendships improve');
 await expect(report).toContainText('More than one influence may be involved');
 await expect(report).toContainText('What would challenge it?');
 const node=page.locator('.ns-hypo-graph-branches [data-hypo-node]').first();
 await expect(node).toBeVisible();
 await node.click();
 await expect(page.locator('[data-hypo-node-editor]')).toContainText('I make meaningful friendships online');
 const audit=await new AxeBuilder({page}).include('.ns-hypo-shell')
  .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(x=>['serious','critical'].includes(x.impact)).map(x=>x.id)).toEqual([]);
});
test('a persistent external housing condition can challenge a simplistic internal-cause explanation',async({page})=>{
 await beginCategory(page,'MONEY','MONEY-HOUSING','MONEY-HOUSING-RENT-INSECURITY');
 await reply(page,'factor1','My income is too low to pay the rent');
 await reply(page,'same','Even in a calmer mood, the rent remains unaffordable');
 await page.locator('[data-hypo-domain-stop]').click();
 await expect(page.locator('.ns-hypo-depth-map')).toContainText('Even in a calmer mood, the rent remains unaffordable');
 await expect(page.locator('.ns-hypo-depth-counters')).toContainText('The first explanation is not sufficient');
 await expect(page.locator('.ns-hypo-depth-map')).not.toContainText('Your thoughts are the cause');
});
test('urgent harm and coercion stay safety-first',async({page})=>{
 await page.goto('/index.html#hypothesis');
 await page.locator('.ns-hypo-all-areas > summary').click();
 await page.locator('[data-hypo-category="SAFETY"]').click();
 await expect(page.locator('.ns-hypo-safety-page')).toBeVisible();
 await expect(page.locator('[data-hypo-domain-start]')).toHaveCount(0);
});
