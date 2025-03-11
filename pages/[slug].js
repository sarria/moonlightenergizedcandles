import queryPaths from '../query/paths'
import queryContent from '../query/content'
import NotFound from '../components/404'
import PageContent from '../components/PageContent'

function Page({ global, page}) {
  // console.log("global :: ", global)
  // console.log("Page :: ", page)
  // console.log("Query ::", queryContent('about-us'))
  return page ? <PageContent page={page} global={global} /> : <NotFound page={page} />
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps(context) {
  try {
    const res = await fetch(process.env.GRAPHQL + queryContent(context.params.slug))
    const data = await res.json()

    // Ensure global options are safely retrieved
    const global = data.data?.acfOptionsGlobalOptions?.global || null;

    // Handle page data safely, setting it to null if no valid response
    const page = data.data?.content?.edges?.[0]?.node || data.data?.product?.edges?.[0]?.node || null;

    // If the page is still null, return a 404 (not found)
    if (!page) {
      return {
        notFound: true, // This will trigger a 404 page
      };
    }

    return {
      props: {
        global,
        page,
      },
      revalidate: 30, // Regenerate every 30 seconds
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return {
      notFound: true, // Fail-safe, show 404 if there's an error
    };
  }
}


// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const res = await fetch(process.env.GRAPHQL + queryPaths())
  const data = await res.json()

  // Get the paths we want to pre-render based on data
  // const paths = data.map((post) => ({
  //   params: { id: post.id },
  // }))
  const paths = data.data.pages.edges.map((item) => ({
    params: { slug: item.node.slug },
  })) 

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

export default Page
