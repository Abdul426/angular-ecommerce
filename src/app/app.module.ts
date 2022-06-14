import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';


/*
Order of routes is important. First match wins. 
Start from most specific to generic

Implementing Routes in Angular App
  1. Define routes
  2. Configure Router based on our routes - RouterModule.forRoot(routes)
  3. Define the Router Outlet - update app.component.html
  4. Set up Router Links to pass category id param - 
  5. Enhance ProductListComponent to read category id param - 
  6. Modify Spring Boot app - REST Repository needs new method
  7. Update Angular Service to call new URL on Spring Boot app - 
*/
const routes: Routes = [
  { path: 'category/:id/:name', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }

//providers has ProductService so it will allows us to inject service into other parts of our app
