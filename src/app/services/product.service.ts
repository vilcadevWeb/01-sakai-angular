import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category, Estado, Product } from '../interface/product.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  private Url: string = environment.baseUrl;


  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.Url}/products`);
  }

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.Url}/categories`);
  }



  addProduct(product:Product):Observable<Product>{

    return this.http.post<Product>(`${this.Url}/products`,product);

  }

  updateProduct(product:Product):Observable<Product>{
    return this.http.patch<Product>(`${this.Url}/products/${product.id}`,product);
  }


  deleteProduct(id:string):Observable<Product>{

    return this.http.delete<Product>(`${this.Url}/products/${id}`);
  }
}
