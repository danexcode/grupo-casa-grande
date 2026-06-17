export interface Producto {
  brand: string;
  nombre: string;
  spec: string;
}

export interface Subcategoria {
  titulo: string;
  items: string;
}

export interface Categoria {
  slug: string;
  num: string;
  titulo: string;
  lede: string;
  subcategorias: Subcategoria[];
  productos: Producto[];
  marcas: string[];
  /** Mensaje prellenado de WhatsApp para los CTA de la categoría */
  waMsg: string;
}

export const categorias: Categoria[] = [
  {
    slug: "automatizacion-y-control",
    num: "01",
    titulo: "Automatización y Control Industrial",
    lede:
      "Controladores de turbina, gobernadores de velocidad y sensores de seguridad para plantas que no pueden parar. Trabajamos con Woodward, Tri-Sen, Schmersal y Siemens.",
    subcategorias: [
      { titulo: "Controladores de Turbinas", items: "Control digital · arranque y protección" },
      { titulo: "Gobernadores de Velocidad", items: "Electrónicos · control en cascada" },
      { titulo: "Sensores e Interruptores", items: "Seguridad · enclavamiento · IP67" },
      { titulo: "Controladores Lógicos (PLC)", items: "PLC compactos · módulos de E/S · PROFINET" },
    ],
    productos: [
      {
        brand: "Woodward",
        nombre: "Control Digital Peak 150",
        spec: "Turbinas de vapor de una válvula. Entrada 4–20 mA, gabinete NEMA 4X, prueba de sobrevelocidad.",
      },
      {
        brand: "Tri-Sen",
        nombre: "310SV",
        spec: "Controlador configurable: arranque, velocidad y protección, con control en cascada de presión/flujo.",
      },
      {
        brand: "Schmersal",
        nombre: "Sensores IP67",
        spec: "Interruptores de seguridad y enclavamiento, grado IP67, –25 a 60 °C, para guardas de máquina.",
      },
      {
        brand: "Siemens",
        nombre: "SIMATIC S7-1200",
        spec: "PLC compacto con PROFINET integrado, E/S analógicas y control PID embebido.",
      },
    ],
    marcas: ["Woodward", "Tri-Sen", "Schmersal", "Siemens"],
    waMsg: "Hola, Grupo Casa Grande. Quiero cotizar Automatización y Control Industrial.",
  },
];
