import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Category, Estado, Product } from '../../../../interface/product.interface';
import { ProductService } from '../../../../services/product.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  categories:Category[]=[];

  statuses: any[] = [];


  submitted: boolean = false;

  rowsPerPageOptions: number[] = [5, 10, 20];

  form!: FormGroup;

  constructor(private productService:ProductService, private messageService: MessageService, public fb: FormBuilder) {

    this.form = this.fb.group({
      id:[''],
      nombre:['',[Validators.required]],
      imagen:['',[Validators.required]],
      precio:[,[Validators.required]],
      estado:['',[Validators.required]],
      categoria:['',[Validators.required]],
    })

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
  ];

  }


  ngOnInit(): void {

    this.getProducts();
    this.getCategories();

  }




  getProducts(){
    this.productService.getProducts().subscribe(data => this.products = data);
  }
  getCategories(){
    this.productService.getCategories().subscribe(data => this.categories = data);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.nombre : 'Desconocida';  // Devuelve 'Desconocida' si no se encuentra la categoría
  }

  getStatusLabel(status: string): string {
    const statusObj = this.statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : 'Desconocido';  // Devuelve 'Desconocido' si no se encuentra el estado
  }


  openNew(){
    this.form.reset();
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product:Product){
    this.form.patchValue({...product});
    this.productDialog = true;
  }

  deleteProduct(product:Product){
    this.deleteProductDialog = true;
    this.form.patchValue({...product});
  }

  confirmDelete(){
    const productId = this.form.get('id')?.value;
    this.deleteProductDialog = false;
    this.productService.deleteProduct(productId).subscribe((data)=>{
      this.getProducts();
      this.messageService.add({severity:'success',summary:'Product Deleted',detail:'Product '+data.nombre+' deleted successfully'});
    });

  }

  hideDialog(){

    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct(){

    if(this.form.invalid){
      this.isTouched();
      return;
    }

    if(this.form.get('id')?.value){

      this.productService.updateProduct(this.form.value as Product).subscribe((data) => {
        this.product = data;
        this.getProducts();
        this.messageService.add({severity:'success',summary:'Product Updated',detail:'Product '+this.product.nombre+' updated successfully'});
      })

    }else{
      console.log(this.form.value);
      const { id, ...productWithoutId } = this.form.value;
      this.productService.addProduct(productWithoutId as Product).subscribe((data)=>{
        this.product = data;
        this.getProducts();
        this.messageService.add({severity:'success',summary:'Product Created',detail:'Product '+this.product.nombre+' created successfully'});
      })
    }


    this.productDialog = false;
  }


  isTouched() {
    Object.values(this.form.controls).forEach((control) => {
        control.markAsTouched();
    });
}

  isRequire(controlName: string, errorType: string) {
    const control = this.form.get(controlName);
    return control?.invalid && control?.errors && control?.errors[errorType] && (control?.touched || control?.dirty);
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

}
