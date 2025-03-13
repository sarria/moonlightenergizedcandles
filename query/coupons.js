export default function couponsQuery(couponCode) {
    const Query = `
      query {
        coupons(code: "${couponCode}") {
          code
          message
          quantity
          kind
        }
      }
    `.replace(/\s\s+/g, ' ');

    // console.log('couponsQuery', Query)

    return Query;    
  }
  