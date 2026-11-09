import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openTrack(page,track){
 await page.goto('/index.html#hypothesis');
 await expect(page.locator('[data-hypothesis-generator]')).toBeVisible();
 await page.locator('[data-hypo-track="'+track+'"]').click();
 await expect(page.locator('.ns-hypo-drill')).toBeVisible();
}
const choose=async(page,id)=>page.locator('[data-hypo-drill-answer="'+id+'"]').click();
test('Nobody narrows from identity to shaving legs, records personal meaning and shows exact graph evidence',async({page})=>{
 await openTrack(page,'identity');
 await expect(page.locator('#ns-hypo-question')).toContainText('personal identity');
 await choose(page,'IDENTITY-GROOMING');
 await expect(page.locator('#ns-hypo-question')).toContainText('grooming and body hair');
 await choose(page,'IDENTITY-GROOMING-SHAVING-LEGS');
 await expect(page.locator('#ns-hypo-question')).toContainText('shaving legs');
 await choose(page,'yes');
 await choose(page,'mostly_enjoyable');
 await choose(page,'social_expectation');
 await choose(page,'with_other_people');
 await expect(page.locator('.ns-hypo-drill')).toHaveCount(0);
 await expect(page.locator('[data-hypo-answer]')).toHaveCount(5);
 for(let i=0;i<4;i++)await page.locator('[data-hypo-answer="probably"]').click();
 await page.locator('[data-hypo-results]').click();
 const graph=page.locator('.ns-hypo-graph');
 await expect(graph).toContainText('shaving legs');
 await expect(graph).toContainText('Mostly enjoyable');
 await expect(graph).toContainText('Other people');
 await expect(graph).toContainText('With other people');
 await expect(page.locator('[data-hypo-node="presenting"]')).toContainText('shaving legs');
 expect(await graph.innerText()).not.toMatch(/you are transgender|you must be gay|attachment wound/i);
});
test('negative confirmation and unsure stay outside the graph; back undoes exact facts',async({page})=>{
 await openTrack(page,'identity');
 await choose(page,'IDENTITY-CLOTHES');
 await choose(page,'IDENTITY-CLOTHES-WEARING-SKIRTS');
 await choose(page,'no');
 await expect(page.locator('#ns-hypo-question')).toContainText('specific experience');
 await choose(page,'IDENTITY-CLOTHES-WEARING-DRESSES');
 await choose(page,'yes');
 await choose(page,'mostly_neutral');
 await page.locator('[data-hypo-back]').click();
 await expect(page.locator('#ns-hypo-question')).toContainText('How would you describe');
 await choose(page,'prefer_not');
 await choose(page,'unsure');
 await choose(page,'unclear');
 for(let i=0;i<3;i++)await page.locator('[data-hypo-answer="unsure"]').click();
 await page.locator('[data-hypo-results]').click();
 const graph=page.locator('.ns-hypo-graph');
 await expect(graph).toContainText('wearing dresses');
 await expect(graph).not.toContainText('wearing skirts');
 await expect(graph).not.toContainText('Mostly neutral');
});
test('concerning physical-health branches go to support before any psychological scoring',async({page})=>{
 await openTrack(page,'fatigue');
 await choose(page,'HEALTH-ALARM');
 await expect(page.locator('.ns-hypo-safety-page')).toBeVisible();
 await expect(page.locator('.ns-hypo-safety-page')).toContainText('physical health');
 await page.locator('[data-hypo-back]').click();
 await expect(page.locator('.ns-hypo-drill')).toBeVisible();
 await expect(page.locator('[data-hypo-drill-answer="HEALTH-ALARM"]')).toBeVisible();
});
test('any route can skip optional specificity and remain within the existing interview',async({page})=>{
 await openTrack(page,'procrastination');
 await expect(page.locator('[data-hypo-drill-skip]')).toBeVisible();
 await page.locator('[data-hypo-drill-skip]').click();
 await expect(page.locator('[data-hypo-answer]')).toHaveCount(5);
 await expect(page.locator('.ns-hypo-drill')).toHaveCount(0);
});
test('mobile broad-to-specific questions and graph remain operable and WCAG-critical clear',async({page})=>{
 await openTrack(page,'identity');
 const audit=async title=>{
  const size=await page.locator('.ns-hypo-shell').evaluate(el=>({
   width:el.clientWidth,scrollWidth:el.scrollWidth,
   left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,
   viewport:innerWidth
  }));
  expect(size.scrollWidth,title).toBeLessThanOrEqual(size.width+2);
  expect(size.left,title).toBeGreaterThanOrEqual(-2);
  expect(size.right,title).toBeLessThanOrEqual(size.viewport+2);
  const scan=await new AxeBuilder({page}).include('.ns-hypo-shell')
   .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const serious=scan.violations.filter(x=>['critical','serious'].includes(x.impact));
  expect(serious,JSON.stringify(serious.map(x=>({id:x.id,targets:x.nodes.map(n=>n.target)})))).toEqual([]);
 };
 await audit('category step');
 await choose(page,'IDENTITY-GROOMING');
 await audit('specific step');
 await choose(page,'IDENTITY-GROOMING-SHAVING-LEGS');
 await choose(page,'yes');
 await choose(page,'mostly_enjoyable');
 await choose(page,'personal_preference');
 await choose(page,'mostly_private');
 for(let i=0;i<4;i++)await page.locator('[data-hypo-answer="probably"]').click();
 await page.locator('[data-hypo-results]').click();
 await audit('graph');
});

test('all 21 original atlas categories are available without a textbox, including other life issues',async({page})=>{
 await page.goto('/index.html#hypothesis');
 await page.locator('.ns-hypo-all-areas > summary').click();
 await expect(page.locator('[data-hypo-category]')).toHaveCount(21);
 await page.locator('[data-hypo-category="DIGITAL"]').click();
 await expect(page.locator('#ns-hypo-question')).toContainText('digital life');
 await page.locator('[data-hypo-drill-answer="DIGITAL-GAMES"]').click();
 await expect(page.locator('#ns-hypo-question')).toContainText('gaming and entertainment');
 await page.locator('[data-hypo-drill-answer="DIGITAL-GAMES-VALUED-ONLINE-FRIENDSHIPS"]').click();
 await expect(page.locator('#ns-hypo-question')).toContainText('valued online friendships');
 await page.locator('[data-hypo-back]').click();
 await expect(page.locator('[data-hypo-drill-answer="DIGITAL-GAMES-VALUED-ONLINE-FRIENDSHIPS"]')).toBeVisible();
});
test('generic overthinking starts by clarifying what type of concern, not assuming self-concept',async({page})=>{
 await openTrack(page,'overthinking');
 await expect(page.locator('#ns-hypo-question')).toContainText('thinking about');
 await page.locator('[data-hypo-drill-answer="CHECKING"]').click();
 await expect(page.locator('#ns-hypo-question')).toContainText('checking, repetition and reassurance');
});
test('safety category does not offer psychological classification before support',async({page})=>{
 await page.goto('/index.html#hypothesis');
 await page.locator('.ns-hypo-all-areas > summary').click();
 await page.locator('[data-hypo-category="SAFETY"]').click();
 await expect(page.locator('.ns-hypo-safety-page')).toBeVisible();
 await expect(page.locator('[data-hypo-answer]')).toHaveCount(0);
});

test('unreviewed digital-life route reports facts but abstains from unrelated causal guesses',async({page})=>{
 await page.goto('/index.html#hypothesis');
 await page.locator('.ns-hypo-all-areas > summary').click();
 await page.locator('[data-hypo-category="DIGITAL"]').click();
 for(const option of ['DIGITAL-GAMES','DIGITAL-GAMES-VALUED-ONLINE-FRIENDSHIPS',
  'yes','mostly_enjoyable','personal_preference','with_other_people'])
  await choose(page,option);
 await expect(page.locator('.ns-hypo-result-hero')).toBeVisible();
 await expect(page.locator('.ns-hypo-graph')).toContainText('valued online friendships');
 await expect(page.locator('.ns-hypo-graph-branches [data-hypo-node]')).toHaveCount(0);
 await expect(page.locator('.ns-hypo-full-evidence')).toHaveCount(0);
 await expect(page.locator('.ns-hypo-result-hero')).toContainText('does not yet have a reviewed explanatory interview');
 await expect(page.locator('.ns-hypo-final-buttons a[href="#navigate"]')).toHaveCount(1);
});

test('family intimidation route offers safety resources before exploring psychological mechanisms',async({page})=>{
 await page.goto('/index.html#hypothesis');
 await page.locator('.ns-hypo-all-areas > summary').click();
 await page.locator('[data-hypo-category="FAMILY"]').click();
 await choose(page,'FAMILY-SAFETY');
 await expect(page.locator('.ns-hypo-safety-page')).toBeVisible();
 await expect(page.locator('.ns-hypo-safety-links')).toContainText('domestic abuse');
 await expect(page.locator('.ns-hypo-graph')).toHaveCount(0);
});
