# Raycasting TS 🔦

A vanilla TypeScript 2D raycasting engine prototype using the HTML5 Canvas API.

![Demo Raycasting](demo.gif)

## Motivation

This project was built to explore and implement dynamic raycasting light mechanics and line-of-sight algorithms from scratch. It served as the foundational rendering test for a 2D top-down multiplayer maze game prototype. By relying strictly on pure TypeScript and the native Canvas API, the goal was to understand low-level rendering performance and game logic without the overhead of large game engines.

## How to run locally

If you just want to see how it works or explore the code:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SamyDnx/raycasting-ts.git
   cd raycasting-ts
   ```

2. **Install the TypeScript compiler** (if you don't have it globally):
   ```bash
   npm install -g typescript
   ```

3. **Compile the TypeScript files:**
   ```bash
   tsc -w
   ```

4. **Launch:**
   Open the `index.html` file in your web browser (using a local development server like VSCode Live Server is recommended).
