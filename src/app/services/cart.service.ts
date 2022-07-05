import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { tick } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);


  constructor() { }

  addToCart(theCartItem: CartItem) {

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;


    if (this.cartItems.length > 0) {

      //find the item in the cart based on item id
      // for (let tmpCartItem of this.cartItems) {
      //   if (tmpCartItem.id === theCartItem.id) {
      //     existingCartItem = tmpCartItem;
      //     break;
      //   }
      // }

      //find returns the first element matched
      existingCartItem = this.cartItems.find(tmpItem => tmpItem.id === theCartItem.id);
      //check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);


    }

    if (alreadyExistsInCart) {
      //increment the quantity
      existingCartItem.quantity++;
    } else {
      //just add the item to the array
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and totoal quantity
    this.computeCartTotals();
  }

  decrementQuantity(tCItem: CartItem) {
    tCItem.quantity--;
    if (tCItem.quantity === 0) {
      this.remove(tCItem);
    }
    else {
      this.computeCartTotals();
    }
    this.cartItems.find(item => item.id === tCItem.id);
  }
  remove(removeItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(item => removeItem.id === item.id);
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    let tPriceValue: number = 0;
    let tQtyValue: number = 0;

    for (let cCItem of this.cartItems) {
      tPriceValue += cCItem.quantity * cCItem.unitPrice;
      tQtyValue += cCItem.quantity;
    }

    //publish the new values ... all subscribers will receive the new data
    //next method will send/publish the values
    this.totalPrice.next(tPriceValue);
    this.totalQuantity.next(tQtyValue);

    console.log(`TtlPrice: ${tPriceValue.toFixed(2)}, TtlQuantity: ${tQtyValue}`);
  }
}
