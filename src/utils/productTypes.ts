
export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'file' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: any) => boolean | string;
  };
}

export interface ProductTypeDefinition {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  fields: Record<string, FormField>;
  sections: {
    id: string;
    title: string;
    description?: string;
    fieldIds: string[];
  }[];
}

// Definición para equipos de cómputo (basado en el formulario existente)
export const computerEquipment: ProductTypeDefinition = {
  id: 'computer',
  name: 'Equipo de Cómputo',
  icon: 'laptop',
  fields: {
    descripcion: {
      id: 'descripcion',
      type: 'text',
      label: 'Descripción del Equipo',
      placeholder: 'Descripción',
      required: true
    },
    numeroSerie: {
      id: 'numeroSerie',
      type: 'text',
      label: 'Número de Serie',
      placeholder: 'Número de serie',
      required: true
    },
    // ... Se pueden agregar todos los campos del formulario actual
  },
  sections: [
    {
      id: 'basic',
      title: 'Información Básica',
      fieldIds: ['descripcion', 'numeroSerie', 'numeroActivoFijo', 'marca', 'categoria', 'imagen']
    },
    // ... Se pueden agregar todas las secciones del formulario actual
  ]
};

// Definición para videoproyectores
export const projector: ProductTypeDefinition = {
  id: 'projector',
  name: 'Videoproyector',
  icon: 'projector',
  fields: {
    modelo: {
      id: 'modelo',
      type: 'text',
      label: 'Modelo',
      placeholder: 'Modelo del videoproyector',
      required: true
    },
    lumens: {
      id: 'lumens',
      type: 'number',
      label: 'Lumens',
      placeholder: 'Cantidad de lumens',
      required: true
    },
    resolucion: {
      id: 'resolucion',
      type: 'select',
      label: 'Resolución',
      options: [
        { value: 'svga', label: 'SVGA (800x600)' },
        { value: 'xga', label: 'XGA (1024x768)' },
        { value: 'wxga', label: 'WXGA (1280x800)' },
        { value: 'fullhd', label: 'Full HD (1920x1080)' },
        { value: '4k', label: '4K (3840x2160)' }
      ],
      required: true
    },
    conexiones: {
      id: 'conexiones',
      type: 'select',
      label: 'Tipo de Conexiones',
      options: [
        { value: 'hdmi', label: 'HDMI' },
        { value: 'vga', label: 'VGA' },
        { value: 'usb', label: 'USB' },
        { value: 'wireless', label: 'Inalámbrico' }
      ],
      required: true
    }
  },
  sections: [
    {
      id: 'basic',
      title: 'Especificaciones',
      fieldIds: ['modelo', 'lumens', 'resolucion', 'conexiones']
    }
  ]
};

// Definición para pantallas táctiles
export const touchScreen: ProductTypeDefinition = {
  id: 'touchscreen',
  name: 'Pantalla Táctil',
  icon: 'monitor',
  fields: {
    tamano: {
      id: 'tamano',
      type: 'number',
      label: 'Tamaño (pulgadas)',
      placeholder: 'Tamaño en pulgadas',
      required: true
    },
    resolucion: {
      id: 'resolucion',
      type: 'select',
      label: 'Resolución',
      options: [
        { value: 'hd', label: 'HD (1366x768)' },
        { value: 'fullhd', label: 'Full HD (1920x1080)' },
        { value: '4k', label: '4K (3840x2160)' }
      ],
      required: true
    },
    tipoPanel: {
      id: 'tipoPanel',
      type: 'select',
      label: 'Tipo de Panel',
      options: [
        { value: 'ips', label: 'IPS' },
        { value: 'va', label: 'VA' },
        { value: 'tn', label: 'TN' }
      ],
      required: true
    },
    puntosToque: {
      id: 'puntosToque',
      type: 'number',
      label: 'Puntos de Toque',
      placeholder: 'Número de puntos de toque',
      required: true
    }
  },
  sections: [
    {
      id: 'basic',
      title: 'Especificaciones',
      fieldIds: ['tamano', 'resolucion', 'tipoPanel', 'puntosToque']
    }
  ]
};

// Definición para access points
export const accessPoint: ProductTypeDefinition = {
  id: 'accesspoint',
  name: 'Access Point',
  icon: 'wifi',
  fields: {
    estandar: {
      id: 'estandar',
      type: 'select',
      label: 'Estándar Wi-Fi',
      options: [
        { value: '80211n', label: '802.11n' },
        { value: '80211ac', label: '802.11ac' },
        { value: '80211ax', label: '802.11ax (Wi-Fi 6)' }
      ],
      required: true
    },
    bandas: {
      id: 'bandas',
      type: 'select',
      label: 'Bandas',
      options: [
        { value: '2.4', label: '2.4 GHz' },
        { value: '5', label: '5 GHz' },
        { value: 'dual', label: 'Dual Band (2.4 y 5 GHz)' },
        { value: 'triband', label: 'Tri-Band' }
      ],
      required: true
    },
    velocidad: {
      id: 'velocidad',
      type: 'text',
      label: 'Velocidad Máxima',
      placeholder: 'Ej: 1200 Mbps',
      required: true
    },
    puertosLan: {
      id: 'puertosLan',
      type: 'number',
      label: 'Puertos LAN',
      placeholder: 'Número de puertos',
      required: true
    }
  },
  sections: [
    {
      id: 'basic',
      title: 'Especificaciones',
      fieldIds: ['estandar', 'bandas', 'velocidad', 'puertosLan']
    }
  ]
};

// Lista de todos los tipos de productos disponibles
export const productTypesList = [
  {
    id: computerEquipment.id,
    name: computerEquipment.name,
    description: 'Computadores, laptops y servidores'
  },
  {
    id: projector.id,
    name: projector.name,
    description: 'Proyectores, videoproyectores y beams'
  },
  {
    id: touchScreen.id,
    name: touchScreen.name,
    description: 'Pantallas y monitores táctiles'
  },
  {
    id: accessPoint.id,
    name: accessPoint.name,
    description: 'Puntos de acceso Wi-Fi'
  }
];

// Obtener la definición del tipo de producto por ID
export const getProductTypeById = (id: string): ProductTypeDefinition | undefined => {
  switch (id) {
    case 'computer':
      return computerEquipment;
    case 'projector':
      return projector;
    case 'touchscreen':
      return touchScreen;
    case 'accesspoint':
      return accessPoint;
    default:
      return undefined;
  }
};
