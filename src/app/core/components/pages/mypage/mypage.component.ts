import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Product } from '../../../../interface/product.interface';
import { ProductService } from '../../../../services/product.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mypage',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './mypage.component.html',
  styleUrl: './mypage.component.css',
  providers:[
    HttpClient, ProductService,MessageService
  ]
})
export class MypageComponent implements OnInit {


  productDialog: boolean = false;

  deleteProductDialog: boolean = false;

  product!:Product;

  products:Product[]=[];

  submitted: boolean = false;

  rowsPerPageOptions: number[] = [5, 10, 20];

  constructor(private productService:ProductService, private messageService: MessageService) {}


  ngOnInit(): void {

    this.getProducts();
  }


  getProducts(){
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  openNew(){
    this.product = {} as Product;
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product:Product){
    this.product = { ...product }
    this.productDialog = true;
  }

  deleteProduct(product:Product){
    this.deleteProductDialog = true;
    this.product = { ...product }
  }

  confirmDelete(){
    this.deleteProductDialog = false;
    this.productService.deleteProduct(this.product.id).subscribe((data)=>{
      this.messageService.add({severity:'success',summary:'Product Deleted',detail:'Product '+this.product.nombre+' deleted successfully'});
    });
    this.getProducts();
  }

  hideDialog(){

    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct(){
    this.submitted = true;

    if(this.product.id){

      this.productService.updateProduct(this.product).subscribe((data) => {
        this.product = data;
        this.getProducts();
        this.messageService.add({severity:'success',summary:'Product Updated',detail:'Product '+this.product.nombre+' updated successfully'});
      })

    }else{
      this.productService.addProduct(this.product).subscribe((data)=>{
        this.product = data;
        this.getProducts();
        this.messageService.add({severity:'success',summary:'Product Created',detail:'Product '+this.product.nombre+' created successfully'});
      })
    }


    this.productDialog = false;
  }

}
