# 🪷 Luxury Hindu Wedding Microsite: Aditya & Chetna

A mobile-first, single-page Hindu wedding invitation microsite built with **HTML5**, **Tailwind CSS**, and pure **vanilla JavaScript**. 

Designed with an opulent royal heritage aesthetic inspired by traditional Hindu ceremonies, fine gold foil embossing, sacred mantras, and heartfelt blessings.

---

## 🎨 Theme, Palette & Typography

- **Primary Colors:** Royal Maroon & Crimson (`#5B0E17`, `#7A1521`, `#3A070D`).
- **Accents:** Warm Ivory (`#FDFBF7`, `#F7F3E9`) cards, glowing gold foil gradients (`#ECC876` to `#E5A93C`, `#FBF0B9`), and subtle ornamental borders.
- **Typography:**
  - Headings & Monograms: Google Fonts **Cinzel** & **Great Vibes**
  - Body Text: Google Fonts **Cormorant Garamond**

---

## 🖼️ Local Image Asset Structure (`images/`)

All image tags point directly to the local `images/` directory in the workspace root. To customize or replace the photos, drop or update your image files in `images/`:

| Element | File Path | Aspect Handling | Description |
| :--- | :--- | :--- | :--- |
| **Monogram / Logo** | `images/logo.png` | Centered (`object-contain`) | Official couple monogram logo badge |
| **Hero Stage Banner** | `images/hero-couple.jpg` | Natural dimensions (`object-contain`) | Aditya & Chetna on royal wedding stage |
| **Matkor Ceremony** | `images/matkor.jpg` | Natural dimensions (`object-contain`) | Sacred earth ritual & Kalash |
| **Haldi Ceremony** | `images/haldi.jpg` | Natural dimensions (`object-contain`) | Turmeric & fresh floral shower |
| **Sangeet Ceremony** | `images/sangeet.jpg` | Natural dimensions (`object-contain`) | Musical gala & dance night |
| **Baarat Procession** | `images/baarat.jpg` | Natural dimensions (`object-contain`) | Royal cavalcade & groom on mare |
| **Jaimala Ceremony** | `images/jaimala.jpg` | Natural dimensions (`object-contain`) | Exchange of floral Varmalas |
| **Pheras Ceremony** | `images/pheras.jpg` | Natural dimensions (`object-contain`) | Sacred Agni fire & seven vows |
| **Venue Card** | `images/venue.jpg` | Natural dimensions (`object-contain`) | Gulabo Devi, Jaigaon destination |
| **Gallery Slide 1** | `images/gallery-1.jpg` | Natural dimensions (`object-contain`) | Chapter 01: Where Our Story Began |
| **Gallery Slide 2** | `images/gallery-2.jpg` | Natural dimensions (`object-contain`) | Chapter 02: Laughter & Golden Moments |
| **Gallery Slide 3** | `images/gallery-3.jpg` | Natural dimensions (`object-contain`) | Chapter 03: The Sacred Promise of Eternity |

> **Seamless Dynamic Blending & Soft Edge Vignette:**
> - Every ceremony image container features an event-specific gradient background and ambient glowing shadow matching the artwork's dominant color mood (e.g., Earth-Gold for Matkor, Vibrant Pink for Haldi, Midnight Blue for Sangeet, Saffron for Baarat, Champagne Rose for Jaimala, Agni Crimson for Pheras, and Heritage Green for Venue).
> - Includes a subtle soft-edge radial vignette overlay (`ring-1 ring-inset ring-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]`) that gently bleeds the outer borders into the container background.
> - Images scale naturally with `w-full h-auto max-h-[360px] md:max-h-[420px] object-contain block mx-auto rounded-xl` with lazy loading enabled.

---

## ✨ Features & Architecture

1. **Fixed Fullscreen Envelope Intro (Closed Pocket Architecture & Regal Branding):**
   - Deep maroon closed pocket with top flap, solid bottom pocket, and side wings.
   - **Upper Section Branding Header:** Positioned cleanly in the upper half above the central pearl seal with:
     - Custom couple monogram logo file (`images/logo.png`) with ambient golden drop shadow (`w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64`).
     - Couple names in bold letterspaced gold serif: **ADITYA & CHETNA** (`tracking-[0.25em] text-[#ECC876]`).
     - Subtitle: *"THE SACRED HINDU WEDDING INVITATION"* in warm ivory/gold.
   - Inner letter card is tucked strictly behind the pocket folds (`z-index: 10`).
   - Bottom pocket is clean and unencumbered with regal corner filigrees.
   - Tapping **"TAP TO REVEAL"** flips the top flap upward (`rotateX(180deg)`), triggers a radial golden light bloom effect (`#lightBurst`) for 600ms, and smoothly fades the envelope away into the invitation body.
   - Header contains a **"✉ Re-Open Envelope"** button to replay the experience.

2. **Hero Screen:**
   - Sacred invocation: *॥ श्री गणेशाय नमः ॥*
   - Title: *"We are getting Married"* with **Aditya & Chetna**.
   - Gold-framed hero couple banner with fallback slot.
   - Animated *"SCROLL TO EXPLORE"* chevron.

3. **Family Details Section:**
   - Ivory card with gold borders featuring two responsive columns (1-col on mobile, 2-col on tablet/desktop):
     - **Groom:** Aditya Gupta (Parents: Mithilesh Kumar Gupta & Indu Devi Gupta; Grandparents: Lt. Rameshwar Prasad & Panpari Devi; Uncle & Aunt: Manoj Kumar Gupta & Sangeeta Devi Gupta; Brother-in-law & Sister: Amar & Neha; Siblings: Anjali, Amit, Priya, Riya, Naitik; Nieces: Ananya, Anshika)
     - **Bride:** Chetna Pradhan (Parents: Ramesh Pradhan & Laxmi Pradhan; Brother & Sister-in-law: Bishan Pradhan & Sister-in-law; Niece: Kaveri Pradhan)

4. **Interactive Scratch Card & Countdown:**
   - 3 scratchable hearts: Date (`12`), Month (`DEC`), Year (`2026`).
   - Live countdown timer is strictly hidden on page load.
   - Only when **all 3 cards** reach $\ge$ 35% scratched area (or if instant reveal is tapped):
     - Clears canvases, fires celebratory golden and crimson confetti burst, and slides the live countdown clock into view.
     - Actively counts down to **December 12, 2026, 22:30:00 IST** (Auspicious Pheras Muhurat).

5. **Wedding Itinerary (6 Function Cards):**
   - **Matkor:** 10/12/2026 at 4:00 PM (Yellow theme accent)
   - **Haldi:** 11/12/2026 at 11:00 AM (Pink theme accent)
   - **Sangeet:** 11/12/2026 at 6:00 PM
   - **Baarat:** 12/12/2026 at 4:00 PM
   - **Jaimala:** 12/12/2026 at 8:00 PM
   - **Pheras:** 12/12/2026 at 10:30 PM

6. **Venue Revelation:**
   - Gulabo Devi, Jaigaon destination card with photo slot and direct **"OPEN IN MAPS"** Google Maps link.

7. **Memories / Photo Gallery:**
   - Carousel slider in rounded gold frames with touch swiping, navigation arrows, dot indicators, and full-screen lightbox modal.

8. **Audio Player & Music Offset:**
   - Floating audio toggle button (`#audioFab`) linked to `<audio id="wedding-music">` connected to `images/music.mp3`.
   - Automatic playback starts precisely at **0:26** (chorus / vocals) upon unsealing the envelope ("TAP TO REVEAL") or tapping the floating controller.
   - Includes seamless loop restart at 0:26, animated sound waves, and Web Audio API fallback.

---

## 🚀 How to Run & Preview

1. **Directly in Browser:**
   - Open `index.html` in any web browser (Chrome, Edge, Safari, Firefox).
   - Use mobile view (`Ctrl + Shift + M`) for native vertical smartphone view, or full window for desktop luxury card view.

2. **Local Development Server:**
   ```bash
   # Using Python 3
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your browser.
