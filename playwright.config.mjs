import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',
 timeout:30000,
 expect:{timeout:12000},
 use:{baseURL:'http://127.0.0.1:8118',trace:'retain-on-failure'},
 projects:[
  {name:'desktop-chromium',use:{...devices['Desktop Chrome'],viewport:{width:1366,height:850}}},
  {name:'mobile-chromium',use:{...devices['iPhone 13'],browserName:'chromium',isMobile:true}}
 ],
 webServer:{
  command:'python3 -m http.server 8118 --bind 127.0.0.1',
  url:'http://127.0.0.1:8118/index.html',
  reuseExistingServer:!process.env.CI,
  timeout:120000
 },
 reporter:[['list']]
});
