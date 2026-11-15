import {test,expect} from '@playwright/test';

const examples=[
 'rumination',           // Thoughts & worry
 'emotional-neglect',   // Family
 'arguments',           // Relationships
 'procrastination',     // Habits
 'focus',               // Attention
 'culture-shock',       // Migration
 'losing-faith',        // Faith
 'racial-discrimination'// Culture
];
const boilerplate=/^(?:Explore what would need to change before attempting this|Write (?:one answer|a few words) (?:to|about)|Consider whether this is relevant to your situation|Ask a trusted person about the practical concern behind|Talk this through with someone who listens|Request support for this possible step)/i;

test('all updated catalogue sections display useful direct advice without generated colon prefixes',async({page})=>{
 for(const id of examples){
  await page.goto('/index.html#problem/'+id);
  await expect(page.locator('.ns-mood h1')).toBeVisible();
  await page.locator('[data-mood-open]').first().click();
  let found=false;
  for(let step=0;step<4;step++){
   if(await page.locator('[data-mood-idea]').count()){found=true;break;}
   if(await page.locator('[data-mood-next]').count())await page.locator('[data-mood-next]').click();
  }
  expect(found,'No popup in '+id).toBe(true);
  await page.locator('[data-mood-idea]').click();
  await expect(page.locator('dialog[data-mood-ideas]')).toBeVisible();
  const entries=await page.locator('[data-mood-ideas-list] li').allTextContents();
  expect(entries.length,'No useful ideas for '+id).toBeGreaterThanOrEqual(3);
  expect(entries.length,'Oversized advice popup for '+id).toBeLessThanOrEqual(12);
  for(const text of entries){
   expect(text,'Mechanical advice for '+id).not.toMatch(boilerplate);
   expect(text.length,'Unhelpfully brief advice for '+id).toBeGreaterThan(15);
  }
 }
});
