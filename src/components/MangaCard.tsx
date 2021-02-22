import { Card, Statistic } from "antd"
import Meta from "antd/lib/card/Meta"

const MangaCard = (props) => {
    return (
        <Card
            actions={[
                <Statistic title="Avarage score" value={props.manga.rating} suffix="/ 5" />,
                <Statistic title="Translated chapters" value={props.manga.chaptersCount} />
            ]}
            hoverable
            style={props.styles.card}
            cover={< img style={props.styles.cardImage} alt={props.manga.title} src={props.manga.coverUrl} />}
        >
            <Meta title={props.manga.title} description={props.manga.genres.join(', ')} />


        </Card>
    )
}

export default MangaCard
