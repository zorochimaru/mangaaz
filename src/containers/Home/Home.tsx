import React, { CSSProperties, useEffect, useState } from 'react'
import Meta from 'antd/lib/card/Meta';
import './Home.css';
import { Anchor, Card, Col, Divider, Row, Spin } from 'antd';
import * as db from '../../config/db';
import { Link, RouteComponentProps } from '@reach/router';
import Title from 'antd/lib/typography/Title';
import { Manga } from '../../models/Manga.model';


const Home: React.FC<RouteComponentProps> = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mangaList, setMangaList] = useState([]);

    useEffect(() => {
        db.getDB('manga-library')
            .collection('titles').find({}).asArray().then((mangaList: any) => {
                setIsLoaded(true);
                setMangaList(mangaList)
            }).catch(err =>
                setError(err)
            )
    }, [])

    if (error) {
        return <div>Ошибка: {error}</div>;
    } else if (!isLoaded) {
        return <div><Spin size="large" /></div>;
    } else {
        return (
            <>
                <Title level={2}>Last updated</Title>
                <Divider orientation="left"></Divider>
                <Row gutter={16}>

                    {mangaList.map((manga: Manga) => {
                        return (
                            <Col span={6} >

                                <Link to={'manga-details/' + manga._id}>
                                    <Card
                                        key={manga._id}
                                        hoverable
                                        style={styles.card}
                                        cover={<img style={styles.cardImage} alt={manga.title} src={manga.coverUrl} />}
                                    >
                                        <Meta title={manga.title} description={manga.genre.join(', ')} />
                                    </Card>
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

