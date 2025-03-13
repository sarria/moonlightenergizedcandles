export default function couponsQuery(couponCode) {
  const Query = `
    mutation {
      useCoupon(input: {code: "${couponCode}"}) {
        success
        message
        remainingQuantity
      }
    }    
  `.replace(/\s\s+/g, ' ');

  // console.log('couponsQuery:\n', Query)

  return Query;    
}

