import Game from "./scenes/Game.js";
import Game2 from "./scenes/Game2.js";
import Game3 from "./scenes/Game3.js";
// Crear un nuevo objeto de configuración de Phaser
const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  // Lista de escenas para cargar
  // Solo se mostrará la primera escena
  // Recuerda importar la escena antes de añadirla a la lista
  scene: [Game, Game2, Game3],
};

// Crear una nueva instancia de juego Phaser
window.game = new Phaser.Game(config);
