# 陽明交通大學 工業工程與管理學系 系學會官網

## 網頁組成

### 主頁面

團體大合照跟精選專題
超讚

### 關於我們

稍微介紹一下系學會的組成 (一些狗屁江西話，反正我也是抄其他系的

### 考古題系統

跟直接從notion讀比起來方便一些
再加上身分驗證以及沒有繳系學會費的人不能下載pdf
可能可以吸一點錢？

### 活動

讓大家可以方便地找到有辦理甚麼大型活動
一個入口網站的概念

## Deploy

### ENV
openssl rand -base64 32

1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database