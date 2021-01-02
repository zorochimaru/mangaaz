import React, { CSSProperties, useContext, useEffect, useState } from 'react'
import Meta from 'antd/lib/card/Meta';
import './Home.css';
import { Card, Col, Divider, Row, Spin } from 'antd';
import * as db from '../../config/db';
import { Link, RouteComponentProps } from '@reach/router';
import Title from 'antd/lib/typography/Title';
import { Manga } from '../../models/Manga.model';
import { UserContext } from '../../HOC/AuthContext';


const Home: React.FC<RouteComponentProps> = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mangaList, setMangaList] = useState([]);
    const user  = useContext(UserContext);
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
                <Title level={3}>{user.user?.name}</Title>
                <Card



                    cover={<img style={{ width: 100, height: 100, borderRadius: '50%' }} alt={user.user?.name} src={user.user?.img} />}
                >
                </Card>
                <Divider orientation="left"></Divider>

                <Row gutter={16}>

                    {mangaList.map((manga: Manga) => {
                        return (
                            <Col span={6} key={manga._id} >

                                <Link to={'manga-details/' + manga._id}>
                                    <Card

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

