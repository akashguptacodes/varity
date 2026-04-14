const BASE_VIDEOS = [
  {
    id: "v1",
    slug: "cinematic-color-grading",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "Primary Correction",
    category: "Workflow",
    author: "Alex Rivera",
    description: "Master the art of basic color balancing.",
    longDescription: "Dive deep into the science of color. Our platform provides industry-leading LUTs and a node-based grading system that allows you to sculpt light and hue with surgical precision.",
    height: 320, 
    expandDir: "right"
  },
  {
    id: "v2",
    slug: "timeline-editing-mastery",
    src: "https://www.youtube.com/embed/9bZkp7q19f0",
    title: "Timeline Fluidity",
    category: "Editing",
    author: "Sarah Chen",
    description: "Experience fluid, non-linear editing.",
    longDescription: "Speed is the essence of creativity. Our magnetic timeline eliminates the friction of traditional editing, allowing for instantaneous rearrangement of complex sequences.",
    height: 320,
    expandDir: "right"
  },
  {
    id: "v3",
    slug: "black-level-matching",
    src: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    title: "Cinematic Color Grading",
    category: "Post-Production",
    author: "Jordan Smith",
    description: "Match black levels flawlessly across multiple shots.",
    longDescription: "Unlock the power of integrated VFX. From sophisticated particle systems to high-fidelity 3D compositing, our unified workspace means you never have to round-trip.",
    height: 480,
    expandDir: "left"
  },
  {
    id: "v4",
    slug: "motion-graphics-vfx",
    src: "https://www.youtube.com/embed/kJQP7kiw5Fk",
    title: "Motion Graphics & VFX",
    category: "Visual Effects",
    author: "Elena Petrova",
    description: "Create jaw-dropping motion graphics directly in your workspace.",
    longDescription: "Build complex animations with a powerful ease-based keyframe engine that gives you total control over every pixel.",
    height: 300,
    expandDir: "left"
  },
  {
    id: "v5",
    slug: "cloud-rendering-pipeline",
    src: "https://www.youtube.com/embed/RgKAFK5djSk",
    title: "Cloud Rendering Pipeline",
    category: "Infrastructure",
    author: "David Miller",
    description: "Offload heavy renders to our distributed cloud infrastructure. Get 8K exports in minutes.",
    longDescription: "Scale your production without hardware limits. Our cloud rendering pipeline offloads the heavy lifting to thousands of distributed GPUs, delivering massive speed gains for complex 8K renders.",
    height: 420,
    expandDir: "right"
  },
  {
    id: "v6",
    slug: "real-time-collaboration",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "Real-time Collaboration",
    category: "Teamwork",
    author: "Mila Jovic",
    description: "Real-time team editing seamlessly.",
    longDescription: "The future of filmmaking is collaborative. Our platform enables multiple editors to work on the same project simultaneously, with instant versioning.",
    height: 400,
    expandDir: "left"
  },
  {
    id: "v7",
    slug: "audio-design",
    src: "https://www.youtube.com/embed/9bZkp7q19f0",
    title: "Spatial Audio Design",
    category: "Sound Design",
    author: "Liam Nees",
    description: "Immersive 7.1 surround sound mixing.",
    longDescription: "Vision is only half the story. Our integrated audio suite brings broadcast-quality sound design to your desktop. Featuring AI-driven noise reduction and a comprehensive library.",
    height: 420,
    expandDir: "left"
  },
   {
    id: "v7",
    slug: "audio-design",
    src: "https://www.youtube.com/embed/9bZkp7q19f0",
    title: "Spatial Audio Design",
    category: "Sound Design",
    author: "Liam Nees",
    description: "Immersive 7.1 surround sound mixing.",
    longDescription: "Vision is only half the story. Our integrated audio suite brings broadcast-quality sound design to your desktop. Featuring AI-driven noise reduction and a comprehensive library.",
    height: 420,
    expandDir: "left"
  }
];

export const VIDEOS_MAP = {
  1: [...BASE_VIDEOS],
  2: [...BASE_VIDEOS],
  3: [...BASE_VIDEOS],
  4: [...BASE_VIDEOS],
  5: [...BASE_VIDEOS],
};

export const getComplexColumns = (categoryId = 1) => {
  const colA = []; // spans 2
  const colB = []; // spans 1
  const colC = []; // spans 1

  let i = 0;
  let rowIndex = 0;
  
  const videos = VIDEOS_MAP[categoryId] || BASE_VIDEOS;

  while (i < videos.length) {
    if (rowIndex % 2 === 0) {
      // Even row: takes 4 videos
      const chunk = videos.slice(i, i + 4);
      if (chunk.length >= 2) {
        colA.push({ type: 'pair', id: `row-${rowIndex}-a`, pair: [chunk[0], chunk[1]] });
      } else if (chunk.length === 1) {
        // Fallback if odd number remains
        colA.push({ type: 'wide', id: `row-${rowIndex}-a`, card: chunk[0] });
      }
      
      if (chunk.length >= 3) {
        colB.push({ type: 'single', id: `row-${rowIndex}-b`, card: chunk[2] });
      }
      if (chunk.length >= 4) {
        colC.push({ type: 'single', id: `row-${rowIndex}-c`, card: chunk[3] });
      }
      i += 4;
    } else {
      // Odd row: takes 3 videos
      const chunk = videos.slice(i, i + 3);
      if (chunk.length >= 1) {
        colA.push({ type: 'wide', id: `row-${rowIndex}-a`, card: chunk[0] });
      }
      if (chunk.length >= 2) {
        colB.push({ type: 'single', id: `row-${rowIndex}-b`, card: chunk[1] });
      }
      if (chunk.length >= 3) {
        colC.push({ type: 'single', id: `row-${rowIndex}-c`, card: chunk[2] });
      }
      i += 3;
    }
    rowIndex++;
  }

  return [
    { id: "col-a", speed: -1.2, offsetTop: 120, items: colA },       // Col 1 & 2: Base level (lowest)
    { id: "col-b", speed: -2.5, offsetTop: 60, items: colB },     // Col 3: Slightly up
    { id: "col-c", speed: -1.8, offsetTop: 0, items: colC }     // Col 4: More up
  ];
};

export function getYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
}
