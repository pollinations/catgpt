# 🐱 CatGPT Meme Generator

[![Made with pollinations.ai](https://cdn.jsdelivr.net/npm/@pollinations/ui@0.1.0-alpha.25/dist/brand/badge-made-with.svg)](https://pollinations.ai)

Transform your questions into sassy cat wisdom! A collaboration between [pollinations.ai](https://pollinations.ai) and [Tanika Godbole](https://www.instagram.com/tanikagodbole/), the original creator of the CatGPT comic.

## 🌟 About

CatGPT is an AI-powered meme generator that creates personalized cat comics in response to your questions. Just like the original CatGPT comic, our feline friend responds with lazy, sarcastic wisdom while treating humans as mere servants.

This app emerged from a collaboration with Tanika Godbole, with the idea coming from Dr. Julia Degen. We're using Gemini 3.1 Flash-Lite Image (nanobanana-2-lite) through pollinations.ai to democratize access to AI-generated cat wisdom, with GPT Image 1 Mini (gptimage) as a fallback!

### 🎨 Original Inspiration

The CatGPT concept was created by Tanika Godbole. Check out the [first CatGPT comic on Instagram](https://www.instagram.com/p/Cn4OLhPyDLP/)!

<div align="center">
  <img src="images/original-catgpt.png" alt="Original CatGPT Comic" width="400">
</div>

## ✨ Examples

Here are some AI-generated CatGPT memes created with our generator:

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="images/example1.png" alt="Weather Forecast CatGPT" width="300"><br>
        <em>"What's the weather today?"</em>
      </td>
      <td align="center">
        <img src="images/example2.png" alt="Debugging CatGPT" width="300"><br>
        <em>"How do I fix this bug?"</em>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="images/example3.png" alt="CatGPT Example 3" width="300"><br>
        <em>More feline wisdom</em>
      </td>
      <td align="center">
        <img src="images/example4.png" alt="CatGPT Example 4" width="300"><br>
        <em>Classic cat attitude</em>
      </td>
    </tr>
  </table>
</div>

## 🚀 Features

- **AI-Powered Generation**: Uses Gemini 3.1 Flash-Lite Image (`nanobanana-2-lite`) via [gen.pollinations.ai](https://gen.pollinations.ai) API
- **Instant Memes**: Generate custom cat wisdom in seconds
- **Share & Download**: Save your favorite memes or share them with friends
- **Community Gallery**: Generated memes are automatically shared so everyone can browse the community's creations
- **Pollen-Powered**: Log in with your Pollinations account to generate memes with your balance
- **Gen-Z Friendly Design**: Modern, vibrant, and fun UI with animated elements
- **Easter Eggs**: Hidden surprises for the curious (try the Konami code! 🎮)

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS and JavaScript, with a React account menu from the published Pollinations UI package and a Vite build
- **AI Service**: [gen.pollinations.ai](https://gen.pollinations.ai): Gemini 3.1 Flash-Lite Image (`nanobanana-2-lite`) with `gptimage` fallback, powered by Claude Fast for text responses
- **Image Upload**: Pollinations media storage for unlisted references and public generated memes
- **Design**: Psychedelic Gen-Z aesthetic with animated elements

## 🔧 Architecture & Gateway

The app uses the unified `gen.pollinations.ai` API gateway:

- **Text generation**: Claude Fast (`anthropic/claude-haiku-4.5`) generates the cat's sarcastic replies
- **Image generation**: Gemini 3.1 Flash-Lite Image (`nanobanana-2-lite`), falling back to `gptimage`
- **Authentication**: Seamless Pollen balance authorization via [enter.pollinations.ai](https://enter.pollinations.ai)
- **Media storage**: Tagged public archiving via [media.pollinations.ai](https://media.pollinations.ai)

## Development and deployment

Requires Node.js 24. The browser app stays plain HTML, CSS and JavaScript;
its login, generation and uploads use the published `@pollinations/sdk`;
the account menu uses the published `@pollinations/ui`. OAuth uses PKCE, sessions
stay in session storage, and user credentials never go into media or shared URLs. Deployment uses the published
`@pollinations/cli` package, with no monorepo files or Cloudflare credentials.

```sh
npm ci
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

`dist/` contains only the built website and its assets. The primary address is
`https://catgpt.pollinations.app`; the `.ai` and legacy GitHub Pages addresses
now redirect there. Legacy query strings and fragments are discarded to avoid
forwarding credentials. `generated-examples/` preserves the
repository's original image links. Shared links populate the prompt; generation
starts only after a click. Example cards use bundled images and spend no Pollen.

Deployment runs through **Deploy / Pollinations production** on the `production`
branch, using the published CLI and Polli's Sites account. `AUTO_DEPLOY=true`
enables deployment on production pushes. Promote `main` through a PR to
`production`; CI builds, publishes, and compares every deployed file with `dist/`.
The GitHub `production` environment holds `POLLINATIONS_API_KEY`, a zero-budget,
no-generation key with `account:machines` access. Never commit its value.

CI calls the [shared Sites workflow](https://github.com/pollinations/pollinations/blob/154eec6262d09d1c034c1984caa4503fd3baca75/.github/workflows/deploy-pollinations-site.yml), pinned to a reviewed commit. It builds and tests without the deployment key, then publishes and verifies every file on a separate runner using the published CLI. Reverting the workflow change restores the previous deployment procedure.

For future releases, verify login, generation, reference uploads, downloads,
gallery and shared links on `.app`. The original Cloudflare Pages deployment is
retained for rollback: disable the new workflow and restore the old routing.
GitHub Pages uses `codex/catgpt-legacy-pages`, serving a redirect while preserving
the original asset paths.

For an authenticated SDK check, set `POLLINATIONS_API_KEY` securely and run
`npm run test:live`. It generates and publishes one meme, then verifies the gallery
and download. This requires a generation key, not the deployment-only CI key.

This migration preserves the original repository history and CatGPT's monorepo
history through `c8c370b6918a60dda574f2610df6d553a2a71170`, including the
[image authentication fix](https://github.com/pollinations/pollinations/pull/18754).

## 💡 The Story

This app started from a LinkedIn post announcing the collaboration between Thomas Haferlach (pollinations.ai) and Tanika Godbole. The goal is to create a fun, viral meme generator while ensuring fair attribution and revenue sharing with the original creator - something often overlooked in the AI space.

## 🐾 Support

Keep your cats happy with premium pet food from our sponsor [PuraPep](https://www.purapep.de/) - because even sarcastic cats deserve the best!

## 🎯 How to Use

1. Visit the [CatGPT Meme Generator](https://catgpt.pollinations.app/)
2. Log in with your Pollinations account
3. Type your question in the text box (optional: upload a selfie to be caricatured)
4. Click "Generate Meme"
5. Watch as CatGPT responds with feline wisdom!
6. Download or share your creation; generated memes also appear in the public community gallery

## 🤝 Credits & Collaboration

- **Original CatGPT Creator**: [Tanika Godbole](https://www.instagram.com/tanikagodbole/)
- **AI Technology**: [pollinations.ai](https://pollinations.ai)
- **Idea Credit**: Dr. Julia Degen
- **Sponsor**: [PuraPep](https://www.purapep.de/) - Premium pet food for happy cats 🐾
- Developed By [Ayushman Bhattacharya](https://github.com/Circuit-Overtime) & [Thomash Haferlach](https://github.com/voodoohop)

## 📝 License

This app is a collaboration between pollinations.ai and Tanika Godbole. The CatGPT character and concept are the intellectual property of Tanika Godbole. AI-generated variations are created with permission and include revenue sharing with the original creator.

## 🌈 Fun Facts

- Try the Konami code on the website for a surprise! (↑↑↓↓←→←→BA)
- Each generated meme has a unique seed for variety
- The cat's responses are intentionally sarcastic - that's the CatGPT way!

---

Made with 💜 by [pollinations.ai](https://pollinations.ai) in collaboration with [Tanika Godbole](https://www.instagram.com/tanikagodbole/)
