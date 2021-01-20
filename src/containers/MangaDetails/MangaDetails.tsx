import { Link, RouteComponentProps } from '@reach/router'
import { Button, Col, Divider, Rate, Row, Space, Spin } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react'
import * as db from '../../config/db';
import { Manga } from '../../models/Manga.model';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import './MangaDetails.css';
import { BSON } from 'realm-web';

/*
TODOS 
////////////////////////////////////////////////////////////////
Click on 'Read now' button go to first chapter
Click on cover image go to last chapter
////////////////////////////////////////////////////////////////
Click on tag go to search page with same tag (Make search page)
Make rating sistem
Make comments section
*/
const MangaDetails: React.FC<RouteComponentProps | any> = (props) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [manga, setManga] = useState<Manga | null>(null);

    useEffect(() => {
        db.getDB('manga-library')
            .collection('titles').findOne({ _id: new BSON.ObjectId(props.id) }).then((manga: any) => {
                setIsLoaded(true);
                setManga(manga)
            }).catch(err =>
                setError(err)
            )
    }, [props])
    if (error) {
        return <div>Ошибка: {error}</div>;
    } else if (!isLoaded) {
        return <div><Spin size="large" /></div>;
    } else {
        return (

            <Row align="top">
                <Col span={4} >
                    <Space direction="vertical">
                        <img style={styles.cover} src={manga?.coverUrl} alt={manga?.title} />
                        <Link to={'/reader/' + manga?._id}>  <Button type="primary" block>  Read Now</Button></Link>
                    </Space>
                    <Divider orientation="left" plain>
                        Rating
                    </Divider>
                    <Rate className="rate" />

                </Col>
                <Col span={18} offset={1}>
                    <Title level={3}>{manga?.title}</Title>
                    <Title level={5}>Author: {manga?.author}</Title>
                    <Space direction="vertical">
                        <Text code>{manga?.genres.join(', ')}</Text>
                        <Text>{manga?.description}</Text>
                    </Space>
                </Col>
            </Row >
        )
    }
}
const styles: { [key: string]: CSSProperties } = {
    cover: {
        width: '100%'
    }
}
export default MangaDetails
