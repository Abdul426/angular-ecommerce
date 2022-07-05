import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShipFormService } from 'src/app/services/luv2-ship-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQty: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  billingAddressStates: State[] = [];
  shippingAddressStates: State[] = [];


  constructor(private cartService: CartService, private formBuilder: FormBuilder, private luv2ShopFormService: Luv2ShipFormService) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: new FormControl('', [Validators.required]),
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    //populate credit card months and years
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved CC months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved CC Years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    //Populate contries

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retried countries: " + JSON.stringify(data));
        this.countries = data;

      }
    )
  }
  
  reviewCartDetails() {
    const mName = "reviewCartDetails";
    console.log(`Entering ${mName}`);

    //subscribe to cartService.totalQty and price
    this.cartService.totalQuantity.subscribe(
      tQty => this.totalQty = tQty
    );

    this.cartService.totalPrice.subscribe(
      ttlPrice => this.totalPrice = ttlPrice
    );
    
  }

  handleMonthsAndYears() {
    console.log("in handleccmonthsyear");

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    console.log(`selectedYear: ${selectedYear}`);

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Received data:" + JSON.stringify(data));

        this.creditCardMonths = data;
      }
    )

  }

  onSubmit() {
    console.log("Handling the sbumit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("EMail: " + this.checkoutFormGroup.get('customer').value.email);

    console.log("The Shipping Add: " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The Shipping Add: " + this.checkoutFormGroup.get('shippingAddress').value.state.name);


  }


  //Was getting some error on billing address 
  //added "noPropertyAccessFromIndexSignature": false, in compiler options tsconfign
  copyShippingAddToBillingAdd(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value)

      //Bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      //Bug fix for states
      this.billingAddressStates = [];
    }
  }

  getStates(formGroupName: string) {
    const mName = 'In getStates';
    console.log(`${mName} shippingAddress: ${this.checkoutFormGroup.get('shippingAddress').value.country}`);

    const formGrp = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGrp.value.country.code;
    const countryName = formGrp.value.country.name;

    console.log(`${mName} ${formGroupName} country: ${countryCode}`);
    console.log(`${mName} ${formGroupName} country: ${countryName}`);


    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          console.log("Going to populate stats in billingaddress");

          this.billingAddressStates = data;
        }

        //Select first state as default
        formGrp.get('state').setValue(data[0]);

      }
    )

  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }


}
