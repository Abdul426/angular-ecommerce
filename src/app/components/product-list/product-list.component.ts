import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];

  currentCategoryId: number;
  currentCategoryName: string;
  searchMode: boolean;


  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  //Similar to @PostConstruct method
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }




  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    console.log(`In plistcomponent searchMode=${this.searchMode}`);
    if (this.searchMode)
      this.handleSearchProducts();
    else
      this.handleListProducts();
  }


  handleListProducts() {
    //Check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the "id" param string convert string to a number using the + symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //Now get the products for the given id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    console.log(`theKeyword ${theKeyword}`);

    //now search for the products 
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }
}



