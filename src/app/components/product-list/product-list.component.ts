import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;



  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

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

    //Check if we hvae a diff category than previous
    //Note: Angular will reuse a component if it is currently being viewed


    //If we have a diff catgory id than previous
    //then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)

    //Now get the products for the given id
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;

    });
  }

  // processResult() {
  //   return data => {
  //     this.products = data._embedded.products;
  //     this.thePageNumber = data.page.number + 1;
  //     this.thePageSize = data.page.size;
  //     this.theTotalElements = data.page.totalElements;

  //   }
  // }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    console.log(`theKeyword ${theKeyword}`);

    //now search for the products 
    // this.productService.searchProducts(theKeyword).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${this.previousKeyword}, thePageNumber=${this.thePageNumber}`)


    this.productService.searchProductListPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;

    });
  }

  updatePageSize(event: Event) {
    const pageSize = +(event.target as HTMLInputElement).value;
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);


    this.cartService.addToCart(new CartItem(theProduct));
  }
}