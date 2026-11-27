# BetFury Christmas Advent

Telegram WebApp-ként működő karácsonyi adventi kalendárium frontend demó a BETFURY kaszinó stílusában és hivatalos maszkotjával (Fury, a mosómedve).

Főbb követelmények:
1. Felépítés és elrendezés:
- Tiszta, fókuszált adventi naptár felület kifejezetten Telegram WebApp mobil nézetre optimalizálva (és asztali nézetben is jól mutató keretben).
- NEM kell felső kaszinó menüpanel (nincs egyenleg, nincs értesítés csengő, nincs hamburger menü).
- NEM kell alsó kaszinó menüsáv (nincs play, deposit, games stb. gomb).
- A fejlécben a hivatalos BETFURY logó szerepeljen és egy hangulatos téli karácsonyi felirat (pl. BetFury Christmas Advent Calendar).

2. Hivatalos arculat és logó:
- A kaszinó neve pontosan: BETFURY.
- Hivatalos SVG logó: https://betfury.ac/_nuxt/logo.wz6b_EVu.svg
- Sem a maszkot ruhájára, sem a szánra, sem sehova máshová nem kerülhet másfajta vagy torzított logó!

3. A 4 hivatalos jutalom asset a csatolt képek alapján:
- 1. BFG Token (how-to-use-2.CdcCz_-.png)
- 2. Promocode Ticket (promo.png)
- 3. Free Spin / FS badge (free-spin.png)
- 4. Karácsonyi BFG Box (BFG_closed_2.png)
Ezek jelenjenek meg a nyitható ablakok mögötti jutalmakban és a nyeremény popup modalban.

4. Játékmenet és demó funkciók:
- 24 napos (december 1-24) interaktív fagyos üveg (frosted glass) és aranykeretes naptárrács.
- A demóban minden nap szabadon kattintható/nyitható tesztelés céljából (jelezve az aznapi, már kinyitott és jövőbeli állapotokat, egy teszt toggle vagy reset gombbal).
- Látványos ablaknyitási élmény: animált kinyílás, fénycsóvák, konfetti, és Telegram WebApp haptikus rezgés támogatás (window.Telegram.WebApp.HapticFeedback ha elérhető).
- Nyeremény reveal popup a 4 asset egyikével, ritkasági szinttel (Common, Rare, Epic, Legendary), "Claim" gombbal.
- Streak bar a tetején (pl. "Streak: X nap", mérföldkő jelzővel a 24. naphoz).
- Tiszta API placeholder függvények és mock adatszerkezet (pl. openDay(dayId), getCalendarStatus()), hogy a saját backend azonnal beköthető legyen.
- Prémium decemberi téli hangulat: finom hóesés részecskék, mélykék (#080f24), neonszín és meleg arany tónusok.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe209dd7-a189-475e-8dc2-b9e6b4301539).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
