import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;


  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();

  }
  listCartDetails() {
    //get a handle to cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart total price and quty
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
    //compute car totoal price and quantity
    this.cartService.computeCartTotals();
  }

  incrementQty(tcartItem: CartItem) {
    this.cartService.addToCart(tcartItem);
  }

  decrementQty(tCItem: CartItem) {
    this.cartService.decrementQuantity(tCItem);
  }

  remove(cItem: CartItem){
    this.cartService.remove(cItem);
  }
}
