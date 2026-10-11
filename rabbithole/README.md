# Rabbit Hole Hotel · Jäneseurg — rabbithole.vango.ee

Hugo sait (Hugo **0.165 extended**), kolm keelt:

| Keel | Avaleht | Broneerimisleht |
|---|---|---|
| Inglise (põhikeel) | `/` | `/book/` |
| Saksa | `/de/` | `/de/buchen/` |
| Eesti | `/et/` | `/et/broneeri/` |

## Käivitamine

```bash
hugo server        # arendus: http://localhost:1313
hugo --gc --minify # tootmise build → public/
```

## Kus mida muuta

- **Avalehe tekstid:** `content/_index.en.md`, `_index.de.md`, `_index.et.md`. Kõik tekstid on failide päises (YAML).
- **Broneerimislehe tekstid:** `content/book.en.md`, `book.de.md`, `book.et.md`.
- **Menüü, jaluse jm väikesed tekstid:** `i18n/en.toml`, `de.toml`, `et.toml`.
- **Kontakt, broneerimislink, hind, check-in/out:** `hugo.toml` → `[params]`.
  - `bookingUrl`: broneerimislink. Keelepõhised lingid on `[languages.xx.params]` all (praegu Booking.com). Kui väli on tühi, avab nupp e-kirja aadressile info@vango.ee.
  - `checkIn`, `checkOut`, `priceFrom`, `minStay`: tühjad väljad broneerimislehel ei kuvata.
- **Värvid ja kujundus:** `assets/css/main.css` (värvid on faili alguses, Stitchi projektist "Rabbit Hole Hotel web").

## Fotod

Lisa fotod kausta `static/img/photos/` ja kirjuta failitee sisufaili `image:` väljale, näiteks:

```yaml
hero:
  image: "img/photos/hero.jpg"      # suur taustapilt avalehe ülaosas
space:
  items:
    - name: "The Sauna"
      image: "img/photos/saun.jpg"  # kaardipilt
```

Kui pilti pole, kuvatakse selle asemel tume kuldse võtmeaugu märgiga kaart. Pildid peavad olema samad kõigis kolmes keelefailis.
Soovituslikud mõõdud: hero 2400×1600, ruumikaardid 1200×1500 (püstformaat), terrass ja järv 1600×1000.

## Avaldamine (Cloudflare, samamoodi nagu vango.ee)

See kaust asub Vango repo (`vangotalu-glitch/vango`) alamkaustas `rabbithole/`. Vango enda build seda kausta ei puuduta.
Rabbit Hole saab Cloudflare'is **eraldi Workeri** sama repo pealt:

1. Cloudflare → **Workers & Pages** → *Create* → *Import a repository* → `vangotalu-glitch/vango`.
2. Project name: `rabbithole`. **Root directory: `rabbithole`**.
3. Build command: `hugo --gc --minify`. Deploy command: `npx wrangler deploy` (seadistus on failis `wrangler.jsonc`).
4. Build variable: `HUGO_VERSION = 0.165.0`.
5. Pärast esimest edukat buildi: *Settings → Domains & Routes → Add custom domain* → `rabbithole.vango.ee`.
   NB! Praegu suunab `rabbithole.vango.ee` Veebimajutusse (vana WordPressi leht). Custom domaini lisamine asendab selle kirje DNS-is uue saidiga, nii et tee seda alles siis, kui uus sait on valmis.
6. Soovi korral: Vango Workeri seadetes *Build watch paths* → välista `rabbithole/*`, et Rabbit Hole'i muudatused Vango lehte uuesti ei ehitaks (ja vastupidi: Rabbit Hole'i Workeril lisa `rabbithole/*`).

Fondid (Jost pealkirjadele, Manrope tekstile, Noto Serif kaldkiri tsitaatidele) on kaustas `static/fonts/`, mitte Google Fonts'ist. Saksamaa andmekaitsepraktikas on see oluline.
