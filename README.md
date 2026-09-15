# Raycasting TS 🔦

A lightweight 2D raycasting engine built entirely with TypeScript and the HTML5 Canvas API.

![Demo Raycasting](demo.gif)

## Motivation

This project was built to explore and implement dynamic raycasting light mechanics and line-of-sight algorithms from scratch. It serves as the foundational rendering engine for a 2D top-down multiplayer maze game prototype. By relying strictly on pure TypeScript and the native Canvas API, this project avoids the overhead of large game engines while offering complete, low-level control over rendering performance and game logic.

## Quick Start

Get the engine running locally in just a few steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/SamyDnx/raycasting-ts.git](https://github.com/SamyDnx/raycasting-ts.git)
   cd raycasting-ts
   ```

2. **Install the TypeScript compiler** (if you don't have it globally):
   ```bash
   npm install -g typescript
   ```

3. **Compile the TypeScript files:**
   Run the compiler in watch mode to automatically compile your code as you work.
   ```bash
   tsc -w
   ```

4. **Launch the game:**
   Open the `index.html` file in your web browser. For the best development experience, it is recommended to use a local development server (like the VSCode Live Server extension).

## Usage

*Note: Adapt the class names and methods below to match your specific implementation.*

To use the raycasting mechanics, set up your HTMLCanvasElement and initialize the main game loop:

```typescript
// 1. Setup the canvas
const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// 2. Initialize your game entities
const player = new Player(100, 100);
const maze = new Map();

// 3. The main game loop
function gameLoop() {
  // Clear previous frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Handle inputs
  player.update();
  
  // Draw environment and cast dynamic lights
  maze.draw(ctx);
  castRays(player.x, player.y, maze, ctx);
  
  // Loop
  requestAnimationFrame(gameLoop);
}

// Start the engine
gameLoop();
```

## Contributing

Contributions, issues, and feature requests are welcome! If you want to improve the raycasting algorithm's performance, add new rendering features, or fix bugs:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
