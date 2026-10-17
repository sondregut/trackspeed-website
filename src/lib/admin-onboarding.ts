// Onboarding screens for /admin/onboarding, in the order a new user sees them.
// Screenshots live in public/admin/onboarding/. Update this file when a build
// changes a screen.

export type ScreenStatus = 'changed' | 'new' | 'same';
export type Shot = {src: string; caption: string | null};
export type OnboardingScreen = {
  num: string; status: ScreenStatus; label: string; title: string; note: string;
  shots: Shot[];
  /** iPhone SE screenshots are shorter. */
  small: boolean;
};
export type ScreenGroup = {title: string; note: string; screens: OnboardingScreen[]};
export type ReviewBox = {title: string; items: {title: string; text: string}[]};
export type OnboardingApp = {
  id: 'trackspeed' | 'trackjump'; name: string; intro: string; groups: ScreenGroup[]; boxes: ReviewBox[];
};

export const onboardingUpdatedAt = 'October 17, 2026';

export const onboardingApps: OnboardingApp[] = [
  {
    "id": "trackspeed",
    "name": "TrackSpeed",
    "intro": "Build 125 (1.0.18), branch claude/welcome-video-20261016 at df91e178d, in the order a new user sees it: welcome, the 7-screen tour, the questions, camera, Solo Mode, the hardware comparison, the paywall and sign-in. Real screenshots from the iPhone 17e simulator.",
    "groups": [
      {
        "title": "",
        "note": "",
        "screens": [
          {
            "num": "00",
            "status": "changed",
            "label": "Changed",
            "title": "Welcome",
            "note": "Your photo-finish photo (white tank) full screen, no fade. Centered “Sprint timing with your phone”, no subtitle. White “Build My Setup”, outlined “Join Session”, “Already have an account? Sign in”.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-00-welcome.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "01",
            "status": "same",
            "label": "Unchanged",
            "title": "You've been invited!",
            "note": "Only for people who install from a referral link. Plain page, unchanged.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-01-referral-welcome.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "02",
            "status": "changed",
            "label": "Changed",
            "title": "Build a timing system.",
            "note": "Tour 1 of 7. Photo full screen, thin progress bar, title at the top left, Continue at the bottom. No counter, no small label.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-02-build.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "03",
            "status": "changed",
            "label": "Changed",
            "title": "Sync the phones.",
            "note": "Tour 2 of 7. “Join from the other phone. No shared Wi‑Fi needed.”",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-03-sync.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "04",
            "status": "changed",
            "label": "Changed",
            "title": "Line up the camera.",
            "note": "Tour 3 of 7.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-04-line-up.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "05",
            "status": "new",
            "label": "New",
            "title": "Start your way.",
            "note": "Tour 4 of 7. A real screenshot of the start-method picker, now showing all 7 methods.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-05-start-your-way.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "06",
            "status": "changed",
            "label": "Changed",
            "title": "Start on your wrist.",
            "note": "Tour 5 of 7. Shown on any iPhone that can pair an Apple Watch.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-06-wrist.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "07",
            "status": "changed",
            "label": "Changed",
            "title": "Just run.",
            "note": "Tour 6 of 7. IMG_4340, the photo-finish phone. It shows no times, so nothing is blurred.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-07-just-run.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "08",
            "status": "new",
            "label": "New",
            "title": "See the proof.",
            "note": "Tour 7 of 7. Your flying 10 m start and finish frames, white line trimmed. The button leads into the questions.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-08-see-the-proof.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "09",
            "status": "changed",
            "label": "Changed",
            "title": "Who are you timing?",
            "note": "Myself or Athletes I coach, on dark glass over your photo-finish photo. The chosen row turns white with a check.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-09-who-are-you-timing.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "10",
            "status": "changed",
            "label": "Changed",
            "title": "Your sport?",
            "note": "Sport tiles on glass. The chosen tile turns white.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-10-your-sport.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "11",
            "status": "changed",
            "label": "Changed",
            "title": "What gets in the way?",
            "note": "Pick any that apply. Darker rows, a dimmed photo with the phone screen blurred, and a full-white subtitle, so nothing reads through.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-11-what-gets-in-the-way.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "12",
            "status": "changed",
            "label": "Changed",
            "title": "Built for your training",
            "note": "Three benefit rows on glass.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-12-built-for-your-training.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "13",
            "status": "same",
            "label": "Unchanged",
            "title": "Do you have a referral code?",
            "note": "Now matches the other questions: full-screen photo, the field on dark glass. Same copy and logic; you can still skip it.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-13-referral-code.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "14",
            "status": "changed",
            "label": "Changed",
            "title": "Camera access needed",
            "note": "Photo full screen with the title at the top left. Continue opens Apple’s camera prompt.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-14-camera-access.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "15",
            "status": "changed",
            "label": "Changed",
            "title": "Try Solo Mode",
            "note": "Stays a plain page because it’s a live camera view. The simulator has no camera, hence “Camera unavailable”. The header is now left-aligned.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-15-solo-mode.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "16",
            "status": "changed",
            "label": "Changed",
            "title": "Phone vs timing hardware",
            "note": "Solid white TrackSpeed card ($4.99/month, billed $59.99 a year, “No extra hardware”), then “$500 – $5,000+ for dedicated timing equipment” on glass. Same message and numbers as before. “vs dedicated timing systems” now heads the dark card, so it reads.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-16-comparison.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "17",
            "status": "changed",
            "label": "Changed",
            "title": "Paywall",
            "note": "A photo header with the title in white. Prices, plans, trial terms, the button and all purchase rules are unchanged.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-17-paywall.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "18",
            "status": "same",
            "label": "Unchanged",
            "title": "Paywall, scrolled",
            "note": "Yearly $59.99 with a 7-day free trial, or weekly $9.99. Restore, Terms, Privacy and testimonials. Unchanged.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-18-paywall-scrolled.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "19",
            "status": "same",
            "label": "Unchanged",
            "title": "Exit offer",
            "note": "After closing the paywall: “Keep Pro for less.” $39.99 for the first year (usually $59.99). Unchanged.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-19-exit-offer.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "20",
            "status": "changed",
            "label": "Changed",
            "title": "Save your data",
            "note": "Your wrist photo full screen, white Apple button, Google button, email sign-in. “Help & Feedback” is white so it reads on the photo.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-20-sign-in.webp",
                "caption": null
              }
            ],
            "small": false
          }
        ]
      },
      {
        "title": "Extended route only",
        "note": "Some users get five extra screens. These are unchanged.",
        "screens": [
          {
            "num": "21",
            "status": "same",
            "label": "Unchanged",
            "title": "What sounds familiar?",
            "note": "Extended route only. After 11.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-21-ext-pain-reflection.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "22",
            "status": "same",
            "label": "Unchanged",
            "title": "TrackSpeed was made for people like you",
            "note": "Extended route only. After 15.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-22-ext-rating.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "23",
            "status": "same",
            "label": "Unchanged",
            "title": "Train faster together",
            "note": "Extended route only. After 22.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-23-ext-referral-invite.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "24",
            "status": "same",
            "label": "Unchanged",
            "title": "Free trial reminder",
            "note": "Extended route only. After 23.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-24-ext-trial-reminder.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "25",
            "status": "same",
            "label": "Unchanged",
            "title": "Never miss a session",
            "note": "Extended route only. After 24, then the comparison.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-25-ext-notifications.webp",
                "caption": null
              }
            ],
            "small": false
          }
        ]
      },
      {
        "title": "Small phones and largest text",
        "note": "",
        "screens": [
          {
            "num": "30",
            "status": "same",
            "label": "Unchanged",
            "title": "iPhone SE: Welcome",
            "note": "Fits without scrolling. The title sits over the bottom of the phone in the photo but stays readable.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-30-se-welcome.webp",
                "caption": null
              }
            ],
            "small": true
          },
          {
            "num": "31",
            "status": "same",
            "label": "Unchanged",
            "title": "iPhone SE: Comparison",
            "note": "Fits, with real prices.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-31-se-comparison.webp",
                "caption": null
              }
            ],
            "small": true
          },
          {
            "num": "32",
            "status": "same",
            "label": "Unchanged",
            "title": "iPhone SE: Paywall",
            "note": "Photo header, title and trial terms all visible.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-32-se-paywall.webp",
                "caption": null
              }
            ],
            "small": true
          },
          {
            "num": "33",
            "status": "same",
            "label": "Unchanged",
            "title": "Largest text: Welcome",
            "note": "The page scrolls to the sign-in link.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-33-ax-welcome.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "34",
            "status": "same",
            "label": "Unchanged",
            "title": "Largest text: Comparison",
            "note": "The card stacks so no word breaks in half.",
            "shots": [
              {
                "src": "/admin/onboarding/ts125-34-ax-comparison.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "35",
            "status": "same",
            "label": "Unchanged",
            "title": "Largest text: Paywall",
            "note": "The title moves below a shorter photo, and the page scrolls.",
            "shots": [
              {
                "src": "/admin/onboarding/ts124-35-ax-paywall.webp",
                "caption": null
              }
            ],
            "small": false
          }
        ]
      }
    ],
    "boxes": [
      {
        "title": "Fixed in build 125",
        "items": [
          {
            "title": "Status bar",
            "text": "White clock and icons on the welcome and every photo or dark screen."
          },
          {
            "title": "Questions",
            "text": "Darker glass rows and dimmed photos with blurred phone screens, so no app text shows through."
          },
          {
            "title": "Referral code",
            "text": "The same photo and glass style as the other questions."
          },
          {
            "title": "Start your way",
            "text": "All 7 start methods."
          },
          {
            "title": "Comparison",
            "text": "“vs dedicated timing systems” moved into the dark card."
          },
          {
            "title": "Photos",
            "text": "Each photo appears at most twice and never on nearby screens. Two of your unused photos (IMG_4338, IMG_4339) are in now, with their phone screens blurred because they showed impossible speeds."
          }
        ]
      },
      {
        "title": "Open questions",
        "items": [
          {
            "title": "“Where did you hear about us?”",
            "text": "TrackSpeed has no such question; TrackJump does (TrackJump tab, screen 05). Say the word and I’ll add it after “Your sport?” with the same options as TrackJump."
          },
          {
            "title": "Athlete or coach",
            "text": "TrackSpeed asks “Who are you timing?” with Myself or Athletes I coach. The flow doesn’t branch on the answer yet."
          }
        ]
      }
    ]
  },
  {
    "id": "trackjump",
    "name": "TrackJump",
    "intro": "TrackJump 1.2.0 (build 5821 is in App Review), with the change planned for each screen in 1.2.1. Welcome and First result show the new versions; screens marked “Screenshot pending” are new and still to be captured. The referral-code page is gone in 5821.",
    "groups": [
      {
        "title": "",
        "note": "",
        "screens": [
          {
            "num": "00",
            "status": "same",
            "label": "Unchanged",
            "title": "Launch screen",
            "note": "",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-00a-launch-screen.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "01",
            "status": "changed",
            "label": "Changed",
            "title": "Welcome",
            "note": "Before: a generated athlete in a gym and “Measure your jump height.” plus two lines of text. After: your turf clip (IMG_1012) loops behind the card, and the card only says “Measure your vertical jump.” The after shots are from build 5820, now on your phones.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-01-welcome.webp",
                "caption": "Before"
              },
              {
                "src": "/admin/onboarding/tj-after-01-welcome.webp",
                "caption": "After"
              },
              {
                "src": "/admin/onboarding/tj-after-01-welcome-b.webp",
                "caption": "After, later in the loop"
              }
            ],
            "small": false
          },
          {
            "num": "02",
            "status": "changed",
            "label": "Changed",
            "title": "Who are you testing?",
            "note": "The blurred photo behind the questions becomes your turf photo (16.9 in) instead of the generated athlete. Same for 03–05.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-02-role.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "03",
            "status": "changed",
            "label": "Changed",
            "title": "What's your goal?",
            "note": "Background photo, as on 02.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-03-goal.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "04",
            "status": "changed",
            "label": "Changed",
            "title": "Your sport?",
            "note": "Background photo, as on 02.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-04-sport.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "05",
            "status": "changed",
            "label": "Changed",
            "title": "Where did you hear about us?",
            "note": "Background photo, as on 02.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-05-discovery.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "06",
            "status": "changed",
            "label": "Removed",
            "title": "Do you have a referral code?",
            "note": "Removed in build 5821 (in App Review now): Apple’s guideline 3.1.1 allows no code entry in the app. Free and creator codes are App Store offer codes (TRYJUMP, JUMPCREW, KINGDAC), redeemed through Apple.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-06-code.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "07",
            "status": "same",
            "label": "Unchanged",
            "title": "How high do you jump?",
            "note": "",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-07-guess.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "08",
            "status": "changed",
            "label": "Changed",
            "title": "Your first jump",
            "note": "The demo gets smaller (300 → 220 pt) and loses the red recording dot and timer, so step 3 and “First test free” fit above the buttons. It is still the 3D avatar until a real hands-on-hips clip is filmed.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-08-first-jump-start.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "09",
            "status": "changed",
            "label": "Changed",
            "title": "Your first jump, ready",
            "note": "Same demo changes as 08.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-09-first-jump-ready.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "10",
            "status": "changed",
            "label": "Changed",
            "title": "Your first jump, demo result",
            "note": "Same demo changes as 08.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-10-first-jump-result.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "11",
            "status": "changed",
            "label": "Changed",
            "title": "Your first jump, scrolled",
            "note": "Today step 3 is only visible after scrolling. After the change it fits on the first screen.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-11-first-jump-scrolled.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "12",
            "status": "same",
            "label": "Unchanged",
            "title": "No room to jump right now?",
            "note": "",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-12-jump-later.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "13",
            "status": "new",
            "label": "New",
            "title": "Camera setup",
            "note": "New screen before the iOS camera prompt: a real loop of the setup (IMG_0975, indoors) with three short steps and why the app needs the camera. No screenshot yet.",
            "shots": [],
            "small": false
          },
          {
            "num": "14",
            "status": "changed",
            "label": "Changed",
            "title": "Camera",
            "note": "If camera access was denied, the alert now says “Camera access is off” and only offers Open Settings and Close camera. The simulator has no camera, so it shows a preview.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-14-camera-simulator.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "15",
            "status": "changed",
            "label": "Changed",
            "title": "First result",
            "note": "A full-width Continue at the bottom, like every other onboarding step. No Done in the corner and no back arrow during onboarding. Results outside onboarding keep Done. Committed for 1.2.1.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-15-capture-result.webp",
                "caption": "Before"
              },
              {
                "src": "/admin/onboarding/tj-after-15-result-continue.webp",
                "caption": "After"
              }
            ],
            "small": false
          },
          {
            "num": "16",
            "status": "same",
            "label": "Unchanged",
            "title": "Your starting point",
            "note": "Not changed yet. Suggested: show your own jump replay above the number; the Pro example card uses made-up values.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-16-starting-point.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "17",
            "status": "same",
            "label": "Unchanged",
            "title": "Your starting point, scrolled",
            "note": "",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-17-starting-point-scrolled.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "18",
            "status": "changed",
            "label": "Changed",
            "title": "Paywall",
            "note": "The hero becomes your turf photo (16.9 in) instead of the generated athlete.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-18-paywall.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "19",
            "status": "changed",
            "label": "Changed",
            "title": "Paywall, scrolled",
            "note": "Hero photo, as on 18.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-19-paywall-scrolled.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "20",
            "status": "same",
            "label": "Unchanged",
            "title": "Exit offer",
            "note": "",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-20-exit-offer.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "21",
            "status": "same",
            "label": "Unchanged",
            "title": "Back after the offers",
            "note": "Returns to Your starting point.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-21-back-after-offers.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "22",
            "status": "changed",
            "label": "Changed",
            "title": "Save your progress",
            "note": "Account sign-in. The background becomes your turf photo. No screenshot yet.",
            "shots": [],
            "small": false
          },
          {
            "num": "23",
            "status": "changed",
            "label": "Changed",
            "title": "Welcome, Reduce Motion",
            "note": "With Reduce Motion on, the welcome shows a still of your 16.9 in moment instead of the clip.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-23-welcome-reduce-motion.webp",
                "caption": null
              }
            ],
            "small": false
          },
          {
            "num": "24",
            "status": "same",
            "label": "Unchanged",
            "title": "First jump, Reduce Motion",
            "note": "The still demo still hides the avatar behind the number card.",
            "shots": [
              {
                "src": "/admin/onboarding/tj-before-24-first-jump-reduce-motion.webp",
                "caption": null
              }
            ],
            "small": false
          }
        ]
      }
    ],
    "boxes": [
      {
        "title": "Footage wanted",
        "items": [
          {
            "title": "Phone-view jump, hands on hips",
            "text": "For the first-jump demo (08–11). A second iPhone at knee height, 2.5 m away, filming you walk in, stand still, dip, jump and land. 6–8 s, three takes."
          },
          {
            "title": "Side view of the setup",
            "text": "For the new camera setup screen (13). Camera 4 m to the side: you lean the phone on a bag, walk back, face it and jump once. Front-lit."
          },
          {
            "title": "Square portrait",
            "text": "For the paywall line “Built by Olympic pole vaulter Sondre Guttormsen”."
          },
          {
            "title": "Progress screen recording",
            "text": "To replace the made-up Pro example card on 16."
          }
        ]
      }
    ]
  }
];
