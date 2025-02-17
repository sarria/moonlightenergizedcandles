import queryContent from '../query/content'
import NotFound from '../components/404'
import PageContent from '../components/PageContent'

// https://reactjsexample.com/minimal-carousel-component-for-react/

function Index({ global, page }) {
  // console.log("Query ::", queryContent('home-page'))
  return page ? <PageContent page={page} global={global} /> : <NotFound page={page} />
  // return <PageContent page={page} global={global} />
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
	const res = await fetch(process.env.GRAPHQL + queryContent('home-page'))
	const data = await res.json()
	const global = data.data?.acfOptionsGlobalOptions?.global || null
  const page = data.data?.content?.edges[0]?.node || null

  return {
    props: {
      global,
      page
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}


export default Index
