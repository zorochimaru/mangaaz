import { Link, RouteComponentProps } from "@reach/router";
import { Col, Divider, notification, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { CSSProperties, useEffect, useState } from "react"
import MangaCard from "../../components/MangaCard";
import { getDB } from "../../config/db";
import { Manga } from "../../models/Manga.model";

const MostRaited: React.FC<RouteComponentProps> = () => {
    const [mangaList, setMangaList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDB('manga-library')
            .collection('titles').find({}, { limit: 10, sort: { rating: -1 } }).then((mangaList: any[]) => {
                setMangaList(mangaList);
            }).finally(() => setLoading(false)).catch(err =>
                notification['error']({
                    placement: 'bottomRight',
                    message: err.errorCodeName,
                    description: err.message,
                })
            )
        return () => {

        }
    }, [])
    if (loading) {
        return <div><Spin size="large" /></div>;
    } else {
        return (
            <div>
                <Title level={2}>Ən çox qiymətləndirilib</Title>
                <Divider orientation="left"></Divider>

                <Row gutter={16}>

                    {mangaList.map((manga: Manga) => {
                        return (
                            <Col span={6} key={manga._id.toHexString()} >

                                <Link to={'/manga-details/' + manga._id.toHexString()}>
                                    <MangaCard styles={styles} manga={manga} />
                                </Link>


                            </Col>
                        )
                    })}

                </Row>
            </div>
        )
    }
}
const styles: { [key: string]: CSSProperties } = {
    card: {
        width: 240,
        height: 450,
    },
    cardImage: {
        height: 350,
        objectFit: 'cover'
    }
}
export default MostRaited
