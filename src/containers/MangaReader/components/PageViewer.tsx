import { LoadingOutlined } from "@ant-design/icons"
import { LazyImage } from "react-lazy-images"
import TrackVisibility from "react-on-screen"
import { usePage } from "../../../HOC/PageContext";

const PageViewer = (props) => {
    const ComponentToTrack = (props: any) => {
        const { setPage } = usePage();
        if (props?.isVisible) {
            setPage(props?.imageProps.page);
        }
        const style = {
            width: props.imageProps.pageWidth,
            height: props.imageProps.pageHeight,
            objectFit: 'contain'
        };
        return <img style={style} {...props.imageProps.imageProps} />
    }
    return (

        <LazyImage
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
                (<TrackVisibility offset={300}>
                    <ComponentToTrack imageProps={{ ...props, imageProps }} />
                </TrackVisibility>
                )}
        />

    )
}

export default PageViewer
