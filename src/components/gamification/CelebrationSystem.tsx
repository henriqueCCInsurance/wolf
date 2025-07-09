import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import * as THREE from 'three';
import { useAppStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { trackSuccessCelebration } from '@/services/activityTracking';

interface CelebrationSystemProps {
  isActive: boolean;
  celebrationType: 'meeting-booked' | 'follow-up' | 'intelligence' | 'referral';
  onComplete: () => void;
}

interface Firework {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  life: number;
  maxLife: number;
  particles: Particle[];
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  life: number;
  maxLife: number;
}

const CelebrationSystem: React.FC<CelebrationSystemProps> = ({
  isActive,
  celebrationType,
  onComplete
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const { profile } = useAppStore();
  const { user } = useAuth();
  const [currentImageIndex] = useState(0);

  const celebrationConfig = {
    'meeting-booked': {
      emoji: '🎯',
      message: 'Meeting Booked!',
      subtitle: 'Outstanding! You locked in a meeting!',
      color: '#10B981',
      fireworksCount: 8,
      duration: 4000
    },
    'follow-up': {
      emoji: '📅',
      message: 'Follow-up Scheduled!',
      subtitle: 'Great progress! Next step secured!',
      color: '#3B82F6',
      fireworksCount: 5,
      duration: 3000
    },
    'intelligence': {
      emoji: '💡',
      message: 'Intelligence Gathered!',
      subtitle: 'Valuable intel collected!',
      color: '#F59E0B',
      fireworksCount: 3,
      duration: 2500
    },
    'referral': {
      emoji: '🤝',
      message: 'Referral Received!',
      subtitle: 'Excellent networking!',
      color: '#8B5CF6',
      fireworksCount: 6,
      duration: 3500
    }
  };

  const config = celebrationConfig[celebrationType];

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useEffect(() => {
    if (!isActive || !mountRef.current) return;

    // Show confetti
    setShowConfetti(true);
    
    // Track celebration activity
    if (user) {
      trackSuccessCelebration(user, {
        celebrationType,
        milestone: config.message
      });
    }

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    camera.position.z = 5;

    // Create fireworks
    const createFirework = () => {
      const firework: Firework = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          -5,
          0
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          Math.random() * 3 + 5,
          0
        ),
        color: new THREE.Color(config.color),
        life: 0,
        maxLife: 60 + Math.random() * 40,
        particles: []
      };
      
      return firework;
    };

    const createParticles = (firework: Firework) => {
      const particles: Particle[] = [];
      const particleCount = 20 + Math.random() * 30;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        
        particles.push({
          position: firework.position.clone(),
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            (Math.random() - 0.5) * 2
          ),
          color: new THREE.Color().setHSL(
            Math.random(),
            0.8,
            0.6
          ),
          life: 0,
          maxLife: 30 + Math.random() * 20
        });
      }
      
      return particles;
    };

    // Create initial fireworks
    for (let i = 0; i < config.fireworksCount; i++) {
      setTimeout(() => {
        fireworksRef.current.push(createFirework());
      }, i * 300);
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Clear previous frame
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }
      
      // Update fireworks
      fireworksRef.current = fireworksRef.current.filter(firework => {
        firework.life++;
        firework.position.add(firework.velocity);
        firework.velocity.y -= 0.1; // gravity
        
        // Explode when reaching peak or max life
        if (firework.velocity.y <= 0 || firework.life >= firework.maxLife) {
          if (firework.particles.length === 0) {
            firework.particles = createParticles(firework);
          }
        }
        
        // Render trail
        if (firework.particles.length === 0) {
          const geometry = new THREE.SphereGeometry(0.05, 8, 8);
          const material = new THREE.MeshBasicMaterial({ color: firework.color });
          const sphere = new THREE.Mesh(geometry, material);
          sphere.position.copy(firework.position);
          scene.add(sphere);
        }
        
        // Update particles
        firework.particles = firework.particles.filter(particle => {
          particle.life++;
          particle.position.add(particle.velocity);
          particle.velocity.multiplyScalar(0.98); // friction
          particle.velocity.y -= 0.05; // gravity
          
          const alpha = 1 - (particle.life / particle.maxLife);
          if (alpha > 0) {
            const geometry = new THREE.SphereGeometry(0.02, 6, 6);
            const material = new THREE.MeshBasicMaterial({ 
              color: particle.color,
              transparent: true,
              opacity: alpha
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(particle.position);
            scene.add(sphere);
            return true;
          }
          return false;
        });
        
        return firework.particles.length > 0 || firework.life < firework.maxLife;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Cleanup after duration
    const timer = setTimeout(() => {
      setShowConfetti(false);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      onComplete();
    }, config.duration);

    return () => {
      clearTimeout(timer);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [isActive, celebrationType, config, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          colors={[config.color, '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']}
        />
      )}
      
      {/* Three.js Fireworks */}
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Success Message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto px-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1]
            }}
            className="text-8xl mb-4"
          >
            {config.emoji}
          </motion.div>
          
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            {config.message}
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xl text-white"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            {config.subtitle}
          </motion.p>
          
          {/* User's Why I Sell */}
          {profile.whyISell && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg"
            >
              <p className="text-lg text-white font-semibold mb-2">Remember Your Why:</p>
              <p className="text-white/90 italic">{profile.whyISell}</p>
            </motion.div>
          )}
          
          {/* Motivational Images */}
          {profile.motivationalImages && profile.motivationalImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-4"
            >
              <img
                src={profile.motivationalImages[currentImageIndex % profile.motivationalImages.length]}
                alt="Your motivation"
                className="w-48 h-32 object-cover rounded-lg mx-auto shadow-lg"
              />
            </motion.div>
          )}
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
            className="mt-6"
          >
            <div 
              className="px-6 py-2 rounded-full text-white font-semibold text-lg"
              style={{ backgroundColor: config.color }}
            >
              +{celebrationType === 'meeting-booked' ? '100' : 
                 celebrationType === 'follow-up' ? '75' : 
                 celebrationType === 'referral' ? '90' : '50'} Points!
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CelebrationSystem;