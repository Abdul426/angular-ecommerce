import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //Default size is 20
  //private baseUrl = 'http://localhost:8080/api/products?size=100';
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) {

  }

  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {

    // build URL based on category id, page and size
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchURL);
  }
  getProductList(theCategoryId: number): Observable<Product[]> {

    // build URL based on category id
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchURL);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchProductByKeyworkdURL = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    console.log(`searchPByKwrdURL ${searchProductByKeyworkdURL}`);
    return this.getProducts(searchProductByKeyworkdURL);
  }

  searchProductListPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {

    const searchURL = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchURL);
  }

  private getProducts(searchProductByKeyworkdURL: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchProductByKeyworkdURL).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(productId: number): Observable<Product> {
    const productByIdURL: string = `${this.baseUrl}/${productId}`;
    console.log(`get product by id = ${productByIdURL}`)
    return this.httpClient.get<Product>(productByIdURL);

  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}