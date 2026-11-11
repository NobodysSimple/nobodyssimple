import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('betrayal opens with recognition and its own four-injuries / four-directions framework',async({page})=>{
 await page.goto('/index.html#workbook-topic/betrayal-trauma');
 await expect(page.getByRole('heading',{name:/A trusted person has deeply violated my trust/i})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Does any of this sound familiar?'})).toBeVisible();
 await expect(page.getByText(/I keep revisiting what happened, looking for gaps/i)).toBeVisible();
 await expect(page.getByRole('heading',{name:'The four injuries that betrayal can affect'})).toBeVisible();
 await expect(page.locator('.ns-topic-aspects > li')).toHaveCount(4);
 await expect(page.getByRole('heading',{name:'Four areas of rebuilding'})).toBeVisible();
 await expect(page.locator('.ns-topic-steps > li')).toHaveCount(4);
 await expect(page.locator('.ns-pick-chooser')).toBeVisible();
 await expect(page.locator('[data-ns-games-host] .ns-game-carousel')).toBeVisible();
 await expect(page.locator('.ns-topic-faq-list details')).toHaveCount(5);
 await expect(page.locator('.ns-topic-ending')).toContainText(/not to erase what happened/);
});
test('optional profile never scores, predicts, saves or changes the topic URL',async({page})=>{
 await page.goto('/index.html#workbook-topic/betrayal-trauma');
 const before=page.url();
 const checks=page.locator('[data-topic-pattern]');
 await expect(checks).toHaveCount(4);
 await expect(page.locator('[data-topic-profile-result]')).toContainText('There is no correct combination');
 await checks.first().check();
 await expect(page.locator('[data-topic-profile-result]')).toContainText('You marked:');
 await expect(page.locator('[data-topic-profile-result]')).toContainText('not a diagnosis');
 await page.locator('[data-topic-clear]').click();
 await expect(checks.first()).not.toBeChecked();
 await expect(page.locator('[data-topic-profile-result]')).toContainText('There is no correct combination');
 await page.locator('[data-topic-jump="ns-pick-chooser"]').click();
 await expect(page.locator('.ns-pick-chooser')).toBeVisible();
 expect(page.url()).toBe(before);
 await page.reload();
 await expect(checks.first()).not.toBeChecked();
});
test('all existing tools, private worksheets and visual games still operate',async({page})=>{
 await page.goto('/index.html#workbook-topic/rumination');
 await expect(page.locator('.ns-topic-opening')).toBeVisible();
 await expect(page.locator('.ns-pick-chooser')).toBeVisible();
 await expect(page.locator('.ns-game-carousel')).toBeVisible();
 await page.locator('[data-pick-open="source-context-0"]').click();
 await expect(page.locator('dialog[data-pick-dialog]')).toBeVisible();
 await page.locator('[data-pick-choose="source-context-0"]').click();
 await expect(page.locator('[data-pick-field="condition"]')).toBeVisible();
 await page.locator('[data-pick-field="condition"]').fill('I have been replaying a conversation');
 await page.locator('[data-pick-review]').click();
 await expect(page.locator('[data-pick-output]')).toContainText('replaying a conversation');
 await expect(page.locator('.ns-game-carousel [data-game-open]').first()).toBeVisible();
});
test('identity and access pages do not treat identities or disability as conditions to cure',async({page})=>{
 for(const [topic,phrase] of [
  ['gender-identity-exploration','not problems to cure'],
  ['autism-understanding','poor fit between a person and their environment'],
  ['racial-discrimination','not problems to cure']]){
  await page.goto('/index.html#workbook-topic/'+topic);
  await expect(page.locator('.ns-topic-key-line')).toContainText(phrase);
  await expect(page.locator('.ns-pick-editorial-status')).toBeVisible();
  await expect(page.locator('.ns-topic-profile-options')).toBeVisible();
  await expect(page.locator('.ns-topic-faq-list')).toBeVisible();
 }
});
test('safety-first topics bypass self-assessment and games and lead with human support',async({page})=>{
 for(const topic of ['suicidal-thoughts','sexual-coercion','unsafe-home']){
  await page.goto('/index.html#workbook-topic/'+topic);
  await expect(page.locator('.ns-pick-care-first')).toBeVisible();
  await expect(page.locator('.ns-topic-safety-reading')).toBeVisible();
  await expect(page.locator('[data-topic-profile]')).toHaveCount(0);
  await expect(page.locator('.ns-pick-chooser')).toHaveCount(0);
  await expect(page.locator('[data-ns-games-host]')).toHaveCount(0);
  await expect(page.locator('.ns-pick-care-actions a[href="#need/support-safety"]')).toBeVisible();
 }
});
test('small screens have readable single-column content and serious accessibility checks pass',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/index.html#workbook-topic/betrayal-trauma');
 await expect(page.locator('.ns-topic-recognition')).toBeVisible();
 const columns=await page.locator('.ns-topic-aspects').evaluate(el=>getComputedStyle(el).gridTemplateColumns);
 expect(columns.trim().split(/\s+/).length).toBe(1);
 const audit=await new AxeBuilder({page}).include('.ns-pick-topic-layout').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.filter(v=>['serious','critical'].includes(v.impact)),
  JSON.stringify(audit.violations.map(v=>({id:v.id,impact:v.impact})),null,2)).toEqual([]);
});
