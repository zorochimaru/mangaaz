import React, { CSSProperties, useContext, useEffect, useState } from 'react'
import { Col, Divider, notification, Row, Spin } from 'antd';
import * as db from '../../config/db';
import { Link, RouteComponentProps } from '@reach/router';
import Title from 'antd/lib/typography/Title';
import { Manga } from '../../models/Manga.model';
import { UserContext } from '../../HOC/AuthContext';
import MangaCard from '../../components/MangaCard';
/*
TODOS
////////////////////////////////
Sort by updated chapters
////////////////////////////////
Make 'hot' sign
*/

const Home: React.FC<RouteComponentProps> = () => {
    const [loading, setLoading] = useState(true);
    const [mangaList, setMangaList] = useState<any[]>([]);
    const { user } = useContext(UserContext);
    useEffect(() => {
        if (user) {
            db.getDB('manga-library')
                .collection('titles').find({}, { limit: 4, sort: {lastUpdDate: -1} }).then((mangaList: any[]) => {
                    setMangaList(mangaList);
                }).finally(() => setLoading(false)).catch(err =>
                    notification['error']({
                        placement: 'bottomRight',
                        message: err.errorCodeName,
                        description: err.message,
                    })
                )
        }
    }, [user])


    if (loading) {
        return <div><Spin size="large" /></div>;
    } else {
        return (
            <>
                <Title level={2}>Son yenilənmə</Title>
                <Divider orientation="left"></Divider>

                <Row gutter={16}>

                    {mangaList.map((manga: Manga) => {
                        return (
                            <Col span={6} key={manga._id.toHexString()} >

                                <Link to={'manga-details/' + manga._id.toHexString()}>
                                    <MangaCard styles={styles} manga={manga} />
                                </Link>


                            </Col>
                        )
                    })}

                </Row>
            </>
        );
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
export default Home

