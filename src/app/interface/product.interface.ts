export interface Product {
  id:     string;
  nombre: string;
  imagen: string;
  precio: number;
  estado: string;
  categoria: string;
}


export interface Category {
  id:     string;
  nombre: string;
}

export interface Estado {
  id:     string;
  nombre: string;
}
