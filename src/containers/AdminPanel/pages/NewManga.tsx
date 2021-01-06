import { RouteComponentProps } from "@reach/router"
import Title from "antd/lib/typography/Title"

const NewManga: React.FC<RouteComponentProps | any> = () => {
    return (
        <div>
            <Title level={1}>New Manga</Title>
        </div>
    )
}

export default NewManga
