export default {
    getCart() {
        return $.get('/api/storefront/carts');
    },
    newCart(items){
        return $.ajax({
            method: "POST",
            credentials: "same-origin",
            url: "/api/storefront/carts",
            data: JSON.stringify(items),
            headers: {
                "Content-Type": "application/json"}
            })
    },
    addToCart(items, cartId){
        var url = "/api/storefront/carts/"+cartId+"/items";
        return $.ajax({
            method: "POST",
            credentials: "same-origin",
            url: url,
            data: JSON.stringify(items),
            headers: {
                "Content-Type": "application/json"}
            })
    },
    easyAddToCart(items){
      return this.getCart()
          .then((cartArray)=>{
              if(cartArray.length > 0){
                  return this.addToCart(items, cartArray[0].id);
              } else {
                  return this.newCart(items);
              }
          })
    }
}
