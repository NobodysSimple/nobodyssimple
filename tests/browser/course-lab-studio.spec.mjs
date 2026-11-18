import {test,expect} from '@playwright/test';
test('Course Lab authoring controls create units, lessons, reading and quizzes without logging in to GitHub',async({page})=>{
 await page.goto('/staff.html');
 await page.evaluate(async()=>{
  const {mountCourseLab}=await import('/studio-course-lab.mjs');
  const host=document.createElement('div');host.id='course-lab-test-host';document.body.append(host);
  const fakePublisher={
   async readLearnCourse(){return {version:0,bundle:null,published:false};},
   async readLearnManifest(){return {index:{version:1,courses:{}}};}
  };
  mountCourseLab(host,()=>fakePublisher,()=>{});
 });
 const root=page.locator('#course-lab-test-host');
 await expect(root.locator('#cl-course option')).toHaveCount(20);
 await expect(root.locator('#cl-state')).toContainText('New blank course draft');
 await root.locator('[data-act=add-unit]').click();
 await root.locator('[data-act=add-lesson]').click();
 await root.locator('#cl-new-type').selectOption('read');
 await root.locator('[data-act=add-node]').click();
 await root.locator('[data-field=body]').fill('Psychological explanations are hypotheses, not diagnoses.');
 await root.locator('#cl-new-type').selectOption('choose');
 await root.locator('[data-act=add-node]').click();
 await root.locator('[data-field=prompt]').fill('Which explanation is supported?');
 await expect(root.locator('.cl-node')).toHaveCount(2);
 await root.locator('[data-act=preview]').click();
 await expect(root.locator('#cl-preview')).toBeVisible();
 await expect(root.locator('#cl-preview-host')).toContainText('New lesson');
 await root.locator('#cl-preview [data-start]').click();
 await expect(root.locator('#cl-preview-host')).toContainText('Psychological explanations are hypotheses');
 await root.locator('#cl-preview [data-next]').click();
 await expect(root.locator('#cl-preview-host')).toContainText('Which explanation is supported?');
 await root.locator('[data-act=close-preview]').click();
 await root.locator('[data-act=save]').click();
 await expect(root.locator('#cl-state')).toContainText('Draft saved');
 await root.locator('#cl-course').selectOption('anxiety');
 await expect(root.locator('#cl-state')).toContainText('New blank course draft');
 await root.locator('#cl-course').selectOption('narcissism');
 await expect(root.locator('.cl-node')).toHaveCount(2);
 await root.locator('[data-act=select-node][data-n="0"]').click();
 await expect(root.locator('[data-field=body]')).toHaveValue('Psychological explanations are hypotheses, not diagnoses.');
 await root.locator('[data-act=publish]').click();
 await expect(root.locator('#cl-publish-state')).toContainText('Publication blocked');
});
