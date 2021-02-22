import { Link, navigate, RouteComponentProps } from '@reach/router'
import { Button, Col, Divider, Image, notification, Rate, Row, Space, Spin, Statistic } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react'
import { Manga } from '../../models/Manga.model';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import './MangaDetails.css';
import { BSON } from 'realm-web';
import { getDB } from '../../config/db';
import { useUser } from '../../HOC/AuthContext';
import { Chapter } from '../../models/ChapterPage.model';

/*
TODOS 
////////////////////////////////////////////////////////////////
Click on cover image go to last chapter
////////////////////////////////////////////////////////////////
Click on tag go to search page with same tag (Make search page)
*/
const MangaDetails: React.FC<RouteComponentProps | any> = (props) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [manga, setManga] = useState<Manga | null>(null);
    const [mangaRating, setMangaRating] = useState<any>(null);
    const [averageScore, setAverageScore] = useState(0);
    const [currUserRate, setCurrUserRate] = useState(0);
    const [loadingRate, setLoadingRate] = useState(false);
    const { user } = useUser();
    useEffect(() => {
        getDB('manga-library')
            .collection('titles').findOne({ _id: new BSON.ObjectId(props.id) }).then((manga: any) => {
                setIsLoaded(true);
                setManga(manga);
            }).catch(err =>
                setError(err)
            );
        fetchRating();

    }, [])
    function writeAvarageScoreToManga() {
        setLoadingRate(true);
        getDB('rating-library')
            .collection('titles').findOne({ mangaId: new BSON.ObjectId(props.id) }).then((mangaRating: any) => {
                if (mangaRating) {
                    const averageScore = +(mangaRating.data.reduce((prev, curr) => +prev + +curr.rate, 0)
                        / mangaRating.data.length).toFixed(1);
                    getDB('manga-library')
                        ?.collection('titles')
                        .findOneAndUpdate({ _id: new BSON.ObjectId(props.id) }, {
                            $set: { rating: averageScore }
                        }).finally(() => setLoadingRate(false));
                }
            });

    }
    const handleRateChange = (rate) => {
        setLoadingRate(true);
        getDB('rating-library')
            ?.collection('titles')
            .updateOne({
                mangaId: new BSON.ObjectId(props.id),
                "data.personId": user?.id
            }, { $set: { "data.$.rate": rate } })
            .then((res) => {
                if (res.matchedCount === 0) {
                    const newRate = {
                        personId: user?.id,
                        rate: rate
                    }
                    getDB('rating-library')
                        ?.collection('titles').updateOne({ mangaId: new BSON.ObjectId(props.id) }, {
                            $addToSet: { data: newRate }
                        }, { upsert: true }).finally(() => {
                            writeAvarageScoreToManga();
                            fetchRating();
                        });
                } else {
                    writeAvarageScoreToManga();
                    fetchRating();
                }
            }).finally().catch((error) => {
                notification['error']({
                    placement: 'bottomRight',
                    message: error.errorCodeName,
                    description: error.message,
                });
            });
    }
    function fetchRating() {
        getDB('rating-library')
            .collection('titles').findOne({ mangaId: new BSON.ObjectId(props.id) }).then((mangaRating: any) => {
                if (mangaRating) {
                    setMangaRating(mangaRating);
                    const averageScore = (mangaRating.data.reduce((prev, curr) => +prev + +curr.rate, 0)
                        / mangaRating.data.length).toFixed(1);
                    setAverageScore(+averageScore);
                    setCurrUserRate(mangaRating.data.find(el => el.personId === user?.id ? el.rate : 0).rate);
                }
            }).catch(err =>
                setError(err)
            );
    }
    function onReadFirstChapter() {
        getDB('manga-library')
            .collection('chapters').findOne({ mangaId: manga?._id.toHexString() },
                { sort: { number: 1 } }).then((result: Chapter) => {
                    if (result) {
                        navigate(`/manga-reader/${manga?._id.toHexString()}/${result._id.toHexString()}`)
                    }
                });
    }
    function onReadLastChapter() {
        getDB('manga-library')
            .collection('chapters').findOne({ mangaId: manga?._id.toHexString() },
                { sort: { number: -1 } }).then((result: Chapter) => {
                    if (result) {
                        navigate(`/manga-reader/${manga?._id.toHexString()}/${result._id.toHexString()}`)
                    }
                });
    }
    function onContinue() {
        getDB('progress-library')
            .collection('lastReadedChapter')
            .findOne({ mangaId: manga?._id.toHexString(), userId: user?.id }).then((result) => {
                if (result) {
                    navigate(`/manga-reader/${manga?._id.toHexString()}/${result.chapterId}`)
                }
            });
    }
 

    if (!isLoaded) {
        return <div><Spin size="large" /></div>;
    } else {
        return (

            <Row align="top">
                <Col span={4} >
                    <Space direction="vertical">
                        <Image style={styles.cover} src={manga?.coverUrl} alt={manga?.title} />
                        <Button onClick={onReadFirstChapter} type="primary" block>Read First Chapter</Button>
                        <Button onClick={onReadLastChapter} type="primary" block>Read Last Chapter</Button>
                        <Button onClick={onContinue} type="primary" block>Continue Read</Button>
                    </Space>
                    <Divider orientation="left" plain>
                        Rating
                    </Divider>

                    <Rate disabled={loadingRate} value={currUserRate} onChange={handleRateChange} className="rate" />
                    {loadingRate ? <Spin style={{ marginLeft: 10 }} /> : null}
                    <Divider orientation="left" plain>
                        Total score
                    </Divider>

                    <Statistic style={{ marginTop: 10, textAlign: 'center' }} value={averageScore} suffix="/ 5" />


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
        width: '100%',
        cursor: 'pointer',
    }
}
export default MangaDetails
