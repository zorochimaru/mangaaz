import { LoadingOutlined } from "@ant-design/icons"
import { LazyImage } from "react-lazy-images"

const PageViewer = (props) => {
    return (
        <LazyImage
            key={props.page.imgId}
            src={props.page.url}
            alt={props.page.imgId}
            observerProps={{
                rootMargin: "100%",
                threshold: 0
            }}
            placeholder={({ ref }) => (
                <div ref={ref} style={{
                    width: '100%',
                    height: '100vh',
                    objectFit: 'contain',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <LoadingOutlined style={{ fontSize: 50 }} spin />
                </div>
            )}
            actual={
                ({ imageProps }) =>
                (
                    <img style={{ width: props.pageWidth, height: props.pageHeight, objectFit: 'contain' }} {...imageProps} />
                )}
        />
    )
}

export default PageViewer
