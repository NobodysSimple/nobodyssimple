import {test,expect} from '@playwright/test';
test('the complete contingent self-worth unit opens as a playable first course unit',async({page})=>{
 await page.goto('/index.html#learn/course/self-esteem');
 await expect(page.getByText('When your worth feels like it depends on something').first()).toBeVisible({timeout:30000});
 await expect(page.locator('a[href="#learn/lesson/self-esteem/csw-lesson-1"]').first()).toBeVisible();
 await page.goto('/index.html#learn/lesson/self-esteem/csw-lesson-1');
 await expect(page.locator('.csw-unit')).toBeVisible({timeout:30000});
 await expect(page.locator('.csw-heading h1')).toContainText('The rejection');
 await expect(page.getByText('Subject: Community Arts Funding Application')).toBeVisible();
 await page.locator('[data-reveal]').click();
 await expect(page.locator('.csw-feedback')).toBeVisible();
 await page.locator('[data-next]').click();
 await expect(page.locator('.csw-heading h1')).toContainText('The conversation');
 await expect(page.locator('.csw-message')).toHaveCount(1);
 await page.locator('[data-more-dialogue]').click();
 await expect(page.locator('.csw-message')).toHaveCount(2);
});
test('an authored choice reveals source-specific feedback and can be continued',async({page})=>{
 await page.goto('/index.html#learn/lesson/self-esteem/csw-lesson-8');
 await expect(page.locator('.csw-unit')).toBeVisible({timeout:30000});
 await page.locator('[data-next]').click();
 await expect(page.locator('.csw-choices input')).toHaveCount(3);
 await page.locator('.csw-option').filter({has:page.locator('input[value="C"]')}).click();
 await page.locator('[data-check]').click();
 await expect(page.locator('.csw-feedback')).toContainText('exam');
});

test('the first entire authored lesson can be completed with different activity types',async({page})=>{
 test.setTimeout(120000);
 await page.goto('/index.html#learn/lesson/self-esteem/csw-lesson-1');
 await expect(page.locator('.csw-unit')).toBeVisible({timeout:30000});
 for(let i=0;i<110;i++){
  if(await page.locator('.csw-finish').count())break;
  const message=page.locator('[data-more-dialogue]');
  if(await message.count()){await message.click();continue;}
  const unflipped=page.locator('.csw-flip:not(.is-open)');
  if(await unflipped.count()){await unflipped.first().click();continue;}
  const reveal=page.locator('[data-reveal]');
  if(await reveal.count()){await reveal.click();continue;}
  const sort=page.locator('.csw-sort-item');
  if(await sort.count()&&await page.locator('[data-check-sort]').count()){
   const rows=await sort.count();
   for(let k=0;k<rows;k++){
    await sort.nth(k).locator('[data-sort]').first().click();
   }
   await page.locator('[data-check-sort]').click();continue;
  }
  const sequence=page.locator('[data-add]');
  if(await sequence.count()){await sequence.first().click();continue;}
  if(await page.locator('[data-check-sequence]').count()){await page.locator('[data-check-sequence]').click();continue;}
  if(await page.locator('[data-check]').count()){
   await page.locator('.csw-option').first().click();
   await page.locator('[data-check]').click();continue;
  }
  if(await page.locator('[data-next]').count()){await page.locator('[data-next]').click();continue;}
  throw Error('No usable action on '+await page.locator('.csw-heading h1').textContent());
 }
 await expect(page.locator('.csw-finish')).toBeVisible();
 await expect(page.locator('.csw-finish')).toContainText('Lesson progress saved');
 await expect.poll(()=>page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('ns-account-learning-v2')||'{}')).some(k=>k.includes('csw-lesson-1')))).toBe(true);
});

test('all eight authored lessons, introduction and three review activities are playable from start to completion',async({page})=>{
 test.setTimeout(240000);
 const ids=['csw-introduction',...Array.from({length:8},(_,i)=>'csw-lesson-'+(i+1)),...Array.from({length:3},(_,i)=>'csw-review-'+(i+1))];
 for(const id of ids){
  await page.goto('/index.html#learn/lesson/self-esteem/'+id);
  await expect(page.locator('.csw-unit')).toBeVisible({timeout:30000});
  for(let step=0;step<160;step++){
   if(await page.locator('.csw-finish').count())break;
   if(await page.locator('[data-more-dialogue]').count()){await page.locator('[data-more-dialogue]').click();continue;}
   if(await page.locator('.csw-flip:not(.is-open)').count()){await page.locator('.csw-flip:not(.is-open)').first().click();continue;}
   if(await page.locator('[data-reveal]').count()){await page.locator('[data-reveal]').click();continue;}
   if(await page.locator('[data-check-sort]').count()){
    const rows=await page.locator('.csw-sort-item').count();
    for(let i=0;i<rows;i++)await page.locator('.csw-sort-item').nth(i).locator('[data-sort]').first().click();
    await page.locator('[data-check-sort]').click();continue;
   }
   if(await page.locator('[data-add]').count()){await page.locator('[data-add]').first().click();continue;}
   if(await page.locator('[data-check-sequence]').count()){await page.locator('[data-check-sequence]').click();continue;}
   if(await page.locator('[data-check]').count()){
    await page.locator('.csw-option').first().click();
    await page.locator('[data-check]').click();continue;
   }
   if(await page.locator('[data-next]').count()){
    await expect(page.locator('[data-next]'),id+' has a disabled Continue button').toBeEnabled();
    await page.locator('[data-next]').click();continue;
   }
   throw Error(id+' is stuck on '+await page.locator('.csw-heading h1').textContent());
  }
  await expect(page.locator('.csw-finish'),id+' did not finish').toBeVisible();
  await expect(page.locator('.csw-finish'),id+' failed to save').toContainText('Lesson progress saved');
 }
 const keys=await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('ns-account-learning-v2')||'{}')));
 for(const id of ids)expect(keys.some(k=>k.includes(id)),id+' missing completion').toBe(true);
});
