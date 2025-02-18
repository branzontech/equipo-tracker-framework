import { useEffect, useRef } from 'react';

const Colors = [
  "#2ecc71", // green
  "#3498db", // blue
  "#e67e22", // orange
  "#e74c3c", // red
  "#ecf0f1", // white
  "#9b59b6", // purple
  "#2c3e50", // night-blue
];

class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v: Vector2) {
    const newV = new Vector2(this.x - v.x, this.y - v.y);
    return newV;
  }

  set(v: { x: number; y: number }) {
    this.x = v.x;
    this.y = v.y;
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  limit(max: number) {
    const mSq = this.x * this.x + this.y * this.y;
    if (mSq > max * max) {
      const norm = Math.sqrt(mSq);
      this.x = (this.x / norm) * max;
      this.y = (this.y / norm) * max;
    }
    return this;
  }

  direction() {
    return Math.atan2(this.y, this.x);
  }
}

class Particle {
  pos: Vector2;
  acc: Vector2;
  speed: Vector2;
  color: string;
  maxSpeed: number;

  constructor(x: number, y: number, maxSpeed: number) {
    this.pos = new Vector2(x, y);
    this.acc = new Vector2(0, 0);
    this.speed = new Vector2(0, 0);
    this.color = Colors[Math.floor(Math.random() * Colors.length)];
    this.maxSpeed = maxSpeed + Math.random() * maxSpeed;
  }

  update() {
    this.speed.add(this.acc);
    this.speed.limit(10);
    this.pos.add(this.speed);
    this.acc.set({ x: 0, y: 0 });
  }

  lookFor(tar: Vector2) {
    const dir = tar.copy();
    const steer = dir.sub(this.speed);
    steer.limit(this.maxSpeed);
    this.force(steer);
  }

  force(f: Vector2) {
    this.acc.add(f);
  }

  render(ctx: CanvasRenderingContext2D, size: number) {
    const d = this.speed.direction();
    const piD2 = Math.PI / 2;
    
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(Math.cos(d) * size + this.pos.x, Math.sin(d) * size + this.pos.y);
    ctx.lineTo(Math.cos(d + piD2) * (size/3) + this.pos.x, Math.sin(d + piD2) * (size/2) + this.pos.y);
    ctx.lineTo(Math.cos(d - piD2) * (size/3) + this.pos.x, Math.sin(d - piD2) * (size/3) + this.pos.y);
    ctx.lineTo(Math.cos(d) * size + this.pos.x, Math.sin(d) * size + this.pos.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef(new Vector2(0, 0));
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const amount = 50;
      for (let i = 0; i < amount; i++) {
        particles.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            0.25
          )
        );
      }
      return particles;
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Reducimos la opacidad del fondo para hacer las partículas más visibles
      ctx.fillStyle = 'rgba(11,37,89,0.1)'; // Color de fondo más transparente que coincide con el tema
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.lookFor(mouseRef.current);
        particle.update();
        particle.render(ctx, 10);
      });

      // Hacemos el efecto del mouse más visible
      ctx.fillStyle = '#F2E205'; // Color amarillo que coincide con el tema
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 5, 0, Math.PI * 2);
      ctx.closePath();
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#F2E205';
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.set({ x: e.pageX, y: e.pageY });
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    mouseRef.current = new Vector2(canvas.width / 2, canvas.height / 2);
    particlesRef.current = createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default ParticleEffect;
