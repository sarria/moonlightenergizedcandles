import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { CartProvider, useCart } from '../context/CartContext';
import styles from './pageContent.module.scss'
import cx from 'classnames'
import Header from './Header'
import Footer from './Footer'
// import Logo from './Logo'
// import Navigation from './Navigation'
import Hero from './Hero'
import Text from './Text'
import Headline from './Headline'
import Video from './Video'
// import Thumbnails from './Thumbnails'
import Bios from './Bios'
// import Carousel from './Carousel'
// import Burger from './Burger'
import Events from './Events'
import Article from './Article'
import Images from './Images'
// import Quotes from './Quotes'
// import ImageSlider from './ImageSlider'
import Contact from './Contact'
// import ContactUs from './ContactUs'
import Shop from './Shop'
import Cart from './Cart';
import Checkout from './Checkout'
import PageTop from './PageTop'
import ShopNav from './ShopNav'
import ProductPage from './ProductPage'
// import ShippingForm from './ShippingForm'

function PageContent({ page, global }) {
	return page ? (
		<CartProvider> {/* Move this wrapper up */}
			<PageContentWithCart page={page} global={global} />
		</CartProvider>
	) : <></>;
}

function PageContentWithCart({page, global}) {
	const router = useRouter()
	const { getTotalItems, isCartVisible, setSlug } = useCart()
	const totalItems = getTotalItems()
	// console.log("page ::", page)

	setSlug(page.slug);

	useEffect(() => {
		// ALL THIS JUST TO BE ABLE TO JUMP TO A HASH IN A PAGE. WOW
		const handleRouteChange = (url, { shallow }) => {
			// console.log(
			// 	`Page changed to ${url} ${
			// 		shallow ? 'with' : 'without'
			// 	} shallow routing`
			// )
		  	if (location.hash) {
				// location = location
				const hash = location.hash.substring(1).replaceAll('%20', ' ')
				const ele = document.getElementById(hash)
				if (ele) window.scrollTo(0, ele.offsetTop + 350)
			}		  
		}
	
		router.events.on('routeChangeComplete', handleRouteChange)
	
		// If the component is unmounted, unsubscribe
		// from the event with the `off` method:
		return () => {
		  router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [])	

	const isHomePage = page.slug === 'home-page';
	const isCheckout = page.slug === 'checkout';
	const showCart = totalItems !== 0 && isCartVisible;

	return page ? (
		<>
			<Header seo={{
				title : (page.title || global.title) +  ' | ' + (page.seoTitle ?page.seoTitle : global.title),
				description : page.seoDescription || global.description,
				image : page.image || global.logo
			}} />
			<PageTop className={styles.pageTop} global={global} />

			<div className={cx(styles.root, {[styles.homePage]: isHomePage}, {[styles.innerPage]: !isHomePage})} id='pageContent'>
				<div className={cx(styles.wrapper, {[styles.showCart] : showCart && !isCheckout })}>
					<div className={styles.page}>
						<div className={styles.content}>

							{page.content_blocks && page.content_blocks.modules && page.content_blocks.modules.map((module, idx) => {
								let ele = null; //<>{module.moduleType}</>
								let prevModuleType = idx > 0 ? page.content_blocks.modules[idx-1].moduleType : '';
								let nextModuleType = idx < page.content_blocks.modules.length-1 ? page.content_blocks.modules[idx+1].moduleType : '';

								// console.log("module.moduleType", module.moduleType)
								
								switch(module.moduleType) {
									case 'hero':
										ele = <Hero data={module} shoppingPage={global.shoppingPage} />
										break;							
									case 'text':
										ele = <Text data={module} />
										break;
									case 'headline':
										ele = <Headline data={module} />
										break;
									case 'video':
										ele = <Video data={module} />
										break;
									case 'thumbnails':
										// ele = <Thumbnails data={module} />
										break;
									case 'bios':
										ele = <Bios data={module} />
										break;
									case 'events':
										ele = <Events data={module} />
										break;
									case 'article':
										ele = <Article data={module} />
										break;
									case 'images':
										ele = <Images data={{...module, prevModuleType, nextModuleType}} />
										break;
									case 'quotes':
										// ele = <Quotes data={module} />
										break;
									case 'slider':
										// ele = <ImageSlider data={module} />
										break;
									case 'contact':
										// ele = <Contact data={module} />
										break;
									case 'contactUs':
										ele = <Contact data={module} />
										break;
									case 'shop':
										ele = <Shop data={module} global={global} />
										break;
									case 'shopNav':
										ele = <ShopNav global={global} showCart={showCart} />
										break;
									default:
										// code block
								}
						
								return (
									<div key={idx} className={cx({[styles.grayBg]:module.grayBackground})}>
										{ele}
									</div>
								)
							})}
							{page.__typename === "Product" && 
								<>
									<ShopNav global={global} showCart={showCart} />
									<ProductPage global={global} product={page}/>
								</>
							}
							{isCheckout && 
								<>
									<Checkout />
								</>
							}
						</div>
						<Footer 
							global={global} buttons={page.buttons}
						/>
					</div>
					{showCart && !isCheckout && 
					<div className={styles.cart}>
						<Cart />
					</div>}
					{/* {isCheckout && 
					<div className={styles.cart}>
						<ShippingForm />
					</div>} */}
				</div>
				
			</div>	
		
		</>
	) : <></>
}

export default PageContent