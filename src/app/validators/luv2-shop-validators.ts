import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    //whilespace validation
    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        console.log("In Luv2ShopValidators:notOnlyWhitespace");

        //check if string only has white space
        if ((control.value != null) && (control.value.trim().lenght === 0)) {
            console.log("In Luv2ShopValidators:notOnlyWhitespace, len = 0");
            //invalid, return err obj
            return { 'notOnlyWhitespace': true }
        } else {
            return null;
        }


    }
}
