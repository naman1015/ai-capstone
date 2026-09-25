# Portfolio

**Voice card:** Clear, direct, precise, short, not confusing

**Audience:** Internship recruiters  
**Action:** Get in touch → [namandeep1015@gmail.com](mailto:namandeep1015@gmail.com)

---

## Bio

I am a 3rd-year Electronics and Telecommunication student. I build practical software with AI.

---

## Contact

**Get in touch:** [namandeep1015@gmail.com](mailto:namandeep1015@gmail.com)

---

## Case study: JARVIS

### Problem

I care about where my information lives. I do not want to depend on websites that can use my info without me knowing. I wanted a voice assistant that runs on my own laptop, so the work stays with me.

### What I did and what I decided

I built a JARVIS-style assistant that runs locally. I used AI coding tools to write and wire the backend. For the models, I run Ollama and Qwen — I picked them because they are free and work as local alternatives.

On top of that I added voice output, weather updates, a Google search option, and quotes on the side. If I put a keyword in, the backend picks the tab and takes me to YouTube videos that match. I kept the whole thing on my PC on purpose so my info stays local instead of living on the web.

### What came of it

This one is just for me. I can ask by voice, get weather without opening other apps, search YouTube faster from a keyword, use Google search from the assistant, and see quotes on the side. Nobody else is using it — it is my own setup on my laptop.

---

## Case study: Settings Form (AI Workflow Experiment)

### Problem

When I give AI tools a vague prompt, they guess whatever they want. In my capstone project, an unguided prompt invented a weird 7–15 digit phone validation rule, skipped form labels, and wrote almost no tests.

### What I did and what I decided

I turned this into a direct experiment building a user settings form with Node.js.

First, I tested a vague prompt ("create a settings form, make it look good") and watched the AI make wild assumptions.

Then, I ran a second round with strict specifications: minimum 2 characters for full names, valid email format, exactly 10 digits for phone numbers, visible `<label>` tags tied to input IDs, keyboard focus on the first error, and live alerts for screen readers. I also told the AI it couldn't declare the work complete without writing automated tests and running the build check.

### What came of it

The second round produced 22 automated tests covering validation edge cases and HTTP submissions. All 22 tests passed and `node --check` ran clean. The experiment showed me that AI is not an autopilot — if I don't give it exact constraints and force it to verify, it cuts corners.

---

## Case study: moneymath

### Problem

Salary numbers are easy to look at and hard to turn into a plan. I wanted something that tells a person, from their income, how much tax and HRA they have to show — and what they can invest — instead of guessing.

### What I did and what I decided

I built the UI and the inputs. You type in the salary you get, and moneymath runs percentage calculations and shows numbers for multiple options like FD, HRA, and others.

One choice I stuck to: it should not be hard to navigate for someone opening it the first time. If the screen feels confusing, the math does not help.

### What came of it

My friends used it and liked it. I built it around 2024 tax rules and have not updated it for this year yet, so it is out of date today, but the math and the layout worked for what they needed.

---

## Case study: jersey drop system

### Problem

I am making a jersey website that sells through drops, not a normal always-on catalog. I set a day when jerseys go live. In a week there might be about 10–15 on the drop. Once they are gone, they probably will not come back. That limit is the point — it is how the product feels premium.

### What I did and what I decided

I worked on the pages, the cart, the visual design, and picked out the jerseys. I locked in a dark, organised look so it feels clean. I chose to cap drops at 10–15 pieces a week, and decided to launch only in Mumbai first so I can manage orders myself.

### What came of it

There are no outside users or public sales yet. Right now the site is in private testing mode while I sort out the launch. I have the cart and pages working, but it is still a work in progress until I go live in Mumbai.

---

## Before / after: writing sample

### Before (generic AI)

I am a passionate software engineering student dedicated to leveraging cutting-edge technologies and modern frameworks to build innovative, user-centric solutions that solve complex real-world problems.

### After (edited)

I am a 3rd-year Electronics and Telecommunication student building software on my laptop — including a local voice assistant running Ollama and Qwen, a 2024 salary tax calculator, and a Mumbai jersey drop site currently in testing.
