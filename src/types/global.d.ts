// Para módulos CSS
declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
  }
  
  // Para arquivos SVG
  declare module '*.svg' {
    const content: string;
    export default content;
  }
  