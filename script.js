"use strict";
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    mul(v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }
    div(v) {
        return new Vector2(this.x / v.x, this.y / v.y);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    norm() {
        const l = this.length();
        if (l === 0)
            return new Vector2(0, 0);
        return new Vector2(this.x / l, this.y / l);
    }
    scale(n) {
        return new Vector2(this.x * n, this.y * n);
    }
    distanceTo(v) {
        return v.sub(this).length();
    }
    array() {
        return [this.x, this.y];
    }
}
// player
const RAY_NUMBER = 200;
const FOV = Math.PI / 2.5;
const VELOCITY = 2 * 0.01;
const ANGLE_VEL = 2 * 0.01;
// map
const EPS = 10e-6;
const GRID_COLS = 10;
const GRID_ROWS = 10;
const GRID_SIZE = new Vector2(GRID_COLS, GRID_ROWS);
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
class Player {
    constructor(pos, angl = 0) {
        this.pos = pos;
        this.angl = angl;
    }
}
const player = new Player(new Vector2(1.5, 1.5));
function canvasSize(ctx) {
    return new Vector2(ctx.canvas.width, ctx.canvas.height);
}
function strokeLine(ctx, start, end) {
    ctx.beginPath();
    ctx.moveTo(...start.array());
    ctx.lineTo(...end.array());
    ctx.stroke();
}
function fillCircle(ctx, center, radius) {
    ctx.beginPath();
    ctx.arc(...center.array(), radius, 0, 2 * Math.PI);
    ctx.fill();
}
function snap(x, dx) {
    if (dx > 0)
        return Math.ceil(x);
    if (dx < 0)
        return Math.floor(x);
    return x;
}
function rayStep(ctx, p1, p2) {
    const delta = p2.sub(p1);
    if (delta.x !== 0) {
        const m = delta.y / delta.x;
        const p = p1.y - m * p1.x;
        let x3 = snap(p2.x, delta.x);
        x3 += EPS * Math.sign(delta.x);
        const y3 = m * x3 + p;
        let p3 = new Vector2(x3, y3);
        // ctx.fillStyle = "blue"
        // fillCircle(ctx, new Vector2(x3, y3), 0.05)
        if (m !== 0) {
            let b3 = snap(p2.y, delta.y);
            b3 += EPS * Math.sign(delta.y);
            const a3 = (b3 - p) / m;
            const c3 = new Vector2(a3, b3);
            if (p2.distanceTo(c3) < p2.distanceTo(p3)) {
                p3 = c3;
            }
            // ctx.fillStyle = "red"
            // fillCircle(ctx, new Vector2(a3, b3), 0.05);
        }
        return p3;
    }
    else {
        let y3 = snap(p2.y, delta.y);
        y3 += EPS * Math.sign(delta.y);
        const x3 = p2.x;
        let p3 = new Vector2(x3, y3);
        return p3;
    }
}
function render3D(ctx, distances) {
    ctx.save();
    ctx.fillStyle = "#00B9F7";
    ctx.fillRect(0, 0, canvasSize(ctx).x, canvasSize(ctx).y / 2);
    ctx.fillStyle = "#555555";
    ctx.fillRect(0, canvasSize(ctx).y / 2, canvasSize(ctx).x, canvasSize(ctx).y / 2);
    ctx.fillStyle = "#df3e55";
    const w = canvasSize(ctx).x / RAY_NUMBER;
    for (let i = 0; i < distances.length; i++) {
        const h = canvasSize(ctx).y / distances[i];
        const x = i * w;
        const y = (canvasSize(ctx).y - h) / 2;
        // console.log(x, y, w, h);
        const shade = 1 / (1 + distances[i] * 0.2);
        const r = Math.floor(0xdf * shade)
            .toString(16)
            .padStart(2, "0");
        const g = Math.floor(0x3e * shade)
            .toString(16)
            .padStart(2, "0");
        const b = Math.floor(0x55 * shade)
            .toString(16)
            .padStart(2, "0");
        ctx.fillStyle = `#${r}${g}${b}`;
        ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
}
function grid(ctx, p2) {
    ctx.save();
    ctx.scale(0.2, 0.2);
    // ctx.scale(1, 1);
    ctx.fillStyle = "#181818";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.scale(ctx.canvas.width / GRID_COLS, ctx.canvas.height / GRID_ROWS);
    ctx.lineWidth = 0.01;
    // draw walls
    ctx.fillStyle = "#505050";
    for (let y = 0; y < GRID_ROWS; y++) {
        for (let x = 0; x < GRID_COLS; x++) {
            if (map[y][x] === 1) {
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
    // draw lines between cells
    ctx.strokeStyle = "#303030";
    for (let x = 0; x <= GRID_ROWS; x++) {
        strokeLine(ctx, new Vector2(x, 0), new Vector2(x, GRID_ROWS));
    }
    for (let y = 0; y <= GRID_COLS; y++) {
        strokeLine(ctx, new Vector2(0, y), new Vector2(GRID_COLS, y));
    }
    // draw rays
    // let p1 = new Vector2(4.2, 6.7);
    ctx.fillStyle = "lime";
    ctx.strokeStyle = "lime";
    if (p2 !== undefined) {
        // draw ray until it hits a wall
        for (let i = 0; i < RAY_NUMBER; i++) {
            const rayAngle = player.angl + (-FOV / 2 + i * (FOV / RAY_NUMBER));
            const ray = new Vector2(Math.cos(rayAngle), Math.sin(rayAngle)).scale(0.01);
            rayCast(ctx, player.pos, player.pos.add(ray));
            // anti fisheye
            // const dist_perp = dist * Math.cos(rayAngle - player.angl);
        }
    }
    ctx.restore();
}
function rayCast(ctx, p1, p2) {
    for (;;) {
        // fillCircle(ctx, p2, 0.1);
        strokeLine(ctx, p1, p2);
        // console.log(p2.y);
        if (map[Math.floor(p2.y)][Math.floor(p2.x)] === 1) {
            return player.pos.distanceTo(p2);
        }
        // for (let i = 0; i < RAY_NUMBER; i++) {
        //     const rayAngle =
        //         player.angl + (-FOV / 2 + i * (FOV / RAY_NUMBER));
        //     let pt = rayStep(
        //         ctx,
        //         p1,
        //         new Vector2(Math.cos(rayAngle), Math.sin(rayAngle)),
        //     );
        //     strokeLine(ctx, p1, pt);
        // }
        let p3 = rayStep(ctx, p1, p2);
        p1 = p2;
        p2 = p3;
    }
}
function gameLoop(ctx, player, keys) {
    if (keys["ArrowRight"]) {
        player.angl += ANGLE_VEL;
    }
    if (keys["ArrowLeft"]) {
        player.angl -= ANGLE_VEL;
    }
    if (keys["ArrowUp"]) {
        const dir = new Vector2(Math.cos(player.angl), Math.sin(player.angl)).scale(VELOCITY);
        const pos_t = player.pos.add(dir);
        if (map[Math.floor(pos_t.y)][Math.floor(pos_t.x)] !== 1) {
            player.pos = player.pos.add(dir);
        }
    }
    if (keys["ArrowDown"]) {
        const dir = new Vector2(Math.cos(player.angl), Math.sin(player.angl)).scale(VELOCITY);
        const pos_t = player.pos.sub(dir);
        if (map[Math.floor(pos_t.y)][Math.floor(pos_t.x)] !== 1) {
            player.pos = player.pos.sub(dir);
        }
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const distances = [];
    for (let i = 0; i < RAY_NUMBER; i++) {
        const rayAngle = player.angl + (-FOV / 2 + i * (FOV / RAY_NUMBER));
        const ray = new Vector2(Math.cos(rayAngle), Math.sin(rayAngle));
        const dist = rayCast(ctx, player.pos, player.pos.add(ray));
        distances.push(dist * Math.cos(rayAngle - player.angl));
    }
    render3D(ctx, distances);
    grid(ctx, player.pos);
    requestAnimationFrame(() => gameLoop(ctx, player, keys));
}
// main
(() => {
    const game = document.getElementById("game");
    if (game === null)
        throw new Error("Canvas could not be loaded");
    const ctx = game.getContext("2d");
    if (ctx === null)
        throw new Error("Context 2d not supported");
    // Stuff to make the lines looks good. (resolution difference issue)
    const rect = game.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    game.width = rect.width * dpr;
    game.height = rect.height * dpr;
    // ctx.scale(dpr, dpr);
    // back to normal stuff
    // let p2: Vector2 | undefined = undefined;
    const keys = {};
    window.addEventListener("keydown", (event) => {
        keys[event.key] = true;
        // console.log(keys);
    });
    window.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });
    grid(ctx, player.pos);
    requestAnimationFrame(() => gameLoop(ctx, player, keys));
})();
